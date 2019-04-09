---
layout: learn
permalink: /:collection/:path.html
---
# Work with Storage

{:.no_toc}

The Blockstack Platform stores application data in the Gaia Storage System. Transactional metadata is stored on the Blockstack blockchain and user application data is stored in Gaia storage. Storing data off of the blockchain ensures that Blockstack applications can provide users with high performance and high availability for data reads and writes without introducing central trust parties.

* TOC
{:toc}


{% include note.html content="<ul> <li>Blockstack Gaia Storage APIs and on-disk format will change in upcoming pre-releases breaking backward compatibility. File encryption is currently opt-in on a file by file basis.</li> <li>Certain storage features such as and collections are not implemented in the current version. These features will be rolled out in future updates.</li> </ul>" %}


## Creating a file

You use the <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#putfile" target="_blank">UserSession.putFile</a>

```JavaScript
let options = {
  encrypt: false
}
 blockstack.putFile("/hello.txt", "hello world!", options)
 .then(() => {
    // /hello.txt exists now, and has the contents "hello world!".
 })
```

## Creating an encrypted file

You use the <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#putfile" target="_blank"></a>

```JavaScript
 let options = {
   encrypt: true
 }

 blockstack.putFile("/message.txt", "Secret hello!", options)
 .then(() => {
    // message.txt exists now, and has the contents "hello world!".
 })
```

## Reading a file

You use the <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#getfile" target="_blank"></a>

```JavaScript
 let options = {
   decrypt: false
 }
 
 blockstack.getFile("/hello.txt", options)
 .then((fileContents) => {
    // get the contents of the file /hello.txt
    assert(fileContents === "hello world!")
 });
```

## Reading an encrypted file

You use the <a href="" target="_blank"></a>

```JavaScript
 let options = {
   decrypt: true
 }

 blockstack.getFile("/message.txt", options)
 .then((fileContents) => {
    // get & decrypt the contents of the file /message.txt
    assert(fileContents === "Secret hello!")
 });
```

## Reading another user's unencrypted file
In order for files to be publicly readable, the app must request
the `publish_data` scope during authentication.

```JavaScript
 let options = {
   user: 'ryan.id', // the Blockstack ID of the user for which to lookup the file
   app: 'http://BlockstackApp.com' // origin of the app this file is stored for
 }

 blockstack.getFile("/message.txt", options)
 .then((fileContents) => {
    // get the contents of the file /message.txt
    assert(fileContents === "hello world!")
 });
```

## Delete a file

You use the <a href="https://blockstack.github.io/blockstack.js/classes/usersession.html#deletefile" target="_blank">UserSession.deleteFile</a>


```JavaScript
 blockstack.deleteFile("/hello.txt")
 .then(() => {
    // /hello.txt is now removed.
 })
```
