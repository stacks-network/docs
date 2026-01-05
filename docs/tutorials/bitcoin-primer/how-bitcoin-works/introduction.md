# Introduction

The first basic building block of Bitcoin is the network of nodes that comprises it. Remember that the entire point of Bitcoin is that is a distributed network of computers. These computers are called nodes. A node is just a computer that is running the Bitcoin software and is also connected to other nodes doing the same.

Anybody can run a Bitcoin node and the requirements to do so are relatively low, this is a major part of the reason why Bitcoin can be so decentralized. As blockchain protocols add complexity and speed, the hardware requirements to run a node increase, making fewer people able to run a node.

But why are more nodes good, and what role do they play in Bitcoin?

Nodes are the backbone of Bitcoin and what makes it secure and decentralized. They do three main things:

1. Follow the rules of the protocol
2. Broadcast new transactions
3. Store confirmed transactions

The Bitcoin protocol has pre-defined rules that nodes are required to follow. If they receive a broadcasted transaction that does not follow these rules, they simply ignore it.

If the transaction is legit and follows the rules, they broadcast it to the rest of the network. This transaction gets sent around the network to other nodes, in what's called the mempool until is confirmed and written to a block.

A node's mempool is where it collects all of the new transactions it has received while it waits to package them up into a candidate block.

We'll get more into blocks next, but at a high level, they are a collection of different transactions.

Each node will then try to get its block added to the chain through the mining process.

Nodes can also broadcast confirmed transactions, which are transactions that have been verified as legitimate and accurate. These transactions are batched into blocks and broadcasted that way by nodes.

Note that any node can be a miner, but not all nodes have to mine. Some nodes are only responsible for relaying newly created blocks and storing the history of the chain, but they don't participate in the mining process, as this can be costly.

We'll get into the makeup of blocks and how nodes which transactions and blocks to include next.

Finally, nodes also keep a copy of all confirmed blocks of transactions, which is what is collectively called the blockchain. The fact that all nodes are required to maintain this history of transactions is what makes Bitcoin immutable.

There is a verifiable history of transactions that all nodes agree on, and no single node can change.

You don't have to be a node to utilize Bitcoin. Anybody that has an address can use Bitcoin and initiate new transactions. If you want to be able to independently verify all transactions and the history of the chain yourself, and contribute to Bitcoin's decentralization, you should run a node, but you don't have to if you want to use Bitcoin.

Addresses and the public key cryptography that generates them are separate topics, and we'll cover them later. For now, just know that a Bitcoin address corresponds to what can be thought of as a user account, and those user accounts can initiate transactions that get relayed to nodes.

Then the nodes conduct the process we went over above.
