# sBTC Transaction Walkthrough

Let's follow the journey of 1 BTC as it moves through the sBTC system, from initial deposit to final withdrawal.

## Part 1: Deposit (BTC to sBTC)

### Step 1: Initiation

Alice decides to convert 1 BTC to sBTC to participate in Stacks DeFi.

1. Alice creates a deposit transaction on the Bitcoin network (this will likely be done via a UI like the sBTC bridge or a DeFi application).
2. The transaction enters the Bitcoin mempool.

### Step 2: Proof Submission

1. Alice submits proof of her deposit to the Deposit API (this step is also usually done via an application's UI).
2. The Deposit API sets the deposit status to PENDING.

### Step 3: Signer Validation

The sBTC Signer Set:

1. Detects the deposit.
2. Validates the UTXO format.
3. Votes on the deposit.

If the deposit is rejected:

1. Signers notify the API of the rejection.
2. The Deposit API updates the status to FAILED.

If the deposit is accepted:

1. The Deposit API updates the status to ACCEPTED.

### Step 4: Bitcoin Transaction

If accepted, the sBTC Signer Set:

1. Creates a new Bitcoin transaction consuming Alice's deposited BTC.
2. Broadcasts this transaction to the Bitcoin network.

If this transaction fails:

1. Signers notify the API of the failure.
2. The Deposit API updates the status to FAILED.

### Step 5: sBTC Minting

Upon successful Bitcoin transaction:

1. The sBTC Signer Set interacts with the Stacks blockchain.
2. They fulfill the deposit by minting 1 sBTC to Alice's Stacks address.

### Step 6: Confirmation

1. The Deposit API updates the deposit status to CONFIRMED.
2. Alice now has 1 sBTC in her Stacks wallet.

## Part 2: sBTC Usage

Alice can now use her 1 sBTC in the Stacks ecosystem:

1. She can transfer it to other users via the `sbtc-token` contract (again this will usually be done via an application UI).
2. Participate in DeFi applications.
3. Use it in any application that supports SIP-010 tokens.

## Part 3: Withdrawal (sBTC to BTC)

### Step 1: Initiation

Alice decides to withdraw her 1 sBTC back to BTC.

1. Alice interacts with the Clarity contract on the Stacks blockchain to initiate a withdrawal.
2. She specifies her Bitcoin address for the withdrawal.
3. If successful, the contract locks her sBTC and the withdrawal status is set to PENDING.
4. If the transaction fails, no withdrawal occurs.

### Step 2: Signer Validation

The sBTC Signer Set:

1. Detects the withdrawal request.
2. Decides whether to accept or reject the withdrawal.

If the withdrawal is rejected:

1. Signers unlock the sBTC.
2. The withdrawal status is updated to FAILED.

If the withdrawal is accepted:

1. The withdrawal status is updated to ACCEPTED.
2. Signers wait for 6 Bitcoin block confirmations (for security purposes).

### Step 3: Bitcoin Transaction

After the waiting period, if accepted:

1. The sBTC Signer Set creates a new Bitcoin transaction fulfilling Alice's withdrawal.
2. They broadcast this transaction to the Bitcoin network.

If this transaction fails:

1. Signers unlock the sBTC.
2. The withdrawal status is updated to FAILED.

### Step 4: sBTC Burning and Confirmation

Upon successful Bitcoin transaction:

1. The sBTC Signer Set burns the locked 1 sBTC on the Stacks blockchain.
2. The withdrawal status is updated to CONFIRMED.

### Step 5: Completion

1. Alice now has her 1 BTC back in her specified Bitcoin address.
2. The withdrawn sBTC has been permanently removed from circulation.
