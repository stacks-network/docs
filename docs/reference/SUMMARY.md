# Table of contents

## Node Operations

* [Stacks Node Configuration](README.md)
* [Signer Configuration](node-operations/signer-configuration.md)
* [RPC API Endpoints](node-operations/rpc-api/README.md)
  * ```yaml
    type: builtin:openapi
    props:
      models: true
      downloadLink: false
    dependencies:
      spec:
        ref:
          kind: openapi
          spec: stacks-node-rpc-api-dereferenced-new
    ```

## Clarity

* [Functions](clarity/functions.md)
* [Keywords](clarity/keywords.md)
* [Types](clarity/types.md)

## Clarinet

* [CLI Reference](clarinet/cli-reference.md)

## Clarinet JS SDK

* [SDK Reference](clarinet-js-sdk/sdk-reference.md)
* [Browser SDK Reference](clarinet-js-sdk/browser-sdk-reference.md)

## Rendezvous

* [Rendezvous Reference](rendezvous/reference.md)

## Stacks.js

* [@stacks/network](stacks.js/stacks-network.md)
* [@stacks/connect](stacks.js/stacks-connect.md)
* [Stacks Connect](stacks.js/stacks-connect/README.md)
  * [Connection](stacks.js/stacks-connect/connection/README.md)
    * [connect](stacks.js/stacks-connect/connection/connect.md)
    * [disconnect](stacks.js/stacks-connect/connection/disconnect.md)
    * [isConnected](stacks.js/stacks-connect/connection/isConnected.md)
  * [Request](stacks.js/stacks-connect/request/README.md)
    * [request](stacks.js/stacks-connect/request/request.md)
    * [requestRaw](stacks.js/stacks-connect/request/requestRaw.md)
    * [ConnectRequestOptions](stacks.js/stacks-connect/request/ConnectRequestOptions.md)
  * [Methods](stacks.js/stacks-connect/methods/README.md)
    * [getAddresses](stacks.js/stacks-connect/methods/getAddresses.md)
    * [sendTransfer](stacks.js/stacks-connect/methods/sendTransfer.md)
    * [signPsbt](stacks.js/stacks-connect/methods/signPsbt.md)
    * [stx\_callContract](stacks.js/stacks-connect/methods/stx_callContract.md)
    * [stx\_deployContract](stacks.js/stacks-connect/methods/stx_deployContract.md)
    * [stx\_getAccounts](stacks.js/stacks-connect/methods/stx_getAccounts.md)
    * [stx\_getAddresses](stacks.js/stacks-connect/methods/stx_getAddresses.md)
    * [stx\_signMessage](stacks.js/stacks-connect/methods/stx_signMessage.md)
    * [stx\_signStructuredMessage](stacks.js/stacks-connect/methods/stx_signStructuredMessage.md)
    * [stx\_signTransaction](stacks.js/stacks-connect/methods/stx_signTransaction.md)
    * [stx\_transferSip10Ft](stacks.js/stacks-connect/methods/stx_transferSip10Ft.md)
    * [stx\_transferSip9Nft](stacks.js/stacks-connect/methods/stx_transferSip9Nft.md)
    * [stx\_transferStx](stacks.js/stacks-connect/methods/stx_transferStx.md)
    * [stx\_updateProfile](stacks.js/stacks-connect/methods/stx_updateProfile.md)
  * [Storage](stacks.js/stacks-connect/storage/README.md)
    * [getLocalStorage](stacks.js/stacks-connect/storage/getLocalStorage.md)
    * [clearLocalStorage](stacks.js/stacks-connect/storage/clearLocalStorage.md)
    * [StorageData](stacks.js/stacks-connect/storage/StorageData.md)
  * [Errors](stacks.js/stacks-connect/errors/README.md)
    * [JsonRpcError](stacks.js/stacks-connect/errors/JsonRpcError.md)
    * [JsonRpcErrorCode](stacks.js/stacks-connect/errors/JsonRpcErrorCode.md)
  * [Providers](stacks.js/stacks-connect/providers/README.md)
    * [DEFAULT\_PROVIDERS](stacks.js/stacks-connect/providers/DEFAULT_PROVIDERS.md)
* [@stacks/transactions](stacks.js/stacks-transactions.md)
* [sbtc](stacks.js/sbtc.md)

## Nakamoto Upgrade

* [Nakamoto Upgrade Start Here](nakamoto-upgrade/nakamoto-upgrade-start-here.md)
* [What is the Nakamoto Release?](nakamoto-upgrade/what-is-the-nakamoto-release.md)
* [Nakamoto in 10 Minutes](nakamoto-upgrade/nakamoto-in-10-minutes.md)
* [Nakamoto Rollout Plan](nakamoto-upgrade/nakamoto-rollout-plan/README.md)
  * [Nakamoto for Stackers](nakamoto-upgrade/nakamoto-rollout-plan/nakamoto-for-stackers.md)
  * [Nakamoto for Exchanges](nakamoto-upgrade/nakamoto-rollout-plan/nakamoto-for-exchanges.md)
  * [Nakamoto for Stacking Providers](nakamoto-upgrade/nakamoto-rollout-plan/nakamoto-for-stacking-providers.md)
  * [Nakamoto for App Developers](nakamoto-upgrade/nakamoto-rollout-plan/nakamoto-for-app-developers.md)
* [Nakamoto Activation Guide for Signers](nakamoto-upgrade/nakamoto-activation-guide-for-signers.md)
* [Setting Up a Primary Post Nakamoto Testnet Node](nakamoto-upgrade/setting-up-a-primary-post-nakamoto-testnet-node.md)
