---
title: Stacks CLI
description: Interacting with the Stacks 2.0 Blockchain via CLI
---

export { convertBlockstackCLIUsageToMdx as getStaticProps } from '@common/data/cli-ref'
import { CLIReferenceTable } from '@components/cli-reference'

## Introduction

The command line is intended for developers only. Developers can use the command
line to interact with the Stacks Blockchain as well as test and debug Stacks applications

- Make token transfer transactions
- Deploy smart contracts
- Call smart contract functions
- Generate new keychains
- Convert between testnet, mainnet keys
- Load, store, and list data in Gaia hubs

!> Many of the commands operate on unencrypted private keys. For this reason, **DO NOT** use this tool for day-to-day tasks as you risk the security of your keys.

You must install the command line before you can use the commands.

## How to install the command line

You must have [Node.js](https://nodejs.org/en/download/) v12 or higher (v14 recommended). macOS and Linux users can avoid `sudo` or [permissions problems](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) or by using [`nvm`](https://github.com/nvm-sh/nvm). These instructions assume you are using a macOS or Linux system.

To install the command line, do the following:

```bash
npm install -g @stacks/cli
```

### Troubleshooting the CLI installation

If you run into `EACCES` permissions errors, try the following:

- See https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally.
- Use [`Node Version Manager`](https://github.com/nvm-sh/nvm).

## List of commands

To see the usage and options for the command in general, enter `stx` without any subcommands. To see a list of subcommands enter `stx help`. Enter `stx SUBCOMMAND_NAME help` to see a subcommand with its usage. The following are the available subcommands:

<CLIReferenceTable mdx={props.mdx} />
