---
title: Stacks Node Configuration
description: Configuration parameters and options for the stacks-node binary
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Usage

```bash
stacks-node sub-command [--subcommand-option <value>]
```

## Subcommands

-> Note that the `stacks-node` binary may have deprecated commands that are not documented on this page. Deprecated commands may be accessible until they are fully removed from the sources.

### mocknet

Start a node based on a fast local setup emulating a burnchain. Ideal for smart contract development.

Example:

```bash
stacks-node mocknet
```

### krypton (deprecated)

Start a node that will join and stream blocks from the public krypton testnet, powered by Blockstack via [Proof of Transfer](https://docs.blockstack.org/stacks-blockchain/overview#proof-of-transfer-pox).

Example:

```bash
stacks-node krypton
```

### xenon

Start a node that will join and stream blocks from the public xenon testnet.

Example:

```bash
stacks-node xenon
```

### start

Start a node with a config of your own. Can be used for joining a network, starting a new chain, or replacing default values used by the `mocknet` or `xenon` subcommands.

#### Arguments

**--config**: relative or absolute path to the TOML config file. Required.

Example:

```bash
stacks-node start --config=/path/to/config.toml
```

See [Configuration File Options](#configuration-file-options) for more information.

#### version

Displays information about the current version and the release cycle.

Example:

```bash
stacks-node version
```

#### help

Displays a help message.

Example:

```bash
stacks-node help
```

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

Absolute path to the directory which the stacks-node will use for storing various data.

Example:

```toml
working_dir = "/root/stacks-node"
```

#### rpc_bind

Address and port stacks-node should bind to for RPC connections.

Example:

```toml
rpc_bind = "0.0.0.0:20443"
```

#### p2p_bind

Address and port stacks-node should bind to for P2P connections.

Example:

```toml
p2p_bind = "0.0.0.0:20444"
```

#### data_url (optional)

Address and port from which the stacks-node will be receiving incoming rpc connections.

Example:

```toml
data_url = "1.2.3.4:20443"
```

#### p2p_address (optional)

Address and port from which the stacks-node will be receiving incoming p2p connections.

Example:

```toml
p2p_address = "1.2.3.4:20444"
```

#### bootstrap_node (optional)

Public key, address, and port stacks-node should use to pull transaction data from when starting.

Example:

```toml
bootstrap_node = "047435c194e9b01b3d7f7a2802d6684a3af68d05bbf4ec8f17021980d777691f1d51651f7f1d566532c804da506c117bbf79ad62eea81213ba58f8808b4d9504ad@xenon.blockstack.org:20444"
```

#### wait_time_for_microblocks (optional)

The amount of time (in milliseconds) that a node will wait before trying to mine a block, after catching up to the anchored chain tip. This gives the current leader time to broadcast microblocks that will get included in that mined block.

Example:

```toml
wait_time_for_microblocks = 15000
```

#### seed (optional)

The private key to use for mining. Only needed if `miner` is set to `true`.

[See this page for information on how to generate a private key.](https://docs.blockstack.org/mining)

Example:

```toml
seed = "replace-with-your-private-key"
```

#### local_peer_seed (optional)

The private key to use for signing P2P messages in the networking stack. It differentiates network peers and is used even by non-mining nodes.

[See this page for information on how to generate a private key.](https://docs.blockstack.org/mining)

Example:

```toml
local_peer_seed = "replace-with-your-private-key"
```

#### miner (optional)

Determines whether the stacks-node is running a follower (`false`) or a miner (`true`). Defaults to `false` if omitted.

[See this page for information on how to run a miner.](https://docs.blockstack.org/mining)

Example:

```toml
miner = true
```

#### mine_microblocks (optional)

Determines whether the stacks-node will mine microblocks. Will only take effect if `miner` is set to `true`.

[See this page for information on how to run a miner.](https://docs.blockstack.org/mining)

Example:

```toml
mine_microblocks = true
```

#### prometheus_bind (optional)

Address and port stacks-node should open for Prometheus metrics collection.

Example:

```toml
prometheus_bind = "0.0.0.0:9153"
```

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

Example:

```toml
endpoint = "address-to-my-local.stacks-node-api.com:3700"
```

#### retry_count

Number of times to retry sending events to the endpoint before failing.

Example:

```toml
retry_count = 255
```

#### events_keys

Event keys for which to watch. The emitted node events can be restricted by account, function name and event type. Asterix ("\*") can be used to emit all events.

Examples:

```toml
events_keys = ["*"]
```

```toml
events_keys = [
    "STGT7GSMZG7EA0TS6MVSKT5JC1DCDFGZWJJZXN8A.store::print",
    "STGT7GSMZG7EA0TS6MVSKT5JC1DCDFGZWJJZXN8A.contract.ft-token",
    "STGT7GSMZG7EA0TS6MVSKT5JC1DCDFGZWJJZXN8A.contract.nft-token",
    "stx"
]
```

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

The advertised public IP of this stacks-node.

Example:

```toml
public_ip_address = "1.2.3.4:20444"
```

#### download_interval

Time (in seconds) between attempts to download blocks.

Example:

```toml
download_interval = 10
```

#### walk_interval

Time (in seconds) between attempts to walk the neighborhood.

Example:

```toml
walk_interval = 30
```

### Section: burnchain

This section contains configuration options pertaining to the blockchain the stacks-node binds to on the backend for proof-of-transfer (BTC).

Example:

```toml
[burnchain]
chain = "bitcoin"
mode = "krypton"
peer_host = "bitcoind.blockstack.org"
rpc_port = 18443
peer_port = 18444
```

#### chain

The blockchain stacks-node binds to on the backend for proof-of-transfer. Only value supported: `"bitcoin"`.

Example:

```toml
chain = "bitcoin"
```

#### mode

The profile or test phase of which to run stacks-node. Valid values are `"mocknet"`, `"helium"`, `"neon"`, `"argon"`, `"krypton"`, `"xenon"`.

Example:

```toml
mode = "xenon"
```

#### peer_host

Domain name of the host running the backend Bitcoin blockchain.

Example:

```toml
peer_host = "bitcoind.xenon.blockstack.org"
```

#### rpc_port

peer_host's port stacks-node will connect to for RPC connections.

Example:

```toml
rpc_port = 18443
```

#### peer_port

peer_host's port stacks-node will connect to for P2P connections.

Example:

```toml
peer_port = 18444
```

#### process_exit_at_block_height (optional)

Block height of the burnchain at which the stacks-node will self-terminate. Used during the testnet phases for various testing cycles.

Example:

```toml
process_exit_at_block_height = 5340
```

#### burnchain_op_tx_fee (optional)

Transaction fee per burnchain operation.

Example:

```toml
burnchain_op_tx_fee = 5500
```

#### burn_fee_cap (optional)

Max burn fee for a transaction.

Example:

```toml
burn_fee_cap = 30000
```

#### commit_anchor_block_within (optional)

Sets the time period (in milliseconds) for commitments. Only used when `mode` is set to `"helium"`.

Example:

```toml
commit_anchor_block_within = 10000
```

### Section: mstx_balance

This section contains configuration options pertaining to the genesis block allocation for an address in micro-STX. If a user changes these values, their node may be in conflict with other nodes on the network and find themselves unable to sync with other nodes.

-> This section can be repeated multiple times, and thus is in double-brackets. Each section can define only one address.

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

Example:

```toml
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
```

#### amount

The balance of micro-STX given to the address at the start of the node.

Example:

```toml
amount = 10000000000000000
```
