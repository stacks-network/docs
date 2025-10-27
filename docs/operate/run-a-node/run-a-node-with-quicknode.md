# Run a Node with Quicknode

[QuickNode](https://www.quicknode.com/) is a service for rapidly getting set up with a Stacks node. As an easy and fast alternative to running your own node, you can utilize QuickNode to serve as an API.

{% stepper %}
{% step %}
### Create a QuickNode account

Sign up on QuickNode: https://www.quicknode.com/signup
{% endstep %}

{% step %}
### Create an endpoint

Once signed in, click "Create an endpoint". Select:

* Stacks
* your desired network (e.g., mainnet or testnet)
* your desired QuickNode plan level

After that you'll have an API endpoint URL you can use to connect to Stacks.
{% endstep %}

{% step %}
### Install the Stacks network package

Install the `@stacks/network` package in your frontend project.
{% endstep %}

{% step %}
### Import the network class

In your frontend code, import the network class:

{% code title="example.js" %}
```javascript
import { StacksTestnet } from "@stacks/network";
```
{% endcode %}
{% endstep %}

{% step %}
### Configure the network with your QuickNode endpoint

Create the network instance using your QuickNode endpoint URL:

{% code title="example.js" %}
```javascript
const network = new StacksTestnet({ url: "<QUICKNODE_ENDPOINT_HERE>" });
```
{% endcode %}

Replace \<QUICKNODE\_ENDPOINT\_HERE> with the full endpoint URL provided by QuickNode.
{% endstep %}

{% step %}
### Use with @stacks/transactions

You can now call transactions and other Stacks RPC methods as you normally would using the `@stacks/transactions` library, passing the `network` instance where required.

For an example integration and walkthrough, refer to the Hello Stacks tutorial.
{% endstep %}
{% endstepper %}
