---
description: >-
  How to check a bond's Bitcoin lock address before you fund it, what you need
  to spend it later, and how to reclaim your BTC once the timelock passes.
---

# Verifying and Reclaiming Your Locked Bitcoin

On a native BTC bond your Bitcoin stays in an output you control, guarded by a timelock. This page covers the two moments that matter for your funds: checking the lock address before you send anything to it, and spending the output back to yourself once the timelock passes. For leaving before the timelock, see [Ending or Changing a Bond Position](ending-or-changing-a-bond-position.md).

## Before you fund: check the lock address

The lock address is deterministic. It is built from four inputs:

* your Stacks address,
* the output's unlock height, at or above the bond's minimum,
* your `staker-unlock-bytes`, by default `<your Bitcoin public key> OP_CHECKSIG`,
* the bond's `early-unlock-bytes`, published on-chain when the bond is set up.

Check the address against the contract before funding. The contract's `construct-lockup-output-script` builds the same output from the same inputs. If it disagrees with the address your wallet or tool shows, do not fund. The code is under [Cross-check the script before funding](verifying-and-reclaiming-your-locked-bitcoin.md#cross-check-the-script-before-funding).

{% hint style="danger" %}
**Check before you send.** BTC sent to an address that does not match the contract's script cannot be registered for the bond, and whether you can spend it depends entirely on what that address actually encodes.
{% endhint %}

## What you need to spend it later

Spending the output needs the lock script, the output itself, and your Bitcoin key. Save the lock script when you register, and keep the lock transaction ID: it identifies the output to spend. If you lose the lock script, you can rebuild it from its four inputs:

| Input                 | Where to find it again                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Stacks address        | Your Stacks wallet                                                                                                           |
| Unlock height         | The arguments of your `register-for-bond` transaction                                                                        |
| `staker-unlock-bytes` | The same transaction. With the default unlock bytes, rebuild them from the public key of the Bitcoin key you registered with |
| `early-unlock-bytes`  | The bond's on-chain record                                                                                                   |

The contract keeps none of these in its own state, which is why the registration transaction matters.

## Reclaim after the timelock

Once Bitcoin passes the output's unlock height, you spend it alone through the timelock branch. There is no co-signer, no Stacks transaction and no deadline: the output stays spendable by you from then on.

Your STX leg unlocks separately, at the end of the bond term on Stacks. See the [bond timeline](https://docs.stacks.co/learn/bitcoin-staking#the-bond-timeline).

## Building a reclaim

For wallet, custodian, and app developers. The examples use [`@stacks/bitcoin-staking`](https://www.npmjs.com/package/@stacks/bitcoin-staking) 7.6.0.

### Cross-check the script before funding

```ts
import { buildLockOutputScript, fetchConstructLockupOutputScript } from '@stacks/bitcoin-staking';
import { bytesToHex } from '@stacks/common';

const inputs = { stxAddress: staker, unlockHeight, unlockBytes, earlyUnlockBytes: bond.earlyUnlockBytes };

const local = buildLockOutputScript(inputs);
const onchain = await fetchConstructLockupOutputScript({ ...inputs, network: 'mainnet' });
if (bytesToHex(local) !== bytesToHex(onchain)) {
  throw new Error('Lock script mismatch: do not fund');
}
```

### Rebuild the lock script if you did not keep it

```ts
import { buildLockScript, buildUnlockScript, fetchBond } from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex, network: 'mainnet' });
const lockScript = buildLockScript({
  stxAddress: staker,
  unlockHeight, // from your register-for-bond transaction
  unlockBytes: buildUnlockScript(stakerBtcPublicKey),
  earlyUnlockBytes: bond.earlyUnlockBytes,
});
```

### Build, sign and finalize the spend

```ts
import { buildReclaim, finalizeReclaim } from '@stacks/bitcoin-staking';

const tx = buildReclaim({
  path: 'locktime',
  utxo,       // the lockup UTXO: { txid, vout, value }
  lockScript,
  output: { address: destinationAddress, feeSats },
  network: 'mainnet',
});

// Sign input 0 with your key, or send tx.toPSBT() to a hardware or browser wallet
tx.signIdx(stakerPrivateKey, 0);

const { txHex, txid } = finalizeReclaim({ path: 'locktime', tx });
// Broadcast txHex to Bitcoin
```

`buildReclaim` sets the transaction's `nLockTime` to the unlock height decoded from the lock script, so the spend can be mined from the block after that height. The signature commits to the outputs and fee, so set them before signing.

### Relock straight into the next bond

To renew without other BTC, set `output.address` to the next bond's lock address instead of your own. The same spend moves your BTC from the old lock into the new one. Once it confirms, register for the next bond with a proof of the new output. See [Renewing a native BTC bond](ending-or-changing-a-bond-position.md#renewing-a-native-btc-bond).
