
![Blockstack Architecture](/common/images/architecture.png)

Blockchains require consensus among large numbers of people, so they can be slow. Additionally, a blockchain is not designed to hold a lot of data. This means using a blockchain for every bit of data a user might write and store is expensive. For example, imagine if an application were storing every tweet in the chain.

Blockstack addresses blockchain performance problems using a layered approach. The base layer consists of the Stacks blockchain and the Blockstack Naming System (BNS). The blockchain governs ownership of identities  in the Blockstack network. Identities can be names such as domain names, usernames, or application names. 

When an identity is created, its creation is recorded in the Stacks blockchain. Identities make up the primary data stored into the Stacks blockchain. These identities correspond to routing data in the OSI stack. The routing data is stored in the Atlas Peer Network, the second layer. Every core node that joins the Blockstack Network is able to obtain an entire copy of this routing data. Blockstack uses the routing data to associate identities (domain names, user names, and application names) with a particular storage location in the final layer, the Gaia Storage System. 

A Gaia Storage System consists of  a _hub service_ and storage resource on a cloud software provider.  The storage provider can be any commercial provider such as Azure, DigitalOcean, Amazon EC2, and so forth. Typically the compute resource and the storage resource reside same cloud vendor, though this is not a requirement. Gaia currently has driver support for S3 and Azure Blob Storage, but the driver model allows for other backend support as well.

Gaia stores data as a simple key-value store. When an identity is created, a corresponding data store is associated with that identity on Gaia.  When a user logs into a dApp,
the authentication process gives the application the URL of a Gaia hub, which
then writes to storage on behalf of that user.

Within Blockstack, then, the Stacks blockchain stores only identity data. Data created by the actions of an identity is stored in a Gaia Storage System. Each user has profile data. When a user interacts with a decentralized dApp that application stores application data on behalf of the user. Because Gaia stores user and application data off the blockchain, a Blockstack DApp is typically more performant than DApps created on other blockchains.  
