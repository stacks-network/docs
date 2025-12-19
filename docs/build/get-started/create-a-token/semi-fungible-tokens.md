---
description: A guide to help you create your own semi-fungible tokens
---

# Semi-Fungible Tokens

Semi-fungible tokens (SFTs) are a hybrid token structure that embraces parts of both FTs (fungible tokens) and NFTs. SFTs are interchangeable (like FTs) and can be traded between users like cash—1 SFT has the same value as another SFT in the same collection. But each SFT also has a unique identifier (like NFTs).

SFTs are also particularly well suited for Web3 gaming and applications that need to issue lots of different tokens because SFTs enable different asset classes to be managed by a single smart contract (which as a developer is easier to manage and as a user results in cheaper transaction fees).

### Custom Development

For developers who want full control over their SFT implementation, here’s how to create a custom SIP-013 SFT on Stacks using Clarity. But before you deploy the SFT contract, you must have your SFT contract conform to the SIP-013 trait standard.

{% stepper %}
{% step %}
#### Define SIP-013 semi-fungible token trait

<details>

<summary><strong>What is SIP-013?</strong></summary>

[SIP-013](https://github.com/stacksgov/sips/blob/main/sips/sip-013/sip-013-semi-fungible-token-standard.md) is the standard for defining semi-fungible tokens on Stacks. Defining a common interface (known in Clarity as a "trait") allows different smart contracts, apps, and wallets to interoperate with semi-fungible token contracts in a reusable, standard way.

</details>

Below is an implementation of the SIP-013 trait standard for semi-fungible tokens. You can use the existing minimal standard SIP-013 trait or extend it by adding in your own custom traits. But the requirements of the SIP-013 traits are necessary to have at the minimum.

{% code title="SFT trait standard" expandable="true" %}
```clarity
(define-trait sip013-semi-fungible-token-trait
	(
		;; Get a token type balance of the passed principal.
		(get-balance (uint principal) (response uint uint))

		;; Get the total SFT balance of the passed principal.
		(get-overall-balance (principal) (response uint uint))

		;; Get the current total supply of a token type.
		(get-total-supply (uint) (response uint uint))

		;; Get the overall SFT supply.
		(get-overall-supply () (response uint uint))

		;; Get the number of decimal places of a token type.
		(get-decimals (uint) (response uint uint))

		;; Get an optional token URI that represents metadata for a specific token.
		(get-token-uri (uint) (response (optional (string-ascii 256)) uint))

		;; Transfer from one principal to another.
		(transfer (uint uint principal principal) (response bool uint))

		;; Transfer from one principal to another with a memo.
		(transfer-memo (uint uint principal principal (buff 34)) (response bool uint))
	)
)

```
{% endcode %}

All we are doing here is defining the function signatures for functions we'll need to implement in our SFT contract, which we can see a simple version of below.

**\[optional] transfer-many specification**\
SIP013 Semi-fungible tokens can also optionally implement the trait `sip013-transfer-many-trait` to offer a built-in "transfer-many" features for bulk token transfers.

{% code title="SFT transfer many trait" %}
```clarity
(define-trait sip013-transfer-many-trait
	(
		;; Transfer many tokens at once.
		(transfer-many ((list 200 {token-id: uint, amount: uint, sender: principal, recipient: principal})) (response bool uint))

		;; Transfer many tokens at once with memos.
		(transfer-many-memo ((list 200 {token-id: uint, amount: uint, sender: principal, recipient: principal, memo: (buff 34)})) (response bool uint))
	)
)
```
{% endcode %}
{% endstep %}

{% step %}
#### Implement SIP-013 trait in SFT contract

Any SFT contract that wants to conform to the SIP-013 semi-fungible token standard for Stacks needs to have this trait "implemented" in their SFT contract. See the below minimal SFT contract example of how this is done.

{% code title="semi-fungible-token.clar" expandable="true" %}
```clarity
(impl-trait 'SPDBEG5X8XD50SPM1JJH0E5CTXGDV5NJTKAKKR5V.sip013-semi-fungible-token-trait.sip013-semi-fungible-token-trait)
(impl-trait 'SPDBEG5X8XD50SPM1JJH0E5CTXGDV5NJTKAKKR5V.sip013-transfer-many-trait.sip013-transfer-many-trait)

(define-fungible-token semi-fungible-token)
(define-non-fungible-token semi-fungible-token-id {token-id: uint, owner: principal})
(define-map token-balances {token-id: uint, owner: principal} uint)
(define-map token-supplies uint uint)

(define-constant contract-owner tx-sender)

(define-constant err-owner-only (err u100))
(define-constant err-insufficient-balance (err u1))
(define-constant err-invalid-sender (err u4))

(define-private (set-balance (token-id uint) (balance uint) (owner principal))
	(map-set token-balances {token-id: token-id, owner: owner} balance)
)

(define-private (get-balance-uint (token-id uint) (who principal))
	(default-to u0 (map-get? token-balances {token-id: token-id, owner: who}))
)

(define-read-only (get-balance (token-id uint) (who principal))
	(ok (get-balance-uint token-id who))
)

(define-read-only (get-overall-balance (who principal))
	(ok (ft-get-balance semi-fungible-token who))
)

(define-read-only (get-total-supply (token-id uint))
	(ok (default-to u0 (map-get? token-supplies token-id)))
)

(define-read-only (get-overall-supply)
	(ok (ft-get-supply semi-fungible-token))
)

(define-read-only (get-decimals (token-id uint))
	(ok u0)
)

(define-read-only (get-token-uri (token-id uint))
	(ok none)
)

;; #[allow(unchecked_params)]
(define-public (transfer (token-id uint) (amount uint) (sender principal) (recipient principal))
	(let
		(
			(sender-balance (get-balance-uint token-id sender))
		)
		(asserts! (or (is-eq sender tx-sender) (is-eq sender contract-caller)) err-invalid-sender)
		(asserts! (<= amount sender-balance) err-insufficient-balance)
		(try! (ft-transfer? semi-fungible-token amount sender recipient))
		(try! (tag-nft-token-id {token-id: token-id, owner: sender}))
		(try! (tag-nft-token-id {token-id: token-id, owner: recipient}))
		(set-balance token-id (- sender-balance amount) sender)
		(set-balance token-id (+ (get-balance-uint token-id recipient) amount) recipient)
		(print {type: "sft_transfer", token-id: token-id, amount: amount, sender: sender, recipient: recipient})
		(ok true)
	)
)

(define-public (transfer-memo (token-id uint) (amount uint) (sender principal) (recipient principal) (memo (buff 34)))
	(begin
		(try! (transfer token-id amount sender recipient))
		(print memo)
		(ok true)
	)
)

(define-private (transfer-many-iter (item {token-id: uint, amount: uint, sender: principal, recipient: principal}) (previous-response (response bool uint)))
	(match previous-response prev-ok (transfer (get token-id item) (get amount item) (get sender item) (get recipient item)) prev-err previous-response)
)

(define-public (transfer-many (transfers (list 200 {token-id: uint, amount: uint, sender: principal, recipient: principal})))
	(fold transfer-many-iter transfers (ok true))
)

(define-private (transfer-many-memo-iter (item {token-id: uint, amount: uint, sender: principal, recipient: principal, memo: (buff 34)}) (previous-response (response bool uint)))
	(match previous-response prev-ok (transfer-memo (get token-id item) (get amount item) (get sender item) (get recipient item) (get memo item)) prev-err previous-response)
)

(define-public (transfer-many-memo (transfers (list 200 {token-id: uint, amount: uint, sender: principal, recipient: principal, memo: (buff 34)})))
	(fold transfer-many-memo-iter transfers (ok true))
)

(define-public (mint (token-id uint) (amount uint) (recipient principal))
	(begin
		(asserts! (is-eq tx-sender contract-owner) err-owner-only)
		(try! (ft-mint? semi-fungible-token amount recipient))
		(try! (tag-nft-token-id {token-id: token-id, owner: recipient}))
		(set-balance token-id (+ (get-balance-uint token-id recipient) amount) recipient)
		(map-set token-supplies token-id (+ (unwrap-panic (get-total-supply token-id)) amount))
		(print {type: "sft_mint", token-id: token-id, amount: amount, recipient: recipient})
		(ok true)
	)
)

(define-private (tag-nft-token-id (nft-token-id {token-id: uint, owner: principal}))
	(begin
		(and
			(is-some (nft-get-owner? semi-fungible-token-id nft-token-id))
			(try! (nft-burn? semi-fungible-token-id nft-token-id (get owner nft-token-id)))
		)
		(nft-mint? semi-fungible-token-id nft-token-id (get owner nft-token-id))
	)
)
```
{% endcode %}

This is the Clarity code we need in order to create a SFT, with an additional function, `mint` that allows us to actually create a new SFT. This `mint` function is not needed to adhere to the trait.

The token contract example above is passing in already deployed traits on mainnet into the `impl-trait` function. You can use these same deployed traits for your own SFT contract as well.

{% hint style="success" %}
Deployed SIP-013 trait contracts you can directly implement in your custom token contract:

* \[mainnet] SPDBEG5X8XD50SPM1JJH0E5CTXGDV5NJTKAKKR5V.sip013-semi-fungible-token-trait
* \[mainnet] SPDBEG5X8XD50SPM1JJH0E5CTXGDV5NJTKAKKR5V.sip013-transfer-many-trait

Reminder: when implementing these deployed traits in your contract, be sure to also add them as contract requirements in Clarinet.
{% endhint %}
{% endstep %}
{% endstepper %}

### Best Practices

<details>

<summary>How to deal with post-conditions on SFTs?</summary>

Check out the SIP-013 standard for more info on dealing with post-conditions for SFTs.

</details>

### Additional Resources

* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-013/sip-013-semi-fungible-token-standard.md)] SIP-013 Standard Trait Definition for Semi-Fungible Tokens
* \[[Hiro YT](https://youtu.be/a7c8aBiIkD4?si=k4cUS5DHrUsnm7Q9)] A Walkthrough of a SIP013 Implementation of SFTs on Stacks
* \[[DegenLab](https://docs.degenlab.io/gamefistacks/sfts/general-idea-and-base-sfts-static-deployments)] Example of SFT implementation with DegenLab&#x20;
