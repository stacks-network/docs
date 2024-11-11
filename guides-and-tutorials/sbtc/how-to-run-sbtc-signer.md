# How to Run a sBTC Signer

{% hint style="warning" %}
This documentation is for preview purposes only. The implementation is not final and should not be used in production. The configuration files, especially the docker-compose setup, will undergo significant changes. This guide is provided to give potential operators an early look at the setup process.
{% endhint %}

## Minimum System Requirements

These are the **minimum required specs** to be able to run a sBTC signer, but it is recommended to have more than the minimum for optimal performance. Note that these are in addition to the hardware requirements for running a Stacks node, Bitcoin node, and Nakamoto signer outlined in the How to Run a Signer doc.

- 1 cpu
- 256MB memory
- 50GB storage

## Bitcoin Node Requirements

Your Bitcoin node must include these settings for sBTC signer operation:

1. Required Settings:

   - `txindex=1`: Transaction indexing must be enabled
   - `server=1`: RPC server must be enabled
   - `zmqpubhashblock=tcp://*:28332`: ZMQ block hash notifications
   - `zmqpubrawblock=tcp://*:28332`: ZMQ raw block notifications

2. Optional but Recommended:
   - `coinstatsindex=1`: Enables additional index for coin statistics

Reference configuration:

<details>

<summary>bitcoin.conf example</summary>

```conf
regtest=1 #chain=regtest

[regtest]
printtoconsole=1
disablewallet=0
txindex=1
coinstatsindex=1

# Specify a non-default location to store blockchain data.
# blocksdir=/data/bitcoin-data
# Specify a non-default location to store blockchain and other data.
# datadir=/data/bitcoin-data

# [network]
# bind=0.0.0.0:18444
discover=0
dns=0
dnsseed=0
listenonion=0

# [rpc]
rpcserialversion=0
# Accept command line and JSON-RPC commands.
server=1
# Accept public REST requests.
rest=1
rpcbind=0.0.0.0:18333
rpcallowip=0.0.0.0/0
rpcallowip=::/0
rpcuser=user
rpcpassword=password

# [zmq]
# Note that this is required for the sbtc signer to work properly.
zmqpubhashblock=tcp://*:28332
zmqpubrawblock=tcp://*:28332

# [wallet]
addresstype=legacy
changetype=legacy
fallbackfee=0.00001
```

</details>

### ZeroMQ (ZMQ) Configuration

ZeroMQ enables real-time blockchain event notifications from Bitcoin Core to the sBTC signer. The two required ZMQ endpoints serve distinct purposes:

- `zmqpubhashblock`: Broadcasts only block hashes for lightweight block detection
- `zmqpubrawblock`: Broadcasts complete block data for transaction processing

This notification system creates a direct event stream:

1. Bitcoin Core validates a new block
2. Block data publishes via ZMQ
3. Signer processes relevant sBTC transactions

## Signer Configuration

The signer configuration file (`signer-config.toml`) defines the signer's operation parameters. The configuration sections include:

### Emily API Configuration

Controls connection to the Emily API server. The Emily API is designed to track deposits and withdrawals, providing information about the status of in-flight sBTC operations. It serves two primary user groups: sBTC users and sBTC app developers.

```toml
[emily]
endpoints = ["https://emily-sbtc.com"]
```

### Bitcoin Connection Settings

Defines how the signer connects to Bitcoin Core:

```toml
[bitcoin]
rpc_endpoints = ["http://user:pass@your-bitcoin-node:4122"]
block_hash_stream_endpoints = ["tcp://localhost:28332"]
```

### Core Signer Parameters

Defines the signer's identity and network participation:

```toml
[signer]
private_key = "your-private-key"  # 32 or 33-byte hex format
network = "mainnet"  # Network selection: mainnet, testnet, or regtest
deployer = "SNYourDeployerAddress"  # Address that deployed sbtc contracts
```

### P2P Network Configuration

Controls how the signer communicates with other network participants:

```toml
[signer.p2p]
listen_on = ["tcp://0.0.0.0:4122", "quic-v1://0.0.0.0:4122"]
```

Complete reference configuration:

<details>

<summary>signer-config.toml example</summary>

```toml
# DISCLAIMER! READ!
# This configuration file is an example of how it will likely look in production with some
# values filled in with example placeholders like `your-private-key` and `your-bitcoin-node`.
# The real production configuration will rely on some hardcoded values that can only be
# known after initial seed node deployments. This file is not meant to be used as is, but one will
# be created to be used later, and this documentation will be updated to reflect those changes.

# TODO(715): Provide sane/safe configuration defaults. Re-review all of them!
# TODO(429): Add documentation for all configuration parameters.

# !! ==============================================================================
# !! Blocklist Client Configuration
# !! ==============================================================================
[blocklist_client]

# You may specify a blocklist client url. If one is not specified, then
# deposit or withdrawal requests are always accepted.
#
# Format: "http(s)://<host>:<port>"
# Default: <none>
# Required: false
# Environment: SIGNER_BLOCKLIST_CLIENT__ENDPOINT
#
# Defined in the provided docker compose, do not uncomment unless you know
# what you're doing.
# -------------------------------------------------------------------------
# endpoint = "http://127.0.0.1:8080"

# !! ==============================================================================
# !! Emily API Configuration
# !! ==============================================================================
[emily]
# The URI(s) of the Emily API server to connect to.
#
# You may specify multiple Emily API servers if you have them. They will be
# tried round-robin until one succeeds.
#
# Format: ["http(s)://<host>:<port>", ..]
# Default: <none>
# Required: true
# Environment: SIGNER_EMILY__ENDPOINTS
endpoints = [
    "https://emily-sbtc.com"
]

# !! ==============================================================================
# !! Bitcoin Core Configuration
# !! ==============================================================================
[bitcoin]
# The URI(s) of the Bitcoin Core RPC server(s) to connect to.
#
# You may specify multiple Bitcoin Core RPC servers if you have them. They will
# be randomly tried until one succeeds.
#
# Format: ["http://<user>:<pass>@<host>:<port>", ..]
# Default: <none>
# Required: true
# Environment: SIGNER_BITCOIN__RPC_ENDPOINTS
# Environment Example: http://user:pass@seed-1:4122,http://foo:bar@seed-2:4122
rpc_endpoints = [
    "http://user:pass@your-bitcoin-node:4122",
]

# The URI(s) of the Bitcoin Core ZMQ block hash stream(s) to connect to.
#
# You may optionally specify multiple endpoints if you have them. They will be
# tried in order until one succeeds, and it will attempt failover to the next
# endpoint if the connection is lost.
#
# Format: ["tcp://<host>:<port>", ..]
# Default: <none>
# Required: true
# Environment: SIGNER_BITCOIN__BLOCK_HASH_STREAM_ENDPOINTS
# Environment Example: tcp://10.0.0.1:28332,tcp://10.0.0.2:28332
block_hash_stream_endpoints = [
    "tcp://localhost:28332"
]

# !! ==============================================================================
# !! Block Notifier Configuration
# !! ==============================================================================
# Electrum server connection confirmation.
[block_notifier]
# The URI of the Electrum server to connect to.
#
# Format: "<protocol>://<host>:<port>"
# Default: <none>
# Required: true
# Environment: SIGNER_BLOCK_NOTIFIER__SERVER
server = "tcp://localhost:60401"
retry_interval = 10
max_retry_attempts = 5
ping_interval = 60
subscribe_interval = 10

# !! ==============================================================================
# !! Stacks Node Configuration
# !! ==============================================================================
[stacks]
# The RPC URL(s) of the Stacks node(s) to connect to. At least one must be
# provided. If multiple nodes are provided they will be tried in order when
# making requests.
endpoints = ["stacks-node-rpc"]

# This is the start height of the first EPOCH 3.0 block on the stacks
# blockchain.
nakamoto_start_height = 867867

# !! ==============================================================================
# !! Signer Configuration
# !! ==============================================================================
[signer]
# The private key associated with the signer. This is used to generate the
# signers associated public key and sign messages to other signers.
#
# This may be either in 32- or 33-byte format. If you generated the key using
# `stacks-cli` or other ecosystem tools, it is likely that the key is in 33-byte
# format which includes a stacks-proprietary suffix byte. The sBTC signer doesn't
# make use of this byte and it will be trimmed automatically if provided.
#
# Format: "<hex-encoded-private-key>" (64 or 66 hex-characters)
# Required: true
# Environment: SIGNER_SIGNER__PRIVATE_KEY
private_key = "your-private-key"

# Specifies which network to use when constructing and sending transactions
# on stacks and bitcoin. This cooresponds to the `chain` flag in the
# bitcoin.conf file of the connected bitcoin-core node, and the
# `burnchain.mode` flag int he config.toml of the connected stacks-core
# node.
#
# Required: true
# Possible values: mainnet, testnet, regtest
# Environment: SIGNER_SIGNER__NETWORK
network = "mainnet"

# The address that deployed the sbtc smart contracts.
#
# Required: true
# TODO(715): Change after SCs have been deployed.
deployer = "SNYourDeployerAddress"

# The signer database endpoint (pgsql connection string)
#
# Required: true
# Environment: SIGNER_SIGNER__DB_ENDPOINT
#
# Defined in the provided docker compose, do not uncomment unless you know
# what you're doing.
# -------------------------------------------------------------------------
# db_endpoint = "postgresql://postgres:postgres@localhost:5432/signer"

# A complete list of (compressed) public keys for known bootstrap signer
# peers who are approved to be in the sBTC signer set.
#
# Required: true Environment: SIGNER_SIGNER__BOOTSTRAP_SIGNING_SET
# TODO(715): Change after initial signing set has been determined.
bootstrap_signing_set = [
    "03providedsigningsetpublickey023a1d53bc96ad670bfe03adf8a06c52e6380",
    "02providedsigningsetpublickey023b28143130a18099ecf094d36fef0f6135c",
]

# The number of signatures required for signing Stacks transactions when
# using the multi-sig wallet formed from the public keys in the
# `bootstrap_signing_set`. Must be strictly positive.
#
# Required: true Environment: SIGNER_SIGNER__BOOTSTRAP_SIGNATURES_REQUIRED
bootstrap_signatures_required = 15

# Seconds to wait before processing a new Bitcoin block.
# Required: true Environment: SIGNER_SIGNER__BITCOIN_PROCESSING_DELAY
# TODO(715): Expect this to change after testing.
bitcoin_processing_delay = 0

# !! ==============================================================================
# !! Stacks Event Observer Configuration
# !!
# !! The event observer listens for events on the Stacks blockchain. The listen
# !! address must be reachable by your Stacks node, and must be configured in the
# !! node's `event_observer` configuration section.
# !!
# !! Note that the event observer endpoint _does not_ support TLS and is served
# !! over HTTP.
# !! ==============================================================================
[signer.event_observer]
# The network interface (ip address) and port to bind the event observer server to.
#
# Format: "<ip>:<port>"
# Required: true
# Environment: SIGNER_SIGNER__EVENT_OBSERVER__BIND
bind = "0.0.0.0:8801"

# !! ==============================================================================
# !! Signer P2P Networking Configuration
# !! ==============================================================================
[signer.p2p]
# List of seed nodes to connect to to bootstrap the network.
#
# If specified, these nodes will be used to discover other nodes on the network.
# If not specified or if none of the specified seeds could be reached, the node
# will attempt to discover other nodes using StackerDB.
#
# See the `listen_on` parameter for available protocols.
#
# Format: ["<protocol>:<ip>:<port>", "<protocol>:<ip>:<port>", ...]
# Required: false
# Environment: SIGNER_SIGNER__P2P__SEEDS
# Environment Example: tcp://seed-1:4122,tcp://seed-2:4122
# TODO(429): Add well-known seed nodes
# TODO(715): Add well-known seed nodes
seeds = [
    "<protocol>:<ip>:<port>",
    "provided:provided-ip:provided-port"
]

# The local network interface(s) and port(s) to listen on.
#
# You may specify multiple interfaces and ports by adding additional entries to
# the list. Entries can be addressed by any of IPv4 address, IPv6 address or
# hostname. Note that not all networks have IPv6 enabled, so it is recommended
# to provide an IPv4 address as well.
#
# Specifying a port of `0` will cause the server to bind to a random port,
# and an IP of `0.0.0.0` will cause the server to listen on all available
# interfaces.
#
# Available protocols:
# - tcp: Standard TCP socket connections.
# - quick-v1: QUIC over UDP. This protocol is faster and uses less bandwidth,
#       but may not be supported by all nodes' networks. Nodes will always
#       attempt QUIC connections first, and fall back to TCP if it fails.
#       If UDP is blocked on your network then you should not specify a QUIC
#       listener (as it will never be reachable).
#       More information: https://en.wikipedia.org/wiki/QUIC
#
# Format: ["<protocol>:<ip>[:port]", ...]
# - If port is omitted then the default port 4122 will be used.
# Default: ["tcp://0.0.0.0:4122", "quic-v1://0.0.0.0:4122"]
# Required: false
# Environment: SIGNER_SIGNER__P2P__LISTEN_ON
#
# Defined in the provided docker compose, do not uncomment unless you know
# what you're doing.
# -------------------------------------------------------------------------
listen_on = ["tcp://0.0.0.0:4122", "quic-v1://0.0.0.0:4122"]

# The publicly accessible network endpoint to advertise to other nodes.
#
# If this is not specified then the node will attempt to use other peers on the
# network to determine its public endpoint. This is the recommended
# configuration for most users.
#
# If your network uses an advanced configuration with separate inbound/outbound
# addresses then you must specify this value with your inbound address and
# configure port-forwarding as auto-discovery will report your outbound address.
#
# Format: ["<protocol>:<ip>:<port>", ...] (see `listen_on` for protocol options)
# Default: <none>
# Required: false
# Environment: SIGNER_SIGNER__P2P__PUBLIC_ENDPOINTS
public_endpoints = []
```

</details>

### Network Protocol Details

The signer operates on port 4122 by default and supports both TCP and QUIC protocols for peer communication. The signer will attempt QUIC connections first for improved performance, automatically falling back to TCP if QUIC is unavailable or blocked on the network.

## Blocklist Client

The blocklist client provides address screening services for the signer node. It interfaces with external API services to perform risk analysis on Bitcoin addresses. Default implementation uses Chainalysis, but supports custom implementations.

Reference configuration:

<details>

<summary>blocklist-client-config.toml example</summary>

```toml
# !! ==============================================================================
# !! Blocklist Client Configuration
# !! ==============================================================================

[server]
# Server configurations.

# The host the server will run on.
host = "127.0.0.1"

# The port the server will run on.
port = 3032

[risk_analysis]
# Risk analysis configurations.

# The URL of the API you're planning to use to assess confirming or denying a
# bitcoin address. Note that the default implmentation of the blocklist client
# assumes the use of Chainalysis, but any method can be used as long as the API
# calls within the blocklist client are changed to match the new API.
api_url = "https://api.chainalysis.com"

# The API key for the API you're planning to use to assess confirming or denying.
api_key = "your-api-key"
```

</details>

## Container Setup

Specific instructions for running your Docker container will be added shortly, but this is an example of what the Docker compose file will look like, so you can begin to understand what you'll be running as a signer.

Remember, this is not production-ready yet and is only for demonstration purposes at the moment.

<details>

<summary>docker-compose.yml example</summary>

```yml
# DISCLAIMER! READ!
# This file is an example of how it will look in production but there may be changes
# to this once production docker images are created and uploaded to dockerhub. This file is
# not meant to be used as is, but a docker compose like this one be created to be used later,
# and this documentation will be updated to reflect those changes.

# Services.
# ------------------------------------------------------------------------------
services:
  postgres:
    image: postgres:15-alpine
    stop_grace_period: 5s
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: signer
    ports:
      - 5432:5432

  sbtc-signer:
    image: blockstack/sbtc:signer-latest
    entrypoint: "/bin/bash -c '/usr/local/bin/signer -c /signer-config.toml --migrate-db'"
    depends_on:
      - postgres
    environment:
      RUST_LOG: info
      SIGNER_SIGNER__P2P__LISTEN_ON: tcp://0.0.0.0:4122
      SIGNER_SIGNER__DB_ENDPOINT: postgresql://postgres:postgres@postgres-1:5432/signer
      SIGNER_BLOCKLIST_CLIENT__ENDPOINT: http://localhost:3032
    volumes:
      - ./config/signer-config.toml:/signer-config.toml
    ports:
      - "4122:4122"

  blocklist-client:
    image: blockstack/sbtc:blocklist-client-latest
    entrypoint: "/bin/bash -c '/usr/local/bin/blocklist-client -c /blocklist-client-config.toml'"
    volumes:
      - ./config/blocklist-client-config.toml:/blocklist-client-config.toml
    ports:
      - "3032:3032"

  bitcoin:
    build: bitcoin
    ports:
      - "18443:18443"
      - "28332:28332"
    volumes:
      - ./bitcoin/bitcoin.conf:/root/.bitcoin/bitcoin.conf
    entrypoint:
      - /bin/bash
      - -c
      - |
        set -e
        bitcoind
    profiles:
      - default
      - bitcoin-mempool
```

</details>

## Monitoring

Monitoring Details TBD

## Troubleshooting

Troubleshooting Guide TBD
