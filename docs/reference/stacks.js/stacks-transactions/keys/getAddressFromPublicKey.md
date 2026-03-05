# getAddressFromPublicKey

Creates a P2PKH Stacks address string from a public key.

***

### Usage

```ts
import { getAddressFromPublicKey } from '@stacks/transactions';

const address = getAddressFromPublicKey(
  '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa'
);
// 'SP...' (mainnet address by default)

const testnetAddress = getAddressFromPublicKey(
  '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa',
  'testnet'
);
// 'ST...' (testnet address)
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L55)**

***

### Signature

```ts
function getAddressFromPublicKey(
  publicKey: PublicKey,
  network?: StacksNetworkName | StacksNetwork
): string;
```

***

### Returns

`string`

A Stacks address string encoded with c32check.

***

### Parameters

#### publicKey (required)

* **Type**: `PublicKey` (`string | Uint8Array`)

Public key as a hex string or byte array. May be compressed or uncompressed.

#### network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to derive the address for. Defaults to `'mainnet'`.
