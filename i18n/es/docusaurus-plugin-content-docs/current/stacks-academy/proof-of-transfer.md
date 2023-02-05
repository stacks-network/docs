---
title: Prueba de transferencia
description: Conozca el mecanismo de consenso de prueba de transferencia
sidebar_position: 3
---

In the previous section, we took a look at the vision and ethos of Stacks. We talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself.

In this section, we'll run through the consensus mechanism that makes that happen, Proof of Transfer.

Los algoritmos de consenso para los *blockchains* requieren recursos computacionales o financieros para lograr que el *blockchain* sea seguro. La práctica general del consenso descentralizado consiste en lograr que sea prácticamente inviable que cualquier actor malicioso tenga suficiente poder computacional o participación en la propiedad para atacar la red.

Popular consensus mechanisms in modern blockchains include proof of work, in which nodes dedicate computing resources, and proof of stake, in which nodes dedicate financial resources to secure the network.

Proof of burn is another, less-frequently used consensus mechanism where miners compete by ‘burning’ (destroying) a proof of work cryptocurrency as a proxy for computing resources.

Proof of transfer (PoX) is an extension of the proof of burn mechanism. PoX uses the proof of work cryptocurrency of an established blockchain to secure a new blockchain. However, unlike proof of burn, rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network.

![Mecanismo de PoX](/img/pox-mechanism.png)

Esto permite que los participantes de dicha red aseguren la red de la criptomoneda  y ganen una recompensa en la criptomoneda base. Thus, PoX blockchains are anchored on their chosen PoW chain. Stacks utiliza [Bitcoin](#why-bitcoin) como su cadena de anclaje.

![Participantes de la PoX](/img/pox-participants.png)

## ¿Por qué Bitcoin?

Hay una serie de razones por las que Stacks eligió a Bitcoin como el *blockchain* para generar consenso. Es el protocolo de *blockchain* más antiguo, lanzado en 2009, y se ha convertido en un activo reconocido fuera de la comunidad relacionada con las criptomonedas. BTC ha contado con una mayor capitalización en el mercado en comparación con cualquier otra criptomoneda durante la última década.

Bitcoin defiende la simplicidad y la estabilidad, y ha superado la prueba del tiempo. Influir o atacar la red es inviable o poco práctico para cualquier posible *hacker*. Es una de las pocas criptomonedas que captan la atención pública. Bitcoin es un nombre popular y es reconocido como un activo por gobiernos, grandes corporaciones e instituciones bancarias tradicionales. Lastly, Bitcoin is largely considered a reliable store of value, and provides extensive infrastructure to support the PoX consensus mechanism.

El SIP-001 proporciona una lista completa [de las razones por las que Bitcoin fue elegido para asegurar Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

:::note
By the way, SIP stands for Stacks Improvement Proposal, and it's the process by which community members agree on making changes to the network, we'll look at these in a future lesson.
:::

## Bloques y microbloques

El *blockchain* de Stacks permite aumentar el rendimiento de las transacciones mediante un mecanismo denominado microbloques. Bitcoin y Stacks progresan al mismo tiempo, y sus bloques se confirman simultáneamente. En Stacks, esto se denomina «bloque de anclaje». Un bloque de transacciones de Stacks completo corresponde a una sola transacción en Bitcoin. Esto mejora significativamente la relación coste/byte para el procesamiento de las transacciones en Stacks. Debido a la creación simultánea de bloques, Bitcoin limita la velocidad con la que se crean los bloques en Stacks, evitando así ataques de denegación de servicio a dicha red.

Sin embargo, entre los bloques de anclaje de Stacks que se asientan en *blockchain* Bitcoin, también hay un número variable de microbloques que permiten asentar rápidamente las transacciones de Stacks con un alto grado de confianza. Esto logra que el rendimiento de las transacciones de Stacks escale independientemente de Bitcoin, al mismo tiempo que las mismas se asienten periódicamente, pero de forma definitiva, en la cadena Bitcoin. El *blockchain* Stacks adopta un modelo de flujo de bloques en el que cada líder puede seleccionar y agrupar, de forma adaptativa, las transacciones en su bloque a medida que llegan al mempool. Por lo tanto, cuando se confirma un bloque de anclaje, se agrupan y procesan todas las transacciones en el flujo principal del microbloque. Este es un método sin precedentes que permite lograr escalabilidad sin crear un protocolo totalmente separado de Bitcoin.

![stx-microblock](/img/stx-microblocks.png)

## Desbloquear el capital de Bitcoin

In the previous section we talked about Stacks being able to allow us to build a decentralized economy on top of Bitcoin and that PoX was a key piece of being able to do that.

The reason is two-fold. First, as a part of this PoX mining process we have covered here, a hash of each Stacks block is recorded to the OP_RETURN opcode of a Bitcoin transaction. If you aren't familiar, the OP_RETURN opcode allows us to store up to 40 bytes of arbitrary data in a Bitcoin transaction.

:::note
This [Stack Exchange answer](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like) gives a good overview of the reasoning and history of this opcode.
:::

This is how Stacks records its history to the Bitcoin chain and why it inherits some security as a result of this process. If you wanted to try and create a false Stacks fork, you would have to broadcast the entire process to the Bitcoin chain.

Similarly, if you wanted to try and change the history of the Stacks chain, you would have to somehow modify these OP_RETURN values in each corresponding Bitcoin block, meaning you would have to compromise Bitcoin in order to compromise the history of Stacks.

:::caution
Note that this is not the same thing as saying that you need to compromise Bitcoin in order compromise Stacks at all, but simply that in order to falsify the history of the Stacks chain you would have to also falsify the history of the Bitcoin chain.
:::

Additionally, part of this PoX process involves each Stacks block also knowing which Bitcoin block it is anchored to. Clarity, Stacks' smart contract language, has built-in functions for reading this data, such as [`get-block-info`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#get-block-info), which returns, among other things, a field called `burnchain-header-hash`, which gives us the hash of the Bitcoin header corresponding to this Stacks block.

This allows us to do really interesting things like trigger certain things to happen in a Clarity contract by watching the chain and verifying whether or not certain transactions occurred. You can see this in action in [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html), with other interesting projects like [Zest](https://www.zestprotocol.com/) seeking to expand on this functionality.

The ultimate goal of all this is to enable the vision of web3, building a decentralized economy and enabling true user ownership of assets and data, on top of Bitcoin as a settlement layer, and using Bitcoin as a base decentralized money.

![Desbloquear Bitcoin](/img/pox-unlocking-btc.png)

We also recommend [reading the full PoX whitepaper](https://community.stacks.org/pox), as it breaks down the reasoning behind creating a PoX chain and the unique benefits we get from doing so.

## Proof of Transfer Contracts and Technical Details

The Proof of Transfer functionality is implemented on the Stacks chain via a [Clarity smart contract](https://explorer.stacks.co/txid/0xfc878ab9c29f3d822a96ee73898000579bdf69619a174e748672eabfc7cfc589). An overview of this contract is [available in the docs](../clarity/noteworthy-contracts/stacking-contract.md).

You can see the original design for stacking and proof of transfer by reading the relevant SIP, [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md). You can also utilize [Hiro's API](https://docs.hiro.so/api#tag/Info/operation/get_pox_info) to get proof of transfer details including the relevant contract address.

However, since Stacks mainnet launched in January 2021, several shortcomings have been recognized in the stacking process, which are being corrected in the next major network epoch, Stacks 2.1 You can read more about these changes in [SIP-015](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md), the SIP responsible for managing the upgrade to 2.1.

### Got another question

Have another question not answered here? Post in on Stack Overflow under the appropriate tag(s) and post the link to the Stack Overflow question in the Stacks Discord in the appropriate channel.
