# Emily API

[Emily](https://github.com/stacks-network/sbtc/tree/main/emily) is an API that helps facilitate and supervise the sBTC Bridge, serving as a programmatic liaison between sBTC users and signers.

## Overview

The Emily API is designed to track deposits and withdrawals, providing information about the status of in-flight sBTC operations. It serves two primary user groups: sBTC users and sBTC app developers.

## Why Emily?

The Emily API is given an indirect name because it handles more than just Deposits and Withdrawals; it can detect the health of the system and will likely be extended to handle more as user requirements mature. It was once called the “Revealer API”, which stopped making sense after a few design changes, and then “Deposit API” which also stopped making sense after a few changes. The most obvious choice “sBTC API” gives the wrong impression of what the API is responsible for as well, since the API itself isn’t managing the entirety of the protocol.

Large companies name their APIs after something loosely related but ambiguous enough that extensions of the API don’t make the original name of the API misleading. Following this, we chose “Emily” after Emily Warren Roebling who was the liaison between the builders and chief engineer, her husband, of the Brooklyn bridge. She was, in effect, the supervisor of the bridge’s construction; similarly, the Emily API supervises the sBTC bridge and liaises between the users of the protocol and the sBTC signers.

## Key Features

* Track Deposits: Monitor the process of converting BTC to sBTC.
* Track Withdrawals: Monitor the process of converting sBTC back to BTC.
* Provide Operation Status: Offer real-time status updates for ongoing sBTC operations.
* Retrieve Historical Data: Allow querying of past sBTC operations.

## Core Concepts

### sBTC Operations

sBTC operations are the fundamental processes tracked by Emily:

* Deposits: Converting BTC to sBTC
* Withdrawals: Converting sBTC back to BTC

### Operation States

Each sBTC operation goes through several states:

* PENDING: The operation has been initiated.
* ACCEPTED: The operation has been approved by the signers.
* CONFIRMED: The operation has been completed and confirmed on the blockchain.
* FAILED: The operation could not be completed.

## Interaction Flows

### Deposit Flow

{% stepper %}
{% step %}
### User creates a deposit transaction on Bitcoin

User creates a deposit transaction on Bitcoin.
{% endstep %}

{% step %}
### User submits proof of deposit to the Deposit API

User submits proof of deposit to the Deposit API.
{% endstep %}

{% step %}
### Emily records the deposit as PENDING

Emily records the deposit as PENDING.
{% endstep %}

{% step %}
### Signers validate and vote on the deposit

Signers validate and vote on the deposit.
{% endstep %}

{% step %}
### If accepted, Emily updates status to ACCEPTED

If accepted, Emily updates status to ACCEPTED.
{% endstep %}

{% step %}
### Signers process the Bitcoin transaction

Signers process the Bitcoin transaction.
{% endstep %}

{% step %}
### Signers mint sBTC on Stacks

Signers mint sBTC on Stacks.
{% endstep %}

{% step %}
### Emily updates the deposit status to CONFIRMED

Emily updates the deposit status to CONFIRMED.
{% endstep %}
{% endstepper %}

### Withdrawal Flow

{% stepper %}
{% step %}
### User initiates withdrawal through the sBTC Clarity contract

User initiates withdrawal through the sBTC Clarity contract.
{% endstep %}

{% step %}
### Emily records the withdrawal as PENDING

Emily records the withdrawal as PENDING.
{% endstep %}

{% step %}
### Signers decide to accept or reject the withdrawal

Signers decide to accept or reject the withdrawal.
{% endstep %}

{% step %}
### If accepted, Emily updates status to ACCEPTED

If accepted, Emily updates status to ACCEPTED.
{% endstep %}

{% step %}
### Signers process the Bitcoin transaction

Signers process the Bitcoin transaction.
{% endstep %}

{% step %}
### Signers burn sBTC on Stacks

Signers burn sBTC on Stacks.
{% endstep %}

{% step %}
### Emily updates the withdrawal status to CONFIRMED

Emily updates the withdrawal status to CONFIRMED.
{% endstep %}
{% endstepper %}
