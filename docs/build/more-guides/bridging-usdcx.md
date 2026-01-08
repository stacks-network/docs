# Bridging USDCx

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

### Key Tools To Use

* [viem](https://viem.sh/) - A Typescript-first library that interfaces with Ethereum.
* [stacks.js](/broken/pages/dH5waQhE6Vb7rhcrUG7z) - A js library that helps developers build Stacks apps by handling transactions, wallet authentication, and smart contract interactions.

***

## Complete Code

If you want to jump straight to the full implementation, the complete working code used in this guide is shown below.

#### Deposit

{% tabs %}
{% tab title="index.ts" %}
This script bridges USDC from Ethereum Sepolia testnet to Stacks testnet by first approving the xReserve contract to spend USDC, then calling `depositToRemote` to initiate the cross-chain transfer. It encodes the Stacks recipient address into the bytes32 format required by the Ethereum contract and submits both transactions to the Sepolia network. The Stacks attestation service will receive this event and mint the equivalent amount to the specified Stacks address.

{% code expandable="true" %}
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
  STACKS_RECIPIENT: "ST1F1M4YP67NV360FBYR28V7C599AC46F8C4635SH", // Address to receive minted USDCx on Stacks
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


async function main() {
  if (!config.PRIVATE_KEY) {
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
  if (usdcBalance < value) {
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

// ============ Call the main function ============
main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
```
{% endcode %}
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
* Get testnet USDC from the [Circle Faucet](https://faucet.circle.com/).
* Get testnet ETH from a public [Ethereum Sepolia faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia).

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
