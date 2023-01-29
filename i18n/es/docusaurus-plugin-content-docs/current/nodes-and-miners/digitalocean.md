---
title: Stacks en DigitalOcean
description: Una guía para configurar Stacks en DigitalOcean
sidebar_position: 4
tags:
  - tutorial
---

## Introducción

Esta es una guía paso a paso para desplegar el [Stacks Blockchain en DigitalOcean](https://marketplace.digitalocean.com/apps/stacks-blockchain). El código está alojado en este [repositorio de Github](https://github.com/stacks-network/stacks-blockchain-docker).

## Pasos

#### Paso 1

Vaya a la página [Stacks Blockchain](https://marketplace.digitalocean.com/apps/stacks-blockchain) en el mercado de DigitalOcean. Haga clic en `Create Stacks Blockchain Droplet`.

#### Paso 2

Elija un plan (solo le permitirá seleccionar un plan que cumpla con los requisitos mínimos) y su región de datacenter preferida. ![](/img/sh_digitalocean-choose-plan.png)

#### Paso 3

Introduzca una contraseña de root o active las claves SSH si lo prefiere.

![](/img/sh_digitalocean-choose-authentication.png)

#### Paso 4

Puedes dejar el resto de las opciones tal y como están y hacer clic en `Create Droplet`

#### Paso 5

Necesitarás esperar unos segundos para que el droplet se cree. Una vez creado haga clic en él para ver más información.

![](/img/sh_digitalocean-creating-droplet.png)

![](/img/sh_digitalocean-created-droplet.png)

### Paso 6

¡Felicidades! ¡Felicidades! Ahora está ejecutando Stacks Blockchain. Puede hacer clic en `Console` para que una ventana de terminal abra o inicie sesión usando SSH a la IP pública a la que se le ha asignado con el usuario `root`.

![](/img/sh_digitalocean-console-button.png) ![](/img/sh_digitalocean-console.png)

## Empezando después de desplegar Stacks Blockchain

Una vez que se ejecuta el droplet, el arranque inicial puede tardar varios minutos mientras se importan los datos de BNS (esta es una operación que se realiza una sola vez).

Para hacer un seguimiento del progreso, puedes hacer `root@your_droplet_public_ipv4` al host y ejecutar: `/opt/stacks-blockchain-docker/manage.sh -n mainnet -a logs`.

Una vez que la blockchain de Stacks comienza a sincronizar con los pares, los puertos de la aplicación se abrirán y el puerto nginx 80 comenzará ahora a empezar a enviar peticiones.

Use `http://your_droplet_public_ipv4` para acceder a los datos directamente, siendo la salida similar a:

```json
{
  "server_version": "stacks-blockchain-api v3.0.3 (master:cd0c8aef)",
  "status": "ready",
  "chain_tip": {
    "block_height": 16220,
    "block_hash": "0x3123fba9c0de6b569573494cf83c1d5d198a66bfd5f48ef97949b6bf11ba13be",
    "index_block_hash": "0xeec960fbbd6186b4ccac85ce12adba72be497d881f81e077305c90955b51a6ae"
  }
}
```

Todos los servicios son administrados por un [systemd unit file](https://github.com/stacksfoundation/stacks-machine-images/blob/master/files/etc/systemd/system/stacks.service) que está configurado para comenzar al arrancar.

El control manual también es posible a través del script [manage.sh](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/manage.sh) en `/opt/stacks-blockchain-docker/manage.sh` en el host.

Los detalles completos sobre cómo usar el script manage.sh están [disponibles aquí](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/README.md#quickstart).

## Creación de API

Además de crear un Droplet desde la aplicación de Stacks Blockchain 1-Click a través del panel de control, también puedes usar la [API de DigitalOcean](https://digitalocean.com/docs/api).

Como ejemplo, para crear un Droplet de 4GB Stacks Blockchain en la región SFO2, puede utilizar el siguiente comando curl. You’ll need to either save your [API access token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) to an environment variable or substitute it into the command below.

```bash
curl -X POST -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer '$TOKEN'' -d \
    '{"name":"choose_a_name","region":"sfo2","size":"s-2vcpu-4gb","image":"stacksfoundation-stacksblockchain"}' \
    "https://api.digitalocean.com/v2/droplets"
```
