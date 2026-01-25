---
description: Use cases of gaming on Stacks
---

# Gaming

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/gaming.png" alt=""><figcaption></figcaption></figure></div>

Gaming is one of the most powerful entry points for bringing millions of new users into the Bitcoin ecosystem, and Stacks unlocks this opportunity with onchain logic secured by Bitcoin itself. By enabling fast, low-cost transactions, expressive smart contracts, and asset ownership through NFTs and fungible tokens, Stacks gives game developers the tools to build richer in-game economies, verifiable digital ownership, and player-driven marketplaces—all anchored to Bitcoin’s security. This combination lets games move beyond simple collectibles and into fully programmable, decentralized worlds where players truly own their assets and developers can design deeper incentives, interoperable items, and sustainable onchain economies.

Here are some powerful examples of how Stacks is unlocking on-chain gaming for Bitcoin:

### Skullcoin

Skullcoin is a Web3 gaming project building a new genre called Find2Earn — treasure hunt games powered by Encrypted NFTs and real on-chain rewards. An Encrypted NFT is a new type of digital asset with two layers of information: a public layer visible to everyone, and a private encrypted layer that can only be revealed by the owner of NFT.

**Implementation highlight:**\
Here's a high-level breakdown of Skullcoin's Encrypted NFTs:

* **What happens on-chain**: standard SIP-009 NFTs + commitments (hashes / indexes / events) that define what’s “locked” and who has the right to unlock it;
* **What happens off-chain**: the actual encrypted payload (image / text / coords) lives in storage and is only served after the on-chain proof/conditions are satisfied.

{% code title="skullcoin-competitive-seed-phase2.clar" %}
```clarity
;; --snip--

(define-private (is-sender-owner (id uint))
  (let ((owner (unwrap! (nft-get-owner? skullcoin_competitive_seed_p2 id) false)))
    (or (is-eq tx-sender owner) (is-eq contract-caller owner))))
    
;; --snip--
```
{% endcode %}

<details>

<summary>Check out more from Skullcoin</summary>

* \[[Official](https://skullco.in/)] Official website of Skullcoin
* \[[Whitepaper](https://docs.skullco.in/)] Skullcoin whitepaper/docs
* \[[contracts](https://github.com/proofofgame/find_to_earn)] Github repo for Skullcoin's Find2Earn contracts

</details>

***

### Cryptonauts

Cryptonauts is a multiplayer GameFi Experience built on Unreal Engine 5 and powered by **Stacks**, a Bitcoin-anchored smart contract layer. Cryptonauts integrates Stacks wallet authentication, NFT verification, and on-chain asset logic directly into Unreal Engine, enabling features such as player skin ownership validation, Codex Component loadouts (NFT-based abilities), and signed game session data for Web3 interoperability.

**Implementation highlight:**\
Cryptonauts leverages BNS for player identification.&#x20;

* **Human-readable identities for players** — instead of using cryptographic addresses, BNS lets players show names like `cryptodude.btc`. This makes in-game identities more memorable, personality-driven, and social.
* **Persistent identity + on-chain history** — BNS allows binding off-chain state to names and linking with on-chain state. That means a player’s actions, assets, and progress can be tied to a stable identity — even if they change wallets.

{% code title="https://api.bnsv2.com/names/address/SP3WAR3N1XRR139DXCGPR1ATPK2VN63PGRXTD537N/valid" expandable="true" %}
```json
{
  "total": 2,
  "current_burn_block": 921664,
  "limit": 50,
  "offset": 0,
  "names": [
    {
      "full_name": "cryptodude.btc",
      "name_string": "cryptodude",
      "namespace_string": "btc",
      "owner": "SP3WAR3N1XRR139DXCGPR1ATPK2VN63PGRXTD537N",
      "registered_at": "28369",
      "renewal_height": "1125897",
      "stx_burn": "2000000",
      "revoked": false
    }
  ]
}
```
{% endcode %}

<details>

<summary>Check out more from Cryptonauts</summary>

* \[[docs](https://cryptonauts.gitbook.io/cryptonauts-docs)] Cryptonauts docs

</details>

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/its-time-to-stake-your-claim-on-the-future-of-web3-gaming)] It’s Time to Stake Your Claim on the Future of Web3 Gaming
* \[[Hiro Blog](https://www.hiro.so/blog/what-are-gaming-nfts-and-how-can-they-drive-bitcoin-adoption)] What Are Gaming NFTs and How Can They Drive Bitcoin Adoption?
