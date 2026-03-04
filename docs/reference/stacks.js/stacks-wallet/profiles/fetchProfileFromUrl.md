# fetchProfileFromUrl

Fetches a user profile from a given URL, decoding the signed profile token and returning the profile claim data. Returns `null` if the profile is not found or if a network error occurs.

***

## Usage

```ts
import { fetchProfileFromUrl } from '@stacks/wallet-sdk';

const profileUrl = 'https://gaia.blockstack.org/hub/1J3PUxY5HPbVE2ZBkgK.../profile.json';

const profile = await fetchProfileFromUrl(profileUrl);

if (profile) {
  console.log(profile['@type']); // e.g. 'Person'
  console.log(profile.name);
}
```

### Notes

- If the profile URL returns a 404, the function returns `null` instead of throwing.
- Any network or parsing errors are caught and `null` is returned.
- The response is expected to be an array of wrapped profile tokens. The first token's decoded payload claim is returned.
- You can pass a custom fetch function if needed (e.g., for testing or proxying).

***

## Reference

[Source code](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/profile.ts)

***

## Function Signature

```ts
function fetchProfileFromUrl(
  profileUrl: string,
  fetchFn?: FetchFn
): Promise<PublicProfileBase | null>
```

***

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `profileUrl` | `string` | The URL to fetch the profile from (e.g., a Gaia hub profile.json URL). |
| `fetchFn` | `FetchFn` | _(Optional)_ A custom fetch function. Defaults to the built-in fetch from `@stacks/common`. |

***

## Returns

`Promise<PublicProfileBase | null>`

Resolves to the decoded profile claim object (a `PublicProfileBase`), or `null` if the profile could not be found or fetched.
