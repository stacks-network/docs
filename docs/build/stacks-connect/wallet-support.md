# Wallet Support

## Wallet Support

This page lists the wallet methods defined by SIP-030 and the WBIP standards, whether `@stacks/connect` implements each one, and where each wallet documents its own support. Wallet support changes with wallet releases, so this page links to each wallet's own method documentation rather than restating it.

A wallet is listed when `@stacks/connect` offers it in its wallet selector. WalletConnect, which the selector also offers, is a connection protocol rather than a wallet and is not listed.

### Method Compatibility

The `@stacks/connect` column reflects [`@stacks/connect` v8.2.7](https://github.com/stx-labs/connect/blob/v8.2.7/packages/connect/src/methods.ts). "No public doc" marks a method the wallet has not documented; check the wallet's own docs for current support.

| Method                      | Defined by | `@stacks/connect` | Leather                                                                                | Xverse                                                                                | Asigna        | Fordefi       |
| --------------------------- | ---------- | ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------- | ------------- |
| `getAddresses`              | WBIP       | Implemented       | [Docs](https://leather.gitbook.io/developers/methods/getaddresses)                     | [Docs](https://docs.xverse.app/sats-connect/bitcoin-methods/getaddresses)             | No public doc | No public doc |
| `sendTransfer`              | WBIP       | Implemented       | [Docs](https://leather.gitbook.io/developers/bitcoin-methods/sendtransfer)             | [Docs](https://docs.xverse.app/sats-connect/bitcoin-methods/sendtransfer)             | No public doc | No public doc |
| `signPsbt`                  | WBIP       | Implemented       | [Docs](https://leather.gitbook.io/developers/bitcoin-methods/signpsbt)                 | [Docs](https://docs.xverse.app/sats-connect/bitcoin-methods/signpsbt)                 | No public doc | No public doc |
| `stx_getAddresses`          | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_getaddresses)          | No public doc                                                                         | No public doc | No public doc |
| `stx_getAccounts`           | SIP-030    | Implemented       | No public doc                                                                          | [Docs](https://docs.xverse.app/sats-connect/stacks-methods/stx_getaccounts)           | No public doc | No public doc |
| `stx_getNetworks`           | SIP-030    | Not implemented   | No public doc                                                                          | No public doc                                                                         | No public doc | No public doc |
| `stx_transferStx`           | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_transferstx)           | [Docs](https://docs.xverse.app/sats-connect/stacks-methods/stx_transferstx)           | No public doc | No public doc |
| `stx_transferSip10Ft`       | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_transfersip10ft)       | No public doc                                                                         | No public doc | No public doc |
| `stx_transferSip9Nft`       | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_transfersip9nft)       | No public doc                                                                         | No public doc | No public doc |
| `stx_callContract`          | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_callcontract)          | [Docs](https://docs.xverse.app/sats-connect/stacks-methods/stx_callcontract)          | No public doc | No public doc |
| `stx_deployContract`        | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_deploycontract)        | [Docs](https://docs.xverse.app/sats-connect/stacks-methods/stx_deploycontract)        | No public doc | No public doc |
| `stx_signTransaction`       | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_signtransaction)       | [Docs](https://docs.xverse.app/sats-connect/stacks-methods/stx_signtransaction)       | No public doc | No public doc |
| `stx_signMessage`           | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_signmessage)           | [Docs](https://docs.xverse.app/sats-connect/stacks-methods/stx_signmessage)           | No public doc | No public doc |
| `stx_signStructuredMessage` | SIP-030    | Implemented       | [Docs](https://leather.gitbook.io/developers/stacks-methods/stx_signstructuredmessage) | [Docs](https://docs.xverse.app/sats-connect/stacks-methods/stx_signstructuredmessage) | No public doc | No public doc |
| `stx_updateProfile`         | SIP-030    | Implemented       | No public doc                                                                          | No public doc                                                                         | No public doc | No public doc |

### Event Compatibility

| Event               | Defined by | `@stacks/connect`   | Leather       | Xverse        | Asigna        | Fordefi       |
| ------------------- | ---------- | ------------------- | ------------- | ------------- | ------------- | ------------- |
| `stx_accountChange` | SIP-030    | No listener support | No public doc | No public doc | No public doc | No public doc |
| `stx_networkChange` | SIP-030    | No listener support | No public doc | No public doc | No public doc | No public doc |

Apps reach these events only through a wallet's own provider object. See [Wallet Implementation](wallet-implementation.md).

### Compatibility Layer

The `request` method in `@stacks/connect` rewrites some requests so each wallet receives the shape it expects. Overrides are on by default (`enableOverrides`). Checked against [`request.ts` in v8.2.7](https://github.com/stx-labs/connect/blob/v8.2.7/packages/connect/src/request.ts).

`@stacks/connect` detects Fordefi and applies Xverse's overrides to it. If Fordefi's behaviour diverges from Xverse's, these overrides can break its requests.

* 🔵 Has compatibility overrides that maintain functionality
* 🟡 Has breaking overrides that may lose some information

| Method             | Status | Notes                                                                                                                                                                                                                                                                         |
| ------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getAddresses`     | 🔵     | Sent as `wallet_connect` to Xverse and Fordefi                                                                                                                                                                                                                                |
| `stx_getAddresses` | 🔵     | Sent as `wallet_connect` to Xverse and Fordefi                                                                                                                                                                                                                                |
| `sendTransfer`     | 🟡     | `amount` is sent as a number to Xverse and Fordefi and as a string to Leather. `network` is not sent to Xverse or Fordefi                                                                                                                                                     |
| `signPsbt`         | 🟡     | Leather: the PSBT is sent as hex and `signInputs` is reduced to input indexes; a hex result is returned as a base64 `psbt`. Xverse and Fordefi: `signInputs` is regrouped by address, entries without an address are dropped, and `network` and `allowedSighash` are not sent |
| `stx_signMessage`  | 🟡     | `publicKey` is removed for every wallet except Xverse and Fordefi                                                                                                                                                                                                             |
| Every method       | 🔵     | Clarity values and post-condition objects are serialized to hex, and bigints to strings                                                                                                                                                                                       |
