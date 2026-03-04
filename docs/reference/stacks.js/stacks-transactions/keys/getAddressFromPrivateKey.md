# getAddressFromPrivateKey

Creates a P2PKH Stacks address string from a private key.

***

### Usage

```ts
import { getAddressFromPrivateKey } from '@stacks/transactions';

const address = getAddressFromPrivateKey(
  'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603'
);
// 'SP...' (mainnet address by default)

const testnetAddress = getAddressFromPrivateKey(
  'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
  'testnet'
);
// 'ST...' (testnet address)
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L44)**

***

### Signature

```ts
function getAddressFromPrivateKey(
  privateKey: PrivateKey,
  network?: StacksNetworkName | StacksNetwork
): string;
```

***

### Returns

`string`

A Stacks address string encoded with c32check.

***

### Parameters

#### privateKey (required)

* **Type**: `PrivateKey` (`string | Uint8Array`)

Private key as a hex string or byte array. May be compressed (33 bytes) or uncompressed (32 bytes).

#### network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to derive the address for. Defaults to `'mainnet'`.
