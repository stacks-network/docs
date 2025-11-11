# Contract Calls

Contract calls allow you to execute state-changing functions in smart contracts. Unlike read-only calls, these create transactions that must be signed and broadcast to the network.

## Basic contract call

Execute a simple contract function by creating a transaction with the required parameters.

```ts
import { 
  makeContractCall,
  broadcastTransaction,
  AnchorMode
} from '@stacks/transactions';

async function callContract() {
  const txOptions = {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'my-contract',
    functionName: 'transfer',
    functionArgs: [],
    senderKey: 'your-private-key',
    network: 'testnet',
    anchorMode: AnchorMode.Any,
  };
  
  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction });
  
  console.log('Transaction ID:', broadcastResponse.txid);
}
```

The `makeContractCall` function creates a transaction that will execute the specified function when confirmed on-chain.

## Passing function arguments

Most contract functions require arguments. Use Clarity value constructors to match the expected parameter types.

```ts
import { 
  Cl,
  makeContractCall,
} from '@stacks/transactions';

const functionArgs = [
  Cl.principal('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'), // recipient
  Cl.uint(1000000), // amount
  Cl.buffer(Buffer.from('Transfer memo', 'utf-8')), // memo
];

const txOptions = {
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'sip-010-token',
  functionName: 'transfer',
  functionArgs,
  senderKey: 'your-private-key',
  network: "testnet",
};

const transaction = await makeContractCall(txOptions);
const result = await broadcastTransaction({ transaction });
console.log('Transaction ID:', result.txid);
```

Each Clarity type has a corresponding constructor function that ensures proper encoding for the blockchain.

### Complex argument types

```ts
// Tuple arguments
const userInfo = Cl.tuple({
  name: Cl.string('Alice'),
  age: Cl.uint(30),
  active: Cl.bool(true),
});

// List arguments
const addresses = Cl.list([
  Cl.principal('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
  Cl.principal('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'),
]);
```

Optional and response values have dedicated constructors for proper type safety.

```ts
// Optional values
const optionalValue = Cl.some(Cl.uint(42)); // (some 42)
const noValue = Cl.none(); // none

// Response values
const successResponse = Cl.ok(Cl.uint(100));
const errorResponse = Cl.err(Cl.uint(404));
```

## Contract call with STX transfer

Some contracts require STX to be sent along with the function call, such as when minting NFTs or paying for services.

```ts
async function mintNFT() {
  const mintPrice = 1000000; // 1 STX
  
  const txOptions = {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'nft-collection',
    functionName: 'mint',
    functionArgs: [],
    senderKey: 'your-private-key',
    network: new StacksTestnet(),
    anchorMode: AnchorMode.Any,
    // Attach STX to the contract call
    amount: mintPrice,
  };
  
  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, network);
}
```

## Handling contract responses

Process transaction results and contract responses:

```ts
async function executeAndMonitor() {
  // Execute contract call
  const transaction = await makeContractCall({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'my-contract',
    functionName: 'process',
    functionArgs: [uintCV(100)],
    senderKey: 'your-private-key',
    network: new StacksTestnet(),
    anchorMode: AnchorMode.Any,
  });
  
  const broadcastResponse = await broadcastTransaction(transaction, network);
  const txId = broadcastResponse.txid;
  
  // Wait for confirmation
  const txInfo = await waitForConfirmation(txId, network);
  
  // Check transaction result
  if (txInfo.tx_status === 'success') {
    console.log('Contract returned:', txInfo.tx_result);
    // Parse the result based on expected return type
  } else {
    console.error('Transaction failed:', txInfo.tx_result);
  }
}

async function waitForConfirmation(txId: string, network: StacksNetwork) {
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    const response = await fetch(
      `${network.coreApiUrl}/extended/v1/tx/${txId}`
    );
    const txInfo = await response.json();
    
    if (txInfo.tx_status === 'success' || txInfo.tx_status === 'abort_by_response') {
      return txInfo;
    }
    
    await new Promise(resolve => setTimeout(resolve, 10000));
    attempts++;
  }
  
  throw new Error('Transaction confirmation timeout');
}
```

## Multi-step contract interactions

{% stepper %}
{% step %}
### Approve spending

First, create and broadcast an approval transaction.

```ts
const approveTx = await makeContractCall({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'token',
  functionName: 'approve',
  functionArgs: [
    standardPrincipalCV('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'),
    uintCV(1000000),
  ],
  senderKey: 'your-private-key',
  network: new StacksTestnet(),
  anchorMode: AnchorMode.Any,
});

const approveResult = await broadcastTransaction(approveTx, network);
await waitForConfirmation(approveResult.txid, network);
```

This step ensures the spender is authorized before subsequent actions.
{% endstep %}

{% step %}
### Execute swap after approval

After the approval is confirmed, execute the swap transaction.

```ts
const swapTx = await makeContractCall({
  contractAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  contractName: 'dex',
  functionName: 'swap-tokens',
  functionArgs: [
    standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
    uintCV(1000000),
  ],
  senderKey: 'your-private-key',
  network: new StacksTestnet(),
  anchorMode: AnchorMode.Any,
});

return broadcastTransaction(swapTx, network);
```

This step performs the token swap that depends on the prior approval.
{% endstep %}
{% endstepper %}
