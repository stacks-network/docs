---
title: Storage hubs overview
---

## Introduction

The Gaia storage system allows you to store private application data off the blockchain and still access it securely
with Stacks applications. Where possible, applications should only store critical transactional metadata directly to
the Stacks blockchain, while keeping application and user data in the Gaia storage system. For more information about
the Gaia storage system, see the [Gaia protocol reference](/build-apps/references/gaia).

A [Gaia hub](/build-apps/references/gaia#user-control-or-how-is-gaia-decentralized) consists of a service and a storage
resource, generally hosted on the same cloud compute provider. The hub service requires an authentication token from a
storage requestor, and writes key-value pairs to the associated storage resource. Storage requestors can choose a Gaia
hub provider. This documentation provides an overview of how to set up and operate a Gaia hub.

## Creating a configuration file

You should store a JSON configuration file either in the top-level directory of the hub server. Alternatively, you can
specify a file location using the `CONFIG_PATH` environment variable. The following is an example configuration file for
Amazon S3:

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

You can specify the logging level, the backend driver, the credentials for that backend driver, and the `readURL` of the
hub. Typically, this is the URL for the compute resource on the cloud computing provider, where the hub service is
running.

### Requiring the correct hub URL

Enabling the `requireCorrectHubUrl` option in your `config.json` file, requires that authentication requests correctly
include the `hubURL` for the hub the request is trying to connect with. Use this option to prevent a malicious Gaia hub
from using an authentication token for itself on other Gaia hubs.

By default, the Gaia hub validates that the supplied URL matches `https://${config.servername}`, but if there are
multiple valid URLs for clients to reach the hub at, you can include a list in your `config.json`:

```json
{
  ...
  "servername": "normalserver.com",
  "validHubUrls": [ "https://specialserver.com/",
                  "https://legacyurl.info" ],
  ...
}
```

### Configuring read URLs

By default, hub drivers return read URLs that point directly at the written content. For example, an S3 driver would
return the URL directly to the S3 file. If you configure a CDN or domain to point at that same bucket, you can use the
`readURL` parameter to tell the hub to read files from a given URL. For example, the configuration of the
`hub.blockstack.org` Gaia Hub results in a read URL that looks like `https://gaia.blockstack.org/hub/`.

Unset the `readURL` parameter if you don't intend to deploy any caching.
