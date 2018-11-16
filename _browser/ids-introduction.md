---
layout: usenew
permalink: /:collection/:path.html
---
# Get and use a Blockstack ID
{:.no_toc}

Through the Blockstack browser you can create an identity. Your identity is a
point of contact as you interact with others through Dapps. Others may be
individual users or companies or software. Unless you allow it, none of these
others have access to anything other than your identity label, for example
`moxiegirl.id.blockstack`. To learn more about you, others must ask and you can
choose to share -- or not.

This document explains one type of identity, the Blockstack ID. You learn how to
create them, as well as when and how to restore them. It contains the following sections:

* TOC
{:toc}


## Understand Blockstack IDs

Interacting within the decentralized internet requires that you have at least
one identity, though you can create several. Your identity is created through a
registrar.  Blockstack maintains a registrar for creating identities that you
can use to interact with distributed applications (Dapps).

To use the Blockstack Browser or to develop a Dapp you
require a Blockstack ID, for example `moxiegirl.id.blockstack`. A Blockstack ID
is a digital identity that is registered With Blockstack. Think of the ID as a
form of identification, like a drivers license, but this license identifies you
on the virtual internet highway.  


Your personal data storage is linked to this ID. You use this ID to
identify yourself to other users and to sign into applications. When you add a
picture to a Dapp, the picture appears in the Dapp but the picture's bits and bytes
are stored in your personal storage.


When you log into another application with your ID, that application can ask for access to that storage and then use that picture. The application must ask you, it knows you by your ID, and

 Decentralized applications that want to access your data need your
identity and your permission.

When you first sign up through the Blockstack browser, you create an initial
human-readable identity in the `id.blockstack` domain. This initial identity has
the format:

_`USERNAME`_`.id.blockstack`

The _`USERNAME`_ portion must be unique. You enter an email and password to
create the initial identity. Blockstack uses the password to:

 * seed a _recovery code_ an encrypted string, for example `36mWivFdy0YPH2z31EflpQz/Y0UMrOrJ++lH=0EI7c3mop2JuRBm5W1P0BwXxSTazJsUjOAmC55rFUWINqDqGccLio0iwzGclAhaHGZQ5M52`
 * seed a _recovery key_ which is a squence of words `applied binge crisp pictorial fiery dancing agreeable frogs light finish ping apple`

The email is provided to allow either Blockstack or a decentralized application
to communicate information to you. In Blockstacks' case, the email is used to
send you reovery information.

While Blockstack registers your human readable ID and the recovery key. _You_ must
record the:

* recovery key
* recovery code (in the order the words apepar)
* initial password

Blockstack does not store them, so it can't give them to you later if they are
lost.

Your initial ID is created in the `id.blockstack` domain. The initial identity
remains primary, and you need this primary ID and its associated information
(recovery code, recovery key, and password) to use the browser again.

Finally, the `id.blockstack` domain is sponsored by the Blockstack registrar and
identities on it are free. Once you are using the Blockstack Browser, you can
create additional identities outside of this domain and controlled by other
registrars. Coin is required to purchase identities on other domains.

## Create an initial Blockstack ID

{% include create_id.md %}

## Restore a Blockstack ID

When you return to the Blockstack Browser, the browser prompts you to create a
new Blockstack ID or restore an existing Blockstack ID. If you have a
Blockstack identity, you can open the browser by restoring the identity. To
restore an identity, there are two available methods.

Method 1: Supply the identity recovery code (`36mWivFdy0YPH2z31E...`) and the
password you provided when you _initially_ created your identity. Method 2:
Supply the recovery key which is a sequence of words (`applied binge ...`)

If you loose either the recovery code or the password you provided when you
_initially_ created your identity, you can no longer use method 1 to restore
your identity. If you lose the recovery key, you can no longer use method 2.
Once you no longer have access to either method, your identity is estranged and
not accessible by anyone.

### Restore with a recovery key

1. Open the [Blockstack web application in your browser](https://browser.blockstack.org/sign-up?redirect=%2F).
2. Choose **Restore a Blockstack ID**.

   The system displays a dialog where you can enter your recovery code or a
   recovery key.

3. Enter the recovery key.

   The recovery key is a squence of words.

   ![](images/recovery-code.png)

4. Press **Next**.

   The system prompts you for an email address. This email can be one you
   entered previously or an entirely new one. Blockstack doesn't store this
   address; it is used during your current Blockstack browser interaction to communicate
   important information with you.

5. Enter an email and press **Next**.

   The system prompts you for an password and its confirmation. This password
   can be one you entered previously or an entirely new one. Write this password
   down. You can use the password during your current Blockstack browser
   interaction  to reveal your keychain or change your password. Blockstack does
   not store this information past the session.

6. Enter a password and press **Next**.

   The system welcomes you back.

   ![](images/welcome-back.png)

   At this point, you can go onto work with Dapps or you can review your recovery key.

### Restore with a recovery code and original password

1. Open the [Blockstack web application in your browser](https://browser.blockstack.org/sign-up?redirect=%2F).
2. Choose **Restore a Blockstack ID**.

   The system displays a dialog where you can enter your recovery code or a
   recovery key.

3. Enter your recovery code.

  The recovery code is an encrypted string.

  ![](images/recovery-code.png)

4. Press **Next**.

   The system prompts you for an email address. This email can be one you
   entered previously or an entirely new one. Blockstack doesn't store this
   address; it is used during your current Blockstack browser interaction to
   communicate important information with you.

5. Enter an email and press **Next**.

   The system prompts you for an password. This must be the password entered
   when you first created your identity. If you have forgetten this passowrd,
   Blockstack cannot provide it to you. Instead, you must switch to using your
   recovery key rather than your code to restore your identity.

6. Enter your origin password and press **Next**.

  The system welcomes you back.

  ![](images/welcome-back.png)

  At this point, you can go work with Dapps or you can review your recovery key.
