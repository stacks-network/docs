# Mine Testnet Stacks Tokens

### Introduction

For more on the technical details of mining, please review the mining guide.

The following is an abridged version of the [walkthrough here](https://github.com/stacksfoundation/miner-docs/tree/testnet), written for a Linux system. If you're on Windows or MacOS, there will be some slight modifications needed (PR's welcome!).

If you're interested in mining on the Stacks testnet, you can find instructions on how to do that here:

### Running a Bitcoin Testnet Full Node

To participate as a miner on testnet, you must have access to a testnet bitcoin node with a wallet (and the wallet's private key). One way to accomplish this is to run bitcoin locally.

* [Ensure your computer meets the minimum hardware requirements before continuing.](https://bitcoin.org/en/bitcoin-core/features/requirements#system-requirements)

First, download a [bitcoin binary](https://bitcoin.org/en/download), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/testnet/bitcoin.md#source-install) (_there may be some extra requirements to building,_ [_defined here_](https://github.com/stacksfoundation/miner-docs/blob/testnet/prerequisites.md#install-required-packages)).

{% hint style="info" %}
**Tip:** It is recommened to use a persistent location for the chainstate, in the steps below we're using `/bitcoin`.
{% endhint %}

#### Update the Bitcoin Configuration File

Next, update the bitcoin configuration:

* **Optional, but recommended:** Use a persistent directory to store the Bitcoin chainstate, i.e. `datadir=/bitcoin`.
* **Optional, but recommended:** Update the `rpcallowip` value to only allow `127.0.0.1`, or the stacks miner IPv4.
* Modify the `rpcuser` and `rpcpassword` values from the defaults below.
* Store the following configuration somewhere on your filesystem (ex: `$HOME/bitcoin.conf`).

```toml
server=1
testnet=1
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

[test]
bind=0.0.0.0:18333
rpcbind=0.0.0.0:18332
rpcport=18332
```

#### Start Bitcoin

Finally, start `bitcoind` as follows (adjust the `conf` path to where it was created in the previous step, i.e. `$HOME/bitcoin.conf`):

```bash
bitcoind -conf=$HOME/bitcoin.conf
```

{% hint style="info" %}
**Note:** It will take a few hours for the node to synchronize with Bitcoin Testnet.
{% endhint %}

While it's syncing, you can track the progress with `bitcoin-cli` or the logfile (will be located where the chainstate is stored, i.e. `/bitcoin/testnet3/debug.log`):

```bash
$ bitcoin-cli \
 -rpcconnect=127.0.0.1 \
 -rpcport=18332 \
 -rpcuser=btcuser \
 -rpcpassword=btcpass \
getblockchaininfo | jq .blocks
2583513
```

***

### Running a Stacks Blockchain miner

First, download the latest tagged [stacks blockchain binary](https://github.com/stacks-network/stacks-blockchain/releases/latest), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/testnet/stacks-blockchain.md#build-and-install-stacks-blockchain-from-source) (_there may be some extra requirements to building,_ [_defined here_](https://github.com/stacksfoundation/miner-docs/blob/testnet/prerequisites.md#install-required-packages)).

{% hint style="info" %}
**Tip:** It is recommened to use a persistent location for the chainstate, in the steps below we're using `/stacks-blockchain`.
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
**Do not lose this information** - we'll need to use the `privateKey`, `btcAddress` and `wif` fields in later steps.
{% endhint %}

The above `wif` (`cPdTdMgww2njhnekUZmHmFNKsWAjVdCR4cfvD2Y4UQhFzMmwoW33`) will then need to be imported into the bitcoin testnet network.

Next, a bitcoin wallet is created:
```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=18332 \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  createwallet "miner" \
  false \
  false \
  "" \
  false \
  false \
  true
```

Now, import your wif (bitcoin private key) inside the newly created wallet.

{% hint style="info" %}
**Note:** Be sure to replace `<wif from JSON above>` with the wif value in the `Generate a keychain` step.
{% endhint %}

```bash
bitcoin-cli \
  -rpcport=18332 \
  -rpcuser=btcuser \
  -rpcpassword=btcpassword \
  importprivkey <wif from JSON above>
```

{% hint style="info" %}
**Note:** The import may take a while, because a wallet rescan is triggered. After the import has completed successfully, you can check that the address is imported with `getaddressinfo`.
{% endhint %}
```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=18332 \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  getaddressinfo <btcAddress from JSON above>
```

Once imported, we need to get some testnet BTC to that address. Grab the `btcAddress` field, and paste it into [this Bitcoin testnet faucet](https://tbtc.bitaps.com/). You'll be sent `0.01` testnet BTC to that address.

#### Update the Stacks Blockchain Configuration File

Now, we need to configure our node to use this Bitcoin keychain. Copy the [sample testnet miner config](https://raw.githubusercontent.com/stacks-network/stacks-blockchain/master/testnet/stacks-node/conf/testnet-miner-conf.toml) to your local machine in a _memorable_ location like `$HOME/testnet-miner-conf.toml`.

Next, update the stacks configuration:

* **Optional, but recommended:** Use a persistent directory to store the Stacks chainstate, i.e. `working_dir = "/stacks-blockchain"`
* From the `make_keychain` step, modify the `seed` value with `privatekey`
* Store the following configuration somewhere on your filesystem (ex: `$HOME/testnet-miner-conf.toml`)

```toml
[node]
working_dir = "/stacks-blockchain"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
seed = "<privateKey from JSON above>"
miner = true
bootstrap_node = "029266faff4c8e0ca4f934f34996a96af481df94a89b0c9bd515f3536a95682ddc@seed.testnet.hiro.so:30444"
mine_microblocks = false
wait_time_for_microblocks = 10000

[burnchain]
wallet_name = "miner"
chain = "bitcoin"
mode = "xenon"
peer_host = "127.0.0.1"
username = "<bitcoin config rpcuser>"
password = "<bitcoin config rpcpassword>"
rpc_port = 18332
peer_port = 18333

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
```

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

Now, we need to get some tBTC. Grab the `btcAddress` field, and paste it into [this Bitcoin testnet faucet](https://tbtc.bitaps.com/). You'll be sent `0.01` tBTC to that address.

#### Update Stacks Blockchain Docker Configuration File

Use the steps oulined above to create the configuration file.

#### Start the Stacks Blockchain miner with Docker

{% hint style="info" %}
**Info:** The ENV VARS `RUST_BACKTRACE` and `STACKS_LOG_DEBUG` are optional. If removed, debug logs will be disabled.
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
  blockstack/stacks-blockchain:latest \
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
```

You can review the node logs with this command:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

For more information on the Helm chart and configuration options, please refer to the [chart's homepage](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).
