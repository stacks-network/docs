---
description: Understand the shape of Hiro Chainhooks webhook payloads.
---

# Payload Anatomy

A Chainhooks delivery has two top-level sections:

- `event`, which contains chain data
- `chainhook`, which identifies the hook that triggered

## Basic structure

```json
{
  "event": {
    "apply": [],
    "rollback": [],
    "chain": "stacks",
    "network": "mainnet"
  },
  "chainhook": {
    "name": "my-chainhook",
    "uuid": "be4ab3ed-b606-4fe0-97c4-6c0b1ac9b185"
  }
}
```

## Apply and rollback

The `apply` array contains blocks being added to the canonical chain. The `rollback` array contains blocks being removed during a reorg.

{% hint style="info" %}
Handle rollback events explicitly if your app stores derived state. Reorgs require you to reverse the effects of the rolled-back blocks.
{% endhint %}

## Transaction metadata

Each transaction includes metadata such as type, nonce, execution result, fee rate, sender address, and execution cost.

```json
{
  "metadata": {
    "type": "contract_call",
    "nonce": 6689,
    "status": "success",
    "fee_rate": "3000",
    "sender_address": "SPV2YDN4RZ506655KZK493YKM31JQPKJ9NN3QCX9"
  }
}
```

## Operations

Each transaction includes an `operations` array describing state changes.

### Fee operation

```json
{
  "type": "fee",
  "status": "success",
  "operation_identifier": {
    "index": 0
  }
}
```

### Contract call operation

```json
{
  "type": "contract_call",
  "status": "success",
  "metadata": {
    "contract_identifier": "SP...token",
    "function_name": "transfer",
    "args": [
      {
        "name": "amount",
        "repr": "u10352515582",
        "type": "uint"
      }
    ]
  }
}
```

### Token transfer operation

```json
{
  "type": "token_transfer",
  "status": "success",
  "operation_identifier": {
    "index": 2
  }
}
```

### Contract log operation

```json
{
  "type": "contract_log",
  "status": "success",
  "metadata": {
    "topic": "print",
    "contract_identifier": "SP...arkadiko-token"
  }
}
```

{% hint style="info" %}
If `decode_clarity_values` is enabled, argument and result objects include `repr` and inferred `type` values in addition to the raw hex payload.
{% endhint %}
