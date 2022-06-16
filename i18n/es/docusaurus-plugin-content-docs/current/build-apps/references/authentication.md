---
title: Autenticación
description: Registrar e iniciar sesión de usuarios con identidades en la blockchain de Stacks
---

## Introducción

Esta guía explica cómo se realiza la autenticación en el blockchain de Stacks.

La autenticación proporciona una forma para que los usuarios se identifiquen a sí mismos en una aplicación mientras conservan el control total sobre sus credenciales y datos personales. Puede integrarse solo o utilizarse en conjunto con [la firma de transacciones](https://docs.hiro.so/get-started/transactions#signature-and-verification) y [el almacenamiento de datos](https://docs.stacks.co/gaia/overview), para lo cual es un requisito previo.

Los usuarios que se registren en su aplicación pueden autenticarse posteriormente en cualquier otra aplicación con soporte para el [Blockchain Naming System (BNS)](bns) y viceversa.

## Cómo funciona

El flujo de autenticación con Stacks es similar al típico flujo cliente-servidor utilizado por los servicios de registro centralizado (por ejemplo, OAuth). Sin embargo, con Stacks el flujo de autentificación ocurre enteramente del lado del cliente.

Una aplicación y autenticador, como [la billetera de Stacks](https://www. hiro. so/wallet/install-web), se comunican durante el flujo de autenticación pasando dos tokens de ida y vuelta. La aplicación solicitante envía al autenticador un token `authRequest`. Una vez que un usuario aprueba la autenticación, el autenticador responde a la aplicación con un token `authResponse`.

Estos tokens están basados en [un estándar JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) con soporte adicional para la curva `secp256k1` utilizada por Bitcoin y muchas otras criptomonedas. Se pasan a través de URL query strings.

Cuando un usuario elige autenticar una aplicación, envía el token `authRequest` al autenticador a través de una URL query string con un parámetro igualmente nombrado:

`https://wallet.hiro.so/...?authRequest=j902120cn829n1jnvoa...`

Cuando el autenticador recibe la solicitud, genera un token `authResponse` para la aplicación usando una _clave de tránsito efímera_. La clave de tránsito efímera solo se utiliza para la instancia particular de la aplicación, en este caso, para firmar el `authRequest`.

La aplicación almacena la clave de tránsito efímera durante la generación de solicitudes. La parte pública de la clave de tránsito se pasa en el token `authRequest`. El autenticador utiliza la porción pública de la clave para cifrar una _clave privada de la aplicación_ que se devuelve a través del `authResponse`.

El autenticador genera la clave privada de la aplicación desde _la clave privada de la dirección de identidad_ del usuario y el dominio de la aplicación. La clave privada de la aplicación cumple tres funciones:

1. Se utiliza para crear credenciales que dan a la aplicación acceso a un bucket de almacenamiento en el hub de Gaia del usuario
2. Se utiliza en el cifrado de extremo a extremo de los archivos almacenados para la aplicación en el almacenamiento Gaia del usuario.
3. Sirve como un secreto criptográfico que las aplicaciones pueden usar para realizar otras funciones criptográficas.

Por último, la clave privada de la aplicación es determinista, lo que significa que siempre se generará la misma clave privada para una dirección y un dominio de Stacks determinados.

Las dos primeras de estas funciones son particularmente relevantes para el [almacenamiento de datos con Stacks.js](https://docs.stacks.co/docs/gaia).

## Par de Claves

La autenticación con Stacks hace un uso extensivo de la criptografía de clave pública en general y ECDSA con la curva `secp256k1` en particular.

Las siguientes secciones describen los tres pares de claves públicas-privadas utilizados, incluyendo cómo se generan, dónde se utilizan y a quién se revelan las claves privadas.

### Clave privada de tránsito

La clave privada de tránsito es una clave efímera que se utiliza para cifrar los secretos que deben pasar del autenticador a la aplicación durante el proceso de autenticación. Es generado aleatoriamente por la aplicación al principio de la respuesta de autenticación.

La clave pública que corresponde a la clave privada de tránsito está almacenada en un único elemento array en la clave `public_keys` del token de solicitud de autenticación. El autenticador encripta datos secretos como la clave privada de la aplicación utilizando esta clave pública y lo envía de vuelta a la aplicación cuando el usuario inició sesión en la aplicación. La clave privada de tránsito firma la solicitud de autenticación de la aplicación.

### Clave privada de la dirección de identidad

La clave privada de la dirección de identidad se deriva de la frase del llavero del usuario y es la clave privada del nombre de usuario de Stacks que el usuario elige utilizar para iniciar sesión a la aplicación. Es un secreto propiedad del usuario y nunca deja la instancia del autenticador del usuario.

Esta clave privada firma el token de respuesta de autenticación para una aplicación para indicar que el usuario aprueba el inicio de sesión en esa aplicación.

### Clave privada de la App

La clave privada de la aplicación es una clave privada específica de la aplicación que es generada a partir de la clave privada de la dirección de identidad del usuario utilizando el `domain_name` como entrada.

La clave privada de la aplicación es compartida de forma segura con la aplicación en cada autenticación, encriptada por el autenticador con la clave pública de tránsito. Debido a que la clave de tránsito sólo se almacena en el lado del cliente esto previene un ataque man-in-the-middle en el que un servidor o proveedor de Internet podría potencialmente espiar la clave privada de la aplicación.
