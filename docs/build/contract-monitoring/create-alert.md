---
description: Create a Hiro Platform alert for Stacks contract activity.
---

# Create an Alert

## What you'll do

- Add a contract to Hiro Platform monitoring
- Configure alert conditions for contract calls
- Choose email and webhook delivery channels

## Prerequisites

- A public contract on Stacks mainnet
- A [Hiro Platform](https://platform.hiro.so) account

{% stepper %}
{% step %}
#### Open Contract Monitoring

Sign in to [Hiro Platform](https://platform.hiro.so) and open the **Monitor** tab.
{% endstep %}

{% step %}
#### Add a contract

Add a contract either by entering the contract principal and name directly or by connecting a wallet to inspect your deployment history.
{% endstep %}

{% step %}
#### Review activity

After the contract is added, you can inspect recent transaction activity and open the alert creation flow.
{% endstep %}

{% step %}
#### Configure the alert

You can filter alerts by:

- Function name
- Function arguments
- Caller address

This works well for owner actions, mint and burn functions, or operational contract calls you want to watch closely.
{% endstep %}

{% step %}
#### Choose delivery channels

You can send alerts to:

- Email
- A webhook endpoint

You can enable both channels for the same alert.
{% endstep %}
{% endstepper %}

## Webhook payload shape

```json
{
  "tx_id": "0xa7f511b3f379efef6fe71d0de57712ed13a89c5b6e24dd049eb2cc9a7c24fcb5",
  "nonce": 5,
  "sender_address": "SP2W9QYAHJNS7YTQY9EK2MSTQGX9E2NDMV766JP9Z",
  "tx_status": "pending",
  "tx_type": "contract_call",
  "contract_call": {
    "contract_id": "SPHW0EJK5KPDMK03ZX792EMP0Q5J3A39ZMTVZZCY.sample-contract",
    "function_name": "donate",
    "function_signature": "(define-public (donate (amount uint)))",
    "function_args": [
      {
        "hex": "0x01000000000000000000000000002dc6c0",
        "repr": "u3000000",
        "name": "amount",
        "type": "uint"
      }
    ]
  }
}
```

{% hint style="info" %}
`tx_status` is `pending` for monitor alerts. These notifications are sent when the transaction reaches the mempool, not after confirmation.
{% endhint %}

## Next steps

- [Chainhooks overview](../chainhooks/overview.md)
- [Hiro Platform](https://platform.hiro.so)
