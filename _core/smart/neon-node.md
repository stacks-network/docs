---
layout: smart
description: "Run a Stacks Testnet Node"
permalink: /:collection/:path.html
---
# Running a Neon Testnet Node
{:.no_toc}

"Neon" is phase 1 of the Stacks 2.0 testnet. In Neon, you can run a node and connect it to a public network. This guide will walk you through downloading and running your own node in the Neon network.

* TOC
{:toc}

### Prerequisites
Note: If you use Linux, you may need to manually install [`libssl-dev`](https://wiki.openssl.org/index.php/Libssl_API) and other packages. In your command line, run the following to get all packages:

```bash
sudo apt-get install build-essential cmake libssl-dev pkg-config
```

### Download and install the `stacks-blockchain` repository

The first step is to ensure that you have Rust and the support software installed.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

If you already have the Rust toolchain installed, you might see this prompt. Select 'Proceed with Installation' to make sure you have the latest version installed.

  ![rustup prompt](/core/images/rust-install.png)

Next, clone this repository:

```bash
git clone https://github.com/blockstack/stacks-blockchain.git

cd stacks-blockchain
```

Install the Stacks node by running:

```bash
cargo install --path ./testnet
```

### Run your node

You're all set to run a node that connects to the Neon network.

Back in the command line, run:

```bash
stacks-node neon
```

The first time you run this, you'll see some logs indicating that the Rust code is being compiled. Once that's done, you should see some logs that look something like the this:

```
Starting testnet with config ./testnet/follower-conf.toml...
Transactions can be posted on the endpoint:
POST http://127.0.0.1:9001/v2/transactions
INFO [1587602447.879] [src/chainstate/stacks/index/marf.rs:732] First-ever block 0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206
```

Awesome! Your node is now connected to the Neon network. Your node will receive new blocks when they are produced, and you can use your [node's RPC API](/core/smart/rpc-api) to send transactions, fetch information for contracts and accounts, and more.

### Creating an optimized binary

The steps above are great for trying to run a node temporarily. If you want to host a node on a server somewhere, you might want to generate an optimized binary. To do so, use the same configuration as above, but run:

```bash
cd testnet
cargo build --release --bin stacks-node
cd ..
```

The above code will compile an optimized binary. To use it, run:

```bash
./target/release/stacks-node ./testnet/conf/neon-follower-conf.toml
```

### Enable debug logging

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
BLOCKSTACK_DEBUG=1 stacks-node neon
```
