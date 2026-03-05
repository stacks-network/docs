# randomSeedPhrase

Generates a random BIP39 mnemonic seed phrase. By default produces a 24-word phrase (256 bits of entropy). Can optionally generate a 12-word phrase (128 bits).

***

### Usage

```ts
import { randomSeedPhrase } from '@stacks/wallet-sdk';

// Generate a 24-word seed phrase (default)
const phrase = randomSeedPhrase();
// "warrior volume sport ... figure cake since"

// Generate a 12-word seed phrase
const shortPhrase = randomSeedPhrase(128);
```

#### Notes

- Uses `@scure/bip39` under the hood with the English wordlist.
- The returned string is a space-separated list of BIP39 mnemonic words.
- The deprecated alias `generateSecretKey` still works but should be replaced with `randomSeedPhrase`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/generate.ts#L30)**

***

### Signature

```ts
function randomSeedPhrase(entropy?: AllowedKeyEntropyBits): string;
```

***

### Returns

`string`

A space-separated BIP39 mnemonic phrase.

***

### Parameters

#### entropy (optional)

* **Type**: `128 | 256`
* **Default**: `256`

The number of bits of entropy. `256` produces a 24-word phrase, `128` produces a 12-word phrase.
