# fetchReversedTxid

Calls the pox-5 `get-reversed-txid` read-only and returns the double SHA-256 of a raw Bitcoin transaction: its txid in internal byte order, the reverse of the txid block explorers show.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchReversedTxid } from '@stacks/bitcoin-staking';

// The Bitcoin genesis block's coinbase transaction
const tx =
  '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000';

const reversed = await fetchReversedTxid({ tx, network: 'mainnet' });

bytesToHex(reversed); // '3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a'
// Displayed txid: 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b
```

#### Notes

* Wraps [`get-reversed-txid`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3674-L3678), which returns `(sha256 (sha256 tx))`. Reverse the result, for example with [fetchReverseBuff32](fetchreversebuff32.md), to get the displayed txid.
* Pass the serialization without witness data. For a SegWit transaction, hashing the witness serialization gives the wtxid, not the txid.
* The transaction is at most 100,000 bytes, the contract's `(buff 100000)` argument type.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L719-L730)

***

### Signature

```ts
function fetchReversedTxid(
  opts: { tx: Uint8Array | string } & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `tx`.

***

### Returns

`Promise<Uint8Array>`

The 32-byte txid in internal (little-endian) byte order.

***

### Parameters

#### opts.tx (required)

* **Type**: `Uint8Array | string`

The raw transaction, as raw bytes or hex, without witness data.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
