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

Estos controladores pueden requerir que proporcione credenciales adicionales para realizar escrituras en los backends. Vea `config.sample.json` para ver los campos para esas credenciales. En algunos casos, el controlador puede usar una credencial configurada del sistema para el backend (p.ej. si ha iniciado sesión en su cuenta de AWS CLI, y ejecuta el hub desde ese entorno, no necesitará leer las credenciales de su `config.json`).

_Nota:_ El controlador de disco requiere una interfaz de sistema de archivos similar a la de \*nix, y no funcionará correctamente al intentar ejecutarse en un entorno Windows. :::

## Nota sobre SSL

Le recomendamos _encarecidamente_ que despliegue su hub Gaia con SSL habilitado. De lo contrario, los tokens utilizados para autenticarse con el Hub de Gaia pueden ser robados por atacantes, lo que podría permitirles ejecutar escrituras en tu nombre.  
Las opciones de configuración están disponibles para ejecutar el hub con un nodo `https` en un servidor Node.js  
De lo contrario, se puede utilizar un servidor web proxy inverso, como nginx o Apache.

## Requiere URL correcta del Hub

Si activa la opción `requireCorrectHubUrl` en el archivo `config.json`, su hub Gaia requerirá que las solicitudes de autenticación incluyan correctamente la `hubURL` con la que están intentando conectarse. Esto se utiliza para evitar que un hub malicioso de gaia utilice un token de autenticación para sí mismo en otros hubs de Gaia.

Por defecto, el hub de Gaia validará que la URL proporcionada coincida con `https://${config.serverName}`, pero si hay múltiples URLs válidas para que los clientes puedan acceder al hub, puede incluir una lista en `config.json`:

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

Por defecto, los controladores de los hub de gaia devolverán URLs de lectura que apuntan directamente al contenido escrito. Por ejemplo, un controlador S3 devolvería la URL directamente al archivo S3. Sin embargo, si configura un CDN o dominio para apuntar a ese mismo bucket, puedes usar el parámetro `readURL` para decirle al hub de gaia que los archivos pueden ser leídos desde la URL dada. Por ejemplo, el `hub.blockstack.org` Gaia Hub está configurado para devolver una URL de lectura que se vea `https://gaia.blockstack.org/hub/`.

Desactive este parámetro de configuración si no tiene intención de desplegar ningún caché.

## Requisitos mínimos de pruebas

El Hub de gaia también puede configurarse para que requiera un número mínimo de pruebas sociales en el perfil de un usuario para aceptar escrituras de ese usuario. Esto puede utilizarse como una especie de mecanismo de control de spam. Sin embargo, recomendamos para el funcionamiento más fluido de su hub de gaia, para establecer el `testsConfig.parallsRequired` la clave de configuración a `0`.

## CDN & Hubs Duplicados

- https://docs.microsoft.com/en-us/azure/storage/blobs/storage-https-custom-domain-cdn

- La implementación del hub está diseñada para ejecutarse desde una única instancia de Node.js. Si la instancia del hub está fragmentada (por ejemplo, hubs replicados a través de balanceo de carga), entonces cualquier `bucket` (identificado por el segmento URI) debe ser servido por la misma instancia, Al menos un par de elementos del Gaia Hub dependen de esto: la invalidación de tokens en la memoria caché, y el comportamiento de contención del endpoint de recursos 409.
