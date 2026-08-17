---
description: >-
  Signer-key grants and revocations for operators running signer infrastructure
  on behalf of stakers.
---

# Signers

Most integrators don't run a signer — they let their users pick one from the [whitelisted signer list](../../glossary.md#whitelisted-signer-list) and route through it. This page is for the other side: signer-key holders and signer-manager operators who bind those two on-chain so stakers can use them.

If you're building a wallet, an institutional partner UI, or a pool that simply _selects_ a signer, you can skip this page. The flows on [Paired BTC](../paired-btc.md), [Solo STX](../solo-stx.md), and [Pools](../pools.md) only need the signer's address — the grant below has already been recorded by whoever operates the signer.

All examples use `@stacks/bitcoin-staking` for the PoX-5 surface and `@stacks/transactions` for signing and broadcast.

### Signers are first-class entities

In PoX-5 a signer is no longer a `{ btcRewardAddress, signerKey }` tuple in a reward set — it is a **signer-manager contract**, identified in all contract state by its principal (the contract address) with one associated signer key. Every staker, whether STX-only or a bond participant, delegates to a signer-manager; there is no separate "solo" signer set. The pox-5 contract hooks into the manager during staking actions (`validate-stake!`) so the manager owns all approval logic — replacing PoX-4's per-transaction signer signatures that scoped each call by amount, period, and pox-addr.

Most signers do not need to write a contract. A **default signer-manager** implementation is provided that covers the common case: it accepts delegations, registers the signer key once, and handles reward accounting and onward distribution. Operators with custom needs (fee-taking, allowlisting members, auto-bridging sBTC rewards to L1) extend or replace it; because the manager is immutable once deployed, stakers can rely on its reward logic not changing under them.

#### Where rewards land

The pox-5 contract never _pushes_ rewards to stakers. It accrues sBTC and accounts for what is claimable, then `claim-rewards` transfers a signer's accumulated sBTC to the **signer-manager** (see [Rewards](../rewards.md)). From there the signer-manager distributes to its stakers — and, if a staker elected a BTC reward address, the manager is what triggers the sBTC→L1 withdrawal. That election lives in the signer-manager layer (passed via `signer-calldata`), not in `register-for-bond`, which carries no `pox-addr` argument.

#### Electing an L1 BTC payout via signer calldata

For the default signer-manager, the election is a serialized Clarity tuple `{ pox-addr, max-fee }` — the destination Bitcoin address plus the maximum sBTC fee (in sats) the staker tolerates on the sBTC→L1 withdrawal. `buildSignerCalldata` encodes it from a `SignerCalldataL1Payout` (`poxAddress` as an address string or a parsed `BtcAddressRepr`, plus `maxFeeSats`), and `parseSignerCalldata` is the inverse. `BtcAddress.parse` / `BtcAddress.stringify` convert between address strings and the PoX `{ version, data }` representation (P2PKH/P2SH/P2WPKH/P2WSH/P2TR).

```ts
import { BtcAddress, buildSignerCalldata, parseSignerCalldata } from '@stacks/bitcoin-staking';

// Elect a native BTC payout; omitting `signerCalldata` keeps the sBTC default.
const signerCalldata = buildSignerCalldata({
  poxAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', // or a parsed BtcAddressRepr
  maxFeeSats: 1_000n,
});
// Pass `signerCalldata` alongside the staking action, e.g.
// buildStake({ ...args, signerCalldata }).

// Decode a blob back into its parts:
const { poxAddress, maxFeeSats } = parseSignerCalldata(signerCalldata);
BtcAddress.stringify(poxAddress, network); // 'bc1q...'
```

A custom signer-manager may define its own calldata schema — these helpers mirror the tuple the default `signer-manager.validate-stake!` expects.

### SIP-018 grant message

The on-chain `get-signer-grant-message-hash` ([pox-5.clar:2865](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2865)) hashes a deliberately slim tuple under a domain pinned to `pox-5`:

```
message: { topic: "grant-authorization",
           signer-manager: <principal>,
           auth-id:        <uint> }

domain:  { name: "pox-5-signer", version: "1.0.0", chain-id: <uint> }
```

The grant binds a `signer-key` to a `signer-manager` _and nothing else_ — it carries **no** `max-amount`, `period`, `reward-cycle`, or `pox-addr`. This is the explicit contrast with PoX-4's per-transaction signer signatures: those scoped each individual stack/extend call by amount and period, whereas a pox-5 grant is a one-shot authorization that the signer-manager contract uses for every staker routed through it.

`@stacks/bitcoin-staking` exposes the message builder, hasher, signer, and verifier as pure functions (`buildSignerGrantMessage`, `computeSignerGrantHash`, `signSignerGrant`, `verifySignerGrant`).

### Grant a signer-manager permission to use a signer key

Before a staker can route through a [signer-manager](../../glossary.md#stacks-signer), the signer-key holder must sign a SIP-018 grant binding that key to the manager. The grant is recorded on-chain by the signer-manager contract itself: `grant-signer-key` requires `contract-caller == signer-manager`, so the signer-manager submits the call carrying the signer-key holder's off-chain SIP-018 signature.

```ts
import {
  buildGrantSignerKey,
  fetchEligibleGrantSignerKey,
  signSignerGrant,
} from '@stacks/bitcoin-staking';
import { broadcastTransaction, fetchNonce, signTransaction } from '@stacks/transactions';

const network = 'mainnet';
const signerManager = 'SP000…USER.signer-manager';
const authId = 1n;
const chainId = 1; // STACKS_MAINNET.chainId

// Off-chain: signer-key holder signs (signerManager, authId) under the
// pox-5-signer SIP-018 domain.
const signerSignature = signSignerGrant({
  signerManager,
  authId,
  chainId,
  privateKey: signer.privateKey,
});

// Preflight: replay guard is clear and the signature recovers to `signerKey`.
// (It cannot check the `contract-caller == signer-manager` gate — that depends
// on how the tx is submitted.)
const eligible = await fetchEligibleGrantSignerKey({
  signerKey: signer.publicKey,
  signerManager,
  authId,
  signerSignature,
  network,
});
if (!eligible.ok) throw new Error('grant-signer-key would fail: u' + eligible.reasons.join(', u'));

const tx = await buildGrantSignerKey({
  signerKey: signer.publicKey,
  signerManager,
  authId,
  signerSignature,
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});

await broadcastTransaction({
  transaction: signTransaction(tx, user.stxPrivateKey),
  network,
});
```

After this lands, the signer-manager contract is expected to call `pox-5::register-signer` internally to bind itself. **`register-signer` (**[**pox-5.clar:946**](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L946)**) requires `contract-caller == signer-manager`** — it can only be invoked by the signer-manager contract itself, never forwarded through an intermediary contract or sent by an EOA on the signer-manager's behalf. Calling it from any other principal aborts with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)`.

#### Verify a grant before submitting

Four complementary helpers let you sanity-check a grant: two cross-check that the SIP-018 hash you've produced locally matches what the contract will hash, and the other two read on-chain grant state — whether the pair currently has an active grant, and whether a specific `(signerKey, signerManager, authId)` triple has already been consumed:

```ts
import {
  computeSignerGrantHash,
  fetchSignerGrantMessageHash,
  fetchSignerKeyGrantUsed,
  fetchVerifySignerKeyGrant,
} from '@stacks/bitcoin-staking';
import { bytesToHex } from '@stacks/common';

const network = 'mainnet';
const signerManager = 'SP000…USER.signer-manager';
const authId = 1n;
const chainId = 1; // STACKS_MAINNET.chainId

// 1. Off-chain hash (pure, no RPC).
const localHash = computeSignerGrantHash({ signerManager, authId, chainId });

// 2. On-chain hash via the read-only — a lowercase hex string, so
// hex-encode `localHash` (a Uint8Array) before comparing.
const onChainHash = await fetchSignerGrantMessageHash({ signerManager, authId, network });
const matches = bytesToHex(localHash) === onChainHash; // true

// 3. Check whether `(signer-key, signer-manager)` already has an active grant.
const isGranted = await fetchVerifySignerKeyGrant({
  signerKey: signer.publicKey,
  signerManager,
  network,
});

// 4. Replay guard: has this exact `(signer-key, signer-manager, auth-id)`
// triple been consumed by a previous `grant-signer-key`? If `true`, pick a
// fresh `authId` and re-sign — resubmitting aborts with ERR_SIGNER_KEY_GRANT_USED.
const used = await fetchSignerKeyGrantUsed({
  signerKey: signer.publicKey,
  signerManager,
  authId,
  network,
});
```

### Revoke a signer-key grant

Counterpart to the grant above. Removes the on-chain binding between a signer key and a signer-manager. Must be sent directly by the Stacks principal derived from the signer key — `contract-caller` is the authorization, so the call cannot be forwarded through an intermediary contract and no SIP-018 message is needed.

`revoke-signer-grant` ([pox-5.clar:2824](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2824)) takes **both** `signer-manager` and `signer-key` (in that order on-chain), so the SDK's `buildRevokeSignerGrant` mirrors that and requires both fields:

```ts
import { buildRevokeSignerGrant, fetchEligibleRevokeSignerGrant } from '@stacks/bitcoin-staking';

// Preflight: the sender must be the Stacks principal derived from `signerKey`.
// (Revoking a missing grant is a no-op, not a revert.)
const eligible = await fetchEligibleRevokeSignerGrant({
  signerKey: signer.publicKey,
  caller: signer.stxAddress,
  network,
});
if (!eligible.ok) throw new Error('revoke-signer-grant would fail: u' + eligible.reasons.join(', u'));

const tx = await buildRevokeSignerGrant({
  signerManager: 'SP000…USER.signer-manager',
  signerKey: signer.publicKey,
  publicKey: signer.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: signer.stxAddress, network }),
  network,
});

await broadcastTransaction({
  transaction: signTransaction(tx, signer.stxPrivateKey),
  network,
});
```

After this lands, any `stake`, `stake-update`, `register-for-bond`, or `update-bond-registration` call routed through the revoked manager fails until a fresh grant is recorded — every entrypoint that touches a signer checks the grant via `verify-signer-key-grant`.

### Signer set reads

A few read-only helpers cover signer state without any transaction. `fetchSignerInfo` returns the signer key registered for a manager (or `undefined` before `register-signer` has run), `fetchSignerSetContainsForCycle` is a membership check, and the cycle's signer set is an on-chain doubly linked list you can traverse with `fetchSignerSetFirstItem` / `fetchSignerSetLastItem` (list ends), `fetchSignerSetNextItem` / `fetchSignerSetPrevItem` (neighbours), or `fetchSignerSetItem` (the `{ prev, next }` node in one call):

```ts
import {
  fetchSignerInfo,
  fetchSignerSetContainsForCycle,
  fetchSignerSetFirstItem,
  fetchSignerSetNextItem,
} from '@stacks/bitcoin-staking';

// Registered signer key for a manager: { signerKey } | undefined.
const info = await fetchSignerInfo({ signerManager, network });

// Membership check for one cycle.
const isMember = await fetchSignerSetContainsForCycle({ signer: signerManager, cycle, network });

// Walk the full signer set for a cycle.
const signers: string[] = [];
let cursor = await fetchSignerSetFirstItem({ cycle, network });
while (cursor) {
  signers.push(cursor);
  cursor = await fetchSignerSetNextItem({ signer: cursor, cycle, network });
}
```

### Error codes

The grant/revoke flow surfaces these errors (pox-5.clar constants):

* `ERR_SIGNER_KEY_GRANT_USED (u12)` — replay protection; the tuple `(signer-key, signer-manager, auth-id)` has already been used. Pick a fresh `authId` and re-sign.
* `ERR_INVALID_SIGNATURE_RECOVER (u13)` — the contract could not recover a public key from the 65-byte RSV signature. Usually a malformed or truncated signature.
* `ERR_INVALID_SIGNATURE_PUBKEY (u14)` — recovery succeeded but the recovered pubkey does not equal the `signer-key` argument. The signature was made by the wrong key, or `signer-key` was swapped before submission.
* `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)` — raised by `verify-signer-key-grant` when `stake`, `stake-update`, `register-for-bond`, `update-bond-registration`, or `register-signer` runs against a `(signer-manager, signer-key)` pair with no active grant. `revoke-signer-grant` itself never raises it — revoking a nonexistent grant simply returns `existed: false`; a caller whose principal doesn't match the `signer-key` hash160 fails with `ERR_UNAUTHORIZED` instead.
* `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)` — `register-signer` or `grant-signer-key` invoked with `contract-caller != signer-manager`. See above.
