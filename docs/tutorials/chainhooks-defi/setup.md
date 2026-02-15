# Setting Up the Project

Let's create our DeFi monitoring project from scratch.

## Project Structure

```
defi-monitor/
├── src/
│   ├── index.ts          # Main server entry
│   ├── api/
│   │   ├── routes.ts     # API endpoints
│   │   └── websocket.ts  # WebSocket handler
│   ├── chainhooks/
│   │   └── client.ts     # Chainhooks client
│   └── services/
│       └── analytics.ts  # Data processing
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/
│   └── package.json
├── package.json
└── tsconfig.json
```

## Initialize the Project

```bash
mkdir defi-monitor && cd defi-monitor
npm init -y
```

## Install Dependencies

```bash
# Backend dependencies
npm install fastify @fastify/cors @fastify/websocket
npm install @hirosystems/chainhooks-client
npm install dotenv pino

# Dev dependencies
npm install -D typescript @types/node ts-node-dev
```

## TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

## Environment Variables

Create `.env`:

```env
PORT=4000
HOST=0.0.0.0
STACKS_NETWORK=mainnet
CHAINHOOKS_API_KEY=your_api_key_here
WEBHOOK_BASE_URL=https://your-domain.com
```

## Package Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Create the Server

Create `src/index.ts`:

```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

async function main() {
  // Register plugins
  await fastify.register(cors, { origin: true });
  await fastify.register(websocket);

  // Health check
  fastify.get('/health', async () => ({ status: 'ok' }));

  // Start server
  const port = parseInt(process.env.PORT || '4000');
  await fastify.listen({ port, host: '0.0.0.0' });
  
  console.log(`Server running on port ${port}`);
}

main().catch(console.error);
```

## Test the Setup

```bash
npm run dev
```

Visit `http://localhost:4000/health` - you should see `{"status":"ok"}`.

## Next Steps

Now that our project is set up, let's create the Chainhook predicates to define what events we want to track.

[Continue to Predicates →](predicates.md)
