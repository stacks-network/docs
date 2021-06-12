---
title: Regtest
description: Test your smart contracts and apps
images:
  large: /images/pages/regtest.svg
  sm: /images/pages/regtest-sm.svg
---

## About regtest

The regtest is a separate blockchain from the Stacks mainnet analogous to a development environnment. Similar to the testnet, it's a network used by developers to test their apps, smart contracts, or changes to the protocol in a production-like environment. However, it differs by producing a new BTC and STX block every 2 minutes, making it much more suitable for rapid development. The regtest is reset more regularly than testnet.

## Regtest nodes

If you would like to run your own regtest node, please follow these steps:

[@page-reference | inline]
| /understand-stacks/running-regtest-node

## Regtest API

The hosted [Stacks Blockchain API](/understand-stacks/stacks-blockchain-api) for the regtest is available at this base URL:

```shell
https://stacks-node-api.regtest.stacks.co/
```

### Faucet

The regtest faucet provides you with free Stacks Token (STX) to test with. These are not the same as STX on mainnet and have no value. You can get STX from the faucet on the [Stacks Explorer Sandbox](https://explorer.stacks.co/sandbox/faucet?chain=testnet), or using the [API](https://blockstack.github.io/stacks-blockchain-api/#tag/Faucets).

The Explorer does not yet list `regtest` as an available network by default. Before requesting STX tokens from the Explorer, you'll have to first add the `regtest` network to the Explorer by selecting Network, then "Add a network" in the top right. The URL of the regtest API is `[https://stacks-node-api.regtest.stacks.co](https://stacks-node-api.regtest.stacks.co)`

Once completed, navigate to the "Faucet" tab from the link above and click on "Request STX" button. If you would like to get enough STX tokens to try out [Stacking](/understand-stacks/stacking), you should click on "I want to stack."

> The Explorer Sandbox requires you to login with a Secret Key
