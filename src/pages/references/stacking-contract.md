---
title: Stacking Contract
description: See a detailed list of all functions and error codes of the Stacking contract.
---

export { convertStackingRefToMdx as getStaticProps } from '@common/data/stacking-ref'
import { StackingErrorcodeReference, StackingFunctionReference } from '@components/stacking-ref'

Stacking is implemented as a smart contract using Clarity. On the testnet, you can always find the Stacking contract by this contract identifier: `ST000000000000000000002AMW42H.pox`.

Below is a list of public and read-only functions as well as error codes that can be returned by those methods.

## Public functions

<StackingFunctionReference {...props.mdx.publicFunctions} />

## Read-only functions

<StackingFunctionReference {...props.mdx.readonlyFunctions} />

## Error codes

<StackingErrorcodeReference {...props.mdx.errorCodes} />
