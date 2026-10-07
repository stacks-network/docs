---
description: Why a bond registration fails under PoX-5, and what to do about it.
---

# Bond Troubleshooting

Each section below starts from the error a failed `register-for-bond` returns. The error codes are the `pox-5` contract's unless noted, so you see the same codes whichever app you use.

{% hint style="info" %}
**Check before you send.** `fetchEligibleRegisterForBond` in `@stacks/bitcoin-staking` runs most of the contract's checks read-only against current chain state: allowlist, timing, STX minimum and balance, signer registration, overlap and the roll-over window. It does not yet check the lock script (u42), the amount (u45) or the merkle proof (u41); those are only checked on-chain. A transaction ID only confirms that the transaction was submitted. Confirm the position on-chain before treating it as done.
{% endhint %}

## I missed the registration deadline. Is my BTC lost?

No, as long as you funded the bond's checked lock address. The Bitcoin lock does not depend on the registration succeeding. If your registration fails because the bond has started, your BTC stays locked under its script until the unlock height you built it with, and then you spend it back to yourself through the timelock path. See [Verifying and Reclaiming Your Locked Bitcoin](verifying-and-reclaiming-your-locked-bitcoin.md).

You can still join a later bond as a new registration.

## Timing

### ERR\_BOND\_NOT\_FOUND (u7)

The bond has not been set up yet. `setup-bond` runs once per bond, within the two reward cycles before the bond starts, and registration cannot open before it. Check the bond's status with `fetchBondStatus`: before setup it reports `too-early`, `eligible` or `missed`; after setup it reports `open`, `locked`, `unlocked` or `finished`. These status names are marked experimental in the SDK and may still change.

### ERR\_STAKE\_IN\_PREPARE\_PHASE (u47)

`register-for-bond` is rejected during the prepare phase, the last 100 Bitcoin blocks of every reward cycle. Registration closes when the prepare phase immediately before the bond starts begins. Earlier prepare phases inside the registration window also block it; send once the next cycle has started.

### ERR\_BOND\_ALREADY\_STARTED (u43)

The bond's start height has passed. There is no grace period. See [I missed the registration deadline](bond-troubleshooting.md#i-missed-the-registration-deadline-is-my-btc-lost).

## Allowlist

### ERR\_NOT\_ALLOWLISTED (u11)

The Stacks address sending the registration has no allowlist entry for this bond. Each bond has its own allowlist, and an entry for one bond does not carry over. Check that you are sending from the exact address you submitted. See [Getting Allowlisted for a Bond](getting-allowlisted-for-a-bond.md).

### ERR\_TOO\_MUCH\_SATS (u10)

The BTC you are registering, summed across your lock outputs, is more than your allowlisted maximum for this bond.

## STX and existing positions

### ERR\_INSUFFICIENT\_STX (u8)

* **The STX amount is below the bond's minimum** for the BTC you are committing. The minimum comes from the bond's own ratio parameters. Compute it with `minUstxForSatsAmount`, or the contract's read-only `min-ustx-for-sats-amount`.
* **Your STX balance is below the amount.** Locked and unlocked STX both count, so STX still locked by an ending bond counts toward a roll-over.

### ERR\_ALREADY\_REGISTERED (u9)

You already hold a bond whose term overlaps this one. A Stacks principal holds one position at a time. A bond that ends no later than the new bond's first cycle does not overlap: that is a roll-over, and it uses the same call.

### ERR\_ALREADY\_STAKED (u19)

You hold an STX-only stake that overlaps this bond. STX-only staking and a protocol bond are mutually exclusive. A stake that ends no later than the bond's first cycle can roll into it. See [STX-only Staking Troubleshooting](../staking-stx/stx-only-staking-troubleshooting.md).

### ERR\_ROLLOVER\_TOO\_EARLY (u48)

You are rolling from an ending bond, but the transaction landed before that bond's L1 unlock height. A roll-over only opens at that height. See [Renewing a native BTC bond](ending-or-changing-a-bond-position.md#renewing-a-native-btc-bond).

## Signer-manager

### ERR\_SIGNER\_NOT\_FOUND (u23)

The signer-manager you named has not registered with pox-5. Check the contract address against the one you were given.

### ERR\_SIGNER\_KEY\_GRANT\_NOT\_FOUND (u17)

The signer-manager is registered, but its signer-key grant is missing or has been revoked. Contact its operator, or choose another manager.

### Errors outside pox-5's range

The signer-manager's own `validate-stake!` runs during registration and can reject it with its own error codes, for example an allowlist of its own or calldata it cannot parse. Those codes are defined by that contract, not by pox-5. Read the manager's source for their meaning.

## The Bitcoin lock and its proof

### ERR\_INVALID\_UNLOCK\_HEIGHT (u52)

The unlock height committed in a lock output is not acceptable:

* It is below the bond's minimum unlock height (`get-bond-l1-unlock-height`), or
* it is 500,000,000 or higher, which Bitcoin would read as a Unix timestamp rather than a block height.

### ERR\_INVALID\_LOCKUP\_SCRIPT (u42)

The output you proved does not pay the script the contract rebuilds from your Stacks address, unlock height, unlock script and the bond's early-unlock script. If you have not funded yet, check the address first: see [Verifying and Reclaiming Your Locked Bitcoin](verifying-and-reclaiming-your-locked-bitcoin.md). If you have funded a mismatched address, the BTC cannot be registered for this bond, and whether you can spend it depends on what that address actually encodes.

### ERR\_INVALID\_LOCKUP\_AMOUNT (u45)

The amount in your proof does not equal the value of the output on Bitcoin.

### ERR\_DUPLICATE\_LOCKUP\_OUTPOINT (u46)

The same output (transaction ID and output index) appears twice in your registration. A registration takes at most 10 lock outputs, each listed once.

### ERR\_READ\_TX\_OUT\_OF\_BOUNDS (u39)

The block header in your proof is shorter than 80 bytes, so the contract cannot parse it. Despite the constant's name, this is about the header, not the transaction. Pass the full 80-byte header of the block that contains the transaction, for example from Esplora's `/block/{hash}/header`.

### ERR\_INVALID\_BTC\_HEADER (u40) or ERR\_INVALID\_MERKLE\_PROOF (u41)

The proof does not match Bitcoin: u40 means the block header does not match the canonical header at that height, u41 means the transaction is not in that block according to the merkle path. Rebuild the proof with `buildLockProof` (Esplora-shaped indexer responses) or `buildLockProofFromBlock` (`bitcoind`-shaped), which handle witness stripping and byte order. To isolate the failing part, `fetchVerifyBlockHeader`, `fetchParseBlockHeader`, `fetchReversedTxid` and `fetchBurnBlockHeaderHash` run the contract's own helpers read-only.

### (err u1), (err u2) or (err u3) while reading the transaction

These come from Clarity's `get-bitcoin-tx-output?`, not from pox-5, even though pox-5 uses the same numbers for unrelated errors: u1 means the transaction bytes did not decode, u2 means the output index is out of range, and u3 means the output's script is over 1,024 bytes.

## Related

* [Opening a Bond Position](opening-a-bond-position.md)
* [Ending or Changing a Bond Position](ending-or-changing-a-bond-position.md)
* [Bond FAQ](bond-faq.md)
