// Fetch the sBTC signers' aggregate public key from sbtc-registry on mainnet,
// derive the peg-wallet taproot address, and update docs when it has changed.
//
// Usage:
//   pnpm run sync-sbtc-signer-address
//
// Environment:
//   HIRO_API_URL           - Stacks API base URL (default: https://api.hiro.so)
//   SBTC_REGISTRY_DEPLOYER - sBTC registry contract deployer (mainnet default)

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

bitcoin.initEccLib(ecc);

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const HIRO_API_URL = process.env.HIRO_API_URL ?? "https://api.hiro.so";
const SBTC_REGISTRY_DEPLOYER =
  process.env.SBTC_REGISTRY_DEPLOYER ??
  "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4";

/** Docs that embed the signers' peg-wallet Bitcoin address. */
const TARGET_FILES = [
  "docs/build/more-guides/sbtc/bridging-bitcoin/btc-to-sbtc.md",
  "docs/learn/sbtc/README.md",
  "docs/learn/sbtc/sbtc-signers.md",
] as const;

const TAPROOT_ADDRESS_RE = /bc1p[a-z0-9]+/g;

/** Sanity-check derivation against a known mainnet registry key. */
const KNOWN_PUBKEY_HEX =
  "033920f589c2b367400732d2dd61d11b300ad95b2b1bbf008eabcf8cddfee0c12c";
const KNOWN_ADDRESS =
  "bc1pss7kvauf5utmxp3pznz7guc63zujmpwnt9q4znzu4dzhd69yumgs58cjgl";

interface HiroCallReadResponse {
  okay: boolean;
  result?: string;
}

interface ReplaceResult {
  content: string;
  changed: boolean;
  previous: string | null;
}

function verifyDerivation(): void {
  const derived = aggregateKeyToAddress(KNOWN_PUBKEY_HEX);
  if (derived !== KNOWN_ADDRESS) {
    throw new Error(
      `Address derivation mismatch: expected ${KNOWN_ADDRESS}, got ${derived}`,
    );
  }
}

/**
 * Parse a Clarity-serialized (buff 33) hex string from Hiro API responses.
 * Returns null when the registry value is still the zero initializer.
 */
function parseClarityBuffer33(hex: string): string | null {
  const raw = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (raw === "00" || raw.endsWith("00".repeat(33))) {
    return null;
  }

  // (buff N) is serialized as: 0x02 | u32 length | N bytes
  const match = raw.match(/^02(?:0{6}|0{4})21(0[23][0-9a-f]{64})$/i);
  if (match?.[1]) {
    return match[1].toLowerCase();
  }

  // Fallback: last 33 bytes (66 hex chars) of the payload.
  const tail = raw.slice(-66);
  if (/^0[23][0-9a-f]{64}$/i.test(tail)) {
    return tail.toLowerCase();
  }

  throw new Error(`Unable to parse aggregate pubkey from Clarity hex: ${hex}`);
}

/**
 * Derive the signers' peg-wallet P2TR address from a compressed secp256k1
 * public key. Matches stacks-sbtc/sbtc SignerScriptPubKey::signers_script_pubkey.
 */
function aggregateKeyToAddress(pubkeyHex: string): string {
  const pubkey = Buffer.from(pubkeyHex, "hex");
  if (pubkey.length !== 33) {
    throw new Error(
      `Expected 33-byte compressed pubkey, got ${pubkey.length} bytes`,
    );
  }

  const xOnly = Buffer.from(ecc.xOnlyPointFromPoint(pubkey));
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: xOnly,
    network: bitcoin.networks.bitcoin,
  });

  if (!address) {
    throw new Error("Failed to derive taproot address from aggregate pubkey");
  }

  return address;
}

async function fetchAggregatePubkeyHex(): Promise<string> {
  const url = `${HIRO_API_URL}/v2/contracts/call-read/${SBTC_REGISTRY_DEPLOYER}/sbtc-registry/get-current-aggregate-pubkey`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      sender: SBTC_REGISTRY_DEPLOYER,
      arguments: [],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Hiro API request failed (${response.status} ${response.statusText})`,
    );
  }

  const body = (await response.json()) as HiroCallReadResponse;
  if (!body.okay || !body.result) {
    throw new Error(`Unexpected Hiro API response: ${JSON.stringify(body)}`);
  }

  const pubkeyHex = parseClarityBuffer33(body.result);
  if (!pubkeyHex) {
    console.log("Registry aggregate pubkey is unset; nothing to sync.");
    process.exit(0);
  }

  return pubkeyHex;
}

function replaceSignerAddress(
  content: string,
  expectedAddress: string,
): ReplaceResult {
  const found = [...content.matchAll(TAPROOT_ADDRESS_RE)].map((m) => m[0]);
  const unique = [...new Set(found)];

  if (unique.length === 0) {
    return { content, changed: false, previous: null };
  }

  if (unique.length > 1) {
    throw new Error(
      `Expected at most one taproot address per file, found: ${unique.join(", ")}`,
    );
  }

  const previous = unique[0];
  if (previous === expectedAddress) {
    return { content, changed: false, previous };
  }

  return {
    content: content.replaceAll(previous, expectedAddress),
    changed: true,
    previous,
  };
}

function syncDocs(expectedAddress: string): boolean {
  let anyChanged = false;

  for (const relPath of TARGET_FILES) {
    const absPath = resolve(REPO_ROOT, relPath);
    const original = readFileSync(absPath, "utf8");
    const { content, changed, previous } = replaceSignerAddress(
      original,
      expectedAddress,
    );

    if (changed) {
      writeFileSync(absPath, content);
      console.log(`Updated ${relPath}: ${previous} -> ${expectedAddress}`);
      anyChanged = true;
    } else {
      console.log(
        `No change needed in ${relPath} (${previous ?? "no address"})`,
      );
    }
  }

  return anyChanged;
}

async function main(): Promise<void> {
  verifyDerivation();

  const pubkeyHex = await fetchAggregatePubkeyHex();
  const address = aggregateKeyToAddress(pubkeyHex);

  console.log(`Registry aggregate pubkey: ${pubkeyHex}`);
  console.log(`Derived peg-wallet address: ${address}`);

  const changed = syncDocs(address);
  if (!changed) {
    console.log("Documentation already matches the on-chain signers address.");
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
