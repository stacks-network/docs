# Validation and Analysis

Clarinet provides powerful tools for validating, analyzing, and debugging your smart contracts. From static type checking to real-time cost analysis, you can ensure your contracts are correct and efficient before deployment.

Contract validation spans static analysis, runtime debugging, and cost optimization. Each discipline helps you gain confidence in contract behavior.

## Understanding contract validation

**Static analysis vs. runtime debugging**

| Static analysis                         | Runtime debugging                      |
| --------------------------------------- | -------------------------------------- |
| Catches issues before deployment        | Reveals behavior during execution      |
| Flags type mismatches and syntax errors | Shows actual execution costs           |
| Ensures trait compliance                | Exposes state changes and side effects |
| Detects undefined variables             | Highlights transaction flow            |
| Validates function signatures           | Surfaces performance bottlenecks       |

## Static analysis

Run comprehensive validation with `clarinet check`:

```bash
clarinet check
```

Successful output resembles:

```
✔ 3 contracts checked
```

When validation fails, Clarinet provides detailed diagnostics:

```
✖ 1 error detected

Error in contracts/token.clar:15:10
  |
15|  (ok (+ balance amount))
  |         ^^^^^^^
  |
  = Type error: expected uint, found (response uint uint)
```

{% stepper %}
{% step %}
#### Run basic checks

Use `clarinet check` to validate your contracts and catch type/syntax errors before deployment.

```bash
clarinet check
```
{% endstep %}

{% step %}
#### Check a specific contract

Focus validation during development on a single contract file:

```bash
clarinet check contracts/nft.clar
```
{% endstep %}

{% step %}
#### Integrate into CI

Automate validation in continuous integration pipelines. Example GitHub Actions workflow:

```yaml
name: Contract Validation
on: [push, pull_request]

jobs:
  sanity-checks:
    runs-on: ubuntu-latest
    container: ghcr.io/stx-labs/clarinet:latest
    steps:
      - uses: actions/checkout@v4
      - name: Check Clarity contracts check
        run: clarinet check --use-on-disk-deployment-plan
      - name: Check Clarity contracts format
        run: clarinet fmt --check
```
{% endstep %}
{% endstepper %}

**Validation scope**

Clarinet validates multiple aspects of your contracts:

| Validation type          | What it checks                                     |
| ------------------------ | -------------------------------------------------- |
| **Type safety**          | Function parameters, return values, variable types |
| **Trait compliance**     | Implementation matches trait definitions           |
| **Response consistency** | `ok`/`err` branches return the same types          |
| **Variable scope**       | Variables defined before use                       |
| **Function visibility**  | Proper use of public, private, and read-only       |

## Runtime analysis

The Clarinet console offers runtime tools that help you inspect behavior during execution.

### Cost analysis with `::toggle_costs`

Enable automatic cost display after every expression:

```clarity
::toggle_costs
;; Always show costs: true

(contract-call? .counter count-up)
;; +----------------------+----------+------------+------------+
;; |                      | Consumed | Limit      | Percentage |
;; |----------------------+----------+------------+------------|
;; | Runtime              | 4775     | 5000000000 | 0.00 %     |
;; | Read count           | 5        | 15000      | 0.03 %     |
;; | Read length (bytes)  | 268      | 100000000  | 0.00 %     |
;; | Write count          | 1        | 15000      | 0.01 %     |
;; | Write length (bytes) | 41       | 15000000   | 0.00 %     |
;; +----------------------+----------+------------+------------+
;; (ok true)
```

### Execution tracing with `::trace`

Trace function calls to understand execution flow:

```clarity
::trace (contract-call? .defi-pool swap u100 'token-a 'token-b)
;; (contract-call? .defi-pool swap u100 'token-a 'token-b) <console>
;; ( get-pool-balance 'token-a ) defi-pool:15:8
;;   ↳ args: 'token-a
;;     u50000
;; ( get-pool-balance 'token-b ) defi-pool:16:8
;;   ↳ args: 'token-b
;;     u75000
;; ( calculate-output u100 u50000 u75000 ) defi-pool:18:12
;;   ↳ args: u100, u50000, u75000
;;     u149
;; (ok u149)
```

### Interactive debugging with `::debug`

Set breakpoints and step through execution:

```clarity
::debug (contract-call? .complex-contract process-batch)
break validate-input
;; Breakpoint set at validate-input
continue
;; Hit breakpoint at validate-input:23
```

Common navigation commands:

{% hint style="info" %}
* `step` or `s` – step into subexpressions
* `finish` or `f` – complete the current expression
* `next` or `n` – step over subexpressions
* `continue` or `c` – resume execution
{% endhint %}

### Using `::get_costs` for targeted analysis

```clarity
::get_costs (contract-call? .defi-pool add-liquidity u1000 u1000)
;; +----------------------+----------+------------+------------+
;; |                      | Consumed | Limit      | Percentage |
;; |----------------------+----------+------------+------------|
;; | Runtime              | 12250    | 5000000000 | 0.00 %     |
;; | Read count           | 6        | 15000      | 0.04 %     |
;; | Read length (bytes)  | 192      | 100000000  | 0.00 %     |
;; | Write count          | 3        | 15000      | 0.02 %     |
;; | Write length (bytes) | 96       | 15000000   | 0.00 %     |
;; +----------------------+----------+------------+------------+
;; (ok {lp-tokens: u1000})
```

### Spotting costly operations with `::trace`

```clarity
::trace (contract-call? .complex-algo process-large-dataset)
```

Review the trace for loops with high iteration counts, nested map/filter operations, repeated contract calls, and large data structure manipulations.

## Debugging workflows

Master interactive debugging to identify issues quickly:

```clarity
::debug (contract-call? .counter count-up)
;; ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter:9:3
;;   6
;;   7      ;; Increment the count for the caller
;;   8      (define-public (count-up)
;; ->9        (ok (map-set counters tx-sender (+ (get-count tx-sender) u1)))
;;             ^
;;  10     )
```

### Analyzing failed transactions with `::trace`

```clarity
::trace (contract-call? .marketplace purchase u999)
;; (contract-call? .marketplace purchase u999) <console>
;; ( get-listing u999 ) marketplace:45:12
;;   ↳ args: u999
;;     none
;; (err u404)  # Listing not found
```

### Using `::encode` and `::decode` for inspection

```clarity
::encode { id: u1, active: true }
;; 0c0000000206616374697665030269640100000000000000000000000000000001

::decode 0d0000000b48656c6c6f20776f726c64
;; "Hello world"
```

### Testing time-dependent logic

```clarity
::get_block_height
;; Current block height: 4

::advance_chain_tip 100
;; new burn height: 3
;; new stacks height: 104

(contract-call? .vesting claim)
;; (ok {claimed: u2500, remaining: u7500})
```

##
