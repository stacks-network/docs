---
title: Configurations
description: Configuration parameters and options for the stacks-node binary
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

# Command-line Subcommands and Options

## mocknet

Start a node based on a fast local setup emulating a burnchain. Ideal for smart contract development.

## krypton (deprecated)

Start a node that will join and stream blocks from the public krypton testnet, powered by Blockstack via (Proof of Transfer).

## xenon

Start a node that will join and stream blocks from the public xenon testnet, decentralized.

## start

Start a node with a config of your own. Can be used for joining a network, starting new chain, etc.

### Arguments:

#### --config: relative or absolute path to the TOML config file

Example:
stacks-node start --config=/path/to/config.toml

See [Configuration File Options](link to anchor) for more information.

### version

Displays information about the current version and the release cycle.

### help

Displays a help message.

# Configuration File Options

The TOML configuration file has multiple sections under which an option may be placed.

## Section: node

This section contains configuration options pertaining to the stacks-node.

### rpc_bind

Address and port stacks-node should use for RPC connections.

Example: `"0.0.0.0:20443"`

### p2p_bind

Address and port stacks-node should use for P2P connections.

Example: `"0.0.0.0:20444"`

### bootstrap_node (optional)

Public key, address, and port stacks-node should use to pull transaction data from when starting.

Example: `"048dd4f26101715853533dee005f0915375854fd5be73405f679c1917a5d4d16aaaf3c4c0d7a9c132a36b8c5fe1287f07dad8c910174d789eb24bdfb5ae26f5f27@krypton.blockstack.org:20444"`

### seed (optional)

The private key to use for mining. Only needed if `miner` is set to `true`.
[See this page for information on how to generate a private key.](https://docs.blockstack.org/mining)

Example: `"replace-with-your-private-key"`

### local_peer_seed (optional)

The private key to use for mining.
[See this page for information on how to generate a private key.](https://docs.blockstack.org/mining)

Example: `"replace-with-your-private-key"`

### miner

Determines whether the stacks-node is running a follower (`false`) or a miner (`true`).
[See this page for information on how to run a miner.](https://docs.blockstack.org/mining)

Example: `true`

### prometheus_bind (optional)

Address and port stacks-node should open for Prometheus metrics collection.

Example: `"0.0.0.0:9153"`

## Section: events_observer

### endpoint

Address and port to a stacks-node-api to watch for events.

Example: `"address-to-my-local.stacks-node-api.com:3700"`

### retry_count

Number of times to retry before failing.

Example: `255`

### events_keys

Event keys for which to watch.

Example: `["*"]`

## Section: burnchain

This section contains configuration options pertaining to the blockchain the stacks-node binds to on the backend for proof-of-transfer (BTC).

### chain

The blockchain stacks-node binds to on the backend for proof-of-transfer.

Example: `"bitcoin"`

### mode

The profile of which to run stacks-node.

Example: `"krypton"`

### peer_host

Host running the BTC blockchain.

Example: `"bitcoind.krypton.blockstack.org"`

### rpc_port

peer_host's port stacks-node will connect to for RPC connections.

Example: `18443`

### peer_port

peer_host's port stacks-node will connect to for P2P connections.

Example: `18444`

### process_exit_at_block_height

Block height of the burnchain at which the stacks-node will self-terminate. Used during the testnet phases for various testing cycles.

Example: `5340`

### burnchain_op_tx_fee

Transaction fee per each burnchain operation.

Example: `5500`

### burn_fee_cap

Max burn fee for a transaction.

Example: `30000`

### commit_anchor_block_within

TODO

Example: `10000`

## Section: mstx_balance

This section contains configuration options pertaining to the micro-STX balanaces for various addresses.

-> This section can be repeated multiple times.

### address

Address which maintains a micro-STX balance.

Example: `"STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"`

### amount

The balance of micro-STX given to the address.
Example: `10000000000000000`
