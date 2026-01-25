# Module 29: Bitcoin Logic - Constructing & Signing PSBTs

**Author:** @jadonamite
**Difficulty:** Advanced
**Time:** 25 Minutes

A **PSBT (Partially Signed Bitcoin Transaction)** is the standard format for passing Bitcoin transactions between applications and wallets.

If your Stacks dApp needs to:

1. Trigger a Catamaran Swap payment (BTC -> Seller).
2. Initiate an sBTC Deposit (BTC -> Gatekeeper).
3. Transfer an Ordinal.

You cannot "just send" the transaction. You must **construct** the transaction logic in your app (Inputs, Outputs, Scripts) and then ask the user's wallet (Leather, Xverse) to **sign** it.

This module teaches you how to build a PSBT using `bitcoinjs-lib` and prompt a signature using `@stacks/connect`.

## 1. Prerequisites

You need a few specialized libraries. Stacks.js handles the *connection*, but `bitcoinjs-lib` handles the *construction*.

```bash
npm install bitcoinjs-lib tiny-secp256k1 @stacks/connect

```

## 2. The Architecture

1. **Fetch UTXOs:** Your app queries an API (Hiro/Mempool.space) to find the user's unspent BTC.
2. **Build PSBT:** You define "Input A goes to Output B".
3. **Request Sign:** Call `showConnect` / `requestSignPsbt`.
4. **Broadcast:** Once signed, your app pushes the hex to the Bitcoin network.

## 3. The Implementation

We will build a React component that sends 1000 sats to a specific address.

**File:** `components/BitcoinTransaction.tsx`

```tsx
import { useState } from 'react';
import * as btc from 'bitcoinjs-lib';
import { showConnect, UserSession } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

// Verify ECC libraries for bitcoinjs
import * as ecc from 'tiny-secp256k1';
btc.initEccLib(ecc);

export const BitcoinSender = ({ userSession }: { userSession: UserSession }) => {
  const [txId, setTxId] = useState('');

  const handleSendBtc = async () => {
    // 1. Configuration
    const network = btc.networks.testnet; // or bitcoin (mainnet)
    const recipient = "tb1q..."; // The destination address
    const amount = 1000n; // 1000 sats
    
    // User's Wallet Info (from Stacks Connect auth)
    const userData = userSession.loadUserData();
    // Note: In real apps, you need the user's distinct Bitcoin Public Key
    // derived from their Stacks wallet connection.
    const userBtcAddress = userData.profile.btcAddress.p2wpkh.testnet; 
    const userBtcPublicKey = userData.profile.btcPublicKey.p2wpkh.testnet;

    // 2. Fetch UTXOs (Unspent Transaction Outputs)
    // You MUST find money to spend.
    const response = await fetch(`https://api.nakamoto.testnet.hiro.so/bitcoin/v3/address/${userBtcAddress}/utxo`);
    const utxos = await response.json();

    if (utxos.length === 0) {
      alert("No Bitcoin funds found!");
      return;
    }

    // 3. Construct the PSBT
    const psbt = new btc.Psbt({ network });

    // Add Input (The money we are spending)
    // Ideally, use a coin selection algorithm. Here we just take the first UTXO.
    const input = utxos[0];
    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      witnessUtxo: {
        script: btc.address.toOutputScript(userBtcAddress, network),
        value: Number(input.value), // careful with precision
      },
    });

    // Add Output (Where it's going)
    psbt.addOutput({
      address: recipient,
      value: Number(amount),
    });

    // Add Change Output (Return the rest to sender)
    const change = Number(input.value) - Number(amount) - 500; // 500 sats fee (simplified)
    psbt.addOutput({
      address: userBtcAddress,
      value: change,
    });

    // 4. Request Signature via Stacks Connect
    // This pops up the Leather/Xverse wallet
    showConnect({
      appDetails: {
        name: 'My Stacks App',
        icon: 'https://example.com/icon.png',
      },
      userSession,
      checkOps: async () => {
        // Use the dedicated Bitcoin signing request
        // This is distinct from 'openSTXTransfer'
        const requestParams = {
          hex: psbt.toHex(),
          network: 'testnet', // 'mainnet' or 'testnet'
          broadcast: true, // Wallet will broadcast automatically
          onFinish: (data: any) => {
            console.log('Transaction Broadcasted!', data.txId);
            setTxId(data.txId);
          },
          onCancel: () => {
            console.log('User cancelled');
          },
        };
        
        // Dynamic import or window object usage depending on wallet standard
        // For Stacks Connect v7+:
        await (window as any).btc.request('signPsbt', requestParams);
      },
    });
  };

  return (
    <button onClick={handleSendBtc}>
      Send Bitcoin (via PSBT)
    </button>
  );
};

```

## 4. Nuance: `witnessUtxo` vs `nonWitnessUtxo`

* **Segwit (P2WPKH / P2TR):** You must provide `witnessUtxo` (Script + Value). This is standard for modern Stacks wallets.
* **Legacy (P2PKH):** You must provide `nonWitnessUtxo` (The FULL raw hex of the previous transaction).

If you get "Missing Input Data" errors, check if you are providing the correct UTXO data for the address type.

## 5. Broadcasting

In the code above, we set `broadcast: true`. This tells the Wallet (e.g., Xverse) to push the transaction to the mempool immediately after signing.
If you set `broadcast: false`, the callback provides the `hex` of the signed transaction. You can then:

1. Upload it to a Stacks Contract (for verification).
2. Broadcast it later via your own backend.

## 6. Summary Checklist

* [ ] **UTXO Fetch:** Are you filtering for confirmed UTXOs to prevent double-spends?
* **Fee Calculation:** Are you calculating change (`Input - Output - Fee`) correctly? Bitcoin txs will fail if `In < Out`.
* **Network Match:** Does the PSBT network (Testnet) match the Wallet's active network?

---
