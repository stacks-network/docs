---
description: Understanding the structure of Chainhooks webhook payloads
---

# Payload anatomy

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/reference/payload-anatomy).
{% endhint %}

## Payload Overview

A Chainhooks payload consists of two main sections: **event** and **chainhook**:

- `event` contains the blockchain data (blocks, transactions, operations)
- `chainhook` contains metadata about the chainhook that triggered

---

## Basic Structure

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

---

## Event Section

### Apply Array

The `apply` array contains blocks being added to the canonical chain. Each block includes:

```json
{
  "timestamp": 1757977309,
  "block_identifier": {
    "hash": "0xa204da7...",
    "index": 3549902
  },
  "parent_block_identifier": {
    "hash": "0xad0acff...",
    "index": 3549901
  },
  "transactions": []
}
```

### Rollback Array

The `rollback` array contains blocks being removed during a chain reorganization. Same structure as `apply`.

{% hint style="info" %}
Chainhooks automatically handles reorgs by sending rollback events. Your application should reverse any state changes from rolled-back blocks.
{% endhint %}

---

## Transaction Structure

Each transaction in the `transactions` array contains:

### Metadata

Transaction-level information:

```json
{
  "metadata": {
    "type": "contract_call",
    "nonce": 6689,
    "result": {
      "hex": "0x0703",
      "repr": "(ok true)"
    },
    "status": "success",
    "fee_rate": "3000",
    "position": {
      "index": 0,
      "microblock_identifier": null
    },
    "execution_cost": {
      "runtime": "7807",
      "read_count": "5",
      "read_length": "2441",
      "write_count": "2",
      "write_length": "1"
    },
    "sender_address": "SPV2YDN4RZ506655KZK493YKM31JQPKJ9NN3QCX9",
    "sponsor_address": null,
    "canonical": true,
    "sponsored": false,
    "microblock_canonical": true
  }
}
```

### Transaction Identifier

Unique identifier for the transaction:

```json
{
  "transaction_identifier": {
    "hash": "0x09defc9a6cd9318b5c458389d4dd57597203ec539818aec0de3cfcfd7af0c2ab"
  }
}
```

---

## Operations Array

Each transaction includes an `operations` array describing state changes. Operations are indexed sequentially.

### Fee Operation

Transaction fee paid:

```json
{
  "type": "fee",
  "amount": {
    "value": "-3000",
    "currency": {
      "symbol": "STX",
      "decimals": 6
    }
  },
  "status": "success",
  "account": {
    "address": "SPV2YDN4RZ506655KZK493YKM31JQPKJ9NN3QCX9"
  },
  "metadata": {
    "sponsored": false
  },
  "operation_identifier": {
    "index": 0
  }
}
```

### Contract Call Operation

Contract function invocation:

```json
{
  "type": "contract_call",
  "status": "success",
  "account": {
    "address": "SPV2YDN4RZ506655KZK493YKM31JQPKJ9NN3QCX9"
  },
  "metadata": {
    "contract_identifier": "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token",
    "function_name": "transfer",
    "args": [
      {
        "hex": "0x01000000000000000000000002690ed9fe",
        "name": "amount",
        "repr": "u10352515582",
        "type": "uint"
      },
      {
        "hex": "0x0516362f36a4c7ca0318a59fe6448fd3a0c32bda724d",
        "name": "sender",
        "repr": "'SPV2YDN4RZ506655KZK493YKM31JQPKJ9NN3QCX9",
        "type": "principal"
      },
      {
        "hex": "0x05161740f4690c79466e3389a13476586e0cb3e1dfbf",
        "name": "recipient",
        "repr": "'SPBM1X391HWMCVHKH6GK8XJRDR6B7REZQYQ8KBCK",
        "type": "principal"
      },
      {
        "hex": "0x09",
        "name": "memo",
        "repr": "none",
        "type": "(optional (buff 34))"
      }
    ]
  },
  "operation_identifier": {
    "index": 1
  }
}
```

{% hint style="info" %}
The `args` array includes `repr` and `type` fields when `decode_clarity_values` is enabled in options.
{% endhint %}

### Token Transfer Operation

FT/NFT/STX transfers:

```json
{
  "type": "token_transfer",
  "amount": {
    "value": "-10352515582",
    "currency": {
      "symbol": "",
      "decimals": 0,
      "metadata": {
        "token_type": "ft",
        "asset_identifier": "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko"
      }
    }
  },
  "status": "success",
  "account": {
    "address": "SPV2YDN4RZ506655KZK493YKM31JQPKJ9NN3QCX9"
  },
  "operation_identifier": {
    "index": 2
  }
}
```

### Contract Log Operation

Print statements from contracts:

```json
{
  "type": "contract_log",
  "status": "success",
  "metadata": {
    "topic": "print",
    "value": "0x09",
    "contract_identifier": "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token"
  },
  "operation_identifier": {
    "index": 4
  }
}
```
