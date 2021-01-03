---
title: Mine Stacks tokens
description: Set up and run a miner on the Stacks 2.0 testnet
icon: TestnetIcon
experience: beginners
duration: 10 minutes
tags:
  - tutorial
images:
  large: /images/pages/start-mining.svg
  sm: /images/pages/start-mining-sm.svg
---

## Introduction

Make sure you've followed the [Running testnet node](/understand-stacks/running-testnet-node) tutorial. Once completed it's only a few more steps to run a proof-of-burn miner on the testnet.

[@page-reference | inline]
| /understand-stacks/running-testnet-node

If you want to learn more about the technical details of mining, please review the mining guide:

[@page-reference | inline]
| /understand-stacks/mining

## Running bitcoind locally

To participate as a miner on Xenon, you must have access to a testnet bitcoin node. One way to accomplish this is to run bitcoind locally. You'll need a computer with ~10-GB disk space.

First, download the bitcoind software for your platform from https://bitcoin.org/en/download.

Next, start bitcoind with the following configuration:

```
server=1
rpcuser=your-bitcoind-username
rpcpassword=your-bitcoind-password
testnet=1
txindex=0
listen=1
rpcserialversion=0
maxorphantx=1
banscore=1

[test]
bind=0.0.0.0:18333
rpcbind=0.0.0.0:18332
rpcport=18332
```

Finally, start bitcoind as follows:

```bash
bitcoind -conf=path/to/bitcoin.conf
```

It will take a few hours for the node to synchronize with the Bitcoin testnet -- be patient!

## Running a miner

First, we need to generate a keychain. With this keychain, we'll get some testnet BTC from a faucet, and then use that BTC to start mining.

To get a keychain, the simplest way is to use the `stacks-cli`. We'll use the `make_keychain` command, and pass `-t` to indicate that we want a testnet keychain.

```bash
npx @stacks/cli make_keychain -t 2>/dev/null
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

**Don't lose this information** - we'll need to use the `privateKey` field later on.

The above BTC address will then need to be imported into the BTC testnet network.

```bash
bitcoin-cli -rpcport=18332 -rpcuser=your-user -rpcpassword=your-password importaddress <btcAddress from JSON above>
```

Once imported, we need to get some testnet BTC to that address. Grab the `btcAddress` field, and paste it into [this Bitcoin testnet faucet](https://tbtc.bitaps.com/). You'll be sent `0.01` testnet BTC to that address.

Now, we need to configure our node to use this Bitcoin keychain. In the `stacks-blockchain` folder, create a new file called `testnet/stacks-node/conf/testnet-miner-conf.toml`.

Paste in the following configuration:

```toml
[node]
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "047435c194e9b01b3d7f7a2802d6684a3af68d05bbf4ec8f17021980d777691f1d51651f7f1d566532c804da506c117bbf79ad62eea81213ba58f8808b4d9504ad@xenon.blockstack.org:20444"
# Enter your private key here
seed = "replace-with-your-private-key"
miner = true

[burnchain]
chain = "bitcoin"
mode = "xenon" # if connecting to Krypton, set this to "krypton"
# To mine on Xenon, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
# For Krypton, set peer_host to `bitcoind.krypton.blockstack.org` and
# omit `username` and `password`
peer_host = "127.0.0.1"
username = "your-bitcoind-username"
password = "your-bitcoind-password"
rpc_port = 18332
peer_port = 18333

[[ustx_balance]]
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
amount = 10000000000000000
[[ustx_balance]]
address = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y"
amount = 10000000000000000
[[ustx_balance]]
address = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR"
amount = 10000000000000000
[[ustx_balance]]
address = "STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP"
amount = 10000000000000000
```

Now, grab your `privateKey` from earlier, when you ran the `make_keychain` command. Replace the `seed` field with your private key. Save and close this configuration file.

To run your miner, run this in the command line:

```bash
stacks-node start --config=./testnet/stacks-node/conf/testnet-miner-conf.toml
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
./target/release/stacks-node start --config=./testnet/conf/xenon-follower-conf.toml
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
BLOCKSTACK_DEBUG=1 stacks-node xenon
```

## Running a miner in Windows

### Prerequisites

Make sure you've followed the [Running the testnet node on Windows](/understand-stacks/running-testnet-node#running-the-testnet-node-on-windows) tutorial before starting this tutorial.

### Generate keychain and get testnet tokens in Windows

To setup the miner, first, we need to generate a keychain. With this keychain, we'll get some testnet BTC from a faucet, and then use that BTC to start mining.

To get a keychain, the simplest way is to use the `stacks-cli`. We'll use the `stx make-keychain` command, and pass `-t` to indicate that we want a testnet keychain.

Generate a keychain:

```bash
npm install --global @stacks/cli
stx make_keychain -t > cli_keychain.json
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

-> Check out the [Stacks CLI reference](/references/stacks-cli) for more details

Request BTC from faucet:

We need to get some testnet BTC to that address. Grab the `btcAddress` field, and paste it into [this Bitcoin testnet faucet](https://tbtc.bitaps.com/). You'll be sent 0.01 testnet BTC to that address.

### Create configuration file

Now, we need to configure our node to use this Bitcoin keychain. In the **folder where your binary is extracted**, create a new file called `testnet-miner-conf.toml`.

Paste in the following configuration:

```toml
[node]
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "047435c194e9b01b3d7f7a2802d6684a3af68d05bbf4ec8f17021980d777691f1d51651f7f1d566532c804da506c117bbf79ad62eea81213ba58f8808b4d9504ad@xenon.blockstack.org:20444"
# Enter your private key here
seed = "replace-with-your-private-key"
miner = true

[burnchain]
chain = "bitcoin"
mode = "xenon" # if connecting to Krypton, set this to "krypton"
# To mine on Xenon, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
# For Krypton, set peer_host to `bitcoind.krypton.blockstack.org` and
# omit `username` and `password`
peer_host = "127.0.0.1"
username = "your-bitcoind-username"
password = "your-bitcoind-password"
rpc_port = 18332
peer_port = 18333

[[ustx_balance]]
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
amount = 10000000000000000
[[ustx_balance]]
address = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y"
amount = 10000000000000000
[[ustx_balance]]
address = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR"
amount = 10000000000000000
[[ustx_balance]]
address = "STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP"
amount = 10000000000000000
```

Now, grab your `privateKey` from earlier, when you ran the `stx make_keychain` command. Replace the seed field with your private key. Save and close this configuration file.

### Run the miner

To start your miner, run this in the command line:

```bash
stacks-node start --config=testnet-miner-conf.toml
```

-> **Note** : While starting the node for the first time, windows defender might pop up with a message to allow access. If so, allow access to run the node.
![Windows Defender](/images/windows-defender.png)

Your node should start. It will take some time to sync, and then your miner will be running.

### Enable debug logging in Windows

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
set RUST_BACKTRACE=full;
set BLOCKSTACK_DEBUG=1;
stacks-node start --config=testnet-miner-conf.toml
```

## Optional: Running with Docker

Alternatively, you can run the testnet node with Docker.

-> Ensure you have [Docker](https://docs.docker.com/get-docker/) installed on your machine.

### Generate keychain and get testnet tokens

Generate a keychain:

```bash
docker run -i node:14-alpine npx @stacks/cli make_keychain -t 2>/dev/null
```

We need to get some testnet BTC to that address. Grab the `btcAddress` field, and paste it into [this Bitcoin testnet faucet](https://tbtc.bitaps.com/). You'll be sent 0.01 testnet BTC to that address.

### Create a config file directory

You need a dedicated directory to keep the config files:

```bash
mkdir -p $HOME/stacks
```

### Create config file

Inside the new `$HOME/stacks` folder, you should create a new miner config `Config.toml`:

```toml
[node]
working_dir = "/root/stacks-node/current"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
# Enter your private key here
seed = "replace-with-your-privateKey-from-generate-keychain-step"
miner = true

[burnchain]
chain = "bitcoin"
mode = "xenon" # if connecting to Krypton, set this to "krypton"
# To mine on Xenon, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
# For Krypton, set peer_host to `bitcoind.krypton.blockstack.org` and
# omit `username` and `password`
peer_host = "127.0.0.1"
username = "your-bitcoind-username"
password = "your-bitcoind-password"
rpc_port = 18332
peer_port = 18333

[[ustx_balance]]
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
amount = 10000000000000000
[[ustx_balance]]
address = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y"
amount = 10000000000000000
[[ustx_balance]]
address = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR"
amount = 10000000000000000
[[ustx_balance]]
address = "STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP"
amount = 10000000000000000
```

-> Notice that this configuration differs from the one used to run the miner locally

### Start the miner

-> The ENV VARS `RUST_BACKTRACE` and `BLOCKSTACK_DEBUG` are optional. If removed, debug logs will be disabled

```bash
docker run -d \
  --name stacks_miner \
  --rm \
  --network host \
  -e RUST_BACKTRACE="full" \
  -e BLOCKSTACK_DEBUG="1" \
  -v "$HOME/stacks/Config.toml:/src/stacks-node/Config.toml" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:latest \
/bin/stacks-node start --config /src/stacks-node/Config.toml
```

You can review the node logs with this command:

```bash
docker logs -f stacks_miner
```

## Optional: Running in Kubernetes with Helm

In addition, you're also able to run a testnet node in a Kubernetes cluster using the [stacks-blockchain Helm chart](https://github.com/blockstack/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).

Ensure you have the following prerequisites installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/) (Only needed if standing up a local Kubernetes cluster)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [helm](https://helm.sh/docs/intro/install/)

### Generate keychain and get some testnet tokens

Generate a keychain:

```bash
docker run -i node:14-alpine npx @stacks/cli make_keychain -t 2>/dev/null
```

We need to get some testnet BTC to that address. Grab the `btcAddress` field, and paste it into [this Bitcoin testnet faucet](https://tbtc.bitaps.com/). You'll be sent 0.01 testnet BTC to that address.

### Install the chart and run the miner

To install the chart with the release name `my-release` and run the node as a miner:

```bash
minikube start # Only run this if standing up a local Kubernetes cluster
helm repo add blockstack https://charts.blockstack.xyz
helm install my-release blockstack/stacks-blockchain \
  --set config.node.miner=true \
  --set config.node.seed="replace-with-your-privateKey-from-generate-keychain-step"
```

You can review the node logs with this command:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

For more information on the Helm chart and configuration options, please refer to the [chart's homepage](https://github.com/blockstack/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).
