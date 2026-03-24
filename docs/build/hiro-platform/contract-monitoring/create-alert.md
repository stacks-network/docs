# Create an Alert

Learn how to create an alert to monitor function calls for a contract.

## What you'll learn

- Set up alerts for contract functions
- Configure email and webhook notifications
- Monitor contract usage patterns

## Prerequisites

- Contracts deployed to Stacks mainnet (or use any public contract)
- A Hiro Platform account - [Sign up free](https://platform.hiro.so)

## Set up contract monitoring

{% stepper %}

{% step %}
### Navigate to monitoring

Log into the [Hiro Platform](https://platform.hiro.so) and toggle to the **Monitor** tab.

You can set up alert monitoring for any contracts on mainnet.
{% endstep %}

{% step %}
### Add contract for monitoring

Click **Add contract** to open the contract lookup modal.

You have two options:
- **Manual entry**: Enter the contract principal and contract name
- **Wallet connection**: Connect your wallet to see your deployment history

All contracts deployed to mainnet are public, so you can monitor any of them regardless of who deployed them.
{% endstep %}

{% step %}
### View contract activity

Once added, your contract appears under Contract Monitoring where you can:
- View transaction history
- See pending transactions in the mempool
- Click **Create an alert** to set up specific monitoring
{% endstep %}

{% step %}
### Configure custom alerts

Set up alerts for any contract function calls with specific conditions:

- **Function called**: Alert when a particular function is called
- **With arguments**: Alert only when called with specified argument values
- **By address**: Alert only when called by a specific wallet address

For example, monitor `set-contract-owner`, transfer/mint/burn functions, or any custom functions you've implemented.
{% endstep %}

{% step %}
### Choose notification method

Select how you want to receive alerts:

- **Email notifications**: Receive alerts at your email address
- **Webhook calls**: Send to your API endpoint for custom workflows

You can enable multiple notification methods for the same alert.
{% endstep %}

{% endstepper %}

## Alert payload format

Email notifications come from Hiro Platform `<platform@hiro.so>`.

Webhook payloads follow this structure:

{% tabs %}
{% tab label="JSON" %}
```json
{
  "tx_id": "0xa7f511b3f379efef6fe71d0de57712ed13a89c5b6e24dd049eb2cc9a7c24fcb5",
  "nonce": 5,
  "fee_rate": "250",
  "sender_address": "SP2W9QYAHJNS7YTQY9EK2MSTQGX9E2NDMV766JP9Z",
  "sponsored": false,
  "post_condition_mode": "deny",
  "post_conditions": [
    {
      "type": "stx",
      "condition_code": "sent_equal_to",
      "amount": "3000000",
      "principal": {
        "type_id": "principal_standard",
        "address": "SP2W9QYAHJNS7YTQY9EK2MSTQGX9E2NDMV766JP9Z"
      }
    }
  ],
  "anchor_mode": "any",
  "tx_status": "pending",
  "receipt_time": 1726104636,
  "receipt_time_iso": "2024-09-12T01:30:36.000Z",
  "tx_type": "contract_call",
  "contract_call": {
    "contract_id": "SPHW0EJK5KPDMK03ZX792EMP0Q5J3A39ZMTVZZCY.sample-contract",
    "function_name": "donate",
    "function_signature": "(define-public (donate (amount uint)))",
    "function_args": [
      {
        "hex": "0x01000000000000000000000000002dc6c0",
        "repr": "u3000000",
        "name": "amount",
        "type": "uint"
      }
    ]
  }
}
```
{% endtab %}

{% tab label="TypeScript" %}
```ts
interface AlertPayload {
  tx_id: string;
  nonce: number;
  fee_rate: string;
  sender_address: string;
  sponsored: boolean;
  post_condition_mode: string;
  post_conditions: PostCondition[];
  anchor_mode: string;
  tx_status: string;
  receipt_time: number;
  receipt_time_iso: string;
  tx_type: string;
  contract_call: ContractCall;
}

interface ContractCall {
  contract_id: string;
  function_name: string;
  function_signature: string;
  function_args: FunctionArg[];
}

interface FunctionArg {
  hex: string;
  repr: string;
  name: string;
  type: string;
}

interface PostCondition {
  type: string;
  condition_code: string;
  amount: string;
  principal: Principal;
}

interface Principal {
  type_id: string;
  address: string;
}
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
The `tx_status` will always return "pending" for monitor alerts. Notifications are sent when transactions hit the mempool, not when they're confirmed on the blockchain.
{% endhint %}

## Next steps

- [Hiro Platform](https://platform.hiro.so): Create and manage new webhooks in the Platform.
- [Chainhooks](https://docs.hiro.so/tools/chainhooks): Learn about advanced event monitoring with Chainhook.
