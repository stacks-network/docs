---
description: >-
  One-time setup before staking — bond parameter submission and contract-caller
  authorizations.
---

# Onboarding

Onboarding covers the setup transactions that happen before a position opens. These transactions do not move yield-bearing capital. They set up who is allowed to do what.

Signer-key grants and revocations are on the [Advanced › Signers](advanced/signers.md) page. Not every integrator runs signer infrastructure.

### Submit bond parameters to the Endowment

The Stacks [Endowment](../glossary.md#endowment-stacks-endowment) configures each bond. The Endowment owns the `setup-bond` call and the on-chain allowlist. As an integrator, you do not send this transaction. You submit your parameters to the Endowment. The Endowment publishes them on-chain about seven days before Day 0.

Send the Endowment these items for each bond your users join:

* **Staker principal.** This is the Stacks address that registers for the bond and receives rewards. Send one row per participant in the allowlist.
* **Maximum BTC commitment.** This is the most BTC, in sats, that the staker may commit to this bond. The contract derives the required STX amount from this value and the bond's ratio. You do not send a separate STX cap.
* **Signer manager or signer key.** Send this only if you operate signing infrastructure that your users will route through. See [Advanced › Signers](advanced/signers.md).
* **Reward address preference.** State whether your users use the sBTC default or opt out to an L1 BTC address.

Each bond also carries an early-exit subscript. This is a Bitcoin script fragment embedded in the L1 lockup script. It authorizes the BTC-side early-exit spend. In practice, this subscript is always a single cosigner public key checked with `OP_CHECKSIG`. A redundant, KMS-backed early-exit signing service manages that key; the design is not an on-chain multisig. See the [glossary](../glossary.md) and [Paired BTC](paired-btc.md) for details. The staker announces the Stacks-side early exit themselves, through `announce-l1-early-exit`. No separate L2 admin principal exists for this step.

Once the Endowment publishes the bond, the on-chain bond index and your allowlist row become the reference point for every later step. Read the bond back with `fetchBond` to confirm its rate, ratio, and early-exit subscript match what you agreed with the Endowment.

```ts
import { fetchBond } from '@stacks/bitcoin-staking';

const network = 'mainnet';

const bond = await fetchBond({ bondIndex: 7, network });
// Confirm targetRateBps, stxValueRatio, minUstxRatioBps, and earlyUnlockBytes
// match what you sent the Endowment.
```

### Setup-bond timing

The Endowment's `setup-bond` call is separate from the seven-day parameter submission above. Three constraints govern it:

* The Endowment can only call `setup-bond` within two cycles before the bond's start height. Calling it earlier or later fails.
* The Endowment can call `setup-bond` only once per bond. Once the parameters and allowlist are set, they stay fixed for that bond.
* The `setup-bond` call opens registration. Only after this call lands can allowlisted participants call `register-for-bond`.
