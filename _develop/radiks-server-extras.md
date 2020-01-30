---
layout: learn
permalink: /:collection/:path.html
---
# Radiks server Tips and tricks

In this section, you'll find some tips and tricks you can use to work with a Radiks server.


## Access the MongoDB collection

Radiks-server keeps all models inside of a collection. You can use the `getDB` function to access this collection from inside your application.

```js
const { getDB } = require('radiks-server');

const mongo = await getDB(MONGODB_URL);
```

[See the MongoDB Collection reference](https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html) for documentation about how you can interact with this collection.


## Run a custom Radiks-server

If you're using an [express.js](https://expressjs.com/) server to run your application, it's probably easiest to use the Radiks-server middleware. This way, you won't have to run a separate application server and Radiks server.

Radiks-server includes an easy-to-use middleware that you can include in your application:

```javascript
const express = require('express');

const { setup } = require('radiks-server');

const app = express();

setup().then(RadiksController => {
  app.use('/radiks', RadiksController);
});
```

The `setup` method returns a promise, and that promise resolves to the actual middleware that your server can use. This is because it first connects to MongoDB, and then sets up the middleware with that database connection.

The `setup` function accepts an `options` object as the first argument. If you aren't using environment variables, you can explicitly pass in a MongoDB URL here:

```javascript
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
   * How you saved your user data will proably be different than the example below
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

