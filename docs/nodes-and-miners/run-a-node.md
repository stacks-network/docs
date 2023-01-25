---
title: Run a Node with Docker
description: Set up and run a Stacks node
sidebar_position: 1
tags:
  - tutorial
---

## Stacks Blockchain with Docker

Run your own Stacks Blockchain node using [docker-compose](https://docs.docker.com/compose/) with just few commands using [stacks-blockchain-docker](https://github.com/stacks-network/stacks-blockchain-docker)

- [Quickstart](./run-a-node#quickstart)
- [Requirements](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/requirements.md)
- [Docker Setup](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/docker.md)
- [Configuration](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/config.md)
- [Upgrading](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/upgrade.md)
- [Common Issues](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/issues.md)

## **Requirements:**

The **minimum viable requirements** are listed below.

While you _can_ run a node using these specs, it's _recommended_ to assign more than the minimum for better performance.

- ⚠️ [docker-compose](https://docs.docker.com/compose/install/) version `2.2.2` or greater is **required**
- **4GB memory**
- **1 Vcpu** ( _minimum of 2 Vcpu is recommended_ )
- **100GB disk** ( _minimum of 150GB SSD is recommended_ )

:::caution MacOS with an ARM processor is NOT recommended

The way Docker for Mac on an Arm CPU is designed makes the I/O incredibly slow, and blockchains are **_very_** heavy on I/O.
This only seems to affect MacOS, other Arm based systems like Raspberry Pi work as expected.
:::

## **Quickstart**

The `<network>` placeholder used below can be replaced with one of:

- mainnet
- testnet
- mocknet

1. **Clone the stacks-blockchain-docker repository locally**

```bash
git clone https://github.com/stacks-network/stacks-blockchain-docker && cd stacks-blockchain-docker
```

2. **Start the Services**

```bash
./manage.sh -n <network> -a start
```

:::note With an optional HTTP proxy on port 80:

```bash
./manage.sh -n <network> -a start -f proxy
```

:::

## **Accessing the services**

:::tip
For networks other than `mocknet`, downloading the initial headers can take several minutes. Until the headers are downloaded, the `/v2/info` endpoints won't return any data.

Follow the logs to track the sync progress:

```bash
./manage.sh -n <network> -a logs
```

:::

**stacks-blockchain**:

- Ports `20443-20444` are exposed on `localhost`

```bash
curl -sL localhost:20443/v2/info | jq -r
```

**stacks-blockchain-api**:

- Port `3999` is exposed on `localhost`

```bash
curl -sL localhost:3999 | jq -r
```

**proxy**:

- Port `80` is exposed on `localhost`

```bash
curl -sL localhost/v2/info | jq -r
curl -sL localhost | jq -r
```

---

## Upgrades

:::caution
For schema-breaking upgrades to running instances of this repo, you'll need to [run an event-replay](https://github.com/stacks-network/stacks-blockchain-docker/blob/master/docs/upgrade.md):
:::

---
