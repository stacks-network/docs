# PoXAddressVersion

The version byte of a `{ version, hashbytes }` Bitcoin address tuple, which says how to read the hash bytes. It is the `version` of a [BtcAddressRepr](../btcaddress/btcaddressrepr.md), set by [BtcAddress.parse](../btcaddress/btcaddress-parse.md) and read by [BtcAddress.stringify](../btcaddress/btcaddress-stringify.md), and the `version` byte of the payout address that [buildSignerCalldata](../signer/buildsignercalldata.md) encodes.

***

### Usage

```ts
import { BtcAddress, PoXAddressVersion } from '@stacks/bitcoin-staking';

const { version } = BtcAddress.parse('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');

version === PoXAddressVersion.P2WPKH; // true, version is 4
```

#### Notes

* `BtcAddress.parse` returns only `P2PKH`, `P2SH`, `P2WPKH`, `P2WSH` and `P2TR`. A base58 `3...` or `2...` address parses as `P2SH`, because the wrapped segwit types cannot be told apart from P2SH on chain.
* `BtcAddress.stringify` renders `P2SHP2WPKH` and `P2SHP2WSH` as base58 P2SH addresses.
* The hash is 20 bytes for versions `0x00` to `0x04` and 32 bytes for `0x05` and `0x06`. `BtcAddress.stringify` and [buildSignerCalldata](../signer/buildsignercalldata.md) throw on any other length or an unknown version.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/constants.ts#L13-L34)

***

### Definition

```ts
export enum PoXAddressVersion {
  // Taken from https://github.com/stx-labs/stacks.js/blob/efd2255f979ed64b90ac33246d99cd4809620400/packages/stacking/src/constants.ts#L1-L17

  /** p2pkh: 20-byte hash160 of a single public key */
  P2PKH = 0x00,
  /** p2sh: 20-byte hash160 of a redeemScript */
  P2SH = 0x01,
  /** p2wpkh-p2sh (indistinguishable from P2SH on-chain) */
  P2SHP2WPKH = 0x02,
  /** p2wsh-p2sh (indistinguishable from P2SH on-chain) */
  P2SHP2WSH = 0x03,
  /** p2wpkh: 20-byte witness program */
  P2WPKH = 0x04,
  /** p2wsh: 32-byte witness program */
  P2WSH = 0x05,
  /** p2tr: 32-byte witness program */
  P2TR = 0x06,
}
```

***

### Values

| Value        | Number | Description                                                                                           |
| ------------ | ------ | ----------------------------------------------------------------------------------------------------- |
| `P2PKH`      | `0x00` | Pay to public key hash. 20-byte hash160 of a public key. Base58 address starting with `1` on mainnet  |
| `P2SH`       | `0x01` | Pay to script hash. 20-byte hash160 of a redeem script. Base58 address starting with `3` on mainnet   |
| `P2SHP2WPKH` | `0x02` | P2WPKH wrapped in P2SH. 20-byte hash. Same address form as `P2SH`                                     |
| `P2SHP2WSH`  | `0x03` | P2WSH wrapped in P2SH. 20-byte hash. Same address form as `P2SH`                                      |
| `P2WPKH`     | `0x04` | Native segwit v0 key hash. 20-byte witness program. Bech32 address starting with `bc1q` on mainnet    |
| `P2WSH`      | `0x05` | Native segwit v0 script hash. 32-byte witness program. Bech32 address starting with `bc1q` on mainnet |
| `P2TR`       | `0x06` | Taproot, segwit v1. 32-byte witness program. Bech32m address starting with `bc1p` on mainnet          |
