# Module 10: Node Roles - Follower Mode vs. Miner Mode

**Author:** @jadonamite
**File Name:** `Config.toml`
**Difficulty:** Advanced
**Time:** 30 Minutes

In the Stacks ecosystem, the `stacks-node` binary is a shapeshifter. Depending on a few lines of text in `Config.toml`, it can act as a passive observer (Follower) or an active participant in consensus (Miner).

Understanding this distinction is critical because **99% of developers need a Follower**, while **1% (Mining Pools/Whales) need a Miner**. Running a Miner without understanding the financial and architectural requirements is a quick way to burn BTC for zero reward.

This module dissects the configuration required for both roles in the Nakamoto era.

---

## 1. The Architectural Distinction

### The Follower (The Observer)

* **Job:** Validates blocks, maintains the state (balances, contracts), serves RPC data to apps/wallets, and acts as the "Sidecar" for Signers.
* **Cost:** Hardware + Electricity.
* **Risk:** None.
* **Bitcoin Connection:** Read-Only (needs to see Bitcoin headers).

### The Miner (The Proposer)

* **Job:** Everything a Follower does, PLUS constructs new blocks, sends BTC transactions (`OP_RETURN`) to bid for leadership, and coordinates with Signers.
* **Cost:** Hardware + Electricity + **BTC (Burn)**.
* **Risk:** High. You spend BTC to mine; if you don't win the block, that BTC is gone.
* **Bitcoin Connection:** Read-Write (needs to broadcast transactions).

---

## 2. Configuration: Follower Mode

This is the default mode. It is used for API nodes, Exchange integrations, and supporting Signers.

**File:** `Config.toml` (Follower Variant)

```toml
[node]
# 1. Identity
# Followers don't need a seed with funds. 
# They just need a network identity.
peer_host = "0.0.0.0"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"

# 2. Bootstrapping
# Point to known peers to find the chain tip
bootstrap_peers = [
    "Testnet-Seed-Node-Address:20444",
    "k8s-nodes-blah-blah:20444"
]

[burnchain]
# 3. Bitcoin Connection (READ ONLY)
# The Follower validates Stacks blocks against Bitcoin headers.
# It does NOT need a wallet with funds here.
chain = "bitcoin" 
mode = "testnet"
peer_host = "bitcoin-node" # Docker service name or IP
peer_port = 18443
# RPC credentials to query Bitcoin block headers
rpc_port = 18443
rpc_user = "devnet"
rpc_pass = "devnet"

```

### Key "Follower" Characteristics:

1. **No Mining Flag:** The `[miner]` section is either missing or `enabled = false`.
2. **Passive Burnchain:** It queries `getblockhash` from Bitcoin but never calls `sendrawtransaction`.

---

## 3. Configuration: Miner Mode

This setup transforms the node into a competitor. It requires a funded Bitcoin wallet and a distinct VRF key for cryptographic sorting.

**File:** `Config.toml` (Miner Variant)

```toml
[node]
peer_host = "0.0.0.0"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"

[burnchain]
# 1. Bitcoin Connection (READ + WRITE)
chain = "bitcoin"
mode = "testnet"
peer_host = "bitcoin-node"
rpc_port = 18443
rpc_user = "devnet"
rpc_pass = "devnet"

[miner]
# 2. Activation
# This is the "God Mode" switch.
enabled = true

# 3. The Bank Roll (BTC Private Key)
# The node uses this key to spend BTC for "Proof of Transfer".
# WARNING: On Mainnet, this wallet must be funded with real BTC.
# Format: Private Key (WIF) or Seed Phrase
seed = "your_private_bitcoin_key_wif_format"

# 4. The Sortition Key (VRF)
# Used for the Verifiable Random Function (Cryptographic lottery).
# Generate this using `stx make_keychain`.
# It determines if you won the block race.
vrf_secret = "0123456789abcdef..." 

# 5. The Reward Address (STX)
# Where do the block rewards (coinbase + fees) go if you win?
coinbase_user = "ST2..." 

# 6. Nakamoto Fee Handling
# How much (in sats) are you willing to pay for the Bitcoin transaction 
# that announces your block candidacy?
tx_fee_sats = 10000

```

### Key "Miner" Characteristics:

1. **Wallet Integration:** The `seed` field acts as a hot wallet. If this server is compromised, your BTC is gone.
2. **Write Access:** The connection to `burnchain` must support broadcasting transactions. If the Bitcoin node is pruning or restricts RPC, mining fails.
3. **Tenure Management:** In Nakamoto, the miner also needs to listen to Signers to gather signatures for their proposed blocks.

---

## 4. Deep Dive: The VRF Key (Miner Only)

Why is there a `vrf_secret` distinct from the `seed`?

* **The Seed (BTC):** Is for **paying**. It interacts with the L1 (Bitcoin).
* **The VRF Secret (Stacks):** Is for **proving**. It runs a lottery locally.

When a Miner tries to mine a block:

1. It runs the VRF algorithm using its `vrf_secret` and the current Bitcoin block hash.
2. The result determines its "weight" in the sortition.
3. It sends a Bitcoin transaction (paid by `seed`) containing this VRF proof.

If you lose your `vrf_secret` but keep your `seed`, you still have your money, but you cannot prove you won any past blocks (relevant for forks/reorgs).

---

## 5. Troubleshooting Mode Mismatches

### Error: `Insufficient funds for burn commitment`

* **Role:** Miner
* **Cause:** The `seed` wallet has 0 BTC. You cannot mine without spending BTC.
* **Fix:** Send Testnet BTC to the address derived from the configured seed.

### Error: `Failed to broadcast transaction: -26: 64: scriptpubkey`

* **Role:** Miner
* **Cause:** Your node is trying to write to the Bitcoin chain, but the Bitcoin node rejected the format, or the wallet is desynchronized.
* **Fix:** Ensure the Bitcoin node is fully synced and accepts `OP_RETURN` data.

### Error: `[WARN] Block assembly failed`

* **Role:** Follower
* **Wait, why?** If you see this on a Follower node, you accidentally enabled `[miner]`.
* **Fix:** Set `[miner] enabled = false`. Followers should not be assembling blocks.

---

## 6. Summary Comparison

| Feature | Follower Mode | Miner Mode |
| --- | --- | --- |
| **Primary Goal** | Read State / Serve API | Write State / Earn Rewards |
| **Bitcoin Req** | Read-Only Access | Write Access (Wallet) |
| **Keys Needed** | None (Optional P2P Key) | BTC WIF + VRF Secret |
| **Financials** | Costs Hardware Only | Costs BTC + Hardware |
| **Nakamoto Role** | Syncs Tenure changes | Drives Tenure changes |

---


```
