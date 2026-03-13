# DeFi Lending

{% code title="defi-lending" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; Define the contract's data variables

;; Maps a user's principal address to their deposited amount.
(define-map deposits
  { owner: principal }
  { amount: uint }
)

;; Maps a borrower's principal address to their loan details: amount and the last interaction block.
(define-map loans
  principal
  {
    amount: uint,
    last-interaction-block: uint,
  }
)

;; Holds the total amount of deposits in the contract, initialized to 0.
(define-data-var total-deposits uint u0)

;; Represents the reserve funds in the pool, initialized to 0.
(define-data-var pool-reserve uint u0)

;; The interest rate for loans, represented as 10% (out of a base of 100).
(define-data-var loan-interest-rate uint u10) ;; Representing 10% interest rate

;; Error constants for various failure scenarios.
(define-constant err-no-interest (err u100))
(define-constant err-overpay (err u200))
(define-constant err-overborrow (err u300))

;; Public function for users to deposit STX into the contract.
;; Updates their balance and the total deposits in the contract.
(define-public (deposit (amount uint))
  (let (
      ;; Fetch the current balance or default to 0 if none exists.
      (current-balance (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
    )
    ;; Transfer the STX from sender = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" to recipient = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-defi (ie: contract identifier on the chain!)".
    (try! (stx-transfer? amount tx-sender current-contract))
    ;; Update the user's deposit amount in the map.
    (map-set deposits { owner: tx-sender } { amount: (+ current-balance amount) })
    ;; Update the total deposits variable.
    (var-set total-deposits (+ (var-get total-deposits) amount))
    ;; Return success.
    (ok true)
  )
)

;; Public function for users to borrow STX based on their deposits.
(define-public (borrow (amount uint))
  (let (
      ;; Fetch user's deposit or default to 0.
      (user-deposit (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
      ;; Calculate the maximum amount the user is allowed to borrow. (which will be upto HALF of what they deposited)
      (allowed-borrow (/ user-deposit u2))
      ;; Fetch current loan details or default to initial values.
      (current-loan-details (default-to {
        amount: u0,
        last-interaction-block: u0,
      }
        (map-get? loans tx-sender)
      ))
      ;; Calculate accrued interest on the current loan.
      (accrued-interest (calculate-accrued-interest (get amount current-loan-details)
        (get last-interaction-block current-loan-details)
      ))
      ;; Calculate the total amount due including interest.
      (total-due (+ (get amount current-loan-details) (unwrap-panic accrued-interest)))
      ;; Calculate the new loan total after borrowing additional amount.
      (new-loan (+ amount))
    )
    ;; Ensure the requested borrow amount does not exceed the allowed amount.
    (asserts! (<= new-loan allowed-borrow) err-overborrow)
    ;; Transfer the borrowed STX to the user.
    (let ((recipient tx-sender))
      (try! (as-contract? ((with-stx amount))
        (try! (stx-transfer? amount current-contract recipient))
      ))
    )
    ;; Update the user's loan details in the map.
    (map-set loans tx-sender {
      amount: new-loan,
      last-interaction-block: burn-block-height,
    })
    ;; Return success.
    (ok true)
  )
)

;; Read-only function to get the total balance by tx-sender
(define-read-only (get-balance-by-sender)
  (ok (map-get? deposits { owner: tx-sender }))
)

;; Read-only function to get the total balance
(define-read-only (get-balance)
  (ok (var-get total-deposits))
)

;; Read-only function to get the total amount owed by the user.
(define-read-only (get-amount-owed)
  (let (
      ;; Fetch current loan details or default to initial values.
      (current-loan-details (default-to {
        amount: u0,
        last-interaction-block: u0,
      }
        (map-get? loans tx-sender)
      ))
      ;; Calculate accrued interest on the current loan.
      (accrued-interest (calculate-accrued-interest (get amount current-loan-details)
        (get last-interaction-block current-loan-details)
      ))
      ;; Calculate the total amount due including interest.
      (total-due (+ (get amount current-loan-details) (unwrap-panic accrued-interest)))
    )
    ;; Return the total amount due.
    (ok total-due)
  )
)

;; Public function for users to repay their STX loans.
(define-public (repay (amount uint))
  (let (
      ;; Fetch current loan details or default to initial values.
      (current-loan-details (default-to {
        amount: u0,
        last-interaction-block: u0,
      }
        (map-get? loans tx-sender)
      ))
      ;; Calculate accrued interest since the last interaction.
      (accrued-interest (unwrap!
        (calculate-accrued-interest (get amount current-loan-details)
          (get last-interaction-block current-loan-details)
        )
        err-no-interest
      ))
      ;; Calculate the total amount due including accrued interest.
      (total-due (+ (get amount current-loan-details) accrued-interest))
    )
    ;; Ensure the repayment amount is not more than the total due.
    (asserts! (>= total-due amount) err-overpay)
    ;; Transfer the repayment amount from the user to the contract.
    (try! (stx-transfer? amount tx-sender current-contract))
    ;; Update the user's loan details in the map with the new total due.
    (map-set loans tx-sender {
      amount: (- total-due amount),
      last-interaction-block: burn-block-height,
    })
    ;; Update the pool reserve with the paid interest.
    (var-set pool-reserve (+ (var-get pool-reserve) accrued-interest))
    ;; Return success.
    (ok true)
  )
)

;; Public function for users to claim their yield based on the pool reserve and their deposits.
(define-public (claim-yield)
  (let (
      ;; Fetch user's deposit amount or default to 0.
      (user-deposit (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
      ;; Calculate the yield amount based on user's share of the pool.
      (yield-amount (/ (* (var-get pool-reserve) user-deposit) (var-get total-deposits)))
    )
    ;; Transfer the yield amount from the contract to the user.
    (let ((recipient tx-sender))
      (try! (as-contract? ((with-stx yield-amount))
        (try! (stx-transfer? yield-amount current-contract recipient))
      ))
    )
    ;; Update the pool reserve by subtracting the claimed yield.
    (var-set pool-reserve (- (var-get pool-reserve) yield-amount))
    ;; Return success.
    (ok true)
  )
)

;; Private function to calculate the accrued interest on a loan.
(define-private (calculate-accrued-interest
    (principal uint)
    (start-block uint)
  )
  (let (
      ;; Calculate the number of blocks elapsed since the last interaction.
      (elapsed-blocks (- burn-block-height start-block))
      ;; Calculate the interest based on the principal, rate, and elapsed time.
      (interest (/ (* principal (var-get loan-interest-rate) elapsed-blocks) u10000))
    )
    ;; Ensure the loan started in the past (not at block 0).
    (asserts! (not (is-eq start-block u0)) (ok u0))
    ;; Return the calculated interest.
    (ok interest)
  )
)
```
{% endcode %}

## Contract Summary

A DeFi lending protocol that allows users to deposit STX, borrow against their deposits, and earn yield from interest payments. This contract demonstrates core DeFi mechanics including collateralized loans, interest accrual, and yield distribution.

**What this contract does:**

* Accepts STX deposits from users and tracks individual balances
* Allows users to borrow up to 50% of their deposited amount
* Calculates and accrues interest on loans based on block height
* Charges 10% interest rate on borrowed amounts
* Enables borrowers to repay loans with accrued interest
* Distributes yield to depositors based on their share of the pool
* Maintains a pool reserve funded by interest payments
* Prevents over-borrowing beyond collateral limits
* Tracks loan details including principal and last interaction block

**What developers can learn:**

* Building collateralized lending protocols with loan-to-value ratios
* Time-based interest calculation using block heights
* Managing multiple user states with separate maps (deposits vs loans)
* Interest accrual patterns in DeFi applications
* Yield distribution mechanics based on pool shares
* Using `as-contract` for contract-initiated transfers
* Preventing common DeFi errors (over-borrowing, over-repayment)
* Tracking global state (total deposits, pool reserve) with data variables
* Read-only functions for user balance and debt queries
* Error handling for financial operations with descriptive constants
* Basic DeFi math: percentage calculations, pro-rata distributions
