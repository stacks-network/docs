---
title: Akun
description: Panduan untuk akun Stacks 2.0
sidebar_position: 5
---

## Pengantar

Akun dalam Stacks 2.0 adalah suatu entitas yang memiliki aset, seperti token Stacks (STX). Suatu akun memiliki alamat, kunci rahasia, nonce, dan satu atau lebih saldo aset.

:::tip The encryption algorithm used in Stacks 2.0 is **[secp256k1](https://en.bitcoinwiki.org/wiki/Secp256k1)**.

Additionally, [Ed25519](https://ed25519.cr.yp.to/) is also used just for the VRF (Verifiable Random Function). :::

Aset tidak bisa meninggalkan suatu akun tanpa tindakan dari pemilik akun. Semua perubahan terhadap aset (dan saldo dari akun) membutuhkan transaksi terkait.

:::tip
The transaction type doesn't need to be a token transfer - contract deploy and contract call transactions can change the balances of an account
:::

## Pembuatan

Suatu akun dibuat dari frasa 24-kata mnemonic. Hal ini sering disebut juga sebagai **frasa seed**. Frasa seed memberikan akses ke akun Stacks 2.0.

:::danger
If the seed phrase is lost, access to the associated account cannot be restored. Tidak ada seseorang atau organisasi, termasuk Blockstacks, yang dapat memulihkan frasa seed yang hilang.
:::

Cara paling mudah untuk membuat sebuah akun Stacks 2.0 baru adalah dengan [Stacks CLI](https://github.com/hirosystems/stacks.js/tree/master/packages/cli):

```bash
# install CLI globally
npm install --global @stacks/cli

# generate a new account and store details in a new file
# '-t' option makes this a testnet account
stx make_keychain -t > cli_keychain.json
```

`make_keychain` membuat file berikut:

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

| Bidang               | Deskripsi                                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mnemonic`           | Sebuah frasa seed 240kata digunakan untuk mengakses akun, dibuat menggunakan [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) dengan 256 bit entropi |
| `keyInfo.privateKey` | Kunci privat untuk akun. Dibutuhkan untuk transfer token dan sering dirujuk sebagai `senderKey`                                                                             |
| `keyInfo.address`    | Alamat Stacks untuk akun                                                                                                                                                    |
| `keyInfo.btcAddress` | Alamat BTC yang sesuai untuk akun.                                                                                                                                          |
| `keyInfo.wif`        | Kunci privat btcAddress dalam format terkompresi.                                                                                                                           |
| `keyInfo.index`      | Nonce untuk akun, dimulai dari 0                                                                                                                                            |

Perlu dicatat bahwa akun baru secara otomatis tersedia untuk setiap kunci privat. Tidak perlu memulai proses pembuatan akun di blockchain Stacks 2.0.

:::tip Addresses are created by generating the [RIPEMD-160 hash](https://en.wikipedia.org/wiki/RIPEMD#RIPEMD-160_hashes) of the [SHA256](https://en.bitcoinwiki.org/wiki/SHA-256) of the public key. Alamat BTC dikodekan dengan [Base58Check](https://en.bitcoin.it/wiki/Base58Check_encoding). Untuk alamat Stacks, [c32check](https://github.com/stacks-network/c32check) digunakan. Menurunkan suatu alamat dari kunci publik dapat dilakukan tanpa adanya akses internet, contohnya menggunakan metode c32check `c32addressDecode`. :::

Sebagai alternatif untuk pembuatan CLI, pustaka [Transaksi Stacks JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) dapat digunakan:

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
  TransactionVersion.Testnet // remove for Mainnet addresses
);
```

Alternatif lain dapat menggunakan [stacks-gen](https://github.com/psq/stacks-gen). Alat ini dapat membuat semua kunci yang dibutuhkan dalam satu tempat, termasuk nilai yang dibutuhkan untuk memanggil kontrak stacking, dan juga kunci WIF untuk digunakan dengan `bitcoind`.

#### prasyarat stacks-gen

Install [npx](https://github.com/npm/npx) jika belum terpasang. (npx akan mengecek apakah `<command>` sudah ada di \$PATH, atau di daftar file biner proyek lokal dan menjalankannya. Jika `<command>` tidak ditemukan, program akan terpasang sebelum dijalankan).

```
npm install -g npx
```

#### penggunaan stacks-gen

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

Dokumentasi lengkap terdapat di [stacks-gen](https://github.com/psq/stacks-gen).

## Melakukan query

### Mendapatkan saldo dan nonce Stacks (STX)

Saldo dan nonce STX dapat diperoleh melalui [`GET /v2/accounts/<stx_address>`](https://docs.hiro.so/api#operation/get_account_info) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/v2/accounts/<stx_address>'
```

Contoh respon:

```js
{
    "balance": "0x0000000000000000002386f26f3f40ec",
    "nonce": 17
}
```

:::tip
The balance string represents an unsigned 128-bit integer (big-endian) in hex encoding
:::

### Dapatkan semua saldo token

Semua saldo token dapat diperoleh melalui [`GET /extended/v1/address/<stx_address>/balances`](https://docs.hiro.so/api#operation/get_account_balance) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/address/<stx_address>/balances'
```

Contoh respon:

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

:::tip Stacks accounts cannot hold bitcoins. Cara terbaik untuk mendapatkan saldo BTC yang sesuai adalah dengan mendapatkan alamat BTC dari alamat Stacks (menggunakan [`c32check`](https://github.com/stacks-network/c32check#c32tob58-b58toc32)) dan kueri jaringan Bitcoin. :::

### Dapatkan semua event aset

Semua event aset yang terkait dengan akun dapat diperoleh melalui [`GET /extended/v1/address/<stx_address>/ aset`](https://docs.hiro.so/api#operation/get_account_balance) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/address/<stx_address>/assets'
```

Contoh respon:

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
