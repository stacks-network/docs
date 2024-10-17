# Transaction Fee Sponsorship

Transaction Fee Sponsorship is a feature in sBTC that allows users to pay for Stacks transaction fees using sBTC instead of STX.

## Overview

- sBTC transactions on Stacks can be sponsored in return for some sBTC.
- This feature improves user experience by allowing sBTC holders to use their tokens for gas fees.

## Implementation

The fee sponsorship system is implemented using the approach suggested in [stacks-network/stacks-core#4235](https://github.com/stacks-network/stacks-core/issues/4235).

Key points:

1. sBTC users can get support from existing STX holders for transaction fees.
2. The sponsor pays the STX fee and receives sBTC in return.

## User Experience

From a user's perspective:

1. When initiating an sBTC transaction, they can opt for fee sponsorship.
2. The user agrees to pay a small amount of sBTC for the sponsorship.
3. The transaction is then processed with the fees paid in STX by the sponsor.

## Benefits

1. **Improved UX**: Users don't need to hold STX to use sBTC.
2. **Lower Barrier to Entry**: New users can start using sBTC without first acquiring STX.
3. **Flexibility**: Provides an additional option for handling transaction fees.
