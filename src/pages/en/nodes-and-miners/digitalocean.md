---
title: Stacks on DigitalOcean
description: A guide to setup Stacks on DigitalOcean
---

## Introduction

This is a step by step guide to deploy the [Stacks Blockchain on DigitalOcean](https://marketplace.digitalocean.com/apps/stacks-blockchain). Code is hosted on this [Github repository](https://github.com/stacks-network/stacks-blockchain-docker).

## Steps

1. Go to the [Stacks Blockchain page](https://marketplace.digitalocean.com/apps/stacks-blockchain) in DigitalOcean's marketplace. Click on `Create Stacks Blockchain Droplet`.

2. Choose a plan (it will only allow you to select a plan that meets the minimum requirements) and your prefered datacenter region.
![](/images/sh_digitalocean-choose-plan.png)

3. Enter a root password or enable SSH keys if your prefer.

![](/images/sh_digitalocean-choose-authentication.png)

4. You can leave the rest of the options as they are and click on `Create Droplet`

5. You will need to wait a few seconds for the droplet to get created. Once created click on it to see more information.

![](/images/sh_digitalocean-creating-droplet.png)

![](/images/sh_digitalocean-created-droplet.png)

6. Congratulations! You are now running the Stacks Blockchain. You can click on ` Console`  for a terminal window to open or login using SSH to the public IP you've been assigned to with user `root`.

![](/images/sh_digitalocean-console-button.png)
![](/images/sh_digitalocean-console.png)