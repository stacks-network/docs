# Module 9: Using the Stacks Rosetta API

**Author:** @jadonamite
**File Name:** `scripts/rosetta-integration.ts`
**Difficulty:** Advanced
**Time:** 20 Minutes

If you are building an Exchange, a Wallet, or a multi-chain dashboard, you don't want to learn a custom API for every single blockchain. You want a standard.

**Rosetta** is that standard (developed by Coinbase). It unifies blockchain interaction into a consistent format. Stacks implements the Rosetta specifications, allowing you to parse blocks and balances without learning the specific quirks of `get_block_by_height` or Clarital types.

This module covers how to query the Stacks Rosetta endpoint to fetch standard transaction data.

## 1. Prerequisites

* **Stacks API Node:** The Rosetta endpoints are served by the standard Stacks Blockchain API (Port 3999).
* **Target Network:** `testnet` or `mainnet`.

## 2. The Rosetta Protocol Difference

Unlike standard REST APIs (GET requests), Rosetta is almost entirely **POST** driven. You must send a JSON body specifying the `NetworkIdentifier` for every request.

* **Standard API:** `GET /v2/blocks/100`
* **Rosetta API:** `POST /rosetta/v1/block` + `{ network_identifier: {...}, block_identifier: { index: 100 } }`

## 3. Implementation: Fetching a Block

We will write a script to fetch a block and parse its transactions using the standardized Rosetta format.

**Create File:** `scripts/rosetta-integration.ts`

```typescript
import fetch from 'node-fetch'; // or use native fetch in Node 18+

// Configuration
const API_URL = "http://localhost:3999"; // Or https://api.nakamoto.testnet.hiro.so
const NETWORK_ID = {
    blockchain: "stacks",
    network: "testnet" // or "mainnet"
};

async function getRosettaBlock(blockHeight: number) {
    const endpoint = `${API_URL}/rosetta/v1/block`;
    
    // Rosetta requires a strict payload structure
    const body = {
        network_identifier: NETWORK_ID,
        block_identifier: {
            index: blockHeight
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!data.block) {
            console.error("Error fetching block:", data);
            return;
        }

        console.log(`✅ Fetched Block #${data.block.block_identifier.index}`);
        console.log(`Hash: ${data.block.block_identifier.hash}`);
        
        // 4. Parsing Transactions
        // In Rosetta, every action (transfer, contract call) is an "Operation"
        const txs = data.block.transactions;
        console.log(`Found ${txs.length} transactions.`);

        txs.forEach((tx: any) => {
            console.log(`\nTX Hash: ${tx.transaction_identifier.hash}`);
            tx.operations.forEach((op: any, index: number) => {
                // Check if it's a transfer
                if (op.type === "transfer" && op.amount) {
                    console.log(`   Op ${index}: ${op.amount.value} uSTX -> ${op.account.address}`);
                }
            });
        });

    } catch (error) {
        console.error("Network Error:", error);
    }
}

// Execute
getRosettaBlock(100);

```

## 4. Key Concepts: "Operations"

In the Stacks native API, a transaction has specific types (e.g., `contract_call`, `token_transfer`).
In Rosetta, everything is broken down into **Operations**.

* **Native:** A `token_transfer` of 100 STX is one object.
* **Rosetta:** It is represented as two operations:
1. **Op 0:** Sender Balance `-100`
2. **Op 1:** Receiver Balance `+100`



This "Double Entry Bookkeeping" style is why exchanges prefer Rosetta; it makes balance reconciliation mathematically provable.

## 5. Network Status Check (The Handshake)

Before you sync, you usually check `network/list` to ensure you are talking to the right chain.

```typescript
async function checkNetwork() {
    const response = await fetch(`${API_URL}/rosetta/v1/network/list`, {
        method: 'POST',
        body: JSON.stringify({}) // Empty body usually suffices for metadata
    });
    const data = await response.json();
    console.log("Supported Networks:", data);
}

```

## 6. Common Pitfalls

### 1. "Network Identifier Mismatch"

If you send `{ network: "mainnet" }` to a Testnet node, the node will reject the request. You must match the node's configured network exactly.

### 2. Memo Handling

Stacks Memos are critical for Exchange deposits. In Rosetta, the memo is typically found in the `metadata` field of the Transaction or Operation object. **Always parse metadata** if you are processing deposits.

### 3. Sub-Account Addresses

Rosetta supports "Sub-Accounts" (often used for UTXO chains). Stacks uses an Account-based model, so the `sub_account` field is usually null or unused, but your parser should handle its existence if using a generic library.

---
