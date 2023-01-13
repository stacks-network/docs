---
title: Run a Node with Digital Ocean
description: A guide to setup Stacks on DigitalOcean
sidebar_position: 2
tags:
  - tutorial
---

## Introduction

This is a step by step guide to deploy the [Stacks Blockchain on DigitalOcean](https://marketplace.digitalocean.com/apps/stacks-blockchain). Code is hosted on this [Github repository](https://github.com/stacks-network/stacks-blockchain-docker).

## Steps

#### Step 1

Go to the [Stacks Blockchain page](https://marketplace.digitalocean.com/apps/stacks-blockchain) in DigitalOcean's marketplace. Click on `Create Stacks Blockchain Droplet`.

#### Step 2

Choose a plan (it will only allow you to select a plan that meets the minimum requirements) and your preferred datacenter region.
![](/img/sh_digitalocean-choose-plan.png)

#### Step 3

Enter a root password or enable SSH keys if your prefer.

![](/img/sh_digitalocean-choose-authentication.png)

#### Step 4

You can leave the rest of the options as they are and click on `Create Droplet`

#### Step 5

You will need to wait a few seconds for the droplet to get created. Once created click on it to see more information.

![](/img/sh_digitalocean-creating-droplet.png)

![](/img/sh_digitalocean-created-droplet.png)

### Step 6

Congratulations! You are now running the Stacks Blockchain. You can click on `Console` for a terminal window to open or login using SSH to the public IP you've been assigned to with user `root`.

![](/img/sh_digitalocean-console-button.png)
![](/img/sh_digitalocean-console.png)

## Getting started after deploying Stacks Blockchain

Once droplet is launched, initial startup can take several minutes while BNS data is imported (this is a one time operation).

To keep track of the progress, you can `ssh root@your_droplet_public_ipv4` to the host and run: `/opt/stacks-blockchain-docker/manage.sh -n mainnet -a logs`.

Once the stacks blockchain starts to sync with peers, application ports will open and nginx port 80 will now start proxying requests.

Use `http://your_droplet_public_ipv4` to access the data directly, with output being similar to:

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

## API Creation

In addition to creating a Droplet from the Stacks Blockchain 1-Click App via the control panel, you can also use the [DigitalOcean API](https://digitalocean.com/docs/api).

As an example, to create a 4GB Stacks Blockchain Droplet in the SFO2 region, you can use the following curl command. You’ll need to either save your [API access token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) to an environment variable or substitute it into the command below.

```bash
curl -X POST -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer '$TOKEN'' -d \
    '{"name":"choose_a_name","region":"sfo2","size":"s-2vcpu-4gb","image":"stacksfoundation-stacksblockchain"}' \
    "https://api.digitalocean.com/v2/droplets"
```
