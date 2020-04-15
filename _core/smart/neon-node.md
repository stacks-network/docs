---
layout: core
description: "Blockstack smart contracting language"
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

### Setup your Proof-of-Burn miner

In this phase of the testnet, miners will be burning BTC to participate in leader election. In order to mine, you'll need to configure your node with a BTC keychain, and you'll need to fund it with BTC. We're providing a BTC faucet to make it easy to run a miner.

Let's start by generating a keypair:

```bash
cargo run --bin blockstack-cli generate-sk --testnet

# Output
# {
#  secretKey: "b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001",
#  publicKey: "02781d2d3a545afdb7f6013a8241b9e400475397516a0d0f76863c6742210539b5",
#  stacksAddress: "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH"
# }
```

**TODO**: guidance / update on generating a BTC address from this keypair.

Once you have your BTC address, head over to our testnet website to use the BTC faucet:

**TODO**: URL, guidance for BTC faucet

Now that you have some testnet BTC, you'll need to configure your Stacks node to use this wallet.

Open up the file `testnet/Stacks.toml`. Find the section that starts with `[burnchain]`. Update that section so that it looks like this:

```toml
[burnchain]
chain = "bitcoin"
mode = "neon"
peer_host = "127.0.0.1" # todo(ludo): update URL with neon.blockstack.org when deployed
burnchain_op_tx_fee = 1000
commit_anchor_block_within = 10000
rpc_port = 3000
peer_port = 18444
```

**TODO**: update `peer_host`, and how do you specify your BTC keychain?

### Running your mining node

Now that you're all set up, you can run your miner. In the command line, run:

```bash
cargo testnet ./testnet/Stacks.toml
```

**TODO**: some way of confirming that the miner is running - expected logs, explorer, etc?