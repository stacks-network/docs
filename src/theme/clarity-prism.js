// Clarity language definition to add clarity support to prismjs
// from
// https://github.com/hirosystems/stacks-wallet-web/blob/dev/src/app/common/clarity-prism.ts

function clarity(Prism) {
  function primitive(pattern) {
    return RegExp(`([\\s([])${pattern}(?=[\\s)])`);
  }

  const par = "(\\()";
  const space = "(?=\\s)";

  Prism.languages.clarity = {
    // Three or four semicolons are considered a heading.
    heading: {
      pattern: /;;;.*/,
      alias: ["comment", "title"],
    },
    comment: /;;.*/,
    string: [
      {
        pattern: /"(?:[^"\\]|\\.)*"/,
        greedy: true,
      },
      {
        pattern: /0x[0-9a-fA-F]*/,
        greedy: true,
      },
    ],
    symbol: {
      pattern: /'[^()#'\s]+/,
      greedy: true,
    },
    keyword: [
      {
        pattern: RegExp(
          `${par}(?:\\+|\\-|/|\\*|>|<|<=|>=|pow|log2|mod|sqrti)${space}`
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          `${par}(?:default-to|or|and|xor|not|begin|let|if|ok|err|unwrap\!|unwrap-err\!|unwrap-panic|unwrap-err-panic|match|merge|try\!|asserts\!|map-get\\?|var-get|contract-map-get\\?|get|tuple|print|replace-at\\?|secp256k1-recover\\?|secp256k1-verify|slice\\?|some|buff-to-int-be|buff-to-int-le|buff-to-uint-be|buff-to-uint-le|int-to-ascii|int-to-utf8|string-to-int\\?|string-to-uint\\?|element-at|element-at\\?|index-of|index-of\\?|from-consensus-buff\\?|to-consensus-buff\\?|principal-construct\\?|principal-destruct\\?|principal-of\\?|use-trait|impl-trait)${space}`
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          `${par}(?:define-trait|define-public|define-private|define-constant|define-map|define-data-var|define-fungible-token|define-non-fungible-token|define-read-only)${space}`
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          `${par}(?:bit-and|bit-not|bit-or|bit-shift-left|bit-shift-right|bit-xor)${space}`
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          `${par}(?:var-set|map-set|map-delete|map-insert|stx-account|stx-burn\\?|stx-get-balance|stx-transfer-memo\\?|stx-transfer\\?|ft-get-balance|ft-get-supply|ft-transfer\\?|nft-transfer\\?|nft-mint\\?|nft-burn\\?|ft-mint\\?|ft-burn\\?|nft-get-owner\\?|ft-get-balance\\?|contract-call\\?)${space}`
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          `${par}(?:list|map|filter|fold|len|concat|append|as-max-len\\?|to-int|to-uint|buff|hash160|sha256|sha512|sha512/256|keccak256|none)${space}`
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          `${par}(?:as-contract|contract-caller|tx-sender|tx-sponsor\\?|block-height|burn-block-height|get-burn-block-info\\?|at-block|get-block-info\\?|stx-liquid-supply|chain-id|is-in-mainnet|is-in-regtest)${space}`
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          `${par}(?:is-eq|is-some|is-none|is-ok|is-err|is-standard)${space}`
        ),
        lookbehind: true,
      },
    ],
    boolean: /(?:false|true)/,
    number: {
      pattern: primitive("[-]?u?\\d+"),
      lookbehind: true,
    },
    address: {
      pattern:
        /([\s()])(?:'[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{28,41})(?=[()\s]|$)/,
      lookbehind: true,
    },
    operator: {
      pattern: /(\()(?:[-+*/]|[<>]=?|=>?)(?=[()\s]|$)/,
      lookbehind: true,
    },
    function: {
      pattern: /(\()[^()'\s]+(?=[()\s]|$)/,
      lookbehind: true,
    },
    punctuation: /[()']/,
  };
}

clarity.displayName = "clarity";
clarity.aliases = ["clar"];

export default clarity;
