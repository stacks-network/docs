# parseSignerCalldata

Decodes `signerCalldata` bytes from [buildSignerCalldata](buildsignercalldata.md) back into the payout address and maximum fee. Pure computation.

***

### Usage

```ts
import { BtcAddress, buildSignerCalldata, parseSignerCalldata } from '@stacks/bitcoin-staking';

const signerCalldata = buildSignerCalldata({
  poxAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
  maxFeeSats: 1_000n,
});

const { poxAddress, maxFeeSats } = parseSignerCalldata(signerCalldata);
BtcAddress.stringify(poxAddress, 'mainnet'); // 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
maxFeeSats; // 1000n
```

#### Notes

* Accepts the bytes or their hex encoding.
* Throws an `Error` whose message starts with `Invalid signer calldata:` when the value is not a tuple with `pox-addr` and `max-fee` keys, when `pox-addr` is not a tuple, or when `max-fee` is not a `uint`. Bytes that are not a Clarity value throw while decoding, and a `hashbytes` length that does not match the version throws.
* The result carries no network. Render the address with [BtcAddress.stringify](../btcaddress/btcaddress-stringify.md) for the network you expect.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/signer.ts#L142-L173)

***

### Signature

```ts
function parseSignerCalldata(calldata: Uint8Array | string): {
  poxAddress: BtcAddressRepr;
  maxFeeSats: bigint;
};
```

***

### Returns

`{ poxAddress: BtcAddressRepr; maxFeeSats: bigint }`

| Field        | Type                                              | Meaning                                      |
| ------------ | ------------------------------------------------- | -------------------------------------------- |
| `poxAddress` | [BtcAddressRepr](../btcaddress/btcaddressrepr.md) | Payout address version and hash bytes        |
| `maxFeeSats` | `bigint`                                          | Largest sBTC fee the staker accepts, in sats |

***

### Parameters

#### calldata (required)

* **Type**: `Uint8Array | string`

Serialized calldata, as bytes or hex.
