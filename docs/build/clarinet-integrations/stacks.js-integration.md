# Stacks.js Integration

Use Stacks.js to interact with your Clarinet devnet from JavaScript applications.

## What you'll learn

* Configure Stacks.js for a local devnet connection
* Make STX transfers between devnet accounts
* Call smart contract functions from JavaScript
* Deploy contracts programmatically

## Quickstart

{% stepper %}
{% step %}
#### Install Stacks.js packages

Add the required libraries to your frontend project:

```bash
npm install @stacks/transactions @stacks/network
```
{% endstep %}

{% step %}
#### Configure for devnet

Create a network helper:

```ts
import { StacksDevnet } from '@stacks/network';

export const devnet = new StacksDevnet({
  url: 'http://localhost:3999'
});

export const accounts = {
  deployer: {
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    key: 'cb3df38053d132895220b9ce471f6b676db5b9bf0b4adefb55f2118ece2478df01'
  },
  wallet1: {
    address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    key: '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801'
  }
};
```
{% endstep %}

{% step %}
#### Test STX transfers

Send a transfer between devnet accounts:

```ts
import { makeSTXTokenTransfer, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { devnet, accounts } from './devnet-config';

async function transferSTX() {
  const tx = await makeSTXTokenTransfer({
    amount: 1_000_000n,
    recipient: accounts.wallet1.address,
    senderKey: accounts.deployer.key,
    network: devnet,
    anchorMode: AnchorMode.Any,
  });

  const result = await broadcastTransaction(tx, devnet);
  console.log('Transaction ID:', result.txid);
}

transferSTX().catch(console.error);
```

Run the transfer with `ts-node stx-transfer.ts`.
{% endstep %}

{% step %}
#### Call smart contracts

Interact with contracts deployed on devnet:

```ts
import { makeContractCall, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { devnet, accounts } from './devnet-config';

async function callContract() {
  const tx = await makeContractCall({
    contractAddress: accounts.deployer.address,
    contractName: 'counter',
    functionName: 'increment',
    functionArgs: [],
    senderKey: accounts.wallet1.key,
    network: devnet,
    anchorMode: AnchorMode.Any,
  });

  await broadcastTransaction(tx, devnet);
}

async function readCount() {
  const response = await fetch(
    `${devnet.coreApiUrl}/v2/contracts/call-read/${accounts.deployer.address}/counter/get-count`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: accounts.wallet1.address,
        arguments: []
      })
    }
  );
  const data = await response.json();
  console.log(data);
}

callContract().catch(console.error);
readCount().catch(console.error);
```
{% endstep %}

{% step %}
#### Deploy contracts programmatically

Deploy a contract from your application code:

```ts
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { devnet, accounts } from './devnet-config';
import counterContract from './contracts/counter.clar?raw';

async function deployCounter() {
  const tx = await makeContractDeploy({
    contractName: 'counter',
    codeBody: counterContract,
    senderKey: accounts.deployer.key,
    network: devnet,
    anchorMode: AnchorMode.Any,
  });

  return broadcastTransaction(tx, devnet);
}

deployCounter().catch(console.error);
```
{% endstep %}
{% endstepper %}

## Common patterns

### Watching for transaction confirmation

Monitor when transactions are confirmed on devnet:

```ts
async function waitForTransaction(txid: string) {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const response = await fetch(
      `${devnet.coreApiUrl}/extended/v1/tx/${txid}`
    );

    const tx = await response.json();

    if (tx.tx_status === 'success') {
      console.log('Transaction confirmed!');
      return tx;
    }

    if (tx.tx_status === 'abort_by_response') {
      throw new Error(`Transaction failed: ${tx.tx_result.repr}`);
    }

    // Wait for next block
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Transaction timeout');
}
```

### Post conditions for safety

Add post conditions to ensure contract calls behave as expected:

```ts
import { Pc } from '@stacks/transactions';

const postConditions = [
  // Ensure sender's balance decreases by exactly the amount
  Pc.principal(accounts.wallet1.address)
    .willSendEq(1000000n)
    .ustx(),

  // Ensure recipient receives the amount
  Pc.principal(accounts.deployer.address)
    .willReceiveEq(1000000n)
    .ustx()
];

const tx = await makeSTXTokenTransfer({
  amount: 1000000n,
  recipient: accounts.deployer.address,
  senderKey: accounts.wallet1.key,
  network: devnet,
  postConditions,
  anchorMode: AnchorMode.Any,
});
```
