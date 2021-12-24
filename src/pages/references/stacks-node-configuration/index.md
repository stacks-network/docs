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

### krypton

Start a node that will join and stream blocks from the public krypton regtest, powered by Blockstack via [Proof of Transfer](/understand-stacks/overview#proof-of-transfer-pox).

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

### mainnet

Start a node that joins and streams blocks from the public mainnet.

Example:

```bash
stacks-node mainnet
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
# Enter your private key here
seed = "replace-with-your-private-key"
miner = true
```

#### working_dir (optional)

Absolute path to the directory which the stacks-node will use for storing various data.
Until [issue 1576](https://github.com/blockstack/stacks-blockchain/issues/1576) is resolved, this option is unsupported -- use at your own risk.

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

[See this page for information on how to generate a private key.](/start-mining)

Example:

```toml
seed = "replace-with-your-private-key"
```

#### local_peer_seed (optional)

The private key to use for signing P2P messages in the networking stack. It differentiates network peers and is used even by non-mining nodes.

[See this page for information on how to generate a private key.](/start-mining)

Example:

```toml
local_peer_seed = "replace-with-your-private-key"
```

#### miner (optional)

Determines whether the stacks-node is running a follower (`false`) or a miner (`true`). Defaults to `false` if omitted.

[See this page for information on how to run a miner.](/start-mining)

Example:

```toml
miner = true
```

#### mine_microblocks (optional)

Determines whether the stacks-node will mine microblocks. Will only take effect if `miner` is set to `true`.

[See this page for information on how to run a miner.](/start-mining)

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
download_interval = 60
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
download_interval = 60
```

#### walk_interval

Time (in seconds) between attempts to walk the neighborhood.

Example:

```toml
walk_interval = 30
```

#### read_only_call_limit_read_length

Total number of bytes allowed to be read by an individual read-only function call.

Example:

```toml
read_only_call_limit_read_length = 100000
```

#### read_only_call_limit_read_count

Total number of independent read operations permitted for an individual read-only function call.

Example:

```toml
read_only_call_limit_read_count = 30
```

#### read_only_call_limit_runtime

[Runtime cost](https://github.com/stacksgov/sips/blob/2d3fd9bf8da7a04f588d90ff6252173d7609d7bf/sips/sip-006/sip-006-runtime-cost-assessment.md#introduction) limit for an individual read-only function call.

Example:

```toml
read_only_call_limit_runtime = 1000000000
```

### Section: burnchain

This section contains configuration options pertaining to the blockchain the stacks-node binds to on the backend for proof-of-transfer (BTC).

Example:

```toml
[burnchain]
chain = "bitcoin"
mode = "mainnet"
peer_host = "your.bitcoind.node.org"
rpc_port = 8332
peer_port = 8333
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

Domain name of the host running the backend Bitcoin blockchain. It's required to either run a personal Bitcoin node locally, or to use a publicly hosted Bitcoin node.

Example:

```toml
peer_host = "your.bitcoind.node.org"
```

#### rpc_port

peer_host's port stacks-node will connect to for RPC connections.

Example:

```toml
rpc_port = 8332
```

#### peer_port

peer_host's port stacks-node will connect to for P2P connections.

Example:

```toml
peer_port = 8333
```

#### burn_fee_cap (optional)

Maximum amount (in Satoshis) of "burn commitment" to broadcast for the next block's leader election.

Example:

```toml
burn_fee_cap = 30000
```

#### satoshis_per_byte (optional)

Amount (in Satoshis) per [virtual byte](https://en.bitcoin.it/wiki/Weight_units). This is used to compute the transaction fees.

Example:

```toml
satoshis_per_byte = 50
```

So total transaction cost would be `(estimated_tx_size * satoshis_per_byte) + burn_fee_cap`.

#### commit_anchor_block_within (optional)

Sets the time period (in milliseconds) for commitments. Only used when `mode` is set to `"helium"`.

Example:

```toml
commit_anchor_block_within = 10000
```

### Section: ustx_balance (testnet/regtest only)

This section contains configuration options pertaining to the genesis block allocation for an address in micro-STX. If a user changes these values, their node may be in conflict with other nodes on the network and find themselves unable to sync with other nodes.

-> This section can repeat multiple times, and thus is in double-brackets. Each section can define only one address. This section is ignored if running a node on mainnet.

Example:

```toml
[[ustx_balance]]
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
amount = 10000000000000000

[[ustx_balance]]
address = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y"
amount = 10000000000000000

[[ustx_balance]]
address = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR"
amount = 10000000000000000

[[ustx_balance]]
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
