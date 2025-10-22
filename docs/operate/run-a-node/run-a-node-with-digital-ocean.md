# Run a Node with Digital Ocean

### Introduction

This is a step by step guide to deploy the [Stacks Blockchain](https://github.com/stacks-network/stacks-blockchain) on [DigitalOcean](https://digitalocean.com/).

Build code is hosted on this [Github repository](https://github.com/stacksfoundation/stacks-machine-images) using the [methods from here](https://github.com/stacks-network/stacks-blockchain-docker).

### Steps

{% stepper %}
{% step %}
### Create the Droplet from the Marketplace

Go to the [Stacks Blockchain page](https://marketplace.digitalocean.com/apps/stacks-blockchain) in DigitalOcean's marketplace. Click on `Create Stacks Blockchain Droplet`.
{% endstep %}

{% step %}
### Choose plan and region

Choose a plan (it will only allow you to select a droplet that meets the minimum requirements) and your preferred datacenter region.
{% endstep %}

{% step %}
### Authentication

Enter a root password or [enable SSH keys](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/) if you prefer.
{% endstep %}

{% step %}
### Create the Droplet

You can leave the rest of the options as they are and click on `Create Droplet`.
{% endstep %}

{% step %}
### Wait for creation

You will need to wait a few seconds for the droplet to get created. Once created click on it to see more information.
{% endstep %}

{% step %}
### Access the Droplet

Congratulations! You are now running the Stacks Blockchain. You can click on `Console` for a terminal window to open or login using SSH to the public IP you've been assigned to with user `root`.
{% endstep %}
{% endstepper %}

### Getting started after deploying Stacks Blockchain

Once the droplet is launched, the initial startup can take several minutes while BNS data is imported (this is a one time operation) and the Bitcoin headers are synced.

To keep track of the progress, you can SSH to the host and view logs:

```bash
ssh root@your_droplet_public_ipv4
/opt/stacks-blockchain-docker/manage.sh -n mainnet -a logs
```

After the stacks blockchain finishes the initial header sync and starts to sync with its peers, the application ports will open (`20443` and `3999`) and HTTP port `80` will now start proxying requests.

Use `http://your_droplet_public_ipv4` to access the data directly, with output being similar to:

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

{% hint style="info" %}
For the full list of API endpoints for the Stacks Blockchain, consult the [Hiro API Docs](https://docs.hiro.so/api)
{% endhint %}

All services are managed by a [systemd unit file](https://github.com/stacksfoundation/stacks-machine-images/blob/master/files/etc/systemd/system/stacks.service) that is set to start on boot.

Manual control is also possible via the [manage.sh script](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/manage.sh) at `/opt/stacks-blockchain-docker/manage.sh` on the host.

Full details on how to use the manage.sh script is [available here](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/usage.md).

### Launching a Droplet using the DigitalOcean API

In addition to creating a Droplet from the Stacks Blockchain 1-Click App via the control panel, you can also use the [DigitalOcean API](https://digitalocean.com/docs/api).

As an example, to create a 4GB Stacks Blockchain Droplet in the SFO2 region, you can use the following curl command. You’ll need to either save your [API access token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) to an environment variable or substitute it into the command below.

{% hint style="info" %}
The `name`, `region` and `size` values below are hardcoded, so adjust as desired.
{% endhint %}

```bash
$ export TOKEN=<digitalocean API token>
$ curl -X POST -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer '$TOKEN'' -d \
    '{"name":"stacks-blockchain","region":"sfo2","size":"s-2vcpu-4gb","image":"stacksfoundation-stacksblockchain"}' \
    "https://api.digitalocean.com/v2/droplets"
```
