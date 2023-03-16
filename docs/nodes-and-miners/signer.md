---
title: Run a sBTC Signer Node - Testnet
description: Set up and run a sBTC signernode
sidebar_position: 10
---

sBTC signer nodes are responsible for managing the signing procedure to process sBTC peg-out requests.

All signing parties must run an instance of a signer node.

To run a signer node, you’ll need access to run `bitcoind` in addition to a Stacks node.

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
**Do not lose this information** - we'll need to use the `privateKey` when we set up our config file.
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

Now that you have your Bitcoin and Stacks nodes running and your private key generated, it's time to download the [stacks-signer binary](https://github.com/Trust-Machines/core-eng/tree/main/stacks-signer).

We'll need the private key we generated in order to fill in some of the configuration options in the Stacks signer.

## Running the Stacks Signer

Once you have the configuration options set, you can run this command to get your signer up and running. The stacks signer comes with sensible defaults, so you may not need to change anything here unless you have a specific reason to.

`cargo run -- --id 1 --config conf/signer.toml`

Repeat this process in separate terminals for as many signers as you are going to run.

## Questions, Answers, and In-Progress Features

There is quite a bit of functionality that is still in development, here are some questions and answers regarding some of the more nebulous aspects of this existing documentation.

**Is there anywhere I can look to see what all the different config options mean?**
the option name and the source code are the only 'documentation' currently. toml supports comments so having the default config include comment lines would go a long way.

**How do users set what Stacks RPC endpoint they are connecting to in the signer? I see that option in the coordinator, but not the signer. It seems like all a signer has to do is choose a relay server to connect to, but the bulk of the work is on the coordinator to set private keys and RPC endpoints. So does a signer not need to connect directly to a Stacks node? What about bitcoind?**
a signer communicates with other signers through the in-development relay feature of stacks-node. currently the signer config http_relay_url points to a stand-in app to relay data to other signers. this signer config item should change to stacks_node_rpc_url.

**Does the relay URL correspond to a relay server that a signer would connect to, and does that then correspond to a specific coordinator that they would be connecting to?**
currently the relay is the bridge between all signers and the coordinator. the stacks-node will take on that role in the future. the config file should reflect this now, so i'll note that as a todo.

**How does a signer find and choose a relay server to connect to?**
I imagine this is the same as setting up a new stacks-node - the default config file has a seed that points to a hiro.so node.

**Coordinators do need to generate new private keys correct? Do they do that through the CLI like I outlined in the doc and add that to their toml file?**
The coordinator is not currently using a local private key and the config file has no setting currently for it. This feature is not flushed out yet so it may change. There is also some confusing terminology around this key. I'll call it the communication key as it would be used to encrypt traffic between coordinator and signers. The config file has spots for the stx address private key and the btc address private key, but I imagine the communication key will be generated and stored automatically with no config impact other than a folder to store working files in general.

**How do signers determine what configuration options to set in their toml file?**
like stacks-node, the distributed config file will have sensible defaults. I expect that a signer will work with no config edits once the infrastructure is in place - the mainnet stacks nodes include all required sbtc functionality.

**Does a DKG signing round correspond to a 2 week stacking cycle where we generate a new list of public keys to act as signers?**
A signing round is run any time a btc operation is needed, such as on every peg-in and peg-out operation, so its happening all the time.

**What are the minimum and recommended hardware requirements for running the signers/coordinators/relays?**
this hasn't been investigated but its safe to say the requirements will be less than a stacks-node, or put another way stacks-signer and stacks-coordinator will run on anything stacks-node runs on.
