# fetchAccountStatus

Reads the node's `/v2/accounts/<address>` endpoint and returns the account's micro-STX balance, locked micro-STX, nonce and unlock height. It reads no pox-5 function, map or data-var.

***

### Usage

```ts
import { fetchAccountStatus } from '@stacks/bitcoin-staking';

const account = await fetchAccountStatus({
  address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  network: 'mainnet',
});

account.locked; // micro-STX locked by staking, as a bigint
account.unlockHeight; // 0 when no lock is active
```

#### Notes

* `balance`, `locked` and `nonce` are `bigint`. `unlockHeight` is a Bitcoin block height as a `number`, and is `0` when no lock is active.
* Requests `?proof=0`, so the node returns no Merkle proof.
* A non-2xx response throws an `Error` whose message starts with `Error fetching account status.` and includes the status code and URL.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L118-L141)

***

### Signature

```ts
function fetchAccountStatus(
  opts: { address: string } & NetworkClientParam
): Promise<AccountStatus>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `address`.

***

### Returns

`Promise<AccountStatus>`

Resolves to an [AccountStatus](../types/accountstatus.md) built from the node's response.

***

### Parameters

#### opts.address (required)

* **Type**: `string`

Stacks address of the account. It is URL-encoded into the request path.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
