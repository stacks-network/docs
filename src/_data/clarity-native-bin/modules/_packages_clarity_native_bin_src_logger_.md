**[@blockstack/clarity-native-bin](../README.md)**

> [Globals](../globals.md) / "packages/clarity-native-bin/src/logger"

# Module: "packages/clarity-native-bin/src/logger"

## Index

### Interfaces

- [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md)

### Object literals

- [ConsoleLogger](_packages_clarity_native_bin_src_logger_.md#consolelogger)

## Object literals

### ConsoleLogger

▪ `Const` **ConsoleLogger**: object

_Defined in [packages/clarity-native-bin/src/logger.ts:6](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/logger.ts#L6)_

#### Properties:

| Name    | Type     | Value                                   |
| ------- | -------- | --------------------------------------- |
| `error` | function | (input: string \| Error) => void        |
| `log`   | function | (message?: undefined \| string) => void |
