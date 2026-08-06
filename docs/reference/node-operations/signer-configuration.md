# Signer Configuration

{% hint style="info" %}
The Stacks node will not boot if it sees config values it does not recognise. If your node is not booting, check its logs for messages naming an unknown or unused configuration field.
{% endhint %}

### Signer configuration file options

The signer configuration file is a TOML file with no sections. Every option below is set at the top level. Fields marked required have no default, and omitting any optional field applies the default shown.

This table is generated from `RawConfigFile` in [`stacks-signer/src/config.rs` at `stacks-core` 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stacks-signer/src/config.rs). Options not listed here are not recognised by the 4.0.1 signer.

#### Required

| Name                 | Description                                                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node_host`          | `host:port` where your Stacks node can be reached. Must point to the node's `rpc_bind` address.                                                                                                 |
| `endpoint`           | `host:port` the signer listens on for events from your Stacks node. Must match the `endpoint` in the node's `[[events_observer]]` section.                                                      |
| `stacks_private_key` | Hex representation of the signer's Stacks private key. 64 or 66 characters, the latter with a trailing `01` compression suffix. This key determines the signer's on-chain identity and address. |
| `network`            | One of `"mainnet"`, `"testnet"`, or `"mocknet"`. Determines address and transaction version.                                                                                                    |
| `auth_password`      | Authorization token for HTTP requests from the signer to your node. **Must match** the `auth_token` in the node's `[connection_options]` section, or the signer cannot talk to the node.        |
| `db_path`            | Path to the signer's database file. Use an absolute path in production. `:memory:` is for testing only.                                                                                         |

#### Optional

| Name                                      | Default                                    | Units  | Description                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event_timeout_ms`                        | `5_000`                                    | ms     | Time to wait for a response from the StackerDB instance.                                                                                                                                                                                                                                                                                |
| `metrics_endpoint`                        | disabled                                   |        | `host:port` for Prometheus metrics collection.                                                                                                                                                                                                                                                                                          |
| `first_proposal_burn_block_timing_secs`   | `60`                                       | s      | Reorg protection window. Measures the time between a tenure's first block being signed and the next burn block arriving. Below this, a new miner may reorg the tenure; above it, the tenure is established and the reorg is denied. Setting it too low allows reorgs of established tenures; too high blocks legitimate miner handoffs. |
| `block_proposal_timeout_ms`               | `120_000`                                  | ms     | How long to wait for the current sortition winner to propose a block before the signer treats that miner as inactive.                                                                                                                                                                                                                   |
| `chain_id`                                | `0x00000001` mainnet, `0x80000000` testnet |        | Custom chain ID. Only set this for custom or private networks.                                                                                                                                                                                                                                                                          |
| `tenure_last_block_proposal_timeout_secs` | `30`                                       | s      | Time to wait for the last block of a tenure to be globally accepted or rejected before treating a new miner's block at the same height as potentially valid.                                                                                                                                                                            |
| `block_proposal_validation_timeout_ms`    | `120_000`                                  | ms     | How long to wait for a block proposal validation response from the node before marking the block invalid and rejecting it.                                                                                                                                                                                                              |
| `tenure_idle_timeout_secs`                | `30`                                       | s      | How much time since the last block in a tenure must pass before the signer allows a tenure extend. See the warning below before changing it.                                                                                                                                                                                            |
| `read_count_idle_timeout_secs`            | `15`                                       | s      | Idle time before allowing a read-count tenure extend, triggered when the read count budget is nearly exhausted.                                                                                                                                                                                                                         |
| `tenure_idle_timeout_buffer_secs`         | `2`                                        | s      | Buffer added to the tenure extend time sent to miners, to absorb clock skew between signer and miner. Increase if the two clocks are poorly synchronised.                                                                                                                                                                               |
| `block_proposal_max_age_secs`             | `600`                                      | s      | Maximum age of a block proposal the signer will process. Older proposals are ignored.                                                                                                                                                                                                                                                   |
| `reorg_attempts_activity_timeout_ms`      | `200_000`                                  | ms     | Window after a block's global acceptance during which a miner's attempt to reorg it still counts as valid miner activity.                                                                                                                                                                                                               |
| `proposal_wait_for_parent_time_secs`      | `15`                                       | s      | Time to wait before submitting a block proposal if the signer cannot confirm the node has processed the parent block.                                                                                                                                                                                                                   |
| `dry_run`                                 | `false`                                    |        | Run without submitting StackerDB messages or participating in signing. The signer logs what it would have done.                                                                                                                                                                                                                         |
| `validate_with_replay_tx`                 | `false`                                    |        | Validate blocks by replaying transactions. Experimental. Adds validation at the cost of higher resource use.                                                                                                                                                                                                                            |
| `reset_replay_set_after_fork_blocks`      | `2`                                        | blocks | Blocks after a fork before the replay set is reset, as a failsafe.                                                                                                                                                                                                                                                                      |
| `capitulate_miner_view_timeout_secs`      | `20`                                       | s      | Time between updating the local state machine view and capitulating to other signers' tenure view. Controls how quickly a signer adopts the consensus view when its own differs.                                                                                                                                                        |
| `stackerdb_timeout_secs`                  | `120`                                      | s      | HTTP timeout for read and write operations against StackerDB.                                                                                                                                                                                                                                                                           |

{% hint style="warning" %}
**`tenure_idle_timeout_secs` must be coordinated with the miner.** The signer computes `extend_timestamp = last_block_time + tenure_idle_timeout_secs + tenure_idle_timeout_buffer_secs` and the miner cannot extend before it. The miner's `tenure_timeout` (default 180s) must be greater than that sum, and its `tenure_extend_wait_timeout_ms` (default `120_000`ms) should be greater than or equal to it. Raising `tenure_idle_timeout_secs` past roughly 118 breaks the second relationship at the miner's default and tenure extends stop being accepted. The default of `30` is the safe value. Leave it unset unless you have a specific reason.
{% endhint %}

### Example configs

Sample configuration files for running a Stacks node and signer. Change the values marked in the comments, following the [How to Run a Signer](https://docs.stacks.co/operate/run-a-signer) doc.

#### Testnet signer

```toml
# The address and port where your Stacks node can be accessed.
# The port 20443 is the default RPC endpoint for Stacks nodes.
# This should be the address accessible via Docker, usually via a network.
node_host = "127.0.0.1:20443"

# This is the location where the signer will expose an RPC endpoint for
# receiving events from your Stacks node.
endpoint = "127.0.0.1:30000"

# Either "testnet" or "mainnet"
network = "testnet"

# this is a file path where your signer will persist data. If using Docker,
# this must be within a volume, so that data can be persisted across restarts
db_path = "/var/stacks/signer.sqlite"

# an authentication token that is used for some HTTP requests made from the
# signer to your Stacks node. You'll need to use this later on when configuring
# your Stacks node. You create this field yourself, rather than it being generated
# with your private key.
auth_password = "$your_http_auth_token"

# This is the privateKey field from the keys you generated in the
# previous step.
stacks_private_key = "$your_stacks_private_key"
```

#### Stacks node testnet config

{% hint style="warning" %}
Note that the `block_proposal_token` field has changed to `auth_token` in the Stacks node configuration file.
{% endhint %}

This is the configuration for a Stacks follower node attached to a signer. Change the commented lines to match your setup. If you have not set up a signer before, follow the [How to Run a Signer](https://docs.stacks.co/operate/run-a-signer) guide.

An overview of all Stacks node configuration options can be found in the Stacks Node Configuration doc.

The `[connection_options]` and `[[events_observer]]` sections and the `stacker = true` line are the additions needed to run a signer. Comments in the block mark the other lines you need to change.

```toml
[node]

rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "0348af7ce1b224476e8f042727af3f84dcf49a69bb3c9dd2a1afaa783acfffb729@seed.testnet.hiro.so:20444"
prometheus_bind = "127.0.0.1:9153"
working_dir = "/hirosystems/data"
local_peer_seed = "{{ redacted }}"

# Required for nodes attached to signers, optional for other nodes
stacker = true

pox_5_sbtc_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-token"
pox_5_sbtc_registry_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-registry"
pox_5_bond_admin = "ST1V2ASRWGR81W7GBN1Z4W2JQKXJWCADPVZG30X45"

[burnchain]
chain = "bitcoin"
mode = "krypton"
peer_host = "bitcoin.regtest.hiro.so"
peer_port = 18444
rpc_port = 18443
pox_prepare_length = 100
pox_reward_length = 900

# Set your auth token, which the signer uses
# This should match the auth_password field of your signer config
[connection_options]
auth_token = "12345"

# Set your signer as an event observer
[[events_observer]]

# This endpoint is where your signer will communicate with your Stacks node
endpoint = "127.0.0.1:30000"
events_keys = ["stackerdb", "block_proposal", "burn_blocks"]

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

[fee_estimation]
fee_estimator = "fuzzed_weighted_median_fee_rate"

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

#### Mainnet signer

This matches the testnet config except for the `network` field.

```toml
# The address and port where your Stacks node can be accessed.
# The port 20443 is the default RPC endpoint for Stacks nodes.
# This should be the address accessible via Docker, usually via a network.
node_host = "127.0.0.1:20443"

# This is the location where the signer will expose an RPC endpoint for
# receiving events from your Stacks node.
endpoint = "127.0.0.1:30000"

# Either "testnet" or "mainnet"
network = "mainnet"

# this is a file path where your signer will persist data. If using Docker,
# this must be within a volume, so that data can be persisted across restarts
db_path = "/var/stacks/signer.sqlite"

# an authentication token that is used for some HTTP requests made from the
# signer to your Stacks node. You'll need to use this later on when configuring
# your Stacks node. You create this field yourself, rather than it being generated
# with your private key.
auth_password = "$your_http_auth_token"

# This is the privateKey field from the keys you generated in the
# previous step.
stacks_private_key = "$your_stacks_private_key"

# The address and port where prometheus metrics can be accessed.
metrics_endpoint = "127.0.0.1:9154"

# Determines when a time-based tenure extend will be accepted.
# Optional. Defaults to 30 seconds if omitted. Leave it unset unless you
# have a specific reason, and read the coordination warning above first.
# tenure_idle_timeout_secs = 30
```

#### Mainnet Stacks node

For mainnet, change the bootstrap node field and the burnchain fields. The `ustx_balance` fields are not needed.

```toml
[node]

# Set this based on where you downloaded
# the chain state archive as described in the How to Run a Signer guide:
working_dir = "/data-dir-somewhere"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"

# This is the node that your node will use to begin syncing chain state
bootstrap_node = "02196f005965cebe6ddc3901b7b1cc1aa7a88f305bb8c5893456b8f9a605923893@seed.mainnet.hiro.so:20444,02539449ad94e6e6392d8c1deb2b4e61f80ae2a18964349bc14336d8b903c46a8c@cet.stacksnodes.org:20444,02ececc8ce79b8adf813f13a0255f8ae58d4357309ba0cedd523d9f1a306fcfb79@sgt.stacksnodes.org:20444,0303144ba518fe7a0fb56a8a7d488f950307a4330f146e1e1458fc63fb33defe96@est.stacksnodes.org:20444"

# Required for nodes attached to signers, optional for other nodes
stacker = true

[burnchain]
chain = "bitcoin"
mode = "mainnet"

# Point this at your own Bitcoin node. Signers that rely on a public
# Bitcoin node fall behind.
peer_host = "127.0.0.1"

# Set your auth token, which the signer uses
# This should match the auth_password field of your signer config
[connection_options]
auth_token = "12345"

# Set your signer as an event observer
[[events_observer]]

# This endpoint is where your signer will communicate with your Stacks node
endpoint = "127.0.0.1:30000"
events_keys = ["stackerdb", "block_proposal", "burn_blocks"]
```
