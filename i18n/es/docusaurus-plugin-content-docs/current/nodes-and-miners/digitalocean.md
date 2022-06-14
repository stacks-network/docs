---
title: Stacks en DigitalOcean
description: Una guía para configurar Stacks en DigitalOcean
tags:
  - tutorial
---

## Introducción

Esta es una guía paso a paso para desplegar el [Stacks Blockchain en DigitalOcean](https://marketplace.digitalocean.com/apps/stacks-blockchain). El código está alojado en este [repositorio de Github](https://github.com/stacks-network/stacks-blockchain-docker).

## Pasos

#### Paso 1

Vaya a la página [Stacks Blockchain](https://marketplace.digitalocean.com/apps/stacks-blockchain) en el mercado de DigitalOcean. Haga clic en `Create Stacks Blockchain Droplet`.

#### Paso 2

Choose a plan (it will only allow you to select a plan that meets the minimum requirements) and your prefered datacenter region. ![](/img/sh_digitalocean-choose-plan.png)

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

¡Felicidades! Ahora está ejecutando Stacks Blockchain. Puede hacer clic en `Console` para que una ventana de terminal abra o inicie sesión usando SSH a la IP pública a la que se le ha asignado con el usuario `root`.

![](/img/sh_digitalocean-console-button.png) ![](/img/sh_digitalocean-console.png)

## Empezando después de desplegar Stacks Blockchain

Once droplet is launched, initial startup can take several minutes while BNS data is imported (this is a one time operation).

To keep track of the progress, you can `ssh root@your_droplet_public_ipv4` to the host and run: `/opt/stacks-blockchain-docker/manage.sh -n mainnet -a logs`.

Once the stacks blockchain starts to sync with peers, application ports will open and nginx port 80 will now start proxying requests.

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

All services are managed by a [systemd unit file](https://github.com/stacksfoundation/stacks-machine-images/blob/master/files/etc/systemd/system/stacks.service) that is set to start on boot.

Manual control is also possible via the [manage.sh script](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/manage.sh) at `/opt/stacks-blockchain-docker/manage.sh` on the host.

Full details on how to use the manage.sh script is [available here](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/README.md#quickstart).

## Creación de API

In addition to creating a Droplet from the Stacks Blockchain 1-Click App via the control panel, you can also use the [DigitalOcean API](https://digitalocean.com/docs/api).

As an example, to create a 4GB Stacks Blockchain Droplet in the SFO2 region, you can use the following curl command. You’ll need to either save your [API access token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) to an environment variable or substitute it into the command below.

```bash
curl -X POST -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer '$TOKEN'' -d \
    '{"name":"choose_a_name","region":"sfo2","size":"s-2vcpu-4gb","image":"stacksfoundation-stacksblockchain"}' \
    "https://api.digitalocean.com/v2/droplets"
```
