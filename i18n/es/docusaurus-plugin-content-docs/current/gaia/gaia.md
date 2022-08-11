---
title: Gaia
description: Arquitectura de almacenamiento descentralizado para datos fuera de la cadena
sidebar_position: 5
tags:
  - gaia
---

## Introducción

Las aplicaciones construidas en la blockchain de Stacks almacenan datos fuera de cadena usando un sistema de almacenamiento llamado Gaia.

Mientras que los metadatos transaccionales públicos se almacenan mejor en la blockchain de Stacks, los datos de las aplicaciones de los usuarios pueden almacenarse a menudo de forma más eficiente y privada en el almacenamiento de Gaia.

Almacenar datos fuera de la blockchain asegura que las aplicaciones de Stacks pueden proporcionar a los usuarios un alto rendimiento y una alta disponibilidad para lecturas y escrituras de datos sin introducir partes de confianza centrales.

## Comprender a Gaia en la arquitectura de Stacks

El siguiente diagrama representa la arquitectura de Stacks y el lugar de Gaia en él.

![Stacks Architecture](/img/architecture.png)

Las Blockchains requieren un consenso entre un gran número de personas, por lo que pueden ser lentas. Adicionalmente, una blockchain no está diseñada para contener muchos datos. Esto significa que usar una blockchain por cada bit de datos que un usuario pueda escribir y almacenar es caro. Por ejemplo, imagínese si una aplicación estaba almacenando cada tweet en la cadena.

La blockchain de Stacks aborda los problemas de rendimiento mediante un enfoque por capas. La capa base consiste en la blockchain de Stacks y el Blockchain Naming System (BNS). La Blockchain gobierna la propiedad de identidades en la red de Stacks. Las identidades pueden ser nombres como nombres de dominio, nombres de usuario o nombres de aplicaciones.

Cuando se crea una identidad, su creación se registra en la blockchain de Stacks. Las identidades componen los datos principales almacenados en la blockchain de Stacks. Estas identidades corresponden a datos de enrutamiento en el stack de OSI. Los datos de enrutamiento se almacenan en la Red de Pares de Atlas, la segunda capa. Cada nodo del núcleo que se une a la red de Stacks es capaz de obtener una copia completa de estos datos de enrutamiento. Stacks utiliza los datos de enrutamiento para asociar identidades (nombres de dominio, nombres de usuario, y nombres de aplicación) con una ubicación de almacenamiento particular en la capa final, el Sistema de Almacenamiento de Gaia.

Un sistema de almacenamiento Gaia consiste en un _centro de servicio_ y un recurso de almacenamiento en un proveedor de software en la nube. El proveedor de almacenamiento puede ser cualquier proveedor comercial como Azure, DigitalOcean, Amazon EC2, etcétera. Normalmente, el recurso de cómputo y el recurso de almacenamiento residen en el mismo proveedor de la nube, aunque esto no es un requisito. Gaia actualmente tiene soporte para controladores para S3, Azure Blob Storage, Google Cloud Platform y disco local, pero el modelo de controlador también permite otro soporte de backend.

Gaia stores data as a simple key-value store. When an identity is created, a corresponding data store is associated with that identity on Gaia. When a user logs into a dApp, the authentication process gives the application the URL of a Gaia hub, which then writes to storage on behalf of that user.

The Stacks blockchain stores only identity data. Data created by the actions of an identity is stored in a Gaia Storage System. Each user has profile data. When a user interacts with a decentralized dApp that application stores application data on behalf of the user. Because Gaia stores user and application data off the blockchain, a Stacks DApp is typically more performant than DApps created on other blockchains.

## User control or how is Gaia decentralized?

A Gaia hub runs as a service which writes to data storage. The storage itself is a simple key-value store. The hub service writes to data storage by requiring a valid authentication token from a requestor. Typically, the hub service runs on a compute resource and the storage itself on separate, dedicated storage resource. Typically, both resources belong to the same cloud computing provider.

![Gaiastorage](/img/gaia-storage.png)

Gaia's approach to decentralization focuses on user control of data and its storage. Users can choose a Gaia hub provider. If a user can choose which Gaia hub provider to use, then that choice is all the decentralization required to enable user-controlled applications. Moreover, Gaia defines a uniform API for applications to access that data.

The control of user data lies in the way that user data is accessed. When an application fetches a file `data.txt` for a given user `alice.id`, the lookup will follow these steps:

1. Fetch the `zonefile` for `alice.id`.
2. Read her profile URL from her `zonefile`.
3. Fetch Alice's profile.
4. _Verify_ that the profile is signed by `alice.id`'s key
5. Find the read-only url out of the profile's `appsMeta` section (e.g. `https://example-app.gaia.alice.org`).
6. Fetch the file from `https://example-app.gaia.alice.org/data.txt`.

Because `alice.id` has access to her [zonefile](https://docs.stacks.co/references/bns-contract#name-update), she can change where her profile is stored. For example, she may do this if the current profile's service provider or storage is compromised. To change where her profile is stored, she changes her Gaia hub URL to another Gaia hub URL. If a user has sufficient compute and storage resources, a user may run their own Gaia Storage System and bypass a commercial Gaia hub provider all together.

:::caution
Users with existing identities cannot yet migrate their data from one hub to another.
:::

Applications writing directly on behalf of `alice.id` do not need to perform a lookup. Instead, the [Stacks authentication flow](https://stacks.js.org) provides Alice's chosen gaia hub URL to the application. This authentication flow _is also_ within Alice's control because Alice's wallet _must_ generate the authentication response.

## Entendiendo el almacenamiento de datos

A Gaia hub stores the written data _exactly_ as given. It offers minimal guarantees about the data. It does not ensure that data is validly formatted, contains valid signatures, or is encrypted. Rather, the design philosophy is that these concerns are client-side concerns.

Client libraries (such as [`Stacks.js`](https://stacks.js.org/)) are capable of providing these guarantees. A liberal definition of the [end-to-end principle](https://en.wikipedia.org/wiki/End-to-end_principle) guides this design decision.

When an application writes to a Gaia hub, an authentication token, key, and the data are passed to the Gaia hub.

![Gaia writes](/img/gaia-writes.png)

The token ensures the app has the authorization to write to the hub on the user's behalf.

## Gaia versus otros sistemas de almacenamiento

Here's how Gaia stacks up against other decentralized storage systems. Features that are common to all storage systems are omitted for brevity.

| Funcionalidades                               | [Gaia](https://github.com/stacks-network/gaia) | [Sia](https://sia.tech/) | [Storj](https://storj.io/) | [IPFS](https://ipfs.io/) | [DAT](https://datproject.org/) | [SSB](https://www.scuttlebutt.nz/) |
| --------------------------------------------- | ---------------------------------------------- | ------------------------ | -------------------------- | ------------------------ | ------------------------------ | ---------------------------------- |
| El usuario controla donde se alojan los datos | X                                              |                          |                            |                          |                                |                                    |
| Data can be viewed in a normal Web browser    | X                                              |                          |                            | X                        |                                |                                    |
| Datos de lectura/escritura                    | X                                              |                          |                            |                          | X                              | X                                  |
| Se pueden eliminar datos                      | X                                              |                          |                            |                          | X                              | X                                  |
| Data can be listed                            | X                                              | X                        | X                          |                          | X                              | X                                  |
| Deleted data space is reclaimed               | X                                              | X                        | X                          | X                        |                                |                                    |
| Data lookups have predictable performance     | X                                              |                          | X                          |                          |                                |                                    |
| Writes permission can be delegated            | X                                              |                          |                            |                          |                                |                                    |
| Listing permission can be delegated           | X                                              |                          |                            |                          |                                |                                    |
| Supports multiple backends natively           | X                                              |                          | X                          |                          |                                |                                    |
| Data is globally addressable                  | X                                              | X                        | X                          | X                        | X                              |                                    |
| Needs a cryptocurrency to work                |                                                | X                        | X                          |                          |                                |                                    |
| Data is content-addressed                     |                                                | X                        | X                          | X                        | X                              | X                                  |
