# Bridging USDCx

<div data-with-frame="true"><figure><img src="../.gitbook/assets/bridging-usdcx.png" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
Current work is underway to abstract this entire flow via Circle's Bridge Kit SDK.
{% endhint %}

## Intro

[USDCx](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/bridging/usdcx) on Stacks opens up stablecoin liquidity into its decentralized ecosystem via Circle's xReserve protocol. This enables asset transfers from Ethereum and enhances Stacks' DeFi offerings. Users access Stacks' DeFi, maintaining stable assets, increasing liquidity, and providing a reliable option for transactions and investments.

### tl;dr

* Bridging USDC onto Stacks enables stablecoin liquidity across the Stacks DeFi ecosystem.
* Deposits are initiated on Ethereum and automatically minted on Stacks, while withdrawals are initiated on Stacks and settled on Ethereum.
* The bridging process is powered by Circle’s xReserve and the Stacks attestation service.

### Steps

**Deposit**

1. Setup USDC and xReserve's Solidity contract ABIs
2. Setup wallet and public clients to communicate with the Ethereum network
3. Check native ETH and USDC balances on a user's wallet.
4. Prepare deposit params before initiating deposit request.
5. Approve xReserve as a spender of your USDC.
6. Execute deposit to the remote chain Stacks.

**Withdrawal**

1. Prepare contract call arguments
2. Invoke `burn` function from the `.usdcx-v1` contract

### Key Tools To Use

* [viem](https://viem.sh/) - A Typescript-first library that interfaces with Ethereum.
* [stacks.js](/broken/pages/dH5waQhE6Vb7rhcrUG7z) - A js library that helps developers build Stacks apps by handling transactions, wallet authentication, and smart contract interactions.
* [Circle Faucet](https://faucet.circle.com/) - Get testnet USDC
* [Ethereum Sepolia faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) - Get testnet ETH

***

## Complete Code

If you want to jump straight to the full implementation, the complete working code used in this guide is shown below.

{% tabs %}
{% tab title="index.ts" %}
This script bridges USDC from Ethereum Sepolia testnet to Stacks testnet by first approving the xReserve contract to spend USDC, then calling `depositToRemote` to initiate the cross-chain transfer. It encodes the Stacks recipient address into the bytes32 format required by the Ethereum contract and submits both transactions to the Sepolia network. The Stacks attestation service will receive this event and mint the equivalent amount to the specified Stacks address.

<pre class="language-typescript" data-expandable="true"><code class="lang-typescript">import "dotenv/config";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
  pad
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { bytes32FromBytes, remoteRecipientCoder } from "./helpers";
import { makeContractCall, Cl, Pc, broadcastTransaction } from '@stacks/transactions'

// ============ Configuration constants ============
const config = {
  // Public Ethereum Sepolia RPC and your private wallet key
  ETH_RPC_URL: process.env.RPC_URL || "https://ethereum-sepolia.publicnode.com",
  PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY, 

  // Contract addresses on testnet
  X_RESERVE_CONTRACT: "008888878f94C0d87defdf0B07f46B93C1934442",
  ETH_USDC_CONTRACT: "1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  STACKS_USDC:
    "0x00000000061a6d78de7b0625dfbfc16c3a8a5735f6dc3dc3f2ce057573646378",

  // Deposit parameters for Stacks
  STACKS_DOMAIN: 10003, // Stacks domain ID
  ETHEREUM_DOMAIN: 0, // Ethereum domain ID
  STACKS_RECIPIENT: "ST1F1M4YP67NV360FBYR28V7C599AC46F8C4635SH", // Address to receive minted USDCx on Stacks
  ETHEREUM_RECIPIENT: "9F685cc614148f35efC238F5DFC977e08ed6bA86", // Address to receive withdrawn USDC on Ethereum
  DEPOSIT_AMOUNT: "1.00",
  MAX_FEE: "0",
};

// ============ Contract ABIs ============
const X_RESERVE_ABI = [
  {
    name: "depositToRemote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "value", type: "uint256" },
      { name: "remoteDomain", type: "uint32" },
      { name: "remoteRecipient", type: "bytes32" },
      { name: "localToken", type: "address" },
      { name: "maxFee", type: "uint256" },
      { name: "hookData", type: "bytes" },
    ],
    outputs: [],
  },
];

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
];


<strong>async function deposit() {
</strong>  if (!config.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY must be set in your .env file");
  }

  // Set up wallet and wallet provider
  const account = privateKeyToAccount(config.PRIVATE_KEY);
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(config.ETH_RPC_URL),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(config.ETH_RPC_URL),
  });

  console.log(`Ethereum wallet address: ${account.address}`);

  // Check native ETH balance
  const nativeBalance = await publicClient.getBalance({
    address: account.address,
  });
    console.log(
    `Native balance: ${nativeBalance.toString()} wei (${(
      Number(nativeBalance) / 1e18
    ).toFixed(6)} ETH)`,
  );
  if (nativeBalance === 0n)
    throw new Error("Insufficient native balance for gas fees");

  // Prepare deposit params (USDC has 6 decimals)
  const value = parseUnits(config.DEPOSIT_AMOUNT, 6);
  const maxFee = parseUnits(config.MAX_FEE, 6);
  const remoteRecipient = bytes32FromBytes(remoteRecipientCoder.encode(config.STACKS_RECIPIENT));
  const hookData = "0x";

  console.log(
    `\nDepositing ${config.DEPOSIT_AMOUNT} USDC to Stacks recipient: ${config.STACKS_RECIPIENT}`,
  );

  // Check token balance
  const usdcBalance = await publicClient.readContract({
    address: `0x${config.ETH_USDC_CONTRACT}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [account.address],
  });
  console.log(
    `USDC balance: ${usdcBalance.toString()} (${(
      Number(usdcBalance) / 1e6
    ).toFixed(6)} USDC)`,
  );
  if (usdcBalance &#x3C; value) {
    throw new Error(
      `Insufficient USDC balance. Required: ${(Number(value) / 1e6).toFixed(
        6,
      )} USDC`,
    );
  }

  // Approve xReserve to spend USDC
  const approveTxHash = await client.writeContract({
    address: `0x${config.ETH_USDC_CONTRACT}`,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [`0x${config.X_RESERVE_CONTRACT}`, value],
  });
  console.log("Approval tx hash:", approveTxHash);
  console.log("Waiting for approval confirmation...");

  await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
  console.log("✅ Approval confirmed");

  // Deposit transaction
  const depositTxHash = await client.writeContract({
    address: `0x${config.X_RESERVE_CONTRACT}`,
    abi: X_RESERVE_ABI,
    functionName: "depositToRemote",
    args: [
      value,
      config.STACKS_DOMAIN,
      remoteRecipient,
      `0x${config.ETH_USDC_CONTRACT}`,
      maxFee,
      hookData,
    ],
  });

  console.log("Deposit tx hash:", depositTxHash);
  console.log(
    "✅ Transaction submitted. You can track this on Sepolia Etherscan.",
  );
}

<strong>async function withdraw() {
</strong>  let amount = 4800000 // in micro USDCx (6 decimals)

  let functionArgs = [
    Cl.uint(amount), // amount in micro USDC
    Cl.uint(config.ETHEREUM_DOMAIN), // native domain for Ethereum
    Cl.bufferFromHex(pad(`0x${config.ETHEREUM_RECIPIENT}`, { size: 32 })) // native recipient
  ]

  let postCondition_1 = Pc.principal(config.STACKS_RECIPIENT)
    .willSendEq(amount)
    .ft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx', 'usdcx-token')

  let transaction = await makeContractCall({
    contractName: 'usdcx-v1',
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    functionName: 'burn',
    functionArgs,
    network: 'testnet',
    postConditions: [postCondition_1],
    postConditionMode: 'deny',
    senderKey: process.env.STACKS_PRIVATE_KEY,
  })

  let result = await broadcastTransaction({transaction, network: 'testnet'})
}
</code></pre>
{% endtab %}

{% tab title="helpers.ts" %}
This code converts a Stacks address into a 32-byte hex string format required by Ethereum contracts for cross-chain messaging. It encodes the address by left-padding 11 zero bytes, then adding the version byte and 20-byte hash160 from the Stacks address, resulting in a bytes32 value that Ethereum can process.

{% code expandable="true" %}
```typescript
import * as P from 'micro-packed';
import { createAddress, addressToString, AddressVersion, StacksWireType } from '@stacks/transactions';
import { hex } from '@scure/base';
import { type Hex, pad, toHex, toBytes } from "viem";

export const remoteRecipientCoder = P.wrap<string>({
  encodeStream(w, value: string) {
    // createAddress
    const address = createAddress(value);
    P.bytes(11).encodeStream(w, new Uint8Array(11).fill(0));
    P.U8.encodeStream(w, address.version);
    P.bytes(20).encodeStream(w, hex.decode(address.hash160));
  },
  decodeStream(r) {
    // left pad
    P.bytes(11).decodeStream(r);
    // 1 version byte
    const version = P.U8.decodeStream(r);
    // 20 hash bytes
    const hash = P.bytes(20).decodeStream(r);
    return addressToString({
      hash160: hex.encode(hash),
      version: version as AddressVersion,
      type: StacksWireType.Address,
    });
  },
});

export function bytes32FromBytes(bytes: Uint8Array): Hex {
  return toHex(pad(bytes, { size: 32 }));
}

/** This is the value you use for remote recipient **/
const remoteRecipient = bytes32FromBytes(remoteRecipientCoder.encode("ST1F1M4YP67NV360FBYR28V7C599AC46F8C4635SH"))
console.log("remoteRecipient:", remoteRecipient);
```
{% endcode %}
{% endtab %}

{% tab title=".env" %}
```dotenv
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
```
{% endtab %}
{% endtabs %}

***

## Walkthrough (Deposit)

Before beginning, make sure you:

* Create a wallet on Ethereum Sepolia.
* Create a Stacks testnet wallet.

{% stepper %}
{% step %}
### Configure environment variables

In the project root, create a `.env` file and set your Ethereum Sepolia wallet private key by replacing `<YOUR_PRIVATE_KEY>`. If you're working on the frontend with a browser wallet extension, this step won't be needed.

{% code title=".env" %}
```dotenv
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
```
{% endcode %}

{% hint style="danger" %}
**Warning:** This is strictly for testing purposes. **Never share your private key**.
{% endhint %}
{% endstep %}

{% step %}
### Import dependencies and define config constants

In this step, you’ll import the required dependencies and define the script’s configuration constants.

Create a file for the main script and import the below dependencies.

{% code title="index.ts" %}
```typescript
import "dotenv/config";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { bytes32FromBytes, remoteRecipientCoder } from "./helpers";
```
{% endcode %}

Configuration constants define the RPC endpoint, private key, contract addresses for the xReserve bridge and USDC token, and transfer parameters including the Stacks recipient address and deposit amount.

{% hint style="info" %}
You can examine the USDC, xReserve, and the other contracts related to USDCx on Stacks [here](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/bridging/usdcx/contracts).
{% endhint %}

Replace `YOUR_STACKS_TESTNET_ADDRESS` with the wallet that should receive minted USDCx on Stacks testnet.

{% hint style="success" %}
Stacks' domain id, used for the xReserve protocol, of `10003` is constant for all networks.
{% endhint %}

<pre class="language-typescript" data-title="index.ts" data-expandable="true"><code class="lang-typescript">// --snip--

// ============ Configuration constants ============
const config = {
  // Public Ethereum Sepolia RPC and your private wallet key
  ETH_RPC_URL: process.env.RPC_URL || "https://ethereum-sepolia.publicnode.com",
  PRIVATE_KEY: process.env.PRIVATE_KEY, 

  // Contract addresses on testnet
  X_RESERVE_CONTRACT: "008888878f94C0d87defdf0B07f46B93C1934442",
  ETH_USDC_CONTRACT: "1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",

  // Deposit parameters for Stacks
  STACKS_DOMAIN: 10003, // Stacks domain ID
<strong>  STACKS_RECIPIENT: "YOUR_STACKS_TESTNET_ADDRESS", // Address to receive minted USDCx on Stacks
</strong>  DEPOSIT_AMOUNT: "1.00",
  MAX_FEE: "0",
};
</code></pre>
{% endstep %}

{% step %}
### Setup contract ABIs

This adds xReserve and ERC-20 ABI fragments which tell Viem how to format and send the contract calls when the script runs.

{% code title="index.ts" expandable="true" %}
```typescript
// --snip--

// ============ Contract ABIs ============
const X_RESERVE_ABI = [
  {
    name: "depositToRemote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "value", type: "uint256" },
      { name: "remoteDomain", type: "uint32" },
      { name: "remoteRecipient", type: "bytes32" },
      { name: "localToken", type: "address" },
      { name: "maxFee", type: "uint256" },
      { name: "hookData", type: "bytes" },
    ],
    outputs: [],
  },
];

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
];
```
{% endcode %}
{% endstep %}

{% step %}
### Setup wallet and public clients

Creates a wallet account from the private key and initializes both a wallet client (for signing transactions) and a public client (for reading blockchain data) connected to the Sepolia testnet.

{% code title="index.ts" expandable="true" %}
```typescript
// --snip--

// Set up wallet and wallet provider
const account = privateKeyToAccount(config.PRIVATE_KEY);
const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(config.ETH_RPC_URL),
});

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(config.ETH_RPC_URL),
});
```
{% endcode %}
{% endstep %}

{% step %}
### Check native ETH balance

Checks the wallet's native ETH balance to ensure there's enough to pay for gas fees, displaying it in both wei and ETH, and throws an error if the balance is zero.

{% code title="index.ts" expandable="true" %}
```typescript
// --snip--

// Check native ETH balance
const nativeBalance = await publicClient.getBalance({
  address: account.address,
});
  console.log(
  `Native balance: ${nativeBalance.toString()} wei (${(
    Number(nativeBalance) / 1e18
  ).toFixed(6)} ETH)`,
);
if (nativeBalance === 0n)
  throw new Error("Insufficient native balance for gas fees");
```
{% endcode %}
{% endstep %}

{% step %}
### Prepare deposit params

Prepares the deposit parameters by converting USDC amounts to the correct decimal format (6 decimals), encoding the Stacks recipient address into bytes32 format, and setting empty hookData for the cross-chain transaction.

{% hint style="info" %}
Stacks addresses need to be reformatted and encoded to bytes32 on the Ethereum side. Special helper methods are needed for this encoding.
{% endhint %}

{% tabs %}
{% tab title="index.ts" %}
<pre class="language-typescript"><code class="lang-typescript">// --snip--

// Prepare deposit params (USDC has 6 decimals)
const value = parseUnits(config.DEPOSIT_AMOUNT, 6);
const maxFee = parseUnits(config.MAX_FEE, 6);
<strong>const remoteRecipient = bytes32FromBytes(remoteRecipientCoder.encode(config.STACKS_RECIPIENT));
</strong>const hookData = "0x";
</code></pre>
{% endtab %}

{% tab title="helpers.ts" %}
{% code expandable="true" %}
```typescript
import * as P from 'micro-packed';
import { createAddress, addressToString, AddressVersion, StacksWireType } from '@stacks/transactions';
import { hex } from '@scure/base';
import { type Hex, pad, toHex, toBytes } from "viem";

export const remoteRecipientCoder = P.wrap<string>({
  encodeStream(w, value: string) {
    // createAddress
    const address = createAddress(value);
    P.bytes(11).encodeStream(w, new Uint8Array(11).fill(0));
    P.U8.encodeStream(w, address.version);
    P.bytes(20).encodeStream(w, hex.decode(address.hash160));
  },
  decodeStream(r) {
    // left pad
    P.bytes(11).decodeStream(r);
    // 1 version byte
    const version = P.U8.decodeStream(r);
    // 20 hash bytes
    const hash = P.bytes(20).decodeStream(r);
    return addressToString({
      hash160: hex.encode(hash),
      version: version as AddressVersion,
      type: StacksWireType.Address,
    });
  },
});

export function bytes32FromBytes(bytes: Uint8Array): Hex {
  return toHex(pad(bytes, { size: 32 }));
}

/** This is the value you use for remote recipient **/
const remoteRecipient = bytes32FromBytes(remoteRecipientCoder.encode("ST1F1M4YP67NV360FBYR28V7C599AC46F8C4635SH"))
console.log("remoteRecipient:", remoteRecipient);
```
{% endcode %}
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Check native USDC token balance

Queries the wallet's USDC balance from the ERC20 contract, displays it in both raw units and formatted USDC, and throws an error if the balance is insufficient for the deposit amount.

{% code title="index.ts" expandable="true" %}
```typescript
// --snip--

// Check token balance
const usdcBalance = await publicClient.readContract({
  address: `0x${config.ETH_USDC_CONTRACT}`,
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: [account.address],
});
console.log(
  `USDC balance: ${usdcBalance.toString()} (${(
    Number(usdcBalance) / 1e6
  ).toFixed(6)} USDC)`,
);
if (usdcBalance < value) {
  throw new Error(
    `Insufficient USDC balance. Required: ${(Number(value) / 1e6).toFixed(
      6,
    )} USDC`,
  );
}
```
{% endcode %}
{% endstep %}

{% step %}
### Approve xReserve and execute deposit

Executes two sequential transactions: first approves the xReserve contract to spend the specified USDC amount and waits for confirmation, then calls the `depositToRemote` function to initiate the cross-chain bridge transfer to the Stacks recipient.

<pre class="language-typescript" data-title="index.ts" data-expandable="true"><code class="lang-typescript">// --snip--

// Approve xReserve to spend USDC
const approveTxHash = await client.writeContract({
  address: `0x${config.ETH_USDC_CONTRACT}`,
  abi: ERC20_ABI,
  functionName: "approve",
  args: [`0x${config.X_RESERVE_CONTRACT}`, value],
});
console.log("Approval tx hash:", approveTxHash);
console.log("Waiting for approval confirmation...");

await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
console.log("✅ Approval confirmed");

// Deposit transaction
const depositTxHash = await client.writeContract({
  address: `0x${config.X_RESERVE_CONTRACT}`,
  abi: X_RESERVE_ABI,
<strong>  functionName: "depositToRemote",
</strong>  args: [
    value,
    config.STACKS_DOMAIN,
    remoteRecipient,
    `0x${config.ETH_USDC_CONTRACT}`,
    maxFee,
    hookData,
  ],
});
</code></pre>

After some time, Stacks attestation service should receive the request and mint the equivalent value in USDCx on Stacks.

These are example transactions on testnet:

* Ethereum: [Depositing USDC](https://sepolia.etherscan.io/tx/0x46517a97430fdc6588872f8a69102bd425dfe30c6fc4e917802d9a4fc711fe59)
* Stacks: [Minting USDCx](https://explorer.hiro.so/txid/0x12ad17401bf89d1bb1489623203b489b059609187eae2c5cebb898a89bdb926f?chain=testnet\&tab=overview)
{% endstep %}
{% endstepper %}

***

## Walkthrough (Withdrawal)

{% hint style="danger" %}
**Limit:** Up to **50 burn intents per request** (max **10 per batch**, max **5 batches**). Submitting more than 50 intents in a single transaction request may lead to failed processing and **risk of fund loss**.
{% endhint %}

{% stepper %}
{% step %}
### Prepare contract call arguments

Before invoking the `burn` function of the `.usdcx-v1` contract, you'll need to determine the amount of USDCx to withdraw and the native recipient address that'll receive the USDC on the other chain.

An Ethereum address is technically only 20 bytes but the `native-recipient` needs to be a 32 byte buffer. Pad left the address to 32 bytes.

```typescript
let amount = 4800000 // in micro USDCx (6 decimals)

let functionArgs = [
  Cl.uint(amount), // amount in micro USDC
  Cl.uint(config.ETHEREUM_DOMAIN), // native domain for Ethereum
  Cl.bufferFromHex(pad(`0x${config.ETHEREUM_RECIPIENT}`, { size: 32 })) // native recipient
]

let postCondition_1 = Pc.principal(config.STACKS_RECIPIENT)
  .willSendEq(amount)
  .ft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx', 'usdcx-token')
```
{% endstep %}

{% step %}
### Execute withdrawal

Prepare the contract call transaction to invoke the `burn` function and broadcast the transaction payload.

```typescript
let transaction = await makeContractCall({
  contractName: 'usdcx-v1',
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  functionName: 'burn',
  functionArgs,
  network: 'testnet',
  postConditions: [postCondition_1],
  postConditionMode: 'deny',
  senderKey: process.env.STACKS_PRIVATE_KEY,
})

let result = await broadcastTransaction({transaction, network: 'testnet'})
```

The Stacks network's attestation service passes the burn intent message and signature to xReserve, managed by Circle. xReserve verifies the burn and issues a withdrawal attestation to release USDC to the user’s wallet.
{% endstep %}
{% endstepper %}

***

## Additional Insights

What can developers expect regarding timing, fees, and minimum amounts?

<table><thead><tr><th width="106.2578125">Network</th><th width="111.6484375">Action</th><th width="158.0234375">Time</th><th width="210.48828125">Fee</th><th>Min. Amount</th></tr></thead><tbody><tr><td>Mainnet</td><td>Peg-in</td><td>~15 minutes</td><td>~ETH gas</td><td>10 USDC</td></tr><tr><td></td><td>Peg-out</td><td>~60 minutes</td><td>~STX fees + $4.80</td><td>4.80 USDCx</td></tr><tr><td>Testnet</td><td>Peg-in</td><td>~15 minutes</td><td>~ETH gas</td><td>1 USDC</td></tr><tr><td></td><td>Peg-out</td><td>~25 minutes</td><td>~STX fees + $4.80</td><td>4.80 USDCx</td></tr></tbody></table>

***

## Additional Resources

* \[[StacksDevs Livestream](https://x.com/StacksDevs/status/2011817589782249600)] A technical breakdown by the main builder behind Stacks' USDCx
