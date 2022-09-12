---
title: Stacking
description: Introducción al mecanismo de recompensa de la prueba de transferencia
sidebar_position: 9
---

## Introducción

Stacking recompensa a los poseedores de tokens Stacks (STX) con bitcoins por brindar un valioso servicio a la red al bloquear sus tokens durante un tiempo determinado.

![](/img/stacking.png)

Stacking es una acción integrada, requerida por el mecanismo de "proof-of-transfer" (PoX). El mecanismo PoX es ejecutado por todos los mineros de la red Stacks 2.0.

:::info El algoritmo de consenso de staking se implementa como un contrato inteligente, usando [Clarity](../write-smart-contracts/). [Lea más sobre el contrato](../noteworthy-contracts/stacking-contract). :::

## Flujo del Stacking

El mecanismo de Stacking puede presentarse como un flujo de acciones:

![Flujo del Stacking](/img/stacking-illustration.png)

1. Realizar llamadas API para obtener detalles sobre el próximo ciclo de recompensas
2. Para una cuenta de Stacks específica, confirmar elegibilidad
3. Confirmar la dirección de recompensa de BTC y la duración del bloqueo
4. La transacción se transmite y los tokens STX se bloquean. Esto debe suceder antes de la fase de preparación del próximo ciclo de recompensas, los últimos 100 bloques de Bitcoin de la fase de recompensas en curso
5. El mecanismo de Staking ejecuta ciclos de recompensa y envía recompensas a la dirección de recompensa BTC establecida
6. Durante el período de bloqueo, se pueden obtener detalles sobre el tiempo de desbloqueo, recompensas y más
7. Una vez que pasa el período de bloqueo, los tokens son liberados y accesibles de nuevo
8. Muestra el historial de recompensas, incluyendo detalles como ganancias de ciclos de recompensa anteriores

:::info Ten en cuenta que la duración de un ciclo de recompensa es de ~2 semanas. Esta duración se basa en el tiempo de bloque objetivo de la red (10 minutos) y puede ser mayor a veces debido a [variaciones de tiempo de confirmación](https://www.blockchain.com/charts/median-confirmation-time) de la red bitcoin. :::

## Flujo de delegación Staking

El flujo de Staking es diferente para los casos de uso de la delegación:

![Delegated tacking flow](/img/stacking-delegation-illustration.png)

- Antes de que se pueda iniciar el Stacking para un poseedor de tokens, el delegador necesita que se le conceda permiso en nombre del propietario de la cuenta. El permiso está restringido a la cantidad máxima que el delegado puede delegar. La cantidad máxima no está limitada por los fondos disponibles y puede establecerse mucho más alta. Una cuenta sólo puede ser asociada con un solo delegador
- La cuenta tiene que definir la relación de delegación. Opcionalmente pueden restringir la dirección de recompensa de Bitcoin que debe ser utilizada para los pagos, y la altura del bloque de caducidad para el permiso, limitando así el tiempo que un delegador tiene permiso para delegar
- Los Delegadores deben bloquear Stacks de diferentes cuentas ("fase de pool") hasta que alcancen la cantidad mínima de Stacks requeridos para participar en Stacking
- Una vez que un delegador bloquea suficientes tokens STX, pueden finalizar y comprometer su participación en el próximo ciclo de recompensas
- Ciertas relaciones de delegación pueden permitir al titular de STX recibir el pago directamente del minero (paso 5/6)
- La terminación de la relación con la delegación puede ocurrir automáticamente según las reglas de vencimiento establecidas o mediante la revocación activa de los derechos de delegación

## Minería de PoX

PoX mining is a modification of Proof-of-Burn (PoB) mining, where instead of sending the committed Bitcoin to a burn address, it's transferred to eligible STX holders that participate in the stacking protocol.

:::note
A PoX miner can only receive newly minted STX tokens when they transfer Bitcoin to eligible owners of STX tokens
:::

![Mining flow](/img/pox-mining-flow.png)

Miners run Stacks nodes with mining enabled to participate in the PoX mechanism. The node implements the PoX mechanism, which ensures proper handling and incentives through four key phases:

- Registration: miners register for a future election by sending consensus data to the network
- Commitment: registered miners transfer Bitcoin to participate in the election. Committed BTC are sent to a set participating STX token holders
- Election: a verifiable random function chooses one miner to write a new block on the Stacks blockchain
- Assembly: the elected miner writes the new block and collects rewards in form of new STX tokens

## Token holder eligibility

Stacks (STX) token holders don't automatically receive stacking rewards. En su lugar, deben hacer:

- Commit to participation before a reward cycle begins
- Commit the minimum amount of STX tokens to secure a reward slot, or pool with others to reach the minimum
- Bloquear tokens STX para un período específico
- Provide a supported Bitcoin address to receive rewards (native segwit is not supported)

The following diagram describes how the minimum STX tokens per slot is determined. More information on [dynamic minimums for stacking](https://stacking.club) is available at stacking.club.

![Dynamic minimum for individual eligibility](/img/stacking-dynamic-minimum.png)

Token holders have a variety of providers and tools to support their participation in Stacking. The Stacks website contains a [list of stacking providers and pools](https://stacks.org/stacking#earn).

## Stacking in the PoX consensus algorithm

Stacking is a built-in capability of PoX and occurs through a set of actions on the Stacks blockchain. The [full proof-of-transfer implementation details](https://github.com/stacks-network/stacks-blockchain/blob/develop/sip/sip-007-stacking-consensus.md) are in SIP-007. Below is a summary of the most relevant actions of the algorithm.

![PoX cycles](/img/pox-cycles.png)

- Stacking happens over reward cycles with a fixed length. In each reward cycle, a set of Bitcoin addresses associated with stacking participants receive BTC rewards
- Un ciclo de recompensa consta de dos fases: preparar y recompensar
- During the prepare phase, miners decide on an anchor block and a reward set. Mining any descendant forks of the anchor block requires transferring mining funds to the appropriate reward addresses. The reward set is the set of Bitcoin addresses which are eligible to receive funds in the reward cycle
- Miners register as leader candidates for a future election by sending a key transaction that burns cryptocurrency. The transaction also registers the leader's preferred chain tip (must be a descendant of the anchor block) and commitment of funds to 2 addresses from the reward set
- Token holders register for the next rewards cycle by broadcasting a signed message that locks up associated STX tokens for a protocol-specified lockup period, specifies a Bitcoin address to receive the funds, and votes on a Stacks chain tip
- Multiple leaders can commit to the same chain tip. The leader that wins the election and the peers who also burn for that leader collectively share the reward, proportional to how much each one burned
- Token holders' locked up tokens automatically unlock as soon as the lockup period finishes

## Bitcoin address

:::danger You must provide a BTC address in one of two formats:

* [Legacy (P2PKH)](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash), which starts with `1`.

* [Segregated Witness / Segwit (P2SH)](https://en.bitcoin.it/wiki/Pay_to_script_hash), which starts with `3`. The "Native Segwit" format (which starts with `bc1`), for example, is not supported. :::

The Stacking contract needs a special format for the Bitcoin address (the reward address). This is required to ensure that miners are able to correctly construct the Bitcoin transaction containing the reward address.

The address must be specified in the following format using the Clarity language:

```clar
;; a tuple of a version and hashbytes buffer
(pox-addr (tuple (version (buff 1)) (hashbytes (buff 20))))
```

The `version` buffer must represent what kind of bitcoin address is being submitted. It can be one of the following:

```js
SerializeP2PKH  = 0x00, // hash160(public-key), same as bitcoin's p2pkh
SerializeP2SH   = 0x01, // hash160(multisig-redeem-script), same as bitcoin's multisig p2sh
SerializeP2WPKH = 0x02, // hash160(segwit-program-00(p2pkh)), same as bitcoin's p2sh-p2wpkh
SerializeP2WSH  = 0x03, // hash160(segwit-program-00(public-keys)), same as bitcoin's p2sh-p2wsh
```

The `hashbytes` are the 20 hash bytes of the bitcoin address. You can obtain that from a bitcoin library, for instance using [`bitcoinjs-lib`](https://github.com/bitcoinjs/bitcoinjs-lib):

```js
const btc = require('bitcoinjs-lib');
console.log(
  '0x' + btc.address.fromBase58Check('1C56LYirKa3PFXFsvhSESgDy2acEHVAEt6').hash.toString('hex')
);
```

## Choosing the right Stacking strategy

[Here](https://blog.stacks.co/stacking-strategy) is an interesting article that may help you choose the right Stacking stategy.


## Where to Stacks?

You can Stack on your own, on a pool or on an exchange:
### Stacking on your own

Stacking on your own is non-custodial.

Stacking on your own requires a protocol minimum (amount changes but about 100,000 STX).

[Hiro Wallet](https://www.hiro.so/wallet) allows stacking on your own.

### Stacking on a pool

Stacking on a pool allows Stacking without the requirement of the protocol minumum.

Some available pools are:

| Pool                                                | Tipo          | Pays rewards in | Fee | Minimum amount |
| --------------------------------------------------- | ------------- |:---------------:| --- |:--------------:|
| [Friedger's Pool](https://pool.friedger.de/)        | Non custodial |   STX or xBTC   | No  |     40 STX     |
| [Planbetter](https://planbetter.org/)               | Non custodial |       BTC       | 5%  |    200 STX     |
| [Stacked](https://staking.staked.us/stacks-staking) | Non custodial |       BTC       |     |  100,000 STX   |
| [Xverse](https://www.xverse.app/)                   | Non custodial |       BTC       | No  |    100 STX     |

### Stacking on an exchange

Stacking on an exchange is custodial, meaning you are trusting the exchange with your Stacks.

Several exchanges allow Stacking directly on their sites. Examples are [Okcoin](https://www.okcoin.com) and [Binance](https://www.binance.com/en/staking)

## Stacking statistics

You can view all sorts of Stacking data and statistics on [Stacking Club](https://stacking.club)