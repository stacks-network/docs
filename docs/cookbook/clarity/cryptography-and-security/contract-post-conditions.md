# Contract post-conditions

Source: [SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.xbtc-sbtc-swap-v2](https://explorer.hiro.so/txid/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.xbtc-sbtc-swap-v2)

<pre class="language-clarity" data-title=".xbtc-sbtc-swap-v2" data-expandable="true"><code class="lang-clarity">;; --snip--

(define-private (transfer-sbtc-to
    (amount uint)
    (sbtc-recipient principal)
  )
<strong>  (as-contract?
</strong>    ((with-ft 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token "sbtc-token"
      amount
    ))
    (try! (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
      transfer amount current-contract sbtc-recipient none
    ))
  )
)

;; --snip--
</code></pre>

### Description

The `as-contract?` function resolves the expression caller to the principal of the current contract. Most importantly it allows a contract to protect its own assets during the execution of the expression with a set of specified allowances.

### Use Cases

* A contract invoking a body expression that potentially may have unwanted and unexpected asset transfers.
* Protecting a contract invoking another external contract's function.

### Key Concepts

* **Contract caller context -** Switches the current context's `tx-sender` and `contract-caller` values to the contract's principal and executes the body expressions within that context, then checks the asset outflows from the contract against the granted allowances, in declaration order.
* **Clarity post-conditions** - Accepts a set of allowances, defined using `with-stx`, `with-ft`, `with-nft`, and `with-stacking`, which selectively grant outflow allowances from the contract's assets.
