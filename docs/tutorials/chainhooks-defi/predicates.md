# Creating Chainhook Predicates

Predicates define what blockchain events you want to track. Let's create predicates for our DeFi monitor.

## Predicate Structure

Every predicate has this structure:

```json
{
  "uuid": "unique-identifier",
  "name": "Human readable name",
  "version": 1,
  "chain": "stacks",
  "networks": {
    "mainnet": {
      "if_this": { /* conditions */ },
      "then_that": { /* action */ }
    }
  }
}
```

## DEX Swap Predicate

Track swaps on popular DEXes like Velar, Arkadiko, and ALEX:

```json
{
  "uuid": "defi-swaps-monitor",
  "name": "DeFi Swap Monitor",
  "version": 1,
  "chain": "stacks",
  "networks": {
    "mainnet": {
      "if_this": {
        "scope": "contract_call",
        "contract_identifier": "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-router",
        "method": "swap-exact-tokens-for-tokens"
      },
      "then_that": {
        "http_post": {
          "url": "https://your-api.com/webhooks/swaps",
          "authorization_header": "Bearer your-secret"
        }
      }
    }
  }
}
```

## Whale Alert Predicate

Monitor large STX transfers (100K+ STX):

```json
{
  "uuid": "whale-alerts",
  "name": "Whale Transaction Alerts",
  "version": 1,
  "chain": "stacks",
  "networks": {
    "mainnet": {
      "if_this": {
        "scope": "stx_event",
        "actions": ["transfer"],
        "start_from": {
          "amount_greater_than": 100000000000
        }
      },
      "then_that": {
        "http_post": {
          "url": "https://your-api.com/webhooks/whale-alerts",
          "authorization_header": "Bearer your-secret"
        }
      }
    }
  }
}
```

## Liquidity Events Predicate

Track liquidity additions and removals:

```json
{
  "uuid": "liquidity-events",
  "name": "Liquidity Pool Events",
  "version": 1,
  "chain": "stacks",
  "networks": {
    "mainnet": {
      "if_this": {
        "scope": "print_event",
        "contract_identifier": "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-core",
        "contains": "liquidity"
      },
      "then_that": {
        "http_post": {
          "url": "https://your-api.com/webhooks/liquidity",
          "authorization_header": "Bearer your-secret"
        }
      }
    }
  }
}
```

## Registering Predicates

Use the Chainhooks API to register your predicates:

```typescript
// src/chainhooks/client.ts
import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  apiKey: process.env.CHAINHOOKS_API_KEY!,
});

export async function registerSwapPredicate() {
  const predicate = {
    uuid: 'defi-swaps-monitor',
    name: 'DeFi Swap Monitor',
    version: 1,
    chain: 'stacks',
    networks: {
      mainnet: {
        if_this: {
          scope: 'contract_call',
          contract_identifier: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-router',
          method: 'swap-exact-tokens-for-tokens',
        },
        then_that: {
          http_post: {
            url: `${process.env.WEBHOOK_BASE_URL}/webhooks/swaps`,
            authorization_header: `Bearer ${process.env.WEBHOOK_SECRET}`,
          },
        },
      },
    },
  };

  return client.createPredicate(predicate);
}
```

## Multiple DEX Support

To monitor multiple DEXes, create predicates for each:

```typescript
const DEX_CONTRACTS = [
  {
    name: 'Velar',
    contract: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-router',
    method: 'swap-exact-tokens-for-tokens',
  },
  {
    name: 'Arkadiko',
    contract: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-swap-v2-1',
    method: 'swap-x-for-y',
  },
  {
    name: 'ALEX',
    contract: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.amm-swap-pool-v1-1',
    method: 'swap-helper',
  },
];
```

## Testing Predicates

Before deploying, test your predicates locally:

```bash
# Use Clarinet devnet
clarinet devnet start

# Trigger a swap transaction
# Your webhook should receive the event
```

## Next Steps

Now let's build the backend to handle these webhook events.

[Continue to Backend →](backend.md)
