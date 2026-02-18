---
description: >-
  In this guide, you'll build a simple counter smart contract and interact with
  it in a local environment.
---

# Quickstart

## What you'll learn

* Create a Clarity smart contract project
* Write Clarity code with maps and public functions
* Test and validate your contracts using Clarinet's console

## Prerequisites

* Clarinet installed on your machine. Follow the [installation guide](overview.md#installation) if needed.
* A code editor like VS Code for editing Clarity files.

{% stepper %}
{% step %}
#### Create your project

Let's start by creating a new Clarinet project. The `clarinet new` command sets up everything you need for smart contract development, including a testing framework, deployment configurations, and a local development environment:

```bash
clarinet new counter
```

Clarinet creates a complete project structure for you. Each folder serves a specific purpose in your development workflow:

```
- counter/
  - contracts/
  - settings/
    - Devnet.toml
    - Mainnet.toml
    - Testnet.toml
  - tests/
    - Clarinet.toml
    - package.json
    - vitest.config.js
```
{% endstep %}

{% step %}
#### Generate your contract

Now that we have our project structure, let's create a smart contract. Navigate into your project directory and use Clarinet's contract generator:

```bash
$ cd counter
$ clarinet contract new counter
Created file contracts/counter.clar
Created file tests/counter.test.ts
Updated Clarinet.toml with contract counter
```

Clarinet automatically creates both your contract file and a corresponding test file. This follows the best practice of writing tests alongside your contract code:

| File                     | Purpose                     |
| ------------------------ | --------------------------- |
| `contracts/counter.clar` | Your smart contract code    |
| `tests/counter.test.ts`  | Test file for your contract |

{% hint style="info" %}
Notice that Clarinet also updated your `Clarinet.toml` file. This configuration file tracks all contracts in your project and their deployment settings.
{% endhint %}
{% endstep %}

{% step %}
#### Write your contract code

Open `contracts/counter.clar` and replace its contents with our counter implementation. This contract will maintain a separate count for each user who interacts with it:

{% code title="contracts/counter.clar" %}
```lisp
;; Define a map to store counts for each user
(define-map counters principal uint)

;; Increment the count for the caller
(define-public (count-up)
  (ok (map-set counters tx-sender (+ (get-count tx-sender) u1)))
)

;; Get the current count for a user
(define-read-only (get-count (who principal))
  (default-to u0 (map-get? counters who))
)
```
{% endcode %}

Let's understand what each part does:

* `define-map` creates a persistent storage map that associates each user (principal) with their count
* `tx-sender` is a built-in variable that contains the address of whoever calls the function
* `define-public` declares functions that can modify contract state
* `define-read-only` declares functions that only read data without modifying it
{% endstep %}

{% step %}
#### Validate your contract

Before we can test our contract, let's make sure it's syntactically correct and type-safe. Clarinet's check command analyzes your contract without deploying it:

```bash
clarinet check
```

If you see errors instead, here are the most common issues and how to fix them:

| Error                 | Fix                                                                           |
| --------------------- | ----------------------------------------------------------------------------- |
| `Unknown keyword`     | Check spelling of Clarity functions                                           |
| `Type mismatch`       | Ensure you're using correct types (uint, principal, etc.)                     |
| `Unresolved contract` | Verify contract name in `Clarinet.toml` matches the contract name in the file |
{% endstep %}

{% step %}
#### Test in the console

Now for the exciting part—let's interact with our contract! Clarinet provides an interactive console where you can call functions and see results immediately. Start the console with:

```bash
clarinet console
```

Once the console loads, you can call your contract functions directly. Here are a few examples you can try:

```lisp
$ (contract-call? .counter count-up)
(ok true)
$ (contract-call? .counter get-count tx-sender)
u1
$ (contract-call? .counter count-up)
(ok true)
$ (contract-call? .counter get-count tx-sender)
u2
```

{% hint style="info" %}
**Exiting the Console**: To exit the Clarinet console, type `exit` or press `Ctrl+C`. Your contract state will be reset when you restart the console.
{% endhint %}
{% endstep %}
{% endstepper %}

***

## Common Beginner Mistakes

{% hint style="info" %}
For a deeper dive into common pitfalls and how to avoid them, check out this blog post: [5 Common Clarity Development Mistakes and How to Fix Them](https://dev.to/rajuice/5-common-clarity-development-mistakes-and-how-to-fix-them-3dl).
{% endhint %}

**A quick note on the `.` prefix**: In the Clarinet console, the `.` before a contract name (e.g., `.counter`) is shorthand for the fully qualified contract identifier. When you deploy contracts locally, they are deployed under your default deployer address. Writing `.counter` tells Clarity to look for the `counter` contract deployed by the current transaction sender. Without the `.` prefix, Clarity cannot resolve which contract you are referencing, and the call will fail with an `UnknownContract` error. This is one of the most common mistakes new Clarity developers encounter.
