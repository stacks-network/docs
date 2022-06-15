---
title: Amazon EC2
description: Utilice una plantilla para desplegar un hub de Gaia en Amazon EC2
tags:
  - tutorial
  - gaia
---

## Introducción

The template provided on this page provides an easy way to deploy a Gaia hub directly to Amazon EC2. You can use this template to deploy your own Gaia hub to your Amazon Web Services (AWS) account. Amazon EC2 is an affordable and convenient cloud computing provider. The template provides a one-click deploy for Amazon EC2 with either S3 or EBS as a storage provider.

## Prerrequisitos

This procedure uses Amazon CloudFormation to configure an EC2 cloud compute provider to run the Gaia hub service with an S3 or EBS provider for file storage. You should have access to an AWS account either through your personal account or through a corporate account. This account should have permissions to create resources.

Additionally, you must also own a domain name and be able to update the DNS records associated with that domain name.

## Pasos a seguir

### Paso 1 - Crear Stack

Use a link in the table to launch the [CloudFormation](https://console.aws.amazon.com/cloudformation/) template in the AWS region that you wish to deploy a Gaia hub.

![Create stack](/img/cloudformation-create-stack.png)

### Step 2 - Setup stack using template

You need to configure the template with the appropiate values for your hub and domain it runs on.

Select `Template is ready` and `Amazon S3 URL` and enter the following Amazon S3 URL:
```
https://s3-external-1.amazonaws.com/cf-templates-vzldibfi2mw8-us-east-1/2022160J6G-cloudformation.yaml
```

If you prefer you can instead select `Template is ready` and `Upload a template file` to upload the template file `cloudformation.yaml`.

The latest `cloudformation.yaml` file can be downloaded [here](https://raw.githubusercontent.com/stacks-network/gaia/master/deploy/cloudformation.yaml). On most browsers you can right-click on that page and click on `Save page as` to download the file. Alternatively, you can copy/paste the text into a text file called `cloudformation.yaml`.

Then click `Next`.

![Specify template](/img/cloudformation-specify-template.png)

### Step 3 - Specify stack details

Specify the stack details and then click `Next`: ![Specify template](/img/cloudformation-specify-stack-details.png)

| Field           | Value                               | Notas                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stack name      | _a unique name in your AWS account_ | e.g.: my_gaia_hub                                                                                                                                                                                                                                                                                                                                                                              |
| DomainName      | _your-domain_                       |                                                                                                                                                                                                                                                                                                                                                                                                  |
| EmailAddress    | _your email address_                |                                                                                                                                                                                                                                                                                                                                                                                                  |
| GaiaBucketName  | _S3 bucket name_                    | The template combines this name with the stack name to create a unique S3 bucket. The template ignores this field if GaiaStorageType is set to `disk`.                                                                                                                                                                                                                                           |
| GaiaStorageType | `s3` or `disk`                      | Select the GaiaStorageType of which to use as a backend for the Gaia Hub. Selecting `s3` causes the template to create an S3 bucket based on the name given in the previous field. Selecting `disk` causes the template to attach a separate EBS volume to the EC2 instance for Hub storage.                                                                                                     |
| InstaceType     | t2.micro                            | Select the instance type you want. Default value is `t2.micro`.                                                                                                                                                                                                                                                                                                                                  |
| KeyName         |                                     | In the KeyName drop-down, select an [EC2 KeyPair](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#KeyPairs:) to enable SSH access to the EC2 instance. You should download the `.pem` keyfile for this pair from the EC2 console. For more information see the [EC2 key pair documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#prepare-key-pair) |
| SSHLocation     | 0.0.0.0/0                           | Leave the SSHLocation field with the default value of `0.0.0.0/0` to enable SSH access from any IP address. If you wish to restrict SSH access to the EC2 instance to a certain IP, you can update this field.                                                                                                                                                                                   |
| SubnetId        | _subnetid_                          | Select a public subnet                                                                                                                                                                                                                                                                                                                                                                           |
| VpcId           | _vpcid_                             |                                                                                                                                                                                                                                                                                                                                                                                                  |

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