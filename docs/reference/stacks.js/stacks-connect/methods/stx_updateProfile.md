# stx\_updateProfile

Requests the connected wallet to update the user's on-chain profile data.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_updateProfile', {
  profile: {
    name: 'Alice',
    description: 'Builder on Stacks',
    image: [
      {
        '@type': 'ImageObject',
        contentUrl: 'https://example.com/avatar.png',
      },
    ],
  },
});

console.log('Updated profile:', result.profile);
```

#### Notes

- The `profile` object structure follows the Stacks profile schema.
- Not all wallets may support this method. Check wallet documentation for compatibility.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L129)**

***

### Signature

```ts
function request(
  'stx_updateProfile',
  params: UpdateProfileParams
): Promise<UpdateProfileResult>
```

***

### Returns

`UpdateProfileResult`

```ts
interface UpdateProfileResult {
  profile: Record<string, any>;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `profile` | `Record<string, any>` | The updated profile data. |

***

### Parameters

#### profile (required)

* **Type**: `Record<string, any>`

The profile data to update. This is a free-form object that follows the Stacks profile schema.
