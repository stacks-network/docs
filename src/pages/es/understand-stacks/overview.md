---
title: Descripción general
description: Aprenda más sobre el blockchain Stacks 2.0
icon: TestnetIcon
images:
  large: /images/nodes.svg
  sm: /images/nodes.svg
---

## Introducción

Stacks 2.0 es una cadena de bloques de transacciones blockchain de primera capa que se conecta a Bitcoin, permitiendo contratos inteligentes y aplicaciones descentralizadas. Los contratos inteligentes y las aplicaciones desarrollados en la plataforma de Stacks se integran de forma nativa con Bitcoin, incorporándo así su seguridad, estabilidad y poder económico.

## Funcionalidades

Obtenga más información sobre las características del blockchain Stacks 2.0.

<!-- markdown-link-check-disable -->

-> Consulte [las especificaciones técnicas](technical-specs) para obtener una breve descripción general.

<!-- markdown-link-check-enable-->

Una comparación detallada [del blockchain Stacks con otras tecnologías de blockchain][Comparación del blockchain de Stacks con otras tecnologías de blockchain] está disponible en el blog de la Stacks Foundation.

### Mecanismo de consenso

Stacks 2.0 implementa un nuevo mecanismo de minería llamado Prueba de Transferencia (PoX). PoX es un algoritmo de consenso entre dos blockchains que utiliza uno ya establecido (en este caso Bitcoin) para anclar uno nuevo (Stacks). Utiliza un blockchain bien establecido (en este caso Bitcoin) para asegurar una nueva blockchain (Stacks).

PoX tiene una relación de 1:1 por bloque con Bitcoin, lo que significa que cualquier cosa que suceda en el blockchain de Stacks puede verificarse en el blockchainde Bitcoin.

En lugar de gastar electricidad como prueba de trabajo, PoX reutiliza los bitcóines ya acuñados como "prueba de cómputo", y los mineros representan su costo de minería directamente en bitcóines.

[@page-reference | inline] | /understand-stacks/proof-of-transfer

### Minería

Minar es necesario para lograr que la red sea utilizable, fiable y segura. Los mineros verifican las transacciones entrantes, participan en el mecanismo de consenso y escriben nuevos bloques en el blockchain.

Para incentivar la minería, los mineros reciben tókenes de Stacks (STX) recién acuñados al ganar la subasta que les permiten convertirse líderes de la próxima ronda.

[@page-reference | inline] | /understand-stacks/mining

### Stacking

Los bitcóines utilizados en las pujas de los mineros se envían a un conjunto de direcciones específicas pertenecientes a los poseedores de Stacks (STX) que participan activamente en el consenso ('Stackers'). Así, en lugar de ser destruidos, los bitcóines que se consumen durante en el proceso de minado se destinan a los poseedores de Stacks involucrados en el proceso como recompensa por conservar sus Stacks y participar en el algoritmo de Stacking.

Quienes poseen Stacks tienen que bloquear sus tókenes (STX) durante un período de tiempo determinado.

[@referencia-página | inline] | /entable-stacks/stack

### Contratos inteligentes

Clarity es un nuevo lenguaje que se utiliza en los contratos inteligentes del blockchain Stacks 2.0 y optimiza tanto su previsibilidad como su seguridad. The Clarity smart contract language optimizes for predictability and security.

Stacks 2.0 fija los contratos inteligentes de Clarity en Bitcoin, lo que permite que dichos contratos operen basándose en las acciones que aparecen en el blockchain de Bitcoin.

->El [proyecto de código abierto Clarity](https://clarity-lang.org/) está respaldado por Stacks y [Algorand](https://www.algorand.com/).

Clarity es diferente de otros lenguajes diseñados para escribir contratos inteligentes de varias maneras:

- **Previsibilidad**: El lenguaje Clarity utiliza una sintaxis precisa e inequívoca que permite a los desarrolladores predecir exactamente cómo se ejecutarán sus contratos.
- **Seguridad**: El lenguaje Clarity permite que los usuarios establezcan sus propias condiciones para las transacciones, lo que garantiza que un contrato nunca pueda transferir inesperadamente en token de un usuario.
- **Sin compilador**: Los contratos escritos con Clarity se transmiten al blockchain de Stacks tal cual fueron creados por los desarrolladores. Esto garantiza que el código que los desarrolladores escribieron, analizaron y probaron, sea exactamente lo que se ejecuta.

[@page-reference | inline] | /write-smart-contracts/overview

## Guías

Lea una de nuestras guías para entender los pormenores del blockchain Stacks 2.0.

[@page-reference | grid-small] | /understand-stacks/accounts, /understand-stacks/transactions, /understand-stacks/network, /understand-stacks/microblocks

[Comparación del blockchain de Stacks con otras tecnologías de blockchain]: https://stacks.org/stacks-blockchain ""
