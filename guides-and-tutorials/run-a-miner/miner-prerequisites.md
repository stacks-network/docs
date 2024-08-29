# Miner Prerequisites

## Prerequisites

### VM setup

The VM will not need a lot of resources to run a miner - the most resources will be consumed during the blockchain syncs (for both Bitcoin and Stacks). For this example, we'll be assuming a [**Debian**](https://www.debian.org/) host with `x86_64` architecture (_commands may also work on any Debian-derived distribution_)

A single CPU system with at least 4GB of memory and 1TB of disk space should be considered the minimum required specs to run the miner.

#### VM Specs

* Minimum CPU of: `1 vCPU`
* Minimum Memory of: `4GB Memory`
* Minimum Storage of: `1TB Disk` to allow for chainstate growth
  * as of **July 2022**:
    * Bitcoin chainstate is roughly `420GB`
    * Stacks chainstate is roughly `45GB`

**Disk Configuration**

Two options here - either are fine but it's _recommended_ to mount the chainstate from a separate disk that only contains the chainstate (option 1)

1. Separate disks for chainstate(s) and OS:
   * mount a dedicated disk for bitcoin at `/bitcoin` of 1TB
   * mount a dedicated disk for stacks-blockchain at `/stacks-blockchain` of at least 100GB
   * root volume `/` of at least 25GB
2. Combined Disk for all data:
   * root volume `/` of at least 1TB

Create the required directories:

```bash
$ sudo mkdir -p /bitcoin
$ sudo mkdir -p /stacks-blockchain
$ sudo mkdir -p /etc/bitcoin
$ sudo mkdir -p /etc/stacks-blockchain
```

**If using mounted disks**: mount the disks to each filesystem created above - edit `/etc/fstab` to automount these disks at boot.

Example:

```
/dev/xvdb1 /bitcoin xfs rw,relatime,attr2,inode64,noquota
/dev/xvdc1 /stacks-blockchain xfs rw,relatime,attr2,inode64,noquota
```

Mount the disks `sudo mount -a`

### Scripted install

You can use the scripts/prerequisites.sh to install everything:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/stacksfoundation/miner-docs/main/scripts/prerequisites.sh | bash
```

### Install required packages

The following packages are required, and used by the rest of these docs

```bash
$ curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
$ sudo apt-get update -y && sudo apt-get install -y \
    build-essential \
    jq \
    netcat \
    nodejs \
    git \
    autoconf \
    libboost-system-dev \
    libboost-filesystem-dev \
    libboost-thread-dev \
    libboost-chrono-dev \
    libevent-dev \
    libzmq5 \
    libtool \
    m4 \
    automake \
    pkg-config \
    libtool \
    libboost-system-dev \
    libboost-filesystem-dev \
    libboost-chrono-dev \
    libboost-program-options-dev \
    libboost-test-dev \
    libboost-thread-dev \
    libboost-iostreams-dev
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh && source $HOME/.cargo/env
$ sudo npm install -g @stacks/cli rimraf shx
```
