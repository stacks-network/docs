# Multi Send

Multi send is a very simple but highly useful utility contract for executing multiple STX transfers in a single transaction.

It takes in a list of addresses and amounts and folds through them to execute a STX transfer for each one.

Mainnet contract: [https://explorer.hiro.so/txid/0x59665b756dc0fa9efb3fca9e05a28f572c9b14ca894c115fd3e7d81a563e14f8?chain=mainnet](https://explorer.hiro.so/txid/0x59665b756dc0fa9efb3fca9e05a28f572c9b14ca894c115fd3e7d81a563e14f8?chain=mainnet)

```clojure
;; send-many
(define-private (send-stx (recipient { to: principal, ustx: uint }))
  (stx-transfer? (get ustx recipient) tx-sender (get to recipient)))
(define-private (check-err (result (response bool uint))
                           (prior (response bool uint)))
  (match prior ok-value result
               err-value (err err-value)))
(define-public (send-many (recipients (list 200 { to: principal, ustx: uint })))
  (fold check-err
    (map send-stx recipients)
    (ok true)))
```
