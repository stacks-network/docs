# Tutorial: Setting up a Reproducible Clarinet Environment with Docker

**Author:** @jadonamite 
**Difficulty:** Intermediate
**Time:** 15 Minutes

In the Nakamoto era, the complexity of our local environment increases. We aren't just running a Stacks node anymore; we are orchestrating a Bitcoin node, a Stacks node (with Nakamoto rules), a Postgres indexer, and potentially sBTC signers.

By default, `clarinet integrate` is ephemeral—it wipes your chain state every time you kill the process. This creates friction when building complex dApps (like your "Aboki" wallet or "SEED" raffle) where you need persistent test data.

This guide covers how to "eject" from the default runner and configure a `docker-compose.yml` that retains state across restarts.

## 1. Prerequisites

* **Clarinet:** v2.4.0+ (Ensure Nakamoto support)
* **Docker & Docker Compose:** Installed and running.
* **Terminal:** Bash/Zsh.

> **Linux User Tip:** If you encounter `permission denied` errors with Docker, ensure your user is added to the docker group: `sudo usermod -aG docker $USER`. You may also need to check permissions on the local data folders we create below.

## 2. Architecture: The "Ejected" Devnet

Instead of letting Clarinet manage the container lifecycle hidden in the background, we will:

1. Generate a manifest of the required services.
2. Create a custom `docker-compose.yml` that mounts local directories to the container data stores.
3. Run the chain manually, allowing us to stop/start without wiping data.

## 3. Step-by-Step Implementation

### Step 3.1: Initialize the Project

If you haven't already, create a fresh project or navigate to your existing repo.

```bash
clarinet new stacks-persistent-devnet
cd stacks-persistent-devnet

```

### Step 3.2: Configure `Clarinet.toml` for Nakamoto

Ensure your configuration targets the correct epoch. Open `Clarinet.toml` and verify the `[project]` settings.

```toml
[project]
name = "stacks-persistent-devnet"
authors = []
telemetry = false
cache_dir = "./.cache"

# Ensure requirements correspond to Nakamoto
[project.requirements]
boot_contracts = ["poc-pox-4"] # Proof of Clarity/Transfer for Nakamoto

```

### Step 3.3: Generate the Docker Manifest

We need to see exactly what Clarinet tries to spin up. We will use the `--display-manifest` flag to dump the configuration, but we need to convert this into a usable `docker-compose.yml`.

Clarinet doesn't output a direct `docker-compose` file by default, but it generates the logic we need. We will construct a `docker-compose.yml` based on the standard architecture, adding **Persistence Volumes**.

Create a file named `docker-compose.yml` in your root directory:

```yaml
version: '3.8'

services:
  # 1. Bitcoin Node (The Anchor)
  bitcoin-node:
    image: wait for it... # Use standard Clarinet images or specific versions
    image: hirosystems/bitcoin-node:26.0
    ports:
      - "18443:18443"
    command: /bin/sh -c "bitcoind -regtest -rpcuser=devnet -rpcpassword=devnet -rpcbind=0.0.0.0 -rpcport=18443 -printtoconsole -txindex"
    volumes:
      - ./data/bitcoin:/root/.bitcoin # <--- PERSISTENCE

  # 2. Postgres (The Indexer DB)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: stacks_devnet
    ports:
      - "5432:5432"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data # <--- PERSISTENCE

  # 3. Stacks Node (Nakamoto)
  stacks-node:
    image: hirosystems/stacks-node:nakamoto
    depends_on:
      - bitcoin-node
    environment:
      - STACKS_LOG_DEBUG=1
    ports:
      - "20443:20443"
    volumes:
      - ./data/stacks:/root/stacks-node/data # <--- PERSISTENCE
      - ./settings/Devnet.toml:/src/stacks-node/Config.toml
    command: /bin/sh -c "stacks-node start --config /src/stacks-node/Config.toml"

  # 4. Stacks API (The Bridge)
  stacks-api:
    image: hirosystems/stacks-blockchain-api:latest
    depends_on:
      - postgres
      - stacks-node
    environment:
      - PG_HOST=postgres
      - PG_PORT=5432
      - PG_USER=postgres
      - PG_PASSWORD=password
      - STACKS_CHAIN_RPC_HOST=stacks-node
      - STACKS_CHAIN_RPC_PORT=20443
    ports:
      - "3999:3999"

```

### Step 3.4: The `.gitignore` Setup

Since we are creating local data folders (`./data`), you **must** ignore these in Git to avoid pushing gigabytes of chainstate to your repo.

Add this to `.gitignore`:

```text
# Devnet Persistence
/data
/.clarinet/
**/*.db

```

### Step 3.5: Booting Up

1. **Start the environment:**
```bash
docker-compose up -d

```


2. **Deploy your contracts:**
Since we aren't using `clarinet integrate` (which auto-deploys), you will use the deployment command manually against your running localhost.
```bash
clarinet deployment apply --devnet

```



### Step 3.6: Testing Persistence

1. Make a state change (e.g., deploy a contract or send a transaction).
2. Stop the containers:
```bash
docker-compose down

```


*Note: Do not use `-v` or `--volumes` as that will wipe the data volumes we created.*
3. Start them again:
```bash
docker-compose up -d

```


4. Query the API (localhost:3999) or check the block height. It should resume where it left off, rather than resetting to block 0.

## 4. Common Pitfalls

### "Database is locked" or Permission Denied

On Linux systems (Ubuntu/Debian), Docker containers running as root might write files to `./data` that your local user cannot modify or delete later.

* **Fix:** If you need to wipe the state manually, you might need `sudo rm -rf ./data`.

### Clarinet Integration vs. Docker Compose

When you use this manual Docker method, `clarinet check` and `clarinet test` still work normally (as they run in isolation), but `clarinet console` might need to be pointed explicitly to the running node if you want to interact with *this* specific chain state.

### Port Conflicts

If you have a local instance of Postgres running (port 5432), Docker will fail to bind. Stop your local service:

```bash
sudo systemctl stop postgresql

```
