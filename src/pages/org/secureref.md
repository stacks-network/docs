---
description: 'Blockstack Network documentation'
---

# Wallet and identity security

It is important that you understand how to keep good security for your Stacks Wallet software and your Blockstack identity.

## Backup your seed phrase and Secret Recovery Code

Both your wallet seed phrase and your Secret Recovery Code are cryptographic keys. A seed phrase gives you access to your Stacks Wallet software. A **Secret Recovery Code** gives you access to your Blockstack identity. You need to use the strictest security available to you for both of these keys.

The CrtypoCurrency Security Standard publishes <a href="https://cryptoconsortium.github.io/CCSS/Details/#1.03" target="_blank">guidelines for key storage</a>. These guidelines are presented from least (Level I) to most secure (Level III). We recommend you store your keys with at least Level II security. This level states that you should:

- Back up each of your cryptographic keys.
- Store the backup in a location separate location from where you use a key. For example, if you use the key at the office, you can store the key are your office.
- Protect your backup from access by unauthorized parties. For example, a safe, safe deposit box, or lock box are good examples of protecting access to a backup.
- Employ some form of tamper mechanism that allows your to determine when if you key was accessed by someone else. For example, you could use a sealed paper envelopes with handwritten signatures over the seal as a tamper mechanism.

You are responsible for recalling and protecting your keys. Blockstack does not store your seed phrase or **Secret Recovery Code**. If you lose your seed phrase, you lose the key to your STX tokens, which can be a very costly mistake. If you lose your **Secret Recovery Code**, you lose the key to your identity and cannot access your applications or the data you created with them.

## Security terminology

@include "keyphrase.md"
