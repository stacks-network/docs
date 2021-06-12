---
title: Radiks
description: Learn how to setup Radiks with your app
icon: BlockstackIcon
duration: 1 hour
experience: intermediate
tags:
  - tutorial
images:
  large: /images/pages/radiks.svg
  sm: /images/pages/radiks-sm.svg
---

## Introduction

Using Radiks with your application requires a Radiks server and a client application constructed to use the server.
In this article, you learn how to install, setup, and run a pre-packaged Radiks server that connects to MongoDB.
You also learn how to establish your DApp application as a client for that server.

## Task 1: Set up your Radiks server

Radiks-server is a `node.js` application that uses [MongoDB](https://www.mongodb.com/) as an underlying database.

### Install and configure MongoDB

In the future, Radiks-server will support various different databases, but right now, only MongoDB 3.6 or higher is
supported. MongoDB 3.6 and higher contains fixes required for naming patterns in keys.

-> The steps assume you want to install and run the MongoDB software locally on your workstation for testing and
development. If you are deploying for a production application, you will install MongoDB on your application
server or on a server connected to it.

#### Step 1: [Download and install MongoDB 3.6 or higher](https://docs.mongodb.com/manual/administration/install-community/) on your workstation.

You can also install MongoDB using your favorite package manager; for example, Homebrew is recommended for macOS.
If you are testing on a local workstation, you can use a `docker` image instead of installing locally.

#### Step 2: Start the MongoDB service and verify it is running.

#### Step 3: On your MongoDB instance, create a database for your application data.

You can use the [Mongo shell](https://docs.mongodb.com/manual/mongo/) to do this, or you can [install the MongoDB Compass software](https://www.mongodb.com/download-center/compass) to explore and work with MongoDB data.

#### Step 4: Create a username/password combination with `root` privileges on your new database.

### Install and start the Radiks server

The easiest way to run `radiks-server` is to use the pre-packaged `node.js` server.

#### Step 1: Install the `radiks-server` on a workstation or server.

```bash
npm install -g radiks-server
```

Or, if you prefer `yarn`:

```bash
yarn global add radiks-server
```

The default port for Mongodb is `27017`; your instance may be configured differently. By default,
Radiks-server will use `'mongodb://localhost:27017/radiks-server'` as the `MongoDB_URI` value.
This is suitable for local testing, but in production, you'll want to change the hostname and possibly
the database name.

#### Step 2: Start the `radiks-server` in the command line to confirm your installation.

```bash
radiks-server
```

```bash
(node:37750) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option `useUnifiedTopology: true` to the MongoClient constructor.
radiks-server is ready on http://localhost:1260
```

The `radiks-server` defaults to running on port `1260`. To change the default port, specify the `PORT` environment variable in your environment.

-> By default, the server is running at `http://localhost:1260`

#### Step 3: Stop the `radiks` server

Once you confirm it runs and your installation was a success, exit the `radiks-server` process.

## Task 2: Set up your application

You must set up your application to use Radiks. This requires installing the `radiks` client package and then configuring your application to connect to your Radiks server.

### Install the radiks client software

If you are using `blockstack.js` version 18 or earlier, you must use the Radiks version 0.1.\*, otherwise if you're using `blockstack.js` version 19 or higher, use Radiks 0.2.\* .

1. Change directory to the root of you application code.
2. Install the `radiks` client package.

```bash
npm install radiks
```

Or, if you prefer `yarn`:

```bash
yarn add radiks
```

### Configure the MongoDB for your application

#### Step 1: Start the mongo shell application.

```bash
mongo
```

```bash
MongoDB shell version v4.2.0
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session `{ "id" : UUID("8d43cf80-490d-4cac-8bd6-40eec5c128de") }`
MongoDB server version: 4.2.0
....

To enable free monitoring, run the following command: db.enableFreeMonitoring()
To permanently disable this reminder, run the following command: db.disableFreeMonitoring()
>
```

#### Step 2: Create a new database for your application.

```bash
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
> use test1
switched to db test1
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
> db.createUser({user: "admin", pwd:"foobar1",roles: ["readWrite","dbAdmin"]});
Successfully added user: `{ "user" : "admin", "roles" : [ "readWrite", "dbAdmin" ] }`
```

#### Step 3: Add a user with administrative rights to the database.

```bash
> db.createUser({user: "admin", pwd:"foobar1",roles: ["readWrite","dbAdmin"]});
Successfully added user: `{ "user" : "admin", "roles" : [ "readWrite", "dbAdmin" ] }`
```

#### Step 4: Create an `MONGODB_URI` environment variable on the same machine where you are running the `radiks-server`.

Use the `mongodb://username:password@host:port/db_name` format for your variable. For example, to set this variable in a `bash` shell:

```bash
export MONGODB_URI="mongodb://admin:foobar1@localhost:27017/test1"
```

## Task 3: Add startup code and build your application

To set up `radiks`, you only need to configure the URL that your Radiks-server instance is running on. If you're using the pre-built Radiks server, this will be `http://localhost:1260`. If you're in production or are using a custom Radiks server, you'll need to specify the exact URL where it's available.

Radiks also is compatible with version 19 of blockstack.js, which requires you to configure a `UserSession` object to handle all user-data-related methods. You'll need to define this and pass it to your Radiks configuration so that Radiks can know how to fetch information about the current logged in user.

### Configure your application to use your `radiks-server`.

To configure your application as a `radiks` client, do the following:

#### Step 1: Start your application so that a `UserSession` allows the app to both write and publish data:

```jsx
import { UserSession, AppConfig } from 'blockstack';
import { configure } from 'radiks';

const userSession = new UserSession({
  appConfig: new AppConfig(['store_write', 'publish_data']),
});

configure({
  apiServer: 'http://localhost:1260',
  userSession,
});
```

#### Step 2: Add authentication to your application

After your user logs in with Stacks Auth, you'll have some code to save the user's data in your applications `localStorage`. You'll want to use the same `UserSession` you configured with Radiks, which can be fetched from the `getConfig` method.

```jsx
import { User, getConfig } from 'radiks';

const handleSignIn = () => {
  const { userSession } = getConfig();
  if (userSession.isSignInPending()) {
    await userSession.handlePendingSignIn();
    await User.createWithCurrentUser();
  }
}
```

Calling `User.createWithCurrentUser` does the following:

- Fetch user data that Blockstack.js stores in `localStorage`
- Save the user's public data (including their public key) in Radiks-server
- Find or create a signing key that is used to authorize writes on behalf of this user
- Cache the user's signing key (and any group-related signing keys) to make signatures and decryption happen quickly later on

### Build and run your application

After you have added Radiks to your application, build and run the application. Test the application by logging in with your Stacks ID. Create some data using the application. If you inspect the MongoDB database, you should see the encrypted data stored in the database.

You can specify the `mongoDBUrl` or the `maxLimit` option when initiating the Radiks server in your application.

```jsx
const { setup } = require('radiks-server');

setup({
  ...myOptions,
});
```

The `mongoDBUrl` option is the MongoDB URL for the Radiks server
The `maxLimit` option is the maximum `limit` field used inside the mongo queries. The default is 1000.

## Where to go next

Creating models for your application's data is where radiks truly becomes helpful. To learn how to use models, see the [Create and use models](/build-apps/indexing/models) section.
