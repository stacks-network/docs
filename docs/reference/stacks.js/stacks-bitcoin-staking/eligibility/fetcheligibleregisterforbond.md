# fetchEligibleRegisterForBond

Dry-runs the checks of pox-5 `register-for-bond` against current chain state and reports every gate that would fail. Nothing is built or broadcast. Run it before [buildRegisterForBond](../build/buildregisterforbond.md).

***

### Usage

```ts
import { fetchEligibleRegisterForBond, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const result = await fetchEligibleRegisterForBond({
  bondIndex: 2,
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  amountUstx: 1_000_000_000n, // 1,000 STX in micro-STX
  lockup: { kind: 'sbtc', sbtcSats: 10_000_000n }, // 0.1 sBTC in sats
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  poxInfo,
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`register-for-bond`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L642-L842). Timing gates use `poxInfo.currentBurnchainBlockHeight`.
* The staked sats come from `lockup`: the sum of `outputs[].amount` for `kind: 'btc'`, or `sbtcSats` for `kind: 'sbtc'`.
* Not checked: the signer-manager's `validate-stake!` call, which can still reject the registration with its own error code. For `kind: 'btc'`, the merkle proof (`ERR_INVALID_MERKLE_PROOF (u41)`), output script (`ERR_INVALID_LOCKUP_SCRIPT (u42)`), output amount (`ERR_INVALID_LOCKUP_AMOUNT (u45)`) and header parsing (`ERR_READ_TX_OUT_OF_BOUNDS (u39)`) checks run only on-chain. For `kind: 'sbtc'`, the staker's sBTC balance for the transfer into pox-5 is not checked.
* A missing allowance entry gives `NotAllowlisted`. An allowance of 0 passes that gate and gives `TooMuchSats` instead, as on-chain.
* Throws if a read returns a non-2xx response, or if `poxInfo.contractVersions` has no pox-5 entry.

| Reason                    | Contract error                         | Added when                                                                                                                                                                                      |
| ------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BondNotFound`            | `ERR_BOND_NOT_FOUND (u7)`              | No bond is set up at `bondIndex`                                                                                                                                                                |
| `InvalidUnlockHeight`     | `ERR_INVALID_UNLOCK_HEIGHT (u52)`      | `kind: 'btc'` only. An output's `unlockBurnHeight` is below the bond's `get-bond-l1-unlock-height` ([fetchBondL1UnlockHeight](../fetch/fetchbondl1unlockheight.md)), or at or above 500,000,000 |
| `DuplicateLockupOutpoint` | `ERR_DUPLICATE_LOCKUP_OUTPOINT (u46)`  | `kind: 'btc'` only. Two outputs share a txid and output index                                                                                                                                   |
| `InvalidBtcHeader`        | `ERR_INVALID_BTC_HEADER (u40)`         | `kind: 'btc'` only. An output's `header` does not match the node's Bitcoin block header hash at its `height`                                                                                    |
| `NotAllowlisted`          | `ERR_NOT_ALLOWLISTED (u11)`            | The staker has no allowance entry for the bond                                                                                                                                                  |
| `StakeInPreparePhase`     | `ERR_STAKE_IN_PREPARE_PHASE (u47)`     | The current height is in the prepare phase: the last `prepareCycleLength` Bitcoin blocks of the cycle, 100 on mainnet                                                                           |
| `InsufficientStx`         | `ERR_INSUFFICIENT_STX (u8)`            | `amountUstx` is below [minUstxForSatsAmount](../cycles/minustxforsatsamount.md) for the staked sats, or above the staker's unlocked plus locked micro-STX. Added once                           |
| `BondAlreadyStarted`      | `ERR_BOND_ALREADY_STARTED (u43)`       | The current height is at or past the bond's start height                                                                                                                                        |
| `AlreadyStaked`           | `ERR_ALREADY_STAKED (u19)`             | The staker's STX-only stake is still locked in the bond's first reward cycle                                                                                                                    |
| `TooMuchSats`             | `ERR_TOO_MUCH_SATS (u10)`              | The staked sats exceed the staker's allowance                                                                                                                                                   |
| `SignerNotFound`          | `ERR_SIGNER_NOT_FOUND (u23)`           | `signerManager` is not registered with pox-5                                                                                                                                                    |
| `SignerKeyGrantNotFound`  | `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)` | `signerManager` is registered, but the grant for its signer key is not active                                                                                                                   |
| `AlreadyRegistered`       | `ERR_ALREADY_REGISTERED (u9)`          | The staker's current bond membership overlaps this bond's first reward cycle                                                                                                                    |
| `RolloverTooEarly`        | `ERR_ROLLOVER_TOO_EARLY (u48)`         | The staker has a non-overlapping bond membership and the current height is below that bond's `get-bond-l1-unlock-height`                                                                        |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L57-L236)

***

### Signature

```ts
function fetchEligibleRegisterForBond(
  opts: {
    bondIndex: number;
    staker: string;
    amountUstx: IntegerType;
    lockup: BondLockup;
    signerManager: string;
    poxInfo?: PoxInfo;
  } & NetworkClientParam
): Promise<EligibilityResult>;
```

`opts` also takes the [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) fields.

***

### Returns

`Promise<EligibilityResult>`

Resolves to an [EligibilityResult](eligibilityresult.md): `{ ok: true }`, or `{ ok: false, reasons }` with every failing gate from the Notes table.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond to register for. Bond `n` starts at reward cycle `firstPox5RewardCycle + 2n` (see [bondPeriodToRewardCycle](../cycles/bondperiodtorewardcycle.md)).

#### opts.staker (required)

* **Type**: `string`

Stacks address that would send the transaction (the contract's `tx-sender`).

#### opts.amountUstx (required)

* **Type**: `IntegerType`

Micro-STX the staker would lock. Accepts `number`, `string`, `bigint` or `Uint8Array`.

#### opts.lockup (required)

* **Type**: `BondLockup`

The same [BondLockup](../types/bondlockup.md) you pass to `buildRegisterForBond`: L1 outputs (`kind: 'btc'`) or an sBTC amount in sats (`kind: 'sbtc'`).

#### opts.signerManager (required)

* **Type**: `string`

Contract ID of the signer-manager the staker would register with.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The timing gates use its `currentBurnchainBlockHeight`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
