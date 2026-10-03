# fetchEligibleUpdateBondRegistration

Dry-runs the checks of pox-5 `update-bond-registration`, which moves a bond membership to a new signer-manager, and reports every gate that would fail. Run it before [buildUpdateBondRegistration](../build/buildupdatebondregistration.md).

***

### Usage

```ts
import { fetchEligibleUpdateBondRegistration } from '@stacks/bitcoin-staking';

const result = await fetchEligibleUpdateBondRegistration({
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.new-signer-manager',
  oldSignerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.old-signer-manager',
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`update-bond-registration`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L850-L943). The membership is read with `get-bond-membership`, which returns nothing once the bond's term has ended.
* Not checked: the new signer-manager's `validate-stake!` call, which can still reject the update with its own error code.
* Throws if a read returns a non-2xx response.

| Reason                    | Contract error                         | Added when                                                                                                            |
| ------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NotBondParticipant`      | `ERR_NOT_BOND_PARTICIPANT (u34)`       | `staker` has no current bond membership                                                                               |
| `StakeInPreparePhase`     | `ERR_STAKE_IN_PREPARE_PHASE (u47)`     | The current height is in the prepare phase: the last `prepareCycleLength` Bitcoin blocks of the cycle, 100 on mainnet |
| `InvalidOldSignerManager` | `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` | `oldSignerManager` is not the membership's current signer-manager                                                     |
| `UpdateBondSameSigner`    | `ERR_UPDATE_BOND_SAME_SIGNER (u44)`    | `signerManager` equals `oldSignerManager`                                                                             |
| `SignerNotFound`          | `ERR_SIGNER_NOT_FOUND (u23)`           | `signerManager` is not registered with pox-5                                                                          |
| `SignerKeyGrantNotFound`  | `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)` | `signerManager` is registered, but the grant for its signer key is not active                                         |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L315-L378)

***

### Signature

```ts
function fetchEligibleUpdateBondRegistration(
  opts: {
    staker: string;
    signerManager: string;
    oldSignerManager: string;
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

#### opts.staker (required)

* **Type**: `string`

Stacks address that would send the transaction (the contract's `tx-sender`).

#### opts.signerManager (required)

* **Type**: `string`

Contract ID of the signer-manager to move the membership to.

#### opts.oldSignerManager (required)

* **Type**: `string`

Contract ID of the signer-manager the membership is bound to now.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The prepare-phase gate uses its `currentBurnchainBlockHeight`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
