---
title: Minería
description: Una guía para la minería en Stacks 2.0
sidebar_position: 4
---

## Introducción

Esta guía destaca algunos detalles técnicos relacionados con la minería en la red Stacks 2.0.

Para conocer los pasos sobre cómo configurar su propio minero, consulte [minero en tesnet](nodes-and-miners/miner-testnet.md) y [minero en mainnet](nodes-and-miners/miner-testnet.md).

## Frecuencia de minería

Un nuevo bloque de Stacks puede ser minado una vez por bloque de Bitcoin. To be considered for mining a block, a miner must have a block commit included in a Bitcoin block. If a miner wishes to update their commitment after submission, they may use Bitcoin Replace-By-Fee.

## Coinbase rewards

Los mineros reciben recompensas de monedas por los bloques que ganen.

Los montos de recompensa son:

- 1000 STX por bloque son liberados en los primeros 4 años de minería
- 500 STX por bloque son liberados durante los siguientes 4 años
- 250 STX por bloque son liberados durante los siguientes 4 años
- 125 STX por bloque son liberados desde entonces indefinidamente.

Estos "halvings" se sincronizan con los halvings de Bitcoin.

![coinbase rewards](/img/pages/coinbase-rewards.png)

## Comisiones de las transacciones

Los mineros reciben comisiones de Stacks por las transacciones extraídas en cualquier bloque que producen.

Para las transacciones extraídas en microbloques, el minero que produce el microbloque recibe el 40% de las comisiones, mientras que el minero que confirma el microbloque recibe 60% de las comisiones.

## Madurez de recompensa

Las recompensas por bloque y las tarifas de transacción tardan 100 bloques en la blockchain de Bitcoin en madurar. Después de extraer con éxito un bloque, sus recompensas aparecen en su cuenta de Stacks después de ~ 24 horas.

## Minería con proof-of-transfer

Miners commit Bitcoin to **two** addresses in every leader block commit. The amount committed to each address must be the same. The addresses are chosen from the current reward set of stacking participants. Addresses are chosen using a verifiable-random-function, and determining the correct two addresses for a given block requires monitoring the Stacks chain.

![mining with pox](/img/pages/mining-with-pox.png)

## Probability to mine next block

The miner who is selected to mine the next block is chosen depending on the amount of BTC the miners sent, that is, transferred or burnt.

The probability for a miner to mine the next block equals the BTC the miner sent divided by the total BTC all miners sent.

While there is no minimum BTC commitment enforced by the protocol, in practice, there's a floor constrained by [dust](https://unchained-capital.com/blog/dust-thermodynamics/)": basically, if the fees for a transaction exceed the value of the spent output, it's considered dust. How dust is [calculated](https://github.com/bitcoin/bitcoin/blob/master/src/policy/policy.cpp#L14) depends on a number of factors, we've found 5,500 satoshis to be good lower bound per [output](https://learnmeabitcoin.com/technical/output). Bitcoin transactions from Stacks miners contain two outputs (for Proof-of-Transfer), so a commitment of at least 11,000 satoshis / block is recommended.

To calculate the amount of BTC to send miners should:

- Guess the price BTC/STX for the next day (100 blocks later)
- Guess the total amount of BTCs committed by all miners

## Microbloques

La blockchain de Stacks produce bloques al mismo ritmo que la cadena de bloques de Bitcoin. Para proporcionar transacciones de menor latencia, los mineros pueden optar por habilitar microbloques. Los microbloques permiten al líder del bloque actual transmitir transacciones e incluir sus estais de transiciones en el epoch actual.

If a block leader opts to produce microblocks, the next leader builds the chain tip off the last microblock that the current leader produces.

El modelo de la trasmisión de bloques se describe en [SIP-001][].

[SIP-001]: https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md#operation-as-a-leader
