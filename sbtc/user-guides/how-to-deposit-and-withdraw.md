# How to Deposit and Withdraw

Depositing and withdrawing sBTC can be done in three ways:

1. Using the [sBTC Bridge](https://bridge.stx.eco/) application.
2. Using an sBTC enabled wallet.
3. Using an app which integrates with sBTC natively.

This guide will walk you through how to deposit and withdraw sBTC using the sBTC Bridge application.

### Preparation

First, make sure you have the [Hiro Wallet](https://wallet.hiro.so/) browser extension installed. Then, to begin your deposit or withdrawal, navigate to [https://bridge.stx.eco/](https://bridge.stx.eco/). Once there, click the `Settings` dropdown and make sure you're on the right network. Thereafter, you should select the appropriate transaction mode:

* If you want to deposit BTC from your Hiro Wallet, select `OP_RETURN`.
* If you want to deposit BTC from a custodial wallet, select `OP_DROP`.

With these settings in place, you may proceed to do your deposit or withdrawal.

### How to Deposit

To deposit you will be prompted to enter

1. Your bitcoin address to deposit from.
2. A stacks address to receive the sBTC.
3. The amount to deposit.

Once you have entered this information and continue, you will either be prompted to sign a transaction with the Hiro Wallet or receive a QR code to scan depending on your transaction mode.

When you have signed or paid to the QR code you'll get a link to follow your request on the Bitcoin chain. The sBTC should be minted shortly after your request is mined.

### How to Withdraw

To withdraw you will be prompted to enter

1. Your bitcoin address to receive the BTC which is also used to request the withdrawal.
2. Your stacks address from which the sBTC should be withdrawn.
3. The amount to withdraw.

You will then be prompted to sign a message payload with the Hiro Wallet to authenticate your request. Once the request is authenticated you will be prompted to either sign a bitcoin transaction or receive a QR code to scan depending on your transaction mode.

When you have signed or paid to the QR code you'll get a link to follow your request on the Bitcoin chain. The sBTC should be burned shortly after your request is mined. Thereafter, the system will wait until the sBTC burn is final before fulfilling your withdrawal on the Bitcoin chain. This may take up to 150 bitcoin blocks.
