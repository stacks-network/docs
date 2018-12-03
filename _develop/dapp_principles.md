---
layout: learn
permalink: /:collection/:path.html
---
# Principles of Blockstack applications
{:.no_toc}

There are as many perspectives on what makes a decentralized app (DApp) as there
are DApp developers. This section defines the principles that Blockstack
advocates for DApps operating within its platform.

* TOC
{:toc}


## Blockstack DApp principles

An application is considered a Blockstack DApp if it adheres to three
principles.

### I. Users own their data

DApps do not store or replicate user data. Users own their application
data independent of and *outside of* the application. A Blockstack application
is only considered decentralized if its users control where their data is
hosted and can prove that they created the data.

Blockstack applications meet this principle if they use the Gaia storage system.
Users may sign and/or encrypt their data in Gaia end-to-end. All files in Gaia
are addressed by a user identifier, an application's hostname, and a filename.
Through Gaia, users can prove data ownership and restrict access.

In the future, users will be able to choose on an app-by-app basis which Gaia
hub serves their application data.

### II. Users own their identities

Users are the sole administer of their own independent and unique
identifiers. Within an applications, users must be distinguishable by unique
identifiers. The DApp cannot mask or take away a user's identifier, and a user
must be able to bind their identifier to the data they create.

Blockstack DApps anticipate that each user can own one or more IDs. In turn,
these IDs are owned by a private key under the user's control. The IDs are
acquired through the Blockstack naming system. First time users that log into
the Blockstack application get a free `id.blockstack` in the Blockstack namespace.

Blockstack IDs are replicated to all peers via a blockchain, this means
Blockstack cannot hide IDs. Blockstack IDs each have a public key assigned to
them via the blockchain records that encode their operational history. This
public key allows users to bind data to their Blockstack IDs through
cryptographic signatures.

### III. Users have free choice of clients

Identities and _data_ are application independent. An application cannot be
considered a DApp unless it allows users to interact with their identities and
data such that the user can later do so via a different DApp.

For example, a user that creates data in client 'X' must be able access that
data from a different client, 'Y', provided the client allows compatible
mechanisms. Ultimately, the user has the freedom to write their own client that
interacts with their own data.

Blockstack's APIs and SDKs make it easy to build applications that adhere to
this principle. Existing Blockstack applications have this property today simply
because they don't have any irreplaceable server-side logic.

In the future, Blockstack applications must continue to meet the first two
principles but need not meet this one. For example, an application could
encrypt data in-transit between the application's client and the user's chosen
storage provider. Unless the app divulges the encryption key to the user, then
the user does not have free choice of clients; they can only use clients that
the app's servers choose to interact with.

## Non-Principles

You'll notice the Blockstack principles avoid adherence to a particular network
topology or architecture. Many DApps have defining characteristics that are
implementation-specific rather than expressions of overall DApp design goals.
These aspects are mentioned here as specific non-goals of Blockstack
applications.

### DApps have smart contracts

Decentralized apps pre-date blockchains and smart contracts, and even today
there are popular DApps that do not need them. Examples include pre-Microsoft
Skype (which was peer-topeer), Mastadon, IRC, and email.

Another word for "smart contract" is "replicated state machine."  Some DApps
need each peer to execute the same sequence of operations in order to fulfill
their business needs (in which case a smart contract would be appropriate),
but many do not.

Blockstack DApps do not use smart contracts at all.

### DApps have tokens and/or non-fungible assets

Similar to smart contracts, DApps pre-date tokens and non-fungible assets.
While having a crypto token or asset can help incentivize DApp deployment and
usage, they are not strictly necessary for their operation.

### DApps use a blockchain

Blockchains are a new tool for DApp developers to help coordinate peers, but
they are just that -- a tool. Sometimes blockchains are the right tool for the
job, and sometimes they are not.


## DApps serve users

Fundamentally, DApps should serve users by preserving user autonomy. Developers
should not profit from abusive features or neglectful designs.
Blockstack principles seek to prevent developers from profiting by either (a) building
abusive features into DApps like ad networks, or (b) neglecting users by failing
to build vital safety features like <a
href="https://en.wikipedia.org/wiki/Shadow_banning"
target="\_blank">shadowbans</a>.

Because Blockstack applications allow users to own their identity and data and
gives them free choice of clients, any user can simply stop or avoid using bad DApps
with near-zero switching cost.

This isn't to say that DApps can't be profitable. DApps can still make money for
their developers, such as by offering content subscriptions or paid-for add-ons.
They can broker with third parties on behalf of their users to watch ads or
share data in exchange for tokens.
