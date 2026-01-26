Based on the latest available documentation, here's the updated version of the Clarity Formatter documentation:
Clarity Formatter
The Clarity formatter automatically shapes your smart contract code to follow standardized style rules. Consistent formatting improves readability and makes collaboration easier across teams.
Formatting philosophy
The formatter applies an opinionated standard designed to make Clarity code more readable:

Line length – wraps lines at 80 characters by default
Indentation – uses two spaces for consistency
Structure – enforces consistent patterns for functions, let bindings, and control flow

You can customize these defaults to match your preferences.
Integration points
The Clarity formatter is available through two primary tools:
Clarity VS Code Extension
Format directly in the editor with support for:

Format on save (disabled by default)
Format on demand
Format selection (format only highlighted code)

Clarinet CLI
Format via command line, including entire projects.
Comparison table
AspectManual formattingClarity formatterConsistencyVaries by developerUniform across the codebaseSpeedTime-consumingInstantError-proneYesNoTeam coordinationRequires a style guideAutomatic enforcement
Best practices

Format on save – enable automatic formatting in VS Code settings (set to off by default)
Format checks in CI/CD – use --check flag to validate formatting in pipelines
Team adoption – share consistent settings with your team
Format entire projects – use Clarinet CLI to format all contracts in your project

Formatting rules in detail
Function definitions
Functions span multiple lines with consistent indentation:
clarity(define-public (my-func
    (amount uint)
    (sender principal)
  )
  (ok true)
)
Single arguments can remain on the first line:
clarity(define-read-only (get-balance (who principal))
  (ok u0)
)
Let expressions
Bindings are placed on separate lines with consistent indentation:
clarity(let (
  (a u1)
  (b u2)
)
  (body-expression)
)
Control flow (if, match)
Each branch receives its own line:
clarity(if condition
  (then-expression)
  (else-expression)
)

(match optional-value
  value (handle-some value)
  (handle-none)
)
Tuples and maps
The formatter automatically converts to sugared syntax with proper formatting:
clarity;; Input: (tuple (n1 u1) (n2 u2))
;; Output:
{
  n1: u1,
  n2: u2,
}
Usage examples
VS Code integration
Enable format on save in your VS Code settings:
json// settings.json
"[clarity]": {
  "editor.formatOnSave": true
}
CLI usage
Format files with standard options:
bash# Format and modify files in place
clarinet format --in-place

# Format a specific file
clarinet format --file contracts/token.clar --in-place

# Check formatting without modifying files (ideal for CI/CD)
clarinet format --check

# Preview formatting changes without modifying files
clarinet format --dry-run
CLI options
OptionShortDescriptionRequired--checkCheck if code is formatted without modifying filesNo--dry-runOnly echo the result of formattingNo--in-placeReplace the contents of a file with the formatted codeNo--file <path>Specify a specific file to formatNo
The --check flag validates that all Clarity files are properly formatted without changing them, making it ideal for continuous integration workflows.
Ignoring blocks of code
Prevent formatting for specific code blocks by preceding them with a comment:
clarity;; @format-ignore
(define-constant something (list
  1     2  3  ;; Preserves custom spacing
  4 5 ))
Additional resources

Sample contracts – View well-formatted contract examples in the Stacks ecosystem
Formatter README – Detailed technical documentation about the formatter
Official documentation – Visit the Stacks documentation for comprehensive guides

Important notes

The Clarity formatter is actively evolving based on community feedback
Format on save is disabled by default in VS Code to give developers control
The formatter helps enforce best practices for let bindings and other Clarity constructs
Use caution when first adopting the formatter and review changes before committing
