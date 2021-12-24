---
title: Mine mainnet Stacks tokens
description: Set up and run a miner on the Stacks 2.0 mainnet
icon: MainnetIcon
experience: beginners
duration: 10 minutes
tags:
  - tutorial
images:
  large: /images/pages/start-mining.svg
  sm: /images/pages/start-mining-sm.svg
---

## Introduction

Make sure you've followed the [Running mainnet node](/understand-stacks/running-mainnet-node) procedure. Once completed it's only a few more steps to run a proof-of-burn miner on the mainnet.

If you're interested in mining on the testnet, you can find instructions on how to do that here:

[@page-reference | inline]
| /start-mining/testnet

If you want to learn more about the technical details of mining, please review the mining guide:

[@page-reference | inline]
| /understand-stacks/mining

## Running bitcoind locally

To participate as a miner on mainnet, you must have access to a mainnet bitcoin node. One way to accomplish this is to run bitcoind locally. [Ensure your computer meets the minimum hardware requirements before continuing.](https://bitcoin.org/en/bitcoin-core/features/requirements)

First, download the bitcoind software for your platform from https://bitcoin.org/en/download.

Next, start bitcoind with the following configuration:

```toml
server=1
rpcuser=your-bitcoind-username
rpcpassword=your-bitcoind-password
txindex=0
listen=1
rpcserialversion=0
maxorphantx=1
banscore=1
bind=0.0.0.0:8333
rpcbind=0.0.0.0:8332
rpcport=8332
```

Finally, start bitcoind as follows:

```bash
bitcoind -conf=path/to/bitcoin.conf
```

It may take a few days for the node to synchronize with the Bitcoin mainnet.

## Running a miner

First, a keychain needs to be generated. With this keychain, we'll purchase some BTC from a crytpocurrency exchange, and then use that BTC to start mining.

To get a keychain, the simplest way is to use the `stacks-cli`. We'll use the `make_keychain` command.

```bash
npx @stacks/cli make_keychain 2>/dev/null | json_pp > keychain.txt
```

After this runs, you should see some JSON in the new `keychain.txt` file that looks like this:

```json
{
  "mnemonic": "exhaust spin topic distance hole december impulse gate century absent breeze ostrich armed clerk oak peace want scrap auction sniff cradle siren blur blur",
  "keyInfo": {
    "privateKey": "2033269b55026ff2eddaf06d2e56938f7fd8e9d697af8fe0f857bb5962894d5801",
    "address": "STTX57EGWW058FZ6WG3WS2YRBQ8HDFGBKEFBNXTF",
    "btcAddress": "mkRYR7KkPB1wjxNjVz3HByqAvVz8c4B6ND",
    "index": 0
  }
}
```

**Don't lose this information** - we'll need to use the `privateKey` field later on.

The above BTC address will then need to be imported into the BTC network.

```bash
bitcoin-cli -rpcport=8332 -rpcuser=your-user -rpcpassword=your-password importaddress <btcAddress from JSON above>
```

Once imported, we need to get some BTC to that address. You should be able to transfer BTC to this address using a crytpocurrency exchange such as [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), or [Kraken](https://www.kraken.com).

Now, we need to configure our node to use this Bitcoin keychain. Clone the [stacks-blockchain repository](https://github.com/blockstack/stacks-blockchain) to your local machine if you haven't already. In the `stacks-blockchain` folder, modify the file at [`testnet/stacks-node/conf/mainnet-miner-conf.toml`](https://github.com/blockstack/stacks-blockchain/blob/master/testnet/stacks-node/conf/mainnet-miner-conf.toml).

Update the following properties:

```toml
[node]
...
# Enter your private key here
seed = "replace-with-your-private-key"
local_peer_seed = "replace-with-your-private-key"
...

[burnchain]
...
# To mine on mainnet, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
peer_host = "127.0.0.1"
username = "<USERNAME>"
password = "<PASSWORD>"
...
```

Now, grab your `privateKey` from earlier, when you ran the `make_keychain` command. Replace the `seed` field with your private key. Save and close this configuration file.

To run your miner, run this in the command line:

```bash
stacks-node start --config=./testnet/stacks-node/conf/mainnet-miner-conf.toml
```

Your node should start. It will take some time to sync, and then your miner will be running.

### Creating an optimized binary

The steps above are great for trying to run a node temporarily. If you want to host a node on a server somewhere, you might want to generate an optimized binary. To do so, use the same configuration as above, but run:

```bash
cd testnet/stacks-node
cargo build --release --bin stacks-node
```

The above code will compile an optimized binary. To use it, run:

```bash
cd ../..
./target/release/stacks-node start --config=./mainnet-miner-conf.toml
```

For a full reference of subcommands and configuration options used by `stacks-node`, please see this page.

[@page-reference | inline]
| /references/stacks-node-configuration

To read more about the technical details of mining on the Stacks 2.0 network, have a look at the minig guide:

[@page-reference | inline]
| /understand-stacks/mining

### Enable debug logging

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
STACKS_LOG_DEBUG=1 stacks-node mainnet
```

## Running a miner in Windows

### Prerequisites

Make sure you've followed the [Running the mainnet node on Windows](/understand-stacks/running-mainnet-node#running-the-mainnet-node-on-windows) tutorial and [Running itcoind locally](#running-bitcoind-locally) section above before starting this tutorial.

### Generate keychain and get mainnet tokens in Windows

To setup the miner, first we need to generate a keychain. With this keychain, we'll purchase some BTC from a crytpocurrency exchange, and then use that BTC to start mining.

To get a keychain, the simplest way is to use the `stacks-cli`. We'll use the `stx make-keychain` command.

Generate a keychain:

```bash
npm install --global @stacks/cli
stx make_keychain > cli_keychain.json
type cli_keychain.json
```

After this runs, you'll probably see some installation logs, and at the end you should see some JSON that looks like this:

```json
{
  "mnemonic": "exhaust spin topic distance hole december impulse gate century absent breeze ostrich armed clerk oak peace want scrap auction sniff cradle siren blur blur",
  "keyInfo": {
    "privateKey": "2033269b55026ff2eddaf06d2e56938f7fd8e9d697af8fe0f857bb5962894d5801",
    "address": "STTX57EGWW058FZ6WG3WS2YRBQ8HDFGBKEFBNXTF",
    "btcAddress": "mkRYR7KkPB1wjxNjVz3HByqAvVz8c4B6ND",
    "index": 0
  }
}
```

-> Check out the [Stacks CLI reference](https://docs.hiro.so/references/stacks-cli) for more details

The above BTC address will then need to be imported into the BTC network.

```bash
bitcoin-cli -rpcport=8332 -rpcuser=your-user -rpcpassword=your-password importaddress <btcAddress from JSON above>
```

Once imported, we need to get some BTC to that address. You should be able to transfer BTC to this address using a crytpocurrency exchange such as [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), or [Kraken](https://www.kraken.com).

### Update configuration file

Now, we need to configure our node to use this Bitcoin keychain. Clone the [stacks-blockchain repository](https://github.com/blockstack/stacks-blockchain) to your local machine if you haven't already. In the `stacks-blockchain` folder, modify the file at [`testnet/stacks-node/conf/mainnet-miner-conf.toml`](https://github.com/blockstack/stacks-blockchain/blob/master/testnet/stacks-node/conf/mainnet-miner-conf.toml).

Update the following properties:

```toml
[node]
...
# Enter your private key here
seed = "replace-with-your-private-key"
local_peer_seed = "replace-with-your-private-key"
...

[burnchain]
...
# To mine on mainnet, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
peer_host = "127.0.0.1"
username = "<USERNAME>"
password = "<PASSWORD>"
...
```

Now, grab your `privateKey` from earlier, when you ran the `stx make_keychain` command. Replace the seed field with your private key. Save and close this configuration file.

### Run the miner

To start your miner, run this in the command line:

```bash
stacks-node start --config=testnet/stacks-node/conf/mainnet-miner-conf.toml
```

-> **Note** : While starting the node for the first time, windows defender might pop up with a message to allow access. If so, allow access to run the node.
![Windows Defender](/images/windows-defender.png)

Your node should start. It will take some time to sync, and then your miner will be running.

### Enable debug logging in Windows

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
set RUST_BACKTRACE=full;
set STACKS_LOG_DEBUG=1;
stacks-node start --config=mainnet-miner-conf.toml
```

## Optional: Running with Docker

Alternatively, you can run the mainnet node with Docker.

-> Ensure you have [Docker](https://docs.docker.com/get-docker/) installed on your machine.

### Generate keychain and get tokens

Generate a keychain:

```bash
docker run -i node:14-alpine npx @stacks/cli make_keychain 2>/dev/null
```

We need to get some BTC to that address. You should be able to transfer BTC to this address using a crytpocurrency exchange such as [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), or [Kraken](https://www.kraken.com).

### Update configuration file

Now, we need to configure our node to use this Bitcoin keychain. Clone the [stacks-blockchain repository](https://github.com/blockstack/stacks-blockchain) to your local machine if you haven't already. In the `stacks-blockchain` folder, modify the file at [`testnet/stacks-node/conf/mainnet-miner-conf.toml`](https://github.com/blockstack/stacks-blockchain/blob/master/testnet/stacks-node/conf/mainnet-miner-conf.toml).

Update the following properties:

```toml
[node]
...
# Enter your private key here
seed = "replace-with-your-private-key"
local_peer_seed = "replace-with-your-private-key"
...

[burnchain]
...
# To mine on mainnet, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
peer_host = "127.0.0.1"
username = "<USERNAME>"
password = "<PASSWORD>"
...
```

Now, grab your `privateKey` from earlier, when you ran the `stx make_keychain` command. Replace the seed field with your private key. Save and close this configuration file.

### Start the miner

-> The ENV VARS `RUST_BACKTRACE` and `STACKS_LOG_DEBUG` are optional. If removed, debug logs will be disabled

```bash
docker run -d \
  --name stacks_miner \
  --rm \
  --network host \
  -e RUST_BACKTRACE="full" \
  -e STACKS_LOG_DEBUG="1" \
  -v "$(pwd)/testnet/stacks-node/conf/mainnet-miner-conf.toml:/src/stacks-node/mainnet-miner-conf.toml" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:latest \
/bin/stacks-node start --config /src/stacks-node/mainnet-miner-conf.toml
```

You can review the node logs with this command:

```bash
docker logs -f stacks_miner
```

## Optional: Running in Kubernetes with Helm

In addition, you're also able to run a mainnet node in a Kubernetes cluster using the [stacks-blockchain Helm chart](https://github.com/blockstack/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).

Ensure you have the following prerequisites installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/) (Only needed if standing up a local Kubernetes cluster)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [helm](https://helm.sh/docs/intro/install/)

### Generate keychain and get some tokens

Generate a keychain:

```bash
docker run -i node:14-alpine npx @stacks/cli make_keychain 2>/dev/null
```

We need to get some BTC to that address. You should be able to transfer BTC to this address using a crytpocurrency exchange such as [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), or [Kraken](https://www.kraken.com).

### Install the chart and run the miner

To install the chart with the release name `my-release` and run the node as a miner:

```bash
minikube start # Only run this if standing up a local Kubernetes cluster
helm repo add blockstack https://charts.blockstack.xyz
helm install my-release blockstack/stacks-blockchain \
  --set config.node.miner=true \
  --set config.node.seed="replace-with-your-privateKey-from-generate-keychain-step" \
  --set config.burnchain.mode="mainnet"
```

You can review the node logs with this command:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

For more information on the Helm chart and configuration options, please refer to the [chart's homepage](https://github.com/blockstack/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).
