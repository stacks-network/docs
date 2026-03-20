---
description: Build a no-loss lottery pattern in Clarity using pooled deposits and reward distribution.
---

# No-Loss Lottery

{% hint style="warning" %}
This migrated example comes from older Hiro docs and references CityCoins-era contracts. Treat it as a historical pattern, not a production-ready integration.
{% endhint %}

This pattern shows how a contract can pool deposits, issue NFT tickets, select a winner, and distribute yield without risking a participant's principal deposit.

## Core state

```clarity
(define-constant OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u101000))

(define-data-var lotteryPool uint u0)
(define-data-var totalYield uint u0)
(define-data-var ticketCounter uint u0)
```

## Track participants and tickets

```clarity
(define-map Participants
  { participant: principal }
  { ticketId: uint, amount: uint, cycle: uint, ticketExpirationAtCycle: uint, isWinner: bool }
)

(define-map Tickets
  { ticketId: uint }
  { owner: principal }
)

(define-non-fungible-token LotteryTicket uint)
```

## Enter the lottery

```clarity
(define-public (roll-the-dice (cityName (string-ascii 10)) (amount uint) (lockPeriod (optional uint)))
  (let
    (
      (ticketId (+ (var-get ticketCounter) u1))
      (actualLockPeriod (default-to u1 lockPeriod))
      (rewardCycle (+ (contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd007-citycoin-stacking get-current-reward-cycle) u1))
    )
    (begin
      (try! (contract-call? 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2 transfer amount tx-sender (as-contract tx-sender) none))
      (try! (nft-mint? LotteryTicket ticketId tx-sender))
      (map-insert Participants { participant: tx-sender } { ticketId: ticketId, amount: amount, cycle: rewardCycle, ticketExpirationAtCycle: (+ rewardCycle actualLockPeriod), isWinner: false })
      (map-set Tickets { ticketId: ticketId } { owner: tx-sender })
      (var-set lotteryPool (+ (var-get lotteryPool) amount))
      (var-set ticketCounter (+ (var-get ticketCounter) u1))
      (ok ticketId)
    )
  )
)
```

## Select a winner

```clarity
(define-private (select-winner)
  (match (contract-call? 'SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11.citycoin-vrf-v2 get-save-rnd (- block-height u1)) randomTicketNumber
    (let
      (
        (ticketCount (var-get ticketCounter))
        (winningTicketId (mod randomTicketNumber ticketCount))
        (winner (unwrap! (get-ticket winningTicketId) (err u404)))
        (owner (get owner winner))
        (participant (unwrap! (get-participant owner) (err u404)))
      )
      (map-set Participants { participant: owner }
        { ticketId: winningTicketId, amount: (get amount participant), cycle: (get cycle participant), ticketExpirationAtCycle: (get ticketExpirationAtCycle participant), isWinner: true })
      (ok owner)
    )
    selectionError (err selectionError)
  )
)
```

## Claim and distribute rewards

```clarity
(define-public (claim-rewards (cityName (string-ascii 10)) (cycle uint))
  (let
    (
      (cityId (unwrap-panic (contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd004-city-registry get-city-id cityName)))
      (cycleAmount (contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd002-treasury-mia-stacking get-balance-stx))
    )
    (if (is-eq cityName "mia")
      (try! (contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd011-stacking-payouts send-stacking-reward-mia cycle cycleAmount))
      (try! (contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd011-stacking-payouts send-stacking-reward-nyc cycle cycleAmount))
    )
    (as-contract (contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd007-citycoin-stacking claim-stacking-reward cityName cycle))
  )
)

(define-public (distribute-rewards)
  (select-winner)
)
```
