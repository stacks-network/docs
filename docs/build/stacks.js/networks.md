# Networks

Typically, we speak of `mainnet` and `testnet` as the networks of Stacks. Most wallets are configured to `mainnet` by default—this is the production environment, the actual blockchain that holds real STX tokens.

As the name suggests, `testnet` is a public network for testing. It's a separate blockchain state that holds test tokens, which have no value.

For completeness we also mention `devnet`. This isn't "one" network, but how developers refer to ephemeral local networks used for testing. It is the same as `testnet`, but for local development. [Learn more](../../build/clarinet/local-blockchain-development.md).

## Setting the network

Most Stacks.js functions accept a `network` parameter or an optional last argument.

The `network` type is a string, and can be one of:

* `'mainnet'` (default)
* `'testnet'`
* `'devnet'`
* `'mocknet'` (alias of `devnet`)

### Examples

Network in transaction signing:

{% code title="transaction.ts" %}
```ts
const tx = makeSTXTokenTransfer({
  // ...
  network: 'testnet',
});
```
{% endcode %}

Network in address derivation:

{% code title="address.ts" %}
```ts
const address = privateKeyToAddress(privateKey, 'devnet');
// ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP
```
{% endcode %}

{% hint style="info" %}
For more advanced workflows, pass a custom network configuration object. See the `@stacks/network` package for details.
{% endhint %}
