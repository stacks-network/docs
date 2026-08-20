# Mine Testnet Stacks Tokens

### Introduction

For more on the technical details of mining, please review the mining guide.

The following is an abridged version of the [walkthrough here](https://github.com/stacksfoundation/miner-docs/tree/testnet), written for a Linux system. If you're on Windows or MacOS, there will be some slight modifications needed (PR's welcome!).

If you're interested in mining on the Stacks testnet, you can find instructions on how to do that here:

### Running a Bitcoin Node for the Stacks Testnet

The Stacks testnet does not run on the public Bitcoin testnet - it uses a Bitcoin **regtest** network operated by Hiro (`bitcoin.regtest.hiro.so`). To participate as a miner, you must have access to a bitcoin node on that network with a wallet (and the wallet's private key). One way to accomplish this is to run bitcoin locally, peered with the Hiro regtest node.

* [Ensure your computer meets the minimum hardware requirements before continuing.](https://bitcoin.org/en/bitcoin-core/features/requirements#system-requirements)

First, download a [bitcoin binary](https://bitcoin.org/en/download), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/testnet/bitcoin.md#source-install) (_there may be some extra requirements to building,_ [_defined here_](https://github.com/stacksfoundation/miner-docs/blob/testnet/prerequisites.md#install-required-packages)). Use Bitcoin Core 25.0 or newer - the wallet commands below are tested against every major version from 25 through 31 (latest minor of each).

{% hint style="info" %}
Tip: It is recommended to use a persistent location for the chainstate, in the steps below we're using `/bitcoin`.
{% endhint %}

#### Update the Bitcoin Configuration File

Next, update the bitcoin configuration:

* Optional, but recommended: Use a persistent directory to store the Bitcoin chainstate, i.e. `datadir=/bitcoin`.
* Optional, but recommended: Update the `rpcallowip` value to only allow `127.0.0.1`, or the stacks miner IPv4.
* Modify the `rpcuser` and `rpcpassword` values from the defaults below.
* Store the following configuration somewhere on your filesystem (ex: `$HOME/bitcoin.conf`).

```toml
server=1
regtest=1
disablewallet=0
datadir=/bitcoin
rpcuser=btcuser
rpcpassword=btcpass
rpcallowip=0.0.0.0/0
dbcache=512
banscore=1
rpcthreads=256
rpcworkqueue=256
rpctimeout=100
txindex=1

[regtest]
bind=0.0.0.0:18444
rpcbind=0.0.0.0:18443
rpcport=18443
addnode=bitcoin.regtest.hiro.so:18444
```

#### Start Bitcoin

Finally, start `bitcoind` as follows (adjust the `conf` path to where it was created in the previous step, i.e. `$HOME/bitcoin.conf`):

```bash
bitcoind -conf=$HOME/bitcoin.conf
```

{% hint style="info" %}
Note: The testnet regtest chain is much smaller than the public Bitcoin testnet, so the node should synchronize within minutes.
{% endhint %}

While it's syncing, you can track the progress with `bitcoin-cli` or the logfile (will be located where the chainstate is stored, i.e. `/bitcoin/regtest/debug.log`):

```bash
$ bitcoin-cli \
 -rpcconnect=127.0.0.1 \
 -rpcport=18443 \
 -rpcuser=btcuser \
 -rpcpassword=btcpass \
getblockchaininfo | jq .blocks
7746
```

***

### Running a Stacks Blockchain miner

First, download the [`stacks-core` 4.0.2 binary](https://github.com/stacks-network/stacks-core/releases/tag/4.0.2), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/testnet/stacks-blockchain.md#build-and-install-stacks-blockchain-from-source) (_there may be some extra requirements to building,_ [_defined here_](https://github.com/stacksfoundation/miner-docs/blob/testnet/prerequisites.md#install-required-packages)).

{% hint style="info" %}
Tip: It is recommended to use a persistent location for the chainstate, in the steps below we're using `/stacks-blockchain`.
{% endhint %}

#### Generate a keychain

First, a keychain needs to be generated. With this keychain, we'll get some testnet BTC from a faucet, and then use that BTC to start mining.

To create a keychain, the simplest way is to use the [stacks-cli](https://docs.hiro.so/references/stacks-cli) with the `make_keychain` command.

```bash
npx @stacks/cli make_keychain -t 2>/dev/null | jq -r
```

After this runs, you should see some JSON printed to the screen that looks like this:

```json
{
  "mnemonic": "spare decade dog ghost luxury churn flat lizard inch nephew nut drop huge divert mother soccer father zebra resist later twin vocal slender detail",
  "keyInfo": {
    "privateKey": "ooxeemeitar4ahw0ca8anu4thae7aephahshae1pahtae5oocahthahho4ahn7eici",
    "address": "STTXOG3AIHOHNAEH5AU6IEX9OOTOH8SEIWEI5IJ9",
    "btcAddress": "Ook6goo1Jee5ZuPualeiqu9RiN8wooshoo",
    "wif": "rohCie2ein2chaed9kaiyoo6zo1aeQu1yae4phooShov2oosh4ox",
    "index": 0
  }
}
```

{% hint style="danger" %}
Do not lose this information - we'll need to use the `privateKey`, `btcAddress` and `wif` fields in later steps.
{% endhint %}

The above `wif` (`cPdTdMgww2njhnekUZmHmFNKsWAjVdCR4cfvD2Y4UQhFzMmwoW33`) will then need to be imported into the bitcoin testnet network.

Next, a bitcoin wallet is created:

{% hint style="warning" %}
**Required:** the node never creates this wallet - it only loads the wallet named by `burnchain.wallet_name` and exits at startup if it does not exist. The name chosen here (`miner`) is the value to set for `wallet_name` in the node config below.
{% endhint %}

```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=18443 \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  -named createwallet \
  wallet_name="miner" \
  disable_private_keys=true \
  blank=true \
  descriptors=true \
  load_on_startup=true
```

The wallet only needs to **watch** the miner's addresses: the stacks node signs its bitcoin transactions itself, so no private key is ever stored in bitcoind (`disable_private_keys=true` above). Your wif (bitcoin private key) is used once, in the `getdescriptorinfo` call below, to derive the watch-only descriptor.

{% hint style="info" %}
Note: Be sure to replace `<wif from JSON above>` with the wif value in the `Generate a keychain` step.
{% endhint %}

First, convert the wif into its public descriptor:

```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=18443 \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  getdescriptorinfo "combo(<wif from JSON above>)"
```

Then import the `descriptor` value returned above into the `miner` wallet - paste it verbatim, it already ends with its `#checksum`. A `combo(...)` descriptor covers both the legacy and the segwit address of the key, so the same wallet works whether or not the miner runs with `segwit = true`:

```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=18443 \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  -rpcwallet=miner \
  importdescriptors \
  '[{"desc":"<descriptor from output above>","timestamp":"now"}]'
```

The expected output is `[{"success": true}]` - `importdescriptors` reports failures inside this JSON rather than with a non-zero exit code.

{% hint style="info" %}
Note: `timestamp: "now"` skips the rescan, which is what you want for a freshly generated keychain. If the key has already received coins, use `"timestamp": 0` instead to rescan the chain for its history - this may take a while.
{% endhint %}

{% hint style="info" %}
Note: to instead let bitcoind hold the private key - e.g. to manage the mined funds with `bitcoin-cli` - create the wallet without `disable_private_keys=true` and import `combo(<wif from JSON above>)#<checksum>`, using the top-level `checksum` field returned by `getdescriptorinfo` (not the checksum embedded in its `descriptor` field).
{% endhint %}

After the import has completed successfully, you can check that the address is imported with `getaddressinfo` - `ismine` should be `true`.

```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=18443 \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  -rpcwallet=miner \
  getaddressinfo <btcAddress from JSON above>
```

Once imported, we need to get some testnet BTC to that address. The public Bitcoin testnet faucets won't work here - the Stacks testnet runs on its own regtest network, so use the Hiro testnet BTC faucet with the `btcAddress` from the keychain step:

```bash
curl -X POST "https://api.testnet.hiro.so/extended/v1/faucets/btc?address=<btcAddress from JSON above>"
```

#### Update the Stacks Blockchain Configuration File

Now, we need to configure our node to use this Bitcoin keychain. Copy the [sample testnet miner config](https://raw.githubusercontent.com/stacks-network/stacks-core/master/sample/conf/testnet-miner-conf.toml) to your local machine in a memorable location like `$HOME/testnet-miner-conf.toml`.

Next, update the stacks configuration:

* Optional, but recommended: Use a persistent directory to store the Stacks chainstate, i.e. `working_dir = "/stacks-blockchain"`
* From the `make_keychain` step, modify the `seed` value with `privatekey`
* Required: set `wallet_name` to the bitcoin wallet you created above (`miner`)
* Required: set `username` and `password` to match the `rpcuser` and `rpcpassword` from your bitcoin configuration
* Store the following configuration somewhere on your filesystem (ex: `$HOME/testnet-miner-conf.toml`)

```toml
[node]
working_dir = "/stacks-blockchain"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "0348af7ce1b224476e8f042727af3f84dcf49a69bb3c9dd2a1afaa783acfffb729@seed.testnet.hiro.so:20444"
prometheus_bind = "0.0.0.0:9153"
seed = "<privateKey from JSON above>"
miner = true
mine_microblocks = false
stacker = true

pox_5_sbtc_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-token"
pox_5_sbtc_registry_contract = "SN3VMHXEN64ZZF71JQ5VESXDWTR301XTTXGF4J8F1.sbtc-registry"
pox_5_bond_admin = "ST1V2ASRWGR81W7GBN1Z4W2JQKXJWCADPVZG30X45"

[burnchain]
mode = "krypton"
peer_host = "127.0.0.1"
username = "<bitcoin config rpcuser>"
password = "<bitcoin config rpcpassword>"
rpc_port = 18443
peer_port = 18444
# Required for miners: must name an existing bitcoin wallet (created above)
wallet_name = "miner"
pox_prepare_length = 100
pox_reward_length = 900
# Maximum amount (in sats) of "burn commitment" to broadcast for the next block's leader election
burn_fee_cap = 20000
# Amount (in sats) per byte - Used to calculate the transaction fees
satoshis_per_byte = 25
# Amount of sats to add when RBF'ing bitcoin tx  (default: 5)
rbf_fee_increment = 5
# Maximum percentage to RBF bitcoin tx (default: 150% of satsv/B)
max_rbf = 150

[connection_options]
# Must match your signer's auth_password
auth_token = "<YOUR_AUTH_TOKEN>"

# Signer event subscription.
# The endpoint must match your signer's endpoint config.
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
```

{% hint style="info" %}
The `[connection_options]` and `[[events_observer]]` sections connect the node to a Stacks signer: `auth_token` must match the signer's `auth_password`, and the events observer `endpoint` must match the signer's `endpoint`. See the [signer quickstart](../run-a-signer/signer-quickstart.md) for setting one up.
{% endhint %}

#### Start the Stacks Blockchain

To run your miner, run this in the command line:

```bash
stacks-node start --config $HOME/testnet-miner-conf.toml
```

Your node should start. It will take some time to sync, and then your miner will be running.

#### Enable Debug Logging

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
STACKS_LOG_DEBUG=1 stacks-node start --config $HOME/testnet-miner-conf.toml
```

***

### Optional: Running a Stacks Blockchain miner with Docker

Alternatively, you can run a Stacks testnet miner with Docker.

{% hint style="warning" %}
Ensure you have [Docker](https://docs.docker.com/get-docker/) installed.
{% endhint %}

#### Generate a Keychain and Get Some Tokens

Generate a keychain:

```bash
docker run -i node:20-alpine npx @stacks/cli make_keychain 2>/dev/null | jq -r
```

Now, we need to get some tBTC. Grab the `btcAddress` field and request funds from the Hiro testnet BTC faucet:

```bash
curl -X POST "https://api.testnet.hiro.so/extended/v1/faucets/btc?address=<btcAddress from JSON above>"
```

#### Update Stacks Blockchain Docker Configuration File

Use the steps outlined above to create the configuration file.

#### Start the Stacks Blockchain miner with Docker

{% hint style="info" %}
Info: The ENV VARS `RUST_BACKTRACE` and `STACKS_LOG_DEBUG` are optional. If removed, debug logs will be disabled.
{% endhint %}

```bash
docker run -d \
  --name stacks_miner \
  --rm \
  --network host \
  -e RUST_BACKTRACE="full" \
  -e STACKS_LOG_DEBUG="1" \
  -v "$HOME/testnet-miner-conf.toml:/src/stacks-node/testnet-miner-conf.toml" \
  -v "/stacks-blockchain:/stacks-blockchain" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-core:4.0.2 \
/bin/stacks-node start --config /src/stacks-node/testnet-miner-conf.toml
```

You can review the node logs with this command:

```bash
docker logs -f stacks_miner
```

***

### Optional: Running in Kubernetes with Helm

In addition, you're also able to run a Stacks miner in a Kubernetes cluster using the [stacks-blockchain Helm chart](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).

Ensure you have the following prerequisites installed:

* [Docker](https://docs.docker.com/get-docker/)
* [minikube](https://minikube.sigs.k8s.io/docs/start/) (Only needed if standing up a local Kubernetes cluster)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [helm](https://helm.sh/docs/intro/install/)

#### Generate keychain and get some tokens

Use the steps outlined above

#### Install the chart and run the miner

To install the chart with the release name `my-release` and run the node as a miner:

```bash
minikube start # Only run this if standing up a local Kubernetes cluster
helm repo add blockstack https://charts.blockstack.xyz
helm install my-release blockstack/stacks-blockchain \
  --set config.node.miner=true \
  --set config.node.seed="privateKey-from-generate-keychain-step" \
  --set config.burnchain.wallet_name="miner"
```

The `miner` wallet must already exist on the bitcoind instance the chart points at (`config.burnchain.peer_host` and its RPC credentials).

You can review the node logs with this command:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

For more information on the Helm chart and configuration options, please refer to the [chart's homepage](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).
