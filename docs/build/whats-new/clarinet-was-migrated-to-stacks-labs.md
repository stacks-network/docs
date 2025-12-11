---
description: November 5, 2025
---

# Clarinet was migrated to Stacks Labs

{% hint style="success" %}
Clarinet was transferred from Hiro to Stacks Labs.
{% endhint %}

You may have noticed that the Clarinet repository now belongs to the stx-labs organization.

With the **3.9.0** release, a few other things have changed:

* The NPM packages are now published under the `@stacks` organization.
* The VSCode extension is now published under the Stacks Labs organization.

***

### tl;dr

Checklist:\
✅ Update NPM packages:

* `"@stacks/clarinet-sdk": "^3.10.0"`
* `"vitest-environment-clarinet": "3.0.2"`\
  ✅ Replace all imports of `@hiroystems/clarinet-sdk` to `@stacks/clarinet-sdk`\
  ✅ Optionally, update Vitest to v4 and **update vitest config**

***

### How to migrate?

#### VSCode

In VSCode (or similar variants such as Cursor), you'll have to uninstall the Hiro Systems "Clarity" extension in favor of the new "Clarity - Stacks Labs" extension published by Stacks Labs. The name of the extension will eventually revert to "Clarity" at some point, once the Hiro one is deprecated. You can also see it in the [online marketplace](https://marketplace.visualstudio.com/items?itemName=StacksLabs.clarity-stacks) - feel free to leave a 5 ⭐ review if you enjoy Clarinet!

#### NPM

New Clarinet projects created with 3.9.0 will automatically use the `@stacks/` NPM package.

However, older projects require a few manual updates to be migrated.

#### `package.json`

In your package.json, replace `@hirosystems/clarinet-sdk` with the `@stacks` one, and upgrade `vitest-environement-clarinet` to version 3.0.1. Your dependencies should look like that.

Optionally, you can upgrade to Vitest@4, more on that below

```
  "dependencies": {
    "@stacks/clarinet-sdk": "^3.10.0",
    "@stacks/transactions": "^7.3.0",
    "@types/node": "24.10.0",
    "chokidar-cli": "3.0.0",
    "vitest": "^4.0.7",
    "vitest-environment-clarinet": "3.0.2"
  }
```

#### `tsconfig.json`

In the tsconfig.json, you need to update the `"includes"` config like so, so that is using `@stacks/clarinet-sdk`

```
  "include": ["node_modules/@stacks/clarinet-sdk/vitest-helpers/src", "tests"]
```

#### `vitest.config.ts` (or `.js`)

Your Vitest config has to import `@stacks/clarinet-sdk/vitest`.

Double check that you import `defineConfig` from `"vitest/config"` and not `"vite"`.

```
import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";
```

If you upgraded to Vitest v4, a few other changes are needed in `defineConfig`:

```
...

export default defineConfig({
  test: {
    // use vitest-environment-clarinet
    environment: "clarinet",
    pool: "forks",
    // clarinet handles test isolation by resetting the simnet between tests
    isolate: false,
    maxWorkers: 1,
    setupFiles: [
      vitestSetupFilePath,
      // custom setup files can be added here
    ],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
        // add or override options
      },
    },
  },
});
```

#### Docker image

The Clarinet Docker image has been moved from Docker Hub to GitHub Container Registry (ghcr). It can be used like so:

```
jobs:
  sanity-checks:
    runs-on: ubuntu-latest
    container: ghcr.io/stx-labs/clarinet:latest
    steps:
      - uses: actions/checkout@v4
      - name: Check Clarity contracts check
        run: clarinet check --use-on-disk-deployment-plan
      - name: Check Clarity contracts format
        run: clarinet fmt --check
```

#### Double check

Search for all occurrences of `@hirosystems/clarinet-sdk` in your project; they'll likely need to be updated to `@stacks/clarinet-sdk`.

{% hint style="success" %}
If you're using third-party tools like Rendezvous or Clarigen, they now both support `@stacks/clarinet-sdk`.
{% endhint %}

***

### See it in action

See how the clarity-starter project was updated in this PR:\
[stx-labs/clarity-starter#17](https://github.com/stx-labs/clarity-starter/pull/17)

### Conclusion

We understand that these types of breaking changes can be frustrating. Although it's not ideal, we need it to move forward.

If you experience any issues with the migrations, reach out to us in the `#clarinet` channel on Discord or reply to this discussion.<br>
