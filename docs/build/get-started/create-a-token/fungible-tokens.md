---
description: A guide to help you create your own fungible tokens
---

# Fungible Tokens

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure></div>

Creating a fungible token on Stacks can happen a few different ways — using no-code launchpads or writing your own Clarity smart contract. This guide helps you pick the best path for your goals and gives you the implementation details to ship confidently, whether you’re deploying with clicks or code.

### Custom Development

For developers who want full control over their token implementation, here’s how to create a custom SIP-010 token on Stacks using Clarity. But before you deploy the token contract, you must have your token contract conform to the SIP-010 trait standard.

{% stepper %}
{% step %}
**Define SIP-010 fungible token trait**

<details>

<summary><strong>What is SIP-010?</strong></summary>

[SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md) is the standard for defining fungible tokens on Stacks. Defining a common interface (known in Clarity as a "trait") allows different smart contracts, apps, and wallets to interoperate with fungible token contracts in a reusable way.

</details>

Below is an implementation of the SIP-010 trait standard for fungible tokens. You can use the existing minimal standard SIP-010 trait or extend it by adding in your own custom traits. But the requirements of the SIP-010 traits are necessary to have at the minimum.

{% code title="SIP-010 trait implementation" expandable="true" %}
```clarity
(define-trait sip-010-trait
  (
    ;; Transfer from the caller to a new principal
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))

    ;; the human readable name of the token
    (get-name () (response (string-ascii 32) uint))

    ;; the ticker symbol, or empty if none
    (get-symbol () (response (string-ascii 32) uint))

    ;; the number of decimals used, e.g. 6 would mean 1_000_000 represents 1 token
    (get-decimals () (response uint uint))

    ;; the balance of the passed principal
    (get-balance (principal) (response uint uint))

    ;; the current total supply (which does not need to be a constant)
    (get-total-supply () (response uint uint))

    ;; an optional URI that represents metadata of this token
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)
```
{% endcode %}

All we are doing here is defining the function signatures for functions we'll need to implement in our token contract, which we can see a simple version of below.
{% endstep %}

{% step %}
**Implement SIP-010 trait in token contract**

Any token contract that wants to conform to the SIP-010 fungible token standard for Stacks needs to have this trait "implemented" in their token contract. See the below minimal token contract example of how this is done.

{% code title="token-contract-clar" expandable="true" %}
```clarity
;; This contract implements the SIP-010 community-standard Fungible Token trait.
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define the FT, with no maximum supply
(define-fungible-token clarity-coin)

;; Define errors
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))

;; Define constants for contract
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_NAME "Clarity Coin")
(define-constant TOKEN_SYMBOL "CC")
(define-constant TOKEN_DECIMALS u6) ;; 6 units displayed past decimal, e.g. 1.000_000 = 1 token

(define-data-var token-uri (string-utf8 256) u"https://hiro.so") ;; utf-8 string with token metadata host

;; SIP-010 function: Get the token balance of a specified principal
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clarity-coin who))
)

;; SIP-010 function: Returns the total supply of fungible token
(define-read-only (get-total-supply)
  (ok (ft-get-supply clarity-coin))
)

;; SIP-010 function: Returns the human-readable token name
(define-read-only (get-name)
  (ok TOKEN_NAME)
)

;; SIP-010 function: Returns the symbol or "ticker" for this token
(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL)
)

;; SIP-010 function: Returns number of decimals to display
(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS)
)

;; SIP-010 function: Returns the URI containing token metadata
(define-read-only (get-token-uri)
  (ok (some (var-get token-uri)))
)

;; Properly updates token URI by emitting a SIP-019 token metadata update notification
(define-public (set-token-uri (value (string-utf8 256)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
        (var-set token-uri value)
        (ok (print {
              notification: "token-metadata-update",
              payload: {
                contract-id: current-contract,
                token-class: "ft"
              }
            })
        )
    )
)

;; Mint new tokens and send them to a recipient.
;; Only the contract deployer can perform this operation.
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (ft-mint? clarity-coin amount recipient)
  )
)

;; SIP-010 function: Transfers tokens to a recipient
;; Sender must be the same as the caller to prevent principals from transferring tokens they do not own.
(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34)))
)
  (begin
    ;; #[filter(amount, recipient)]
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
    (try! (ft-transfer? clarity-coin amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)
```
{% endcode %}

This is the Clarity code we need in order to create an fungible token, with one additional function, `mint` that allows us to actually create a new fungible tokens. This `mint` function is not needed to adhere to the trait.

The token contract example above is passing in an already deployed trait on mainnet into the `impl-trait` function. You can use this same deployed trait for your own token contract as well.

{% hint style="success" %}
Deployed SIP-010 trait contracts you can directly implement in your custom token contract:

* \[mainnet] [SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait](https://explorer.hiro.so/txid/SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard?chain=mainnet)
* \[testnet] [ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait](https://explorer.hiro.so/txid/ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard?chain=testnet)

Reminder: when implementing these deployed traits in your contract, be sure to also add them as a contract requirement in Clarinet.
{% endhint %}
{% endstep %}
{% endstepper %}

### No-code Platforms

Use community built no-code platforms that can quickly help you deploy tokens.

<details>

<summary>STX.City</summary>

[STX.CITY](https://stx.city/) is a one-click platform for launching tokens on Stacks. The platform is a comprehensive toolkit for memecoin creators, enabling them to grow their communities through features like AMM listing support (such as on [Alex](https://alexgo.io/), [Velar](https://velar.com/), and [Stackswap](https://app.stackswap.org/)), airdrops, token donations, and burn mechanisms.

Check out [this](https://www.hiro.so/blog/building-stx-city-as-a-solo-dev-on-stacks) blog post by the founder of STX.City for more information.

</details>

### Best Practices

Here are some things to consider when creating your token and after your token is launched.

<details>

<summary>How to format the token metadata?</summary>

Example token metadata taken from the sBTC token:

```json
// https://ipfs.io/ipfs/bafkreibqnozdui4ntgoh3oo437lvhg7qrsccmbzhgumwwjf2smb3eegyqu

{
  "sip": 16,
  "name": "sBTC",
  "description": "BTC is a 1:1 Bitcoin-backed asset on the Stacks Bitcoin L2 that will allow developers to leverage the security, network effects, and .5T in latent capital of the Bitcoin network.",
  "image": "https://ipfs.io/ipfs/bafkreiffe46h5voimvulxm2s4ddszdm4uli4rwcvx34cgzz3xkfcc2hiwi",
  "properties": {
    "decimals": 8,
    "external_url": "https://sbtc.tech"
  }
}
```

Check out the [SIP-016](https://github.com/stacksgov/sips/blob/main/sips/sip-016/sip-016-token-metadata.md) standard for how you should define the schema of your metadata.

</details>

<details>

<summary>How would I properly update my token metadata?</summary>

If you plan on updating your token's metadata in the future, you should definitely implement a [SIP-019](https://github.com/stacksgov/sips/blob/main/sips/sip-019/sip-019-token-metadata-update-notifications.md) compliant token metadata update notification. Take a look at the example token contract above and you'll notice the `set-token-uri` function emits a SIP-019 compliant print event.

```clarity
;; ...
(define-public (set-token-uri (value (string-utf8 256)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
        (var-set token-uri value)
        (ok (print {
              notification: "token-metadata-update",
              payload: {
                contract-id: current-contract,
                token-class: "ft"
              }
            })
        )
    )
)
;; ...
```

Hiro’s [Token Metadata API](https://www.hiro.so/token-metadata-api) watches for that specific print event (specifically the notification of "token-metadata-update") on the network and auto-updates the API’s database to reflect a change in the existing token’s metadata.

If your token contract did not implement this print event, you could use the helper contract below to invoke a function that'll emit the same print event notification. Just invoke the `ft-metadata-update-notify` function of this contract below:

[SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify](https://explorer.hiro.so/txid/SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify?chain=mainnet)

</details>

### Additional Resources

* \[[dev.to](https://dev.to/kamalthedev/ethereum-vs-bitcoin-a-deep-dive-into-token-standards-erc-20-vs-sip-10-vs-brc20-vs-stx20-12na)] A Deep Dive into Token Standards: ERC-20 vs. SIP-10 vs. BRC20 vs. STX20
* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)] SIP-010 Standard Trait Definition for Fungible Tokens
* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-016/sip-016-token-metadata.md)] SIP-016 Schema Definition for Metadata for Digital Assets
* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-019/sip-019-token-metadata-update-notifications.md)] SIP-019 Notifications for Token Metadata Updates
* \[[contract](https://explorer.hiro.so/txid/SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify?chain=mainnet)] SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify
* \[[StacksDevs YT](https://youtu.be/v0_Mexz3KJ8?si=iGMyxQX2lSktOTWp)] Fungible Token Standard (SIP-10) Tutorial For Bitcoin L2 Stacks
* \[[LearnWeb3](https://learnweb3.io/lessons/sip-010-fungible-tokens-and-traits/)] SIP-010 Fungible Tokens & Traits
* \[[Medium @n.campos.rojas](https://medium.com/@n.campos.rojas/learn-how-to-create-fungible-tokens-on-stacks-versus-on-ethereum-a6dae4986863)] Learn how to create fungible tokens on Stacks (versus on Ethereum)
