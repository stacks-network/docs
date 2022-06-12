---
title: Consejos para el despliegue
description: Aprende algunos métodos comunes para desplegar tu aplicación.
---

## Introducción

Las aplicaciones de Stacks son aplicaciones web que autentifican a los usuarios con Stacks Auth y almacenan datos con Gaia. Ambas tecnologías pueden ser accesibles desde el lado del cliente. Como tal, las aplicaciones de Stacks tienden a ser simples en diseño y operación, dado que en muchos casos, no tienen que alojar nada aparte de los assets de la aplicación.

## Donde hacer el despliegue tu aplicación

Antes de que los usuarios puedan interactuar con tu aplicación, debes desplegarla en un servidor que sea accesible a través de internet. Desplegar requiere que:

- Configure o personalice los archivos en el directorio `público`.
- Construya su aplicación para el despliegue.
- Copie los archivos generados por su aplicación en su servidor de producción.

Si primero completó su aplicación con el generador de aplicaciones de Stacks, su aplicación ya contiene los bloques iniciales para configurar, construir y desplegar su aplicación. Por ejemplo, la plantilla de React construye un andamio con los siguientes bloques de construcción.

| Archivos o Directorio      | Descripción                                                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| node_modules/react-scripts | Un conjunto de scripts para que te ayude a iniciar proyectos React sin configuración, para que no tenga que configurar su proyecto usted mismo.                                                      |
| package.json               | Contiene una sección de scripts que incluye una referencia a los react-scripts, que son una dependencia. Este script crea un directorio de compilación que contiene los archivos para el despliegue. |
| public/favicon.ico         | Un ejemplo de ícono de atajo.                                                                                                                                                                        |
| public/index.html          | Página de entrada de una aplicación.                                                                                                                                                                 |
| public/manifest.json       | Un archivo JSON que describe tu aplicación web en el navegador.                                                                                                                                      |
| cors                       | Contiene ejemplos de archivos de despliegue para la configuración de solicitudes de origen cruzado.                                                                                                  |

Si usa el generador para construir en JavasScript o Vue scaffolding, los archivos de configuración de su proyecto serán diferentes.

Independientemente de cuál sea el andamio que utilice, debe personalizar y extender este andamio básico según su aplicación lo necesite. Por ejemplo, puede querer agregar más propiedades al archivo `manifest.json`. Dado que cada aplicación es diferente, Stacks Auth no puede dar instrucciones específicas sobre cómo hacerlo. Los pasos que usted tome son específicos de su aplicación.

## Autenticación y despliegue en Stacks

Cuando la aplicación autentifica a los usuarios con Stacks, la billetera de Stacks en la URL solicita un recurso (el manifiesto de la aplicación) de tu DApp. Una solicitud para un recurso fuera del origen (la billetera de Stacks) es llamada como una solicitud de _de origen cruzado_(CORs). Obtener datos de esta manera puede ser arriesgado, por lo que debe configurar la seguridad de su sitio web para permitir interacciones entre orígenes.

Puedes pensar en las interacciones CORS como un edificio de apartamentos con seguridad. Por ejemplo, si necesita tomar prestado una escalera, podría preguntar a un vecino en el edificio que tiene uno. Probablemente la seguridad no tendría ningún problema con esta petición (es decir, el mismo origen, de su edificio). Sin embargo, si necesitaba una herramienta en particular, y la ordenó desde una tienda de hardware online (es decir, de origen cruzado, de otro sitio), La seguridad puede solicitar la identificación antes de permitir al hombre del delivery entrar en el edificio de apartamentos. (Créditos: Codecademy)

The way you configure CORs depends on which company you use to host your web application. The application generator adds a `cors` directory to your application scaffolding. This directory contains files for Netlify (`_headers` and `_redirects`) as well as one for Firebase (`firebase.json`). The configurations in the `cors` directory make your application's `manifest.json` file accessible to other applications (for example, to the Stacks Browser). If you are deploying to a service other than Netlify or Firebase, you must configure CORS on that service to include the following headers when serving `manifest.json`:

```html
Access-Control-Allow-Origin: * Access-Control-Allow-Headers: "X-Requested-With, Content-Type,
Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding" Access-Control-Allow-Methods:
"POST, GET, OPTIONS, DELETE, PUT"
```

Consult the documentation for your hosting service to learn how to configure CORS on that service.

## Deployment and Radiks

If you are deploying a Stacks application that uses [Radiks](https://github.com/stacks-network/radiks), your deployment includes a server and a database component. You must take this into account when deploying your application. You may want to choose a service such as [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com) if your app uses Radiks.
