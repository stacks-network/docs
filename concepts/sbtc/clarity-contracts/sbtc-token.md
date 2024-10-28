# sBTC Token Contract Documentation

## Overview

The [sBTC Token contract](https://github.com/stacks-network/sbtc/blob/main/contracts/contracts/sbtc-token.clar) (`sbtc-token.clar`) implements the fungible token functionality for sBTC. It manages both unlocked and locked sBTC tokens and provides functions for minting, burning, transferring, and querying token information. sBTC is a SIP-010 standard fungible token.

## Constants

- `ERR_NOT_OWNER` (u4): Error when the sender tries to move a token they don't own.
- `ERR_NOT_AUTH` (u5): Error when the caller is not an authorized protocol caller.
- `token-decimals` (u8): The number of decimal places for the token.

## Fungible Tokens

- `sbtc-token`: The main sBTC fungible token.
- `sbtc-token-locked`: Represents locked sBTC tokens.

## Data Variables

- `token-name`: The name of the token (default: "sBTC").
- `token-symbol`: The symbol of the token (default: "sBTC").
- `token-uri`: An optional URI for token metadata.

## Protocol Functions

These functions can only be called by authorized protocol contracts:

### protocol-transfer

Transfers tokens between principals.

- Parameters: `amount: uint`, `sender: principal`, `recipient: principal`
- Returns: `(response bool uint)`

### protocol-lock

Locks a specified amount of tokens for a user.

- Parameters: `amount: uint`, `owner: principal`
- Returns: `(response bool uint)`

### protocol-unlock

Unlocks a specified amount of tokens for a user.

- Parameters: `amount: uint`, `owner: principal`
- Returns: `(response bool uint)`

### protocol-mint

Mints new tokens for a recipient.

- Parameters: `amount: uint`, `recipient: principal`
- Returns: `(response bool uint)`

### protocol-burn

Burns tokens from an owner's balance.

- Parameters: `amount: uint`, `owner: principal`
- Returns: `(response bool uint)`

### protocol-burn-locked

Burns locked tokens from an owner's balance.

- Parameters: `amount: uint`, `owner: principal`
- Returns: `(response bool uint)`

### protocol-set-name

Sets a new name for the token.

- Parameters: `new-name: (string-ascii 32)`
- Returns: `(response bool uint)`

### protocol-set-symbol

Sets a new symbol for the token.

- Parameters: `new-symbol: (string-ascii 10)`
- Returns: `(response bool uint)`

### protocol-set-token-uri

Sets a new URI for the token metadata.

- Parameters: `new-uri: (optional (string-utf8 256))`
- Returns: `(response bool uint)`

### protocol-mint-many

Mints tokens for multiple recipients in a single transaction.

- Parameters: `recipients: (list 200 {amount: uint, recipient: principal})`
- Returns: `(response (list 200 (response bool uint)) uint)`

## Public Functions (SIP-010 Trait)

### transfer

Transfers tokens between users.

- Parameters: `amount: uint`, `sender: principal`, `recipient: principal`, `memo: (optional (buff 34))`
- Returns: `(response bool uint)`

### get-name

Returns the token name.

- Returns: `(response (string-ascii 32) uint)`

### get-symbol

Returns the token symbol.

- Returns: `(response (string-ascii 10) uint)`

### get-decimals

Returns the number of decimal places.

- Returns: `(response uint uint)`

### get-balance

Returns the total balance (locked + unlocked) for a principal.

- Parameters: `who: principal`
- Returns: `(response uint uint)`

### get-balance-available

Returns the available (unlocked) balance for a principal.

- Parameters: `who: principal`
- Returns: `(response uint uint)`

### get-balance-locked

Returns the locked balance for a principal.

- Parameters: `who: principal`
- Returns: `(response uint uint)`

### get-total-supply

Returns the total supply of tokens (locked + unlocked).

- Returns: `(response uint uint)`

### get-token-uri

Returns the token metadata URI.

- Returns: `(response (optional (string-utf8 256)) uint)`

## Private Functions

### protocol-mint-many-iter

Helper function for minting tokens to multiple recipients.

- Parameters: `item: {amount: uint, recipient: principal}`
- Returns: `(response bool uint)`

## Security Considerations

1. Access Control: Protocol functions can only be called by authorized contracts, enforced through the `sbtc-registry` contract.
2. Ownership Verification: The `transfer` function checks that the sender owns the tokens being transferred.
3. Separate Token Tracking: The contract maintains separate tracking for locked and unlocked tokens, ensuring proper accounting.

## Interactions with Other Contracts

- `.sbtc-registry`: Used to validate protocol callers for privileged operations.
