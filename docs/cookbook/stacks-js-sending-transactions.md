---
title: Sending Transactions with Stacks.js
description: Sending transactions with Stacks.js
---

Any Stacks dapp is going to require sending transaction at some point, so how do we do that? We use the `@stacks/transactions` package.

Again, this particular snippet is pulled from our [Hello Stacks](../tutorials/hello-stacks.md) tutorial.

When you send Stacks transactions, don't forget to utilize [post conditions](./post-conditions.md).

But first, you'll need to install the right NPM package.

```bash
yarn add @stacks/transactions
```

## Stacks.js Frontend Code

Assuming you are [authenticated](./stacks-js-auth.md), you'll need to import from the `network` package to connect and import the right Clarity values to convert.

You need to convert values from JS into the right format for Clarity values to ingest. You can view the complete list of types on the [Stacks.js docs](https://stacks.js.org/modules/_stacks_transactions#constructing-clarity-values).

```js
import { StacksMocknet } from "@stacks/network";
import { stringUtf8CV } from "@stacks/transactions";
```

Let's assume we have a message that we need to send.

```
Hello this is something I need to say.
```

```js
const submitMessage = async (e) => {
  e.preventDefault();

  const network = new StacksMocknet();

  const options = {
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "hello-stacks",
    functionName: "write-message",
    functionArgs: [stringUtf8CV(message)],
    network,
    appDetails,
    onFinish: ({ txId }) => console.log(txId),
  };

  await openContractCall(options);
};
```

For more details on the different types of transactions you can send, the [Stacks.js docs]() have multiple examples.
