---
title: Contrato de Stacking
description: Vea una lista detallada de todas las funciones y códigos de error del contrato de Stacking.
---

export { convertStackingRefToMdx as getStaticProps } from '@common/data/stacking-ref';
import { StackingErrorcodeReference, StackingFunctionReference } from '@components/stacking-ref';

## Introducción

El Stacking se implementa como un contrato inteligente utilizando Clarity. Siempre puede encontrar el identificador de contrato de Stacking usando el API de Stacks Blockchain [`v2/pox` endpoint](https://docs.hiro.so/api#operation/get_pox_info).

A continuación se muestra una lista de funciones públicas y de sólo lectura así como códigos de error que pueden ser devueltos por esos métodos.

## Funciones públicas

<StackingFunctionReference {...props.mdx.publicFunctions} />

## Funciones de solo lectura

<StackingFunctionReference {...props.mdx.readonlyFunctions} />

## Códigos de error

<StackingErrorcodeReference {...props.mdx.errorCodes} />
