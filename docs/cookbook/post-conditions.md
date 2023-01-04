---
title: Post Conditions
description: Working with Stacks post conditions
---

The content in this recipe has ben pulled from the [tutorial on post conditions](https://dev.to/stacks/understanding-stacks-post-conditions-e65). Post conditions are an additional safety feature built into the Stacks chain itself that help to protect end users.

Rather than being a function of Clarity smart contracts, they are implemented on the client side and meant to be an additional failsafe against malicious contracts.

Put simply, post conditions are a set of conditions that must be met before a user's transaction will execute. The primary goal behind post conditions is to limit the amount of damage that can be done to a user's assets due to a bug, intentional or otherwise.

So they are sent as part of the transaction when the user initiates it, meaning we need a frontend library to utilize them.

Whenever you are transferring an asset (fungible or non-fungible) from one address to another, you should taker advantage of post conditions.

We're going to use [Stacks.js](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions#post-conditions) to familiarize ourselves with them.

## STX Post Condition

```js
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@stacks/transactions";

// With a standard principal
const postConditionAddress = "SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE";
const postConditionCode = FungibleConditionCode.GreaterEqual;
const postConditionAmount = 12345n;

const standardSTXPostCondition = makeStandardSTXPostCondition(
  postConditionAddress,
  postConditionCode,
  postConditionAmount
);

// With a contract principal
const contractAddress = "SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X";
const contractName = "test-contract";

const contractSTXPostCondition = makeContractSTXPostCondition(
  contractAddress,
  contractName,
  postConditionCode,
  postConditionAmount
);
```

## Fungible Token Post Condition

```js
import {
  FungibleConditionCode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
} from "@stacks/transactions";

// With a standard principal
const postConditionAddress = "SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE";
const postConditionCode = FungibleConditionCode.GreaterEqual;
const postConditionAmount = 12345n;
const assetAddress = "SP62M8MEFH32WGSB7XSF9WJZD7TQB48VQB5ANWSJ";
const assetContractName = "test-asset-contract";
const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName);

const standardFungiblePostCondition = makeStandardFungiblePostCondition(
  postConditionAddress,
  postConditionCode,
  postConditionAmount,
  fungibleAssetInfo
);

// With a contract principal
const contractAddress = "SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X";
const contractName = "test-contract";
const assetAddress = "SP62M8MEFH32WGSB7XSF9WJZD7TQB48VQB5ANWSJ";
const assetContractName = "test-asset-contract";
const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName);

const contractFungiblePostCondition = makeContractFungiblePostCondition(
  contractAddress,
  contractName,
  postConditionCode,
  postConditionAmount,
  fungibleAssetInfo
);
```

## NFT Post Condition

```js
import {
  NonFungibleConditionCode,
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  bufferCVFromString,
} from "@stacks/transactions";

// With a standard principal
const postConditionAddress = "SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE";
const postConditionCode = NonFungibleConditionCode.Owns;
const assetAddress = "SP62M8MEFH32WGSB7XSF9WJZD7TQB48VQB5ANWSJ";
const assetContractName = "test-asset-contract";
const assetName = "test-asset";
const tokenAssetName = bufferCVFromString("test-token-asset");
const nonFungibleAssetInfo = createAssetInfo(
  assetAddress,
  assetContractName,
  assetName
);

const standardNonFungiblePostCondition = makeStandardNonFungiblePostCondition(
  postConditionAddress,
  postConditionCode,
  nonFungibleAssetInfo,
  tokenAssetName
);

// With a contract principal
const contractAddress = "SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X";
const contractName = "test-contract";

const contractNonFungiblePostCondition = makeContractNonFungiblePostCondition(
  contractAddress,
  contractName,
  postConditionCode,
  nonFungibleAssetInfo,
  tokenAssetName
);
```

## Sample App

Here's a [sample application](https://github.com/kenrogers/fabulous-frogs) that utilizes post conditions on the front end to secure user assets.
