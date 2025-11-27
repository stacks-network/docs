---
description: >-
  Complete reference for Rendezvous CLI commands, configuration options, and
  advanced usage.
---

# Rendezvous Reference

This reference explains how to use Rendezvous in different situations. By the end, you'll know when and how to use its features effectively.

## What's Inside

[Running Rendezvous](#running-rendezvous)
  - [Positional Arguments](#positional-arguments)
  - [Options](#options)
  - [Summary](#summary)

[Understanding Rendezvous](#understanding-rendezvous)
  - [Example](#example)

[The Rendezvous Context](#the-rendezvous-context)
  - [How the Context Works](#how-the-context-works)
  - [Using the context to write invariants](#using-the-context-to-write-invariants)

[Discarding Property-Based Tests](#discarding-property-based-tests)
  - [Discard Function](#discard-function)
  - [In-Place Discarding](#in-place-discarding)
  - [Discarding summary](#discarding-summary)

[Custom Manifest Files](#custom-manifest-files)
  - [Why use a custom manifest?](#why-use-a-custom-manifest)
  - [A test double for `sbtc-registry`](#a-test-double-for-sbtc-registry)
  - [A Custom Manifest File](#a-custom-manifest-file)
  - [How It Works](#how-it-works)

[Trait Reference Parameters](#trait-reference-parameters)
  - [How Trait Reference Selection Works](#how-trait-reference-selection-works)
  - [Example](#example-1)
  - [Adding More Implementations](#adding-more-implementations)

---

## Running Rendezvous

To run Rendezvous, use the following command:

```bash
rv <path-to-clarinet-project> <contract-name> <type> [--seed] [--runs] [--bail] [--dial]
```

Let's break down each part of the command.

### Positional Arguments

Consider this example Clarinet project structure:

```
root
├── Clarinet.toml
├── contracts
│   ├── contract.clar
│   ├── contract.tests.clar
└── settings
    └── Devnet.toml
```

**1. Path to the Clarinet Project**

The `<path-to-clarinet-project>` is the relative or absolute path to the root directory of the Clarinet project. This is where the `Clarinet.toml` file exists. **It is not the path to the `Clarinet.toml` file itself**.

For example, if you're in the parent directory of `root`, the correct relative path would be:

```bash
rv ./root <contract-name> <type>
```

**2. Contract Name**

The `<contract-name>` is the name of the contract to be tested, as defined in `Clarinet.toml`.

For example, if `Clarinet.toml` contains:

```toml
[contracts.contract]
path = "contracts/contract.clar"
```

To test the contract named `contract`, you would run:

```bash
rv ./root contract <type>
```

**3. Testing Type**

The `<type>` argument specifies the testing technique to use. The available options are:

- `test` – Runs property-based tests.
- `invariant` – Runs invariant tests.

For a deeper understanding of these techniques and when to use each, see [Testing Methodologies](https://stacks-network.github.io/rendezvous/chapter_4.md) chapter of the [Rendezvous Docs](https://stacks-network.github.io/rendezvous/).

**Running property-based tests**

To run property-based tests for the `contract` contract, ensure that your test functions are defined in:

```
./root/contracts/contract.tests.clar
```

Then, execute:

```bash
rv ./root contract test
```

This tells Rendezvous to:

- Load the **Clarinet project** located in `./root`.
- Target the **contract** named `contract` as defined in `Clarinet.toml` by executing **property-based tests** defined in `contract.tests.clar`.

**Running invariant tests**

To run invariant tests for the `contract` contract, ensure that your invariant functions are defined in:

```
./root/contracts/contract.tests.clar
```

To run invariant tests, use:

```bash
rv ./root contract invariant
```

With this command, Rendezvous will:

- Randomly **execute public function calls** in the `contract` contract.
- **Randomly check the defined invariants** to ensure the contract's internal state remains valid.

If an invariant check fails, it means the contract's state has **deviated from expected behavior**, revealing potential bugs.

### Options

Rendezvous also provides additional options to customize test execution:

**1. Customizing the Number of Runs**

By default, Rendezvous runs **100** test iterations. You can modify this using the `--runs` option:

```bash
rv root contract test --runs=500
```

This increases the number of test cases to **500**.

**2. Replaying a Specific Sequence of Events**

To reproduce a previous test sequence, you can use the `--seed` option. This ensures that the same random values are used across test runs:

```bash
rv root contract test --seed=12345
```

**How to Find the Replay Seed**

When Rendezvous detects an issue, it includes the seed needed to reproduce the test in the failure report. Here’s an example of a failure report with the seed:

```
Error: Property failed after 2 tests.
Seed : 426141810

Counterexample:
...

What happened? Rendezvous went on a rampage and found a weak spot:
...
```

In this case, the seed is `426141810`. You can use it to rerun the exact same test scenario:

```bash
rv root contract test --seed=426141810
```

**3. Stop After First Failure**

By default, Rendezvous will start the shrinking process after finding a failure. To stop immediately when the first failure is detected, use the `--bail` option:

```bash
rv root contract test --bail
```

This is useful when you want to examine the first failure without waiting for the complete test run and shrinking process to finish.

**4. Using Dialers**

Dialers allow you to define **pre- and post-execution functions** using JavaScript **during invariant testing**. To use a custom dialer file, run:

```bash
rv root contract invariant --dial=./custom-dialer.js
```

A good example of a dialer can be found in the Rendezvous repository, within the example Clarinet project, inside the [sip010.js file](https://github.com/stacks-network/rendezvous/blob/272b9247cdfcd5d12da89254e622e712d6e29e5e/example/sip010.js).

In that file, you’ll find a **post-dialer** designed as a **sanity check** for SIP-010 token contracts. It ensures that the `transfer` function correctly emits the required **print event** containing the `memo`, as specified in [SIP-010](https://github.com/stacksgov/sips/blob/6ea251726353bd1ad1852aabe3d6cf1ebfe02830/sips/sip-010/sip-010-fungible-token-standard.md?plain=1#L69).

**How Dialers Work**

During **invariant testing**, Rendezvous picks up dialers when executing public function calls:

- **Pre-dialers** run **before** each public function call.
- **Post-dialers** run **after** each public function call.

Both have access to an object containing:

- `selectedFunction` – The function being executed.
- `functionCall` – The result of the function call (`undefined` for **pre-dialers**).
- `clarityValueArguments` – The generated Clarity values used as arguments.

**Example: Post-Dialer for SIP-010**

Below is a **post-dialer** that verifies SIP-010 compliance by ensuring that the `transfer` function emits a print event containing the `memo`.

```js
async function postTransferSip010PrintEvent(context) {
  const { selectedFunction, functionCall, clarityValueArguments } = context;

  // Ensure this check runs only for the "transfer" function.
  if (selectedFunction.name !== "transfer") return;

  const functionCallEvents = functionCall.events;
  const memoParameterIndex = 3; // The memo parameter is the fourth argument.

  const memoGeneratedArgumentCV = clarityValueArguments[memoParameterIndex];

  // If the memo argument is `none`, there's nothing to validate.
  if (memoGeneratedArgumentCV.type === "none") return;

  // Ensure the memo argument is an option (`some`).
  if (memoGeneratedArgumentCV.type !== "some") {
    throw new Error("The memo argument must be an option type!");
  }

  // Convert the `some` value to hex for comparison.
  const hexMemoArgumentValue = cvToHex(memoGeneratedArgumentCV.value);

  // Find the print event in the function call events.
  const sip010PrintEvent = functionCallEvents.find(
    (ev) => ev.event === "print_event"
  );

  if (!sip010PrintEvent) {
    throw new Error(
      "No print event found. The transfer function must emit the SIP-010 print event containing the memo!"
    );
  }

  const sip010PrintEventValue = sip010PrintEvent.data.raw_value;

  // Validate that the emitted print event matches the memo argument.
  if (sip010PrintEventValue !== hexMemoArgumentValue) {
    throw new Error(
      `Print event memo value does not match the memo argument: ${hexMemoArgumentValue} !== ${sip010PrintEventValue}`
    );
  }
}
```

This dialer ensures that any SIP-010 token contract properly emits the **memo print event** during transfers, helping to catch deviations from the standard.

### Summary

| Argument/Option              | Description                                                                      | Example                                           |
| ---------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| `<path-to-clarinet-project>` | Path to the Clarinet project (where `Clarinet.toml` is located).                 | `rv root contract test`                           |
| `<contract-name>`            | Name of the contract to test (as in `Clarinet.toml`).                            | `rv root contract test`                           |
| `<type>`                     | Type of test (`test` for property-based tests, `invariant` for invariant tests). | `rv root contract test`                           |
| `--runs=<num>`               | Sets the number of test iterations (default: 100).                               | `rv root contract test --runs=500`                |
| `--seed=<num>`               | Uses a specific seed for reproducibility.                                        | `rv root contract test --seed=12345`              |
| `--dial=<file>`              | Loads JavaScript dialers from a file for pre/post-processing.                    | `rv root contract test --dial=./custom-dialer.js` |

---

## Understanding Rendezvous

Rendezvous makes **property-based tests** and **invariant tests** first-class. Tests are written in the same language as the system under test. This helps developers master the contract language. It also pushes boundaries—programmers shape their thoughts first, then express them using the language's tools.

When Rendezvous initializes a **Simnet session** using a given Clarinet project, it **does not modify any contract** listed in Clarinet.toml—except for the **target contract**. During testing, Rendezvous updates the target contract by merging:

1. **The original contract source code**
2. **The test contract** (which includes property-based tests and invariants)
3. **The Rendezvous context**, which helps track function calls and execution details

### Example

Let’s say we have a contract named `checker` with the following source:

```clarity
;; checker.clar

(define-public (check-it (flag bool))
  (if flag (ok 1) (err u100))
)
```

And its test contract, `checker.tests`:

```clarity
;; checker.tests.clar

(define-public (test-1)
  (ok true)
)

(define-read-only (invariant-1)
  true
)
```

When Rendezvous runs the tests, it **automatically generates a modified contract** that includes the original contract, the tests, and an additional **context** for tracking execution. The final contract source deployed in the Simnet session will look like this:

```
(define-public (check-it (flag bool))
  (if flag (ok 1) (err u100))
)

(define-map context (string-ascii 100) {
    called: uint
    ;; other data
  }
)

(define-public (update-context (function-name (string-ascii 100)) (called uint))
  (ok (map-set context function-name {called: called}))
)

(define-public (test-1)
  (ok true)
)

(define-read-only (invariant-1)
  true
)
```

While the original contract source and test functions are familiar, the **context** is new. Let's take a closer look at it.

## The Rendezvous Context

Rendezvous introduces a **context** to track function calls and execution details during testing. This allows for better tracking of execution details and invariant validation.

### How the Context Works

When a function is successfully executed during a test, Rendezvous records its execution details in a **Clarity map**. This map helps track how often specific functions are called successfully and can be extended for additional tracking in the future.

Here’s how the context is structured:

```clarity
(define-map context (string-ascii 100) {
    called: uint
    ;; Additional fields can be added here
})

(define-public (update-context (function-name (string-ascii 100)) (called uint))
  (ok (map-set context function-name {called: called}))
)
```

**Breaking it down**

- **`context` map** → Keeps track of execution data, storing how many times each function has been called successfully.
- **`update-context` function** → Updates the `context` map whenever a function executes, ensuring accurate tracking.

### Using the context to write invariants

By tracking function calls, the context helps invariants ensure **stronger correctness guarantees**. For example, an invariant can verify that a counter **stays above zero by checking the number of successful `increment` and `decrement` calls**.

**Example invariant using the `context`**

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

By embedding execution tracking into the contract, Rendezvous enables **more effective smart contract testing**, making it easier to catch bugs and check the contract correctness.

## Discarding Property-Based Tests

Rendezvous generates a wide range of inputs, but not all inputs are valid for every test. To **skip tests with invalid inputs**, there are two approaches:

### Discard Function

A **separate function** determines whether a test should run.

> Rules for a Discard Function:
>
> - Must be **read-only**.
> - Name must match the property test function, prefixed with `"can-"`.
> - Parameters must **mirror** the property test’s parameters.
> - Must return `true` **only if inputs are valid**, allowing the test to run.

**Discard function example**

```clarity
(define-read-only (can-test-add (n uint))
  (> n u1)  ;; Only allow tests where n > 1
)

(define-public (test-add (n uint))
  (let
    ((counter-before (get-counter)))
    (try! (add n))
    (asserts! (is-eq (get-counter) (+ counter-before n)) (err u403))
    (ok true)
  )
)
```

Here, `can-test-add` ensures that the test **never executes** for `n <= 1`.

### In-Place Discarding

Instead of using a separate function, **the test itself decides whether to run**. If the inputs are invalid, the test returns `(ok false)`, discarding itself.

**In-place discarding example**

```clarity
(define-public (test-add (n uint))
  (let
    ((counter-before (get-counter)))
    (ok
      (if
        (<= n u1)  ;; If n <= 1, discard the test.
        false
        (begin
          (try! (add n))
          (asserts! (is-eq (get-counter) (+ counter-before n)) (err u403))
          true
        )
      )
    )
  )
)
```

In this case, if `n <= 1`, the test **discards itself** by returning `(ok false)`, skipping execution.

### Discarding summary

| **Discard Mechanism**   | **When to Use**                                                   |
| ----------------------- | ----------------------------------------------------------------- |
| **Discard Function**    | When skipping execution **before** running the test is necessary. |
| **In-Place Discarding** | When discarding logic is simple and part of the test itself.      |

In general, **in-place discarding is preferred** because it keeps test logic together and is easier to maintain. Use a **discard function** only when it's important to prevent execution entirely.

## Custom Manifest Files

Some smart contracts need a special `Clarinet.toml` file to allow Rendezvous to create state transitions in the contract. Rendezvous supports this feature by **automatically searching for `Clarinet-<target-contract-name>.toml` first**. This allows you to use test doubles while keeping tests easy to manage.

### Why use a custom manifest?

A great example is the **sBTC contract suite**.

For testing the [`sbtc-token`](https://github.com/stacks-network/sbtc/blob/b624e4a8f08eb589a435719b200873e8aa5b3305/contracts/contracts/sbtc-token.clar#L30-L35) contract, the `sbtc-registry` authorization function [`is-protocol-caller`](https://github.com/stacks-network/sbtc/blob/b624e4a8f08eb589a435719b200873e8aa5b3305/contracts/contracts/sbtc-registry.clar#L361-L369) is **too restrictive**. Normally, it only allows calls from protocol contracts, making it **impossible to directly test certain state transitions** in `sbtc-token`.

To work around this, you need two things:

### A test double for `sbtc-registry`

You can create an `sbtc-registry` test double called `sbtc-registry-double.clar`:

```clarity
;; contracts/sbtc-registry-double.clar

...

(define-constant deployer tx-sender)

;; Allows the deployer to act as a protocol contract for testing
(define-read-only (is-protocol-caller (contract-flag (buff 1)) (contract principal))
  (begin
    (asserts! (is-eq tx-sender deployer) (err u1234567))  ;; Enforces deployer check
    (ok true)
  )
)

...
```

This **loosens** the restriction just enough for testing by allowing the `deployer` to act as a protocol caller, while still enforcing an access check.

### A Custom Manifest File

Next, create `Clarinet-sbtc-token.toml` to tell Rendezvous to use the test double **only when targeting `sbtc-token`**:

```toml
# Clarinet-sbtc-token.toml

...

[contracts.sbtc-registry]
path = 'contracts/sbtc-registry-double.clar'
clarity_version = 3
epoch = 3.0

...
```

### How It Works

- When testing `sbtc-token`, Rendezvous **first checks** if `Clarinet-sbtc-token.toml` exists.
- If found, it **uses this file** to initialize Simnet.
- If not, it **falls back** to the standard `Clarinet.toml`.

This ensures that the test double is only used when testing `sbtc-token`, keeping tests realistic while allowing necessary state transitions.

## Trait Reference Parameters

Rendezvous automatically generates arguments for function calls. It handles most Clarity types without any setup from you. However, **trait references** require special handling since Rendezvous cannot generate them automatically.

### How Trait Reference Selection Works

When your functions accept trait reference parameters, you must include at least one trait implementation in your Clarinet project. This can be either a project contract or a requirement.

Here's how Rendezvous handles trait references:

1. **Project Scanning** – Before testing begins, Rendezvous scans your project for functions that use trait references.
2. **Implementation Discovery** – It searches the contract AST for matching trait implementations and adds them to a selection pool.
3. **Random Selection** – During test execution, Rendezvous randomly picks an implementation from the pool and uses it as a function argument.

This process allows Rendezvous to create meaningful state transitions and validate your invariants or property-based tests.

### Example

The `example` Clarinet project demonstrates this feature. The [send-tokens](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/send-tokens.clar) contract contains [one public function](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/send-tokens.clar#L3-L7) and [one property-based test](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/send-tokens.tests.clar#L24-L47) that both accept trait references.

To enable testing, the project includes [rendezvous-token](https://github.com/stacks-network/rendezvous/blob/9c02aa7c2571b3795debc657bd433fd9bf7f19eb/example/contracts/rendezvous-token.clar), which implements the required trait.

### Adding More Implementations

You can include multiple eligible trait implementations in your project. Adding more implementations allows Rendezvous to introduce greater randomness during testing and increases behavioral diversity. If a function that accepts a trait implementation parameter is called X times, those calls are distributed across the available implementations. As the number of implementations grows, Rendezvous has more options to choose from on each call, producing a wider range of behaviors — and uncovering edge cases that may be missed when relying on a single implementation.
