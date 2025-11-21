---
description: Explaining the security model of sBTC
---

# Security Model of sBTC

### sBTC Security: A Multi-layered Approach

Security is the foundation of this rollout. Partnerships with top-tier security experts have been established to ensure the protocol is fortified at every level:

1. **Asymmetric Research**: Known for their rigorous research and top embedded security researchers, Asymmetric brings security expertise to sBTC to identify and mitigate potential vulnerabilities.
2. **ImmuneFi**: A robust bug bounty program incentivizes ethical hackers to uncover and address potential issues, adding an additional layer of defense. ImmuneFi is the [leading crowdsource bounty platform for DeFi](https://stacks.org/best-and-brightest-sbtc#immunefi).
3. **3rd Party Audits**: Independent audit reports have been made for additional security reviews, ensuring the protocol is thoroughly vetted by external experts.

### The components that make up the security model of sBTC

#### **sBTC Signer Network**

The sBTC Signer network is a decentralized group of entities responsible for managing the locking and unlocking of BTC during the minting and redemption of sBTC. This network operates in a distributed manner to enhance security and reduce the risks associated with centralized custodians.

Signers are responsible for approving all sBTC deposit and withdrawal operations, ensuring the integrity of the system. With a requirement of 70% consensus for transaction approval, Signers maintain the protocol's liveness and security.\
\
As approved by the Stacks community via [SIP-028](https://github.com/stacksgov/sips/blob/69d40a5f4f0ad98eb448ba44e7c31ca054820aa3/sips/sip-028/sip-028-sbtc_peg.md), the criteria for selecting signers include technical expertise, reliability, performance, and decentralization. An initial set of 15 institutional Signers will be used in Phase 1 to maintain simplicity and minimize operational risks. This group will grow as the protocol evolves.\
\
As sBTC evolves, the Signer set will transition to a fully decentralized model, further strengthening the protocol's resilience.

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption><p>source: <a href="https://bitcoinl2labs.com/sbtc-rollout#sbtc-signers">Bitcoin L2 Labs</a></p></figcaption></figure></div>

For more info on who the sBTC Signers are, check out this section on the Bitcoin L2 Labs website [here](https://bitcoinl2labs.com/sbtc-rollout#sbtc-signers).

#### **Trust-Minimized Bridge Model**

The trust-minimized bridge model for sBTC ensures that the exchange between BTC and sBTC happens without relying on a single entity. Instead, it leverages cryptographic proofs and smart contracts on the Stacks blockchain, allowing for secure and transparent conversion processes.

The permissionless nature of the sBTC model empowers Bitcoin holders to freely peg their BTC into sBTC and vice versa. This process utilizes a decentralized network of Signers along with smart contracts, eliminating the need for centralized custody or intermediaries. Bitcoin holders initiate a peg by sending BTC to a predetermined address, automatically triggering the issuance of an equivalent amount of sBTC on the Stacks blockchain. Similarly, holders can burn their sBTC, prompting the smart contracts to release BTC back to their control. This model enhances user autonomy and aligns with the decentralized ethos of Bitcoin.

#### **Bitcoin Finality and Stacks**

Stacks' Bitcoin Finality mechanism aligns sBTC's security closely with Bitcoin itself. By anchoring blocks and transactions to the Bitcoin blockchain, this ensures that the finality and security of asset holdings on Stacks are as robust as those on the Bitcoin network. This integration helps maintain trust and stability for sBTC within the broader Bitcoin ecosystem.

### How sBTC's security contrasts with other wrapped Bitcoin alternatives

While the sBTC model leverages decentralization to minimize trust, other wrapped Bitcoin solutions often face centralization risks. Typically, these alternatives rely on a centralized custodian to hold the underlying BTC, introducing a significant point of failure. Such custodians act as the trust anchor in the conversion process, which can potentially lead to issues such as censorship, mismanagement, or even security breaches. As a result, these models may not fully align with the decentralized principles of Bitcoin, posing challenges to the security and autonomy intended for Bitcoin holders.

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/image (1) (1).png" alt=""><figcaption><p>source: <a href="https://www.stacks.co/sbtc">stacks.co</a></p></figcaption></figure></div>

***

#### Resources

* \[[Stacks Roadmap](https://stacksroadmap.com/#sbtc)] Upcoming technical advancements and security designs for sBTC
