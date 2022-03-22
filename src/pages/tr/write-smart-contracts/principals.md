---
title: Principals
description: 'Clarity: Understanding Principals'
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Introduction

_Principals_ are a Clarity native type that represents an entity that can have a token balance. This section discusses principals and how they are used in the Clarity.

## Principals and tx-sender

Assets in the smart contracting language and blockchain are "owned" by objects of the principal type, meaning that any object of the principal type may own an asset. For the case of public-key hash and multi-signature Stacks addresses, a given principal can operate on their assets by issuing a signed transaction on the blockchain. _Smart contracts_ may also be principals (represented by the smart contract's identifier), however, there is no private key associated with the smart contract, and it cannot broadcast a signed transaction on the blockchain.

A Clarity contract can use a globally defined `tx-sender` variable to obtain the current principal. The following example defines a transaction type that transfers `amount` microSTX from the sender to a recipient if amount is a multiple of 10, otherwise returning a 400 error code.

```clarity
(define-public (transfer-to-recipient! (recipient principal) (amount uint))
  (if (is-eq (mod amount 10) 0)
      (stx-transfer? amount tx-sender recipient)
      (err u400)))
```

Clarity provides an additional variable to help smart contracts authenticate a transaction sender. The keyword `contract-caller` returns the principal that _called_ the current contract. If an inter-contract call occurred, `contract-caller` returns the last contract in the stack of callers. For example, suppose there are three contracts A, B, and C, each with an `invoke` function such that `A::invoke` calls `B::invoke` and `B::invoke` calls `C::invoke`.

When a user Bob issues a transaction that calls `A::invoke`, the value of `contract-caller` in each successive invoke function's body would change:

```clarity
in A::invoke,  contract-caller = Bob
in B::invoke,  contract-caller = A
in C::invoke,  contract-caller = B
```

This allows contracts to make assertions and perform authorization checks using not only the `tx-sender` (which in this example, would always be "Bob"), but also using the `contract-caller`. This could be used to ensure that a particular function is only ever called directly and never called via an inter-contract call (by asserting that `tx-sender` and `contract-caller` are equal). We provide an example of a two different types of authorization checks in the rocket ship example below.

## Smart contracts as principals

Smart contracts themselves are principals and are represented by the smart contract's identifier -- which is the publishing address of the contract _and_ the contract's name, for example:

```clarity
'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR.contract-name
```

For convenience, smart contracts may write a contract's identifier in the form `.contract-name`. This will be expanded by the Clarity interpreter into a fully qualified contract identifier that corresponds to the same publishing address as the contract it appears in. For example, if the same publisher address, `SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR`, is publishing two contracts, `contract-A` and `contract-B`, the fully qualified identifier for the contracts would be:

```clarity
'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR.contract-A
'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR.contract-B
```

But, in the contract source code, if the developer wishes to call a function from `contract-A` in `contract-B`, they can write

```clarity
(contract-call? .contract-A public-function-foo)
```

This allows the smart contract developer to modularize their applications across multiple smart contracts _without_ knowing the publishing key a priori.

In order for a smart contract to operate on assets it owns, smart contracts may use the special `(as-contract ...)` function. This function executes the expression (passed as an argument) with the `tx-sender` set to the contract's principal, rather than the current sender. The `as-contract` function returns the value of the provided expression.

For example, a smart contract that implements something like a "token faucet" could be implemented as so:

```clarity
(define-map claimed-before
  ((sender principal))
  ((claimed bool)))

(define-constant err-already-claimed u1)
(define-constant err-faucet-empty u2)
(define-constant stx-amount u1)

(define-public (claim-from-faucet)
    (let ((requester tx-sender)) ;; set a local variable requester = tx-sender
        (asserts! (is-none (map-get? claimed-before {sender: requester})) (err err-already-claimed))
        (unwrap! (as-contract (stx-transfer? stx-amount tx-sender requester)) (err err-faucet-empty))
        (map-set claimed-before {sender: requester} {claimed: true})
        (ok stx-amount)))
```

In this example, the public function `claim-from-faucet`:

- Checks if the sender has claimed from the faucet before.
- Assigns the tx sender to a `requester` variable.
- Adds an entry to the tracking map.
- Uses `as-contract` to send 1 microstack

Unlike other principals, there is no private key associated with a smart contract. As it lacks a private key, a Clarity smart contract cannot broadcast a signed transaction on the blockchain.

## Example: Authorization checks

The interactions between `tx-sender`, `contract-caller` and `as-contract` are subtle, but are important when performing authorization checks in a contract. In this example contract, we'll show two different kinds of authorization checks a contract may wish to perform, and then walk through how different ways in which contract functions may be called will pass or fail those checks.

This contract defines a "rocket-ship" non-fungible-token that a principal may own and manage the authorized pilots. Pilots are principals that are allowed to "fly" the rocket ship.

This contract performs two different authorization checks:

1. Before a ship is allowed to fly, the contract checks whether or not the transaction was created and signed by an authorized pilot. A pilot could, for example, call another contract, which then calls the `fly-ship` public function on the pilot's behalf.
2. Before modifying the allowed-pilots for a given rocket ship, the contract checks that the transaction was signed by the owner of the rocket ship. Furthermore, the contract requires that this function be called _directly_ by the ship's owner, rather than through a inter-contract-call.

The second type of check is more restrictive than the first check, and is helpful for guarding very sensitive routines --- it protects users from unknowingly calling a function on a malicious contract that subsequently tries to call sensitive functions on another contract.

```clarity
;;
;; rockets-base.clar
;;

(define-non-fungible-token rocket-ship uint)

;; a map from rocket ships to their allowed
;;  pilots
(define-map allowed-pilots
    ((rocket-ship uint)) ((pilots (list 10 principal))))

;; implementing a contains function via fold
(define-private (contains-check
                  (y principal)
                  (to-check { p: principal, result: bool }))
   (if (get result to-check)
        to-check
        { p: (get p to-check),
          result: (is-eq (get p to-check) y) }))

(define-private (contains (x principal) (find-in (list 10 principal)))
   (get result (fold contains-check find-in
    { p: x, result: false })))

(define-read-only (is-my-ship (ship uint))
  (is-eq (some tx-sender) (nft-get-owner? rocket-ship ship)))

;; this function will print a message
;;  (and emit an event) if the tx-sender was
;;  an authorized flyer.
;;
;;  here we use tx-sender, because we want
;;   to allow the user to let other contracts
;;   fly the ship on behalf of users

(define-public (fly-ship (ship uint))
  (let ((pilots (default-to
                   (list)
                   (get pilots (map-get? allowed-pilots { rocket-ship: ship })))))
    (if (contains tx-sender pilots)
        (begin (print "Flew the rocket-ship!")
               (ok true))
        (begin (print "Tried to fly without permission!")
               (ok false)))))
;;
;; Authorize a new pilot.
;;
;;  here we want to ensure that this function
;;   was called _directly_ by the user by
;;   checking that tx-sender and contract-caller are equal.
;;  if any other contract is in the call stack, contract-caller
;;   would be updated to a different principal.
;;
(define-public (authorize-pilot (ship uint) (pilot principal))
 (begin
   ;; sender must equal caller: an intermediate contract is
   ;;  not issuing this call.
   (asserts! (is-eq tx-sender contract-caller) (err u1))
   ;; sender must own the rocket ship
   (asserts! (is-eq (some tx-sender)
                  (nft-get-owner? rocket-ship ship)) (err u2))
   (let ((prev-pilots (default-to
                         (list)
                         (get pilots (map-get? allowed-pilots { rocket-ship: ship })))))
    ;; don't add a pilot already in the list
    (asserts! (not (contains pilot prev-pilots)) (err u3))
    ;; append to the list, and check that it is less than
    ;;  the allowed maximum
    (match (as-max-len? (append prev-pilots pilot) u10)
           next-pilots
             (ok (map-set allowed-pilots {rocket-ship: ship} {pilots: next-pilots}))
           ;; too many pilots already
           (err u4)))))
```

### Extending functionality: Multi-flyer contract

The authorization scheme for `fly-ship` allows pilots to fly rocket-ships from other contracts. This allows other contracts to provide new functionality built around calling that function.

For example, we can create a contract that calls `fly-ship` for multiple rocket-ships in a single transaction:

```clarity
;;
;; rockets-multi.clar
;;

(define-private (call-fly (ship uint))
  (unwrap! (contract-call? .rockets-base fly-ship ship) false))
;; try to fly all the ships, returning a list of whether
;;  or not we were able to fly the supplied ships
(define-public (fly-all (ships (list 10 uint)))
  (ok (map call-fly ships)))
```

### Authorization for Contract-Owned Assets

The check in `authorize-pilot` protects users from malicious contracts, but how would such a scheme support contract-owned assets? This is what the `as-contract` function is used for. The `as-contract` function executes the supplied closure as if the sender of the transaction was the current contract, rather than the user -- it does this by updating `tx-sender` to the current contract principal. We can use this to, for example, create a smart contract rocket-ship-line:

```clarity
;;
;; rockets-ship-line.clar
;;

(define-constant line-ceo 'SP19Y6GRV9X778VFS1V8WT2H502WFK33XZXADJWZ)

(define-data-var employed-pilots (list 10 principal) (list))

;; This function will:
;;  * check that it is called by the line-ceo
;;  * check that the rocket is owned by the contract
;;  * authorize each employed pilot to the ship
(define-public (add-managed-rocket (ship uint))
 (begin
  ;; only the ceo may call this function
  (asserts! (is-eq tx-sender contract-caller line-ceo) (err u1))
  ;; start executing as the contract
   (as-contract (begin
    ;; make sure the contract owns the ship
    (asserts! (contract-call? .rockets-base is-my-ship ship) (err u2))
    ;; register all of our pilots on the ship
    (add-pilots-to ship)))))

;; add all the pilots to a ship using fold --
;;  the fold checks the return type of previous calls,
;;  skipping subsequent contract-calls if one fails.
(define-private (add-pilot-via-fold (pilot principal) (prior-result (response uint uint)))
  (let ((ship (try! prior-result)))
    (try! (contract-call? .rockets-base authorize-pilot ship pilot))
    (ok ship)))
(define-private (add-pilots-to (ship uint))
  (fold add-pilot-via-fold (var-get employed-pilots) (ok ship)))
```

In order for the contract to add each pilot to a new ship, the contract must call `authorize-pilot`. However, the contract wants to perform this action on behalf of a ship the _contract_ owns, not the transaction sender. To do this, the contract uses `as-contract`.
