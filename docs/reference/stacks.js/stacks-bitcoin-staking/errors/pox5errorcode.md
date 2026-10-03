# Pox5ErrorCode

The pox-5 error codes: each member's number is the `N` in a `(err uN)` the contract returns, from its `ERR_*` constants. [EligibilityResult](../eligibility/eligibilityresult.md) reports failing gates with these values, and [parsePox5Error](parsepox5error.md) extracts them from transaction results.

***

### Usage

```ts
import { Pox5ErrorCode, parsePox5Error } from '@stacks/bitcoin-staking';

const code = parsePox5Error('(err u47)'); // 47

if (code === Pox5ErrorCode.StakeInPreparePhase) {
  // retry after the prepare phase ends, in the next reward cycle
}
```

#### Notes

* Defined in [pox-5.clar](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1-L70). Numbers 6, 15, 16, 18, 21, 22 and 25 are not used.
* [describePox5Error](describepox5error.md) returns the constant name and a description for a number.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/errors.ts#L8-L63)

***

### Definition

```ts
enum Pox5ErrorCode {
  Unauthorized = 1,
  CannotSetupBondTooSoon = 2,
  CannotSetupBondTooLate = 3,
  BondAlreadySetup = 4,
  StakerAlreadyAdded = 5,
  BondNotFound = 7,
  InsufficientStx = 8,
  AlreadyRegistered = 9,
  TooMuchSats = 10,
  NotAllowlisted = 11,
  SignerKeyGrantUsed = 12,
  InvalidSignatureRecover = 13,
  InvalidSignaturePubkey = 14,
  SignerKeyGrantNotFound = 17,
  AlreadyStaked = 19,
  InvalidNumCycles = 20,
  SignerNotFound = 23,
  InvalidStartBurnHeight = 24,
  UnauthorizedSignerRegistration = 26,
  NotStaking = 27,
  UnstakeInPreparePhase = 28,
  InvalidBondPeriodOrdering = 29,
  DistributionAlreadyComputed = 30,
  BondNotActive = 31,
  NoClaimableRewards = 32,
  ActiveBondNotIncluded = 33,
  NotBondParticipant = 34,
  CannotAnnounceL1EarlyUnlock = 35,
  InvalidOldSignerManager = 36,
  InvalidUnstakeSbtcAmount = 37,
  CannotUnstakeSbtc = 38,
  ReadTxOutOfBounds = 39,
  InvalidBtcHeader = 40,
  InvalidMerkleProof = 41,
  InvalidLockupScript = 42,
  BondAlreadyStarted = 43,
  UpdateBondSameSigner = 44,
  InvalidLockupAmount = 45,
  DuplicateLockupOutpoint = 46,
  StakeInPreparePhase = 47,
  RolloverTooEarly = 48,
  ReentrantCall = 49,
  L1EarlyExitAlreadyAnnounced = 50,
  InsufficientReserveBalance = 51,
  InvalidUnlockHeight = 52,
  RewardsPaused = 53,
}
```

***

### Values

| Value                            | Number | Description                                                                                                                                                                                                                                                        |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Unauthorized`                   | 1      | `ERR_UNAUTHORIZED`. Caller is not the required principal: `bond-admin` for `set-bond-admin` and `setup-bond`, `pause-admin` for `set-pause-admin` and `pause-rewards`, the staker for `announce-l1-early-exit`, the signer key's address for `revoke-signer-grant` |
| `CannotSetupBondTooSoon`         | 2      | `ERR_CANNOT_SETUP_BOND_TOO_SOON`. `setup-bond` more than two reward cycles before the bond's start height                                                                                                                                                          |
| `CannotSetupBondTooLate`         | 3      | `ERR_CANNOT_SETUP_BOND_TOO_LATE`. `setup-bond` at or after the bond's start height                                                                                                                                                                                 |
| `BondAlreadySetup`               | 4      | `ERR_BOND_ALREADY_SETUP`. `setup-bond` for an index that already has a bond                                                                                                                                                                                        |
| `StakerAlreadyAdded`             | 5      | `ERR_STAKER_ALREADY_ADDED`. A staker appears twice in the `setup-bond` allowlist                                                                                                                                                                                   |
| `BondNotFound`                   | 7      | `ERR_BOND_NOT_FOUND`. No bond at the index (`register-for-bond`, `calculate-rewards`)                                                                                                                                                                              |
| `InsufficientStx`                | 8      | `ERR_INSUFFICIENT_STX`. Micro-STX below the bond's minimum for the sats, or more than the staker can lock (`register-for-bond`, `stake`, `stake-update`)                                                                                                           |
| `AlreadyRegistered`              | 9      | `ERR_ALREADY_REGISTERED`. The staker's bond membership overlaps the new bond (`register-for-bond`)                                                                                                                                                                 |
| `TooMuchSats`                    | 10     | `ERR_TOO_MUCH_SATS`. Sats exceed the staker's allowance (`register-for-bond`)                                                                                                                                                                                      |
| `NotAllowlisted`                 | 11     | `ERR_NOT_ALLOWLISTED`. The staker has no allowance for the bond (`register-for-bond`)                                                                                                                                                                              |
| `SignerKeyGrantUsed`             | 12     | `ERR_SIGNER_KEY_GRANT_USED`. The `(signer-key, signer-manager, auth-id)` grant was already used (`grant-signer-key`)                                                                                                                                               |
| `InvalidSignatureRecover`        | 13     | `ERR_INVALID_SIGNATURE_RECOVER`. No public key recovers from the signature (`grant-signer-key`)                                                                                                                                                                    |
| `InvalidSignaturePubkey`         | 14     | `ERR_INVALID_SIGNATURE_PUBKEY`. The recovered key is not `signer-key` (`grant-signer-key`)                                                                                                                                                                         |
| `SignerKeyGrantNotFound`         | 17     | `ERR_SIGNER_KEY_GRANT_NOT_FOUND`. No active grant for the signer key and signer-manager (`register-signer`, `register-for-bond`, `update-bond-registration`, `stake`, `stake-update`)                                                                              |
| `AlreadyStaked`                  | 19     | `ERR_ALREADY_STAKED`. A current STX-only stake or an overlapping bond membership (`stake`), or an STX-only stake still locked in the bond's first cycle (`register-for-bond`)                                                                                      |
| `InvalidNumCycles`               | 20     | `ERR_INVALID_NUM_CYCLES`. Lock period outside 1 to 96 cycles (`stake`, `stake-update`)                                                                                                                                                                             |
| `SignerNotFound`                 | 23     | `ERR_SIGNER_NOT_FOUND`. The signer-manager is not registered (`register-for-bond`, `update-bond-registration`, `stake`, `stake-update`)                                                                                                                            |
| `InvalidStartBurnHeight`         | 24     | `ERR_INVALID_START_BURN_HEIGHT`. `start-burn-ht` is not in the current reward cycle (`stake`)                                                                                                                                                                      |
| `UnauthorizedSignerRegistration` | 26     | `ERR_UNAUTHORIZED_SIGNER_REGISTRATION`. `contract-caller` is not the signer-manager (`register-signer`, `grant-signer-key`)                                                                                                                                        |
| `NotStaking`                     | 27     | `ERR_NOT_STAKING`. No current STX-only stake (`stake-update`, `unstake`)                                                                                                                                                                                           |
| `UnstakeInPreparePhase`          | 28     | `ERR_UNSTAKE_IN_PREPARE_PHASE`. `unstake` in the prepare phase                                                                                                                                                                                                     |
| `InvalidBondPeriodOrdering`      | 29     | `ERR_INVALID_BOND_PERIOD_ORDERING`. The `calculate-rewards` list is not in descending `stx-value-ratio` order, ties by ascending bond index                                                                                                                        |
| `DistributionAlreadyComputed`    | 30     | `ERR_DISTRIBUTION_ALREADY_COMPUTED`. `calculate-rewards` already ran for this distribution cycle                                                                                                                                                                   |
| `BondNotActive`                  | 31     | `ERR_BOND_NOT_ACTIVE`. A listed bond is not active at the calculation height (`calculate-rewards`)                                                                                                                                                                 |
| `NoClaimableRewards`             | 32     | `ERR_NO_CLAIMABLE_REWARDS`. Nothing to claim (`claim-rewards`)                                                                                                                                                                                                     |
| `ActiveBondNotIncluded`          | 33     | `ERR_ACTIVE_BOND_NOT_INCLUDED`. An active bond is missing from the `calculate-rewards` list                                                                                                                                                                        |
| `NotBondParticipant`             | 34     | `ERR_NOT_BOND_PARTICIPANT`. No bond membership (`update-bond-registration`, `announce-l1-early-exit`, `unstake-sbtc`)                                                                                                                                              |
| `CannotAnnounceL1EarlyUnlock`    | 35     | `ERR_CANNOT_ANNOUNCE_L1_EARLY_UNLOCK`. `announce-l1-early-exit` for an sBTC-backed membership                                                                                                                                                                      |
| `InvalidOldSignerManager`        | 36     | `ERR_INVALID_OLD_SIGNER_MANAGER`. The signer-manager argument is not the current one (`update-bond-registration`, `stake-update`, `announce-l1-early-exit`, `unstake-sbtc`, `unstake`)                                                                             |
| `InvalidUnstakeSbtcAmount`       | 37     | `ERR_INVALID_UNSTAKE_SBTC_AMOUNT`. Withdrawal exceeds the membership's sats (`unstake-sbtc`)                                                                                                                                                                       |
| `CannotUnstakeSbtc`              | 38     | `ERR_CANNOT_UNSTAKE_SBTC`. `unstake-sbtc` for an L1 membership                                                                                                                                                                                                     |
| `ReadTxOutOfBounds`              | 39     | `ERR_READ_TX_OUT_OF_BOUNDS`. A read ran past the end of a lockup proof's 80-byte Bitcoin block header while parsing it                                                                                                                                             |
| `InvalidBtcHeader`               | 40     | `ERR_INVALID_BTC_HEADER`. A lockup proof's header does not match the Bitcoin block at its height                                                                                                                                                                   |
| `InvalidMerkleProof`             | 41     | `ERR_INVALID_MERKLE_PROOF`. A lockup proof's merkle proof does not verify                                                                                                                                                                                          |
| `InvalidLockupScript`            | 42     | `ERR_INVALID_LOCKUP_SCRIPT`. The output script is not the expected lockup script                                                                                                                                                                                   |
| `BondAlreadyStarted`             | 43     | `ERR_BOND_ALREADY_STARTED`. `register-for-bond` at or after the bond's start height                                                                                                                                                                                |
| `UpdateBondSameSigner`           | 44     | `ERR_UPDATE_BOND_SAME_SIGNER`. `update-bond-registration` with the current signer-manager as the new one                                                                                                                                                           |
| `InvalidLockupAmount`            | 45     | `ERR_INVALID_LOCKUP_AMOUNT`. The output's amount differs from the stated `amount`                                                                                                                                                                                  |
| `DuplicateLockupOutpoint`        | 46     | `ERR_DUPLICATE_LOCKUP_OUTPOINT`. The same outpoint appears twice in one `register-for-bond` call                                                                                                                                                                   |
| `StakeInPreparePhase`            | 47     | `ERR_STAKE_IN_PREPARE_PHASE`. Called in the prepare phase (`stake`, `stake-update`, `register-for-bond`, `update-bond-registration`, `announce-l1-early-exit`, `unstake-sbtc`)                                                                                     |
| `RolloverTooEarly`               | 48     | `ERR_ROLLOVER_TOO_EARLY`. Rolling out of a bond before its `get-bond-l1-unlock-height` (`register-for-bond`, `stake`)                                                                                                                                              |
| `ReentrantCall`                  | 49     | `ERR_REENTRANT_CALL`. A pox-5 call re-entered while a signer-manager `validate-stake!` call was in progress                                                                                                                                                        |
| `L1EarlyExitAlreadyAnnounced`    | 50     | `ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED`. `announce-l1-early-exit` already called for this bond                                                                                                                                                                       |
| `InsufficientReserveBalance`     | 51     | `ERR_INSUFFICIENT_RESERVE_BALANCE`. A reserve withdrawal exceeds the reserve balance. Only the private `transfer-from-reserve` raises it, and no contract function calls that                                                                                      |
| `InvalidUnlockHeight`            | 52     | `ERR_INVALID_UNLOCK_HEIGHT`. An L1 output's `unlock-burn-height` is below the bond's `get-bond-l1-unlock-height` or at or above 500,000,000, or a height is too large for `serialize-c-script-num`                                                                 |
| `RewardsPaused`                  | 53     | `ERR_REWARDS_PAUSED`. `claim-rewards` after `pause-rewards`, which cannot be undone                                                                                                                                                                                |
