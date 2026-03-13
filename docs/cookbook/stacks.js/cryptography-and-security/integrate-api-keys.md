# Integrate api keys

{% code fullWidth="false" expandable="true" %}
```typescript
import { createNetwork } from '@stacks/network'

// Create a network with options object
const network = createNetwork({
  network: 'mainnet',
  apiKey: 'my-api-key',
});
```
{% endcode %}

### Description

Configure Stacks.js to use API keys for enhanced rate limits and monitoring

### Use Cases

* Increased API rate limits for production applications
* API usage monitoring and analytics
* Priority access during high traffic periods
* Custom enterprise support features

### Key Concepts

* **Higher rate limits** - 500 requests/minute vs 50 for anonymous
* **Usage tracking** - Monitor your API consumption
* **Priority queue** - Better performance during peak times
* **Support** - Access to dedicated support channels
