---
description: A guide to help you create your own non-fungible tokens
---

# Non-Fungible Tokens

<figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption><p>source: <a href="https://www.hiro.so/blog/breaking-down-an-order-book-contract-for-nft-marketplaces">Hiro blog</a></p></figcaption></figure>

Create an NFT with Stacks because it builds **on Bitcoin** — inheriting the security and permanence of the most durable chain via Proof-of-Transfer. Clarity smart contracts make logic easy to audit, reducing the guessing and attack surface common in NFT projects. Plus, Stacks NFTs tap into a Bitcoin-aligned community that values ownership, longevity, and real on-chain utility.

### Custom Development

For developers who want full control over their token implementation, here’s how to create a custom SIP-009 NFT on Stacks using Clarity. But before you deploy the NFT contract, you must have your NFT contract conform to the SIP-009 trait standard.

{% stepper %}
{% step %}
#### Define SIP-009 non-fungible token trait

<details>

<summary><strong>What is SIP-009?</strong></summary>

[SIP-009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md) is the standard for defining fungible tokens on Stacks. Defining a common interface (known in Clarity as a "trait") allows different smart contracts, apps, and wallets to interoperate with non-fungible token contracts in a reusable way. Its primary purpose is to ensure that NFTs are composable and different tools know how to interact with them.

</details>

Below is an implementation of the SIP-009 trait standard for non-fungible tokens. You can use the existing minimal standard SIP-009 trait or extend it by adding in your own custom traits. But the requirements of the SIP-009 traits are necessary to have at the minimum.

{% code title="NFT trait standard" expandable="true" %}
```clarity
(define-trait nft-trait
  (
    ;; Last token ID, limited to uint range
    (get-last-token-id () (response uint uint))

    ;; URI for metadata associated with the token
    (get-token-uri (uint) (response (optional (string-ascii 256)) uint))

     ;; Owner of a given token identifier
    (get-owner (uint) (response (optional principal) uint))

    ;; Transfer from the sender to a new principal
    (transfer (uint principal principal) (response bool uint))
  )
)
```
{% endcode %}

All we are doing here is defining the function signatures for functions we'll need to implement in our NFT contract, which we can see a simple version of below.
{% endstep %}

{% step %}
#### Implement SIP-009 trait in NFT contract

Any NFT contract that wants to conform to the SIP-009 non-fungible token standard for Stacks needs to have this trait "implemented" in their NFT contract. See the below minimal NFT contract example of how this is done.

{% code title="non-fungible-token.clar" expandable="true" %}
```clarity
;; This contract implements the SIP-009 community-standard Non-Fungible Token trait
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Define the NFT's name
(define-non-fungible-token Your-NFT-Name uint)

;; Keep track of the last minted token ID
(define-data-var last-token-id uint u0)

;; Define constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant COLLECTION_LIMIT u1000) ;; Limit to series of 1000

(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_SOLD_OUT (err u300))

(define-data-var base-uri (string-ascii 256) "https://your.api.com/path/to/collection/{id}")

;; SIP-009 function: Get the last minted token ID.
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; SIP-009 function: Get link where token metadata is hosted
(define-read-only (get-base-uri (token-id uint))
  (ok (some (var-get base-uri)))
)

;; SIP-009 function: Get the owner of a given token
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? Your-NFT-Name token-id))
)

;; SIP-019 compliant token metadata update notification
(define-public (set-base-uri (value (string-ascii 256)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
        (var-set base-uri value)
        (ok (print {
              notification: "token-metadata-update",
              payload: {
                token-class: "nft",
                contract-id: current-contract,
              }
            })
        )
    )
)

;; SIP-009 function: Transfer NFT token to another owner.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    ;; #[filter(sender)]
    (asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)
    (nft-transfer? Your-NFT-Name token-id sender recipient)
  )
)

;; Mint a new NFT.
(define-public (mint (recipient principal))
  ;; Create the new token ID by incrementing the last minted ID.
  (let ((token-id (+ (var-get last-token-id) u1)))
    ;; Ensure the collection stays within the limit.
    (asserts! (< (var-get last-token-id) COLLECTION_LIMIT) ERR_SOLD_OUT)
    ;; Only the contract owner can mint.
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    ;; Mint the NFT and send it to the given recipient.
    (try! (nft-mint? Your-NFT-Name token-id recipient))

    ;; Update the last minted token ID.
    (var-set last-token-id token-id)
    ;; Return a success status and the newly minted NFT ID.
    (ok token-id)
  )
)
```
{% endcode %}

This is the Clarity code we need in order to create an NFT, with one additional function, `mint` that allows us to actually create a new NFT. This `mint` function is not needed to adhere to the trait.

The token contract example above is passing in an already deployed trait on mainnet into the `impl-trait` function. You can use this same deployed trait for your own NFT contract as well.

{% hint style="success" %}
Deployed SIP-009 trait contracts you can directly implement in your custom token contract:

* \[mainnet] SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait
* \[testnet] ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait

Reminder: when implementing these deployed traits in your contract, be sure to also add them as a contract requirement in Clarinet.
{% endhint %}
{% endstep %}
{% endstepper %}

### Best Practices

Here are some things to consider when creating your NFT and after your NFT is launched.

<details>

<summary>How to format the NFT metadata?</summary>

Check out the [SIP-016](https://github.com/stacksgov/sips/blob/main/sips/sip-016/sip-016-token-metadata.md) standard for how you should define the schema of your metadata.

</details>

<details>

<summary>How would I properly update my NFT metadata?</summary>

If you plan on updating your NFT's metadata in the future, you should definitely implement a function that emits a [SIP-019](https://github.com/stacksgov/sips/blob/main/sips/sip-019/sip-019-token-metadata-update-notifications.md) compliant token metadata update notification. Take a look at the example NFT contract above and you'll notice the `set-base-uri` function emits a SIP-019 compliant print event.

<pre class="language-clarity"><code class="lang-clarity">;; ...
(define-public (set-base-uri (value (string-ascii 256)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
        (var-set base-uri value)
        (ok (print {
              notification: "token-metadata-update",
              payload: {
<strong>                token-class: "nft",
</strong>                contract-id: current-contract,
              }
            })
        )
    )
)
;; ...
</code></pre>

Hiro’s [Token Metadata API](https://www.hiro.so/token-metadata-api) watches for that specific print event (specifically the notification of "token-metadata-update") on the network and auto-updates the API’s database to reflect a change in the existing NFT’s metadata.

If your NFT contract did not implement this print event, you could use the helper contract below to invoke a function that'll emit the same print event notification. Just invoke the `nft-metadata-update-notify` function of this contract below:

[SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify](https://explorer.hiro.so/txid/SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify?chain=mainnet)

</details>

### Additional Resources

* \[[Stacks](https://www.stacks.co/explore/nfts)] Explore NFTs on Stacks
* \[[Clarity Book](https://book.clarity-lang.org/ch10-01-sip009-nft-standard.html)] SIP009: the NFT standard
* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)] SIP-009 Standard Trait Definition for Non-Fungible Tokens
* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-016/sip-016-token-metadata.md)] SIP-016 Schema Definition for Metadata for Digital Assets
* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-019/sip-019-token-metadata-update-notifications.md)] SIP-019 Notifications for Token Metadata Updates
* \[[contract](https://explorer.hiro.so/txid/SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify?chain=mainnet)] SP1H6HY2ZPSFPZF6HBNADAYKQ2FJN75GHVV95YZQ.token-metadata-update-notify
* \[[Hiro YT](https://youtu.be/Hejsz-pivM4?si=SrOlgC9KK6YQvEy7)] How to Display NFTs in a Wallet Using the Token Metadata API
* \[[Hiro YT](https://youtu.be/xwbXNgSvMkk?si=Dl8KEL2KsmPy1kON)] A Beginner's Overview of the Megapont Ape NFT Clarity Smart Contract
* \[[Hiro YT](https://youtu.be/Ajuq6j2NXM8?si=Gj-Z5sxJ28FRyPmN)] Stacker Chat with Muneeb Ali: Diving Deeper into Bitcoin NFTs
* \[[Hiro Blog](https://www.hiro.so/blog/breaking-down-nft-code-snippets-in-clarity)] Breaking Down NFT Code Snippets in Clarity
* \[[Hiro Blog](https://www.hiro.so/blog/how-sigle-built-nft-gated-features-in-their-app)] How Sigle Built NFT-Gated Features in Their App
