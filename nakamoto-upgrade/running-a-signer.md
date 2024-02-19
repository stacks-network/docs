# Running a Signer

{% hint style="danger" %}
This document intends to lay out all the steps required to run a signer on testnet after the “Argon” milestone is reached and deployed to testnet. Much of this will not work today, but is being included so that interested parties can familiarize themselves with the process as it will work after the Argon release. Argon is still in development and these instructions will change.
{% endhint %}

### Step by Step Instructions

#### 1. Generate TOML file

Create a TOML file (`signers.toml`) with the following content:

```toml
node_host = "127.0.0.1:20443"
endpoint = "127.0.0.1:30000"
network = "testnet"
```

#### 2. Generate Keys

You’ll need two private keys:

`stacks_private_key`: the private key that corresponds to the public key that will be registered in the StackerDB `message_private_key`: the key used when signing messages for block proposals and other messages.

One way to generate a private key is using the `@stacks/cli` package. With node.js installed, run in the command line:

`npx –yes @stacks/cli@latest make_keychain`

You’ll see output like this:

```json
{
  "mnemonic": "tilt invite caught shoe shed gravity guitar bench spot dial garlic cushion gate garlic need often boss spoon under fence used across tip use",
  "keyInfo": {
    "privateKey": "7567052905c21867fff273f5c018fb254a282499008d7e8181935a1a1855cb0601",
    "publicKey": "0396152c9c1ba3edce6d708d9b652916a4a8320f3a4a5f44c7b1142002cf87882f",
    "address": "SP2R765DGGBJRAEJD368QDWS471NRY4D566XKTSY8",
    "btcAddress": "1H5ynzN1D9FPV7wknsAHR7RhoX1YBEoSy9",
    "wif": "L19veovqpwzNgVgzY45ETu8nSMc8vp21vVjbHNdDN85KnUAEEKQX",
    "index": 0
  }
}
```

Save the output somewhere.

Take the `privateKey` property from that and add it to your `signer.toml` with the property \`stacks\_private\_key.

e.g. `stacks_private_key = "7567052905c21867fff273f5c018fb254a282499008d7e8181935a1a1855cb0601"`

Next, we need to add the `message_private_key`. You can choose to reuse your Stacks private key or generate a new one.

The `message_private_key` needs to be base58 encoded. You can use [this tool](https://appdevtools.com/base58-encoder-decoder) to encode the private key as base58.

In the base58 encoding tool, paste in your `stacks_private_key` and set "Treat input as Hex". Make sure you delete the 01 at the end or the signer will throw an error.

Take the output and add it to your signer.toml file:

`message_private_key = "8uHp7CVqu8JWiPzW5g7FX2ZthwCKzyxVK9DfjiYjUkiy"`

The config file should now look like this, but with different private keys:

```toml
node_host = "127.0.0.1:20443"
endpoint = "127.0.0.1:30000"
network = "testnet"
stacks_private_key = "7567052905c21867fff273f5c018fb254a282499008d7e8181935a1a1855cb0601"
message_private_key = "8uHp7CVqu8JWiPzW5g7FX2ZthwCKzyxVK9DfjiYjUkiy"
```

{% hint style="info" %}
At the moment, there are 3 other fields that need to be included, but those will be removed by the Argon release. Prior to argon, add this to the end of the config file if you want to run the signer:

```toml
stackerdb_contract_id = "ST11Z60137Y96MF89K1KKRTA3CR6B25WY1Y931668.signers-stackerdb"
signer_id = 0
signers = [
	{public_key = "swBaKxfzs4pQne7spxhrkF6AtB34WEcreAkJ8mPcqx3t", key_ids = [1, 2, 3, 4]},
	{public_key = "yDJhntuJczbss1XGDmyWtG9Wpw5NDqoBBnedxmyhKiFN", key_ids = [5, 6, 7, 8]},
	{public_key = "xNVCph6zd7HLLJcuwrWz1gNbFoPHjXxn7cyRvvTYhP3U", key_ids = [9, 10, 11, 12]},
	{public_key = "p2wFfLEbwGCmxCR5eGa46Ct6i3BVjFrvBixRn7FnCQjA", key_ids = [13, 14, 15, 16]},
	{public_key = "26jpUNnJPvzDJRJg3hfBn5s5MR4eQ4LLTokjrSDzByh4i", key_ids = [17, 18, 19, 20]}
]
```


{% endhint %}

3\. Run the signer

We don't yet have Docker images that include the stacks-signer binary, so in the meantime you'll build from source. [This pull request](https://github.com/stacks-network/stacks-core/pull/4268) changes our CI to include the stacks-signer binary in Docker builds.

The signer will need to store state via disk, but that code is not yet built. Documentation will be created when it is more defined.

Follow [these instructions](https://github.com/stacks-network/stacks-core?tab=readme-ov-file#building) for building the stacks-core repository from source.

Once you've run `cargo build`, go back to the folder with your `signer.toml` file and run:

```bash
# replace with the location of your `stacks-core` folder:
_STACKS_CORE_FOLDER_/target/debug/stacks-signer start --config signer.toml
```

You should see output that looks like this:

```bash
Signer spawned successfully. Waiting for messages to process...
INFO [1705699009.844671] [stacks-signer/src/runloop.rs:438] [signer_runloop] Running one pass for signer ID# 0. Current state: Uninitialized
```

{% hint style="info" %}
[This PR](https://github.com/stacks-network/stacks-core/pull/4280) adds a /status endpoint to the signer. Once the signer is running, the client should check this endpoint to ensure it is running and listening correctly.
{% endhint %}

### Production environment for Signer

Running the signer in production requires two things:

* A machine for running a Docker image
* A volume for storing state

The Docker image needs to use a user-provided config file, which is used when running the signer. Depending on the production environment, there are typically two ways to do this:

Use the default published image, which expects you to include the config file somewhere on disk Create your own Dockerfile, which is a simple wrapper around the official image

An example wrapper Dockerfile (this doesn’t work today!):

```DOCKERFILE
FROM blockstack/stacks-core

RUN mkdir -p /config

COPY signer.toml /config/signer.toml

CMD ["stacks-signer", "run", "--config", "/config/signer.toml"]
```

### System Requirements to Run a Signer

* 4 vcpu
* 8GB memory
* 150 GB storage (250 GB if running a Stacks node)

&#x20;run a full node, run the signer binary. 1 cpu, 4gb of ram, 150GB of storage as a minimum.

If you are also running a Stacks node, the following guides will provide information on how to do that:

[https://github.com/stacksfoundation/miner-docs/blob/main/stacks-blockchain.md ](https://github.com/stacksfoundation/miner-docs/blob/main/stacks-blockchain.md)[https://github.com/stacksfoundation/miner-docs/blob/main/scripts/install\_stacks.sh](https://github.com/stacksfoundation/miner-docs/blob/main/scripts/install\_stacks.sh)
