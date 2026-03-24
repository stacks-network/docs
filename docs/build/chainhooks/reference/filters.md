---
description: Complete reference for all Chainhooks filter types
---

# Filters

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/reference/filters).
{% endhint %}

Filters define which blockchain events will trigger your chainhook.

Here is a complete reference for all Chainhooks filter types:

| Filter | When to use |
|--------|-------------|
| `ft_event` | Catch *every* SIP-010 transfer, mint, or burn across assets. |
| `ft_transfer` | Follow a single asset such as USDC; optionally add `sender`/`receiver` for wallet-level triggers. |
| `ft_mint` | Track supply expansions or bridge inflows for one asset (set `asset_identifier`). |
| `ft_burn` | Track redemptions or supply contractions for one asset (set `asset_identifier`). |
| `nft_event` | Monitor every transfer, mint, or burn for all collections. |
| `nft_transfer` | Follow a SIP-009 collection; add `sender`, `receiver`, or `value` for owner/token targeting. |
| `nft_mint` | Watch every new mint for a collection (set `asset_identifier`). |
| `nft_burn` | Catch burns or redemptions (set `asset_identifier`). |
| `stx_event` | Capture all native transfers, mints, or burns. |
| `stx_transfer` | Track every STX transfer; add `sender` or `receiver` to spotlight specific principals. |
| `contract_deploy` | React to new contracts entering the network. |
| `contract_call` | Observe every invocation; narrow with `contract_identifier` and `function_name`. |
| `contract_log` | Catch `print`/log output from a contract (set `contract_identifier`). |
| `coinbase` | Watch miner rewards hitting the chain. |
| `tenure_change` | Track Proof-of-Transfer tenure updates; add `cause` (`"block_found"` or `"extended"`) for specificity. |

## Fungible Token Events (FT)

### Any FT Event

Match any fungible token event (transfer, burn, or mint):

```json
{
  "type": "ft_event"
}
```

### FT Transfer

Match FT transfers for a specific asset:

```json
{
  "type": "ft_transfer",
  "asset_identifier": "SP...ABC.ft::usdc"
}
```

Filter by sender:

```json
{
  "type": "ft_transfer",
  "asset_identifier": "SP...ABC.ft::usdc",
  "sender": "SP...FROM"
}
```

Filter by receiver:

```json
{
  "type": "ft_transfer",
  "asset_identifier": "SP...ABC.ft::usdc",
  "receiver": "SP...TO"
}
```

### FT Mint

Match FT mint events:

```json
{
  "type": "ft_mint",
  "asset_identifier": "SP...ABC.ft::usdc"
}
```

### FT Burn

Match FT burn events:

```json
{
  "type": "ft_burn",
  "asset_identifier": "SP...ABC.ft::usdc"
}
```

---

## Non-Fungible Token Events (NFT)

### Any NFT Event

Match any NFT event (transfer, burn, or mint):

```json
{
  "type": "nft_event"
}
```

### NFT Transfer

Match NFT transfers for a specific collection:

```json
{
  "type": "nft_transfer",
  "asset_identifier": "SP...COLL.nft::collectible"
}
```

Filter by sender:

```json
{
  "type": "nft_transfer",
  "asset_identifier": "SP...COLL.nft::collectible",
  "sender": "SP...FROM"
}
```

Filter by receiver:

```json
{
  "type": "nft_transfer",
  "asset_identifier": "SP...COLL.nft::collectible",
  "receiver": "SP...TO"
}
```

Filter by specific token ID:

```json
{
  "type": "nft_transfer",
  "asset_identifier": "SP...COLL.nft::collectible",
  "value": "u123"
}
```

### NFT Mint

Match NFT mint events:

```json
{
  "type": "nft_mint",
  "asset_identifier": "SP...COLL.nft::collectible"
}
```

### NFT Burn

Match NFT burn events:

```json
{
  "type": "nft_burn",
  "asset_identifier": "SP...COLL.nft::collectible"
}
```

---

## STX Events

### Any STX Event

Match any STX event (transfer, burn, or mint):

```json
{
  "type": "stx_event"
}
```

### STX Transfer

Match any STX transfer:

```json
{
  "type": "stx_transfer"
}
```

Filter by sender:

```json
{
  "type": "stx_transfer",
  "sender": "SP...SENDER"
}
```

Filter by receiver:

```json
{
  "type": "stx_transfer",
  "receiver": "SP...RECEIVER"
}
```

---

## Contract Events

### Contract Deploy

Match any contract deployment:

```json
{
  "type": "contract_deploy"
}
```

Filter by deployer:

```json
{
  "type": "contract_deploy",
  "sender": "SP...DEPLOYER"
}
```

### Contract Call

Match any contract call:

```json
{
  "type": "contract_call"
}
```

Match calls to a specific contract:

```json
{
  "type": "contract_call",
  "contract_identifier": "SP...XYZ.counter"
}
```

Match calls to a specific function:

```json
{
  "type": "contract_call",
  "contract_identifier": "SP...XYZ.counter",
  "function_name": "increment"
}
```

Filter by caller:

```json
{
  "type": "contract_call",
  "contract_identifier": "SP...XYZ.counter",
  "function_name": "increment",
  "sender": "SP...CALLER"
}
```

### Contract Log

Match any print events:

```json
{
  "type": "contract_log"
}
```

Match contract print events:

```json
{
  "type": "contract_log",
  "contract_identifier": "SP...XYZ.counter"
}
```

Filter by transaction sender:

```json
{
  "type": "contract_log",
  "contract_identifier": "SP...XYZ.counter",
  "sender": "SP...SENDER"
}
```

---

## System Events

### Coinbase

Match coinbase events (block rewards):

```json
{
  "type": "coinbase"
}
```

### Tenure Change

Match any tenure change:

```json
{
  "type": "tenure_change"
}
```

Match tenure changes by cause (block found):

```json
{
  "type": "tenure_change",
  "cause": "block_found"
}
```

Match tenure changes by cause (extended):

```json
{
  "type": "tenure_change",
  "cause": "extended"
}
```

---

## Combining Filters

You can combine multiple filters in the `filters.events` array. A chainhook will trigger if **any** of the filters match:

```json
{
  "filters": {
    "events": [
      {
        "type": "ft_transfer",
        "asset_identifier": "SP...ABC.token::diko"
      },
      {
        "type": "contract_call",
        "contract_identifier": "SP...XYZ.counter",
        "function_name": "increment"
      }
    ]
  }
}
```
