---
title: Guide to Stacks Storage
---

## Introduction

The Stacks Platform stores application data in the Gaia Storage System. Transactional metadata is stored on the
Stacks blockchain and user application data is stored in Gaia storage. Storing data off of the blockchain ensures
that Stacks applications can provide users with high performance and high availability for data reads and writes
without introducing central trust parties.

-> Stacks Gaia Storage APIs and on-disk format will change in upcoming pre-releases breaking backward compatibility. File encryption is currently opt-in on a file by file basis. Certain storage features such as collections are not implemented in the current version. These features will be rolled out in future updates.

## How data is stored

Gaia storage is a key-value store.

## Creating a file

Use the [UserSession.putFile](https://blockstack.github.io/stacks.js/classes/usersession.html#putfile) method:

```tsx
const userSession = new UserSession();
const options: PutFileOptions = {
  encrypt: false,
};
userSession.putFile('hello.txt', 'hello world!', options).then(() => {
  // hello.txt exists now, and has the contents "hello world!".
});
```

## Creating an encrypted file

Use the [UserSession.putFile](https://blockstack.github.io/stacks.js/classes/usersession.html#putfile) method and
pass `encrypt: true` within the options object. See the [`PutFileOptions` type definition here](https://blockstack.github.io/stacks.js/interfaces/putfileoptions.html#encrypt)

```tsx
const userSession = new UserSession();

const options: PutFileOptions = {
  encrypt: true,
};

userSession.putFile('message.txt', 'Secret hello!', options).then(() => {
  // message.txt exists now, and has the contents "hello world!".
});
```

## Reading a file

Use the [UserSession.getFile](https://blockstack.github.io/stacks.js/classes/usersession.html#getfile) method:

```tsx
const userSession = new UserSession();

const options: PutFileOptions = {
  decrypt: false,
};

userSession.getFile('hello.txt', options).then(fileContents => {
  // get the contents of the file hello.txt
  assert(fileContents === 'hello world!');
});
```

## Reading an encrypted file

Use the [UserSession.getFile](https://blockstack.github.io/stacks.js/classes/usersession.html#getfile) method and pass
`decrypt: true` within the options object. See the [`GetFileOptions` type definition here](https://blockstack.github.io/stacks.js/interfaces/getfileoptions.html#decrypt)

```tsx
const userSession = new UserSession();

const options: GetFileOptions = {
  decrypt: true,
};

userSession.getFile('message.txt', options).then(fileContents => {
  // get & decrypt the contents of the file /message.txt
  assert(fileContents === 'Secret hello!');
});
```

## Reading another user's unencrypted file

In order for files to be publicly readable, the app must request
the [`publish_data` scope](https://blockstack.github.io/stacks.js/enums/authscope.html#publish_data) during authentication.

```jsx
const options = {
  user: 'ryan.id', // the Blockstack ID of the user for which to lookup the file
  app: 'https://BlockstackApp.com', // origin of the app this file is stored for
};

const userSession = new UserSession();
userSession.putFile('hello.txt', 'hello world!', options).then(fileContents => {
  // get the contents of the file /message.txt
  assert(fileContents === 'hello world!');
});
```

## Delete a file

Use the [`UserSession.deleteFile`](https://blockstack.github.io/stacks.js/classes/usersession.html#deletefile) from the application's data store.

```jsx
const userSession = new UserSession();

userSession.deleteFile('hello.txt').then(() => {
  // hello.txt is now removed.
});
```

## Related Information

To learn more about the guarantees provided by Gaia, see [Storage write and read](/storage/write-to-read)
