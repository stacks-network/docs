# Frontend with Stacks.js

Now we need to make some frontend changes to our app to handle the UI to add this new message.

To better understand how to work with Stacks.js and build frontends for your Stacks app, you'll want to be familiar with stacks.js as a whoel using the [Stacks.js Build Guides](https://docs.stacks.co/learn-stacks.js/overview).

You'll also likely use the @stacks/connect package the most, which has its own dedicated [build guides](https://docs.stacks.co/stacks-connect/connect-wallet).

You can find the full reference implementation for [@stacks/connect](https://docs.stacks.co/reference/stacks.js/stacks-connect) and [@stacks/transactions](https://docs.stacks.co/reference/stacks.js/stacks-transactions) in the reference section of the docs.

These are the two packages you'll likely work with the most.

{% stepper %}
{% step %}
### Update the ContributeParams interface

The first thing we need to do is update our TypeScript interface to handle the new message parameter. This can be found in the `campaign-utils.ts` file.

```typescript
interface ContributeParams {
  address: string;
  amount: number;
  message?: string;
}
```
{% endstep %}

{% step %}
### Add new imports

We also need to add a few new imports from the `@stacks/transactions` package to work with our new Clarity values.

```typescript
import {
  AnchorMode,
  FungiblePostCondition,
  noneCV,
  Pc,
  PostConditionMode,
  someCV,
  stringUtf8CV,
  uintCV,
} from "@stacks/transactions";
```


{% endstep %}

{% step %}
### Update getContributeStx

Next we need to update the utility function that actually handles creating our donation transaction. All we are doing here is adding the new optional `message` parameter and setting the value based on if it is present or not.

```typescript
export const getContributeStxTx = (
  network: Network,
  params: ContributeParams
): ContractCallRegularOptions => {
  const { address, amount, message } = params;

  return {
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    contractAddress: FUNDRAISING_CONTRACT.address || "",
    contractName: FUNDRAISING_CONTRACT.name,
    network,
    functionName: "donate-stx",
    functionArgs: [
      uintCV(amount),
      message ? someCV(stringUtf8CV(message)) : noneCV(),
    ],
    postConditions: [Pc.principal(address).willSendEq(amount).ustx()],
  };
};
```


{% endstep %}

{% step %}
### Update getContributeSbtcTx

Next we'll do the same thing for the function that creates our sBTC donation transaction.

```typescript
export const getContributeSbtcTx = (
  network: Network,
  params: ContributeParams
): ContractCallRegularOptions => {
  const { address, amount, message } = params;

  // ... postCondition setup ...

  return {
    // ...
    functionName: "donate-sbtc",
    functionArgs: [
      uintCV(amount),
      message ? someCV(stringUtf8CV(message)) : noneCV(),
    ],
    postConditions: [postCondition],
  };
};
```


{% endstep %}

{% step %}
### Update the donation modal

Now we need to update the actual UI that handles the donation. This can be found in the `DonationModal.tsx` file.

We need to do a few different things here.

Add state for the message.

```typescript
const [donationMessage, setDonationMessage] = useState("");
```

Add a textarea to the form:

```tsx
<Text fontSize="lg" fontWeight="bold">
  Add a Message (Optional)
</Text>

<Textarea
  placeholder="Share why you're supporting this campaign..."
  value={donationMessage}
  onChange={(e) => setDonationMessage(e.target.value.slice(0, 280))}
  maxLength={280}
  resize="none"
  rows={3}
/>
<Text fontSize="xs" color="gray.500" textAlign="right">
  {donationMessage.length}/280 characters
</Text>
```

Pass the message when building transaction options:

```typescript
const txOptions = getContributeStxTx(getStacksNetworkString(), {
  address: currentWalletAddress || "",
  amount: Math.round(Number(stxToUstx(usdToStx(amount, prices?.stx || 0)))),
  message: donationMessage || undefined,
});
```

Reset the message after successful donation:

```typescript
setDonationMessage("");
```


{% endstep %}
{% endstepper %}
