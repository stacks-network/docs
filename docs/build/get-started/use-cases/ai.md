---
description: Use cases of AI on Stacks
---

# AI

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/ai.png" alt=""><figcaption></figcaption></figure></div>

AI on **Stacks** enables verifiable, Bitcoin-secured AI applications. Developers can build decentralized AI marketplaces, create AI agents that safely manage sBTC under smart-contract rules, and generate verifiable inference receipts for trust and compliance. By combining Bitcoin security with Clarity and sBTC, Stacks provides a powerful foundation for trusted, permissionless, AI-powered apps.

Here are some powerful examples of how **Stacks is unlocking on-chain AI experiences secured by Bitcoin:**

### **x402-Stacks**

x402 enables **automatic HTTP-level payments** for APIs, AI agents, and digital services using STX or sBTC tokens on Stacks. Pay only for what you use, right when you use it. No subscriptions, no API keys, no intermediaries.

**Implementation highlight:**\
The `x402-Stacks` library is a TypeScript library for implementing the x402 payment protocol on Stacks blockchain. This system supports multiple ways to handle paid API access: clients can pay automatically using an axios interceptor, or they can sign requests while a facilitator service reliably settles the payment on their behalf. Developers can also protect any Express.js endpoint with plug-and-play middleware. Pricing is fully flexible, supporting fixed, tiered, or dynamic fee models.

{% code title="x402-stacks" expandable="true" %}
```typescript
import axios from 'axios';
import { withPaymentInterceptor, privateKeyToAccount } from 'x402-stacks';

// Create account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY!, 'testnet');

// Wrap axios with automatic payment handling
const api = withPaymentInterceptor(
  axios.create({ baseURL: 'https://api.example.com' }),
  account
);

// Use normally - 402 payments are handled automatically!
const response = await api.get('/api/premium-data');
console.log(response.data);
```
{% endcode %}

<details>

<summary>Check out more from x402-Stacks</summary>

* \[[npm package](https://www.npmjs.com/package/x402-stacks)] x402-Stacks
* \[[Github](https://github.com/tony1908/x402Stacks)] Open-source repo for x402-Stacks
* \[[Twitter](https://x.com/toony1908/status/1996417973842858238)] Demo video of using x402-Stacks SDK

</details>

***

### AIBTC

The AI + BTC coordination network. AIBTC provides AI powered agents with Bitcoin and Stacks tooling.

**Implementation highlight:**\
The `aibtcdev-backend` bridges AI capabilities with Stacks blockchain technology to create intelligent DAO management experiences. The system provides real-time communication with AI agents that can autonomously interact with DAOs, create and evaluate proposals, execute trades, and manage blockchain accounts.

{% code title="WebSocket Chat usage example" %}
```typescript
const ws = new WebSocket('ws://localhost:8000/chat/ws?token=your_token');
ws.send(JSON.stringify({
  type: 'message',
  thread_id: 'thread-uuid',
  content: 'Hello, AI agent!'
}));
```
{% endcode %}

<details>

<summary>Check out more from AIBTC</summary>

* \[[Official](https://aibtc.com/)] Official website of AIBTC
* \[[Github](https://github.com/aibtcdev)] Open-source repo for backend, frontend, and agent tooling support

</details>
