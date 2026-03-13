# Semi Fungible Token

By [@MarvinJanssen](https://github.com/MarvinJanssen/stx-semi-fungible-token)

{% code title="semi-fungible-token.clar" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
(impl-trait .sip013-semi-fungible-token-trait.sip013-semi-fungible-token-trait)
(impl-trait .sip013-transfer-many-trait.sip013-transfer-many-trait)

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

## Contract Summary

The Semi-Fungible Token (SFT) contract implements the SIP-013 standard, enabling tokens that combine characteristics of both fungible and non-fungible tokens. Built by [@MarvinJanssen](https://github.com/MarvinJanssen/stx-semi-fungible-token), this contract allows multiple token classes where each class can have multiple fungible units, similar to ERC-1155 on Ethereum.

**Key Features:**

* **SIP-013 Standard Compliance** - Implements the official Stacks semi-fungible token trait
* **Dual Token Architecture** - Uses both fungible and non-fungible token primitives for efficient tracking
* **Per-Token-ID Balances** - Each token ID maintains separate balances for different owners
* **Batch Transfers** - Transfer up to 200 different token types in a single transaction
* **Memo Support** - Optional memo field for transfers to include additional metadata
* **Minting Control** - Contract owner can mint new tokens of any token ID
* **Supply Tracking** - Tracks both per-token-ID supply and overall supply across all tokens

**What Developers Can Learn:**

* How to implement SIP-013 semi-fungible token standard
* Combining fungible and non-fungible token primitives in a single contract
* Efficient batch transfer patterns using fold
* Balance tracking with composite map keys (token-id + owner)
* NFT tagging technique for ownership discovery
* Event emission patterns for indexers and explorers

***

{% embed url="https://youtu.be/a7c8aBiIkD4?si=E6L7Li1bCpaKuOp1" %}

***

## Function-by-Function Breakdown

### SIP-013 Transfer Functions

#### **`transfer (token-id uint) (amount uint) (sender principal) (recipient principal)`**

Transfers a specified amount of a token ID from sender to recipient. Updates both the fungible token balance and NFT ownership tags.

#### **`transfer-memo (token-id uint) (amount uint) (sender principal) (recipient principal) (memo (buff 34))`**

Same as transfer but includes a memo field that is printed as an event. Useful for including payment references or notes.

#### **`transfer-many (transfers (list 200 {...}))`**

Executes multiple transfers in a single transaction using fold. Can transfer up to 200 different token IDs/amounts in one call.

#### **`transfer-many-memo (transfers (list 200 {...}))`**

Batch transfer with memo support, allowing each transfer in the list to include its own memo field.

### SIP-013 Query Functions

#### **`get-balance (token-id uint) (who principal)`**

Returns the balance of a specific token ID for a given principal.

#### **`get-overall-balance (who principal)`**

Returns the total balance across all token IDs for a principal using the underlying fungible token.

#### **`get-total-supply (token-id uint)`**

Returns the total supply of a specific token ID across all owners.

#### **`get-overall-supply`**

Returns the total supply of all tokens combined.

#### **`get-decimals (token-id uint)`**

Returns the number of decimals for a token ID (always returns 0 in this implementation).

#### **`get-token-uri (token-id uint)`**

Returns the metadata URI for a token ID (returns none in this implementation).

### Minting Functions

#### **`mint (token-id uint) (amount uint) (recipient principal)`**

Mints new tokens of a specific token ID to a recipient. Only callable by the contract owner.

### Private Helper Functions

#### **`set-balance (token-id uint) (balance uint) (owner principal)`**

Private function that updates the balance map for a specific token ID and owner combination.

#### **`get-balance-uint (token-id uint) (who principal)`**

Private function that retrieves the balance as a uint, returning 0 if no balance exists.

#### **`tag-nft-token-id (nft-token-id {token-id: uint, owner: principal})`**

Private function that creates or updates NFT ownership tags for discovery. Burns existing tag if present, then mints a new one.

#### **`transfer-many-iter (item {...}) (previous-response (response bool uint))`**

Private fold iterator for batch transfers. Processes each transfer item sequentially, short-circuiting on first error.

#### **`transfer-many-memo-iter (item {...}) (previous-response (response bool uint))`**

Private fold iterator for batch transfers with memos. Same as transfer-many-iter but includes memo handling.

### Traits Implemented

#### **`sip013-semi-fungible-token-trait`**

Standard trait for semi-fungible tokens on Stacks, defining the required interface for SFT implementations.

#### **`sip013-transfer-many-trait`**

Extension trait for batch transfer functionality, enabling efficient multi-token transfers.

***

## Key Concepts

### Semi-Fungible Token Model

SFTs are tokens where each token ID can have multiple fungible units. Think of it like trading cards - each card design (token ID) is unique, but you can own multiple copies (fungible units) of the same design. This is useful for gaming items, event tickets, or fractional ownership.

### Dual Token Architecture

The contract uses both `define-fungible-token` and `define-non-fungible-token` primitives. The fungible token tracks overall balances efficiently, while the NFT component provides a discovery mechanism for which token IDs a principal owns.

### Supply Tracking at Two Levels

The contract maintains both per-token-ID supply in `token-supplies` and overall supply using `ft-get-supply`. This dual tracking enables efficient queries at different granularities without recalculation.
