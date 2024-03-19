# Running a Signer

{% hint style="danger" %}
This document intends to lay out all the steps required to run a signer on testnet after the Nakamoto Testnet milestone is reached and deployed to testnet on March 25. Pre-Launch Testnet (current testnet version) will be undergoing frequent updates, so these instructions may change.
{% endhint %}

### System Requirements to Run a Signer

* 4 vcpu
* 8GB memory
* 150 GB storage (250 GB if running a Stacks node)

### Background and High-Level Process

In order to run a signer, you'll need to run a signer and a Stacks node side-by-side. Specifically, you'll want to run a testnet follower node. Instructions for doing this are listed below in the "Running Your Stacks Node" section. The signer will monitor for events coming from the stacks node and is in charge of using the generated account (next section) to sign incoming Stacks blocks sent from the Stcks node.

This doc will provide instructions on how to set up both using either Docker or as a binary building from source. It will also walk through how to set up the config files to get the signer and Stacks node communicating correctly.

### Knowledge Prerequisites

* Docker and basic knowledge of pulling and running images
* Basic knowledge of [Stacks accounts](../stacks-101/accounts.md)
* Basic knowledge of [stacking](../stacks-101/stacking.md) and the [Nakamoto stacking flow](stacking-flow.md)

<details>

<summary>Signer Checklist</summary>



Detailed steps for each of these are laid out below, but this checklist is being included as a way to quickly reference if you have taken all the appropriate actions to run a signer.

### Pre-Launch Setup

* [ ] Ensure your system meets the following requirements:
  * 4 vCPU
  * 8GB memory
  * 150 GB storage (250 GB if running a Stacks node)
* [ ] Acquire Docker and basic knowledge of Stacks accounts, stacking, and the Nakamoto stacking flow (links provided below).

### Preflight Setup

* [ ] Generate a new private key on testnet using stacks-cli.
* [ ] Save the generated account information securely.

### Configuration Setup

* [ ] Create a `signer-config.toml` file with necessary configurations:
  * node\_host
  * endpoint
  * network
  * db\_path
  * auth\_password
  * stacks\_private\_key
* [ ] Store `signer-config.toml` securely and note down the values used.

### Running the Signer

* [ ] Decide whether to run the signer using Docker (recommended) or as a binary.
* [ ] If using Docker:
  * [ ] Ensure the Docker image tag `next` is used.
  * [ ] Set up the necessary ports and volumes.
  * [ ] Run the Docker container with the appropriate settings.
* [ ] If running as a binary:
  * [ ] Build `stacks-core` from source or download the pre-built binary.
  * [ ] Run the signer using the command: `stacks-signer run --config <path_to_config>`.

### Verify Signer Operation

* [ ] Check that the signer is listening on its configured endpoint.
* [ ] Confirm that there are no errors and the system is ready for connections.

### Setting Up the Stacks Node

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

### Verify Stacks Node Operation

* [ ] Check the Stacks node logs for successful connection to the signer.
* [ ] Confirm that the node is syncing Bitcoin headers properly.

### Setup Stacks Accounts

* [ ] Set up a “pool operator” wallet in a Stacks wallet (e.g., Leather or Xverse).
* [ ] Fund the pool operator wallet with STX (testnet) sufficient for transaction fees.
* [ ] Share the pool operator wallet’s STX address with delegating parties.
* [ ] Fund your signer's STX wallet with enough STX to cover transaction fees (recommend at least 100-200 STX).

</details>

### Preflight Setup

Before you get your signer set up, you'll need to [generate a new private key on testnet](https://docs.stacks.co/stacks-101/accounts#creation). The `stacks-cli` provides a mechanism for quickly generating a new account keychain via a simple CLI interface. The linked guide will show you how to create one of those accounts on testnet.

Once you follow the instructions linked above, be sure to save the information in a secure location, you'll need it in a future step.

### Create a Configuration File

Create a new file called `signer-config.toml`, with the following contents:

```toml
node_host = "127.0.0.1:20443"
endpoint = "0.0.0.0:30000"
network = "testnet"
db_path = "/var/signer.sqlite"
auth_password = "$your_http_auth_token"
stacks_private_key = "$your_stacks_private_key"
```

The definition of these fields are:

* `node_host`: The IP address and port where your Stacks node can be accessed. The port 20443 is the default RPC endpoint for Stacks nodes. Note that you must use an IP address - DNS hosts are not supported at this time.
* `endpoint`: This is the location where the signer will expose an RPC endpoint for receiving events from your Stacks node.
* `network`: either “testnet” or “mainnet”
* `db_path`: this is a file path where your signer will persist data. If using Docker, this must be within a volume, so that data can be persisted across restarts
* `auth_password`: an authentication token that is used for some HTTP requests made from the signer to your Stacks node. You’ll need to use this later on when configuring your Stacks node. You create this field yourself, rather than it being generated with your private key.
* `stacks_private_key`: This is the hex-encoded privateKey field from the keys you generated in the previous step.

### Running the Signer

There are two options for running the signer: Docker and binary. The recommended option is to use Docker. If you want to run as a binary, you will need to build `stacks-core` from source. Instructions for how to do this are contained below in the relevant section.

#### Running the Signer with Docker

You can run the signer as a Docker container using the `blockstack/stacks-core` image.&#x20;

When running the Docker container, you’ll need to ensure a few things:

* You'll want to use the `next` tag of the image, as that includes the signer binary
* The port configured as the `endpoint` (in the above example, “30000”) must be exposed to your Stacks node.
* You’ll need a volume with at least a few GB of available storage that contains the folder your `db_path` is in. In the above example, that would be /var
* You’ll need to include your `signer-config.toml` file as noted below with the first `-v` flag

An example command for running the Docker image with ”`docker run`” (be sure to remove the comments before running):

```bash
docker run -d \
  -v ./signer-config.toml:/config.toml \ # your config file, make sure you are in the same directory
  -v data_folder:/var \ # your data volume
  -p 30000:30000
  -e RUST_BACKTRACE=full \
  -e BLOCKSTACK_DEBUG=0 \
  blockstack/stacks-core:next \ # the docker image, currently tagged as `next`
  stacks-signer run \
  --config /config.toml \
```

{% hint style="info" %}
If you get an error saying that the manifest cannot be found, you are probably running on system architecture other than x64 arch. Since you are using a PR release (`next`) you'll need to specify your platform with the `--platform` flag.

For example, if you are running on M1 Mac, you would add `--platform=linux/amd64` to the above command.
{% endhint %}

Or, with a custom Dockerfile:

```docker
FROM blockstack/stacks-core:next
COPY signer-config.toml /config.toml
EXPOSE 20444
EXPOSE 20443
CMD ["stacks-signer", "run", "--config", "/config.toml"]
```

#### Running the Signer as a Binary

The current release does not have the stacks-signer binary. If you want to run the signer as a binary right now, you'll need to [build `stacks-core` from source](https://github.com/stacks-network/stacks-core?tab=readme-ov-file#building).

{% hint style="info" %}
Official binaries are available from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases). Each release includes pre-built binaries. After Nakamoto is officially released, you will be able to download the ZIP file for your server’s architecture and decompress it. Inside of that folder will be a `stacks-signer` binary.
{% endhint %}

After you run `cargo build`, you can then run the signer with the following command (be sure to replace `../signer-config.toml` with the actual path of your config file).

```bash
stacks-signer run --config ../signer-config.toml
```

#### Verify the Signer is Running

After the signer starts, you won’t see any activity in logs until your Stacks node starts sending events to it. You can still verify that the signer is listening on its endpoint by GET requesting the `/status` endpoint, which should return `200 OK`.

### Setup Your Stacks Node

Once your signer is running, the next step is to set up and run a Stacks node. It’s important to have the signer already running, because the node will not run unless it is able to send events to the signer.

#### Stacks Node Configuration

Create a file called `node-config.toml` with the following contents:

```toml
[node]
name = "xenon"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
working_dir = "/var/data"

[connection_options]
block_proposal_token = "$your_http_auth_token"

[burnchain]
chain = "bitcoin"
mode = "xenon"
peer_host = "bitcoind.testnet.stacks.co"
username = "blockstack"
password = "blockstacksystem"
rpc_port = 18332
peer_port = 18333

[[events_observer]]
endpoint = "$your_signer_endpoint"
retry_count = 255
include_data_events = false
events_keys = ["stackerdb", "block_proposal"]
```

The important aspects that you’ll need to change are:

* `working_dir`: a directory path where the node will persist data
* `block_proposal_token`: an authentication token that your signer uses to authenticate certain requests to your node. This must match the value you used as `auth_password` in the signer’s configuration.
* `events_observer.endpoint`: This is the host (IP address and port) where your signer is configured to listen for events. An example string would be ”`127.0.0.1:30000`” or ”`my-signer.local:30000`”

#### Run a Stacks Node with Docker

You can run the Stacks node as a Docker container using the `blockstack/stacks-core` image. When running the Docker container, you’ll need to ensure a few things:

* The port configured for `p2p_bind` must be exposed to the internet
* The port configured for `rpc_bind` must be accessible by your signer
* `working_dir` needs to be on a volume with 500GB-1TB of available storage
* You’ll need to include your `node-config.toml` file

An example for running the node’s Docker image with docker run:

```bash
docker run -d \
  -v ./node-config.toml:/config.toml \ # your config file
  -v data_folder:/var/data \ # your data volume
  -p 20443:20443 \
  -p 20444:20444 \
  -e RUST_BACKTRACE=full \
  blockstack/stacks-core:next \ # the docker image, currently tagged as `next`
  stacks-node start --config config.toml
```

Or, using a custom Dockerfile:

```docker
FROM blockstack/stacks-core:next
COPY node-config.toml /config.toml
EXPOSE 20444
EXPOSE 20443
CMD ["stacks-node", "start", "--config", "/config.toml"]
```

#### Run a Stacks Node with a Binary

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

{% hint style="warning" %}
**Important note:** Until the official Nakamoto testnet is released, your node will not sync any new Stacks blocks. Updated configuration details will be released when the public Nakamoto testnet is ready.
{% endhint %}

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

Transfer funds (or use the faucet) into the signer’s wallet address. We recommend at least 100-200 STX to cover transaction fees.\
