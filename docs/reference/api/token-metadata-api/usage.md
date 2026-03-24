# Usage

Learn the basics of using the Token Metadata API.

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/apis/token-metadata-api/usage).
{% endhint %}

## Usage

The Token Metadata API is built on REST principles, enforcing HTTPS for all requests to ensure data security, integrity, and privacy.

### Base URL

```
https://api.hiro.so
```

### Making requests

To make a request to the Token Metadata API, you can paste the curl command below in your terminal.

```bash
curl -L 'https://api.hiro.so/metadata/v1/ft' \
  -H 'Accept: application/json'
```

### Authentication

If you are using an api-key, replace `$HIRO_API_KEY` with your secret API key.

```bash
curl -L 'https://api.hiro.so/metadata/v1/ft' \
  -H 'Accept: application/json' \
  -H 'x-api-key: $HIRO_API_KEY'
```

## Response codes

The Token Metadata API uses standard HTTP response codes to indicate request success or failure.

| Code | Description |
|------|-------------|
| `200` | Successful request |
| `400` | Check that the parameters were correct |
| `401` | Missing API key |
| `403` | Invalid API key |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `5xx` | Server errors |
