# Stacking Flow

In Nakamoto, stacking flows have significant changes in comparison to previous versions of Stacks. Because Nakamoto requires stackers to run a signer, which validates blocks produced by Stacks miners, stackers need to provide new information when making Stacking transactions.

These changes affect both solo Stacking and delegated Stacking. This document intends to outline the new flows for both cases, so that we can better understand what Stackers need to do to Stack in Nakamoto.

### Definitions

* Stacker: an entity locking their STX to receive PoX rewards. This is a broad term including solo Stackers and Stackers who use pools.
* Solo stacker: an entity that locks their own STX and runs a signer. They don’t receive delegation.
* Delegator: a stacker who locks their STX and delegates to a signer. They don’t run the signer.
* Delegatee: an entity that runs a Signer and allows others to delegate their STX to them. A delegatee doesn’t need to Stack their own STX, but they can.
* Signer: an entity that runs the stacks-signer software and participates in block validation. This can be either a solo Stacker an entity receiving delegated STX. In many cases we also refer to “signer” as the software that validates blocks. We may want to try and improve this language to be more clear.

### First, run a signer

This is a necessary prerequisite to stacking.

Running a signer involves setting up a hosted production environment that includes both a Stacks Node and the Stacks Signer. For more information, refer to the [running a signer doc](https://github.com/stacksfoundation/NAKA-REPO/issues/279).

Once the signer software is running, the signer needs to keep track of the `stacks_private_key` that they used when configuring their signer. This will be used in subsequent Stacking transactions.

### Signer keys and signer key signatures

The main difference with Stacking in Nakamoto is that the Signer (either solo Stacker or signer running a pool) needs to include new parameters in their Stacking transactions:

1. `signer-key`: the public key that corresponds to the `stacks_private_key` their signer is using
2. `signer-signature`: a signature that demonstrates that this Stacker actually controls their `signer-key`. Because signer keys need to be unique, this is also a safety check to ensure that other Stackers can’t use someone else’s public key.
3. `max-amount`: The maximum amount of STX that can be locked in the transaction that uses this signature. For example, if calling stack-increase, then this parameter dictates the maximum amount of STX that can be used to add more locked STX
4. `auth-id`: a random integer that prevents re-use of a particular signature, similar to how nonces are used with transactions.

### Generating a signer key signature

Signer signatures are signatures created using a particular signer key. They demonstrate that the controller of that signer key is allowing a Stacker to use their signing key. The signer signature’s message hash is created using the following data:

* `method`: a string that indicates the Stacking method that is allowed to utilize this signature. The valid options are stack-increase, stack-stx, stack-extend, or agg-commit (for stack-aggregation-commit).
* `max-amount`: described above
* `auth-id`: described above
* `period`: a value from 0-12, which indicates how long the Stacker is allowed to lock their STX for in this particular Stacking transaction.
* `reward-cycle`: This represents the reward cycle in which the Stacking transaction can be confirmed
* `pox-address`: The Bitcoin address that is allowed to be used for receiving rewards

#### Using the `stacks-signer` CLI

At the moment, one way to generate this signature is via the stacks-signer binary, which is also used to run the signer. The command generate-stacking-signature will utilize existing configuration along with user-provided arguments to generate a signature.

```bash
stacks-signer generate-stacking-signature \
  --pox-address {poxAddress}
  --reward-cycle {rewardCycle}
  --method {topic}
  --period {period}
  --max-amount {maxAmount}
  --auth-id {authId}
  --config {configFile}
```

This will output the information you’ll need to make Stacking transactions, including your signer public key and the signer signature.

#### Using stacks.js

{% hint style="info" %}
This functionality is built, but it’s still in [a PR in stacks.js](http://stacks.js). In that PR, the README is updated to [demonstrate how to generate a signer signature](https://github.com/hirosystems/stacks.js/blob/3c863e745d24bf6b9c5ad75d2191f861cd01fb10/packages/stacking/README.md#broadcast-the-stacking-transaction).
{% endhint %}

The [@stacks/stacking](https://www.npmjs.com/package/@stacks/stacking) NPM package provides interfaces to generate and use signer signatures.

#### Using web applications

Future releases of Stacking web apps will allow you to generate a Signer signature using a Stacks wallet. We’ll update this section when those applications become available.

The exact user experiences for generating the `signer-signature` is to be determined, but there are two high-level processes that can be expected:

1. Using the `stacks-signer` or other CLI, via a command like `stacks-signer generate-stacking-signature {pox-address} {reward-cycle}`.&#x20;
2. Using an application like a wallet or a web app. The signature is designed such that Stackers can use pre-existing standards for signing data with a wallet like Leather and XVerse. Stackers can also use hardware wallets to create this signature.

Solo Stackers will likely generate their signature as a first step while making their Stacking transaction.

#### Using a hardware or software wallet to generate signatures

When the signer is configured with a `stacks_private_key`, the signer may want to be able to use that key in a wallet to make stacking signatures.

If the signer uses a tool like [@stacks/cli](https://docs.hiro.so/get-started/command-line-interface) to generate the key, the CLI also outputs a mnemonic (aka “seed phrase”) that can be imported into a wallet. Because the Stacks CLI uses the standard derivation path for generating Stacks keys, any Stacks wallet will default to having that same private key when the wallet is imported from a derivation path. Similarly, if a hardware wallet is setup with that mnemonic, then the Signer can use a wallet like Leather to make stacking signatures.

The workflow for using a setting up a wallet to generate signatures would be:

1. Use @stacks/cli to generate the keychain and private key.
   1. Typically, when using a hardware wallet, it’s better to generate the mnemonic on the hardware wallet. For this use case, however, the signer software needs the private key, and hardware wallets (by design) don’t allow exporting private keys.
2. Take the `privateKey` from the CLI output and add it to your signer’s configuration.
3. Take the mnemonic (24 words) and either:
   1. Setup a new hardware wallet with this mnemonic
   2. Store it somewhere securely, like a password manager. When the signer needs to generate signatures for Stacking transactions, they can import it into either Leather or XVerse.

When the user needs to generate signatures:

1. Setup your wallet with your signer key’s private key. Either:
   1. Setup your Leather wallet with a Ledger hardware wallet
   2. Import your mnemonic into Leather, XVerse, or another Stacks wallet
2. Open an app that has stacking signature functionality built-in
3. Connect your wallet to the app (aka sign in)
4. In the app, enter your PoX address and “submit”
5. The app will popup a window in your wallet that prompts you to sign the information
   1. The app will show clear information about what you’re signing
6. Create the signature
   1. If using a Ledger, confirm on your device
7. The app will display two results:
   1. Your signer key, which is the public key associated with your signer’s key
   2. Your signer signature
8. Finally, make a Stacking transaction using the signer key and signer signature.

### Solo Stacking

#### Call the function `stack-stx`

Just like in previous versions of PoX, Stackers call `stack-stx`, but with the new arguments added in Nakamoto. The arguments are:

* Amount
* PoX Address: the BTC wallet to receive Stacking rewards
* Start burn height: the current BTC block height
* Lock period: the number of cycles to lock for (1 minimum, 12 max)
* Signer key: the public key that their signer is using
* Signer signature: the signature that proves control of this signer key
* max-amount: This parameter is used to validate the signer signature provided. It represents the maximum number of STX that can be locked in this transaction.
* auth-id: This parameter is used to validate the signer signature provided. auth-id is a random integer that prevents re-use of this particular signer signature.

#### Act as a signer

In the “prepare phase” before the next stacking cycle (100 blocks), the exact set of Stackers will be selected based on the amount of STX stacked. Just like in previous versions of PoX, each Stacker will have some number of reward slots based on the amount of STX locked.

It is critical that Stackers have their signer running during this period. The prepare phase is when distributed key generation (DKG) occurs, which is used when validating blocks by signers.

In general, Stackers don’t need to do anything actively during this period, other than monitoring their Signer to ensure it’s running properly.

#### Extending their stacking period

Just like in the current version of PoX, Stackers can extend their lock period while still Stacking. The function called is `stack-extend`.

Stackers can “rotate” their signing key when extending their lock period.

The arguments are:

* Extend count: the number of cycles to add to their lock period. The resulting lock period cannot be larger than 12. For example, if currently locked with 6 cycles remaining, the maximum number they can extend is 6.
* Pox Address: the BTC address to receive rewards
* Signer public key: the public key used for signing. This can stay the same, or the Stacker can use a new key.
* Signer signature: a signature proving control of their signing key
* max-amount: This parameter is used to validate the signer signature provided. It represents the maximum number of STX that can be locked in this transaction.
* auth-id: This parameter is used to validate the signer signature provided. auth-id is a random integer that prevents re-use of this particular signer signature.

### Delegated stacking

Similar to the changes to solo Stacking, the big difference for delegation flows is the inclusion of signer keys and signatures. Because signers need to make transactions to “finalize” a delegation, these new arguments add new complexities to the signer.

#### Delegator initiates delegation

The first step, where the delegator sets up their delegation to a signer, is to call `delegate-stx`. The arguments here are unchanged:

* Amount
* Delegate to: the STX address of the signer they’re delegating to. Note that this is different from the “signer key” used. Instead, this is the STX address that is used to make PoX transactions.
* Until burn height: an optional argument where the delegation expires
* Pox Address: an option BTC address that, if specified, the signer must use to accept this delegation

#### Signer “activates” the delegation

Just as in the current PoX contract, the signer calls `delegate-stack-stx` to commit the delegator’s STX. The arguments are:

* Stacker: the STX address of the delegator
* Amount
* Pox Address
* Start burn height
* Lock period: number of cycles to lock for. If the delegator provided the until burn height argument, then the end of these cycles cannot be past the expiration provided.

This step also allows the Signer to proactively choose which Stackers they’ll accept delegation from. For “closed” pools, the signer will only call this function for approved Stackers. It is up to each signer who runs a closed pool to implement this process, but tooling will likely be created to make this easier.

This step can happen for many Stackers before going to the next step.

#### Signer “commits” delegated STX

At this point, the STX are committed to the signer, and the signer has some “aggregate balance” of committed STX. The signer is not actually eligible for rewards and signer slots until this step is called.

The signer cannot call this until the total number of STX committed is larger than the minimum threshold required to Stack. This threshold is a function of the total number of liquid STX. At the moment, the threshold is 90,000 STX.

Once the threshold is reached, the signer calls `stack-aggregation-commit`. This is the point where the signer must provide their signer key and signer key signature. The arguments are:

* Pox Address
* Reward-cycle: the current reward cycle
* Signer key: the public key of their signer
* Signer signature

Once this succeeds, the signer is eligible for reward slots. The number of reward slots depends on the amount of STX committed to this signer. Even if the signer commits more than the “global minimum”, the minimum amount to receive a slot depends on the amount of STX locked for each cycle. For example, in the current PoX cycle, that amount is 110,000 STX.

To act as a signer, each step up to this point must be taken before the prepare phase of the next cycle begins. It is crucial that the signer software is running.

#### Signer increases amount committed

Even after the signer commits to a certain amount of STX in the previous step, the signer can increase this amount once more delegations are received. The initial steps must be taken for each Stacker (`delegate-stx` and then `delegate-stack-stx`), and then `stack-aggregation-increase` can be called.

#### The need for a separate “Delegate Private Key”

The concept of the “signer key” or “signer private key” was introduced earlier in this document. The signer key is used during consensus mechanisms to sign blocks in Nakamoto.

Signers using delegation also need a separate keychain to make Stacking transactions such as `delegate-stack-stx` listed earlier. They need a separate key because they need to have the ability to rotate their signer key when necessary. The PoX contract is designed to support rotating the signer key without needing their Stackers to un-stack and re-stack later. You cannot rotate a delegate key without needing to wait for all delegated Stackers to un-stack and finally re-stack to the new delegate address.

Because of this limitation of being unable to rotate delegate addresses, it’s highly recommended to have a separate delegate key. The benefit of a separate delegate key is that it can easily be used in existing wallets, including hardware wallets.

### Tooling for Stackers

The exact tooling that will be available for both solo and delegated stacking is still in the works, but several options are being explored including:

* CLI tooling
* Web apps
* BTC native multi-sigs

### Relationship between manual stacking transactions and the running signer

This section describes the various transactions that signers need to make in order to be registered as a signer for a certain reward cycle. The order of operations between the automated signer and the stacking transactions that need to be done “manually” is important for ensuring that a signer is fully set up for a certain reward cycle.

<figure><img src="https://lh7-us.googleusercontent.com/Rnm8NlJW_FguCYVMggcno5MANqYBb4NyA8P9swsv3ShVNyzNKgfT95T9mgKiv101EtNwd1qVpYVGOrYK5463_1iY_kdQbzwFiKmvMc4BzympR53GdmZw1VeThJkqTSd-mj2jyNjjOycnEVPVRNH4gz8" alt=""><figcaption></figcaption></figure>

#### Prerequisite: ensure the signer is hosted and running

Although it’s not required, it’s important that we emphasize the importance of getting the signer running in a hosted environment before making Stacking transactions. If the signer doesn’t do that, they run the risk of being registered as a signer without their signer software being ready to run DKG and other important consensus mechanisms.

Some of the important things to double check to ensure the signer is “running” are:

* The signer software is configured with a private key that the user can access (either through SSH or other means). This is important because their signer needs to utilize this private key to generate signer key signatures that are used in Stacking transactions.
* The signer software is properly configured to make RPC calls to a Stacks node. This refers to the `endpoint` signer configuration field. If properly configured, there should be logs in the Stacks node that show the RPC calls being made from the signer.
* The stacks node is properly configured to send events to the signer. This refers to the \[\[`event_observers`]] field in the Stacks Node’s configuration. If properly configured, the signer should have logs indicating that it’s receiving events from the Stacks node.

### How a signer becomes registered in the signer set

Each of the transactions described here are done “manually”. More specifically, this means that none of these transactions are executed automatically by the signer software. The transactions must be done “out of band”.

In order for a signer to actually be registered in a reward cycle, there need to be manual transactions made in the `pox-4` contract. While the signer software is running, it is continually polling the Stacks node and asking “am I a signer in reward cycle N?”.&#x20;

If these manual transactions are confirmed, and the signer has enough STX associated with the signer’s public key, the signer will be registered as a signer.

#### Solo stacking

The workflow for solo stackers is more simple, because there are less stacking transactions that need to be made.

For solo stacking, the only transaction that needs to be made is `stack-stx`. Included in this transaction’s payload is the signer’s public key.

In order for the signer to be registered in reward cycle N+1, the `stack-st`x transaction must be confirmed during the first 2000 blocks of reward cycle N. The last 100 blocks of cycle N (the “prepare phase”) is where DKG occurs.

The start of the prepare phase is when Stacks nodes determine the official signer set of the next reward cycle.

#### Delegated Stacking

The workflow for delegated signers is more complex, because it requires more transactions.

This workflow is explained more in a previous section, but the high-level workflow is:

1. Stackers delegate their STX to a signer
2. The signer makes `delegate-stack-stx` transactions to “approve” specific stackers. This needs to be called for every individual stacker that delegates to them.
3. The signer makes a `stack-aggregation-commit` transaction to “commit” all of its delegated STX up to this point.

Similar to solo stacking, these steps must be made before the prepare phase of an upcoming reward cycle.

### Once a signer is registered in the signer set

During the prepare phase before a reward cycle, Stacks nodes automatically determine the signer set for the upcoming cycle. When this occurs, the Stacks nodes make an “internal” transaction to update the `.signers` contract with the list of signers.

The signer software is continuously polling the Stacks node to see if it is registered for a cycle. If the signer software finds that it is registered (by matching its public key to the signers stored in the `signers` contract) it begins performing its duties as a signer.

During the prepare phase, the signers perform DKG through StackerDB messages. Once an aggregate public key is determined, the signer automatically makes a `vote-for-aggregate-key` transaction. No out-of-band action is needed to be taken for this to occur.

During Epoch 2.5, the signer must pay a STX transaction fee for this transaction to be confirmed. Critically, this means that a minimum balance must be kept in the STX address associated with the signer’s key. There is a config field called `tx_fee_ms` (transaction fee in micro-stacks) that can be optionally configured to set the fee for these transactions. If the config field is omitted, the fee defaults to 10,000 micro-stacks (0.01 STX).

During Epoch 3.0, the signer doesn’t need to pay fees for this transaction, so no STX balance needs to be kept in that address.
