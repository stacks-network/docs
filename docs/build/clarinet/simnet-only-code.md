---
description: Documentation and use cases for conditional code deployment with Clarinet
---

# Simnet-only code deployment

Clarinet 3.17.0 introduced conditional code deployment, letting you write Clarity expressions that Clarinet only deploys in Simnet and never on-chain.

## `;; #[env(simnet)]`

The preferred way to write unit tests for Clarity smart contracts is the Clarinet SDK and Vitest combo. The Clarinet SDK runs the Clarity VM in Node.js and simulates a fast blockchain environment, so Clarity developers can tap into the JS/TS ecosystem to test their contracts instead of reinventing a unit test framework for Clarity. For Stacks app builders, it also means using the same tools across their back-end, front-end, and on-chain logic.

One caveat of this approach is that it makes it hard to update and mock the state of smart contracts for testing. The `;; #[env(simnet)]` annotation mitigates this caveat.

With native support for Simnet-only code, Clarinet checks that the contract is valid both with and without the optional code.

## Use cases

Call a top-level expression only in Simnet when you need extra setup in your unit tests.

```clarity
(define-map admins principal bool)
(map-set admins tx-sender true)
;; #[env(simnet)]
;; add an extra admin for testing purposes
(map-insert admins 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 true)
```

Add a helper function that can interact directly with your smart contract state, such as a permissionless `test-mint` function. Prefer `private` functions when possible, since they can be called in Simnet.

```clarity
(define-fungible-token my-ft)
(define-map authorized-minter principal bool)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-some (map-get? authorized-minter tx-sender)) (err 500))
    (ok (ft-mint? my-ft amount recipient))
  )
)

;; #[env(simnet)]
(define-private (test-mint (amount uint) (recipient principal))
  (ft-mint? my-ft amount recipient)
)
```

It also opens the door to writing tests directly in your contract. Imagine a `test-add` function paired with a Vitest helper that finds and executes every private function starting with `test-`, asserting each result is `(ok true)`.

```clarity
(define-public (add (n uint))
  (ok (var-set count (+ (var-get count) n)))
)

;; test code, won't be deployed on mainnet
;; #[env(simnet)]
(define-private (test-add)
  (begin
    (asserts! (is-ok (add u2)) (err "add returned an error"))
    (asserts! (is-eq (var-get count) u2) (err "count is not u2"))
    (ok true)
  )
)
```

Check out how [Rendezvous](../rendezvous/overview.md) uses this feature to let developers write tests in Clarity.

{% hint style="info" %}
Simnet-only Clarity code can add noise to your contracts. If you can get the same result by calling a specific function in your test setup or hooks, that's often preferable.
{% endhint %}

## Considerations

This feature only works at the tooling level, in Clarinet. If you deploy a contract containing `;; #[env(simnet)]` with other tools, they won't strip the Simnet-only code.

## Related: Testnet vs Mainnet code

Smart contracts sometimes need to behave differently on testnet and mainnet. Simnet-only code deployment only covers Simnet vs "real-nets" (Devnet/Testnet/Mainnet). We may expand conditional deployments to more environments and conditions in the future, but we want to keep it simple for now.

If a smart contract needs different behavior on testnet vs mainnet, take a look at how the PoX contracts handle it (for example [pox-4](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet&tab=sourceCode)) using `is-in-mainnet`:

```clarity
;; Default length of the PoX registration window, in burnchain blocks.
(define-constant PREPARE_CYCLE_LENGTH (if is-in-mainnet u100 u50))

;; Default length of the PoX reward cycle, in burnchain blocks.
(define-constant REWARD_CYCLE_LENGTH (if is-in-mainnet u2100 u1050))
```
