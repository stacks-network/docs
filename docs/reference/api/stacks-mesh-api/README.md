# Stacks Mesh API

{% hint style="info" %}
For the complete OpenAPI spec, [here](https://raw.githubusercontent.com/stx-labs/stacks-mesh-api/refs/heads/master/packages/api/openapi.yaml).
{% endhint %}

A Mesh API (formerly Rosetta API) implementation for the Stacks network. It provides a standardized set of endpoints for reading blockchain data, constructing transactions, and interacting with smart contracts, all through a single JSON-RPC interface that communicates directly with a Stacks node.

<details>

<summary>Who is this API for?</summary>

Mesh (formerly branded as Rosetta) is an open standard originally developed by [Coinbase](https://github.com/coinbase/mesh-specifications) to provide a unified interface for reading data from blockchains. It defines a common set of endpoints that blockchain nodes implement, **allowing exchanges and other institutions** to write a single parser that works across multiple chains.

Rosetta/Mesh is primarily designed for self-hosted infrastructure (such as exchange backends) rather than as a publicly hosted API for general consumption.

**Relationship to the Hiro Stacks Blockchain API**

The Mesh API is not a replacement for the Hiro Stacks Blockchain API, which remains the recommended API for wallets, dApps, and general developers. Previously, the Hiro Stacks Blockchain API included an embedded Rosetta implementation, but this was removed due to inefficiency. The standalone Mesh API implementation replaces that prior integration.

</details>

### Features

* **Network status** -- query blockchain identity, sync status, connected peers, and supported operation types
* **Block and transaction data** -- retrieve full Nakamoto blocks with decoded operations (transfers, contract calls, PoX events, etc.)
* **Account balances** -- look up STX balances, nonces, and stacking lock status (including historical queries)
* **Transaction construction** -- offline-compatible flow for building, signing, and broadcasting STX transfers, contract calls, and contract deployments
* **Smart contract reads** -- call read-only functions, inspect ABIs, read source code, and query data vars and map entries
* **Mesh specification v1.5.1** compliant

### Limitations

* **Only Nakamoto blocks (Stacks 3.x+) are supported.** This API targets the Nakamoto consensus rules and does not handle legacy pre-Nakamoto block formats. Running it against a node that has not activated Nakamoto will produce errors or incomplete data.

### Requirements

* Node.js >= 24
* A running [Stacks node](https://github.com/stacks-network/stacks-core) with the RPC endpoint accessible

### Stacks node requirements

The Stacks node does not need any special configuration. A regular chain follower is sufficient. However, the node **must** have an `auth_token` configured under `[connection_options]` in its `Stacks.toml` config file:

```toml
[connection_options]
auth_token = "some-secret-token"
```

This token must match the `STACKS_CORE_RPC_AUTH_TOKEN` environment variable passed to the Mesh API (see below).

## Configuration

The API is configured via environment variables (a `.env` file is also supported):

| Variable                      | Default      | Description                                 |
| ----------------------------- | ------------ | ------------------------------------------- |
| `API_HOST`                    | `0.0.0.0`    | Address the HTTP server binds to            |
| `API_PORT`                    | `3000`       | Port the HTTP server listens on             |
| `STACKS_CORE_RPC_HOST`        | _(required)_ | Hostname of the Stacks node RPC             |
| `STACKS_CORE_RPC_PORT`        | `20443`      | Port of the Stacks node RPC                 |
| `STACKS_CORE_RPC_AUTH_TOKEN`  | _(required)_ | Auth token for the Stacks node RPC          |
| `STACKS_CORE_RPC_TIMEOUT_MS`  | `10000`      | RPC request timeout in milliseconds         |
| `TOKEN_METADATA_CACHE_SIZE`   | `1000`       | Max entries in the token metadata LRU cache |
| `TOKEN_METADATA_CACHE_TTL_MS` | `86400000`   | Token metadata cache TTL (default 24 h)     |
| `CONTRACT_ABI_CACHE_SIZE`     | `100`        | Max entries in the contract ABI LRU cache   |
| `CONTRACT_ABI_CACHE_TTL_MS`   | `86400000`   | Contract ABI cache TTL (default 24 h)       |

## Running locally

```bash
# Install dependencies
npm ci

# Build all packages
npm run build

# Start the API (production)
npm start

# Or start in watch mode (development)
npm run dev
```

Create a `.env` file in `packages/api/` (see `packages/api/.env.example`):

```env
STACKS_CORE_RPC_HOST=localhost
STACKS_CORE_RPC_PORT=20443
STACKS_CORE_RPC_AUTH_TOKEN=your-auth-token
```

## Running with Docker

{% hint style="info" %}
You don't need to build the docker image yourself, you can run the ones we push to the Stacks-Mesh-API repo [here](https://github.com/stx-labs/stacks-mesh-api/pkgs/container/stacks-mesh-api).
{% endhint %}

```bash
docker build -t stacks-mesh-api .

docker run -p 3000:3000 \
  -e STACKS_CORE_RPC_HOST=host.docker.internal \
  -e STACKS_CORE_RPC_PORT=20443 \
  -e STACKS_CORE_RPC_AUTH_TOKEN=your-auth-token \
  stacks-mesh-api
```

The API will be available at `http://localhost:3000`.

## API endpoints

All endpoints accept `POST` requests with a JSON body. Every request must include a `network_identifier`:

```json
{
  "network_identifier": { "blockchain": "stacks", "network": "mainnet" }
}
```

### Network

| Endpoint           | Description                                         |
| ------------------ | --------------------------------------------------- |
| `/network/list`    | List supported networks                             |
| `/network/status`  | Current block, sync status, and peers               |
| `/network/options` | Mesh spec version, supported operations, and errors |

### Data

| Endpoint             | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `/block`             | Get a block by hash or height                        |
| `/block/transaction` | Get a specific transaction within a block            |
| `/account/balance`   | Get STX balance, nonce, and lock info for an address |

### Construction

| Endpoint                   | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `/construction/derive`     | Derive an address from a public key                     |
| `/construction/preprocess` | Parse operations into construction options              |
| `/construction/metadata`   | Fetch nonce, balance, and suggested fee                 |
| `/construction/payloads`   | Build unsigned transaction and signing payloads         |
| `/construction/combine`    | Attach signatures to an unsigned transaction            |
| `/construction/parse`      | Decode a signed or unsigned transaction into operations |
| `/construction/hash`       | Compute the hash of a signed transaction                |
| `/construction/submit`     | Broadcast a signed transaction                          |

### Smart contract

| Endpoint | Description                                            |
| -------- | ------------------------------------------------------ |
| `/call`  | Read-only contract calls and contract metadata queries |

## Transaction construction

Transaction construction follows the standard Mesh offline flow:

```
preprocess ──> metadata ──> payloads ──> [sign offline] ──> combine ──> submit
```

The API supports three transaction types: **STX token transfers**, **contract calls**, and **contract deployments**.

### Example: STX token transfer

#### 1. Preprocess

Declare the transfer intent as a pair of operations (sender debits, recipient credits):

```bash
curl -s http://localhost:3000/construction/preprocess -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "testnet" },
  "operations": [
    {
      "operation_identifier": { "index": 0 },
      "type": "token_transfer",
      "account": { "address": "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6" },
      "amount": { "value": "-1000000", "currency": { "symbol": "STX", "decimals": 6 } },
      "metadata": { "memo": "hello" }
    },
    {
      "operation_identifier": { "index": 1 },
      "type": "token_transfer",
      "account": { "address": "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y" },
      "amount": { "value": "1000000", "currency": { "symbol": "STX", "decimals": 6 } },
      "metadata": { "memo": "hello" }
    }
  ]
}'
```

Returns `options` (construction parameters) and `required_public_keys`.

#### 2. Metadata

Fetch the sender's nonce, balance, and a suggested fee:

```bash
curl -s http://localhost:3000/construction/metadata -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "testnet" },
  "options": { "...options from preprocess..." },
  "public_keys": [
    { "hex_bytes": "YOUR_PUBLIC_KEY_HEX", "curve_type": "secp256k1" }
  ]
}'
```

Returns `metadata` and `suggested_fee`.

#### 3. Payloads

Build the unsigned transaction. Include a `fee` operation (negative amount from the sender) plus the original transfer operations:

```bash
curl -s http://localhost:3000/construction/payloads -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "testnet" },
  "operations": [
    {
      "operation_identifier": { "index": 0 },
      "type": "fee",
      "account": { "address": "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6" },
      "amount": { "value": "-200", "currency": { "symbol": "STX", "decimals": 6 } }
    },
    {
      "operation_identifier": { "index": 1 },
      "type": "token_transfer",
      "account": { "address": "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6" },
      "amount": { "value": "-1000000", "currency": { "symbol": "STX", "decimals": 6 } },
      "metadata": { "memo": "hello" }
    },
    {
      "operation_identifier": { "index": 2 },
      "type": "token_transfer",
      "account": { "address": "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y" },
      "amount": { "value": "1000000", "currency": { "symbol": "STX", "decimals": 6 } },
      "metadata": { "memo": "hello" }
    }
  ],
  "metadata": { "...metadata from previous step..." },
  "public_keys": [
    { "hex_bytes": "YOUR_PUBLIC_KEY_HEX", "curve_type": "secp256k1" }
  ]
}'
```

Returns `unsigned_transaction` (hex) and `payloads` (the signing payload with `ecdsa_recovery` signature type).

#### 4. Sign offline

Sign the payload hex bytes from the previous step using your private key (secp256k1, recoverable ECDSA). This step happens entirely offline.

#### 5. Combine

Attach the signature to the unsigned transaction:

```bash
curl -s http://localhost:3000/construction/combine -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "testnet" },
  "unsigned_transaction": "UNSIGNED_TX_HEX",
  "signatures": [
    {
      "signing_payload": { "...payload from step 3..." },
      "public_key": { "hex_bytes": "YOUR_PUBLIC_KEY_HEX", "curve_type": "secp256k1" },
      "signature_type": "ecdsa_recovery",
      "hex_bytes": "SIGNATURE_HEX"
    }
  ]
}'
```

Returns `signed_transaction` (hex).

#### 6. Submit

Broadcast the signed transaction to the network:

```bash
curl -s http://localhost:3000/construction/submit -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "testnet" },
  "signed_transaction": "SIGNED_TX_HEX"
}'
```

Returns `transaction_identifier` with the transaction hash.

### Example: contract call

The preprocess step for a contract call uses a single operation:

```bash
curl -s http://localhost:3000/construction/preprocess -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "testnet" },
  "operations": [
    {
      "operation_identifier": { "index": 0 },
      "type": "contract_call",
      "account": { "address": "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6" },
      "metadata": {
        "contract_identifier": "ST000000000000000000002AMW42H.pox-4",
        "function_name": "stack-stx",
        "args": [
          "0x0100000000000000000000000005f5e100",
          "0x0c00000002096861736862797465730200000014b1c0e25ed2ed6e8b2a09adde1b974bea2c92ec050b76657273696f6e020000000100",
          "0x0100000000000000000000000000000064",
          "0x010000000000000000000000000000000c"
        ]
      }
    }
  ]
}'
```

Function arguments are hex-encoded Clarity values. The rest of the flow (metadata, payloads, sign, combine, submit) is identical to the token transfer example.

## Read-only contract calls

The `/call` endpoint supports several methods for interacting with smart contracts without broadcasting a transaction.

### Call a read-only function

```bash
curl -s http://localhost:3000/call -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "mainnet" },
  "method": "contract_call_read_only",
  "parameters": {
    "deployer_address": "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    "contract_name": "age000-governance-token",
    "function_name": "get-balance",
    "sender": "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    "arguments": ["0x0516a654a8dfa3ec004870690aca959868fbc4883402"]
  }
}'
```

Returns a decoded Clarity value:

```json
{
  "idempotent": false,
  "result": {
    "hex": "0x0700000000000000000000000005f5e100",
    "repr": "(ok u100000000)",
    "type": "ResponseOk(uint)"
  }
}
```

### Get a contract's ABI

```bash
curl -s http://localhost:3000/call -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "mainnet" },
  "method": "contract_get_interface",
  "parameters": {
    "deployer_address": "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    "contract_name": "age000-governance-token"
  }
}'
```

### Get a contract's source code

```bash
curl -s http://localhost:3000/call -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "mainnet" },
  "method": "contract_get_source",
  "parameters": {
    "deployer_address": "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    "contract_name": "age000-governance-token"
  }
}'
```

### Read a data variable

```bash
curl -s http://localhost:3000/call -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "mainnet" },
  "method": "contract_get_data_var",
  "parameters": {
    "deployer_address": "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    "contract_name": "age000-governance-token",
    "var_name": "token-uri"
  }
}'
```

### Read a map entry

```bash
curl -s http://localhost:3000/call -H 'Content-Type: application/json' -d '{
  "network_identifier": { "blockchain": "stacks", "network": "mainnet" },
  "method": "contract_get_map_entry",
  "parameters": {
    "deployer_address": "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    "contract_name": "age000-governance-token",
    "map_name": "token-balances",
    "key": "0x0516a654a8dfa3ec004870690aca959868fbc4883402"
  }
}'
```

### Supported `/call` methods

| Method                      | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| `contract_call_read_only`   | Invoke a read-only contract function                      |
| `contract_get_interface`    | Get the contract ABI (functions, variables, maps, tokens) |
| `contract_get_source`       | Get the contract Clarity source code                      |
| `contract_get_constant_val` | Get the value of a defined constant                       |
| `contract_get_data_var`     | Read a `define-data-var` variable                         |
| `contract_get_map_entry`    | Look up a `define-map` entry by key                       |

## Operation types

The API recognizes the following operation types when serializing block data:

`coinbase`, `fee`, `token_transfer`, `token_mint`, `token_burn`, `contract_call`, `contract_deploy`, `tenure_change`, `poison_microblock`, `stx_lock`, `contract_log`, `handle-unlock`, `stack-stx`, `stack-increase`, `stack-extend`, `delegate-stx`, `delegate-stack-stx`, `delegate-stack-increase`, `delegate-stack-extend`, `stack-aggregation-commit`, `stack-aggregation-commit-indexed`, `stack-aggregation-increase`, `revoke-delegate-stx`

## Testing

```bash
# Run API unit/integration tests
npm run test:api -w @stacks/mesh-api

# Run construction end-to-end tests (requires Docker)
npm run test:construction -w @stacks/mesh-api
```

The construction tests spin up a Stacks node in Docker and run the full transaction lifecycle against it using the [mesh-cli](https://github.com/coinbase/mesh-cli) (Rosetta CLI) validator.

***

### Additional Resources

* \[[Github](https://github.com/stx-labs/stacks-mesh-api)] Stacks Mesh API
