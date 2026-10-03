# BtcAddress.stringify

Encodes a [BtcAddressRepr](btcaddressrepr.md), or a Clarity `{ version, hashbytes }` tuple, as a Bitcoin address string for a given network. Pure computation, no network call. Exported in the `BtcAddress` namespace.

***

### Usage

```ts
import { BtcAddress, PoXAddressVersion } from '@stacks/bitcoin-staking';
import { hexToBytes } from '@stacks/common';
import { Cl } from '@stacks/transactions';

const data = hexToBytes('751e76e8199196d454941c45d1b3a323f1433bd6');

BtcAddress.stringify({ version: PoXAddressVersion.P2WPKH, data }, 'mainnet');
// 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'

BtcAddress.stringify({ version: PoXAddressVersion.P2WPKH, data }, 'testnet');
// 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'

// Same address from a Clarity tuple
const tuple = Cl.tuple({ version: Cl.buffer(Uint8Array.of(0x04)), hashbytes: Cl.buffer(data) });
BtcAddress.stringify(tuple, 'mainnet');
// 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
```

#### Notes

* Versions `0x00` to `0x03` encode as base58 addresses, with `P2SHP2WPKH` and `P2SHP2WSH` written as P2SH addresses. `0x04` and `0x05` encode as bech32, `0x06` as bech32m.
* The network picks the prefix: `bc` and base58 bytes `0x00`/`0x05` for `'mainnet'`, `tb` and `0x6f`/`0xc4` for `'testnet'`, `bcrt` and `0x6f`/`0xc4` for `'devnet'` and `'mocknet'`.
* An argument with a `type` field is read as a Clarity tuple. A tuple without buffer `version` and `hashbytes` entries throws an `Error` starting with `Invalid argument`.
* An unknown version throws `Unexpected PoX address version: <n>`. Hash bytes of the wrong length throw `Invalid PoX address hashbytes: version <v> requires <n> bytes, got <m>`.
* A `StacksNetwork` object that matches no known network throws `networkNameFrom: unrecognized network object`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/btc-address.ts#L196-L242)

***

### Signature

```ts
function stringify(
  address: BtcAddressRepr | TupleCV,
  network: StacksNetworkName | StacksNetwork
): string;
```

***

### Returns

`string`

The Bitcoin address.

***

### Parameters

#### address (required)

* **Type**: `BtcAddressRepr | TupleCV`

The address to encode: a [BtcAddressRepr](btcaddressrepr.md), or a Clarity tuple with one-byte buffer `version` and buffer `hashbytes`, such as one built with `Cl.tuple`.

#### network (required)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to encode for: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object.
