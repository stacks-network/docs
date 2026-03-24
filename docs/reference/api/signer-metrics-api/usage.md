# Usage

Learn the basics of using the Signer Metrics API.

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/apis/signer-metrics-api/usage).
{% endhint %}

## Usage

The Signer Metrics API is built on REST principles, enforcing HTTPS for all requests to ensure data security, integrity, and privacy.

### Base URL

```
https://api.hiro.so
```

### Making requests

To make a request to the Signer Metrics API, you can paste the curl command below in your terminal.

```bash
curl -L 'https://api.hiro.so/signer-metrics/v1/cycles/95/signers' \
  -H 'Accept: application/json'
```

### Authentication

If you are using an api-key, replace `$HIRO_API_KEY` with your secret API key.

```bash
curl -L 'https://api.hiro.so/signer-metrics/v1/cycles/95/signers' \
  -H 'Accept: application/json' \
  -H 'x-api-key: $HIRO_API_KEY'
```

## Response codes

The Signer Metrics API uses standard HTTP response codes to indicate request success or failure.

| Code | Description |
|------|-------------|
| `200` | Successful request |
| `400` | Check that the parameters were correct |
| `401` | Missing API key |
| `403` | Invalid API key |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `5xx` | Server errors |
