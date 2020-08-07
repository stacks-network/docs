---
title: Blockstack CLI
---

export { convertBlockstackCLIUsageToMdx as getStaticProps } from '@common/data/cli-ref'
import { CLIReferenceTable } from '@components/cli-reference'

## Introduction

The command line is intended for developers only. Developers can use the command
line to test and debug Blockstack applications in ways that the Blockstack
Browser does not yet support. Using the command line, developers can:

- Generate and Broadcast all supported types of Blockstack transactions
- Load, store, and list data in Gaia hubs
- Generate owner, payment and application keys from a seed phrase
- Query Stacks Nodes
- Implement a minimum viable authentication flow

!> Many of the commands operate on unencrypted private keys. For this reason, **DO NOT** use this tool for day-to-day tasks as you risk the security of your keys.

You must install the command line before you can use the commands.

## How to install the command line

You must have [Node.js](https://nodejs.org/en/download/) v8 or higher (v10 recommended). macOS and Linux users can avoid `sudo` or [permissions problems](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) or by using [`nvm`](https://github.com/nvm-sh/nvm). These instructions assume you are using a macOS or Linux system.

To install the command line, do the following:

### Step 1: [Download or `git clone` the command line repository code](https://github.com/blockstack/cli-blockstack).

Downloading or cloning the repo creates a `cli-blockstack` repository on your system.

### Step 2: Change directory into the `cli-blockstack` directory.

```bash
cd cli-blockstack
```

### Step 3: Install the dependencies with `npm`.

```bash
npm install
```

### Step 4: Build the command line command.

```bash
npm run build
```

### Step 5: Link the command.

```bash
sudo npm link
```

### Troubleshooting the CLI installation

If you run into `EACCES` permissions errors, try the following:

- See https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally.
- Use [`Node Version Manager`](https://github.com/nvm-sh/nvm).

## List of commands

To see the usage and options for the command in general, enter `blockstack-cli` without any subcommands. To see a list of subcommands enter `blockstack-cli help`. Enter `blockstack-cli SUBCOMMAND_NAME help` to see a subcommand with its usage. The following are the available subcommands:

<CLIReferenceTable mdx={props.mdx} />
