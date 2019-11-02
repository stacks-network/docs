# README for the documentation site


## Building after a fork

## Run locally

To run locally:

1. Get the content from the downstream repos.

    ```
    ./get-content.sh
    ```

3. Build and serve locally.

   ```
   bundle exec jekyll serve --config _config.yml,staticman.yml
   ```

   Use this format to turn on production features:

   ```
   JEKYLL_ENV=production bundle exec jekyll serve --config _config.yml
   ```

## Deploy via Netlify

To deploy to Netlify:

1. Build the site.

    ```
    JEKYLL_ENV=production bundle exec jekyll build --config _config.yml
    ```
2. Force add the `_site` directory.

    ```
    git push -f origin
    ```

## Test a Deploy with Surge


```
cd _site
surge
```

```
surge --domain raspy-songs.surge.sh
```

# To generate the CLI json manually

The `_data/cliRef.json` file is generated from the `blockstack-cli` subcommand `docs`. This data file is consumed by the `_includes/commandline.md` file which is used to serve up the reference.  

1. Install the latest version of the cli according to the instructions at: https://github.com/blockstack/cli-blockstack

2. Generate the json for the cli in the `docs.blockstack` repo.

   ```
   $ blockstack-cli docs | python -m json.tool > _data/cliRef.json 
   ```

3. Make sure the generated docs are clean by building the documentation.

   If you run into any problem in the generation usually it results from a problem in the repo. You can make a pull request back to the repo to fix anything.

## Clarity Reference

As of 8/12/19 Clarity is in the [develop](https://github.com/blockstack/blockstack-core/tree/develop) branch of core.  You can build the Clarity command line from the Docker image. `core/src/vm/docs/mod.rs`


1. Pull the latest developer preview from the Docker Hub.

   ```
   $ docker pull blockstack/blockstack-core:clarity-developer-preview
   ```

2. Build the lastest JSON.

   ```
   docker run -it blockstack/blockstack-core:clarity-developer-preview blockstack-core docgen | jsonpp > ~/repos/docs.blockstack/_data/clarityRef.json
   ```

3. Build the documentation and verify the Clarity reference is building correctly.

4. Make changes in core
5. Build the docker image
6. Run doc gen with the new image

```
   $ docker run --name docsbuild -it blockstack-test blockstack-core docgen | jsonpp > ~/repos/docs.blockstack/_data/clarityRef.json
```


# Technology Reference

* [UIKit](https://getuikit.com/docs/grid)
* [Liquid templates](https://shopify.github.io/liquid/)
