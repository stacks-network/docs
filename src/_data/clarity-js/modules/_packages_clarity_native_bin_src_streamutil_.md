**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / "packages/clarity-native-bin/src/streamUtil"

# Module: "packages/clarity-native-bin/src/streamUtil"

## Index

### Classes

- [MemoryStream](../classes/_packages_clarity_native_bin_src_streamutil_.memorystream.md)

### Variables

- [pipelineAsync](_packages_clarity_native_bin_src_streamutil_.md#pipelineasync)

### Functions

- [readStream](_packages_clarity_native_bin_src_streamutil_.md#readstream)

## Variables

### pipelineAsync

• `Const` **pipelineAsync**: \_\_promisify\_\_ = promisify(pipeline)

_Defined in [packages/clarity-native-bin/src/streamUtil.ts:13](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/streamUtil.ts#L13)_

## Functions

### readStream

▸ **readStream**(`stream`: Readable, `ignoreErrors?`: boolean, `monitorCallback?`: undefined \| (data: string) => void): Promise\<Buffer>

_Defined in [packages/clarity-native-bin/src/streamUtil.ts:36](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/streamUtil.ts#L36)_

#### Parameters:

| Name               | Type                                | Default value |
| ------------------ | ----------------------------------- | ------------- |
| `stream`           | Readable                            | -             |
| `ignoreErrors`     | boolean                             | false         |
| `monitorCallback?` | undefined \| (data: string) => void | -             |

**Returns:** Promise\<Buffer>
