---
layout: learn
permalink: /:collection/:path.html
---
# Collaborate with groups
{:.no_toc}

A key feature of Radiks is support for private collaboration between multiple users.  Supporting collaboration with client-side encryption and user-owned storage can be complicated but the patterns to implement it are generally the same among most applications. Radiks provides out-of-the box for collaboration, making it easy to build private, collaborative apps.

You use the <a href="https://github.com/blockstack/radiks/blob/master/src/models/user-group.ts" target="_blank"><code>UserGroup</code></a> class to build a collaborative group with Radiks. In this section, you learn about this class.

* TOC
{:toc}

## Understand the UserGroup workflow

The key model behind a collaborative group is `UserGroup`. By default, it only has one attribute, `name`, which is encrypted. You can subclass  `UserGroup` with different attributes as needed.

The general workflow for creating a collaborative group that can share and edit encrypted models is as follows:

1. The admin of the group creates a new `UserGroup`.
   This group acts as the 'hub' and controls the logic around inviting and removing users.
2. The admin invites one or more other users to a group:
    * The admin specifies the username of the user they want to invite
    * Radiks looks up the user's public key
    * Radiks creates an 'invitation' that is encrypted with the user's public key, and contains information about the `UserGroup`
3. When the invited user 'activates' an invitation, they create a `GroupMembership`. 
   They use this membership instance to reference information (such as private keys and signing keys) related to the group.

As they participate in a group, the group's members can create and update models that are related to the group. These models **must** contain a `userGroupId` attribute used to reference the group. This allows Radiks to know which keys to use for encryption and signing.

When needed, the group admin can remove a user from a group. To remove a user from the group, the admin creates a new private key for signing and encryption. Then, the admin updates the `GroupMembership` of all users _except_ the user they just removed. This is also known as rotating the key.

After a key is rotated, all new and updated models must use the new key for signing. Radiks-server validates all group-related models to ensure that they're signed with the most up-to-date key.

## Work with a UserGroup

This section details the methods on the <a href="https://github.com/blockstack/radiks/blob/master/src/models/user-group.ts" target="_blank"><code>UserGroup</code> class you can use to create, add members to, and query a group.

### Create a UserGroup

To create a `UserGroup`, your application must import the class from `radiks`:

```javascript
import { UserGroup } from 'radiks';

// ...
```

Calling `create` on a new `UserGroup` will create the group and activate an invitation for the group's creator.
 

```javascript
const group = new UserGroup({ name: 'My Group Name' });
await group.create();
```

A group's creator is also the group's admin.


### Invite users to become members

Use the `makeGroupMembership` method on a `UserGroup` instance to invite a user. The only argument passed to this method is the user's `username`.

```javascript
import { UserGroup } from 'radiks';

const group = await UserGroup.findById(myGroupId);
const usernameToInvite = 'hankstoever.id';
const invitation = await group.makeGroupMembership(usernameToInvite);
console.log(invitation._id); // the ID used to later activate an invitation
```

### Accept an invitation

Use the `activate` method on a `GroupInvitation` instance to activate an invitation on behalf of a user:

```javascript
import { GroupInvitation } from 'radiks';

const invitation = await GroupInvitation.findById(myInvitationID);
await invitation.activate();
```

## View all activated UserGroups for the current user

Call `UserGroup.myGroups` to fetch all groups that the current user is a member of:

```javascript
import { UserGroup } from 'radiks';

const groups = await UserGroup.myGroups();
```

## Find a UserGroup

Use the method `UserGroup.find(id)` when fetching a specific UserGroup. This method has extra boilerplate to handle decrypting the model, because the private keys may need to be fetched from different models.

```javascript
const group = await UserGroup.find('my-id-here');
```