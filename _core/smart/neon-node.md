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

### Download the `stacks-blockchain` repository

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

### Configure your node to connect to the Neon network

You'll need to update your node's configuration to connect to the public Neon testnet.

In the `stacks-blockchain` repository, open up the file `testnet/follower-conf.toml`.

First, find the `bootstrap_node` line in the `[node]` section, and update it to the following:

```toml
bootstrap_node = "048dd4f26101715853533dee005f0915375854fd5be73405f679c1917a5d4d16aaaf3c4c0d7a9c132a36b8c5fe1287f07dad8c910174d789eb24bdfb5ae26f5f27@35.245.47.179:20444"
```

Next, find the uncommented `peer_host` line in the `[burnchain]` section, and update it to:

```toml
peer_host = "35.245.47.179"
```

### Run your node

You're all set to run a node that connects to the Neon network.

Back in the command line, run:

```bash
cargo testnet ./testnet/conf/neon-follower-conf.toml
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
./target/release/stacks-node neon
```
