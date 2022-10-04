---
title: Blochain
description: Blockchain Stacks
sidebar_position: 6
---

Vous trouverez ci-dessous un guide pour commencer à travailler localement avec la blockchain.

Le dépôt de code est [ici](https://github.com/stacks-network/stacks-blockchain).

## Commencer avec la Blockchain Stacks

### Download and build stacks-blockchain

La première étape est de s'assurer que Rust et le logiciel de support sont installés.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

:::info
Pour compiler sous Windows, suivez les instructions de l'installateur de rustup sur https://rustup.rs/
:::

From there, you can clone the Stacks Blockchain repository:

```bash
git clone --depth=1 https://github.com/stacks-network/stacks-blockchain.git

cd stacks-blockchain
```

Puis construisez le projet :

```bash
cargo build
```

Exécutez les tests :

```bash
cargo test testnet  -- --test-threads=1
```

### Encoder et signer les transactions

Ici, nous allons générer une paire de clés qui sera utilisée pour signer les opérations à venir :

```bash
cargo run --bin blockstack-cli generate-sk --testnet

# Output
# {
#  secretKey: "b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001",
#  publicKey: "02781d2d3a545afdb7f6013a8241b9e400475397516a0d0f76863c6742210539b5",
#  stacksAddress: "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH"
# }
```

Ce pavé numérique est déjà enregistré dans le fichier `testnet-follower-conf.toml` , donc il peut être utilisé comme présenté ici.

Nous allons interagir avec le contrat simple suivant `kv-store`. In our examples, we will assume this contract is saved to `./kv-store.clar`:

```scheme
(define-map store { key: (string-ascii 32) } { value: (string-ascii 32) })

(define-public (get-value (key (string-ascii 32)))
    (match (map-get? store { key: key })
        entry (ok (get value entry))
        (err 0)))

(define-public (set-value (key (string-ascii 32)) (value (string-ascii 32)))
    (begin
        (map-set store { key: key } { value: value })
        (ok true)))
```

Nous voulons publier ce contrat sur la chaîne, puis émettre des transactions qui interagissent avec lui en transférant des clés et en récupérer des valeurs, afin que nous puissions observer la lecture et l'écriture.

Notre première étape est de générer et de signer, à l'aide de votre clé privée, la transaction qui publiera le contrat `kv-store`. Pour cela, nous utiliserons la sous-commande `blockstack-cli` qui a l'usage suivant :

```bash
blockstack-cli (options) publish [publisher-secret-key-hex] [fee-rate] [nonce] [contract-name] [file-name.clar]
```

Avec les paramètres suivants:

```bash
cargo run --bin blockstack-cli publish b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 515 0 kv-store ./kv-store.clar --testnet
```

Le `515` correspond aux frais de transaction, libellés en microSTX. Pour l'instant, le réseau de test nécessite un microSTX par octet minimum, et cette transaction devrait être inférieure à 515 octets. Le troisième argument `0` est une nonce, qui doit être augmenté de façon monotonique à chaque nouvelle transaction.

Cette commande affichera le **format binaire** de la transaction. Dans notre cas, nous voulons récupérer cette sortie et la copier dans un fichier qui sera utilisé plus tard dans ce tutoriel.

```bash
cargo run --bin blockstack-cli publish b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 515 0 kv-store ./kv-store.clar --testnet | xxd -r -p > tx1.bin
```

### Exécuter le testnet

Vous pouvez observer la machine d'état en action (localement) en exécutant :

```bash
cargo stacks-node start --config=./testnet/stacks-node/conf/testnet-follower-conf.toml
```

`testnet-follower-conf.toml` est un fichier de configuration que vous pouvez utiliser pour mettre en place des balances genesis ou configurer des observateurs d'événements. Vous pouvez accorder à une adresse un solde initial du compte en ajoutant les entrées suivantes:

```
[[ustx_balance]]
address = "ST2VHM28V9E5QCRD6C73215KAPSBKQGPWTEE5CMQT"
amount = 100000000
```

The `address` field is the Stacks testnet address, and the `amount` field is the number of microSTX to grant to it in the genesis block. The addresses of the private keys used in the tutorial below are already added.

### Publish your contract

Assuming that the testnet is running, we can publish our `kv-store` contract.

In another terminal (or file explorer), you can move the `tx1.bin` generated earlier, to the mempool:

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx1.bin http://localhost:20443/v2/transactions
```

In the terminal window running the testnet, you can observe the state machine's reactions.

### Reading from / Writing to the contract

Now that our contract has been published on chain, let's try to submit some read / write transactions. We will start by trying to read the value associated with the key `foo`.

To do that, we will use the subcommand:

```bash
cargo run --bin blockstack-cli contract-call --help
```

Avec les paramètres suivants:

```bash
cargo run --bin blockstack-cli contract-call b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 500 1 ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH kv-store get-value -e \"foo\" --testnet | xxd -r -p > tx2.bin
```

`contract-call` generates and signs a contract-call transaction.

We can submit the transaction by moving it to the mempool path:

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx2.bin http://localhost:20443/v2/transactions
```

Similarly, we can generate a transaction that would be setting the key `foo` to the value `bar`:

```bash
cargo run --bin blockstack-cli contract-call b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 500 2 ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH kv-store set-value -e \"foo\" -e \"bar\" --testnet | xxd -r -p > tx3.bin
```

And submit it by moving it to the mempool path:

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx3.bin http://localhost:20443/v2/transactions
```

Finally, we can issue a third transaction, reading the key `foo` again, for ensuring that the previous transaction has successfully updated the state machine:

```bash
cargo run --bin blockstack-cli contract-call b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 500 3 ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH kv-store get-value -e \"foo\" --testnet | xxd -r -p > tx4.bin
```

And submit this last transaction by moving it to the mempool path:

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx4.bin http://localhost:20443/v2/transactions
```

Congratulations, you can now [write your own smart contracts with Clarity](write-smart-contracts/).
