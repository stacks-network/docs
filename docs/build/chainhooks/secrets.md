---
description: Rotate and validate Hiro Chainhooks consumer secrets.
---

# Manage Secrets

## What you'll learn

- Create or rotate a Chainhooks consumer secret
- Validate incoming webhook requests with the `Authorization` header

## Prerequisites

- A Hiro API key
- A webhook consumer you control
- Node.js if you want to follow the Fastify example below

## Rotate a consumer secret

When you create a consumer secret, Chainhooks adds an `Authorization: Bearer <secret>` header to each webhook attempt.

```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet,
  apiKey: process.env.HIRO_API_KEY!,
});

const secret = (await client.rotateConsumerSecret()).secret;
```

Store the secret securely and rotate it whenever you need to replace the shared token.

## Validate webhook requests

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
```
