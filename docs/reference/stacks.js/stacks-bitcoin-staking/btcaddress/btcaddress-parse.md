# BtcAddress.parse

Parses a Bitcoin address string into a [BtcAddressRepr](btcaddressrepr.md): its [PoXAddressVersion](../constants/poxaddressversion.md) and hash bytes. Pure computation, no network call. Exported in the `BtcAddress` namespace.

***

### Usage

```ts
import { BtcAddress } from '@stacks/bitcoin-staking';

const repr = BtcAddress.parse('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', 'mainnet');
repr.version; // 4 (PoXAddressVersion.P2WPKH)
repr.data; // Uint8Array(20), 751e76e8199196d454941c45d1b3a323f1433bd6

BtcAddress.parse('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', 'testnet');
// throws: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4' is not a valid testnet P2PKH/P2SH/P2WPKH/P2WSH/P2TR address
```

#### Notes

* Accepted forms: base58 P2PKH and P2SH addresses, bech32 segwit v0 addresses with a 20-byte (P2WPKH) or 32-byte (P2WSH) program, and bech32m segwit v1 addresses with a 32-byte program (P2TR). Segwit prefixes can be `bc`, `tb` or `bcrt`.
* Every base58 script-hash address parses as `P2SH`. The result is never `P2SHP2WPKH` or `P2SHP2WSH`.
* Pass `network` to reject an address from another network. The base58 version byte must then be that network's P2PKH or P2SH byte, and the segwit prefix must be `bc` for `'mainnet'`, `tb` for `'testnet'`, or `bcrt` for `'devnet'` and `'mocknet'`. Without `network`, any of them is accepted and the result does not record which.
* An invalid address throws an `Error` with the message `'<address>' is not a valid P2PKH/P2SH/P2WPKH/P2WSH/P2TR address`. If the address starts like a base58 or segwit address, the message names the network when one was passed, and the error's `cause` holds the specific reason, such as a bad checksum or a wrong network.
* A `StacksNetwork` object that matches no known network throws `networkNameFrom: unrecognized network object` before the address is read.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/btc-address.ts#L141-L194)

***

### Signature

```ts
function parse(
  btcAddress: string,
  network?: StacksNetworkName | StacksNetwork
): BtcAddressRepr;
```

***

### Returns

`BtcAddressRepr`

The address as a [BtcAddressRepr](btcaddressrepr.md).

***

### Parameters

#### btcAddress (required)

* **Type**: `string`

The Bitcoin address to parse.

#### network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network the address must belong to: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. When omitted, the network is not checked.
