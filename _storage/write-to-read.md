---
layout: storage
description: "Storing user data with Blockstack"
permalink: /:collection/:path.html
---
# Storage write and read

Once a user authenticates and a DApp obtains authentication, the application interacts with Gaia through the blockstack.js library. There are two simple methods for working with data in Gaia hub: the `putFile()` and `getFile()` methods. This section goes into greater detail about the methods, how they interact with a hub, and how to use them.


## Write-to and Read-from URL Guarantees

Gaia is built on a driver model that supports many storage services. So, with
very few lines of code, you can interact with providers on Amazon S3, Dropbox,
and so forth.  The simple `getFile()` and `putFile()` interfaces are kept simple
because Blockstack assumes and wants to encourage a community of
open-source-data-management libraries.

The performance and simplicity-oriented guarantee of the Gaia specification is
that when an application submits a write-to
`https://myhub.service.org/store/foo/bar` URL, the application is guaranteed to
be able to read from the `https://myreads.com/foo/bar` URL. Note that, while the
prefix in the write-to url (for example,`myhub.service.org/store`) and the read-from URL
(`https://myreads.com`) are different, the `foo/bar` suffixes are the same.

By default, `putFile()` encrypts information while `getFile()` decrypts it by default. Data stored in an encrypted format means only the user that stored it can view it. For applications that want other users to view data, the application should set the  `encrypt` option to `false`. And, corresponding, the `decrypt` option on `getFile()` should also be `false`.

Consistent, identical suffixes allow an application to know _exactly_ where a
written file can be read from, given the read prefix. The Gaia service defines a `hub_info` endpoint to obtain that read prefix:

```
GET /hub_info/
```

The endpoint returns a JSON object with a `read_url_prefix`, for example, if my service returns:

```javascript
{ ...,
  "read_url_prefix": "https://myservice.org/read/"
}
```

The data be read with this `getFile()` and this address:

```
https://myservice.org/read/1DHvWDj834zPAkwMhpXdYbCYh4PomwQfzz/0/profile.json
```

The application is guaranteed that the profile is written with `putFile()` this request address:

```
https://myservice.org/store/1DHvWDj834zPAkwMhpXdYbCYh4PomwQfzz/0/profile.json
```

When you use the `putFile()` method it takes the user data and POSTs it to the user's Gaia storage hub. The data POSTs directly to the hub, the blockchain is not used and no data is stored there. The limit on file upload is currently 25mb.


## Address-based access-control

Access control in a Gaia storage hub is performed on a per-address basis.
Writes to URLs `/store/<address>/<file>` are allowed only if the writer can
demonstrate that they control _that_ address. This is achieved via the
authentication token which is a message _signed_ by the private key associated
with that address. The message itself is a challenge text, returned via the
`/hub_info/` endpoint.
