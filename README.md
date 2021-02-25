[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/blockstack/docs)

# Stacks documentation

![A screenshot of docs.blockstack.org](/public/images/docs-homepage.png)

## Running and building the site locally

If you are interested in contributing to the site and making changes, please refer to our [contributing guide here](https://docs.blockstack.org/ecosystem/contributing).

## Generated documentation

## Style checks

This repository uses [vale](https://github.com/errata-ai/vale) to run style checks. Make sure to install the tool and run the following command before creating a PR in order to check for styling issues:

```bash
yarn check:style
```

### Blockstack CLI reference

The `src/_data/cli-reference.json` file is generated from the `stx` subcommand `docs`.

1. Install the latest version of the cli according to the instructions at: https://github.com/blockstack/stacks.js/tree/master/packages/cli

2. Generate the json for the cli in the `docs.blockstack` repo.

   ```bash
   stx docs > src/_data/cli-reference.json
   ```

### Clarity Reference

There is a json file that is generated via the `stacks-blockchain` repo, which automatically brings it over to this repo
via a github action.
