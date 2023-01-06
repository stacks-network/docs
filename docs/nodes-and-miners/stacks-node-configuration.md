---
title: Stacks Node Configuration
description: Configuration parameters and options for the stacks-node binary
sidebar_position: 4
---

## Usage

```bash
stacks-node sub-command [--subcommand-option <value>]
```

### Subcommands

:::caution
The `stacks-node` binary may have deprecated commands that are not documented on this page. Deprecated commands may be accessible until they are fully removed from the sources.
:::

### mocknet

Start a node based on a fast local setup emulating a burnchain. Ideal for smart contract development.

Example:

```bash
stacks-node mocknet
```

### krypton

Start a node that will join and stream blocks from the public krypton regtest, powered by Blockstack via [Proof of Transfer](../stacks-academy/proof-of-transfer.md).

Example:

```bash
stacks-node krypton
```

### testnet

Start a node that will join and stream blocks from the public testnet.

Example:

```bash
stacks-node testnet
```

### mainnet

Start a node that joins and streams blocks from the public mainnet.

Example:

```bash
stacks-node mainnet
```

### start

Start a node with a config of your own. Can be used for joining a network, starting a new chain, or replacing default values used by the `mocknet` or `testnet` subcommands.

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

The Stacks Blockchain configuration file has multiple sections under which an option may be placed.

- [node](./stacks-node-configuration#node)
- [events_observer](./stacks-node-configuration#events_observer)
- [connection_options](./stacks-node-configuration#connection_options)
- [burnchain](./stacks-node-configuration#burnchain)
- [ustx_balance](./stacks-node-configuration#ustx_balance)

For reference, several configuration file examples are [available here](https://github.com/stacks-network/stacks-blockchain/tree/master/testnet/stacks-node/conf)

- [Example mainnet follower configuration](./stacks-node-configuration#example-mainnet-follower-configuration)

### node

Contains various configuration options for the stacks-node binary.

| Name                      | Required | Description                                                                                                       |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| rpc_bind                  | ✓        | IPv4 address and port to open for RPC connections                                                                 |
| p2p_bind                  | ✓        | IPv4 address and port to open for P2P connections                                                                 |
| working_dir               |          | Absolute path to the directory where chainstate data will be stored                                               |
| data_url                  |          | IPv4 address and port for incoming RPC connections                                                                |
| p2p_address               |          | IPv4 address and port for incoming P2P connections                                                                |
| bootstrap_node            |          | Public key, IPv4 address, and port to bootstrap the chainstate                                                    |
| wait_time_for_microblocks |          | The amount of time in ms to wait before trying to mine a block after catching up to the anchored chain tip        |
| seed                      |          | The [private key](./miner-mainnet#generate-a-keychain) to use for mining. Only needed if `miner` is set to `true` |
| local_peer_seed           |          | The [private key](./miner-mainnet#generate-a-keychain) to use for signing P2P messages in the networking stack    |
| miner                     |          | Determines whether the node is running a follower (`false`) or a miner (`true`). Defaults to `false`              |
| mock_miner                |          | Simulates running a miner (typically used for debugging)                                                          |
| mine_microblocks          |          | Determines whether the node will mine microblocks. Will only take effect if `miner` is set to `true`              |
| prometheus_bind           |          | Address and port for Prometheus metrics collection.                                                               |

### events_observer

:::info
This section is _optional_ and not required

However, if this section is added, **all** fields are required
:::
Contains options for sending events emitted to the [stacks-blockchain-api](https://github.com/hirosystems/stacks-blockchain-api) service.

| Name        | Required | Description                                                                                                                                                       |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| endpoint    | ✓        | Address and port to a [stacks-blockchain-api](https://github.com/hirosystems/stacks-blockchain-api) service                                                       |
| retry_count | ✓        | Number of times to retry sending events to the endpoint before failing                                                                                            |
| events_keys | ✓        | Event keys for which to watch. The emitted node events can be restricted by account, function name and event type. Asterix ("\*") can be used to emit all events. |     |

### connection_options

:::info
This section is _optional_ and not required.

However, if this section is added, **all** fields are required
:::

Specifies configuration options for others connecting to the stacks node.

| Name                             | Required | Description                                                                                                                                                 |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| public_ip_address                | ✓        | Public IPv4 to advertise to other nodes                                                                                                                     |
| download_interval                | ✓        | Time (in seconds) between attempts to download blocks                                                                                                       |
| walk_interval                    | ✓        | Time (in seconds) between attempts to walk the list of neighbors                                                                                            |
| read_only_call_limit_read_length | ✓        | Total number of bytes allowed to be read by an individual read-only function call                                                                           |
| read_only_call_limit_read_count  | ✓        | Total number of independent read operations permitted for an individual read-only function call                                                             |
| read_only_call_limit_runtime     | ✓        | [Runtime cost](https://github.com/stacksgov/sips/blob/main/sips/sip-006/sip-006-runtime-cost-assessment.md) limit for an individual read-only function call |

### burnchain

This section contains configuration options pertaining to the blockchain the stacks-node binds to on the backend for proof-of-transfer (BTC).

| Name      | Required | Description                                                                                                          |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| chain     | ✓        | The blockchain stacks-node binds to on the backend for proof-of-transfer. Only value supported: `bitcoin`            |
| mode      | ✓        | The profile or test phase of which to run stacks-node. Valid values are [ `mocknet`, `testnet`, `xenon`, `mainnet` ] |
| peer_host |          | FQDN of the host running the backend Bitcoin blockchain                                                              |
| rpc_port  |          | RPC port of `peer_host`                                                                                              |
| peer_port |          | P2P port of `peer_host`                                                                                              |

#### Mining

| Name                       | Required | Description                                                                                        |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| burn_fee_cap               | ✓        | Maximum amount (in sats) of "burn commitment" to broadcast for the next block's leader election    |
| satoshis_per_byte          | ✓        | [Amount (in sats) per byte](https://bitcoinfees.net/) - Used to calculate the transaction fees     |
| commit_anchor_block_within |          | Sets the time period (in milliseconds) for commitments. Only used when `mode` is set to `mocknet`. |

### ustx_balance

- `mocknet`/`testnet` only

This section contains configuration options allocating microSTX per address in the genesis block

This section can repeat multiple times, but each section can only define a single address.

:::info
This section is only required for the `testnet` and `mocknet` networks.

However, if this section is added, **all** fields are required
:::

| Name    | Required | Description                                                           |
| ------- | -------- | --------------------------------------------------------------------- |
| address | ✓        | Address which maintains a microSTX balance                            |
| amount  | ✓        | The balance of microSTX given to the address at the start of the node |

## Example Mainnet Follower Configuration

```toml
[node]
working_dir = "/stacks-blockchain"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "02da7a464ac770ae8337a343670778b93410f2f3fef6bea98dd1c3e9224459d36b@seed-0.mainnet.stacks.co:20444,02afeae522aab5f8c99a00ddf75fbcb4a641e052dd48836408d9cf437344b63516@seed-1.mainnet.stacks.co:20444,03652212ea76be0ed4cd83a25c06e57819993029a7b9999f7d63c36340b34a4e62@seed-2.mainnet.stacks.co:20444"

[burnchain]
chain = "bitcoin"
mode = "mainnet"
peer_host = "localhost"
username = "user"
password = "pass"
rpc_port = 8332
peer_port = 8333

[[events_observer]]
endpoint = "localhost:3700"
retry_count = 255
events_keys = ["*"]
```

<!-- Example:

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
bootstrap_node = "047435c194e9b01b3d7f7a2802d6684a3af68d05bbf4ec8f17021980d777691f1d51651f7f1d566532c804da506c117bbf79ad62eea81213ba58f8808b4d9504ad@testnet.blockstack.org:20444"
```

#### wait_time_for_microblocks (optional)

The amount of time (in milliseconds) that a node will wait before trying to mine a block, after catching up to the anchored chain tip. This gives the current leader time to broadcast microblocks that will get included in that mined block.

Example:

```toml
wait_time_for_microblocks = 15000
```

#### seed (optional)

The private key to use for mining. Only needed if `miner` is set to `true`.

Example:

```toml
seed = "replace-with-your-private-key"
```

#### local_peer_seed (optional)

The private key to use for signing P2P messages in the networking stack. It differentiates network peers and is used even by non-mining nodes.

Example:

```toml
local_peer_seed = "replace-with-your-private-key"
```

#### miner (optional)

Determines whether the stacks-node is running a follower (`false`) or a miner (`true`). Defaults to `false` if omitted.

Example:

```toml
miner = true
```

#### mine_microblocks (optional)

Determines whether the stacks-node will mine microblocks. Will only take effect if `miner` is set to `true`.

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

Contains options for watching events emitted by a local [stacks-blockchain-api](https://github.com/hirosystems/stacks-blockchain-api) service.

:::info
This section can be repeated multiple times.
:::

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

:::info
This section can repeat multiple times, and thus is in double-brackets. Each section can define only one address. This section is ignored if running a node on mainnet.
:::

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
``` -->
