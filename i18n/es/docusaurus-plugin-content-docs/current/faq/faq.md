---
title: Preguntas frecuentes generales
description: Preguntas frecuentes
sidebar_label: "Preguntas Frecuentes"
sidebar_position: 8
---

![](/img/glasses.png)

## ¿Por qué mi transferencia sigue pendiente?

Comúnmente es porque la comisión es demasiado baja o el [nonce](#what-is-nonce) es incorrecto.

Puede encontrar más información [aquí](https://www.hiro.so/wallet-faq/why-is-my-stacks-transaction-pending). También hay [buenas prácticas y problemas conocidos](https://forum. stacks. org/t/transactions-in-mempool-best-practices-and-known-issues/11659) y [diagnóstico de transacciones pendientes](https://forum. stacks. org/t/diagnosing-pending-transactions/11908).

También existe este [script](https://github.com/citycoins/scripts/blob/main/getnetworkstatus.js) para ver las primeras 200 transacciones o todas las transacciones en el mempool, para luego devolver los valores máximos y valores promedios de las comisiones. Hemos notado que usando 1.5-2x la cuota promedio en el mempool generalmente se procesará dentro de 6-10 bloques incluso durante una congestión alta.

También existe este [script](https://github.com/citycoins/scripts/blob/main/gettxstatus.js) para rastrear una transacción pendiente hasta que alcance un estado final.

## ¿Qué es el Nonce?

Un nonce se utiliza para asegurarse de que cada transacción vaya en orden correcto. Nonce comienza en 0, por lo que la primera transacción desde una dirección debe ajustarse a nonce=0. Puede encontrar el nonce de su dirección de billetera buscando la dirección en cualquier [explorador de blockchain de Stacks](https://explorer. stacks. co/). También puede usar `$ stx balance <address>`.

Si usted tiene un nonce de transacción que es menor que el nonce de su cuenta, la transacción no se podrá minar y (debería) desaparecer después de 256 bloques. Esto no afecta a las transacciones futuras y, por lo tanto, puede ser simplemente ignorado, están en el pasado.

Si tienes un nonce de transacción que es igual al nonce de tu cuenta, entonces esa transacción es válida y debe ser la siguiente en línea a ser procesada a continuación.

Si tienes un nonce de transacción que es mayor que el nonce de tu cuenta, entonces tiene que haber una cadena de transacciones comenzando con tu nonce de cuenta para que se pueda procesar. Por ejemplo: El nonce de tu cuenta es 10 pero la transacción pendiente tiene un nonce de 12. No será posible minar hasta que las transacciones con un nonce 10 y 11 sean procesadas.

## ¿Qué es la Sustitución por comisión (RBF)?

Una transacción de sustitución por comisión (RBF) a le dice a la blockchain que le gustaría reemplazar una transacción por otra, mientras se especifica una comisión que es mayor que la comisión de transacción original. Una transacción puede ser reemplazada con **cualquier otra transacción**, y no está limitada a la misma operación.

Esto puede utilizarse para **cancelar eficazmente una transacción** reemplazándola por otra cosa, como una pequeña transferencia STX a otra dirección de nuestra propiedad.

Esto puede utilizarse para **elevar la comisión por una transacción pendiente** para que sea considerada por los mineros durante periodos de alta congestión. Esto también puede utilizarse para _volver a enviar_ una transacción, en el sentido de que la transacción RBF recibe un nuevo txid y es considerada de nuevo (o más rápido) por los mineros. Por ejemplo: Yo envío mi transacción con 1 STX de comisión en el bloque 54,123. Por bloque 54,133 veo que mi tx no ha sido recogida, así que envío un RBF con 1.1 STX. Luego espero 10 bloques de nuevo, y envío un RBF otra vez si no se recibe. Hay que encontrar el equilibrio entre hacer esto con demasiada frecuencia y mantener un ritmo constante, pero se ha visto que ayuda a concretar las transacciones, especialmente cuando las nuevas llegan constantemente.

La transacción de reemplazo necesita usar el mismo nonce que la transacción original con un aumento de comisión de al menos 0.000001 STX. Por ejemplo: Su transacción original tiene una comisión de 0.03 STX, la nueva transacción RBF debe tener una comisión de 0.030001 STX o superior.

Las transacciones RBF se procesan de dos maneras:

- Si los mineros escogen la transacción original antes de que la transacción RBF sea recibida, entonces la transacción original se procesa y la transacción de reemplazo pasa a un estado de no minable. Con el tiempo desaparecerá y no afectará a las transacciones futuras.
- Si los mineros recogen la transacción reemplazada entonces la nueva transacción se procesa en lugar del original, y el estado de la transacción original se establece en “droppped_replaced_by_fee”. Este estado no se muestra en el explorador pero puede verse al consultar el txid.

Enviar múltiples transacciones para la misma acción puede ralentizar las cosas de varias maneras.

- Si el total gastado en 2 o 3 transacciones es más de lo que se puede gastar en una sola transacción, las transacciones aparecen como no minables.
- Si las comisiones de las transacciones múltiples superan el saldo de STX, las transacciones serán no minables.

## ¿Qué son los dominios .btc?

[Esta publicación del foro](https://forum.stacks.org/t/btc-domains-are-live/12065) explica todos los beneficios de los dominios .btc. Actualmente se pueden comprar en [btc.us](https://btc.us/)

## ¿Cuál es el trilema del blockchain?

## Stacks vs. Solana vs. Polygon: ¿Cómo se comparan desde la perspectiva de un desarrollador?

[Esta tema del blog responde a la pregunta](https://www.hiro.so/blog/stacks-vs-solana-vs-polygon-how-do-they-compare-from-a-developer-perspective).

## ¿Qué significa la propuesta de Taro de Lightning para Stacks?

[Esta tema del blog responde a la pregunta](https://www.hiro.so/blog/what-does-lightnings-taro-proposal-mean-for-stacks).


## ¿Es Stacks una [cadena PoS](https://en.wikipedia.org/wiki/Proof_of_stake)?[¹][]

No.

El acto de producción de bloques requiere un gasto extrínseco — no está vinculado a poseer el token nativo, como sería necesario en PoS. La única forma de producir bloques en la cadena de Stacks es transferir Bitcoin a una lista predeterminada aleatorizada de direcciones de Bitcoin. Además, la blockchain de Stacks puede bifurcarse, y existe un protocolo para clasificar las bifurcaciones según su calidad, independientemente del conjunto de mineros y de los tokens que posean. Estas dos propiedades lo distinguen aún más de las cadenas PoS, que no puede bifurcarse debido a la incapacidad de identificar un fork canónico sin confiar en que un tercero decrete un fork en particular como válido. La capacidad de bifurcarse permite que la blockchain de Stacks sobreviva a modos de fallo que harían colapsar una cadena PoS.

## ¿Es Stacks una [cadena lateral o sidechain](https://en.bitcoin.it/wiki/Sidechain)?[¹][]

No.

Por dos razones fundamentales.

Primero, el historial de todos los bloques de Stacks producidos se registra en Bitcoin. Esto significa que el acto de producir una bifurcación privada de Stacks es al menos tan duro como reordenar la cadena de Bitcoin. Esto a su vez hace que los ataques a la cadena que dependen de la creación de bifurcaciones privadas (como la minería egoísta y el doble gasto) sean mucho más difíciles de llevar a cabo de manera rentable, ya que todos los participantes honrados pueden ver el ataque antes de que ocurra y tener la oportunidad de aplicar contramedidas. Las cadenas laterales no ofrecen tal beneficio de seguridad.

En segundo lugar, la blockchain de Stacks tiene su propio token; no vinculado a Bitcoin. Esto significa que la seguridad de la bifurcación canónica de la blockchain de Stacks está respaldada por el valor de toda su economía de tokens, mientras que la seguridad de la bifurcación canónica de una sidechain está respaldada únicamente por cualquier medida específica del sistema que incentive a sus validadores a producir bloques de forma honesta, o por la voluntad de los mineros de Bitcoin de procesar las solicitudes de peg-in (cualquiera que sea la garantía más débil).


## Es Stacks un [sistema de capa 2](https://academy.binance.com/en/glossary/layer-2) para Bitcoin?[¹][]

No.

La blockchain de Stacks es una cadena de bloques de capa 1, que utiliza un nuevo y único protocolo de minado llamado prueba de transferencia (PoX). Una blockchain de PoX corre en paralelo a otra blockchain (Bitcoin en caso de Stacks), la que utiliza como un medio de emisión fiable para sus cabeceras de bloque. Es un sistema soberano por derecho propio. El estado de la blockchain de Stacks es distinto de Bitcoin, y es totalmente mantenido por y para los nodos de Stacks. Las transacciones de Stacks están separadas de las transacciones de Bitcoin. Los sistemas de Capa 2 como Lightning están diseñados para ayudar a escalar las transacciones de pago de Bitcoin, mientras que Stacks está diseñado para llevar nuevos casos de uso a Bitcoin a través de contratos inteligentes. Stacks no está diseñada como una solución de escalabilidad de capa 2 de Bitcoin.


## ¿Es Stacks una [cadena de minería combinada](https://en.bitcoin.it/wiki/Merged_mining_specification)?[¹][]

No.

Los únicos productores de bloques en la cadena de Stacks son los mineros de Stacks. Los mineros de bitcoin no participan en la validación de bloques de Stacks y no reclaman recompensas de bloques de Stacks. Además, Stacks no es una [cadena de minado ciego](https://github.com/bitcoin/bips/blob/master/bip-0301.mediawiki), porque los ganadores de los bloques de STX son públicos y se eligen aleatoriamente (en lugar de los que ganan con la oferta más alta), y sus tokens se acuñan de acuerdo con un calendario que es independiente del grado de compromiso de los mineros o de los Bitcoin transferidos (en lugar de acuñarse sólo por medio de los pegs unidireccionales de los Bitcoin). Esto asegura que Stacks es capaz de avanzar sin la participación de los mineros de Bitcoin, y asegura que los mineros de Stacks son compensados adecuadamente por mantener el sistema vivo independientemente del volumen de transacciones.

## ¿Cuál es la diferencia entre Stacks y Ethereum?[2][]
**Cálculo y almacenamiento** Stacks hace todo el cálculo y almacenamiento fuera de la blockchain, y utiliza el blockchain sólo como una “fuente compartida de verdad” entre clientes. Por el contrario, Ethereum hace todo el cálculo y la mayor parte del almacenamiento de aplicaciones en la propia blockchain. Como Ethereum, si dos nodos Stacks ven la misma blockchain subyacente, ejecutarán independientemente los mismos cálculos y producirán el mismo estado. A diferencia de Ethereum, no existe un blockchain específico para Stacks.

**Lenguaje de programación y herramientas** El modelo de programación de Stacks se basa en ejecutar programas off-chain. Estos programas se pueden escribir y depurar en el lenguaje que se desee. Por el contrario, el modelo de programación de Ethereum se basa en la ejecución on-chain de “contratos inteligentes” Estos son escritos y depurados con todo un nuevo conjunto de herramientas, como Solidity y Serpent.

**Scalability of On-chain Computation** Stacks is designed around a “virtual chain” concept, where nodes only need to reach consensus on the shared “virtual chain” they’re interested in. Virtual chains do not interact with one another, and a single blockchain can host many virtual chains. Although Stacks’s specific virtual chain is not Turing-complete (i.e. it’s a list of instructions to build the name database), it is possible to create Turing-complete virtual chains like Ethereum. These virtual chains can live in any blockchain for which there exists a driver, and virtual chain clients only need to execute their virtual chain transactions (i.e. Stacks only processes Stacks virtual chain transactions).

By contrast, because smart contracts run on-chain and can call one another, all Ethereum nodes need to process all smart contracts’ computations in order to reach consensus. This can get expensive as the number of running smart contracts grow, which takes the form of gas fee increases.

**Scalability of Off-chain Computation** Stacks applications are very similar to Web applications today and almost never need to interact with the blockchain. For most Stacks applications, the blockchain is only used to authenticate the application’s code and data before the user runs it. By contrast, Ethereum applications usually require an application-specific smart contract, and must interact with the blockchain to carry out its operations.


[¹]: https://stacks.org/stacks-blockchain
[2]: https://forum.stacks.org/t/what-is-the-difference-between-blockstack-and-ethereum/781
