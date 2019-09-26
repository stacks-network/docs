You use `npm` to install Yeoman and Blockstack App Generator. Yeoman is a generic scaffolding system that helps users rapidly start new projects and streamline the maintenance of existing projects.


1. Use `npm` to install Yeoman and the Blockstack generator

    ```bash
    npm install -g yo generator-blockstack
    ```
    
You can use the generator to create scaffolding for a starter application. The generator can create scaffolding for any of these frameworks:

<table class="uk-table">
  <tr>
    <th>Framework</th>
    <th>Use this command to install</th>
  </tr>
  <tr>
    <td>Plain Javascript</td>
    <td><code> npx generator-blockstack --plain</code></td>
  </tr>
  <tr>
    <td>React</td>
    <td><code> npx generator-blockstack --react</code></td>
  </tr>
  <tr>
    <td>Vue</td>
    <td><code> npx generator-blockstack --vue
</code></td>
  </tr>
</table>

For example, to install a Vue scaffolding, you would use the  `npx generator-blockstack --vue` command.