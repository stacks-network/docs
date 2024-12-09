# Signer Quickstart

{% hint style="info" %}
### **Current Signer and Stacks Node Versions**

**Signer - 3.1.0.0.0.0**

* [Docker Image](https://hub.docker.com/layers/blockstack/stacks-signer/3.1.0.0.0.0/images/sha256-bd0d116a324d621cc1dad2a16e46f773d2d34bdc70479bfb8c46feae054519df?context=explore)
* [GitHub Release](https://github.com/stacks-network/stacks-core/releases/tag/signer-3.1.0.0.0.0)

**Stacks Node - 3.1.0.0.0**

* [Docker Image](https://hub.docker.com/layers/blockstack/stacks-core/3.1.0.0.0/images/sha256-85cd9a9da3c1dd44cd17ec25928acf461480d28002405abecbf559a8af17214d?context=explore)
* [GitHub Release](https://github.com/stacks-network/stacks-core/releases/latest)
{% endhint %}



If you want to get up and running as an active signer as quickly as possible. Here is a list of the commands you need to run and actions to take.

If you are not familiar with how signing works yet, be sure to check out the [Stackers and Signing](../../concepts/block-production/stackers-and-signing.md) concept guide.

If you would like a more detailed walkthrough of all of these steps, take a look at the [Running a Signer](./) guide.

## Step 1 - Prerequisites

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

The account file previously created looks like this:

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

## Step 2 - Set Up Your Stacks Signer

### Download the stacks-signer binary

Official binaries are available from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases). Each release includes pre-built binaries. Download the [latest signer release ZIP file](https://github.com/stacks-network/stacks-core/releases/tag/signer-3.0.0.0.1.0) for your server’s architecture and decompress it. Inside of that folder is a `stacks-signer` binary.

Assuming a `Linux x64 glibc` machine, the commands to download and uncompress the signer binary look like this:

```bash
# Enter the signer directory
cd ~/stacks-signer

# Download the signer binary zip
wget https://github.com/stacks-network/stacks-core/releases/download/signer-3.1.0.0.0.0/linux-glibc-x64.zip

# Unzip the signer binary archive
unzip linux-glibc-x64.zip
```

### Create the configuration file

Create the configuration file required to start the signer (be sure to replace `<your_token>` and `<your_private_key>` with your auth token and private key values):

{% tabs %}
{% tab title="Mainnet" %}
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
block_proposal_timeout_ms = 180000
EOF
```
{% endtab %}

{% tab title="Testnet" %}
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
block_proposal_timeout_ms = 180000
EOF
```
{% endtab %}
{% endtabs %}

### Verify the setup

To ensure the signer has been set up correctly, you can run the following commands:

```bash
# Verify the signer's version
~/stacks-signer/stacks-signer --version

# Output:
stacks-signer stacks-signer 3.1.0.0.0.0 (release/3.1.0.0.0.0:dd1ebe6, release build, linux [x86_64])

# Verify the config file
~/stacks-signer/stacks-signer check-config -c ~/stacks-signer/signer-config.toml 

# Output:
Config: 
Stacks node host: 127.0.0.1:20443
Signer endpoint: 127.0.0.1:30000
Stacks address: SP1G... # address from keychain file
Public key: 03a3... # publicKey from keychain file
Network: mainnet # or testnet
Chain ID: 0x1 # or 0x80000000 for testnet
Database path: /home/admin/stacks-signer/data/signer.sqlite
Metrics endpoint: 127.0.0.1:9154
```

### Start the signer

If the outputs of the previous commands are correct, you can proceed and start the signer:

```bash
~/stacks-signer/stacks-signer run -c ~/stacks-signer/signer-config.toml
```

## Step 3a - Set up a Bitcoin node (Optional but strongly recommended)

In order to optimize signer health and performance, we highly recommend setting up your own Bitcoin node rather than relying on a third-party node.

We have created guides for running both a [full Bitcoin node](../nodes-and-miners/run-a-bitcoin-node.md) and a [pruned Bitcoin node](../nodes-and-miners/run-a-pruned-bitcoin-node.md) you can follow.

## Step 3b - Set Up Your Stacks Node

### Download the stacks-node binary

Official binaries are available from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases). Each release includes pre-built binaries. Download the [latest node release ZIP file](https://github.com/stacks-network/stacks-core/releases/tag/3.0.0.0.0) for your server’s architecture and decompress it. Inside of that folder is a `stacks-node` binary.

Assuming a `Linux x64 glibc` machine, the commands to download and uncompress the node binary look like this:

```bash
# Enter the node directory
cd ~/stacks-node

# Download the node binary zip
wget https://github.com/stacks-network/stacks-core/releases/download/3.1.0.0.0/linux-glibc-x64.zip

# Unzip the node binary archive
unzip linux-glibc-x64.zip
```

### Create the configuration file

Create the configuration file required to start the node (be sure to replace `<your_token>` with your auth token value):

{% tabs %}
{% tab title="Mainnet" %}
{% hint style="warning" %}
For mainnet, we strongly recommended that you run your own bitcoin node (you can follow [this](https://github.com/stacksfoundation/miner-docs/blob/main/bitcoin.md) guide) in order to ensure you have no connection issues when downloading bitcoin blocks. A hosted bitcoin node may cause your stacks node to fall behind tip and remain unsynced.

If you run your own bitcoin node, you'll have to update `peer_host` and optionally add `rpc_port`, `peer_port`, `username` and `password` fields under the `[burnchain]` section of the node's configuration file.
{% endhint %}

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
{% endtab %}

{% tab title="Testnet" %}
```bash
# Set environment variables
AUTH_TOKEN=<your_token> # Used for signer-node authentication, same token as the one set up in the signer configuration

# Create the node's configuration file
cat <<EOF> ~/stacks-node/node-config.toml
[node]
working_dir = "$HOME/stacks-node/data"
rpc_bind = "127.0.0.1:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "029266faff4c8e0ca4f934f34996a96af481df94a89b0c9bd515f3536a95682ddc@seed.testnet.hiro.so:30444"
prometheus_bind = "127.0.0.1:9153" 
stacker = true
pox_sync_sample_secs = 30
always_use_affirmation_maps = true
require_affirmed_anchor_blocks = true

[burnchain]
mode = "krypton"
peer_host = "bitcoin.regtest.hiro.so"
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

[[burnchain.epochs]]
epoch_name = “1.0”
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

epoch_name = “3.1”
start_height = 77_770
EOF
```
{% endtab %}
{% endtabs %}

### Optional: Start the node with a data archive

You can [download a chainstate archive](https://archive.hiro.so/) in order to quickly sync your node, otherwise it will take a long time to get up-to-date with the other nodes.

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

### Verify the setup

To ensure the node has been set up correctly, you can run the following commands:

```bash
# Verify the node's version
~/stacks-node/stacks-node version

# Output:
INFO [1729788035.383049] [testnet/stacks-node/src/main.rs:285] [main] stacks-node 3.1.0.0.0 (release/3.1.0.0.0:dd1ebe6, release build, linux [x86_64])
stacks-node 3.1.0.0.0 (release/3.1.0.0.0:dd1ebe6, release build, linux [x86_64])

# Verify the node's config
~/stacks-node/stacks-node check-config --config ~/stacks-node/node-config.toml

# Output:
INFO [1729788064.913032] [testnet/stacks-node/src/main.rs:285] [main] stacks-node 3.1.0.0.0 (release/3.1.0.0.0:dd1ebe6, release build, linux [x86_64])
INFO [1729788064.913175] [testnet/stacks-node/src/main.rs:318] [main] Loading config at path /home/admin/stacks-node/node-config.toml
INFO [1729788064.969551] [testnet/stacks-node/src/main.rs:331] [main] Loaded config!
```

### Start the node

If the outputs of the previous commands are correct, you can proceed and start the node:

```bash
~/stacks-node/stacks-node start --config ~/stacks-node/node-config.toml
```

## Step 5 - Generate your signer signature

In order to stack, you'll need your signer signature. The fields required are further explained in the [Generate a signer key signature](https://docs.stacks.co/guides-and-tutorials/stack-stx/stacking-flow#step-2-generate-a-signer-key-signature) guide.

The command to generate a signature looks like this:

```bash
~/stacks-signer/stacks-signer generate-stacking-signature \
  --method stack-stx \
  --max-amount 1000000000000 \
  --auth-id 195591226970828652622091037492597751808 \
  --period 12 \
  --reward-cycle 100 \
  --pox-address 19tg... \
  --config ~/stacks-signer/signer-config.toml \
  --json
```

The generated JSON can be then copy-pasted directly in the [Lockstacks](https://lockstacks.com) website mentioned in the next step.

## Step 6 - Start stacking

The simplest route is to solo stack. You can do that by using [Lockstacks](https://lockstacks.com). Click on the 'Stack Independently' button and follow the instructions there.

If you would like to learn more about solo stacking or running a pool operator, take a look at the [Stack STX](https://docs.stacks.co/guides-and-tutorials/stack-stx) guide.

## Step 7 - Monitoring

If you would like to learn more about monitoring your signer and its corresponding node, you can check the [How to Monitor a Signer](https://docs.stacks.co/guides-and-tutorials/running-a-signer/how-to-monitor-signer) guide.
