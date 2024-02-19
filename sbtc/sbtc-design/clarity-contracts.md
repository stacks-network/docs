# Clarity Contracts

One of the key pieces of the sBTC system is the set of Clarity contracts that facilitate the operations of the sBTC token.

Recall that sBTC is a [SIP-010 fungible token](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md) on the Stacks chain. This provides an easy-to-use interface for interacting with sBTC.

Upon successful deposit and withdrawal transactions the signer system will call functions in this contract. Here we'll walk through the contracts and explain what each piece is doing so you have a thorough understanding of the Clarity code running sBTC.

:::note It's important to note that sBTC is currently in Developer Release. This is a developer preview so developers can begin learning and experimenting with sBTC before moving to the fully decentralized version. As such, these contracts are subject to change. :::

The Clarity contracts live in the [`romeo/asset-contract/contracts`](https://github.com/stacks-network/sbtc/tree/main/romeo/asset-contract/contracts) folder of the [`sbtc` repo](https://github.com/stacks-network/sbtc).

In that folder you'll see three files:

* `asset.clar`
* `clarity-bitcoin-mini-deploy.clar`
* `clarity-bitcoin-mini.clar`

The `asset` contract is what does the heavy lifting for sBTC operations. The `clarity-bitcoin-mini` library is a stateless utility library to make it easier to interact with Bitcoin. This is a key feature of sBTC and this library provides several helper functions to handle that.

The `clarity-bitcoin-mini-deploy` contract is exactly the same, except debug mode is set to false for production.

Now, let's go through the `asset` contract.

```clojure
;; title: wrapped BTC on Stacks
;; version: 0.1.0
;; summary: sBTC dev release asset contract
;; description: sBTC is a wrapped BTC asset on Stacks.
;; It is a fungible token (SIP-10) that is backed 1:1 by BTC
;; For this version the wallet is controlled by a centralized entity.
;; sBTC is minted when BTC is deposited into the wallet and
;; burned when BTC is withdrawn from the wallet.
;; Requests for minting and burning are made by the contract owner.

;; token definitions
;; 100 M sats = 1 sBTC
;; 21 M sBTC supply = 2.1 Q sats total
(define-fungible-token sbtc u2100000000000000)

;; constants
;;
(define-constant err-invalid-caller (err u4))
(define-constant err-forbidden (err u403))
(define-constant err-btc-tx-already-used (err u500))

;; data vars
;;
(define-data-var contract-owner principal tx-sender)
(define-data-var bitcoin-wallet-public-key (optional (buff 33)) none)

;; stores all btc txids that have been used to mint or burn sBTC
(define-map amounts-by-btc-tx (buff 32) int)

;; public functions
;;

;; #[allow(unchecked_data)]
(define-public (set-contract-owner (new-owner principal))
  (begin
    (try! (is-contract-owner))
    (ok (var-set contract-owner new-owner))
  )
)

;; #[allow(unchecked_data)]
(define-public (set-bitcoin-wallet-public-key (public-key (buff 33)))
    (begin
        (try! (is-contract-owner))
        (ok (var-set bitcoin-wallet-public-key (some public-key)))
    )
)

;; #[allow(unchecked_data)]
(define-public (mint (amount uint)
    (destination principal)
    (deposit-txid (buff 32))
    (burn-chain-height uint)
    (merkle-proof (list 14 (buff 32)))
    (tx-index uint)
    (block-header (buff 80)))
    (begin
        (try! (is-contract-owner))
        (try! (verify-txid-exists-on-burn-chain deposit-txid burn-chain-height merkle-proof tx-index block-header))
        (asserts! (map-insert amounts-by-btc-tx deposit-txid (to-int amount)) err-btc-tx-already-used)
        (try! (ft-mint? sbtc amount destination))
        (print {notification: "mint", payload: deposit-txid})
        (ok true)
    )
)

;; #[allow(unchecked_data)]
(define-public (burn (amount uint)
    (owner principal)
    (withdraw-txid (buff 32))
    (burn-chain-height uint)
    (merkle-proof (list 14 (buff 32)))
    (tx-index uint)
    (block-header (buff 80)))
    (begin
        (try! (is-contract-owner))
        (try! (verify-txid-exists-on-burn-chain withdraw-txid burn-chain-height merkle-proof tx-index block-header))
        (asserts! (map-insert amounts-by-btc-tx withdraw-txid (* -1 (to-int amount))) err-btc-tx-already-used)
        (try! (ft-burn? sbtc amount owner))
        (print {notification: "burn", payload: withdraw-txid})
    	(ok true)
    )
)

;; #[allow(unchecked_data)]
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
	(begin
        (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) err-invalid-caller)
		(try! (ft-transfer? sbtc amount sender recipient))
		(match memo to-print (print to-print) 0x)
		(ok true)
	)
)

;; read only functions
;;
(define-read-only (get-bitcoin-wallet-public-key)
    (var-get bitcoin-wallet-public-key)
)

(define-read-only (get-contract-owner)
    (var-get contract-owner)
)

(define-read-only (get-name)
	(ok "sBTC")
)

(define-read-only (get-symbol)
	(ok "sBTC")
)

(define-read-only (get-decimals)
	(ok u8)
)

(define-read-only (get-balance (who principal))
	(ok (ft-get-balance sbtc who))
)

(define-read-only (get-total-supply)
	(ok (ft-get-supply sbtc))
)

(define-read-only (get-token-uri)
	(ok (some u"https://gateway.pinata.cloud/ipfs/Qma5P7LFGQAXt7gzkNZGxet5qJcVxgeXsenDXwu9y45hpr?_gl=1*1mxodt*_ga*OTU1OTQzMjE2LjE2OTQwMzk2MjM.*_ga_5RMPXG14TE*MTY5NDA4MzA3OC40LjEuMTY5NDA4MzQzOC42MC4wLjA"))
)

(define-read-only (get-amount-by-btc-txid (btc-txid (buff 32)))
    (map-get? amounts-by-btc-tx btc-txid)
)

;; private functions
;;
(define-private (is-contract-owner)
    (ok (asserts! (is-eq (var-get contract-owner) contract-caller) err-forbidden))
)

(define-read-only (verify-txid-exists-on-burn-chain (txid (buff 32)) (burn-chain-height uint) (merkle-proof (list 14 (buff 32))) (tx-index uint) (block-header (buff 80)))
    (contract-call? .clarity-bitcoin-mini was-txid-mined burn-chain-height txid block-header { tx-index: tx-index, hashes: merkle-proof})
)
```

Although powerful, the sBTC contract is actually relatively simple. The `mint` and `burn` functions of the contract will not be interacted with directly by a developer or a user, but instead will be called by the sBTC signer system upon successful deposit and withdrawal requests. The `transfer` function, however, will often be called by developers for users looking to transfer their sBTC.

Up at the top we are setting some variables, most notably the sBTC supply, which is set to match 1:1 with BTC supply.

We also have the contract owner and Bitcoin wallet public key which will be set by the sBTC protocol. As per the design documentation, the Bitcoin public key will change every stacking reward cycle to the new threshold wallet.

Next we have two basic public functions to set those two variables.

Finally we are defining a map to define all deposit and withdrawal transaction IDs to ensure that once a particular Bitcoin transaction has been used in a sBTC operation, it can not be used again.

The next three functions comprise the bulk of the sBTC functionality.

Before we get to those, let's take a look at the `verify-txid-exists-on-burn-chain` towards the bottom of the contract. This utilizes the helper contract to ensure that a transaction actually happened on the Bitcoin chain.

This native integration with the Bitcoin L1 is one of the great parts of Clarity, as we can verify directly from our smart contracts whether or not a Bitcoin transaction was actually mined, all on chain.

```clojure
(define-read-only (verify-txid-exists-on-burn-chain (txid (buff 32)) (burn-chain-height uint) (merkle-proof (list 14 (buff 32))) (tx-index uint) (block-header (buff 80)))
    (contract-call? .clarity-bitcoin-mini was-txid-mined burn-chain-height txid block-header { tx-index: tx-index, hashes: merkle-proof})
)
```

This takes in a transaction ID, the Bitcoin block height the transaction was in, and a merkle proof. All of this information is passed to the library to verify that the transaction actually occurred.

For some more context on how this process works and to see how to use it your own projects, be sure to check out the [Bitcoin Primer](https://bitcoinprimer.dev).

### Mint

```clojure
;; #[allow(unchecked_data)]
(define-public (mint (amount uint)
    (destination principal)
    (deposit-txid (buff 32))
    (burn-chain-height uint)
    (merkle-proof (list 14 (buff 32)))
    (tx-index uint)
    (block-header (buff 80)))
    (begin
        (try! (is-contract-owner))
        (try! (verify-txid-exists-on-burn-chain deposit-txid burn-chain-height merkle-proof tx-index block-header))
        (asserts! (map-insert amounts-by-btc-tx deposit-txid (to-int amount)) err-btc-tx-already-used)
        (try! (ft-mint? sbtc amount destination))
        (print {notification: "mint", payload: deposit-txid})
        (ok true)
    )
)
```

Now we get to the `mint` function. This is the function that is called when a deposit transaction is initiated and processed on the Bitcoin side. The signer will detect that and call the `mint` function.

This function takes in some information that is all read directly from the provided Bitcoin transaction. It includes the Stacks principal to mint the sBTC to, and all of the required Bitcoin transaction information required to verify it.

It then checks to make sure the contract owner (the signer system) is calling it, makes sure the Bitcoin transaction actually happened, updates the map of Bitcoin transactions that have been used in sBTC operations, and mints the token to the specified Stacks principal.

### Burn

```clojure
;; #[allow(unchecked_data)]
(define-public (burn (amount uint)
    (owner principal)
    (withdraw-txid (buff 32))
    (burn-chain-height uint)
    (merkle-proof (list 14 (buff 32)))
    (tx-index uint)
    (block-header (buff 80)))
    (begin
        (try! (is-contract-owner))
        (try! (verify-txid-exists-on-burn-chain withdraw-txid burn-chain-height merkle-proof tx-index block-header))
        (asserts! (map-insert amounts-by-btc-tx withdraw-txid (* -1 (to-int amount))) err-btc-tx-already-used)
        (try! (ft-burn? sbtc amount owner))
        (print {notification: "burn", payload: withdraw-txid})
    	(ok true)
    )
)
```

The `burn` function works much the same except it is called upon a successful withdrawal request, when a user wants to convert their sBTC back to BTC.

### Transfer

```clojure
;; #[allow(unchecked_data)]
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
	(begin
        (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) err-invalid-caller)
		(try! (ft-transfer? sbtc amount sender recipient))
		(match memo to-print (print to-print) 0x)
		(ok true)
	)
)
```

Finally we have a basic transfer function that allows users to transfer sBTC between each other.

The rest of the functions are basic `read-only` functions that are used to retrieve information about the asset.
