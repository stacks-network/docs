---
title: Amazon EC2
description: Utilice una plantilla para desplegar un hub de Gaia en Amazon EC2
tags:
  - tutorial
  - gaia
---

## Introducción

La plantilla proporcionada en esta página proporciona una forma fácil de desplegar un hub de Gaia directamente en Amazon EC2. Puede utilizar esta plantilla para desplegar su propio hub de Gaia en su cuenta de Amazon Web Services (AWS). Amazon EC2 es un proveedor de computación en la nube asequible y conveniente. La plantilla proporciona un despliegue de un solo clic para Amazon EC2 con S3 o EBS como proveedor de almacenamiento.

## Pre requisitos

Este procedimiento utiliza Amazon CloudFormation para configurar un proveedor de computación en la nube EC2 para ejecutar el servicio de Hub de Gaia con un proveedor S3 o EBS para el almacenamiento de archivos. Usted debe tener acceso a una cuenta AWS ya sea a través de su cuenta personal o a través de una cuenta corporativa. Esta cuenta debe tener permisos para crear recursos.

Además, también debe poseer un nombre de dominio y ser capaz de actualizar los registros DNS asociados con ese nombre de dominio.

## Pasos a seguir

### Paso 1 - Crear Stack

Utilice un enlace en la tabla para lanzar la plantilla [CloudFormation](https://console.aws.amazon.com/cloudformation/) en la región de AWS en donde desea desplegar un hub de Gaia.

![Crear stack](/img/cloudformation-create-stack.png)

### Paso 2 - Configurar stack usando la plantilla

Debe configurar la plantilla con los valores adecuados para su hub y el dominio en el que se ejecuta.

Seleccione `Template is ready` y `Amazon S3 URL` e introduzca la siguiente URL de Amazon S3:
```
https://s3-external-1.amazonaws.com/cf-templates-vzldibfi2mw8-us-east-1/2022160J6G-cloudformation.yaml
```

Si lo prefiere, puede seleccionar `Template is ready` y `Upload a template file` para subir un archivo de plantilla `cloudformation.yaml`.

El último archivo de `cloudformation.yaml` puede descargarse [aquí](https://raw.githubusercontent.com/stacks-network/gaia/master/deploy/cloudformation.yaml). En la mayoría de los navegadores puede hacer clic derecho en esa página y hacer clic en `Guardar página como` para descargar el archivo. Alternativamente, puede copiar/pegar el texto en un archivo de texto llamado `cloudformation.yaml`.

Luego haz clic en `Next`.

![Especificar plantilla](/img/cloudformation-specify-template.png)

### Paso 3 - Especificar detalles de stack

Especifique los detalles de stacks y luego haga clic en `Next`: ![Especificar plantilla](/img/cloudformation-specify-stack-details.png)

| Campo           | Valor                                | Notas                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack name      | _un nombre único en tu cuenta AWS_   | e.j.: my_gaia_hub                                                                                                                                                                                                                                                                                                                                                                                                           |
| DomainName      | _tu-dominio_                         |                                                                                                                                                                                                                                                                                                                                                                                                                               |
| EmailAddress    | _tu dirección de correo electrónico_ |                                                                                                                                                                                                                                                                                                                                                                                                                               |
| GaiaBucketName  | _S3 bucket name_                     | La plantilla combina este nombre con el nombre del stack para crear un bucket de S3 único. La plantilla ignora este campo si GaiaStorageType está establecido en `disk`.                                                                                                                                                                                                                                                      |
| GaiaStorageType | `s3` o `disk`                        | Seleccione el GaiaStorageType que se utilizará como un backend para el Hub de Gaia. Seleccionar `s3` hace que la plantilla cree un bucket de S3 basado en el nombre dado en el campo anterior. Al seleccionar `disk`, la plantilla adjunta un volumen EBS independiente a la instancia EC2 para el almacenamiento del Hub.                                                                                                    |
| InstaceType     | t2.micro                             | Seleccione el tipo de instancia que desee. El valor predeterminado es `t2.micro`.                                                                                                                                                                                                                                                                                                                                             |
| KeyName         |                                      | En la lista desplegable KeyName selecciona un [EC2 KeyPair](https://console. aws. amazon. com/ec2/v2/home? region=us-east-1#KeyPairs:) para habilitar el acceso SSH a la instancia EC2. Deberías descargar el archivo keyfile `.pem` para este par desde la consola EC2. Para más información vea la [documentación de EC2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#prepare-key-pair) |
| SSHLocation     | 0.0.0.0/0                            | Deje el campo SSHLocation con el valor predeterminado de `0.0.0.0/0` para habilitar el acceso SSH desde cualquier dirección IP. Si desea restringir el acceso SSH a la instancia de EC2 a una determinada IP, puede actualizar este campo.                                                                                                                                                                                    |
| SubnetId        | _subnetId_                           | Seleccione una subred pública                                                                                                                                                                                                                                                                                                                                                                                                 |
| VpcId           | _vpcid_                              |                                                                                                                                                                                                                                                                                                                                                                                                                               |

### Paso 4 - Configurar las opciones de stack

Configure cualquier opción de stack que se ajuste a la configuración deseada y haga clic en `Next`. Todos estos campos son opcionales.

![Especificar plantilla](/img/cloudformation-stack-options.png)

### Paso 5 - Revisión

Revise la configuración de su hub Gaia, selecciona la casilla de verificación para reconocer que AWS puede crear recursos IAM con nombres personalizados y haz clic en `Create stack`.

![Especificar plantilla](/img/cloudformation-iam-resources.png)

### Paso 6 - Recuperar la IP pública de tu Hub de Gaia

Tu stack puede tardar varios minutos en lanzarse. Puede monitorear la pestaña Eventos de su hub para revisar el progreso actual del lanzamiento. Cuando el lanzamiento se haya completado, la pestaña Salidas muestra información sobre el hub. Seleccione PublicIP y cópielo para configurar su nombre de dominio.

Crea un registro DNS `A` apuntando a la IP dada en tu dominio.

Espere unos minutos para que el registro DNS se propague, y debería ser capaz de acceder al hub de Gaia con SSH.

## Accediendo a tu hub de Gaia con SSH

Para que el SSH entre directamente en el host de tu hub EC2 de Gaia, debes tener el keyfile usado en la creación de contenedores. Accede al host con el siguiente comando en tu terminal:

```bash
ssh -i <your keyfile.pem> admin@<public_ip_address>
```

:::tip Si sólo puede acceder a SSH con la IP pero no con el nombre DNS y desea hacerlo, puedes activarlo siguiendo estos pasos:

    Abre tu [Consola AWS](https://console.aws.amazon. om)
    Haga clic en `Servicio` -> VPC
    Abra sus VPCs
    Seleccione su VPC conectado a su Gaia Hub
    Haga clic en `Acciones` -> `Editar nombres de host DNS` -> Cambie `nombres de host DNS` a `Activar`
:::
## Representación gráfica de la plantilla de cloudformation

![](/img/cloudformation-gaia-template1-designer.png)