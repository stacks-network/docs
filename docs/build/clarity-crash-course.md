# Clarity Crash Course

## Clarity Crash Course

This is designed for people with some programming experience who are new to Clarity. You don't need prior smart contract development experience, but if you have experience with languages like Solidity, you'll pick this up quickly.

Once you've familiarized yourself with the language, consider the book [Clarity of Mind](https://book.clarity-lang.org/title-page.html) or the course [Clarity Universe](https://clarity-lang.org/universe) to continue your learning.

### Your First Clarity Smart Contract

We're going to build a basic Clarity smart contract using [Clarity Tools](https://clarity.tools/code/new), so you won't have to install anything for this introduction. Visit that link and it will open up a new contract for you.

Clarity Tools evaluates Clarity code in real-time — handy for experimenting and seeing immediate results.

The initial example contains comments (two semicolons) and a public function declaration. Clarity's syntax is inspired by LISP: everything is an expression wrapped in parentheses. Function definitions, variable declarations, and parameters are lists inside lists. This makes Clarity concise and readable once you get used to it.

{% stepper %}
{% step %}
### Understanding a simple expression

We can think of some constructs as function calls. For example:

* Call a function called `define-read-only` (a built-in function).
* Pass it a parameter `hello`, which corresponds to the method signature.
* Pass it a parameter `"Hello"`, which corresponds to the function body.

You can refer to the [`define-read-only`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#define-read-only) documentation for details.
{% endstep %}

{% step %}
### Everything is an expression

Clarity treats everything as expressions inside expressions. Function definitions are calls to built-in functions; the function body is an expression. This uniformity helps reasoning about programs in Clarity.
{% endstep %}

{% step %}
### Use LISP-like nesting

Expect nested parentheses and expressions. You’ll often read code as lists inside lists, where each parentheses-enclosed group represents a call or expression.
{% endstep %}
{% endstepper %}

Let's expand on these ideas by creating a new function. Paste this into Clarity Tools:

{% code title="contract.clar" %}
```clarity
(define-data-var count int 0)
(define-public (add-number (number int))
    (let
        (
            (current-count count)
        )

        (var-set count (+ 1 number))
        (ok (var-get count))
    )
)


(add-number 5)
```
{% endcode %}

If you type that into Clarity Tools, you'll see the result printed is 6.

#### What this code does

* (define-data-var count int 0)\
  Defines a persistent state variable `count` initialized to 0. This value is persisted on-chain when the contract is deployed.
* Clarity is interpreted, not compiled. When the contract is deployed, top-level expressions run (so the data var initialization happens at deploy time).
* (define-public (add-number (number int)) ...)\
  Defines a public function `add-number` that takes a single parameter `number` of type `int`. Public functions can modify chain state and be called from outside the contract.

{% hint style="info" %}
In Clarity, there are public, private, and read-only functions:

* public: can modify chain state and be called externally.
* private: can modify state but only be called within the contract.
* read-only: will fail if they attempt to modify state.
{% endhint %}

* (let ((current-count count)) ...)\
  The `let` expression wraps multiple steps into a single expression (function bodies must evaluate to a single expression). It also declares local variables for use inside the function. Here `current-count` is a function-local variable set to `count`.
* (var-set count (+ 1 number))\
  Sets the persistent `count` to `1 + number`. The `+` is itself a function call with operands as parameters.
* (ok (var-get count))\
  Returns the new value of `count` wrapped in an `ok` response to indicate success.
* (add-number 5)\
  Calls the function with parameter 5 (this is how you can invoke the function in an interactive environment like Clarity Tools).

This brief overview should get your feet wet with Clarity. For deeper learning, we recommend:

* The [Clarity Book](https://book.clarity-lang.org/title-page.html)
* [Clarity Universe](https://clarity-lang.org/universe)

If you prefer jumping into reference material and examples, the Clarity docs contain guides and sample contracts to explore.
