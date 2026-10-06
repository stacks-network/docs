"""Collapse redocly's file-named components into the names declared in openapi.yaml."""
import json, re, sys
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src))
s = d['components']['schemas']
P = '#/components/schemas/'
rename = {}
# 1. declared alias X -> {$ref: P+F}: move F's body into X
for k, v in list(s.items()):
    if '.' not in k and isinstance(v, dict) and list(v) == ['$ref'] and v['$ref'].startswith(P):
        f = v['$ref'][len(P):]
        if '.' in f and f not in rename:
            rename[f] = k
# 2. remaining file-named components get a PascalCase name
def pascal(f):
    stem = f.removesuffix('.schema')
    return ''.join(w[:1].upper() + w[1:] for w in re.split(r'[-_.]', stem))
for k in list(s):
    if '.' in k and k not in rename:
        n = pascal(k)
        assert n not in s and n not in rename.values(), (k, n)
        rename[k] = n
def walk(o):
    if isinstance(o, dict):
        for key, v in list(o.items()):
            if isinstance(v, str) and v.startswith(P) and v[len(P):] in rename:
                o[key] = P + rename[v[len(P):]]
            else:
                walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
new = {}
for k, v in s.items():
    if k in rename: continue
    if k in rename.values() and isinstance(v, dict) and list(v) == ['$ref']:
        f = v['$ref'][len(P):]; new[k] = s[f]; continue
    new[k] = v
for f, n in rename.items():
    if n not in new: new[n] = s[f]
d['components']['schemas'] = new
walk(d)
txt = json.dumps(d)
left = re.findall(r'#/components/schemas/([A-Za-z0-9_.-]+)', txt)
assert not [x for x in left if x not in new], set(x for x in left if x not in new)
assert not [k for k in new if '.' in k]
json.dump(d, open(out, 'w'), indent=2)
print(len(s), '->', len(new), 'schemas;', len([r for r in rename.values() if r not in s]), 'new names:', sorted(r for r in rename.values() if r not in s))
