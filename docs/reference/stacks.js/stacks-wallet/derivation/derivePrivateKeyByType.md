# derivePrivateKeyByType

Derives a private key for a specific account using either the Wallet (STX) or Data derivation path, based on the given `DerivationType`.

***

### Usage

```ts
import { derivePrivateKeyByType, DerivationType } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

// Derive using the STX/Wallet path
const stxKey = derivePrivateKeyByType({
  rootNode,
  index: 0,
  derivationType: DerivationType.Wallet,
});

// Derive using the Data path
const dataKey = derivePrivateKeyByType({
  rootNode,
  index: 0,
  derivationType: DerivationType.Data,
});
```

#### Notes

- When `derivationType` is `DerivationType.Wallet`, calls `deriveStxPrivateKey` internally.
- When `derivationType` is `DerivationType.Data`, calls `deriveDataPrivateKey` internally.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L229)**

***

### Signature

```ts
function derivePrivateKeyByType(opts: {
  rootNode: HDKey;
  index: number;
  derivationType: DerivationType;
}): string;
```

***

### Returns

`string`

A compressed hex-encoded private key string.

***

### Parameters

#### opts (required)

| Property | Type | Description |
| --- | --- | --- |
| `rootNode` | `HDKey` | The root HD key derived from the wallet's seed phrase. |
| `index` | `number` | The account index (0-based). |
| `derivationType` | `DerivationType` | Which derivation path to use (`Wallet` or `Data`). |
