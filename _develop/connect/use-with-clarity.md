---
layout: learn
permalink: /:collection/:path.html
---
# Usage with Clarity
{:.no_toc}

With Connect, you can interact with the Stacks 2.0 blockchain. You can allow your users to send transactions and interact with smart contracts.

<div class="uk-card uk-card-default uk-card-body">
<h5 class="uk-card-title">Transaction signing is still in progress</h5>
<p>
  The Stacks 2.0 blockchain is still in testnet, and our web app integration is also still in beta. In order to use transaction signing in your application, you need to use the configuration `authOrigin` with `@blockstack/connect`.
</p>
<pre>
  <code>
    const options = {
      // your other options
      authOrigin: 'https://deploy-preview-301--stacks-authenticator.netlify.app'
    };
  </code>
</pre>
</div>

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

parameter | type | default | optional | description
---|---|---|---|---
contractAddress | string | | false | The Stacks address that published this contract
contractName | string | | false | The name that was used when publishing this contract
functionName | string | | false | The name of the function you're calling. This needs to be a [public function](/core/smart/clarityRef.html#define-public).
functionArgs | array | | false | The arguments you're calling the function with. You'll need to provide the Clarity type with each argument. See the below section for details.
userSession | UserSession | | true | A `UserSession` instance
appDetails | object | | false | A dictionary that includes `name` and `icon`
finished | function | | false | A callback that is fired when the transaction is signed and broadcasted. Your callback will receive an object back with a `txId` and a `txRaw`, both of which are strings.

#### Passing Clarity types with function arguments

To be able to serialize your transaction properly, you need to provide the appropriate Clarity type with each argument. These types are named the same as they are in Clarity. The `value` that you pass must be a string. The types you can pass are:

- `uint` - i.e. `"240"`
- `int` - i.e. `"12"`
- `bool` - can be "true", "false", "0" or "1"
- `buff` - i.e. `"asdf"`
- `principal` - This can be a contract principal, or a standard principal. Examples: `"ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ"` or `"ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ.my-contract"`.

Using these types, each argument is an object with the keys `type` and `value`. For example:

```js
const functionArguments = [
  {
    type: 'buff',
    value: 'hello, world'
  },
  {
    type: 'uint',
    value: '1'
  }
]
```

If you're using Typescript, these Clarity types can be imported as `ContractCallArgumentType` from `@blockstack/connect`.

### Usage in ES6 (non-React) apps

```ts
import { openContractCall } from '@blockstack/connect';

// Here's an example of options:
const myStatus = 'hey there';
const options = {
  contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
  contractName: 'status',
  functionName: 'write-status!',
  functionArgs: [
    {
      type: 'buff',
      value: myStatus,
    }
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