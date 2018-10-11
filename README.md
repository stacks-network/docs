## Docs site

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
   JEKYLL_ENV=production bundle exec jekyll serve --config _config.yml,staticman.yml
   ```

## Deploy via Netlify

To deploy to Netlify:

1. Build the site.

    ```
    JEKYLL_ENV=production jekyll build --config _config.yml,staticman.yml
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


# Technology Reference

* [UIKit](https://getuikit.com/docs/grid)
* [Liquid templates](https://shopify.github.io/liquid/)
