---
title: Contribute to docs
description: Learn how this site is built, and how you can contribute to it.
---

## Introduction

Welcome. Thank you for your interest in contributing and helping make these docs as good as they can be.

This docs site is built on the open source platform [Discosaurus 2](https://docusaurus.io/) and most of its content is written in Markdown files. All of the code for this site is free and open source, located at the [GitHub repository here](https://github.com/stacks-network/docs). All of the code for this site is free and open source, located at the [GitHub repository here](https://github.com/stacks-network/docs).

:::tip Don't know what Markdown is? Want to learn? :::tip Don't know what Markdown is? Want to learn? Here is a [helpful guide](https://guides.github.com/features/mastering-markdown/).

Don't want to learn it? No need to. Don't want to learn it? No need to. Write [in plain text an issue on Github](https://github.com/stacks-network/docs/issues/new?assignees=&labels=documentation&template=add-documentation.md&title=%5BAdd+docs%5D) :::

:::info You need a free [Github](https://www.github.com) account to add or edit any content. ::: :::

To edit any page, just click on the *Edit this page* button at the bottom of each page and submit your changes online.

To add new content, they are two different ways to do it, the [easy way](#easy-way) and the [advanced way](#advanced-way).

## Easy way

[**Simply click here and enter the text of the article you wish to add.**](https://github.com/stacks-network/docs/issues/new?assignees=&labels=documentation&template=add-documentation.md&title=%5BAdd+docs%5D)

This will open up an issue on github using our template.
## Advanced way

For more advanced changes you can follow the next steps.

You can also test the site locally using this method.
### Steps

1. Fork the [docs reposiroty](https://github.com/stacks-network/docs) by clicking on the *Fork* button in the upper right of the screen.
2. Clone your fork to your local machine with this command `git clone git@github.com:<YOUR_USERNAME>/docs.git stacks_docs`
3. Enter your project folder `cd stacks_docs`
4. Create a branch `git checkout -b feat/my-feature-branch`.
5. You can optionally preview your changes in real time with:
    - `npm install` (to install dependencies).
    - `npx docusaurus start` to start a local copy of the site. `npx docusaurus start` to start a local copy of the site. A web browser will open at http://localhost:3000, so you can see a preview of yourhanges in real time.
6. Make the changes you wish and then commit them with this kind of message: `git commit -am "feat: some new feature or content"`.
7. Push to to GitHub with `git push --set-upstream origin feature/my-feature-branch`.
8. Visit GitHub and make your pull request.

## Aditional information
### Running and building the site locally (optional)

You can start the page locally with the following command. This is enough to preview your changes. This is enough to preview your changes.
```bash
npx docusaurus start
```

Before running this command for the first time you will need to run `npm install` to install dependencies.

The docs site will be accessible at this url: [`http://localhost:3000`](http://localhost:3000).


After you finished your changes, you can also build the entire site with the following command (not usually needed):
```bash
npm run build
```

### An alternative: Working in browser

As an alterative to working locally, you can also use the web IDE gitpod that provides an environment to contribute directly from within your browser.

You only need to have a github account and open [this link](https://gitpod.io/#https://github.com/stacks-network/docs).

### Folder structure of the site

If you are interested in only adding new documentation content to the site, the files that will be important to you are located within `./docs/*`:

```bash showLineNumbers highlight=12
stacks_docs/
  build-apps
  contribute/
  faq/
  gaia/
  nodes-and-miners/
  noteworthy-contracts/
  references/
  understand-stack/
  write-smart-contracts/
```

The routing for this site is file based, meaning if you created a folder within `/docs/gaia/` named `testing` and in it a file named `test1.md`, you would be able to navigate to `http://localhost:3000/gaia/testing/test1` and you would see whatever content is in that markdown file.

All the docs in English are stored in the folder `/docs/`.

To add new English content simply add a markdown file (.md) into any subfolder in docs, and it will be automatically displayed in the category of that folder.

All the docs in other languages are stored under the folder `i18n`, but these files should never be edited using GitHub as they are overwritten by Crowdin every time new translations are added.  **To make changes in other languages**, you must do so using Crowdin. Please refer to [translations](translations) instead.  **To make changes in other languages**, you must do so using Crowdin. Please refer to [translations](translations) instead.

### Frontmatter

Frontmatter is the top part of any markdown document that is written in a language called [YAML](https://yaml.org/). It looks like this: It looks like this: It looks like this:

```yaml
---
title: This is my page title
description: A short, concise sentence describing what is on this page
---
```

Frontmatter gives us the ability to define some things within a page that the site can use, such as a page title or page description. When adding any new page, please include a `title` and `description`. When adding any new page, please include a `title` and `description`. When adding any new page, please include a `title` and `description`.


<!--
### Code formatter

We use [Prettier](https://prettier.io/docs/en/install.html) to check the format the code.

You can install prettier with the following command:

```bash
npm install --save-dev --save-exact prettier
```

And execute prettier with the following command:

```bash
npx prettier --write mynewfiletocheck.md
```
-->
### Use Conventional Commits

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as and commits naming convention. Use it while contributing, please. Use it while contributing, please. Use it while contributing, please.

### Code blocks

To write a code block, you need to wrap your code in ` ```language `, and end your code block with ` ``` `. Here is an example of ` ```clarity `. Here is an example of ` ```clarity `. Here is an example of ` ```clarity `.

```clarity
(define-data-var counter int 0)

(define-public (get-counter)
 (ok (var-get counter)))
```
### Admonitions

You can use the following admonitions to highlight content.

```md
:::note
Some **content** with _markdown_ `syntax`.
:::note
Some **content** with _markdown_ `syntax`.
:::note
Some **content** with _markdown_ `syntax`. Check [this `api`](#).
:::

:::tip
Some **content** with _markdown_ `syntax`. Check [this `api`](#).
:::

:::info
Some **content** with _markdown_ `syntax`. Check [this `api`](#).
:::

:::caution
Some **content** with _markdown_ `syntax`. Check [this `api`](#).
:::

:::danger
Some **content** with _markdown_ `syntax`. Check [this `api`](#).
:::
:::

:::info
Some **content** with _markdown_ `syntax`.
:::

:::caution
Some **content** with _markdown_ `syntax`.
:::

:::danger
Some **content** with _markdown_ `syntax`.
:::
:::

:::info
Some **content** with _markdown_ `syntax`.
:::

:::caution
Some **content** with _markdown_ `syntax`.
:::

:::danger
Some **content** with _markdown_ `syntax`.
:::
```

Which renders:

:::note

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

:::tip

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

:::info

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

:::caution

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

:::danger

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::