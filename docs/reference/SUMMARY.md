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
