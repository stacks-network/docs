# Peg Wallet UTxO

The Peg Wallet UTxO is a crucial component of the sBTC system, representing the Bitcoin backing for all sBTC tokens in circulation.

## Single UTxO Model

The sBTC peg wallet is always represented as a single Unspent Transaction Output (UTxO) on the Bitcoin blockchain. This design choice simplifies management and improves efficiency.

## UTxO Management

The Signer coordinator is responsible for managing this single UTxO:

1. It consolidates all deposit and withdrawal requests.
2. It creates best-effort batches that can be used in a single UTxO.
3. The new UTxO spends the amount in the previous UTxO plus any confirmed deposits, minus any confirmed withdrawals.

## Batching Process

The batching process is optimized to maintain the single UTxO invariant while creating optimal batches:

1. When there are multiple sBTC operation requests, the Signer coordinator groups them by approval sets.
2. In cases where there are differing approval sets across all active sBTC operations, the Signer coordinator will batch the deposit UTxOs into groups that have the maximum group size per approval set.

## Advantages of the Single UTxO Model

1. **Simplicity**: Easier to track and manage a single UTxO.
2. **Efficiency**: Reduces the number of Bitcoin transactions needed for sBTC operations.
3. **Security**: Centralizes the funds in a single, well-secured output.

## Security Considerations

- The single UTxO is managed by the sBTC Bootstrap Signer Set, requiring a threshold of signers to approve any spending.
- Regular audits and monitoring are crucial to ensure the UTxO always accurately represents the total sBTC in circulation.
