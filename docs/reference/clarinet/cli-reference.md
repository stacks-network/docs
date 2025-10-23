# CLI Reference

The Clarinet CLI provides a comprehensive suite of tools for Clarity smart contract development. From project initialization to deployment, Clarinet streamlines your entire development workflow.

* Create a new project: `clarinet new`
* Generate a new smart contract: `clarinet contracts new`
* Validate contract syntax and types: `clarinet check`
* Interactive REPL for testing contracts: `clarinet console`
* Launch a local development network: `clarinet devnet start`
* Manage deployments: `clarinet deployments`

## Initialize a new project

### clarinet new

`clarinet new` creates a new project with all necessary configuration files and directory structure.

Usage

```
clarinet new [OPTIONS] <NAME>
```

```bash
$ clarinet new my-defi-protocol
Create directory my-defi-protocol
Create directory contracts
Create directory settings
Create directory tests
Create file Clarinet.toml
Create file settings/Mainnet.toml
Create file settings/Testnet.toml
Create file settings/Devnet.toml
Create directory .vscode
Create file .vscode/settings.json
Create file .vscode/tasks.json
Create file .gitignore
Create file .gitattributes
Create file package.json
Create file tsconfig.json
Create file vitest.config.js
```

| Option                | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `--disable-telemetry` | Do not provide developer usage telemetry for this project |

## Manage your contracts

### clarinet contracts

`clarinet contracts` is a subcommand for working with contracts. It has two subcommands:

| Command | Description                                    |
| ------- | ---------------------------------------------- |
| `new`   | Generate files and settings for a new contract |
| `rm`    | Remove files and settings for a contract       |

Usage with `new`

```
clarinet contracts new <COMMAND> <OPTIONS>
```

```bash
$ clarinet contracts new fungible-token
Created file contracts/fungible-token.clar
Created file tests/fungible-token.test.ts
Updated Clarinet.toml
```

Usage with `rm`

```
clarinet contracts rm <COMMAND> <OPTIONS>
```

```bash
$ clarinet contracts rm old-token
Removed file contracts/old-token.clar
Removed file tests/old-token.test.ts
Updated Clarinet.toml
```

| Option                   | Description           |
| ------------------------ | --------------------- |
| `--manifest-path <path>` | Path to Clarinet.toml |

## Validate your contracts

### clarinet check

`clarinet check` checks contracts syntax and performs type checking.

Usage

```
clarinet check [FILE] [OPTIONS]
```

```bash
clarinet check
✔ 3 contracts checked
clarinet check contracts/token.clar
✔ contracts/token.clar syntax checks passed
```

| Option                           | Short | Description                                                                           |
| -------------------------------- | ----- | ------------------------------------------------------------------------------------- |
| `--manifest-path <path>`         | `-m`  | Path to Clarinet.toml                                                                 |
| `--deployment-plan-path <path>`  | `-p`  | If specified, use this deployment file                                                |
| `--use-on-disk-deployment-plan`  | `-d`  | Use on disk deployment plan (prevent updates computing)                               |
| `--use-computed-deployment-plan` | `-c`  | Use computed deployment plan (will overwrite on disk version if any update)           |
| `--enable-clarity-wasm`          |       | Allow the Clarity Wasm preview to run in parallel with the Clarity interpreter (beta) |

## Interact with your contracts in a local REPL

### clarinet console

`clarinet console` loads contracts in a REPL for an interactive session.

Usage

```
clarinet console [OPTIONS]
```

```bash
$ clarinet console
clarity-repl v1.0.0
Enter ".help" for usage hints.
Connected to a transient in-memory database.
```

The Clarinet console offers a variety of commands for contract interaction:

* `::help`: Lists all console commands
* `::functions`: Display all the native functions available in Clarity
* `::keywords`: Display all the native keywords available in Clarity
* `::describe <function> | <keyword>`: Display documentation for a given native function or keyword
* `::toggle_costs`: Display cost analysis after every expression
* `::toggle_timings`: Display the execution duration
* `::mint_stx <principal> <amount>`: Mint STX balance for a given principal
* `::set_tx_sender <principal>`: Set tx-sender variable to principal
* `::get_assets_maps`: Get assets maps for active accounts
* `::get_contracts`: Get contracts
* `::get_block_height`: Get current block height
* `::advance_chain_tip <count>`: Simulate mining of `<count>` blocks
* `::advance_stacks_chain_tip <count>`: Simulate mining of `<count>` stacks blocks
* `::advance_burn_chain_tip <count>`: Simulate mining of `<count>` burnchain blocks
* `::set_epoch <epoch>`: Update the current epoch
* `::get_epoch`: Get current epoch
* `::debug <expr>`: Start an interactive debug session executing `<expr>`
* `::trace <expr>`: Generate an execution trace for `<expr>`
* `::get_costs <expr>`: Display the cost analysis
* `::reload`: Reload the existing contract(s) in the session
* `::read <filename>`: Read expressions from a file
* `::encode <expr>`: Encode an expression to a Clarity Value bytes representation
* `::decode <bytes>`: Decode a Clarity Value bytes representation

| Option                                  | Short | Description                                                                           |
| --------------------------------------- | ----- | ------------------------------------------------------------------------------------- |
| `--manifest-path <path>`                | `-m`  | Path to Clarinet.toml                                                                 |
| `--deployment-plan-path <path>`         | `-p`  | If specified, use this deployment file                                                |
| `--use-on-disk-deployment-plan`         | `-d`  | Use on disk deployment plan (prevent updates computing)                               |
| `--use-computed-deployment-plan`        | `-c`  | Use computed deployment plan (will overwrite on disk version if any update)           |
| `--enable-remote-data`                  | `-r`  | Enable remote data fetching from mainnet or a testnet                                 |
| `--remote-data-api-url <url>`           | `-a`  | Set a custom Stacks Blockchain API URL for remote data fetching                       |
| `--remote-data-initial-height <height>` | `-b`  | Initial remote Stacks block height                                                    |
| `--enable-clarity-wasm`                 |       | Allow the Clarity Wasm preview to run in parallel with the Clarity interpreter (beta) |

## Start a local development network

### clarinet devnet

`clarinet devnet` is a subcommand for working with Devnet. It has two subcommands:

| Command   | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `start`   | Start a local Devnet network for interacting with your contracts |
| `package` | Generate package of all required devnet artifacts                |

Usage with `start`

```
clarinet devnet start [OPTIONS]
```

```bash
clarinet devnet start
```

| Option                           | Short | Description                                                                 |
| -------------------------------- | ----- | --------------------------------------------------------------------------- |
| `--manifest-path <path>`         | `-m`  | Path to Clarinet.toml                                                       |
| `--no-dashboard`                 |       | Display streams of logs instead of terminal UI dashboard                    |
| `--deployment-plan-path <path>`  | `-p`  | If specified, use this deployment file                                      |
| `--use-on-disk-deployment-plan`  | `-d`  | Use on disk deployment plan (prevent updates computing)                     |
| `--use-computed-deployment-plan` | `-c`  | Use computed deployment plan (will overwrite on disk version if any update) |
| `--package <path>`               |       | Path to Package.json produced by 'clarinet devnet package'                  |

Usage with `package`

```
clarinet devnet package [OPTIONS]
```

```bash
$ clarinet devnet package --name my-devnet
Packaging devnet artifacts...
Created file my-devnet.json
```

| Option                   | Short | Description           |
| ------------------------ | ----- | --------------------- |
| `--name <name>`          | `-n`  | Output json file name |
| `--manifest-path <path>` | `-m`  | Path to Clarinet.toml |

## Manage your deployments

### clarinet deployments

`clarinet deployments` is a subcommand for managing deployments on Devnet/Testnet/Mainnet.

| Command    | Description              |
| ---------- | ------------------------ |
| `check`    | Check deployments format |
| `generate` | Generate new deployment  |
| `apply`    | Apply deployment         |

Usage with `check`

```
clarinet deployments check [OPTIONS]
```

```bash
$ clarinet deployments check
✔ Deployment files are valid
```

| Option                   | Description           |
| ------------------------ | --------------------- |
| `--manifest-path <path>` | Path to Clarinet.toml |

Usage with `generate`

```
clarinet deployments generate [OPTIONS]
```

```bash
$ clarinet deployments generate --testnet
Generated deployment plan
Created file deployments/default.testnet-plan.yaml
```

| Option                   | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| `--simnet`               | Generate a deployment file for simnet environments (console, tests)           |
| `--devnet`               | Generate a deployment file for devnet, using settings/Devnet.toml             |
| `--testnet`              | Generate a deployment file for testnet, using settings/Testnet.toml           |
| `--mainnet`              | Generate a deployment file for mainnet, using settings/Mainnet.toml           |
| `--manifest-path <path>` | Path to Clarinet.toml                                                         |
| `--no-batch`             | Generate a deployment file without trying to batch transactions (simnet only) |
| `--low-cost`             | Compute and set cost, using low priority (network connection required)        |
| `--medium-cost`          | Compute and set cost, using medium priority (network connection required)     |
| `--high-cost`            | Compute and set cost, using high priority (network connection required)       |
| `--manual-cost`          | Leave cost estimation manual                                                  |

Usage with `apply`

```
clarinet deployments apply [OPTIONS]
```

```bash
$ clarinet deployments apply --testnet
Applying deployment to testnet
✔ Broadcasting transaction for token.clar
  Transaction ID: 0x3d4f5...
  Contract: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token
✔ All contracts deployed successfully
```

| Option                           | Short | Description                                                                 |
| -------------------------------- | ----- | --------------------------------------------------------------------------- |
| `--devnet`                       |       | Apply default deployment settings/default.devnet-plan.toml                  |
| `--testnet`                      |       | Apply default deployment settings/default.testnet-plan.toml                 |
| `--mainnet`                      |       | Apply default deployment settings/default.mainnet-plan.toml                 |
| `--manifest-path <path>`         | `-m`  | Path to Clarinet.toml                                                       |
| `--deployment-plan-path <path>`  | `-p`  | Apply deployment plan specified                                             |
| `--no-dashboard`                 |       | Display streams of logs instead of terminal UI dashboard                    |
| `--use-on-disk-deployment-plan`  | `-d`  | Use on disk deployment plan (prevent updates computing)                     |
| `--use-computed-deployment-plan` | `-c`  | Use computed deployment plan (will overwrite on disk version if any update) |

## Interact with Mainnet contracts

### clarinet requirements

`clarinet requirements` is a subcommand for interacting with Mainnet contracts.

| Command | Description                                            |
| ------- | ------------------------------------------------------ |
| `add`   | Add a mainnet contract as a dependency to your project |

Usage

```
clarinet requirements <COMMAND>
```

```bash
$ clarinet requirements add SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait
Added requirement SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait
Updated Clarinet.toml
```

| Option                   | Description           |
| ------------------------ | --------------------- |
| `--manifest-path <path>` | Path to Clarinet.toml |

## Editor Integrations

### clarinet lsp

`clarinet lsp` starts the Language Server Protocol service for Clarity, enabling intelligent code completion, error highlighting, and other IDE features in supported editors.

Usage

```
clarinet lsp
```

## Debugging

### clarinet dap

`clarinet dap` starts the Debug Adapter Protocol service, enabling debugging features like breakpoints, step-through execution, and variable inspection in supported editors.

Usage

```
clarinet dap
```

## Format your code

### clarinet format

`clarinet format` formats Clarity code files according to standard conventions.

Usage

```
clarinet format [OPTIONS]
```

```bash
clarinet format --check
clarinet format --dry-run
clarinet format --file contracts/token.clar --in-place
```

| Option                       | Short | Description                                            | Required |
| ---------------------------- | ----- | ------------------------------------------------------ | -------- |
| `--check`                    |       | Check if code is formatted without modifying files     | No       |
| `--dry-run`                  |       | Only echo the result of formatting                     | No       |
| `--in-place`                 |       | Replace the contents of a file with the formatted code | No       |
| `--manifest-path <path>`     | `-m`  | Path to Clarinet.toml                                  | No       |
| `--file <file>`              | `-f`  | If specified, format only this file                    | No       |
| `--max-line-length <length>` | `-l`  | Maximum line length                                    | No       |
| `--indent <size>`            | `-i`  | Indentation size, e.g. 2                               | No       |
| `--tabs`                     | `-t`  | Use tabs instead of spaces                             | No       |

## Utilities

### clarinet completions

`clarinet completions` generates shell completion scripts for your shell.

Usage

```
clarinet completions <SHELL>
```

```bash
clarinet completions zsh > ~/.zsh/completions/_clarinet
source ~/.zshrc
```

Supported Shells

* `bash`
* `zsh`
* `fish`
* `powershell`
* `elvish`

| Option            | Short | Description                                              |
| ----------------- | ----- | -------------------------------------------------------- |
| `--shell <shell>` | `-s`  | Specify which shell to generation completions script for |

## Environment Variables

Clarinet supports environment variables for configuration. All environment variables are prefixed with `CLARINET_`:

```bash
export CLARINET_MANIFEST_PATH=/path/to/project
```
