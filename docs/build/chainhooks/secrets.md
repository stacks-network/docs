---
description: Rotate consumer secrets and validate every Chainhooks delivery
---

# Manage secrets

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/secrets).
{% endhint %}

## What you'll learn

- Create/rotate a Chainhooks consumer secret.
- Validate webhook requests by checking the `Authorization` header.

## Prerequisites

- Hiro API key
- Node.js (server example uses Fastify).

## Validating webhook requests with a consumer secret

When you create a secret, our Chainhooks service attaches an `Authorization: Bearer <secret>` header to every webhook attempt, giving you a simple shared-secret handshake. Here's how to get started:

1. Rotate the secret with `rotateConsumerSecret` (or the `/chainhooks/{uuid}/secret` API) whenever you need to initialize or create a new token.
2. Reject webhook deliveries whose `Authorization` header does not equal `Bearer <current-secret>`.

### Create/rotate consumer secret

```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet, // or .testnet / custom URL
  apiKey: process.env.HIRO_API_KEY!,
});

// Store this value securely and use it to validate webhook requests
const secret = await client.rotateConsumerSecret().secret;
```

### Example Fastify server

```ts
server.post('/webhook', async (request, reply) => {
  if (!secret) {
    reply.code(503).send({ error: 'consumer secret unavailable' });
    return;
  }

  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${secret}`) {
    reply.code(401).send({ error: 'invalid consumer secret' });
    return;
  }

  const event = request.body;
  console.log(`received chainhook ${event.chainhook.uuid}`);
  reply.code(204).send();
});

await server.listen({ port: Number(process.env.PORT) || 3000 });
```
