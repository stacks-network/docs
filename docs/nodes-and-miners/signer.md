---
title: Run a sBTC Signer Node - Testnet
description: Set up and run a sBTC signernode
sidebar_position: 10
---

sBTC signer nodes are responsible for managing the signing procedure to process sBTC peg-out requests.

All signing parties must run an instance of a signer node.

To run a signer node, you’ll need access to run `bitcoind` in addition to a Stacks node.

There is a minimum threshold for how many signer nodes need to be running at any given time in order for BTC stacking rewards to be paid out.

## Running a Bitcoin Full Node

The first step is to get a Bitcoin full node up and running.

This part of the setup is the same as running a Stacks miner, so you can refer to the existing section in the docs on [setting up a full testnet Bitcoin node](https://docs.stacks.co/docs/nodes-and-miners/miner-testnet#running-a-bitcoin-testnet-full-node).

## Running a Stacks Node

Next you’ll need to get up and running with a Stacks node.

Download a [stacks blockchain binary](https://github.com/stacks-network/stacks-blockchain/releases/latest), or [build from source](https://github.com/stacksfoundation/miner-docs/blob/main/stacks-blockchain.md#build-and-install-stacks-blockchain-from-source)

_There may be some extra requirements to building, [defined here](https://github.com/stacksfoundation/miner-docs/blob/main/prerequisites.md#install-required-packages)_.

:::tip
It is recommended to use a persistent location for the chainstate, in the steps below we're using `/stacks-blockchain`
:::

### Generate a keychain

Now, a keychain needs to be generated. With this keychain, we'll generate a master private key. From this master private key, we will derive the public keys necessary perform signing operations on both the Bitcoin and Stacks sides.

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

## Setting Up a Stacks Signer

Now that you have your Bitcoin and Stacks nodes running and your master private key generated, it's time to download the [stacks-signer binary](https://github.com/Trust-Machines/core-eng/tree/main/stacks-signer).

We'll need the private key we generated in order to fill in some of the configuration options in the Stacks signer.

## Questions

- Do users need to run an instance of stacks signer and a stacks node? Or is a stacks signer an implementation of a stacks node?
- Where do users enter the configuration options for the stacks signer? I can't find anywhere for them to add their private keys
- What CLI commands do they need to run to get the signer running? I can't find those either. I don't know Rust so it's very possible I'm just not seeing them because I can't understand the code.
- Is there anything I've written so far that is incorrect? Struggling to wrap my head around how the whole process works and what users actually need to do to run a signer.
