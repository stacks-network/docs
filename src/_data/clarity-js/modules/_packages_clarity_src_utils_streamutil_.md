**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / "packages/clarity/src/utils/streamUtil"

# Module: "packages/clarity/src/utils/streamUtil"

## Index

### Classes

- [MemoryStream](../classes/_packages_clarity_src_utils_streamutil_.memorystream.md)

### Variables

- [pipelineAsync](_packages_clarity_src_utils_streamutil_.md#pipelineasync)

### Functions

- [readStream](_packages_clarity_src_utils_streamutil_.md#readstream)

## Variables

### pipelineAsync

• `Const` **pipelineAsync**: \_\_promisify\_\_ = promisify(pipeline)

_Defined in [packages/clarity/src/utils/streamUtil.ts:4](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/utils/streamUtil.ts#L4)_

## Functions

### readStream

▸ **readStream**(`stream`: Readable, `ignoreErrors?`: boolean): Promise\<Buffer>

_Defined in [packages/clarity/src/utils/streamUtil.ts:27](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/utils/streamUtil.ts#L27)_

#### Parameters:

| Name           | Type     | Default value |
| -------------- | -------- | ------------- |
| `stream`       | Readable | -             |
| `ignoreErrors` | boolean  | false         |

**Returns:** Promise\<Buffer>
