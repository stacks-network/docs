# sBTC Deposit Contract Documentation

## Overview

The [sBTC Deposit contract](https://github.com/stacks-network/sbtc/blob/main/contracts/contracts/sbtc-deposit.clar) (`sbtc-deposit.clar`) manages the deposit process for the sBTC system. It handles the validation and minting of sBTC tokens when users deposit Bitcoin, and interacts with the sBTC Registry contract to update the protocol state.

## Constants

- `txid-length`: The required length of a transaction ID (32 bytes).
- `dust-limit`: The minimum amount for a valid deposit (546 satoshis).

## Error Constants

- `ERR_TXID_LEN` (u300): Indicates that the provided transaction ID is not the correct length.
- `ERR_DEPOSIT_REPLAY` (u301): Signifies an attempt to replay a deposit that has already been completed.
- `ERR_LOWER_THAN_DUST` (u302): Indicates that the deposit amount is below the dust limit.
- `ERR_DEPOSIT_INDEX_PREFIX`: Used as a prefix for deposit-related errors in batch processing.
- `ERR_DEPOSIT` (u303): General deposit error.
- `ERR_INVALID_CALLER` (u304): Indicates that the caller is not authorized to perform the operation.

## Public Functions

### complete-deposit-wrapper

Processes a single deposit request.

- Parameters:
  - `txid`: `(buff 32)` - The Bitcoin transaction ID
  - `vout-index`: `uint` - The output index of the deposit transaction
  - `amount`: `uint` - The amount of sBTC to mint (in satoshis)
  - `recipient`: `principal` - The Stacks address to receive the minted sBTC
- Returns: `(response bool uint)`

Function flow:

1. Verifies that the caller is the current signer principal.
2. Checks that the deposit amount is above the dust limit.
3. Validates the transaction ID length.
4. Ensures the deposit hasn't been processed before (prevents replay).
5. Mints sBTC tokens to the recipient.
6. Updates the deposit state in the sBTC Registry contract.

### complete-deposits-wrapper

Processes multiple deposit requests in a single transaction.

- Parameters:
  - `deposits`: `(list 650 {txid: (buff 32), vout-index: uint, amount: uint, recipient: principal})` - List of deposit data
- Returns: `(response uint uint)`

Function flow:

1. Verifies that the caller is the current signer principal.
2. Iterates through the list of deposits, processing each one using the `complete-individual-deposits-helper` function.

## Private Functions

### complete-individual-deposits-helper

Helper function to process individual deposits within the batch operation.

- Parameters:
  - `deposit`: `{txid: (buff 32), vout-index: uint, amount: uint, recipient: principal}` - Single deposit data
  - `helper-response`: `(response uint uint)` - Accumulator for tracking processed deposits
- Returns: `(response uint uint)`

Function flow:

1. Calls `complete-deposit-wrapper` for the individual deposit.
2. If successful, increments the processed deposit count.
3. If an error occurs, it's propagated with additional index information.

## Interactions with Other Contracts

- `.sbtc-registry`: Calls `get-current-signer-data`, `get-completed-deposit`, and `complete-deposit` to manage deposit state.
- `.sbtc-token`: Calls `protocol-mint` to create new sBTC tokens.

## Security Considerations

1. Access Control: Only the current signer principal can call the deposit completion functions.
2. Replay Prevention: The contract checks for previously processed deposits to prevent replay attacks.
3. Dust Limit: Enforces a minimum deposit amount to prevent spam and ensure economic viability.
4. Transaction ID Validation: Ensures the provided transaction ID is the correct length.
