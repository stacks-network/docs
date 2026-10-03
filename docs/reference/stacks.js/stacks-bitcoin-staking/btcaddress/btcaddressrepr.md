# BtcAddressRepr

A parsed Bitcoin address: a [PoXAddressVersion](../constants/poxaddressversion.md) and the hash or witness program bytes. It carries no network. [BtcAddress.parse](btcaddress-parse.md) and [parseSignerCalldata](../signer/parsesignercalldata.md) return it, and [BtcAddress.stringify](btcaddress-stringify.md) and [buildSignerCalldata](../signer/buildsignercalldata.md) accept it.

***

### Usage

```ts
import { BtcAddress } from '@stacks/bitcoin-staking';

const repr = BtcAddress.parse('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');
// { version: PoXAddressVersion.P2WPKH, data: Uint8Array(20) } (hash 751e76e8199196d454941c45d1b3a323f1433bd6)

BtcAddress.stringify(repr, 'testnet'); // 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/btc-address.ts#L20-L26)

***

### Definition

```ts
export interface BtcAddressRepr {
  /** PoX address version byte. */
  version: PoXAddressVersion;
  /** Hash / witness-program bytes. */
  data: Uint8Array;
}
```

***

### Properties

| Property  | Type                                                   | Description                                                                                                             |
| --------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `version` | [PoXAddressVersion](../constants/poxaddressversion.md) | Address type. Encoded as the one-byte `version` of a `{ version, hashbytes }` tuple                                     |
| `data`    | `Uint8Array`                                           | Hash or witness program: 20 bytes for versions `0x00` to `0x04`, 32 bytes for `0x05` and `0x06`. Encoded as `hashbytes` |
