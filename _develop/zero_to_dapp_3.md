---
layout: learn
permalink: /:collection/:path.html
---
# 3 - Build an Animal Kingdom DApp
{:.no_toc}

 **Zero to DAPP 3 of 4**

In this page, you follow a tutorial which builds, runs, modifies, and deploys a
DApp called Animal Kingdom. Through this exercise, you'll learn about the
components of a Blockstack Dapp.  You'll also learn about the technical
requirements for submitting a DApp for App.co. This page contains the following
topics

 * TOC
 {:toc}

 <div class="uk-card uk-card-default uk-card-body">
 <h5>Can you skip this page?</h5>
 <p>It isn't a good idea to skip this page, requirements for DApps that participate in App Mining are covered. So, everyone should at least skim through this page.
 </p>
 </div>


### Skills you need to build Animal Kingdom

This tutorial is designed for a wide audience. Anyone with access to a Windows,
Mac, or Linux computer and some familiarity with a command line can build the
Animal Kingdom DApp.

If you are good at following directions, chances are you can complete this
tutorial even if you have no programming experience. Knowledgeable developers
should easily be able to complete the tutorial within an hour by following
along.

If you are a developer superhero, you may want to skip ahead or move
quickly and that's fine too.

## Get prerequisites and set up your environment

To follow this tutorial, you need the following:

* A Blockstack ID (identity) to test your Animal Kingdom.
* Access to the Mac terminal window and some familiarity with the command line it provides.
* An installation of the XCode command-line tools to support Node Package Manager (`npm`)
* The Node Package Manager package manager.

Follow the procedures in this section to install these components.

### Confirm or get a Blockstack ID
{:.no_toc}

Confirm you have a Blockstack ID also known as an identity; `joe.id.blockstack`
is an example of an identity.

* If you have an existing ID, log into the <a href="https://browser.blockstack.org/" target="\_blank">Blockstack Browser</a> in your browser.

   The Blockstack Browser is itself a DApp. Logging in confirms you have a valid
   ID with the required _secret recovery key_ or _magic recovery code_. The
   secret recovery key is a 12 or 24 word phrase you recorded when you created
   the ID. The magic recovery code is a string of characters Blockstack emailed
   to you when you created your identity. You can confirm your identity with either.

* If you do not yet have a Blockstack ID, <a href="https://browser.blockstack.org/" target="\_blank">create one through the Blockstack Browser</a>.

    Instructions for creating an ID are <a href="{{ site.baseurl
    }}/browser/ids-introduction.html#create-an-initial-blockstack-id"
    target="\_blank">available in this documentation</a>.


###  Ensure command-line access
{:.no_toc}

If you are using a Mac, you can find the **terminal** in the **Application >
Launchpad > Other** folder.

<img src="images/terminal.png" alt="">

If you don't often use the command line, take a moment to test some common commands.

<table class="uk-table uk-table-small uk-table-divider">
  <tr>
    <th>Command</th>
    <th>What it does</th>
  </tr>
  <tr>
    <td><code>ls</code></td>
    <td>Lists the files and directories in the current directory.</td>
  </tr>
  <tr>
    <td><code>cd</code></td>
    <td>Change directory to navigate to locations in your file system.</td>
  </tr>
  <tr>
    <td><code>pwd</code></td>
    <td>Print the working directory, the location you are working in.</td>
  </tr>
</table>

### Install XCode Command Line tools
{:.no_toc}

The Command Line Tool package gives Mac terminal users many commonly used tools,
utilities, and compilers. Some of the contents installed by NPM require XCode.

1. Open a terminal window on your system.
2. Enter the `xcode-select` command string:

   ```bash
   $ xcode-select --install
   ```

   <img src="images/install-command-line-tools-os-x.jpg" alt="">

   A software update dialog displays:

   <img src="images/confirm-install-command-line-tools-mac-os-x.jpg" alt="">

3. Click **Install** to confirm.

   You are prompted to agree to the terms of service.

4. Agree to the terms of services.

   The tools are installed. This is fairly quick depending on your connection speed.


### Install Node Package Manager (NPM)
{:.no_toc}

Open source developers from every continent use NPM to share software components
called packages. The Animal Kingdom uses  React, Babel, and many other
components. You'll use the `npm` command to install these packaged components.

 1. Open a terminal window on your system.
 2. Verify you have installed `npm` using the `which` command.

     <img src="images/command-line.png" alt="">

     If `npm` is installed, `which` returns the command's location in your environment.

3. If the `npm` command is not in your system, <a href="https://www.npmjs.com/get-npm" target="\_blank">install it using the instructions for your operating system</a>.

   Installing the NPM tool can take several minutes depending on your connection speed.


## Overview of the Animal Kingdom DApp

You are going to build a DApp called AnimalKingdom. Animal Kingdom is a DApp for
the web. Users log into it and create an animal persona that rules over a
specific territory. The combination of persona and territory is a kingdom. Once
you create a kingdom, you can add subjects from other kingdoms.

The Animal Kingdom interacts with two Blockstack services, the Blockstack
Browser (https://browser.blockstack.org) and the Gaia data storage hub
(https://hub.blockstack.org/). The Blockstack Browser is itself
a DApp. The storage hub is purely a service without user-facing functionality.

The following table describes the key interactions and screens in the DApp.

<table class="uk-table uk-table-striped">
  <tr>
    <th>Click to enlarge</th>
    <th> Description</th>
  </tr>
  <tr>
    <td><div uk-lightbox="animation: slide">
         <a class="uk-inline" href="images/kingdom-enter.png" data-caption="Users must login with a Blockstack identity.">
             <img src="images/kingdom-enter.png" alt="">
         </a>
    </div>
    </td>
    <td><p>Users log in (authenticate) with a Blockstack identity. By authenticating, the user gives the application the ability to get and put data in the user's Gaia storage hub.</p></td>
  </tr>
  <tr>
    <td><div uk-lightbox="animation: slide">
          <a class="uk-inline" href="images/kingdom-signin.png" data-caption="Blockstack login dialogs.">
              <img src="images/kingdom-signin.png" alt="">
          </a>
     </div>
     </td>
    <td><p>The Blockstack login dialogs are part of the Blockstack Browser which is itself
    a DApp. Once a user authenticates, the DApp code automatically
    returns them to the Kingdom they were attempting to enter.</p></td>
  </tr>
  <tr>
  <td><div uk-lightbox="animation: slide">
    <a class="uk-inline" href="images/kingdom-new.png" data-caption="Choose a persona and territory.">
        <img src="images/kingdom-new.png" alt="">
    </a>
    </div></td>
  <td><p>First-time visitors to a kingdom are prompted to create an animal persona and
  a territory to rule. Once they make a selection, users click <strong>Done</strong> to create a
  kingdom to rule. Behind the scenes, the data about the user's selection is stored in the user's GAIA hub.
</p>
  </td>
</tr>
<tr>
  <td> <div uk-lightbox="animation: slide">
     <a class="uk-inline" href="images/kingdom-choices.gif" data-caption="Choose a persona and territory.">
      <img src="images/kingdom-choices.gif" alt="">
    </a>
   </div></td>
  <td><p>Each kingdom has animals and territories. Users can edit their original persona/animal combination. You'll learn how to modify the Animal Kingdom code to add new animals and territories.</p></td>
</tr>
<tr>
  <td><div uk-lightbox="animation: slide">
  <a class="uk-inline" href="images/kingdom-subjects.gif" data-caption="Adding subjects">
      <img src="images/kingdom-subjects.gif" alt="">
  </a>
  </div></td>
  <td>
  <p>Users can add subjects from territories in their own Animal Kingdom. The DApp updates the user's GAI hub each time the user adds a subject. Users can also visit other Animal Kingdom installations and add subjects from these as well. You'll learn how to modify the <b>Other Kingdoms</b> available in your installation.
  </p>
  </td>
</tr>
</table>


## Get the Animal Kingdom code

In this section, you copy the code for Animal Kingdom to your workstation.

1. In your browser (Chrome, Safari, etc), <a href="https://github.com/blockstack/animal-kingdom" target="\_blank">open the Animal Kingdom code repository</a>.

   The AnimalKingdom code is kept in a public GitHub repository.

2. Click the **Clone or download** button.

   If you have a GitHub account you can choose to clone the original repository
   or fork it and then clone it. These instructions assume you are downloading
   the code.

3. Choose the **Download ZIP** for Animal Kingdom.

   <img src="images/kingdom-copy.png" alt="">

3. Check your download directory for the `animal-kingdom-master.zip` file.
4. Copy the download zip file to a directory where you keep code projects.
4. Unzip the file.

    <img src="images/kingdom-download.png" alt="">

    After unzipping the file you should have the `animal-kingdom-master` directory.

5. In your terminal change directory into the top of the directory by entering:

    ```bash
    $ cd animal-kingdom-master
    ```

    Use the `pwd` command to confirm which directory you are in.

    ```bash
    $ pwd
    /Users/manthony/animal-kingdom-master
    ```

6. Take a minute review the files and subdirectories in your Animal Kingdom project.

    Use the `ls` command to list directory contents.

    <table class="uk-table uk-table-striped">
    <tr>
    <th><b>Name</b> </th>
    <th><b>Description</b></th>
    </tr>
    <tr>
    <td><code>README.md</code></td>
    <td>Contains a quick reference for building and running Animal Kingdom. </td>
    </tr>
    <tr>
    <td><code>package.json</code></td>
    <td>An NPM project file.</td>
    </tr>
    <tr>
    <td><code>config</code></td>
    <td>Environment configuration files written in Javascript.</td>
    </tr>
    <tr>
    <td><code>public</code></td>
    <td>Files that are copied into the root of the site you are building.</td>
    </tr>
    <tr>
    <td><code>scripts</code></td>
    <td>NPM scripts used to do common tasks in the project.</td>
    </tr>
    <tr>
    <td><code>src</code></td>
    <td>React source code for the site.&nbsp;&nbsp;This contains configuration files.</td>
    </tr>
    </table>

## Build and run the sample in development mode

You can build and run the Animal Kingdom on your local workstation. Before you
can run the program you use NPM to get all the dependent packages.

1. Make sure you are in the root directory of the project.

   ```bash
   cd ~/animal-kingdom-master
   pwd
   /Users/manthony/animal-kingdom-master
   ```

2. Enter `npm install` to get the software components Animal Kingdom needs.

   ```bash
    $ npm install

    > fsevents@1.2.4 install /Users/manthony/animal-kingdom-master/node_modules/fsevents
    > node install

    node-pre-gyp WARN Tried to download(404): https://fsevents-binaries.s3-us-west-2.amazonaws.com/v1.2.4/fse-v1.2.4-node-v67-darwin-x64.tar.gz
    node-pre-gyp WARN Pre-built binaries not found for fsevents@1.2.4 and node@11.1.0 (node-v67 ABI, unknown) (falling back to source compile with node-gyp)
     SOLINK_MODULE(target) Release/.node
     CXX(target) Release/obj.target/fse/fsevents.o
    In file included from ../fsevents.cc:6:

     ...

    added 1390 packages from 766 contributors and audited 15238 packages in 16.11s
    found 1 high severity vulnerability
     run `npm audit fix` to fix them, or `npm audit` for details
    $
   ```

   This command creates a `node_modules` subdirectory to your project code and
   installs all the code libraries you need for your Animal Kingdom project.

3. Enter the `ls` command to list the contents of your project directory to verify `npm` installed correctly.

   ```
   $ ls
   ```

   The `node_modules`directory contains many core libraries used by Animal
   Kingdom. For example, the Blockstack Javascript library is in the
   `nodule_modules/blockstack/lib` subdirectory.

4. Start the Animal Kingdom DApp running on your workstation by entering:

   ```bash
   npm start
   ```

   The `npm` program compiles the Animal Kingdom code. Once the code compiles,
   the DApp opens Animal Kingdom running at the  `http://localhost:3000` URL in
   your browser.

4. From the initial Animal Kingdom screen, choose an animal person and a territory.
5. Press **Done** at the bottom of the page.

   The Animal Kingdom makes a call to the Gaia hub to store your selection.
   After a brief pause, the DApp returns you to the **Your Kingdom** page. If
   you have problems,  refresh the page and click **Your Kingdom** in the
   menu.

   <img src="images/kingdom-ruler.png" alt="">

6. Spend a little time exploring the application.

   For example, you could edit your animal or visit the other pages such as **Animals** or **Territories**.

7. Go back to your terminal where you started your application is running.
8. Press `CTRL-C` to stop the application.

   <img src="images/kingdom-stop.png" alt="">

   You can start it again with `npm start` as you will later in this tutorial.


## Understand the application code

The application has two major components, React and Blockstack. React is used to
build all the web components and interactions. You could replace React with any
framework that you like; Blockstack is web framework agnostic. This section does
not explain the React in any detail; The discussion focuses on the Blockstack
Javascript library the DApp instead.

The <a href="https://blockstack.github.io/blockstack.js/"
target="\_blank">Blockstack Javascript library is all a developer needs to
create a DApp. It grants</a> the application the ability to authenticate a
Blockstack identity and to read and write to the user's data stored in a Gaia
hub.

### Authenticating user identity
{:.no_toc}

The `src/App.js` file creates a Blockstack `UserSession` and uses that session's
`isUserSignedIn()` method to determine if the user is signed in or out of the
application. Depending on the result of this method. The application redirects
to the `src/SignedIn` page or to the `src/Landing.js` page.

```js
 import React, { Component } from 'react'
 import './App.css'
 import { UserSession } from 'blockstack'

 import Landing from './Landing'
 import SignedIn from './SignedIn'

 class App extends Component {

   constructor() {
     super()
     this.userSession = new UserSession()
   }

   componentWillMount() {
     const session = this.userSession
     if(!session.isUserSignedIn() && session.isSignInPending()) {
       session.handlePendingSignIn()
       .then((userData) => {
         if(!userData.username) {
           throw new Error('This app requires a username.')
         }
         window.location = `/kingdom/${userData.username}`
       })
     }
   }

   render() {
     return (
       <main role="main">
           {this.userSession.isUserSignedIn() ?
             <SignedIn />
           :
             <Landing />
           }
       </main>
     );
   }
 }

 export default App
```

The first time you start the application, this code determines if the user has
signed into the DApp previously. If not, it opens the  `Landing.js` page. This
page offers the user an opportunity to **Sign in to Blockstack**.

Clicking the button ends up calling the `redirectToSignIn()` method which generates an
authentication request and redirects the user to the Blockstack browser to
approve the sign in request. The actual Blockstack sign-in dialog depends on
whether the user already has an existing session in the Blockstack Browser.

<img src="images/kingdom_notin.png" alt="">

Signing in with an identity is the means by which the user grants the DApp
access. Access means the DApp can read the user profile and read/write user data
for the DApp. Data is encrypted at a unique URL on a GAI storage hub.

<div class="uk-card uk-card-default uk-card-body">
<h5>App Mining Requirement: Blockstack Authentication</h5>
<p>To participate in application mining your application must integrate Blockstack authentication.
</p>
</div>

### Get and put user data to a GAIA Hub
{:.no_toc}

GAIA is the Blockstack data storage hub (https://hub.blockstack.org). Once a user
authenticates, the application can get and put application data in the user's
storage. After a user signs in, the `SignedIn.js` code checks the user's GAIA
profile by running the `loadMe()` method.

```js
loadMe() {
    const options = { decrypt: false }
    this.userSession.getFile(ME_FILENAME, options)
    .then((content) => {
      if(content) {
        const me = JSON.parse(content)
        this.setState({me, redirectToMe: false})
      } else {
        const me = null

        this.setState({me, redirectToMe: true})
      }
    })
  }
```

The `loadMe()` code uses the Blockstack's `getFile()` method to get the
specified file from the applications data store. If the users' data store on
GAIA does not have the data, which is the case for new users, the Gaia hub
responds with HTTP `404` code and the `getFile` promise resolves to null. If you
are using a Chrome Developer Tools with the DApp, you'll see these errors in a
browser's developer **Console**.

<img src="images/kingdom-errors.png" alt="">

After a user chooses an animal persona and a territory, the user presses **Done**
and the application stores the user data on GAIA.

```js
saveMe(me) {
  this.setState({me, savingMe: true})
  const options = { encrypt: false }
  this.userSession.putFile(ME_FILENAME, JSON.stringify(me), options)
  .finally(() => {
    this.setState({savingMe: false})
  })
}
```

The Blockstack <a href="https://blockstack.github.io/blockstack.js/#putfile"
target="\_blank"><code>putFile()</code></a> stores the data provided in the
user's DApp data store. You can view the URL for the data store from a user's
profile. If you tested your Animal Kingdom, you can see this on your profile.
To see your profile, go to the <a href="https://explorer.blockstack.org">Blockstack explorer</a> and search for your ID:

<img src="images/explorer.png" alt="">

In the next section, you extend your Kingdom's configuration.

<div class="uk-card uk-card-default uk-card-body">
<h5>App Mining Requirement: Gaia Storage</h5>
<p>To participate in application mining your application must make use of Gaia storage.
</p>
</div>

## Expand your kingdom

Your DApp contains three pages **Animals**, **Territories**, and **Other
Kingdoms** that are derived from three code elements:

 * The `src/constants.js` file defines the application's data profile.
 * The `public/animals` directory which contains images.
 * The `public/territories` directory which contains images.

In this section, you learn how to add another kingdom to the available **Other
Kingdoms** and how to add another territory.

### Add a territory
{:.no_toc}

If your application is still running in localhost stop it with a `CTRL-C` from
your keyboard.  

1. Decide what kind of territory to add &emdash; desert, ocean, or city!

   This example adds Westeros, a fictional territory.

2. Search for an image to represent your new territory.

   Google images is a good place to find <a href="images/westeros.jpg" target="\_blank">a JPEG image of Westeros</a>.

3. Save the image to the `public/territories` folder in your Animal Kingdom project code.

   {% include warning.html content="The territory filename must be all lower case and have a <code>.jpg</code> extension.
   For this example, the territory image is saved in the <code>westeros.jpg</code> file." %}

4. Use the `ls` command to confirm your file appears in `territories` directory and has the correct name.

   ```bash
   ls public/territories/
   forest.jpg   tundra.jpg   westeros.jpg
   ```

4. Open the `src/constant.js` file in your favorite editor.
5. Scroll down to the section that defines the **Territories**.

   ```js
   export const TERRITORIES = [
     {
       id: 'forest',
       name: 'Forest',
       superpower: 'Trees!'
     },
     {
       id: 'tundra',
       name: 'Tundra',
       superpower: 'Let it snow!'
     }
   ]
   ```

6. Add your new territory.

   ```js
   export const TERRITORIES = [
     {
       id: 'forest',
       name: 'Forest',
       superpower: 'Trees!'
     },
     {
       id: 'tundra',
       name: 'Tundra',
       superpower: 'Let it snow!'
     },
     {
       id: 'westeros',
       name: 'Westeros',
       superpower: 'The Iron Throne!'
     }
    ]
    ```
7. Save and close the `constant.js` file.
8. Back in a terminal window, restart your application.

   ```bash
   $ npm start
   ```
9. After the application starts, navigate to the **Territories** page and look for your `Westeros` territory.

   <img src="images/kingdom-throne.png" alt="">

### Add the Blockstack kingdom
{:.no_toc}

Your Animal Kingdom has only recognizes two **Other Kingdoms**. In this section,
you add a third, the Blockstack kingdom (`https://animalkingdoms.netlify.com`).

1. Open the `src/constant.js` file in your favorite editor.

   On Mac you can use TextEdit or Vim.

2. Scroll down to the section that defines the **Other Kingdoms**

   ```js
   export const OTHER_KINGDOMS = [
     {
       app: 'https://animal-kingdom-1.firebaseapp.com',
       ruler: 'larry.id'
     },
     {
       app: 'http://localhost:3001',
       ruler: 'larz.id'
     }
   ]
   ```

   To add a kingdom, you need its URL and the ID of its owner.

3. Edit the file and add the `https://animalkingdoms.netlify.com` which is owned by `moxiegirl.id.blockstack`.

   When you are done the file will look like this.


   ```js
   export const OTHER_KINGDOMS = [
     {
       app: 'https://animal-kingdom-1.firebaseapp.com',
       ruler: 'larry.id'
     },
     {
       app: 'http://localhost:3001',
       ruler: 'larz.id'
     },
     {
       app: 'https://animalkingdoms.netlify.com',
       ruler: 'moxiegirl.id.blockstack'
     }
   ]
   ```

4. Save and close the `constants.js` file.
5. Back in your browser, navigate to the **Other Kingdoms** page.

   <img src="images/kingdom-moxiegirl.png" alt="">

7. Got to the `moxiegirl` kingdom by clicking on her kingdom.
8. Try adding a subject from Moxiegirl's kingdom to yours.


## Go live on the Internet

In this section you use a free Netlify account and a free GitHub account to take
your kingdom live on the internet. Netlify provides hosting and serverless
backend services for static websites. GitHub is a code hosting site.

<div class="uk-card uk-card-default uk-card-body uk-section-muted">
<h5>App Mining Requirement: Review Accessibility</h5>
<p>To participate in application mining your application must be available for review. Open source projects must provide the URL to their code. Projects with private repositories can provide their application in a package form.
</p>
</div>

### Run your Kingdom on the internet
{:.no_toc}

So far, you've been running the application locally. This means you are the only
person that can use it to create a kingdom. You can make your application
available to others by hosting it out on the internet. You can do this for free
with a Netlify account.

Before you begin, you need to build a site that is ready to deploy.

1. In your terminal, press `CTRL-C` on your keyboard to stop your `npm start` build.
2. Build a website from your code by entering the `npm run build` command:

   ```bash
   npm run build
   ```

   <img src="images/run-build.png" alt="">

   When the command completes, you should have a new `build` subdirectory in your project.

3. Open your project in the Finder.
4. Locate the newly created `build` subfolder.

   <img src="images/finder-build.png" alt="">

5. <a href="https://app.netlify.com/signup" target="\_blank">Sign up for a free Netlify account</a>

   This example assumes you create an account by providing an email and password.

   <img src="images/netlify-account.gif" alt="">

6. In your email inbox, find Netlify's welcome email and verify your account.

   <img src="images/netlify-verify.png" alt="">

7. Log into Netlify and go to the **Overview** page in your browser.
8. Drag your `build` subdirectory from the Finder into the drop zone in Netlify.

   <img src="images/netlify-deploy.gif" alt="">

   After a moment, Netlify builds your code and displays the location of your new website.

   <img src="images/kingdom-build.png" alt="">

9. Click on your website name to display the website.

   You are prompted to sign into this new site with your Blockstack ID.

10. Click **Sign in with Blockstack**.

    After you sign in, your website presents you with this message:

    <img src="images/kingdom-failed.png" alt="">   

    You get this message because, when you authenticate, your DApp at one URL
    requested a resource (an identity) from another DApp, the Blockstack
    Browser. A request for a resource outside of the origin (your new website)
    is called as a _cross-origin request_(CORs). Getting data in this manner can
    be risky, so you must configure your website security to allow interactions
    across origins.

    <div class="uk-inline">
    <button class="uk-button uk-button-primary" enter="button">Click me to learn how CORS is like borrowing a ladder.</button>
    <div uk-dropdown>
    You can think of CORS interactions as an apartment building with Security.
    For example, if you need to borrow a ladder, you could ask a neighbor in
    your building who has one. Security would likely not have a problem with
    this request (i.e., same-origin, your building). If you needed a particular
    tool, however, and you ordered it delivered from an online hardware store
    (i.e., cross-origin, another site), Security may request identificatin
    before allowing the delivery man into the apartment building.
    <br>
    Credit: <a href="https://www.codecademy.com/articles/what-is-cors" target="\_blank">Codecademy</a>
    </div>
    </div>

    The way you configure CORs depends on which company is serving your website.
    You are using Netlify for this example.

11. Locate the `cors/_headers` and `cors/_redirects` files in your project.

    You can use the Finder or the `ls` command.

    <img src="images/finder.png" alt="">

12. Copy them into your `public` directory.

    To copy them with the `ls` command, enter the following in the root of the `animal-kingdom-master` project.

    ```bash
    cp cors/_headers public
    cp cors/_redirects public
    ```

    The name of each file, with the underscore, is essential.

13. Make sure you are in the `animal-kingdom-master` directory, run the `npm run build` command again.
15. Drag the `build` file back into the Netlify drop zone.

    After a moment, Netlify publishes your site. Check the published location, it may have changed.

16. Click on the link and log into your Animal Kingdom.
17. Recreate your animal person and territory.

    The Animal Kingdom is identified by its location on the Internet, remember?
    So, the animal kingdom you created on your local workstation is different
    than the one you create on Netlify.

### Add your Kingdom to our Clan
{:.no_toc}

At this point, your kingdom is isolated. If you know another kingdom, you can
add subjects from that kingdom but other kingdoms can't access your subjects. In
this section, you use a free GitHub account to add your kingdom to the
Blockstack kingdom.

1. If you have a GitHub account, go to step 2 otherwise go to GitHub <a href="https://github.com/" target="\_blank">site and create a new account</a>.  
2. Go to the <a href="https://github.com/blockstack/animal-kingdom/issues" target="\_blank">https://github.com/blockstack/animal-kingdom/issues</a> repository on Github.
2. Click **New Issue**.

   The new issue dialog appears.

3. Fill out the issue with the URL from Netlify and your Blockstack id.

   When you are done, your issue will look like the following:

   <img src="images/kingdom-issue.png" alt="">

4. Press **Submit new issue**.

   The Blockstack team will add your Netlify kingdom to ours. When we do that, we will notify you on the issue and you'll also get an email.

5. When you receive the email, login into the Blockstack Animal kingdom to see your kingdom under **Other Kingdoms**.


## Next Steps
{:.no_toc}

Well, you have produced your very first DApp. Congratulations! If you have a
twitter account, why not tell some folks?

<a href="https://twitter.com/share?ref_src=twsrc%5Etfw"
class="twitter-share-button" data-size="large" data-text="I just built a DApp
using @blockstack's  Zero to DApp tutorial! " data-hashtags="blockstack,
blockchain, blockchainnopain, blockchainnopainblockstack"
data-show-count="true">Tweet your work!</a><script async
src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In the next section, you learn how you can participate in App Mining by submitting a [DApp to App.co &mdash; the Universal App store](zero_to_dapp_4.html).  
