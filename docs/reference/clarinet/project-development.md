# Project Development

Clarinet streamlines the entire lifecycle of Clarity smart contract development. From project initialization to contract management and code formatting, you'll have the tools needed for professional workflows.

## Creating a new project

The `clarinet new` command creates a complete project structure with all necessary configuration files:

```bash
$ clarinet new my-defi-app
```

| Option                | Description                     | Example                                   |
| --------------------- | ------------------------------- | ----------------------------------------- |
| `--disable-telemetry` | Opt out of telemetry collection | `clarinet new my-app --disable-telemetry` |

For a deeper look at what Clarinet generates, see the [project structure](project-structure.md) guide.

## Managing contracts

### Creating new contracts

The `clarinet contract new` command generates both a contract file and a matching test file:

```bash
$ clarinet contract new token
Created file contracts/token.clar
Created file tests/token.test.ts
Updated Clarinet.toml
```

The generated contract includes a minimal template:

```clarity
;; token
;; <add a description here>

;; constants
;;

;; data vars
;;

;; data maps
;;

;; public functions
;;

;; read only functions
;;

;; private functions
;;
```

### Removing contracts

Clean up unused contracts with the `rm` command:

```bash
$ clarinet contract rm old-token
Removed file contracts/old-token.clar
Removed file tests/old-token.test.ts
Updated Clarinet.toml
```

## Checking project contract syntax

Validate your entire project setup:

```bash
$ clarinet check
✔ 3 contracts checked
```

Check specific contracts:

```bash
$ clarinet check contracts/token.clar
✔ contracts/token.clar Syntax of contract successfully checked
```

## Code formatting

Clarinet includes a formatter to maintain consistent style across your project.

Format all contracts in your project:

```bash
$ clarinet format --in-place
Formatted 5 contracts
```

### Formatting options

Customize formatting to match your team's style guide:

| Option              | Description                                            | Example                                 |
| ------------------- | ------------------------------------------------------ | --------------------------------------- |
| `--dry-run`         | Preview changes without modifying files                | `clarinet format --dry-run`             |
| `--in-place`        | Replace file contents (required for actual formatting) | `clarinet format --in-place`            |
| `--max-line-length` | Set maximum line length                                | `clarinet format --max-line-length 100` |
| `--indent`          | Set indentation size                                   | `clarinet format --indent 2`            |
| `--tabs`            | Use tabs instead of spaces                             | `clarinet format --tabs`                |

### Format single files

```bash
$ clarinet format contracts/messy-contract.clar --in-place
```

Format specific contracts with glob patterns:

```bash
$ clarinet format contracts/token*.clar --in-place
```

## Project configuration

### Working with requirements

Add mainnet contracts as dependencies:

```bash
$ clarinet requirements add SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait
Added requirement SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait
Updated Clarinet.toml
```

Clarinet adds the dependency to `Clarinet.toml`:

```toml
[project]
requirements = [
  { contract_id = "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait" }
]
```

You can now implement traits from mainnet contracts:

```clarity
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-non-fungible-token my-nft uint)
;; ... implement required functions
```

##
