# Testing Clarity Contracts

Now we need to modify our tests to make sure we handled this new message functionality.

There are two sections of the docs to check to understand how to write Clarity unit tests.

The first is the series of [Clarinet JS SDK guides](https://docs.stacks.co/clarinet-js-sdk/overview) in the Build section. These will show you how to work with the SDK to write your tests.

The second is the [Clarinet JS SDK reference](https://docs.stacks.co/reference/clarinet-js-sdk/sdk-reference) section. This will show you all of the available functions you can use to write your tests.

Let's make a few modifications to our test file.

{% stepper %}
{% step %}
### Test donate with a message

Add a new test to the `fundraising.test.ts` file.

```typescript
it("accepts STX donation with a message", () => {
  initCampaign(100000);
  const message = "Great project! Happy to support.";
  const response = simnet.callPublicFn(
    "fundraising",
    "donate-stx",
    [Cl.uint(5000), Cl.some(Cl.stringUtf8(message))],
    donor1,
  );
  expect(response.result).toBeOk(Cl.bool(true));

  // verify donation was recorded
  const getDonationResponse = simnet.callReadOnlyFn(
    "fundraising",
    "get-stx-donation",
    [Cl.principal(donor1)],
    donor1,
  );
  expect(getDonationResponse.result).toBeOk(Cl.uint(5000));

  // verify message was recorded
  const getMessageResponse = simnet.callReadOnlyFn(
    "fundraising",
    "get-donation-message",
    [Cl.principal(donor1)],
    donor1,
  );
  expect(getMessageResponse.result).toBeOk(Cl.some(Cl.stringUtf8(message)));
});
```

You can see here that we are using `Cl.some(Cl.stringUtf8(message))` to pass an optional with a value, then using `Cl.some(...)` to get the actual message wrapped in the optional when we retrieve it.    &#x20;
{% endstep %}

{% step %}
### Update message on subsequent donations

We also want to make sure the message gets updated when we make a new donation.

```typescript
it("allows updating message with subsequent donation", () => {
  initCampaign(100000);

  // first donation with message
  simnet.callPublicFn(
    "fundraising",
    "donate-stx",
    [Cl.uint(5000), Cl.some(Cl.stringUtf8("First message"))],
    donor1,
  );

  // second donation with new message
  simnet.callPublicFn(
    "fundraising",
    "donate-stx",
    [Cl.uint(3000), Cl.some(Cl.stringUtf8("Updated message"))],
    donor1,
  );

  // verify total donation amount
  const getDonationResponse = simnet.callReadOnlyFn(
    "fundraising",
    "get-stx-donation",
    [Cl.principal(donor1)],
    donor1,
  );
  expect(getDonationResponse.result).toBeOk(Cl.uint(8000));

  // verify message was updated
  const getMessageResponse = simnet.callReadOnlyFn(
    "fundraising",
    "get-donation-message",
    [Cl.principal(donor1)],
    donor1,
  );
  expect(getMessageResponse.result).toBeOk(
    Cl.some(Cl.stringUtf8("Updated message")),
  );
});
```
{% endstep %}

{% step %}
### Test that it returns none with no message

Then we also need to make sure that if a donor did not pass a message the getter returns `none`.

```typescript
it("returns none for donor with no message", () => {
  initCampaign(100000);

  // donate without message
  simnet.callPublicFn(
    "fundraising",
    "donate-stx",
    [Cl.uint(5000), Cl.none()],
    donor1,
  );

  const getMessageResponse = simnet.callReadOnlyFn(
    "fundraising",
    "get-donation-message",
    [Cl.principal(donor1)],
    donor1,
  );
  expect(getMessageResponse.result).toBeOk(Cl.none());
});
```

You can see here that we use the `Cl.none()` Clarity value helper to denote the `none` value.
{% endstep %}

{% step %}
### Update existing tests

Finally, we need to update all of our existing tests to pass in `Cl.none()` when there is no message being passed.

Optionals in Clarity still require a value of some kind to be passed in to the function, it's just that value can either be the value type or `none`.

```typescript
// Before
simnet.callPublicFn("fundraising", "donate-stx", [Cl.uint(5000)], donor1);

// After
simnet.callPublicFn("fundraising", "donate-stx", [Cl.uint(5000), Cl.none()], donor1);
```
{% endstep %}

{% step %}
### Run the tests

Finally we can run our tests to make sure they pass.

```bash
cd clarity
npm test
```
{% endstep %}
{% endstepper %}
