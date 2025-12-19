# Using DIA with Stacks

DIA's oracle protocol utilizes a push price model. As the developer, you would only need to fetch prices directly from DIA's Clarity contracts.

Price data can be fetched in Clarity by making an external call to the DIA `.dia-oracle` contract’s `get-value` read-only function with the desired asset pair.

### DIA's Clarity Contracts <a href="#oracle-details" id="oracle-details"></a>

{% hint style="info" %}
For the full list of supported asset feeds for Stacks with DIA, check out their docs [here](https://www.diadata.org/docs/nexus/how-to-guides/fetch-price-data/chain-specific-guide/stacks).
{% endhint %}

<table><thead><tr><th width="122.22265625">Chain</th><th>Address</th></tr></thead><tbody><tr><td>Mainnet</td><td><a href="https://explorer.hiro.so/txid/SP1G48FZ4Y7JY8G2Z0N51QTCYGBQ6F4J43J77BQC0.dia-oracle?chain=mainnet">SP1G48FZ4Y7JY8G2Z0N51QTCYGBQ6F4J43J77BQC0.dia-oracle</a></td></tr><tr><td>Testnet</td><td><a href="https://explorer.hiro.so/txid/ST1S5ZGRZV5K4S9205RWPRTX9RGS9JV40KQMR4G1J.dia-oracle?chain=testnet">ST1S5ZGRZV5K4S9205RWPRTX9RGS9JV40KQMR4G1J.dia-oracle</a></td></tr></tbody></table>

### Example

Below is an example where we are fetching the sBTC price and determining if a user has the required minimum balance to join a whitelist.

It does this by:

* Reading the **current sBTC/USD price** from DIA’s on-chain oracle
* Reading the caller’s **sBTC balance**
* Calculating the USD value of that balance
* Whitelisting the user if they meet a minimum threshold

In short: **prove you hold enough sBTC (by USD value) to be eligible for a whitelist.**

{% hint style="warning" %}
All price feeds from DIA's Clarity contracts all have an implicit decimal place of 8 unless specified otherwise.
{% endhint %}

<pre class="language-clarity"><code class="lang-clarity">(define-constant MIN-SBTC-BALANCE u100)
(define-constant ERR_READING_SBTC_BALANCE (err u7001))
(define-constant ERR_NOT_ENOUGH_SBTC (err u7002))
(define-constant ERR_NOT_OWNER (err u7003))
(define-constant SBTC-PRICE-EXPO 8)

(define-map whitelist
  principal
  bool
)

(define-public (check-eligibility)
  (let (
<strong>      (sbtc-price-data (unwrap-panic (contract-call? 'SP1G48FZ4Y7JY8G2Z0N51QTCYGBQ6F4J43J77BQC0.dia-oracle
</strong><strong>        get-value "sBTC/USD"
</strong><strong>      )))
</strong>      (sbtc-usd-price (to-int (get value sbtc-price-data)))
      (price-denomination (pow 10 SBTC-PRICE-EXPO))
      (adjusted-price (to-uint (/ sbtc-usd-price price-denomination)))
      (user-sbtc-balance (unwrap!
        (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
          get-balance-available tx-sender
        )
        ERR_READING_SBTC_BALANCE
      ))
    )
    (if (> (/ (* user-sbtc-balance adjusted-price) (to-uint price-denomination))
        MIN-SBTC-BALANCE
      )
      (ok (map-set whitelist tx-sender true))
      ERR_NOT_ENOUGH_SBTC
    )
  )
)

</code></pre>

***

### Additional Resources

* \[[Hiro YT](https://youtu.be/bhWQxHGpv2s?si=RsKaCe169Vu6zw_e)] How to use DIA's price data featuring Khawla, Product Manager @ DIA
* \[[DIA Docs](https://www.diadata.org/docs/nexus/how-to-guides/fetch-price-data/chain-specific-guide/stacks)] The Stacks guide in DIA's docs
* \[[Twitter](https://x.com/DIAdata_org/status/1945476086110032147)] DIA x Stacks Oracle Grants
