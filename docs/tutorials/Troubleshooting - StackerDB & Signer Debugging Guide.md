# Module 5: Troubleshooting StackerDB & Signer Sync

**Author:** @jadonamite 
**Difficulty:** Advanced
**Time:** 15 Minutes

In the Nakamoto architecture, the **StackerDB** isn't just a database; it is the shared state machine where Miners and Signers coordinate "Tenure." If this synchronization fails, your Signer will reject block proposals, and you will miss rewards.

This module is your "Emergency Room" guide. We will tackle the three most common error families: **Authorization Failures**, **Tenure Timeouts**, and **State Desyncs**.

## 1. The Error: `[Error] Signer not authorized`

**Symptoms:**

* Your Signer logs show `401 Unauthorized`.
* Your Stacks Node logs show `Authentication failed for observer`.

**The Root Cause:**
The "Handshake" between your Stacks Node (Follower) and your Signer is broken. They use a shared secret (`auth_token`) to trust each other.

**The Fix:**

1. **Check the Signer Config (`signer-config.toml`):**
```toml
auth_password = "my-super-secret-token"

```


2. **Check the Node Config (`Config.toml` or `node-config.toml`):**
```toml
[node]
auth_token = "my-super-secret-token" # Must match EXACTLY

```


3. **Restart Both:**
If you changed the config but didn't restart, the old token is still in memory.
```bash
docker restart stacks-signer stacks-node

```



## 2. The Error: `Signer not registered for reward cycle X`

**Symptoms:**

* Signer is running but doing nothing.
* Logs say: `WARN: Signer key [KeyID] not found in current stacking set.`

**The Root Cause:**
This is **not** a software bug. It is a **consensus state**. Your Signer binary is healthy, but the Stacks blockchain (PoX-4 contract) does not recognize your key as a validator *for this specific cycle*.

**The Fix:**

1. **Wait for the Cycle:** Stacking requires a "warm-up" period. If you locked STX in Cycle N, you won't be active until Cycle N+1.
2. **Verify Stacking:** Check your wallet or the explorer. Did your `pox-4.stack-stx` transaction actually confirm? Did you meet the minimum threshold?
3. **Correct Private Key:** Ensure the `stacks_private_key` in `signer-config.toml` matches the *Stacker* address that sent the lock transaction.

## 3. The Error: `Block proposal processing timed out`

**Symptoms:**

* Logs show: `WARN: Tenure X timed out waiting for block proposal`.
* Grafana shows "Processed Blocks" dropping to 0.

**The Root Cause:**
In Nakamoto, miners have strict windows (seconds) to propose blocks. If your Signer receives the proposal too late (due to network latency) or processes it too slowly (disk I/O), it rejects the block to preserve chain safety.

**The Fixes:**

**A. The "Clock Drift" Check:**
Nakamoto is sensitive to time. Ensure your server time is synced via NTP.

```bash
sudo timedatectl set-ntp on

```

**B. Network Latency:**
Is your Signer on the same machine as your Node?

* **Yes:** Ensure they communicate via `127.0.0.1` or Docker internal network, NOT the public IP.
* **No:** Move them closer. The latency between Node and Signer should be < 10ms.

**C. Tuning `block_proposal_timeout_ms`:**
In `signer-config.toml`, you can make your signer more "patient" (though this risks stalling if the miner is actually dead).

```toml
# Default is often strict. Relax it slightly for testnet.
block_proposal_timeout_ms = 60000 

```

## 4. The "StackerDB" Split-Brain

**Symptoms:**

* Logs show `StackerDB revision mismatch`.
* Your node thinks Miner A is the leader; your Signer thinks it's Miner B.

**The Root Cause:**
Your Stacks Node has fallen behind the Bitcoin tip. The "Tenure" is derived from Bitcoin blocks. If your node hasn't seen the latest Bitcoin block, it calculates the wrong Tenure.

**The Fix:**

1. **Check Bitcoin Connection:**
Ensure your Stacks Node can reach the Bitcoin Node RPC.
```bash
curl -user devnet:devnet --data-binary '{"jsonrpc":"1.0","id":"curl","method":"getblockchaininfo","params":[]}' -H 'content-type: text/plain;' http://bitcoin-node:18443/

```


2. **Force Resync:**
Sometimes the internal state DB gets corrupted during hard crashes.
* *Nuclear Option:* Delete the `stacker_db` folder inside your `db_path` and restart. The signer will rebuild it from the Node's history.



## 5. Diagnostic Tooling

Don't guess; ask the node.

**Check if your Signer is "Listening":**

```bash
# Run this from inside the Stacks Node container
curl http://stacks-signer:30000/status

```

* *Success:* Returns JSON with status.
* *Failure:* `Connection refused` (Check Docker ports).

**Check the Event Subscription:**
Check the Stacks Node logs for:
`INFO: Registered event observer 0 for events mask ...`
If you don't see this on startup, the Node isn't trying to push data to the Signer. Check `[[events_observer]]` in `Config.toml`.

---
