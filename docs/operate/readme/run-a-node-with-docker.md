# Run a Node with Docker

### Stacks Blockchain with Docker

Run your own Stacks Blockchain node using [docker-compose](https://docs.docker.com/compose/) with just a few commands using [stacks-blockchain-docker](https://github.com/stacks-network/stacks-blockchain-docker)

### Requirements

The minimum viable requirements are listed below.

While you _can_ run a node using these specs, it's _recommended_ to assign more than the minimum for better performance.

* ⚠️ [docker-compose](https://docs.docker.com/compose/install/) version `2.2.2` or greater is **required**
* **8GB memory if running only a Stacks node**
* **16 GB memory if running Stacks + Bitcoin node**
* **1 Vcpu** ( _minimum of 2 Vcpu is recommended_ )
* **500GB disk for Stacks node**
* **1TB disk space for Bitcoin node**

{% hint style="warning" %}
MacOS with an ARM (M-series chip) processor is NOT recommended

The way Docker for Mac on an Arm CPU is designed makes the I/O incredibly slow, and blockchains are _**very**_ heavy on I/O. This only seems to affect MacOS with the M-series chip, other Arm based systems like Raspberry Pi work as expected.
{% endhint %}

### Storage

A fully synced Stacks node can use significant disk space and will continue to grow. If your boot drive doesn't have enough room, mount a dedicated disk and symlink the `persistent-data` directory before starting the node:

{% code title="Point persistent-data to an external disk" %}
```bash
# If persistent-data already exists, move its contents first
mv persistent-data/mainnet /mnt/stacks-data/mainnet
rmdir persistent-data

# Create the symlink
ln -s /mnt/stacks-data persistent-data
```
{% endcode %}

The Docker volumes write to `persistent-data/<network>/`, so the symlink redirects all chainstate, database, and event data to the external disk transparently.

### Quickstart

The `<network>` placeholder used below can be replaced with one of:

* mainnet
* testnet
* mocknet

{% stepper %}
{% step %}
#### Clone the repository

Clone the stacks-blockchain-docker repository locally and change into the directory:

{% code title="Clone repository" %}
```bash
git clone https://github.com/stacks-network/stacks-blockchain-docker && cd stacks-blockchain-docker
```
{% endcode %}
{% endstep %}

{% step %}
#### Start the services

Start the docker-compose services for the chosen network:

{% code title="Start services" %}
```bash
./manage.sh -n <network> -a start
```
{% endcode %}

{% hint style="warning" %}
**macOS users:** The `manage.sh` script uses GNU sed syntax that is incompatible with macOS BSD sed. If you encounter `sed: bad flag in substitute command` errors, install GNU sed and prepend it to your PATH:

```bash
brew install gnu-sed
PATH="/opt/homebrew/opt/gnu-sed/libexec/gnubin:$PATH" ./manage.sh -n <network> -a start
```
{% endhint %}

{% hint style="info" %}
With an optional HTTP proxy on port 80:

{% code title="Start with proxy" %}
```bash
./manage.sh -n <network> -a start -f proxy
```
{% endcode %}
{% endhint %}
{% endstep %}
{% endstepper %}

### Accessing the services

{% hint style="info" %}
For networks other than `mocknet`, downloading the initial headers can take several minutes. Until the headers are downloaded, the `/v2/info` endpoints won't return any data.

Follow the logs to track the sync progress:

{% code title="Follow logs" %}
```bash
./manage.sh -n <network> -a logs
```
{% endcode %}
{% endhint %}

stacks-blockchain:

* Ports `20443-20444` are exposed on `localhost`

{% code title="Check stacks-blockchain /v2/info" %}
```bash
curl -sL localhost:20443/v2/info | jq -r
```
{% endcode %}

stacks-blockchain-api:

* Port `3999` is exposed on `localhost`

{% code title="Check stacks-blockchain-api" %}
```bash
curl -sL localhost:3999 | jq -r
```
{% endcode %}

proxy:

* Port `80` is exposed on `localhost`

{% code title="Check proxy" %}
```bash
curl -sL localhost/v2/info | jq -r
curl -sL localhost | jq -r
```
{% endcode %}

### Upgrades

{% hint style="warning" %}
For schema-breaking upgrades to running instances of this repo, you'll need to [run an event-replay](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/upgrade.md).
{% endhint %}
