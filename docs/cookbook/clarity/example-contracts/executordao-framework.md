# ExecutorDAO Framework

{% code title="executor-dao.clar" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; ExecutorDAO is the one DAO to rule them all. 
;; By Marvin Janssen

(use-trait proposal-trait .proposal-trait.proposal-trait)
(use-trait extension-trait .extension-trait.extension-trait)

(define-constant err-unauthorised (err u1000))
(define-constant err-already-executed (err u1001))
(define-constant err-invalid-extension (err u1002))

(define-data-var executive principal tx-sender)
(define-map executed-proposals principal uint)
(define-map extensions principal bool)

;; --- Authorisation check

(define-private (is-self-or-extension)
	(ok (asserts! (or (is-eq tx-sender (as-contract tx-sender)) (is-extension contract-caller)) err-unauthorised))
)

;; --- Extensions

(define-read-only (is-extension (extension principal))
	(default-to false (map-get? extensions extension))
)

(define-public (set-extension (extension principal) (enabled bool))
	(begin
		(try! (is-self-or-extension))
		(print {event: "extension", extension: extension, enabled: enabled})
		(ok (map-set extensions extension enabled))
	)
)

(define-private (set-extensions-iter (item {extension: principal, enabled: bool}))
	(begin
		(print {event: "extension", extension: (get extension item), enabled: (get enabled item)})
		(map-set extensions (get extension item) (get enabled item))
	)
)

(define-public (set-extensions (extension-list (list 200 {extension: principal, enabled: bool})))
	(begin
		(try! (is-self-or-extension))
		(ok (map set-extensions-iter extension-list))
	)
)

;; --- Proposals

(define-read-only (executed-at (proposal <proposal-trait>))
	(map-get? executed-proposals (contract-of proposal))
)

(define-public (execute (proposal <proposal-trait>) (sender principal))
	(begin
		(try! (is-self-or-extension))
		(asserts! (map-insert executed-proposals (contract-of proposal) block-height) err-already-executed)
		(print {event: "execute", proposal: proposal})
		(as-contract (contract-call? proposal execute sender))
	)
)

;; --- Bootstrap

(define-public (construct (proposal <proposal-trait>))
	(let ((sender tx-sender))
		(asserts! (is-eq sender (var-get executive)) err-unauthorised)
		(var-set executive (as-contract tx-sender))
		(as-contract (execute proposal sender))
	)
)

;; --- Extension requests

(define-public (request-extension-callback (extension <extension-trait>) (memo (buff 34)))
	(let ((sender tx-sender))
		(asserts! (is-extension contract-caller) err-invalid-extension)
		(asserts! (is-eq contract-caller (contract-of extension)) err-invalid-extension)
		(as-contract (contract-call? extension callback sender memo))
	)
)
```
{% endcode %}

{% hint style="info" %}
For the full framework implementation, check out the [ExecutorDAO](https://github.com/MarvinJanssen/executor-dao) project repo.
{% endhint %}

## Contract Summary

ExecutorDAO is a modular, extensible DAO framework that uses a trait-based architecture to enable flexible governance structures. This contract serves as the core execution engine that manages proposals and extensions, providing a foundation for building customizable decentralized autonomous organizations.

**What this contract does:**

* Acts as the central authority for DAO governance and execution
* Manages and validates extensions (modules that add functionality to the DAO)
* Executes proposals that have been approved through governance mechanisms
* Tracks executed proposals to prevent double-execution
* Provides extension authorization checks for secure operations
* Supports batch extension management (enable/disable up to 200 extensions)
* Implements a bootstrap mechanism for initial DAO setup
* Enables callback functionality for extensions to interact with the core
* Uses trait-based design for proposal and extension modularity
* Transfers executive control from deployer to the DAO itself during construction

**What developers can learn:**

* Building modular smart contract architectures with trait-based extensions
* DAO governance patterns with proposal execution frameworks
* Authorization patterns: self-or-extension checks for privileged operations
* Using `as-contract` context switching for DAO-initiated actions
* Preventing replay attacks by tracking executed proposals
* Bootstrap patterns for transitioning control from deployer to contract
* Callback mechanisms for cross-contract communication
* Batch operations with list iteration using `map` functions
* Extension/plugin architecture for composable smart contracts
* Event logging with print statements for off-chain indexing
* Using `contract-of` to verify trait implementations and prevent impersonation

***

{% embed url="https://youtu.be/U4J_JnbTg2o?si=7Dnh4CJxfuo1BeN8" %}
