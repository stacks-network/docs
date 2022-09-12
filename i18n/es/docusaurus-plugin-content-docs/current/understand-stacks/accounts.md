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
Si la frase de semilla se pierde, el acceso a la cuenta asociada no se puede recuperar. No person or organization, including Blockstack, can recover a lost seed phrase.
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

Note that a new account automatically exists for each new private key. There is no need to manually instantiate an account on the Stacks 2.0 blockchain.

:::tip Addresses are created by generating the [RIPEMD-160 hash](https://en.wikipedia.org/wiki/RIPEMD#RIPEMD-160_hashes) of the [SHA256](https://en.bitcoinwiki.org/wiki/SHA-256) of the public key. BTC addresses are encoded with [Base58Check](https://en.bitcoin.it/wiki/Base58Check_encoding). For Stacks addresses, [c32check](https://github.com/stacks-network/c32check) is used. Deriving an address from a public key can be done without internet access, for instance using the c32check `c32addressDecode` method. :::

Alternativamente a la creación con CLI, se puede utilizar la librería [Stacks Transactions JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions):

```js
import {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
} from '@stacks/transactions';

const privateKey = makeRandomPrivKey();

// Get public key from private
const publicKey = getPublicKey(privateKey);

const stacksAddress = getAddressFromPrivateKey(
  privateKeyToString(privateKey),
  TransactionVersion. Testnet // remove for Mainnet addresses
);
```

Una segunda alternativa sería utilizar [stacks-gen](https://github.com/psq/stacks-gen). Esta herramienta generará todas las claves que necesita en un solo lugar, incluyendo los valores necesarios para llamar al contrato de staking, y también una clave WIF para usar con `bitcoind`.

#### stacks-gen prerequisite

Install [npx](https://github.com/npm/npx) if not already installed. (npx will check whether `<command>` exists in \$PATH, or in the local project binaries, and execute that. If `<command>` is not found, it will be installed prior to execution).

```
npm install -g npx
```

#### stacks-gen usage

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

:::tip The stacking object with hashbytes and a version represents the bitcoin address derived from the Stacks address. Read more about the [bitcoin address format](stacking#bitcoin-address). :::

Full documentation available at [stacks-gen](https://github.com/psq/stacks-gen).

## Consultas

### Get Stacks (STX) balance and nonce

STX balance and nonce can be obtained through the [`GET /v2/accounts/<stx_address>`](https://docs.hiro.so/api#operation/get_account_info) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/v2/accounts/<stx_address>'
```

Sample response:

```js
{
    "balance": "0x0000000000000000002386f26f3f40ec",
    "nonce": 17
}
```

:::tip
The balance string represents an unsigned 128-bit integer (big-endian) in hex encoding
:::

### Get all token balances

All token balances can be obtained through the [`GET /extended/v1/address/<stx_address>/balances`](https://docs.hiro.so/api#operation/get_account_balance) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/address/<stx_address>/balances'
```

Sample response:

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

:::tip Stacks accounts cannot hold bitcoins. The best way to obtain corresponding BTC balances is to derive the BTC address from the Stacks address (using [`c32check`](https://github.com/stacks-network/c32check#c32tob58-b58toc32)) and query the Bitcoin network. :::

### Get all asset events

All asset events associated with the account can be obtained through the [`GET /extended/v1/address/<stx_address>/assets`](https://docs.hiro.so/api#operation/get_account_balance) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/address/<stx_address>/assets'
```

Sample response:

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
