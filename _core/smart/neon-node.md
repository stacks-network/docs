---
layout: smart
description: "Run a Stacks Testnet Node"
permalink: /:collection/:path.html
---
# Running a Neon Testnet Node
{:.no_toc}

"Neon" is phase 1 of the Stacks 2.0 testnet. In Neon, you can run a Stacks node and participate in proof-of-burn mining.

* TOC
{:toc}

### Download and build stacks-blockchain

The first step is to ensure that you have Rust and the support software installed.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

From there, you can clone this repository:

```bash
git clone https://github.com/blockstack/stacks-blockchain.git

cd stacks-blockchain
```

Then build the project:

```bash
cargo build
```

Building the project on ARM:

```bash
cargo build --features "aarch64" --no-default-features
```

### Configure your node to connect to the Neon network

You'll need to update your node's configuration to connect to the public Neon testnet.

In the `stacks-blockchain` repository, open up the file `testnet/follower-config.toml`.

First, find the `bootstrap_node` line in the `[node]` section, and update it to the following:

```toml
bootstrap_node = "030d1bd465746c816ff516d9247415159b96b83e1b008774d040a0a1962c18fbc6@35.245.58.246:20444"
```

Next, find the `peer_host` line in the `[burnchain]` section, and update it to:

```toml
peer_host = "35.245.58.246"
```

### Run your node

You're all set to run a node that connects to the Neon network.

Back in the command line, run:

```bash
cargo testnet ./testnet/follower-conf.toml
```

You should see some logs that look something like the this:

```
Starting testnet with config ./testnet/follower-conf.toml...
Transactions can be posted on the endpoint:
POST http://127.0.0.1:9001/v2/transactions
INFO [1587602447.879] [src/chainstate/stacks/index/marf.rs:732] First-ever block 0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206
```

Awesome! Your node is now connected to the Neon network. Your node will receive new blocks when they are produced, and you can use your node's RPC API to send transactions, fetch information for contracts and accounts, and more.