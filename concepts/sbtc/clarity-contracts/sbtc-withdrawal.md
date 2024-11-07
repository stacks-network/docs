# sBTC Withdrawal Contract Documentation

## Overview

The [sBTC Withdrawal contract](https://github.com/stacks-network/sbtc/blob/main/contracts/contracts/sbtc-withdrawal.clar) (`sbtc-withdrawal.clar`) manages the withdrawal process for the sBTC system. It handles the initiation, acceptance, and rejection of withdrawal requests, ensuring proper validation and interaction with other sBTC contracts.

## Constants

### Error Codes

- `ERR_INVALID_ADDR_VERSION` (u500): Invalid address version.
- `ERR_INVALID_ADDR_HASHBYTES` (u501): Invalid address hashbytes.
- `ERR_DUST_LIMIT` (u502): Withdrawal amount below dust limit.
- `ERR_INVALID_REQUEST` (u503): Invalid withdrawal request ID.
- `ERR_INVALID_CALLER` (u504): Caller is not the current signer principal.
- `ERR_ALREADY_PROCESSED` (u505): Withdrawal request already processed.
- `ERR_FEE_TOO_HIGH` (u505): Paid fee higher than requested.
- `ERR_WITHDRAWAL_INDEX_PREFIX`: Prefix for withdrawal index errors.
- `ERR_WITHDRAWAL_INDEX` (u506): General withdrawal index error.

### Other Constants

- `MAX_ADDRESS_VERSION` (u6): Maximum value of an address version.
- `MAX_ADDRESS_VERSION_BUFF_20` (u4): Maximum version for 20-byte hashbytes.
- `MAX_ADDRESS_VERSION_BUFF_32` (u6): Maximum version for 32-byte hashbytes.
- `DUST_LIMIT` (u546): Minimum amount of sBTC for withdrawal.

## Public Functions

### initiate-withdrawal-request

Initiates a new withdrawal request.

- Parameters:
  - `amount`: `uint` - Amount of sBTC to withdraw
  - `recipient`: `{ version: (buff 1), hashbytes: (buff 32) }` - Bitcoin address details
  - `max-fee`: `uint` - Maximum fee for the withdrawal
- Returns: `(response uint uint)`

### accept-withdrawal-request

Accepts a withdrawal request.

- Parameters:
  - `request-id`: `uint` - Withdrawal request ID
  - `bitcoin-txid`: `(buff 32)` - Bitcoin transaction ID
  - `signer-bitmap`: `uint` - Bitmap of signers
  - `output-index`: `uint` - Output index in the Bitcoin transaction
  - `fee`: `uint` - Actual fee paid
- Returns: `(response bool uint)`

### reject-withdrawal-request

Rejects a withdrawal request.

- Parameters:
  - `request-id`: `uint` - Withdrawal request ID
  - `signer-bitmap`: `uint` - Bitmap of signers
- Returns: `(response bool uint)`

### complete-withdrawals

Processes multiple withdrawal requests (accept or reject).

- Parameters:
  - `withdrawals`: `(list 600 {...})` - List of withdrawal details
- Returns: `(response uint uint)`

## Read-only Functions

### validate-recipient

Validates the recipient's Bitcoin address format.

- Parameters:
  - `recipient`: `{ version: (buff 1), hashbytes: (buff 32) }` - Bitcoin address details
- Returns: `(response bool uint)`

## Private Functions

### complete-individual-withdrawal-helper

Helper function to process individual withdrawals in the batch operation.

- Parameters:
  - `withdrawal`: `{...}` - Individual withdrawal details
  - `helper-response`: `(response uint uint)` - Accumulator for processing
- Returns: `(response uint uint)`

## Interactions with Other Contracts

- `.sbtc-token`: Calls `protocol-lock`, `protocol-burn-locked`, `protocol-mint`, and `protocol-unlock` for token operations.
- `.sbtc-registry`: Calls `create-withdrawal-request`, `get-withdrawal-request`, `get-current-signer-data`, `complete-withdrawal-accept`, and `complete-withdrawal-reject` for managing withdrawal requests and signer data.

## Security Considerations

1. Access Control: Only the current signer principal can accept or reject withdrawal requests.
2. Dust Limit: Enforces a minimum withdrawal amount to prevent spam and ensure economic viability.
3. Fee Management: Ensures that the actual fee doesn't exceed the maximum fee set by the user.
4. Address Validation: Implements thorough validation of Bitcoin address formats.
5. State Management: Prevents double-processing of withdrawal requests.

## Bitcoin Address Types

The contract supports various Bitcoin address types, including:

- P2PKH (Pay-to-Public-Key-Hash)
- P2SH (Pay-to-Script-Hash)
- P2SH-P2WPKH (P2SH nested P2WPKH)
- P2SH-P2WSH (P2SH nested P2WSH)
- P2WPKH (Pay-to-Witness-Public-Key-Hash)
- P2WSH (Pay-to-Witness-Script-Hash)
- P2TR (Pay-to-Taproot)

Each address type is represented by a specific version byte and hashbytes format in the recipient structure.
