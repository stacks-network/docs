# Post Conditions

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (29).png" alt=""><figcaption><p>source: <a href="https://www.hiro.so/blog/a-developers-guide-to-post-conditions">Hiro blog</a></p></figcaption></figure></div>

Post conditions are one of the most interesting and unique aspects of Stacks.

From the beginning, safety and security has been at the heart of the Stacks ethos and formed the foundation of architecture decisions when building it.

Like Clarity, Stacks' smart contract programming language, post conditions were specifically built and designed to solve the problem of user safety when interacting with blockchain applications.

So what are they and how do they work?

### How Post Conditions Work

Post conditions are conditions that are set on the client side to ensure that a smart contract does not perform any unexpected behavior.

Let's look at an example to make this more concrete.

Let's say a user is on an NFT marketplace and is expecting to purchase an NFT for 100 STX. Using post conditions, the developer who is building the frontend of the application can add in post conditions to ensure that this is in fact what happens when the user initiates the transaction.

If it does not, the transaction will abort and the user won't be out anything except the transaction fee.

It's important to note that post conditions do not live in smart contracts. They are designed to be an extra layer of security on top of smart contracts.

The problem they help address is a user interacting with a malicious smart contract that attempts to do something the user does not expect.

But rather than simply being a UI feature of a wallet, these post conditions are built into the Stacks network itself and are enforced at the protocol level.

When you use a Stacks wallet and initiate a transaction, the wallet will display the post conditions set by the developer and tell the user exactly what is going to happen. If the action taken by the smart contract matches, the transaction goes through fine, otherwise it aborts.

Here's what that looks like:

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (43).png" alt=""><figcaption></figcaption></figure></div>

In this example, if the smart contract does not transfer one fabulous-frog NFT and take 50 STX from the user, the transaction will abort.

You can learn more about how post conditions work in [SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-post-conditions).
