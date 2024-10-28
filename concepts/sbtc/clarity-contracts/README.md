# sBTC Clarity Contracts Documentation

This document provides an overview and detailed explanation of the [sBTC Clarity contracts](https://github.com/stacks-network/sbtc/tree/main/contracts). These contracts are designed to facilitate the creation, management, and transfer of sBTC tokens on the Stacks blockchain.

## Contracts Overview

1. [sbtc-bootstrap-signers](#sbtc-bootstrap-signers)
2. [sbtc-deposit](#sbtc-deposit)
3. [sbtc-registry](#sbtc-registry)
4. [sbtc-token](#sbtc-token)
5. [sbtc-withdrawal](#sbtc-withdrawal)

## sbtc-bootstrap-signers

This contract manages the signer set for the sBTC protocol.

### Key Functions

- `rotate-keys-wrapper`: Rotates the keys of the signers when the signer set is updated.
- `pubkeys-to-spend-script`: Generates the p2sh redeem script for a multisig.
- `pubkeys-to-principal`: Generates a principal given a set of pubkeys and an m-of-n threshold.

### Constants

- `key-size`: The required length of public keys (33 bytes).
- `ERR_KEY_SIZE`: Error code for invalid key size.
- `ERR_INVALID_CALLER`: Error code for unauthorized function caller.
- `ERR_SIGNATURE_THRESHOLD`: Error code for invalid signature threshold.

## sbtc-deposit

This contract handles the deposit of BTC to mint sBTC.

### Key Functions

- `complete-deposit-wrapper`: Completes a deposit request, minting sBTC to the recipient.
- `complete-deposits-wrapper`: Handles multiple deposit requests in a single transaction.

### Constants

- `txid-length`: The required length of a transaction ID (32 bytes).
- `dust-limit`: The minimum amount of satoshis that can be deposited (546 sats).
- `ERR_TXID_LEN`: Error code for invalid transaction ID length.
- `ERR_DEPOSIT_REPLAY`: Error code for attempting to complete an already processed deposit.
- `ERR_LOWER_THAN_DUST`: Error code for deposits below the dust limit.
- `ERR_INVALID_CALLER`: Error code for unauthorized function caller.

## sbtc-registry

This contract serves as the central registry for the sBTC protocol, managing withdrawal requests, deposits, and signer data.

### Key Functions

- `create-withdrawal-request`: Creates a new withdrawal request.
- `complete-withdrawal-accept`: Marks a withdrawal request as accepted.
- `complete-withdrawal-reject`: Marks a withdrawal request as rejected.
- `complete-deposit`: Records a completed deposit.
- `rotate-keys`: Updates the signer set, multi-sig principal, and aggregate public key.

### Data Structures

- `withdrawal-requests`: Map storing withdrawal request details.
- `withdrawal-status`: Map storing the status of withdrawal requests.
- `completed-deposits`: Map storing completed deposit information.
- `aggregate-pubkeys`: Map storing aggregate public keys to prevent replay attacks.
- `multi-sig-address`: Map storing multi-sig addresses to prevent replay attacks.
- `protocol-contracts`: Map storing active protocol contracts.

## sbtc-token

This contract implements the sBTC token, following the [SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md) fungible token standard.

### Key Functions

- `protocol-transfer`: Transfers sBTC between accounts (only callable by protocol contracts).
- `protocol-lock`: Locks sBTC by burning tokens and minting locked tokens.
- `protocol-unlock`: Unlocks sBTC by burning locked tokens and minting regular tokens.
- `protocol-mint`: Mints new sBTC tokens.
- `protocol-burn`: Burns sBTC tokens.
- `transfer`: Transfers sBTC tokens (implements SIP-010).

### Token Properties

- `token-name`: The name of the token ("sBTC").
- `token-symbol`: The symbol of the token ("sBTC").
- `token-uri`: Optional URI for token metadata.
- `token-decimals`: The number of decimal places for the token (8).

## sbtc-withdrawal

This contract handles the withdrawal of sBTC to receive BTC.

### Key Functions

- `initiate-withdrawal-request`: Initiates a new withdrawal request.
- `accept-withdrawal-request`: Accepts and processes a withdrawal request.
- `reject-withdrawal-request`: Rejects a withdrawal request.
- `complete-withdrawals`: Processes multiple withdrawal requests in a single transaction.

### Constants

- `MAX_ADDRESS_VERSION`: Maximum value of a valid address version (6).
- `MAX_ADDRESS_VERSION_BUFF_20`: Maximum address version for 20-byte hash addresses (4).
- `MAX_ADDRESS_VERSION_BUFF_32`: Maximum address version for 32-byte hash addresses (6).
- `DUST_LIMIT`: Minimum amount of sBTC that can be withdrawn (546 sats).

### Error Codes

- `ERR_INVALID_ADDR_VERSION`: Invalid address version.
- `ERR_INVALID_ADDR_HASHBYTES`: Invalid address hash bytes.
- `ERR_DUST_LIMIT`: Withdrawal amount below dust limit.
- `ERR_INVALID_REQUEST`: Invalid withdrawal request ID.
- `ERR_INVALID_CALLER`: Unauthorized function caller.
- `ERR_ALREADY_PROCESSED`: Withdrawal request already processed.
- `ERR_FEE_TOO_HIGH`: Paid fee higher than requested.

## Conclusion

Collectively, these contracts work together to create a decentralized system for managing sBTC, a synthetic representation of Bitcoin on the Stacks blockchain. The contracts handle key operations such as minting sBTC through deposits, burning sBTC through withdrawals, managing the signer set, and maintaining the overall state of the protocol.
