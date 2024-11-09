# Emily API

[Emily](https://github.com/stacks-network/sbtc/tree/main/emily) is an API that helps facilitate and supervise the sBTC Bridge, serving as a programmatic liaison between sBTC users and signers.

## Overview

The Emily API is designed to track deposits and withdrawals, providing information about the status of in-flight sBTC operations. It serves two primary user groups: sBTC users and sBTC app developers.

## Why Emily?

The Emily API is given an indirect name because it handles more than just Deposits and Withdrawals; it can detect the health of the system and will likely be extended to handle more as user requirements mature. It was once called the “Revealer API”, which stopped making sense after a few design changes, and then “Deposit API” which also stopped making sense after a few changes. The most obvious choice “sBTC API” gives the wrong impression of what the API is responsible for as well, since the API itself isn’t managing the entirety of the protocol.

Large companies name their APIs after something loosely related but ambiguous enough that extensions of the API don’t make the original name of the API misleading. Following this, we chose “Emily” after Emily Warren Roebling who was the liaison between the builders and chief engineer, her husband, of the Brooklyn bridge. She was, in effect, the supervisor of the bridge’s construction; similarly, the Emily API supervises the sBTC bridge and liaises between the users of the protocol and the sBTC signers.

## Key Features

1. **Track Deposits**: Monitor the process of converting BTC to sBTC.
2. **Track Withdrawals**: Monitor the process of converting sBTC back to BTC.
3. **Provide Operation Status**: Offer real-time status updates for ongoing sBTC operations.
4. **Retrieve Historical Data**: Allow querying of past sBTC operations.

## Core Concepts

### sBTC Operations

sBTC operations are the fundamental processes tracked by Emily:

1. **Deposits**: Converting BTC to sBTC
2. **Withdrawals**: Converting sBTC back to BTC

### Operation States

Each sBTC operation goes through several states:

1. **PENDING**: The operation has been initiated.
2. **ACCEPTED**: The operation has been approved by the signers.
3. **CONFIRMED**: The operation has been completed and confirmed on the blockchain.
4. **FAILED**: The operation could not be completed.

## Interaction Flows

### Deposit Flow

1. User creates a deposit transaction on Bitcoin.
2. User submits proof of deposit to the Deposit API.
3. Emily records the deposit as PENDING.
4. Signers validate and vote on the deposit.
5. If accepted, Emily updates status to ACCEPTED.
6. Signers process the Bitcoin transaction.
7. Signers mint sBTC on Stacks.
8. Emily updates the deposit status to CONFIRMED.

### Withdrawal Flow

1. User initiates withdrawal through the sBTC Clarity contract.
2. Emily records the withdrawal as PENDING.
3. Signers decide to accept or reject the withdrawal.
4. If accepted, Emily updates status to ACCEPTED.
5. Signers process the Bitcoin transaction.
6. Signers burn sBTC on Stacks.
7. Emily updates the withdrawal status to CONFIRMED.
