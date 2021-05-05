---
title: Gaia admin
description: 'Storing user data with Stacks'
---

## Introduction

A Gaia service can run a simple administrative service co-located with your Gaia hub. This service allows you to
administer the Gaia hub with the help of an API key. Gaia hubs installed using the Gaia Amazon Machine Image (AMI) have
this service integrated automatically.

In this section, you learn how to use the Gaia administrator service with your Gaia hub.

-> The examples in this section assume that you installed the Gaia service using the
[Deploy on Amazon EC2](/storage-hubs/amazon-ec2-deploy) tutorial.

## Understand the configuration files

The administrator service relies on two configuration files, the hub's configuration and the configuration of the
administrator service itself. You can find the hub's configration in `/tmp/hub-config/config.json` in the
`docker_admin_1` container. Your EC2 instance has the administrator service configuration in the
`/gaia/docker/admin-config/config.json` file.

The administrator service requires the following information:

- The location of the Gaia hub configuration file
- which API keys to use when authenticating administrative requests
- which commands to run to restart the Gaia hub on a config change

The following is the standard administrator service config installed with your EC2 instance.

```json
{
  "argsTransport": {
    "level": "debug",
    "handleExceptions": true,
    "timestamp": true,
    "stringify": true,
    "colorize": true,
    "json": true
  },
  "port": 8009,
  "apiKeys": ["hello"],
  "gaiaSettings": {
    "configPath": "/tmp/hub-config/config.json"
  },
  "reloadSettings": {
    "command": "/bin/sh",
    "argv": ["-c", "docker restart gaia_hub_1 &"],
    "env": {},
    "setuid": 1000,
    "setgid": 1000
  }
}
```

The `port` is the port where Gaia is running. The `apiKeys` field is key used for making calls to the hub. The
`gaiaSettings` field specifies the location of the Gaia hub configuration file.

The `argsTransport` section configures the hub logging. The service uses the `winston` logging service. Refer to their
documentation for full details on the [logging configuration options](https://github.com/winstonjs/winston).

| Field           | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| level           | Lowest level this transport logs (default: `info`)                       |
| handleException | Set to true to have this transport handle exceptions. (default: `false`) |
| timestamp       | The timestamp when of the message                                        |
| stringify       | Converts the output to a JSON string.                                    |
| colorize        | Colorizes the standard logging level                                     |
| json            | Log format.                                                              |

The `reloadSettings` configure the command that is used to reload your Gaia hub.

| Field   | Description                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------- |
| command | A command which reloads the Gaia hub service.                                                                       |
| argv    | An array containing the command arguments.                                                                          |
| env     | This is a key/value list of any environment variables that need to be set for the command to run. This is optional. |
| setuid  | This is the UID under which the command runs. This is optional.                                                     |
| setgid  | This is the GID under which the command runs. This is optional.                                                     |

-> Review the [JSON config schema](#optional-understand-the-configuration-file-schema) for a list of all
available parameters and possible values.

## Using the administrator service APIs

You use the administrator service APIs to manage the hub. Administrating a hub requires that you make calls from a
terminal on your hub service server. To execute administrator functions on a Gaia hub created with AWS, you `ssh` into
your instance as follows:

```bash
ssh -i <your keyfile.pem> admin@<public_ip_address>
```

You must also set the `API_KEY` in your environment:

```bash
export API_KEY="<API_KEY>"
```

You may find it useful to install a JSON processor such as `jq` to process the
output of the administrator commands.

### Restart the Gaia Hub (`POST /v1/admin/reload`)

The administrator service can make changes to the Gaia hub's config file, but the changes only take effect when the Gaia
hub reboots. You can do this as follows:

```bash
export API_KEY="hello"
curl -H "Authorization: bearer $API_KEY" -X POST http://localhost:8009/v1/admin/reload
```

```json
{ "result": "OK" }
```

When you `POST` to this endpoint, the administrator service runs the command described in the `reloadSettings` section
of the config file. It attempts to spawn a subprocess from the given `reloadSettings.command` binary, and pass it the
arguments given in `reloadSettings.argv`. Note that the subprocess doesn't run in a user-accesssible shell.

#### Errors

If you don't supply a valid API key, this method fails with HTTP 403.

This endpoint returns HTTP 500 if the reload command fails. If this happens, the return value contains the command's
exit code and the signal that killed.

### Get the hub configuration (`GET /v1/admin/config`)

This endpoint can to read and write a Gaia hub's non-driver-related settings. These include the port it listens on, and
its proof-checking
settings.

To read the Gaia hub settings, you would run the following:

```bash
export API_KEY="hello"
curl -H "Authorization: bearer $API_KEY" http://localhost:8009/v1/admin/config
```

```json
{ "config": { "port": 4000, "proofsConfig": { "proofsRequired": 0 } } }
```

### Set the hub configuration (`POST /v1/admin/config`)

To set Gaia hub settings, `POST` the changed JSON fields to this endpoint.

```bash
export API_KEY="hello"
curl -H "Authorization: bearer $API_KEY" -H 'Content-Type: application/json' -X POST --data-raw '{"port": 3001}' http://localhost:8009/v1/admin/config
```

```json
{ "message": "Config updated -- you should reload your Gaia hub now." }
```

If the settings were successfully applied, the method returns a message to reload your Gaia hub. You can set multiple
drivers' settings with a single call. For example, you can set:

- The driver to use (`driver`)
- The Gaia's read URL endpoint (`readURL`)
- The number of items to return when listing files (`pageSize`)
- The driver-specific settings

The data accepted on `POST` must contain a valid Hub configuration, for example:

```
const GAIA_CONFIG_SCHEMA = {
  type: "object",
  properties: {
    validHubUrls: {
      type: "array",
      items: { type: "string", pattern: "^http://.+|https://.+$" },
    },
    requireCorrectHubUrl: { type: "boolean" },
    serverName: { type: "string", pattern: ".+" },
    port: { type: "integer", minimum: 1024, maximum: 65534 },
    proofsConfig: { type: "integer", minimum: 0 },
    whitelist: {
      type: "array",
      items: {
        type: "string",
        pattern: "^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$"
      }
    },
    driver: { type: "string", pattern: ".+" },
    readURL: { type: "string", pattern: "^http://.+$|https://.+$" },
    pageSize: { type: "integer", minimum: 1 },
    bucket: { type: "string", pattern: ".+" },
    cacheControl: { type: "string", pattern: ".+" },
    azCredentials: {
      accountName: { type: "string", pattern: ".+" },
      accountKey: { type: "string", pattern: ".+" },
    },
    diskSettings: {
      storageRootDirectory: { type: "string" }
    },
    gcCredentials: {
      email: { type: "string" },
      projectId: { type: "string" },
      keyFilename: { type: "string" },
      credentials: {
        type: "object",
        properties: {
          client_email: { type: "string" },
          private_key: { type: "string" }
        }
      },
    },
    awsCredentials: {
      assessKeyId: { type: "string" },
      secretAccessKey: { type: "string" },
      sessionToken: { type: "string" }
    }
  }
}
```

When performing a `GET` within a `config` object the return value contains the same fields.

#### Errors

If you don't supply a valid API key, both the `GET` and `POST` method fail with HTTP 403.

In general, you should only set the relevent Gaia hub config fields. If you `POST` invalid settings values, you get an
HTTP 400 error.

## Example: Read and write driver settings

Use the `/v1/admin/config` endpoint to read and write storage driver settings. To get the current driver settings, run
the following commands in a terminal:

```bash
export API_KEY="hello"
curl -H "Authorization: bearer $API_KEY" http://localhost:8009/v1/admin/config
```

```json
{
  "config": {
    "driver": "disk",
    "readURL": "http://localhost:4001/",
    "pageSize": 20,
    "diskSettings": { "storageRootDirectory": "/tmp/gaia-disk" }
  }
}
```

To update the driver settings, run the following commands in a terminal:

```bash
export API_KEY="hello"
export AWS_ACCESS_KEY="<hidden>"
export AWS_SECRET_KEY="<hidden>"
curl -H "Authorization: bearer $API_KEY" -H 'Content-Type: application/json' -X POST --data-raw "{\"driver\": \"aws\", \"awsCredentials\": {\"accessKeyId\": \"$AWS_ACCESS_KEY\", \"secretAccessKey\": \"$AWS_SECRET_KEY\"}}" http://localhost:8009/v1/admin/config
```

```json
{ "message": "Config updated -- you should reload your Gaia hub now." }
```

## Example: Read and write the whitelist

This endpoint lets you read and write the `whitelist` section of a Gaia hub, to control who can write to it and list its files.

To get the current whitelist, run the following commands in a terminal:

```bash
export API_KEY="hello"
curl -H "Authorization: bearer $API_KEY" http://localhost:8009/v1/admin/config
```

```json
{ "config": { "whitelist": ["15hUKXg1URbQsmaEHKFV2vP9kCeCsT8gUu"] } }
```

To set the whitelist, you must set the _entire_ whitelist. To set the list, run the following command in a terminal:

```bash
export API_KEY="hello"
curl -H "Authorization: bearer $API_KEY" -H 'Content-Type: application/json' -X POST --data-raw '{"whitelist": ["1KDcaHsYJqD7pwHtpDn6sujCVQCY2e1ktw", "15hUKXg1URbQsmaEHKFV2vP9kCeCsT8gUu"]}' http://localhost:8009/v1/admin/config
```

```json
{ "message": "Config updated -- you should reload your Gaia hub now." }
```

## View logs for the hub or administrator service

The Docker container for each Gaia service contain the logs for that service. To view the log for a particular service,
use the `docker logs` command. For example, to get the logs for the hub:

```bash
docker logs docker_hub_1
```

```bash
> gaia-hub@2.3.4 start /src/hub
> npm run build && node lib/index.js


> gaia-hub@2.3.4 build /src/hub
> npm run lint && babel src -d lib && chmod +x lib/index.js


> gaia-hub@2.3.4 lint /src/hub
> eslint src

Successfully compiled 13 files with Babel.
{"level":"warn","message":"Listening on port 3000 in development mode","timestamp":"2019-02-14T04:00:06.071Z"}
```

## Optional: Understand the configuration file schema

The following JSON schema details the possible parameters for a hub configuration:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "additionalProperties": false,
  "properties": {
    "argsTransport": {
      "additionalProperties": false,
      "properties": {
        "colorize": {
          "default": true,
          "type": "boolean"
        },
        "handleExceptions": {
          "default": true,
          "type": "boolean"
        },
        "json": {
          "default": false,
          "type": "boolean"
        },
        "level": {
          "default": "warn",
          "enum": ["debug", "error", "info", "verbose", "warn"],
          "type": "string"
        },
        "timestamp": {
          "default": true,
          "type": "boolean"
        }
      },
      "type": "object"
    },
    "authTimestampCacheSize": {
      "default": 50000,
      "type": "integer"
    },
    "awsCredentials": {
      "additionalProperties": false,
      "description": "Required if `driver` is `aws`",
      "properties": {
        "accessKeyId": {
          "type": "string"
        },
        "endpoint": {
          "type": "string"
        },
        "secretAccessKey": {
          "type": "string"
        },
        "sessionToken": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "azCredentials": {
      "additionalProperties": false,
      "description": "Required if `driver` is `azure`",
      "properties": {
        "accountKey": {
          "type": "string"
        },
        "accountName": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "bucket": {
      "default": "hub",
      "type": "string"
    },
    "cacheControl": {
      "default": "public, max-age=1",
      "type": "string"
    },
    "diskSettings": {
      "additionalProperties": false,
      "description": "Required if `driver` is `disk`",
      "properties": {
        "storageRootDirectory": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "driver": {
      "enum": ["aws", "azure", "disk", "google-cloud"],
      "type": "string"
    },
    "gcCredentials": {
      "additionalProperties": false,
      "description": "Required if `driver` is `google-cloud`",
      "properties": {
        "credentials": {
          "additionalProperties": false,
          "properties": {
            "client_email": {
              "type": "string"
            },
            "private_key": {
              "type": "string"
            }
          },
          "type": "object"
        },
        "email": {
          "type": "string"
        },
        "keyFilename": {
          "type": "string"
        },
        "projectId": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "maxFileUploadSize": {
      "default": 20,
      "description": "The maximum allowed POST body size in megabytes. \nThe content-size header is checked, and the POST body stream \nis monitoring while streaming from the client. \n[Recommended] Minimum 100KB (or approximately 0.1 MB)",
      "minimum": 0.1,
      "type": "number"
    },
    "pageSize": {
      "default": 100,
      "maximum": 4096,
      "minimum": 1,
      "type": "integer"
    },
    "port": {
      "default": 3000,
      "maximum": 65535,
      "minimum": 0,
      "type": "integer"
    },
    "proofsConfig": {
      "additionalProperties": false,
      "properties": {
        "proofsRequired": {
          "default": 0,
          "type": "integer"
        }
      },
      "type": "object"
    },
    "readURL": {
      "type": "string"
    },
    "requireCorrectHubUrl": {
      "default": false,
      "type": "boolean"
    },
    "serverName": {
      "default": "gaia-0",
      "description": "Domain name used for auth/signing challenges. \nIf `requireCorrectHubUrl` is true then this must match the hub url in an auth payload.",
      "type": "string"
    },
    "validHubUrls": {
      "description": "If `requireCorrectHubUrl` is true then the hub specified in an auth payload can also be\ncontained within in array.",
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "whitelist": {
      "description": "List of ID addresses allowed to use this hub. Specifying this makes the hub private \nand only accessible to the specified addresses. Leaving this unspecified makes the hub \npublicly usable by any ID.",
      "items": {
        "type": "string"
      },
      "type": "array"
    }
  },
  "required": ["driver", "port"],
  "type": "object"
}
```

-> A full list of examples are in [the Gaia repository on GitHub](https://github.com/blockstack/gaia/tree/master/hub)
