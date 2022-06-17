---
title: Software de desarrollo de Clarity
description: Las siguientes herramientas son útiles para desarrollar contratos inteligentes con Clarity
sidebar_position: 4
---

## Protocolo del Servidor de Idioma (LSP en inglés) para Clarity (incluyendo extensión de Visual Studio Code)

The Language Server Protocol (LSP) defines the protocol used between an editor or IDE and a language server that provides language features like auto complete, go to definition, find all references etc.

Esto hace que la programación en Clarity sea más fácil y mucho más intuitiva.

![Clarity LSP Screenshot](https://raw.githubusercontent.com/hirosystems/clarity-lsp/21b64298ca117dc41358eb9dce4605cc4a448a4c/images/screenshot.png?raw=true)


El repositorio de Clarity LSP está disponible [aquí](https://github.com/hirosystems/clarity-lsp). La extensión para Visual Studio Code se puede descargar directamente desde [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp), pero podría ser una versión anterior. Para una versión más actualizada también puedes descargarla desde [open-vsx](https://open-vsx.org/extension/hirosystems/clarity-lsp).

## Clarity REPL

A read—eval—print loop (REPL), also termed an interactive toplevel or language shell, is a simple, interactive computer programming environment that takes single user inputs (that is, single expressions), evaluates (executes) them, and returns the result to the user; a program written in a REPL environment is executed piecewise.

![Clarity-repl](https://github.com/hirosystems/clarity-repl/blob/develop/docs/images/screenshot.png?raw=true)

Las instrucciones sobre cómo instalar Clarity REPL se pueden encontrar [aquí](https://github.com/hirosystems/clarity-repl).

## Clarinet

Clarinet is a Clarity runtime packaged as a command line tool, designed to facilitate smart contract understanding, development, testing and deployment. Clarinet consists of a Clarity REPL and a testing harness, which, when used together allow you to rapidly develop and test a Clarity smart contract, with the need to deploy the contract to a local devnet or testnet.

![Clarinet](https://github.com/hirosystems/clarinet/blob/develop/docs/images/demo.gif?raw=true)

Las instrucciones de instalación, incluyendo la compilación del código fuente se pueden encontrar [aquí](https://github.com/hirosystems/clarinet). If you prefer you can directly download the latest compiled realease for Windows, Mac and Linux [here](https://github.com/hirosystems/clarinet/releases).

[Clarinet 101](https://www.youtube.com/playlist?list=PL5Ujm489LoJaAz9kUJm8lYUWdGJ2AnQTb) contains multiple Clarinet video tutorials

### Primeros pasos con Clarinet

Puede verificar que tiene instalado Clarinet comprobando su versión:

```bash
$ clarinet --version
clarinet 0.70
```

More detailed information on using Clarinet is available [here](https://book.clarity-lang.org/ch07-00-using-clarinet.html). However to get you started, the following commands are important to know.

Crear un nuevo proyecto y entrar en su directorio:

```bash
clarinet new my-project && cd my-project
```

Crear un nuevo contrato dentro de `mi-proyecto`:

```bash
clarinet contract new mycoolcontract
```

Compruebe la sintaxis de Clarity:

```bash
clarity check
```

Para probar su contrato:

```bash
clarinet test
```

Entrar en la consola de Clarinet:

```bash
clarinet console
```
