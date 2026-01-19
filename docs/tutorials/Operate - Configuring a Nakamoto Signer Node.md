
# Tutorial: Configuring a Stacks Signer Node on Testnet

**Author:** @jadonamite
**Difficulty:** Advanced
**Time:** 20 Minutes

In the Nakamoto era, the network needs more than just miners; it needs **Signers**. Signers are the validators of the Stacks L2. They validate block proposals from miners and ensure tenure integrity.

If you are building a mining pool, a stacking pool, or just want to participate in consensus, you must run a Signer. This module walks you through spinning up a Signer on the **Nakamoto Testnet** and connecting it to a "Follower" Stacks Node.

## 1. Prerequisites

* **Stacks CLI:** Installed (`npm install --global @stacks/cli`)
* **Docker:** Installed and running.
* **A Running Stacks Node:** You need a Stacks node (Follower) to pair with your signer. (See previous module).

## 2. Architecture: The Sidecar Pattern

A Signer does not talk to the P2P network directly. It relies on a local **Stacks Node** to act as its eyes and ears.

* **The Node** follows the chain and sends event data to the Signer.
* **The Signer** evaluates these events, signs valid block proposals, and sends signatures back to the Node.
* **The Node** broadcasts these signatures to the network.

## 3. Step-by-Step Implementation

### Step 3.1: Generate Signer Identity

Your signer needs a Stacks private key to sign messages. This is *not* your wallet for holding funds (though it can be); it is the hot wallet used strictly for consensus signing.

```bash
# Generate a new keychain and extract the private key
stx make_keychain -t | jq -r '.keyInfo.privateKey'

```

* **Save this Key.** We will refer to it as `your_signer_private_key`.
* **Note:** Ensure this key has some testnet STX if you plan to register it on-chain later, though for *running* the software, a zero-balance key works until you try to stack.

### Step 3.2: Generate Authentication Token

The connection between your Stacks Node and your Signer is sensitive. You don't want unauthorized processes pushing fake block proposals to your signer. We secure this link with a shared secret.

Generate a random hex string to serve as your `auth_token`.

```bash
openssl rand -hex 16
# Output example: 4f3a9b2c8d1e7f6a5b4c3d2e1f0a9b8c

```

* **Save this Token.** We will refer to it as `your_auth_token`.

### Step 3.3: Create `signer-config.toml`

Create a file named `signer-config.toml`. This tells the signer where to find its partner Node and who it is.

```toml
# signer-config.toml

# 1. The Signer's Identity
# The private key used to sign blocks (from Step 3.1)
stacks_private_key = "your_signer_private_key"

# 2. Network Selection
network = "testnet"

# 3. Connection to Stacks Node (The "Upstream")
# The IP/Port where your Stacks Node is listening for RPC
node_host = "stacks-node:20443" 

# 4. Signer Listening Endpoint (The "Downstream")
# The IP/Port where THIS Signer will listen for events from the Node
endpoint = "0.0.0.0:30000"

# 5. Authentication
# The shared secret (from Step 3.2)
auth_password = "your_auth_token"

# 6. Database
# Where the signer stores its internal state
db_path = "/var/lib/stacks-signer"

```

### Step 3.4: Configure the Follower Node

Now, you must tell your **Stacks Node** that a signer exists and provide it with the credentials to talk to it.

Open your Stacks Node's `Config.toml` (or `node-config.toml`) and add/modify the following sections.

```toml
# Config.toml (Stacks Node)

[node]
# ... existing config ...

# 1. Authenticate with the Signer
# MUST match 'auth_password' in signer-config.toml
auth_token = "your_auth_token"

[[events_observer]]
# 2. Push Events to the Signer
# This points to the Signer's 'endpoint' defined above
endpoint = "stacks-signer:30000" 
events_keys = ["*"] # Subscribe to all events

```

### Step 3.5: Docker Compose Integration

Add the Signer service to your `docker-compose.yml` to run it alongside the node.

```yaml
  stacks-signer:
    image: hirosystems/stacks-signer:nakamoto
    container_name: stacks-signer
    ports:
      - "30000:30000"
    volumes:
      - ./signer-config.toml:/etc/stacks-signer/config.toml
      - ./data/signer:/var/lib/stacks-signer
    command: stacks-signer run --config /etc/stacks-signer/config.toml
    depends_on:
      - stacks-node

```

> **Networking Note:** In the config above, we used `stacks-signer` and `stacks-node` as hostnames. This works because Docker Compose creates a default network where service names resolve to IPs. If you are running binaries on bare metal, use `127.0.0.1`.

## 4. Verification

Start your stack:

```bash
docker-compose up -d

```

Check the logs for a successful handshake:

1. **Signer Logs:**
```bash
docker logs stacks-signer

```


*Look for:* `Listening on 0.0.0.0:30000`
2. **Node Logs:**
```bash
docker logs stacks-node

```


*Look for:* `Event observer connected` or `Pushing event to observer`.

## 5. Common Pitfalls

### "Auth Token Mismatch"

If you see 401 Unauthorized errors in the logs, your `auth_password` (Signer) and `auth_token` (Node) do not match. They must be identical.

### "Connection Refused"

If the Node complains it cannot reach the observer:

1. Ensure the Signer container is actually running.
2. Check that `events_observer.endpoint` uses the correct Docker service name (e.g., `stacks-signer:30000`), not `localhost` (unless using host networking).

### Private Key Format

The `stacks_private_key` in the TOML should be the raw hex string (64 chars). Do not include the `01` byte suffix usually associated with compressed pubkeys if you are extracting manually, though `stx make_keychain` usually gives the correct format.
