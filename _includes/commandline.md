
The command line is intended for developers only. Developers can use the command
line to test and debug Blockstack applications in ways that the Blockstack
Browser does not yet support. Using the command line, developers can:

* Generate and Broadcast all supported types of Blockstack transactions
* Load, store, and list data in Gaia hubs
* Generate owner, payment and application keys from a seed phrase
* Query Blockstack core nodes
* Implement a minimum viable authentication flow

{% include warning.html content="Many of the commands operate on unencrypted
private keys. For this reason, DO NOT use this tool for day-to-day tasks as you
risk the security of your keys." %}

You must <a href="#installCommandLine">install the command line</a> before you
can use the commands

## List of commands
{:.no_toc}

* TOC
{:toc}


{% for entry in site.data.cliRef %}
## {{ entry.command }}

**Group**: {{ entry.group }}

{{ entry.usage }}

### Arguments
{:.no_toc}

<table class="uk-table uk-table-small uk-table-striped">
<tr>
  <th>Name</th>
  <th>Type</th>
  <th>Value</th>
  <th>Format</th>
</tr>
  {% for arg in entry.args %}
<tr>
<td class="uk-text-bold">{{ arg.name }}</td>
<td>{{ arg.type }}</td>
<td>{{ arg.value }}</td>
<td><code style="font-size:10px">{{ arg.format }}</code></td>
</tr>

  {% endfor %}
</table>

{% endfor %}

<p><a name="installCommandLine">&nbsp;</a></p>

##  How to install the command line
{:.no_toc}

These instructions assume you are using a macOS or Linux system. Installing the
command line relies on the `npm` dependency manager and optionally Git. If you
don't find `npm` in your system, <a href="https://www.npmjs.com/get-npm"
target="\_blank">install it</a>.

To install the command line:

1. <a href="https://github.com/blockstack/cli-blockstack" target="\_blank">Download or `git clone` the command line repository code</a>.  

   Download or cloning the repo creates a `cli-blockstack` repository on your system.

2. Change directory into the `cli-blockstack` directory.

   ```
   cd cli-blockstack
  ```


3. Install the dependencies with `npm`.

   ```
   npm install
   ```

4. Build the command line command.

   ```
   npm run build
   ```

5. Link the command.

   ```
   sudo npm link
   ```
