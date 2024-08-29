# sBTC Requests and Responses

Requests to the sBTC system happen on the Bitcoin blockchain. In this chapter, we explain the two requests that users can create. We go over all information they must contain, and how the sBTC protocol responds to the requests. For a more in-depth reference on how these requests are represented on the Bitcoin blockchain, see Bitcoin Transactions.

### Deposit Request

When a user wishes to deposit BTC in favor of receiving sBTC, they create a deposit request transaction. This is a bitcoin transaction sending the requested deposit amount of BTC to the address provided by the Stackers. In addition, the transaction must also specify to which Stacks address the sBTC should be minted.

The sBTC deposit request transaction will therefore contain the following data:

* Recipient address: The Stacks address which should receive the sBTC.
* sBTC wallet address: The Bitcoin address maintaining custody of the deposited BTC.
* Amount: The amount to deposit.

#### How the protocol responds to a deposit request

When a deposit request is mined on the Bitcoin blockchain, the next Stacks block must contain an sBTC mint transaction to the recipient address with the designated amount.

This is enforced on a consensus level in Stacks, so that Stacks blocks which do not respond to deposit requests are considered invalid by Miners.

If for some reason the sBTC mint does not materialize, there is a timeout function that will return the user's BTC to them once the subsequent reward cycle finishes.

### Withdrawal Request

An sBTC withdraw request is a bitcoin transaction containing data and two outputs. The first output of this transaction marks the recipient address of the BTC to be withdrawn. The second output of this transaction is a small fee subsidy to the stackers intended to cover the transaction cost of fulfilling the withdrawal. Finally, the transaction specifies the amount to be withdrawn and signs the amount and recipient address with the Stacks address from which the sBTC should be burned.

To summarize, the sBTC withdrawal transaction will contain the following data:

* Recipient address: The Bitcoin address which should receive the BTC.
* sBTC wallet address: The Bitcoin address maintaining custody of the deposited BTC.
* Amount: The amount to withdraw.
* Sender address: The Stacks address holding the sBTC to be burned.

#### How the protocol responds to a withdrawal request

When a withdrawal request is mined on the Bitcoin blockchain, the next Stacks block must contain a sBTC burn transaction burning the requested amount from the sender address. Once the withdrawal request is final[^1] on the Stacks blockchain, Stackers must fulfill the withdrawal request on the Bitcoin chain by creating a fulfillment transaction.

The fulfillment transaction is a bitcoin transaction sending the requested withdrawal amount to the designated recipient address specified in the Withdrawal request.

[^1]: Block finality is a property introduced in the [Nakamoto release](https://stx.is/nakamoto) of Stacks, and a requirement for sBTC.
