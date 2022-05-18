---
title: Contrato BNS
description: Vea una lista detallada de todas las funciones y códigos de error del contrato BNS.
---

export { convertBNSRefToMdx as getStaticProps } from '@common/data/bns-ref';
import { BNSErrorcodeReference, BNSFunctionReference } from '@components/bns-ref';

## Introducción

El [Blockchain Naming System (BNS)](/build-apps/references/bns) se implementa como un contrato inteligente usando Clarity.

A continuación se muestra una lista de funciones públicas y de sólo lectura así como códigos de error que pueden ser devueltos por esos métodos.

## Funciones públicas

<BNSFunctionReference {...props.mdx.publicFunctions} />

## Funciones de solo lectura

<BNSFunctionReference {...props.mdx.readonlyFunctions} />

## Códigos de error

<BNSErrorcodeReference {...props.mdx.errorCodes} />
