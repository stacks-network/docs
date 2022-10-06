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

Le champ `adresse` est l'adresse du réseau de test de Stacks, et le champ `amount` est le nombre de microSTX à y accorder dans le bloc genèse. Les adresses des clés privées utilisées dans le tutoriel ci-dessous sont déjà ajoutées.

### Publiez votre contrat

En supposant que le réseau de test fonctionne, nous pouvons publier notre contrat de `kv-store`.

Dans un autre terminal (ou explorateur de fichiers), vous pouvez déplacer le `tx1.bin` généré plus tôt, vers le mempool:

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx1.bin http://localhost:20443/v2/transactions
```

Dans la fenêtre de terminal exécutant le testnet, vous pouvez observer les réactions de la machine d'état.

### Lecture depuis / Écriture vers le contrat

Maintenant que notre contrat a été publié sur la chaîne, nous allons essayer de soumettre quelques transactions en lecture / écriture. Nous allons commencer par essayer de lire la valeur associée à la clé `foo`.

Pour cela, nous utiliserons la sous-commande :

```bash
cargo run --bin blockstack-cli contract-call --help
```

Avec les paramètres suivants:

```bash
cargo run --bin blockstack-cli contract-call b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 500 1 ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH kv-store get-value -e \"foo\" --testnet | xxd -r -p > tx2.bin
```

`contract` génère et signe une transaction d'appels contractuels.

Nous pouvons soumettre la transaction en la déplaçant dans le chemin de mempool :

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx2.bin http://localhost:20443/v2/transactions
```

De même, nous pouvons générer une transaction qui définirait la clé `foo` à la valeur `bar`:

```bash
cargo run --bin blockstack-cli contract-call b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 500 2 ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH kv-store set-value -e \"foo\" -e \"bar\" --testnet | xxd -r -p > tx3.bin
```

Et soumettez-le en le déplaçant sur le chemin de mempool :

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx3.bin http://localhost:20443/v2/transactions
```

Enfin, nous pouvons effectuer une troisième transaction, en lisant à nouveau la clé `foo` . pour s'assurer que la transaction précédente a bien mis à jour la machine d'état :

```bash
cargo run --bin blockstack-cli contract-call b8d99fd45da58038d630d9855d3ca2466e8e0f89d3894c4724f0efc9ff4b51f001 500 3 ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH kv-store get-value -e \"foo\" --testnet | xxd -r -p > tx4.bin
```

Et soumettez cette dernière transaction en la déplaçant dans le chemin de mempool :

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @./tx4.bin http://localhost:20443/v2/transactions
```

Félicitations, vous pouvez maintenant [écrire vos propres contrats intelligents avec Clarity](write-smart-contracts/).
