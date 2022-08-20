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

:::tip El último whitepaper de GAIA (Mayo 2022) está disponible [aquí](https://dev1-gaia-hub.s3.amazonaws.com/GAIA_Whitepaper.pdf) :::

## Comprender a Gaia en la arquitectura de Stacks

El siguiente diagrama representa la arquitectura de Stacks y el lugar de Gaia en él.

![Arquitectura de Stacks](/img/architecture.png)

Las Blockchains requieren un consenso entre un gran número de personas, por lo que pueden ser lentas. Adicionalmente, una blockchain no está diseñada para contener muchos datos. Esto significa que usar una blockchain por cada bit de datos que un usuario pueda escribir y almacenar es caro. Por ejemplo, imagínese si una aplicación estaba almacenando cada tweet en la cadena.

La blockchain de Stacks aborda los problemas de rendimiento mediante un enfoque por capas. La capa base consiste en la blockchain de Stacks y el Blockchain Naming System (BNS). La Blockchain gobierna la propiedad de identidades en la red de Stacks. Las identidades pueden ser nombres como nombres de dominio, nombres de usuario o nombres de aplicaciones.

Cuando se crea una identidad, su creación se registra en la blockchain de Stacks. Las identidades componen los datos principales almacenados en la blockchain de Stacks. Estas identidades corresponden a datos de enrutamiento en el stack de OSI. Los datos de enrutamiento se almacenan en la Red de Pares de Atlas, la segunda capa. Cada nodo del núcleo que se une a la red de Stacks es capaz de obtener una copia completa de estos datos de enrutamiento. Stacks utiliza los datos de enrutamiento para asociar identidades (nombres de dominio, nombres de usuario, y nombres de aplicación) con una ubicación de almacenamiento particular en la capa final, el Sistema de Almacenamiento de Gaia.

Un sistema de almacenamiento Gaia consiste en un _centro de servicio_ y un recurso de almacenamiento en un proveedor de software en la nube. El proveedor de almacenamiento puede ser cualquier proveedor comercial como Azure, DigitalOcean, Amazon EC2, etcétera. Normalmente, el recurso de cómputo y el recurso de almacenamiento residen en el mismo proveedor de la nube, aunque esto no es un requisito. Gaia actualmente tiene soporte para controladores para S3, Azure Blob Storage, Google Cloud Platform y disco local, pero el modelo de controlador también permite otro soporte de backend.

Gaia almacena datos como un simple almacén clave-valor. Cuando se crea una identidad, un almacén de datos correspondiente se asocia con esa identidad en Gaia. Cuando un usuario inicia sesión en una dApp, el proceso de autenticación da a la aplicación la URL de un hub de Gaia, que entonces escribe en el almacenamiento en nombre de ese usuario.

La blockchain de Stacks almacena sólo datos de identidad. Los datos creados por las acciones de una identidad se almacenan en el sistema de almacenamiento de Gaia. Cada usuario tiene datos de perfil. Cuando un usuario interactúa con una dApp descentralizada, esa aplicación almacena los datos de la aplicación en nombre del usuario. Debido a que Gaia almacena datos de usuarios y aplicaciones fuera de la blockchain, una DApp de Stacks es normalmente más eficiente que DApps creadas en otras blockchains.

## Control del usuario o ¿Cómo se descentraliza Gaia?

Un hub de Gaia funciona como un servicio que escribe en el almacenamiento de datos. El almacenamiento en sí mismo es un simple almacén clave-valor. El servicio del Hub escribe en el almacenamiento de datos requiriendo un token de autenticación válido de un solicitante. Por lo general, el servicio del Hub se ejecuta en un recurso de cómputo y el almacenamiento propiamente dicho en un recurso de almacenamiento dedicado y separado. Por lo general, ambos recursos pertenecen al mismo proveedor de computación en la nube.

![Gaiastorage](/img/gaia-storage.png)

El enfoque de Gaia hacia la descentralización se centra en el control de los datos por parte del usuario y su almacenamiento. Los usuarios pueden elegir un proveedor de Hub de Gaia. Si un usuario puede elegir qué proveedor de hub de Gaia utilizar, entonces esa opción es toda la descentralización necesaria para permitir aplicaciones controladas por el usuario. Además, Gaia define una API uniforme para aplicaciones para acceder a esos datos.

El control de los datos del usuario reside en la forma en que se accede a los datos del usuario. Cuando una aplicación obtiene un archivo `data.txt` para un usuario determinado `alice.id`, la búsqueda seguirá estos pasos:

1. Obtenga el `zonefile` para `alice.id`.
2. Lea su URL de perfil desde su `zonefile`.
3. Busque el perfil de Alice.
4. _Verificar_ que el perfil esté firmado por la clave de `alice.id`
5. Encuentre la url de solo lectura de la sección `appsMeta` del perfil (por ejemplo, `https://example-app.gaia.alice.org`).
6. Obtenga el archivo de `https://example-app.gaia.alice.org/data.txt`.

Debido a que `alice.id` tiene acceso a su [zonefile](https://docs.stacks.co/references/bns-contract#name-update), puede cambiar donde se almacena su perfil. Por ejemplo, puede hacer esto si el proveedor de servicios o el almacenamiento del perfil actual se ven comprometidos. Para cambiar donde se almacena su perfil, cambia su URL del hub de Gaia a otra URL del hub de Gaia. Si un usuario tiene suficientes recursos de cómputo y almacenamiento, puede ejecutar su propio Sistema de Almacenamiento de Gaia y eludir un proveedor comercial de hubs de Gaia.

:::precaución
Los usuarios con identidades existentes aún no pueden migrar sus datos de un hub a otro.
:::

Las aplicaciones que escriben directamente en nombre de `alice.id` no necesitan realizar una búsqueda. En su lugar, el [flujo de autenticación de Stacks](https://stacks.js.org) proporciona la URL del hub de gaia elegido por Alice a la aplicación. Este flujo de autenticación _también está_ bajo el control de Alice porque la billetera de Alice_ debe_ generar la respuesta de autenticación.

## Entendiendo el almacenamiento de datos

Un hub de Gaia almacena los datos escritos _exactamente_ como se ha dado. Ofreciendo garantías mínimas sobre los datos. No se asegura de que los datos tengan un formato válido, que contengan firmas válidas o que estén cifrados. Más bien, la filosofía del diseño es que estas preocupaciones son del lado del cliente.

Las librerías de clientes (como [`Stacks.js`](https://stacks.js.org/)) son capaces de proporcionar estas garantías. Una definición liberal del [principio de extremo a extremo](https://en.wikipedia.org/wiki/End-to-end_principle) guía esta decisión de diseño.

Cuando una aplicación escribe en un hub de Gaia, se pasan al hub de Gaia un token de autenticación, una clave, y los datos.

![Gaia writes](/img/gaia-writes.png)

El token asegura que la aplicación tenga la autorización para escribir en el hub en nombre del usuario.

## Gaia versus otros sistemas de almacenamiento

Así es como Gaia se compara contra otros sistemas de almacenamiento descentralizados. Las características que son comunes a todos los sistemas de almacenamiento se omiten por razones de brevedad.

| Funcionalidades                                         | [Gaia](https://github.com/stacks-network/gaia) | [Sia](https://sia.tech/) | [Storj](https://storj.io/) | [IPFS](https://ipfs.io/) | [DAT](https://datproject.org/) | [SSB](https://www.scuttlebutt.nz/) |
| ------------------------------------------------------- | ---------------------------------------------- | ------------------------ | -------------------------- | ------------------------ | ------------------------------ | ---------------------------------- |
| El usuario controla donde se alojan los datos           | X                                              |                          |                            |                          |                                |                                    |
| Los datos se pueden ver en un navegador web normal      | X                                              |                          |                            | X                        |                                |                                    |
| Datos de lectura/escritura                              | X                                              |                          |                            |                          | X                              | X                                  |
| Se pueden eliminar datos                                | X                                              |                          |                            |                          | X                              | X                                  |
| Los datos pueden ser listados                           | X                                              | X                        | X                          |                          | X                              | X                                  |
| Se recupera el espacio de datos borrados                | X                                              | X                        | X                          | X                        |                                |                                    |
| Las búsquedas de datos tienen un rendimiento predecible | X                                              |                          | X                          |                          |                                |                                    |
| El permiso de escritura puede ser delegado              | X                                              |                          |                            |                          |                                |                                    |
| El permiso de listado puede ser delegado                | X                                              |                          |                            |                          |                                |                                    |
| Soporta múltiples backends de forma nativa              | X                                              |                          | X                          |                          |                                |                                    |
| Los datos son direccionables globalmente                | X                                              | X                        | X                          | X                        | X                              |                                    |
| Necesita una criptomoneda para funcionar                |                                                | X                        | X                          |                          |                                |                                    |
| Los datos están orientados al contenido                 |                                                | X                        | X                          | X                        | X                              | X                                  |
