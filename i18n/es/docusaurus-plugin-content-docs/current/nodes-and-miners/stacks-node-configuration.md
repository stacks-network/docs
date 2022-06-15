---
title: Configuración del nodo de Stacks
description: Parámetros de configuración y opciones para el binario stacks-node
---

## Uso

```bash
stacks-node sub-command [--subcommand-option <value>]
```

## Subcomandos

:::note El binario `stacks-node` puede tener comandos obsoletos que no están documentados en esta página. Los comandos obsoletos pueden ser accesibles hasta que sean eliminados completamente del código fuente. :::

### mocknet

Start a node based on a fast local setup emulating a burnchain. Ideal for smart contract development.

Ejemplo:

```bash
stacks-node mocknet
```

### krypton

Start a node that will join and stream blocks from the public krypton regtest, powered by Blockstack via [Proof of Transfer](../understand-stacks#consensus-mechanism). sidebar_position: 1

Ejemplo:

```bash
stacks-node krypton
```

### testnet

Start a node that will join and stream blocks from the public testnet.

Ejemplo:

```bash
stacks-node testnet
```

### mainnet

Start a node that joins and streams blocks from the public mainnet.

Ejemplo:

```bash
stacks-node mainnet
```

### start

Start a node with a config of your own. Can be used for joining a network, starting a new chain, or replacing default values used by the `mocknet` or `testnet` subcommands.

#### Argumentos

**--config**: relative or absolute path to the TOML config file. Required.

Ejemplo:

```bash
stacks-node start --config=/path/to/config.toml
```

See [Configuration File Options](#configuration-file-options) for more information.

#### version

Muestra información sobre la versión actual y el ciclo de lanzamiento.

Ejemplo:

```bash
stacks-node version
```

#### help

Muestra un mensaje de ayuda.

Ejemplo:

```bash
stacks-node help
```

## Opciones de configuración

The TOML configuration file has multiple sections under which an option may be placed.

To see a list of example configurations, [please see this page](https://github.com/stacks-network/stacks-blockchain/tree/master/testnet/stacks-node/conf).

### Sección: node

Contains various configuration options pertaining to the stacks-node.

Ejemplo:

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

Ejemplo:

```toml
working_dir = "/root/stacks-node"
```

#### rpc_bind

Address and port stacks-node should bind to for RPC connections.

Ejemplo:

```toml
rpc_bind = "0.0.0.0:20443"
```

#### p2p_bind

Address and port stacks-node should bind to for P2P connections.

Ejemplo:

```toml
p2p_bind = "0.0.0.0:20444"
```

#### data_url (optional)

Address and port from which the stacks-node will be receiving incoming rpc connections.

Ejemplo:

```toml
data_url = "1.2.3.4:20443"
```

#### p2p_address (optional)

Address and port from which the stacks-node will be receiving incoming p2p connections.

Ejemplo:

```toml
p2p_address = "1.2.3.4:20444"
```

#### bootstrap_node (optional)

Public key, address, and port stacks-node should use to pull transaction data from when starting.

Ejemplo:

```toml
bootstrap_node = "047435c194e9b01b3d7f7a2802d6684a3af68d05bbf4ec8f17021980d777691f1d51651f7f1d566532c804da506c117bbf79ad62eea81213ba58f8808b4d9504ad@testnet.blockstack.org:20444"
```

#### wait_time_for_microblocks (optional)

The amount of time (in milliseconds) that a node will wait before trying to mine a block, after catching up to the anchored chain tip. This gives the current leader time to broadcast microblocks that will get included in that mined block.

Ejemplo:

```toml
wait_time_for_microblocks = 15000
```

#### seed (optional)

The private key to use for mining. Only needed if `miner` is set to `true`.

Ejemplo:

```toml
seed = "replace-with-your-private-key"
```

#### local_peer_seed (optional)

The private key to use for signing P2P messages in the networking stack. It differentiates network peers and is used even by non-mining nodes.

Ejemplo:

```toml
local_peer_seed = "replace-with-your-private-key"
```

#### miner (optional)

Determines whether the stacks-node is running a follower (`false`) or a miner (`true`). Defaults to `false` if omitted.

Ejemplo:

```toml
miner = true
```

#### mine_microblocks (optional)

Determines whether the stacks-node will mine microblocks. Will only take effect if `miner` is set to `true`.

Ejemplo:

```toml
mine_microblocks = true
```

#### prometheus_bind (optional)

Address and port stacks-node should open for Prometheus metrics collection.

Ejemplo:

```toml
prometheus_bind = "0.0.0.0:9153"
```

### Section: events_observer (optional)

Contains options for watching events emitted by a local [stacks-blockchain-api](https://github.com/hirosystems/stacks-blockchain-api) service.

:::info
This section can be repeated multiple times.
:::

Ejemplo:

```toml
[[events_observer]]
endpoint = "address-to-my-local.stacks-node-api.com:3700"
retry_count = 255
events_keys = ["*"]
```

#### endpoint

Address and port to a stacks-node-api to watch for events.

Ejemplo:

```toml
endpoint = "address-to-my-local.stacks-node-api.com:3700"
```

#### retry_count

Number of times to retry sending events to the endpoint before failing.

Ejemplo:

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

Ejemplo:

```toml
[connection_options]
public_ip_address = "1.2.3.4:20444"
download_interval = 60
walk_interval = 30
```

#### public_ip_address

The advertised public IP of this stacks-node.

Ejemplo:

```toml
public_ip_address = "1.2.3.4:20444"
```

#### download_interval

Time (in seconds) between attempts to download blocks.

Ejemplo:

```toml
download_interval = 60
```

#### walk_interval

Time (in seconds) between attempts to walk the neighborhood.

Ejemplo:

```toml
walk_interval = 30
```

#### read_only_call_limit_read_length

Total number of bytes allowed to be read by an individual read-only function call.

Ejemplo:

```toml
read_only_call_limit_read_length = 100000
```

#### read_only_call_limit_read_count

Total number of independent read operations permitted for an individual read-only function call.

Ejemplo:

```toml
read_only_call_limit_read_count = 30
```

#### read_only_call_limit_runtime

[Runtime cost](https://github.com/stacksgov/sips/blob/2d3fd9bf8da7a04f588d90ff6252173d7609d7bf/sips/sip-006/sip-006-runtime-cost-assessment.md#introduction) limit for an individual read-only function call.

Ejemplo:

```toml
read_only_call_limit_runtime = 1000000000
```

### Sección: burnchain

This section contains configuration options pertaining to the blockchain the stacks-node binds to on the backend for proof-of-transfer (BTC).

Ejemplo:

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

Ejemplo:

```toml
chain = "bitcoin"
```

#### mode

The profile or test phase of which to run stacks-node. Valid values are `"mocknet"`, `"helium"`, `"neon"`, `"argon"`, `"krypton"`, `"xenon"`.

Ejemplo:

```toml
mode = "xenon"
```

#### peer_host

Domain name of the host running the backend Bitcoin blockchain. It's required to either run a personal Bitcoin node locally, or to use a publicly hosted Bitcoin node.

Ejemplo:

```toml
peer_host = "your.bitcoind.node.org"
```

#### rpc_port

peer_host's port stacks-node will connect to for RPC connections.

Ejemplo:

```toml
rpc_port = 8332
```

#### peer_port

peer_host's port stacks-node will connect to for P2P connections.

Ejemplo:

```toml
peer_port = 8333
```

#### burn_fee_cap (optional)

Maximum amount (in Satoshis) of "burn commitment" to broadcast for the next block's leader election.

Ejemplo:

```toml
burn_fee_cap = 30000
```

#### satoshis_per_byte (optional)

Amount (in Satoshis) per [virtual byte](https://en.bitcoin.it/wiki/Weight_units). This is used to compute the transaction fees.

Ejemplo:

```toml
satoshis_per_byte = 50
```

So total transaction cost would be `(estimated_tx_size * satoshis_per_byte) + burn_fee_cap`.

#### commit_anchor_block_within (optional)

Sets the time period (in milliseconds) for commitments. Only used when `mode` is set to `"helium"`.

Ejemplo:

```toml
commit_anchor_block_within = 10000
```

### Section: ustx_balance (testnet/regtest only)

This section contains configuration options pertaining to the genesis block allocation for an address in micro-STX. If a user changes these values, their node may be in conflict with other nodes on the network and find themselves unable to sync with other nodes.

:::info
This section can repeat multiple times, and thus is in double-brackets. Each section can define only one address. This section is ignored if running a node on mainnet.
:::

Ejemplo:

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

Dirección que mantiene un balance micro-STX.

Ejemplo:

```toml
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
```

#### amount

El balance de micro-STX dado a la dirección al arranque del nodo.

Ejemplo:

```toml
amount = 10000000000000000
```
