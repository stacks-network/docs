---
description: 'Blockstack Network documentation'
---

# Wallet and identity security

It is important that you understand how to keep good security for your Stacks Wallet software and your Blockstack identity.

## Backup your seed phrase and Secret Recovery Code

Both your wallet seed phrase and your Secret Recovery Code are cryptographic keys. A seed phrase gives you access to your
Stacks Wallet software. A **Secret Recovery Code** gives you access to your Blockstack identity. You need to use the
strictest security available to you for both of these keys.

The CrtypoCurrency Security Standard publishes [guidelines for key storage](https://cryptoconsortium.github.io/CCSS/Details/#1.03).
These guidelines are presented from least (Level I) to most secure (Level III). We recommend you store your keys with at least
Level II security. This level states that you should:

- Back up each of your cryptographic keys.
- Store the backup in a location separate location from where you use a key. For example, if you use the key at the office,
  you can store the key are your office.
- Protect your backup from access by unauthorized parties. For example, a safe, safe deposit box, or lock box are good
  examples of protecting access to a backup.
- Employ some form of tamper mechanism that allows your to determine when if you key was accessed by someone else. For
  example, you could use a sealed paper envelopes with handwritten signatures over the seal as a tamper mechanism.

You are responsible for recalling and protecting your keys. Blockstack does not store your seed phrase or
**Secret Recovery Code**. If you lose your seed phrase, you lose the key to your STX tokens, which can be a very
costly mistake. If you lose your **Secret Recovery Code**, you lose the key to your identity and cannot access
your applications or the data you created with them.

## Security terminology

Use the following table to answer questions about keys/phrases/values you can share with others (_SHAREABLE_) and ones
you should _never_ share but instead keep in a secure place (**PROTECT**).

| Phrase/Key/Value                                         | Security    | Description                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secret Recovery Key                                      | **PROTECT** | Used to access an identity on the Blockstack blockchain. A 24-word sequence of words for example: <br /> `applied binge crisp pictorial fiery dancing agreeable frogs light finish ping apple` <br /> The early Blockstack recovery keys were 12-word sequences.                                                                                                                                                          |
| Identity <br /> Blockstack Identity <br /> Blockstack ID | _SHAREABLE_ | A way to identify a person or an organization on the Blockstack network. An identity is unique, both `meepers.id.blockstack` or `chad.id` are examples of IDs.                                                                                                                                                                                                                                                            |
| Magic Recovery Code                                      | **PROTECT** | A long encrypted string, for example:<br />`36mWivFdy0YPH2z31EflpQz/Y0UMrOrJ++UjOA...` <br /> Do not share the QR code that accompanied your recovery code either. This is a QR code:                                                                                                                                                                                                                                     |
| Blockstack Owner Address                                 | _SHAREABLE_ | Looks like a bitcoin address but starts with `ID`, for example: `ID-1J3PUxY5uDShUnHRrMyU6yKtoHEUPhKULs...`                                                                                                                                                                                                                                                                                                                |
| Bitcoin address <br /> BTC Address                       | _SHAREABLE_ | A string of letters and numbers: `3E53XjqK4Cxt71BGeP2VhpcotM8LZ853C8...` Sharing this address allows anyone to send Bitcoin to the address.                                                                                                                                                                                                                                                                               |
| Stacks address / STX address                             | _SHAREABLE_ | A string of letters and numbers: `3E53XjqK4Cxt71BGeP2VhpcotM8LZ853C8...` Sharing this address allows anyone to send Bitcoin to the address.                                                                                                                                                                                                                                                                               |
| Public Key                                               | _SHAREABLE_ | Public and private key pair comprise of two uniquely related cryptographic keys. It looks like a long random string of letters and numbers: <br /> `3048 0241 00C9 18FA CF8D EB2D EFD5 FD37 89B9 E069 EA97 FC20 …` <br /> The exact format of the public and private key depend on the software you use to create them.                                                                                                   |
| Private Key                                              | **PROTECT** | Private keys matches a corresponding public key. A public key also looks like a string of letters and numbers:                                                                                                                                                                                                                                                                                                            |
| Seed Phrase                                              | **PROTECT** | Used to access Stacks Wallet software. The seed phrase consists of 24 words in a sequence. Both the _word and its position_ in the sequence are important. <br /> Write down your seed phrase and store it in a secure location such as a safe deposit box. When you write the seed phrase down, include its position, for example: `1-frog, 2-horse, 3-building` and so on until you reach a final position: `24-ocean`. |
| Wallet Address                                           | _SHAREABLE_ | If you created a software-only wallet with the Stacks Wallet software, the wallet has a single STX address which is also sometimes called a Stacks (STX) address. You access a software wallet with a seed phrase.                                                                                                                                                                                                        |
