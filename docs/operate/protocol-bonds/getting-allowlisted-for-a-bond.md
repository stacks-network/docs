---
description: >-
  How bond capacity is allocated during PoX-5, what to send the Stacks
  Endowment, and how to check your allowlist entry once the bond is set up.
---

# Getting Allowlisted for a Bond

Every protocol bond registration needs an allowlist entry for that bond, on either Bitcoin leg. During PoX-5 there is no on-chain auction. The Stacks Endowment sets each bond's capacity, target yield, STX:BTC ratio and allocation off-chain, and allocates the capacity to whitelisted partners before the bond starts. About 10% of paired-bond capacity is reserved for open access, first come first served, through selected pool partners. Allocation moves on-chain in a later protocol version, PoX-6.

If you do not have an allocation of your own, the open-access route is a [bond pool](bond-pool-operator-guide.md).

## What to send the Endowment

For each bond, one row per staker:

* **Staker principal.** The Stacks address that will call `register-for-bond`.
* **Maximum BTC commitment, in sats.** Your cap for this bond. You do not send an STX amount: the STX you must pair is computed at registration from the sats you actually commit and the bond's ratio.

Your signer-manager and how you are paid are not part of the allowlist. You choose both when you register. See [Opening a Bond Position](opening-a-bond-position.md).

## What the Endowment publishes

The Endowment's `setup-bond` call puts the bond on-chain: its target yield, the STX:BTC ratio and minimum STX ratio, the early-exit subscript, and the allowlist of up to 1,000 stakers with each one's sats cap. Registration opens once it lands.

* The contract accepts `setup-bond` only within the two reward cycles before the bond starts, 4,200 Bitcoin blocks on mainnet. In practice the Endowment publishes about seven days before Day 0.
* It runs once per bond. The parameters and the allowlist are fixed from then on.

{% hint style="warning" %}
**The allowlist is fixed at `setup-bond`.** If you are not on it when the bond is set up, you cannot join that bond. The next opportunity is the next bond, two reward cycles later.
{% endhint %}

## Check your entry

Read the bond back and confirm it matches what you agreed with the Endowment, then read your cap. A missing entry means you are not allowlisted. Read the parameters from the chain each time rather than hardcoding them: they are set per bond.

```ts
import { fetchBond, fetchBondAllowance } from '@stacks/bitcoin-staking';

const network = 'mainnet';

const bond = await fetchBond({ bondIndex, network });
// Check targetRateBps, stxValueRatio, minUstxRatioBps and earlyUnlockBytes

const allowance = await fetchBondAllowance({ bondIndex, address: staker, network });
if (allowance === undefined) throw new Error(`Not allowlisted for bond ${bondIndex}`);
```

Next: [Opening a Bond Position](opening-a-bond-position.md).
