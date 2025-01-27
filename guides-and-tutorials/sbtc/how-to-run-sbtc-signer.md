# How to Run an sBTC Signer

{% hint style="info" %}
This documentation provides guidelines, best-practices and recommendations for
running an sBTC Signer. Review it and adapt it to your infrastructure policy
before deploying it.
{% endhint %}

{% hint style="warning" %}
Each sBTC signer will control a set of signing shares used to sign transactions
on both Bitcoin and Stacks.

Such shares will be encrypted by using the `private_key` specified in the
Signer's config and stored in the PostgreSQL database attached to each signer.

It is of the utmost importance to:

1. Prevent unauthorized access to the sBTC Signer infrastructure (the signer
   itself, its private key, and the associated PostgreSQL database);
1. keep an offline, secure backup of the sBTC Signer private key;
1. regularly backup the PosgreSQL database and store it in a secure location.

See [here](./best-practices-for-running-an-sbtc-signer.md) for additional best
practices to run an sBTC signer.
{% endhint %}

## Minimum System Requirements

Below are the **minimum required specs** to be able to run a sBTC signer.

- 2 CPU
- 4GB memory
- 50GB storage

Note that these are in _addition_ to the hardware requirements for running a
Stacks node and Bitcoin node outlined in the [How to Run a Signer
doc](../running-a-signer/README.md).

## Connection diagram

![Connection Diagram](sbtc_diagram.png)

## 1. Configure your Bitcoin node

### Minimum version

You will need `bitcoind` version 25 or higher.

### Settings

Your Bitcoin node must include these settings for sBTC signer operation:

   - `txindex=1`: Transaction indexing must be enabled
   - `server=1`: RPC server must be enabled
   - `zmqpubhashblock=tcp://*:28332`: ZMQ block hash notifications
   - `zmqpubrawblock=tcp://*:28332`: ZMQ raw block notifications

### ZeroMQ (ZMQ) Configuration

The ZeroMQ configuration specified above enables real-time blockchain event
notifications from Bitcoin Core to the sBTC signer.

The two required ZMQ endpoints serve distinct purposes:

- `zmqpubhashblock`: Broadcasts only block hashes for lightweight block
  detection
- `zmqpubrawblock`: Broadcasts complete block data for transaction processing

This notification system creates a direct event stream when:

1. Bitcoin Core validates a new block
1. Block data publishes via ZMQ
1. Signer processes relevant sBTC transactions

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
  -txindex \
  -zmqpubhashblock="tcp://*:${BITCOIN_ZMQ_PORT}" \
  -zmqpubrawblock="tcp://*:${BITCOIN_ZMQ_PORT}"
```

## 2. Configure your Stacks node

### Minimum version

Please ensure your Stacks version is up-to-date (using the latest release).

### Event observer

You will need to add a _new_ event observer that relays information from the
sBTC smart contracts to the sBTC signer:

```toml
[[events_observer]]
endpoint = "sbtc-signer:8801"
events_keys = [
    "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-registry::print",
]
```

### Reference configuration

See
[here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/nodes/stacks/Config.toml.in).


## 3. Configure your sBTC Signer

The signer configuration file (`signer-config.toml`) defines the signer's
operation parameters. The configuration sections include:

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
block_hash_stream_endpoints = ["tcp://localhost:28332"]
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

The signer operates on port 4122 by default and supports both TCP and QUIC
protocols for peer communication. The signer will attempt QUIC connections first
for improved performance, automatically falling back to TCP if QUIC is
unavailable or blocked on the network.

### Reference configuration

See
[here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/sbtc-signer/signer-config.toml.in).

## 4. Set up your containers

See
[here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/docker-compose.yml)
for a Docker Compose including all the required components.

## Monitoring

Monitoring Details TBD

## Troubleshooting

Troubleshooting Guide TBD
