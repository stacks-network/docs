# Early Exit

An L1-locked bond participant can spend their BTC before the timelock expires. This is the [early exit](../../glossary.md#early-exit) path. It [forfeits the remaining BTC yield](../../glossary.md#forfeiture-early-exit), and the paired STX stays locked through the normal bond period.

An early exit has two parts:

1. **A Stacks transaction** (`announce-l1-early-exit`) that tells the contract the position exits. Only the staker can send it.
2. **A Bitcoin transaction** that spends the lockup UTXO through the script's early-exit branch. Two signatures are required: the staker's own signature, and a co-signature from the [early-exit signing service](../../glossary.md#early-exit-signer-set-1-of-n).

The announcement comes first: the co-signer only signs after it finds the staker's announce transaction on Stacks. The position also stops earning once the announcement lands. Co-signing is only needed **before** the timelock height; after the CLTV height the staker reclaims alone through the normal path. This page covers signing and co-signing only. How the co-signer key is provisioned is internal to the service.

The TypeScript snippets below are illustrative. The flow needs no SDK: it is a standard HTTP call plus standard Bitcoin transaction signing, in any language. The canonical lock-script construction is the contract's [`construct-lockup-script`](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711); `buildLockScript` in `@stacks/bitcoin-staking` is its TypeScript equivalent.

### What both parties sign

The early-exit spend is a single-input P2WSH transaction: it spends the lockup UTXO and sweeps the value, minus fee, to an address of the staker's choice. Both parties sign the **same** BIP-143 sighash (`SIGHASH_ALL`) over input 0, the lockup witness script, and the UTXO amount. Because `SIGHASH_ALL` commits to the outputs, any change to the destination or fee after signing invalidates both signatures.

The finished witness carries, in order: the staker's signature, the co-signer's signature, the staker's 32-byte commitment preimage, an empty element that selects the early-exit branch, and the witness script. The SDK assembles this for you.

### Step 1: announce the exit on Stacks

The announcement must land before the co-signer will sign the Bitcoin spend. The staker announces the early exit with `announce-l1-early-exit`. The call must come from the staker directly — not through another contract — and names the staker's current signer manager. The contract then removes the position's remaining reward shares; the locked STX stays locked until the bond's normal end. The call is rejected during the prepare phase, and a position can announce only once.

```ts
import { buildAnnounceL1EarlyExit, fetchEligibleAnnounceL1EarlyExit, fetchHasAnnouncedL1EarlyExit } from '@stacks/bitcoin-staking';

// Preflight: confirms the position is L1-locked, not yet announced, and outside the prepare phase.
const eligible = await fetchEligibleAnnounceL1EarlyExit({ bondIndex, address: staker, network });

const tx = await buildAnnounceL1EarlyExit({
  bondIndex,
  signerManager, // the staker's currently-recorded signer manager
  network,
});

// Later, from any reader:
const announced = await fetchHasAnnouncedL1EarlyExit({ bondIndex, address: staker, network });
```

Use the eligible helper before you broadcast; it surfaces the same conditions the contract checks.

### Step 2: build and sign the Bitcoin spend

With the announcement confirmed, rebuild the witness script from the same inputs used at registration. The script must match the on-chain P2WSH output exactly, or no signature will be valid.

```ts
import {
  buildLockScript,
  buildReclaim,
  computeReclaimSighash,
  signReclaim,
} from '@stacks/bitcoin-staking';

// 1. Build the unsigned early-exit spend over the funded lockup UTXO.
const tx = buildReclaim({
  path: 'early-exit',
  network,
  lockScript, // rebuilt via buildLockScript / buildRegisterMetadata
  utxo,       // { txid, vout, value }
  output: { toAddress, feeSats },
});

// 2. Compute the shared sighash (needed for the co-signer step in both options).
const sighash = computeReclaimSighash(tx);

// 3a. Option A — sign with a key you hold in-process:
const stakerSig = signReclaim(sighash, stakerPrivateKey);
```

```ts
// 3b. Option B — hand the transaction to a hardware or browser wallet as a PSBT.
//     Wallets do not sign a bare digest; buildReclaim makes the PSBT complete.
import * as btc from '@scure/btc-signer';

const psbt = tx.toPSBT();
const signedPsbt = await wallet.signPsbt(psbt); // your wallet integration
const signedTx = btc.Transaction.fromPSBT(signedPsbt);
// The staker's partial signature is now on input 0; continue with the same
// co-signer request and finalizeReclaim call on signedTx.
```

### Step 3: request the co-signature

The early-exit signing service co-signs over HTTP. Send it the unsigned transaction and the prevout data; it computes the sighash independently, signs with the co-signer key, and echoes back what it signed.

`POST {signerBaseUrl}/sign` — the current base URL is `https://r25rniyw12.execute-api.eu-west-1.amazonaws.com/api/v1` (read it from configuration, do not hardcode it).

```json
{
  "tx": "<unsigned spend tx, hex>",
  "input_index": 0,
  "sighash_type": "01",
  "bip32_derivation": "m/48'/1'/0'/2'/0/0",
  "prevout": {
    "script_pub_key": "<P2WSH scriptPubKey of the lockup output, hex>",
    "value": 50000
  },
  "witness_script": "<the lockup witness script, hex>"
}
```

Response:

```json
{
  "signature": "<DER, low-S, no sighash byte>",
  "sighash": "<the 32-byte digest the service signed, hex>",
  "public_key": "<33-byte compressed pubkey used, hex>",
  "sighash_type": "01"
}
```

Append the sighash-type byte (`0x01`) to the returned DER signature before you use it as the co-signer signature.

Two notes on the request fields:

* `bip32_derivation` selects the co-signer key on the service side. It is fixed per bond, it is not designed to rotate, and it has nothing to do with the staker's wallet. Pass the value as given — to your user this parameter is invisible.
* The service computes its own sighash from `tx`, `prevout`, and `witness_script`, and echoes it back with the key it used.

### Step 4: finalize and broadcast

```ts
import { finalizeReclaim } from '@stacks/bitcoin-staking';

// The service returns the DER signature without the sighash-type byte.
// A Bitcoin witness signature must end with it, so append SIGHASH_ALL (0x01).
const cosignerSig = concatBytes(hexToBytes(response.signature), new Uint8Array([0x01]));

// Attach both partial signatures and finalize the early-exit witness.
tx.updateInput(0, {
  partialSig: [
    [stakerBtcPubkey, stakerSig],
    [hexToBytes(response.public_key), cosignerSig],
  ],
});
const { txHex, txid } = finalizeReclaim({ path: 'early-exit', tx, stxAddress: stakerAddress });

// Broadcast txHex to Bitcoin.
```

For the position and reclaim details around renewal, see [Paired BTC](../paired-btc.md).
