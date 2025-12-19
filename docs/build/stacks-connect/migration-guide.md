# Migration Guide

For a while now, the Stacks community has been working on a new standard for wallet-to-dapp communication. Stacks Connect and related projects now use standards like [WBIPs](https://wbips.netlify.app/) and [SIP-030](https://github.com/janniks/sips/blob/main/sips/sip-030/sip-030-wallet-interface.md) to allow wallets to communicate with dapps in a more simplified and flexible way.

{% hint style="info" %}
Migration status\
Feel free to continue using Stacks Connect `7.x.x` while things stabilize. The `7.x.x` version may still be better supported by some wallets.

Legacy installs:

```bash
npm install @stacks/connect@7.10.1
```
{% endhint %}

## Deprecations

The following classes, methods, and types are deprecated in favor of the new `request` RPC methods:

* `show...` and `open...` methods
* `authenticate` method
* `UserSession` class and related functionality
* `AppConfig` class
* `SessionOptions` interface
* `SessionData` interface
* `UserData` interface
* `SessionDataStore` class
* `InstanceDataStore` class
* `LocalStorageStore` class

{% hint style="info" %}
Backwards compatibility\
`UserSession` and `AppConfig` remain available in `8.x.x` for caching addresses via `loadUserData`, but consider them temporary helpers while you migrate.
{% endhint %}

## Migration steps

{% stepper %}
{% step %}
#### Update your @stacks/connect version

```bash
npm install @stacks/connect@latest
```
{% endstep %}

{% step %}
#### Replace legacy methods with `request`

Switch from `showXyz`, `openXyz`, and `doXyz` helpers to the generic `request(method, params)` API. The `request` function is async, so replace `onFinish`/`onCancel` callbacks with `await` or `.then().catch()` chains.

Examples:

* `showConnect()`, `authenticate()` → `connect()`
* `useConnect().doContractCall({})` → `request('stx_callContract', {})`
* `openContractDeploy()` → `request('stx_deployContract', {})`
{% endstep %}

{% step %}
#### Use `connect` instead of `showConnect` / `authenticate`

`connect()` is an alias for `request('getAddresses', { forceWalletSelect: true })` and caches the selected address in local storage by default.
{% endstep %}

{% step %}
#### Update authentication state management

* Replace `UserSession.isSignedIn()` with `isConnected()`
* Replace `UserSession.signUserOut()` with `disconnect()`
{% endstep %}

{% step %}
#### Remove legacy code

* Delete references to deprecated helpers (`AppConfig`, `UserSession`, etc.)
* Remove the `@stacks/connect-react` package
  * Manually reload components if you rely on local storage updates
  * Hooks are no longer required for Stacks Connect
* A new `@stacks/react` package is in development to simplify state tracking (transaction status, network changes, and more)
{% endstep %}
{% endstepper %}

## Address Access

Previously, the `UserSession` class was used to access the user's addresses and data, which abstracted away the underlying implementation details. Now, the `request` method is used to directly interact with the wallet, giving developers more explicit control and clarity over what's happening under the hood. This manual approach makes the wallet interaction more transparent and customizable. Developers can manually manage the currently connected user's address in e.g. local storage, jotai, etc. or use the `connect()`/`request()` method to cache the address in local storage.

{% hint style="warning" %}
Security note\
`8.x.x` wallets return only the current network's address (previous versions returned both mainnet and testnet).
{% endhint %}
