### Pagination

To make API responses more compact, lists returned by the API are paginated. For lists, the response body includes:

- `limit`: the number of list items return per response
- `offset`: the number of elements to skip (starting from `0`)
- `total`: the number of all available list items
- `results`: the array of list items (length of array is between 0 and the set limit)

Using the `limit` and `offset` properties, you can paginate through the entire list by increasing the offset by the limit until you reach the end of the list (as indicated by the `total` field).
