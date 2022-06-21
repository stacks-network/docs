---
title: Sistema de Nombres de Blockchain
description: Vincula los nombres de usuario de Stacks al estado off-chain
---

Sistema de Nombres de Blockchain (BNS) es un sistema de red que vincula los nombres de usuario de Stacks al estado off-chain sin depender de ningún punto central de control.

La V1 de la blockchain de Stacks implementó BNS a través de operaciones de nombre de primer orden. En la V2 de Stacks. BNS es implementado a través de un contrato inteligente cargado durante el bloque de génesis.

Los nombres en BNS tienen tres propiedades:

- **Los nombres son únicos a nivel global.** El protocolo no permite colisiones de nombres, y todos los nodos que se comportan correctamente resuelven un nombre dado al mismo estado.
- **Los nombres tienen un significado humano.** Cada nombre es elegido por su creador.
- **Los nombres tienen una propiedad sólida.** Sólo el propietario del nombre puede cambiar el estado al que se resuelve. Específicamente, un nombre es propiedad de una o varias claves privadas ECDSA.

La blockchain de Stacks asegura que la vista del BNS de cada nodo está sincronizada para todos los demás nodos del mundo, por lo que las consultas en un nodo seran las mismas en otros nodos. Los nodos de la blockchain de Stacks permiten al propietario de un nombre enlazar hasta 40Kb de estado off-chain a su nombre, el cual será replicado a todos los demás nodos de blockchain de Stacks a través de una red P2P.

La mayor consecuencia para los desarrolladores es que en BNS, el estado del nombre de lectura es rápido y barato, pero el estado del nombre de la escritura es lento y costoso. Esto es porque registrar y modificar nombres requiere que una o más transacciones sean enviadas a la cadena de bloques subyacente, y los nodos BNS no los procesarán hasta que estén suficientemente confirmados. Los usuarios y desarrolladores necesitan adquirir y gastar la criptomoneda solicitada (STX) para enviar transacciones BNS.

## Motivación detrás de los sistemas de nombres

Nos basamos en nombrar sistemas en la vida cotidiana, y ellos juegan un papel crítico en muchas aplicaciones diferentes. Por ejemplo, cuando buscas un amigo en las redes sociales, está usando el sistema de nomenclatura de la plataforma para asociar su nombre a su perfil. Cuando buscas un sitio web, estás utilizando el Servicio de Nombre de Dominio para asociar el nombre de host a la dirección IP de su host. Cuando revisa una rama de Git, está usando su cliente Git para asociar el nombre de la rama a un commit hash. Cuando buscamos la clave PGP de alguien en un servidor de claves, esta asociando su clave ID a su clave pública.

¿Qué tipo de cosas queremos que sean ciertas sobre los nombres? En BNS, los nombres son únicos globalmente, tienen significado humano y tienen una propiedad sólida. En BNS, los nombres son únicos globalmente, tienen significado humano y tienen una propiedad sólida. Sin embargo, si observas estos ejemplos, verás que cada uno de ellos solo garantiza _dos_ de estas propiedades. Esto limita lo útiles que pueden ser.

- En DNS y redes sociales, los nombres son globalmente únicos y legibles, pero no tienen una propiedad sólida. El operador del sistema tiene la última palabra sobre a qué se asocia cada nombre.

  - **Problema**: Los clientes deben confiar en el sistema para hacer la elección correcta en cuanto a la asociación de un nombre determinado. Esto incluye confiar en que nadie más que los administradores del sistema pueden hacer estos cambios.

- En Git, los nombres de ramas son legibles para el ser humano y tienen una propiedad sólida, pero no son únicos globalmente. Dos nodos Git diferentes pueden asociar el mismo nombre de rama a diferentes estados no relacionados del repositorio.

  - **Problema**: Dado que los nombres pueden referirse a estados conflictivos, los desarrolladores tienen que averiguar algún otro mecanismo para resolver ambigüedades. En el caso de Git, el usuario tiene que intervenir manualmente.

- En PGP, los nombres son identificadores de clave. Son globalmente únicos y criptográficamente propios, pero no legibles por el ser humano. Los IDs de claves PGP se derivan de las claves a las que hacen referencia.
  - **Problema**: Estos nombres son difíciles de recordar para la mayoría de los usuarios ya que no llevan información semántica relacionada con su uso en el sistema.

Los nombres de BNS tienen las tres propiedades, y ninguno de estos problemas. Esto hace que sea una herramienta potente para construir todo tipo de aplicaciones de red. Con BNS, podemos hacer lo siguiente y más:

- Construir servicios de nombre de dominios donde los nombres de host no puedan ser secuestrados.
- Construir plataformas de redes sociales donde los nombres de usuario no puedan ser robados por phishers.
- Construir sistemas de control de versiones donde las ramas del repositorio no entren en conflicto.
- Construir infraestructura de llaves públicas donde sea sencillo para los usuarios descubrir y recordar las claves de los demás.

## Organización de los BNS

Los nombres de BNS están organizados en una jerarquía de nombres global. Hay tres capas diferentes en esta jerarquía relacionadas con el nombramiento:

- **Namespaces**. Estos son los nombres de nivel superior en la jerarquía. Una analogía con los namespaces de BNS son los DNS de dominios de nivel superior. Los namespaces de BNS existentes incluyen `.id`, `.podcast`, and `.helloworld`. Todos los otros nombres pertenecen exactamente a un namespace. Cualquiera puede crear un namespace, pero para que un namespace sea persistente, debe ser _publicado_ para que cualquiera pueda registrar nombres en él. Namespaces no son propiedad de sus creadores.

- **Nombres BNS**. Son nombres cuyos registros se almacenan directamente en la blockchain. La propiedad y estado de estos nombres están controlados por el envío de transacciones de blockchain. Algunos ejemplos de nombres son `verified.podcast` and `muneeb.id`. Cualquiera puede crear un Nombre BNS, siempre y cuando el namespace que lo contenga ya exista.

- **Subdominios BNS**. Estos son nombres cuyos registros se almacenan off-chain, pero están colectivamente anclados a la blockchain. La propiedad y el estado de estos nombres viven dentro de los datos de la red P2P. Mientras que los subdominios de BNS son propiedad de claves privadas separadas, el propietario de un nombre BNS debe difundir el estado de su subdominio. Algunos ejemplos de subdominios son `jude.personal.id` and `podsaveamerica.verified.podcast`. A diferencia de los namespace y los nombres de BNS, el estado de los subdominios BNS _no es_ parte de las reglas de consenso de la blockchain.

Una matriz de comparación de características que resume las similitudes y diferencias entre estos objetos de nombre se presenta a continuación:

| Características                                  | **Namespaces** | **Nombres BNS** | **Subdominios BNS** |
| ------------------------------------------------ | -------------- | --------------- | ------------------- |
| Único a nivel global                             | X              | X               | X                   |
| Significado humano                               | X              | X               | X                   |
| Propiedad de una clave privada                   |                | X               | X                   |
| Cualquiera puede crearla                         | X              | X               | [1]                 |
| El propietario puede actualizar                  |                | X               | [1]                 |
| Estado alojado on-chain                          | X              | X               |                     |
| Estado alojado off-chain                         |                | X               | X                   |
| Comportamiento controlado por reglas de consenso | X              | X               |                     |
| Puede tener una fecha de vencimiento             |                | X               |                     |

[1] Requiere la cooperación de un propietario de nombre BNS para emitir sus transacciones

## Namespaces

Los namespaces son los objetos de nombre de nivel superior en BNS.

Controlan algunas propiedades de los nombres que contienen:

- Qué tan caros son para registrarse
- Cuánto tiempo duran antes de que tengan que renovarse
- Quién (si hay alguien) recibe las tarifas de registro del nombre
- Quien tiene permitido crear el namespace con sus nombres iniciales.

En el momento de escribir este artículo, el namespace de BNS más grande es el `.id`. Los nombres en el namespace `.id` están diseñados para resolver identidades de usuario. Los nombres cortos en `.id` son más caros que los nombres largos, y tienen que ser renovados por sus propietarios cada dos años. Las tarifas de registro de nombres no son pagadas a nadie en particular---en su lugar son enviadas a un "agujero negro" donde no se pueden gastar (la intención es desalentar a los ocupantes de ID).

A diferencia del DNS, _cualquiera_ puede crear un namespace y establecer sus propiedades. Los namespaces se crean por orden de llegada, y una vez creados, duran para siempre.

Sin embargo, crear un namespace no es gratis. El creador del namespace debe _quemar la criptomoneda_ para hacerlo. Cuanto más corto sea el espacio de nombres, más criptomoneda debe ser quemado (es decir, los namespace cortos son más valiosos que los namespace largos). Por ejemplo, le cuesta a Blockstack PBC 40 BTC crear el namespace `.id` en 2015 (en la transacción `5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b281`).

Los namespace pueden tener entre 1 y 19 caracteres de longitud y están compuestos por los caracteres `a-z`, `0-9`, `-`, y `_`.

## Subdominios

Los nombres de BNS tienen una propiedad sólida porque el propietario de su clave privada puede generar transacciones válidas que que actualizan el hash y el propietario de su archivo de zona. Sin embargo, esto tiene el coste de de exigir al propietario del nombre que pague por la transacción subyacente en la blockchain. Además, este enfoque limita la tasa de registros y operaciones de nombres BNS y operaciones al ancho de banda de las transacciones de la blockchain subyacente.

BNS supera esto con los subdominios. A **BNS subdomain** is a type of BNS name whose state and owner are stored outside of the blockchain, but whose existence and operation history are anchored to the blockchain. Al igual que sus contrapartes on-chain, los subdominios son globalmente únicos, tienen una propiedad sólida y son legibles por el ser humano. BNS les da su propio estado de nombre y claves públicas. A diferencia de los nombres on-chain, los subdominios pueden ser creados y gestionados económicamente, porque son emitidos a la red de BNS en lotes. Una sola transacción de la blockchain puede enviar hasta 120 operaciones de subdominio.

Esto se logra almacenando registros de subdominios en los archivos de zona de nombres de BNS. An on-chain name owner broadcasts subdomain operations by encoding them as `TXT` records within a DNS zone file. Para transmitir el archivo de zonas, el propietario del nombre establece el nuevo hash del archivo de zona con una transacción de `NAME_UPDATE` y replica el archivo de zona. Esto, a su vez, replica todas las operaciones del subdominio que contiene, y ancla el conjunto de operaciones de subdominio a una transacción on-chain. Las reglas de consenso del nodo BNS aseguran que solo operaciones de subdominio válidas de transacciones _validas_ de `NAME_UPDATE` sean almacenadas.

Por ejemplo, el nombre `verified.podcast` una vez escribió el hash del archivo de zona `247121450ca0e9af45e85a82e61cd525cd7ba023`, que es el hash del siguiente archivo de zona:

```bash
$TTL 3600
1yeardaily TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxeWVhcmRhaWx5CiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMXllYXJkYWlseS9oZWFkLmpzb24iCg=="
2dopequeens TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAyZG9wZXF1ZWVucwokVFRMIDM2MDAKX2h0dHAuX3RjcCBVUkkgMTAgMSAiaHR0cHM6Ly9waC5kb3Rwb2RjYXN0LmNvLzJkb3BlcXVlZW5zL2hlYWQuanNvbiIK"
10happier TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMGhhcHBpZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMGhhcHBpZXIvaGVhZC5qc29uIgo="
31thoughts TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMXRob3VnaHRzCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzF0aG91Z2h0cy9oZWFkLmpzb24iCg=="
359 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNTkKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8zNTkvaGVhZC5qc29uIgo="
30for30 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMGZvcjMwCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzBmb3IzMC9oZWFkLmpzb24iCg=="
onea TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiBvbmVhCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vb25lYS9oZWFkLmpzb24iCg=="
10minuteteacher TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMG1pbnV0ZXRlYWNoZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMG1pbnV0ZXRlYWNoZXIvaGVhZC5qc29uIgo="
36questionsthepodcastmusical TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNnF1ZXN0aW9uc3RoZXBvZGNhc3RtdXNpY2FsCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzZxdWVzdGlvbnN0aGVwb2RjYXN0bXVzaWNhbC9oZWFkLmpzb24iCg=="
_http._tcp URI 10 1 "https://dotpodcast.co/"
```

Cada registro `TXT` en este archivo de zona codifica una creación de subdominio. Por ejemplo, `1yeardaily.verified.podcast` resuelve a:

```json
{
  "address": "1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH",
  "blockchain": "bitcoin",
  "last_txid": "d87a22ebab3455b7399bfef8a41791935f94bc97aee55967edd5a87f22cce339",
  "status": "registered_subdomain",
  "zonefile_hash": "e7acc97fd42c48ed94fd4d41f674eddbee5557e3",
  "zonefile_txt": "$ORIGIN 1yeardaily\n$TTL 3600\n_http._tcp URI 10 1 \"https://ph.dotpodcast.co/1yeardaily/head.json\"\n"
}
```

Esta información fue extraída del `1yeardaily` `TXT` en el archivo de la zona para `verified.podcast`.

### Ciclo de vida del subdominio

Ten en cuenta que `1yeardaily.verified.podcast` tiene un hash de clave pública diferente (dirección) que `verified.podcast`. Un nodo BNS sólo procesará una operación de subdominio posterior en `1yeardaily.verified.podcast` si incluye una firma de la clave privada de esta dirección. `verified.podcast` no puede generar actualizaciones; sólo el propietario de `1yeardaily.verified.podcast` puede hacerlo.

El ciclo de vida de un subdominio y sus operaciones se muestran en la Figura 2.

```
   creación de             Actualización de              Transferencia de
   Subdominio                 Subdominio                     Subdominio
+----------------+         +----------------+         +----------------+
| cicero         |         | cicero         |         | cicero         |
| owner="1Et..." | firmado | owner="1Et..." | firmado | owner="1cJ..." |
| zf0="7e4..."   |<--------| zf0="111..."   |<--------| zf0="111..."   |<---- ...
| seqn=0         |         | seqn=1         |         | seqn=2         |
|                |         | sig="xxxx"     |         | sig="xxxx"     |
+----------------+         +----------------+         +----------------+
        |                          |                          |
        |        off-chain         |                          |
~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ...
        |         on-chain         |                          |
        V                          V (hash de                 V 
                                archivo de zona )     
+----------------+         +----------------+         +----------------+
| res_publica.id |         |    jude.id     |         | res_publica.id |
|  NAME_UPDATE   |<--------|  NAME_UPDATE   |<--------|  NAME_UPDATE   |<---- ...
+----------------+         +----------------+         +----------------+
   blockchain                 blockchain                 blockchain
   block                      block                      block


Figura 2: Vida útil del subdominio con respecto a las operaciones de nombre on-chain. Una nueva 
operación de subdominio solo será aceptada si tiene un número posterior de "sequence=" 
y una firma válida en "sig=" sobre el cuerpo de la transacción. El campo "sig=" 
incluye tanto la clave pública como la firma, y la clave pública debe tener un hash con el campo 
"addr=" de la operación de subdominio anterior.

Las transacciones de creación de subdominio y transferencia de subdominio para
"cicero.res_publica.id" son emitidas por el propietario de "res_publica.id"
Las transacciones de creación de subdominio y transferencia de subdominio para
"cicero.res_publica.id" son emitidas por el propietario de "res_publica.id"
Sin embargo, cualquier nombre on-chain ("jude.id" en este caso) puede transmitir una actualización de subdominio
para "cicero.res_publica.id."
```

Las operaciones de subdominios se ordenan por número de secuencia, comenzando en 0. Cada nueva operación de subdominio debe incluir:

- El siguiente número de secuencia
- La clave pública que tiene el hash de la dirección de la transacción del subdominio anterior
- Una firma de la clave privada correspondiente sobre toda la operación del subdominio.

Si se descubren dos operaciones de subdominio correctamente firmadas pero en conflicto (es decir, tienen el mismo número de secuencia), se acepta el que ocurre antes en el historial de blockchain. Las operaciones de subdominio no válidas son ignoradas.

Combinado, esto garantiza que un nodo BNS con todos los archivos de zona con las operaciones de un subdominio determinado será capaz de determinar la secuencia válida de transiciones de estado por la que ha pasado, y determinar el archivo de zona actual y el hash de la clave pública del subdominio.

### Creación y gestión de subdominios

A diferencia de un nombre on-chain, un propietario de subdominio necesita la ayuda del propietario del nombre on-chain para transmitir sus operaciones de subdominio. En particular:

- Una transacción de creación de subdominios solo puede ser procesada por el propietario del nombre on-chain que comparte su sufijo. Por ejemplo, solo el dueño de `res_publica.id` puede transmitir transacciones de creación de subdominios para nombres de subdominio que terminan en `.res_publica.id`.
- Una transacción de transferencia de subdominio sólo puede ser emitida por el propietario del nombre on-chain que la creó. Por ejemplo, el dueño de `cicero.res_publica.id` necesita al dueño de `res_publica.id` para transmitir una transacción de transferencia de subdominio para cambiar la clave pública `cicero.res_publica.id`.
- Para enviar una creación de subdominio o transferencia de subdominio, todos los archivos de zona del propietario del nombre on-chain deben estar presentes en la red de Atlas. Esto permite al nodo BNS demostrar la _ausencia_ de cualquier operación conflictiva de creación y operaciones de transferencia de subdominios al procesar nuevos archivos de zona.
- A subdomain update transaction can be broadcast by _any_ on-chain name owner, but the subdomain owner needs to find one who will cooperate. For example, the owner of `verified.podcast` can broadcast a subdomain-update transaction created by the owner of `cicero.res_publica.id`.

That said, to create a subdomain, the subdomain owner generates a subdomain-creation operation for their desired name and gives it to the on-chain name owner.

Once created, a subdomain owner can use any on-chain name owner to broadcast a subdomain-update operation. To do so, they generate and sign the requisite subdomain operation and give it to an on-chain name owner, who then packages it with other subdomain operations into a DNS zone file and broadcasts it to the network.

If the subdomain owner wants to change the address of their subdomain, they need to sign a subdomain-transfer operation and give it to the on-chain name owner who created the subdomain. They then package it into a zone file and broadcast it.

### Registros de subdominio

Because subdomain names are cheap, developers may be inclined to run subdomain registrars on behalf of their applications. For example, the name `personal.id` is used to register usernames without requiring them to spend any Bitcoin.

We supply a reference implementation of a [BNS Subdomain Registrar](https://github.com/stacks-network/subdomain-registrar) to help developers broadcast subdomain operations. Users would still own their subdomain names; the registrar simply gives developers a convenient way for them to register and manage them in the context of a particular application.

# Estándares BNS y DID

BNS names are compliant with the emerging [Decentralized Identity Foundation](http://identity.foundation) protocol specification for decentralized identifiers (DIDs).

Each name in BNS has an associated DID. The DID format for BNS is:

```bash
    did:stack:v0:{address}-{index}
```

Dónde:

- `{address}` is an on-chain public key hash (for example a Bitcoin address).
- `{index}` refers to the `nth` name this address created.

For example, the DID for `personal.id` is `did:stack:v0:1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV-0`, because the name `personal.id` was the first-ever name created by `1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV`.

As another example, the DID for `jude.id` is `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-1`. Here, the address `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` had created one earlier name in history prior to this one (which happens to be `abcdefgh123456.id`).

The purpose of a DID is to provide an eternal identifier for a public key. The public key may change, but the DID will not.

Stacks Blockchain implements a DID method of its own in order to be compatible with other systems that use DIDs for public key resolution. In order for a DID to be resolvable, all of the following must be true for a name:

- El nombre debe existir
- The name's zone file hash must be the hash of a well-formed DNS zone file
- The DNS zone file must be present in the Stacks node's data.
- The DNS zone file must contain a `URI` resource record that points to a signed JSON Web Token
- The public key that signed the JSON Web Token (and is included with it) must hash to the address that owns the name

Not all names will have DIDs that resolve to public keys. However, names created by standard tooling will have DIDs that do.

A RESTful API is under development.

## DID Encoding for Subdomains

Every name and subdomain in BNS has a DID. The encoding is slightly different for subdomains, so the software can determine which code-path to take.

- For on-chain BNS names, the `{address}` is the same as the Bitcoin address that owns the name. Currently, both version byte 0 and version byte 5 addresses are supported (that is, addresses starting with `1` or `3`, meaning `p2pkh` and `p2sh` addresses).

- For off-chain BNS subdomains, the `{address}` has version byte 63 for subdomains owned by a single private key, and version byte 50 for subdomains owned by a m-of-n set of private keys. That is, subdomain DID addresses start with `S` or `M`, respectively.

The `{index}` field for a subdomain's DID is distinct from the `{index}` field for a BNS name's DID, even if the same created both names and subdomains. For example, the name `abcdefgh123456.id` has the DID `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-0`, because it was the first name created by `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg`. However, `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` _also_ created `jude.statism.id` as its first subdomain name. The DID for `jude.statism.id` is `did:stack:v0:SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i-0`. Note that the address `SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i` encodes the same public key hash as the address `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` (the only difference between these two strings is that the first is base58check-encoded with version byte 0, and the second is encoded with version byte 63).
