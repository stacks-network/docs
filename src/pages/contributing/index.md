---
title: How to contribute
description: Learn how this site is built, and how you could contribute to it.
icon: BlockstackIcon
images:
  large: /images/contribute.svg
  sm: /images/contribute.svg
---

## Introduction

Welcome. Thank you for your interest in contributing and helping make these docs as good as they can be. This page will
outline how this site is built, its general structure, getting it running locally, and some helpful tips for using all of its features.

## Next.js, MDX, Markdown

This docs site is built with [Next.js](https://github.com/vercel/next.js) and uses something called [MDX](https://mdxjs.com/).
Next.js is a framework built on top of React, and MDX is a tool that enables writing React code (JSX) within standard
Markdown files. In addition to being able to write JSX in Markdown, it allows the application to render out all of the
Markdown content with React components. This means that we are able to do some pretty complex things while a
contributor only has to know how to write Markdown.

-> **Don't know what Markdown is?** Here is a [helpful guide](https://guides.github.com/features/mastering-markdown/) for learning it.

## Getting started

To get started you have two options:

1. using web IDE Gitpod in your browser.
2. working locally.

### Working in browser

The web IDE gitpod provides an environment to contibute directly from within your browser.

To get started, you only have to a github account and open the link
[https://gitpod.io/#https://github.com/blockstack/docs](https://gitpod.io/#https://github.com/blockstack/docs) in your browser.

### Working Locally

When workin locally with the site, a few things are needed:

- Familiarity with `git`, GitHub, and the command line. [Read more here.](https://docs.github.com/en/github/getting-started-with-github/quickstart)
- [`node` + `npm`,](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [`yarn` installed](https://yarnpkg.com/getting-started/install) on your machine.
- Some kind of code editor, such as VSCode, Sublime, or WebStorm.

-> This project requires at least Node version 12

### Working with GitHub

All of the code for this site is open source, located at the [GitHub repository here](https://github.com/blockstack/docs).
Before you start editing anything, you will need to fork the repo so that you can have your own copy of the code under
your GitHub profile. On the [repository's page](https://github.com/blockstack/docs.blockstack), you should be able to
see a button in the upper right of the screen that says "Fork." [You can read about Forking here.](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)

This is a generalized workflow for contributing to these docs:

- Clone your fork to your local machine with this command `git clone git@github.com:<YOUR_USERNAME>/docs.blockstack.git`
- Enter your project folder `cd docs.blockstack`
- Create a branch `git checkout -b feat/my-feature-branch`.
- Run the command `yarn` to install all of the dependencies.
- Make the changes you wish and then commit them with this kind of message: `git commit -am "feat: some new feature or content"`.
- Push to to GitHub with `git push --set-upstream origin feature/my-feature-branch`.
- Visit GitHub and make your pull request.

### Running the site locally

Once you have the project on your computer and the dependencies have been installed via the `yarn` command, you can run
`yarn dev` and it should give you a message such as:

```bash
yarn dev
```

```bash
yarn run v1.22.4
yarn clean:build-files && next dev
rimraf .next
ready - started server on http://localhost:3000
warn  - You have enabled experimental features.
warn  - Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use them at your own risk.

info  - Using external babel configuration from /Users/YOUR_USERNAME/oss/docs.blockstack/babel.config.js
event - compiled successfully
```

The docs site will be accessible at this url: [`http://localhost:3000`](http://localhost:3000).

## Project structure

### Pages

If you are interested in only adding new documentation content to the site, the files that will be important to you are
located within `docs.blockstack/src/pages/*`:

```bash showLineNumbers highlight=11
docs.blockstack/
  .github/
  lib/
  node_modules/
  public/
  src/
    _data/
    _includes/
    common/
    components/
    pages/
  types/
```

The routing for this site is file based, meaning if you created a folder within `/pages` named `clarity` and a then file
named `overview.md`, you would be able to navigate to `http://localhost:3000/clarity/overview` and you would see whatever
content is in that markdown file.

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

-> **Did you know?** The term _Frontmatter_ comes from the section in a book at the beginning detailing things like: publisher’s name and address, copyright information, table of contents, etc.

### Dynamic sidebar

The sidebar navigation is generated in a partially dynamic way. The application searches through a list of paths and
parses the markdown to get some information about the page, such as the title and headings contained within the page.

#### Adding a new route

If you are adding a new route, you have to add your route to a section contained within this file: `src/common/navigation.yaml`

```bash showLineNumbers highlight=11
sections:
  - pages:
      - path: /
      - path: /understand-stacks
        pages:
          - path: /overview
          - path: /testnet
          - path: /proof-of-transfer
          - path: /mining
          - path: /accounts
          - path: /transactions
          - path: /network
          - path: /stacking
          - path: /command-line-interface
          - path: /local-development
          - path: /technical-specs
          - path: /stacks-blockchain-api
        sections:
          - title: Tutorials
            pages:
              - path: /managing-accounts
              - path: /sending-tokens
              - path: /running-testnet-node
              - path: /integrate-stacking
              - path: /stacking-using-CLI
```

Adding a new route requires to add a new `path`.

The script will process that file and pull out the title from the frontmatter of the document.

### Non-standard pages

There are a few pages within these docs that are non-standard markdown pages. This means they are using some kind of external data as their source,
such as the [Clarity Reference page](/references/language-overview), or the [Stacks CLI page](https://docs.hiro.so/references/stacks-cli). These pages are using a function of Next.js called
[`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) which allows us to
fetch external data at runtime and use it in some way within our pages.

## Tips and tricks

### Style checks

We use the [Google Developer documentation style guides](https://developers.google.com/style/) in this project. Make sure to install [vale](https://github.com/errata-ai/vale) and run the style checks before you create a PR:

```bash
yarn check:style
```

### Use Conventional Commits

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as and commits naming convention. Use it while contributing, please.

### Always use Markdown when possible

It's possible to write standard HTML when writing in Markdown, but that should be avoided at all costs. We use `remark` to
processes all Markdown, giving us things like automatically opening all external links in new windows, and adding IDs to headers.
When we write things in HTML, such as a link or image, we don't get the benefit of the remark plugins as consistently as we would
if we stuck to standar Markdown.

### Code blocks

The site uses `react-prism-renderer` and `prismjs` to add syntax highlighting to all of our code. You can see a full
list of [languages supported here](https://github.com/PrismJS/prism/tree/master/components). We have a custom language
definition for `clarity`, our smart contracting language located here. To add a new language, see this file: [`components/codeblock/index.tsx`](#).

To write a code block, you need to wrap your code in ` ```language `, and end your code block with ` ``` `. Here is an example of ` ```clarity `.

```clarity
(define-data-var counter int 0)

(define-public (get-counter)
 (ok (var-get counter)))
```

#### Line highlighting

You can pass some extra data to tell the component to highlight specific lines:

` ```clarity highlight=1,4-6,13-17,28-32 `

Which will render:

```clarity highlight=1,4-6,13-17,28-32
(define-constant sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(define-constant recipient 'SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G)

(define-fungible-token novel-token-19)
(begin (ft-mint? novel-token-19 u12 sender))
(begin (ft-transfer? novel-token-19 u2 sender recipient))

(define-non-fungible-token hello-nft uint)
(begin (nft-mint? hello-nft u1 sender))
(begin (nft-mint? hello-nft u2 sender))
(begin (nft-transfer? hello-nft u1 sender recipient))

(define-public (test-emit-event)
    (begin
        (print "Event. Hello world")
        (ok u1)))
(begin (test-emit-event))

(define-public (test-event-types)
    (begin
        (unwrap-panic (ft-mint? novel-token-19 u3 recipient))
        (unwrap-panic (nft-mint? hello-nft u2 recipient))
        (unwrap-panic (stx-transfer? u60 tx-sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR))
        (unwrap-panic (stx-burn? u20 tx-sender))
        (ok u1)))

(define-map store ((key (buff 32))) ((value (buff 32))))
(define-public (get-value (key (buff 32)))
    (begin
        (match (map-get? store ((key key)))
            entry (ok (get value entry))
            (err 0))))
(define-public (set-value (key (buff 32)) (value (buff 32)))
    (begin
        (map-set store ((key key)) ((value value)))
        (ok u1)))
```

### Alerts

We use another remark plugin to generate certain kinds of alerts inline in our documentation.

```md
> This is a standard blockquote (non-alert).

-> This will be a standard note style alert.

=> This will be a success style alert.

~> This will be a warning style alert

!> This will be a danger style alert
```

Which renders:

> This is a standard blockquote (non-alert).

-> This will be a standard note style alert.

=> This will be a success style alert.

~> This will be a warning style alert

!> This will be a danger style alert
