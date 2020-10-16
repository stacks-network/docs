---
title: Running a testnet node with Docker
description: Set up and run a miner on the Stacks 2.0 testnet with Docker
icon: TestnetIcon
duration: 10 minutes
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction:

This tutorial will walk you through the following steps:

- Run the node with Docker
- Mine Stacks token with Docker

## Requirements:

- a computer
- [Docker](https://docs.docker.com/get-docker/)
- a keyboard and monitor
- `jq` binary (if not installed, run the commands **without** `| jq`)
- dedicated directory to keep the config file(s)
  - i.e. for \*Nix, `$HOME/stacks`: `mkdir -p $HOME/stacks`

### Create Seed

_Note: following command can take a few minutes to install dependencies and output data_

Generate keychain:

```bash
docker run -i node:alpine npx blockstack-cli@1.1.0-beta.1 make_keychain -t | jq
```

Example Output (_`EACCES` error can be ignored_):

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

### Request BTC from the faucet

_replace 'btc_address' with `btcAddress` property from your keychain_

Request BTC:

```bash
curl -XPOST "https://stacks-node-api.blockstack.org/extended/v1/faucets/btc?address=<btc_address>" | jq
```

Example Output:

```json
{
  "txid": "1970274d25f7ecb7f4ac1f992059d52fd9c393fdc1610b58ba1d279b7f6f8a0e",
  "raw_tx": "0200000001fa6e50dff221a46e3b98fb78658929731773047009974f275f41a8142339b0a3010000006a47304402202f11a4cd0f86cf5f4889a8dabe7f447062e3d59a52dd93ba702e5a9518959973022063bc4bb0c5e5423c457743bd6e34a1484d6a836c7f61a8205757a9cffc8f98150121037328e8299133b6dbaec1e9993a7377bf79c66bc3379abe3c4ba4c3663270beb8ffffffff0280f0fa02000000001976a91421e280644637dc09bcd6009ce1d976b638f36ee188acc0d80f24010000001976a914c096562c63bf3a2d4b6c0939a697e4ac89ab0a9d88ac00000000",
  "success": true
}
```

## Miner

### Config

https://docs.blockstack.org/mining#running-a-miner

To use the following config, you'll need to make a new `seed`, which you should have already generated from the above section.

**Config.toml**:

```toml
[node]
working_dir = "/root/stacks-node/current"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
# Enter your private key here!
seed = "replace-with-your-privateKey-from-above"
miner = true

[burnchain]
chain = "bitcoin"
mode = "krypton"
peer_host = "bitcoind.krypton.blockstack.org"
#process_exit_at_block_height = 5340
#burnchain_op_tx_fee = 5500
#commit_anchor_block_within = 10000
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

Copy/Paste the above (with your specific `seed`) as `$HOME/stacks/Config.toml`

You should now have a miner config located at `$HOME/stacks/Config.toml`

### Commands

_Note_: When these containers are stopped, all data is deleted. To persist the data across restarts, either use a docker bind-mount, or remove the `--rm` from the below commands.

**Without** DEBUG output:

```bash
docker run -d \
  --name stacks_miner \
  --rm \
  -v "$HOME/stacks/Config.toml:/src/stacks-node/Config.toml" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:v23.0.0.6-krypton \
/bin/stacks-node start --config /src/stacks-node/Config.toml
```

**With** DEBUG output:

```bash
docker run -d \
  --name stacks_miner \
  --rm \
  -e RUST_BACKTRACE="full" \
  -e BLOCKSTACK_DEBUG="1" \
  -v "$HOME/stacks/Config.toml:/src/stacks-node/Config.toml" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:v23.0.0.6-krypton \
/bin/stacks-node start --config /src/stacks-node/Config.toml
```

**Logs**:

```bash
docker logs -f stacks_miner
```

## Follower

https://docs.blockstack.org/stacks-blockchain/running-testnet-node

### Commands

_Note_: When these containers are stopped, all data is deleted. To persist the data across restarts, either use a docker bind-mount, or remove the `--rm` from the below commands.

**Without** DEBUG output:

```bash
docker run -d \
  --name stacks_follower \
  --rm \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:v23.0.0.6-krypton \
/bin/stacks-node krypton
```

**With** DEBUG output:

```bash
docker run -d \
  --name stacks_follower \
  --rm \
  -e RUST_BACKTRACE="full" \
  -e BLOCKSTACK_DEBUG="1" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:v23.0.0.6-krypton \
/bin/stacks-node krypton
```

**Logs**:

```bash
docker logs -f stacks_follower
```
