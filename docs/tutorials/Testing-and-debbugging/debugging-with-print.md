# Module 23: Debugging - The `console.log` of Clarity (`print`)

**Author:** @jadonamite
**Difficulty:** Beginner
**Time:** 10 Minutes

When your logic fails silently, you need visibility. in JavaScript, you spam `console.log("HERE 1", var)`.
In Clarity, we have `(print expression)`.

However, unlike `console.log` which goes to `stdout`, `(print)` emits an **Event** onto the blockchain. This means your debug logs are permanent, verifiable, and viewable in the Block Explorer.

This module teaches you how to use `print` to trace execution flow and inspect variable states during development.

## 1. The Syntax

`print` takes **one** expression, evaluates it, emits it as an event, and then returns the value (passing it through).

```clarity
;; 1. Simple String
(print "Function Started")

;; 2. Inspecting a Variable (Pass-through)
;; This prints the amount, then returns the amount so the math continues.
(let 
    (
        (amount u100)
        (fee (print (/ amount u10))) ;; Prints "u10", sets fee to u10
    )
    ...
)

;; 3. Structured Logging (Tuples)
;; Best for context
(print { event: "deposit", user: tx-sender, amount: u500 })

```

## 2. Scenario: Tracing a Silent Failure

Imagine a function `calculate-reward` that returns `0`, but you don't know why.

**Contract:** `contracts/reward-debug.clar`

```clarity
(define-public (claim-reward (user principal))
    (let
        (
            (balance (ft-get-balance my-token user))
            (multiplier u2)
        )
        ;; DEBUG LOG 1: Check initial state
        (print { step: "start", user: user, balance: balance })

        (if (> balance u1000)
            (begin
                ;; DEBUG LOG 2: Branch A
                (print "High Roller Branch")
                (ok (* balance multiplier))
            )
            (begin
                ;; DEBUG LOG 3: Branch B
                (print "Low Balance Branch")
                (ok balance)
            )
        )
    )
)

```

## 3. Viewing the Logs

### Option A: Clarinet Console (Local)

When you run this in `clarinet console`:

```bash
>> (contract-call? .reward-debug claim-reward tx-sender)

```

**Output:**

```text
Events emitted:
1. { step: "start", user: ..., balance: u500 }
2. "Low Balance Branch"
Value: (ok u500)

```

You immediately see which branch was taken and what the variables were.

### Option B: Unit Tests (Vitest)

You can assert that a print event happened. This is useful for testing "Side Effects" (like off-chain indexers listening for specific logs).

```typescript
it('emits debug info', () => {
  const { events } = simnet.callPublicFn('reward-debug', 'claim-reward', ...);
  
  // Inspect the first print event
  const log = events[0].data;
  expect(log.step).toBe("start");
});

```

### Option C: Stacks Explorer (Mainnet/Testnet)

If you deploy this, every `print` call appears in the **Events** tab of the transaction.

* **Pro:** Great for production debugging.
* **Con:** It costs gas. Every character you print adds to the transaction byte size.

## 4. Best Practices

1. **Label Your Logs:** Don't just `(print amount)`. Use `(print { tag: "amount", val: amount })` so you know what you are looking at.
2. **Remove Before Flight:** For highly optimized contracts, remove debug prints before mainnet deployment to save gas.
3. **Use for Indexing:** If you are building a dApp, use `print` intentionally to signal the frontend (e.g., "NFT Minted", "Auction Won").

## 5. Summary Checklist

* [ ] **Wrapped Logic:** Did you wrap your logic correctly? `(let ((x (print (+ 1 1)))) ...)`
* [ ] **Structured Data:** Are you using tuples `{}` to give context to your values?
* [ ] **Gas Awareness:** Are you printing massive strings unnecessarily?

