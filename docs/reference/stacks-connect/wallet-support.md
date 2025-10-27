# Wallet Support

{% hint style="info" %}
Legend:

* 🔴 No support (yet)
* 🟡 Partial support
* 🟢 Supported
* 🔵 Compatibility overrides present (may transform/normalize behavior)
{% endhint %}

## Wallet Support

This page provides detailed information about which methods and events are supported by different wallet providers in the Stacks ecosystem.

### Method Compatibility

| Method                      | Leather                                 | Xverse-like                                                         |
| --------------------------- | --------------------------------------- | ------------------------------------------------------------------- |
| `getAddresses`              | 🟡 No support for experimental purposes | 🟡 Use `wallet_connect` instead                                     |
| `sendTransfer`              | 🟡 Expects `amount` as string           | 🟡 Expects `amount` as number                                       |
| `signPsbt`                  | 🟡 Uses signing index array only        | 🟡 Uses `signInputs` record instead of array                        |
| `stx_getAddresses`          | 🟢                                      | 🔴                                                                  |
| `stx_getAccounts`           | 🔴                                      | 🟢                                                                  |
| `stx_getNetworks`           | 🔴                                      | 🔴                                                                  |
| `stx_transferStx`           | 🟢                                      | 🟢                                                                  |
| `stx_transferSip10Ft`       | 🟢                                      | 🔴                                                                  |
| `stx_transferSip9Nft`       | 🟢                                      | 🔴                                                                  |
| `stx_callContract`          | 🟡 Hex-encoded Clarity values only      | 🟡 Hex-encoded Clarity values only, no support for `postConditions` |
| `stx_deployContract`        | 🟡 Hex-encoded Clarity values only      | 🟡 Hex-encoded Clarity values only, no support for `postConditions` |
| `stx_signTransaction`       | 🟡 Hex-encoded Clarity values only      | 🟡 Hex-encoded Clarity values only                                  |
| `stx_signMessage`           | 🟡 Hex-encoded Clarity values only      | 🟡 Hex-encoded Clarity values only                                  |
| `stx_signStructuredMessage` | 🟡 Hex-encoded Clarity values only      | 🟡 Hex-encoded Clarity values only                                  |
| `stx_updateProfile`         | 🔴                                      | 🔴                                                                  |

### Event Compatibility

| Event               | Leather | Xverse |
| ------------------- | ------- | ------ |
| `stx_accountChange` | 🔴      | 🔴     |
| `stx_networkChange` | 🔴      | 🔴     |

### Compatibility Layer

The `request` method in `@stacks/connect` adds a layer of auto-compatibility for different wallet providers. This helps unify the interface where wallet providers may implement methods and results differently.

* 🟢 No overrides needed for any wallet
* 🔵 Has compatibility overrides that maintain functionality
* 🟡 Has breaking overrides that may lose some information

| Method                      | Status | Notes                                                                                     |
| --------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `getAddresses`              | 🔵     | Maps to `wallet_connect` for Xverse-like wallets                                          |
| `sendTransfer`              | 🔵     | Converts `amount` to number for Xverse, string for Leather                                |
| `signPsbt`                  | 🟡     | Transforms PSBT format for Leather (base64 to hex) with lossy restructure of `signInputs` |
| `stx_getAddresses`          | 🔵     | Maps to `wallet_connect` for Xverse-like wallets                                          |
| `stx_callContract`          | 🔵     | Transforms Clarity values to hex-encoded format for compatibility                         |
| `stx_deployContract`        | 🔵     | Transforms Clarity values to hex-encoded format for compatibility                         |
| `stx_signTransaction`       | 🔵     | Transforms Clarity values to hex-encoded format for compatibility                         |
| `stx_signMessage`           | 🔵     | Transforms Clarity values to hex-encoded format for compatibility                         |
| `stx_signStructuredMessage` | 🔵     | Transforms Clarity values to hex-encoded format for compatibility                         |
