# Build a No-Loss Lottery Pool

{% hint style="info" %}
This guide is migrated from the [Hiro documentation](https://docs.hiro.so/en/resources/guides/no-loss-lottery).
{% endhint %}

A no-loss lottery contract offers a unique way for participants to stack their assets and potentially earn a larger reward without the risk of losing their initial deposit.

This contract ensures that participants can stack their assets in a yield-generating pool, receive an NFT ticket, and have a chance to win additional rewards while retaining their original investment.

In this guide, you will learn how to:

1. Define constants and data variables
2. Create and manage participants and tickets
3. Implement the lottery functionality
4. Handle the selection of winners
5. Claim and distribute rewards

{% hint style="warning" %}
This example uses the CityCoins protocol for the stacking yield mechanism, but leveraging a Stacking pool using Proof of Transfer (PoX4) can also be used. Note that the CityCoins protocol is from an earlier era of Stacks development and some of its contracts may no longer be active on mainnet.
{% endhint %}

---

## Define constants and data variables

First, define some constants and data variables to manage the state of your contract. Constants are used for fixed values, and data variables store the state that can change during the contract execution.

```clarity
(define-constant OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u101000))

(define-data-var lotteryPool uint u0)
(define-data-var totalYield uint u0)
(define-data-var ticketCounter uint u0)
```

The `OWNER` constant defines the contract owner with administrative privileges, while `ERR_UNAUTHORIZED` handles unauthorized access attempts.

Key data variables include `lotteryPool` for tracking stacked assets, `totalYield` for accumulated earnings, and `ticketCounter` for managing issued tickets.

## Create and manage participants and tickets

Next, define an NFT to represent a ticket and a map to store participant information.

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

The `Participants` map links participants to their ticket details, while the `Tickets` map associates tickets with their owners.

The `LotteryTicket` defines an NFT for the lottery tickets, crucial for managing entries.

## Implement the lottery functionality

Now, it's time to implement the core function of the contract, where participants can enter the lottery by depositing their assets.

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

The `roll-the-dice` function enables participants to join the lottery by depositing assets, specifying the city (`cityName`), the deposit amount (`amount`), and the lock period (`lockPeriod`).

This function is crucial for managing lottery entries and ensuring assets are properly locked for the specified duration.

When a participant calls this function, the following steps occur:

1. **Generate ticket and determine lock period**: A new ticket ID is generated, and the lock period is set (defaulting to 1 if not specified).
2. **Transfer assets and mint NFT ticket**: The specified amount of assets is transferred from the participant to the contract, and an NFT representing the lottery ticket is minted and assigned to the participant.
3. **Update participant and ticket data**: The participant's information, including ticket ID, amount, cycle, and expiration, is stored, and the ticket's ownership information is updated.
4. **Update lottery pool and return ticket ID**: The total amount in the lottery pool is updated, the ticket counter is incremented, and the function returns the newly generated ticket ID to the participant.

This streamlined process ensures that each participant's entry is properly recorded and their assets are securely managed within the lottery system.

## Handling the selection of winners

Now, implement the function to select a winner randomly from the participants.

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
The `select-winner` function randomly selects a winner using a number from the VRF contract (`get-save-rnd`) and updates their status with `unwrap!`. This ensures a fair and transparent winner selection process.

When this function is called, the following steps occur:

1. **Fetch random number**: A random number is obtained from the VRF contract by calling `get-save-rnd` with the previous block height.
2. **Determine winning ticket**: The winning ticket ID is calculated by taking the modulus of the random number with the total number of tickets (`ticketCounter`).
3. **Retrieve winner information**: The winner's ticket and participant information are retrieved using the calculated ticket ID.
4. **Update winner status**: The participant's status is updated to indicate they are a winner by setting `isWinner` to `true` in the `Participants` map.

This process ensures that the winner is selected fairly and their status is accurately updated in the system.

## Claim and distribute rewards

Lastly, implement the function to claim and distribute rewards to the winners.

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

The `claim-rewards` function enables participants to claim their staking rewards, while the `distribute-rewards` function calls `select-winner` to randomly select and reward winners, ensuring a fair distribution process.

When the `claim-rewards` function is called, the following steps occur:

1. **Retrieve city ID and balance**: The city ID is retrieved using the `get-city-id` function, and the balance for the specified cycle is obtained from the treasury contract.
2. **Send stacking rewards**: Depending on the city (`mia` or `nyc`), the appropriate stacking reward function is called to send the rewards for the specified cycle.
3. **Claim stacking reward**: The contract claims the stacking reward for the specified city and cycle.

When the `distribute-rewards` function is called, it performs the following step:

1. **Select winner**: The `select-winner` function is called to randomly select a winner from the participants and update their status.

This process ensures that participants can claim their rewards and that winners are selected and rewarded fairly.

## Testing the contract

To test the contracts, use the following steps inside of `clarinet console`:

```terminal
$ ::advance_chain_tip 700000
$ ::set_tx_sender
$ (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.no-loss-lottery-pool roll-the-dice "mia" u500 none)
$ ::advance_chain_tip 2000
$ (contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd002-treasury-mia-stacking deposit-stx u5000000000)
$ (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.no-loss-lottery-pool claim "mia" u17)
```

To bootstrap the CityCoins contracts, follow these steps:

```clarity
(contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd004-city-registry get-or-create-city-id "mia")
(contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd004-city-registry get-or-create-city-id "nyc")
(contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd002-treasury-mia-stacking set-allowed 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2 true)
(contract-call? 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd002-treasury-nyc-stacking set-allowed 'SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11.newyorkcitycoin-token-v2 true)
```
