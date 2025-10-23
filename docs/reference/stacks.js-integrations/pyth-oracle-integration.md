# Pyth Oracle Integration

This guide shows how to integrate Pyth Network price feeds into a frontend application with Stacks.js.

## Objectives

* Install and configure the Pyth SDK
* Fetch VAA messages from the Hermes API
* Build transactions that include oracle data
* Add post-conditions that account for oracle fees

## Prerequisites

* A React or Node.js application with Stacks.js installed
* Understanding of [Pyth oracle contracts](pyth-oracle-integration.md#)

## Quickstart

{% stepper %}
{% step %}
### Install dependencies

Install the Pyth SDK alongside your existing Stacks.js packages.

```bash
npm install @pythnetwork/price-service-client buffer
```

`buffer` enables data format conversion in browser environments.
{% endstep %}

{% step %}
### Set up the Pyth client

Create a service that fetches Pyth price feed updates.

```ts
// services/pyth.ts
import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import { Buffer } from 'buffer';

// Price feed IDs
export const PRICE_FEEDS = {
  BTC_USD: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  STX_USD: '0xec7a775f46379b5e943c3526b1c8d54cd49749176b0b98e02dde68d1bd335c17',
  ETH_USD: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  USDC_USD: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
};

const pythClient = new PriceServiceConnection('https://hermes.pyth.network', {
  priceFeedRequestConfig: {
    binary: true,
  },
});

export async function fetchPriceUpdateVAA(priceFeedId: string): Promise<string> {
  try {
    const vaas = await pythClient.getLatestVaas([priceFeedId]);

    if (!vaas || vaas.length === 0) {
      throw new Error('No VAA data received');
    }

    const messageBuffer = Buffer.from(vaas[0], 'base64');
    const hexString = messageBuffer.toString('hex');

    return `0x${hexString}`;
  } catch (error) {
    console.error('Failed to fetch price VAA:', error);
    throw error;
  }
}
```
{% endstep %}

{% step %}
### Build oracle-enabled transactions

Use fresh price data inside a contract call.

```ts
// components/PythTransaction.tsx
import { request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';
import { fetchPriceUpdateVAA, PRICE_FEEDS } from '../services/pyth';
import { useState } from 'react';

export function MintWithOraclePrice() {
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    setLoading(true);
    try {
      const priceVAA = await fetchPriceUpdateVAA(PRICE_FEEDS.BTC_USD);
      const vaaBuffer = Cl.bufferFromHex(priceVAA.slice(2));

      const response = await request('stx_callContract', {
        contract: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.benjamin-club',
        functionName: 'mint-for-hundred-dollars',
        functionArgs: [vaaBuffer],
        postConditionMode: 'deny',
        network: 'mainnet',
      });

      console.log('Transaction submitted:', response.txid);
      alert(`NFT minted! Transaction ID: ${response.txid}`);
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Failed to mint NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleMint} disabled={loading}>
      {loading ? 'Processing...' : 'Mint NFT for $100'}
    </button>
  );
}
```
{% endstep %}

{% step %}
### Add post-conditions for oracle fees

Include post-conditions that reflect oracle fees and token transfers.

```ts
// components/MintWithPostConditions.tsx
import { request } from '@stacks/connect';
import { Cl, Pc } from '@stacks/transactions';
import { fetchPriceUpdateVAA, PRICE_FEEDS } from '../services/pyth';

export function MintWithPostConditions() {
  const handleMint = async () => {
    const userAddress = 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R';

    const postConditions = [
      Pc.principal(userAddress).willSendLte(1).ustx(),
      Pc.principal(userAddress)
        .willSendEq(100000)
        .ft('SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sbtc-token', 'sbtc'),
    ];

    try {
      const priceVAA = await fetchPriceUpdateVAA(PRICE_FEEDS.BTC_USD);

      const response = await request('stx_callContract', {
        contract: `${userAddress}.benjamin-club`,
        functionName: 'mint-for-hundred-dollars',
        functionArgs: [Cl.bufferFromHex(priceVAA.slice(2))],
        postConditions,
        postConditionMode: 'deny',
        network: 'mainnet',
      });

      console.log('Transaction successful:', response.txid);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return <button onClick={handleMint}>Mint with Post-Conditions</button>;
}
```
{% endstep %}
{% endstepper %}

