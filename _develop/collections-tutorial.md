# Collections Quickstart (Preview)
In this quick start guide, you will learn to use the collections data storage feature in Blockstack. In this guide we will be using the contacts collection.

Collections is a way to store common user data in a known location with a known structure. This allows different apps on Blockstack to access and write to the same collection of data. This allows users to use the same data in different apps. For example. a user can create a single store of contacts or photos that could be read and shared in many different apps with permission. For details on collections see the proposal: https://forum.blockstack.org/t/feedback-wanted-collections-design/7752

## The guide will cover the following:


1. Setting up your app to use collections
2. Requesting the collection scope when authenticating users 
3. The collection object storage operations. (Write, Read, List, Delete)
4. Using and modifying collection objects
# Getting started

**Prerequisites:**

- Your app uses Blockstack auth (blockstack.js)
- Your app uses Gaia to store it’s data
- You have the pre-release version of the Blockstack browser with collections support installed [Download Blockstack Browser Collections Alpha](https://github.com/blockstack/blockstack-browser/releases/download/collections-alpha.1/Blockstack-for-macOS-collections-alpha.dmg)

To start using collections in your Blockstack app, you will need to first import the preview branch of blockstack.js.


    npm install blockstack@20.0.0-alpha.3

 Add the `blockstack-collection-schemas` package to your app.


    npm install blockstack-collections@0.1.7

Import the `Contact` collection type


    import { Contact } from 'blockstack-collections'
# Requesting Collection Scope

Customize your sign in request to include the contacts collection scope `Contact.scope`. This will grant your app permission to read and write to the user’s contacts collection. 


    import { UserSession, AppConfig, makeAuthRequest } from 'blockstack'
    import { Contact } from 'blockstack-collection-schemas'
    
    const scopes = ['store_write', 'publish_data', Contact.scope]
    const appConfig = new AppConfig(scopes)
    const userSession = new UserSession({appConfig: appConfig})
    
    const authRequest = makeAuthRequest(undefined, undefined, undefined, scopes, undefined, undefined, {
      solicitGaiaHubUrl: true,
      recommendedGaiaHubUrl: 'https://develop-hub.blockstack.org'
    })
    
    userSession.redirectToSignInWithAuthRequest(authRequest)

*Note: This example enables the custom Gaia hub selection prompt to point at the pre-release hub that has collections features enabled.*

# Collection storage operations

Collection storage has been designed around an ORM-like interface. What this means is that you’ll be working with typed objects instead of the `getFile`, `putFile` functions provided by blockstack.js.

## Creating and saving a collection object
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


## Reading a collection object
    let contactID = 'Blocky Stackerson'
    Contact.get(contactID).then((contact) => {
      // Do something with the contact object
      console.log(`Hello ${contact.firstName}`)
    })


## Listing collection objects
    let contacts = []
    Contact.list((contactID) => {
      // This callback is invoked for each contact identifier
      // To get the actual object you'll need to use Contact.get
      // Or you can add the IDs to an array for display
      contacts.push(contactID)
      // Return true to continue iterating, return false to stop
      return true
    })


## Deleting collection objects
    var contact = new Contact(newContact)
    contact.delete().then(() => {
      // contact deleted successfully   
    })


# Demo app

A working demo app for the contacts collection is available here: https://github.com/yknl/blockstack-contacts

Blockstack contacts is a simple contacts manager that allows users to add and manage their contacts. The data stored by this app can be used in another app that receives the contacts collection permissions.

