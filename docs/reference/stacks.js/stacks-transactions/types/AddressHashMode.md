# AddressHashMode

Enum specifying the serialization mode for public keys to addresses. Determines how a public key (or set of public keys) is hashed into a Stacks address.

***

### Usage

```ts
import { AddressHashMode } from '@stacks/transactions';

// Single-sig hash mode (default)
const hashMode = AddressHashMode.P2PKH;

// Multi-sig hash mode (non-sequential, recommended for new multi-sig)
const multiSigMode = AddressHashMode.P2SHNonSequential;
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L148)**

***

### Definition

```ts
enum AddressHashMode {
  /** SingleSigHashMode — hash160(public-key), same as bitcoin's p2pkh */
  P2PKH = 0x00,
  /** Legacy MultiSigHashMode — hash160(multisig-redeem-script), same as bitcoin's multisig p2sh */
  P2SH = 0x01,
  /** SingleSigHashMode — hash160(segwit-program-00(p2pkh)), same as bitcoin's p2sh-p2wpkh */
  P2WPKH = 0x02,
  /** Legacy MultiSigHashMode — hash160(segwit-program-00(public-keys)), same as bitcoin's p2sh-p2wsh */
  P2WSH = 0x03,
  /** Non-Sequential MultiSigHashMode — hash160(multisig-redeem-script) */
  P2SHNonSequential = 0x05,
  /** Non-Sequential MultiSigHashMode — hash160(segwit-program-00(public-keys)) */
  P2WSHNonSequential = 0x07,
}
```

***

### Values

| Value | Number | Type | Description |
| --- | --- | --- | --- |
| `P2PKH` | `0x00` | Single-sig | Standard single-sig (like Bitcoin p2pkh) |
| `P2SH` | `0x01` | Multi-sig (legacy) | Legacy sequential multi-sig |
| `P2WPKH` | `0x02` | Single-sig | Single-sig with segwit compatibility |
| `P2WSH` | `0x03` | Multi-sig (legacy) | Legacy sequential multi-sig with segwit |
| `P2SHNonSequential` | `0x05` | Multi-sig | Non-sequential multi-sig (recommended) |
| `P2WSHNonSequential` | `0x07` | Multi-sig | Non-sequential multi-sig with segwit |
