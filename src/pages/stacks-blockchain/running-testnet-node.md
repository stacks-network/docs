---
title: Running a testnet node
description: Learn how to set up and run a testnet node
icon: TestnetIcon
duration: 15 minutes
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

-> Note: The Stacks 2.0 testnet is currently in development. As part of the testnet, you can run a node and connect it to a public network.

This tutorial will walk you through the following steps:

- Download and install the node software
- Run the node
- Mine Stacks token

## Requirements

If you use Linux, you may need to manually install [`libssl-dev`](https://wiki.openssl.org/index.php/Libssl_API) and other packages. In your command line, run the following to get all packages:

```bash
sudo apt-get install build-essential cmake libssl-dev pkg-config
```

Ensure that you have Rust installed. If you are using macOS, Linux, or another Unix-like OS, run the following. If you are on a different OS, follow the [official Rust installation guide](https://www.rust-lang.org/tools/install).

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
```

In case you just installed Rust, you will be prompted to run the following command to make the `cargo` command available:

```bash
source $HOME/.cargo/env
```

## Step 1: Installing the node

Next, clone this repository:

```bash
git clone https://github.com/blockstack/stacks-blockchain.git; cd stacks-blockchain
```

Install the Stacks node by running:

```bash
cargo build --workspace --release --bin stacks-node
# binary will be in target/release/stacks-node
```

To install Stacks node with extra debugging symbols, run:

```bash
cargo build --workspace --bin stacks-node
# binary will be in target/debug/stacks-node krypton
```

-> This process will take a few minutes to complete

## Step 2: Running the node

You're all set to run a node that connects to the testnet network.

If installed without debugging symbols, run:

```bash
target/release/stacks-node krypton
```

If installed with debugging symbols, run:

```bash
target/debug/stacks-node krypton
```

The first time you run this, you'll see some logs indicating that the Rust code is being compiled. Once that's done, you should see some logs that look something like the this:

```bash
INFO [1588108047.585] [src/chainstate/stacks/index/marf.rs:732] First-ever block 0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206
```

**Awesome! Your node is now connected to the testnet network.**

Your node will receive new blocks when they are produced, and you can use the [Stacks Node RPC API](/references/stacks-blockchain-api#stacks-node-rpc-api) to send transactions, fetch information for contracts and accounts, and more.

## Optional: Running with Docker

Alternatively, you can run the testnet node with Docker.

-> Ensure you have [Docker](https://docs.docker.com/get-docker/) installed on your machine.

-> The ENV VARS `RUST_BACKTRACE` and `BLOCKSTACK_DEBUG` are optional. If removed, debug logs will be disabled

```bash
docker run -d \
  --name stacks_follower \
  --rm \
  -e RUST_BACKTRACE="full" \
  -e BLOCKSTACK_DEBUG="1" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:latest \
/bin/stacks-node krypton
```

-> The ENV VARS `RUST_BACKTRACE` and `BLOCKSTACK_DEBUG` are optional. If removed, debug logs will be disabled

You can review the node logs with this command:

```bash
docker logs -f stacks_follower
```

## Optional: Running in Kubernetes with Helm

In addition, you're also able to run a testnet node in a Kubernetes cluster using the [stacks-blockchain Helm chart](https://github.com/blockstack/stacks-blockchain/tree/master/helm/stacks-blockchain).

-> Ensure you have the following prerequisites installed on your machine:
  * [minikube](https://minikube.sigs.k8s.io/docs/start/) (Only needed if standing up a local Kubernetes cluster)
  * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  * [helm](https://helm.sh/docs/intro/install/)

To install the chart with the release name `my-release` and run the node as a follower:

```bash
minikube start # Only run this if standing up a local Kubernetes cluster
helm repo add blockstack https://charts.blockstack.xyz
helm install my-release blockstack/stacks-blockchain
```

You can review the node logs with this command:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

For more information on the Helm chart and configuration options, please refer to the [chart's homepage](https://github.com/blockstack/stacks-blockchain/tree/master/helm/stacks-blockchain).

## Optional: Mining Stacks token

Now that you have a running testnet node, you can easily set up a miner.

[@page-reference | inline]
| /mining
