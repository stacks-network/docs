# sbtc

Build and manage sBTC deposits and withdrawals on Bitcoin and Stacks.

The `sbtc` package provides functions for creating sBTC deposits on Bitcoin and interacting with the sBTC protocol across Bitcoin and Stacks networks.

## Installation

```bash
npm install sbtc
```

## Deposit functions

### buildSbtcDepositAddress

`buildSbtcDepositAddress` creates a Bitcoin address for sBTC deposits with embedded metadata.

Signature

```ts
function buildSbtcDepositAddress(options: DepositAddressOptions): DepositAddress
```

Parameters

| Name               | Type             | Required | Description                                    |
| ------------------ | ---------------- | -------- | ---------------------------------------------- |
| `stacksAddress`    | `string`         | Yes      | Stacks address to receive sBTC                 |
| `signersPublicKey` | `string`         | Yes      | Aggregated public key of signers               |
| `maxSignerFee`     | `number`         | No       | Maximum fee for signers (default: 80,000 sats) |
| `reclaimLockTime`  | `number`         | No       | Lock time for reclaim script (default: 6,000)  |
| `network`          | `BitcoinNetwork` | No       | Bitcoin network to use (default: MAINNET)      |

Example

```ts
import { buildSbtcDepositAddress, SbtcApiClientMainnet } from 'sbtc';

const client = new SbtcApiClientMainnet();

// Build deposit address
const deposit = buildSbtcDepositAddress({
  stacksAddress: 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159',
  signersPublicKey: await client.fetchSignersPublicKey(),
  maxSignerFee: 80_000, // Fee taken from deposit amount
  reclaimLockTime: 6_000
});

// Send BTC to deposit.address using any Bitcoin wallet
const txid = await wallet.sendTransfer({
  recipient: deposit.address,
  amount: 1_000_000 // 0.01 BTC
});

// Notify signers about the deposit
await client.notifySbtc({ txid, ...deposit });
```

### buildSbtcDepositTx

`buildSbtcDepositTx` creates a complete Bitcoin transaction for sBTC deposits.

Signature

```ts
function buildSbtcDepositTx(options: DepositTxOptions): DepositTransaction
```

Parameters

| Name               | Type               | Required | Description                                    |
| ------------------ | ------------------ | -------- | ---------------------------------------------- |
| `amountSats`       | `number \| bigint` | Yes      | Amount to deposit in satoshis                  |
| `stacksAddress`    | `string`           | Yes      | Stacks address to receive sBTC                 |
| `signersPublicKey` | `string`           | Yes      | Aggregated public key of signers               |
| `maxSignerFee`     | `number`           | No       | Maximum fee for signers (default: 80,000 sats) |
| `reclaimLockTime`  | `number`           | No       | Lock time for reclaim (default: 144)           |
| `network`          | `BitcoinNetwork`   | No       | Bitcoin network to use                         |

Example

```ts
import { buildSbtcDepositTx, SbtcApiClientMainnet } from 'sbtc';

const client = new SbtcApiClientMainnet();

// Build deposit transaction
const deposit = buildSbtcDepositTx({
  amountSats: 100_000,
  stacksAddress: 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159',
  signersPublicKey: await client.fetchSignersPublicKey()
});

// Sign transaction
deposit.transaction.sign(privateKey);
deposit.transaction.finalize();

// Broadcast and notify
const txid = await client.broadcastTx(deposit.transaction);
await client.notifySbtc(deposit);
```

### sbtcDepositHelper

`sbtcDepositHelper` creates a fully-formed deposit transaction from UTXOs.

Signature

```ts
function sbtcDepositHelper(options: DepositHelperOptions): Promise<DepositTransaction>
```

Parameters

| Name                   | Type               | Required | Description                          |
| ---------------------- | ------------------ | -------- | ------------------------------------ |
| `amountSats`           | `number \| bigint` | Yes      | Amount to deposit in satoshis        |
| `stacksAddress`        | `string`           | Yes      | Stacks address to receive sBTC       |
| `signersPublicKey`     | `string`           | Yes      | Aggregated public key of signers     |
| `feeRate`              | `number`           | Yes      | Fee rate in sat/vbyte                |
| `utxos`                | `UtxoWithTx[]`     | Yes      | UTXOs to fund the transaction        |
| `bitcoinChangeAddress` | `string`           | Yes      | Address for change output            |
| `reclaimPublicKey`     | `string`           | No       | Public key for reclaiming deposits   |
| `reclaimLockTime`      | `number`           | No       | Lock time for reclaim (default: 144) |
| `maxSignerFee`         | `number`           | No       | Maximum signer fee (default: 80,000) |
| `network`              | `BitcoinNetwork`   | No       | Bitcoin network (default: MAINNET)   |

Example

```ts
import { sbtcDepositHelper, SbtcApiClientMainnet } from 'sbtc';

const client = new SbtcApiClientMainnet();
const btcAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';

// Create complete deposit transaction
const deposit = await sbtcDepositHelper({
  amountSats: 1_000_000,
  stacksAddress: 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159',
  signersPublicKey: await client.fetchSignersPublicKey(),
  feeRate: await client.fetchFeeRate('medium'),
  utxos: await client.fetchUtxos(btcAddress),
  bitcoinChangeAddress: btcAddress
});

// Sign and broadcast
deposit.transaction.sign(privateKey);
deposit.transaction.finalize();

const txid = await client.broadcastTx(deposit.transaction);
await client.notifySbtc(deposit);
```

## API clients

### SbtcApiClientMainnet

`SbtcApiClientMainnet` provides mainnet API access for sBTC operations.

```ts
import { SbtcApiClientMainnet } from 'sbtc';

const client = new SbtcApiClientMainnet();
```

### SbtcApiClientTestnet

`SbtcApiClientTestnet` provides testnet API access for sBTC operations.

```ts
import { SbtcApiClientTestnet } from 'sbtc';

const client = new SbtcApiClientTestnet();
```

### SbtcApiClientDevenv

`SbtcApiClientDevenv` provides local development API access.

```ts
import { SbtcApiClientDevenv } from 'sbtc';

const client = new SbtcApiClientDevenv();
```

## Client methods

### fetchSignersPublicKey

`fetchSignersPublicKey` retrieves the aggregated public key of sBTC signers.

```ts
const publicKey = await client.fetchSignersPublicKey();
// '02abc123...' (32-byte hex string)
```

### fetchSignersAddress

`fetchSignersAddress` retrieves the Bitcoin address of sBTC signers.

```ts
const address = await client.fetchSignersAddress();
// 'bc1p...' (p2tr address)
```

### fetchFeeRate

`fetchFeeRate` retrieves current Bitcoin network fee rates.

```ts
const feeRate = await client.fetchFeeRate('medium');
// 15 (sat/vbyte)

// Also supports 'low' and 'high'
const lowFee = await client.fetchFeeRate('low');
const highFee = await client.fetchFeeRate('high');
```

### fetchUtxos

`fetchUtxos` retrieves unspent transaction outputs for a Bitcoin address.

```ts
const utxos = await client.fetchUtxos('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');
// Array of UTXOs with transaction data
```

### broadcastTx

`broadcastTx` broadcasts a Bitcoin transaction to the network.

```ts
const txid = await client.broadcastTx(transaction);
// '0x1234abcd...'
```

### notifySbtc

`notifySbtc` notifies the sBTC API about a deposit transaction.

```ts
const response = await client.notifySbtc({
  txid,
  stacksAddress,
  reclaimScript,
  depositScript
});
// { status: 200, statusMessage: 'OK' }
```

### fetchSbtcBalance

`fetchSbtcBalance` retrieves the sBTC balance for a Stacks address.

```ts
const balance = await client.fetchSbtcBalance('SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159');
// 1000000n (in micro-sBTC)
```

## Configuration

### Client configuration options

| Name           | Type     | Description               |
| -------------- | -------- | ------------------------- |
| `sbtcContract` | `string` | sBTC contract address     |
| `sbtcApiUrl`   | `string` | sBTC API (Emily) base URL |
| `btcApiUrl`    | `string` | Bitcoin API base URL      |
| `stxApiUrl`    | `string` | Stacks API base URL       |

### Custom client configuration

```ts
import { SbtcApiClient } from 'sbtc';

const client = new SbtcApiClient({
  sbtcContract: 'SP000000000000000000002Q6VF78.sbtc',
  sbtcApiUrl: 'https://api.sbtc.tech',
  btcApiUrl: 'https://mempool.space/api',
  stxApiUrl: 'https://api.mainnet.hiro.so'
});
```

## Complete deposit example

```ts
import { sbtcDepositHelper, SbtcApiClientMainnet } from 'sbtc';

async function depositBtcForSbtc() {
  const client = new SbtcApiClientMainnet();
  const btcAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
  const stxAddress = 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159';

  // 1. Create deposit transaction
  const deposit = await sbtcDepositHelper({
    amountSats: 100_000,
    stacksAddress: stxAddress,
    signersPublicKey: await client.fetchSignersPublicKey(),
    feeRate: await client.fetchFeeRate('medium'),
    utxos: await client.fetchUtxos(btcAddress),
    bitcoinChangeAddress: btcAddress
  });

  // 2. Sign transaction
  deposit.transaction.sign(privateKey);
  deposit.transaction.finalize();

  // 3. Broadcast to Bitcoin network
  const txid = await client.broadcastTx(deposit.transaction);
  console.log('Bitcoin transaction:', txid);

  // 4. Notify sBTC signers
  await client.notifySbtc(deposit);
  console.log('Deposit submitted successfully');

  // 5. Check sBTC balance (after confirmation)
  const balance = await client.fetchSbtcBalance(stxAddress);
  console.log('sBTC balance:', balance);
}
```
