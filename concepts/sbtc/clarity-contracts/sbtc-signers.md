# sBTC Signers Contract Documentation

## Overview

The [sBTC Signers contract](https://github.com/stacks-network/sbtc/blob/main/contracts/contracts/sbtc-bootstrap-signers.clar) (`sbtc-bootstrap-signers.clar`) manages the signer set for the sBTC system. It handles the rotation of signer keys and provides utilities for generating multisig addresses.

## Constants

- `key-size`: The required length of public keys (33 bytes).

## Error Constants

- `ERR_KEY_SIZE_PREFIX`: Prefix for key size errors in batch processing.
- `ERR_KEY_SIZE` (u200): Indicates that a provided key is not the correct length.
- `ERR_INVALID_CALLER` (u201): Signifies that the function caller is not the current signer principal.
- `ERR_SIGNATURE_THRESHOLD` (u202): Indicates an invalid signature threshold (must be >50% and ≤100% of total signer keys).

## Public Functions

### rotate-keys-wrapper

Rotates the keys of the signers. Called when the signer set is updated.

- Parameters:
  - `new-keys`: `(list 128 (buff 33))` - List of new signer public keys
  - `new-aggregate-pubkey`: `(buff 33)` - New aggregate public key
  - `new-signature-threshold`: `uint` - New signature threshold
- Returns: `(response (buff 33) uint)`

Function flow:

1. Validates the new signature threshold.
2. Verifies that the caller is the current signer principal.
3. Checks the length of each new key and the aggregate public key.
4. Calls the sBTC Registry contract to update the keys and address.

## Read-only Functions

### pubkeys-to-spend-script

Generates the p2sh redeem script for a multisig.

- Parameters:
  - `pubkeys`: `(list 128 (buff 33))` - List of public keys
  - `m`: `uint` - Number of required signatures
- Returns: `(buff 1024)` - The p2sh redeem script

### pubkeys-to-hash

Computes the hash160 of the p2sh redeem script.

- Parameters:
  - `pubkeys`: `(list 128 (buff 33))` - List of public keys
  - `m`: `uint` - Number of required signatures
- Returns: `(buff 20)` - The hash160 of the redeem script

### pubkeys-to-principal

Generates a principal (Stacks address) from a set of pubkeys and an m-of-n threshold.

- Parameters:
  - `pubkeys`: `(list 128 (buff 33))` - List of public keys
  - `m`: `uint` - Number of required signatures
- Returns: `principal` - The generated Stacks address

### pubkeys-to-bytes

Concatenates a list of pubkeys into a buffer with length prefixes.

- Parameters:
  - `pubkeys`: `(list 128 (buff 33))` - List of public keys
- Returns: `(buff 510)` - Concatenated pubkeys with length prefixes

### concat-pubkeys-fold

Concatenates a pubkey buffer with a length prefix.

- Parameters:
  - `pubkey`: `(buff 33)` - A single public key
  - `iterator`: `(buff 510)` - Accumulator for concatenation
- Returns: `(buff 510)` - Updated concatenated buffer

### bytes-len

Returns the length of a byte buffer as a single byte.

- Parameters:
  - `bytes`: `(buff 33)` - Input byte buffer
- Returns: `(buff 1)` - Length as a single byte

### uint-to-byte

Converts a uint to a single byte.

- Parameters:
  - `n`: `uint` - Input number
- Returns: `(buff 1)` - Number as a single byte

## Private Functions

### signer-key-length-check

Checks that the length of each key is exactly 33 bytes.

- Parameters:
  - `current-key`: `(buff 33)` - Public key to check
  - `helper-response`: `(response uint uint)` - Accumulator for error handling
- Returns: `(response uint uint)` - Updated accumulator or error

## Constants

### BUFF_TO_BYTE

A constant list mapping uint values (0-255) to their corresponding byte representations.

## Interactions with Other Contracts

- `.sbtc-registry`: Calls `get-current-signer-data` and `rotate-keys` to manage signer data.

## Security Considerations

1. Access Control: Only the current signer principal can call the key rotation function.
2. Key Validation: Ensures all provided keys are the correct length.
3. Signature Threshold: Enforces a minimum threshold of over 50% of signers and a maximum of 100%.
4. Multisig Generation: Provides utilities for secure generation of multisig addresses.
