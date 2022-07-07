---
title: Configuración
description: Configurando Gaia Hub
---

## Archivos de configuración

Los siguientes archivos de configuración existen en la carpeta `deploy/configs/gaia/`:

```
admin-config.json
hub-config.json
reader-config.json
```

## Servicio de administración de GAIA

También puede utilizar el servicio de administración de GAIA para administrarlo de forma remota con un API Key. Requerirá instalar `npm` con una `apt install npm`. Una vez que `npm` esté instalado, puede continuar con los pasos en el [Servicio de administración de GAIA](https://github.com/stacks-network/gaia/blob/master/admin/README.md).

## Selección de Controlador

El centro de Gaia actualmente soporta los siguientes controladores:

```
'aws' == Amazon S3
'azure' == Azure Blob Storage
'disco' == Disco local
'google-cloud' === Google Cloud Storage
```

Establezca el controlador que desea utilizar en el archivo [config.json](https://github.com/stacks-network/gaia/blob/master/hub/config.sample.json) con el parámetro `driver`. Muchos controladores aceptan adicionalmente el parámetro `bucket`, que controla el nombre del cubo en el que deben escribirse los archivos.

Estos controladores pueden requerir que proporcione credenciales adicionales para realizar escrituras en los backends. See `config.sample.json` for fields for those credentials. In some cases, the driver can use a system configured credential for the backend (e.g., if you are logged into your AWS CLI account, and run the hub from that environment, it won't need to read credentials from your `config.json`).

_Note:_ The disk driver requires a \*nix like filesystem interface, and will not work correctly when trying to run in a Windows environment. :::

## Nota sobre SSL

We _strongly_ recommend that you deploy your Gaia hub with SSL enabled. Otherwise, the tokens used to authenticate with the Gaia hub may be stolen by attackers, which could allow them to execute writes on your behalf.  
Configuration options are available to run the hub with an `https` Node.js server.  
Otherwise, a reverse proxy web server such as nginx or Apache can be used.

## Requiere URL correcta del Hub

If you turn on the `requireCorrectHubUrl` option in your `config.json` file, your Gaia hub will require that authentication requests correctly include the `hubURL` they are trying to connect with. This is used to prevent a malicious gaia hub from using an authentication token for itself on other Gaia hubs.

By default, the Gaia hub will validate that the supplied URL matches `https://${config.serverName}`, but if there are multiple valid URLs for clients to reach the hub at, you can include a list in your `config.json`:

```javascript
{
  ....
  serverName: "normalserver.com"
  validHubUrls: [ "https://specialserver.com/",
                  "https://legacyurl.info" ]
  ....
}
```

## El parámetro readURL

By default, the gaia hub drivers will return read URLs which point directly at the written content. Por ejemplo, un controlador S3 devolvería la URL directamente al archivo S3. However, if you configure a CDN or domain to point at that same bucket, you can use the `readURL` parameter to tell the gaia hub that files can be read from the given URL. For example, the `hub.blockstack.org` Gaia Hub is configured to return a read URL that looks like `https://gaia.blockstack.org/hub/`.

Unset this configuration parameter if you do not intend to deploy any caching.

## Minimum Proofs Requirement

The gaia hub can also be configured to require a minimum number of social proofs in a user's profile to accept writes from that user. Esto puede utilizarse como una especie de mecanismo de control de spam. However, we recommend for the smoothest operation of your gaia hub, to set the `proofsConfig.proofsRequired` configuration key to `0`.

## CDN & Replicated Hubs

- https://docs.microsoft.com/en-us/azure/storage/blobs/storage-https-custom-domain-cdn

- The hub implementation is designed to be ran from a single Node.js instance. If the hub instance is sharded (e.g. replicated hubs via load balancing), then any given `bucket` (identified by URI segment) must be served by the same instance, At least a couple elements of the Gaia Hub depend on this: token invalidation in-memory caching, and resource endpoint 409 contention behavior.
