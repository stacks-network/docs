# Script

[Script](https://learnmeabitcoin.com/technical/script/) is a stack-based mini programming language built-in to the Bitcoin protocol. It is primarily used for locking outputs and setting certain rules that must be met to unlock them.

A locking script is placed on every output and must be unlocked with an unlocking script before that output can be spent and used as an input for another transaction. All conditions on both scripts must be valid for the output to be unlocked and used.

Script is a very basic language and consists of two basic building blocks:

1. Data (signatures, public keys)
2. Opcodes (simple functions that operate on that same data, here's a [list of all opcodes](https://en.bitcoin.it/wiki/Script#Opcodes))

We'll go over the basics of how Script works here and we'll experiment with it and dive deeper in the next lesson.

Script is a bit funky, especially if you are used to more web-oriented programming languages like JavaScript, Solidity, PHP, etc. It's a stack-based programming language.

What does that mean?

A stack is just a low-level data structure or a way to store data.

You write a script and it is read from left to write, interacting with the data via a stack. You can think of the stack as an empty silo that data is pushed into.

So you have a piece of data on the left of a script, and then OPCODES can pull data out of the stack, do something with them, and push new data back onto the stack.

Stacks follow the LIFO principle, or last-in, first-out, to determine the order in which the pieces of data are operated on. You have to add to the top of the stack and you can only pull from the top of the stack.

A script follows this process until it reaches the end and is considered valid if the only value left in the stack is a 1 or greater.

<figure><img src="https://lwfiles.mycourse.app/635fe723662899c6bfb19e1d-public/bfaed54dc765fe9904fd17508f989f37.gif" alt=""><figcaption><p>Here is a good visualization from <a href="https://learnmeabitcoin.com/technical/script/">Learn Me A Bitcoin</a></p></figcaption></figure>

This is what's called a P2PKH script, and is the most common script used. This locking script is the one used any time you send bitcoins to someone.

I recommend [learning how it works](https://learnmeabitcoin.com/technical/script/p2pkh/) before moving on.

There are two primary pieces of functionality that we can use to work with stacks: push and pop. Push will add a piece of data to the top, and pop will pull a piece of data from the top and return it.

Then we can take this data and run it through an OPCODE function to turn it into something else, and then push it back onto the stack.

This is all a bit complex and is difficult to wrap your head around at first, but this basic lock/unlock process using scripts is how every output is sent and unlocked by the appropriate user. Don't worry too much about completely understanding this right now, we'll do some concrete practice with Script in the next section when we begin building our app.

We have these scripts instead of just basic public/private key verification so that we can create different types of locks that do different things. This is how Bitcoin offers programmability.

But part of the reason that we can't do nearly as much with Bitcoin as we can with Ethereum is that these scripts and OPCODES are very limited. And, as an additional limitation, there is a very small subset of OPCODE combinations called standard scripts that nodes relay.

5 standard scripts offer a few different pieces of functionality that nodes will relay. You can read more about these on Learn Me A Bitcoin, but the basic reason is safety and security.

Not all scripts have been tested, so it's a security risk to allow all these different combinations and open up attack vectors.

This limitation is part of what makes Bitcoin extremely secure, but it also makes it so that we can't build robust smart contracts on Bitcoin.

When people talk about smart contracts on Bitcoin, this Script language is what they are referring to, and it is extremely limited by design.

Let's look at two common use cases for modern smart contracts, DeFi and DAOs.

Let's say we want to build a DeFi application that allows us to lend our bitcoins in exchange for interest.

Right now, we can't do that without giving someone else custody of our bitcoins and letting them do it for us.

This introduces a trusted intermediary which defeats the entire purpose of having decentralized money. Ethereum users realize this and they have created a robust ecosystem of DeFi applications that allow users to earn on their assets.

How can we do this trustlessly with how limited Bitcoin's Script language is?

This is where Bitcoin layers like Stacks come in. Stacks allows us to build separate systems that hook into Bitcoin and expand its functionality.

We'll dive deeper into these limitations and how we can still build robust smart contracts with layers (Stacks specifically) in the second part of this course.
