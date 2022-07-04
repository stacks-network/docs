---
title: Contribuir a la documentación
description: Aprende cómo se construye este sitio y cómo puedes contribuir a él.
---

## Introducción

Gracias por su interés en contribuir y ayudar a que estos documentos sean tan buenos como puedan ser.

Este sitio de documentación está construido en la plataforma de código abierto [Discosaurus 2](https://docusaurus.io/) y la mayor parte de su contenido está escrito en archivos Markdown. Todo el código para este sitio es libre y de código abierto, ubicado en el [repositorio de GitHub aquí](https://github.com/stacks-network/docs).

:::tip ¿No sabes qué es Markdown? ¿Quieres aprender? Aquí hay una [guía útil](https://guides.github.com/features/mastering-markdown/) para aprenderlo.

¿No quieres aprenderlo? No es necesario. Escribe [en texto plano una observaciòn en Github](https://github.com/stacks-network/docs/issues/new?assignees=&labels=documentation&template=add-documentation.md&title=%5BAdd+docs%5D):::

:::info Necesitas una cuenta gratuita en [GitHub](https://www.github.com) para añadir o editar cualquier contenido. :::

Para editar cualquier página, solo haga clic en el botón *Editar esta página* en la parte inferior de cada página y envíe sus cambios en línea.

Para añadir nuevo contenido, existen dos formas diferentes de hacerlo, la [forma fácil](#easy-way) y la [forma avanzada](#advanced-way).

## Forma fácil

[**Simplemente haga clic aquí e ingrese el texto del artículo que desea añadir.**](https://github.com/stacks-network/docs/issues/new?assignees=&labels=documentation&template=add-documentation.md&title=%5BAdd+docs%5D)

Esto abrirá una observación en github usando nuestra plantilla.
## Forma avanzada

Para cambios más avanzados puede seguir los siguientes pasos.

También puede probar el sitio localmente utilizando este método.
### Pasos

1. Haga un Fork del [repositorio de documentos](https://github.com/stacks-network/docs) haciendo clic en el botón *Fork* en la parte superior derecha de la pantalla.
2. Clona el fork a tu máquina local con este comando `git clone git@github.com:<YOUR_USERNAME>/docs.git stacks_docs`
3. Entre a la carpeta del proyecto `cd stacks_docs`
4. Crea una rama `git checkout -b feat/my-feature-branch`.
5. Opcionalmente puede previsualizar sus cambios en tiempo real con:
    - `npm install` (para instalar dependencias).
    - `npx docusaurus start` para iniciar una copia local del sitio. Un navegador web se abrirá en http://localhost:3000, para que pueda ver una vista previa de sus cambios en tiempo real.
6. Haga los cambios que desee y luego haga un commit con este tipo de mensaje: `git commit -am "feat: some new feature or content"`.
7. Haga Push a Github con `git push --set-upstream origin feature/my-feature-branch`.
8. Visite GitHub y haga su pull request.

## Información adicional
### Running and building the site locally (optional)

You can start the page locally with the following command. This is enough to preview your changes.
```bash
npx docusaurus start
```

Before running this command for the first time you will need to run `npm install` to install dependencies.

The docs site will be accessible at this url: [`http://localhost:3000`](http://localhost:3000).


After you finished your changes, you can also build the entire site with the following command (not usually needed):
```bash
npm run build
```

:::tip `npx docusaurus start` will only load the default language (english). To test all languages you can build with `npm run build` and then preview your build with `npm run serve`. :::

### Una alternativa: trabajar en el navegador

As an alterative to working locally, you can also use the web IDE gitpod that provides an environment to contribute directly from within your browser.

You only need to have a github account and open [this link](https://gitpod.io/#https://github.com/stacks-network/docs).

### Estructura de los ficheros

If you are interested in only adding new documentation content to the site, the files that will be important to you are located within `./docs/*`:

```bash
docs/
  build-apps
  contribute/
  faq/
  gaia/
  nodes-and-miners/
  noteworthy-contracts/
  references/
  understand-stack/
  write-smart-contracts/
```

The routing for this site is file based, meaning if you created a folder within `/docs/gaia/` named `testing` and in it a file named `test1.md`, you would be able to navigate to `http://localhost:3000/gaia/testing/test1` and you would see whatever content is in that markdown file.

Todos los documentos en inglés se almacenan en la carpeta `/docs/`.

To add new English content simply add a markdown file (.md) into any subfolder in docs, and it will be automatically displayed in the category of that folder.

All the docs in other languages are stored under the folder `i18n`, but these files should never be edited using GitHub as they are overwritten by Crowdin every time new translations are added.  **To make changes in other languages**, you must do so using Crowdin. Please refer to [translations](translations) instead.

### Frontmatter

Frontmatter is the top part of any markdown document that is written in a language called [YAML](https://yaml.org/). It looks like this:

```yaml
---
title: This is my page title
description: A short, concise sentence describing what is on this page
---
```

Frontmatter gives us the ability to define some things within a page that the site can use, such as a page title or page description. When adding any new page, please include a `title` and `description`.


<!--
### Code formatter

We use [Prettier](https://prettier.io/docs/en/install.html) to check the format the code.

You can install prettier with the following command:

```bash
npm install --save-dev --save-exact prettier
```

And execute prettier with the following command:

```bash
npx prettier --write mynewfiletocheck.md
```
-->
### Usar "Commits Convencionales"

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as and commits naming convention. Use it while contributing, please.

### Bloques de código

To write a code block, you need to wrap your code in ` ```language `, and end your code block with ` ``` `. Here is an example of ` ```clarity `.

```clarity
(define-data-var counter int 0)

(define-public (get-counter)
 (ok (var-get counter)))
```
### Avisos

Puede utilizar los siguientes avisos para resaltar el contenido.

```md
:::note
Algo de **contenido** con `formato` markdown.
:::

:::tip
Algo de **contenido** con `formato` markdown.
:::

:::info
Algo de **contenido** con `formato` markdown.
:::

:::caution
Algo de **contenido** con `formato` markdown.
:::

:::danger
Algo de **contenido** con `formato` markdown.
:::
```

Se visualiza como:

:::note

Algo de **contenido** con `syntax` markdown.

:::

:::tip

Algo de **contenido** con `syntax` markdown.

:::

:::info

Algo de **contenido** con `syntax` markdown.

:::

:::caution

Algo de **contenido** con `syntax` markdown.

:::

:::danger

Algo de **contenido** con `syntax` markdown.

:::