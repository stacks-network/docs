# Bitcoin Name System

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/image (20).png" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
**Builder Resources**

* Official BNSv2 website for stats, [here](https://www.bnsv2.com/).
* BNSv2 mainnet contract, [here](https://explorer.hiro.so/txid/SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2).
* BNSv2 SDK, [here](https://github.com/Strata-Labs/bns-v2-sdk).
* BNSv2 contracts repo, [here](https://github.com/Trust-Machines/BNS-V2).
{% endhint %}

#### At a Glance

* BNS is the live naming system on Stacks
* Human-readable names like `alice.id` or `muneeb.btc` map to on-chain data
* Names are SIP-009 compliant NFTs: transferable, tradeable, composable
* Built-in marketplace for listing, buying, and selling names
* Supports both open (unmanaged) and governed (managed) namespaces
* Each address can own multiple names and designate a primary name
* Fully implemented as Clarity smart contracts
* The current BNS implementation uses the BNS V2 contract, deployed in September 2024. It succeeded the V1 contract from Stacks mainnet launch in 2021.

***

## What is BNS?

The **Bitcoin Name System (BNS)** is a decentralized naming system built on Stacks and secured by Bitcoin. It enables human-readable names (e.g., `alice.id`) that map to on-chain identities, addresses, and arbitrary records.

Bitcoin Name Service (BNS) is a decentralized identity protocol that originally started on Bitcoin as Namecoin in 2014 before migrating to Bitcoin in 2015, and eventually Stacks when its mainnet launched in 2021.

That means BNS predates ENS by multiple years!

BNS is represented by the popular .btc namespace but has many others including .id, .locker, .app and more. Anyone can create a new namespace and have users register names within that. Currently there are 97 namespaces and over 360,000 names registered on BNS \[as of March 2026]!

| Top Namespaces \[as of March 2026] | Names registered under the namespace |
| ---------------------------------- | ------------------------------------ |
| .btc                               | 302,999                              |
| .stx                               | 21,861                               |
| .app                               | 12,445                               |
| .id                                | 12,053                               |
| .stacks                            | 3,961                                |

The benefit of a BNS name is simple: Rather than sending crypto to a long STX or BTC address, you can use a human-readable name like muneeb.btc instead.

BNS names are compatible with Stacks wallets like Leather and Xverse and support both Stacks L2 and Bitcoin L1 for payments.

BNS replaces complex blockchain addresses with names that:

* Can resolve to Stacks principals
* Can store structured metadata
* Names can store zonefiles containing profile data (bio, PFP, social links), wallet addresses across chains (BTC, ETH, etc.), subdomain definitions, and arbitrary key-value metadata. All stored on-chain via the zonefile-resolver contract.
* Can integrate directly with smart contracts
* Are owned and managed entirely on-chain

Stacks currently runs **BNSv2**, an upgraded implementation designed for improved composability, clarity, and developer ergonomics. It allows users to register, manage, and transfer names within different namespaces. It also introduces a native marketplace, managed namespaces with custom governance, multi-name ownership per address, primary name designation, and on-chain zonefile storage decoupled from the main contract.

***

{% embed url="https://youtu.be/Ua4i-FxPsoE?si=sU0q2MceU51N0CYZ" %}

***

## Additional Resources

* [\[BNSv2 Official\]](https://www.bnsv2.com/) Official BNSv2 site
* [\[BNS One\]](https://bns.one/) Register, trade, discover BNS namespaces and names
* \[[Trust Machines Github](https://github.com/Trust-Machines/BNS-V2)] BNSv2 contracts repository
* [\[Stacks Forum\]](https://forum.stacks.org/t/megathread-bns-upgrade-discussion/14899) Previous upgrade discussion thread
* [\[BNSv1\]](https://explorer.hiro.so/address/SP000000000000000000002Q6VF78.bns?chain=mainnet) The previous BNSv1 implementation boot contract
* [\[BNS Community\]](https://x.com/bns_community) Twitter community page for all things BNS
* [\[Gamma\]](https://gamma.io/stacks/collections/bns-v2/items) Marketplace for trading BNS
* [\[BTC US\]](https://btc.us/) Register BNS names
