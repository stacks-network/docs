#!/usr/bin/env node
// Generate docs/reference/clarity/functions.md and keywords.md from the JSON
// emitted by `stacks-inspect docgen` (stacks-network/stacks-core).
//
// Usage:
//   stacks-inspect docgen | node scripts/generate-clarity-reference.mjs
//   node scripts/generate-clarity-reference.mjs path/to/api.json
//
// The shape we consume (see clarity/src/vm/docs/mod.rs in stacks-core).
// `notices` is added by the upstream notices PR; entries without notices
// simply omit the field. The operator friendly-name suffix (e.g. "+ (add)")
// is already baked into `name` upstream, so we use it verbatim.
//   {
//     functions: [{
//       name, snippet, input_type, output_type, signature,
//       description, example, min_version, max_version,
//       notices?: [{ level: "danger"|"warning"|"info", body: string }]
//     }, ...],
//     keywords: [{ name, snippet, output_type, description, example,
//                  min_version, max_version, notices? }, ...]
//   }

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const FUNCTIONS_PATH =
  process.env.OUT_FUNCTIONS_PATH ||
  resolve(REPO_ROOT, "docs/reference/clarity/functions.md");
const KEYWORDS_PATH =
  process.env.OUT_KEYWORDS_PATH ||
  resolve(REPO_ROOT, "docs/reference/clarity/keywords.md");

const FUNCTIONS_FRONTMATTER = `---
description: The complete reference guide to all Clarity functions.
---

# Functions

`;

const KEYWORDS_FRONTMATTER = `---
description: The complete reference guide to all Clarity keywords.
---

# Keywords

`;

function readInput() {
  const argPath = process.argv[2];
  if (argPath) return readFileSync(argPath, "utf8");
  return readFileSync(0, "utf8");
}

function formatVersion(v) {
  // ClarityVersion serializes as "Clarity1", "Clarity2", ... via serde.
  if (typeof v !== "string") return null;
  const match = v.match(/^Clarity(\d+)$/);
  return match ? `Clarity ${match[1]}` : v;
}

function renderNotices(notices) {
  if (!Array.isArray(notices) || notices.length === 0) return null;
  return notices
    .map((n) => {
      const level = n.level || "info";
      const body = (n.body || "").trim();
      return `{% hint style="${level}" %}\n${body}\n{% endhint %}`;
    })
    .join("\n\n");
}

function deprecationNotice(maxVersion) {
  if (typeof maxVersion !== "string") return null;
  // `max_version` upstream means "last Clarity version in which this is
  // available" — e.g. block-height has max=Clarity2 and is removed in
  // Clarity 3. Render the *removed-in* version, not the last-working one.
  const match = maxVersion.match(/^Clarity(\d+)$/);
  const removedIn = match ? `Clarity ${parseInt(match[1], 10) + 1}` : formatVersion(maxVersion);
  return { level: "danger", body: `Deprecated in ${removedIn}.` };
}

function mergeNotices(entry) {
  const upstream = Array.isArray(entry.notices) ? entry.notices : [];
  const dep = deprecationNotice(entry.max_version);
  if (!dep) return upstream;
  // Don't duplicate an explicit notice if the upstream already mentions deprecation.
  const alreadyMentions = upstream.some((n) =>
    /deprecat/i.test(n.body || "")
  );
  return alreadyMentions ? upstream : [dep, ...upstream];
}

function functionHeading(entry) {
  return `## ${entry.name}`;
}

function keywordHeading(entry) {
  return `### ${entry.name}`;
}

function renderFunction(entry) {
  const minVersion = formatVersion(entry.min_version) || "Clarity 1";
  const notices = renderNotices(mergeNotices(entry));
  const description = (entry.description || "").trim();
  const example = (entry.example || "").trim();

  const blocks = [functionHeading(entry)];
  if (notices) blocks.push(notices);
  blocks.push(`Introduced in: **${minVersion}**`);
  blocks.push(
    [
      `**input:** \`${entry.input_type}\`\\`,
      `**output:** \`${entry.output_type}\`\\`,
      `**signature:** \`${entry.signature}\``,
    ].join("\n")
  );
  blocks.push(`**description:**\\\n${description}`);
  blocks.push(`**example:**\n\n\`\`\`clarity\n${example}\n\`\`\``);
  blocks.push("***");

  return blocks.join("\n\n") + "\n";
}

function renderKeyword(entry) {
  const minVersion = formatVersion(entry.min_version) || "Clarity 1";
  const notices = renderNotices(mergeNotices(entry));
  const description = (entry.description || "").trim();
  const example = (entry.example || "").trim();

  const blocks = [keywordHeading(entry)];
  if (notices) blocks.push(notices);
  blocks.push(`Introduced in: ${minVersion}`);
  blocks.push(`output: \`${entry.output_type}\``);
  blocks.push(`description:\n\n${description}`);
  blocks.push(`example:\n\n\`\`\`clarity\n${example}\n\`\`\``);
  blocks.push("***");

  return blocks.join("\n\n") + "\n";
}

function byName(a, b) {
  return a.name.localeCompare(b.name);
}

function main() {
  const raw = readInput();
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse input JSON:", err.message);
    process.exit(1);
  }

  const functions = (data.functions || []).slice().sort(byName);
  const keywords = (data.keywords || []).slice().sort(byName);

  if (functions.length === 0) {
    console.error("No functions found in input JSON; refusing to overwrite.");
    process.exit(1);
  }

  const functionsBody = functions.map(renderFunction).join("\n");
  const keywordsBody = keywords.map(renderKeyword).join("\n");

  writeFileSync(FUNCTIONS_PATH, FUNCTIONS_FRONTMATTER + functionsBody);
  writeFileSync(KEYWORDS_PATH, KEYWORDS_FRONTMATTER + keywordsBody);

  console.error(
    `Wrote ${functions.length} functions to ${FUNCTIONS_PATH} and ${keywords.length} keywords to ${KEYWORDS_PATH}.`
  );
}

main();
