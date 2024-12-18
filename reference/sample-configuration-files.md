# Signer Configuration

{% hint style="info" %}
Note that in this version, the Stacks node will not boot if it sees config values that are unused. If your node is not booting, be sure to check your logs for any messages indicating
{% endhint %}

### Signer Configuration File Options

The signer configuration file is a TOML file that contains the configuration options for your signer. Below are the options you can set in the signer configuration file.

| Name                         | Required | Description                                                                                                                                                                                                                                                                                   |
| ---------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node\_host                   | ✓        | IP:PORT where your Stacks node can be accessed. The port 20443 is the default RPC endpoint for Stacks nodes. Note that you must use an IP address - DNS hosts are not supported at this time.                                                                                                 |
| endpoint                     | ✓        | IP:PORT where the signer will expose an RPC endpoint for receiving events from your Stacks node.                                                                                                                                                                                              |
| stacks\_private\_key         | ✓        | Hex representation of the signer's Stacks private key used for communicating with the Stacks Node, including writing to the Stacker DB instance.                                                                                                                                              |
| network                      | ✓        | Network to use. One of "mainnet", "testnet" or "mocknet".                                                                                                                                                                                                                                     |
| auth\_password               | ✓        | Authorization token for HTTP requests made from the signer to your Stacks node.                                                                                                                                                                                                               |
| db\_path                     | ✓        | Path to the signer's database file                                                                                                                                                                                                                                                            |
| block\_proposal\_timeout\_ms |          | Specifies the maximum time (in milliseconds) a signer waits after a Bitcoin block for a miner to produce their first Nakamoto block. If the miner exceeds this time, the signer marks their tenure as invalid and rejects subsequent block proposals. Default value of 600\_000 (10 minutes). |
| metrics\_endpoint            |          | IP:PORT for Prometheus metrics collection.                                                                                                                                                                                                                                                    |
| chain\_id                    |          | An optional ChainID, only used for custom networks (like Nakamoto Testnet)                                                                                                                                                                                                                    |

### Example Configs

Below are sample configuration files for running a Stacks node and signer provided in one place for convenience. You'll need to modify some of these according to the [How to Run a Signer](../guides-and-tutorials/running-a-signer/) doc.

### Testnet Signer

```toml
# The IP address and port where your Stacks node can be accessed.
# The port 20443 is the default RPC endpoint for Stacks nodes.
# Note that you must use an IP address - DNS hosts are not supported at this time.
# This should be the IP address accessible via Docker, usually via a network.
node_host = "127.0.0.1:20443"

# This is the location where the signer will expose an RPC endpoint for
# receiving events from your Stacks node.
endpoint = "127.0.0.1:30000"

# Either “testnet” or “mainnet”
network = "testnet"

# this is a file path where your signer will persist data. If using Docker,
# this must be within a volume, so that data can be persisted across restarts
db_path = "/var/stacks/signer.sqlite"

# an authentication token that is used for some HTTP requests made from the
# signer to your Stacks node. You’ll need to use this later on when configuring
# your Stacks node. You create this field yourself, rather than it being generated
# with your private key.
auth_password = "$your_http_auth_token"

# This is the privateKey field from the keys you generated in the
# previous step.
stacks_private_key = "$your_stacks_private_key"
```

### Stacks Node Testnet Config

{% hint style="warning" %}
Note that the `block_proposal_token` field has changed to `auth_token` in the Stacks node configuration file.
{% endhint %}

This is the configuration you'll need to run a Stacks follower node if you are also running a signer. Be sure to change the commented lines to the appropriate data for your setup. If you are not familiar with the process of setting up a signer, be sure to follow the [How to Run a Signer](../guides-and-tutorials/running-a-signer/) guide.

An overview of all Stacks node configuration options can be found in the [Stacks Node Configuration](stacks-node-configuration.md) doc.

Additions necessary specifically to run a signer are the `[connection_options]` and `[[events_observer]]` sections and the `stacker = true` line. There are also a few comments detailing other lines that need to change.

```toml
[node]

rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "029266faff4c8e0ca4f934f34996a96af481df94a89b0c9bd515f3536a95682ddc@seed.testnet.hiro.so:30444"
prometheus_bind = "127.0.0.1:9153"
working_dir = "/hirosystems/data"
local_peer_seed = "{{ redacted }}"
# Required for nodes attached to signers, optional for other nodes
stacker = true

[burnchain]
chain = "bitcoin"
mode = "krypton"
peer_host = "bitcoin.regtest.hiro.so"
peer_port = 18444
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
start_height = 56_457

[[burnchain.epochs]]
epoch_name = "3.1"
start_height = 77_770
```

### Mainnet Signer

This config is very similar to the testnet config, except the `network` field is changed.

```toml
# The IP address and port where your Stacks node can be accessed.
# The port 20443 is the default RPC endpoint for Stacks nodes.
# Note that you must use an IP address - DNS hosts are not supported at this time.
# This should be the IP address accessible via Docker, usually via a network.
node_host = "127.0.0.1:20443"

# This is the location where the signer will expose an RPC endpoint for
# receiving events from your Stacks node.
endpoint = "127.0.0.1:30000"

# Either “testnet” or “mainnet”
network = "mainnet"

# this is a file path where your signer will persist data. If using Docker,
# this must be within a volume, so that data can be persisted across restarts
db_path = "/var/stacks/signer.sqlite"

# an authentication token that is used for some HTTP requests made from the
# signer to your Stacks node. You’ll need to use this later on when configuring
# your Stacks node. You create this field yourself, rather than it being generated
# with your private key.
auth_password = "$your_http_auth_token"

# This is the privateKey field from the keys you generated in the
# previous step.
stacks_private_key = "$your_stacks_private_key"

# The IP address and port where prometheus metrics can be accessed.
metrics_endpoint = "127.0.0.1:9154"
```

### Mainnet Stacks Node

With a mainnet Stacks node config, you'll need to change the bootstrap node field and the burnchain fields. Other than that, the `ustx_balance` fields are not necessary.

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
peer_host = "bitcoind.stacks.co"
username = "blockstack"
password = "blockstacksystem"
rpc_port = 8332
peer_port = 8333

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
