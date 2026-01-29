# Working with Clarity

Now it's time to start working a bit more with Clarity by adding a new feature to our project. We're going to take a look at Clarity, testing, and working with our frontend by adding a new feature where we can attach a message to our campaign donations.

The written version of the tutorial is below, with a video coming soon.

If you haven't yet, going through the [Clarity Crash Course](https://docs.stacks.co/get-started/clarity-crash-course) is highly recommended. It will give you a high-level introduction to the basics of Clarity.

Here's we'll assume basic familiarity with Clarity. You should be able to follow along with what we're doing either way, but it will make more sense if you've already familiarized yourself with the basics of Clarity.

In addition, you'll notice that we are utilizing sBTC here. If you aren't familiar with sBTC yet, go ahead and take a look at the [Learn sBTC](https://docs.stacks.co/learn/sbtc) section of the docs to get a handle on what it is and how it works.

You can also refer to the [sBTC Integration](https://docs.stacks.co/clarinet-integrations/sbtc-integration) guide to see how to integrate sBTC into your projects for more background. This setup is taken care of for you in this particular Platform template.

{% stepper %}
{% step %}
### Add the message storage map

First, we need a place to store donation messages. Add a new map in `clarity/contracts/fundraising.clar`:

```clarity
;; donor -> message (max 280 characters)
(define-map donation-messages
  principal
  (string-utf8 280)
)
```

This maps each donor's principal to their message. We limit messages to 280 characters.
{% endstep %}

{% step %}
### Modify the donate-stx function

Update the function signature to accept an optional message:

```clarity
;; Donate STX. Pass amount in microstacks. Optionally include a message.
(define-public (donate-stx (amount uint) (message (optional (string-utf8 280))))
  (begin
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-cancelled)) err-campaign-cancelled)
    (asserts!
      (< burn-block-height
        (+ (var-get campaign-start) (var-get campaign-duration))
      )
      err-campaign-ended
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set stx-donations tx-sender
      (+ (default-to u0 (map-get? stx-donations tx-sender)) amount)
    )
    ;; Handle the optional message
    (match message
      msg (map-set donation-messages tx-sender msg)
      true
    )
    (var-set total-stx (+ (var-get total-stx) amount))
    (var-set donation-count (+ (var-get donation-count) u1))
    (ok true)
  )
)
```

The change we made here is adding this `match` function. We've also added a new optional argument to the function signature. This means that we can either pass a `string-utf8` or we can pass `none`.

Then our `match` function determines what should happen based on whether we have an actual message or `none` passed in.

You can take a look at the [function](https://docs.stacks.co/reference/clarity/functions) and [keyword](https://docs.stacks.co/reference/clarity/keywords) reference pages for Clarity to understand more about how these work.

**Understanding the `match` Expression**

The `match` expression is how Clarity handles optional values:

```clarity
(match message
  msg (map-set donation-messages tx-sender msg)  ;; If some: bind to `msg`, execute this
  true                                            ;; If none: return true, continue
)
```
{% endstep %}

{% step %}
### Modify the donate-sbtc function

Apply the same changes to sBTC donations:

```clarity
;; Donate sBTC. Pass amount in Satoshis. Optionally include a message.
(define-public (donate-sbtc (amount uint) (message (optional (string-utf8 280))))
  (begin
    (asserts! (var-get is-campaign-initialized) err-not-initialized)
    (asserts! (not (var-get is-campaign-cancelled)) err-campaign-cancelled)
    (asserts!
      (< burn-block-height
        (+ (var-get campaign-start) (var-get campaign-duration))
      )
      err-campaign-ended
    )
    (try! (contract-call? 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token
      transfer amount contract-caller (as-contract tx-sender) none
    ))
    (map-set sbtc-donations tx-sender
      (+ (default-to u0 (map-get? sbtc-donations tx-sender)) amount)
    )
    (match message
      msg (map-set donation-messages tx-sender msg)
      true
    )
    (var-set total-sbtc (+ (var-get total-sbtc) amount))
    (var-set donation-count (+ (var-get donation-count) u1))
    (ok true)
  )
)
```
{% endstep %}

{% step %}
### Add a getter function

Add a read-only function to retrieve donation messages:

```clarity
(define-read-only (get-donation-message (donor principal))
  (ok (map-get? donation-messages donor))
)
```

This returns `(ok (some "message"))` if a message exists, or `(ok none)` if not.
{% endstep %}
{% endstepper %}

## Common Clarity Errors

As you work with Clarity, you might encounter these common issues:

### 1. Type Mismatch
**Error:** `analysis error: Type signature mismatch`
**Cause:** Trying to combine different types (e.g., adding a `uint` and an `int`).
**Fix:** Ensure types match. Use `uint` vs `int` functions correctly.
```clarity
;; ❌ Error
(+ u10 5) 

;; ✅ Fix
(+ u10 u5)
```

### 2. Unchecked Data
**Error:** `analysis error: Intermediate expression value is not used`
**Cause:** Calling a function that returns a `response` (like `stx-transfer?`) without handling the result.
**Fix:** Use `try!` or `unwrap!` to handle the response.
```clarity
;; ❌ Error
(stx-transfer? amount tx-sender recipient)

;; ✅ Fix
(try! (stx-transfer? amount tx-sender recipient))
```
