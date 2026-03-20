# API Keys

Many Hiro-hosted APIs are available without authentication for basic usage, but production integrations should use API keys for clearer quota tracking and higher service limits where available.

{% hint style="info" %}
Create and manage Hiro API keys in [Hiro Platform](https://platform.hiro.so/). If you need quota changes beyond the standard self-service setup, contact Hiro through the platform support channels.
{% endhint %}

## Sending an API key

Pass your key in the `x-api-key` header:

```bash
curl https://api.hiro.so/... \
  -H 'x-api-key: YOUR_API_KEY'
```

Example using `fetch`:

```ts
async function makeApiRequest(apiKey: string) {
  const response = await fetch('https://api.hiro.so/<your-api-endpoint>', {
    headers: {
      'x-api-key': apiKey,
    },
  });

  return response.json();
}
```

## Security guidance

- Keep API keys in server-side environments such as backend services, workers, or CI jobs.
- Do not embed production keys in client-side applications where they can be extracted.
- Rotate keys periodically and revoke keys that are no longer needed.

For quota behavior and rate limit inspection, see [Rate Limits](rate-limits.md) and [Response Headers](response-headers.md).
