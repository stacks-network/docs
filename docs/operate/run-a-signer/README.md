# Run a Signer

### How to Use This Guide

If you are not familiar with the concept of signing and stacking, and how they work together, be sure to check out the [Stackers and Signing concept guide](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/block-production/signing).

This guide is a step-by-step walkthrough for setting up and running a signer. If you need to troubleshoot your signer setup, see the Signer Troubleshooting section. If you need to Stack your STX, or have questions about how that process works, check out the Stack STX guide.

### Background and High-Level Process

To run a signer you'll run a signer and a Stacks node side-by-side. Specifically, run a follower node. The signer monitors events from the Stacks node and uses the generated account (see Preflight Setup) to sign incoming Stacks blocks sent from the Stacks node.

This doc provides instructions to set up both using either Docker or the release binaries available in the [stacks core releases](https://github.com/stacks-network/stacks-core/releases) repository, and how to configure them so the signer and Stacks node communicate correctly.

### Knowledge Prerequisites

* Docker and basic knowledge of pulling and running images
* Basic knowledge of [Stacks accounts](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/network-fundamentals/wallets-and-accounts)
* Basic knowledge of [stacking](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/block-production/stacking) and the stacking flow

{% stepper %}
{% step %}
#### Signer Checklist — Pre-Launch Setup

Quick reference of major setup steps prior to launching a signer.

* Ensure your system meets the [minimum system requirements](./#minimum-system-requirements).
* Acquire Docker and basic knowledge of Stacks accounts, stacking, and the Nakamoto stacking flow (links above).
{% endstep %}

{% step %}
#### Signer Checklist — Preflight Setup

* Generate a new private key using stacks-cli (see Preflight Setup).
* Save the generated account information securely.
{% endstep %}

{% step %}
#### Signer Checklist — Configuration Setup

* Create a `signer-config.toml` file with necessary configurations:
  * node\_host
  * endpoint
  * network
  * db\_path
  * auth\_password
  * stacks\_private\_key
* Store `signer-config.toml` securely and note down the values used.
{% endstep %}

{% step %}
#### Signer Checklist — Running the Signer

* Decide whether to run the signer using Docker (recommended) or as a binary.
* If using Docker:
  * Set up the necessary ports and volumes.
  * Run the Docker container with the appropriate settings.
* If running as a binary:
  * Build `stacks-core` from source or download the pre-built binary.
  * Run the signer using: `stacks-signer run --config <path_to_config>`.
{% endstep %}

{% step %}
#### Signer Checklist — Verify Signer Operation

* Check that the signer is listening on its configured endpoint.
* Confirm that there are no errors and that the system is ready for connections.
{% endstep %}

{% step %}
#### Signer Checklist — Setting Up the Stacks Node

* Create a `node-config.toml`, include:
  * connection\_options.sauth\_token
  * events\_observer.endpoint (matching signer config)
* Decide whether to run the Stacks node using Docker or as a binary and follow the respective run steps.
{% endstep %}

{% step %}
#### Signer Checklist — Verify Stacks Node Operation

* Check Stacks node logs for successful connection to the signer.
* Confirm the node is syncing Bitcoin headers properly.
{% endstep %}

{% step %}
#### Signer Checklist — Setup Stacks Accounts

* Set up a pool operator wallet in a Stacks wallet (e.g., Leather or Xverse).
* Fund the pool operator wallet with sufficient STX for transaction fees.
* Share the pool operator wallet’s STX address with delegating parties.
* Fund your signer's STX wallet with enough STX to cover transaction fees (recommend at least 100–200 STX).
{% endstep %}
{% endstepper %}

### Minimum System Requirements

These are the minimum required specs to run a node and signer. More resources are recommended for optimal performance.

#### Signer, Stacks node and Bitcoin node

* 4 vCPU
* 8 GB memory if running only a Stacks node and signer
* 16 GB memory if running Stacks + Bitcoin node + signer
* 1.5+ TB storage (1 TB for Bitcoin node, 500 GB for Stacks node, and 50 GB for signer)

***

## Preflight Setup

Before you get your signer set up, you'll need to [generate a new private key](https://docs.stacks.co/stacks-101/accounts#creation). The `stacks-cli` provides a mechanism for quickly generating a new account keychain via a simple CLI interface. The linked guide shows how to create one of those accounts on testnet.

Save the generated account information securely; you'll need it later.

{% hint style="info" %}
What should the networking setup look like?

Signers are intended to work with a local node. The node<->signer connection is not run over SSL, which means you can be exposed to a man-in-the-middle attack if your signer and node are hosted on separate machines. Ensure your signer isn't allowing requests from the public internet. We recommend having the signer and node running locally on the same machine or using internal networking between them.
{% endhint %}

### Optional: TLS between signer and node on separate hosts

If your signer and node must run on separate hosts, you can encrypt node<->signer traffic with local reverse proxies on each host. This keeps Stacks config values as `IP:PORT` while wrapping cross-host traffic in HTTPS.

Traffic paths:

* `stacks-node -> local proxy on node host -> HTTPS -> proxy on signer host -> signer endpoint`
* `stacks-signer -> local proxy on signer host -> HTTPS -> proxy on node host -> node RPC`

Example config values with this pattern:

```toml
# signer-config.toml
node_host = "127.0.0.1:21443"
endpoint = "127.0.0.1:30000"
```

```toml
# node-config.toml
[[events_observer]]
endpoint = "127.0.0.1:31000"
events_keys = ["stackerdb", "block_proposal", "burn_blocks"]
```

Nginx example on the node host:

```nginx
# Forward local node->signer event traffic over HTTPS
server {
  listen 127.0.0.1:31000;
  location / {
    proxy_pass https://signer.example.com:3443;
    proxy_ssl_server_name on;
    proxy_ssl_verify on;
    proxy_ssl_trusted_certificate /etc/nginx/certs/ca.pem;
  }
}

# Accept TLS from signer-side proxy and forward to local stacks-node RPC
server {
  listen 2443 ssl;
  ssl_certificate /etc/nginx/certs/node.crt;
  ssl_certificate_key /etc/nginx/certs/node.key;
  location / {
    proxy_pass http://127.0.0.1:20443;
  }
}
```

Nginx example on the signer host:

```nginx
# Forward local signer->node RPC traffic over HTTPS
server {
  listen 127.0.0.1:21443;
  location / {
    proxy_pass https://node.example.com:2443;
    proxy_ssl_server_name on;
    proxy_ssl_verify on;
    proxy_ssl_trusted_certificate /etc/nginx/certs/ca.pem;
  }
}

# Accept TLS from node-side proxy and forward to local signer endpoint
server {
  listen 3443 ssl;
  ssl_certificate /etc/nginx/certs/signer.crt;
  ssl_certificate_key /etc/nginx/certs/signer.key;
  location / {
    proxy_pass http://127.0.0.1:30000;
  }
}
```

Validation checklist:

* From signer host, confirm proxied node RPC is reachable: `curl -sS http://127.0.0.1:21443/v2/info`
* Confirm each TLS listener presents the expected certificate using `openssl s_client`
* Verify node logs continue to show event observer registration without connection errors

***

## Create a Configuration File

Create a file named `signer-config.toml`. Populate it with the example signer config file contents from the [Sample Configuration Files](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/node-operations/signer-configuration) page. Each field is described on that page.

***

## Running the Signer

Two options: Docker (recommended) or binary. Binaries are available on the [Stacks Core releases page](https://github.com/stacks-network/stacks-core/releases).

### Running the Signer with Docker

You can run the signer as a Docker container using the `blockstack/stacks-signer:3.1.0.0.5.0` image.

Requirements when running the container:

* The port configured as the `endpoint` (example: 30000) must be exposed to your Stacks node (endpoint should not be public).
* A volume with at least a few GB available that contains the folder specified by your `db_path` (example: `/var`).
* Mount your `signer-config.toml` file as a volume.

Example docker run command:

```bash
IMG="blockstack/stacks-signer"
VER="3.1.0.0.5.0"
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

Hint about platform mismatch:

{% hint style="info" %}
If you get an error about the manifest not found or the image platform not matching the host platform, you probably are running on an architecture other than x64. Add `--platform=linux/amd64` to the command (for example, on M1 Mac).
{% endhint %}

Or, using a custom Dockerfile:

```docker
FROM blockstack/stacks-signer:3.1.0.0.5.0
COPY signer-config.toml /config.toml
EXPOSE 30000
CMD ["stacks-signer", "run", "--config", "/config.toml"]
```

### Running the Signer as a Binary

Download the pre-built binaries from the [Stacks Core releases page on Github](https://github.com/stacks-network/stacks-core/releases), unzip the archive for your architecture — inside is a `stacks-signer` binary.

Run the signer:

```bash
stacks-signer run --config ../signer-config.toml
```

(Replace `../signer-config.toml` with the actual path to your config.)

***

## Verify the Signer is Running

List running containers:

```bash
docker ps
```

Check the container logs:

```bash
docker logs <container-id>
```

You should see:

Signer spawned successfully. Waiting for messages to process...

You may also see a warning like:

```
WARN [1712003997.160121] [stacks-signer/src/runloop.rs:247] [signer_runloop] Signer is not registered for reward cycle 556. Waiting for confirmed registration...
```

This means your signer is running and awaiting registration; proceed to set up the Stacks node and begin stacking.

{% hint style="warning" %}
Even after you Stack, you may still see messages saying the signer is not registered for the current or next reward cycle. This is normal until the prepare phase for your chosen reward cycle; assuming you meet the stacking minimum, the signer will be registered during that phase.
{% endhint %}

***

## Set Up Your Bitcoin Node

Optional but recommended to improve signer health and performance.

Guides:

* Run a full Bitcoin node: https://docs.stacks.co/guides-and-tutorials/nodes-and-miners/run-a-bitcoin-node
* Run a pruned Bitcoin node: https://docs.stacks.co/guides-and-tutorials/nodes-and-miners/run-a-pruned-bitcoin-node

***

## Set Up Your Stacks Node

Start the Stacks node after the signer is running — the node will not run unless it can send events to the signer.

### Stacks Node Configuration

Create `node-config.toml`. See the [Sample Configuration Files](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/node-operations/signer-configuration) page for the full contents.

Important fields to change:

* `working_dir`: directory where the node persists data
* `auth_token`: authentication token used by signer (must match signer `auth_password`)
* `events_observer.endpoint`: host and port where your signer listens (example: `127.0.0.1:30000` or `stacks-signer.local:30000`)

### Start with an archive

Starting from an archive snapshot is much faster than syncing from genesis. Archives are at https://archive.hiro.so.

Example to download and extract the latest mainnet snapshot:

```bash
curl -# https://archive.hiro.so/mainnet/stacks-blockchain/mainnet-stacks-blockchain-latest.tar.gz -o stacks-snapshot.tar.gz
tar -zxvf stacks-snapshot.tar.gz
```

This creates a `mainnet` folder where downloaded. Set `working_dir` to the parent directory containing `mainnet`.

See best practices for snapshots: ../best-practices-to-snapshot-the-chainstate.md

### Run a Stacks Node with Docker

Use the `blockstack/stacks-core` image (example tag: `3.1.0.0.13`).

When running the container:

* Expose the port configured for `p2p_bind` to the internet.
* Make the port configured for `rpc_bind` accessible by your signer.
* `working_dir` needs 500 GB–1 TB storage.
* Include your `node-config.toml`.

Example docker run:

```bash
IMG="blockstack/stacks-core"
VER="3.1.0.0.13"
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

Or with a custom Dockerfile:

```docker
FROM blockstack/stacks-core:3.1.0.0.13
COPY node-config.toml /config.toml
EXPOSE 20444
EXPOSE 20443
CMD ["stacks-node", "start", "--config", "/config.toml"]
```

If you get connection refused errors, you may need to point `events_observer.endpoint` to the Docker signer container. If using default Docker bridge mode, `localhost` inside the container is not the host — point the endpoint to the Docker host or the signer container hostname accordingly.

### Run a Stacks Node with a Binary

Download the pre-built `stacks-node` binary from the [Stacks Core releases](https://github.com/stacks-network/stacks-core/releases).

Start the node:

```bash
./stacks-node start --config node-config.toml
```

### Verify Stacks Node is Running

Typical startup logs:

```bash
Mar  6 19:35:08.212848 INFO stacks-node 0.1.0
Mar  6 19:35:08.213084 INFO Loading config at path ./Stacks-config.toml
Mar  6 19:35:08.216674 INFO Registering event observer at: localhost:30000
Mar  6 19:35:08.221603 INFO Migrating sortition DB to the latest schema version
Mar  6 19:35:08.224082 INFO Migrating chainstate DB to the latest schema version
Mar  6 19:35:08.227404 INFO Start syncing Bitcoin headers, feel free to grab a cup of coffee, this can take a while
```

Ensure you see the `Registering event observer at XXX` log with your signer endpoint. Once Bitcoin headers are synced, you can GET `/v2/info` on the node RPC endpoint (default port 20443).

You may see many logs while syncing; refer to How to Read the Signer Logs if concerned.

***

## Setup Your Stacks Accounts

{% hint style="info" %}
For more on stacking and signing relationship, see the [Stack STX](broken-reference/) guide.
{% endhint %}

As a signer you’ll manage two Stacks accounts:

1. A “pool operator” wallet, which commits delegated STX to your signer
2. Your signer’s wallet

{% hint style="warning" %}
For testing, make sure you are using testnet (not mainnet). Testnet STX can be [requested from a faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet).
{% endhint %}

### Setup Your Pool Operator Wallet

Set up a pool operator wallet using any Stacks wallet, such as [Leather](https://leather.io/) or [Xverse](https://www.xverse.app/). You may generate a new account or use an existing one. Leather supports Ledger hardware wallets if you prefer.

Fund the wallet with enough STX to cover transaction fees (testnet: faucet at https://explorer.hiro.so/sandbox/faucet?chain=testnet).

Share this wallet’s STX address with parties that will delegate STX to you. For improved UX, you might use the helper contract allowing a BTC address for stackers ([pox4-pools](https://explorer.hiro.so/txid/SP001SFSMC2ZY76PD4M68P3WGX154XCH7NE3TYMX.pox4-pools?chain=mainnet)) and add your pool to [earn.leather.io](https://earn.leather.io/).

***

If you need more detailed troubleshooting or further setup examples (config snippets, sample signer-config.toml or node-config.toml), let me know which files or examples you'd like converted or added.
