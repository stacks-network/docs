---
title: Système de nommage de la blockchain
description: Lier les noms d'utilisateur aux états hors chaîne
---

Le système de nommage Blockchain (BNS) est un système de réseau qui lie les noms d'utilisateur "à l'état hors chaîne" sans s'appuyer sur aucun point de contrôle central.

La blockchain de Stacks V1 a implémenté BNS à travers des opérations de noms de premier ordre (?). Dans les piles V2, le BNS a été remplacé par un contrat intelligent chargé durant le bloc genèse.

Les noms dans BNS ont trois propriétés :

- **Les noms sont globalement uniques.** Le protocole n'autorise pas les collisions de noms, et tous les noeuds de confiance résolvent un nom donné de la même façon.
- **Les noms sont en langage naturel.** Chaque nom est choisi par son créateur.
- **Les noms sont inaliénables.** Seul le propriétaire du nom peut changer l'état auquel il se réfère. Plus précisément, un nom est détenu par une ou plusieurs clés privées ECDSA.

La blockchain Stacks assure que la vue BNS de chaque nœud est synchronisée avec tous les autres nœuds du monde, de sorte que les requêtes sur un nœud seront les mêmes sur les autres nœuds. Les nœuds de la blockchain Stacks permettent au propriétaire d'un nom de se lier jusqu'à 40 Ko d'état hors chaîne à leur nom, qui sera répliquée à tous les autres nœuds de blockchain de Stacks via un réseau P2P.

La plus grande conséquence pour les développeurs est qu'en BNS, la lecture de l'état du nom est rapide et bon marché, mais l'écriture de l'état du nom est lente et coûteuse. C'est parce que l'enregistrement et la modification des noms nécessitent d'envoyer une ou plusieurs transactions à la blockchain sous-jacente, et les nœuds BNS ne les traiteront pas jusqu'à ce qu'ils soient suffisamment confirmés. Les utilisateurs et les développeurs ont besoin d'acquérir et de dépenser la cryptomonnaie requise (STX) pour envoyer des transactions BNS.

## Raison d'être des systèmes de nommage

Nous comptons sur les systèmes de nommage dans la vie de tous les jours, et ils jouent un rôle critique dans de nombreuses applications différentes. Par exemple, lorsque vous regardez un ami sur les réseaux sociaux, vous utilisez le système de nommage de la plate-forme pour lier leur nom à leur profil. Lorsque vous consultez un site Web, vous utilisez le Domain Name Service pour résoudre le nom d'hôte à l'adresse IP de son hôte. Lorsque vous consultez une branche Git, vous utilisez votre client Git pour résoudre le nom de la branche à un hachage de livraison. Lorsque vous regardez la clé PGP de quelqu'un sur un serveur de clés, vous résolvez son ID de clé à sa clé publique.

Quelles sortes de choses voulons-nous être vraies en ce qui concerne les noms? En BNS, les noms sont globalement uniques, les noms ont un sens humain, et les noms sont inaliénables. Cependant, si vous regardez ces exemples, vous verrez que chacun d'eux garantit seulement _deux_ de ces propriétés. Cela limite leur utilité.

- Dans le DNS et les médias sociaux, les noms sont globalement uniques et lisibles par l'homme, mais pas uniques. L'opérateur système a le dernier mot l'appartenance de chaque nom.

  - **Problème**: Les clients doivent faire confiance au système pour faire le bon choix dans ce qu'un nom donné signifie. Cela inclut la confiance que personne d'autre que les administrateurs système peuvent apporter ces modifications.

- Dans Git, les noms de branches sont en langage humain et irrévocables, mais pas globalement uniques. Deux nœuds Git différents peuvent avoir le même nom de branche appartenant à différents dépôt non liés.

  - **Problème**: Puisque les noms peuvent faire référence à un état conflictuel, les développeurs doivent trouver un autre mécanisme pour résoudre les ambiguïtés. Dans le cas de Gitit , l'utilisateur doit intervenir manuellement.

- En PGP, les noms sont des clés d'identification. Ils sont uniques au niveau mondial et sont détenus de manière cryptographique, mais pas lisibles par l'homme. Les identifiants de clés PGP sont dérivés des clés qu'ils référencent.
  - **Problème**: Ces noms sont difficiles à retenir pour la plupart des utilisateurs puisqu'ils ne transmettent pas d'informations sémantiques relatives à leur utilisation dans le système.

Les noms BNS ont les trois propriétés et aucun de ces problèmes. Cela en fait un outil puissant pour construire toutes sortes d'applications réseau. Avec BNS, nous pouvons faire ce qui suit et plus:

- Construire des services de noms de domaine où les noms de domaine ne peuvent pas être détournés.
- Construire des plateformes de réseaux sociaux où les noms d'utilisateurs ne peuvent pas être volés par des hameçonneurs.
- Construire des systèmes de contrôle de version où les branches du dépôt ne sont pas en conflit.
- Construire une infrastructure à clé publique où il est facile pour les utilisateurs de découvrir et se souvenir des clés de chacun.

## Organisation du BNS

Les noms de BNS sont organisés en une hiérarchie globale de noms. Il y a trois couches différentes dans cette hiérarchie liée au nommage :

- **Les espaces de nommage**. Ce sont les noms de premier niveau dans la hiérarchie. Une analogie avec les espaces de noms BNS sont des domaines de premier niveau DNS. Les espaces de noms BNS existants incluent `.id`, `.podcast`, et `.helloworld`. Tous les autres noms appartiennent à exactement un espace de noms. N'importe qui peut créer un espace de noms, mais afin que l'espace de noms soit maintenu, il doit être _launched_ pour que n'importe qui puisse y enregistrer des noms. Les espaces de nommage ne sont pas détenus par leurs créateurs.

- **Les noms BNS**. Ce sont des noms dont les enregistrements sont stockés directement sur la blockchain . La propriété et l'état de ces noms sont contrôlés par l'envoi de transactions blockchain. Les exemples de noms incluent `verified.podcast` et `muneeb.id`. N'importe qui peut créer un nom BNS, à condition que l'espace de noms le contienne déjà.

- **Les sous-domaines BNS**. Ce sont des noms dont les enregistrements sont stockés hors chaîne, mais sont ancrés collectivement dans la blockchain. La propriété et l'état de ces noms vivent dans les données du réseau P2P. Alors que les sous-domaines BNS sont détenus par des clés privées séparées, le propriétaire d'un nom BNS doit diffuser son état de sous-domaine. Les exemples de sous-domaines comprennent `jude.personal.id` et `podsaveamerica.verified.podcast`. Contrairement aux espaces de noms et noms BNS, l'état des sous-domaines BNS ne fait _pas_ partie des règles de consensus de la blockchain.

Une matrice de comparaison de fonctionnalités résumant les similitudes et les différences entre ces objets de nom est présentée ci-dessous:

| Fonctionalité                                     | **Espaces de nommage** | **Noms BNS** | **Sous-domaines BNS** |
| ------------------------------------------------- | ---------------------- | ------------ | --------------------- |
| Globalement unique                                | X                      | X            | X                     |
| Langage humain                                    | X                      | X            | X                     |
| Détenu par une clé privée                         |                        | X            | X                     |
| Tout le monde peut créer                          | X                      | X            | [1]                   |
| Le propriétaire peut mettre à jour                |                        | X            | [1]                   |
| État hébergé sur la chaîne                        | X                      | X            |                       |
| Etat hébergé hors de la chaîne                    |                        | X            | X                     |
| Comportement contrôlé par des règles de consensus | X                      | X            |                       |
| Peut avoir une date d'expiration                  |                        | X            |                       |

[1] Nécessite la coopération d'un propriétaire du nom BNS pour diffuser ses transactions

## Espaces de nommage

Les espaces de noms sont les objets de nommage de premier niveau dans BNS.

Ils contrôlent quelques propriétés inhérentes aux noms :

- Combien coûte leur enregistrement
- La durée avant de nécessiter leur renouvellement
- Qui (le cas échéant) reçoit les frais d'enregistrement du nom
- Qui est autorisé à initialiser l'espace de noms avec ses noms initiaux.

Au moment de cette écriture, le plus grand espace de noms BNS est l'espace de noms `.id` . Les noms de l'espace de noms `.id` sont destinés à résoudre les identités de l'utilisateur . Short names in `.id` are more expensive than long names, and have to be renewed by their owners every two years. Name registration fees are not paid to anyone in particular---they are instead sent to a "black hole" where they are rendered unspendable (the intention is to discourage ID squatters).

Unlike DNS, _anyone_ can create a namespace and set its properties. Namespaces are created on a first-come first-serve basis, and once created, they last forever.

However, creating a namespace is not free. The namespace creator must _burn_ cryptocurrency to do so. The shorter the namespace, the more cryptocurrency must be burned (that is, short namespaces are more valuable than long namespaces). For example, it cost Blockstack PBC 40 BTC to create the `.id` namespace in 2015 (in transaction `5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b281`).

Namespaces can be between 1 and 19 characters long, and are composed of the characters `a-z`, `0-9`, `-`, and `_`.

## Subdomains

BNS names are strongly owned because the owner of its private key can generate valid transactions that update its zone file hash and owner. However, this comes at the cost of requiring a name owner to pay for the underlying transaction in the blockchain. Moreover, this approach limits the rate of BNS name registrations and operations to the underlying blockchain's transaction bandwidth.

BNS overcomes this with subdomains. A **BNS subdomain** is a type of BNS name whose state and owner are stored outside of the blockchain, but whose existence and operation history are anchored to the blockchain. Like their on-chain counterparts, subdomains are globally unique, strongly owned, and human-readable. BNS gives them their own name state and public keys. Unlike on-chain names, subdomains can be created and managed cheaply, because they are broadcast to the BNS network in batches. A single blockchain transaction can send up to 120 subdomain operations.

This is achieved by storing subdomain records in the BNS name zone files. An on-chain name owner broadcasts subdomain operations by encoding them as `TXT` records within a DNS zone file. To broadcast the zone file, the name owner sets the new zone file hash with a `NAME_UPDATE` transaction and replicates the zone file. This, in turn, replicates all subdomain operations it contains, and anchors the set of subdomain operations to an on-chain transaction. The BNS node's consensus rules ensure that only valid subdomain operations from _valid_ `NAME_UPDATE` transactions will ever be stored.

For example, the name `verified.podcast` once wrote the zone file hash `247121450ca0e9af45e85a82e61cd525cd7ba023`, which is the hash of the following zone file:

```bash
$TTL 3600
1yeardaily TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxeWVhcmRhaWx5CiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMXllYXJkYWlseS9oZWFkLmpzb24iCg=="
2dopequeens TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAyZG9wZXF1ZWVucwokVFRMIDM2MDAKX2h0dHAuX3RjcCBVUkkgMTAgMSAiaHR0cHM6Ly9waC5kb3Rwb2RjYXN0LmNvLzJkb3BlcXVlZW5zL2hlYWQuanNvbiIK"
10happier TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMGhhcHBpZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMGhhcHBpZXIvaGVhZC5qc29uIgo="
31thoughts TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMXRob3VnaHRzCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzF0aG91Z2h0cy9oZWFkLmpzb24iCg=="
359 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNTkKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8zNTkvaGVhZC5qc29uIgo="
30for30 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMGZvcjMwCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzBmb3IzMC9oZWFkLmpzb24iCg=="
onea TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiBvbmVhCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vb25lYS9oZWFkLmpzb24iCg=="
10minuteteacher TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMG1pbnV0ZXRlYWNoZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMG1pbnV0ZXRlYWNoZXIvaGVhZC5qc29uIgo="
36questionsthepodcastmusical TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNnF1ZXN0aW9uc3RoZXBvZGNhc3RtdXNpY2FsCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzZxdWVzdGlvbnN0aGVwb2RjYXN0bXVzaWNhbC9oZWFkLmpzb24iCg=="
_http._tcp URI 10 1 "https://dotpodcast.co/"
```

Each `TXT` record in this zone file encodes a subdomain-creation. For example, `1yeardaily.verified.podcast` resolves to:

```json
{
  "address": "1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH",
  "blockchain": "bitcoin",
  "last_txid": "d87a22ebab3455b7399bfef8a41791935f94bc97aee55967edd5a87f22cce339",
  "status": "registered_subdomain",
  "zonefile_hash": "e7acc97fd42c48ed94fd4d41f674eddbee5557e3",
  "zonefile_txt": "$ORIGIN 1yeardaily\n$TTL 3600\n_http._tcp URI 10 1 \"https://ph.dotpodcast.co/1yeardaily/head.json\"\n"
}
```

This information was extracted from the `1yeardaily` `TXT` resource record in the zone file for `verified.podcast`.

### Subdomain Lifecycle

Note that `1yeardaily.verified.podcast` has a different public key hash (address) than `verified.podcast`. A BNS node will only process a subsequent subdomain operation on `1yeardaily.verified.podcast` if it includes a signature from this address's private key. `verified.podcast` cannot generate updates; only the owner of `1yeardaily.verified.podcast can do so`.

The lifecycle of a subdomain and its operations is shown in Figure 2.

```
   subdomain                  subdomain                  subdomain
   creation                   update                     transfer
+----------------+         +----------------+         +----------------+
| cicero         |         | cicero         |         | cicero         |
| owner="1Et..." | signed  | owner="1Et..." | signed  | owner="1cJ..." |
| zf0="7e4..."   |<--------| zf0="111..."   |<--------| zf0="111..."   |<---- ...
| seqn=0         |         | seqn=1         |         | seqn=2         |
|                |         | sig="xxxx"     |         | sig="xxxx"     |
+----------------+         +----------------+         +----------------+
        |                          |                          |
        |        off-chain         |                          |
~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ...
        |         on-chain         |                          |
        V                          V (zone file hash    )     V
+----------------+         +----------------+         +----------------+
| res_publica.id |         |    jude.id     |         | res_publica.id |
|  NAME_UPDATE   |<--------|  NAME_UPDATE   |<--------|  NAME_UPDATE   |<---- ...
+----------------+         +----------------+         +----------------+
   blockchain                 blockchain                 blockchain
   block                      block                      block


Figure 2:  Subdomain lifetime with respect to on-chain name operations .A new
subdomain operation will only be accepted if it has a later "sequence=" number,
and a valid signature in "sig=" over the transaction body .The "sig=" field
includes both the public key and signature, and the public key must hash to
the previous subdomain operation's "addr=" field.

The subdomain-creation and subdomain-transfer transactions for
"cicero.res_publica.id" are broadcast by the owner of "res_publica.id."
However, any on-chain name ("jude.id" in this case) can broadcast a subdomain
update for "cicero.res_publica.id."
```

Subdomain operations are ordered by sequence number, starting at 0. Each new subdomain operation must include:

- The next sequence number
- The public key that hashes to the previous subdomain transaction's address
- A signature from the corresponding private key over the entire subdomain operation.

If two correctly signed but conflicting subdomain operations are discovered (that is, they have the same sequence number), the one that occurs earlier in the blockchain's history is accepted. Invalid subdomain operations are ignored.

Combined, this ensures that a BNS node with all of the zone files with a given subdomain's operations will be able to determine the valid sequence of state-transitions it has undergone, and determine the current zone file and public key hash for the subdomain.

### Subdomain Creation and Management

Unlike an on-chain name, a subdomain owner needs an on-chain name owner's help to broadcast their subdomain operations. In particular:

- A subdomain-creation transaction can only be processed by the owner of the on-chain name that shares its suffix. For example, only the owner of `res_publica.id` can broadcast subdomain-creation transactions for subdomain names ending in `.res_publica.id`.
- A subdomain-transfer transaction can only be broadcast by the owner of the on-chain name that created it. For example, the owner of `cicero.res_publica.id` needs the owner of `res_publica.id` to broadcast a subdomain-transfer transaction to change `cicero.res_publica.id`'s public key.
- In order to send a subdomain-creation or subdomain-transfer, all of an on-chain name owner's zone files must be present in the Atlas network. This lets the BNS node prove the _absence_ of any conflicting subdomain-creation and subdomain-transfer operations when processing new zone files.
- A subdomain update transaction can be broadcast by _any_ on-chain name owner, but the subdomain owner needs to find one who will cooperate. For example, the owner of `verified.podcast` can broadcast a subdomain-update transaction created by the owner of `cicero.res_publica.id`.

That said, to create a subdomain, the subdomain owner generates a subdomain-creation operation for their desired name and gives it to the on-chain name owner.

Once created, a subdomain owner can use any on-chain name owner to broadcast a subdomain-update operation. To do so, they generate and sign the requisite subdomain operation and give it to an on-chain name owner, who then packages it with other subdomain operations into a DNS zone file and broadcasts it to the network.

If the subdomain owner wants to change the address of their subdomain, they need to sign a subdomain-transfer operation and give it to the on-chain name owner who created the subdomain. They then package it into a zone file and broadcast it.

### Subdomain Registrars

Because subdomain names are cheap, developers may be inclined to run subdomain registrars on behalf of their applications. For example, the name `personal.id` is used to register usernames without requiring them to spend any Bitcoin.

We supply a reference implementation of a [BNS Subdomain Registrar](https://github.com/stacks-network/subdomain-registrar) to help developers broadcast subdomain operations. Users would still own their subdomain names; the registrar simply gives developers a convenient way for them to register and manage them in the context of a particular application.

# BNS and DID Standards

BNS names are compliant with the emerging [Decentralized Identity Foundation](http://identity.foundation) protocol specification for decentralized identifiers (DIDs).

Each name in BNS has an associated DID. The DID format for BNS is:

```bash
    did:stack:v0:{address}-{index}
```

Where:

- `{address}` is an on-chain public key hash (for example a Bitcoin address).
- `{index}` refers to the `nth` name this address created.

For example, the DID for `personal.id` is `did:stack:v0:1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV-0`, because the name `personal.id` was the first-ever name created by `1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV`.

As another example, the DID for `jude.id` is `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-1`. Here, the address `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` had created one earlier name in history prior to this one (which happens to be `abcdefgh123456.id`).

The purpose of a DID is to provide an eternal identifier for a public key. The public key may change, but the DID will not.

Stacks Blockchain implements a DID method of its own in order to be compatible with other systems that use DIDs for public key resolution. In order for a DID to be resolvable, all of the following must be true for a name:

- The name must exist
- The name's zone file hash must be the hash of a well-formed DNS zone file
- The DNS zone file must be present in the Stacks node's data.
- The DNS zone file must contain a `URI` resource record that points to a signed JSON Web Token
- The public key that signed the JSON Web Token (and is included with it) must hash to the address that owns the name

Not all names will have DIDs that resolve to public keys. However, names created by standard tooling will have DIDs that do.

A RESTful API is under development.

## DID Encoding for Subdomains

Every name and subdomain in BNS has a DID. The encoding is slightly different for subdomains, so the software can determine which code-path to take.

- For on-chain BNS names, the `{address}` is the same as the Bitcoin address that owns the name. Currently, both version byte 0 and version byte 5 addresses are supported (that is, addresses starting with `1` or `3`, meaning `p2pkh` and `p2sh` addresses).

- For off-chain BNS subdomains, the `{address}` has version byte 63 for subdomains owned by a single private key, and version byte 50 for subdomains owned by a m-of-n set of private keys. That is, subdomain DID addresses start with `S` or `M`, respectively.

The `{index}` field for a subdomain's DID is distinct from the `{index}` field for a BNS name's DID, even if the same created both names and subdomains. For example, the name `abcdefgh123456.id` has the DID `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-0`, because it was the first name created by `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg`. However, `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` _also_ created `jude.statism.id` as its first subdomain name. The DID for `jude.statism.id` is `did:stack:v0:SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i-0`. Note that the address `SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i` encodes the same public key hash as the address `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` (the only difference between these two strings is that the first is base58check-encoded with version byte 0, and the second is encoded with version byte 63).
