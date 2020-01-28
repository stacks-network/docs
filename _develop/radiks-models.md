---
layout: learn
permalink: /:collection/:path.html
---
# Create and use models
{:.no_toc}

* TOC
{:toc}


### The Model class


To create a model class, first import the `Model` class from radiks. Then, create a class that extends this model, and provide a schema.

**Important**: Make sure you add a static `className` property to your class. This is used when storing and querying information. If you don't add this, radiks will default to the actual model's class name. However, in production, your code will likely be minified, and the actual class name will be different. For this reason, it's highly recommended that you define the `className` manually.


We provide a `Model` class that you can extend to easily create, save, and fetch models.



```javascript
import { Model, User } from 'radiks';

class Todo extends Model {
  static className = 'Todo';
  static schema = { // all fields are encrypted by default
    title: String,
    completed: Boolean,
  }
};

// after authentication:
const todo = new Todo({ title: 'Use Radiks in an app' });
await todo.save();
todo.update({
  completed: true,
});
await todo.save();

const incompleteTodos = await Todo.fetchOwnList({ // fetch todos that this user created
  completed: false
});
console.log(incompleteTodos.length); // 0
```

#### Schema

The first static property you'll need to define is a schema. Create a static `schema` property on your class to define it. Each `key` in this object is the name of the field. The value is whatever type you want the field to be, or you can pass some options.

If you don't want to include any options, just pass the class for that field, like `String`, `Boolean`, or `Number`.

To include options, pass an object, with a mandatory `type` field. The only supported option right now is `decrypted`. This defaults to `false`, but if you provide `true`, then this field will not be encrypted before storing data publicly. This is useful if you want to be able to query this field when fetching data.

**Important**: do not add the `decrypted` option to fields that contain sensitive user data. Remember, because this is decentralized storage, anyone can read the user's data. That's why encrypting it is so important. If you want to be able to filter sensitive data, then you should do it on the client-side, after decrypting it. A good use-case for storing decrypted fields is to store a `foreignId` that references a different model, for a "belongs-to" type of relation.

#### Defaults

Include an optional `defaults` static property to define default values for a field.

#### Example

~~~javascript
import { Model } from 'radiks';

class Person extends Model {
  static className = 'Person';

  static schema = {
    name: String,
    age: Number,
    isHuman: Boolean,
    likesDogs: {
      type: Boolean,
      decrypted: true // all users will know if this record likes dogs!
    }
  }

  static defaults = {
    likesDogs: true
  }
}
~~~

### Using models

All model instances have an `_id` attribute. If you don't pass an `_id` to the model (when constructing it), then an `_id` will be created automatically using [`uuid/v4`](https://github.com/kelektiv/node-uuid). This `_id` is used as a primary key when storing data, and would be used for fetching this model in the future.

In addition to automatically creating an `_id` attribute, radiks also creates a `createdAt` and `updatedAt` property when creating and saving models.

#### Constructing a model

To create an instance of a model, pass some attributes to the constructor of that class:

~~~javascript
const person = new Person({
  name: 'Hank',
  isHuman: false,
  likesDogs: false // just an example, I love dogs!
})
~~~

#### Fetching a model

To fetch an existing model, first construct it with a required `id` property. Then, call the `fetch()` function, which returns a promise.

~~~javascript
const person = await Person.findById('404eab3a-6ddc-4ba6-afe8-1c3fff464d44');
~~~

After calling `fetch`, radiks will automatically decrypt all encrypted fields.

#### Accessing model attributes

All attributes (other than `id`) are stored in an `attrs` property on the model.

~~~javascript
const { name, likesDogs } = person.attrs;
console.log(`Does ${name} like dogs?`, likesDogs);
~~~

#### Updating a model

To quickly update multiple attributes of a model, pass those attributes to the `update` function.

~~~javascript
const newAttributes = {
  likesDogs: false,
  age: 30
}
person.update(newAttributes)
~~~

Note that calling `update` does **not** save the model.

#### Saving a model

To save a model to Gaia and MongoDB, call the `save` function. First, it encrypts all attributes that do not have the `decrypted` option in their schema. Then, it saves a JSON representation of the model in Gaia, as well as in MongoDB. `save` returns a promise.

~~~javascript
await person.save();
~~~

#### Deleting a model

To delete a model, just call the `destroy` method on it.

~~~javascript
await person.destroy();
~~~

### Querying models

To fetch multiple records that match a certain query, use the class's `fetchList` function. This method creates an HTTP query to Radiks-server, which then queries the underlying database. Radiks-server uses the [`query-to-mongo`](https://github.com/pbatey/query-to-mongo) package to turn an HTTP query into a MongoDB query. Read the documentation for that package to learn how to do complex querying, sorting, limiting, etc.

Here are some examples:

~~~javascript
const dogHaters = await Person.fetchList({ likesDogs: false });
~~~

Or, imagine a `Task` model with a `name`, a boolean for `completed`, and an `order` attribute.

~~~javascript
class Task extends Model {
  static className = 'Task';

  static schema = {
    name: String,
    completed: {
      type: Boolean,
      decrypted: true,
    },
    order: {
      type: Number,
      decrypted: true,
    }
  }
}

const tasks = await Task.fetchList({
  completed: false,
  sort: '-order'
})
~~~

### Counting models

You can also get the count record directly.
~~~javascript
const dogHaters = await Person.count({ likesDogs: false });
// dogHaters is the count number
~~~

### Fetching models created by the current user

Use the `fetchOwnList` method to find models that were created by the current user. By using this method, you can preserve privacy, because Radiks uses a `signingKey` that only the current user knows.

```javascript
const tasks = await Task.fetchOwnList({
  completed: false
});
```

### Managing relational data

It is common for applications to have multiple different models, where some reference another. For example, imagine a task-tracking application where a user has multiple projects, and each project has multiple tasks. Here's what those models might look like:

~~~javascript
class Project extends Model {
  static className = 'Project';
  static schema = { name: String }
}

class Task extends Model {
  static className = 'Task';
  static schema = {
    name: String,
    projectId: {
      type: String,
      decrypted: true,
    }
    completed: Boolean
  }
}
~~~

Whenever you save a task, you'll want to save a reference to the project it's in:

~~~javascript
const task = new Task({
  name: 'Improve radiks documentation',
  projectId: project._id
})
await task.save();
~~~

Then, later you'll want to fetch all tasks for a certain project:

~~~javascript
const tasks = await Task.fetchList({
  projectId: project._id,
})
~~~

Radiks lets you define an `afterFetch` method, which you can use to automatically fetch child records when you fetch the parent instance.

~~~javascript
class Project extends Model {
  static className = 'Project';
  static schema = { name: String }

  async afterFetch() {
    this.tasks = await Task.fetchList({
      projectId: this.id,
    })
  }
}

const project = await Project.findById('some-id-here');
console.log(project.tasks); // will already have fetched and decrypted all related tasks
~~~

### Extending the user model

You can extend the default user model to add your own fields.

~~~javascript
import { User } from 'radiks';

// For example I want to add a public name on my user model
class MyAppUserModel extends User {
  static schema = {
    ...User.schema,
    name: {
      type: String,
      decrypted: true,
    },
  };
}
~~~