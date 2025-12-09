# React Native Integration

Stacks.js can be integrated into React Native applications to bring blockchain functionality to mobile devices. This tutorial walks you through setting up a React Native project with Expo and configuring it to work with Stacks.js libraries.

## Objectives

* Set up an Expo project configured for Stacks.js
* Install and configure necessary polyfills for React Native
* Generate wallets and sign transactions in a mobile app
* Handle React Native's JavaScript environment limitations
* Build a working Stacks mobile application

## Prerequisites

* Node.js and npm installed on your development machine
* Basic knowledge of React Native and Expo
* Familiarity with Stacks.js concepts
* iOS or Android device or simulator for testing

## Set up the Expo project

Start by creating a new Expo project. The latest version of Expo provides the best compatibility with Stacks.js polyfills.

```bash
npx create-expo-app@latest my-stacks-app
cd my-stacks-app
```

The boilerplate project includes everything needed to start building. Test the initial setup by running the development server.

```bash
npm start
```

Connect your mobile device using the Expo Go app and scan the QR code to verify the base project works correctly.

## Install necessary dependencies

React Native's JavaScript environment lacks certain Node.js and browser APIs that Stacks.js requires. Install the core Stacks libraries along with necessary polyfills.

```bash
npm install @stacks/transactions @stacks/wallet-sdk
```

Install the polyfill dependencies as dev dependencies to handle missing APIs.

```bash
npm install --save-dev buffer process react-native-get-random-values \
  text-encoding readable-stream crypto-browserify @peculiar/webcrypto
```

These polyfills provide:

* `buffer` and `process` for Node.js globals
* `react-native-get-random-values` for crypto random values
* `text-encoding` for `TextEncoder` and `TextDecoder`
* `crypto-browserify` and `@peculiar/webcrypto` for cryptographic functions

## Configure Metro bundler

Metro bundler needs configuration to properly resolve Node.js modules. Create a custom Metro configuration file.

```bash
npx expo customize metro.config.js
```

Update `metro.config.js` to map Node.js modules to their React Native-compatible versions.

```ts
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  stream: require.resolve('readable-stream'),
  crypto: require.resolve('crypto-browserify'),
};

module.exports = config;
```

This configuration ensures that when Stacks.js requests Node.js modules, Metro provides the appropriate polyfills.

## Set up global polyfills

Create a polyfill system to make browser and Node.js APIs available in React Native. This requires modifying the app's entry point.

### Create the polyfill file

Create `polyfill.js` to initialize the required global objects.

```ts
import { Buffer } from 'buffer/';
import process from 'process';
import 'react-native-get-random-values';
import { TextDecoder, TextEncoder } from 'text-encoding';

global.process = process;
global.Buffer = Buffer;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
```

### Create a custom entry point

Create `index.js` so the app loads polyfills before the UI renders.

```ts
import './polyfill';
import { Crypto } from '@peculiar/webcrypto';

Object.assign(global.crypto, new Crypto());

import 'expo-router/entry';
```

{% hint style="warning" %}
Runtime initialization errors: Polyfills must be loaded in separate files as shown. Loading them in the same file can cause runtime initialization errors.
{% endhint %}

### Update package.json

Point the app to use the new entry point.

```json
{
  "main": "index.js"
}
```

## Implement Stacks functionality

With the environment configured, you can now use Stacks.js in your React Native components. Update the main screen to demonstrate wallet generation and transaction signing.

### Import Stacks.js modules

Edit `app/(tabs)/index.tsx` to import the necessary Stacks.js functions.

```ts
import {
  TransactionVersion,
  getAddressFromPrivateKey,
  makeSTXTokenTransfer,
} from '@stacks/transactions';
import { Wallet, generateSecretKey, generateWallet } from '@stacks/wallet-sdk';
import { useState } from 'react';
import { Button } from 'react-native';
```

### Set up component state

Create state variables to manage wallet data and user feedback.

```ts
export default function HomeScreen() {
  const [mnemonic, setMnemonic] = useState('Press button to generate');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [log, setLog] = useState('');

  // Component implementation continues...
}
```

### Generate a wallet and sign a transaction

Implement the core functionality to create a wallet and sign a transaction.

```ts
const generate = async () => {
  try {
    const mnemonic = generateSecretKey();
    setMnemonic(mnemonic);

    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: '',
    });
    setWallet(wallet);

    const txOptions = {
      amount: 1000,
      anchorMode: 'any' as const,
      recipient: 'SP3W993D3BRDYB284CY3SBFDEGTC5XEDJPDEA21CN',
      senderKey: wallet.accounts[0].stxPrivateKey,
      fee: 300,
      network: 'testnet' as const,
      nonce: 0,
    };

    const transaction = await makeSTXTokenTransfer(txOptions);
    setLog('Transaction signed successfully');
  } catch (error) {
    setLog(`Error: ${error.message}`);
  }
};
```

### Build the user interface

Show wallet information and trigger wallet generation from the UI.

```ts
return (
  <ThemedView style={{ padding: 20 }}>
    <ThemedText type="title">Stacks Wallet Demo</ThemedText>

    <ThemedView style={{ marginVertical: 20 }}>
      <ThemedText type="subtitle">Seed Phrase</ThemedText>
      <ThemedText style={{ marginBottom: 10 }}>{mnemonic}</ThemedText>
      <Button title="Generate New Wallet" onPress={generate} />
    </ThemedView>

    {wallet && (
      <ThemedView style={{ marginVertical: 20 }}>
        <ThemedText type="subtitle">Wallet Address</ThemedText>
        <ThemedText>
          {getAddressFromPrivateKey(
            wallet.accounts[0].stxPrivateKey,
            TransactionVersion.Testnet
          )}
        </ThemedText>
      </ThemedView>
    )}

    {log && (
      <ThemedView style={{ marginTop: 20 }}>
        <ThemedText type="subtitle">Status</ThemedText>
        <ThemedText>{log}</ThemedText>
      </ThemedView>
    )}
  </ThemedView>
);
```

## Test your implementation

Run the app to verify everything works correctly.

```bash
npm start
```

{% stepper %}
{% step %}
#### Generate new wallet

Press "Generate New Wallet". A new seed phrase appears.
{% endstep %}

{% step %}
#### Wallet address

After generation, the wallet address displays below.
{% endstep %}

{% step %}
#### Sign transaction

A transaction is signed (not broadcast) using the generated wallet.
{% endstep %}

{% step %}
#### Confirm success

A success message confirms signing.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Secure storage: For production apps, never display seed phrases directly. Use secure storage libraries such as `react-native-keychain` or `expo-secure-store`.
{% endhint %}

## Try it out

Extend the basic implementation with additional features.

```ts
// Challenge: Add a function to check STX balance
const checkBalance = async (address: string) => {
  // Implement balance checking
  // Hint: You'll need to use @stacks/blockchain-api-client
};

// Challenge: Implement transaction broadcasting
const broadcastTransaction = async (transaction: StacksTransaction) => {
  // Implement broadcasting logic
  // Remember to handle network selection
};
```
