---
description: Understand the architecture of the Stacks Blockchain API.
---

# Architecture

![Stacks Blockchain API architecture](../../.gitbook/assets/stacks-blockchain-api-architecture.svg)

## RPC Endpoints

The `stacks-node` has its own minimal set of http endpoints referred to as `RPC endpoints`.

- The `stacks-blockchain-api` allows clients to access RPC endpoints by proxying requests to a load-balanced pool of `stacks-nodes`.
- For more details on RPC endpoints, see: [RPC Endpoints Documentation](https://github.com/stacks-network/stacks-core/blob/master/docs/rpc-endpoints.md)
- Common RPC endpoints include:
  - `POST /v2/transactions` - Broadcast a transaction
  - `GET /v2/pox` - Retrieve current Proof of Transfer (PoX) relevant information
  - `POST /v2/contracts/call-read/<contract>/<function>` - Evaluate and return the result of calling a Clarity function
  - `POST /v2/fees/transaction` - Evaluate a given transaction and provide transaction fee estimation data
  - `GET /v2/accounts/<address>` - Fetch the current nonce required for creating transactions

## Additional Endpoints

The Stacks Blockchain API implements additional endpoints that provide data unavailable directly from Stacks nodes due to various constraints.

- The `stacks-node` may not persist certain data or may not serve it efficiently to many clients. For instance, while it can return the current STX balance of an account, it cannot provide a history of account transactions.
- The API implements the [Mesh](https://github.com/coinbase/mesh-specifications) specification (formerly Rosetta) by Coinbase, an open standard designed to simplify blockchain deployment and interaction.
- The API includes support for the Blockchain Naming System (BNS) endpoints.
- For Express.js routes, see [`/src/api/routes`](https://github.com/hirosystems/stacks-blockchain-api/tree/master/src/api/routes) in the API repo.

The API creates an "event observer" http server which listens for events from a stacks-node "event emitter".

Events are HTTP POST requests containing:
  - Blocks
  - Transactions

Byproducts of executed transactions such as:
  - Asset transfers
  - Smart-contract log data
  - Execution cost data

The API processes and stores these events as relational data in PostgreSQL. For the "event observer" code, see [`/src/event-stream`](https://github.com/hirosystems/stacks-blockchain-api/tree/master/src/event-stream) in the API repo.

## OpenAPI and JSON Schema

All http endpoints and responses are defined in OpenAPI and JSON Schema.

- See [`/docs/openapi.yaml`](https://github.com/hirosystems/stacks-blockchain-api/blob/master/docs/openapi.yaml) in the API repo
- These are used to auto-generate the docs at https://hirosystems.github.io/stacks-blockchain-api/
- JSON Schemas are converted into TypeScript interfaces, which are used internally by the db controller module to transform SQL query results into the correct object shapes.
- OpenAPI and JSON Schemas are also used to generate a standalone `@stacks/blockchain-api-client`.

## Development Setup

The easiest/quickest way to develop in this repo is using the VS Code debugger. It uses docker-compose to set up a stacks-node and Postgres instance.

Alternatively, you can run `npm run dev:integrated` which does the same thing but without a debugger.
