---
title: Run a Node with QuickNode
description: A guide to setup Stacks on QuickNode
sidebar_position: 4
tags:
  - tutorial
---

[QuickNode](https://www.quicknode.com/) is a service for rapidly getting set up with a Stacks node.

As an easy and fast alternative to running your own node, you can utilize QuickNode to serve as an API.

To get started, [set up an account](https://www.quicknode.com/signup) on QuickNode.

Once you are signed in, getting set up with your own Stacks node is a matter of a few clicks, starting with 'Create an endpoint'.

![Set up a QuickNode endpoint](./quicknode-endpoint.png)

From there, you just need to select Stacks, your desired network, and your desired QuickNode plan level.

_That's it._

You now have an API endpoint URL you can use to connect to Stacks.

How do you do that?

It depends on the frontend framework you are using, but let's see how to do it with Stacks.js.

First, you'll need to install the `@stacks/network` package.

Next we'll import it:

```javascript
import { StacksTestnet } from "@stacks/network";
```

Then in your frontend, set up the network with the following line:

```javascript
const network = new StacksTestnet({ url: "<QUICKNODE_ENDPOINT_HERE>" });
```

Then you can call transactions like you normally would using the `@stacks/transactions` library.

For an example of how to do this, please refer to the [Hello Stacks](../tutorials/hello-stacks.md) tutorial.
