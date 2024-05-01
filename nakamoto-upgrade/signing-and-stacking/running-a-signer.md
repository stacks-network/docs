# How to Run a Signer

### Minimum System Requirements to Run a Signer

* 8 vcpu
* 32GB memory
* 1 TB storage for Bitcoin node, 350 GB for Stacks node, and 1 GB for signer

### Background and High-Level Process

In order to run a signer, you'll need to run a signer and a Stacks node side-by-side. Specifically, you'll want to run a testnet follower node. Instructions for doing this are listed below in the "Running Your Stacks Node" section. The signer will monitor for events coming from the stacks node and is in charge of using the generated account (next section) to sign incoming Stacks blocks sent from the Stacks node.

This doc will provide instructions on how to set up both using either Docker or building from source. Binaries will not be available in the initial release but will be released at a later date.

It will also walk through how to set up the config files to get the signer and Stacks node communicating correctly.

### Knowledge Prerequisites

* Docker and basic knowledge of pulling and running images
* Basic knowledge of [Stacks accounts](../../stacks-101/accounts.md)
* Basic knowledge of [stacking](../../stacks-101/stacking.md) and the [Nakamoto stacking flow](stacking-flow.md)

<details>

<summary>Signer Checklist</summary>

Detailed steps for each of these are laid out below, but this checklist is being included as a way to quickly reference if you have taken all the appropriate actions to run a signer.

**Pre-Launch Setup**

* [ ] Ensure your system meets the following requirements:
  * 4 vCPU
  * 8GB memory
  * 150 GB storage (350 GB if running a Stacks node)
* [ ] Acquire Docker and basic knowledge of Stacks accounts, stacking, and the Nakamoto stacking flow (links provided below).

**Preflight Setup**

* [ ] Generate a new private key on testnet using stacks-cli.
* [ ] Save the generated account information securely.

**Configuration Setup**

* [ ] Create a `signer-config.toml` file with necessary configurations:
  * node\_host
  * endpoint
  * network
  * db\_path
  * auth\_password
  * stacks\_private\_key
* [ ] Store `signer-config.toml` securely and note down the values used.

**Running the Signer**

* [ ] Decide whether to run the signer using Docker (recommended) or as a binary.
* [ ] If using Docker:
  * [ ] Set up the necessary ports and volumes.
  * [ ] Run the Docker container with the appropriate settings.
* [ ] If running as a binary:
  * [ ] Build `stacks-core` from source or download the pre-built binary.
  * [ ] Run the signer using the command: `stacks-signer run --config <path_to_config>`.

**Verify Signer Operation**

* [ ] Check that the signer is listening on its configured endpoint.
* [ ] Confirm that there are no errors and the system is ready for connections.

**Setting Up the Stacks Node**

* [ ] Create a `node-config.toml` with the necessary settings:
  * block\_proposal\_token
  * events\_observer.endpoint (matching the signer configuration)
* [ ] Decide whether to run the Stacks node using Docker or as a binary.
* [ ] If using Docker:
  * [ ] Set up the Docker container with the correct ports and volumes.
  * [ ] Run the Stacks node Docker container.
* [ ] If running as a binary:
  * [ ] Download the appropriate binary.
  * [ ] Run it with the command: `./stacks-node start --config <path_to_config>`.

**Verify Stacks Node Operation**

* [ ] Check the Stacks node logs for successful connection to the signer.
* [ ] Confirm that the node is syncing Bitcoin headers properly.

**Setup Stacks Accounts**

* [ ] Set up a “pool operator” wallet in a Stacks wallet (e.g., Leather or Xverse).
* [ ] Fund the pool operator wallet with STX (testnet) sufficient for transaction fees.
* [ ] Share the pool operator wallet’s STX address with delegating parties.
* [ ] Fund your signer's STX wallet with enough STX to cover transaction fees (recommend at least 100-200 STX).

</details>

### Preflight Setup

Before you get your signer set up, you'll need to [generate a new private key on testnet](https://docs.stacks.co/stacks-101/accounts#creation). The `stacks-cli` provides a mechanism for quickly generating a new account keychain via a simple CLI interface. The linked guide will show you how to create one of those accounts on testnet.

Once you follow the instructions linked above, be sure to save the information in a secure location, you'll need it in a future step.

### Create a Configuration File

Create a new file called `signer-config.toml`. In that file, put the contents from the example signer config file from the [Sample Configuration Files](sample-configuration-files.md) page. Each field is described on that page.

### Running the Signer

There are two options for running the signer: Docker and building from source. The recommended option is to use Docker. If you want to run as a binary, you will need to build `stacks-core` from source. Instructions for how to do this are contained below in the relevant section.

{% hint style="warning" %}
Note that at the moment the signer should only be run on testnet using these instructions. The mainnet release is still under development.
{% endhint %}

#### Running the Signer with Docker

You can run the signer as a Docker container using the [`blockstack/stacks-core:2.5.0.0.3`](https://hub.docker.com/r/blockstack/stacks-core/tags?page=1\&name=2.5.0.0.3) image.

When running the Docker container, you’ll need to ensure a few things:

* The port configured as the `endpoint` (in the above example, “30000”) must be exposed to your Stacks node. Note that this endpoint should not be public, but must be exposed to your Stacks node
* You’ll need a volume with at least a few GB of available storage that contains the folder your `db_path` is in. In the above example, that would be /var
* You’ll need to include your `signer-config.toml` file as noted below with the first `-v` flag

An example command for running the Docker image with ”`docker run`” is shown below.

Be sure to replace the `STX_SIGNER_PATH` with the correct path to your config file and where you want to install and run the signer. In this example it will be doing so in the current directory.

```bash
IMG="blockstack/stacks-core"
VER="2.5.0.0.3"
STX_SIGNER_PATH="./"
STX_SIGNER_DATA="$STX_SIGNER_PATH/data"
STX_SIGNER_CONFIG="$STX_SIGNER_PATH/signer-config.toml"

docker run -d \
    -v $STX_SIGNER_CONFIG:/config.toml \
    -v $STX_SIGNER_DATA:/var/stacks \
    -p 30000:30000 \
    -e RUST_BACKTRACE=full \
    -e BLOCKSTACK_DEBUG=0 \
    --name stacks-signer \
    $IMG:$VER \
    stacks-signer run \
    --config /config.toml
```

{% hint style="info" %}
If you get an error saying that the manifest cannot be found or about the requested image platform not matching the host platform, you are probably running on system architecture other than x64 arch. Since you are using a PR release you'll need to specify your platform with the `--platform` flag.

For example, if you are running on M1 Mac, you would add `--platform=linux/amd64` to the above command.
{% endhint %}

Or, with a custom Dockerfile:

```docker
FROM blockstack/stacks-core:2.5.0.0.3
COPY signer-config.toml /config.toml
EXPOSE 30000
CMD ["stacks-signer", "run", "--config", "/config.toml"]
```

#### Running the Signer as a Binary

If you do not want to use Docker, you can alternatively run your stacks node as a binary.

Official binaries are available from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases). Each release includes pre-built binaries. Download the ZIP file for your server’s architecture and decompress it. Inside of that folder is a `stacks-signer` binary.

You can run the signer with the following command (be sure to replace `../signer-config.toml` with the actual path of your config file).

```bash
stacks-signer run --config ../signer-config.toml
```

#### Verify the Signer is Running

To make sure your signer is running successfully, run `docker ps` to list your running containers.

You should see something like this

<figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

Now check the logs of that container by running:

```bash
docker logs 877d478dfe7f
```

Be sure to replace the container ID at the end with your actual container ID.

You should see a message that says `Signer spawned successfully. Waiting for messages to process...`.

You may also see a message indicating that your signer is not registered, like this:

```
WARN [1712003997.160121] [stacks-signer/src/runloop.rs:247] [signer_runloop] Signer is not registered for reward cycle 556. Waiting for confirmed registration...
```

This means your signer is running successfully. Your next step is to begin stacking in order to get your signer registered. First, if you haven't yet, get your Stacks node up and running following the instructions below and then proceed to [How to Stack](stacking-flow.md) to get started stacking.

{% hint style="warning" %}
Even after you Stack, you may still see a message that says:

```
Signer is not registered for the current reward cycle (557) or next reward cycle (558). Waiting for confirmed registration...
```

This is normal and means that you have stacked, but have not yet reach the prepare phase for your chosen reward cycle. Assuming you have met the stacking minimum, your signer will be picked up and registered during this prepare phase.
{% endhint %}

### Setup Your Stacks Node

Once your signer is running, the next step is to set up and run a Stacks node. It’s important to have the signer already running, because the node will not run unless it is able to send events to the signer.

#### Stacks Node Configuration

Create a file called `node-config.toml`. On the [Sample Configuration Files](sample-configuration-files.md) page you'll find the full configuration file contents you'll need to add to this file.

The important aspects that you’ll need to change are:

* `working_dir`: a directory path where the node will persist data
* `block_proposal_token`: an authentication token that your signer uses to authenticate certain requests to your node. This must match the value you used as `auth_password` in the signer’s configuration.
* `events_observer.endpoint`: This is the host (IP address and port) where your signer is configured to listen for events. An example string would be ”`127.0.0.1:30000`” or ”`my-signer.local:30000`”

#### Start with an archive

If you are running your Stacks node on the primary testnet, it will be much faster to start with an archive of the chain state rather than syncing from genesis.

Archives can be found from [https://archive.hiro.so](https://archive.hiro.so). For the Stacks node testnet, the latest snapshot can be found at [https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz](https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz). You can also [browse all testnet snapshots](https://archive.hiro.so/testnet/stacks-blockchain/).

You’ll want to download this on the same machine that will run the Stacks node. One way to do this is:

```
curl -# https://archive.hiro.so/testnet/stacks-blockchain/testnet-stacks-blockchain-latest.tar.gz -o stacks-snapshot.tar.gz
tar -zxvf stacks-snapshot.tar.gz
```

This will decompress the snapshot and create a `xenon` folder in the same place that you downloaded the archive.

For the Stacks node to use this archive, you must specify `working_dir` in your config file to be the place where you can find the `xenon` folder.

For example:

* The snapshot is available at /Users/blah/xenon
* You will set working\_dir to equal ”/Users/blah”
  * Note that the string does not include the “xenon” part

#### Run a Stacks Node with Docker

You can run the Stacks node as a Docker container using the `blockstack/stacks-core` image. When running the Docker container, you’ll need to ensure a few things:

* The port configured for `p2p_bind` must be exposed to the internet
* The port configured for `rpc_bind` must be accessible by your signer
* `working_dir` needs to be on a volume with 500GB-1TB of available storage
* You’ll need to include your `node-config.toml` file

An example for running the node’s Docker image with docker run is below. Be sure to run this from the same directory as your `node-config.toml` file or change the `STX_NODE_CONFIG` option.

```bash
IMG="blockstack/stacks-core"
VER="2.5.0.0.3"
STX_NODE_CONFIG="./node-config.toml"

docker run -d \
    -v $STX_NODE_CONFIG:/config.toml \
    -v /var/stacks \
    -p 20443:20443 \
    -p 20444:20444 \
    -e RUST_BACKTRACE=full \
    --name stacks-node \
    $IMG:$VER \
    stacks-node start \
    --config /config.toml
```

Or, using a custom Dockerfile:

```docker
FROM blockstack/stacks-core:2.5.0.0.3
COPY node-config.toml /config.toml
EXPOSE 20444
EXPOSE 20443
CMD ["stacks-node", "start", "--config", "/config.toml"]
```

#### Run a Stacks Node with a Binary

If you do not want to use Docker, you can alternatively run your stacks node as a binary.

Official binaries are available from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases). Each release includes pre-built binaries. Download the ZIP file for your server’s architecture and decompress it. Inside of that folder is a `stacks-node` binary.

You can start the binary with:

```bash
./stacks-node start --config node-config.toml
```

#### Verify Stacks Node is Running

Once you’ve started the Stacks node, you’ll see logs that start like this:

```bash
Mar  6 19:35:08.212848 INFO stacks-node 0.1.0
Mar  6 19:35:08.213084 INFO Loading config at path ./Stacks-config.toml
Mar  6 19:35:08.216674 INFO Registering event observer at: localhost:30000
Mar  6 19:35:08.221603 INFO Migrating sortition DB to the latest schema version
Mar  6 19:35:08.224082 INFO Migrating chainstate DB to the latest schema version
Mar  6 19:35:08.227404 INFO Start syncing Bitcoin headers, feel free to grab a cup of coffee, this can take a while
```

It’s important to ensure that you see the log message `Registering event observer at XXX` with your signer’s endpoint included. Once Bitcoin headers have been synced, you may also be able to send a GET request to `/v2/info` on your Stacks node’s RPC endpoint (port 20443 by default).

You may see a lot of messages while the node is syncing with Bitcoin blocks. You can check the [FAQ](faq.md) if any of these concern you, but in all likelihood you can ignore any messages until Bitcoin blocks are synced.

### Setup Your Stacks Accounts

As a signer you’ll need to fund and manage two Stacks accounts:

1. A “pool operator” wallet, which commits delegated STX to your signer
2. Your signer’s wallet, which needs a small amount of STX for making automated transactions during epoch 2.5

{% hint style="warning" %}
Make sure that you are using testnet, and not mainnet, STX. You can change network settings within your wallet, and testnet STX can be [requested from a faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet).
{% endhint %}

#### Setup Your Pool Operator Wallet

You can set up your pool operator wallet using any Stacks wallet, such as [Leather](https://leather.io) or [Xverse](https://www.xverse.app). You may choose to generate a new account or use an existing one. If you prefer to use a hardware wallet, Leather has support for the Ledger hardware wallet.

Once your wallet has been created, you’ll need to fund it with enough STX to cover transaction fees. For testnet, you can use a [faucet exposed by the Stacks Explorer](https://explorer.hiro.so/sandbox/faucet?chain=testnet).

Finally, share this wallet’s STX address with the parties that will be delegating STX to you.

#### Fund Your Signer's STX Wallet

Before the Nakamoto transition, signers need a small amount of STX to cover transaction fees. The transactions created from this wallet are all automated by the signer.

In a previous step, where you generated a keychain, an address field was included in the output. This is your signer wallet’s STX address. You can also choose to use the mnemonic to access the wallet with [Leather](https://leather.io) or [Xverse](https://www.xverse.app).

Transfer funds (or use the faucet) into the signer’s wallet address. We recommend at least 100-200 STX to cover transaction fees.
