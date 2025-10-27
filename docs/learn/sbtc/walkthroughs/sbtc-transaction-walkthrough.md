# sBTC Transaction Walkthrough

Let's follow the journey of 1 BTC as it moves through the sBTC system, from initial deposit to final withdrawal.

## Part 1: Deposit (BTC → sBTC)

{% stepper %}
{% step %}
### Initiation

* Alice decides to convert 1 BTC to sBTC to participate in Stacks DeFi.
* Alice creates a deposit transaction on the Bitcoin network (typically via a UI such as the sBTC bridge or a DeFi application).
* The transaction enters the Bitcoin mempool.
{% endstep %}

{% step %}
### Proof Submission

* Alice submits proof of her deposit to the Deposit API (usually via the application's UI).
* The Deposit API sets the deposit status to PENDING.
{% endstep %}

{% step %}
### Signer Validation

The sBTC Signer Set:

* Detects the deposit.
* Validates the UTXO format.
* Votes on the deposit.

If the deposit is rejected:

* Signers notify the API of the rejection.
* The Deposit API updates the status to FAILED.

If the deposit is accepted:

* The Deposit API updates the status to ACCEPTED.
{% endstep %}

{% step %}
### Bitcoin Transaction

If accepted, the sBTC Signer Set:

* Creates a new Bitcoin transaction consuming Alice's deposited BTC.
* Broadcasts this transaction to the Bitcoin network.

If this transaction fails:

* Signers notify the API of the failure.
* The Deposit API updates the status to FAILED.
{% endstep %}

{% step %}
### sBTC Minting

Upon successful Bitcoin transaction:

* The sBTC Signer Set interacts with the Stacks blockchain.
* They fulfill the deposit by minting 1 sBTC to Alice's Stacks address.
{% endstep %}

{% step %}
### Confirmation

* The Deposit API updates the deposit status to CONFIRMED.
* Alice now has 1 sBTC in her Stacks wallet.
{% endstep %}
{% endstepper %}

***

## Part 2: sBTC Usage

Alice can now use her 1 sBTC in the Stacks ecosystem:

* Transfer it to other users via the `sbtc-token` contract (typically via an application UI).
* Participate in DeFi applications.
* Use it in any application that supports SIP-010 tokens.

***

## Part 3: Withdrawal (sBTC → BTC)

{% stepper %}
{% step %}
### Initiation

* Alice initiates a withdrawal by interacting with the Clarity contract on the Stacks blockchain.
* She specifies her Bitcoin address for the withdrawal.
* If successful, the contract locks her sBTC and the withdrawal status is set to PENDING.
* If the transaction fails, no withdrawal occurs.
{% endstep %}

{% step %}
### Signer Validation

The sBTC Signer Set:

* Detects the withdrawal request.
* Decides whether to accept or reject the withdrawal.

If the withdrawal is rejected:

* Signers unlock the sBTC.
* The withdrawal status is updated to FAILED.

If the withdrawal is accepted:

* The withdrawal status is updated to ACCEPTED.
* Signers wait for 6 Bitcoin block confirmations (for security purposes).
{% endstep %}

{% step %}
### Bitcoin Transaction

After the waiting period, if accepted:

* The sBTC Signer Set creates a new Bitcoin transaction fulfilling Alice's withdrawal.
* They broadcast this transaction to the Bitcoin network.

If this transaction fails:

* Signers unlock the sBTC.
* The withdrawal status is updated to FAILED.
{% endstep %}

{% step %}
### sBTC Burning and Confirmation

Upon successful Bitcoin transaction:

* The sBTC Signer Set burns the locked 1 sBTC on the Stacks blockchain.
* The withdrawal status is updated to CONFIRMED.
{% endstep %}

{% step %}
### Completion

* Alice now has her 1 BTC back in her specified Bitcoin address.
* The withdrawn sBTC has been permanently removed from circulation.
{% endstep %}
{% endstepper %}
