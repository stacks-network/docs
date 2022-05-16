---
title: Prueba de transferencia
description: Conozca el mecanismo de consenso de prueba de transferencia
icon: TestnetIcon
images:
  large: /images/stacking.svg
  sm: /images/stacking.svg
---

## Descripción general

Los algoritmos de consenso para los *blockchains* requieren recursos computacionales o financieros para lograr que el *blockchain* sea seguro. La práctica general del consenso descentralizado consiste en lograr que sea prácticamente inviable que cualquier actor malicioso tenga suficiente poder computacional o participación en la propiedad para atacar la red.

Los mecanismos de consenso populares en los *blockchain* modernos incluyen la prueba de trabajo, en la que los nodos dedican recursos computacionales, y la prueba de participación, en la que los nodos dedican recursos financieros para proteger la red.

La prueba de quemado es un nuevo mecanismo de consenso en el que los mineros compiten por «quemar» (destruir) una criptomoneda obtenida por medio de la prueba de trabajo en reemplazo de los recursos informáticos.

La prueba de transferencia (PoX) es una extensión del mecanismo de prueba de quemado. La Pox utiliza la criptomoneda obtenida por medio de la prueba de trabajo de un *blockchain* establecido para anclar uno nuevo. Sin embargo, a diferencia de la prueba de quemado, en lugar de quemar esta criptomoneda, los mineros la transfieren a otros participantes en la red.

![Mecanismo de PoX](/images/pox-mechanism.png)

Esto permite que los participantes de dicha red aseguren la red de la criptomoneda  y ganen una recompensa en la criptomoneda base. Así, los *blockchain* que utilizan la prueba de transferencia están anclados a la cadena de prueba de trabajo elegida. Stacks utiliza [Bitcoin](#why-bitcoin) como su cadena de anclaje.

![Participantes de la PoX](/images/pox-participants.png)

## ¿Por qué Bitcoin?

Hay una serie de razones por las que Stacks eligió a Bitcoin como el *blockchain* para generar consenso. Es el protocolo de *blockchain* más antiguo, lanzado en 2009, y se ha convertido en un activo reconocido fuera de la comunidad relacionada con las criptomonedas. BTC ha contado con una mayor capitalización en el mercado en comparación con cualquier otra criptomoneda durante la última década.

Bitcoin defiende la simplicidad y la estabilidad, y ha superado la prueba del tiempo. Influir o atacar la red es inviable o poco práctico para cualquier posible *hacker*. Es una de las pocas criptomonedas que captan la atención pública. Bitcoin es un nombre popular y es reconocido como un activo por gobiernos, grandes corporaciones e instituciones bancarias tradicionales. Por último, Bitcoin se considera, en gran medida, una forma de almacenamiento de valor fiable y proporciona una amplia infraestructura para apoyar el mecanismo de consenso de prueba de transferencia.

El SIP-001 proporciona una lista completa [de las razones por las que Bitcoin fue elegido para asegurar Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

![btc-stacks](/images/pox-why-bitcoin.png)

## Bloques y microbloques

El *blockchain* de Stacks permite aumentar el rendimiento de las transacciones mediante un mecanismo denominado microbloques. Bitcoin y Stacks progresan al mismo tiempo, y sus bloques se confirman simultáneamente. En Stacks, esto se denomina «bloque de anclaje». Un bloque de transacciones de Stacks completo corresponde a una sola transacción en Bitcoin. Esto mejora significativamente la relación coste/byte para el procesamiento de las transacciones en Stacks. Debido a la creación simultánea de bloques, Bitcoin limita la velocidad con la que se crean los bloques en Stacks, evitando así ataques de denegación de servicio a dicha red.

Sin embargo, entre los bloques de anclaje de Stacks que se asientan en *blockchain* Bitcoin, también hay un número variable de microbloques que permiten asentar rápidamente las transacciones de Stacks con un alto grado de confianza. Esto logra que el rendimiento de las transacciones de Stacks escale independientemente de Bitcoin, al mismo tiempo que las mismas se asienten periódicamente, pero de forma definitiva, en la cadena Bitcoin. El *blockchain* Stacks adopta un modelo de flujo de bloques en el que cada líder puede seleccionar y agrupar, de forma adaptativa, las transacciones en su bloque a medida que llegan al mempool. Por lo tanto, cuando se confirma un bloque de anclaje, se agrupan y procesan todas las transacciones en el flujo principal del microbloque. Este es un método sin precedentes que permite lograr escalabilidad sin crear un protocolo totalmente separado de Bitcoin.

![stx-microblock](/images/stx-microblocks.png)

## Desbloquear el capital de Bitcoin

Stacks también desbloquea los cientos de miles de millones de capital en Bitcoin, y ofrece a los Bitcoiners nuevas oportunidades para utilizar y ganar BTC. Stacks acompaña al ecosistema de Bitcoin, y el trabajo conjunto de estas redes da lugar a formas totalmente novedosas a la hora de usar BTC. El ecosistema de Stacks pone a disposición de los poseedores de Bitcoin aplicaciones para criptomoneda interactivas. Además, al hacer stacking de los tókenes STX y al participar en el mecanismo de consenso PoX, los usuarios tienen la oportunidad de ganar BTC mientras aseguran la cadena Stacks.

![Desbloquear Bitcoin](/images/pox-unlocking-btc.png)

## Clarity y el estado Bitcoin

Los contratos inteligentes de Clarity también tienen una visibilidad única en relación con el estado del *blockchain* Bitcoin. Esto significa que la lógica del contrato en un archivo de Clarity tiene la capacidad de activarse cuando se confirman ciertas transacciones de Bitcoin. Los contratos inteligentes en Clarity tienen pruebas de verificación de pago simple (SPV) integradas para Bitcoin que hacen que la interacción con el estado de Bitcoin sea mucho más sencilla para los desarrolladores. Además, los contratos en Clarity pueden bifurcarse de la cadena Bitcoin original. Por lo tanto, en el caso extremo en el que Bitcoin se bifurcase, los desarrolladores no tendrían que preocuparse por ajustar el despliegue de sus contratos inteligentes.

## Vea también

- [Lea el whitepaper completo de PoX](https://community.stacks.org/pox)
- [Vea al CEO Muneeb Ali y al experto Joe Bender brindar una visión general del revolucionario mecanismo de minería de Stacks PoX](https://www.youtube.com/watch?v=NY_eUrIcWOY)
