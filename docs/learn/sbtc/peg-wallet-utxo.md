# Peg Wallet UTXO

The Peg Wallet UTXO is a fundamental element of the sBTC system, serving as the Bitcoin backing for all sBTC tokens in circulation. The system uses a Single UTXO Model: the sBTC peg wallet is consistently represented as a single Unspent Transaction Output (UTXO) on the Bitcoin blockchain. This design offers simplicity and improved efficiency in managing the peg wallet.

## Overview

* Single UTXO Model: the peg wallet is always a single UTXO.
* Responsibility: UTXO management is performed by the Signer set.
* Purpose: simplify tracking and management, reduce Bitcoin transactions required for sBTC operations, and centralize funds in a single, well-secured output.

## How the Single UTXO is maintained

{% stepper %}
{% step %}
#### Constructing the new UTXO

A Signer coordinator constructs the UTXO by creating a new Bitcoin output that will represent the peg wallet going forward.
{% endstep %}

{% step %}
#### Consolidating requests into a batch

The Signer set collectively consolidates all deposit and withdrawal requests and creates optimized batches that can be processed within a single UTXO.
{% endstep %}

{% step %}
#### Creating the new UTXO from the previous UTXO

The new UTXO is created by:

* spending the amount from the previous UTXO,
* adding confirmed deposits,
* subtracting confirmed withdrawals.
{% endstep %}

{% step %}
#### Optimizing batching with approval sets

When multiple sBTC operation requests are present, the Signer coordinator groups them by approval sets. If differing approval sets exist across active operations, the coordinator batches deposit UTXOs into groups with the maximum size per approval set to preserve the single UTXO invariant while maximizing batch efficiency.
{% endstep %}
{% endstepper %}

## Benefits

* Simplified tracking and management of peg funds.
* Fewer Bitcoin transactions for sBTC operations.
* Centralized funds in a single, well-secured output improves operational efficiency.

{% hint style="info" %}
The Single UTXO Model is designed to balance simplicity and operational efficiency for the sBTC peg wallet.
{% endhint %}

## Security considerations

* The single UTXO is managed by the sBTC Bootstrap Signer Set, which requires a threshold of signers to approve any spending (multi-signature).
* Regular audits and continuous monitoring are essential to ensure the UTXO accurately represents the total sBTC in circulation at all times.

{% hint style="warning" %}
Security is paramount: multi-signature approval, audits, and monitoring are core controls to protect the peg wallet.
{% endhint %}
