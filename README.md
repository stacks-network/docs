# Welcome to the Blockstack documentation repo!

This README explains the user cases, source file organization, and procedures for building the Blockstack documentation.  You can find the documentation at https://docs.blockstack.com

You can also make use of the **Edit this page on GitHub** link from any https://docs.blockstack.org page.

## Authoring Environment Setup

When setting up your machine for the first time, run:

```
yarn
```

Then when authoring, run:

```bash
yarn dev
```

You can preview your changes by visiting `http://localhost:3000`

## Generated documentation

### To generate the CLI json manually

The `src/_data/cliRef.json` file is generated from the `blockstack-cli` subcommand `docs`. This data file is consumed by the `_includes/commandline.md` file which is used to serve up the reference.

1. Install the latest version of the cli according to the instructions at: https://github.com/blockstack/cli-blockstack

2. Generate the json for the cli in the `docs.blockstack` repo.

   ```
   $ blockstack-cli docs | python -m json.tool > src/_data/cliRef.json
   ```

3. Make sure the generated docs are clean by building the documentation.

   If you run into any problem in the generation usually it results from a problem in the repo. You can make a pull request back to the repo to fix anything.

### Clarity Reference

As of 8/12/19 Clarity is in the [develop](https://github.com/blockstack/blockstack-core/tree/develop) branch of core.  You can build the Clarity command line from the Docker image. `core/src/vm/docs/mod.rs`


1. Pull the latest developer preview from the Docker Hub.

   ```
   $ docker pull blockstack/blockstack-core:clarity-developer-preview
   ```

2. Build the lastest JSON.

   ```
   docker run -it blockstack/blockstack-core:clarity-developer-preview blockstack-core docgen | jsonpp > ~/repos/docs.blockstack/src/_data/clarityRef.json
   ```

3. Build the documentation and verify the Clarity reference is building correctly.

4. Make changes in core
5. Build the docker image
6. Run doc gen with the new image

    ```
   $ docker run --name docsbuild -it blockstack-test blockstack-core docgen | jsonpp > ~/repos/docs.blockstack/src/_data/clarityRef.json
    ```

    This generates the JSON source files which are consumed through Liquid templates into markdown.

7. Rebuild the documentation site with Jekyll.

8. Review the changes in the Clarity documentation to ensure that no breaking changes were introduced through code changes.

9. If you find the documentation is no longer formatting correctly or there are errors in the reference, create a PR against the `blockstack-core` repo.

### View and test the clarity cli

You can view [the source code](https://github.com/blockstack/blockstack-core/blob/develop/src/clarity.rs).

1. Pull the Stacks Node clarity-developer-preview image from Docker Hub.

   ```bash
    $ docker pull blockstack/blockstack-core:clarity-developer-preview
   ```

2. Start the Stacks Node test environment with a Bash shell.

    ```bash
    $ docker run -it -v $HOME/blockstack-dev-data:/data/ blockstack/blockstack-core:clarity-developer-preview bash
    ```

    The command launches a container with the Clarity test environment and opens a bash shell into the container.

3. Run the clarity-cli in the shell.

    ```bash
    root@5b9798633251:/src/blockstack-core# clarity-cli
    Usage: clarity-cli [command]
    where command is one of:

    initialize         to initialize a local VM state database.
    mine_block         to simulated mining a new block.
    get_block_height   to print the simulated block height.
    check              to typecheck a potential contract definition.
    launch             to launch a initialize a new contract in the local state database.
    eval               to evaluate (in read-only mode) a program in a given contract context.
    eval_raw           to typecheck and evaluate an expression without a contract or database context.
    repl               to typecheck and evaluate expressions in a stdin/stdout loop.
    execute            to execute a public function of a defined contract.
    generate_address   to generate a random Stacks public address for testing purposes.
    ```
