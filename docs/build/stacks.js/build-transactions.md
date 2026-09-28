# Build Transactions

Learn how to build transactions programmatically and control each field yourself.

## Objectives

* Build signed transactions for immediate broadcast
* Create unsigned transactions for multi-signature workflows
* Implement sponsored transactions to pay fees for users

## Transaction types

Stacks has five transaction types: token transfer, contract deploy, contract call, coinbase, and tenure change. Apps build the first three. Miners produce coinbase and tenure-change transactions. See [Technical Specifications](https://docs.stacks.co/learn/network-fundamentals/technical-specifications#transactions) for the full list.

Unsigned, sponsored, and multi-signature describe how a transaction is authorized, and apply to any of the three. They are covered further down this page.

```ts
// STX Transfer - Send native tokens
const stxTransfer = await makeSTXTokenTransfer(options);

// Contract Deployment - Deploy Clarity contracts  
const deployment = await makeContractDeploy(options);

// Contract Call - Execute contract functions
const contractCall = await makeContractCall(options);

// Each transaction type accepts similar base options:
interface TransactionOptions {
  senderKey: string;        // Private key for signing
  network: string;          // 'mainnet' or 'testnet'
  fee?: bigint;             // Manual fee in microSTX
  nonce?: bigint;           // Manual nonce
}
```

`StacksTransactionWire` is the low-level transaction class that represents a **Stacks transaction in its exact wire (on-chain) format**. It is responsible for constructing, signing, verifying, and serializing transactions exactly as they are transmitted over the network and validated by Stacks nodes.

{% code expandable="true" %}
```typescript
export declare class StacksTransactionWire {
    transactionVersion: TransactionVersion;
    chainId: ChainId;
    auth: Authorization;
    payload: PayloadWire;
    postConditionMode: PostConditionMode;
    postConditions: LengthPrefixedList<PostConditionWire>;
    anchorMode: AnchorMode;
    constructor({ auth, payload, postConditions, postConditionMode, transactionVersion, chainId, network, }: {
        payload: PayloadInput;
        auth: Authorization;
        postConditions?: LengthPrefixedList<PostConditionWire>;
        postConditionMode?: PostConditionMode;
        transactionVersion?: TransactionVersion;
        chainId?: ChainId;
    } & NetworkParam);
    signBegin(): string;
    verifyBegin(): string;
    verifyOrigin(): string;
    signNextOrigin(sigHash: string, privateKey: PrivateKey): string;
    signNextSponsor(sigHash: string, privateKey: PrivateKey): string;
    appendPubkey(publicKey: PublicKey): void;
    appendPubkey(publicKey: PublicKeyWire): void;
    signAndAppend(condition: SpendingConditionOpts, curSigHash: string, authType: AuthType, privateKey: PrivateKey): string;
    txid(): string;
    setSponsor(sponsorSpendingCondition: SpendingConditionOpts): void;
    setFee(amount: IntegerType): void;
    setNonce(nonce: IntegerType): void;
    setSponsorNonce(nonce: IntegerType): void;
    serialize(): Hex;
    serializeBytes(): Uint8Array;
}
```
{% endcode %}

## Building signed transactions

Signed transactions are ready to broadcast immediately. The private key signs during creation.

{% stepper %}
{% step %}
**STX token transfer**

```ts
import { makeSTXTokenTransfer, broadcastTransaction } from '@stacks/transactions';

const transaction = await makeSTXTokenTransfer({
  recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  amount: 1000000n, // 1 STX = 1,000,000 microSTX
  senderKey: 'your-private-key-hex',
  network: 'testnet',
  memo: 'Payment for services', // Optional memo (max 34 bytes)
});

const result = await broadcastTransaction({ transaction });
console.log('Transaction ID:', result.txid);
```
{% endstep %}

{% step %}
**Smart contract deployment**

```ts
import { makeContractDeploy, ClarityVersion } from '@stacks/transactions';

const contractCode = `
(define-public (say-hello)
  (ok "Hello, Stacks!"))
`;

const transaction = await makeContractDeploy({
  contractName: 'hello-world',
  codeBody: contractCode,
  senderKey: 'your-private-key-hex',
  network: 'testnet',
  clarityVersion: ClarityVersion.Clarity6,
});

const result = await broadcastTransaction({ transaction });
```

Set `clarityVersion` explicitly. If the option is left out, `makeContractDeploy` fills in `ClarityVersion.Clarity4` and the contract deploys as Clarity 4.
{% endstep %}

{% step %}
**Contract function calls**

```ts
import { makeContractCall, Cl } from '@stacks/transactions';

const transaction = await makeContractCall({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'counter',
  functionName: 'increment',
  functionArgs: [Cl.uint(1)],
  senderKey: 'your-private-key-hex',
  network: 'testnet',
});
```
{% endstep %}
{% endstepper %}

## Unsigned transactions

Create unsigned transactions for multi-signature workflows or offline signing.

```ts
import { makeUnsignedSTXTokenTransfer, TransactionSigner, privateKeyToPublic, broadcastTransaction } from '@stacks/transactions';

// Create unsigned transaction
const publicKey = privateKeyToPublic('your-private-key');

const unsignedTx = await makeUnsignedSTXTokenTransfer({
  recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  amount: 1000000n,
  publicKey,
  network: 'testnet',
});

// Sign separately
const signer = new TransactionSigner(unsignedTx);
signer.signOrigin('your-private-key');

const signedTx = signer.transaction;
let result = await broadcastTransaction({ transaction: signedTx });
```

## Sponsored transactions

Let one account pay fees for another account's transaction.

```ts
// User creates sponsored transaction
const userTx = await makeContractCall({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  functionName: 'transfer',
  functionArgs: [Cl.principal('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')],
  publicKey: 'user-public-key',
  sponsored: true,
  fee: 0n, // User doesn't pay
  network: 'testnet',
});

// Sponsor completes and pays
import { sponsorTransaction } from '@stacks/transactions';

const sponsoredTx = await sponsorTransaction({
  transaction: userTx,
  sponsorPrivateKey: 'sponsor-private-key',
  fee: 2000n, // Sponsor pays the fee
  network: 'testnet',
});

const result = await broadcastTransaction({ transaction: sponsoredTx });
```

## Multi-signature transactions

Require more than one signature before a transaction is valid.

```ts
// Create multi-sig transaction (2-of-3)
const publicKeys = [publicKey1, publicKey2, publicKey3];

const multiSigTx = await makeUnsignedSTXTokenTransfer({
  recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  amount: 5000000n,
  numSignatures: 2, // Require 2 of 3
  publicKeys,
  network: 'testnet',
});

// Collect signatures
const signer = new TransactionSigner(multiSigTx);
signer.signOrigin(privateKey1); // First signature
signer.appendOrigin(privateKey2); // Second signature

const signedTx = signer.transaction;
```

## Working with Clarity values

Use the `Cl` helper for type-safe contract arguments.

```ts
import { Cl } from '@stacks/transactions';

const functionArgs = [
  // Primitives
  Cl.uint(42),
  Cl.int(-10),
  Cl.bool(true),
  Cl.stringUtf8('Hello 世界'),
  Cl.stringAscii('Hello World'),
  
  // Principals
  Cl.standardPrincipal('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'),
  Cl.contractPrincipal('ST123...', 'my-contract'),
  
  // Composites
  Cl.list([Cl.uint(1), Cl.uint(2), Cl.uint(3)]),
  Cl.tuple({ 
    name: Cl.stringUtf8('Alice'),
    age: Cl.uint(30)
  }),
  
  // Optionals and responses
  Cl.some(Cl.uint(42)),
  Cl.none(),
  Cl.ok(Cl.uint(200)),
  Cl.error(Cl.uint(404))
];
```

## Post-conditions

Add safety constraints to protect users from unexpected transfers.

```ts
import { Pc, PostConditionMode } from '@stacks/transactions';

const transaction = await makeContractCall({
  // ... other options
  postConditions: [
    // Sender must send exactly 1 STX
    Pc.principal('ST1ADDRESS...')
      .willSendEq(1000000n)
      .ustx(),
    
    // Contract must transfer tokens
    Pc.principal('ST2CONTRACT...')
      .willSendGte(100n)
      .ft('ST2CONTRACT.token-contract', 'my-token')
  ],
  postConditionMode: PostConditionMode.Deny, // Strict mode
});
```

Beyond STX, fungible token, and NFT conditions, post-conditions can also guard staking and PoX actions (`.ustxToLock()` and `.willNotPerformPox()`, from SIP-045, Epoch 4.0 and later) and use `PostConditionMode.Originator` to protect only the sender's assets (SIP-040). See the [post-conditions guide](../post-conditions/implementation.md) for details.

PoX-5 entrypoints are better reached through [`@stacks/bitcoin-staking`](https://www.npmjs.com/package/@stacks/bitcoin-staking) than through hand-written contract calls. `buildRegisterForBond` and its siblings construct the arguments and post-conditions for you, and `fetchEligibleRegisterForBond` re-runs the contract's own guard checks read-only before you broadcast.

## Fee estimation

Estimate a fee before broadcasting.

Omit `fee` and the builder estimates it with `fetchFeeEstimate` before signing. To set the fee yourself, estimate it on an unsigned transaction, then sign: changing the fee after signing invalidates the signature.

```ts
import {
  makeUnsignedSTXTokenTransfer,
  fetchFeeEstimate,
  TransactionSigner,
  privateKeyToPublic,
  broadcastTransaction,
} from '@stacks/transactions';

// Build the transaction unsigned
const tx = await makeUnsignedSTXTokenTransfer({
  recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  amount: 1000000n,
  publicKey: privateKeyToPublic(privateKey),
  network: 'testnet',
  fee: 0n, // Placeholder, replaced below
});

// Estimate and set the fee
const fee = await fetchFeeEstimate({ transaction: tx });
tx.setFee(fee);

// Sign, then broadcast
const signer = new TransactionSigner(tx);
signer.signOrigin(privateKey);

const result = await broadcastTransaction({ transaction: signer.transaction });
```
