# Module 26: Bitcoin Logic - Parsing Block Headers

**Author:** @jadonamite
**Difficulty:** Expert
**Time:** 20 Minutes

In the previous module, we verified that a transaction belongs to a block. But what if you need data from the block itself?

Example: You are building a **Bridge**.

* You need the **Merkle Root** to verify transactions.
* You need the **Timestamp** to enforce lock-up periods based on Bitcoin time (not Stacks time).
* You need the **Parent Hash** to verify the chain sequence.

A Bitcoin Block Header is a fixed **80-byte buffer**. To get this data, we must manually slice the buffer at specific offsets.

## 1. The Anatomy of 80 Bytes

Bitcoin uses **Little Endian** (LE) encoding for most fields.

| Field | Size | Offset | Description |
| --- | --- | --- | --- |
| Version | 4 bytes | 0 | Block version number |
| Previous Hash | 32 bytes | 4 | Hash of the parent block |
| **Merkle Root** | 32 bytes | 36 | Root of the transaction tree |
| **Timestamp** | 4 bytes | 68 | Unix timestamp (seconds) |
| Bits | 4 bytes | 72 | Difficulty target |
| Nonce | 4 bytes | 76 | Mining random seed |

## 2. The Implementation

We will write a read-only function that takes the raw 80 bytes and explodes it into a usable Clarity tuple.

**Native Function Alert:** `buff-to-uint-le` (Introduced in Stacks 2.1) is crucial here. It converts a 4-byte buffer (e.g., `0x2c502b65`) into a readable unsigned integer (e.g., `1697304620`).

**File:** `contracts/btc-header-parser.clar`

```clarity
(define-read-only (parse-block-header (header (buff 80)))
    (let
        (
            ;; 1. Extract Previous Block Hash (Bytes 4-36)
            ;; Note: Bitcoin hashes are usually displayed reversed (Big Endian) in explorers.
            ;; This returns the raw internal Little Endian representation.
            (prev-block (unwrap-panic (as-max-len? (buff-slice header u4 u36) u32)))

            ;; 2. Extract Merkle Root (Bytes 36-68)
            (merkle-root (unwrap-panic (as-max-len? (buff-slice header u36 u68) u32)))

            ;; 3. Extract Timestamp (Bytes 68-72)
            ;; We slice the 4 bytes, then convert LE bytes to a Clarity uint.
            (timestamp-buff (unwrap-panic (as-max-len? (buff-slice header u68 u72) u4)))
            (timestamp (buff-to-uint-le timestamp-buff))

            ;; 4. Extract Difficulty Bits (Bytes 72-76)
            (bits-buff (unwrap-panic (as-max-len? (buff-slice header u72 u76) u4)))
            (bits (buff-to-uint-le bits-buff))
        )
        ;; Return structured data
        {
            prev-block: prev-block,
            merkle-root: merkle-root,
            timestamp: timestamp,
            difficulty: bits
        }
    )
)

```

## 3. Why `unwrap-panic` here?

Usually, we avoid panic. However, `buff-slice` returns `none` *only* if the indices are out of bounds. Since our input is strictly typed as `(buff 80)`, we know mathematically that index `u76` is valid. Therefore, `unwrap-panic` is safe and cleaner than handling impossible errors.

## 4. Usage Scenario: Time-Locked Bitcoin Bridge

Imagine a contract where you deposit BTC to mint xBTC, but you can only burn xBTC to retrieve BTC after the original Bitcoin block is 1 year old.

```clarity
(define-public (verify-age (header (buff 80)))
    (let
        (
            (parsed (parse-block-header header))
            (block-time (get timestamp parsed))
            ;; 1 Year in seconds = 31,536,000
            (one-year u31536000)
        )
        ;; Check if block is old enough
        ;; Note: We are comparing Bitcoin Time vs Stacks Block Time (approximation)
        ;; For precision, verify against 'burn-block-info?' timestamp.
        (asserts! (> stx-block-time (+ block-time one-year)) (err u100))
        (ok true)
    )
)

```

## 5. Summary Checklist

* [ ] **Offsets:** Did you double-check the byte offsets (36 for Root, 68 for Time)?
* [ ] **Endianness:** Are you using `buff-to-uint-le` for numbers? If you cast raw bytes to uint directly, you will get massive, incorrect numbers.
* [ ] **Input Size:** Is the input strictly `(buff 80)`? If you accept variable buffers, `buff-slice` might fail.

