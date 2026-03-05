# publicKeyToAddress

Converts a public key to a single-sig Stacks address string (encoded with c32check).

***

### Usage

```ts
import { publicKeyToAddress } from '@stacks/transactions';

// With network name
const address = publicKeyToAddress(
  '03ef788b3830c00abe8f64f62dc32fc863bc0b2cafeb073b6c8e1c7657d9c2c3ab'
);
// mainnet address by default

const testnetAddress = publicKeyToAddress(
  '03ef788b3830c00abe8f64f62dc32fc863bc0b2cafeb073b6c8e1c7657d9c2c3ab',
  'testnet'
);

// With explicit address version (legacy overload)
import { AddressVersion } from '@stacks/transactions';
const legacyAddress = publicKeyToAddress(
  AddressVersion.MainnetSingleSig,
  '03ef788b3830c00abe8f64f62dc32fc863bc0b2cafeb073b6c8e1c7657d9c2c3ab'
);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L260)**

***

### Signature

```ts
function publicKeyToAddress(
  publicKey: PublicKey,
  network?: StacksNetworkName | StacksNetwork
): string;

// Legacy overload
function publicKeyToAddress(
  version: AddressVersion,
  publicKey: PublicKey
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

The public key to derive the address from.

#### network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to derive the address for. Defaults to `'mainnet'`.
