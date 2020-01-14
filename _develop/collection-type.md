---
layout: learn
permalink: /:collection/:path.html
---
# How to create a Collection type
{:.no_toc}

Collections support data portability between applications. Blockstack supplies a `Contact` collection for use by Blockstack applications. Developers can create additional collection types, use them in their own applications, and publish them so other developers can make use of them too. 

In this section, you learn the coding guidelines for creating and publishing a new `Collection` type. The following topics are included:

* TOC
{:toc}

## Before you begin

New collections rely on the `blockstack-collections` package. Before you code, make sure you have installed this package and it is available to your project. 

```bash
npm install -g blockstack-collections
```

You should also familiarize yourself with the <a href="https://github.com/blockstack/blockstack-collections/blob/master/src/types/collection.ts" target="_blank">Collection</a> class and review <a href="https://github.com/blockstack/blockstack-collections/tree/master/src/types" type="_blank">the existing Collection types</a>. Keep in mind, someone else may have already added a custom type similar to what you want to add.

Collection types must be written in a `.ts` (Typescript) file. Typescript is a typed superset of Javascript, you can <a href="https://www.typescriptlang.org/" target="_blank">read the language documentation</a> to learn more.

{% include question.html content="My assumption is they have to use typescript .ts files but can the file itself simply contain Javascipt?"%}

## Essential steps for creating a Collection type 

Follow these steps to create a new collection type:

1. Create a new `.ts` file and open it for editing.
2. Import the `Collection` class.

    ```js
    import { Collection, Attrs, Serializable } from 'blockstack-collections'
    ```

3. Extend the abstract `Collection` class from the `blockstack-collections` package.

    ```js
    export class Contact extends Collection implements Serializable {
      ...
    }
    ```

4. Give your `Collection` a unique identifier. 
   
   The Blockstack Collection frameworks uses this identifier to place Collection data into a corresponding Gaia storage bucket. 

   ```js
    static get collectionName(): string {
      return 'contact'
    }
    ```

    {% include warning.html content="While you must specify a unique identifier, the Blockstack platform does not currently enforce uniqueness. If your <code>Collection</code> type shares the same identifier as another type, it will lead to data corruption for the user. In the future, the Blockstack platform will enforce unique collection names. " %}

5. Define a static `schema` constant.
  
   This is your type's schema.

    ```js
    static schema = {
      identifier: String,
      firstName: String,
      lastName: String,
      blockstackID: String,
      email: String,
      website: String,
      address: String,
      telephone: String,
      organization: String
    }
    ```

6. Determine if you need to set the `singleFile` storage flag. 

    By default, the `singleFile` flag is false. This setting causes every record in a collection to store in Gaia as a separate file. The default works well for larger types that describe data such as documents or photos. If your `Collection` type only has a few fields and is not expected to have a large number of records, set the `singleFile` data format flag to `true`.

    ```js
    static singleFile = true
    ```    

7. Define the `fromObject` and `fromData` serializaiton methods.

   These methods serialize and deserialize your `Collection` type. You can use any serialization method you want.  Data encryption is handled automatically by the parent `Collection` class, so you *should not* perform any additional encryption. 
   
   In the following example code, data is converted to JSON string for storage.

    ```js
    static fromObject(object: object) {
      // Create from plain Javascript object
      return new Contact(object)
    }
    static fromData(data: string) {
      // Deserialize JSON data
      return new Contact(JSON.parse(data))
    }
    
    serialize() {
      // Serialize to JSON string
      return JSON.stringify(this.attrs)
    }
    ```

8. Test and iterate development of your type in your application.
9. Publish your type for others to use.

## Add a listener (optional)

If you need to listen for changes to any of the object’s attributes, you can implement the `onValueChange` method. For example, in the `Contacts` Collection type, when the contact is renamed, the unique identifier for the object needs to be updated.

```js
    onValueChange(key: string, value: any) {
      if (key === 'firstName') {
        this.previousIdentifier = this.attrs.identifier
        this.attrs.identifier = this.constructIdentifier()
        this.identifierChanged = true
      }
      else if (key === 'lastName') {
        this.previousIdentifier = this.attrs.identifier
        this.attrs.identifier = this.constructIdentifier()
        this.identifierChanged = true
      }
    }
```

## Override processing methods (optional)

To perform additional processing of a collection, you can override the `get`, `save`, `list` and `delete` methods. For example, in the `Contact` type, the `save` method is overridden to also perform a `delete` if a contact is renamed. Deletion is necessary because identifiers for a `Contact` are generated from the contact name. And data stored under the previous identifier must be deleted after writing to a new identifier. 

```js
    async save(userSession?: UserSession) {
      // Delete old file on save if object identifier changes
      return super.save(userSession)
        .then((result) => {
          if (this.identifierChanged) {
            return Contact.delete(this.previousIdentifier, userSession)
              .then(() => {
                this.identifierChanged = false
                return result
              })
          } else {
            return result
          }
        })
    }
```

## Publish your new type for others to use

While you *can* use your collection exclusively in your application, the Collections feature is intended to enable data portability between DApps. So, you should publish your new type so other developers can make use of it.

To publish your Collection type, do the following:

1. Clone or fork the <a href="https://github.com/blockstack/blockstack-collections" target="_blank">blockstack-collections</a> repo.
2. Add your new type file to the `src/types` subdirectory.
3. Create a pull request back to the repository. 


{% include question.html content="Are we testing submission code in any way?"%}
