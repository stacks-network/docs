# Setting Up a Primary (Post-Nakamoto) Testnet Node

### **Setup A Stacks Primary Testnet Node**

Once your signer is upgraded to version 3.0.0.0.0.1 ([here](https://github.com/stacks-network/stacks-core/releases/tag/signer-3.0.0.0.0.1)) you’ll need to run a primary testnet node alongside it.

You have two options here. The first is to run the Bash script below and it will handle everything for you, including creating the configuration file, downloading and extracting a chain state archive, and getting the node up and running.

If you prefer to handle these yourself, step-by-step instructions are included below the Bash script.

### Automated Bash Script

{% hint style="warning" %}
Be sure to edit your `auth_token` (previously `block_proposal_token`) field here to match the `auth_password` field in your signer config.
{% endhint %}

```bash
STACKS_DIR="${HOME}/nakamoto-testnet"
STACKS_RPC_PORT="40443"
STACKS_P2P_PORT="40444"

IMG="blockstack/stacks-core"
VER="3.0.0.0.0"
STX_NODE_CONFIG="${STACKS_DIR}/Config.toml"

mkdir -p ${STACKS_DIR}/data
curl -# <https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz> -o ${STACKS_DIR}/data/testnet-stacks-blockchain-latest.tar.gz
tar -xzvf ${STACKS_DIR}/data/testnet-stacks-blockchain-latest.tar.gz -C ${STACKS_DIR}/data/

cat <<EOF> ${STX_NODE_CONFIG}
[node]
working_dir = "/stacks-blockchain/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "029266faff4c8e0ca4f934f34996a96af481df94a89b0c9bd515f3536a95682ddc@seed.testnet.hiro.so:30444"
prometheus_bind = "0.0.0.0:9153"
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

[[events_observer]]
endpoint = "0.0.0.0.0:30000"
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
EOF

docker run -d  \\
    -v ${STX_NODE_CONFIG}:/config.toml \\
    -v ${STACKS_DIR}/data:/stacks-blockchain/data \\
    -p ${STACKS_RPC_PORT}:20443 \\
    -p ${STACKS_P2P_PORT}:20444 \\
    -e RUST_BACKTRACE=full \\
    --name stacks-node \\
    $IMG:$VER \\
    stacks-node start --config /config.toml
```

### **Manual Setup**

#### **Node Configuration**

Create a file called `node-config.toml`. Below is a sample of the configuration file you’ll need to use.

**Sample Configuration File**

```toml
[node]
working_dir = "/stacks-blockchain/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "029266faff4c8e0ca4f934f34996a96af481df94a89b0c9bd515f3536a95682ddc@seed.testnet.hiro.so:30444"
prometheus_bind = "0.0.0.0:9153"

[burnchain]
chain = "bitcoin"
mode = "krypton"
peer_host = "bitcoin.regtest.hiro.so"
peer_port = 18444
pox_prepare_length = 100
pox_reward_length = 900

[[events_observer]]
endpoint = "0.0.0.0.0:30000"
events_keys = ["stackerdb", "block_proposal", "burn_blocks"]

# Set your auth token, which the signer uses
# This should match the auth_password field of your signer config
[connection_options]
auth_token = "12345"

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
```

The important aspects that you’ll need to change are:

`auth_token`: an authentication token that your signer uses to authenticate certain requests to your node. This must match the value you used as `auth_password` in the signer’s configuration.

`events_observer.endpoint`: This is the host (IP address and port) where your signer is configured to listen for events. An example string would be ”`127.0.0.1:30000`” or ”`my-signer.local:30000`”

#### **Start with an archive**

If you are running your Stacks node on the primary testnet, it will be much faster to start with an archive of the chain state rather than syncing from genesis.

Archives can be found from[https://archive.hiro.so](https://archive.hiro.so). For the Stacks node testnet, the latest snapshot can be found at [https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz](https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz). You can also [browse all testnet snapshots](https://archive.hiro.so/testnet/stacks-blockchain/).

You’ll want to download this on the same machine that will run the Stacks node. One way to do this is:

`curl -# <https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz> -o stacks-snapshot.tar.gz -o /stacks-blockchain/data/latest.tar.gz`

`tar -xzvf /stacks-blockchain/data/latest.tar.gz -C /stacks-blockchain/data`

#### **Run a Stacks Node with Docker**

You can run the Stacks node as a Docker container using the `blockstack/stacks-core` image. When running the Docker container, you’ll need to ensure a few things:

* The port configured for `p2p_bind` must be exposed to the internet for egress
* The port configured for `rpc_bind` must be accessible by your signer
* `working_dir` needs to be on a volume with 3-5GB of available storage
* You’ll need to include your `node-config.toml` file

An example for running the node’s Docker image with docker run is below. Be sure to run this from the same directory as your node-config.toml file or change the STX\_NODE\_CONFIG option.

```bash
IMG="blockstack/stacks-core"

VER="3.0.0.0.0"

STX_NODE_CONFIG="./node-config.toml"

docker run -d \\
-v $STX_NODE_CONFIG:/config.toml \\
-v /var/stacks \\
-p 20443:20443 \\
-p 20444:20444 \\
-e RUST_BACKTRACE=full \\
--name stacks-node \\
$IMG:$VER \\
stacks-node start \\
--config /config.toml
```

Or, using a custom Dockerfile:

```docker
FROM blockstack/stacks-core:3.0.0.0.0
COPY node-config.toml /config.toml
EXPOSE 20444
EXPOSE 20443
CMD ["stacks-node", "start", "--config", "/config.toml"]
```
