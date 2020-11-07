**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/providers/registry"](../modules/_packages_clarity_src_providers_registry_.md) / ProviderRegistry

# Class: ProviderRegistry

## Hierarchy

- **ProviderRegistry**

## Index

### Constructors

- [constructor](_packages_clarity_src_providers_registry_.providerregistry.md#constructor)

### Properties

- [availableProviders](_packages_clarity_src_providers_registry_.providerregistry.md#availableproviders)
- [defaultLoadCachedPromise](_packages_clarity_src_providers_registry_.providerregistry.md#defaultloadcachedpromise)

### Methods

- [createProvider](_packages_clarity_src_providers_registry_.providerregistry.md#createprovider)
- [registerProvider](_packages_clarity_src_providers_registry_.providerregistry.md#registerprovider)
- [tryLoadDefaultBinProvider](_packages_clarity_src_providers_registry_.providerregistry.md#tryloaddefaultbinprovider)

## Constructors

### constructor

\+ `Private`**new ProviderRegistry**(): [ProviderRegistry](_packages_clarity_src_providers_registry_.providerregistry.md)

_Defined in [packages/clarity/src/providers/registry.ts:90](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/registry.ts#L90)_

**Returns:** [ProviderRegistry](_packages_clarity_src_providers_registry_.providerregistry.md)

## Properties

### availableProviders

▪ `Static` **availableProviders**: [ProviderConstructor](../interfaces/_packages_clarity_src_core_provider_.providerconstructor.md)[] = []

_Defined in [packages/clarity/src/providers/registry.ts:5](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/registry.ts#L5)_

---

### defaultLoadCachedPromise

▪ `Static` **defaultLoadCachedPromise**: Promise\<false \| [ProviderConstructor](../interfaces/_packages_clarity_src_core_provider_.providerconstructor.md)> \| undefined

_Defined in [packages/clarity/src/providers/registry.ts:8](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/registry.ts#L8)_

## Methods

### createProvider

▸ `Static`**createProvider**(`noWarn?`: boolean): Promise\<[Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)>

_Defined in [packages/clarity/src/providers/registry.ts:70](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/registry.ts#L70)_

Creates an instance of the last registered provider.

#### Parameters:

| Name     | Type    | Default value | Description                                                             |
| -------- | ------- | ------------- | ----------------------------------------------------------------------- |
| `noWarn` | boolean | false         | Set to true to disable warning log about multiple registered providers. |

**Returns:** Promise\<[Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)>

---

### registerProvider

▸ `Static`**registerProvider**(`providerConstructor`: [ProviderConstructor](../interfaces/_packages_clarity_src_core_provider_.providerconstructor.md), `clearExisting?`: boolean): void

_Defined in [packages/clarity/src/providers/registry.ts:10](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/registry.ts#L10)_

#### Parameters:

| Name                  | Type                                                                                             | Default value |
| --------------------- | ------------------------------------------------------------------------------------------------ | ------------- |
| `providerConstructor` | [ProviderConstructor](../interfaces/_packages_clarity_src_core_provider_.providerconstructor.md) | -             |
| `clearExisting`       | boolean                                                                                          | false         |

**Returns:** void

---

### tryLoadDefaultBinProvider

▸ `Static`**tryLoadDefaultBinProvider**(): Promise\<false \| [ProviderConstructor](../interfaces/_packages_clarity_src_core_provider_.providerconstructor.md)>

_Defined in [packages/clarity/src/providers/registry.ts:24](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/registry.ts#L24)_

Attempt loading the default `clarity-native-bin` module. This module must be set as
a `peerDependency` and dynamically imported to avoid issues with circular dependencies,
and allow consuming libs to specify their own provider.

**Returns:** Promise\<false \| [ProviderConstructor](../interfaces/_packages_clarity_src_core_provider_.providerconstructor.md)>

Promise resolves to a `ProviderConstructor` if loaded successfully, or `false`
if the module is not available.
