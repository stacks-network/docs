# Examples

These examples showcase the power of post-conditions through multiple scenarios you might encounter as a Stacks developer.

## No transfers

{% tabs %}
{% tab title="Clarity" %}
A simple contract function with no asset transfers specified.

On the frontend, this should be set to a `postConditionMode` of "deny", without needing a specific post-condition statement.

```clarity
(define-public (no-transfers)
  (ok "no transfer events executed.")
)
```
{% endtab %}

{% tab title="stacks.js" %}
We will specify the `postConditionMode` to `deny`. No other post-condition statements are needed. `postConditions` can be set to an empty array.

The user's expectation should be to deny any asset transfers.

```typescript
const response = await request("stx_callContract", {
  contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.post-conditions",
  functionName: "no-transfers",
  network: "devnet",
  postConditions: [],
  postConditionMode: "deny"
}) 
```
{% endtab %}
{% endtabs %}

**User Expectation:** No assets will be transferred out of their wallet.

**Result:** No transfers made during transaction execution. Transaction is confirmed.

***

## Single STX transfer

{% tabs %}
{% tab title="Clarity" %}
A function that contains a single asset transfer of 10 STX from the tx-sender to the contract.

```clarity
(define-public (single-stx-transfer)
  (stx-transfer? u10000000 tx-sender (as-contract tx-sender))
) 
```
{% endtab %}

{% tab title="stacks.js" %}
A `StxPostCondition` will be set with the origin/user address, and how much the user expects to be sending out. The `postConditionMode` is set to `deny` to prevent any other unexpected transfers to happen.

```typescript
const stxPostCondition: StxPostCondition = {
  type: 'stx-postcondition',
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  condition: 'eq',
  amount: '10000000',
};

const response = await request("stx_callContract", {
  contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.post-conditions",
  functionName: "single-stx-transfer",
  functionArgs: [],
  postConditionMode: "deny",
  postConditions: [stxPostCondition],
  network: "devnet"
})
```
{% endtab %}
{% endtabs %}

**User Expectation:** Allow only 10 STX to be transferred.

**Result:** 10 STX are transferred from the sender's wallet as the user expected. Transaction is confirmed.

***

## Multiple STX transfers

{% tabs %}
{% tab title="Clarity" %}
When multiple transfer events happen for the same asset on the same address, your post-condition statement should aggregate the net total amount of that asset being transferred during the execution of the entire function.

The contract first transfers 20 STX then transfers another 10 STX from the sender.

<pre class="language-clarity"><code class="lang-clarity">(define-public (multiple-stx-transfers)
  (begin
<strong>    (try! (stx-transfer? u20000000 tx-sender (as-contract tx-sender)))
</strong>    (unwrap! (get-burn-block-info? header-hash burn-block-height) (err u1001))
<strong>    (stx-transfer? u10000000 tx-sender (as-contract tx-sender))
</strong>  )
)
</code></pre>
{% endtab %}

{% tab title="stacks.js" %}
As the dev, you should notice that a total of 30 STX will be transferred from the user to the contract. This total amount should be accounted for as a single `StxPostCondition` since it's on the same asset and same principal. The `postConditionMode` is set to `deny`.

```typescript
const stxPostCondition: StxPostCondition = {
  type: 'stx-postcondition',
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  condition: 'lte',
  amount: '30000000',
};

const response = await request("stx_callContract", {
  contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.post-conditions",
  functionName: "multiple-stx-transfers",
  functionArgs: [],
  postConditionMode: "deny",
  postConditions: [stxPostCondition],
  network: "devnet"
})
```
{% endtab %}
{% endtabs %}

**User Expectation:** Allow less than 30 STX to be transferred.

**Result:** 30 STX was transferred out of the sender's wallet as expected. Transaction is confirmed.

***

## Mint and Burn Events

{% tabs %}
{% tab title="Clarity" %}
A post-condition statement is needed for burn events, but not needed for mint events.

```clarity
(define-public (mint-and-burn-events)
  (begin
    (try! (stx-burn? u10000000 tx-sender))
    (contract-call? .good-token mint u5000000)
  )
)
```
{% endtab %}

{% tab title="stacks.js" %}
A post-condition for the burn event will only be needed. Mint events are not considered a transfer and are treated differently.

```typescript
const stxPostCondition: StxPostCondition = {
  type: "stx-postcondition",
  address: userStxAddress.value,
  condition: "eq",
  amount: "10000000"
}

const response = await request("stx_callContract", {
  contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.post-conditions",
  functionName: "mint-and-burn-events",
  functionArgs: [],
  postConditionMode: "deny",
  postConditions: [stxPostCondition],
  network: "devnet"
})
```
{% endtab %}
{% endtabs %}

**User Expectation:** Allow exactly 10 STX to be transferred for burning.

**Result:** 10 STX transferred out of the sender's wallet to be burned. Some `good-token` were minted to the user. No other asset transfers happened. Transaction is confirmed.

***

## Uncertain asset transfer amount

{% tabs %}
{% tab title="Clarity" %}
The function below demonstrates a scenario where the amount of STX to send is dynamic and uncertain. Having two post-condition statements that capture a range would be appropriate.

```clarity
(define-public (uncertain-asset-amount)
  (let ((amount-to-send (mod (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1)))
      u21
    )))
    (try! (stx-transfer? amount-to-send tx-sender (as-contract tx-sender)))
    (ok (print amount-to-send))
  )
)
```
{% endtab %}

{% tab title="stacks.js" %}
We're able to setup an amount range using post-conditions. We'll have one post-condition specifying that the user will transfer greater than or equal 0 STX, and another specifying\
that the user will transfer less than or equal to 1 STX.

```typescript
const stxPostCondition: StxPostCondition = {
  type: "stx-postcondition",
  address: userStxAddress.value,
  condition: "gte",
  amount: "0"
}

const stxPostCondition1: StxPostCondition = {
  type: "stx-postcondition",
  address: userStxAddress.value,
  condition: "lte",
  amount: "1000000"
}

const response = await request("stx_callContract", {
  contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.post-conditions",
  functionName: "uncertain-asset-amount",
  functionArgs: [],
  postConditionMode: "deny",
  postConditions: [stxPostCondition, stxPostCondition1],
  network: "devnet"
})
```
{% endtab %}
{% endtabs %}

**User Expectation:** Allow between 0 STX and 1 STX to be transferred from the user.

**Result:** If the actual amount of STX is within the specified expectated range, the transaction will confirm. If not, the transaction will abort and fail.

***

## Hidden asset transfers

{% tabs %}
{% tab title="Clarity" %}
The function below contains a bunch of asset transfer events that are obfiscated in a way where it may not be noticeable at first glance. It's setup for the `tx-sender` to pay for a `cool-nft` for 2 STX, but unbeknownst to the user, the function will attempt to transfer out a few of the user's good tokens AND send the users some evil tokens.

```clarity
(define-data-var nft-ids-sent uint u0)

(define-public (hidden-asset-transfers)
  (let ((nft-id (- (unwrap-panic (contract-call? .cool-nft get-last-token-id))
      (var-get nft-ids-sent)
    )))
    (try! (stx-transfer? u2000000 tx-sender (as-contract tx-sender)))
    (try! (drain-attempt))
    (try! (contract-call? .cool-nft transfer nft-id (as-contract tx-sender) tx-sender))
    (ok (var-set nft-ids-sent (+ u1 (var-get nft-ids-sent))))
  )
)

(define-private (drain-attempt)
  (let ((amount-to-drain (unwrap-panic (contract-call? .good-token get-balance tx-sender))))
    (try! (contract-call? .good-token transfer
      (- amount-to-drain (- amount-to-drain u10)) tx-sender
      (as-contract tx-sender) none
    ))
    (contract-call? .evil-token transfer u100000000 (as-contract tx-sender)
      tx-sender none
    )
  )
)
```
{% endtab %}

{% tab title="stacks.js" %}
In this scenario, we'll simulate a failed transaction as a way to demonstrate where the dev and the user are both unaware of a few underlying transfers happening. Currently, the user assumes they will transfer 2 STX to receive a `cool-nft` asset.

We'll specify those 2 corresponding post-conditions with the post-condition mode set to `deny`. But when the transaction is executed and evaluated, it will fail because other previously unknown transfer events tried to execute saving our user from malicious activity.

```typescript
const stxPostCondition: StxPostCondition = {
  type: "stx-postcondition",
  address: userStxAddress.value,
  condition: "lte",
  amount: "2000000"
}

const nftPostCondition1: NonFungiblePostCondition = {
  address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-contract",
  asset: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cool-nft::cool-nft",
  assetId: Cl.uint(nftIdNonce.value),
  condition: "sent",
  type: "nft-postcondition"
}

const response = await request("stx_callContract", {
  contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-contract",
  functionName: "hidden-asset-transfers",
  functionArgs: [],
  postConditionMode: "deny",
  postConditions: [stxPostCondition, nftPostCondition1],
  network: "devnet"
})
```
{% endtab %}
{% endtabs %}

**User Expectation:** Allow the transfer of 2 STX for a `cool-nft` asset.

**Result:** The contract attempted to perform other asset transfers that were not covered by the declared post-conditions. Transaction will abort and fail.
