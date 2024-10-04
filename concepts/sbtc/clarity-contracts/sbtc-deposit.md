# sBTC Deposit Contract Documentation

This document provides a comprehensive overview of the sBTC Deposit contract implemented in Clarity. The contract manages the process of completing deposits for the sBTC system, including validation and minting of sBTC tokens.

## Table of Contents

1. [Constants](#constants)
2. [Error Codes](#error-codes)
3. [Public Functions](#public-functions)
4. [Private Functions](#private-functions)

## Constants

The contract defines two important constants:

```clarity
(define-constant txid-length u32)
(define-constant dust-limit u546)
```

- `txid-length`: Sets the required length of a transaction ID (txid) to 32 bytes.
- `dust-limit`: Defines the minimum amount for a deposit, set to 546 satoshis.

## Error Codes

The contract defines several error codes for various scenarios:

```clarity
(define-constant ERR_TXID_LEN (err u300))
(define-constant ERR_DEPOSIT_REPLAY (err u301))
(define-constant ERR_LOWER_THAN_DUST (err u302))
(define-constant ERR_DEPOSIT (err u303))
(define-constant ERR_INVALID_CALLER (err u304))
```

- `ERR_TXID_LEN`: Indicates that the TXID used in the deposit is not the correct length (error code 300).
- `ERR_DEPOSIT_REPLAY`: Indicates that the deposit has already been completed (error code 301).
- `ERR_LOWER_THAN_DUST`: Indicates that the deposit amount is lower than the dust limit (error code 302).
- `ERR_DEPOSIT`: A general error code for deposit-related issues (error code 303).
- `ERR_INVALID_CALLER`: Indicates that the function caller is not authorized (error code 304).

There's also a special error code prefix for individual deposit errors:

```clarity
(define-constant ERR_DEPOSIT_INDEX_PREFIX (unwrap-err! ERR_DEPOSIT (err true)))
```

This is used to generate unique error codes for each deposit in a batch that might fail.

## Public Functions

### complete-deposit-wrapper

This function handles a single deposit request, including validation and minting of sBTC.

```clarity
(define-public (complete-deposit-wrapper (txid (buff 32)) (vout-index uint) (amount uint) (recipient principal))
    ;; Function body...
)
```

Parameters:

- `txid`: The transaction ID of the deposit (32 bytes).
- `vout-index`: The index of the transaction output.
- `amount`: The amount of the deposit.
- `recipient`: The principal (address) to receive the minted sBTC.

The function performs several checks:

1. Verifies that the caller is the current signer principal.
2. Checks that the deposit amount is greater than or equal to the dust limit.
3. Verifies that the txid has the correct length (32 bytes).
4. Ensures that the deposit has not already been completed (no replay).

If all checks pass, it mints the sBTC to the recipient and calls the `complete-deposit` function in the `.sbtc-registry` contract to update the protocol state.

### complete-deposits-wrapper

This function handles multiple deposit requests in a single transaction (up to 650 deposits).

```clarity
(define-public (complete-deposits-wrapper (deposits (list 650 {txid: (buff 32), vout-index: uint, amount: uint, recipient: principal})))
    ;; Function body...
)
```

Parameters:

- `deposits`: A list of up to 650 deposit structures, each containing a txid, vout-index, amount, and recipient.

The function first checks that the caller is the current signer principal. Then it uses a fold operation with the `complete-individual-deposits-helper` function to process each deposit in the list.

## Private Functions

### complete-individual-deposits-helper

This private function is used by `complete-deposits-wrapper` to process individual deposits in a batch.

```clarity
(define-private (complete-individual-deposits-helper (deposit {txid: (buff 32), vout-index: uint, amount: uint, recipient: principal}) (helper-response (response uint uint)))
    ;; Function body...
)
```

It calls `complete-deposit-wrapper` for each deposit and handles any errors that may occur during processing. If an error occurs, it generates a unique error code using the `ERR_DEPOSIT_INDEX_PREFIX`.

## Important Notes

1. Both `complete-deposit-wrapper` and `complete-deposits-wrapper` can only be called by the current bootstrap signer set address. They cannot be called directly by users.

2. The contract interacts with two other contracts:

   - `.sbtc-registry`: To get the current signer data and complete deposits.
   - `.sbtc-token`: To mint sBTC tokens.

3. The contract includes safeguards against replay attacks and ensures that deposit amounts are above the dust limit.

## Conclusion

This contract provides essential functionality for managing deposits in the sBTC system. It includes robust error checking, supports both single and batch deposits, and interacts with other contracts in the sBTC ecosystem to maintain the protocol's state. The contract's design prioritizes security and efficiency in handling Bitcoin to Stacks bridge operations.
