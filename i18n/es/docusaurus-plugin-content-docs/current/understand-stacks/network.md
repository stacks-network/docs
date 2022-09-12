---
title: Red
description: Guía de la red Stacks 2.0
sidebar_position: 7
---

## Tokens

Los tokens de Stacks (STX) son los tokens nativos en la blockchain Stacks 2.0. La fracción más pequeña es un micro-STX. 1,000,000 micro-STX hacen un Stack (STX).

Los montos de STX deben almacenarse como enteros (8 bytes de longitud), y representados en montos de micro-STX. Para propósitos de visualización, el micro-STX se divide entre 1,000,00 (precisión decimal de 6).

## Comisiones

Las comisiones se utilizan para compensar a los mineros por confirmar las transacciones en la blockchain Stacks 2.0. La comisión se calcula en base a la tasa estimada de comisión y al tamaño de la transacción en peso bruto en bytes. La tasa de comisión es una variable determinada por el mercado. Para la [testnet](testnet)se establece en 1 micro-STX.

Las estimaciones de comisiones pueden obtenerse a través del endpoint [`GET /v2/fees/transfer`](https://docs.hiro.so/api#operation/get_fee_transfer):

```bash
# para mainnet, reemplazar `testnet` por `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/v2/fees/transfer'
```

La API responderá con la tasa de comisión (como entero):

```json
1
```

[La librería Stacks JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) soporta estimación de comisiones para:

- transferencias de token (`estimateTransfer`)
- publicación de contrato (`estimateContractDeploy`)
- llamadas a contrato sin solo-lectura (`estimateContractFunctionCall`)

:::tip For an implementation using a different language than JavaScript, please review [this reference implementation](https://github.com/hirosystems/stacks.js/blob/master/packages/transactions/src/builders.ts#L97). :::

## Nonces

Cada cuenta lleva una [propiedad nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) que indica el número de transacciones procesadas para la cuenta dada. Las nonces son códigos de un solo uso, comenzando en `0` para cuentas nuevas e incrementado en 1 en cada transacción.

Los onces se añaden a todas las transacciones y ayudan a identificarlas con el fin de asegurar que las transacciones se procesan en orden y para evitar un proceso duplicado.

:::tip
El mecanismo de consenso también asegura que las transacciones no sean "repetidas" de dos maneras. En primer lugar, los nodos consultan las transacciones no gastadas (UTXOs) en orden de satisfacer sus condiciones de gasto en una nueva transacción. En segundo lugar, mensajes son enviados entre nodos para revisar la secuencia de números.
:::

Cuando se construye una nueva transacción de transferencia de tokens, se debe obtener y establecer el nonce más reciente de la cuenta.

:::tip La API proporciona un endpoint para [simplificar el manejo de nonce](https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling). :::

## Confirmaciones

La red Stacks 2.0 está anclada a la red bitcoin. Esto permite que las transacciones en Stacks hereden la misma finalidad y seguridad de la blockchain de Bitcoin.

El tiempo para minar un bloque, para confirmar las transacciones, eventualmente coincidirá con el "tiempo de bloque" esperado de la red bitcoin: 10 minutos.

:::tip Las transacciones también se pueden ser minadas en [microbloques](microblocks), reduciendo la latencia significativamente. :::

El tiempo del bloque está codificado y cambiará a lo largo de las fases de implementación de la [red de pruebas](testnet). El tiempo actual del bloque se puede obtener a través del endpoint [`GET /extended/v1/info/network_block_times`](https://docs.hiro.so/api#operation/get_network_block_times):

```bash
# para mainnet, reemplazar `testnet` por `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/info/network_block_times'
```

La API responderá con el tiempo del bloque (en segundos):

```js
{
    "testnet": {
        "target_block_time": 120
    },
    "mainnet": {
        "target_block_time": 600
    }
}
```

## Llamadas a funciones de solo-lectura

Los contratos inteligentes pueden exponer las llamadas a funciones públicas. Para las funciones que hacen modificaciones de estado a la blockchain, las transacciones deben ser generadas y transmitidas.

Sin embargo, para llamadas de solo-lectura, las transacciones **no son** requeridas. En su lugar, estas llamadas se pueden hacer utilizando la [API de Stacks Blockchain](https://docs.hiro.so/get-started/stacks-blockchain-api).

:::caution Llamadas de contratos solo-lectura no requieren transacciones:::

Se puede hacer una llamada de solo-lectura utilizando el endpoint [`POST /v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>`](https://docs.hiro.so/api#operation/call_read_only_function):

```bash
# para mainnet, reemplazar `testnet` por `mainnet`
curl --location --request POST 'https://stacks-node-api.testnet.stacks. o/v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "sender":<stx_address>.<contract_name>",
  "arguments": [<clarity_value>,
}'
```

Ejemplo de respuesta para una llamada exitosa:

```js
{
  "okay": true,
  "result": "<clarity_value>"
}
```

:::tip Para establecer los argumentos de llamada a la función y leer el resultado, [Los valores de Claridad](../write-smart-contracts/values) necesitan ser serializados en una cadena hexadecimal. La librería [Stacks Transactions JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) soporta estas operaciones :::

## Consultas

Los detalles de la red de Stacks 2.0 pueden ser consultados usando la [API de Stacks Blockchain](https://docs.hiro.so/get-started/stacks-blockchain-api).

### Comprobación de estado

El [comprobador de estado](https://stacks-status.com/) es un servicio que proporciona una interfaz de usuario para revisar rápidamente la salud de la blockchain de Stacks 2.0.

### Información de la red

La información de la red se puede obtener usando el endpoint [`GET /v2/info`](https://docs.hiro.so/api#operation/get_core_api_info):

```bash
# para mainnet, reemplazar `testnet` por `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/v2/info'
```

Ejemplo de respuesta:

```js
{
    "peer_version": 385875968,
    "burn_consensus": "826401d65cf3671210a3fb135d827d549c0b4d37",
    "burn_block_height": 1972,
    "stable_burn_consensus": "e27ea23f199076bc41a729d76a813e125b725f64",
    "stable_burn_block_height": 1971,
    "server_version": "blockstack-core 0.0.1 => 23.0.0.0 (master:bdd042242+, release build, linux [x86_64]",
    "network_id": 2147483648,
    "parent_network_id": 3669344250,
    "stacks_tip_height": 933,
    "stacks_tip": "1f601823fbcc5b6b2215b2ff59d2818fba61ee4a3cea426d8bc3dbb268005d8f",
    "stacks_tip_burn_block": "54c56a9685545c45accf42b5dcb2787c97eda8185a1c794daf9b5a59d4807abc",
    "unanchored_tip": "71948ee211dac3b241eb65d881637f649d0d49ac08ee4a41c29217d3026d7aae",
    "exit_at_block_height": 28160
}
```
