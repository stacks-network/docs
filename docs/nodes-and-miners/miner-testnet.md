---
title: Mine testnet Stacks tokens
description: Set up and run a miner on Stacks Testnet
sidebar_position: 5
tags:
  - tutorial
---

## Introduction

For more on the technical details of mining, please review the [mining guide](../stacks-academy/mining)

The following is an abridged version of the [walkthrough here](https://github.com/stacksfoundation/miner-docs/tree/testnet), written for a Linux system. If you're on Windows or MacOS, there will be some slight modifications needed ([PR's welcome!](../contribute/docs)).

If you're interested in mining on the Stacks mainnet, you can find instructions on how to do that [here](miner-mainnet):

## Running a Bitcoin Testnet Full Node

To participate as a miner on testnet, you must have access to a testnet bitcoin node with a wallet (and the wallet's private key). One way to accomplish this is to run bitcoin locally.

- [Ensure your computer meets the minimum hardware requirements before continuing.](https://bitcoin.org/en/bitcoin-core/features/requirements#system-requirements)

First, download a [bitcoin binary](https://bitcoin.org/en/download), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/main/bitcoin.md#source-install)

:::tip
It is recommened to use a persistent location for the chainstate, in the steps below we're using `/bitcoin`
:::

### Update the Bitcoin Configuration File

Next, update the bitcoin configuration:

- **optional but recommended:** Use a persistent directory to store the Bitcoin chainstate, i.e. `datadir=/bitcoin`
- **optional but recommended:** Update the `rpcallowip` value to only allow `127.0.0.1`, or the stacks miner IPv4
- Modify the `rpcuser` and `rpcpassword` values from the defaults below
- Store the following configuration somewhere on your filesystem (ex: `$HOME/bitcoin.conf`)

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

### Start Bitcoin

Finally, start bitcoind as follows:

```bash
bitcoind -conf=$HOME/bitcoin.conf
```

:::note
It will take a few hours for the node to synchronize with Bitcoin testnet.
:::

While it's syncing, you can track the progress with `bitcoin-cli` or the logfile (will be located where the chainstate is stored, i.e. `/bitcoin/testnet3/debug.log`):

```bash
$ bitcoin-cli \
 -rpcconnect=localhost \
 -rpcport=18332 \
 -rpcuser=btcuser \
 -rpcpassword=btcpass \
getblockchaininfo | jq .blocks
2417570
```

---

## Running a Stacks Blockchain miner

First, download a [stacks blockchain binary](https://github.com/stacks-network/stacks-blockchain/releases/latest), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/main/stacks-blockchain.md#build-and-install-stacks-blockchain-from-source)

_There may be some extra requirements to building, [defined here](https://github.com/stacksfoundation/miner-docs/blob/main/prerequisites.md#install-required-packages)_

:::tip
It is recommened to use a persistent location for the chainstate, in the steps below we're using `/stacks-blockchain`
:::

### Generate a keychain

First, a keychain needs to be generated. With this keychain, we'll get some testnet BTC from a faucet, and then use that BTC to start mining.

To create a keychain, the simplest way is to use the [stacks-cli](https://docs.hiro.so/references/stacks-cli) with the `make_keychain` command.

```bash
npx @stacks/cli make_keychain -t 2>/dev/null | jq -r
```

After this runs, you should see some JSON printed to the screen that looks like this:

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

:::warning
**Do not lose this information** - we'll need to use the `privateKey` and `btcAddress` fields in later steps.
:::

The above `btcAddress` (mkRYR7KkPB1wjxNjVz3HByqAvVz8c4B6ND) will then need to be imported into the bitcoin testnet network.
:::note
Be sure to replace `<btcAddress from JSON above>` with the bitcoin address in the "Generate a keychain" step
:::

```bash
bitcoin-cli \
  -rpcport=18332 \
  -rpcuser=btcuser \
  -rpcpassword=btcpassword \
importaddress <btcAddress from JSON above>
```

Once imported, we need to get some testnet BTC to that address. Grab the `btcAddress` field, and paste it into [this Bitcoin testnet faucet](https://tbtc.bitaps.com/). You'll be sent `0.01` testnet BTC to that address.

### Update the Stacks Blockchain Configuration File

Now, we need to configure our node to use this Bitcoin keychain. Copy the [sample testnet miner config](https://raw.githubusercontent.com/stacks-network/stacks-blockchain/master/testnet/stacks-node/conf/testnet-miner-conf.toml) to your local machine in a _memorable_ location like `$HOME/testnet-miner-conf.toml`.

Now, grab your `privateKey` from earlier when you ran the `make_keychain` command.
Replace the `seed` and `local_peer_seed` field with your private key. Save and close this configuration file.

Next, update the bitcoin configuration:

- **optional but recommended:** Use a persistent directory to store the Stacks chainstate, i.e. `working_dir = "/stacks-blockchain"`
- From the `make_keychain` step, modify the `seed` and `local_peer_seed` values with `privatekey`
- Store the following configuration somewhere on your filesystem (ex: `$HOME/testnet-miner-conf.toml`)

```toml
[node]
working_dir = "/stacks-blockchain"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
seed = "<keychain privateKey>"
local_peer_seed = "<keychain privateKey>"
miner = true
bootstrap_node = "047435c194e9b01b3d7f7a2802d6684a3af68d05bbf4ec8f17021980d777691f1d51651f7f1d566532c804da506c117bbf79ad62eea81213ba58f8808b4d9504ad@testnet.stacks.co:20444"
wait_time_for_microblocks = 10000

[burnchain]
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

### Start the Stacks Blockchain

To run your miner, run this in the command line:

```bash
stacks-node start --config=$HOME/testnet-miner-conf.toml
```

Your node should start. It will take some time to sync, and then your miner will be running.

### Enable Debug Logging

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
STACKS_LOG_DEBUG=1 stacks-node start --config=$HOME/testnet-miner-conf.toml
```

---

## Optional: Running a Stacks Blockchain miner with Docker

Alternatively, you can run a Stacks testnet miner with Docker.

:::caution
Ensure you have [Docker](https://docs.docker.com/get-docker/) installed
:::

### Generate a Keychain and Get Some Tokens

Generate a keychain:

```bash
docker run -i node:14-alpine npx @stacks/cli make_keychain 2>/dev/null | jq -r
```

Now, we need to get some tBTC. Grab the `btcAddress` field, and paste it into this Bitcoin testnet faucet. You'll be sent `0.01` tBTC to that address.

### Update Stacks Blockchain Docker Configuration File

Use the steps oulined above to create the [configuration file](miner-testnet#update-the-stacks-blockchain-configuration-file)

### Start the Stacks Blockchain miner with Docker

:::info
The ENV VARS `RUST_BACKTRACE` and `STACKS_LOG_DEBUG` are optional. If removed, debug logs will be disabled
:::

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

---

## Optional: Running in Kubernetes with Helm

In addition, you're also able to run a Stacks miner in a Kubernetes cluster using the [stacks-blockchain Helm chart](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).

Ensure you have the following prerequisites installed:

- [Docker](https://docs.docker.com/get-docker/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/) (Only needed if standing up a local Kubernetes cluster)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [helm](https://helm.sh/docs/intro/install/)

### Generate keychain and get some tokens

Use the steps [outlined above](miner-testnet#generate-a-keychain-and-get-some-tokens)

### Install the chart and run the miner

To install the chart with the release name `my-release` and run the node as a miner:

```bash
minikube start # Only run this if standing up a local Kubernetes cluster
helm repo add blockstack https://charts.blockstack.xyz
helm install my-release blockstack/stacks-blockchain \
  --set config.node.miner=true \
  --set config.node.seed="replace-with-your-privateKey-from-generate-keychain-step" \
```

You can review the node logs with this command:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

For more information on the Helm chart and configuration options, please refer to the [chart's homepage](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).
