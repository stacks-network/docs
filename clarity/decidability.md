# Decidability

### What does it mean for a language to be Non-Turing Complete or Decidable?

Non-Turing complete and decidable are two terms you will often hear about the security advantages of Clarity, but what do they mean?

While related, they are not quite interchangeable, since there are a few differences.

#### Non-Turing Complete

A system or language is non-Turing complete if it cannot simulate a Turing machine, which is an abstract model of computation. Non-Turing complete systems have limited computational power compared to Turing complete systems. A Turing-complete system or language can simulate any Turing machine. Examples of non-Turing complete systems include finite state machines and some domain-specific languages (like Clarity).

Non-Turing complete languages typically cannot express all possible algorithms. Specifically, some problems whose solutions require unbounded loops or recursion cannot be expressed using non-Turing complete languages. This last property is especially important in the context of Clarity, as it makes it so that features like unbounded loops and reentrancy are disallowed at a language level.

#### Decidable

A problem is decidable if there exists an algorithm that can always determine whether a given input has a particular property or not in a finite amount of time. In other words, a decidable problem can be solved by a Turing machine that is guaranteed to halt for all input instances. Decidability is a property of problems, whereas Turing completeness is a property of languages or computational systems.

The fact that Clarity is decidable means that developers (and tooling) can more easily reason about and predict with certainty the behavior of Clarity contracts, regardless of the input.

### Mindset of a Smart Contract Developer

Before we dive into specifics, let's first set the context and viewpoint we should hold as smart contract developers who want to write secure code.

As you explore further into the security properties of Solidity and Clarity, you'll see that there are always mitigation steps that _can_ be taken by developers to help address some of these security issues.

The main issue, with this line of thinking, is it increases the odds of human error in smart contract security. If we can preserve functionality while mitigating the chance of human error as much as possible, we should do so.

### Should smart contracts be Turing complete?

We will discover new applications for smart contracts. These applications will go beyond current smart contracts, traditional contracts, and may even open new economic opportunities. Given these possibilities, how should we build our smart contracts? What characteristics should our smart contract languages have?

It is good practice to separate data from programs. Should smart contracts be data, or programs, or something in between? If smart contracts are data, then should the programs that execute-them be Turing complete or perhaps less powerful? If smart contracts are programs, then what language should smart contracts be written in? What characteristics should this programming language have?

The Church-Turing thesis is the hypothesis that all formal notions of computation are captured by Turing machines or modern computers. A programming language is Turing complete if it captures all formal notions of computation. Many programming languages are Turing complete. For example, Python, C++, Rust, Java, Lisp, and Solidity are all Turing complete.

Consider a program and its input. In the worst case, determining this program’s output is impossible. Validating a program, on a particular input, is done by generating a proof-of-correctness.

Proofs-of-correctness are logical proofs that can be mechanically validated. Finding proofs-of-correctness for programs and their input is undecidable. Kurt G\”odel showed there are undecidability logical statements.

This indicates all programs in Turing complete languages cannot be validated in the worst case. Thus, Turing complete smart contract languages must allow contracts that cannot be validated.

Alonzo Church and Alan Turing showed there are problems that are uncomputable. Uncomputable problems cannot be solved by any Turing machine. Hence, assuming the Church-Turing thesis, these uncomputable problems cannot be solved by any computer.

We'll explore this idea further later in this section.

Turing complete languages are very expressive. In fact, assuming the Church-Turing thesis, Turing complete languages are as expressive as possible in some sense.

Is there a trade-off? What types of problems can occur with uncomputable problems and programs whose validity may be undecidable?

As smart contracts subsume parts of contract law, consider the large body of laws and regulations for tax law.

For instance, US tax law and regulations take up several million words. International tax law and regulations pushes these numbers much higher.

Are these laws and regulations programs or are they data? If tax law were to be written in a Turing complete language, then the law may codify uncomputable problems. It is an accountant’s nightmare for their advice to be undecidable.

Clarity is non-Turing complete, yet very expressive. This makes it so that Clarity is decidable and cannot encode uncomputable problems. There are discussions and papers on smart contract languages such as Solidity that propose subsets of Solidity that are non-Turing complete. These subsets are decidable and cannot encode uncomputable problems. However, there is no consensus on which subsets to work with and they are not widely used.

### Advantages of Decidability in Smart Contracts

Why is decidability important in the context of smart contracts?

First, it is not possible for a Clarity call to run out of gas in the middle of a call. Because of its decidability, it is possible to get a complete static analysis of the call graph to get an accurate picture of the cost before execution.

Solidity allows for unbounded loops, recursion, and dynamic function calls, which makes it difficult to accurately predict the execution cost or gas usage beforehand. As a result, Solidity contracts may run out of gas during execution if the gas limit is not set appropriately or if the contract encounters a scenario with unexpectedly high computational requirements.

One practical example is the issue of a specific kind of DoS attack in Solidity, where the contract is rendered inoperable because of unbounded execution constraints. An example of this is the GovernMental attack, where a mapping that needed to be deleted for a payout became so large that working with it exceeded the block gas limit.

There are a few different properties of Clarity's language design that prevents such DoS attacks.

The reason that the analysis system can accurately estimate the execution cost is because certain functionality is intentionally limited in Clarity.

For example, there is no recursion in Clarity, so we can't infinitely call into a function over and over.

Data types in Clarity are also restricted. Any data types that don't require a hard length limit are not iterable.

Maps and tuples, for example, do not require you to enter a maximum length when defining them, but you also can't iterate over them.

Lists, on the other hand, which are iterable, do require the developer to define an upper limit when defining them. This is a large part of what allows an accurate static analysis of Clarity contracts.

So how would we implement a mapping of an undefined size in Clarity? We wouldn't, because it's an anti-pattern in smart contract design.

Instead, Clarity forces us to think of a better solution to our problem. For example, implementing a way for users to handle mapping/list element operations themselves, instead of mass operations handled at the contract level.

If you [analyze the GovernMental attack](https://hackernoon.com/smart-contract-attacks-part-2-ponzi-games-gone-wrong-d5a8b1a98dd8#h-attack-2-call-stack-attack), you'll see that it took advantage of multiple security issues, all of which are mitigated in Clarity. You'll also see that a fix was added to make it economically infeasible to carry out this type of attack again.

This brings up another crucial point when setting appropriate mental models for smart contracts and blockchain systems: complexity means more potential bugs, which means adding more complexity to address those bugs.

When this happens over and over again, we are trapping ourselves into creating an evermore complex system. Addressing these issues at the language level prevents this ever-growing complexity.

For a deep dive into how Clarity was designed, check out [SIP-002](https://github.com/stacksgov/sips/blob/main/sips/sip-002/sip-002-smart-contract-language.md).

:::note You can view some more common smart contract vulnerabilities and how they are mitigated in [this article](https://stacks.org/bringing-clarity-to-8-dangerous-smart-contract-vulnerabilities/). :::

This has second-order effects as well when we look at security testing and auditing. One of the common tools for testing smart contracts is formal verification, where we mathematically prove that certain properties of smart contracts will or will not remain true in all cases.

This can lead to the path explosion problem, where there are so many paths available that formal verification becomes incredibly difficult. This problem is mitigated in Clarity, since there is not chance of a program encountering an unbounded loop.

This leads us to a more general mental model for thinking about decidability as smart contracts continue to become a larger part of our economy. Remember that the goal with blockchain systems is to create an open, transparent, fair financial system.

This means that smart contracts will be responsible for managing large amounts of wealth for ever-growing amounts of people. As smart contracts encompass more financial structures, their complexity and usage will grow.

Complexity is the enemy of security. The more complex a system is, the more danger there is in creating uncomputable problems when there are no hard restrictions on the execution steps that can be taken.

This is deadly in financial infrastructure that is not only open and transparent, but immutable. Let's explore this idea of uncomputability a bit more.

### Intuition on Uncomputability

Intuitively, uncomputability is an algorithmic view of undecidability. Uncomputability has the same foundations as undecidability. Undecidable questions are framed as logic statements or statements about integers. Of course, programs are logic statements and may even be viewed as integers, though we view programs differently. We often view programs with additional details of memory models, implementation details, and execution semantics.

The [Halting problem](https://en.wikipedia.org/wiki/Halting\_problem): As an example, given any program `P` and any finite input `I` for `P`, then the Halting Problem is the challenge of determining if `P` halts on input `I`.

Alonzo Church and Alan Turing showed the Halting Problem is unsolvable.

Christopher Strachey gave an intuitive proof-by-contradiction showing the Halting problem is uncomputable. This is set up by supposing there is a program `H` that can solve the Halting problem for any program `P`. `H(P)` returns true if `P` halts and false otherwise. Then build a program `P` that does not halt when `H(P)` is true, giving a contradiction. Similarly, this program `P` halts when `H(P)` is false, also a contradiction.

Uncomputable problems are problems that cannot be solved by an algorithm or a computer, no matter how much time or resources are provided. These problems exist in various forms, and one such example is the Post correspondence problem, which was proposed by Emil Post.

The Post correspondence problem can be described using pairs of strings and an integer. Imagine you have n pairs of strings, called P. These strings are made up of characters from a character set, such as UTF-8 or any other alphabet with at least two symbols. The pairs of strings look like this:

`P = { (x1, y1), (x2, y2), … , (xn, yn) }`

Now, you also have an integer `m` that is greater than 0. The Post correspondence problem asks whether there is a way to create a list of indices `(i1, i2, …, im)` using the given pairs of strings. You can repeat these indices if needed, with one condition: when you combine the `x` strings from the pairs using the indices, the resulting string must be equal to the combined `y` strings from the same pairs using the same indices. In other words:

`x(i1) x(i2) … x(im) = y(i1) y(i2) … y(im)`

When developers try to solve the Post correspondence problem, they often attempt to use indeterminate loops (loops without a fixed number of iterations) rather than recursion. This is because the problem seems to require searching through different combinations of indices until a solution is found or it's proven that no solution exists.

In simple terms, the Post correspondence problem involves trying to find a sequence of indices that, when applied to the given pairs of strings, produces equal concatenated strings from both the `x` and `y` components. This problem is considered uncomputable because there is no general algorithm that can solve it for all possible input pairs of strings and integers.

It turns out, many questions about how programs behave are uncomputable. This has a number of consequences for smart contracts that are built in Turing complete languages, many of which we are not aware of yet but will surely become aware of as we encounter them in the future.

### Raymond Smullyan’s Intuition on Undecidability

This is a part of Raymond Smullyan’s approach to understanding undecidability in propositional logic. It uses meta-information to show something must be true, though it cannot be proved in propositional logic. This is based on a paradox.

In propositional logic, a logical statement is undecidable if we cannot prove it true or false. Given a propositional logic statement S, a proof is a sequence of formal logical deductions, starting from basic facts and ending by indicating if S is true or false.

Smullyan’s starts with an island of Knights and Knaves. Knights always tell the truth. Knaves always lie. We cannot distinguish islanders otherwise.

There is a great logician named Ray. Whatever Ray proves is true. This is just like a good theorem prover.

An islander Jack proclaims: “You cannot prove I am a Knight” to the logician Ray.

The next reasoning is based on meta-knowledge of this situation. This meta-knowledge shows that some problems are undecidable in propositional logic.

If Ray can prove Jack is a Knight, then Jack must be a Knave, since Jack must have lied. That is because Ray proved Jack is a Knight. Since Jack is a Knave, Ray’s proof contradicts the assumption that Ray only proves true things. So, this case cannot hold.

If Ray cannot prove Jack is a Knight, then Jack must be a Knight, since Jack stated the truth. But Ray cannot prove the fact that Jack is a Knight.

In the context of smart contracts and programming languages, Turing complete languages like Solidity come with the possibility of undecidable problems.

These undecidable problems are similar to the paradox presented in the Knights and Knaves story, where it's impossible to determine whether Jack is a Knight or a Knave based on the given information.

In the Knights and Knaves story, Ray is analogous to a theorem prover or a smart contract in a Turing complete language. Ray is faced with a statement that is undecidable within the constraints of the system (Knights and Knaves), which leads to a paradox.

Similarly, a Turing complete smart contract language might face undecidable problems that can't be resolved, leading to unexpected behavior, vulnerabilities, or resource consumption issues (like running out of gas in Ethereum).

On the other hand, non-Turing complete languages like Clarity are designed to avoid undecidable problems by limiting their expressiveness.

In the context of the Knights and Knaves story, a non-Turing complete language would simply not allow Jack to make a statement that could lead to a paradox. By disallowing certain features like unbounded loops and recursion, non-Turing complete languages can provide stronger guarantees about the behavior and resource usage of smart contracts.

This predictability is desirable in many cases, especially when dealing with high-value transactions or critical systems.

### Reference

The Mathematics of Various Entertaining Subjects: Research in Recreational Math Illustrated Edition, Jennifer Beineke (Editor), Jason Rosenhouse (Editor), Raymond M. Smullyan (Foreword), Princeton University Press, 2016.
