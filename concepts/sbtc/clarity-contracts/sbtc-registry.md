# sBTC Registry Contract Documentation

## Overview

The [sBTC Registry contract](https://github.com/stacks-network/sbtc/blob/main/contracts/contracts/sbtc-registry.clar) (`sbtc-registry.clar`) serves as the central registry for the sBTC system. It manages withdrawal requests, completed deposits, and the current signer set. This contract is crucial for maintaining the state and coordinating operations within the sBTC ecosystem.

## Error Constants

- `ERR_UNAUTHORIZED` (u400): Indicates unauthorized access.
- `ERR_INVALID_REQUEST_ID` (u401): Signifies an invalid withdrawal request ID.
- `ERR_AGG_PUBKEY_REPLAY` (u402): Indicates an attempt to replay an aggregate public key.
- `ERR_MULTI_SIG_REPLAY` (u403): Signifies an attempt to replay a multi-signature address.

## State Variables

- `last-withdrawal-request-id`: Tracks the latest withdrawal request ID.
- `current-signature-threshold`: Stores the current threshold for required signatures.
- `current-signer-set`: Maintains a list of current signer public keys.
- `current-aggregate-pubkey`: Holds the current aggregate public key.
- `current-signer-principal`: Stores the current signer's principal address.

## Data Maps

### withdrawal-requests

Stores withdrawal request details indexed by request ID.

- Fields:
  - `amount`: Amount of sBTC being withdrawn (in sats)
  - `max-fee`: Maximum fee for the withdrawal
  - `sender`: Principal of the sender
  - `recipient`: BTC recipient address (version and hashbytes)
  - `block-height`: Burn block height where the request was created

### withdrawal-status

Tracks the status of withdrawal requests indexed by request ID.

- Value: `bool` (true if accepted, false if rejected, none if pending)

### completed-deposits

Records completed deposit transactions to prevent replay attacks.

- Key: `{txid: (buff 32), vout-index: uint}`
- Value: `{amount: uint, recipient: principal}`

### aggregate-pubkeys

Tracks used aggregate public keys to prevent replay attacks.

- Key: `(buff 33)` (aggregate public key)
- Value: `bool`

### multi-sig-address

Tracks used multi-signature addresses to prevent replay attacks.

- Key: `principal` (multi-sig address)
- Value: `bool`

### protocol-contracts

Stores authorized protocol contract addresses.

- Key: `principal` (contract address)
- Value: `bool`

## Read-only Functions

### get-withdrawal-request

Retrieves a withdrawal request by its ID.

- Parameters:
  - `id`: `uint`
- Returns: `(optional {amount: uint, max-fee: uint, sender: principal, recipient: {version: (buff 1), hashbytes: (buff 32)}, block-height: uint, status: (optional bool)})`

### get-completed-deposit

Fetches a completed deposit by transaction ID and output index.

- Parameters:
  - `txid`: `(buff 32)`
  - `vout-index`: `uint`
- Returns: `(optional {amount: uint, recipient: principal})`

### get-current-signer-data

Returns current signer set information.

- Returns: `{current-signer-set: (list 128 (buff 33)), current-aggregate-pubkey: (buff 33), current-signer-principal: principal, current-signature-threshold: uint}`

### get-current-aggregate-pubkey

Returns the current aggregate public key.

- Returns: `(buff 33)`

### get-current-signer-principal

Returns the current signer's principal.

- Returns: `principal`

### get-current-signer-set

Returns the current set of signer public keys.

- Returns: `(list 128 (buff 33))`

## Public Functions

### create-withdrawal-request

Creates a new withdrawal request. Only callable by protocol contracts.

- Parameters:
  - `amount`: `uint`
  - `max-fee`: `uint`
  - `sender`: `principal`
  - `recipient`: `{version: (buff 1), hashbytes: (buff 32)}`
  - `height`: `uint`
- Returns: `(response uint uint)`

### complete-withdrawal-accept

Marks a withdrawal request as accepted.

- Parameters:
  - `request-id`: `uint`
  - `bitcoin-txid`: `(buff 32)`
  - `output-index`: `uint`
  - `signer-bitmap`: `uint`
  - `fee`: `uint`
- Returns: `(response bool uint)`

### complete-withdrawal-reject

Marks a withdrawal request as rejected.

- Parameters:
  - `request-id`: `uint`
  - `signer-bitmap`: `uint`
- Returns: `(response bool uint)`

### complete-deposit

Records a completed deposit transaction.

- Parameters:
  - `txid`: `(buff 32)`
  - `vout-index`: `uint`
  - `amount`: `uint`
  - `recipient`: `principal`
- Returns: `(response bool uint)`

### rotate-keys

Updates the signer set, multi-sig principal, and aggregate public key.

- Parameters:
  - `new-keys`: `(list 128 (buff 33))`
  - `new-address`: `principal`
  - `new-aggregate-pubkey`: `(buff 33)`
  - `new-signature-threshold`: `uint`
- Returns: `(response (buff 33) uint)`

## Private Functions

### increment-last-withdrawal-request-id

Increments and returns the next withdrawal request ID.

- Returns: `uint`

### is-protocol-caller

Checks if the caller is an authorized protocol contract.

- Returns: `(response bool uint)`

### validate-protocol-caller

Validates if a given principal is an authorized protocol contract.

- Parameters:
  - `caller`: `principal`
- Returns: `(response bool uint)`

## Events

The contract emits events (via `print`) for important actions:

- Withdrawal request creation: "withdrawal-create"
- Withdrawal acceptance: "withdrawal-accept"
- Withdrawal rejection: "withdrawal-reject"
- Deposit completion: "completed-deposit"

## Security Considerations

1. Access Control: Only authorized protocol contracts can call certain functions.
2. Replay Prevention: The contract prevents replay attacks on deposits, aggregate public keys, and multi-signature addresses.
3. State Management: The contract carefully manages the state of withdrawals and the current signer set.
