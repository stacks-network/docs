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

## ¿Qué es Nonce?

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
- If miners pick up the replaced transaction then the new transaction is processed instead of the original, and the status of the original transaction is set to “droppped_replaced_by_fee”. This status is not shown on the explorer but can be seen when querying the txid.

Submitting multiple transactions for the same action can slow things down in a few ways.

- If the total spent in 2 or 3 transactions is more than can be spent in a single transaction, the transactions appear unmineable.
- If the fees for multiple transactions exceed the STX balance, the transactions will be unmineable.

## ¿Qué son los dominios .btc?

[This forum post](https://forum.stacks.org/t/btc-domains-are-live/12065) explains all the benefits of .btc domains. Actualmente se pueden comprar en [btc.us](https://btc.us/)

## ¿Cuál es el trilema del blockchain?

## Stacks vs. Solana vs. Polygon: How Do They Compare From a Developer Perspective?

[Esta tema del blog responde a la pregunta](https://www.hiro.so/blog/stacks-vs-solana-vs-polygon-how-do-they-compare-from-a-developer-perspective).

## What Does Lightning’s Taro Proposal Mean for Stacks?

[Esta tema del blog responde a la pregunta](https://www.hiro.so/blog/what-does-lightnings-taro-proposal-mean-for-stacks).


## Is Stacks a [PoS chain](https://en.wikipedia.org/wiki/Proof_of_stake)?[¹][]

No.

The act of block production requires an extrinsic expenditure — it is not tied to owning the native token, as would be required in PoS. The only way to produce blocks in the Stacks chain is to transfer Bitcoin to a predetermined randomized list of Bitcoin addresses. Moreover, the Stacks blockchain can fork, and there exists a protocol to rank forks by quality independent of the set of miners and the tokens they hold. These two properties further distinguish it from PoS chains, which cannot fork due to the inability to identify a canonical fork without trusting a 3rd party to decree a particular fork as valid. The ability to fork allows the Stacks blockchain to survive failure modes that would crash a PoS chain.

## Is Stacks a [sidechain](https://en.bitcoin.it/wiki/Sidechain)?[¹][]

No.

Por dos razones fundamentales.

First, the history of all Stacks blocks produced is recorded to Bitcoin. This means that the act of producing a private Stacks fork is at least as hard as reorging the Bitcoin chain. This in turn makes it so attacks on the chain that rely on creating private forks (such as selfish mining and double-spending) are much harder to carry out profitably, since all honest participants can see the attack coming before it happens and have a chance to apply countermeasures. Sidechains offer no such security benefit.

Second, the Stacks blockchain has its own token; it does not represent pegged Bitcoin. This means that the safety of the canonical fork of the Stacks blockchain is underpinned by its entire token economy’s value, whereas the safety of a sidechain’s canonical fork is underpinned only by whatever system-specific measures incentivize its validators to produce blocks honestly, or the Bitcoin miners’ willingness to process peg-in requests (whichever is the weaker guarantee).


## Is Stacks a [layer-2 system](https://academy.binance.com/en/glossary/layer-2) for Bitcoin?[¹][]

No.

Stacks blockchain is a layer-1 blockchain, which uses a novel and unique mining protocol called proof-of-transfer (PoX). A PoX blockchain runs in parallel to another blockchain (Bitcoin in Stacks’ case), which it uses as a reliable broadcast medium for its block headers. It's a sovereign system in its own right. The Stacks blockchain state is distinct from Bitcoin, and is wholly maintained by and for Stacks nodes. Stacks transactions are separate from Bitcoin transactions. Layer-2 systems like Lightning are designed to help scale Bitcoin payment transactions, whereas Stacks is designed to bring new use-cases to Bitcoin through smart contracts. Stacks is not designed as a Bitcoin layer-2 scalability solution.


## Is Stacks a [merged-mined chain](https://en.bitcoin.it/wiki/Merged_mining_specification)?[¹][]

No.

The only block producers on the Stacks chain are Stacks miners. Bitcoin miners do not participate in Stacks block validation, and do not claim Stacks block rewards. Moreover, Stacks is not a [blind merged-mined chain](https://github.com/bitcoin/bips/blob/master/bip-0301.mediawiki), because STX block winners are public and randomly chosen (instead of highest-bid-wins), and its tokens are minted according to a schedule that is independent of the degree of miner commitment or Bitcoin transferred (instead of minted only by one-way pegs from Bitcoin). This ensures that Stacks is able to make forward progress without opt-in from Bitcoin miners, and it ensures that Stacks miners are adequately compensated for keeping the system alive regardless of transaction volume.

## Whats the difference between Stacks and Ethereum?[²][]
**Computation and Storage** Stacks does all computation and storage outside of the blockchain, and uses the blockchain only as a “shared source of truth” between clients. By contrast, Ethereum does all computation and most application storage in the blockchain itself. Like Ethereum, if two Stacks nodes see the same underlying blockchain, they will independently run the same computations and produce the same state. Unlike Ethereum, there is no Stacks-specific blockchain.

**Programming Language and Tooling** Stacks’s programming model is based on running off-chain programs. These programs can be written and debugged in any language you want. By contrast, Ethereum’s programming model is based on running on-chain “smart contracts.” These are written and debugged with a whole new set of tools, like Solidity and Serpent.

**Scalability of On-chain Computation** Stacks is designed around a “virtual chain” concept, where nodes only need to reach consensus on the shared “virtual chain” they’re interested in. Virtual chains do not interact with one another, and a single blockchain can host many virtual chains. Although Stacks’s specific virtual chain is not Turing-complete (i.e. it’s a list of instructions to build the name database), it is possible to create Turing-complete virtual chains like Ethereum. These virtual chains can live in any blockchain for which there exists a driver, and virtual chain clients only need to execute their virtual chain transactions (i.e. Stacks only processes Stacks virtual chain transactions).

By contrast, because smart contracts run on-chain and can call one another, all Ethereum nodes need to process all smart contracts’ computations in order to reach consensus. This can get expensive as the number of running smart contracts grow, which takes the form of gas fee increases.

**Scalability of Off-chain Computation** Stacks applications are very similar to Web applications today and almost never need to interact with the blockchain. For most Stacks applications, the blockchain is only used to authenticate the application’s code and data before the user runs it. By contrast, Ethereum applications usually require an application-specific smart contract, and must interact with the blockchain to carry out its operations.


[¹]: https://stacks.org/stacks-blockchain
[²]: https://forum.stacks.org/t/what-is-the-difference-between-blockstack-and-ethereum/781
