---
title: Authentication
description: Inscription et se connection des utilisateurs avec des identités sur la blockchain de Stacks
---

## Introduction

Ce guide explique comment l'authentification est effectuée sur la blockchain de Stacks.

L'authentification permet aux utilisateurs de s'identifier à une application tout en conservant un contrôle total sur leurs identifiants et leurs informations personnelles. Elle peut être intégré seul ou utilisé en conjonction avec [la signature de transactions](https://docs.hiro.so/get-started/transactions#signature-and-verification) et [le stockage de données](https://docs.stacks.co/gaia/overview), pour lesquels il s'agit d'un prérequis.

Les utilisateurs qui s'inscrivent à votre application peuvent ensuite s'authentifier à n'importe quelle autre application avec le support du [Blockchain Naming System](bns) et vice versa.

## Comment ça fonctionne

Le flux d'authentification avec Stacks est similaire au flux typique client-server utilisé par les services de connexion centralisée (par exemple, OAuth). Cependant, avec les stacks, le flux d'authentification est produit entièrement côté client.

Une application et un authentificateur tels que [le Portefeuille Stacks](https://www.hiro.so/wallet/install-web), communiquent pendant le flux d'authentification en transmettant deux jetons. L'application initiatrice envoie à l'authentificateur un jeton `authRequest`. Une fois qu'un utilisateur approuve l'authentification, l'authentificateur répond à l'application avec un jeton `authResponse`.

Ces jetons sont basés sur [une norme JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) avec une prise en charge supplémentaire de la courbe `secp256k1` utilisée par Bitcoin et de nombreuses autres crypto-monnaies. Ils sont passés via des requêtes d'URL.

Lorsqu'un utilisateur choisit d'authentifier une application, il envoie le jeton `authRequest` à l'authentificateur via une requête URL avec un paramètre également nommé :

`https://wallet.hiro.so/...?authRequest=j902120cn829n1jnvoa...`

Lorsque l'authentificateur reçoit la requête, il génère un jeton `authResponse` pour l'application en utilisant une _clé de transit éphémère_. La clé de transit éphémère est juste utilisée pour l'instance particulière de l'application, dans ce cas, pour signer la `authRequest`.

L'application stocke la clé de transit éphémère lors de la génération de la requête. La partie publique de la clé de transit est passée dans le jeton `authRequest`. L'authentificateur utilise la partie publique de la clé pour chiffrer une _clé privée de l'application_ qui est retournée via la `authResponse`.

L'authentificateur génère la clé privée de l'application à partir de la _adresse privée de l'utilisateur_ et du domaine de l'application. La clé privée de l'application est utilisée pour trois fonctions :

1. Elle est utilisés pour créer des informations d'identification qui permettent à l'application d'accéder à un seau de stockage (stockage temporaire) dans le hub Gaia de l'utilisateur
2. Il est utilisé pour le chiffrement de bout en bout des fichiers stockés pour l'application dans le stockage Gaia de l'utilisateur.
3. Il sert de secret cryptographique que les applications peuvent utiliser pour exécuter d'autres fonctions cryptographiques.

Enfin, la clé privée de l'application est déterministe, ce qui signifie que la même clé privée sera toujours générée pour une adresse et un domaine donnés de Stacks.

Les deux premières de ces fonctions sont particulièrement pertinentes pour le stockage de données [avec Stacks.js](https://docs.stacks.co/docs/gaia).

## Paire de clés

L'authentification avec Stacks utilise largement la cryptographie à clé publique en général et ECDSA avec la courbe `secp256k1` en particulier.

Les sections suivantes décrivent les trois paires de clés publiques privées, y compris la façon dont elles sont générées, où elles sont utilisées et à qui les clés privées sont divulguées.

### Clé privée de transit

La clé de transit privé est une clé éphémère utilisée pour chiffrer les secrets qui doivent passer de l'authentificateur à l'application pendant le processus d'authentification . Elle est générée aléatoirement par l'application au début de la réponse d'authentification.

La clé publique, qui correspond à la clé privée de transit, est stockée dans un simle élément "tableau" dans la clé `public_keys` du jeton de requête d'authentification. L'authentificateur crypte les données secrètes telles que la clé privée de l'application en utilisant cette clé publique et la renvoie à l'application lorsque l'utilisateur se connecte à l'application. La clé privée de transit signe la demande d'authentification de l'application.

### Clé privée de l'adresse d'identité

La clé privée de l'adresse d'identité est dérivée de la phrase porte-clés de l'utilisateur et est la clé privée du nom d'utilisateur dans Stacks que l'utilisateur choisit d'utiliser pour se connecter à l'application. C'est un secret qui appartient à l'utilisateur et qui ne quitte jamais l'instance de l'authentificateur.

Cette clé privée signe le jeton de réponse d'authentification pour une application pour indiquer que l'utilisateur approuve la connexion à cette application.

### Clé privée de l'application

La clé privée de l'application est une clé privée spécifique à l'application qui est générée à partir de la clé privée de l'adresse de l'utilisateur en utilisant le `domain_name` en entrée.

La clé privée de l'application est partagée de manière sécurisée avec l'application pour chaque authentification, chiffrée par l'authentificateur avec la clé publique de transit. Parce que la clé de transit n'est stockée que sur le côté client, cela empêche une attaque de l'homme du milieu où un serveur ou un fournisseur Internet pourrait potentiellement détourner la clé privée de l'application.
