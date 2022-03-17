---
title: Overview
description: Overview of the Clarity language constructs
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

export { convertClarityRefToMdx as getStaticProps } from '@common/data/clarity-ref' import { ClarityKeywordReference, ClarityFunctionReference } from '@components/clarity-ref'

## Clarity Type System

The Clarity language uses a strong static type system. Function arguments and database schemas require specified types, and use of types is checked during contract launch. The type system does _not_ have a universal super type.

## Public Functions

Functions specified via `define-public` statements are _public_ functions and these are the only types of functions which may be called directly through signed blockchain transactions. In addition to being callable directly from a transaction (see the Stacks wire formats for more details on Stacks transactions), public function may be called by other smart contracts.

Public functions _must_ return a `(response ...)` type. This is used by Clarity to determine whether or not to materialize any changes from the execution of the function. If a function returns an `(err ...)` type, and mutations on the blockchain state from executing the function (and any function that it called during execution) will be aborted.

In addition to function defined via `define-public`, contracts may expose read-only functions. These functions, defined via `define-read-only`, are callable by other smart contracts, and may be queryable via public blockchain explorers. These functions _may not_ mutate any blockchain state. Unlike normal public functions, read-only functions may return any type.

## Contract Calls

A smart contract may call functions from other smart contracts using a `(contract-call?)` function.

This function returns a response type result-- the return value of the called smart contract function.

We distinguish 2 different types of `contract-call?`:

### Static dispatch

The callee is a known, invariant contract available on-chain when the caller contract is deployed. In this case, the callee's principal is provided as the first argument, followed by the name of the method and its arguments:

```clarity
(contract-call?
    .registrar
    register-name
    name-to-register)
```

### Dynamic dispatch

The callee is passed as an argument, and typed as a trait reference (`<A>`).

```clarity
(define-public (swap (token-a <can-transfer-tokens>)
                     (amount-a uint)
                     (owner-a principal)
                     (token-b <can-transfer-tokens>)
                     (amount-b uint)
                     (owner-b principal)))
     (begin
         (unwrap! (contract-call? token-a transfer-from? owner-a owner-b amount-a))
         (unwrap! (contract-call? token-b transfer-from? owner-b owner-a amount-b))))
```

Traits can either be locally defined:

```clarity
(define-trait can-transfer-tokens (
    (transfer-from? (principal principal uint) (response uint)))
```

Or imported from an existing contract:

```clarity
(use-trait can-transfer-tokens
    .contract-defining-trait.can-transfer-tokens)
```

Looking at trait conformance, callee contracts have two different paths. They can either be "compatible" with a trait by defining methods matching some of the methods defined in a trait, or explicitely declare conformance using the `impl-trait` statement:

```clarity
(impl-trait .contract-defining-trait.can-transfer-tokens)
```

Explicit conformance should be prefered when adequate. It acts as a safeguard by helping the static analysis system to detect deviations in method signatures before contract deployment.

The following limitations are imposed on contract calls:

1. On static dispatches, callee smart contracts _must_ exist at the time of creation.
2. No cycles may exist in the call graph of a smart contract. This prevents recursion (and re-entrancy bugs). Such structures can be detected with static analysis of the call graph, and will be rejected by the network.
3. `contract-call?` are for inter-contract calls only. Attempts to execute when the caller is also the callee will abort the transaction.
