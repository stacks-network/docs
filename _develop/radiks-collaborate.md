---
layout: learn
permalink: /:collection/:path.html
---
# Collaboration

A key feature of Radiks is support for private collaboration between multiple users. Supporting collaboration with client-side encryption and user-owned storage can be complicated, but the patterns to implement it are generally the same for different apps. Radiks provides out-of-the box for collaboration, making it easy to build private, collaborative apps.

Radiks is built in a way that provides maximum privacy and security for collaborative groups. Radiks-server and external users have no knowledge about who is in a group.

### UserGroup Model

The key model behind a collaborative group is `UserGroup`. By default, it only has one attribute, `name`, which is encrypted. You can create multiple subclasses of `UserGroup` later on with different attributes, if you need to.

### General Workflow

The general workflow for creating a collaborative group that can share and edit encrypted models is as follows:

1. The admin of the group creates a new `UserGroup`, which acts as the 'hub' and controls the logic around inviting and removing users.
2. The admin invites one or more other users to a group:
    1. The admin specifies the username of the user they want to invite
    2. Radiks looks up the user's public key
    3. Radiks creates an 'invitation' that is encrypted with the user's public key, and contains information about the `UserGroup`
    4. When the invited user 'activates' an invitation, they create a `GroupMembership`, which they can later use to reference information (such as private keys and signing keys) related to the group.
3. Later on, members of the group can create and update models that are related to the group. These models **must** contain a reference to the group, using the attribute `userGroupId`. This allows Radiks to know which keys to use for encryption and signing.
4. The admin of the group can later remove a user from a group. They do this by creating a new private key for signing and encryption, and updating the `GroupMembership` of all users _except_ the user they just removed.
5. After a key is rotated, all new and updated models must use the new key for signing. Radiks-server validates all group-related models to ensure that they're signed with the most up-to-date key.

#### Creating a UserGroup

~~~javascript
import { UserGroup } from 'radiks';

// ...

const group = new UserGroup({ name: 'My Group Name' });
await group.create();
~~~

Calling `create` on a new `UserGroup` will create the group and activate an invitation for the creator of the group.

#### Inviting a User

Use the `makeGroupMembership` method on a `UserGroup` instance to invite a user. The only argument passed to this method is the username of the user you want to invite.

~~~javascript
import { UserGroup } from 'radiks';

const group = await UserGroup.findById(myGroupId);
const usernameToInvite = 'hankstoever.id';
const invitation = await group.makeGroupMembership(usernameToInvite);
console.log(invitation._id); // the ID used to later activate an invitation
~~~

#### Accepting an invitation

Use the `activate` method on a `GroupInvitation` instance to activate an invitation:

~~~javascript
import { GroupInvitation } from 'radiks';

const invitation = await GroupInvitation.findById(myInvitationID);
await invitation.activate();
~~~

#### Viewing all activated UserGroups for the current user

Call `UserGroup.myGroups` to fetch all groups that the current user is a member of:

~~~javascript
import { UserGroup } from 'radiks';

const groups = await UserGroup.myGroups();
~~~

#### Finding a UserGroup

Use the method `UserGroup.find(id)` when fetching a specific UserGroup. This method has extra boilerplate to handle decrypting the model, because the private keys may need to be fetched from different models.

~~~javascript
const group = await UserGroup.find('my-id-here');
~~~