# Contract Deployment

Deploy smart contracts to the Stacks blockchain.

## Overview

Contract deployment creates new smart contracts on the blockchain. Stacks.js provides tools to compile, deploy, and verify Clarity contracts programmatically. Deployments can be simple single contracts or complex multi-contract systems with dependencies.

## Basic contract deployment

Deploy a simple smart contract:

{% code title="deploy.ts" %}
```ts
import { 
  makeContractDeploy,
  broadcastTransaction,
} from '@stacks/transactions';
import { readFileSync } from 'fs';

async function deployContract() {
  
  // Read contract source code
  const contractSource = readFileSync('./contracts/my-contract.clar', 'utf-8');
  
  const txOptions = {
    contractName: 'my-contract',
    codeBody: contractSource,
    senderKey: 'your-private-key',
    network,
    fee: 10000, // Higher fee for deployment
  };
  
  const transaction = await makeContractDeploy(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction, network });
  
  console.log('Contract deployed!');
  console.log('Transaction ID:', broadcastResponse.txid);
  console.log('Contract address:', `${senderAddress}.${txOptions.contractName}`);
}
```
{% endcode %}
