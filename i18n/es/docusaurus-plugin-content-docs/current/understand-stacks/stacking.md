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

La minería PoX es una modificación de la minería Proof-of-Burn (PoB) en lugar de enviar el bitcoin entregado a una dirección de quemado, se transfiere a los poseedores elegibles de STX que participan en el protocolo de Stacking.

:::note
Un minero de PoX solo puede recibir tokens STX recién mintados cuando transfieren bitcoins a los dueños elegibles de tokens STX
:::

![Mining flow](/img/pox-mining-flow.png)

Los mineros ejecutan los nodos de Stacks con minería habilitada para participar en el mecanismo PoX. El nodo implementa el mecanismo PoX, que garantiza un manejo adecuado e incentivos a través de cuatro fases clave:

- Registro: los mineros se registran para una futura elección enviando datos de consenso a la red
- Compromiso: los mineros registrados transfieren Bitcoin para participar en la elección. Los BTC comprometidos se envían a un conjunto titulares de tokens STX participantes
- Elección: una función aleatoria verificable elige un minero para escribir un nuevo bloque en la blockchain de Stacks
- Ensamblado: el minero elegido escribe el nuevo bloque y recolecta recompensas en forma de nuevos tokens STX

## Elegibilidad del poseedor del token

Los poseedores de tokens Stacks (STX) no reciben automáticamente recompensas de Stacking. En su lugar, deben hacer:

- Comprometerse a participar antes de que comience un ciclo de recompensas
- Compromete la cantidad mínima de tokens STX para asegurar un slot de recompensas, o agrupe con otros para alcanzar el mínimo
- Bloquear tokens STX para un período específico
- Proporcionar una dirección de Bitcoin compatible para recibir recompensas (segwit nativo no es compatible)

El siguiente diagrama describe cómo se determinan los tokens mínimos de STX por slot. Más información sobre [mínimos dinámicos para stacking](https://stacking.club) está disponible en stacking.club.

![Dynamic minimum for individual eligibility](/img/stacking-dynamic-minimum.png)

Los poseedores de token tienen una variedad de proveedores y herramientas para apoyar su participación en Stacking. El sitio web de Stacks contiene una [lista de proveedores de stacking y pools](https://stacks.org/stacking#earn).

## Staking en el algoritmo de consenso de PoX

El Stacking es una capacidad integrada de PoX y se produce a través de un conjunto de acciones en la blockchain de Stacks. Los [detalles completos de la implementación de proof-of-transfer](https://github.com/stacks-network/stacks-blockchain/blob/develop/sip/sip-007-stacking-consensus.md) están en SIP-007. A continuación se muestra un resumen de las acciones más relevantes del algoritmo.

![PoX cycles](/img/pox-cycles.png)

- El Stacking ocurre sobre ciclos de recompensa con una duración fija. En cada ciclo de recompensa, un conjunto de direcciones de Bitcoin asociadas con los participantes de staking reciben recompensas BTC
- Un ciclo de recompensa consta de dos fases: preparar y recompensar
- Durante la fase de preparación, los mineros deciden un bloque de anclaje y un conjunto de recompensas. Minar cualquier bifurcación descendiente del bloque ancla requiere transferir fondos de minería a las direcciones de recompensa apropiadas. El conjunto de recompensas es el conjunto de direcciones de Bitcoin que son elegibles para recibir fondos en el ciclo de recompensa
- Los mineros se registran como candidatos líderes para una futura elección enviando una transacción clave que quema criptomoneda. La transacción también registra la sugerencia de cadena preferida del líder (debe ser un descendiente del bloque ancla) y los fondos comprometidos a 2 direcciones del conjunto de recompensas
- Los poseedores de token se registran para el próximo ciclo de recompensas mediante la transmición un mensaje firmado que bloquea los tokens STX asociados durante un período de bloqueo especificado en el protocolo, especifica una dirección de Bitcoin para recibir los fondos, y vota en el tip de la cadena de Stacks
- Múltiples líderes pueden comprometerse con la misma tip de la cadena. El líder que gana la elección y los compañeros que también queman por ese líder comparten colectivamente la recompensa, proporcional a cuánto se quemó cada uno
- Los tokens bloqueadas de los tenedores de tokens se desbloquean automáticamente tan pronto como finaliza el período de bloqueo

## Dirección de Bitcoin

:::danger Debes proporcionar una dirección BTC en uno de dos formatos:

* [Legacy (P2PKH)](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash), que comienza con `1`.

* [ Segregated Witness / Segwit (P2SH)](https://en.bitcoin.it/wiki/Pay_to_script_hash), que comienza con `3`. El formato "Native Segwit" (que comienza con `bc1`), por ejemplo, no es compatible. :::

El contrato de stacking necesita un formato especial para la dirección de Bitcoin (la dirección de recompensa). Esto es necesario para asegurar que los mineros puedan construir correctamente la transacción de Bitcoin que contiene la dirección de recompensa.

La dirección debe especificarse en el siguiente formato utilizando el lenguaje de Clarity:

```clar
;; una tupla de una versión y buffer de hashbytes
(pox-addr (tuple (versión (buff 1)) (hashbytes (buff 20))))
```

La `versión` del búfer debe representar qué tipo de dirección de bitcoin está siendo enviada. Puede ser uno de los siguientes:

```js
SerializeP2PKH = 0x00, // hash160(public-key), igual que p2pkh de bitcoin
SerializeP2SH = 0x01, // hash160(multisig-redeem-script), al igual que el multisig p2sh de bitcoin,
SerializeP2WPKH = 0x02, // hash160(segwit-program-00(p2pkh)), igual que el p2sh-p2wpkh
SerializeP2WSH = 0x03, // hash160(segwit-program-00(public-keys)), igual que el p2sh-p2wsh de bitcoin
```

Los `hashbytes` son los 20 hash bytes de la dirección bitcoin. Puedes obtenerlo de una librería de bitcoin, por ejemplo usando [`bitcoinjs-lib`](https://github.com/bitcoinjs/bitcoinjs-lib):

```js
const btc = require('bitcoinjs-lib');
console.log(
  '0x' + btc.address.fromBase58Check('1C56LYirKa3PFXFsvhSESgDy2acEHVAEt6').hash.toString('hex')
);
```

## Elegir la estrategia de Stacking adecuada

[Aquí](https://blog.stacks.co/stacking-strategy) hay un artículo interesante que puede ayudarle a elegir la estrategia de staking adecuada.


## Where to Stacks?

Puedes acumular solo, en un pool o en un exchange:
### Staking por tu cuenta

Staking por su cuenta no es custodial.

Staking por su cuenta requiere un mínimo de protocolo (cantidad cambia pero alrededor de 100.000 STX).

[Hiro Wallet](https://www.hiro.so/wallet) permite hacer staking por tu cuenta.

### Stacking on a pool

Hacer stacking en un pool permite acumular sin el requisito del mínimo de protocolo.

Algunos pools disponibles son:

| Pool                                                | Tipo          | Pays rewards in | Fee | Cantidad mínima |
| --------------------------------------------------- | ------------- |:---------------:| --- |:---------------:|
| [Friedger's Pool](https://pool.friedger.de/)        | Non custodial |   STX or xBTC   | No  |     40 STX      |
| [Planbetter](https://planbetter.org/)               | Non custodial |       BTC       | 5%  |     200 STX     |
| [Stacked](https://staking.staked.us/stacks-staking) | Non custodial |       BTC       |     |   100,000 STX   |
| [Xverse](https://www.xverse.app/)                   | Non custodial |       BTC       | No  |     100 STX     |

### Hacer Staking en un exchange

Hacer Stacking en un exchange es custodial, lo que significa que confías tus Stacks al exchange.

Varios exchanges permiten hacer stacking directamente en sus sitios. Ejemplos son [Okcoin](https://www.okcoin.com) y [Binance](https://www.binance.com/en/staking)

## Estadísticas de stacking

Puedes ver todo tipo de datos de stacking y estadísticas en [Stacking Club](https://stacking.club)