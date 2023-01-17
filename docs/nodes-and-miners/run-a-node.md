---
title: Run a Node with Docker
description: Set up and run a Stacks node
sidebar_position: 1
tags:
  - tutorial
---

## Stacks Blockchain with Docker

Run your own Stacks Blockchain node on Docker with just few commands using [stacks-blockchain-docker](https://github.com/stacks-network/stacks-blockchain-docker)

- [Quickstart](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/README.md)
- [Requirements](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/requirements.md)
- [Docker Setup](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/docker.md)
- [Configuration](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/config.md)
- [Upgrading](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/upgrade.md)
- [Common Issues](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/issues.md)

## **Requirements:**

⚠️ `docker-compose` version `2.2.2` or greater is **required**

- Machine with (at a minimum):
  - 4GB memory
  - 1 Vcpu (the more CPU, the faster the node will respond and the faster it will sync)
  - 100GB storage (>= 150GB is recommended)

:::caution MacOS with an M1 processor is NOT recommended

The way Docker for Mac on an Arm chip is designed makes the I/O incredibly slow, and blockchains are **_very_** heavy on I/O.
This only seems to affect MacOS, other Arm based systems like Raspberry Pi's seem to work fine.

## **Quickstart**

1. **Clone the stacks-blockchain-docker repository locally**

```bash
git clone https://github.com/stacks-network/stacks-blockchain-docker && cd stacks-blockchain-docker
```

2. **Copy `.env` file**

   _If file `.env` doesn't exist when launched it will be created from `sample.env` automatically._

```bash
cp sample.env .env
```

_You may also use a symlink as an alternative to copying: `ln -s sample.env .env`_

3. **Start the Services**

```bash
./manage.sh -n <network> -a start
```

- With an optional HTTP proxy on port `80`:

```bash
./manage.sh -n <network> -a start -f proxy
```

## **Accessing the services**

:::tip
For networks other than `mocknet`, downloading the initial headers can take several minutes. Until the headers are downloaded, the `/v2/info` endpoints won't return any data.

Use the command `./manage.sh -n <network> -a logs` to check the sync progress.
:::

**stacks-blockchain**:

- Ports `20443-20444` are exposed to `localhost`

```bash
curl -sL localhost:20443/v2/info | jq -r
```

**stacks-blockchain-api**:

- Port `3999` are exposed to `localhost`

```bash
curl -sL localhost:3999/v2/info | jq -r
```

**proxy**:

- Port `80` is exposed to `localhost`

```bash
curl -sL localhost/v2/info | jq -r
curl -sL localhost/ | jq -r
```

---

## Upgrades

⚠️ For schema-breaking upgrades to running instances of this repo, you'll need to [run the event-replay](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/upgrade.md):

---
