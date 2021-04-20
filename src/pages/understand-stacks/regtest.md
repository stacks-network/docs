---
title: Regtest
description: Test your smart contracts and apps
images:
  large: /images/pages/regtest.svg
  sm: /images/pages/regtest-sm.svg
---

## About regtest

The regtest is a separate blockchain from the Stacks mainnet analogous to a development environnment. Similar to the testnet, it's a network used by developers to test their apps, smart contracts, or changes to the protocol in a production-like environment. However, it differs by producing a new BTC and STX block every two minutes, making it much more suitable for rapid development. The regtest is reset frequently.

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

The regtest faucet provides you with free Stacks Token (STX) to test with. These are not the same as STX on mainnet and have no value. You can get STX from the faucet on the [Stacks Explorer Sandbox](https://explorer.stacks.co/sandbox?chain=regtest), or using the [API](https://blockstack.github.io/stacks-blockchain-api/#tag/Faucets).

To get STX tokens from within the Explorer Sandbox, navigate to the "Faucet" tab and click on "Request STX" button. If you would like to get enough STX tokens to try out [Stacking](/understand-stacks/stacking), you should click on "I want to stack".

> The Explorer Sandbox requires you to login with a Secret Key
