# Connect Wallet

Learn how to integrate wallet connections into your Stacks application. Connecting a wallet authenticates users and enables blockchain interactions like transfers and contract calls.

{% hint style="success" %}
For the latest releases and versions of `@stacks/connect`, check out its npm page [here](https://www.npmjs.com/package/@stacks/connect).
{% endhint %}

## What you'll learn

* Install the `@stacks/connect` package
* Connect to a wallet and authenticate users
* Manage authentication state
* Access user account data

{% hint style="info" %}
Prerequisites:

* Node.js installed on your machine
* A web application setup (React, Vue, or vanilla JS)
* Basic understanding of async/await
{% endhint %}

## Quickstart

{% stepper %}
{% step %}
#### Install package

Add Stacks Connect to your project:

{% code title="Install" %}
```bash
npm install @stacks/connect
```
{% endcode %}
{% endstep %}

{% step %}
#### Connect and authenticate

Use `connect` to initiate a wallet session and persist user data:

{% code title="connect.ts" %}
```ts
import { connect, isConnected } from '@stacks/connect';

async function connectWallet() {
  if (isConnected()) {
    console.log('Already authenticated');
    return;
  }

  const response = await connect();
  console.log('Connected:', response.addresses);
}
```
{% endcode %}

Manage authentication state in your app:

{% code title="auth.ts" %}
```ts
import { disconnect, isConnected } from '@stacks/connect';

const authenticated = isConnected();

function logout() {
  disconnect();
  console.log('User disconnected');
}
```
{% endcode %}
{% endstep %}

{% step %}
#### Access user data

Read persisted addresses and request full account details:

{% code title="user-data.ts" %}
```ts
import { getLocalStorage, request } from '@stacks/connect';

const userData = getLocalStorage();
if (userData?.addresses) {
  const stxAddress = userData.addresses.stx[0].address;
  const btcAddress = userData.addresses.btc[0].address;
  console.log('STX:', stxAddress);
  console.log('BTC:', btcAddress);
}

const accounts = await request('stx_getAccounts');
const account = accounts.addresses[0];
console.log('Address:', account.address);
console.log('Public key:', account.publicKey);
console.log('Gaia URL:', account.gaiaHubUrl);
```
{% endcode %}
{% endstep %}

{% step %}
#### Make your first transaction

Request the wallet to broadcast a transfer:

{% code title="send-transaction.ts" %}
```ts
import { request } from '@stacks/connect';

async function sendTransaction() {
  const response = await request('stx_transferStx', {
    amount: '1000000',
    recipient: 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN',
    memo: 'First transfer',
  });

  console.log('Transaction ID:', response.txid);
}
```
{% endcode %}
{% endstep %}
{% endstepper %}
