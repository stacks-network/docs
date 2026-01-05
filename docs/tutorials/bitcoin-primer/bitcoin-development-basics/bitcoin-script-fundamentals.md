# Bitcoin Script Fundamentals

In the last lesson, we briefly covered Bitcoin's scripting language, Script. Now let's dive a little deeper into that and look at how we can actually use Script to write Bitcoin applications that do useful things.

We're going to start with a very simple Hello World script to learn the basics, then we'll look at how we can create some more complex scripts down below as we create the MVP of our app.

We'll be using an [online Bitcoin IDE](https://siminchen.github.io/bitcoinIDE/build/editor.html) in order to write and visualize our script.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1676575449444/230898b8-c0ac-4362-9650-b38fc072a5b2.png?auto=compress,format\&format=webp)

This visualization is extremely helpful for understanding how Bitcoin Script actually works. We have some code here by default: `1 2 OP_ADD`.

Take a second to try and guess what this code will do. Then use the 'Step' button to go through the operations step by step and see what happens.

What we've done here is added each number to the stack, and then applied the `OP_ADD` function to them. `OP_ADD` takes two inputs and adds them together. You can see all the available OPCODES and what they do in the [OPCODE reference](https://en.bitcoin.it/wiki/Script#Opcodes).

Now let's try adding another number here, running through the step function and seeing what happens. It might not be what you expect.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1676575954167/a96fe443-e718-4db7-881d-71fec13f07e6.png?auto=compress,format\&format=webp)

Why did we not get a single `0x6` back instead of this `0x5`? Because remember that we go data by data and apply these OPCODE functions. The `OP_ADD` function takes the top _two_ pieces of data, adds them, and then pushes the result back on to the stack.

So here we are adding 2 and 3 last, so `OP_ADD` will then take those, add them, and push them. If we want to add all of these numbers together we could add another `OP_ADD` function and see what that does.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1676576076195/94b52849-13f6-4328-a7bc-c5ca7b332976.png?auto=compress,format\&format=webp)

Now I want you to try and write a script that does the following:

1. Adds together two integers.
2. Checks to see if the value of those integers is greater than 7.

If it is, the execution will be successful, otherwise it won't be. Recall that a script is considered successful and valid if it returns 1 or greater. Look at the OPCODES and figure out what that means for this particular challenge.

You'll need to explore the OPCODE reference in order to complete this task.

Try to do this on your own before looking at the solution below 👇🏻

No cheating.

🔽

🔽

🔽

🔽

🔽

🔽

🔽

🔽

🔽

🔽

Ready for the solution?

`2 2 op_add 7 op_greaterthan`

Add this to the IDE and step through each step to figure out why this is the solution if you got something different.

We are first adding together 2 and 2, resulting in 4. Then the op\_greaterthan opcode checks to see if \`a\` is greater than \`b\`. In this case, 4 is not greater than 7, so the execution is unsuccessful. If you were to replace 2 and 2 with 4 and 5, or something else more than 7, it would work.

How does scripting work in the context of transactions? Remember that fundamentally, Bitcoin is built on UTXOs. The UTXO set consists of all of the unspent transaction outputs and represents the current state of the network as far as who can spend what bitcoins.

Scripting is how we actually create and enforce these spending conditions.

So if I have 1 bitcoin, that might mean that I have two UTXOs, each representing half a bitcoin. Scripting is what makes it impossible for anybody but me, with my private key, to spend that UTXO.

How does this work?

Each UTXO comes with a locking script that is a sort of cryptographic puzzle that needs to be solved before it can be used as a valid input to another transaction.

So if I want to use one of my UTXOs, I need to solve that puzzle. When I go to create a new transaction, I provide an unlocking script along with the UTXO that I want to use as input.

This unlocking script serves as the solution to the puzzle provided by the locking script.

Usually, these puzzles will utilize our public and private keys to verify that we are in fact the owners of these UTXOs, so that the only way to unlock the UTXO is to provide the correct combination of public and private key.

Depending on the block explorer, we can see the output scripts included in transactions. For example, take a look at [this transaction](https://mempool.space/tx/d084830f0b8cfadc340b0575fe4543979cd1900e8a3ade9a045b94070f848a49), scroll down and you can see the scripts that were included with these outputs:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1676583583094/ea088e1f-60a3-4e9b-9166-fee0c8a6c419.png?auto=compress,format\&format=webp)

This is the locking script or the script that the receiver of this output must be able to unlock in order to use this output.

So when we go to use this output by providing it as an input to another transaction, we then give an unlocking script in order to unlock it and actually be able to do that.

If we click this little arrow next to the input, we can go to the previous transaction containing the output used for this input.

Then we can see the locking script that was provided for this new input. The unlocking script provides the signature of the private key and the public key that are required to fulfill the requirements of the locking script.

Upon creating a new transaction, these two values are combined with the locking script via the stack and the result needs to be valid for this transaction to be considered valid.

Walkthrough of a P2PKH Script

In the above transaction example, you can see that the first output has a P2PKH script.

P2PKH stands for pay to public key hash, and it is the most common type of script in Bitcoin. This is the script that gets run when you make a basic transaction from one address to another.

That script consists of the following code:

`OP_DUP OP_HASH160 f1304d590d8f1a6b8cefd655c584616f8f68ea81 OP_EQUALVERIFY OP_CHECKSIG`

Let's walk through exactly what this script is doing when we initiate a transaction.

When we use our wallet to initiate a transaction, remember that what we are actually doing is creating a new input by utilizing one of our existing outputs, or UTXOs more specifically, as that new input. When we do that, we provide the transaction ID of the output we want to use.

The wallet will then go find the output that matches that transaction ID, look at the locking script, the `scriptPubKey` field, and see if the unlocking script we are providing with our new input satisfies the conditions required.

We do this by combining these two scripts together. In the Input Scripts section of the screenshot, we can see the P2PKH script consists of two large hexadecimal numbers.

These represent hashes of the signature of the sender's public key and their public key, respectively.

We will place the unlocking script in front of the locking script and run the code. If it evaluates to `true` then we are allowed to spend this as a valid input to a new transaction.

So using the transaction above, the whole thing would look like this:

`47304402203939a0a60876c330fd5165f4648cd431d8b379a6ac1a9022e31afa10ef30d827022035e07560ca6068669ce17d7acaac193 54a148ac453d2feb518b236aa8fc1cc2a012102dc109689e8655dc90d09544397d8b04989cd42b8037d15ba629b12d5ab77c068 OP_DUP OP_HASH160 f1304d590d8f1a6b8cefd655c584616f8f68ea81 OP_EQUALVERIFY OP_CHECKSIG`

Okay there's a lot here, but try and go through this step by step and figure out what exactly it is doing by using what we've already learned about stack-based languages and Bitcoin OPCODES.

You can refer to Learn Me a Bitcoin if you get stuck. But writing down how this script works step-by-step will be an excellent exercise to help you understand how scripting in Bitcoin works.

Then, go through all of the standard scripts on Learn Me a Bitcoin and familiarize yourself with how they work.
