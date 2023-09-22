---
title: Run a Nakamoto Signer Node
description: Set up and run a signer on Nakamoto
---

## What is this

Draft documentation for sBTC Signer specifically for the Nakamoto [release](https://stacks-network.github.io/sbtc-docs/sbtc-roadmap.html).

The readers of this are assumed to be anyone who is looking to run a sBTC Signer with minimal custom configuration.

## Disclaimer

Development is on going and changes to the Signer configuration should be expected. This document will be updated every sprint to ensure its accuracy.

## Prerequisites

Rust - [To install](https://www.rust-lang.org/tools/install).

Accessible Stacks node - A Stacks node running the stackerDB instance which is used for signer communication and transaction monitoring and broadcasting.

Accessible Bitcoin node - A Bitcoin node used for transaction monitoring and broadcasting.

A Stacks Private Key - Identify your address as a Signer

## Installing

### Building from Source

If you wish to compile the default binary from source, follow the steps outlined below. Otherwise, download the binary directly (below)

1. First, clone the Stacks sBTC mono repository:

```console
git clone git@github.com:stacks-network/stacks-blockchain.git
```

2. Next, navigate to the stacks-signer directory:

```console
cd stacks-blockchain/stacks-signer
```

3. Checkout the appropriate release branch you wish to use if you are not using the default main branch

```console
git checkout master
```

4. Compile the signer binary:
   Note the binary path defaults to `target/release/stacks-signer`.

```console
cargo build --release
```

### Downloading the Binary

1. First, download the precompiled default [TODO:NEED:LINK](LINK).

2. Untar the file

```console
tar -xvf signer_binary.tar
```

3.  Check Extracted Files:
    After running the untar command, the contents of the tar file should be extracted to the current directory. You should see the signer binary (stacks-signer) and the configuration file (signer.toml) listed among the extracted files.

4.  Next, install the signer.

```console
cargo install --path stacks-signer
```

## Configuration

The signer takes a TOML config file with the following expected properties

| Key                         | Required | Description                                                                                                                                                  |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `signer_private_key`        | `true`   | Stacks private key of the signer, used for signing sBTC transactions.                                                                                        |
| `stacks_node_rpc_url`       | `true`   | Stacks node RPC URL that points to a node running the stackerDB instance which is used for signer communication and transaction monitoring and broadcasting. |
| `bitcoin_node_rpc_url`      | `true`   | Bitcoin node RPC URL used for transaction monitoring and broadcasting.                                                                                       |
| `stackerdb_event_endpoint`  | `true`   | RPC endpoint for receiving events from [StackerDB](https://github.com/stacks-network/stacks-blockchain/blob/develop/stackslib/src/net/stackerdb/mod.rs)      |
| `stackerdb_contract_id`     | `false`  | StackerDB qualified contract ID for Signer communication. Defaults to "ST11Z60137Y96MF89K1KKRTA3CR6B25WY1Y931668.signers-stackerdb".                         |
| `network`                   | `false`  | One of `['Signet', 'Regtest', 'Testnet', 'Bitcoin']`. Defaults to `Testnet`                                                                                  |
| `signer_api_server_url`     | `false`  | Url at which to host the signer api server for transaction monitoring. Defaults to "http://localhost:3000".                                                  |
| `auto_deny_block`           | `false`  | Number of blocks before signing deadline to auto deny a transaction waiting for manual review. Defaults to 10.                                               |
| `auto_approve_max_amount`   | `false`  | Maximum amount of a transactions that will be auto approved                                                                                                  |
| `auto_deny_addresses_btc`   | `false`  | List of bitcoin addresses that trigger an auto deny                                                                                                          |
| `auto_deny_addresses_stx`   | `false`  | List of stx addresses that trigger an auto deny                                                                                                              |
| `auto_deny_deadline_blocks` | `false`  | The number of blocks before deadline at which point the transaction will be auto denied. Default is 10 blocks.                                               |

### Example TOML file

```toml
# config.toml

# Mandatory fields

# Note: Replace 'MY_PRIVATE_KEY' with the actual private key value
signer_private_key = "MY_PRIVATE_KEY"
stacks_node_rpc_url = "http://localhost:9776"
bitcoin_node_rpc_url = "http://localhost:9777"
revealer_rpc_url = "http://locahost:9778"

# Optional fields
network = "Signet"
auto_approve_max_amount = 500000
auto_deny_addresses_btc = [
	"BTC_ADDRESS_1",
	"BTC_ADDRESS_2"
]
auto_deny_addresses_stx = [
	"STX_ADDRESS"
]
auto_deny_deadline_blocks = 120
```

## Running the binary

After installing and creating a config file to run the binary

```console
stacks-signer --config conf/signer.toml
```

## Monitor Transactions

The signer binary operates a web server/client and it can be navigated to by default at http://localhost:3000/ (unless otherwise specified from config). Here you can see pending transactions and manually review and sign transactions that cannot be automatically signed on your behalf. Note that manual review is triggered based on the options you have set in your configuration file.

## Custom Signer Implementation

If you wish to have more fine-grained control of the Signer binary and its transaction signing logic, you may wish to take advantage of the [Signer SDK](TODO: LINK TO GITHUB REPO).

1. Set Up a New Rust Project

To add a Signer library to your Rust project and create a main function that utilizes it, follow these step-by-step instructions:

If you don't have an existing Rust project, create one using Cargo, Rust's package manager and build tool:

```bash
cargo new my_signer
cd my_signer
```

Replace `my_signer` with your desired project name.

2. Add Signer Library to the `Cargo.toml` File

Open the `Cargo.toml` file in your project directory and add the Signer library as a dependency under the `[dependencies]` section.

```toml
[dependencies]
signer = "1.0.0"
```

Specify the appropriate version that you wish to use. Make sure to check the latest version available on crates.io.

3. Import the Signer Library in Your Rust Code

In your `main.rs` file (located in the `src` folder by default), import the Signer library at the beginning of the file:

```rust
use signer::Signer;
```

4. Create a Main Function

Add the main function to your `main.rs` file. This is where you'll utilize the Signer library to perform the required actions:

```rust
fn main() {
    // Initialize the signer with a private key
    let signer = Signer::new("your_private_key"); // Replace with the actual private key
    // Must serve web client to utilize manual review
    let _ = signer.serve_http("0.0.0.0", 3000);
    while let Ok(transaction) = signer.retrieve_pending_transaction() {
        // Trigger manual review for a specific address
        if transaction.recipient.to_string() == "mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC" {
            // Manually approve or deny a transaction
            let _ = signer.trigger_manual_review(transaction);
        } else if transaction.amount > 3418260000 {
            // deny transactions with an amount greater than 1 million USD
            let _ = signer.deny(transaction);
        } else {
            // Approve anything else
            let _ = signer.approve(transaction);
        }
    }
}
```

5. Build and Run Your Signer

Now that you've added the Signer library and created the main function, you can build and run your custom signer using Cargo:

```bash
cargo build
cargo run
```
