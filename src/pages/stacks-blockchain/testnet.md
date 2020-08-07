---
title: Running a testnet node
description: Learn how to set up and run a Stacks 2.0 testnet node.
icon: TestnetIcon
duration: 30 minutes
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/mining.svg
  sm: /images/pages/mining-sm.svg
---

## Introduction

The Stacks 2.0 testnet is currently in development. As part of the testnet, you can run a node and connect it to a
public network. This guide will walk you through downloading and running your own node in the testnet network.

### Prerequisites

Note: If you use Linux, you may need to manually install [`libssl-dev`](https://wiki.openssl.org/index.php/Libssl_API)
and other packages. In your command line, run the following to get all packages:

```bash
sudo apt-get install build-essential cmake libssl-dev pkg-config
```

Ensure that you have Rust installed. If you are using macOS, Linux, or another Unix-like OS, run the following. If you
are on a different OS, follow the [official Rust installation guide](https://www.rust-lang.org/tools/install).

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

If Rust is already installed, you might see this prompt. Select 'Proceed with Installation' to make sure you have the
latest version installed.

![rustup prompt](/images/rust-install.png)

In case you just installed Rust, you will be prompted to run the following command to make the `cargo` command available:

```bash
source $HOME/.cargo/env
```

### Download and install the `stacks-blockchain` repository

Next, clone this repository:

```bash
git clone https://github.com/blockstack/stacks-blockchain.git

cd stacks-blockchain
```

Install the Stacks node by running:

```bash
cargo install --path ./testnet/stacks-node
```

### Run your node

You're all set to run a node that connects to the testnet network.

Back in the command line, run:

```bash
stacks-node argon
```

The first time you run this, you'll see some logs indicating that the Rust code is being compiled. Once that's done, you
should see some logs that look something like the this:

```
INFO [1588108047.585] [src/chainstate/stacks/index/marf.rs:732] First-ever block 0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206
```

Awesome! Your node is now connected to the testnet network. Your node will receive new blocks when they are produced,
and you can use your [node's RPC API](/core/smart/rpc-api) to send transactions, fetch information for contracts and
accounts, and more.

### Mine Stacks token

Now that you have a running testnet node, you can easily set up a miner.

[@page-reference | inline]
| /mining
