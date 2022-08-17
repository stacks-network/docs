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
### Ejecutando y construyendo el sitio en local (opcional)

Puedes iniciar la página en local con el siguiente comando. Esto es suficiente para previsualizar tus cambios.
```bash
npx docusaurus start
```

Antes de ejecutar este comando por primera vez, debes de ejecutar `npm install` para instalar las dependencias.

La página de docs será accesible en la siguiente url: [`http://localhost:3000`](http://localhost:3000).


Una vez finalizados los cambios, puedes construir un site entero con el siguiente comando (normalmente no es necesario):
```bash
npm run build
```

:::consejo `npx docusaurus start` solo se carga la lengua por defecto (inglés). Para testear todos los lenguajes puedes crear una versión con `npm run build` y luego previsualizarla con `npm run serve`. :::

### Una alternativa: trabajar en el navegador

Como alternativa a trabajar en local, también puedes usar el IDE web gitpod que porvee un entorno para contrubuir directamente desde tu navegador.

Solo necesitas un cuenta de GitHub y abrir [este link](https://gitpod.io/#https://github.com/stacks-network/docs).

### Estructura de los ficheros

Si te interesa añadir nuevo contenido de documentación en este sitio, los ficheros que relevantes están en `./docs/*`:

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

La ruta de este sitio está basada en archivos, es decir, si creaste una carpeta dentro de `/docs/gaia/` nombrada `testing` y en ella un archivo llamado `test1. d`, podrías navegar a `http://localhost:3000/gaia/testing/test1` y verías cualquier contenido en ese archivo de markdown.

Todos los documentos en inglés se almacenan en la carpeta `/docs/`.

Para añadir nuevos contenidos en inglés simplemente agregue un archivo markdown (.md) en cualquier subcarpeta en docs, y se mostrará automáticamente en la categoría de esa carpeta.

Todos los documentos en otros idiomas se almacenan bajo la carpeta `i18n`, pero estos archivos nunca deben editarse usando GitHub, ya que son sobrescritos por Crowdin cada vez que se agregan nuevas traducciones.  **Para hacer cambios en otros idiomas**, debes hacerlo usando Crowdin. Por favor, consulta [traducciones](translations) en su lugar.

### Frontmatter

Frontmatter es la parte superior de cualquier documento markdown que esté escrito en un idioma llamado [YAML](https://yaml.org/). Se verá así:

```yaml
---
title: Este es mi título de página
description: Una frase breve y concisa que describe lo que está en esta página
---
```

Frontmatter nos da la capacidad de definir algunas cosas dentro de una página que el sitio puede usar, como un título de página o descripción de página. Al agregar cualquier nueva página, por favor incluya un `tittle` y `description`.


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

Utilizamos los [Commits Convencionales](https://www.conventionalcommits.org/en/v1.0.0/) y la convención de nombres de commits. Utilízalo mientras contribuyes, por favor.

### Bloques de código

Para escribir un bloque de código, necesitas envolver tu código en ` ```language `, y termina tu bloque de código con ` ``` `. Aquí hay un ejemplo de ` ```clarity `.

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

:::tip My personalized title
Some **content** with _markdown_ `syntax`.
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

:::tip My personalized title

Algo de **contenido** con `syntax` markdown.

:::