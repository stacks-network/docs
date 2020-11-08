**[@blockstack/clarity-native-bin](../README.md)**

> [Globals](../globals.md) / ["packages/clarity-native-bin/src/streamUtil"](../modules/_packages_clarity_native_bin_src_streamutil_.md) / MemoryStream

# Class: MemoryStream

## Hierarchy

- Writable

  ↳ **MemoryStream**

## Implements

- WritableStream

## Index

### Constructors

- [constructor](_packages_clarity_native_bin_src_streamutil_.memorystream.md#constructor)

### Properties

- [buffers](_packages_clarity_native_bin_src_streamutil_.memorystream.md#buffers)
- [writable](_packages_clarity_native_bin_src_streamutil_.memorystream.md#writable)
- [writableHighWaterMark](_packages_clarity_native_bin_src_streamutil_.memorystream.md#writablehighwatermark)
- [writableLength](_packages_clarity_native_bin_src_streamutil_.memorystream.md#writablelength)
- [defaultMaxListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#defaultmaxlisteners)

### Methods

- [\_destroy](_packages_clarity_native_bin_src_streamutil_.memorystream.md#_destroy)
- [\_final](_packages_clarity_native_bin_src_streamutil_.memorystream.md#_final)
- [\_write](_packages_clarity_native_bin_src_streamutil_.memorystream.md#_write)
- [\_writev](_packages_clarity_native_bin_src_streamutil_.memorystream.md#_writev)
- [addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)
- [cork](_packages_clarity_native_bin_src_streamutil_.memorystream.md#cork)
- [destroy](_packages_clarity_native_bin_src_streamutil_.memorystream.md#destroy)
- [emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)
- [end](_packages_clarity_native_bin_src_streamutil_.memorystream.md#end)
- [eventNames](_packages_clarity_native_bin_src_streamutil_.memorystream.md#eventnames)
- [getData](_packages_clarity_native_bin_src_streamutil_.memorystream.md#getdata)
- [getMaxListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#getmaxlisteners)
- [listenerCount](_packages_clarity_native_bin_src_streamutil_.memorystream.md#listenercount)
- [listeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#listeners)
- [off](_packages_clarity_native_bin_src_streamutil_.memorystream.md#off)
- [on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)
- [once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)
- [pipe](_packages_clarity_native_bin_src_streamutil_.memorystream.md#pipe)
- [prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)
- [prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)
- [rawListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#rawlisteners)
- [removeAllListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removealllisteners)
- [removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)
- [setDefaultEncoding](_packages_clarity_native_bin_src_streamutil_.memorystream.md#setdefaultencoding)
- [setMaxListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#setmaxlisteners)
- [uncork](_packages_clarity_native_bin_src_streamutil_.memorystream.md#uncork)
- [write](_packages_clarity_native_bin_src_streamutil_.memorystream.md#write)
- [listenerCount](_packages_clarity_native_bin_src_streamutil_.memorystream.md#listenercount)

## Constructors

### constructor

\+ **new MemoryStream**(`opts?`: WritableOptions): [MemoryStream](_packages_clarity_native_bin_src_streamutil_.memorystream.md)

_Overrides void_

_Defined in [packages/clarity-native-bin/src/streamUtil.ts:16](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/streamUtil.ts#L16)_

#### Parameters:

| Name    | Type            |
| ------- | --------------- |
| `opts?` | WritableOptions |

**Returns:** [MemoryStream](_packages_clarity_native_bin_src_streamutil_.memorystream.md)

## Properties

### buffers

• **buffers**: Buffer[] = []

_Defined in [packages/clarity-native-bin/src/streamUtil.ts:16](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/streamUtil.ts#L16)_

---

### writable

• **writable**: boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[writable](_packages_clarity_native_bin_src_streamutil_.memorystream.md#writable)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:109_

---

### writableHighWaterMark

• `Readonly` **writableHighWaterMark**: number

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[writableHighWaterMark](_packages_clarity_native_bin_src_streamutil_.memorystream.md#writablehighwatermark)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:110_

---

### writableLength

• `Readonly` **writableLength**: number

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[writableLength](_packages_clarity_native_bin_src_streamutil_.memorystream.md#writablelength)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:111_

---

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: number

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[defaultMaxListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#defaultmaxlisteners)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:18_

## Methods

### \_destroy

▸ **\_destroy**(`error`: Error \| null, `callback`: (error: Error \| null) => void): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[\_destroy](_packages_clarity_native_bin_src_streamutil_.memorystream.md#_destroy)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:115_

#### Parameters:

| Name       | Type                           |
| ---------- | ------------------------------ |
| `error`    | Error \| null                  |
| `callback` | (error: Error \| null) => void |

**Returns:** void

---

### \_final

▸ **\_final**(`callback`: (error?: Error \| null) => void): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[\_final](_packages_clarity_native_bin_src_streamutil_.memorystream.md#_final)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:116_

#### Parameters:

| Name       | Type                            |
| ---------- | ------------------------------- |
| `callback` | (error?: Error \| null) => void |

**Returns:** void

---

### \_write

▸ **\_write**(`chunk`: any, `encoding`: string, `callback`: (error?: Error \| null) => void): void

_Overrides void_

_Defined in [packages/clarity-native-bin/src/streamUtil.ts:20](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/streamUtil.ts#L20)_

#### Parameters:

| Name       | Type                            |
| ---------- | ------------------------------- |
| `chunk`    | any                             |
| `encoding` | string                          |
| `callback` | (error?: Error \| null) => void |

**Returns:** void

---

### \_writev

▸ `Optional`**\_writev**(`chunks`: Array\<{ chunk: any ; encoding: string }>, `callback`: (error?: Error \| null) => void): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[\_writev](_packages_clarity_native_bin_src_streamutil_.memorystream.md#_writev)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:114_

#### Parameters:

| Name       | Type                                      |
| ---------- | ----------------------------------------- |
| `chunks`   | Array\<{ chunk: any ; encoding: string }> |
| `callback` | (error?: Error \| null) => void           |

**Returns:** void

---

### addListener

▸ **addListener**(`event`: \"close\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:137_

Event emitter
The defined events on documents including:

1. close
2. drain
3. error
4. finish
5. pipe
6. unpipe

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"close\"  |
| `listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: \"drain\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:138_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"drain\"  |
| `listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: \"error\", `listener`: (err: Error) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:139_

#### Parameters:

| Name       | Type                 |
| ---------- | -------------------- |
| `event`    | \"error\"            |
| `listener` | (err: Error) => void |

**Returns:** this

▸ **addListener**(`event`: \"finish\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:140_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"finish\" |
| `listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: \"pipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:141_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"pipe\"                |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **addListener**(`event`: \"unpipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:142_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"unpipe\"              |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **addListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[addListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#addlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:143_

#### Parameters:

| Name       | Type                     |
| ---------- | ------------------------ |
| `event`    | string \| symbol         |
| `listener` | (...args: any[]) => void |

**Returns:** this

---

### cork

▸ **cork**(): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[cork](_packages_clarity_native_bin_src_streamutil_.memorystream.md#cork)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:123_

**Returns:** void

---

### destroy

▸ **destroy**(`error?`: Error): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[destroy](_packages_clarity_native_bin_src_streamutil_.memorystream.md#destroy)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:125_

#### Parameters:

| Name     | Type  |
| -------- | ----- |
| `error?` | Error |

**Returns:** void

---

### emit

▸ **emit**(`event`: \"close\"): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:145_

#### Parameters:

| Name    | Type      |
| ------- | --------- |
| `event` | \"close\" |

**Returns:** boolean

▸ **emit**(`event`: \"drain\"): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:146_

#### Parameters:

| Name    | Type      |
| ------- | --------- |
| `event` | \"drain\" |

**Returns:** boolean

▸ **emit**(`event`: \"error\", `err`: Error): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:147_

#### Parameters:

| Name    | Type      |
| ------- | --------- |
| `event` | \"error\" |
| `err`   | Error     |

**Returns:** boolean

▸ **emit**(`event`: \"finish\"): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:148_

#### Parameters:

| Name    | Type       |
| ------- | ---------- |
| `event` | \"finish\" |

**Returns:** boolean

▸ **emit**(`event`: \"pipe\", `src`: Readable): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:149_

#### Parameters:

| Name    | Type     |
| ------- | -------- |
| `event` | \"pipe\" |
| `src`   | Readable |

**Returns:** boolean

▸ **emit**(`event`: \"unpipe\", `src`: Readable): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:150_

#### Parameters:

| Name    | Type       |
| ------- | ---------- |
| `event` | \"unpipe\" |
| `src`   | Readable   |

**Returns:** boolean

▸ **emit**(`event`: string \| symbol, ...`args`: any[]): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[emit](_packages_clarity_native_bin_src_streamutil_.memorystream.md#emit)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:151_

#### Parameters:

| Name      | Type             |
| --------- | ---------------- |
| `event`   | string \| symbol |
| `...args` | any[]            |

**Returns:** boolean

---

### end

▸ **end**(`cb?`: undefined \| () => void): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[end](_packages_clarity_native_bin_src_streamutil_.memorystream.md#end)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:120_

#### Parameters:

| Name  | Type                    |
| ----- | ----------------------- |
| `cb?` | undefined \| () => void |

**Returns:** void

▸ **end**(`chunk`: any, `cb?`: undefined \| () => void): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[end](_packages_clarity_native_bin_src_streamutil_.memorystream.md#end)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:121_

#### Parameters:

| Name    | Type                    |
| ------- | ----------------------- |
| `chunk` | any                     |
| `cb?`   | undefined \| () => void |

**Returns:** void

▸ **end**(`chunk`: any, `encoding?`: undefined \| string, `cb?`: undefined \| () => void): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[end](_packages_clarity_native_bin_src_streamutil_.memorystream.md#end)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:122_

#### Parameters:

| Name        | Type                    |
| ----------- | ----------------------- |
| `chunk`     | any                     |
| `encoding?` | undefined \| string     |
| `cb?`       | undefined \| () => void |

**Returns:** void

---

### eventNames

▸ **eventNames**(): Array\<string \| symbol>

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[eventNames](_packages_clarity_native_bin_src_streamutil_.memorystream.md#eventnames)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:33_

**Returns:** Array\<string \| symbol>

---

### getData

▸ **getData**(): Buffer

_Defined in [packages/clarity-native-bin/src/streamUtil.ts:28](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/streamUtil.ts#L28)_

**Returns:** Buffer

---

### getMaxListeners

▸ **getMaxListeners**(): number

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[getMaxListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#getmaxlisteners)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:29_

**Returns:** number

---

### listenerCount

▸ **listenerCount**(`type`: string \| symbol): number

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[listenerCount](_packages_clarity_native_bin_src_streamutil_.memorystream.md#listenercount)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:34_

#### Parameters:

| Name   | Type             |
| ------ | ---------------- |
| `type` | string \| symbol |

**Returns:** number

---

### listeners

▸ **listeners**(`event`: string \| symbol): Function[]

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[listeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#listeners)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:30_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `event` | string \| symbol |

**Returns:** Function[]

---

### off

▸ **off**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[off](_packages_clarity_native_bin_src_streamutil_.memorystream.md#off)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:26_

#### Parameters:

| Name       | Type                     |
| ---------- | ------------------------ |
| `event`    | string \| symbol         |
| `listener` | (...args: any[]) => void |

**Returns:** this

---

### on

▸ **on**(`event`: \"close\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:153_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"close\"  |
| `listener` | () => void |

**Returns:** this

▸ **on**(`event`: \"drain\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:154_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"drain\"  |
| `listener` | () => void |

**Returns:** this

▸ **on**(`event`: \"error\", `listener`: (err: Error) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:155_

#### Parameters:

| Name       | Type                 |
| ---------- | -------------------- |
| `event`    | \"error\"            |
| `listener` | (err: Error) => void |

**Returns:** this

▸ **on**(`event`: \"finish\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:156_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"finish\" |
| `listener` | () => void |

**Returns:** this

▸ **on**(`event`: \"pipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:157_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"pipe\"                |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **on**(`event`: \"unpipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:158_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"unpipe\"              |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **on**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[on](_packages_clarity_native_bin_src_streamutil_.memorystream.md#on)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:159_

#### Parameters:

| Name       | Type                     |
| ---------- | ------------------------ |
| `event`    | string \| symbol         |
| `listener` | (...args: any[]) => void |

**Returns:** this

---

### once

▸ **once**(`event`: \"close\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:161_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"close\"  |
| `listener` | () => void |

**Returns:** this

▸ **once**(`event`: \"drain\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:162_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"drain\"  |
| `listener` | () => void |

**Returns:** this

▸ **once**(`event`: \"error\", `listener`: (err: Error) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:163_

#### Parameters:

| Name       | Type                 |
| ---------- | -------------------- |
| `event`    | \"error\"            |
| `listener` | (err: Error) => void |

**Returns:** this

▸ **once**(`event`: \"finish\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:164_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"finish\" |
| `listener` | () => void |

**Returns:** this

▸ **once**(`event`: \"pipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:165_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"pipe\"                |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **once**(`event`: \"unpipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:166_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"unpipe\"              |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **once**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[once](_packages_clarity_native_bin_src_streamutil_.memorystream.md#once)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:167_

#### Parameters:

| Name       | Type                     |
| ---------- | ------------------------ |
| `event`    | string \| symbol         |
| `listener` | (...args: any[]) => void |

**Returns:** this

---

### pipe

▸ **pipe**\<T>(`destination`: T, `options?`: undefined \| { end?: undefined \| false \| true }): T

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[pipe](_packages_clarity_native_bin_src_streamutil_.memorystream.md#pipe)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:5_

#### Type parameters:

| Name | Type           |
| ---- | -------------- |
| `T`  | WritableStream |

#### Parameters:

| Name          | Type                                              |
| ------------- | ------------------------------------------------- |
| `destination` | T                                                 |
| `options?`    | undefined \| { end?: undefined \| false \| true } |

**Returns:** T

---

### prependListener

▸ **prependListener**(`event`: \"close\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:169_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"close\"  |
| `listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: \"drain\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:170_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"drain\"  |
| `listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: \"error\", `listener`: (err: Error) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:171_

#### Parameters:

| Name       | Type                 |
| ---------- | -------------------- |
| `event`    | \"error\"            |
| `listener` | (err: Error) => void |

**Returns:** this

▸ **prependListener**(`event`: \"finish\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:172_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"finish\" |
| `listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: \"pipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:173_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"pipe\"                |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **prependListener**(`event`: \"unpipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:174_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"unpipe\"              |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **prependListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependlistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:175_

#### Parameters:

| Name       | Type                     |
| ---------- | ------------------------ |
| `event`    | string \| symbol         |
| `listener` | (...args: any[]) => void |

**Returns:** this

---

### prependOnceListener

▸ **prependOnceListener**(`event`: \"close\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:177_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"close\"  |
| `listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"drain\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:178_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"drain\"  |
| `listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"error\", `listener`: (err: Error) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:179_

#### Parameters:

| Name       | Type                 |
| ---------- | -------------------- |
| `event`    | \"error\"            |
| `listener` | (err: Error) => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"finish\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:180_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"finish\" |
| `listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"pipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:181_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"pipe\"                |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"unpipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:182_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"unpipe\"              |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **prependOnceListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[prependOnceListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#prependoncelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:183_

#### Parameters:

| Name       | Type                     |
| ---------- | ------------------------ |
| `event`    | string \| symbol         |
| `listener` | (...args: any[]) => void |

**Returns:** this

---

### rawListeners

▸ **rawListeners**(`event`: string \| symbol): Function[]

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[rawListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#rawlisteners)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:31_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `event` | string \| symbol |

**Returns:** Function[]

---

### removeAllListeners

▸ **removeAllListeners**(`event?`: string \| symbol): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeAllListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removealllisteners)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:27_

#### Parameters:

| Name     | Type             |
| -------- | ---------------- |
| `event?` | string \| symbol |

**Returns:** this

---

### removeListener

▸ **removeListener**(`event`: \"close\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:185_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"close\"  |
| `listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: \"drain\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:186_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"drain\"  |
| `listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: \"error\", `listener`: (err: Error) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:187_

#### Parameters:

| Name       | Type                 |
| ---------- | -------------------- |
| `event`    | \"error\"            |
| `listener` | (err: Error) => void |

**Returns:** this

▸ **removeListener**(`event`: \"finish\", `listener`: () => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:188_

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `event`    | \"finish\" |
| `listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: \"pipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:189_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"pipe\"                |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **removeListener**(`event`: \"unpipe\", `listener`: (src: Readable) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:190_

#### Parameters:

| Name       | Type                    |
| ---------- | ----------------------- |
| `event`    | \"unpipe\"              |
| `listener` | (src: Readable) => void |

**Returns:** this

▸ **removeListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[removeListener](_packages_clarity_native_bin_src_streamutil_.memorystream.md#removelistener)\_

_Overrides void_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:191_

#### Parameters:

| Name       | Type                     |
| ---------- | ------------------------ |
| `event`    | string \| symbol         |
| `listener` | (...args: any[]) => void |

**Returns:** this

---

### setDefaultEncoding

▸ **setDefaultEncoding**(`encoding`: string): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[setDefaultEncoding](_packages_clarity_native_bin_src_streamutil_.memorystream.md#setdefaultencoding)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:119_

#### Parameters:

| Name       | Type   |
| ---------- | ------ |
| `encoding` | string |

**Returns:** this

---

### setMaxListeners

▸ **setMaxListeners**(`n`: number): this

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[setMaxListeners](_packages_clarity_native_bin_src_streamutil_.memorystream.md#setmaxlisteners)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:28_

#### Parameters:

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** this

---

### uncork

▸ **uncork**(): void

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[uncork](_packages_clarity_native_bin_src_streamutil_.memorystream.md#uncork)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:124_

**Returns:** void

---

### write

▸ **write**(`chunk`: any, `cb?`: undefined \| (error: Error \| null \| undefined) => void): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[write](_packages_clarity_native_bin_src_streamutil_.memorystream.md#write)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:117_

#### Parameters:

| Name    | Type                                                     |
| ------- | -------------------------------------------------------- |
| `chunk` | any                                                      |
| `cb?`   | undefined \| (error: Error \| null \| undefined) => void |

**Returns:** boolean

▸ **write**(`chunk`: any, `encoding?`: undefined \| string, `cb?`: undefined \| (error: Error \| null \| undefined) => void): boolean

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[write](_packages_clarity_native_bin_src_streamutil_.memorystream.md#write)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/stream.d.ts:118_

#### Parameters:

| Name        | Type                                                     |
| ----------- | -------------------------------------------------------- |
| `chunk`     | any                                                      |
| `encoding?` | undefined \| string                                      |
| `cb?`       | undefined \| (error: Error \| null \| undefined) => void |

**Returns:** boolean

---

### listenerCount

▸ `Static`**listenerCount**(`emitter`: EventEmitter, `event`: string \| symbol): number

_Inherited from [MemoryStream](\_packages_clarity_native_bin_src_streamutil_.memorystream.md).[listenerCount](_packages_clarity_native_bin_src_streamutil_.memorystream.md#listenercount)\_

_Defined in packages/clarity-native-bin/node_modules/@types/node/events.d.ts:17_

**`deprecated`** since v4.0.0

#### Parameters:

| Name      | Type             |
| --------- | ---------------- |
| `emitter` | EventEmitter     |
| `event`   | string \| symbol |

**Returns:** number
