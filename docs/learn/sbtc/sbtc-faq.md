# sBTC FAQ

### sBTC Basics

<details>

<summary>What is sBTC?</summary>

sBTC is a decentralizedl 1:1 Bitcoin-backed asset on the Stacks Bitcoin Layer. Read more about Stacks [here](https://www.stacks.co/) and sBTC [here](https://www.stacks.co/sbtc).

</details>

<details>

<summary>How does sBTC work?</summary>

sBTC as a SIP-010 tokensBTC is a SIP-010 token on the Stacks blockchain that represents Bitcoin (BTC) in a 1:1 ratio. sBTC is always backed 1:1 against BTC.Peg wallet and signersThe sBTC peg wallet is maintained and managed by a set of sBTC signers. This decentralized approach enhances security and reduces single points of failure. Read more about Stacker Signing here.

</details>

<details>

<summary>What is Bitcoin Finality, and why is it important?</summary>

Stacks and sBTC state automatically fork with Bitcoin. As such, all transactions settle to Bitcoin with 100% Bitcoin Finality. This protects users against attacks to sBTC via a hard fork. This is a critical security measure that aligns sBTC security with Bitcoin. Read more in [the Stacks Documentation](https://docs.stacks.co/concepts/block-production/bitcoin-finality).

</details>

<details>

<summary>How does the Stacks Signer network improve security?</summary>

Signers are responsible for approving all sBTC deposit and withdrawal operations, ensuring the integrity of the system. With a requirement of 70% consensus for transaction approval, Signers maintain the protocol's liveness and security.

To launch sBTC, the Stacks community approved [SIP-028](https://github.com/stacksgov/sips/blob/69d40a5f4f0ad98eb448ba44e7c31ca054820aa3/sips/sip-028-sbtc_peg.md), defining the criteria for selecting signers based on factors such as technical expertise, reliability, performance, and decentralization. An initial group of 15 institutional Signers has been chosen for Phase 1 to maintain simplicity and reduce operational risks. This group will expand over time as the protocol matures.

The list of sBTC signers is public and listed [here](https://bitcoinl2labs.com/sbtc-rollout#sbtc-signers).

</details>

<details>

<summary>What security measures have been put in place to ensure sBTC is safe?</summary>

sBTC is always backed 1:1 against BTC, and it's verifiably secure through threshold cryptography. sBTC removes the need for 3rd party custodian or trusted setup. Instead, BTC is secured by a decentralized signer set.

Partnerships with top-tier security experts have been established to ensure the protocol is fortified at every level:

Asymmetric Research is a core security contributor. Known for their rigorous research and protocol audits, Asymmetric brings security expertise to sBTC to identify and mitigate potential vulnerabilities. ImmuneFiA robust bug bounty program incentivizes ethical hackers to uncover and address potential issues, adding an additional layer of defense. 3rd Party AuditsSeveral third-party security audits have been conducted on the sBTC system and can be referenced on the sBTC Audits page.

</details>

<details>

<summary>What sets sBTC apart?</summary>

Here are the main differentiating characteristics of sBTC:

* sBTC is a true Bitcoin native product
* sBTC is backed by respected leaders in the Bitcoin community (signer network)
* sBTC's security is provided by a decentralized network of validators/signers rather than a single custodian, removing the need to trust a single entity or exchange
* sBTC leverages 100% Bitcoin finality
* sBTC's technology offers optimal UX and DevEx for an L2
* sBTC is a fully transparent project/product working in the open with public code

</details>

<details>

<summary>Where can I learn more about the sBTC signers?</summary>

Read the "[Selection of sBTC Signer Set](https://github.com/stacks-network/sbtc/discussions/624)" post for more information about each signer and their qualifications.

</details>

### sBTC Rewards Program

<details>

<summary>Where does the yield paid in BTC come from?</summary>

The sBTC Rewards Program is powered by a group of Stackers "Stacking" STX to a designated reward address, contributing their BTC rewards to the program.

When Stacking STX, Stackers receive BTC through Stack's [Proof-of-Transfer](https://docs.stacks.co/concepts/stacks-101/proof-of-transfer) (PoX) consensus mechanism. For example, over a given 2-week period, the Stacks protocol has historically [distributed around 10% APY to Stackers](https://www.stacking-tracker.com/), paid in BTC.

To enable the sBTC Rewards Program, these stackers contribute the corresponding Proof of Transfer BTC rewards to the sBTC incentive pool. This BTC from the incentive pool is directly deposited into a smart contract that bridges the BTC to sBTC and distributes the rewards pro rata to sBTC holders.

The program is designed to increase sBTC liquidity and drive early usage of the protocol.

Here's a handy illustration to show the sBTC incentives design:

</details>

<details>

<summary>How are rewards distributed?</summary>

sBTC is automatically distributed every two weeks to the STX address used to enroll in your non-custodial wallet.

</details>

<details>

<summary>What do I have to do to be eligible for rewards?</summary>

To be eligible, you must enroll in the rewards program at bitcoinismore.org.

</details>

<details>

<summary>Do I need to re-enroll in the sBTC Rewards Program if I previously enrolled in the sBTC Rewards Program and have received additional sBTC?</summary>

No re-enrollment is needed. The Yield smart contract will automatically calculate enrolled users updated balance, as long as the sBTC contract address remains the same.

</details>

<details>

<summary>What level of rewards should I expect?</summary>

The level of rewards users can expect will vary based on the amount of STX in the rewards pool, the PoX yield rate, and the amount of sBTC that has been minted.

</details>

<details>

<summary>What is the difference between PoX Rewards and the sBTC Rewards Program?</summary>

PoX Bitcoin rewards are earned by Stackers who lock up their STX tokens to secure the Stacks network, a process that has been ongoing since the launch of Stacks.

The sBTC Rewards Program, on the other hand, offers additional BTC rewards specifically for early adopters who hold sBTC without requiring them to participate in network consensus or lock up any tokens.

</details>

### Using sBTC

<details>

<summary>When will sBTC be available?</summary>

sBTC deposits first went live on December 16, 2024, quickly hitting the 1,000 BTC cap. The second cap will go live on February 25th, 2025, quickly hitting the 3,000 BTC cap. Withdrawals went live on April 30, 2025.

Full decentralization of the Signer set will follow in [a subsequent phase](https://bitcoinl2labs.com/sbtc-rollout), gradually expanding beyond the initial 15 community-elected signers.

</details>

<details>

<summary>What wallets are supported for sBTC?</summary>

[Xverse](https://www.xverse.app/) and [Leather](https://leather.io/) wallets are supported — two leading wallets with seamless integrations designed for Bitcoin and Stacks users.

In addition, [Ledger](https://www.ledger.com/) and [Asigna](https://www.asigna.io/) support sBTC.

We are actively working with institutional custodians, staking providers, and other 3rd party wallets to support sBTC. More will be announced.

</details>

<details>

<summary>Why is there a .001 BTC minimum for BTC to sBTC deposits?</summary>

A .001 BTC minimum is imposed for BTC to sBTC deposits to ensure the system does not get spammed by many smaller transactions. We are exploring reducing the deposit minimum for future phases.

</details>

<details>

<summary>What are the steps to use the sBTC Bridge and earn rewards?</summary>

In the Stacks Documentation, find a [video](https://www.youtube.com/watch?v=XZruuDgTo4k\&t=1s) and a [more detailed walkthrough](https://docs.stacks.co/guides-and-tutorials/sbtc/how-to-use-the-sbtc-bridge).

Ensure BTC is accessible in a supported walletEnsure BTC is accessible via one of the following non-custodial wallets: Xverse, Leather, Ledger, or Asigna.Connect your wallet to the sBTC appTo interact with the sBTC protocol and mint sBTC, head to app.stacks.co and connect your non-custodial wallet with BTC ready to deposit.Enter BTC amountEnter the BTC amount to convert to sBTC (app.stacks.co will guide you through this step).Provide your Stacks receiving addressEnter your Stacks receiving address to initiate the transfer (app.stacks.co will guide you through this step).Enroll in the rewards programAfter your sBTC has been minted to your wallet, visit the rewards program site at bitcoinismore.org and connect your wallet. Then click the 'Earn Rewards' button. Read more in the Stacks Documentation.Start earningSeamlessly start earning sBTC rewards. sBTC is automatically paid every two weeks to the STX address used to enroll in your non-custodial wallet.Note: There is an initial lock-up period until withdrawals are activated in March. Following the lock-up period, sBTC can always be withdrawn.

</details>

<details>

<summary>How long will it take for my BTC deposit to confirm?</summary>

sBTC facilitates rapid movement between BTC and sBTC.

BTC to sBTCBTC to sBTC conversion can be completed within 3 Bitcoin blocks (under an hour).sBTC to BTCsBTC to BTC conversion can be completed within 6 Bitcoin blocks (Approximately two hours)

Read more in the [Stacks Documentation](https://docs.stacks.co/concepts/sbtc/operations/deposit-withdrawal-times).

</details>

<details>

<summary>Why is there a cap on the total BTC pegged in?</summary>

A BTC cap will be implemented to ensure a smooth rollout process with a focus on security.

In addition, the BTC cap will give developers the time to focus on the sBTC user experience and integration with DeFi applications across the Stacks ecosystem prior to opening sBTC for all users.

</details>

<details>

<summary>Are there any associated fees with minting sBTC?</summary>

There are two transaction fees required to mint your sBTC. The first is set by the user manually when they initiate the deposit transaction within their wallet.

The second is a fee used to consolidate the deposit UTXOs into the single signer UTXO. This separate transaction fee happens automatically and is set to a max of 80k sats. This is automatically deducted from your minted sBTC. This is not a signer fee but a regular Bitcoin transaction fee.

</details>

<details>

<summary>Are there multi-signature solutions for sBTC?</summary>

Yes. [Asigna](https://www.asigna.io/) provides a multi-signature solution for sBTC users.

</details>

<details>

<summary>Are custodians available to support sBTC?</summary>

At the moment, there is no custodian support for sBTC. However, we are actively working with institutional custodians to support sBTC.

Copper and BitGo already support Stacks and Stacking; however, we are working to prioritize SIP-10 and sBTC integration.

</details>

### sBTC Troubleshooting

<details>

<summary>My Bitcoin transaction confirmed, but I'm not seeing the sBTC token in my wallet.</summary>

You may need to enable the display of the sBTC token within your wallet by clicking on 'Manage Tokens' and enabling sBTC.

</details>

<details>

<summary>I received an "Errors.Invalid_Transaction" error when using an Xverse Wallet</summary>

If you received a "Errors.Invalid\_Transaction" error when using an Xverse Wallet, you may be using a "Nested SegWit" wallet. To resolve the issue, change your Xverse wallet to use the "Native SegWit".

</details>

<details>

<summary>sBTC still isn't showing up in wallet after 3 Bitcoin blocks. How much longer do I have to wait?</summary>

BTC to sBTC conversions are typically completed within 3 Bitcoin blocks. Due to the speed of Bitcoin blocks, deposits can take up to two hours to see sBTC in your wallet.

However, there may be a lag with your Leather or Xverse wallet where the sBTC will take another 20 minutes to show up in the wallet.

</details>

<details>

<summary>I didn't receive a confirmation that I enrolled in the rewards program. How can I ensure I'm enrolled?</summary>

Visit [bitcoinismore.org](https://bitcoinismore.org/). On the enroll page, when your wallet is linked, it will say enrolled if you are enrolled in the program.

</details>
