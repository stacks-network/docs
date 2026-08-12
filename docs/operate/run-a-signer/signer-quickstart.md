# Signer Quickstart

{% hint style="info" %}
**Current Signer and Stacks Node Versions**

**Stacks Signer**

* [Container image](https://github.com/stacks-network/stacks-core/pkgs/container/stacks-signer) (`ghcr.io/stacks-network/stacks-signer`)
* [GitHub Release](https://github.com/stacks-network/stacks-core/releases/latest)

**Stacks Node**

* [Container image](https://github.com/stacks-network/stacks-core/pkgs/container/stacks-core) (`ghcr.io/stacks-network/stacks-core`)
* [GitHub Release](https://github.com/stacks-network/stacks-core/releases/latest)
{% endhint %}

The commands below take a fresh Ubuntu machine to a running signer and Stacks node. And [this dApp](https://stx.fan/zero_to/signing) can be used after the software is running for the necessary steps to start signing.&#x20;

If you are not familiar with how signing works yet, be sure to check out the [Signing concept guide](https://docs.stacks.co/learn/block-production/signing).

{% stepper %}
{% step %}
#### Prerequisites

{% tabs %}
{% tab title="Mainnet" %}
```bash
# Create the required directories
mkdir -p ~/stacks-signer/data
mkdir -p ~/stacks-node/data

# Install needed packages
sudo apt install -y npm wget unzip jq tar

# Install Stacks CLI globally
npm install --global @stacks/cli

# Generate a new account and store details in a file
stx make_keychain | jq > ~/stacks-signer/keychain.json
```
{% endtab %}

{% tab title="Testnet" %}
```bash
# Create the required directories
mkdir -p ~/stacks-signer/data
mkdir -p ~/stacks-node/data

# Install needed packages
sudo apt install -y npm wget unzip jq tar

# Install Stacks CLI globally
npm install --global @stacks/cli

# Generate a new account and store details in a file

# '-t' option makes this a testnet account
stx make_keychain -t | jq > ~/stacks-signer/keychain.json
```
{% endtab %}
{% endtabs %}

The account file looks like this:

```json
{
  "mnemonic": "aaa bbb ccc ddd ...",
  "keyInfo": {
    "privateKey": "65f3...",
    "publicKey": "03a3...",
    "address": "SP1G...",
    "btcAddress": "19tg...",
    "wif": "Kzdt...",
    "index": 0
  }
}
```

From this file, you'll need the `privateKey` value.
{% endstep %}

{% step %}
#### Set Up Your Stacks Signer

**Get the stacks-signer**

{% tabs %}
{% tab title="Binary" %}
Download the [latest signer release ZIP file](https://github.com/stacks-network/stacks-core/releases/latest) for your server's architecture and decompress it. Inside that folder is a `stacks-signer` binary.

Assuming a `Linux x64 glibc` machine:

```bash
# Enter the signer directory
cd ~/stacks-signer

# Download the signer binary zip
wget https://github.com/stacks-network/stacks-core/releases/latest/download/linux-glibc-x64.zip

# Unzip the signer binary archive
unzip linux-glibc-x64.zip
```
{% endtab %}

{% tab title="Docker" %}
Pull the image, pinned by digest so the same bytes land on every architecture:

```bash
IMG="ghcr.io/stacks-network/stacks-signer"
VER="4.0.1@sha256:815b5518ec0f3a9b4c30d7fdca8f048a1fe8c263790ca65c5785e119b87d8590"

docker pull $IMG:$VER
```
{% endtab %}
{% endtabs %}

**Create the configuration file**

Create the configuration file required to start the signer (be sure to replace `<your_token>` and `<your_private_key>` with your auth token and private key values). Every option is documented in [Signer Configuration](https://docs.stacks.co/reference/node-operations/signer-configuration).

{% tabs %}
{% tab title="Mainnet" %}
{% code title="signer-config.toml" %}
```bash
# Set environment variables
AUTH_TOKEN=<your_token> # Used for signer-node authentication
PRIVATE_KEY=<your_private_key> # privateKey from Step 1, this is the signer's private key

# Create the signer's configuration file
cat <<EOF> ~/stacks-signer/signer-config.toml
node_host = "127.0.0.1:20443"
endpoint = "127.0.0.1:30000"
network = "mainnet"
db_path = "$HOME/stacks-signer/data/signer.sqlite"
auth_password = "$AUTH_TOKEN"
stacks_private_key = "$PRIVATE_KEY"
metrics_endpoint = "127.0.0.1:9154"
EOF
```
{% endcode %}
{% endtab %}

{% tab title="Testnet" %}
{% code title="signer-config.toml" %}
```bash
# Set environment variables
AUTH_TOKEN=<your_token> # Used for signer-node authentication
PRIVATE_KEY=<your_private_key> # privateKey from Step 1, this is the signer's private key

# Create the signer's configuration file
cat <<EOF> ~/stacks-signer/signer-config.toml
node_host = "127.0.0.1:20443"
endpoint = "127.0.0.1:30000"
network = "testnet"
db_path = "$HOME/stacks-signer/data/signer.sqlite"
auth_password = "$AUTH_TOKEN"
stacks_private_key = "$PRIVATE_KEY"
metrics_endpoint = "127.0.0.1:9154"
EOF
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
**Running under Docker?** Some values change, because the signer and the node sit in separate containers rather than on one loopback interface:

```toml
node_host = "stacks-node:20443"       # the node container's name
endpoint = "0.0.0.0:30000"            # so the node container can reach the signer
db_path = "/var/stacks/signer.sqlite" # inside the mounted volume
metrics_endpoint = "0.0.0.0:9154"
```
{% endhint %}

**Verify the setup**

Check the version and the config file:

```bash
# Verify the signer's version
~/stacks-signer/stacks-signer --version

# Output:
stacks-signer 4.0.1 (62e03cc, release build, linux [x86_64])

# Verify the config file
~/stacks-signer/stacks-signer check-config -c ~/stacks-signer/signer-config.toml

# Output:
Signer version: stacks-signer 4.0.1 (62e03cc, release build, linux [x86_64])
Config: 

Stacks node host: 127.0.0.1:20443
Signer endpoint: 127.0.0.1:30000
Stacks address: SP1G... # address from keychain file
Public key: 03a3... # publicKey from keychain file
Network: mainnet # or testnet
Chain ID: 0x1 # or 0x80000000 for testnet
Database path: /home/user/stacks-signer/data/signer.sqlite
Metrics endpoint: 127.0.0.1:9154
Dry run: false
```

**Start the signer**

If the output is correct, start the signer:

{% tabs %}
{% tab title="Binary" %}
```bash
~/stacks-signer/stacks-signer run -c ~/stacks-signer/signer-config.toml
```
{% endtab %}

{% tab title="Docker" %}
```bash
docker run -d \
    --restart unless-stopped \
    --name stacks-signer \
    -v ~/stacks-signer/signer-config.toml:/config.toml \
    -v ~/stacks-signer/data:/var/stacks \
    -p 30000:30000 \
    -e RUST_BACKTRACE=full \
    $IMG:$VER \
    stacks-signer run --config /config.toml
```

The port you set as `endpoint` has to reach your Stacks node and nothing else, and the volume holding `db_path` needs a few GB free.

On a host that is not x64, add `--platform=linux/amd64`, or the run fails with a manifest or platform mismatch.
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
#### Set up a Bitcoin node

Run your own, dedicated to this signer. A shared or third-party node is the usual reason a Stacks node falls behind tip, and a signer whose node is behind tip stops signing.

Follow either the [full Bitcoin node](../run-a-node/run-a-bitcoin-node.md) or [pruned Bitcoin node](../run-a-node/run-a-pruned-bitcoin-node.md) guide.
{% endstep %}

{% step %}
#### Set Up Your Stacks Node

**Get the stacks-node**

{% tabs %}
{% tab title="Binary" %}
Download the [latest node release ZIP file](https://github.com/stacks-network/stacks-core/releases/latest) for your server's architecture and decompress it. Inside that folder is a `stacks-node` binary.

Assuming a `Linux x64 glibc` machine:

```bash
# Enter the node directory
cd ~/stacks-node

# Download the node binary zip
wget https://github.com/stacks-network/stacks-core/releases/latest/download/linux-glibc-x64.zip

# Unzip the node binary archive
unzip linux-glibc-x64.zip
```
{% endtab %}

{% tab title="Docker" %}
```bash
NODE_IMG="ghcr.io/stacks-network/stacks-core"
NODE_VER="4.0.1@sha256:ceb768f881ef52a1d2792a2b4a89d81e092b1df11293b04c31ce36613c3f9711"

docker pull $NODE_IMG:$NODE_VER
```
{% endtab %}
{% endtabs %}

**Create the configuration file**

Create the configuration file required to start the node (be sure to replace `<your_token>` with your auth token value). Every option is documented in [Stacks Node Configuration](https://docs.stacks.co/reference/node-operations/readme-1).

{% tabs %}
{% tab title="Mainnet" %}
{% hint style="warning" %}
If you run your own bitcoin node, you'll have to update `peer_host` and optionally add `rpc_port`, `peer_port`, `username` and `password` fields under the `[burnchain]` section of the node's configuration file.
{% endhint %}

{% code title="node-config.toml" %}
```bash
# Set environment variables
AUTH_TOKEN=<your_token> # Used for signer-node authentication, same token as the one set up in the signer configuration

# Create the node's configuration file
cat <<EOF> ~/stacks-node/node-config.toml
[node]
working_dir = "$HOME/stacks-node/data"
rpc_bind = "127.0.0.1:20443"
p2p_bind = "0.0.0.0:20444"
prometheus_bind = "127.0.0.1:9153" 
bootstrap_node = "02196f005965cebe6ddc3901b7b1cc1aa7a88f305bb8c5893456b8f9a605923893@seed.mainnet.hiro.so:20444,02539449ad94e6e6392d8c1deb2b4e61f80ae2a18964349bc14336d8b903c46a8c@cet.stacksnodes.org:20444,02ececc8ce79b8adf813f13a0255f8ae58d4357309ba0cedd523d9f1a306fcfb79@sgt.stacksnodes.org:20444,0303144ba518fe7a0fb56a8a7d488f950307a4330f146e1e1458fc63fb33defe96@est.stacksnodes.org:20444"
stacker = true

[burnchain]
chain = "bitcoin"
mode = "mainnet"
peer_host = "bitcoin.mainnet.stacks.org"

[connection_options]
auth_token = "$AUTH_TOKEN"

[[events_observer]]
endpoint = "127.0.0.1:30000"
events_keys = ["stackerdb", "block_proposal", "burn_blocks"]
EOF
```
{% endcode %}

Based on the [mainnet follower example](https://docs.stacks.co/reference/node-operations/readme-1#example-mainnet-follower-configuration), with `stacker`, the auth token and the events observer added so the node can serve a signer.
{% endtab %}

{% tab title="Testnet" %}
{% code title="node-config.toml" %}
```bash
# Set environment variables
AUTH_TOKEN=<your_token> # Used for signer-node authentication, same token as the one set up in the signer configuration

# Create the node's configuration file
cat <<EOF> ~/stacks-node/node-config.toml
[node]
working_dir = "$HOME/stacks-node/data"
rpc_bind = "127.0.0.1:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "0348af7ce1b224476e8f042727af3f84dcf49a69bb3c9dd2a1afaa783acfffb729@seed.testnet.hiro.so:20444"
prometheus_bind = "127.0.0.1:9153" 
stacker = true
pox_sync_sample_secs = 30
always_use_affirmation_maps = true
require_affirmed_anchor_blocks = true
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

[connection_options]
auth_token = "$AUTH_TOKEN"
private_neighbors = false

[[events_observer]]
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
```
{% endcode %}

Based on the [Stacks node testnet config](https://docs.stacks.co/reference/node-operations/signer-configuration#stacks-node-testnet-config), which is the follower config plus the fields a node serving a signer needs.
{% endtab %}
{% endtabs %}

**Optional: Start the node with a data archive**

You can [download a chainstate archive](https://archive.hiro.so/) instead of syncing from genesis.

{% tabs %}
{% tab title="Mainnet" %}
```bash
# Enter the node's datadir
cd ~/stacks-node/data

# Download the archive
wget https://archive.hiro.so/mainnet/stacks-blockchain/mainnet-stacks-blockchain-latest.tar.gz

# Decompress the archive
tar -xvf mainnet-stacks-blockchain-latest.tar.gz

# Remove the archive
rm mainnet-stacks-blockchain-latest.tar.gz
```
{% endtab %}

{% tab title="Testnet" %}
```bash
# Enter the node's datadir
cd ~/stacks-node/data

# Download the archive
wget https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz

# Decompress the archive
tar -xvf testnet-stacks-blockchain-latest.tar.gz

# Remove the archive
rm testnet-stacks-blockchain-latest.tar.gz
```
{% endtab %}
{% endtabs %}

**Verify the setup**

Check the version and the config file:

```bash
# Verify the node's version
~/stacks-node/stacks-node version

# Output:
INFO [1786366428.758607] [stacks-node/src/main.rs:329] [main] stacks-node 4.0.1 (62e03cc, release build, linux [x86_64])
stacks-node 4.0.1 (62e03cc, release build, linux [x86_64])

# Verify the node's config
~/stacks-node/stacks-node check-config --config ~/stacks-node/node-config.toml

# Output:
INFO [1786366428.987308] [stacks-node/src/main.rs:329] [main] stacks-node 4.0.1 (62e03cc, release build, linux [x86_64])
INFO [1786366428.987352] [stacks-node/src/main.rs:359] [main] Loading config at path /home/user/stacks-node/node-config.toml
INFO [1786366429.090617] [stacks-node/src/main.rs:372] [main] Loaded config!
```

**Start the node**

Start the signer first. The node will not run unless it can reach the endpoint it is configured to send events to.

{% tabs %}
{% tab title="Binary" %}
```bash
~/stacks-node/stacks-node start --config ~/stacks-node/node-config.toml
```
{% endtab %}

{% tab title="Docker" %}
```bash
docker run -d \
    --restart unless-stopped \
    --name stacks-node \
    -v ~/stacks-node/node-config.toml:/config.toml \
    -v ~/stacks-node/data:/root/stacks-node/data \
    -p 20443:20443 \
    -p 20444:20444 \
    -e RUST_BACKTRACE=full \
    $NODE_IMG:$NODE_VER \
    stacks-node start --config /config.toml
```

Expose `p2p_bind` to the internet and keep `rpc_bind` reachable only by your signer. `working_dir` needs 500 GB to 1 TB.

In Docker's default bridge network, `localhost` inside a container is that container, not the host, so `events_observer.endpoint` has to name the signer container rather than `127.0.0.1`. Connection refused errors here almost always mean that.
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
#### Monitoring

If you would like to learn more about monitoring your signer and its corresponding node, you can check the [How to Monitor a Signer](how-to-monitor-signer.md) guide.
{% endstep %}

{% step %}
#### Next Steps: Register Your Signer

Once your signer and Stacks node are running and verified, this signer key has to be bound to a signer-manager contract before stakers can route to it. PoX-5 replaces the PoX-4 per-transaction signer signature with a standing on-chain grant:

1. You produce a SIP-018 signature off-chain with this signer's private key, binding it to a specific signer-manager and an `auth-id`. See [Generate a Signer Signature](../staking-stx/generate-signer-signature.md).
2. That signer-manager submits `grant-signer-key` carrying your signature, then calls `register-signer` to bind itself to your key on chain.

See [Staking STX](../staking-stx/) for the full PoX-5 staking flow, and [Key and Address Rotation](../staking-stx/key-and-address-rotation.md) for changing this key later.
{% endstep %}
{% endstepper %}
