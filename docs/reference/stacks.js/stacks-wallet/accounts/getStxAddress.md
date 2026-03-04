# getStxAddress

Returns the STX address for an account on a given network. Supports both a positional and an options-object call style.

***

### Usage

```ts
import { getStxAddress, generateWallet } from '@stacks/wallet-sdk';

const wallet = await generateWallet({
  secretKey: 'your 24-word seed phrase ...',
  password: 'password',
});

const account = wallet.accounts[0];

// Options object style
const mainnetAddress = getStxAddress({ account, network: 'mainnet' });
// 'SP...'

const testnetAddress = getStxAddress({ account, network: 'testnet' });
// 'ST...'

// Positional style
const address = getStxAddress(account, 'mainnet');
// 'SP...'
```

#### Notes

- Defaults to `'mainnet'` if no network is specified.
- Mainnet addresses start with `SP`, testnet/devnet addresses start with `ST`.
- Uses `getAddressFromPrivateKey` from `@stacks/transactions` internally.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/account.ts#L31)**

***

### Signature

```ts
function getStxAddress(opts: { account: Account } & NetworkParam): string;
function getStxAddress(account: Account, network?: StacksNetworkName | StacksNetwork): string;
```

***

### Returns

`string`

A Stacks address string (e.g. `SP...` or `ST...`).

***

### Parameters

#### Options object style

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `account` | `Account` | Yes | The account to get the address for. |
| `network` | `StacksNetworkName \| StacksNetwork` | No | The network (default: `'mainnet'`). |

#### Positional style

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `account` | `Account` | Yes | The account to get the address for. |
| `network` | `StacksNetworkName \| StacksNetwork` | No | The network (default: `'mainnet'`). |
