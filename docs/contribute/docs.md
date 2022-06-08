---
title: Contribute to docs
description: Learn how this site is built, and how you can contribute to it.
---

## Introduction

Welcome. Thank you for your interest in contributing and helping make these docs as good as they can be.

This docs site is built on the open source platform [Discosaurus 2](https://docusaurus.io/) and uses most of its content is written in Markdown files.

:::tip Don't know what Markdown is?
Here is a [helpful guide](https://guides.github.com/features/mastering-markdown/) for learning it.
:::

You will need a [Github](https://www.github.com) account to add or edit any content.

To edit any page, just click on the *Edit this page* button at the bottom of each page and submit your changes online.

To add new content, they are two different ways to do it:

- Easiest way: Simply [add an issue on github](https://github.com/stacks-network/docs/issues/new) and enter there the next article you will like to add or modify.

- Standard way: Follow the [steps below](#getting-started) make a pull request. You can also test the site locally. This requires a bit more technical skills.

All the docs in English are stored in the folder `/docs/`.

To add new English content simply add a markdown file (.md) into any subfolder in docs, and it will be automatically displayed in the category of that folder.

All the docs in other languages are stored under the folder `i18n`, but these files should never be edited using GitHub as they are overwritten by Crowdin every time new translations are added.  **To make changes in other languages**, you must do so using Crowdin.
Please refer to [translations](translations) instead.
## Getting started

To get started you have two options:

1. using web IDE Gitpod in your browser.
2. working locally.

### Working in browser

The web IDE gitpod provides an environment to contibute directly from within your browser.

To get started, you only have to a github account and open the link [https://gitpod.io/#https://github.com/stacks-network/docs](https://gitpod.io/#https://github.com/stacks-network/docs) in your browser.

### Working Locally

When working locally with the site, a few things are needed:

- Familiarity with `git`, GitHub, and the command line. [Read more here.](https://docs.github.com/en/github/getting-started-with-github/quickstart)
- [`node` + `npm`,](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine.
- Some kind of code editor, such as VSCode, Sublime, or WebStorm.

:::note
This project requires at least Node version 14
:::

### Working with GitHub

All of the code for this site is open source, located at the [GitHub repository here](https://github.com/stacks-network/docs).

Before you start editing anything, you will need to fork the repo so that you can have your own copy of the code under your GitHub profile. On the [repository's page](https://github.com/stacks-network/docs), you should be able to see a button in the upper right of the screen that says "Fork." [You can read about Forking here.](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)

This is a generalized workflow for contributing to these docs:

- Clone your fork to your local machine with this command `git clone git@github.com:<YOUR_USERNAME>/docs.git stacks_docs`
- Enter your project folder `cd stacks_docs`
- Create a branch `git checkout -b feat/my-feature-branch`.
- Install dependencies with `npm install`.
- Run the command `npx docusaurus start` to start a local copy of the site. A web browser will open at http://localhost:3000, so you can see the result of your changes in real time.
- Make the changes you wish, preview them in the browser and then commit them with this kind of message: `git commit -am "feat: some new feature or content"`.
- Push to to GitHub with `git push --set-upstream origin feature/my-feature-branch`.
- Visit GitHub and make your pull request.

### Running and building the site locally

You can build the entire site with the following command:
```bash
npm run build
```

You can start the page locally with the following command:
```bash
npx docusaurus start
```
The docs site will be accessible at this url: [`http://localhost:3000`](http://localhost:3000).


### Pages

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

### Frontmatter

Frontmatter is the top part of any markdown document that is written in a language called [YAML](https://yaml.org/). It looks like this:

```yaml
---
title: This is my page title
description: A short, concise sentence describing what is on this page
---
```

Frontmatter gives us the ability to define some things within a page that the site can use, such as a page title or page description.
When adding any new page, please include a `title` and `description`.

### Dynamic sidebar

The sidebar navigation is generated in a dynamic way. The application searches through a list of paths and parses the markdown to get some information about the page, such as the title and headings contained within the page.

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

### Use Conventional Commits

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as and commits naming convention. Use it while contributing, please.

### Code blocks

To write a code block, you need to wrap your code in ` ```language `, and end your code block with ` ``` `. Here is an example of ` ```clarity `.

```clarity
(define-data-var counter int 0)

(define-public (get-counter)
 (ok (var-get counter)))
```
### Admonitions

You can use the following admonitions to highlight content.

```md
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