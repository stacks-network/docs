---
title: Transacciones
description: Guía de transacciones Stacks 2.0
sidebar_position: 6
---

## Introducción

Las transacciones son la unidad fundamental de la ejecución en el blockchain de Stacks. Cada transacción se origina a partir de una [Cuenta Stacks 2.0](accounts), y se mantiene en el historial de la blockchain de Stacks para la eternidad. Esta guía te ayuda a entender las transacciones de Stacks 2.0.

## Ciclo de vida

Las transacciones pasan por fases antes de ser finalmente confirmadas, y disponibles para todos, en la red Stacks 2.0.

![Transaction lifecycle](/img/tx-lifecycle.png)

- **Generar**: Las transacciones se ensamblan según la especificación de la codificación.
- **Validar y firmar**: Las transacciones son validadas para confirmar que están bien formadas. Las firmas requeridas son llenadas.
- **Broadcast**: Las transacciones son enviadas a un nodo.
- **Registrar**: Un minero recibe transacciones, verifica y las agrega al ["mempool,"](https://academy.binance.com/en/glossary/mempool) un área de retención para todas las transacciones pendientes.
- **Procesar**: Los mineros revisan el mempool y seleccionan las transacciones para el siguiente bloque a ser extraído. Dependiendo del tipo de transacción, pueden ocurrir diferentes acciones durante este paso. Por ejemplo, se podrían verificar las condiciones posteriores para una transferencia de tokens, se podrían acuñar tokens definidos por contrato inteligente, o se podría intentar llamar a un método de contrato inteligente existente.
- **Confirma**: Los mineros minan con éxito bloques con un conjunto de transacciones. Las transacciones dentro de la red se propagan con éxito.

:::note Una transacción puede tener uno de tres estados una vez registrado: `pending`, `success`, o `failed`. :::

## Tipos

Stacks 2.0 soporta un conjunto de diferentes tipos de transacción:

| **Tipo**          | **Valor**           | **Descripción**                                                                                                                                                                                                               |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Coinbase          | `coinbase`          | La primera transacción en un nuevo bloque (una entidad que contiene varias transacciones). Utilizado para registrar las recompensas del bloque. No se generan y transmiten de forma manual como otros tipos de transacciones. |
| Token transfer    | `token_transfer`    | Transferencia de asset de un remitente a un destinatario                                                                                                                                                                      |
| Contract deploy   | `smart_contract`    | Instanciación del contrato                                                                                                                                                                                                    |
| Contract call     | `contract_call`     | Llamada de contrato para una función pública que no sea de solo-lectura                                                                                                                                                       |
| Poison Microblock | `poison_microblock` | Castigar a los líderes que intencionalmente empaquetan microbloques equívocos                                                                                                                                                 |

Un ejemplo de cada tipo de transacción se puede encontrar en la [definición de respuesta de la API Stacks Blockchain para transacciones](https://docs.hiro.so/api#operation/get_transaction_by_id).

:::caution Llamadas de contratos solo-lectura **no** requieren transacciones. Lea más al respecto en la guía de red [](network#read-only-function-calls). :::
