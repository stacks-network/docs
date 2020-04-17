---
layout: learn
description: Blockstack dApp documentation
permalink: /:collection/:path.html
---
# How to deploy a Blockstack dApp
{:.no_toc}

Blockstack applications are web applications that authenticate users with Blockstack Auth and store data with Gaia. Both of these technologies can be accessed on the client side.  As such, Blockstack apps tend to be simple in design and operation, since in many cases, they don’t have to host anything besides the application’s assets.

 * TOC
 {:toc}

## Where to deploy your application

Before users can interact with your application, you must deploy it on a server that is accessible over the internet. Deploying requires that you:

* Configure or customize the files in the `public` directory.
* Build your application site for deployment.
* Copy your generated application files to your production server. 

If you first populated your application with the Blockstack application generator, your application contains the starting blocks for configuring, building, and deploying your app. For example, the React template builds out a scaffolding with the following building blocks.

<table class="uk-table">
  <tr>
    <th>File or Directory</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>node_modules/react-scripts</code></td>
    <td>A set of scripts for that helps you kick off React projects without configuring, so you do not have to set up your project by yourself.</td>
  </tr>
  <tr>
    <td><code>package.json</code></td>
    <td>Contains a scripts section that includes a reference to the react-scripts, which are a dependency. This script creates a <code>build</code> directory containing your files for deployment.</td>
  </tr>
  <tr>
    <td><code>public/favicon.ico</code></td>
    <td>An example shortcut icon.</td>
  </tr>
  <tr>
    <td><code>public/index.html</code></td>
    <td>An entry page for an application.</td>
  </tr>
  <tr>
    <td><code>public/manifest.json</code></td>
    <td>A JSON file that describes your web application to the browser.&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td><code>cors</code></td>
    <td>Contains example deployment files for cross-origin request configuration.</td>
  </tr>
</table>

If you use the generator to build Javascript or Vue scaffolding, your project configuration files will be different. 

Regardless of which scaffolding you use, you must customize and extend this basic scaffolding as needed by your application. For example, you may want to add more properties to the `manifest.json` file. Since every application is different, Blockstack cannot give you specific instructions on how to do this. The steps you take are specific to your application.

## Blockstack Authentication and deployment

When your application authenticates users with Blockstack, your DApp at one URL requests a resource (an identity) from another DApp, the Blockstack Browser. A request for a resource outside of the origin (your new website) is called as a _cross-origin request_(CORs). Getting data in this manner can be risky, so you must configure your website security to allow interactions across origins.

You can think of CORS interactions as an apartment building with Security. For example, if you need to borrow a ladder, you could ask a neighbor in your building who has one. Security would likely not have a problem with this request (i.e., same-origin, your building). If you needed a particular tool, however, and you ordered it delivered from an online hardware store (i.e., cross-origin, another site), Security may request identification before allowing the delivery man into the apartment building. (Credit: <a href="https://www.codecademy.com/articles/what-is-cors" target="\_blank">Codecademy</a>)

The way you configure CORs depends on which company you use to host your web application.  The application generator adds a `cors` directory to your application scaffolding. This directory contains files for Netlify (`_headers` and `_redirects`) as well as one for Firebase (`firebase.json`).  The configurations in the `cors` directory make your application's `manifest.json` file accessible to other applications (for example, to the Blockstack Browser). If you are deploying to a service other than Netlify or Firebase, you must configure CORS on that service to include the following headers when serving `manifest.json`: 

```html
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding"
Access-Control-Allow-Methods: "POST, GET, OPTIONS, DELETE, PUT"```
```

Consult the documentation for your hosting service to learn how to configure CORS on that service.

## Deployment and Radiks

If you are deploying a Blockstack application that uses Radiks, your deployment includes a server and a database component. You must take this into account when deploying your application. You may want to choose a service such as Heroku or Digital Ocean if your app uses Radiks.
