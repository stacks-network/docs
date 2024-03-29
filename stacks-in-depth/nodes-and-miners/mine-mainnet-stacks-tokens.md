# Mine Mainnet Stacks Tokens

### Introduction

For more on the technical details of mining, please review the mining guide.

The following is an abridged version of the [walkthrough here](https://github.com/stacksfoundation/miner-docs), written for a Linux system. If you're on Windows or MacOS, there will be some slight modifications needed (PR's welcome!).

If you're interested in mining on the Stacks mainnet, you can find instructions on how to do that here:

### Running a Bitcoin Mainnet Full Node

To participate as a miner on mainnet, you must have access to a mainnet bitcoin node with a wallet (and the wallet's private key). One way to accomplish this is to run bitcoin locally.

* [Ensure your computer meets the minimum hardware requirements before continuing.](https://bitcoin.org/en/bitcoin-core/features/requirements#system-requirements)

First, download a [bitcoin binary](https://bitcoin.org/en/download), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/main/bitcoin.md#source-install) (_there may be some extra requirements to building,_ [_defined here_](https://github.com/stacksfoundation/miner-docs/blob/main/prerequisites.md#install-required-packages)).

If you want to learn more about the technical details of mining, please review the mining guide:

**Tip:** It is recommened to use a persistent location for the chainstate, in the steps below we're using `/bitcoin`.

#### Update the Bitcoin Configuration File

Next, update the bitcoin configuration:

* **Optional, but recommended:** Use a persistent directory to store the Bitcoin chainstate, i.e. `datadir=/bitcoin`.
* **Optional, but recommended:** Update the `rpcallowip` value to only allow `127.0.0.1`, or the stacks miner IPv4.
* Modify the `rpcuser` and `rpcpassword` values from the defaults below.
* Store the following configuration somewhere on your filesystem (ex: `$HOME/bitcoin.conf`).

```toml
server=1
disablewallet=0
datadir=/bitcoin
rpcuser=btcuser
rpcpassword=btcpass
rpcallowip=0.0.0.0/0
bind=0.0.0.0:8333
rpcbind=0.0.0.0:8332
dbcache=512
banscore=1
rpcthreads=256
rpcworkqueue=256
rpctimeout=100
txindex=1
```

#### Start Bitcoin

Finally, start `bitcoind` as follows (adjust the `conf` path to where it was created in the previous step, i.e. `$HOME/bitcoin.conf`):

```bash
bitcoind -conf=$HOME/bitcoin.conf
```

**Note:** It will take a few hours for the node to synchronize with Bitcoin Mainnet.

While it's syncing, you can track the progress with `bitcoin-cli` or the logfile (will be located where the chainstate is stored, i.e. `/bitcoin/debug.log`):

```bash
$ bitcoin-cli \
 -rpcconnect=127.0.0.1 \
 -rpcport=8332 \
 -rpcuser=btcuser \
 -rpcpassword=btcpass \
  getblockchaininfo | jq .blocks
836745
```

***

### Running a Stacks Blockchain miner

First, download a [stacks blockchain binary](https://github.com/stacks-network/stacks-blockchain/releases/latest), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/main/stacks-blockchain.md#build-and-install-stacks-blockchain-from-source) (_there may be some extra requirements to building,_ [_defined here_](https://github.com/stacksfoundation/miner-docs/blob/main/prerequisites.md#install-required-packages)).

**Tip:** It is recommened to use a persistent location for the chainstate, in the steps below we're using `/stacks-blockchain`.

#### Generate a keychain

First, a keychain needs to be generated. With this keychain, we'll purchase some BTC from a cryptocurrency exchange, and then use that BTC to start mining.

To create a keychain, the simplest way is to use the [stacks-cli](https://docs.hiro.so/references/stacks-cli) with the `make_keychain` command.

```bash
npx @stacks/cli make_keychain 2>/dev/null | jq -r
```

After this runs, you should see some JSON printed to the screen that looks like this:

```json
{
  "mnemonic": "stomach strong dog warfare drip garbage vendor among argue flash anchor change any credit purity learn gas unfold urban electric van alcohol lobster reflect",
  "keyInfo": {
    "privateKey": "4b48f79eea88bb20de75148ecc8e5480463048b937d9c77801b388b4e1b49d2d01",
    "publicKey": "03a707458e468f7ee6513f8135500780576dca2b52c98ae909a538f75e4901aad5",
    "address": "SP2D9W82GHM1V0ACDRVCDNKJV0J6NS7KJ25WHHRMH",
    "btcAddress": "1F6YVM1E633QDUo9zgT3q7K3T9FYuKJ3RZ",
    "wif": "Kyk49jsPGen5C1ThhyJJH4CndLk8yLESuQJVGsbbTV3FFF9CRTJG",
    "index": 0
  }
}
```

**Warning:** **Do not lose this information** - we'll need to use the `privateKey`, `btcAddress` and `wif` fields in later steps.

The above `wif` (`Kyk49jsPGen5C1ThhyJJH4CndLk8yLESuQJVGsbbTV3FFF9CRTJG`) will then need to be imported into the bitcoin mainnet network.

Next, a bitcoin wallet is created:
```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=8332 \
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

**Note:** Be sure to replace `<wif from JSON above>` with the bitcoin address in the `Generate a keychain` step.

```bash
bitcoin-cli \
  -rpcport=8332 \
  -rpcuser=btcuser \
  -rpcpassword=btcpassword \
  importprivkey <wif from JSON above>
```

**Note:** The import may take a while, because a wallet rescan is triggered. After the import has completed successfully, you can check that the address is imported with `getaddressinfo`.
```bash
bitcoin-cli \
  -rpcconnect=127.0.0.1 \
  -rpcport=8332 \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  getaddressinfo <btcAddress from JSON above>
```

Once imported, we need to get some BTC to that address. You should be able to transfer BTC to this address using a crytpocurrency exchange such as [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), or [Kraken](https://www.kraken.com).

#### Update the Stacks Blockchain Configuration File

Now, we need to configure our node to use this Bitcoin keychain. Copy the [sample mainnet miner config](https://raw.githubusercontent.com/stacks-network/stacks-blockchain/master/main/stacks-node/conf/mainnet-miner-conf.toml) to your local machine in a _memorable_ location like `$HOME/mainnet-miner-conf.toml`.

Next, update the stacks configuration:

* **Optional, but recommended:** Use a persistent directory to store the Stacks chainstate, i.e. `working_dir = "/stacks-blockchain"`
* From the `make_keychain` step, modify the `seed` and `local_peer_seed` values with `privatekey`
* Store the following configuration somewhere on your filesystem (ex: `$HOME/mainnet-miner-conf.toml`)

```toml
[node]
working_dir = "/stacks-blockchain"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
seed = "<privateKey from JSON above>>"
local_peer_seed = "<privateKey from JSON above>>"
miner = true
bootstrap_node = "02da7a464ac770ae8337a343670778b93410f2f3fef6bea98dd1c3e9224459d36b@seed-0.mainnet.stacks.co:20444,02afeae522aab5f8c99a00ddf75fbcb4a641e052dd48836408d9cf437344b63516@seed-1.mainnet.stacks.co:20444,03652212ea76be0ed4cd83a25c06e57819993029a7b9999f7d63c36340b34a4e62@seed-2.mainnet.stacks.co:20444"
mine_microblocks = false

[burnchain]
wallet_name = "miner"
chain = "bitcoin"
mode = "mainnet"
peer_host = "127.0.0.1"
username = "<bitcoin config rpcuser>"
password = "<bitcoin config rpcpassword>"
rpc_port = 8332
peer_port = 8333
satoshis_per_byte = 100
burn_fee_cap = 20000
```

#### Start the Stacks Blockchain

To run your miner, run this in the command line:

```bash
stacks-node start --config=$HOME/mainnet-miner-conf.toml
```

Your node should start. It will take some time to sync, and then your miner will be running.

#### Enable Debug Logging

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
STACKS_LOG_DEBUG=1 stacks-node start --config=$HOME/mainnet-miner-conf.toml
```

***

### Optional: Running a Stacks Blockchain miner with Docker

Alternatively, you can run a Stacks mainnet miner with Docker.

**Caution:** Ensure you have [Docker](https://docs.docker.com/get-docker/) installed.

#### Generate a Keychain and Get Some Tokens

Generate a keychain:

```bash
docker run -i node:20-alpine npx @stacks/cli make_keychain 2>/dev/null | jq -r
```

We need to get some BTC to that address. You should be able to transfer BTC to this address using a cryptocurrency exchange such as [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), or [Kraken](https://www.kraken.com).

#### Update Stacks Blockchain Docker Configuration File

Use the steps oulined above to create the configuration file.

#### Start the Stacks Blockchain miner with Docker

**Info:** The ENV VARS `RUST_BACKTRACE` and `STACKS_LOG_DEBUG` are optional. If removed, debug logs will be disabled.

```bash
docker run -d \
  --name stacks_miner \
  --rm \
  --network host \
  -e RUST_BACKTRACE="full" \
  -e STACKS_LOG_DEBUG="1" \
  -v "$HOME/mainnet-miner-conf.toml:/src/stacks-node/mainnet-miner-conf.toml" \
  -v "/stacks-blockchain:/stacks-blockchain" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:latest \
  /bin/stacks-node start --config /src/stacks-node/mainnet-miner-conf.toml
```

You can review the node logs with this command:

```bash
docker logs -f stacks_miner
```

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
  --set config.node.seed="your-privateKey-from-generate-keychain-step" \
  --set config.burnchain.mode="mainnet"
```

You can review the node logs with this command:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

For more information on the Helm chart and configuration options, please refer to the [chart's homepage](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).
