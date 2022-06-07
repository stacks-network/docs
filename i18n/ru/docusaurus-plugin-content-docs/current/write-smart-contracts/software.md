---
title: Clarity development software
description: The following tools are useful when developing Clarity smart contracts
sidebar_position: 4
---

## Language Server Protocol for Clarity (including Visual Studio Code extension)

The Language Server Protocol (LSP) defines the protocol used between an editor or IDE and a language server that provides language features like auto complete, go to definition, find all references etc.

This makes programming in Clarity easier and much more intuitive.

![Clarity LSP Screenshot](https://github.com/hirosystems/clarity-lsp/raw/HEAD/doc/images/screenshot.png?raw=true)

Clarity LSP repository is available [here](https://github.com/hirosystems/clarity-lsp). The extension for Visual Studio Code can be downloaded directly from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp), but can be and older version. For a more up to date version you can also download it from [open-vsx](https://open-vsx.org/extension/hirosystems/clarity-lsp).

## Clarity REPL

A read—eval—print loop (REPL), also termed an interactive toplevel or language shell, is a simple, interactive computer programming environment that takes single user inputs (that is, single expressions), evaluates (executes) them, and returns the result to the user; a program written in a REPL environment is executed piecewise.

![Clarity-repl](https://github.com/hirosystems/clarity-repl/blob/develop/docs/images/screenshot.png?raw=true)

Instructions on how to install Clarity REPL can be found [here](https://github.com/hirosystems/clarity-repl).

## Clarinet

Clarinet is a Clarity runtime packaged as a command line tool, designed to facilitate smart contract understanding, development, testing and deployment. Clarinet consists of a Clarity REPL and a testing harness, which, when used together allow you to rapidly develop and test a Clarity smart contract, with the need to deploy the contract to a local devnet or testnet.

![Clarinet](https://github.com/hirosystems/clarinet/blob/develop/docs/images/demo.gif?raw=true)

Installation instructions, including build from source instructions can be found [here](https://github.com/hirosystems/clarinet). If you prefer you can directly download the latest compiled realease for Windows, Mac and Linux [here](https://github.com/hirosystems/clarinet/releases).

[Clarinet 101](https://www.youtube.com/playlist?list=PL5Ujm489LoJaAz9kUJm8lYUWdGJ2AnQTb) contains multiple Clarinet video tutorials

### Getting started with Clarinet

You can verify you have Clarinet installed by checking its version:

```bash
$ clarinet --version
clarinet 0.70
```

More detailed information on using Clarinet is available [here](https://book.clarity-lang.org/ch07-00-using-clarinet.html). However to get you started, the following commands are important to know.

Create a new project and enter its directory:

```bash
clarinet new my-project && cd my-project
```

Create a new contract inside `my-project`:

```bash
clarinet contract new mycoolcontract
```

Check the sintax of Clarity:

```bash
clarity check
```

To test your contract:

```bash
clarinet test
```

Enter Clarinet's console:

```bash
clarinet console
```
