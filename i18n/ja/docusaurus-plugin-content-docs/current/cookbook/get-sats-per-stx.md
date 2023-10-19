---
title: Get Sats per STX Price
description: Use built-in Clarity functions to retrieve the on-chain exchange rate between BTC and STX
---

Utilizing the built-in Clarity function `get-block-info?` we can create what is essentially an on-chain Bitcoin price oracle. We can do this by taking the amount of Bitcoin spent by miners and the block reward earned by those miners to get the sats per stx ratio.

Let's see how to do this.

```clarity
(define-read-only (get-sats-per-stx (block uint))
    (let
        (
            (miner-spend (unwrap! (get-block-info? miner-spend-winner block) (err "no miner spend")))
            (block-reward (unwrap! (get-block-info? block-reward block) (err "no block reward")))
            (sats-per-stx (/ miner-spend block-reward))
        )
        (ok sats-per-stx)
    )
)
```

Here we are defining a read-only function.

If we deploy this function up to testnet, we can run it in the sandbox.

I actually have deployed this and you can check it out on the explorer and pass in whatever block you want to get the sats/stx ratio.
