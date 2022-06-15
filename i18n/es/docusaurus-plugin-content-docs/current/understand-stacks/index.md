---
title: Comprende Stacks
description: Aprenda más sobre el blockchain Stacks 2.0
sidebar_position: 1
---

![](/img/SBC-L-2x-10.png)
## Introducción

Stacks 2.0 es una cadena de bloques de transacciones blockchain de primera capa que se conecta a Bitcoin, permitiendo contratos inteligentes y aplicaciones descentralizadas. Los contratos inteligentes y las aplicaciones desarrollados en la plataforma de Stacks se integran de forma nativa con Bitcoin, incorporándo así su seguridad, estabilidad y poder económico.

## Funcionalidades

Obtenga más información sobre las características del blockchain Stacks 2.0.

<!-- markdown-link-check-disable -->

:::tip Check out the [technical specifications](technical-specs) for a brief overview :::


<!-- markdown-link-check-enable-->

Una comparación detallada [del blockchain Stacks con otras tecnologías de blockchain][Comparación del blockchain de Stacks con otras tecnologías de blockchain] está disponible en el blog de la Stacks Foundation.
### Mecanismo de consenso
![](/img/pages/stacking.svg) Stacks 2.0 implementa un nuevo mecanismo de minería llamado Prueba de Transferencia (PoX). PoX es un algoritmo de consenso entre dos blockchains que utiliza uno ya establecido (en este caso Bitcoin) para anclar uno nuevo (Stacks). Utiliza un blockchain bien establecido (en este caso Bitcoin) para asegurar una nueva blockchain (Stacks).

PoX tiene una relación de 1:1 por bloque con Bitcoin, lo que significa que cualquier cosa que suceda en el blockchain de Stacks puede verificarse en el blockchainde Bitcoin.

En lugar de gastar electricidad como prueba de trabajo, PoX reutiliza los bitcóines ya acuñados como "prueba de cómputo", y los mineros representan su costo de minería directamente en bitcóines.


[Leer más sobre "Proof of Transfer"](proof-of-transfer)
### Minería

![](/img/pages/testnet-sm.svg) Minar es necesario para lograr que la red sea utilizable, fiable y segura. Los mineros verifican las transacciones entrantes, participan en el mecanismo de consenso y escriben nuevos bloques en el blockchain.

Para incentivar la minería, los mineros reciben tókenes de Stacks (STX) recién acuñados al ganar la subasta que les permiten convertirse líderes de la próxima ronda.

[Leer más sobre minería](minería)

### Stacking

Los bitcóines utilizados en las pujas de los mineros se envían a un conjunto de direcciones específicas pertenecientes a los poseedores de Stacks (STX) que participan activamente en el consenso ('Stackers'). Así, en lugar de ser destruidos, los bitcóines que se consumen durante en el proceso de minado se destinan a los poseedores de Stacks involucrados en el proceso como recompensa por conservar sus Stacks y participar en el algoritmo de Stacking.

Quienes poseen Stacks tienen que bloquear sus tókenes (STX) durante un período de tiempo determinado.

[Leer más sobre Stacking](stacking)

### Contratos inteligentes

![](/img/pages/write-smart-contracts-sm.svg) Clarity es un nuevo lenguaje que se utiliza en los contratos inteligentes del blockchain Stacks 2.0 y optimiza tanto su previsibilidad como su seguridad. The Clarity smart contract language optimizes for predictability and security.

Stacks 2.0 fija los contratos inteligentes de Clarity en Bitcoin, lo que permite que dichos contratos operen basándose en las acciones que aparecen en el blockchain de Bitcoin.

:::note The [Clarity open-source project](https://clarity-lang.org/) is supported by Stacks and [Algorand](https://www.algorand.com/) :::


Clarity es diferente de otros lenguajes diseñados para escribir contratos inteligentes de varias maneras:

- **Previsibilidad**: El lenguaje Clarity utiliza una sintaxis precisa e inequívoca que permite a los desarrolladores predecir exactamente cómo se ejecutarán sus contratos.
- **Seguridad**: El lenguaje Clarity permite que los usuarios establezcan sus propias condiciones para las transacciones, lo que garantiza que un contrato nunca pueda transferir inesperadamente en token de un usuario.
- **Sin compilador**: Los contratos escritos con Clarity se transmiten al blockchain de Stacks tal cual fueron creados por los desarrolladores. Esto garantiza que el código que los desarrolladores escribieron, analizaron y probaron, sea exactamente lo que se ejecuta.

[Leer más sobre Clarity](../write-smart-contracts/clarity-language/)

## Guías

Lea una de nuestras guías para entender los pormenores del blockchain Stacks 2.0.

* [Cuenta](../understand-stacks/accounts)
* [Transacciones](../understand-stacks/transactions)
* [Red](../understand-stacks/network)
* [Microbloques](../understand-stacks/microblocks)

[Comparación del blockchain de Stacks con otras tecnologías de blockchain]: https://stacks.org/stacks-blockchain ""
