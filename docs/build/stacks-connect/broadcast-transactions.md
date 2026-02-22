# Broadcast Transactions

The process of broadcasting transactions is fundamental for interacting with blockchains, whether you're transferring tokens, deploying contracts, or executing contract functions.

In this guide you will:

* Install the required packages
* Connect to a user's wallet
* Sign and broadcast different transaction types
* Handle transaction results

## Setup and installation

Install the required packages to start building and broadcasting transactions.

{% tabs %}
{% tab title="npm" %}
```bash
npm install @stacks/connect @stacks/transactions
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add @stacks/connect @stacks/transactions
```
{% endtab %}

{% tab title="pnpm" %}
```bash
pnpm add @stacks/connect @stacks/transactions
```
{% endtab %}
{% endtabs %}

## Connect to a user's wallet

Before signing transactions, users need to connect their wallet to your application. Use the `connect` function to initiate a wallet connection:

```ts
import { connect, isConnected } from '@stacks/connect';

async function connectWallet() {
  if (!isConnected()) {
    const response = await connect();
    console.log('Connected with addresses:', response);
  }
}
```

## Sign and broadcast transactions

There are three common transaction flows you can build:

{% stepper %}
{% step %}
**STX transfer**

Use `stx_transferStx` to send tokens:

```ts
import { request } from '@stacks/connect';

async function transferStx() {
  const response = await request('stx_transferStx', {
    recipient: 'ST2EB9WEQNR9P0K28D2DC352TM75YG3K0GT7V13CV',
    amount: '100',
    memo: 'Reimbursement',
    network: 'devnet' // or "testnet", "mainnet"
  });

  console.log('Transaction ID:', response.txId);
}
```
{% endstep %}

{% step %}
**Contract deployment**

Deploy a contract with `stx_deployContract`:

```ts
import { request } from '@stacks/connect';

async function deployContract() {
  const codeBody = '(define-public (say-hi) (ok "hello world"))';

  const response = await request('stx_deployContract', {
    name: 'my-contract',
    clarityCode: codeBody,
    clarityVersion: 4,
    network: 'devnet' // or "testnet", "mainnet"
  });

  console.log('Transaction ID:', response.txId);
}
```

{% hint style="info" %}
Contracts deploy to the Stacks address of the connected wallet.
{% endhint %}
{% endstep %}

{% step %}
**Contract execution**

Call contract functions with `stx_callContract`:

```clarity
(define-public (say-hi)
  (print "hi")
  (ok u0)
)
```

```ts
import { request } from '@stacks/connect';

async function callContract() {
  const response = await request('stx_callContract', {
    contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
    contractName: 'my-contract',
    functionName: 'say-hi',
    functionArgs: [],
    network: 'devnet' // or "testnet", "mainnet"
  });

  console.log('Transaction ID:', response.txId);
}
```

When passing arguments, construct Clarity values via `Cl`:

```ts
import { Cl } from '@stacks/transactions';

const functionArgs = [
  Cl.uint(123),
  Cl.stringAscii('hello'),
  Cl.standardPrincipalCV('ST1X..'),
];
```
{% endstep %}
{% endstepper %}

## Handle transaction results

When a transaction is signed and broadcast, the `request` method returns a response object containing information about the transaction:

```ts
interface TransactionResponse {
  txId: string;        // The transaction ID
  txRaw: string;       // The raw transaction hex
}
```

You can use the transaction ID to create a link to view the transaction in the explorer:

```ts
import { request } from '@stacks/connect';

async function handleTransaction() {
  const response = await request('stx_transferStx', {
    recipient: 'ST2EB9WEQNR9P0K28D2DC352TM75YG3K0GT7V13CV',
    amount: '100',
    network: 'devnet' // or "testnet", "mainnet"
  });

  const explorerUrl = `https://explorer.stacks.co/txid/${response.txId}`;
  console.log('View transaction in explorer:', explorerUrl);
}
```
