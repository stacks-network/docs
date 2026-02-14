# Networks

Typically, we speak of `mainnet` and `testnet` as the networks of Stacks. Most wallets are configured to `mainnet` by default—this is the production environment, the actual network that holds real STX tokens.

As the name suggests, `testnet` is a public network for testing. It's a separate network state that holds test tokens, which have no value.

For completeness we also mention `devnet`. This isn't "one" network, but how developers refer to ephemeral local networks used for testing via Clarinet. It is the same as `testnet`, but for local development.

## Setting the network

Most Stacks.js functions accept a `network` parameter as a `string` or an optional last argument.

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

***

## Network API Endpoints

Each network has its own set of API endpoints:

| Network | API Base URL | Explorer |
| ------- | ------------ | -------- |
| Mainnet | `https://api.hiro.so` | [explorer.hiro.so](https://explorer.hiro.so/) |
| Testnet | `https://api.testnet.hiro.so` | [explorer.hiro.so/?chain=testnet](https://explorer.hiro.so/?chain=testnet) |
| Devnet | `http://localhost:3999` | Local Clarinet explorer |

{% hint style="warning" %}
**Rate Limits**: Public API endpoints have rate limits. For production applications, consider using [Hiro Platform](https://www.hiro.so/platform) for higher limits and API key management.
{% endhint %}
