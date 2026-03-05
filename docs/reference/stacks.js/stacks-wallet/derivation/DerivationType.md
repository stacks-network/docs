# DerivationType

Enum that specifies which derivation path to use for an account's STX private key.

***

### Usage

```ts
import { DerivationType, deriveAccount } from '@stacks/wallet-sdk';

const account = deriveAccount({
  rootNode,
  index: 0,
  salt: walletSalt,
  stxDerivationType: DerivationType.Wallet,
});
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L82)**

***

### Definition

```ts
enum DerivationType {
  Wallet,
  Data,
  Unknown,
}
```

***

### Values

| Value | Derivation Path | Description |
| --- | --- | --- |
| `Wallet` | `m/44'/5757'/0'/0` | Standard STX derivation path. Used for most accounts. |
| `Data` | `m/888'/0'` | Legacy data derivation path. Used for accounts that registered BNS names with a data key. |
| `Unknown` | — | Could not determine the derivation type (e.g. no network available for lookup). |
