---
title: Stacking Contract
description: See a detailed list of all functions and error codes of the Stacking contract.
---
## Introduction

Stacking is implemented as a smart contract using Clarity. You can always find the Stacking contract identifier using the Stacks Blockchain API [`v2/pox` endpoint](https://docs.hiro.so/api#operation/get_pox_info).

Below is a list of public and read-only functions as well as error codes that can be returned by those methods:

* [Public functions](#public-functions)
* [Read-only functions](#read-only-functions)
* [Error codes](#error-codes)

## Public functions

### allow-contract-caller
#### input: `principal, (optional uint)`
#### output: `(response bool int)`
#### signature: `(allow-contract-caller caller until-burn-ht)`
#### description: 
Give a contract-caller authorization to call stacking methods. Normally, stacking methods may only be invoked by _direct_ transactions (i.e., the `tx-sender` issues a direct `contract-call` to the stacking methods).

By issuing an allowance, the tx-sender may call through the allowed contract.

### delegate-stack-stx
#### input: `principal, uint, (tuple (hashbytes (buff 20)) (version (buff 1))), uint, uint`
#### output: `(response (tuple (lock-amount uint) (stacker principal) (unlock-burn-height uint)) int)`
#### signature: `(delegate-stack-stx stacker amount-ustx pox-addr start-burn-ht lock-period)`
#### description: 
As a delegate, stack the given principal's STX using `partial-stacked-by-cycle`.

Once the delegate has stacked > minimum, the delegate should call `stack-aggregation-commit`.

### delegate-stx
#### input: `uint, principal, (optional uint), (optional (tuple (hashbytes (buff 20)) (version (buff 1))))`
#### output: `(response bool int)`
#### signature: `(delegate-stx amount-ustx delegate-to until-burn-ht pox-addr)`
#### description: 
Delegate to `delegate-to` the ability to stack from a given address.

This method _does not_ lock the funds, rather, it allows the delegate to issue the stacking lock.

The caller specifies:

* amount-ustx: the total amount of ustx the delegate may be allowed to lock
* until-burn-ht: an optional burn height at which this delegation expiration
* pox-addr: an optional p2pkh or p2sh address to which any rewards *must* be sent

### disallow-contract-caller
#### input: `principal`
#### output: `(response bool int)`
#### signature: `(disallow-contract-caller caller)`
#### description: 
Revokes authorization from a contract to invoke stacking methods through contract-calls

### reject-pox
#### input: ``
#### output: `(response bool int)`
#### signature: `(reject-pox)`
#### description: 
Reject Stacking for this reward cycle.

`tx-sender` votes all its uSTX for rejection.

Note that unlike Stacking, rejecting PoX does not lock the tx-sender's tokens: PoX rejection acts like a coin vote.

### revoke-delegate-stx
#### input: ``
#### output: `(response bool int)`
#### signature: `(revoke-delegate-stx)`
#### description: 
Revoke a Stacking delegate relationship. A particular Stacker may only have one delegate, so this method does not take any parameters, and just revokes the Stacker's current delegate (if one exists).

### stack-aggregation-commit
#### input: `(tuple (hashbytes (buff 20)) (version (buff 1))), uint`
#### output: `(response bool int)`
#### signature: `(stack-aggregation-commit pox-addr reward-cycle)`
#### description: 
Commit partially stacked STX.

This allows a stacker/delegate to lock fewer STX than the minimal threshold in multiple transactions,

so long as:

1. The pox-addr is the same.
2. This \"commit\" transaction is called _before_ the PoX anchor block.

This ensures that each entry in the reward set returned to the stacks-node is greater than the threshold,

  but does not require it be all locked up within a single transaction

### stack-stx
#### input: `uint, (tuple (hashbytes (buff 20)) (version (buff 1))), uint, uint`
#### output: `(response (tuple (lock-amount uint) (stacker principal) (unlock-burn-height uint)) int)`
#### signature: `(stack-stx amount-ustx pox-addr start-burn-ht lock-period)`
#### description: 
Lock up some uSTX for stacking!  Note that the given amount here is in micro-STX (uSTX).

The STX will be locked for the given number of reward cycles (lock-period).

This is the self-service interface.  tx-sender will be the Stacker.

* The given stacker cannot currently be stacking.
* You will need the minimum uSTX threshold. This isn't determined until the reward cycle begins, but this method still requires stacking over the _absolute minimum_ amount, which can be obtained by calling `get-stacking-minimum`.
* The pox-addr argument must represent a valid reward address.  Right now, this must be a Bitcoin p2pkh or p2sh address.  It cannot be a native Segwit address, but it may be a p2wpkh-p2sh or p2wsh-p2sh address.

The tokens will unlock and be returned to the Stacker (tx-sender) automatically.

## Read-only functions
 
### can-stack-stx
#### input: `(tuple (hashbytes (buff 20)) (version (buff 1))), uint, uint, uint`
#### output: `(response bool int)`
#### signature: `(can-stack-stx pox-addr amount-ustx first-reward-cycle num-cycles)`
#### description: 
Evaluate if a participant can stack an amount of STX for a given period.

### get-pox-info
#### input: ``
#### output: `(response (tuple (current-rejection-votes uint) (first-burnchain-block-height uint) (min-amount-ustx uint) (prepare-cycle-length uint) (rejection-fraction uint) (reward-cycle-id uint) (reward-cycle-length uint) (total-liquid-supply-ustx uint)) UnknownType)`
#### signature: `(get-pox-info)`
#### description: 
Returns information about PoX status.

### get-pox-rejection
#### input: `principal, uint`
#### output: `(optional (tuple (amount uint)))`
#### signature: `(get-pox-rejection stacker reward-cycle)`
#### description: 
Returns the amount of uSTX that a given principal used to reject a PoX cycle.

### get-stacker-info
#### input: `principal`
#### output: `(optional (tuple (amount-ustx uint) (first-reward-cycle uint) (lock-period uint) (pox-addr (tuple (hashbytes (buff 20)) (version (buff 1))))))`
#### signature: `(get-stacker-info stacker)`
#### description: 
Returns the _current_ stacking information for `stacker.  If the information is expired, or if there's never been such a stacker, then returns none.

### get-stacking-minimum
#### input: ``
#### output: `uint`
#### signature: `(get-stacking-minimum)`
#### description: 
Returns the absolute minimum amount that could be validly Stacked (the threshold to Stack in a given reward cycle may be higher than this

### get-total-ustx-stacked
#### input: `uint`
#### output: `uint`
#### signature: `(get-total-ustx-stacked reward-cycle)`
#### description: 
Returns the amount of currently participating uSTX in the given cycle.

### is-pox-active
#### input: `uint`
#### output: `bool`
#### signature: `(is-pox-active reward-cycle)`
#### description: 
Returns whether or not PoX has been rejected at a given PoX cycle.
## Error codes

### ERR_DELEGATION_EXPIRES_DURING_LOCK
#### type: `int`
#### value: `21`

### ERR_DELEGATION_POX_ADDR_REQUIRED
#### type: `int`
#### value: `23`

### ERR_DELEGATION_TOO_MUCH_LOCKED
#### type: `int`
#### value: `22`

### ERR_INVALID_START_BURN_HEIGHT
#### type: `int`
#### value: `24`

### ERR_NOT_ALLOWED
#### type: `int`
#### value: `19`

### ERR_STACKING_ALREADY_DELEGATED
#### type: `int`
#### value: `20`

### ERR_STACKING_ALREADY_REJECTED
#### type: `int`
#### value: `17`

### ERR_STACKING_ALREADY_STACKED
#### type: `int`
#### value: `3`

### ERR_STACKING_EXPIRED
#### type: `int`
#### value: `5`

### ERR_STACKING_INSUFFICIENT_FUNDS
#### type: `int`
#### value: `1`

### ERR_STACKING_INVALID_AMOUNT
#### type: `int`
#### value: `18`

### ERR_STACKING_INVALID_LOCK_PERIOD
#### type: `int`
#### value: `2`

### ERR_STACKING_INVALID_POX_ADDRESS
#### type: `int`
#### value: `13`

### ERR_STACKING_NO_SUCH_PRINCIPAL
#### type: `int`
#### value: `4`

### ERR_STACKING_PERMISSION_DENIED
#### type: `int`
#### value: `9`

### ERR_STACKING_POX_ADDRESS_IN_USE
#### type: `int`
#### value: `12`

### ERR_STACKING_STX_LOCKED
#### type: `int`
#### value: `6`

### ERR_STACKING_THRESHOLD_NOT_MET
#### type: `int`
#### value: `11`

### ERR_STACKING_UNREACHABLE
#### type: `int`
#### value: `255`