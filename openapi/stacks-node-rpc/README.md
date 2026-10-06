# Node RPC OpenAPI spec for GitBook

Source: stacks-network/stacks-core `docs/rpc/` at commit `b62be8ee94f2a08dc58d5ff6809a6d08b813c3e9` (main after PR #7691, 2026-10-06).
GitBook spec slug: `stacks-node-rpc-api-dereferenced-new` (org `hoh4mQXTl8NvI3cETroY`).

## Why the extra step

`redocly bundle` turns every schema file into a component named after the file (`contract-interface.schema`), next to the name `openapi.yaml` declares (`ContractInterface`). The bundle has 114 schemas, 55 of them duplicates; GitBook lists each one on the models page. `normalize.py` folds each file-named component into its declared name, renames the 4 that have no declared name (`GetStackerSetPox4`, `GetStackerSetPox5`, `Principal`, `StandardPrincipal`) and rewrites every reference. Result: 59 schemas, 57 paths, 57 operations, same `redocly lint` result as upstream `openapi.yaml` (valid, 19 warnings).

## Rebuild

Run from a checkout of stacks-network/docs. Requires git, Node.js with npx, and Python 3.

```bash
COMMIT=b62be8ee94f2a08dc58d5ff6809a6d08b813c3e9
SHORT=${COMMIT:0:9}
OUT="$PWD/openapi/stacks-node-rpc"
TMP=$(mktemp -d)
git clone -q --filter=blob:none --no-checkout https://github.com/stacks-network/stacks-core "$TMP/core"
git -C "$TMP/core" sparse-checkout set docs/rpc
git -C "$TMP/core" checkout -q "$COMMIT"
cd "$TMP/core/docs/rpc"
npx -y @redocly/cli@2.19 bundle openapi.yaml -o "$TMP/bundle.json"   # 2.19 = the version stacks-core CI pins
python3 "$OUT/normalize.py" "$TMP/bundle.json" "$OUT/stacks-node-rpc.$SHORT.json"
npx -y @redocly/cli@2.19 lint "$OUT/stacks-node-rpc.$SHORT.json"
cd - >/dev/null
```

sha256 of `stacks-node-rpc.b62be8ee9.json`: `6bfbdf37b0380126035dfe4e46c7fbf7b4f4e8000c6e0a2979808910a48c2b32`

## Updating

When stacks-core changes `docs/rpc`, set `COMMIT` to the new commit (prefer a release tag's commit), rebuild, add the new file next to the old one, and point the GitBook spec at the new raw URL pinned to the docs merge commit. Old files can be removed once GitBook no longer points at them.
