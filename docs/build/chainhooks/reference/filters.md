---
description: Complete reference for Hiro Chainhooks filter types.
---

# Filters

Filters determine which blockchain events trigger a chainhook.

| Filter | When to use |
| --- | --- |
| `ft_event` | Catch all SIP-010 transfers, mints, and burns |
| `ft_transfer` | Track transfers for a specific fungible token |
| `ft_mint` | Track mint activity for a specific fungible token |
| `ft_burn` | Track burn activity for a specific fungible token |
| `nft_event` | Catch all SIP-009 transfers, mints, and burns |
| `nft_transfer` | Track transfers for a specific collection |
| `nft_mint` | Track mint activity for a specific collection |
| `nft_burn` | Track burn activity for a specific collection |
| `stx_event` | Capture all STX transfers, mints, and burns |
| `stx_transfer` | Track STX transfers, optionally by sender or receiver |
| `contract_deploy` | React to new contract deployments |
| `contract_call` | Observe contract function invocations |
| `contract_log` | Capture contract `print` output |
| `coinbase` | Track miner rewards |
| `tenure_change` | Track Proof-of-Transfer tenure changes |

## FT events

```json
{ "type": "ft_event" }
```

```json
{
  "type": "ft_transfer",
  "asset_identifier": "SP...ABC.ft::usdc"
}
```

```json
{
  "type": "ft_transfer",
  "asset_identifier": "SP...ABC.ft::usdc",
  "sender": "SP...FROM"
}
```

```json
{
  "type": "ft_transfer",
  "asset_identifier": "SP...ABC.ft::usdc",
  "receiver": "SP...TO"
}
```

## NFT events

```json
{ "type": "nft_event" }
```

```json
{
  "type": "nft_transfer",
  "asset_identifier": "SP...COLL.nft::collectible"
}
```

```json
{
  "type": "nft_transfer",
  "asset_identifier": "SP...COLL.nft::collectible",
  "value": "u123"
}
```

## STX events

```json
{ "type": "stx_event" }
```

```json
{ "type": "stx_transfer" }
```

```json
{
  "type": "stx_transfer",
  "sender": "SP...SENDER"
}
```

```json
{
  "type": "stx_transfer",
  "receiver": "SP...RECEIVER"
}
```

## Contract events

```json
{ "type": "contract_deploy" }
```

```json
{
  "type": "contract_deploy",
  "sender": "SP...DEPLOYER"
}
```

```json
{ "type": "contract_call" }
```

```json
{
  "type": "contract_call",
  "contract_identifier": "SP...XYZ.counter",
  "function_name": "increment"
}
```

```json
{
  "type": "contract_log",
  "contract_identifier": "SP...XYZ.counter"
}
```

## System events

```json
{ "type": "coinbase" }
```

```json
{ "type": "tenure_change" }
```

```json
{
  "type": "tenure_change",
  "cause": "block_found"
}
```

## Combining filters

A chainhook triggers when any entry in `filters.events` matches.

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
