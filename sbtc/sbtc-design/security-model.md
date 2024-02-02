# Security Model

Unlike other BTC bridges, sBTC is not supported by a central custodian or a federation: instead, sBTC is secured by an open network of signers, making sBTC the most decentralized, Bitcoin-backed asset.

In this article, we’ll cover the fundamentals of the sBTC security model, the role of sBTC Signers, and how the sBTC working group is enabling a more scalable sBTC protocol design.

### A Bitcoin-Backed Asset Worthy of Bitcoin

sBTC embraces the core principles of Bitcoin: decentralization, permissionless, and trust-minimization. The system is:

* Open Membership: sBTC operates as an open network, where anyone can become a validator, increasing the decentralization and inclusivity within the sBTC ecosystem. In contrast, other alternatives have closed groups of signers.
* Decentralized: The software libraries for sBTC can support over 150 validators, surpassing the limitations of current multi-sig implementations. This allows for a broader and more diverse set of participants, further strengthening decentralization.
* Trust-Minimized: sBTC provides users and developers with a trust-minimized option—you interact with a decentralized network instead of a central custodian or small group of signers, aligning with the core principles of Bitcoin.
* Collateral-Backed: Unlike alternative multi-sig approaches, which have zero collateral backing their respective Bitcoin pegs, sBTC has $250M+ of collateral in STX tokens deposited in the protocol, providing a substantial incentive to maintain the peg.

### Who Are the Signers?

The sBTC asset is supported by this network of “validators.” There can be up to 150 of them, and anyone can join/leave the signer network as they desire. We expect these validators will be a combination of:

* Trusted institutions (including exchanges and custodians, such as [Figment](https://flight.beehiiv.net/v2/clicks/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL2ZpZ21lbnQuaW8vaW5zaWdodHMvZmlnbWVudC10by1lbmFibGUtYml0Y29pbi1sMi1yZXdhcmRzLXdpdGgtdXBjb21pbmctc3VwcG9ydC1vZi10aGUtc3RhY2tzLWxheWVyLz91dG1fc291cmNlPXd3dy5iaXRjb2lud3JpdGVzLmNvbSZ1dG1fbWVkaXVtPXJlZmVycmFsJnV0bV9jYW1wYWlnbj1hLW1vcmUtc2VjdXJlLWJ0Yy1icmlkZ2UtdW5kZXJzdGFuZGluZy1zYnRjLXMtc2VjdXJpdHktbW9kZWwiLCJwb3N0X2lkIjoiY2M3ZDYyNGItZWNiYS00ZjA2LWFiZjYtNDFjZDdkODVhNTc4IiwicHVibGljYXRpb25faWQiOiIwNGYyNjRlOS02MjZiLTQ4OGYtYmMzYS0wOTQzNDVmOWZjZDIiLCJ2aXNpdF90b2tlbiI6ImNlZTQ1ZjUxLWU1ZjYtNDAwOC1iZTE4LWYzZjdiZTU1MGRkYyIsImlhdCI6MTcwNTk1OTYwNywiaXNzIjoib3JjaGlkIn0.r6zVSbBoqzl8oPj\_KBelC8PLxkq\_pzEI6O2BlRM3JVY) and [Copper](https://flight.beehiiv.net/v2/clicks/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL2NvcHBlci5jby9pbnNpZ2h0cy9jb21wYW55LW5ld3Mvc3RhY2tzLWxheWVyLWJpdGNvaW4tc3VwcG9ydD91dG1fc291cmNlPXd3dy5iaXRjb2lud3JpdGVzLmNvbSZ1dG1fbWVkaXVtPXJlZmVycmFsJnV0bV9jYW1wYWlnbj1hLW1vcmUtc2VjdXJlLWJ0Yy1icmlkZ2UtdW5kZXJzdGFuZGluZy1zYnRjLXMtc2VjdXJpdHktbW9kZWwiLCJwb3N0X2lkIjoiY2M3ZDYyNGItZWNiYS00ZjA2LWFiZjYtNDFjZDdkODVhNTc4IiwicHVibGljYXRpb25faWQiOiIwNGYyNjRlOS02MjZiLTQ4OGYtYmMzYS0wOTQzNDVmOWZjZDIiLCJ2aXNpdF90b2tlbiI6ImNlZTQ1ZjUxLWU1ZjYtNDAwOC1iZTE4LWYzZjdiZTU1MGRkYyIsImlhdCI6MTcwNTk1OTYwNywiaXNzIjoib3JjaGlkIn0.5ZwOvwnfmqtHg3QhJz9Qq6-dzgr\_3R4uOaQgMI0GbSQ))
* Stacking pools (such as [Xverse](https://flight.beehiiv.net/v2/clicks/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3Bvb2wueHZlcnNlLmFwcC8\_dXRtX3NvdXJjZT13d3cuYml0Y29pbndyaXRlcy5jb20mdXRtX21lZGl1bT1yZWZlcnJhbCZ1dG1fY2FtcGFpZ249YS1tb3JlLXNlY3VyZS1idGMtYnJpZGdlLXVuZGVyc3RhbmRpbmctc2J0Yy1zLXNlY3VyaXR5LW1vZGVsIiwicG9zdF9pZCI6ImNjN2Q2MjRiLWVjYmEtNGYwNi1hYmY2LTQxY2Q3ZDg1YTU3OCIsInB1YmxpY2F0aW9uX2lkIjoiMDRmMjY0ZTktNjI2Yi00ODhmLWJjM2EtMDk0MzQ1ZjlmY2QyIiwidmlzaXRfdG9rZW4iOiJjZWU0NWY1MS1lNWY2LTQwMDgtYmUxOC1mM2Y3YmU1NTBkZGMiLCJpYXQiOjE3MDU5NTk2MDcsImlzcyI6Im9yY2hpZCJ9.TPIBy5jzj4l7ytNVqUeIckhqdzRW2dWA-g6JdgrUxrk))
* Individual node operators

These signers lock up Stacks tokens (STX) in order to be a signer on the network, and for their work to maintain the sBTC peg, earn BTC rewards, making honest behavior the most profitable course of action.&#x20;

Greater than 70% of these signers are required to approve deposit and withdrawals from the system. This means that as long as at least 30% of validators are honest, the BTC deposited in sBTC is secure. To steal the BTC deposits, malicious actors would need to convince a number of validators that represent > 70% of the stacked STX capital to collude in order to steal the BTC funds. This is highly unlikely in practice given Stacks validators are geographically dispersed entities with significant business risk for behaving maliciously.

For more technical details on the implementation and design of sBTC, please refer to the [SIP025](https://flight.beehiiv.net/v2/clicks/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL2dpdGh1Yi5jb20vc3RhY2tzZ292L3NpcHMvYmxvYi9lNmIzMjMzZTc2YzIyY2ZkNmVmMDJmMjFhZGQ2NjY5NmI5ZTRjMzE0L3NpcHMvc2lwLTAyNS9zaXAtMDI1LXNidGMubWQ\_dXRtX3NvdXJjZT13d3cuYml0Y29pbndyaXRlcy5jb20mdXRtX21lZGl1bT1yZWZlcnJhbCZ1dG1fY2FtcGFpZ249YS1tb3JlLXNlY3VyZS1idGMtYnJpZGdlLXVuZGVyc3RhbmRpbmctc2J0Yy1zLXNlY3VyaXR5LW1vZGVsIiwicG9zdF9pZCI6ImNjN2Q2MjRiLWVjYmEtNGYwNi1hYmY2LTQxY2Q3ZDg1YTU3OCIsInB1YmxpY2F0aW9uX2lkIjoiMDRmMjY0ZTktNjI2Yi00ODhmLWJjM2EtMDk0MzQ1ZjlmY2QyIiwidmlzaXRfdG9rZW4iOiJjZWU0NWY1MS1lNWY2LTQwMDgtYmUxOC1mM2Y3YmU1NTBkZGMiLCJpYXQiOjE3MDU5NTk2MDcsImlzcyI6Im9yY2hpZCJ9.MpRVoPOtDQKxXZt-vIS2dwloDaYT4aEUVcpR4oyGUho). The SIP is currently under community review, pending approval on a future date to be announced.

### Inheriting Bitcoin’s Security

sBTC has a number of traits that make it more secure than other Bitcoin-backed assets.

#### sBTC has read access to Bitcoin.

Because Stacks smart contracts have read access to Bitcoin, users can send simple Bitcoin L1 transactions to interact with Stacks and deposit BTC for sBTC. In contrast, moving BTC to a chain that is not designed to work with BTC, like Solana or Ethereum, do not have this read access, which brings different security assumptions.

#### Stacks forks with Bitcoin.

A lot of complexity is introduced to Bitcoin-backed projects on other chains, given that Bitcoin and the other L1 are independent of each other. When Bitcoin forks, the other chain won’t care, and each fork can destabilize the peg as large numbers of transactions can be forced to roll back after the fact.

Unlike those projects, Stacks auto-follows all Bitcoin forks and derives its security from Bitcoin. There is no risk of the sBTC peg being deprecated by a Bitcoin fork because the entire Stacks blockchain will reorg alongside Bitcoin, bringing the peg back into alignment with Bitcoin.

#### sBTC is reorg-resistant.

Taking this one step further, the security properties of a Stacks transaction are the same as doing a Bitcoin transaction. As soon as a Bitcoin block arrives, Stacks transactions start getting Bitcoin finality. This is not possible with other systems. In other words, Stacks does not have a separate security budget. The security level of a Bitcoin L1 transaction in a Bitcoin block is the same as a Stacks transaction that gets packaged into that Bitcoin block.

#### Does sBTC have a hard cap/liveness ratio?

The original white paper proposed a liveness ratio, essentially a cap on the amount of sBTC that can be minted based on the value of STX locked into the protocol. This concept came from a security model of economic incentives, in which stackers have full signing control over a Bitcoin wallet containing the locked BTC. In the original white paper this was set to 60% of locked STX (i.e. if there is $200M of STX locked, the system capacity is $120M of BTC).&#x20;

However, after further research and consideration, the sBTC working group concluded that such a cap would significantly limit potential DeFi usage and discourage large players from entering the system. Given these findings and market realities, the sBTC design no longer has this liveness ratio, and instead relies on the trust-assumption of honest institutional validators as the final security backstop.

The research concluded that a hybrid system that has both (a) anonymous signers with locked STX _and_ (b) known, institutional signers that collectively hold > 30% locked STX, is arguably more secure than a system with just anonymous signers with locked capital. This is because institutional participants have significant incentives to behave honestly and thus bolster the organic economic incentives of the system.

For more information on this topic, see these resources:

* [Making sBTC ready for DeFi prime time](https://flight.beehiiv.net/v2/clicks/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL2ZvcnVtLnN0YWNrcy5vcmcvdC9tYWtpbmctc2J0Yy1yZWFkeS1mb3ItZGVmaS1wcmltZS10aW1lLzE0NDIxP3V0bV9zb3VyY2U9d3d3LmJpdGNvaW53cml0ZXMuY29tJnV0bV9tZWRpdW09cmVmZXJyYWwmdXRtX2NhbXBhaWduPWEtbW9yZS1zZWN1cmUtYnRjLWJyaWRnZS11bmRlcnN0YW5kaW5nLXNidGMtcy1zZWN1cml0eS1tb2RlbCIsInBvc3RfaWQiOiJjYzdkNjI0Yi1lY2JhLTRmMDYtYWJmNi00MWNkN2Q4NWE1NzgiLCJwdWJsaWNhdGlvbl9pZCI6IjA0ZjI2NGU5LTYyNmItNDg4Zi1iYzNhLTA5NDM0NWY5ZmNkMiIsInZpc2l0X3Rva2VuIjoiY2VlNDVmNTEtZTVmNi00MDA4LWJlMTgtZjNmN2JlNTUwZGRjIiwiaWF0IjoxNzA1OTU5NjA3LCJpc3MiOiJvcmNoaWQifQ.3Q8GK4GhEb8EZou9r7y1JZ\_lcRLFjpFTysv1wyZon8g)
* [sBTC Research - Cap on BTC in Peg Wallet](https://flight.beehiiv.net/v2/clicks/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL2dpdGh1Yi5jb20vc3RhY2tzLW5ldHdvcmsvc2J0Yy9kaXNjdXNzaW9ucy8zMTY\_dXRtX3NvdXJjZT13d3cuYml0Y29pbndyaXRlcy5jb20mdXRtX21lZGl1bT1yZWZlcnJhbCZ1dG1fY2FtcGFpZ249YS1tb3JlLXNlY3VyZS1idGMtYnJpZGdlLXVuZGVyc3RhbmRpbmctc2J0Yy1zLXNlY3VyaXR5LW1vZGVsIiwicG9zdF9pZCI6ImNjN2Q2MjRiLWVjYmEtNGYwNi1hYmY2LTQxY2Q3ZDg1YTU3OCIsInB1YmxpY2F0aW9uX2lkIjoiMDRmMjY0ZTktNjI2Yi00ODhmLWJjM2EtMDk0MzQ1ZjlmY2QyIiwidmlzaXRfdG9rZW4iOiJjZWU0NWY1MS1lNWY2LTQwMDgtYmUxOC1mM2Y3YmU1NTBkZGMiLCJpYXQiOjE3MDU5NTk2MDcsImlzcyI6Im9yY2hpZCJ9.YYbye-GFds4tBWFq6PL-J0-f1otxKQdGVjLVVKoo9cs)[ ](https://flight.beehiiv.net/v2/clicks/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL2dpdGh1Yi5jb20vc3RhY2tzLW5ldHdvcmsvc2J0Yy9kaXNjdXNzaW9ucy8zMTY\_dXRtX3NvdXJjZT13d3cuYml0Y29pbndyaXRlcy5jb20mdXRtX21lZGl1bT1yZWZlcnJhbCZ1dG1fY2FtcGFpZ249YS1tb3JlLXNlY3VyZS1idGMtYnJpZGdlLXVuZGVyc3RhbmRpbmctc2J0Yy1zLXNlY3VyaXR5LW1vZGVsIiwicG9zdF9pZCI6ImNjN2Q2MjRiLWVjYmEtNGYwNi1hYmY2LTQxY2Q3ZDg1YTU3OCIsInB1YmxpY2F0aW9uX2lkIjoiMDRmMjY0ZTktNjI2Yi00ODhmLWJjM2EtMDk0MzQ1ZjlmY2QyIiwidmlzaXRfdG9rZW4iOiJjZWU0NWY1MS1lNWY2LTQwMDgtYmUxOC1mM2Y3YmU1NTBkZGMiLCJpYXQiOjE3MDU5NTk2MDcsImlzcyI6Im9yY2hpZCJ9.YYbye-GFds4tBWFq6PL-J0-f1otxKQdGVjLVVKoo9cs)

#### What happens if the value of STX drops in relation to Bitcoin’s price?

Even if the price drops, validators will still have STX locked in the protocol, offering economic incentive to behave rationally (and remember, validators are also incentivized to behave honestly through the BTC rewards earned by their work to process deposits and withdrawals.)

With a combination of institutions, pools, and individuals, the design offers enough flexibility that we believe that at least 30% of signers will remain honest regardless of the price. The decision to utilize a combination of both economic and reputational incentives supports this assumption because institutions are likely to continue normal Signing operations, even if the collateral backing the system declines relative to BTC.

#### What is the purpose of the STX token?

The STX asset has two main uses: (a) mining incentives i.e., to keep the mining system open and decentralized; and (b) STX is the capital locked up in consensus that provides economic security to users who mint sBTC. STX will collateralize the sBTC system, offering greater levels security than systems that don’t post any collateral.
