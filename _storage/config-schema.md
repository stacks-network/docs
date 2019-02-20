---
layout: storage
permalink: /:collection/:path.html
---
# Hub configuration parameters

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "servername": { "type": "string" },
    "port": { "type": "integer" },
    "driver": { "type": "string" },
    "bucket": { "type": "string" },
    "readURL": { "type": "string" },
    "requireCorrectHubUrl": { "type": "string" },
    "awsCredentials": {
      "type": "object",
      "properties": {
        "endpoint": { "type": "string"},
        "accessKeyId": { "type": "string"},
        "secretAccessKey": { "type": "string"}
      },
      "required": [
        "endpoint",
        "accessKeyId",
        "secretAccessKey"
      ]
    },
    "proofsConfig": {
      "type": "object",
      "properties": {
        "proofsRequired": { "type": "string"}
      },
      "required": [
        "proofsRequired"
      ]
    },
    "azCredentials": {
      "type": "object",
      "properties": {
        "accountName": { "type": "string"},
        "accountKey": { "type": "string"}
      },
      "required": [
        "accountName",
        "accountKey"
      ]
    },
    "gcCredentials": {
      "type": "object",
      "properties": {
        "keyFilename": { "type": "string"}
      },
      "required": [
        "keyFilename"
      ]
    },
    "diskSettings": {
      "type": "object",
      "properties": {
        "storageRootDirectory": { "type": "string"}
      },
      "required": [
        "storageRootDirectory"
      ]
    },
    "pageSize": { "type": "integer"},
    "argsTransport": {
      "type": "object",
      "properties": {
        "level": { "type": "string"},
        "handleExceptions": { "type": "boolean" },
        "stringify": { "type": "boolean" },
        "timestamp": { "type": "boolean" },
        "colorize": { "type": "boolean" },
        "json":{ "type": "boolean" }
      },
      "required": [
        "level",
        "handleExceptions",
        "stringify",
        "timestamp",
        "colorize",
        "json"
      ]
    }
  },
  "required": [
    "servername",
    "port",
    "driver",
    "bucket",
    "readURL",
    "requireCorrectHubUrl",
    "awsCredentials",
    "proofsConfig",
    "azCredentials",
    "gcCredentials",
    "diskSettings",
    "pageSize",
    "argsTransport"
  ]
}
```
