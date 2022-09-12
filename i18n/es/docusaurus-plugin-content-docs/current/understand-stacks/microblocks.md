---
title: Microbloques
description: Guía de Microbloques Stacks
sidebar_position: 8
---

## Introducción

Los microbloques son una característica a nivel de protocolo de la blockchain de Stacks que resuelven el desafío técnico de latencia de transacción. Porque cada bloque de Stacks está anclado a un bloque de Bitcoins a través del [mecanismo de consenso Proof-of-Transfer](../understand-stacks/proof-of-transfer), Stacks está necesariamente limitada a los mismos tiempos de bloqueo que la red Bitcoin. Los microbloques permiten a la blockchain de Stacks realizar transiciones de estado entre bloques de anclaje.

Los microbloques son un potente mecanismo para que los desarrolladores creen aplicaciones de alta calidad y rendimiento en Stacks, mientras que todavía heredan la seguridad de Bitcoin.

## Estados de la transacción

El [modelo de producción de bloques de Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.) se describe en SIP-001. El estándar delimita el mecanismo mediante el cual los líderes de bloques elegidos pueden producir bloques en la blockchain de Stacks ya sea por lotes de transacciones o por transmisión de ellas. Los microbloques son el producto del modelo de transimisión.

Si un líder de bloque ha elegido minar microbloques, el líder selecciona las transacciones del mempool y las empaqueta en microbloques durante el epoch actual. Los microbloques son bloques de transacciones incluidas por un minero después del bloque de anclaje anterior haya sido minado, pero antes de que el siguiente bloque sea seleccionado. Transactions included in microblocks are processed by the network: their results are known.

Considere una transacción desde la perspectiva del número de confirmaciones que el bloque tiene. Una transacción incluida en un microbloque podría tener el siguiente ejemplo de ciclo de vida:

```
La transacción 1 se transmite al mempool. Tiene 0 confirmaciones.
La transacción 1 está incluida en un microbloque. Todavía tiene 0 confirmaciones, pero los resultados de la transacción son conocidos
La transacción 1 está incluida en el próximo bloque de anclaje. Tiene 1 confirmación.
El próximo bloque de Stacks confirma el bloque anterior. La transacción 1 tiene 2 confirmaciones.
El próximo bloque de Stacks confirma el bloque anterior. La transacción 1 tiene 3 confirmaciones.
...
```

Considera una transacción similar que no está incluida en un microbloque:

```
La transacción 2 se transmite al mempool. Tiene 0 confirmaciones.
La transacción 2 está incluida en el próximo anclaje de bloque. Tiene 1 confirmación.
El próximo bloque de Stacks confirma el bloque anterior. La transacción 2 tiene 2 confirmaciones.
El próximo bloque de Stacks confirma el bloque anterior. La transacción 2 tiene 3 confirmaciones.
```

Los ciclos de vida de las dos transacciones son similares, pero la diferencia es el estado pendiente. Muchos wallets de Bitcoin muestran saldos de confirmación 0: el saldo de su wallet con cualquier transacción de mempool ya aplicada. Esto es útil porque te indica cuando has enviado o recibido una transacción. Con contratos inteligentes, mostrar el estado pendiente no es tan sencillo, porque los contratos inteligentes no solo transfieren entradas a salidas, pueden llamar a otros contratos, emitir eventos, o realizar otros cálculos. Una transacción procesada en un microbloque genera toda esa información.

:::tip
Si una transacción es dependiente de un estado de la cadena que podría verse alterado por transacciones anteriores con graves
implicaciones, debería considerar cuidadosamente si debe realizarse usando microbloques.
:::

## Habilitar microbloques

Los mineros pueden elegir habilitar o desactivar microbloques en su configuración de minería. Como una mejor práctica, los mineros deben permitir minería microbloques. Cuando una aplicación o usuario envía una transacción, la transacción puede incluir un argumento que requiere que la transacción esté en un microbloque, un anclaje de bloque o en ninguna de ellas.

### Transacciones

Las transacciones incluyen una opción que controla si un minero debe incluirlas en microbloques o en anclajes de bloque. La opción de transacción del modo ancla es un argumento opcional que controla si una transacción debe incluirse en un anclaje de bloque o un microbloque, o es elegible para ambos.

### Minería

Los mineros Stacks deben habilitar microbloques en su configuración de minería para implementar la transmisión del modelo de bloques. Para más información, consultar [minando de microbloques](../understand-stacks/mining#microblocks).

## Desarrollando con microbloques

En la mayoría de los casos, la información de transacciones incluidas en microbloques debe ser tratada como información de cualquier otro bloque. Wallets y exploradores deben mostrar las consecuencias de las transacciones de microbloques como el estado actual de la red. Este Estado debe ser reconocido como tentativo.

Una transacción de microbloque puede terminar siendo reorganizada en el siguiente bloque en lugar de ser confirmada como es. Debido a de esto, tu UI debería comunicar a los usuarios si los resultados de una transacción cambiaron, o si el bloque asociado a la transacción cambió. Este es el mismo resultado que si ocurriera un fork de 1 bloque.

### Librerías Stacks.js

Stacks.js proporciona el argumento [AnchorMode][] en objetos de transacción para que la aplicación pueda establecer la preferencia microbloques para las transacciones.

### API

:::danger El soporte de la API para microbloques es un trabajo en curso. Revise la [documentación de la API][microblocks_api] cuidadosamente para asegurarse de que está actualizado sobre los últimos detalles de implementación para microbloques. :::

La API de Stacks Blockchain expone microbloques a través de varios endpoints. Revisa la [Guía API de Stacks Blockchain][] para más detalles.

## Buenas prácticas

Trabajar con microbloques es una decisión de diseño que debes tomar para tu propia aplicación. Al trabajar con microbloques, se recomiendan las siguientes buenas prácticas.

### Manejo de nonce

Manejo de nonce con microbloques es desafiante porque la siguiente cuenta nonce debe tener en cuenta cualquier valor de nonce incluido en microbloques, que aún no puede ser incluido en un anclaje de bloque. La API de Stacks Blockchain [proporciona un endpoint][] para recuperar el siguiente nonce para un determinado principal.

### Diseño de aplicación

El estado de las transacciones en microbloques debe comunicarse cuidadosamente a los usuarios. Ninguna transacción es final hasta que se incluya en un anclaje de bloque y el diseño de tu aplicación debería reflejar esto.

Las siguientes pautas se proporcionan como un conjunto inicial de buenas prácticas para el diseño UI al incorporar microbloques en su aplicación.

#### Exploradores

Mostrar estado pendiente, pero advertir que una transacción todavía está pendiente. Indique visualmente que los saldos mostrados dependen del estado pendiente.

#### Wallets

Mostrar estado pendiente, pero advertir que una transacción todavía está pendiente. Indicate visually that displayed balances depend on pending state.

#### Exchanges

Continúe contando confirmaciones, los microbloques deben ser considerados pendientes.

#### Aplicaciones

La comunicación de microbloque es altamente dependiente de la aplicación. Para algunas aplicaciones, puede que esté bien mostrar una transacción pendiente o 0-confirmación confirmada. Por ejemplo, almacenar datos en la cadena, o consultar el contrato BNS. Para otras aplicaciones, como la transferencia del valor real, esperar a 3 confirmaciones sería prudente antes de mostrar el estado como confirmado.

[AnchorMode]: https://stacks.js.org/enums/transactions.AnchorMode.html
[Guía API de Stacks Blockchain]: https://docs.hiro.so/get-started/stacks-blockchain-api#microblocks-support
[proporciona un endpoint]: https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling
[microblocks_api]: https://docs.hiro.so/api#tag/Microblocks
