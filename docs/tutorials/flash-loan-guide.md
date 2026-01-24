# Module 15: DeFi Patterns - Flash Loans with Traits

**Author:** @jadonamite
**Difficulty:** Advanced
**Time:** 25 Minutes

A **Flash Loan** is a financial instrument unique to blockchain. It allows a user to borrow unlimited funds (up to the entire liquidity pool) **without collateral**, provided they return the funds (plus a fee) within the **same transaction**.

If the funds are not returned, the transaction fails, the state reverts, and it’s as if the loan never happened.

In Solidity, this is often done via `interface` callbacks. In Clarity, we use **Traits** to define a strict contract interface that the Borrower must adhere to.

## 1. The Architecture

1. **The Trait:** A standard definitions file that defines how a "Borrower" looks.
2. **The Provider (Lender):** Holds the funds. It sends money to the Borrower, calls the Borrower's execute function, and then checks its own balance.
3. **The Receiver (Borrower):** A contract that receives the funds, performs arbitrage/liquidation, and pays back the loan.

## 2. Step 1: Defining the Trait

First, we define the rules of engagement. Any contract that wants to borrow money must implement this specific function signature.

**File:** `contracts/flash-loan-trait.clar`

```clarity
(define-trait flash-borrower-trait
    (
        ;; Function Name: execute-operation
        ;; Inputs: amount (uint), initiator (principal)
        ;; Output: (response bool uint)
        (execute-operation (uint principal) (response bool uint))
    )
)

```

## 3. Step 2: The Provider (Lending Logic)

This contract holds the pool of funds. It trusts no one. It only trusts math.

**File:** `contracts/flash-loan-provider.clar`

```clarity
;; Use the trait we defined above
(use-trait borrower-trait .flash-loan-trait.flash-borrower-trait)

(define-constant ERR-INVALID-BALANCE (err u1000))
(define-constant ERR-TRANSFER-FAILED (err u1001))

;; Fee: 0.1% (10 basis points)
(define-read-only (calculate-fee (amount uint))
    (/ amount u1000)
)

(define-public (flash-loan (loan-amount uint) (borrower <borrower-trait>))
    (let
        (
            ;; Snapshot initial state
            (pre-loan-balance (stx-get-balance (as-contract tx-sender)))
            (fee (calculate-fee loan-amount))
            (required-return (+ loan-amount fee))
            (sender tx-sender) ;; The user initiating the transaction
        )
        ;; 1. Optimistic Transfer
        ;; Send the money to the contract implementing the trait
        (try! (as-contract (stx-transfer? loan-amount tx-sender (contract-of borrower))))

        ;; 2. Hand over control
        ;; Call the borrower's logic. If this fails/panics, everything reverts.
        (try! (contract-call? borrower execute-operation loan-amount sender))

        ;; 3. The Reckoning (Security Check)
        ;; Check our balance. If we don't have (Principal + Fee), FAIL.
        (asserts! 
            (>= (stx-get-balance (as-contract tx-sender)) (+ pre-loan-balance fee))
            ERR-INVALID-BALANCE
        )

        (ok true)
    )
)

```

## 4. Step 3: The Receiver (Borrowing Logic)

This is the contract an Arbitrageur would write. It implements the trait so the Provider can call it.

**File:** `contracts/arbitrage-bot.clar`

```clarity
;; Assert that we implement the trait
(impl-trait .flash-loan-trait.flash-borrower-trait)

(define-public (execute-operation (amount uint) (initiator principal))
    (let
        (
            (fee (/ amount u1000))
            (repay-amount (+ amount fee))
        )
        ;; ------------------------------------------------
        ;; YOUR PROFIT LOGIC GOES HERE
        ;; 1. Buy Token A on DEX X
        ;; 2. Sell Token A on DEX Y for profit
        ;; ------------------------------------------------

        ;; 3. Repay the Loan
        ;; If we don't do this, the Provider's 'asserts!' will fail the tx.
        (try! (as-contract (stx-transfer? repay-amount tx-sender .flash-loan-provider)))
        
        ;; 4. Keep the change (Profit)
        (ok true)
    )
)

```

## 5. Security & Safety

* **Re-entrancy:** While standard re-entrancy is impossible in Stacks, "Logic Re-entrancy" (where the borrower calls back into the provider to mess with state) is possible. However, since the Provider checks `stx-get-balance` at the very end, state manipulation is generally ineffective against the solvency check.
* **Trait Whitelisting:** If you only want specific approved contracts to borrow, you can add an `asserts!` checking `(contract-of borrower)` against a map of allowed principals.

## 6. Summary Checklist

* [ ] **Trait Definition:** Is the input/output signature exactly matching in both contracts?
* [ ] **Solvency Check:** Does the Provider strictly enforce `final_balance >= initial_balance + fee`?
* [ ] **As-Contract:** Are transfers correctly using `(as-contract tx-sender)` to move funds *from* the contract?

---
