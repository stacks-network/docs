# fetchParseBlockHeader

Calls the pox-5 `parse-block-header` read-only and returns the decoded fields of an 80-byte Bitcoin block header.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchParseBlockHeader } from '@stacks/bitcoin-staking';

// The Bitcoin genesis block header
const parsed = await fetchParseBlockHeader({
  header:
    '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c',
  network: 'mainnet',
});

parsed.version; // 1
bytesToHex(parsed.merkleRoot); // '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'
parsed.timestamp; // 1231006505
parsed.nbits; // 486604799
parsed.nonce; // 2083236893
```

#### Notes

* Wraps [`parse-block-header`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3557-L3591). The contract reverses `parent` and `merkle-root` into display order ([L3617-L3643](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3617-L3643)). The four integer fields are read as 4-byte little-endian values.
* A header shorter than 80 bytes makes the contract return `ERR_READ_TX_OUT_OF_BOUNDS (u39)`, and the SDK throws an `Error` with the message `parse-block-header returned an error response`. The message does not include the code. A header longer than 80 bytes fails the `(buff 80)` argument type, and the call throws.
* Parsing does not check proof of work or whether the header is on the Bitcoin chain. Use [fetchVerifyBlockHeader](fetchverifyblockheader.md) to match it against a burn height.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L744-L775)

***

### Signature

```ts
function fetchParseBlockHeader(
  opts: { header: Uint8Array | string } & NetworkClientParam
): Promise<ParsedBlockHeader>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `header`.

***

### Returns

`Promise<ParsedBlockHeader>`

Resolves to a [ParsedBlockHeader](parsedblockheader.md).

***

### Parameters

#### opts.header (required)

* **Type**: `Uint8Array | string`

The 80-byte block header, as raw bytes or hex.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
