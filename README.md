## Docs site

To run locally:

1. Get the content from the downstream repos.

    ```
    ./get-content.sh
    ```

3. Build and serve locally.

   ```
   bundle exec jekyll serve
   ```


## Deploy via Netlify

To deploy to Netlify:

1. Build the site.

    ```
    jekyll build
    ```
2. Force add the `_site` directory.

    ```
    git push -f origin
    ```
