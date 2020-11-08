**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "auth/src/protocolEchoDetection"

# Module: "auth/src/protocolEchoDetection"

## Index

### Variables

- [AUTH_CONTINUATION_PARAM](_auth_src_protocolechodetection_.md#auth_continuation_param)
- [ECHO_REPLY_PARAM](_auth_src_protocolechodetection_.md#echo_reply_param)
- [GLOBAL_DETECTION_CACHE_KEY](_auth_src_protocolechodetection_.md#global_detection_cache_key)

### Functions

- [getQueryStringParams](_auth_src_protocolechodetection_.md#getquerystringparams)

## Variables

### AUTH_CONTINUATION_PARAM

• `Const` **AUTH_CONTINUATION_PARAM**: \"authContinuation\" = "authContinuation"

_Defined in [packages/auth/src/protocolEchoDetection.ts:10](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/protocolEchoDetection.ts#L10)_

---

### ECHO_REPLY_PARAM

• `Const` **ECHO_REPLY_PARAM**: \"echoReply\" = "echoReply"

_Defined in [packages/auth/src/protocolEchoDetection.ts:9](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/protocolEchoDetection.ts#L9)_

---

### GLOBAL_DETECTION_CACHE_KEY

• `Const` **GLOBAL_DETECTION_CACHE_KEY**: \"\_blockstackDidCheckEchoReply\" = "\_blockstackDidCheckEchoReply"

_Defined in [packages/auth/src/protocolEchoDetection.ts:8](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/protocolEchoDetection.ts#L8)_

This logic is in a separate file with no dependencies so that it can be
loaded and executed as soon as possible to fulfill the purpose of the protocol
detection technique. The effectiveness of this is obviously subject to how web
apps bundle/consume the blockstack.js lib.

## Functions

### getQueryStringParams

▸ **getQueryStringParams**(`query`: string): Record\<string, string>

_Defined in [packages/auth/src/protocolEchoDetection.ts:13](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/protocolEchoDetection.ts#L13)_

#### Parameters:

| Name    | Type   |
| ------- | ------ |
| `query` | string |

**Returns:** Record\<string, string>
