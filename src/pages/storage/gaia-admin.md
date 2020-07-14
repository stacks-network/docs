---
description: 'Storing user data with Blockstack'
---

# Use the admin service

A Gaia service can run a simple administrative service co-located with your Gaia hub. This service allows you to administer the Gaia hub with the help of an API key. Gaia hubs installed using the Gaia Amazon Machine Image (AMI) have this service integrated automatically.

In this section, you learn how to use the Gaia admin service with your Gaia hub.

{% include note.html content="
The examples in this section assume that Gaia and the admin service
were installed through the Configure a hub on Amazon EC2." %}

## Understand the configuration files

The admin service relies on two configuration files, the hub's configuration and the configuration of the admin service itself. The hub's configuration is mounted `/tmp/hub-config/config.json` in the `docker_admin_1` container. Your EC2 instance has the admin service configuration in the `/gaia/docker/admin-config/config.json` file.

The admin service needs to know the following:

- where the Gaia hub config file is located
- which API key(s) to use when authenticating administrative requests
- which command(s) to run to restart the Gaia hub on a config change

The following is the standard admin service config installed with your EC2 instance.

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
    "argv": ["-c", "docker restart docker_hub_1 &"],
    "env": {},
    "setuid": 1000,
    "setgid": 1000
  }
}
```

The `port` is the port where Gaia is running. The `apiKeys` field is key used for making calls to the hub. The `gaiaSettings`

The `argsTransport` section configures the hub logging. The service uses the `winston` logging service. Refer to their documentation for full details on the [logging configuration options](https://github.com/winstonjs/winston).

<table class="uk-table uk-table-small uk-table-divider">
   <thead>
      <tr>
         <th>Field</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>level</code></td>
         <td>Lowest level this transport will log. (default: <code>info</code>)</td>
      </tr>
      <tr>
         <td><code>handleException</code></td>
         <td>Set to true to have this transport handle exceptions. (default: <code>false</code>)</td>
      </tr>
      <tr>
         <td><code>timestamp</code></td>
         <td>The timestamp when the message was received.</td>
      </tr>
      <tr>
         <td><code>stringify</code></td>
         <td>Converts the output to a JSON string.</td>
      </tr>
      <tr>
         <td><code>colorize</code></td>
         <td>Colorizes the standard logging level</td>
      </tr>
      <tr>
         <td><code>json</code></td>
         <td>Log format.</td>
      </tr>
   </tbody>
</table>

The `reloadSettings` configure the command that is used to reload your Gaia hub.

<table class="uk-table uk-table-small uk-table-divider">
   <thead>
      <tr>
         <th>Field</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>command</code></td>
         <td>A command which reloads the Gaia hub service.</td>
      </tr>
      <tr>
         <td><code>argv</code></td>
         <td>An array containing the command arguments.</td>
      </tr>
      <tr>
         <td><code>env</code></td>
         <td>This is a key/value list of any environment variables
           that need to be set for the command to run. This is optional.</td>
      </tr>
      <tr>
         <td><code>setuid</code></td>
         <td>This is the UID under which the command will be run. This is optional.</td>
      </tr>
      <tr>
         <td><code>setgid</code></td>
         <td>This is the GID under which the command will run. This is optional.</td>
      </tr>
   </tbody>
</table>

## Using the admin service APIs

You use the admin service APIs to manage the hub. Administrating a hub requires
that you make calls from a terminal on your hub service server. To execute admin
functions on a Gaia hub created with AWS, you `ssh` into your instance as follows:

```bash
ssh -t -i <your keyfile.pem> -A core@<public ip address>
```

You must also set the `API_KEY` in your environment:

```bash
export API_KEY="hello"
```

You may find it useful to install a JSON processor such as `jq` to process the
output of the admin commands.

### Restart the Gaia Hub (`POST /v1/admin/reload`)

The admin service will make changes to the Gaia hub's config file, but the
changes will only take effect when the Gaia hub is reloaded. You can do this
as follows:

```bash
$ export API_KEY="hello"
$ curl -H "Authorization: bearer $API_KEY" -X POST http://localhost:8009/v1/admin/reload
{"result":"OK"}
```

When you `POST` to this endpoint, the admin service runs the command described
in the `reloadSettings` section of the config file. It attempts to spawn a
subprocess from the given `reloadSettings.command` binary, and pass it the
arguments given in `reloadSettings.argv`. Note that the subprocess will _NOT_
be run in a shell.

#### Errors

If you do not supply a valid API key, this method fails with HTTP 403.

This endpoint returns HTTP 500 if the reload command fails. If this
happens, you will get back the command's exit code and possibly the signal that
killed it.

### Get the hub configuration (`GET /v1/admin/config`)

This endpoint is used to read and write a Gaia hub's non-driver-related
settings. These include the port it listens on, and its proof-checking
settings.

To read the Gaia hub settings, you would run the following:

```bash
$ export API_KEY="hello"
$ curl -H "Authorization: bearer $API_KEY" http://localhost:8009/v1/admin/config {"config":{"port":4000,"proofsConfig":{"proofsRequired":0}}}
```

### Set the hub configuration (`POST /v1/admin/config`)

To set Gaia hub settings, you simply `POST` the changed JSON fields to this
endpoint.

```bash
$ export API_KEY="hello"
$ curl -H "Authorization: bearer $API_KEY" -H 'Content-Type: application/json' -X POST --data-raw '{"port": 3001}' http://localhost:8009/v1/admin/config
{"message":"Config updated -- you should reload your Gaia hub now."}
```

If the settings were successfully applied, the method returns a message to reload your Gaia hub. You can set multiple drivers' settings with a single call. For example, you can set:

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

The same fields are returned on `GET` within a `config` object.

#### Errors

If you do not supply a valid API key, both the `GET` and `POST` method fail with HTTP 403.

Only relevant Gaia hub config fields are set. If you `POST` invalid settings
values, you get an HTTP 400 error.

## Example: Read and write driver settings

Use the `/v1/admin/config` endpoint to read and write storage driver settings. To get the current driver settings, you would run:

```bash
$ export API_KEY="hello"
$ curl -H "Authorization: bearer $API_KEY" http://localhost:8009/v1/admin/config
{"config":{"driver":"disk","readURL":"http://localhost:4001/","pageSize":20,"diskSettings":{"storageRootDirectory":"/tmp/gaia-disk"}}}
```

To update the driver settings, you would run:

```bash
$ export API_KEY="hello"
$ export AWS_ACCESS_KEY="<hidden>"
$ export AWS_SECRET_KEY="<hidden>"
$ curl -H "Authorization: bearer $API_KEY" -H 'Content-Type: application/json' -X POST --data-raw "{\"driver\": \"aws\", \"awsCredentials\": {\"accessKeyId\": \"$AWS_ACCESS_KEY\", \"secretAccessKey\": \"$AWS_SECRET_KEY\"}}" http://localhost:8009/v1/admin/config
{"message":"Config updated -- you should reload your Gaia hub now."}
```

## Example: Read and write the whitelist

This endpoint lets you read and write the `whitelist` section of a Gaia hub, to control who can write to it and list its files.

To get the current whitelist, you would run the following:

```bash
$ export API_KEY="hello"
$ curl -H "Authorization: bearer $API_KEY" http://localhost:8009/v1/admin/config
{"config":{"whitelist":["15hUKXg1URbQsmaEHKFV2vP9kCeCsT8gUu"]}}
```

To set the whitelist, you must set the _entire_ whitelist. To set the list, pass a command such as the following:

{% raw %}

```bash
$ export API_KEY="hello"
$ curl -H "Authorization: bearer $API_KEY" -H 'Content-Type: application/json' -X POST --data-raw '{"whitelist": ["1KDcaHsYJqD7pwHtpDn6sujCVQCY2e1ktw", "15hUKXg1URbQsmaEHKFV2vP9kCeCsT8gUu"]}' http://localhost:8009/v1/admin/config
{"message":"Config updated -- you should reload your Gaia hub now."}
```

{% endraw %}

## View logs for the hub or admin service

The logs for each Gaia service are maintained by their respective Docker containers. To view the log for a particular service, use the `docker logs` command. For example, to get the logs for the hub:

```
$ docker logs docker_hub_1

> gaia-hub@2.3.4 start /src/hub
> npm run build && node lib/index.js


> gaia-hub@2.3.4 build /src/hub
> npm run lint && babel src -d lib && chmod +x lib/index.js


> gaia-hub@2.3.4 lint /src/hub
> eslint src

Successfully compiled 13 files with Babel.
{"level":"warn","message":"Listening on port 3000 in development mode","timestamp":"2019-02-14T04:00:06.071Z"}
```
