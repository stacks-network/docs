# Clarity VSCode Extension

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/clarity-vsc-extension.png" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
The [VSCode extension](https://marketplace.visualstudio.com/items?itemName=StacksLabs.clarity-stacks) for Clarity is now published under the Stacks Labs organization.
{% endhint %}

## Features

### Smart auto-completion

The extension provides intelligent code completion that understands Clarity's context. When you start typing any Clarity function, you get instant suggestions with documentation:

```clarity
;; Type "stx-tr" and get:
(stx-transfer? amount sender recipient)
;;             ^      ^      ^
;;             Placeholders for easy navigation
```

Use `Tab` to jump between placeholders and `Escape` to exit placeholder mode.

### Documentation on hover

Access comprehensive documentation without leaving your editor. Hover over any Clarity function or keyword to see:

```clarity
;; Hover over 'map-set' to see:
;; - Function signature
;; - Parameter descriptions
;; - Return type
;; - Usage examples
(map-set my-map {key: "value"} "data")
```

### Go-to definition

Navigate your codebase efficiently with jump-to-definition features:

* `F12` or `Ctrl+Click` - Go to definition
* `Alt+F12` - Peek definition without leaving current file
* Works across contract files and contract calls

### Real-time error checking

The extension validates your code continuously, providing immediate feedback:

* **Red squiggles** - Syntax errors, unknown keywords
* **Yellow squiggles** - Warnings for potentially unsafe code
* **Error list** - All issues in the Problems panel (`Ctrl+Shift+M`)

Common errors caught include undefined variables, type mismatches, missing trait implementations, and invalid function signatures.

### Local contract resolution

Auto-completion works across your entire project. Reference functions from other contracts in your workspace:

```clarity
;; Auto-complete local contract calls
(contract-call? .my-token transfer amount sender recipient)
;;               ^
;;               Suggests contracts in your project
```

### Trait support

When implementing traits (like SIP-009 NFTs or SIP-010 tokens), the extension verifies:

* All required functions are implemented
* Function signatures match trait definitions
* Return types are correct

```clarity
;; Extension warns if missing required trait functions
(impl-trait .sip-010-trait.sip-010-trait)

;; ⚠️ Warning: Missing required function 'get-balance'
```

### Visual debugging

{% stepper %}
{% step %}
**Set breakpoints**

Set breakpoints by clicking line numbers in the editor.
{% endstep %}

{% step %}
**Start debugging**

Press `F5` or use Run → Start Debugging to begin a debugging session.
{% endstep %}

{% step %}
**Step through code**

Step through code line-by-line to follow execution.
{% endstep %}

{% step %}
**Inspect state**

Inspect variables and stack state while paused at breakpoints.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
Visual debugging requires VS Code Desktop and Clarinet installed locally.
{% endhint %}

## Comparison table

| Feature               | Basic Editor    | VS Code Extension       |
| --------------------- | --------------- | ----------------------- |
| Syntax highlighting   | Limited         | Full Clarity support    |
| Auto-completion       | None            | Context-aware with docs |
| Error checking        | On deploy only  | Real-time validation    |
| Documentation         | External lookup | Inline hover docs       |
| Debugging             | Console only    | Visual debugger         |
| Cross-file navigation | Manual          | Jump to definition      |

***

### Additional Resources

* \[[zed.dev](https://zed.dev/extensions?query=clarity)] Zed extension for Clarity
