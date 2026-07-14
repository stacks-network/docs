---
description: Learn how to paginate through lists.
---

# Pagination

To keep responses compact, endpoints that return lists are paginated. Newer endpoints (all `/extended/v3` routes, plus some `/extended/v2` routes) use **cursor-based pagination**: instead of counting through a list with a numeric offset, each response hands you an opaque cursor that points at the next page. This keeps results stable even when new items are added to the front of the list while you're paging through it.

### Request parameters

Cursor-paginated endpoints accept two query parameters:

* `limit`: The number of items to return per page. Defaults to `20`, with a maximum of `50`.
* `cursor`: The cursor pointing at the page to fetch. Omit it on your first request to get the first page.

Treat the cursor as an opaque token — copy the value from a response and pass it back unchanged. (Its internal format is endpoint-specific; for example, the transactions endpoint encodes `block_height:microblock_sequence:tx_index`.)

### Response body

Each response includes:

* `limit`: The number of items returned per page.
* `total`: The number of items available.
* `results`: The array of items (length equals the set limit, or fewer on the last page).
* `cursor`: An object with the cursors for navigating from the current page:
  * `next`: Cursor for the next page, or `null` if this is the last page.
  * `previous`: Cursor for the previous page, or `null` if this is the first page.
  * `current`: Cursor for the current page.

Here is a sample response from `GET /extended/v3/transactions?limit=20`:

```json
{
  "limit": 20,
  "total": 101922,
  "cursor": {
    "next": "14461:2147483647:0",
    "previous": null,
    "current": "14805:0:3"
  },
  "results": [
    {
      "tx_id": "0x924e0a688664851f5f96b437fabaec19b7542cfcaaf92a97eae43384cacd83d0",
      "tx_status": "success",
      "tx_type": "coinbase",
      "block_height": 14461,
      "burn_block_time_iso": "2021-06-05T06:37:22.000Z"
    }
  ]
}
```

### Paginating through a list

To walk the entire list, make an initial request without a `cursor`, then repeat the request with the `cursor.next` value from each response. Stop when `cursor.next` is `null`.

```js
async function fetchAllTransactions() {
  const base = "https://api.hiro.so/extended/v3/transactions";
  const results = [];
  let cursor = null;

  do {
    const url = new URL(base);
    url.searchParams.set("limit", "50");
    if (cursor) url.searchParams.set("cursor", cursor);

    const page = await fetch(url).then((res) => res.json());
    results.push(...page.results);
    cursor = page.cursor.next;
  } while (cursor);

  return results;
}
```

To page backwards, use `cursor.previous` the same way — it is `null` once you reach the first page.

{% hint style="info" %}
Older endpoints (most `/extended/v1` and `/extended/v2` routes) still use offset-based pagination with `limit` and `offset` parameters and return a `total`. For those, page through the list by increasing `offset` by `limit` until you reach `total`. Check the parameters listed for each endpoint in the API reference to see which style it uses.
{% endhint %}
