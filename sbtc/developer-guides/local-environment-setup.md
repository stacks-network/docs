# Local Environment Setup

Devnet is a setup with a local bitcoin node running regtest, a local stacks node running testnet and connecting to the local bitcoin node. In addition, explorers and api servers are setup to provide easy access to information.

Developers should use docker to setup all required services.

Here are the basic steps we'll need to follow to get everything running.

1. Launch devnet.
2. Deploy sbtc contract (happens automatically).
3. Launch sBTC binary (Alpha romeo engine).
4. Use sBTC web app (sBTC Bridge) or sbtc cli or your own app.

#### Requirements

* Install [Docker](https://docs.docker.com/engine/install/).
* Install [Clarinet](https://github.com/hirosystems/clarinet) (version 1.7.0 or higher).
* _Mac OS X_: Install [jq](https://formulae.brew.sh/formula/jq)

### Launch Devnet

We'll get sBTC up and running locally using the [sBTC devenv](https://github.com/stacks-network/sbtc/blob/main/devenv/README.md). You'll need to make sure you have Docker and Docker Compose installed on your system.

First, make sure you have the [`sbtc`](https://github.com/stacks-network/sbtc) repo cloned locally.

Now let's get everything running. Make sure you are in the `devenv` folder and run:

```bash
./build.sh
```

This first build will take a while to complete, but once that's done we just need to run everything with:

```bash
./up.sh
```

Let's check to make sure things are running by visiting the Stacks explorer and the Bridge app. The Stacks explorer will take a bit get up and running.

* [http://127.0.0.1:3020/?chain=testnet\&api=http://127.0.0.1:3999](http://127.0.0.1:3020/?chain=testnet\&api=http://127.0.0.1:3999) (Stacks explorer)
* [http://127.0.0.1:8083](http://127.0.0.1:8083) (Bitcoin explorer)
* [http://127.0.0.1:8080](http://127.0.0.1:8080) (sBTC Bridge App)

### Deploy Contracts

The deployment of the Clarity contracts `asset.clar` and `clarinet-bitcoin-mini.clar` happens during the launch of devenv.sbtcWalletAddress

Under the hood, there is a script `utils/deploy_contracts.sh` that is used to deploy the contracts The local environment defines wallets that are already funded. The deployer wallet is used to deploy the contract using clarinet deployments.

### Prepare Wallet

You can take a look at the config file at `sbtc/devenv/sbtc/docker/config.json` to see the mnemonic that defines the taproot address that will be the contract owner for sBTC. This is the mnemonic that generates the address that will actually call the `mint` function in the sBTC contract.

If you take a look at the `sbtc/romeo/asset-contract/settings/Devnet.toml` you can see this mnemonic associated with a specific Stacks address. This will also be the address that will be used to deploy the actual contracts.

Download the [Leather wallet](https://leather.io) (version 6.11.+) and import the deployer address mnemonic into it to load that account locally.

```
twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw
```

You can see more default generated mnemonics for the devnet in the [`devenv` repo](https://github.com/stacks-network/sbtc/devenv).

In Leather wallet, you see that Account 1 is the deployer. Nevertheless, you can use this account or Account 2 as a normal user.

### Mint some BTC and sBTC

There are helper scripts to create and broadcast deposit and withdrawal requests. They are contained in the `utils` folder of devenv:

1. mint\_btc.sh: funds the btc addresses with BTC. Add the number of blocks to mint for the two addresses as parameter.
2. deposit.sh: deposits a random amount of less than 10,000 sats. sBTC will be received by the deployer stacks address.
3. withdrawal.sh: withdraws a random amount of less than 2,000 sats.

Before running these, make sure the Stacks devnet is running by visiting the explorer at [http://127.0.0.1:3020/transactions?chain=testnet\&api=http://127.0.0.1:3999](http://127.0.0.1:3020/transactions?chain=testnet\&api=http://127.0.0.1:3999).

If you get an error, wait a few minutes and refresh. Once that page loads correctly you should be good to go.

If you are using the Leather wallet, make sure to use the same secret key as used in devnet (deployer wallet). If you are using a different secret key you'll want to run this again and make sure that this is mining to the same wallet you are going to use in your sBTC app. To do that, view the Bitcoin address displayed in Leather (make sure you are on Devnet) and add it to the `mine_btc.sh` script at the end like this:

```bash
btc_address='bcrt1q3tj2fr9scwmcw3rq5m6jslva65f2rqjxfrjz47'
```

First, let's mine some BTC with `./utils/mine_btc.sh 200`. This will mine 200 BTC blocks and ensure our address (Account 1 and Account 2) is funded.

Next we can initiate a deposit, which will deposit a random amount of satoshis from our Bitcoin wallet (Account 2) into the sBTC threshold wallet, minting sBTC in the process.

We can do that with `./utils/deposit.sh`.

And finally, we can do the reverse, convert our sBTC back to BTC, with `./utils/withdraw.sh`, which will print the txid of the withdrawal transaction on completion.

Check the results on Stacks at our address: [http://localhost:3020/address/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM?chain=testnet\&api=http://localhost:3999](http://localhost:3020/address/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM?chain=testnet\&api=http://localhost:3999)

Check the results on Bitcoin at the txs printed by the utility functions, eg. [http://127.0.0.1:8083/tx/38089273be6ed7521261c3a3a7d1bd36bc67d97123c27263e880350fc519899d](http://127.0.0.1:8083/tx/38089273be6ed7521261c3a3a7d1bd36bc67d97123c27263e880350fc519899d), replacing the txid parameter with the given tx id.

### Next Steps

Congratulations! You are among the first people in the world to run sBTC. Now you're ready to actually build something. For that, head over to the End to End Tutorial and we'll build a simple full-stack Bitcoin lending application powered by sBTC.
