# Peg Wallet UTxO

The Peg Wallet UTxO is a fundamental element of the sBTC system, serving as the Bitcoin backing for all sBTC tokens in circulation. This system employs a Single UTxO Model, where the sBTC peg wallet is consistently represented as a single Unspent Transaction Output (UTxO) on the Bitcoin blockchain. This design choice offers simplicity and improved efficiency in managing the peg wallet.

UTxO management falls under the responsibility of the Signer coordinator. This entity consolidates all deposit and withdrawal requests, creating optimized batches that can be processed within a single UTxO. The new UTxO is created by spending the amount from the previous UTxO, adding confirmed deposits, and subtracting confirmed withdrawals.

The batching process is carefully optimized to maintain the single UTxO invariant while creating optimal batches. When multiple sBTC operation requests are present, the Signer coordinator groups them by approval sets. In scenarios where differing approval sets exist across active sBTC operations, the coordinator batches deposit UTxOs into groups with the maximum size per approval set.

This Single UTxO Model offers several advantages. It simplifies tracking and management, reduces the number of Bitcoin transactions required for sBTC operations, and centralizes funds in a single, well-secured output. These benefits contribute to the overall efficiency and security of the sBTC system.

Security is a paramount concern in this model. The single UTxO is managed by the sBTC Bootstrap Signer Set, which requires a threshold of signers to approve any spending. This multi-signature approach adds an extra layer of protection to the funds. Additionally, regular audits and continuous monitoring are essential to ensure that the UTxO accurately represents the total sBTC in circulation at all times.

By employing this streamlined approach, the Peg Wallet UTxO system maintains a balance between simplicity, efficiency, and security, forming a robust foundation for the sBTC ecosystem.
