# Message Signing

Learn how to implement message signing in your Stacks application. Message signing allows users to cryptographically prove they control an address without making an on-chain transaction, enabling authentication, authorization, and verifiable statements.

## What you'll learn

* Connect to a user's wallet and request message signatures
* Sign both simple text messages and structured data
* Verify signatures to ensure authenticity

## Prerequisites

* Node.js installed on your machine
* A code editor like VS Code

## Installation

Install the required packages for message signing and verification.

```bash
npm install @stacks/connect @stacks/encryption
```

## Connect to wallet

Before signing messages, establish a connection to the user's wallet. The connection persists across page reloads.

```ts
import { connect, isConnected } from '@stacks/connect';

async function connectWallet() {
  if (!isConnected()) {
    const response = await connect();
    console.log('Connected addresses:', response.addresses);
  }
}
```

Call this function when your app loads or when the user clicks a connect button.

## Sign text messages

Request a signature for a simple text message using the `request` method.

```ts
import { request } from '@stacks/connect';

async function signMessage() {
  const message = 'Hello World';

  const response = await request('stx_signMessage', {
    message,
  });

  console.log('Signature:', response.signature);
  console.log('Public key:', response.publicKey);

  return response;
}
```

The wallet will display the message to the user for approval before signing.

## Sign structured data

For more complex data, use structured message signing with Clarity values.

```ts
import { request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

async function signStructuredMessage() {
  const message = Cl.tuple({
    action: Cl.stringAscii('transfer'),
    amount: Cl.uint(1000),
    recipient: Cl.stringAscii('alice.btc')
  });

  const domain = Cl.tuple({
    name: Cl.stringAscii('My App'),
    version: Cl.stringAscii('1.0.0'),
    'chain-id': Cl.uint(1) // 1 for mainnet
  });

  const response = await request('stx_signStructuredMessage', {
    message,
    domain
  });

  return response;
}
```

Structured messages provide better type safety and are easier to parse on-chain.

## Verify signatures

Validate signatures to ensure they match the expected message and public key.

```ts
import { verifyMessageSignatureRsv } from '@stacks/encryption';

async function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  const isValid = verifyMessageSignatureRsv({
    message,
    signature,
    publicKey
  });

  if (isValid) {
    console.log('✓ Signature verified successfully');
  } else {
    console.log('✗ Invalid signature');
  }

  return isValid;
}
```

Always verify signatures before trusting the signed data.

## Complete verification flow

```ts
async function signAndVerify() {
  // Request signature
  const message = 'Authorize login at ' + new Date().toISOString();
  const signResponse = await request('stx_signMessage', { message });

  // Verify immediately
  const isValid = await verifySignature(
    message,
    signResponse.signature,
    signResponse.publicKey
  );

  if (isValid) {
    // Proceed with authenticated action
    console.log('Authentication successful');
  }
}
```

## Try it out

Create a simple authentication system using message signatures.

```ts
// Generate a unique challenge
function generateChallenge(): string {
  const nonce = Math.random().toString(36).substring(7);
  const timestamp = Date.now();
  return `Sign this message to authenticate:\nNonce: ${nonce}\nTime: ${timestamp}`;
}

// Complete auth flow
async function authenticate() {
  const challenge = generateChallenge();

  try {
    const response = await request('stx_signMessage', {
      message: challenge
    });

    const isValid = verifyMessageSignatureRsv({
      message: challenge,
      signature: response.signature,
      publicKey: response.publicKey
    });

    if (isValid) {
      // Store auth token or session
      localStorage.setItem('auth', JSON.stringify({
        publicKey: response.publicKey,
        timestamp: Date.now()
      }));

      return { success: true };
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }

  return { success: false };
}
```

