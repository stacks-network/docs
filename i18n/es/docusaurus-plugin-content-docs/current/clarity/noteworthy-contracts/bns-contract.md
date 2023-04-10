---
title: Contrato BNS
description: El Sistema de Nombres de Bitcoin.
---

![](/img/satoshi-btc.png)

## Introducción

El Sistema de Nombres Bitcoin (Bitcoin Name System, en inglés abreviado como BNS) se implementa como un contrato inteligente usando Clarity.

A continuación se muestra una lista de funciones públicas y de solo lectura, así como los códigos de error que pueden devolver esos métodos:

- [Funciones públicas](#public-functions)
- [Funciones de solo lectura](#read-only-functions)
- [Códigos de error](#error-codes)

## Funciones públicas

### name-import

#### Input: `(buff 20), (buff 48), principal, (buff 20)`

#### Output: `(response bool int)`

#### Signature: `(name-import namespace name beneficiary zonefile-hash)`

#### Descripción:

Importa un nombre a un namespace revelado. A cada nombre importado se le asigna tanto un propietario como un estado off-chain.

### name-preorder

#### Input: `(buff 20), uint`

#### Output: `(response uint int)`

#### Signature: `(name-preorder hashed-salted-fqn stx-to-burn)`

#### Descripción:

Reserva un nombre informando a todos los nodos de BNS el hash salt del nombre de BNS. Se paga la tarifa de registro a la dirección designada por el propietario del namespace.

### name-register

#### Input: `(buff 20), (buff 48), (buff 20), (buff 20)`

#### Output: `(response bool int)`

#### Signature: `(name-register namespace name salt zonefile-hash)`

#### Descripción:

Revela el salt y el nombre a todos los nodos BNS, y asigna a el nombre un hash de clave pública inicial y un hash del archivo de zona.

### name-renewal

#### Input: `(buff 20), (buff 48), uint, (optional principal), (optional (buff 20))`

#### Output: `(response bool int)`

#### Signature: `(name-renewal namespace name stx-to-burn new-owner zonefile-hash)`

#### Descripción:

Dependiendo de las reglas del namespace, un nombre puede expirar. Por ejemplo, los nombres en el namespace .id expiran después de 2 años. Necesitas enviar una renovación de nombre de vez en cuando para mantener tu nombre.

Pagará el coste de registro de su nombre a la dirección de grabación designada por el namespace cuando lo renueve. Cuando un nombre caduca, ingresa a un \"período de gracia\". El período está fijado en 5000 bloques (un mes) pero puede configurarse para cada namespace.

Dejará de resolverse en el período de gracia, y todas las operaciones anteriores dejarán de ser reconocidas por las reglas de consenso de BNS. Sin embargo, puede enviar un NAME_RENEWAL durante este período de gracia para preservar su nombre. Después del período de gracia, cualquier persona puede registrar ese nombre nuevamente. Si su nombre está en un namespace donde los nombres no caducan, entonces nunca necesitará usar esta transacción.

### name-revoke

#### Input: `(buff 20), (buff 48)`

#### Output: `(response bool int)`

#### Signature: `(name-revoke namespace name)`

#### Descripción:

Hace que un nombre no se pueda resolver. Las reglas de consenso de BNS estipulan que una vez que se revoca un nombre, nadie puede cambiar su hash de clave pública ni su hash de archivo de zona. El hash del archivo de zona del nombre se establece en nulo para evitar que se resuelva. Deberías hacer esto solo si tu clave privada ha sido comprometida, o si deseas que tu nombre no se pueda usar por alguna razón.

### name-transfer

#### Input: `(buff 20), (buff 48), principal, (optional (buff 20))`

#### Output: `(response bool int)`

#### Signature: `(name-transfer namespace name new-owner zonefile-hash)`

#### Descripción:

Cambia el hash de clave pública del nombre. Enviarías una transacción de transferencia de nombre si quisieras:

- Cambiar tu llave privada
- Enviar el nombre a otra persona o
- Actualizar tu archivo de zona

Al transferir un nombre, tienes la opción de también borrar el hash del archivo de zona del nombre (es decir, establecerlo en nulo). Esto es útil cuando envías el nombre a otra persona, para que el nombre del destinatario no resuelva a tu archivo de zona.

### name-update

#### Input: `(buff 20), (buff 48), (buff 20)`

#### Output: `(response bool int)`

#### Signature: `(name-update namespace name zonefile-hash)`

#### Descripción:

Cambia el hash del archivo de zona del nombre. Enviarías una transacción de actualización de nombre si quisieras cambiar el contenido del archivo de la zona del nombre. Por ejemplo, harías esto si quieres desplegar tu propio hub de Gaia y deseas que otras personas lean desde él.

### namespace-preorder

#### Input: `(buff 20), uint`

#### Output: `(response uint int)`

#### Signature: `(namespace-preorder hashed-salted-namespace stx-to-burn)`

#### Descripción:

Registra el hash salted del namespace con los nodos de BNS y quema la cantidad requerida de criptomoneda. Además, este paso demuestra a los nodos de BNS que el usuario ha respetado las reglas de consenso de BNS al incluir un hash de consenso reciente en la transacción. Devuelve la fecha de vencimiento del pre-pedido (en bloques).

### namespace-ready

#### Input: `(buff 20)`

#### Output: `(response bool int)`

#### Signature: `(namespace-ready namespace)`

#### Descripción:

Lanza el namespace y lo hace disponible al público. Una vez que se lanza un namespace, cualquiera puede registrar un nombre en él si paga la cantidad apropiada de criptomonedas.

### namespace-reveal

#### Input: `(buff 20), (buff 20), uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, uint, principal`

#### Output: `(response bool int)`

#### Signature: `(namespace-reveal namespace namespace-salt p-func-base p-func-coeff p-func-b1 p-func-b2 p-func-b3 p-func-b4 p-func-b5 p-func-b6 p-func-b7 p-func-b8 p-func-b9 p-func-b10 p-func-b11 p-func-b12 p-func-b13 p-func-b14 p-func-b15 p-func-b16 p-func-non-alpha-discount p-func-no-vowel-discount lifetime namespace-import)`

#### Descripción:

Revela el salt y el ID del namespace (después de una preo orden del namespace). Muestra cuánto tiempo duran los nombres en este namespace antes de que caduquen o deban ser renovados, y establece una función de precio para el namespace que determina cuán barato o caro serán sus nombres. Todos los parámetros prefijados por `p` componen la `price function`. Estos parámetros rigen el precio y el tiempo de vida de los nombres en el namespace.

Las reglas para un namespace son las siguientes:

- un nombre puede caer en uno de los 16 buckets, medidos por longitud. El bucket 16 incorpora todos los nombres al menos de 16 caracteres de longitud.

- la estructura de precios aplica una penalización multiplicativa por tener caracteres numéricos, o caracteres de puntuación.

- el precio de un nombre en un bucket es `((coeff) * (base) ^ (exponente del bucket)) / ((multiplicador de descuento numérico) * (multiplicador de descuento de puntuación))`

Ejemplo:

- base = 10
- coeff = 2
- descuento nonalpha: 10
- descuento no-vocal: 10
- buckets 1, 2: 9
- buckets 3, 4, 5, 6: 8
- buckets 7, 8, 9, 10, 11, 12, 13, 14: 7
- buckets 15, 16+:

## Funciones de solo lectura

### can-name-be-registered

#### Input: `(buff 20), (buff 48)`

#### Output: `(response bool int)`

#### Signature: `(can-name-be-registered namespace name)`

#### Descripción:

Devuelve verdadero si el nombre proporcionado puede ser registrado.

### can-namespace-be-registered

#### Input: `(buff 20)`

#### Output: `(response bool UnknownType)`

#### Signature: `(can-namespace-be-registered namespace)`

#### Descripción:

Devuelve verdadero si el namespace proporcionado está disponible.

### can-receive-name

#### Input: `principal`

#### Output: `(response bool int)`

#### Signature: `(can-receive-name owner)`

#### Descripción:

Devuelve verdadero si el nombre proporcionado puede ser recibido. Es decir, si actualmente no está en propiedad de alguien, un arrendamiento anterior ha caducado y el nombre no ha sido revocado.

### get-name-price

#### Input: `(buff 20), (buff 48)`

#### Output: `(response uint int)`

#### Signature: `(get-name-price namespace name)`

#### Descripción:

Gets the price for a name.

### get-namespace-price

#### Input: `(buff 20)`

#### Output: `(response uint int)`

#### Signature: `(get-namespace-price namespace)`

#### Descripción:

Obtiene el precio de un namespace.

### get-namespace-properties

#### Input: `(buff 20)`

#### Output: `(response (tuple (namespace (buff 20)) (properties (tuple (can-update-price-function bool) (launched-at (optional uint)) (lifetime uint) (namespace-import principal) (price-function (tuple (base uint) (buckets (list 16 uint)) (coeff uint) (no-vowel-discount uint) (nonalpha-discount uint))) (revealed-at uint)))) int)`

#### Signature: `(get-namespace-properties namespace)`

#### Descripción:

Obtener propiedades del namespace.

### is-name-lease-expired

#### Input: `(buff 20), (buff 48)`

#### Output: `(response bool int)`

#### Signature: `(is-name-lease-expired namespace name)`

#### Descripción:

Devuelve verdadero si el contrato de arrendamiento del nombre proporcionado ha caducado.

### name-resolve

#### Input: `(buff 20), (buff 48)`

#### Output: `(response (tuple (lease-ending-at (optional uint)) (lease-started-at uint) (owner principal) (zonefile-hash (buff 20))) int)`

#### Signature: `(name-resolve namespace name)`

#### Descripción:

Obtener detalles de registro de nombres.

### resolve-principal

#### Input: `principal`

#### Output: `(response (tuple (name (buff 48)) (namespace (buff 20))) (tuple (code int) (name (optional (tuple (name (buff 48)) (namespace (buff 20)))))))`

#### Signature: `(resolve-principal owner)`

#### Descripción:

Devuelve el nombre registrado que posee un principal si existe alguno. Un principal solo puede poseer un nombre a la vez.

## Códigos de error

### ERR_INSUFFICIENT_FUNDS

#### type: `int`

#### value: `4001`

### ERR_NAMESPACE_ALREADY_EXISTS

#### type: `int`

#### value: `1006`

### ERR_NAMESPACE_ALREADY_LAUNCHED

#### type: `int`

#### value: `1014`

### ERR_NAMESPACE_BLANK

#### type: `int`

#### value: `1013`

### ERR_NAMESPACE_CHARSET_INVALID

#### type: `int`

#### value: `1016`

### ERR_NAMESPACE_HASH_MALFORMED

#### type: `int`

#### value: `1015`

### ERR_NAMESPACE_NOT_FOUND

#### type: `int`

#### value: `1005`

### ERR_NAMESPACE_NOT_LAUNCHED

#### type: `int`

#### value: `1007`

### ERR_NAMESPACE_OPERATION_UNAUTHORIZED

#### type: `int`

#### value: `1011`

### ERR_NAMESPACE_PREORDER_ALREADY_EXISTS

#### type: `int`

#### value: `1003`

### ERR_NAMESPACE_PREORDER_CLAIMABILITY_EXPIRED

#### type: `int`

#### value: `1009`

### ERR_NAMESPACE_PREORDER_EXPIRED

#### type: `int`

#### value: `1002`

### ERR_NAMESPACE_PREORDER_LAUNCHABILITY_EXPIRED

#### type: `int`

#### value: `1010`

### ERR_NAMESPACE_PREORDER_NOT_FOUND

#### type: `int`

#### value: `1001`

### ERR_NAMESPACE_PRICE_FUNCTION_INVALID

#### type: `int`

#### value: `1008`

### ERR_NAMESPACE_STX_BURNT_INSUFFICIENT

#### type: `int`

#### value: `1012`

### ERR_NAMESPACE_UNAVAILABLE

#### type: `int`

#### value: `1004`

### ERR_NAME_ALREADY_CLAIMED

#### type: `int`

#### value: `2011`

### ERR_NAME_BLANK

#### type: `int`

#### value: `2010`

### ERR_NAME_CHARSET_INVALID

#### type: `int`

#### value: `2022`

### ERR_NAME_CLAIMABILITY_EXPIRED

#### type: `int`

#### value: `2012`

### ERR_NAME_COULD_NOT_BE_MINTED

#### type: `int`

#### value: `2020`

### ERR_NAME_COULD_NOT_BE_TRANSFERRED

#### type: `int`

#### value: `2021`

### ERR_NAME_EXPIRED

#### type: `int`

#### value: `2008`

### ERR_NAME_GRACE_PERIOD

#### type: `int`

#### value: `2009`

### ERR_NAME_HASH_MALFORMED

#### type: `int`

#### value: `2017`

### ERR_NAME_NOT_FOUND

#### type: `int`

#### value: `2013`

### ERR_NAME_NOT_RESOLVABLE

#### type: `int`

#### value: `2019`

### ERR_NAME_OPERATION_UNAUTHORIZED

#### type: `int`

#### value: `2006`

### ERR_NAME_PREORDERED_BEFORE_NAMESPACE_LAUNCH

#### type: `int`

#### value: `2018`

### ERR_NAME_PREORDER_ALREADY_EXISTS

#### type: `int`

#### value: `2016`

### ERR_NAME_PREORDER_EXPIRED

#### type: `int`

#### value: `2002`

### ERR_NAME_PREORDER_FUNDS_INSUFFICIENT

#### type: `int`

#### value: `2003`

### ERR_NAME_PREORDER_NOT_FOUND

#### type: `int`

#### value: `2001`

### ERR_NAME_REVOKED

#### type: `int`

#### value: `2014`

### ERR_NAME_STX_BURNT_INSUFFICIENT

#### type: `int`

#### value: `2007`

### ERR_NAME_TRANSFER_FAILED

#### type: `int`

#### value: `2015`

### ERR_NAME_UNAVAILABLE

#### type: `int`

#### value: `2004`

### ERR_PANIC

#### type: `int`

#### value: `0`

### ERR_PRINCIPAL_ALREADY_ASSOCIATED

#### type: `int`

#### value: `3001`
