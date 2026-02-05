[![License](https://img.shields.io/github/license/stacks-network/docs)](./LICENSE)

# The Official Stacks Docs

The Stacks documentation serves as the comprehensive resource for understanding and building on Stacks, a Bitcoin Layer 2 that enables fast, low-cost transactions and full-featured smart contracts secured by Bitcoin. These docs guide three main audiences: developers looking to build apps and deploy smart contracts with tools like Clarity and Stacks.js; operators running nodes, miners, and signers to support network infrastructure; and learners seeking to understand how Stacks activates the Bitcoin economy through its unique technical architecture. With sections covering everything from beginner quickstarts to advanced technical references, the docs aim to empower the global builder community to create a Bitcoin-native onchain economy.

## Contribute to the Stacks Docs

The Stacks docs are built using GitBook with a two-way sync with the [docs repository on GitHub](https://github.com/stacks-network/docs). 

Because of this two-way sync, you can contribute to the documentation in one of two ways:

1. You can fork the docs repo, add your change, and then create a PR to be merged into the main docs
2. You can create an issue, and someone that works on the docs will take a look and implement it if it is a necessary change

All of the content files are markdown files. The structure and layout of the docs are based on Gitbook's Spaces. Each Space represents a top-level navigation section of the public docs website.

Below are the current main Spaces that make up the docs:

- **Learn**: Technical explainers and concept breakdowns on different aspects of Stacks.
- **Build**: Developer quickstarts, How-To guides, integration examples, Clarinet guides, Stacks.js guides, etc.
- **Operate**: Setup and configuration guides on running Stacks nodes, miners, and signers.
- **Reference**: Clarity language details, protocol specs, SDK & APIs definitions, and other tooling references.
- **Tutorials**: End-to-end learning walkthroughs on building complete applications with Stacks. 

Besides the actual content, each Space consists of:

- `.gitbook`: Folder for assets such as images, pdfs, etc.
- `README.md`: Acts as the landing page of the Space's section.
- `SUMMARY.md`: Table of contents

What kinds of changes are we looking for?

If you see a typo, a missing guide or tutorial, an unclear explanation, or really anything else you think could improve the quality of the documentation, please feel free to open an issue or create a pull request.

## Reporting Issues

If you find a bug in the documentation or have a feature request, please [open an issue](https://github.com/stacks-network/docs/issues/new) describing the problem or suggestion.
