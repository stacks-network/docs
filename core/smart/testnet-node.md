---

description: "Run a Stacks Testnet Node"

redirect_from:
  - /core/smart/neon-node.html
---
# Running a Testnet Node
{:.no_toc}

The Stacks 2.0 testnet is currently in development. As part of the testnet, you can run a node and connect it to a public network. This guide will walk you through downloading and running your own node in the testnet network.

* TOC
{:toc}

### Prerequisites
Note: If you use Linux, you may need to manually install [`libssl-dev`](https://wiki.openssl.org/index.php/Libssl_API) and other packages. In your command line, run the following to get all packages:

```bash
sudo apt-get install build-essential cmake libssl-dev pkg-config
```

Ensure that you have Rust installed. If you are using macOS, Linux, or another Unix-like OS, run the following. If you are on a different OS, follow the [official Rust installation guide](https://www.rust-lang.org/tools/install).

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

If Rust is already installed, you might see this prompt. Select 'Proceed with Installation' to make sure you have the latest version installed.

  ![rustup prompt](/core/images/rust-install.png)

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

The first time you run this, you'll see some logs indicating that the Rust code is being compiled. Once that's done, you should see some logs that look something like the this:

```
INFO [1588108047.585] [src/chainstate/stacks/index/marf.rs:732] First-ever block 0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206
```

Awesome! Your node is now connected to the testnet network. Your node will receive new blocks when they are produced, and you can use your [node's RPC API](/core/smart/rpc-api) to send transactions, fetch information for contracts and accounts, and more.

### Running a miner

Once you've followed the above steps to run a node, it's only a few more steps to run a proof-of-burn miner on the testnet.

First, we need to generate a keychain. With this keychain, we'll get some testnet BTC from a faucet, and then use that BTC to start mining.

To get a keychain, the simplest way is to use the `blockstack-cli`. We'll use the `make_keychain` command, and pass `-t` to indicate that we want a testnet keychain.

```bash
npx blockstack-cli@1.1.0-beta.1 make_keychain -t
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

We need to get some testnet BTC to that address. Grab the `btcAddress` field, and head over to [the Stacks testnet website](https://testnet.blockstack.org/faucet). In the BTC faucet section, past in your `btcAddress`, and submit. You'll be sent 0.5 testnet BTC to that address. **Don't lose this information** - we'll need to use the `privateKey` field later on.

Now, we need to configure out node to use this Bitcoin keychain. In the `stacks-blockchain` folder, create a new file called `testnet/stacks-node/conf/testnet-miner-conf.toml`.

Paste in the following configuration:

```toml
[node]
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "048dd4f26101715853533dee005f0915375854fd5be73405f679c1917a5d4d16aaaf3c4c0d7a9c132a36b8c5fe1287f07dad8c910174d789eb24bdfb5ae26f5f27@argon.blockstack.org:20444"
# Enter your private key here!
seed = "replace-with-your-private-key"
miner = true

[burnchain]
chain = "bitcoin"
mode = "argon"
peer_host = "argon.blockstack.org"
rpc_port = 18443
peer_port = 18444

[[mstx_balance]]
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
amount = 10000000000000000
[[mstx_balance]]
address = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y"
amount = 10000000000000000
[[mstx_balance]]
address = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR"
amount = 10000000000000000
[[mstx_balance]]
address = "STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP"
amount = 10000000000000000
```

Now, grab your `privateKey` from earlier, when you ran the `make_keychain` command. Replace the `seed` field with your private key. Save and close this configuration file.

To run your miner, run this in the command line:

```bash
stacks-node start --config=./testnet/stacks-node/conf/testnet-miner-conf.toml
```

Your node should start. It will take some time to sync, and then your miner will be running!

### Creating an optimized binary

The steps above are great for trying to run a node temporarily. If you want to host a node on a server somewhere, you might want to generate an optimized binary. To do so, use the same configuration as above, but run:

```bash
cd testnet/stacks-node
cargo build --release --bin stacks-node
```

The above code will compile an optimized binary. To use it, run:

```bash
cd ../..
./target/release/stacks-node start --config=./testnet/conf/argon-follower-conf.toml
```

### Enable debug logging

In case you are running into issues or would like to see verbose logging, you can run your node with debug logging enabled. In the command line, run:

```bash
BLOCKSTACK_DEBUG=1 stacks-node argon
```
