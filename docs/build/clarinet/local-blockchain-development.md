# Local Blockchain Development

Clarinet ships with a complete local blockchain environment so you can build, test, and debug smart contracts without deploying to a public network. This local blockchain environment is what is referred to as a devnet.&#x20;

<details>

<summary>What is a devnet?</summary>

* A devnet refers to a local blockchain development environment in which your smart contracts and front end application can interact with simulated blockchain entities.&#x20;
* With a devnet, your smart contract application can interact with simulated blockchain entities (miners, nodes, and a stream of mined blocks), all within your local machine.
* When devnets simulate a blockchain environment, the entities created—the other contracts, transactions, or nodes—resemble the conditions your application will inhabit once in production.&#x20;
* Devnets enable you to create different blockchain configurations.
* You can share a simnet environment with other devs and collaborate with them.
* You can start a devnet at an arbitrary block height with a specified network upgrade at a later block, and with many simulated users, to see how your application responds.

</details>

## Starting your local blockchain

Launch devnet with all required services:

```bash
clarinet devnet start
```

Useful flags:

| Option                           | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| `--manifest-path <path>`         | Use an alternate `Clarinet.toml`                  |
| `--no-dashboard`                 | Stream logs instead of showing the interactive UI |
| `--deployment-plan-path <path>`  | Apply a specific deployment plan                  |
| `--use-on-disk-deployment-plan`  | Use an existing plan without recomputing          |
| `--use-computed-deployment-plan` | Recompute and overwrite the plan                  |
| `--package <path>`               | Load a packaged devnet configuration              |

{% hint style="info" %}
Prerequisites

Devnet requires Docker. If you see “clarinet was unable to create network,” ensure Docker Desktop is running or the Docker daemon is started.
{% endhint %}

By default the dashboard displays service health, recent transactions, block production, contract deployments, and resource usage. Use `--no-dashboard` in CI or when you prefer streaming logs.

## Core services and features

Devnet starts these services for you:

| Service          | Port  | Purpose                                  |
| ---------------- | ----- | ---------------------------------------- |
| Stacks node      | 20443 | Processes transactions and mines blocks  |
| Bitcoin node     | 18443 | Provides block anchoring in regtest mode |
| Stacks API       | 3999  | REST API for blockchain data             |
| Postgres         | 5432  | Indexes blockchain data                  |
| Stacks Explorer  | 8000  | Browse transactions in a web UI          |
| Bitcoin Explorer | 8001  | View the Bitcoin regtest chain           |

Devnet includes pre-funded accounts:

```clarity
::get_assets_maps
;; +-------------------------------------------+-----------------+
;; | Address                                   | STX Balance     |
;; |-------------------------------------------+-----------------|
;; | ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM | 100000000000000 |
;; | ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 | 100000000000000 |
;; | ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG | 100000000000000 |
;; | ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC | 100000000000000 |
;; | ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND  | 100000000000000 |
;; +-------------------------------------------+-----------------+
```

When devnet starts it automatically deploys your project contracts so you can interact immediately.

```
$ clarinet devnet start
Deploying contracts...
Deploying counter.clar        ✓  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter
Deploying token.clar         ✓  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token
Deploying marketplace.clar   ✓  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.marketplace

All contracts deployed successfully
```

## Configuration and customization

Devnet behavior is controlled by configuration files in your project.

### Basic configuration

`settings/Devnet.toml` defines network settings:

```toml
[network]
name = "devnet"

# Service ports
stacks_node_rpc_port = 20443
stacks_api_port = 3999
stacks_explorer_port = 8000
bitcoin_node_rpc_port = 18443

[network.devnet]
bitcoin_controller_block_time = 30_000  # 30 seconds

disable_bitcoin_explorer = false
disable_stacks_explorer = false
disable_stacks_api = false
```

### Port configuration

Avoid local conflicts by customizing ports:

```toml
stacks_node_rpc_port = 30443
stacks_api_port = 4999
postgres_port = 6432
stacks_explorer_port = 4020
```

### Mining intervals

Control block production speed:

```toml
bitcoin_controller_block_time = 1_000     # Fast development (1 second)
bitcoin_controller_block_time = 30_000    # Standard testing (30 seconds)
bitcoin_controller_block_time = 120_000   # Realistic timing (2 minutes)
```

### Custom accounts

Add accounts with specific balances:

```toml
[accounts.treasury]
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin"
balance = 10_000_000_000_000

[accounts.alice]
mnemonic = "female adjust gallery certain visit token during great side clown fitness like"
balance = 5_000_000_000_000
```

## Accessing services

Devnet exposes several ways to interact with the blockchain.

### Stacks Explorer

Visit the explorer to browse transactions, blocks, contract state, and account balances:

```
http://localhost:8000
```

### API endpoints

Query blockchain data with the Stacks API:

```bash
curl http://localhost:3999/v2/info
```

Common endpoints:

* `/v2/info` – network information
* `/v2/accounts/{address}` – account details
* `/v2/contracts/source/{address}/{name}` – contract source code
* `/extended/v1/tx/{txid}` – transaction details

### Direct RPC

Submit transactions directly to the Stacks node:

```bash
curl -X POST http://localhost:20443/v2/transactions \
  -H "Content-Type: application/json" \
  -d @transaction.json
```

Useful RPC endpoints:

* `/v2/transactions` – broadcast transactions
* `/v2/contracts/call-read` – read-only contract calls
* `/v2/fees/transfer` – fee estimates for STX transfers

## Advanced configuration

### Performance optimization

For faster development cycles:

{% code title="settings/Devnet.toml" %}
```toml
[network.devnet]
bitcoin_controller_block_time = 1_000

disable_bitcoin_explorer = true
disable_stacks_explorer = true
disable_stacks_api = false
```
{% endcode %}

### Epoch configuration

Test different Stacks versions:

```toml
[epochs]
epoch_2_0 = 0     # Stacks 2.0 from genesis
epoch_2_05 = 0    # Stacks 2.05 from genesis  
epoch_2_1 = 0     # Stacks 2.1 from genesis
epoch_2_2 = 0     # Pox-2 from genesis
epoch_2_3 = 0     # Pox-3 from genesis
epoch_2_4 = 0     # Pox-4 from genesis
epoch_3_0 = 101   # Nakamoto activation at block 101
```

### Custom node/signer images

Clarinet runs Devnet with specific tags for each Docker image. For example, Clarinet v3.10.0 uses the following images:

* stacks node: `blockstack/stacks-blockchain:3.3.0.0.1-alpine`
* stacks signer: `blockstack/stacks-signer:3.3.0.0.1.0-alpine`

We recommend Devnet users let Clarinet handle it and use the default version. This ensures that your Clarinet version can handle and properly configure the images it uses.

In some cases, you may need to use other images. Clarinet lets you do this by configuring it in `settings/Devnet.toml`. For example, if you don't want to run the `alpine` images:

```toml
# setting/Devnet.toml
[network]
name = "devnet"
deployment_fee_rate = 10

# ...

[devnet]
stacks_node_image_url = "blockstack/stacks-blockchain:3.3.0.0.1"
stacks_signer_image_url = "blockstack/stacks-signer:3.3.0.0.1.0"
```

<details>

<summary>Build an image locally and use it</summary>

* Clone the stacks-core repository (or a fork) and checkout the desired branch.

```
git clone git@github.com:stacks-network/stacks-core.git
cd stacks-core
git checkout develop
```

* Build the Docker image `stacks-node:local`:

```
docker build -t stacks-node:local -f ./Dockerfile ./
```

* Clarinet needs the image to be available in a registry. You can host a local one and push the image to it.

```
docker run -d -e REGISTRY_HTTP_ADDR=0.0.0.0:5001 -p 5001:5001 --name registry registry:2
docker tag stacks-node:local localhost:5001/stacks-node:local
docker push localhost:5001/stacks-node:local
```

* Set the image to be used:

```
# setting/Devnet.toml
[network]
name = "devnet"
deployment_fee_rate = 10

# ...

[devnet]
stacks_node_image_url = "localhost:5001/stacks-node:local"
```

* Then start Devnet:

```
clarinet devnet sta
```

</details>

### Package deployment

Create reusable devnet configurations:

```bash
$ clarinet devnet package --name demo-env
Packaging devnet configuration...
Created demo-env.json
```

Use a packaged configuration:

```bash
$ clarinet devnet start --package demo-env.json
```

## Common issues

<details>

<summary>Docker connection errors — “clarinet was unable to create network”</summary>

Follow these steps to fix Docker connection issues:

Ensure Docker Desktop is running (macOS/Windows).Start the Docker daemon (sudo systemctl start docker) on Linux.Confirm permissions with docker ps.Reset Docker to factory defaults if problems persist.

Verify Docker status:

```bash
docker --version
docker ps
```

</details>

<details>

<summary>Port already in use — “bind: address already in use”</summary>

Find and stop the conflicting process (macOS/Linux):

```bash
lsof -i :3999
kill -9 $(lsof -t -i:3999)
```

Windows equivalent:

```bash
netstat -ano | findstr :3999
taskkill /PID <PID> /F
```

Or update ports in `settings/Devnet.toml`:

```toml
stacks_api_port = 4999
stacks_explorer_port = 4020
postgres_port = 6432
```

</details>

<details>

<summary>High resource usage (slow performance, high CPU or memory)</summary>

Optimizations:

```toml
disable_bitcoin_explorer = true
disable_stacks_explorer = true
bitcoin_controller_block_time = 60_000
```

Set Docker resource limits:

```bash
docker update --memory="2g" --cpus="1" <container_id>
```

Clean up old data:

```bash
clarinet devnet stop
docker system prune -a
rm -rf tmp/devnet
```

</details>

<details>

<summary>Network already exists — “network with name `.devnet` already exists”</summary>

Remove the orphaned network:

```bash
docker network rm <project>.devnet
```

If you're unsure of the name:

```bash
docker network ls | grep devnet
docker network rm <network-name>
```

Prevent the issue by stopping devnet with `Ctrl+C` and pruning orphaned networks:

```bash
docker network prune
```

</details>

<details>

<summary>Docker stream error during startup — “Fatal: unable to create image: Docker stream error”</summary>

**Error**: "Fatal: unable to create image: Docker stream error"

This error often occurs when Docker images are corrupted or when explorers fail to start properly.

**Solution 1 - Disable explorers**:

If you don't need the web explorers, disable them in `settings/Devnet.toml`:

```
disable_bitcoin_explorer = true
disable_stacks_explorer = true
```

**Solution 2 - Clean Docker environment**:

Remove all containers and images, then restart:

Terminal

```
docker stop $(docker ps -a -q)
docker system prune -a
docker volume prune
```

**Solution 3 - Full cleanup and restart**:

Terminal

```
docker stop $(docker ps -a -q)
docker network rm <project-name>.devnet
docker system prune --all --volumes
clarinet devnet start
```

This ensures a clean Docker environment for devnet to start fresh.

</details>

<details>

<summary>Contract deployment failures</summary>

Ensure dependencies deploy first in `Clarinet.toml`:

```toml
[contracts.sip-010-trait]
path = "contracts/sip-010-trait.clar"

[contracts.token]
path = "contracts/token.clar"
```

Validate contracts before deployment:

```bash
clarinet check
```

Check logs:

```bash
clarinet devnet start --no-dashboard
```

Deploy manually if needed:

```bash
clarinet deployments generate --devnet
clarinet deployments apply --devnet
```

</details>

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/5-ways-to-interact-with-devnet-in-the-hiro-platform)] 5 Ways to Interact With Devnet in the Hiro Platform&#x20;
