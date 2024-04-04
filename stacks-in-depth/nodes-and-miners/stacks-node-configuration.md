# Stacks Node Configuration

### Usage

```bash
stacks-node sub-command [--subcommand-option <value>]
```

#### Subcommands

* `mocknet`: start a mocknet instance using defaults
* `testnet`: start a testnet instance using defaults (chainstate is not persistent)
* `mainnet`: start a mainnet instance using defaults (chainstate is not persistent)
* `start`: combined with `--config`, starts an instance with a specified configuration file
* `version`: displays binary version
* `help`: displays the help message

### Configuration File Options

The Stacks Blockchain configuration file has multiple sections under which an option may be placed.

* node
* events\_observer
* connection\_options
* burnchain
* ustx\_balance

For reference, several configuration file examples are [available here](https://github.com/stacks-network/stacks-blockchain/tree/master/testnet/stacks-node/conf)

* Example mainnet follower configuration

#### node

Contains various configuration options for the stacks-node binary.

| Name                         | Required | Description                                                                                                |
| ---------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| rpc\_bind                    | ✓        | IPv4 address and port to open for RPC connections                                                          |
| p2p\_bind                    | ✓        | IPv4 address and port to open for P2P connections                                                          |
| working\_dir                 |          | Absolute path to the directory where chainstate data will be stored                                        |
| data\_url                    |          | IPv4 address and port for incoming RPC connections                                                         |
| p2p\_address                 |          | IPv4 address and port for incoming P2P connections                                                         |
| bootstrap\_node              |          | Public key, IPv4 address, and port to bootstrap the chainstate                                             |
| wait\_time\_for\_microblocks |          | The amount of time in ms to wait before trying to mine a block after catching up to the anchored chain tip |
| seed                         |          | The private key to use for mining. Only needed if `miner` is set to `true`                                 |
| local\_peer\_seed            |          | The private key to use for signing P2P messages in the networking stack                                    |
| miner                        |          | Determines whether the node is running a follower (`false`) or a miner (`true`). Defaults to `false`       |
| mock\_miner                  |          | Simulates running a miner (typically used for debugging)                                                   |
| mine\_microblocks            |          | Determines whether the node will mine microblocks. Will only take effect if `miner` is set to `true`       |
| prometheus\_bind             |          | Address and port for Prometheus metrics collection.                                                        |

#### events\_observer

{% hint style="info" %}
This section is _optional_ and not required

However, if this section is added, **all** fields are required.
{% endhint %}

Contains options for sending events emitted to the [stacks-blockchain-api](https://github.com/hirosystems/stacks-blockchain-api) service.

| Name         | Required | Description                                                                                                                                                       |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| endpoint     | ✓        | Address and port to a [stacks-blockchain-api](https://github.com/hirosystems/stacks-blockchain-api) service                                                       |
| retry\_count | ✓        | Number of times to retry sending events to the endpoint before failing                                                                                            |
| events\_keys | ✓        | Event keys for which to watch. The emitted node events can be restricted by account, function name and event type. Asterix ("\*") can be used to emit all events. |

#### connection\_options

{% hint style="info" %}
This section is _optional_ and not required.

However, if this section is added, **all** fields are required
{% endhint %}

Specifies configuration options for others connecting to the stacks node.

| Name                                  | Required | Description                                                                                                                                                 |
| ------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| public\_ip\_address                   | ✓        | Public IPv4 to advertise to other nodes                                                                                                                     |
| download\_interval                    | ✓        | Time (in seconds) between attempts to download blocks                                                                                                       |
| walk\_interval                        | ✓        | Time (in seconds) between attempts to walk the list of neighbors                                                                                            |
| read\_only\_call\_limit\_read\_length | ✓        | Total number of bytes allowed to be read by an individual read-only function call                                                                           |
| read\_only\_call\_limit\_read\_count  | ✓        | Total number of independent read operations permitted for an individual read-only function call                                                             |
| read\_only\_call\_limit\_runtime      | ✓        | [Runtime cost](https://github.com/stacksgov/sips/blob/main/sips/sip-006/sip-006-runtime-cost-assessment.md) limit for an individual read-only function call |

#### burnchain

This section contains configuration options pertaining to the blockchain the stacks-node binds to on the backend for proof-of-transfer (BTC).

| Name       | Required | Description                                                                                                           |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| chain      | ✓        | The blockchain stacks-node binds to on the backend for proof-of-transfer. Only value supported: `bitcoin`             |
| mode       | ✓        | The profile or test phase of which to run stacks-node. Valid values are \[ `mocknet`, `testnet`, `xenon`, `mainnet` ] |
| peer\_host |          | FQDN of the host running the backend Bitcoin blockchain                                                               |
| rpc\_port  |          | RPC port of `peer_host`                                                                                               |
| peer\_port |          | P2P port of `peer_host`                                                                                               |

**Mining**

| Name                          | Required | Description                                                                                        |
| ----------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| burn\_fee\_cap                | ✓        | Maximum amount (in sats) of "burn commitment" to broadcast for the next block's leader election    |
| satoshis\_per\_byte           | ✓        | [Amount (in sats) per byte](https://bitcoinfees.net/) - Used to calculate the transaction fees     |
| commit\_anchor\_block\_within |          | Sets the time period (in milliseconds) for commitments. Only used when `mode` is set to `mocknet`. |

#### ustx\_balance

{% hint style="info" %}
This section is only required for the `testnet` and `mocknet` networks.

However, if this section is added, **all** fields are required.
{% endhint %}

This section contains configuration options allocating microSTX per address in the genesis block

This section can repeat multiple times, but each section can only define a single address.

| Name    | Required | Description                                                           |
| ------- | -------- | --------------------------------------------------------------------- |
| address | ✓        | Address which maintains a microSTX balance                            |
| amount  | ✓        | The balance of microSTX given to the address at the start of the node |

### Example Mainnet Follower Configuration

```toml
[node]
working_dir = "/stacks-blockchain"
rpc_bind = "0.0.0.0:30443"
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
