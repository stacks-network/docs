---
layout: storage
description: "Storing user data with Blockstack"
permalink: /:collection/:path.html
---
# Understand hub operation
{:.no_toc}

This page describes the considerations hub operators must take into account when creating and operating a Gaia storage hub.

* TOC
{:toc}


## Configuration files

You should store a JSON configuration file either in the top-level directory of
the hub server. Alternatively, you can specify a file location using the
`CONFIG_PATH` environment variable.  The following is an example configuration file for Amazon S3:

```json
{
  "servername": "localhost",
  "port": 4000,
  "driver": "aws",
  "readURL": "https://YOUR_BUCKET_NAME.s3.amazonaws.com/",
  "pageSize": 20,
  "bucket": "YOUR_BUCKET_NAME",
  "awsCredentials": {
     "accessKeyID": "YOUR_ACCESS_KEY",
     "secretAccessKey": "YOUR_SECRET_KEY"
  },
  "argsTransport": {
    "level": "debug",
    "handleExceptions": true,
    "stringify": true,
    "timestamp": true,
    "colorize": false,
    "json": true
  }
}
```

You can specify the logging level, the backend driver, the credentials
for that backend driver, and the `readURL` of the hub. Typically, this is the URL for the compute resource on the cloud computing provider &mdash; where the hub service is running.

### Require the correct hub URL

If you enable on the `requireCorrectHubUrl` option in your `config.json`
file, your Gaia hub will require that authentication requests
correctly include the `hubURL` they are trying to connect with. Use this option to prevent a malicious Gaia hub from using an authentication
token for itself on other Gaia hubs.

By default, the Gaia hub will validate that the supplied URL matches
`https://${config.servername}`, but if there are multiple valid URLs
for clients to reach the hub at, you can include a list in your `config.json`:

```javascript
{
  ....
  servername: "normalserver.com"
  validHubUrls: [ "https://specialserver.com/",
                  "https://legacyurl.info" ]
  ....
}
```

### The readURL parameter

By default, hub drivers return read URLs that point directly at the written content. For example, an S3 driver would return the URL directly to the S3 file. If you configure a CDN or domain to point at that same bucket, you can use the `readURL` parameter to tell the hub that files can be read from a given URL. For example, the `hub.blockstack.org` Gaia Hub is configured to return a read URL that looks like `https://gaia.blockstack.org/hub/`.

Unset the `readURL` parameter if you do not intend to deploy any caching.

### The proofsRequired parameter (Deprecated)

Past users could configure this setting as a crude spam-control mechanism.
However, for the smoothest operation of your Gaia hub, set the
`proofsConfig.proofsRequired` value to `0`.


## Open or private hubs

You can configure an open-membership storage hub or a private storage hub. An open-membership hub, as it sounds, allows any user to use the hub service. A private hub limits the use of the service. In this section, you learn about configuring each type.

### Open-membership hub

An open-membership storage hub permits writes for _any_ address top-level
directory. Every request is validated such that write requests must provide
valid authentication tokens for that address. Operating in this mode is
recommended for service and identity providers who wish to support many
different users.

### Private-user hub

A private-user hub receives requests for a single user. Requests are controlled
via _whitelisting_ the addresses allowed to write files. Recall that each application uses a different app- and user-specific address. It follows, to
support application storage, your configuration must add to the whitelist each application you wish to use.

Alternatively, the user's client can use the authentication scheme and generate
an association token for each app.  The user should whitelist her address, and
use her associated private key to sign each app's association token.  This
removes the need to whitelist each application, but with the caveat that the
user needs to take care that her association tokens do not get misused.
