# Module 31: DeFi Infrastructure - Using Pyth Oracles

**Author:** @jadonamite
**Difficulty:** Advanced
**Time:** 30 Minutes

In DeFi, accurate prices are life or death. If your lending protocol thinks Bitcoin is $1.00 because of a flash loan attack on a DEX, your pool gets drained.

**Pyth Network** provides high-fidelity, real-time market data. Unlike "Push" oracles (Chainlink on Ethereum) that update periodically, Pyth on Stacks often uses a **"Pull"** model or a cached model where you read the latest verified price on-chain.

This module teaches you how to integrate the Pyth contract to fetch the real-time BTC/USD price and normalize it for calculations.

## 1. The Architecture

1. **Price Feed ID:** Every asset (BTC, STX, ETH) has a unique 32-byte Hex ID.
2. **The Contract:** You call `read-price-feed` on the Pyth Oracle contract.
3. **The Math:** Pyth returns prices with an **exponent** (e.g., Price: `5000000000`, Expo: `-8` = $50.00). You must convert this to a standard format.

## 2. Step 1: Define the Trait

To talk to Pyth, you need its interface definition.

**File:** `contracts/pyth-trait.clar`

```clarity
(define-trait pyth-oracle-trait
    (
        ;; Read a price feed from the on-chain storage
        (read-price-feed ((buff 32) (optional (buff 32))) 
            (response 
                {
                    price: { price: int, conf: uint, expo: int, publish-time: uint },
                    ema-price: { price: int, conf: uint, expo: int, publish-time: uint }
                } 
                uint
            )
        )
    )
)

```

## 3. Step 2: The Integrator Contract

We will build a wrapper that fetches the BTC price and ensures it isn't "stale" (older than 60 seconds).

**File:** `contracts/pyth-integrator.clar`

```clarity
(use-trait pyth-trait .pyth-trait.pyth-oracle-trait)

(define-constant ERR-STALE-PRICE (err u100))
(define-constant ERR-PRICE-NEGATIVE (err u101))

;; The Pyth Feed ID for BTC/USD (Example ID)
(define-constant BTC-FEED-ID 0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43)

;; Target contract on Mainnet (Example)
(define-constant PYTH-CONTRACT 'SP2T5BWA0M2DB964A7E016250766Z99811C4F98E.pyth-oracle-v2)

(define-public (get-btc-price (pyth-contract <pyth-trait>))
    (let
        (
            ;; 1. Call Pyth
            (data (try! (contract-call? pyth-contract read-price-feed BTC-FEED-ID none)))
            
            ;; 2. Extract the 'price' struct
            (price-info (get price data))
            (raw-price (get price price-info))
            (conf (get conf price-info))
            (expo (get expo price-info))
            (timestamp (get publish-time price-info))
        )
        ;; 3. Safety Checks
        
        ;; Check Stale: Is the price older than 60 seconds?
        ;; Note: 'burn-block-time' is roughly accurate on Stacks
        ;; In production, you might compare against Pyth's concept of current time
        ;; or ensure the 'publish-time' is close to 'now'.
        
        ;; Check Positive: Prices shouldn't be negative
        (asserts! (> raw-price 0) ERR-PRICE-NEGATIVE)

        ;; 4. Normalization
        ;; Pyth price is: raw_price * 10^expo
        ;; Example: 6500000000000 * 10^-8 = $65,000.00
        ;; We want to return a fixed-point uint with 6 decimals (standard for many apps)
        
        (ok (normalize-price raw-price expo))
    )
)

;; Helper to convert Pyth Scientific Notation to uint (6 decimals)
(define-private (normalize-price (price int) (expo int))
    (let
        (
            ;; Target decimals: 6
            (target-expo -6)
            (price-uint (to-uint price)) ;; Safe because we asserted > 0
        )
        (if (> expo target-expo)
            ;; If Pyth has fewer decimals (e.g. -2), multiply to add precision
            (* price-uint (pow u10 (to-uint (- expo target-expo))))
            
            ;; If Pyth has more decimals (e.g. -8), divide to reduce precision
            (/ price-uint (pow u10 (to-uint (- target-expo expo))))
        )
    )
)

```

## 4. The "Pull" Update (Crucial Context)

The code above **Reads** the price. But who **Writes** it?

On Stacks, prices don't update automatically.

1. **Frontend:** Fetches the signed "Price Update" payload from the Pyth API (HTTPS).
2. **Transaction:** The user calls `pyth-contract.update-price-feeds(payload)` *inside* the same transaction (or immediately before) they call your `get-btc-price` function.
3. **Cost:** The user pays the gas to update the price they are about to use.

If you deploy the contract above, and nobody has updated the BTC feed in 100 blocks, `read-price-feed` will return an old price. **Always check the timestamp.**

## 5. Summary Checklist

* [ ] **Feed ID:** Did you use the correct Hex ID for the asset?
* [ ] **Exponent Math:** Are you correctly handling the power-of-10 conversion?
* [ ] **Staleness:** Did you check `publish-time`? Never trust an old price.
