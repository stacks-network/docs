# privateKeyToAddress

Converts a private key to a single-sig Stacks address string (encoded with c32check).

***

### Usage

```ts
import { privateKeyToAddress } from '@stacks/transactions';

const address = privateKeyToAddress(
  '73a2f291df5a8ce3ceb668a25ac7af45639513af7596d710ddf59f64f484fd2801'
);
// 'SP10J81WVGVB3M4PHQN4Q4G0R8586TBJH948RESDR'

// Testnet address
const testnetAddress = privateKeyToAddress(
  '73a2f291df5a8ce3ceb668a25ac7af45639513af7596d710ddf59f64f484fd2801',
  'testnet'
);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L243)**

***

### Signature

```ts
function privateKeyToAddress(
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

The private key to derive the address from.

#### network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to derive the address for. Defaults to `'mainnet'`.
