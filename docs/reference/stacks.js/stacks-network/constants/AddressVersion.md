# AddressVersion

Enum representing the address version byte used in encoded Stacks addresses. The address version determines the address type and network.

Every Stacks address starts with `S` followed by a single character indicating the address version. The second character is the c32-encoded `AddressVersion` byte.

***

### Usage

```ts
import { AddressVersion } from '@stacks/network';

// Check if an address version is for mainnet single-sig
if (addressVersion === AddressVersion.MainnetSingleSig) {
  console.log('This is a mainnet single-sig address (SP...)');
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/constants.ts#L45)**

***

### Definition

```ts
enum AddressVersion {
  MainnetSingleSig = 22,
  MainnetMultiSig = 20,
  TestnetSingleSig = 26,
  TestnetMultiSig = 21,
}
```

***

### Values

| Value | Number | Address Prefix | Description |
| --- | --- | --- | --- |
| `MainnetSingleSig` | `22` | `SP` | Single-sig address for mainnet |
| `MainnetMultiSig` | `20` | `SM` | Multi-sig address for mainnet |
| `TestnetSingleSig` | `26` | `ST` | Single-sig address for testnet/devnet/mocknet |
| `TestnetMultiSig` | `21` | `SN` | Multi-sig address for testnet/devnet/mocknet |
