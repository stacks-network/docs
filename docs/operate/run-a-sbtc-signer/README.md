# Run a sBTC Signer

<div data-with-frame="true"><figure><img src="../.gitbook/assets/sbtc-signers-cover.png" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
This documentation provides guidelines, best-practices and recommendations for running an sBTC Signer. Review it and adapt it to your infrastructure policy before deploying it.
{% endhint %}

{% hint style="warning" %}
Each sBTC signer will control a set of signing shares used to sign transactions on both Bitcoin and Stacks.

Such shares will be encrypted by using the `private_key` specified in the Signer's config and stored in the PostgreSQL database attached to each signer.

It is of the utmost importance to follow the recommendations below.
{% endhint %}

{% stepper %}
{% step %}
#### Prevent unauthorized access to signer infrastructure

Prevent unauthorized access to the sBTC Signer infrastructure (the signer itself, its private key, and the associated PostgreSQL database).
{% endstep %}

{% step %}
#### Keep an offline, secure backup of the Signer private key

Keep an offline, secure backup of the sBTC Signer private key.
{% endstep %}

{% step %}
#### Regularly backup PostgreSQL database

Regularly backup the PostgreSQL database and store it in a secure location.
{% endstep %}
{% endstepper %}

See [here](best-practices-for-running-an-sbtc-signer.md) for additional best practices to run an sBTC signer.

## Minimum System Requirements

Below are the **minimum required specs** to be able to run a sBTC signer.

* 2 CPU
* 4GB memory
* 50GB storage

Note that these are in _addition_ to the hardware requirements for running a Stacks node and Bitcoin node outlined in the [How to Run a Signer doc](../run-a-signer/).

## Connection diagram

## Configure your Bitcoin node

### Minimum version

You will need `bitcoind` version 25 or higher.

### Settings

Your Bitcoin node must have the RPC server enabled (`server=1`) for sBTC signer operation.

### Pruning

The signer reads full blocks from Bitcoin Core over RPC (`getblock`). It needs every block from the newest block in its PostgreSQL database up to the chain tip, so whether a pruned node works depends on that database.

* **Existing database.** A signer whose database holds its history since it joined can use a pruned node. Keep at least three months of blocks, about 13,000. The same window covers catching up after downtime and restoring a database backup, as long as the backup is newer than the oldest block your node keeps.
* **Empty database.** A signer that starts with an empty database, such as a new signer, backfills from `sbtc_bitcoin_start_height`. This defaults to the Nakamoto start height, Bitcoin block 867,867 on mainnet. The signer reads every block from there to the chain tip to follow the chain of sBTC sweep transactions. Use an unpruned node (`prune=0`) for this.

`prune` sets a size in MiB, not a block count. The `prune=1024` example on [Run a Pruned Bitcoin Node](../run-a-node/run-a-pruned-bitcoin-node.md) is sized for a Stacks node and keeps far fewer blocks than an sBTC signer needs. To check how many blocks a pruned node keeps:

```bash
bitcoin-cli getblockchaininfo | jq '.blocks - .pruneheight'
```

Keep the result above 13,000.

### RPC-Based Block Detection

Starting with sBTC v1.1.0, the signer uses RPC polling instead of ZeroMQ for block detection.

The signer connects to Bitcoin Core via RPC and polls for new bitcoin blocks. This process works as follows:

{% stepper %}
{% step %}
#### Bitcoin Core validates a new block

Bitcoin Core validates a new block.
{% endstep %}

{% step %}
#### Signer detects the block via RPC polling

Signer detects the block via RPC polling.
{% endstep %}

{% step %}
#### Signer processes relevant sBTC transactions

Signer processes relevant sBTC transactions.
{% endstep %}
{% endstepper %}

### Example

```bash
bitcoind \
  -server \
  -datadir=${BITCOIN_DATA} \
  -rpcbind=0.0.0.0 \
  -rpcuser=${BITCOIN_RPC_USERNAME} \
  -rpcpassword=${BITCOIN_RPC_PASSWORD} \
  -rpcport=${BITCOIN_RPC_PORT} \
  -rpcallowip=0.0.0.0/0 \
  -rpcallowip=::/0 \
  -prune=0

```

## Configure your Stacks node

### Minimum version

Please ensure your Stacks version is up-to-date (using the latest release).

### Event observer

You will need to add a _new_ event observer that relays information from the sBTC smart contracts to the sBTC signer:

```toml
[[events_observer]]
endpoint = "sbtc-signer:8801"
events_keys = [
    "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-registry::print",
]
disable_contract_interface = true
```

### Reference configuration

See [here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/nodes/stacks/Config.toml.in).

## Configure your sBTC Signer

The signer configuration file (`signer-config.toml`) defines the signer's operation parameters. The configuration sections include:

### Blocklist Client Settings

```toml
[blocklist_client]
endpoint = "http://blocklist-client:3032"
```

### Bitcoin Connection Settings

Defines how the signer connects to Bitcoin Core:

```toml
[bitcoin]
rpc_endpoints = ["http://user:pass@your-bitcoin-node:8332"]

# Note: block_hash_stream_endpoints are no longer used as of v1.1.0

# The signer now uses RPC polling for block detection
```

### Core Signer Parameters

Defines the signer's identity and network participation:

```toml
[signer]
private_key = "your-private-key"  # 32 or 33-byte hex format
network = "mainnet"
deployer = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4"
```

### P2P Network Configuration

Controls how the signer communicates with other network participants:

```toml
[signer.p2p]
listen_on = ["tcp://0.0.0.0:4122"]
```

The signer operates on port 4122 by default and supports both TCP and QUIC protocols for peer communication. The signer will attempt QUIC connections first for improved performance, automatically falling back to TCP if QUIC is unavailable or blocked on the network.

### Reference configuration

See [here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/sbtc-signer/signer-config.toml.in).

## Set up your containers

See [here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/docker-compose.yml) for a Docker Compose including all the required components.

{% hint style="warning" %}
When deploying with Docker, always use [immutable image tags](https://docs.docker.com/reference/cli/docker/image/pull/#pull-an-image-by-digest-immutable-identifier) - the image digests are provided below. Verify the attestation of these images using this [guide](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds#verifying-artifact-attestations-with-the-github-cli).

We publish our images on [GitHub Container Registry](https://github.com/stacks-sbtc/sbtc/pkgs/container/sbtc).
{% endhint %}

## Monitoring

Monitoring Details TBD

## Troubleshooting

Troubleshooting Guide TBD

## sBTC onboarding network

The sBTC onboarding network is a separate sBTC deployment on Stacks testnet. The sBTC team runs it to onboard new sBTC signers and can reset it at any time. To join it, follow this section only: the sections above describe a mainnet sBTC signer.

You run five containers with Docker Compose: Bitcoin Core, a Stacks node, Postgres, the blocklist client and the sBTC signer.

### How this network differs from testnet sBTC

The onboarding network shares Stacks testnet and its Bitcoin regtest chain with every other testnet node. Its sBTC contracts, signers and Emily API are its own.

| Setting                | Value on the onboarding network            | Where it is set                                     |
| ---------------------- | ------------------------------------------ | --------------------------------------------------- |
| sBTC contract deployer | `SNKW1SJK9HES9WP0T5HJ32DF20Z4365AD1FRJ8CT` | `deployer` in `signer-config.toml`                  |
| Emily API              | `https://dev.sbtc-emily-dev.com`           | `SIGNER_EMILY__ENDPOINTS` in `docker-compose.yml`   |
| sBTC start height      | Bitcoin block 30,900                       | `sbtc_bitcoin_start_height` in `signer-config.toml` |

`stacks-config.toml` names a second sBTC principal, `SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-token`, in `pox_5_sbtc_contract`. That setting is testnet-wide pox-5 configuration. Every testnet node config on docs.stacks.co uses the same value. It is correct as given and is not the onboarding network's deployment.

### Before you start

* A Linux host. The commands assume a Debian-based distribution.
* Docker Engine with the Compose plugin. If your user is not in the `docker` group, put `sudo` in front of each `docker` command.
* Disk space for the Bitcoin regtest and Stacks testnet chainstate.
* Inbound TCP port 4122 open to the other signers. No other port needs to be reachable from outside the host: the files below publish every other port on 127.0.0.1 only.
* `curl` and `jq` for the checks, and either Node.js or OpenSSL to generate your key.

### Set up your signer

#### 1. Generate your signer key

Generate a secp256k1 key pair with either tool below. Both work on Linux and macOS. Keep the private key secret and back it up.

{% tabs %}
{% tab title="Stacks CLI" %}
This is the method from step 1 of the [Stacks Signer Quickstart](../run-a-signer/signer-quickstart.md). It needs Node.js and npm.

```bash
npm install --global @stacks/cli
```

```bash
stx make_keychain -t > keychain.json
```

In `keychain.json`, `keyInfo.privateKey` goes in `.env` as `SIGNER_PRIVATE_KEY`. The signer accepts it as written. `keyInfo.publicKey` is the public key you send to the sBTC team. The file also holds your mnemonic, so keep it secret too.
{% endtab %}

{% tab title="OpenSSL" %}
Use this method if you do not want to install Node.js. Create the key:

```bash
openssl ecparam -name secp256k1 -genkey -noout -out signer-key.pem
```

Print the private key, which goes in `.env` as `SIGNER_PRIVATE_KEY`:

```bash
openssl ec -in signer-key.pem -text -noout 2>/dev/null | sed -n '/^priv:/,/^pub:/p' | sed '1d;$d' | tr -d ' :\n' | sed 's/^0*//' | awk '{ printf "%64s\n", $0 }' | tr ' ' 0
```

Print the public key, which you send to the sBTC team:

```bash
openssl ec -in signer-key.pem -pubout -conv_form compressed -outform DER 2>/dev/null | tail -c 33 | od -An -tx1 | tr -d ' \n'; echo
```
{% endtab %}
{% endtabs %}

#### 2. Send your public key to the sBTC team

Send your public key over your usual channel with the sBTC team. The sBTC team sends back the values you need for `.env`:

* the public keys of the other new signers
* the number of signatures required
* a seed address, the P2P address of another signer
* your Emily API key
* the sanctions list URL

#### 3. Create the files

Create a folder for the network:

```bash
mkdir ~/sbtc-onboarding-network && cd ~/sbtc-onboarding-network
```

Create the five files under [The files](./#the-files) in that folder, then fill in `.env`. Every value you fill in lives in `.env`. The other four files are the same for every signer.

#### 4. Start the containers

```bash
docker compose up --detach
```

#### 5. Wait for the sync

Bitcoin Core and the Stacks node catch up first, then the sBTC signer backfills its database from both. Follow the progress with the checks under [Check that it's working](./#check-that-its-working).

{% hint style="warning" %}
Until the first backfill finishes, do not restart the sBTC signer. A restart makes the backfill start over.
{% endhint %}

Until Bitcoin Core is close to the chain tip, the Stacks node and the sBTC signer log errors. The Stacks node logs `Unable to sync with burnchain: Try synchronizing again` and its RPC does not answer. The sBTC signer logs that it cannot reach the Stacks node. Both errors stop once Bitcoin Core catches up.

### Check that it's working

Every container is running. Each service's status reads `Up`:

```bash
docker compose ps
```

The blocklist client has a sanctions list. The logs show `preloaded sanctions list from local file` at boot and `refreshed sanctions list` once it has fetched the current list:

```bash
docker compose logs blocklist-client | grep "sanctions list"
```

The Stacks node is caught up. This prints its Bitcoin and Stacks heights. Run the same command against `https://api.testnet.hiro.so/v2/info` and the numbers should be close:

```bash
curl --silent http://127.0.0.1:20443/v2/info | jq '{burn_block_height, stacks_tip_height}'
```

The sBTC signer sees both chains. After its first backfill, `bitcoin.signer_tip` tracks `bitcoin.node_tip` and `stacks.signer_tip` tracks `stacks.node_tip`. Once the sBTC team has run DKG with the new signers, `dkg.current_aggregate_key` matches `dkg.contract_aggregate_key`:

```bash
curl --silent http://127.0.0.1:8801/info | jq .
```

The first backfill has finished when the sBTC signer logs `all Nakamoto blocks fetched`:

```bash
docker compose logs sbtc-signer | grep "all Nakamoto blocks fetched"
```

The Stacks node delivers events to the sBTC signer. This prints nothing when delivery works. Lines with `connection or request failed` mean the sBTC signer is not accepting the events:

```bash
docker compose logs --since 10m stacks-blockchain | grep "Event dispatcher"
```

### The files

<details>

<summary><code>.env</code></summary>

```bash
# Your signer's private key, as 64 hex characters. Keep it secret.
SIGNER_PRIVATE_KEY=

# Every signer's public key, separated by commas, in any order. The first two
# belong to the network's current signers. Add the keys the sBTC team sends
# you, including yours.
SIGNER_PUBLIC_KEYS=024d5fc127fe0e33611c5e4e35d32242620f5b4f4d7e4a5cf91fc6cfdb9c8f9f27,03ec7a88a4b34555b5adc5cbec8099b1195cf4ac10cd477ed7d2415c7e11497ad9

# The number of signatures required, which the sBTC team sends you.
SIGNER_SIGNATURES_REQUIRED=

# Another signer's P2P address, which the sBTC team sends you, such as
# tcp://203.0.113.10:4122.
SIGNER_SEEDS=

# The Emily API key the sBTC team sends you.
EMILY_API_KEY=

# The sanctions list URL the sBTC team sends you.
SANCTIONS_URL=

# Credentials you choose. They stay on this machine. Use only letters, digits
# and hyphens, since they also go into URLs.
BITCOIN_RPC_USERNAME=bitcoin
BITCOIN_RPC_PASSWORD=
POSTGRES_PASSWORD=
```

</details>

<details>

<summary><code>docker-compose.yml</code></summary>

```yaml
name: sbtc-onboarding-network

services:
  postgres:
    image: postgres:16.3-alpine@sha256:36ed71227ae36305d26382657c0b96cbaf298427b3f1eaeb10d77a6dea3eec41
    restart: on-failure
    stop_grace_period: 5s
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}
      POSTGRES_DB: signer
    volumes:
      - postgres-data:/var/lib/postgresql/data

  bitcoin:
    image: bitcoin/bitcoin:28.1@sha256:f332e1117453886b704e8f985dc21594917e79422860effe7842f2aa45a3ac6e
    restart: on-failure
    environment:
      BITCOIN_RPC_USERNAME: ${BITCOIN_RPC_USERNAME:?set BITCOIN_RPC_USERNAME in .env}
      BITCOIN_RPC_PASSWORD: ${BITCOIN_RPC_PASSWORD:?set BITCOIN_RPC_PASSWORD in .env}
    entrypoint:
      - /bin/bash
      - -c
      - |
        set -e
        exec bitcoind \
          -conf=/etc/bitcoin/bitcoin.conf \
          -datadir=/chainstate \
          "-rpcuser=$${BITCOIN_RPC_USERNAME}" \
          "-rpcpassword=$${BITCOIN_RPC_PASSWORD}"
    ports:
      - "127.0.0.1:18443:18443" # RPC
    volumes:
      - ./bitcoin.conf:/etc/bitcoin/bitcoin.conf:ro
      - bitcoin-data:/chainstate

  stacks-blockchain:
    image: ghcr.io/stacks-network/stacks-core:4.0.5-alpine@sha256:eaa53873c8ed50605e1ee8920c0ee07dcdaaabc6f90144593dead0a23165d2ca
    restart: on-failure
    command: ["/bin/stacks-node", "start", "--config", "/src/stacks-blockchain/Config.toml"]
    ports:
      - "127.0.0.1:20443:20443" # RPC
      - "127.0.0.1:9153:9153" # Prometheus metrics
    volumes:
      - ./stacks-config.toml:/src/stacks-blockchain/Config.toml:ro
      - stacks-data:/root/stacks-blockchain/data
    depends_on:
      - bitcoin

  blocklist-client:
    image: ghcr.io/stacks-sbtc/sbtc:blocklist-client-v1.4.2@sha256:df337adcfa85e306a28d7f39c1731a7eccdd9bb32a34a008660a3d186bd658ff
    restart: on-failure
    environment:
      BLOCKLIST_CLIENT_SERVER__HOST: "0.0.0.0"
      BLOCKLIST_CLIENT_SERVER__PORT: "3032"
      # The list baked into the image, loaded at boot so screening works
      # before the first fetch from the URL below succeeds.
      BLOCKLIST_CLIENT_SANCTIONS__LOCAL_PATH: /etc/blocklist-client/sanctions.txt
      BLOCKLIST_CLIENT_SANCTIONS__URL: ${SANCTIONS_URL:?set SANCTIONS_URL in .env}

  sbtc-signer:
    image: ghcr.io/stacks-sbtc/sbtc:signer-v1.4.2@sha256:8d7331b39edddfe60d4b86859143bd77628e4547390f4b0fef7ca2524c9f5a87
    restart: on-failure
    entrypoint:
      - /usr/local/bin/signer
      - --config
      - /signer-config.toml
      - --migrate-db
      - --output-format
      - json
    environment:
      RUST_LOG: info,signer=debug
      SIGNER_SIGNER__PRIVATE_KEY: ${SIGNER_PRIVATE_KEY:?set SIGNER_PRIVATE_KEY in .env}
      SIGNER_SIGNER__BOOTSTRAP_SIGNING_SET: ${SIGNER_PUBLIC_KEYS:?set SIGNER_PUBLIC_KEYS in .env}
      SIGNER_SIGNER__BOOTSTRAP_SIGNATURES_REQUIRED: ${SIGNER_SIGNATURES_REQUIRED:?set SIGNER_SIGNATURES_REQUIRED in .env}
      SIGNER_SIGNER__P2P__SEEDS: ${SIGNER_SEEDS:?set SIGNER_SEEDS in .env}
      SIGNER_SIGNER__DB_ENDPOINT: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/signer
      SIGNER_EMILY__ENDPOINTS: https://${EMILY_API_KEY:?set EMILY_API_KEY in .env}@dev.sbtc-emily-dev.com
      SIGNER_BITCOIN__RPC_ENDPOINTS: http://${BITCOIN_RPC_USERNAME}:${BITCOIN_RPC_PASSWORD}@bitcoin:18443
    ports:
      - "4122:4122" # P2P with the other signers; the only port reachable from outside
      - "127.0.0.1:8801:8801" # Event observer
      - "127.0.0.1:9184:9184" # Prometheus metrics
    volumes:
      - ./signer-config.toml:/signer-config.toml:ro
    depends_on:
      - postgres
      - bitcoin
      - blocklist-client

volumes:
  postgres-data:
  bitcoin-data:
  stacks-data:
```

</details>

<details>

<summary><code>signer-config.toml</code></summary>

```toml
# Settings shared by every signer on this network. Your own values come from
# the .env file.

[blocklist_client]
endpoint = "http://blocklist-client:3032"

[stacks]
endpoints = ["http://stacks-blockchain:20443"]

[signer]
network = "testnet"
deployer = "SNKW1SJK9HES9WP0T5HJ32DF20Z4365AD1FRJ8CT"
sbtc_bitcoin_start_height = 30900
bitcoin_processing_delay = 30
requests_processing_delay = 15
dkg_begin_pause = 15
prometheus_exporter_endpoint = "0.0.0.0:9184"

[signer.event_observer]
bind = "0.0.0.0:8801"

[signer.p2p]
listen_on = ["tcp://0.0.0.0:4122"]
# Optional. Set this to your public P2P address, such as
# ["tcp://203.0.113.10:4122"], if other signers can't reach you.
public_endpoints = []
enable_mdns = false
```

</details>

<details>

<summary><code>stacks-config.toml</code></summary>

```toml
[node]
working_dir = "/root/stacks-blockchain/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "0348af7ce1b224476e8f042727af3f84dcf49a69bb3c9dd2a1afaa783acfffb729@seed.testnet.hiro.so:20444"
prometheus_bind = "0.0.0.0:9153"
miner = false
stacker = false

pox_5_sbtc_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-token"
pox_5_sbtc_registry_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-registry"
pox_5_bond_admin = "ST1V2ASRWGR81W7GBN1Z4W2JQKXJWCADPVZG30X45"

[burnchain]
mode = "krypton"
peer_host = "bitcoin"
peer_port = 18444
pox_prepare_length = 100
pox_reward_length = 900

[connection_options]
private_neighbors = false

# Send the sBTC registry's events to the signer.
[[events_observer]]
endpoint = "sbtc-signer:8801"
events_keys = ["SNKW1SJK9HES9WP0T5HJ32DF20Z4365AD1FRJ8CT.sbtc-registry::print"]
timeout_ms = 10_000
disable_contract_interface = true

[[ustx_balance]]
address = "ST2QKZ4FKHAH1NQKYKYAYZPY440FEPK7GZ1R5HBP2"
amount = 10000000000000000

[[ustx_balance]]
address = "ST319CF5WV77KYR1H3GT0GZ7B8Q4AQPY42ETP1VPF"
amount = 10000000000000000

[[ustx_balance]]
address = "ST221Z6TDTC5E0BYR2V624Q2ST6R0Q71T78WTAX6H"
amount = 10000000000000000

[[ustx_balance]]
address = "ST2TFVBMRPS5SSNP98DQKQ5JNB2B6NZM91C4K3P7B"
amount = 10000000000000000

[[ustx_balance]]
address = "ST31XHNM0GZ2K978FPP4QA3STNQ73Z8C9G9MJEPK2"
amount = 10000000000000000

[[ustx_balance]]
address = "ST1B38CGQRPXEMRH7B66VXTS22DQTNMSW4YJJ7QK1"
amount = 10000000000000000

[[ustx_balance]]
address = "STDMN71Z0H9EF8CRKAWTGBB5YS0BNV26HZ79QFFP"
amount = 1000000000000000

[[ustx_balance]]
address = "ST1E0PSCH72JMQH9QCH293ZTEEH7BPA40Y3F39XQ"
amount = 10000000000000

[[ustx_balance]]
address = "ST3QBTK0Q438YVNX8EG6Z85HN0WKQPXYT25H5SPPK"
amount = 10000000000000

[[ustx_balance]]
address = "ST10BX04F9PC6N1WBXKW3H7CG0NS0A3PK650T3P3R"
amount = 10000000000000

[[ustx_balance]]
address = "ST3AF1BBQAFSFCM8K4ZBR1FBXP3P8J1CKGSGDHWR5"
amount = 100000000000000

[[ustx_balance]]
address = "STHY13V44422NAN6D3NSJPY9CDR3ED1M6HH9WZ6Y"
amount = 10000000000000

[[burnchain.epochs]]
epoch_name = "1.0"
start_height = 0

[[burnchain.epochs]]
epoch_name = "2.0"
start_height = 0

[[burnchain.epochs]]
epoch_name = "2.05"
start_height = 1

[[burnchain.epochs]]
epoch_name = "2.1"
start_height = 2

[[burnchain.epochs]]
epoch_name = "2.2"
start_height = 3

[[burnchain.epochs]]
epoch_name = "2.3"
start_height = 4

[[burnchain.epochs]]
epoch_name = "2.4"
start_height = 5

[[burnchain.epochs]]
epoch_name = "2.5"
start_height = 6

[[burnchain.epochs]]
epoch_name = "3.0"
start_height = 1802

[[burnchain.epochs]]
epoch_name = "3.1"
start_height = 1803

[[burnchain.epochs]]
epoch_name = "3.2"
start_height = 1804

[[burnchain.epochs]]
epoch_name = "3.3"
start_height = 1805

[[burnchain.epochs]]
epoch_name = "3.4"
start_height = 1806

[[burnchain.epochs]]
epoch_name = "4.0"
start_height = 2702
```

</details>

<details>

<summary><code>bitcoin.conf</code></summary>

```
regtest=1

[regtest]
addnode=bitcoin.regtest.dev.hiro.so
addnode=bitcoin.regtest.stg.hiro.so
addnode=bitcoin.regtest.hiro.so

blockfilterindex=1
printtoconsole=1
disablewallet=1
txindex=1

bind=0.0.0.0:18444

server=1
rest=1
rpcbind=0.0.0.0:18443
rpcallowip=0.0.0.0/0
rpcallowip=::/0
```

</details>
