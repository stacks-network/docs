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

Au moment de cette écriture, le plus grand espace de noms BNS est l'espace de noms `.id` . Les noms de l'espace de noms `.id` sont destinés à résoudre les identités de l'utilisateur . Les noms abrégés en `.id` sont plus chers que les noms longs, et doivent être renouvelés par leurs propriétaires tous les deux ans. Les frais d'enregistrement d'un nom ne sont pas payés à qui que ce soit en particulier ---ils sont plutôt envoyés à un « trou noir » où ils sont rendus inutilisables (l'intention est de décourager les squatteurs d'identification).

Contrairement aux DNS, _n'importe qui_ peut créer un espace de noms et définir ses propriétés. Les espaces de noms sont créés sur la base du premier arrivé, et une fois créés, ils durent pour toujours.

Cependant, la création d'un espace de noms n'est pas libre. Le créateur d'espace de noms doit _brûler_ de la cryptomonnaie pour le faire. Plus l'espace de noms est court, plus la cryptomonnaie doit être brûlée (c'est-à-dire que les espaces de noms courts sont plus précieux que les espaces de noms longs). Par exemple, il a coûté à Blockstack PBC 40 BTC pour créer l'espace de noms `.id` en 2015 (dans la transaction `5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b281`).

Les espaces de noms peuvent contenir entre 1 et 19 caractères, et sont composés des caractères `a-z`, `0-9`, `-`, et `_`.

## Sous-domaines

Les noms des BNS sont fortement détenus car le propriétaire de sa clé privée peut générer des transactions valides qui mettent à jour le hachage et le propriétaire de son fichier de zone. Cependant, cela demande d'obliger le propriétaire du nom à payer la transaction sous-jacente dans la blockchain de . De plus, cette approche limite le taux d'enregistrement des noms BNS et les opérations à la bande passante transactionnelle de la blockchain sous-jacente.

BNS surmonte cela avec des sous-domaines. Un **sous-domaine BNS** est un type de nom BNS dont l'état et le propriétaire sont stockés en dehors de la blockchain, mais dont l'existence et l'historique des opérations sont ancrées dans la blockchain . Comme leurs homologues sur la chaîne, les sous-domaines sont globalement uniques, fortement possédés et en langage humain. BNS leur donne leur propre état de nom et clés publiques. Contrairement aux noms on-chain, les sous-domaines peuvent être créés et gérés à coût réduit, car ils sont diffusés sur le réseau BNS en lots. Une seule transaction blockchain peut envoyer jusqu'à 120 opérations de sous-domaine .

Ceci est réalisé en stockant les enregistrements de sous-domaine dans les fichiers de zone de noms BNS. Un propriétaire de noms on-chain diffuse des opérations de sous-domaine en les encodant en tant qu'enregistrements `TXT` dans un fichier de zone DNS. Pour diffuser le fichier de zone, le nom propriétaire définit le hachage du nouveau fichier de zone avec une transaction `NAME_UPDATE` et réplique le fichier de zone. Ceci réplique, à son tour, toutes les opérations du sous-domaine qu'elle contient, et ancre l'ensemble des opérations de sous-domaine à une transaction sur la chaîne. Les règles de consensus du noeud BNS assurent que seules opérations de sous-domaine valides de __ `transactions NAME_UPDATE` valides ne seront jamais stockées.

Par exemple, le nom `a été vérifié. odcast` une fois écrit le hachage du fichier de zone `247121450ca0e9af45e85a82e61cd525cd7ba023`, qui est le hachage du fichier de zone suivant :

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

Chaque enregistrement `TXT` dans ce fichier de zone encode une création de sous-domaine. Par exemple, `1yeardaily.verified.podcast` se correspond à:

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

Cette information a été extraite de l'enregistrement de la ressource `1yeardaily` `TXT` dans le fichier de zone pour `verified.podcast`.

### Cycle de vie des sous-domaines

Notez que `1yeardaily.verified.podcast` a une clé publique différente de `verified.podcast`. Un noeud BNS ne traitera une opération de sous-domaine ultérieure le `1yeardy. erified.podcast` que s'il contient une signature de la clé privée de cette adresse. `verified.podcast` ne peut pas générer mises à jour ; seul le propriétaire de `1yeardaily.verified.podcast`. peut le faire

Le cycle de vie d'un sous-domaine et de ses opérations est affiché dans la figure 2.

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


Figure 2 : durée de vie du sous-domaine en ce qui concerne les opérations de noms on-chain . nouvelle
opération de sous-domaine ne sera acceptée que si elle a un numéro "séquence=" ultérieur,
et une signature valide en "sig=" sur le corps de la transaction. e champ "sig="
inclut à la fois la clé publique et la signature, et la clé publique doit être hachée sur
le champ "addr=" de l'opération précédente de sous-domaine.

Les transactions de création de sous-domaine et de transfert de sous-domaine pour
"cicero.res_publica.id" sont diffusées par le propriétaire de "res_publica.id".
Cependant, tout nom sur chaîne ("jude.id" dans ce cas) peut diffuser une mise à jour de sous-domaine
pour "cicero.res_publica.id".
```

Les opérations de sous-domaine sont ordonnées par numéro de séquence, à partir de 0. Chaque nouvelle opération de sous-domaine doit inclure :

- Le numéro d'ordre suivant
- La clé publique qui hache à l'adresse de la précédente transaction de sous-domaine
- Une signature de la clé privée correspondante sur l'ensemble du sous-domaine opération.

Si deux opérations de sous-domaine correctement signées mais conflictuelles sont découvertes (c.-à-d. ils ont le même numéro de séquence), celui qui se produit plus tôt dans l'histoire de la blockchain est accepté. Les opérations de sous-domaine non valides sont ignorées.

Combiné, cela garantit qu'un noeud BNS avec tous les fichiers de zone avec les opérations d'un sous-domaine donné sera en mesure de déterminer la séquence valide de transitions d'état qu'il a soumises, et déterminez le fichier de zone actuel et le hachage de la clé publique pour le sous-domaine.

### Création et gestion de sous-domaine

Contrairement à un nom on-chaîne, un propriétaire de sous-domaine a besoin de l'aide du propriétaire de noms sur chaîne pour diffuser ses opérations de sous-domaine. En particulier :

- Une transaction de création de sous-domaine ne peut être traitée que par le propriétaire du nom sur qui partage son suffixe. Par exemple, seul le propriétaire de `res_publica.id` peut diffuser des transactions de création de sous-domaine pour les noms de sous-domaine se terminant par `.res_publica.id`.
- Une transaction de transfert de sous-domaine ne peut être diffusée que par le propriétaire du nom sur la chaîne qui l'a créé. For example, the owner of `cicero.res_publica.id` needs the owner of `res_publica.id` to broadcast a subdomain-transfer transaction to change `cicero.res_publica.id`'s public key.
- In order to send a subdomain-creation or subdomain-transfer, all of an on-chain name owner's zone files must be present in the Atlas network. Cela permet au noeud BNS de prouver l'_absence<0> de tout conflit d'opération de création ou de transfert de sous-domaines lors de la création des nouveaux fichiers de zones.</p></li>
- Une transaction de mise à jour de sous-domaine peut être diffusée par _n'importe quel propriétaire de nom sur la chaîne,_ mais le propriétaire du sous-domaine doit trouver celui qui coopérera. Par exemple, le propriétaire de `verified.podcast` peut diffuser une transaction de mise à jour de sous-domaine créée par le propriétaire de `cicero.res_publica.id`.</ul>

Cela dit, pour créer un sous-domaine, le propriétaire du sous-domaine génère une opération de création de sous-domaine pour le nom désiré et le donne au propriétaire du nom sur la chaîne.

Une fois créé, un propriétaire de sous-domaine peut utiliser n'importe quel propriétaire de nom sur la chaîne pour diffuser une opération de mise à jour de sous-domaine. Pour ce faire, ils génèrent et signent l'opération de sous-domaine requise et la donnent à un propriétaire de nom sur la chaîne, qui l'empaquete alors avec d'autres opérations de sous-domaine dans un fichier de zone DNS et le diffuse sur le réseau.

Si le sous-propriétaire du sous-domaine veut changer l'adresse de son sous-domaine, il a besoin de signer une opération de transfert de sous-domaine et la donner au propriétaire du nom sur chaîne qui a créé le sous-domaine. Ils l'empaquetent ensuite dans un fichier de zone et diffusent .

### Enregistreurs de sous-domaine

Parce que les noms de sous-domaine sont bon marché, les développeurs peuvent être enclins à exécuter des demandes d'enregistrement de sous-domaine pour le compte de leurs applications. Par exemple, le nom `personal.id` est utilisé pour enregistrer des noms d'utilisateur sans les obliger à faire une transaction Bitcoin.

Nous fournissons une implémentation de référence d'un [Enregistrement BNS ](https://github.com/stacks-network/subdomain-registrar) pour aider les développeurs à diffuser des opérations de sous-domaine. Les utilisateurs posséderaient toujours leurs noms de sous-domaine; le bureau d’enregistrement donne simplement aux développeurs un moyen pratique de les enregistrer et de les gérer dans le contexte d’une application particulière.

# Normes BNS et DID

Les noms BNS sont conformes à la spécification de [de la Fondation d’identité décentralisée](http://identity.foundation) protocole pour les identifiants décentralisés (DID).

Chaque nom dans BNS a un DID associé. Le format DID pour BNS est :

```bash
    did:stack:v0:{address}-{index}
```

Où :

- `{address}` est un hachage de clé publique sur chaîne (par exemple une adresse Bitcoin).
- `{index}` fait référence au `nème` nom que cette adresse a créé.

Par exemple, le DID pour `personal.id` est `did:stack:v0:1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV-0`, parce que le nom `personal.id` a été le tout premier nom créé par `1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV`.

Comme autre exemple, le DID pour `jude.id` est `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-1`. Ici, l'adresse `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` avait créé un prénom plus tôt dans l'histoire avant celui-ci (qui se trouve être `abcdefgh123456. d`).

Le but d'un DID est de fournir un identifiant éternel pour une clé publique. La clé publique peut changer, mais le DID ne changera pas.

Stacks Blockchain implémente une méthode DID en elle-même afin d'être compatible avec d'autres systèmes qui utilisent DID pour la résolution de clé publique. Pour qu'un DID soit résolu, tout ce qui suit doit être vrai pour un nom :

- Le nom doit exister
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
