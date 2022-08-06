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

![Create stack](/img/cloudformation-create-stack.png)

### Paso 2 - Configurar stack usando la plantilla

Debe configurar la plantilla con los valores adecuados para su hub y el dominio en el que se ejecuta.

Seleccione `Template is ready` y `Amazon S3 URL` e introduzca la siguiente URL de Amazon S3:
```
https://s3-external-1.amazonaws.com/cf-templates-vzldibfi2mw8-us-east-1/2022160J6G-cloudformation.yaml
```

Si lo prefiere, puede seleccionar `Template is ready` y `Upload a template file` para subir un archivo de plantilla `cloudformation.yaml`.

El último archivo de `cloudformation.yaml` puede descargarse [aquí](https://raw.githubusercontent.com/stacks-network/gaia/master/deploy/cloudformation.yaml). En la mayoría de los navegadores puede hacer clic derecho en esa página y hacer clic en `Guardar página como` para descargar el archivo. Alternativamente, puede copiar/pegar el texto en un archivo de texto llamado `cloudformation.yaml`.

Luego haz clic en `Next`.

![Specify template](/img/cloudformation-specify-template.png)

### Paso 3 - Especificar detalles de stack

Especifique los detalles de stacks y luego haga clic en `Next`: ![Specify template](/img/cloudformation-specify-stack-details.png)

| Campo           | Valor                                | Notas                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stack name      | _un nombre único en tu cuenta AWS_   | e.j.: my_gaia_hub                                                                                                                                                                                                                                                                                                                                                                              |
| DomainName      | _tu-dominio_                         |                                                                                                                                                                                                                                                                                                                                                                                                  |
| EmailAddress    | _tu dirección de correo electrónico_ |                                                                                                                                                                                                                                                                                                                                                                                                  |
| GaiaBucketName  | _S3 bucket name_                     | La plantilla combina este nombre con el nombre del stack para crear un bucket de S3 único. La plantilla ignora este campo si GaiaStorageType está establecido en `disk`.                                                                                                                                                                                                                         |
| GaiaStorageType | `s3` o `disk`                        | Seleccione el GaiaStorageType que se utilizará como un backend para el Hub de Gaia. Seleccionar `s3` hace que la plantilla cree un bucket de S3 basado en el nombre dado en el campo anterior. Al seleccionar `disk`, la plantilla adjunta un volumen EBS independiente a la instancia EC2 para el almacenamiento del Hub.                                                                       |
| InstaceType     | t2.micro                             | Seleccione el tipo de instancia que desee. El valor predeterminado es `t2.micro`.                                                                                                                                                                                                                                                                                                                |
| KeyName         |                                      | In the KeyName drop-down, select an [EC2 KeyPair](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#KeyPairs:) to enable SSH access to the EC2 instance. You should download the `.pem` keyfile for this pair from the EC2 console. For more information see the [EC2 key pair documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#prepare-key-pair) |
| SSHLocation     | 0.0.0.0/0                            | Leave the SSHLocation field with the default value of `0.0.0.0/0` to enable SSH access from any IP address. If you wish to restrict SSH access to the EC2 instance to a certain IP, you can update this field.                                                                                                                                                                                   |
| SubnetId        | _subnetid_                           | Select a public subnet                                                                                                                                                                                                                                                                                                                                                                           |
| VpcId           | _vpcid_                              |                                                                                                                                                                                                                                                                                                                                                                                                  |

### Step 4 - Configure stack options

Configure any stack options that fit your desired setup and click `Next`. All these fields are optional.

![Specify template](/img/cloudformation-stack-options.png)

### Step 5 - Review

Review the configuration of your Gaia hub, select the checkbox to acknowledge that AWS may create IAM resources with custom names and click on `Create stack`.

![Specify template](/img/cloudformation-iam-resources.png)

### Step 6 - Retrieve the public IP of your Gaia hub

Your stack can take several minutes to launch. You can monitor the Events tab of your hub to review the current progress of the launch. When the launch is complete, the Outputs tab displays information about the hub. Select the PublicIP and copy it to configure your domain name.

Create an `A` DNS record pointing to the given IP in your domain.

Wait a few minutes for the DNS record to propagate, and your should be able to access your Gaia hub with SSH.

## Accessing your Gaia hub with SSH

To SSH into your Gaia hub EC2 host directly, you must have the keyfile used in container creation. Access the host with the following command in your terminal:

```bash
ssh -i <your keyfile.pem> admin@<public_ip_address>
```

:::tip If you can only access SSH with the IP but not with the DNS name and you wish to do so, you can optionally activate it by following these steps:

    Open your [AWS Console](https://console.aws.amazon.com)
    Click on `Service` -> VPC
    Open Your VPCs
    Select your VPC connected to your Gaia Hub
    Click `Actions` -> `Edit DNS Hostnames` -> Change `DNS hostnames` to `Enable`
:::
## Graphical representation of the cloudformation template

![](/img/cloudformation-gaia-template1-designer.png)