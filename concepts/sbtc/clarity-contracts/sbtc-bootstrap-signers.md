# sBTC Bootstrap Signers Contract Documentation

This document provides a comprehensive overview of the sBTC Bootstrap Signers contract implemented in Clarity. The contract manages the rotation of signer keys for the sBTC system and includes utilities for multisignature address generation.

## Table of Contents

1. [Constants](#constants)
2. [Error Codes](#error-codes)
3. [Public Functions](#public-functions)
4. [Read-Only Functions](#read-only-functions)
5. [Private Functions](#private-functions)
6. [Utility Functions](#utility-functions)

## Constants

The contract defines several constants:

```clarity
(define-constant key-size u33)
```

This constant sets the required length of public keys to 33 bytes.

## Error Codes

The contract defines several error codes for various scenarios:

```clarity
(define-constant ERR_KEY_SIZE (err u200))
(define-constant ERR_INVALID_CALLER (err u201))
(define-constant ERR_SIGNATURE_THRESHOLD (err u202))
```

- `ERR_KEY_SIZE`: Indicates an issue with the key size (error code 200).
- `ERR_INVALID_CALLER`: Indicates that the function caller is not the current signer principal (error code 201).
- `ERR_SIGNATURE_THRESHOLD`: Indicates an invalid signature threshold (error code 202).

There's also a special error code prefix for individual key size errors:

```clarity
(define-constant ERR_KEY_SIZE_PREFIX (unwrap-err! ERR_KEY_SIZE (err true)))
```

This is used to generate unique error codes for each key in a list that might have an incorrect size.

## Public Functions

### rotate-keys-wrapper

This function is used to rotate the keys of the signers. It's called whenever the signer set is updated.

```clarity
(define-public (rotate-keys-wrapper
    (new-keys (list 128 (buff 33)))
    (new-aggregate-pubkey (buff 33))
    (new-signature-threshold uint)
  )
  ;; Function body...
)
```

Parameters:

- `new-keys`: A list of up to 128 new public keys, each 33 bytes long.
- `new-aggregate-pubkey`: The new aggregate public key, 33 bytes long.
- `new-signature-threshold`: The new signature threshold.

The function performs several checks:

1. Verifies that the signature threshold is valid (> 50% and <= 100% of the total number of signer keys).
2. Checks that the caller is the current signer principal.
3. Verifies that each new key has the correct length (33 bytes).
4. Checks that the new aggregate public key has the correct length (33 bytes).

If all checks pass, it calls the `rotate-keys` function in the `.sbtc-registry` contract to update the keys and address.

## Read-Only Functions

### pubkeys-to-spend-script

Generates the p2sh redeem script for a multisig.

```clarity
(define-read-only (pubkeys-to-spend-script
    (pubkeys (list 128 (buff 33)))
    (m uint)
  )
  ;; Function body...
)
```

### pubkeys-to-hash

Computes the hash160 of the p2sh redeem script.

```clarity
(define-read-only (pubkeys-to-hash
    (pubkeys (list 128 (buff 33)))
    (m uint)
  )
  ;; Function body...
)
```

### pubkeys-to-principal

Generates a principal given a set of pubkeys and an m-of-n threshold.

```clarity
(define-read-only (pubkeys-to-principal
    (pubkeys (list 128 (buff 33)))
    (m uint)
  )
  ;; Function body...
)
```

### pubkeys-to-bytes

Concatenates a list of pubkeys into a buffer with length prefixes.

```clarity
(define-read-only (pubkeys-to-bytes (pubkeys (list 128 (buff 33))))
  ;; Function body...
)
```

### concat-pubkeys-fold

Concatenates a pubkey buffer with a length prefix.

```clarity
(define-read-only (concat-pubkeys-fold (pubkey (buff 33)) (iterator (buff 510)))
  ;; Function body...
)
```

## Private Functions

### signer-key-length-check

Checks that the length of each key is exactly 33 bytes.

```clarity
(define-private (signer-key-length-check (current-key (buff 33)) (helper-response (response uint uint)))
  ;; Function body...
)
```

## Utility Functions

The contract includes several utility functions for working with bytes and integers:

### bytes-len

Returns the length of a byte buffer as a single byte.

```clarity
(define-read-only (bytes-len (bytes (buff 33)))
  ;; Function body...
)
```

### uint-to-byte

Converts a uint to a single byte.

```clarity
(define-read-only (uint-to-byte (n uint))
  ;; Function body...
)
```

### BUFF_TO_BYTE

A constant list that maps uint values (0-255) to their corresponding byte representations.

```clarity
(define-constant BUFF_TO_BYTE (list
  0x00 0x01 0x02 0x03 ...
))
```

This constant is used by the `bytes-len` and `uint-to-byte` functions to perform efficient conversions.

## Conclusion

This contract provides essential functionality for managing signer keys in the sBTC system. It includes robust error checking and utility functions for working with public keys and generating multisignature addresses. The contract interacts with the `.sbtc-registry` contract to update signer information when keys are rotated.
