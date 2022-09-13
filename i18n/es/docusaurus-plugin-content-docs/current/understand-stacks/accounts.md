---
title: Cuentas
description: Guía de cuentas de Stacks 2.0
sidebar_position: 5
---

## Introducción

Las cuentas Stacks 2.0 son entidades que poseen assets, como los tokens de Stacks (STX). Una cuenta contiene una dirección, clave privada, un nonce, y uno o más saldos de activos.

:::tip El algoritmo de cifrado utilizado en Stacks 2.0 es **[secp256k1](https://en.bitcoinwiki.org/wiki/Secp256k1)**.

Adicionalmente, [Ed25519](https://ed25519.cr.yp.to/) también se utiliza solo para la VRF (función aleatoria verificable). :::

Los assets no pueden dejar una cuenta sin una acción del propietario de la cuenta. Todos los cambios en los assets (y los saldos de la cuenta) requieren una transacción correspondiente.

:::tip
El tipo de transacción no necesita ser una transferencia de tokens - el deploy del contrato y las llamadas de contrato pueden cambiar los balances de una cuenta
:::

## Creación

Una cuenta se genera a partir de una frase mnemónica de 24 palabras. Esto a menudo se le conoce como **la frase semilla**. La frase semilla proporciona acceso a las cuentas Stacks 2.0.

:::danger
Si la frase de semilla se pierde, el acceso a la cuenta asociada no se puede recuperar. Ninguna persona u organización, incluyendo Blockstack, puede recuperar una frase de semilla perdida.
:::

La forma más fácil de generar una nueva cuenta de Stacks 2.0 es utilizar la [CLI de Stacks](https://github.com/hirosystems/stacks.js/tree/master/packages/cli):

```bash
# instalar CLI globalmente
npm install --global @stacks/cli

# generate a new account and store details in a new file
# '-t' option makes this a testnet account
stx make_keychain -t > cli_keychain.json
```

`make_keychain` crea la siguiente línea:

```js
{
  "mnemonic": "aaa bbb ccc ddd ...",
  "keyInfo": {
    "privateKey": "5a3f1f15245bb3fb...",
    "address": "STJRM2AMVF90ER6G3RW1QTF85E3HZH37006D5ER1",
    "btcAddress": "biwSd6KTEvJcyX2R8oyfgj5REuLzczMYC1",
    "wif": "L4HXn7PLmzoNW...",
    "index": 0
  }
}
```

:::tip Check out the [Stacks CLI reference](https://docs.hiro.so/references/stacks-cli) for more details :::

| Campo                | Descripción                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mnemonic`           | Una frase semilla de 24 palabras utilizada para acceder a la cuenta, generada usando [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) con 256 bits de entropía |
| `keyInfo.privateKey` | Clave privada para la cuenta. Requerida para transferencias de tokens y a menudo llamada como `senderKey`                                                                             |
| `keyInfo.address`    | Dirección Stack para la cuenta                                                                                                                                                        |
| `keyInfo.btcAddress` | Dirección BTC correspondiente para la cuenta.                                                                                                                                         |
| `keyInfo.wif`        | Clave privada de btcAddress en formato comprimido.                                                                                                                                    |
| `keyInfo.index`      | Nonce para la cuenta, iniciando en 0                                                                                                                                                  |

Ten en cuenta que existe una nueva cuenta automáticamente para cada nueva clave privada. No hay necesidad de instanciar manualmente una cuenta en la blockchain Stacks 2.0.

:::tip Las direcciones se crean generando el [hash RIPEMD-160](https://en.wikipedia.org/wiki/RIPEMD#RIPEMD-160_hashes) del [SHA256](https://en.bitcoinwiki.org/wiki/SHA-256) de la clave pública. Las direcciones BTC están codificadas con [Base58Check](https://en.bitcoin.it/wiki/Base58Check_encoding). Para direcciones Stacks, se utiliza [c32check](https://github.com/stacks-network/c32check). Se puede obtener una dirección de una clave pública sin acceso a Internet, por ejemplo utilizando el método c32check `c32addressDecode`. :::

Alternativamente a la creación con CLI, se puede utilizar la librería [Stacks Transactions JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions):

```js
import {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
} from '@stacks/transactions';

const privateKey = makeRandomPrivKey();

// Obtener clave pública de privada
const publicKey = getPublicKey(privateKey);

const stacksAddress = getAddressFromPrivateKey(
  privateKeyToString(privateKey),
  TransactionVersion: Testnet // quitar esta línea para direcciones Mainnet
);
```

Una segunda alternativa sería utilizar [stacks-gen](https://github.com/psq/stacks-gen). Esta herramienta generará todas las claves que necesita en un solo lugar, incluyendo los valores necesarios para llamar al contrato de staking, y también una clave WIF para usar con `bitcoind`.

#### prerrequisito de stacks-gen

Instalar [npx](https://github.com/npm/npx) si no está instalado. (npx comprobará si `<command>` existe en \$PATH, o en los binarios locales del proyecto y lo ejecuta. Si `<command>` no se encuentra, se instalará antes de la ejecución).

```
npm install -g npx
```

#### uso de stacks-gen

```
npx -q stacks-gen sk --testnet

{
  "phrase": "guide air pet hat friend anchor harvest dog depart matter deny awkward sign almost speak short dragon rare private fame depart elevator snake chef",
  "private": "0351764dc07ee1ad038ff49c0e020799f0a350dd0769017ea09460e150a6401901",
  "public": "022d82baea2d041ac281bebafab11571f45db4f163a9e3f8640b1c804a4ac6f662",
  "stacks": "ST16JQQNQXVNGR8RZ1D52TMH5MFHTXVPHRV6YE19C",
  "stacking": "{ hashbytes: 0x4d2bdeb7eeeb0c231f0b4a2d5225a3e3aeeed1c6, version: 0x00 }",
  "btc": "mnYzsxxW271GkmyMnRfiopEkaEpeqLtDy8",
  "wif": "cMh9kwaCEttgTQYkyMUYQVbdm5ZarZdBHErcq7mXUChXXCo7CFEh"
}
```

:::tip El objeto stacking con hashbytes y una versión representa la dirección bitcoin derivada de la dirección de pilas. Lea más sobre el [formato de dirección bitcoin](stacking#bitcoin-address). :::

La documentación completa está disponible en [stacks-gen](https://github.com/psq/stacks-gen).

## Consultas

### Obtener el balance de Stacks (STX) y nonce

El saldo STX y nonce se pueden obtener a través del endpoint [`GET /v2/accounts/<stx_address>`](https://docs.hiro.so/api#operation/get_account_info):

```bash
# para mainnet, reemplazar `testnet` por `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/v2/accounts/<stx_address>'
```

Ejemplo de respuesta:

```js
{
    "balance": "0x0000000000000000002386f26f3f40ec",
    "nonce": 17
}
```

:::tip
La cadena de balance representa un entero sin signo de 128-bit (big-endian) en codificación hexadecimal
:::

### Obtener los balances de todos los tokens

Todos los balances de tokens se pueden obtener a través del endpoint [`GET /extended/v1/address/<stx_address>/balances`](https://docs.hiro.so/api#operation/get_account_balance):

```bash
# para mainnet, reemplazar `testnet` por `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/address/<stx_address>/balances'
```

Ejemplo de respuesta:

```js
{
    "stx": {
        "balance": "0",
        "total_sent": "0",
        "total_received": "0"
    },
    "fungible_tokens": {},
    "non_fungible_tokens": {}
}
```

:::tip Las cuentas Stacks no pueden contener bitcoins. La mejor manera de obtener los balances BTC correspondientes es derivar la dirección BTC de la dirección Stacks (usando [`c32check`](https://github.com/stacks-network/c32check#c32tob58-b58toc32)) y consultar la red Bitcoin. :::

### Obtener todos los eventos de los asset

Todos los eventos de asset asociados con la cuenta se pueden obtener a través del endpoint [`GET /extended/v1/address/<stx_address>/assets`](https://docs.hiro.so/api#operation/get_account_balance):

```bash
# para mainnet, reemplazar `testnet` por `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/address/<stx_address>/balances'
```

Ejemplo de respuesta:

```js
{
    "limit": 20,
    "offset": 0,
    "total": 0,
    "results": [
        {
            "event_index": 5,
            "event_type": "non_fungible_token_asset",
            "asset": {
                "asset_event_type": "transfer",
                "asset_id": "ST2W14YX9SFVDB1ZGHSH40CX1YQAP9XKRAYSSVYAG.hello_world::hello-nft",
                "sender": "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR",
                "recipient": "SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G",
                "value": {
                    "hex": "0x0100000000000000000000000000000001",
                    "repr": "u1"
                }
            }
        },
        {
            "event_index": 3,
            "event_type": "fungible_token_asset",
            "asset": {
                "asset_event_type": "mint",
                "asset_id": "ST2W14YX9SFVDB1ZGHSH40CX1YQAP9XKRAYSSVYAG.hello_world::novel-token-19",
                "sender": "",
                "recipient": "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR",
                "amount": "12"
            }
        }
    ]
}
```
