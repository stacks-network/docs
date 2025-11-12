# Chainhook Integration

Learn how to register Chainhooks on Clarinet devnet so you can monitor smart contract events during local development.

## What you'll learn

* Create Chainhook predicate files for event monitoring
* Register Chainhooks with Clarinet devnet
* Monitor contract calls and blockchain events
* Set up webhooks for real-time notifications

{% hint style="info" %}
Prerequisites

* Clarinet `2.1.0` or later (`clarinet --version`)
* Node.js `16` or later (`node --version`)
{% endhint %}

## Quickstart

{% stepper %}
{% step %}
#### Create your Chainhook predicates

Create predicate files in a `chainhooks/` directory alongside your contracts:

* contracts/
  * counter.clar
* chainhooks/
  * increment.json
  * decrement.json
* tests/
  * counter.test.ts
* Clarinet.toml

Example predicate for monitoring increment events:

{% code title="chainhooks/increment.json" %}
```json
{
  "chain": "stacks",
  "uuid": "increment-hook",
  "name": "Increment Counter Hook",
  "version": 1,
  "networks": {
    "devnet": {
      "if_this": {
        "scope": "contract_call",
        "contract_identifier": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter",
        "method": "increment"
      },
      "then_that": {
        "http_post": {
          "url": "http://localhost:3000/api/increment",
          "authorization_header": "Bearer my-secret"
        }
      }
    }
  }
}
```
{% endcode %}
{% endstep %}

{% step %}
#### Start devnet with Chainhooks

From your project root, start devnet. Clarinet registers every predicate automatically:

{% code title="Start devnet" %}
```bash
clarinet devnet start
```
{% endcode %}

Check the logs for a confirmation message such as:

{% code title="Clarinet log" %}
```
INFO Feb  5 15:20:07.233382 2 chainhooks registered
```
{% endcode %}
{% endstep %}

{% step %}
#### Monitor Chainhook activity

Trigger contract actions and watch for Chainhook alerts:

{% code title="Clarinet log" %}
```
INFO Feb  5 15:21:07.233382 1 hooks triggered
```
{% endcode %}

Verify the payload based on your `then_that` configuration:

* `http_post` – confirm your endpoint received the POST request
* `file_append` – ensure the file was created or updated
{% endstep %}
{% endstepper %}

## Common patterns

### Contract deployment hook

Monitor when specific contracts are deployed:

{% code title="chainhooks/deploy.json" %}
```json
{
  "chain": "stacks",
  "uuid": "deploy-hook",
  "name": "Contract Deploy Monitor",
  "version": 1,
  "networks": {
    "devnet": {
      "if_this": {
        "scope": "contract_deployment",
        "deployer": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
      },
      "then_that": {
        "file_append": {
          "path": "./deployments.log"
        }
      }
    }
  }
}
```
{% endcode %}

### STX transfer monitoring

Track STX transfers above a certain threshold:

{% code title="chainhooks/stx-transfer.json" %}
```json
{
  "chain": "stacks",
  "uuid": "stx-transfer-hook",
  "name": "Large STX Transfer Monitor",
  "version": 1,
  "networks": {
    "devnet": {
      "if_this": {
        "scope": "stx_event",
        "actions": ["transfer"],
        "amount_upper_bound": "1000000000000"
      },
      "then_that": {
        "http_post": {
          "url": "http://localhost:3000/api/large-transfer"
        }
      }
    }
  }
}
```
{% endcode %}
