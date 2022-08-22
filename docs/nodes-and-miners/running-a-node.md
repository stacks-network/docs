---
title: Running a node
description: Set up and run a Stacks node
sidebar_position: 1
tags:
  - tutorial
---

## Stacks Blockchain with Docker

Run your own Stacks Blockchain node easily with just few commands.

This tutorial describes a simple and effective way to run a Stacks node using public scripts hosted in [Stacks Blockchain repository](https://github.com/stacks-network/stacks-blockchain-docker). Valid for mainnet, testnet and mocknet.


## **Requirements:**

- [Docker](https://docs.docker.com/get-docker/) >= `17.09`
- [docker-compose](https://github.com/docker/compose/releases/) >= `1.27.4`
- [git](https://git-scm.com/downloads)
- [jq binary](https://stedolan.github.io/jq/download/)
- [sed](https://www.gnu.org/software/sed/)
- Machine with (at a minimum):
  - 4GB memory
  - 1 Vcpu
  - 50GB storage (600GB if you optionally also run the bitcoin mainnet node)

:::caution MacOS with an M1 processor is NOT recommended

The way Docker for Mac on an Arm chip is designed makes the I/O incredibly slow, and blockchains are **_very_** heavy on I/O.
This only seems to affect MacOS, other Arm based systems like Raspberry Pi's seem to work fine.

:::


### Install/Update docker-compose

:::note
`docker-compose` executable is required, even though recent versions of Docker contain `compose` natively
:::

- [Install Docker-compose](https://docs.docker.com/compose/install/)
- [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/)
- [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)
- [Docker Engine for Linux](https://docs.docker.com/engine/install/#server)

First, check if you have `docker-compose` installed locally.

To do that, run this command in your terminal :

```bash
docker-compose --version
```

Output should look something very similar to this :

```
docker-compose version 1.27.4, build 40524192
```

If the command is not found, or the version is < `1.27.4`, run the following to install the latest to `/usr/local/bin/docker-compose`:

```bash
#You will need to have jq installed, or this snippet won't run.
VERSION=$(curl --silent https://api.github.com/repos/docker/compose/releases/latest | jq .name -r)
DESTINATION=/usr/local/bin/docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/${VERSION}/docker-compose-$(uname -s)-$(uname -m) -o $DESTINATION
sudo chmod 755 $DESTINATION
```

### Security note on docker

The Docker daemon always runs as the root user so by default you will need root privileges to interact with it.

The script `manage.sh` uses docker, so to avoid the requirement of needing to run the script with root privileges it is prefered to be able to *manage Docker as a non-root user*, following [these simple tests](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).

This will avoid the need of running the script with root privileges for all operations except the removal of data.

### Configuration files you can edit

The following files can be modified to personalize your node configuration, but generally most of them should be left as-is. All these files will be created from the sample copy if they don't exist at runtime (for example `.env` is created from [`sample.env`](sample.env) ). However these files will never be modified by the application once created and will never be pushed back to github, so your changes will be safe.

* `.env`
* `./conf/mainnet/Config.toml`
* `./conf/mainnet/bitcoin.conf`
* `./conf/testnet/Config.toml`
* `./conf/testnet/bitcoin.conf`

By default:

- BNS data is **not** enabled/imported
  - To enable, uncomment `# BNS_IMPORT_DIR=/bns-data` in `./env`
    - Download BNS data: `./manage.sh bns`
- Fungible token metadata is **not** enabled
  - To enable, uncomment `# STACKS_API_ENABLE_FT_METADATA=1` in `./env`
- Non-Fungible token metadata is **not** enabled
  - To enable, uncomment `# STACKS_API_ENABLE_NFT_METADATA=1` in `./env`
- Verbose logging is **not** enabled
  - To enable, uncomment `# VERBOSE=true` in `./env`
- Bitcoin blockchain folder is configured in `BITCOIN_BLOCKCHAIN_FOLDER` in `./env`

### Local Data Dirs

Directories will be created on first start that will store persistent data under `./persistent-data/<folder>`

`<folder>` can be 1 of:

- mainnet
- testnet
- mocknet

## **Quickstart**

1. **Clone the stacks-blockchain-docker repository locally**

```bash
git clone https://github.com/stacks-network/stacks-blockchain-docker && cd stacks-blockchain-docker
```

2. **Optionally, create/copy `.env` file**. If file `.env` doesn't exist when launched it will be created from `sample.env` automatically.

```bash
cp sample.env .env
```

_You may also use a symlink as an alternative to copying: `ln -s sample.env .env`_

3. **Ensure all images are up to date**

```bash
./manage.sh -n <network> -a pull
```

4. **Start the Services**

```bash
./manage.sh -n <network> -a start
```

- With optional proxy:

```bash
./manage.sh -n <network> -a start -f proxy
```

- With optional bitcoin node:

```bash
./manage.sh -n <network> -a start -f bitcoin
```

5. **Stop the Services**

```bash
./manage.sh -n <network> -a stop
```

6. **Retrieve Service Logs**

```bash
./manage.sh -n <network> -a logs
```

- Export docker log files to `./exported-logs`:

This will create one log file for every running service, for example: postgres.log, stacks-blockain.log, stacks-blockchain-api.log and bitcoin-core.log.  
Notice that each time you run this command the log files will be overwritten.

```bash
./manage.sh -n <network> -a logs export
```

7. **Restart all services**

```bash
./manage.sh -n <network> -a restart
```

- With optional proxy:

```bash
./manage.sh -n <network> -a restart -f proxy
```

8. **Delete** all data in `./persistent-data/<network>` and/or data of the Bitcoin blockchain.

    This data is owned by root, so you will need to run it with sudo privileges so it can delete the data.

```bash
$ sudo ./manage.sh -n <network> -a reset

Please confirm what persistent data you wish to delete: 

0. Cancel                 
1. Delete Persistent data for Stacks testnet only and leave Bitcoin blockchain data unaffected. 
2. Delete Persistent data for Stacks testnet and Bitcoin blockchain data in ./persistent-data/blockchain-bitcoin 
3. Delete Persistent data for Bitcoin blockchain data in ./persistent-data/blockchain-bitcoin only. 
Please note that BNS data will never get deleted. 

Type 0, 1, 2 or 3: 2

Ok. Delete Stacks and Bitcoin data. 
[ Success ]      Persistent data deleted for Bitcoin blockchain.
[ Success ]      Persistent data deleted for Stacks testnet.

```

9. **Download BNS data to** `./persistent-data/bns-data`

```bash
./manage.sh bns
```

10. **Export stacks-blockchain-api events** (_Not applicable for mocknet_)

```bash
./manage.sh -n <network> -a export
# check logs for completion
./manage.sh -n <network> -a restart
```

11. **Replay stacks-blockchain-api events** (_Not applicable for mocknet_)

```bash
./manage.sh -n <network> -a import
# check logs for completion
./manage.sh -n <network> -a restart
```

## **Running also a bitcoin node (Optional)**

Stacks needs to use a Bitcoin node, and by default when you run a Stacks node you will be using a public Bitcoin node, which is configured in the `.env` file. Default values is `BITCOIN_NODE=bitcoin.mainnet.stacks.org`.

However, you can optionaly run both nodes together and configured in a way that you Stacks node will use your own Bitcoin node instead of a public one.

If you run the script with a bitcoin node it will download and build it directly from source for increased security. This process which only needs to happen once can take up to 20-30 minutes depending on the speed of your system. Also, once the bitcoin node is up and running it will need an additional time for sync for the first time (can be hours for testnet and days for mainnet).

### Why run Stacks node with your own Bitcoin node?

Because running your own Bitcoin node will give you higher security and improved perfomance.

* **Improved perfomance**: The Bitcoin node will serve you blocks faster, as well as UTXOs for your miner (if you run one).
* **Higher security**: The Bitcoin node will also have validated all bitcoin transactions the Stacks node consumes. If you don't run your own Bitcoin node, you're relying on the SPV headers to vouch for the validity of Bitcoin blocks.

The disadvantage of running your own Bitcoin node is that you need the extra space to store the Bitcoin blockchain (about 500GB) and the initial time it will take to download this data the first time.

### Example

You can run easily run your Stacks node with your own Bitcoin node by adding the flag `bitcoin`. This is available only for testnet and mainnet.

Example: `./manage.sh -n mainnet -a start -f bitcoin` or `./manage.sh -n testnet -a start -f bitcoin`

### Bitcoin node configuration

In the `.env` file there is the variable `BITCOIN_BLOCKCHAIN_FOLDER`.
As the bitcoin blockchain can be large (over 500GB) you optionally change this variable to any location of your choosing. If you have previously used the [bitcoin core application](https://bitcoin.org/en/bitcoin-core/) and already have the bitcoin blockchain synced, you can use the same data folder and avoid redownloading the entire bitcoin blockchain.

## **Accessing the services**

_Note_: For networks other than `mocknet`, downloading the initial headers can take several minutes. Until the headers are downloaded, the `/v2/info` endpoints won't return any data. \
Use the command `./manage.sh -n <network> -a logs` to check the sync progress.

**stacks-blockchain**:

- Ports `20443-20444` are exposed to `localhost`

```bash
curl -sL localhost:20443/v2/info | jq
```

**stacks-blockchain-api**:

- Port `3999` are exposed to `localhost`

```bash
curl -sL localhost:3999/v2/info | jq
```

**proxy**:

- Port `80` is exposed to `localhost`

```bash
curl -sL localhost/v2/info | jq
curl -sL localhost/ | jq
```

---

## Upgrades

⚠️ For upgrades to running instances of this repo, you'll need to [run the event-replay](https://github.com/hirosystems/stacks-blockchain-api#event-replay):

```bash
./manage.sh -n <network> -a stop
./manage.sh -n <network> -a export
./manage.sh -n <network> -a import
./manage.sh -n <network> -a restart
```

---

## **Workarounds to potential issues**

_**Port(s) already in use**_:

- If you have a port conflict, typically this means you already have a process using that same port.\
  To resolve, find the port you have in use (i.e. `3999` and edit your `.env` file to use the new port.

```bash
netstat -anl | grep 3999
```

```
tcp46      0      0  *.3999                 *.*                    LISTEN
```

_**Containers not starting (hanging on start)**_:

- Occasionally, docker can get **stuck** and not allow new containers to start. If this happens, simply restart your docker daemon and try again.

_**Database Issues**_:

- For any of the various Postgres/sync issues, it may be easier to simply remove the persistent data dir. Note that doing so will result in a longer startup time as the data is repopulated.

```bash
./manage.sh -n <network> -a stop
./manage.sh -n <network> -a reset
./manage.sh -n <network> -a start
```

_**API Missing Parent Block Error**_:

- If the Stacks blockchain is no longer syncing blocks, and the API reports an error similar to this:\
  `Error processing core node block message DB does not contain a parent block at height 1970 with index_hash 0x3367f1abe0ee35b10e77fbcaa00d3ca452355478068a0662ec492bb30ee0f13e"`,\
  The API (and by extension the DB) is out of sync with the blockchain. \
  The only known method to recover is to resync from genesis (**event-replay _may_ work, but in all likelihood will restore data to the same broken state**).

- To attempt the event-replay

```bash
./manage.sh -n <network> -a stop
./manage.sh -n <network> -a import
# check logs for completion
./manage.sh -n <network> -a restart
```

- To wipe data and re-sync from genesis

```bash
./manage.sh -n <network> -a stop
./manage.sh -n <network> -a reset
./manage.sh -n <network> -a restart
```
