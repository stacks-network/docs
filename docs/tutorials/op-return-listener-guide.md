# Module 30: Bitcoin Logic - Triggering Contracts via Chainhooks

**Author:** @jadonamite
**Difficulty:** Expert
**Time:** 30 Minutes

Stacks smart contracts can *read* Bitcoin state, but they cannot *auto-execute* when a Bitcoin transaction happens. They are passive.

To make a contract **reactive** (e.g., "When I send 1 BTC, automatically mint 1000 Tokens"), you need an off-chain indexer to watch the Bitcoin chain and "poke" your Stacks contract.

**Chainhooks** (developed by the Hiro team) is the standard tool for this. It scans Bitcoin blocks for specific patterns (like an `OP_RETURN` code) and sends an HTTP payload to your backend, which then triggers the Stacks transaction.

## 1. The Architecture

1. **The Trigger:** User sends a Bitcoin Tx with `OP_RETURN 0xCAFE...`.
2. **The Listener:** Chainhook node sees `0xCAFE...` in a new Bitcoin block.
3. **The Webhook:** Chainhook posts a JSON payload to your API (`/api/deposit-handler`).
4. **The Action:** Your API parses the JSON and broadcasts a `contract-call` to Stacks.

## 2. Step 1: The Bitcoin Transaction (The Signal)

First, we need a distinct pattern to listen for. Let's say we are building a "Bitcoin Oracle" that listens for the magic bytes `0xCAFEBABE`.

*Bitcoin Script (Conceptual):*
`OP_RETURN <0xCAFEBABE> <Stacks-Recipient-Address>`

## 3. Step 2: Configuring Chainhook

You define a **Predicate** in a YAML file. This tells the Chainhook node what to look for.

**File:** `chainhooks/op-return-listener.yaml`

```yaml
chain: bitcoin
uuid: "btc-op-return-scanner"
name: "Bitcoin Deposit Detector"
version: 1
networks:
  testnet:
    # Which Bitcoin block to start scanning from?
    start_block: 2540000
    if_this:
      scope: transaction
      operation: consume
      transaction_contains_output:
        script_pubkey_hex_prefix: "6a04cafebabe" # OP_RETURN (6a) + 4 bytes + CAFEBABE
    then_that:
      http_post:
        url: "http://localhost:3000/api/webhook"
        authorization_header: "Bearer secret-token"

```

## 4. Step 3: Handling the Event (Your Backend)

Your backend receives a massive JSON object describing the Bitcoin block and transaction. You must parse it and verify safety.

**File:** `src/webhook-handler.ts`

```typescript
import { makeContractCall, broadcastTransaction, bufferCV } from '@stacks/transactions';

app.post('/api/webhook', async (req, res) => {
  const { apply } = req.body; // Chainhook payload structure

  // Iterate through blocks and transactions
  for (const block of apply) {
    for (const tx of block.transactions) {
      const txid = tx.transaction_identifier.hash;
      
      console.log(`Detected Trigger: ${txid}`);

      // 1. Verify this is the pattern we want (Double check logic here)

      // 2. Trigger Stacks Contract
      // We act as the "Relayer"
      const txOptions = {
        contractAddress: 'ST1...',
        contractName: 'my-bridge',
        functionName: 'process-btc-deposit',
        functionArgs: [
          // Pass the Bitcoin TxID so the contract can verify it 
          // using 'was-tx-mined?' (See Module 25) if needed
          bufferCV(Buffer.from(txid.replace('0x', ''), 'hex'))
        ],
        senderKey: process.env.RELAYER_KEY, // The backend pays the gas
        network: 'testnet'
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction);
      console.log(`Relayed deposit ${txid} to Stacks: ${broadcastResponse.txid}`);
    }
  }

  res.status(200).json({ status: 'ok' });
});

```

## 5. Step 4: The Stacks Contract (The Reactor)

The contract receives the signal. To be fully trustless, it shouldn't just trust the Relayer. It should require the Relayer to submit the **Proof** (as discussed in Module 25).

However, for simple "Notifier" apps, you might whitelist your Relayer address.

**File:** `contracts/my-bridge.clar`

```clarity
(define-constant RELAYER tx-sender) ;; Deployer is relayer
(define-constant ERR-UNAUTHORIZED (err u401))

(define-public (process-btc-deposit (btc-txid (buff 32)))
    (begin
        ;; 1. Security Check: Only OUR backend can call this.
        ;; If we removed this, anyone could spam fake deposits.
        ;; (Unless we implement full SPV verification inside here).
        (asserts! (is-eq tx-sender RELAYER) ERR-UNAUTHORIZED)

        ;; 2. Business Logic
        ;; Mint tokens, update status, etc.
        (print { event: "deposit-detected", btc-tx: btc-txid })
        (ok true)
    )
)

```

## 6. Summary Checklist

* [ ] **Predicate Specificity:** Is your `script_pubkey_hex_prefix` unique enough to avoid false positives?
* [ ] **Idempotency:** What happens if Chainhook sends the webhook twice (it happens)? Does your contract handle duplicate `process-btc-deposit` calls safely?
* [ ] **Gas Management:** Does your backend wallet have enough STX to pay for all the relay transactions?


