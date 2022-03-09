---
title: Deploy tips
description: Learn some common methods for deploying your application.
---

## Introduction

Stacks applications are web applications that authenticate users with Stacks Auth and store data with Gaia.
Both of these technologies can be accessed on the client side. As such, Stacks apps tend to be simple in design and
operation, since in many cases, they don’t have to host anything besides the application’s assets.

## Where to deploy your application

Before users can interact with your application, you must deploy it on a server that is accessible over the internet. Deploying requires that you:

- Configure or customize the files in the `public` directory.
- Build your application site for deployment.
- Copy your generated application files to your production server.

If you first populated your application with the Stacks application generator, your application contains the starting blocks for configuring, building, and deploying your app. For example, the React template builds out a scaffolding with the following building blocks.

| File or Directory          | Description                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| node_modules/react-scripts | A set of scripts for that helps you kick off React projects without configuring, so you do not have to set up your project by yourself.                                        |
| package.json               | Contains a scripts section that includes a reference to the react-scripts, which are a dependency. This script creates a build directory containing your files for deployment. |
| public/favicon.ico         | An example shortcut icon.                                                                                                                                                      |
| public/index.html          | An entry page for an application.                                                                                                                                              |
| public/manifest.json       | A JSON file that describes your web application to the browser.                                                                                                                |
| cors                       | Contains example deployment files for cross-origin request configuration.                                                                                                      |

If you use the generator to build JavasScript or Vue scaffolding, your project configuration files will be different.

Regardless of which scaffolding you use, you must customize and extend this basic scaffolding as needed by your application. For example, you may want to add more properties to the `manifest.json` file. Since every application is different, Stacks Auth cannot give you specific instructions on how to do this. The steps you take are specific to your application.

## Stacks Authentication and deployment

When your application authenticates users with Stacks, the Stacks Wallet at on URL requests a resource (the app manifest) from your DApp. A request for a resource outside of the origin (the Stacks Wallet) is called as a _cross-origin request_(CORs). Getting data in this manner can be risky, so you must configure your website security to allow interactions across origins.

You can think of CORS interactions as an apartment building with Security. For example, if you need to borrow a ladder, you could ask a neighbor in your building who has one. Security would likely not have a problem with this request (that is, same-origin, your building). If you needed a particular tool, however, and you ordered it delivered from an online hardware store (that is, cross-origin, another site), Security may request identification before allowing the delivery man into the apartment building. (Credit: Codecademy)

The way you configure CORs depends on which company you use to host your web application. The application generator adds a `cors` directory to your application scaffolding. This directory contains files for Netlify (`_headers` and `_redirects`) as well as one for Firebase (`firebase.json`). The configurations in the `cors` directory make your application's `manifest.json` file accessible to other applications (for example, to the Stacks Browser). If you are deploying to a service other than Netlify or Firebase, you must configure CORS on that service to include the following headers when serving `manifest.json`:

````html
Access-Control-Allow-Origin: * Access-Control-Allow-Headers: "X-Requested-With, Content-Type,
Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding" Access-Control-Allow-Methods:
"POST, GET, OPTIONS, DELETE, PUT"```
````

Consult the documentation for your hosting service to learn how to configure CORS on that service.

## Deployment and Radiks

If you are deploying a Stacks application that uses Radiks, your deployment includes a server and a database component. You must take this into account when deploying your application. You may want to choose a service such as Heroku or Digital Ocean if your app uses Radiks.
