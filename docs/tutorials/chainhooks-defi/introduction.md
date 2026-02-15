# Introduction to Chainhooks

Chainhooks is a powerful event-driven system that allows you to react to on-chain events in real-time. Instead of constantly polling the blockchain, Chainhooks pushes events to your application when specific conditions are met.

## Why Chainhooks?

Traditional blockchain monitoring requires:
- Constant polling of the API
- Complex filtering logic
- High resource usage
- Delayed detection

Chainhooks provides:
- **Real-time events**: Instant notification when events occur
- **Declarative predicates**: Define what you want to track in JSON
- **Efficient**: Only receive events you care about
- **Reliable**: Built-in retry and delivery guarantees

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Stacks    │────▶│  Chainhooks │────▶│  Your App   │
│  Blockchain │     │   Service   │     │  (Webhook)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

1. You define a **predicate** (what events to track)
2. Chainhooks monitors the blockchain
3. When a matching event occurs, Chainhooks sends a webhook to your app
4. Your app processes the event and updates the UI

## Types of Predicates

### Contract Calls
Track when specific contract functions are called:

```json
{
  "if_this": {
    "scope": "contract_call",
    "contract_identifier": "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-swap-v2-1",
    "method": "swap-x-for-y"
  }
}
```

### STX Transfers
Monitor large STX movements:

```json
{
  "if_this": {
    "scope": "stx_event",
    "actions": ["transfer"],
    "start_from": {
      "amount_greater_than": 100000000000
    }
  }
}
```

### Print Events
Capture contract print events:

```json
{
  "if_this": {
    "scope": "print_event",
    "contract_identifier": "SP...",
    "contains": "swap"
  }
}
```

## Getting Started

To use Chainhooks, you'll need:

1. **Hiro Platform Account**: Sign up at [platform.hiro.so](https://platform.hiro.so)
2. **API Key**: Generate from the dashboard
3. **Webhook Endpoint**: A publicly accessible URL to receive events

## Next Steps

In the next section, we'll set up our project and configure the development environment.

[Continue to Setup →](setup.md)
