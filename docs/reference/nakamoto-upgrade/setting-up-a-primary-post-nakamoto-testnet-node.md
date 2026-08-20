# Setting Up a Primary Post Nakamoto Testnet Node

### Setup A Stacks Primary Testnet Node

Once your signer is upgraded to the latest version (https://github.com/stacks-network/stacks-core/releases) you’ll need to run a primary testnet node alongside it.

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
VER="4.0.2"
STX_NODE_CONFIG="${STACKS_DIR}/Config.toml"

mkdir -p ${STACKS_DIR}/data
curl -# <https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz> -o ${STACKS_DIR}/data/testnet-stacks-blockchain-latest.tar.gz
tar -xzvf ${STACKS_DIR}/data/testnet-stacks-blockchain-latest.tar.gz -C ${STACKS_DIR}/data/

cat <<EOF> ${STX_NODE_CONFIG}
[node]
working_dir = "/stacks-blockchain/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "0348af7ce1b224476e8f042727af3f84dcf49a69bb3c9dd2a1afaa783acfffb729@seed.testnet.hiro.so:20444"
prometheus_bind = "0.0.0.0:9153"

stacker = true

pox_5_sbtc_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-token"
pox_5_sbtc_registry_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-registry"
pox_5_bond_admin = "ST1V2ASRWGR81W7GBN1Z4W2JQKXJWCADPVZG30X45"

[burnchain]
mode = "krypton"
peer_host = "bitcoin.regtest.hiro.so"
rpc_port = 18443
peer_port = 18444
pox_prepare_length = 100
pox_reward_length = 900

# Set your auth token, which the signer uses

# This should match the auth_password field of your signer config
[connection_options]
auth_token = "12345"

[[events_observer]]
endpoint = "0.0.0.0:30000"
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

### Manual Setup

{% stepper %}
{% step %}
### Node Configuration

Create a file called `node-config.toml`. Below is a sample of the configuration file you’ll need to use.

```toml
[node]
working_dir = "/stacks-blockchain/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "0348af7ce1b224476e8f042727af3f84dcf49a69bb3c9dd2a1afaa783acfffb729@seed.testnet.hiro.so:20444"
prometheus_bind = "0.0.0.0:9153"

stacker = true

pox_5_sbtc_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-token"
pox_5_sbtc_registry_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-registry"
pox_5_bond_admin = "ST1V2ASRWGR81W7GBN1Z4W2JQKXJWCADPVZG30X45"

[burnchain]
mode = "krypton"
peer_host = "bitcoin.regtest.hiro.so"
rpc_port = 18443
peer_port = 18444
pox_prepare_length = 100
pox_reward_length = 900

[[events_observer]]
endpoint = "0.0.0.0:30000"
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

Important aspects to change:

* auth\_token: an authentication token that your signer uses to authenticate certain requests to your node. This must match the value you used as `auth_password` in the signer’s configuration.
* events\_observer.endpoint: the host (IP and port) where your signer is configured to listen for events (e.g., `127.0.0.1:30000` or `my-signer.local:30000`).
{% endstep %}

{% step %}
### Start with an archive

If you are running your Stacks node on the primary testnet, it will be much faster to start with an archive of the chain state rather than syncing from genesis.

Archives can be found from https://archive.hiro.so. For the Stacks node testnet, the latest snapshot can be found at: https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz. You can also browse all testnet snapshots at https://archive.hiro.so/testnet/stacks-blockchain/.

Download this on the same machine that will run the Stacks node. Example commands:

```bash
curl -# <https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz> -o stacks-snapshot.tar.gz -o /stacks-blockchain/data/latest.tar.gz

tar -xzvf /stacks-blockchain/data/latest.tar.gz -C /stacks-blockchain/data
```
{% endstep %}

{% step %}
### Run a Stacks Node with Docker

You can run the Stacks node as a Docker container using the `blockstack/stacks-core` image. When running the Docker container, ensure:

* The port configured for `p2p_bind` must be exposed to the internet for egress.
* The port configured for `rpc_bind` must be accessible by your signer.
* `working_dir` needs to be on a volume with 3-5GB of available storage.
* Include your `node-config.toml` file.

Example docker run (run from the same directory as your `node-config.toml` or change STX\_NODE\_CONFIG):

```bash
IMG="blockstack/stacks-core"

VER="4.0.2"

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

Or using a custom Dockerfile:

```docker
FROM blockstack/stacks-core:4.0.2
COPY node-config.toml /config.toml
EXPOSE 20444
EXPOSE 20443
CMD ["stacks-node", "start", "--config", "/config.toml"]
```
{% endstep %}
{% endstepper %}
