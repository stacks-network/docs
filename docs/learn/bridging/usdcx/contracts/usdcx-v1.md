# usdcx-v1

{% code title=".usdcx-v1" lineNumbers="true" expandable="true" %}
```clarity
;; USDCx v1
;;
;; This contract implements the USDC xReserve protocol for bridging USDC between
;; Stacks and other chains.
;;
;; This contract is the main entry point for minting and burning USDCx.

;; An error occurred while recovering a deposit intent signature's
;; public key.
(define-constant ERR_UNABLE_TO_RECOVER_PK (err u100))
;; The length of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_BYTE_LENGTH (err u101))
;; The amount of the deposit intent is larger than u128::max.
(define-constant ERR_INVALID_DEPOSIT_AMOUNT_TOO_HIGH (err u102))
;; The max fee of the deposit intent is larger than u128::max.
(define-constant ERR_INVALID_DEPOSIT_MAX_FEE_TOO_HIGH (err u103))
;; The magic bytes of the deposit intent are invalid.
(define-constant ERR_INVALID_DEPOSIT_INTENT_MAGIC (err u104))
;; The hook data length of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_HOOK_DATA_LENGTH (err u105))
;; The signature of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_SIGNATURE (err u106))
;; The version of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_VERSION (err u107))
;; After accounting for fees, the amount of USDCx to mint is zero.
(define-constant ERR_INVALID_DEPOSIT_AMOUNT_ZERO (err u108))
;; The fee amount of the mint is larger than the max fee of the deposit intent.
(define-constant ERR_INVALID_DEPOSIT_FEE_AMOUNT_TOO_HIGH (err u109))
;; The remote domain of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_REMOTE_DOMAIN (err u110))
;; The remote token of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_REMOTE_TOKEN (err u111))
;; The remote recipient of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_REMOTE_RECIPIENT (err u112))
;; This nonce has already been used in a different deposit
(define-constant ERR_INVALID_DEPOSIT_NONCE (err u113))
;; The max fee is greater than or equal to the amount.
(define-constant ERR_INVALID_DEPOSIT_MAX_FEE_GTE_AMOUNT (err u114))
;; The remote recipient length of the deposit intent is invalid.
(define-constant ERR_INVALID_DEPOSIT_REMOTE_RECIPIENT_LENGTH (err u115))
;; The withdrawal amount is less than the minimum withdrawal amount.
(define-constant ERR_INVALID_WITHDRAWAL_AMOUNT_TOO_LOW (err u116))
;; The native domain is not the supported value (currently only 0)
(define-constant ERR_INVALID_NATIVE_DOMAIN (err u117))

;; Magic bytes for deposit encoding
(define-constant DEPOSIT_INTENT_MAGIC 0x5a2e0acd)

;; Supported version for parsing deposit intents
(define-constant DEPOSIT_INTENT_VERSION u1)

;; Supported native-domain for withdrawals
(define-constant ETHEREUM_NATIVE_DOMAIN u0)

;; Allowed `domain` for deposits
(define-constant DOMAIN u10003)

;; Map of used nonces
(define-map used-nonces
  (buff 32)
  bool
)

;; Map of Circle attestor public keys
(define-map circle-attestors
  (buff 33)
  bool
)

;; Minimum amount required to withdrawal USDCx
(define-data-var min-withdrawal-amount uint u0)

;; Helper function to parse a deposit intent from raw bytes.
;; This function takes care of parsing the deposit intent according to the Circle specification.
;; Stacks-specific logic (such as converting the remote recipient to a principal) is handled by other functions.
;;
;; For full validation, including parsing the remote recipient and preventing nonce reuse, use
;; `parse-and-validate-deposit-intent`.
(define-read-only (parse-deposit-intent (deposit-intent (buff 320)))
  (begin
    (asserts! (>= (len deposit-intent) u240) ERR_INVALID_DEPOSIT_BYTE_LENGTH)
    (let (
        (magic (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u0 u4)) u4)))
        (version (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u4 u8)) u4))))
        (amount-left-bytes (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u8 u24)) u16)))
        (amount (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u24 u40)) u16))))
        (remote-domain (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u40 u44)) u4))))
        (remote-token (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u44 u76)) u32)))
        (remote-recipient (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u76 u108)) u32)))
        (local-token (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u108 u140)) u32)))
        (local-depositor (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u140 u172)) u32)))
        (max-fee-left-bytes (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u172 u188)) u16)))
        (max-fee (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u188 u204)) u16))))
        (nonce (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u204 u236)) u32)))
        (hook-data-len (buff-to-uint-be (unwrap-panic (as-max-len? (unwrap-panic (slice? deposit-intent u236 u240)) u4))))
      )
      (asserts! (is-eq magic DEPOSIT_INTENT_MAGIC)
        ERR_INVALID_DEPOSIT_INTENT_MAGIC
      )
      (asserts! (is-eq amount-left-bytes 0x00000000000000000000000000000000)
        ERR_INVALID_DEPOSIT_AMOUNT_TOO_HIGH
      )
      (asserts! (is-eq max-fee-left-bytes 0x00000000000000000000000000000000)
        ERR_INVALID_DEPOSIT_MAX_FEE_TOO_HIGH
      )
      (asserts! (is-eq (len deposit-intent) (+ u240 hook-data-len))
        ERR_INVALID_DEPOSIT_HOOK_DATA_LENGTH
      )
      (ok {
        magic: magic,
        version: version,
        amount: amount,
        remote-domain: remote-domain,
        remote-token: remote-token,
        remote-recipient: remote-recipient,
        local-token: local-token,
        local-depositor: local-depositor,
        max-fee: max-fee,
        nonce: nonce,
        hook-data: (if (is-eq hook-data-len u0)
          0x
          (unwrap-panic (as-max-len?
            (unwrap-panic (slice? deposit-intent u240 (+ u240 hook-data-len)))
            u80
          ))
        ),
      })
    )
  )
)

;; Recover the attestor public key from a deposit intent and signature.
;; Recovery is done by hashing the deposit intent (via `keccak256`)
;; and then using the `secp256k1-recover?` function.
(define-read-only (recover-deposit-intent-pk
    (deposit-intent (buff 320))
    (signature (buff 65))
  )
  (let (
      (hash (keccak256 deposit-intent))
      (recovered-pk (unwrap! (secp256k1-recover? hash signature) ERR_UNABLE_TO_RECOVER_PK))
    )
    (ok recovered-pk)
  )
)

;; Add or remove a Circle attestor.
;;
;; Can only be called by a caller with the governance role.
(define-public (add-or-remove-circle-attestor
    (public-key (buff 33))
    (enabled bool)
  )
  (begin
    ;; #[filter(public-key, enabled)]
    (try! (contract-call? .usdcx validate-protocol-caller 0x00 contract-caller))
    (map-set circle-attestors public-key enabled)
    (ok true)
  )
)

;; Recover and verify a deposit intent signature.
;;
;; The public key is first recovered (via `recover-deposit-intent-pk`).
;; Then, the public key is checked against the `circle-attestors` map.
(define-read-only (verify-deposit-intent-signature
    (deposit-intent (buff 320))
    (signature (buff 65))
  )
  (begin
    ;; #[filter(deposit-intent, signature)]
    (let ((recovered-pk (try! (recover-deposit-intent-pk deposit-intent signature))))
      (asserts! (default-to false (map-get? circle-attestors recovered-pk))
        ERR_INVALID_DEPOSIT_SIGNATURE
      )
      (ok recovered-pk)
    )
  )
)

;; Convert 32 bytes to a standard principal. This is serialized as
;; 1 version byte, plus 20 hash bytes. This is then left-padded
;; with 11 bytes of 0x00.
;;
;; To support contracts as recipients, `hook-data` can contain a contract name.
;; To use this functionality, `hook-data` MUST be a consensus-serialized buffer
;; of the type { contract-name: (string-ascii 40) }.
;;
;; If `hook-data` is not able to be deserialized, this function falls back
;; to using a standard principal.
(define-read-only (get-remote-recipient
    (remote-recipient-bytes (buff 32))
    (hook-data (buff 80))
  )
  (let (
      (valid-len (asserts! (is-eq (len remote-recipient-bytes) u32)
        ERR_INVALID_DEPOSIT_REMOTE_RECIPIENT_LENGTH
      ))
      (version-byte (unwrap-panic (element-at? remote-recipient-bytes u11)))
      (hash-bytes (unwrap-panic (as-max-len? (unwrap-panic (slice? remote-recipient-bytes u12 u32)) u20)))
      ;; Avoid a VM runtime error when `hook-data` is empty:
      (hook-contract-name (if (is-eq (len hook-data) u0)
        none
        (from-consensus-buff? { contract-name: (string-ascii 40) } hook-data)
      ))
    )
    ;; Must have 0x00 as padding
    (asserts!
      (is-eq
        (unwrap-panic (as-max-len? (unwrap-panic (slice? remote-recipient-bytes u0 u11)) u11))
        0x0000000000000000000000
      )
      ERR_INVALID_DEPOSIT_REMOTE_RECIPIENT
    )
    (ok (unwrap!
      (match hook-contract-name
        contract-name-tup (principal-construct? version-byte hash-bytes
          (get contract-name contract-name-tup)
        )
        (principal-construct? version-byte hash-bytes)
      )
      ERR_INVALID_DEPOSIT_REMOTE_RECIPIENT
    ))
  )
)

;; 32-byte encoded version of the `.usdcx` contract address.
;; This must be used in deposit intents as the `remote-token` field.
(define-read-only (get-valid-remote-token)
  (concat 0x00000000
    (unwrap-panic (as-max-len? (unwrap-panic (to-consensus-buff? .usdcx)) u28))
  )
)

;; Helper function to parse and validate a deposit intent.
;;
;; In addition to basic parsing (done via `parse-deposit-intent`), this function
;; also validates certain Stacks-specific fields, such as the
;; remote token, remote domain, remote recipient, and version.
;;
;; Additionally, this function validates the `amount` and `max-fee` fields.
(define-read-only (parse-and-validate-deposit-intent (deposit-intent (buff 320)))
  (let (
      (parsed-intent (try! (parse-deposit-intent deposit-intent)))
      (remote-recipient (try! (get-remote-recipient (get remote-recipient parsed-intent)
        (get hook-data parsed-intent)
      )))
      (amount (get amount parsed-intent))
    )
    (asserts! (is-eq (get remote-token parsed-intent) (get-valid-remote-token))
      ERR_INVALID_DEPOSIT_REMOTE_TOKEN
    )
    (asserts! (> amount u0) ERR_INVALID_DEPOSIT_AMOUNT_ZERO)
    (asserts! (is-eq (get remote-domain parsed-intent) DOMAIN)
      ERR_INVALID_DEPOSIT_REMOTE_DOMAIN
    )
    (asserts! (is-eq (get version parsed-intent) DEPOSIT_INTENT_VERSION)
      ERR_INVALID_DEPOSIT_VERSION
    )
    (asserts! (>= amount (get max-fee parsed-intent))
      ERR_INVALID_DEPOSIT_MAX_FEE_GTE_AMOUNT
    )
    (asserts! (is-none (map-get? used-nonces (get nonce parsed-intent)))
      ;; This nonce has already been used in a different deposit
      ERR_INVALID_DEPOSIT_NONCE
    )
    (ok (merge parsed-intent { remote-recipient: remote-recipient }))
  )
)

;; Mint USDCx using a deposit intent.
;; This is the main entry point for minting USDCx.
;;
;; In addition to validation performed by `parse-and-validate-deposit-intent`, and
;; `verify-deposit-intent-signature`, this function also validates the `fee-amount`
;; provided by the caller to ensure that zero-amount mints are not possible.
;;
;; If `fee-amount` is non-zero (and less than the deposit's `max-fee`),
;; this function will mint `fee-amount` of USDCx to the caller. This allows
;; for accounts other than the deposit's recipient to cover the STX fee needed to mint.
(define-public (mint
    (deposit-intent (buff 320))
    (signature (buff 65))
    (fee-amount uint)
  )
  (let (
      (parsed-intent (try! (parse-and-validate-deposit-intent deposit-intent)))
      (recovered-pk (try! (verify-deposit-intent-signature deposit-intent signature)))
      (mint-amount (- (get amount parsed-intent) fee-amount))
    )
    (asserts! (>= (get max-fee parsed-intent) fee-amount)
      ERR_INVALID_DEPOSIT_FEE_AMOUNT_TOO_HIGH
    )
    ;; mint to the recipient
    (if (is-eq mint-amount u0)
      true
      (try! (contract-call? .usdcx protocol-mint mint-amount
        (get remote-recipient parsed-intent)
      ))
    )
    (if (is-eq fee-amount u0)
      true
      (try! (contract-call? .usdcx protocol-mint fee-amount tx-sender))
    )
    (map-set used-nonces (get nonce parsed-intent) true)
    (print {
      topic: "mint",
      parsed-intent: parsed-intent,
      attestor-pk: recovered-pk,
      mint-amount: mint-amount,
      fee-amount: fee-amount,
    })
    (ok true)
  )
)

;; Set the minimum withdrawal amount.
;;
;; Can only be called by a caller with the custom role `0x04` role.
(define-public (set-min-withdrawal-amount (new-min-withdrawal-amount uint))
  (begin
    (try! (contract-call? .usdcx validate-protocol-caller 0x04 contract-caller))
    (var-set min-withdrawal-amount new-min-withdrawal-amount)
    (ok true)
  )
)

(define-read-only (get-min-withdrawal-amount)
  (var-get min-withdrawal-amount)
)

;; Burn USDCx for the purpose of withdrawing USDCx from the protocol.
;;
;; This function burns USDCx from the caller's account and emits a `burn` event.
;;
;; The amount must be greater than or equal to the minimum withdrawal amount.
;;
;; `native-domain` must be a supported value (currently only `ETHEREUM_NATIVE_DOMAIN` (u0)).
(define-public (burn
    (amount uint)
    (native-domain uint)
    (native-recipient (buff 32))
  )
  (begin
    (asserts! (>= amount (var-get min-withdrawal-amount))
      ERR_INVALID_WITHDRAWAL_AMOUNT_TOO_LOW
    )
    (asserts! (is-eq native-domain ETHEREUM_NATIVE_DOMAIN)
      ERR_INVALID_NATIVE_DOMAIN
    )
    (try! (contract-call? .usdcx protocol-burn amount tx-sender))
    (print {
      topic: "burn",
      native-domain: native-domain,
      native-recipient: native-recipient,
      sender: tx-sender,
      amount: amount,
    })
    (ok true)
  )
)

```
{% endcode %}

## **USDCx-v1 Contract Summary**

The `usdcx-v1` contract implements the **USDC xReserve protocol** for moving USDC between Stacks and external chains. It serves as the **primary entry point for minting and burning USDCx** based on Circle-issued deposit intents.

This contract handles:

* Parsing and validating deposit intent payloads
* Recovering and verifying Circle attestor signatures
* Enforcing nonce-based replay protection
* Minting USDCx through the `usdcx` token contract
* Burning USDCx to initiate withdrawals
* Managing Circle attestor keys
* Handling Stacks-specific recipient conversions
* Applying fee logic for sponsored mints
* Managing minimum withdrawal thresholds

It works in tandem with the main `usdcx` token contract, which enforces protocol roles (`mint`, `governance`, etc.). All minting/burning occurs through `protocol-mint` and `protocol-burn`.

### Minting USDCx

The entry point for minting USDCx is via the `mint` function. The caller provides a serialized deposit intent, along with a signature, both of which are received off-chain as part of the bridging process. The deposit intent is parsed according to the xReserve specificiation.

There are a few Stacks-specific elements:

* The `remote-token` of the deposit intent MUST be the consensus-serialized bytes of the principal `.usdcx` (where the deployer address is network-dependent), with 0x left-padded.
* The `remote-domain` for Stacks is always `10003`.
* Because Stacks only supports `u128` integers, the deserialization functions throw an error if any 64-byte integers in the deposit intent are larger than `u128::max`. This is allowed according to the xReserve spec.

### **Verifying attestations**

The `.usdcx-v1` contract keeps a `circle-attestors` map to keep track of public keys of valid attestors. When a deposit intent is provided, it must be signed by a public key in this map.&#x20;

### Burning USDCx

To withdrawal USDCx to another chain, users call `burn`. The specified amount of USDCx is burned from their Stacks account. A `print` event is emitted, which is used for triggering a burn attestation off-chain.

The `.usdcx-v1` contract stores a minimum amount variable. Users must withdraw at least this amount, or the burn fails. Accounts with the role `0x04` can update this variable.
