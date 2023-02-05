---
title: Run a Node with Digital Ocean
description: Una guía para configurar Stacks en DigitalOcean
sidebar_position: 2
tags:
  - tutorial
---

## Introducción

This is a step by step guide to deploy the [Stacks Blockchain](https://github.com/stacks-network/stacks-blockchain) on [DigitalOcean](https://digitalocean.com).

Build code is hosted on this [Github repository](https://github.com/stacksfoundation/stacks-machine-images) using the [methods from here](https://github.com/stacks-network/stacks-blockchain-docker)

## Pasos

#### Paso 1

Vaya a la página [Stacks Blockchain](https://marketplace.digitalocean.com/apps/stacks-blockchain) en el mercado de DigitalOcean. Haga clic en `Create Stacks Blockchain Droplet`. ![](/img/sh_digitalocean-marketplace.png)

#### Paso 2

Choose a plan (it will only allow you to select a droplet that meets the minimum requirements) and your preferred datacenter region. ![](/img/sh_digitalocean-choose-plan.png)

#### Paso 3

Enter a root password or [enable SSH keys](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/) if your prefer.

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

Once the droplet is launched, the initial startup can take several minutes while BNS data is imported (this is a one time operation) and the Bitcoin headers are synced.

Para hacer un seguimiento del progreso, puedes hacer `root@your_droplet_public_ipv4` al host y ejecutar: `/opt/stacks-blockchain-docker/manage.sh -n mainnet -a logs`.

After the stacks blockchain finishes the initial header sync and starts to sync with its peers, the application ports will open (`20443` and `3999`) and HTTP port `80` will now start proxying requests.

Use `http://your_droplet_public_ipv4` para acceder a los datos directamente, siendo la salida similar a:

```json
{
  "server_version": "stacks-blockchain-api v6.2.3 (master:77ab3ae2)",
  "status": "ready",
  "chain_tip": {
    "block_height": 91820,
    "block_hash": "0x06b276e85f238151414616618ae0adaf5eeda4eac6cad5bbefceeb37948ab275",
    "index_block_hash": "0x4d7c075d7ab0f90b1dbc175f5c42b7344265d00cfef202dd9681d95388eeed8c",
    "microblock_hash": "0xcf4f9037cc10696b2812b617ca105885be625c6acf8ad67e71bb4c09fa6ebb21",
    "microblock_sequence": 4
  }
}
```

:::tip For the full list of API endpoints for the Stacks Blockchain, consult the [Hiro API Docs](https://docs.hiro.so/api) :::

Todos los servicios son administrados por un [systemd unit file](https://github.com/stacksfoundation/stacks-machine-images/blob/master/files/etc/systemd/system/stacks.service) que está configurado para comenzar al arrancar.

El control manual también es posible a través del script [manage.sh](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/manage.sh) en `/opt/stacks-blockchain-docker/manage.sh` en el host.

Full details on how to use the manage.sh script is [available here](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/usage.md).

## Launching a Droplet using the DigitalOcean API

Además de crear un Droplet desde la aplicación de Stacks Blockchain 1-Click a través del panel de control, también puedes usar la [API de DigitalOcean](https://digitalocean.com/docs/api).

Como ejemplo, para crear un Droplet de 4GB Stacks Blockchain en la región SFO2, puede utilizar el siguiente comando curl. Tendrás que guardar tu [token de acceso a la API](https://docs.digitalocean.com/reference/api/create-personal-access-token/) en una variable de entorno o sustituirlo en el siguiente comando.

:::note _The `name`, `region` and `size` values below are hardcoded, so adjust as desired._ :::

```bash
$ export TOKEN=<digitalocean API token>
$ curl -X POST -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer '$TOKEN'' -d \
    '{"name":"stacks-blockchain","region":"sfo2","size":"s-2vcpu-4gb","image":"stacksfoundation-stacksblockchain"}' \
    "https://api.digitalocean.com/v2/droplets"
```
