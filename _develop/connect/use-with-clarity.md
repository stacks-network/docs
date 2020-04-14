---
layout: learn
permalink: /:collection/:path.html
---
# Usage with Clarity
{:.no_toc}

With Connect, you can interact with the Stacks 2.0 blockchain. You can allow your users to send transactions and interact with smart contracts.

* TOC
{:toc}

## How it works

For your app's users to be able to execute a smart contract function, they need to sign and broadcast a transaction. It's important that users remain control of the private keys that sign these transactions. Connect provides an easy-to-use workflow that allows your users to securely sign transactions.

Connect allows you to open the authenticator with parameters indicating the details of the transaction - like the smart contract address, function name, and specific arguments. Your users get the chance to see these details, and then sign and broadcast the transaction in a single click. Their transaction will be securely signed and broadcasted onto the Stacks blockchain. After this is done, a callback is fired to allow you to update your app.

## Usage

### `ContractCallOptions`

When signing a transaction, you need to specify a few details. Here is the exact interface that describes what options you have:

```ts
export interface ContractCallOptions {
  contractAddress: string;
  functionName: string;
  contractName: string;
  functionArgs?: any[];
  authOrigin?: string;
  userSession?: UserSession;
  appDetails?: AuthOptions['appDetails'];
  finished?: (data: FinishedTxData) => void;
}
```

- `contractAddress`: The Stacks address that published this contract
- `contractName`: The name that was used when publishing this contract
- `functionName`: The name of the function you're calling. This needs to be a [public function](/core/smart/clarityRef.html#define-public).
- `functionArgs`: The arguments you're calling the function with
- `authOrigin`: _(optional)_ The URL for the authenticator. You only need to use this if you're developing the authenticator locally. Do not use in production
- `userSession`: _(optional)_ A `UserSession` instance
- `appDetails`: A dictionary that includes `name` and `icon`
- `finished`: A callback that is fired when the transaction is signed and broadcasted. Your callback will receive an object back with a `txId` and a `txRaw`.

### Usage in ES6 (non-React) apps

```ts
import { openContractCall } from '@blockstack/connect';

// Here's an example of options:
const options = {
  contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
  contractName: 'status',
  functionName: 'write-status!',
  functionArgs: [
    'Hello, World!',
  ],
  appDetails: {
    name: 'SuperApp',
    icon: 'https://example.com/icon.png'
  },
  finished: (data) => {
    console.log('TX ID:', data.txId);
    console.log('Raw TX:', data.txRaw);
  },
};

await openContractCall(opts);
```

### Usage in React Apps

Make sure you follow the [setup instructions](/develop/connect/get-started.html#in-react-apps) first. When you're using `useConnect`, you don't have to specify `appDetails` - we'll pick that up from your existing configuration.

```tsx
import { useConnect } from '@blockstack/connect';

const MyComponent = () => {
  const { doContractCall } = useConnect();

  const onClick = async () => {
    const opts = { /** See examples above */};
    await doContractCall(opts);
  }

  return (
    <span onClick={onClick}>Call my contract</span>
  );
};
```