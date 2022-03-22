---
title: BNS Contract
description: See a detailed list of all functions and error codes of the BNS contract.
---

export { convertBNSRefToMdx as getStaticProps } from '@common/data/bns-ref' import { BNSErrorcodeReference, BNSFunctionReference } from '@components/bns-ref'

## Introduction

The [Blockchain Naming System (BNS)](/build-apps/references/bns) is implemented as a smart contract using Clarity.

Below is a list of public and read-only functions as well as error codes that can be returned by those methods.

## Public functions

<BNSFunctionReference {...props.mdx.publicFunctions} />

## Read-only functions

<BNSFunctionReference {...props.mdx.readonlyFunctions} />

## Error codes

<BNSErrorcodeReference {...props.mdx.errorCodes} />
