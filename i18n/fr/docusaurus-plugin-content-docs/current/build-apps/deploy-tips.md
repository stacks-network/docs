---
title: Aides au déploiement
description: Apprenez quelques méthodes courantes pour déployer votre application.
---

## Introduction

Les applications Stacks sont des applications web qui authentifient les utilisateurs avec Stacks Auth et stockent des données avec Gaia. Ces deux technologies sont accessibles du côté client. En tant que tel, les applications de Stacks tendent à être simples dans la conception et le fonctionnement. Dans de nombreux cas, ils n’ont pas à héberger quoi que ce soit en dehors des ressources de l’application.

## Où déployer son application

Avant que les utilisateurs puissent interagir avec votre application, vous devez le déployer sur un serveur accessible sur Internet. Le déploiement nécessite que vous :

- Configuriez ou personnalisiez les fichiers dans le répertoire `public`.
- Construisiez votre site d'application pour le déploiement.
- Copiez vos fichiers d'application générés sur votre serveur de production.

Si vous avez d'abord bâti votre application avec le générateur d'applications Stacks, votre application contient les blocs de départ pour configurer, construire et déployer votre application. Par exemple, le modèle React possède une structure avec les blocs de construction suivants.

| Fichier ou dossier         | Description                                                                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node_modules/react-scripts | Un ensemble de scripts pour vous aider à démarrer les projets React sans configuration, pour que vous n'ayez pas à configurer votre projet par vous-même.                              |
| package.json               | Contient une section de scripts qui inclut une référence aux scripts de react, qui sont une dépendance. Ce script crée un répertoire de compilation contenant vos fichiers à déployer. |
| public/favicon.ico         | Un exemple d'icône de raccourci.                                                                                                                                                       |
| public/index.html          | Une page d'accueil pour une application.                                                                                                                                               |
| public/manifest.json       | Un fichier JSON qui décrit votre application Web au navigateur.                                                                                                                        |
| cors                       | Contient des exemples de fichiers de déploiement pour la configuration des requêtes multi-origines.                                                                                    |

Si vous utilisez le générateur pour construire votre structure avec JavasScript ou Vue, les fichiers de configuration de votre projet seront différents.

Quel que soit le langage que vous utilisez, vous devez personnaliser et étendre le squelette de base selon les besoins de votre application. Par exemple, vous pourriez vouloir ajouter plus de propriétés au fichier `manifest.json`. Comme chaque application est différente, Stacks Auth ne propose pas d'instructions spécifiques pour le faire. Les étapes que vous définissez sont spécifiques à votre application.

## Authentification Stacks et déploiement

When your application authenticates users with Stacks, the Stacks Wallet at on URL requests a resource (the app manifest) from your DApp. Une requête pour une ressource en dehors du domaine d'origine (le Portefeuille de Stacks) est appelée comme une requête _cross-origin_(CORs). Obtenir des données de cette manière peut être risqué, vous devez donc configurer la sécurité de votre site Web pour permettre des interactions entre les origines.

You can think of CORS interactions as an apartment building with Security. For example, if you need to borrow a ladder, you could ask a neighbor in your building who has one. Security would likely not have a problem with this request (that is, same-origin, your building). If you needed a particular tool, however, and you ordered it delivered from an online hardware store (that is, cross-origin, another site), Security may request identification before allowing the delivery man into the apartment building. (Credit: Codecademy)

The way you configure CORs depends on which company you use to host your web application. The application generator adds a `cors` directory to your application scaffolding. This directory contains files for Netlify (`_headers` and `_redirects`) as well as one for Firebase (`firebase.json`). The configurations in the `cors` directory make your application's `manifest.json` file accessible to other applications (for example, to the Stacks Browser). If you are deploying to a service other than Netlify or Firebase, you must configure CORS on that service to include the following headers when serving `manifest.json`:

```html
Access-Control-Allow-Origin: * Access-Control-Allow-Headers: "X-Requested-With,
Content-Type, Origin, Authorization, Accept, Client-Security-Token,
Accept-Encoding" Access-Control-Allow-Methods: "POST, GET, OPTIONS, DELETE, PUT"
```

Consult the documentation for your hosting service to learn how to configure CORS on that service.

## Deployment and Radiks

If you are deploying a Stacks application that uses [Radiks](https://github.com/stacks-network/radiks), your deployment includes a server and a database component. You must take this into account when deploying your application. You may want to choose a service such as [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com) if your app uses Radiks.
