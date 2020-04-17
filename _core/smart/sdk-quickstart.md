---
layout: core
description: "Blockstack smart contracting language"
permalink: /:collection/:path.html
---
# Clarity SDK Quickstart
{:.no_toc}

You can use the software developer kit (SDK) to develop, test, and deploy Clarity smart contracts. The SDK goes beyond the basic test environment to allow for development of Javascript or TypeScript clients that call upon Clarity contracts.

* TOC
{:toc}

## About this tutorial and the prerequisites you need

{% include note.html content="This tutorial was written on macOS High Sierra 10.13.4. If you use a Windows or Linux system, you can still follow along. However, you will need to \"translate\" appropriately for your operating system." %}

For this tutorial, you will use  `npm` to manage dependencies and scripts. Before you begin, verify you have installed `npm` using the `which` command to verify.

```bash
$ which npm
/usr/local/bin/npm
```

If you don't find `npm` in your system, [install it](https://www.npmjs.com/get-npm).

## Task 1: Install the SDK command line

The SDK comes with a command line for setting up the SDK and creating new projects.  Use `npm` to install the `clarity` SDK command:

```
npm install -g @blockstack/clarity-cli
```

Verify you have installed the command correctly:

```
$ clarity --help
The Clarity CLI is used to manage Clarity smart contracts from the command line.

VERSION
  @blockstack/clarity-cli/0.1.13-alpha.3 darwin-x64 node-v12.10.0

USAGE
  $ clarity [COMMAND]

COMMANDS
  help   display help for clarity
  new    Generate new project
  setup  Install blockstack-core and its dependencies
```

## Task 2: Generate an initial Clarity project

In this task, you generate a project scaffold &mdash; an initial set of directories and files.   

1. Create a new Clarity project .

    ```sh
    clarity new hello-clarity-sdk
    ```

    The system responds by creating a scaffolding for your Clarity project and initializing the packaging:

    ```
    $ clarity new hello-clarity-sdk
      create .vscode/extensions.json
      create .vscode/launch.json
      create contracts/sample/hello-world.clar
      create test/mocha.opts
      create tsconfig.json
      create test/hello-world.ts
      create .gitignore
      create package.json
      ...
    added 126 packages from 632 contributors and audited 226 packages in 4.678s
    found 0 vulnerabilities

    Project created at /tmp/hello-clarity-sdk
    ```

    Depending on your connection speed, it may take time to construct the scaffolding.

2. Change into your new project directory.

    ```sh
    cd hello-clarity-sdk
    ```

## Task 3: Investigate the generated project 
   
Your project should contain three directories:

 | Directory      | Description                                               |
 | -------------- | --------------------------------------------------------- |
 | `contracts`    | Contains `.clar` files (Clarity contract files) here.     |
 | `test`         | Contains files for testing your application.              |
 | `node_modules` | Contains packages the project depends on. Added by `npm`. |
 
The `contracts` directory contains a single file in `sample/hello-world.clar` file.

```cl
(define (say-hi)
   "hello world")

(define (echo-number (val int))
   val)
```

The contract exposes 2 rudimentary functions. The **say-hi** returns a `hello world` string. The **increment-number**: echos  `val`. 

The project also includes `tests/hello-world.ts` file. The the `mocha.opts` file supports the testing by the <a href="https://mochajs.org/" target="_blank">Mocha Javascript test framework</a>.

{% highlight cl linenos %}
import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";

describe("hello world contract test suite", () => {
  let helloWorldClient: Client;
  let provider: Provider;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    helloWorldClient = new Client("hello-world", "sample/hello-world", provider);
  });

  it("should have a valid syntax", async () => {
    await helloWorldClient.checkContract();
  });

  describe("deploying an instance of the contract", () => {
    before(async () => {
      await helloWorldClient.deployContract();
    });

    it("should return 'hello world'", async () => {
      const query = helloWorldClient.createQuery({ method: { name: "say-hi", args: [] } });
      const receipt = await helloWorldClient.submitQuery(query);
      const result = Result.unwrap(receipt);
      const parsedResult = Buffer.from(result.replace("0x", ""), "hex").toString();
      assert.equal(parsedResult, "hello world");
    });

    it("should echo number", async () => {
      const query = helloWorldClient.createQuery({
        method: { name: "echo-number", args: ["123"] }
      });
      const receipt = await helloWorldClient.submitQuery(query);
      const result = Result.unwrap(receipt);
      assert.equal(result, "123");
    });
  });

  after(async () => {
    await provider.close();
  });
});
{% endhighlight %}

The `hello-world.ts` test file is a client that runs the `hello-world.clar` contract. Tests are critical for smart contracts as they are intended to manipulate assets and their ownership. These manipulations are irreversible within a blockchain. As you create a contracts, you should not be surprise if you end up spending more time and having more code in your `tests` than in your `contracts` directory. The `tests/hello-world.ts` file in the scaffold has the following content:

The first part of the test (lines 1 -10) sets up the test environment. It defines a Clarity `provider` and launches it (line 9). The Client instance contains a contract name and the path to the sample code. This test also checks the client (line 14) and then launches it (line 19), this is equivalent to running `clarity-cli check` with the command line. The remaining test code exercises the contract. Try running this test.


```sh
npm run test

> hello-clarity-sdk@0.0.0 test /private/tmp/hello-clarity-sdk
> mocha



  hello world contract test suite
    ✓ should have a valid syntax
    deploying an instance of the contract
      ✓ should print hello world message
      ✓ should echo number


  3 passing (182ms)
```

In the next section, try your hand at expanding the `hello-world.clar` program.

## Task 4: Try to expand the contract

In this task, you are challenged to expand the contents of the `contracts/hello-world.clar` file. Use your favorite editor and open the `contracts/hello-world.clar` file. If you use Visual Studio Code, you can install the Blockstack Clarity extension. The extension provides `syntax coloration` and some `autocompletion`. 

Edit the `contracts/hello-world.clar` file.

```cl
;; Functions

(define (hello-world)
   "hello world")

(define (echo-number (val int))
   val)
```

Use the `+` function to create a `increment-number-by-10` function.  
  
<div class="uk-inline">
<button class="uk-button uk-button-primary" enter="button">ANSWER</button>
<div uk-dropdown>
<pre>
;; Functions

(define (say-hi)
"hello world")

(define (increment-number (number int))
(+ 1 number))

(define (increment-number-by-10 (number int))
(+ 10 number))
</pre>
</div>
</div>

Use the `+` and `-` function to create a `decrement-number` user-defined method. 

<div class="uk-inline">
    <button class="uk-button uk-button-primary" enter="button">ANSWER</button>
    <div uk-dropdown>
    <pre>
    ;; Functions

   (define (say-hi)
   "hello world")

   (define (increment-number (number int))
   (+ 1 number))

   (define (increment-number-by-10 (number int))
   (+ 10 number))

   (define (decrement-number (number int))
   (- number 1))
    </pre>
   </div>
</div>

Finally, try adding a `counter` variable and be sure to store it. Increment `counter` in your code` and add a `get-counter` funtion to return the result. Here is a hint, you can add a `var` to a contract by adding the following line (before the function): 

```cl
;; Storage

(define-data-var internal-value int 0)
```

<div class="uk-inline">
<button class="uk-button uk-button-primary" enter="button">ANSWER</button>
<div uk-dropdown>
<pre>
;; Storage

(define-data-var counter int 0)

;; Functions

(define (say-hi)
"hello world")

(define (increment-number (number int))
(+ 1 number))

(define (increment-number-by-10 (number int))
(+ 10 number))

(define (decrement-number (number int))
(- number 1))

(define (increment-counter)
  (set-var! counter (+ 1 counter)))

(define (get-counter)
  (counter))

</pre>
</div>
</div>

To review other, longer sample programs visit the <a href="https://github.com/blockstack/clarity-js-sdk/tree/master/packages/clarity-tutorials" target="_blank">clarity-js-sdk</a> repository.