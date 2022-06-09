---
title: General FAQs
description: Frequently Asked Questions
sidebar_label: "FAQ"
sidebar_position: 7
---

![](/img/glasses.png)

## Why is my transfer still pending?

Commonly it's because your fee is too low or your [nonce](#what-is-nonce) is incorrect.

More information can be found [here](https://www.hiro.so/wallet-faq/why-is-my-stacks-transaction-pending). There are also [best practices and known issues](https://forum.stacks.org/t/transactions-in-mempool-best-practices-and-known-issues/11659) and [diagnosing pending transactions](https://forum.stacks.org/t/diagnosing-pending-transactions/11908).

There is also this [script](https://github.com/citycoins/scripts/blob/main/getnetworkstatus.js) to look at either the first 200 transactions or all the transactions in the mempool, to then return the maximum adn average fee values. We've noticed that using 1.5-2x the average fee in the mempool will generally get things processed within 6-10 blocks even during high congestion.

There is also this [script](https://github.com/citycoins/scripts/blob/main/gettxstatus.js) to track a pending transaction until it reaches a final status.

## What is Nonce?

A nonce is used to make sure that every transaction goes in right order.
Nonce starts at 0, so the very first transaction from an address should set to nonce=0.
You can find the nonce of your wallet address by searching the address in any [Stacks blockchain explorer](https://explorer.stacks.co/). You can also user `$ stx balance <address>`.

If you have a transaction nonce that is less than your account nonce, the transaction is unmineable and will (should) disappear after 256 blocks. This does not affect future transactions and therefore can be just ignored, they are in the past.

If you have a transaction nonce that is equal to your account nonce, then that transaction is valid and should be the next in line to be processed next.

If you have a transaction nonce that is higher than your account nonce, then there needs to be a chain of transactions starting with your account nonce in order for it to be processed.
E.g. Your account nonce is 10 but the pending transaction has a nonce of 12. It will not be mineable until a transaction with nonces 10 and 11 are processed.

## Whats a Replace-by-fee (RBF)?

A replace-by-fee (RBF) transaction tells the blockchain that you would like to replace one transaction with another, while specifying a fee that is higher than the original transaction fee.
A transaction can be replaced with **any other transaction**, and is not limited to the same operation.

This can be used to effectively **cancel a transaction** by replacing it with something else, like a small STX transfer to another owned address.

This can be used to **raise the fee for a pending transaction** so it is considered by miners during periods of high congestion.
This can also be used to _resubmit_ a transaction, in the sense that the RBF transaction gets a new txid and gets considered again (or faster) by miners.
E.g. I submit my transaction with 1 STX fee at block 54,123. By block 54,133 I see my tx hasn’t been picked up, so I RBF with 1.1 STX. Then wait 10 blocks again, and RBF again if not received. There’s a balance between doing this too often and keeping a consistent pace, but it has been seen to help get transactions through, especially when new ones are constantly flooding in.

The replacement transaction needs to use the same nonce as the original transaction with a fee increase of at least 0.000001 STX.
E.g. Your original transaction has a fee of 0.03 STX, the new RBF transaction must have a fee of 0.030001 STX or above.

RBF transactions process in one of two ways:

- If miners pick up the original transaction before the RBF transaction is received, then the original transaction is processed and the replacement transaction goes into an unmineable state. It will eventually disappear and doesn’t affect future transactions.
- If miners pick up the replaced transaction then the new transaction is processed instead of the original, and the status of the original transaction is set to “droppped_replaced_by_fee”. This status is not shown on the explorer but can be seen when querying the txid.

Submitting multiple transactions for the same action can slow things down in a few ways.

- If the total spent in 2 or 3 transactions is more than can be spent in a single transaction, the transactions appear unmineable.
- If the fees for multiple transactions exceed the STX balance, the transactions will be unmineable.

## What are .btc domains?

[This forum post](https://forum.stacks.org/t/btc-domains-are-live/12065) explains all the benefits of .btc domains. They can currently be purchased in [btc.us](https://btc.us/)
