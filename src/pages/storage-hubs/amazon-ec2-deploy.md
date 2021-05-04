---
title: Deploy on Amazon EC2
description: Use a template to deploy a Gaia hub on Amazon EC2
---

## Introduction

The template provided on this page provides an easy way to deploy a Gaia hub directly to Amazon EC2. You can use this
template to deploy your own Gaia hub to your Amazon Web Services account. Amazon EC2 is an affordable and convenient
cloud computing provider. This template uses Amazon EC2 instance together with an S3 provider for file storage.

## Template

| Template name            | Description                                                   | Launch                                                               |
| ------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| Gaia Hub EC2 (us-west-2) | Deploys a Gaia hub service on EC2 with an S3 storage provider | [![](/images/cloudformation-launch-stack-button.png)][ec2-us-west-2] |

[ec2-us-west-2]: https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=Gaia&templateURL=https://cf-templates-18jq0t04gve7c-us-west-2.s3-us-west-2.amazonaws.com/2021124ByT-cf.yaml
