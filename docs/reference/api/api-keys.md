# API Keys

{% hint style="info" %}
This page documents API key management for Hiro-hosted APIs. Self-hosted Stacks nodes do not require API keys.
{% endhint %}

{% hint style="info" %}
**Source:** This page is adapted from the [Hiro documentation](https://docs.hiro.so/resources/guides/api-keys). Hiro is a developer tooling company that provides hosted API services for the Stacks ecosystem.
{% endhint %}

Developers have open access to Hiro's APIs without the use of an API key, but are subject to [Hiro's rate limit policy](rate-limits.md). For developers who need access beyond these rate limits, we provide API keys.

{% hint style="info" %}
If you're interested in obtaining an API key, you can generate one for free in the [Hiro Platform](https://platform.hiro.so) by creating an account.

If your app needs more than 500 RPM, please [contact us](mailto:platform@hiro.so).
{% endhint %}

## Usage with cURL

The API key is passed in the `header` of your HTTP API request with `x-api-key`.

```terminal
$ curl https://api.hiro.so/... -H 'x-api-key: <your-api-key>'
```

## Usage with Node

This snippet shows how to perform a `fetch` request with your API key by including it in the request headers.

```ts
async function makeApiRequest(apiKey: string) {
  const url = `https://api.hiro.so/<your-api-endpoint>`;
  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey
    }
  });
  return response.json();
}
```

{% hint style="warning" %}
**Caution**

The API key is passed in the header of your HTTP API request and is used only for private use, like in server-side applications.

If you use the API key in your client-side application, attackers can capture it using the client tools (E.g., browser console) and abuse your API key.
{% endhint %}
