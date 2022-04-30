[![Pull Requests Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/stacks-network/docs)
[![Crowdin](https://badges.crowdin.net/docsstacksco/localized.svg)](https://crowdin.com/project/docsstacksco)

# Stacks documentation

This repository stores the files for the Stacks documentation website on [docs.stacks.co](https://docs.stacks.co)

![A screenshot of docs.stacks.co](/public/images/docs-homepage.png)

## Running and building the site locally

If you are interested in contributing to the site and making changes, please refer to our [contributing guide here](https://docs.stacks.co/contribute).

If you are interested in contributing to the tranlations of this site to multiple languages, please refer to the [translations guide](https://docs.stacks.co/contribute/translations)

## Generated documentation

### Stacks CLI reference

The `src/_data/cli-reference.json` file is generated from the `stx` subcommand `docs`.

1. Install the latest version of the cli according to the instructions at: https://github.com/hirosystems/stacks.js/tree/master/packages/cli

2. Generate the json for the cli in the `docs.stacks` repo.

   ```bash
   stx docs > src/_data/cli-reference.json
   ```

### Clarity Reference

There is a json file that is generated via the `stacks-blockchain` repo, which automatically brings it over to this repo via a github action.
