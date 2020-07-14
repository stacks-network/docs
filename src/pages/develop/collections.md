---


---
# Work with Collections (Preview)
Collections is the feature designed to make data portable among Blockstack applications. Sharing is accomplished by storing a user's data in a standardized format at a known, Gaia storage location. Collections associate user data with a user's decentralized ID. When users move among apps, the same data is available to each application the user authorizes.

On this page, you learn what collections are and how to use them. You'll learn about the `Contact` collection in particular. The following topics are covered:

{% include note.html content="This is a preview release of the <code>Contact</code> collections. This release allows developers to try out the new collections functionality and we are interested in collecting feedback. Please feel free to report issues or request enhancements with collections or <code>Contacts</code> themselves on the <a href='https://github.com/blockstack/blockstack-collections/issues/new' target='_blank'>blockstack/blockstack-collections</a> repository.  If you encounter problems with <code>blockstack.js</code> you can <a href='https://github.com/blockstack/blockstack.js/issues/new' target='_blank'>file issues or request enhancements on its repo</a>." %}

## Understand how collections work

One of Blockstack's goals is to give users true data ownership by enabling *data portability*.  Data portability allows users to login with their digital ID on any app and have access to the same data. For example, if a user adds a photo of a Hawaiian vacation in one app, that photo enters the user's data pool. Then, when the user opens a second app, that same photo is available to the second app because the user data, including the photo, is shared via the user's decentralized ID.

How do collections work? Blockstack builds a library containing commonly used data schemes. Developers use these classes and objects instead of creating their own, unique data schemes. Using a class from the collections library guarantees class data is stored in Gaia in that format; And, when retrieved, guarantees the same format is returned. This pre-release provides the `Contact` collection. A contact schema produces this structure:

```
{
   "lastName": "jeffries",
   "firstName": "sally",
   "blockstackID": "",
   "email": "",
   "website": "",
   "telephone": "",
   "identifier": "sally jeffries"
}
```

A collection schema is neither validated or enforced. The goal is to incentivize collection use rather that enforce use.

Because malicious apps or apps with poor security controls may damage user data, Blockstack believes collections should include the ability for users to roll-back changes. For this reason, Blockstack supports an event log and rollback mechanisms in collections. To support this rollback in the pre-release, collections data store is conceptually an event log. Every data write an app makes is stored as a separate file. By placing data in files it ensures that data is never lost and files can be returned back to any previous state.

<div class="uk-card uk-card-default uk-card-body">
<h5 class="uk-card-title">The Future of Collections Envisioned</h5>
<p>Blockstack believes that collections should enable true data portability across applications for each decentralized ID. The goal is to develop simple user interfaces to allow users to manage of application access and permissions to collection data. For example, in the future, users can rollback data to previous versions using management interfaces.</p>
<p>For developers, collections can incentivize user adoption by reducing user friction.  Users can easily try new apps and move to them without the overhead or barrier of re-entering data. You are <a href="https://forum.blockstack.org/t/feedback-wanted-collections-design/7752" target="_blank">welcome to review and comment</a> on the current design document.</p>
</div>

## Build a Contact Manager demo app

Before adding collections to your DApp, you can try it for yourself using the Contact Manager demo application. Blockstack Contacts is a simple contacts manager that allows users to add and manage their contacts. The data stored by this app can be used in another app that receives the contacts collection permissions.

The tutorial relies on the `npm` dependency manager. Before you begin, verify
you have installed `npm` using the `which` command to verify.

```bash
$ which npm
/usr/local/bin/npm
```

If you have `npm` installed, do the following to run the Contact Manager demo app:

1. If you have a local Blockstack installed, [uninstall it](/browser/local_browser).

2. Download and install the [Collections Alpha Build](https://github.com/blockstack/blockstack-browser/releases/tag/collections-alpha.1) of the Blockstack Browser client for your OS.

3. Launch the alpha build of the local Blockstack Browser client.

4. In your Internet browser, visit the [https://github.com/yknl/blockstack-contacts](https://github.com/yknl/blockstack-contacts) repository.

5. Download or clone the repository code to you local workstation.

6. In your workstation terminal, change directory where you downloaded the demo code.

7. Install the dependencies using `npm`.

    ```bash
    npm install
    ```

8. Start the application running.

    ```bash
    npm run start
    ```

    The system starts the application and launches it in your browser at  127.0.0.1:3000

9. Choose **Sign In with Blockstack**.

    The internet browser will display this pop-up

    ![](images/contacts-manager.png)

10. Use the local browser by choosing  **Open Blockstack.app**.

11. If you are not signed into an ID in the Blockstack Browser, choose **Create new ID** from the pop up.
   If you are already signed in, choose an ID to sign in to the Contacts Manager app with.

    The system should return you to the Contact Manager demo application.

### Test Contact data portability

1. Add a contact using your new Contact Manager application, the contact added here is `Josephine Baker`.

   When you have successfully created a contact, the Contact Manager displays that contact on the list. Here you can see that Josephine Baker was entered as a contact.

   ![](images/added-contact.png)

2. Open the [collections page test](https://blockstack.github.io/blockstack-collections/page_test/) in your browser.

   The page test is an entirely different application that also makes use of the Contacts collection.

3. Sign in using the same Blockstack ID you used to sign into the Contacts Manager.

4. Choose **List contacts**.

   ![](images/test-contact.png)


## How to add the Contact collections to your DApp

In this section, you learn how to add `Contact` collection functionality to an existing application. Before beginning, make sure your application is using Blockstack auth and is storing data with Gaia. To start using the `Contact` collection in your Blockstack app, do the following:

1. Change to the root directory of your app project.
2. Install the preview branch of the `blockstack.js`.

    ```
    npm install blockstack@20.0.0-alpha.5
    ```

3. Add the ``blockstack-collections` package to your app.

    ```
    npm install blockstack-collections@0.1.8
    ```

4. Edit your code to import the `Contact` collection type.

    ```
    import { Contact } from `blockstack-collections`
    ```

5. Customize your sign in request to include the contacts collection scope `Contact.scope`.

    This scope grants your app permission to read and write to the user’s `Contact` collection.

    ```javascript
    import { UserSession, AppConfig, makeAuthRequest } from 'blockstack'
    import { Contact } from '`blockstack-collections'

    const scopes = ['store_write', 'publish_data', Contact.scope]
    const appConfig = new AppConfig(scopes)
    const userSession = new UserSession({appConfig: appConfig})
    userSession.redirectToSignIn()
    ```

## Collection storage operations

Collection storage was designed around an ORM-like interface. This approach ensures that you’ll be working with typed objects instead of the `getFile`, `putFile` functions provided by blockstack.js.

### Example: Create and save a Contact object

```javascript
    const newContact = {
      lastName: 'Stackerson',
      firstName: 'Blocky',
      blockstackID: 'Blockstacker.id',
      email: 'blockstacker@blockstack.org',
      website: 'blockstack.org',
      telephone: '123123123'
    }

    var contact = new Contact(newContact)
    contact.save().then((contactID) => {
      // contact saved successfully
    })
```


### Example: Read a Contact object

```javascript
    let contactID = 'Blocky Stackerson'
    Contact.get(contactID).then((contact) => {
      // Do something with the contact object
      console.log('Hello ${contact.firstName}')
    })
```


### Example: List Contact objects

```javascript
    let contacts = []
    Contact.list((contactID) => {
      // This callback is invoked for each contact identifier
      // To get the actual object you'll need to use Contact.get
      // Or you can add the IDs to an array for display
      contacts.push(contactID)
      // Return true to continue iterating, return false to stop
      return true
    })
```


### Example: Delete a Contact

```javascript
    var contact = new Contact(newContact)
    contact.delete().then(() => {
      // contact deleted successfully
    })
```
