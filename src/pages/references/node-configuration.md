---
title: Node Configuration
description: Configuration parameters and options for the stacks-node binary
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Subcommands](#subcommands)
- [Configuration File Options](#configuration-file-options)
  - [Section: node](#section-node)
  - [Section: events_observer (optional)](#section-events_observer-optional)
  - [Section: connection_options (optional)](#section-connection_options-optional)
  - [Section: burnchain](#section-burnchain)
  - [Section: mstx_balance](#section-mstx_balance)

## Installation

See this page for installation instructions.
[@page-reference | inline]
| /stacks-blockchain/running-testnet-node

## Usage

`stacks-node sub-command [--subcommand-option <value>]`

## Subcommands

### mocknet

Start a node based on a fast local setup emulating a burnchain. Ideal for smart contract development.

Example: `stacks-node mocknet`

### krypton (deprecated)

Start a node that will join and stream blocks from the public krypton testnet, powered by Blockstack via (Proof of Transfer).

Example: `stacks-node krypton`

### xenon

Start a node that will join and stream blocks from the public xenon testnet, decentralized.

Example: `stacks-node xenon`

### start

Start a node with a config of your own. Can be used for joining a network, starting new chain, etc.

#### Arguments

**--config**: relative or absolute path to the TOML config file. Required.

Example: `stacks-node start --config=/path/to/config.toml`

See [Configuration File Options](#configuration-file-options) for more information.

#### version

Displays information about the current version and the release cycle.

Example: `stacks-node version`

#### help

Displays a help message.

Example: `stacks-node help`

## Configuration File Options

The TOML configuration file has multiple sections under which an option may be placed.

To see a list of example configurations, [please see this page](https://github.com/blockstack/stacks-blockchain/tree/master/testnet/stacks-node/conf).

### Section: node

Contains various configuration options pertaining to the stacks-node.

Example:

```toml
[node]
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "048dd4f26101715853533dee005f0915375854fd5be73405f679c1917a5d4d16aaaf3c4c0d7a9c132a36b8c5fe1287f07dad8c910174d789eb24bdfb5ae26f5f27@testnet-miner.blockstack.org:20444"
# Enter your private key here!
seed = "replace-with-your-private-key"
miner = true
```

#### working_dir (optional)

Absolute path to the directory which the stacks-node will use for storing various data

Example: `"/root/stacks-node"`

#### rpc_bind

Address and port stacks-node should bind to for RPC connections.

Example: `"0.0.0.0:20443"`

#### p2p_bind

Address and port stacks-node should bind to for P2P connections.

Example: `"0.0.0.0:20444"`

#### data_url (optional)

Address and port from which the stacks-node will be receiving incoming rpc connections.

Example: `"1.2.3.4:20443"`

#### p2p_address (optional)

Address and port from which the stacks-node will be receiving incoming p2p connections.

Example: `"1.2.3.4:20444"`

#### bootstrap_node (optional)

Public key, address, and port stacks-node should use to pull transaction data from when starting.

Example: `"048dd4f26101715853533dee005f0915375854fd5be73405f679c1917a5d4d16aaaf3c4c0d7a9c132a36b8c5fe1287f07dad8c910174d789eb24bdfb5ae26f5f27@krypton.blockstack.org:20444"`

#### wait_time_for_microblocks (optional)

Time to wait (in milliseconds) for microblocks.

Example: `15000`

#### seed (optional)

The private key to use for mining. Only needed if `miner` is set to `true`.

[See this page for information on how to generate a private key.](https://docs.blockstack.org/mining)

Example: `"replace-with-your-private-key"`

#### local_peer_seed (optional)

The private key to use for mining.

[See this page for information on how to generate a private key.](https://docs.blockstack.org/mining)

Example: `"replace-with-your-private-key"`

#### miner (optional)

Determines whether the stacks-node is running a follower (`false`) or a miner (`true`).

[See this page for information on how to run a miner.](https://docs.blockstack.org/mining)

Example: `true`

#### prometheus_bind (optional)

Address and port stacks-node should open for Prometheus metrics collection.

Example: `"0.0.0.0:9153"`

### Section: events_observer (optional)

Contains options for watching events emitted by a local [stacks-blockchain-api](https://github.com/blockstack/stacks-blockchain-api) service.

-> This section can be repeated multiple times.

Example:

```toml
[[events_observer]]
endpoint = "address-to-my-local.stacks-node-api.com:3700"
retry_count = 255
events_keys = ["*"]
```

#### endpoint

Address and port to a stacks-node-api to watch for events.

Example: `"address-to-my-local.stacks-node-api.com:3700"`

#### retry_count

Number of times to retry before failing.

Example: `255`

#### events_keys

Event keys for which to watch.

Example: `["*"]`

### Section: connection_options (optional)

Specifies configuration options for others connecting to the stacks node.

Example:

```toml
[connection_options]
public_ip_address = "1.2.3.4:20444"
download_interval = 10
walk_interval = 30
```

#### public_ip_address

The advertised public IP of this stacks-node

Example: `"1.2.3.4:20444"`

#### download_interval

Time (in seconds) between attempts to download blocks

Example: `10`

#### walk_interval

Time (in seconds) between attempts to walk the Merkle tree

Example: `30`

### Section: burnchain

Example:

```toml
[burnchain]
chain = "bitcoin"
mode = "krypton"
peer_host = "bitcoind.blockstack.org"
rpc_port = 18443
peer_port = 18444
```

This section contains configuration options pertaining to the blockchain the stacks-node binds to on the backend for proof-of-transfer (BTC).

#### chain

The blockchain stacks-node binds to on the backend for proof-of-transfer.

Example: `"bitcoin"`

#### mode

The profile of which to run stacks-node.

Example: `"krypton"`

#### peer_host

Host running the BTC blockchain.

Example: `"bitcoind.krypton.blockstack.org"`

#### rpc_port

peer_host's port stacks-node will connect to for RPC connections.

Example: `18443`

#### peer_port

peer_host's port stacks-node will connect to for P2P connections.

Example: `18444`

#### process_exit_at_block_height (optional)

Block height of the burnchain at which the stacks-node will self-terminate. Used during the testnet phases for various testing cycles.

Example: `5340`

#### burnchain_op_tx_fee (optional)

Transaction fee per burnchain operation.

Example: `5500`

#### burn_fee_cap (optional)

Max burn fee for a transaction.

Example: `30000`

#### commit_anchor_block_within (optional)

Sets the time period (in milliseconds) for commitments. Only used when `mode` is set to `"helium"`.

Example: `10000`

### Section: mstx_balance

This section contains configuration options pertaining to the micro-STX balanaces for various addresses.

-> This section can be repeated multiple times, and thus is in double-brackets.

Example:

```toml
[[mstx_balance]]
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
amount = 10000000000000000

[[mstx_balance]]
address = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y"
amount = 10000000000000000

[[mstx_balance]]
address = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR"
amount = 10000000000000000

[[mstx_balance]]
address = "STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP"
amount = 10000000000000000
```

#### address

Address which maintains a micro-STX balance.

Example: `"STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"`

#### amount

The balance of micro-STX given to the address.
Example: `10000000000000000`
