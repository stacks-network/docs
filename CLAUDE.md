# Documentation Sync System

## Purpose
This repository monitors merged PRs across all Stacks Network and Hiro Systems projects and ensures documentation stays in sync with code changes.

## Monitored Repositories

### Stacks Network (21 repositories)
- **stacks-core** - Core Stacks blockchain implementation
- **clarity-wasm** - Clarity smart contract WASM implementation
- **docs** - This documentation repository
- **stacks-blockchain-docker** - Docker configurations for Stacks blockchain
- **clarunit** - Unit testing framework for Clarity
- **bitcoin** - Bitcoin integration components
- **c32check** - C32check encoding library
- **stacks** - Stacks utilities and tools
- **send-many-stx-cli** - CLI for batch STX transfers
- And 12 additional supporting repositories

### Hiro Systems (8 repositories)
- **clarinet** - Clarity development environment and testing framework
- **stacks.js** - JavaScript libraries for Stacks
- **connect** - Wallet connection library (formerly stacks-connect)
- **stacks.js-starters** - Starter templates for Stacks.js
- **vitest-environment-clarinet** - Vitest environment for Clarity testing
- And 3 additional supporting repositories

## Documentation Structure

### Primary Documentation Sections
- `/concepts/` - Conceptual documentation about Stacks, PoX, Clarity, sBTC
- `/guides-and-tutorials/` - Hands-on tutorials and how-to guides
- `/reference/` - API reference and technical specifications
- `README.md` - Quick start and overview

### Key Documentation Areas
- **Stacks blockchain concepts** - `/concepts/stacks-101/`
- **sBTC documentation** - `/concepts/sbtc/`
- **Clarity language** - `/concepts/clarity/`
- **Node operations** - `/guides-and-tutorials/nodes-and-miners/`
- **Signer operations** - `/guides-and-tutorials/running-a-signer/`
- **Stacking guides** - `/guides-and-tutorials/stack-stx/`
- **Developer quickstart** - `/guides-and-tutorials/hello-stacks-quickstart-tutorial.md`

## Review Process

### When Analyzing Merged PRs

1. **Fetch the full diff** - Don't just read the PR summary
   - Use `curl [diff_url]` or `gh api /repos/OWNER/REPO/pulls/NUMBER` to get complete changes
   - Look at actual code changes, not just commit messages

2. **Identify user impact** - Ask these questions:
   - Does this change what developers see or do?
   - Does this affect APIs, CLIs, or SDKs?
   - Does this change configuration or setup steps?
   - Does this introduce new features or capabilities?
   - Does this break existing functionality?

3. **Check documentation** - Search our docs for related content:
   - Use `grep -r "relevant_term" concepts/ guides-and-tutorials/ reference/`
   - Look for mentions of changed functions, APIs, or concepts
   - Check if tutorials reference affected code

4. **Be specific** - Point to exact files and sections that need updates
   - Don't say "update the Clarity docs"
   - Say "update `/concepts/clarity/language-functions.md` line 145 to reflect new `map-set` signature"

### What Requires Documentation

✅ **Always document:**
- New API endpoints or methods
- Changed function signatures (especially in public APIs)
- New Clarity functions or keywords
- New CLI commands or flags
- Modified configuration options
- Changed setup/installation steps
- Breaking changes (HIGH PRIORITY)
- New features or capabilities
- Changes to sBTC, stacking, or signing operations
- Updates to Stacks.js APIs
- Changes to Clarinet commands or configuration

❌ **Skip documentation for:**
- Internal refactoring with no external impact
- Test-only changes
- CI/CD pipeline updates
- Dependency updates (unless breaking or adding new capabilities)
- Bug fixes that restore intended behavior without changing usage
- Performance optimizations that don't change APIs
- Internal code comments or documentation in code

### Priority Levels

**High Priority** (Document immediately):
- Breaking changes to public APIs
- New major features (sBTC updates, new Clarity functions)
- Security-related changes
- Changes affecting node operators, signers, or stackers
- Setup/installation changes

**Medium Priority** (Document soon):
- New optional features
- Enhanced functionality in existing features
- New CLI flags or options
- Performance improvements with usage implications
- Updated examples or best practices

**Low Priority** (Document when convenient):
- Minor API additions that are self-explanatory
- Internal improvements with minor user-facing impact
- Clarifications or additional options

### Issue Creation Guidelines

When creating a documentation issue:

**Title Format:**
```
[Docs Update] [repo-name] PR #123: Brief description
```

**Body Structure:**
```markdown
## Source PR
- Repository: [owner/repo]
- PR: #123 - [PR title]
- URL: [PR URL]
- Merged: [YYYY-MM-DD]

## What Changed
[2-3 sentences describing the functional changes from a user perspective]

## Documentation Impact

### Files Needing Updates
- [ ] `/path/to/file.md` - [Specific change needed]
- [ ] `/another/file.md` - [Specific change needed]

## Recommended Changes

### In `/path/to/file.md`

**Section: [Section Name]**

Add/Update:
```
[Exact or suggested text to add/change]
```

Context: [Why this change is needed and where it fits]

### In `/another/file.md`

**Section: [Section Name]**

Add/Update:
```
[Exact or suggested text to add/change]
```

Context: [Why this change is needed and where it fits]

## Priority
[High/Medium/Low] - [Reason]

---
*Auto-generated by docs sync monitor*
```

**Labels to Apply:**
- `documentation` (always)
- `auto-generated` (always)
- `sync-needed` (always)
- Repository name (e.g., `stacks-core`, `clarinet`, `stacks.js`)
- Priority level (e.g., `priority-high`, `priority-medium`, `priority-low`)

### Example Good Issue

**Title:** `[Docs Update] stacks-core PR #456: Add new Clarity built-in function map-insert`

**Body:**
```markdown
## Source PR
- Repository: stacks-network/stacks-core
- PR: #456 - Add map-insert built-in function to Clarity
- URL: https://github.com/stacks-network/stacks-core/pull/456
- Merged: 2025-09-15

## What Changed
Added a new Clarity built-in function `map-insert` that inserts a key-value pair into a map only if the key doesn't exist. Returns `(ok true)` if inserted, `(err false)` if key already exists. This complements the existing `map-set` function which always overwrites.

## Documentation Impact

### Files Needing Updates
- [ ] `/concepts/clarity/language-functions.md` - Add documentation for map-insert function
- [ ] `/guides-and-tutorials/clarity-hello-world.md` - Update map operations example
- [ ] `/reference/clarity-language-reference.md` - Add to function reference table

## Recommended Changes

### In `/concepts/clarity/language-functions.md`

**Section: Map Functions**

Add after the `map-set` documentation:

```markdown
#### map-insert

`(map-insert map-name key-tuple value-tuple)`

Inserts a key-value pair into the specified map only if the key does not already exist. If the key exists, the map is unchanged and an error is returned.

**Parameters:**
- `map-name` - The name of the map
- `key-tuple` - The key to insert
- `value-tuple` - The value to associate with the key

**Returns:** `(response bool bool)` - Returns `(ok true)` if the key was inserted, `(err false)` if the key already existed.

**Example:**
```clarity
(define-map scores principal uint)

(map-insert scores tx-sender u100) ;; Returns (ok true)
(map-insert scores tx-sender u200) ;; Returns (err false) - key exists
```

Use `map-insert` when you need to ensure a key is only set once, such as initializing user records. Use `map-set` when you want to always update the value regardless of whether the key exists.
```

### In `/reference/clarity-language-reference.md`

**Section: Built-in Functions Table**

Add row to the Map Functions table:
```
| map-insert | (map-insert map-name key value) | Inserts key-value pair if key doesn't exist | (response bool bool) |
```

## Priority
High - New language feature that developers need to know about immediately

---
*Auto-generated by docs sync monitor*
```

### Example Bad Issue (Don't Do This)

❌ **Title:** `Update docs for PR #456`

❌ **Body:**
```markdown
PR #456 was merged. It added some new Clarity stuff. Someone should update the docs.
```

**Why it's bad:**
- Vague title without context
- No specifics on what changed
- No guidance on what docs need updates
- No recommended changes
- No priority assessment

## GitHub API Usage

You have access to GitHub API via `gh` CLI:

```bash
# Fetch PR details
gh api /repos/OWNER/REPO/pulls/NUMBER

# Get file contents
gh api /repos/OWNER/REPO/contents/PATH

# Create issues
gh issue create --repo OWNER/REPO \
  --title "[Docs Update] ..." \
  --body "..." \
  --label "documentation,auto-generated,sync-needed"

# Search code
gh api /search/code?q=map-insert+repo:stacks-network/docs
```

## Grouping Related PRs

If multiple PRs from the same repository affect the same documentation section, consider creating ONE issue that covers all changes:

**Title:** `[Docs Update] [repo-name] Multiple PRs: Clarity map function updates`

**Body includes all PRs:**
```markdown
## Source PRs
- PR #456 - Add map-insert function
- PR #457 - Add map-update function
- PR #458 - Deprecate map-set? function

## What Changed
[Combined summary of all changes]

[Rest of issue structure...]
```

## Testing and Validation

Before creating an issue, verify:
1. ✅ The PR actually changed user-facing functionality
2. ✅ Our documentation references the changed functionality
3. ✅ The recommended changes are accurate and specific
4. ✅ The priority level is appropriate
5. ✅ Similar issues don't already exist

## Notes for Claude Code Action

When running in the GitHub Action context:
- You have full read access to this docs repository
- You can create issues but NOT commit changes directly
- Focus on creating high-quality, specific issues
- Batch API calls when possible to avoid rate limits
- Be conservative - it's better to skip a PR than create a low-quality issue
- If unsure about a PR's impact, include that uncertainty in the issue with a lower priority
