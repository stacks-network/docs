---
title: Server
description: Tips and tricks for working with Radiks server
---

## Access the MongoDB collection

Radiks-server keeps all models inside of a collection. You can use the `getDB` function to access this collection from inside your application.

```jsx
const { getDB } = require('radiks-server');

const mongo = await getDB(MONGODB_URL);
```

[See the MongoDB Collection reference](https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html) for documentation about how you can interact with this collection.

## Run a custom Radiks-server

If you're using an [express.js](https://expressjs.com/) server to run your application, it's probably easiest to use the Radiks-server middleware. This way, you won't have to run a separate application server and Radiks server.

Radiks-server includes an easy-to-use middleware that you can include in your application:

```jsx
const express = require('express');

const { setup } = require('radiks-server');

const app = express();

setup().then(RadiksController => {
  app.use('/radiks', RadiksController);
});
```

The `setup` method returns a promise, and that promise resolves to the actual middleware that your server can use. This is because it first connects to MongoDB, and then sets up the middleware with that database connection.

The `setup` function accepts an `options` object as the first argument. If you aren't using environment variables, you can explicitly pass in a MongoDB URL here:

```jsx
setup({
  mongoDBUrl: 'mongodb://localhost:27017/my-custom-database',
}).then(RadiksController => {
  app.use('/radiks', RadiksController);
});
```

Currently, only the `mongoDBUrl` option is supported.

## Migrate from Firebase (or anywhere else)

Migrating data from Firebase to Radiks-server is simple and painless. You can create a script file to fetch all the Firebase data using their API. Then, you can use your `MONGOD_URI` config to use the `mongodb` npm package.

```js
// Script for transfering users from Firebase to Radiks-server

const { getDB } = require('radiks-server');
const { mongoURI } = require('......'); // How you import/require your mongoURI is up to you

const migrate = async () => {
  // `mongo` is a reference to the MongoDB collection that radiks-server uses.
  // You can add or edit or update data as necessary.
  const mongo = await getDB(mongoURI);

  /**
   * Call code to get your users from firebase
   * const users = await getUsersFromFirebase();
   * OR grab the Firebase JSON file and set users to that value
   * How you saved your user data will probably be different than the example below
   */

  const users = {
    '-LV1HAQToANRvhysSClr': {
      blockstackId: '1N1DzKgizU4rCEaxAU21EgMaHGB5hprcBM',
      username: 'kkomaz.id',
    },
  };

  const usersToInsert = Object.values(users).map(user => {
    const { username } = user;
    const doc = {
      username,
      _id: username,
      radiksType: 'BlockstackUser',
    };
    const op = {
      updateOne: {
        filter: {
          _id: username,
        },
        update: {
          $setOnInsert: doc,
        },
        upsert: true,
      },
    };
    return op;
  });

  await mongo.bulkWrite(usersToInsert);
};

migrate()
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch(error => {
    console.error(error);
    process.exit();
  });
```

## Streaming real-time changes

`Radiks-server` provides a websocket endpoint that will stream all new inserts and updates that it sees on the server. `Radiks` provides a helpful interface to poll for these changes on a model-by-model basis. For example, if you had a `Task` model, you could get real-time updates on all your tasks. This is especially useful in collaborative environments. As soon as a collaborator updates a model, you can get the change in real-time, and update your views accordingly.

Before you can implement the websocket function, you must configure your `Radiks-Server` with [express-ws](https://github.com/HenningM/express-ws)

```jsx
const app = express();
expressWS(app);
```

Here's an example for how to use the API:

```jsx
import Task from './models/task';

const streamCallback = task => {
  // this callback will be called whenever a task is created or updated.
  // `task` is an instance of `Task`, and all methods are defined on it.
  // If the user has the necessary keys to decrypt encrypted fields on the model,
  // the model will be decrypted before the callback is invoked.

  if (task.projectId === myAppsCurrentProjectPageId) {
    // update your view here with this task
  }
};

Task.addStreamListener(streamCallback);

// later on, you might want to remove the stream listener (if the
// user changes pages, for example). When calling `removeStreamListener`,
// you MUST provide the exact same callback that you used with `addStreamListener`.

Task.removeStreamListener(streamCallback);
```

## Saving centralized user-related data

Sometimes, you need to save some data on behalf of the user that only the server is able to see. A common use case for this is when you want to notify a user, and you need to store, for example, their email. This should be updatable only by the user, and only the server (or that user) should be able to see it. Radiks provides the `Central` API to handle this:

```jsx
import { Central } from 'radiks';

const key = 'UserSettings';
const value = { email: 'myemail@example.com' };
await Central.save(key, value);

const result = await Central.get(key);
console.log(result); // { email: 'myemail@example.com' }
```
