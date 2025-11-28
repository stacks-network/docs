---
description: >-
  Rendezvous is a fuzzer for Clarity smart contracts that finds vulnerabilities
  through stateful, randomized testing, all in Clarity.
---

# Overview

{% hint style="danger" %}
Smart contracts on Stacks are immutable. Bugs are forever. Test early. Test often. Fuzzing finds edge cases that unit tests often miss.
{% endhint %}

## What is Fuzz Testing?

Fuzzing hits your code with random inputs. It helps uncover unexpected behavior and subtle bugs. Unlike unit tests, it explores paths you didn't think of.

## What is Rendezvous?

Rendezvous (`rv`) is a Clarity fuzzer. It supports:

### Property-Based Testing

You extract properties about your smart contract using Clarity. Rendezvous checks them multiple times with random inputs, in a stateful manner (the smart contract's state is not refreshed during the run).

**What is a property?**

A property is a universal truth about your smart contract's state, functions, etc.

**How to extract a property?**

Say that your smart contract has a function that reverses a list of `uint`s. In this case, one property can be that "reversing a list twice returns the original list". The property will look like this:

```clarity
(define-public (test-reverse-list (seq (list 127 uint)))
  (begin
    (asserts!
      (is-eq seq
        (reverse-uint
          (reverse-uint seq)
        )
      )
      (err u999)
    )
    (ok true)
  )
)
```

**Making your property valid for Rendezvous**

> For a property to be cosidered valid by Rendezvous, it has to comply with the following rules:
>
> * Function name starts with `test-`
> * Function is declared as `public`
> * Test passes when it returns `(ok true)`
> * Test would be discarded if it returned `(ok false)`
> * Test fails if it returns an error or throws an exception

***

### Invariant Testing

You define read-only conditions in Clarity that must always hold true. Rendezvous attempts to create state transitions in your smart contract and continuously checks the conditions you defined to hold.

**What is an invariant?**

An invariant is a general truth regarding your smart contract's internal state. It will not be able to mutate the state, its role being solely to check the integrity of the state.

**How to extract an invariant?**

Say that you have a counter contract, having functions to `increment` and `decrement`. In this case, you could use the Rendezvous [`context`](https://stacks-network.github.io/rendezvous/chapter_6.html?#the-rendezvous-context) to extract an invariant regarding your smart contract's internal state:

```clarity
(define-read-only (invariant-counter-gt-zero)
  (let
    (
      (increment-num-calls
        (default-to u0 (get called (map-get? context "increment")))
      )
      (decrement-num-calls
        (default-to u0 (get called (map-get? context "decrement")))
      )
    )
    (if
      (<= increment-num-calls decrement-num-calls)
      true
      (> (var-get counter) u0)
    )
  )
)
```

**Making your invariant valid for Rendezvous**

> For an invariant to be cosidered valid by Rendezvous, it has to complain to the following ruleset:
>
> * Function name starts with invariant-
> * Function is declared as read-only (not public)
> * Function returns a boolean value (true if the invariant holds, false if violated)
> * The test can use the special context map to access execution history

## Why Test in Clarity?

{% stepper %}
{% step %}
#### Same constraints as production

Tests operate under the exact same constraints as production code.
{% endstep %}

{% step %}
#### Better understanding of Clarity

Writing tests in Clarity improves your familiarity with the language and its semantics.
{% endstep %}

{% step %}
#### No need to expose internals

You don't have to expose internal functions as public solely for testing.
{% endstep %}

{% step %}
#### Fewer tools to manage

Running tests in Clarity reduces the number of external tools and integrations you need to maintain.
{% endstep %}
{% endstepper %}

## Getting Started

Put tests next to contracts. Rendezvous will find them.

```
my-project/
├── Clarinet.toml
├── contracts/
│   ├── my-contract.clar       # Contract
│   ├── my-contract.tests.clar # Tests
└── settings/
    └── Devnet.toml
```

### Installation

To install Rendezvous as a dependency in your project, use `npm`:

```
npm install @stacks/rendezvous
```

This will add Rendezvous to your project's `node_modules` and update your `package.json`.

## Rendezvous Docs

See full docs at: [https://stacks-network.github.io/rendezvous](https://stacks-network.github.io/rendezvous/)
