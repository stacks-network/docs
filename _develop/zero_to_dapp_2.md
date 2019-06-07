---
layout: learn
permalink: /:collection/:path.html
image: /assets/img/zero-to-dapp.png
---
# 2 Learn about the Blockstack platform
{:.no_toc}

**Zero-to-DApp 2 of 4 for MacOS/Linux (or [Windows](zero_to_dapp_2_win.html))**

In this part, you learn how the Blockstack platform lowers the barriers to
building with blockchain technology. You'll set up all the prerequisites you
need to build a typical web DApp. Finally, you'll build and run your own version
of the Animal Kingdom DApp introduced in [part 1](zero_to_dapp_1.html). This
part has the following topics:

* TOC
{:toc}


## A blockchain platform without pain

Blockstack’s mission is to bring about a new internet where users control the
access to their data and how it is used. With this mission in mind, Blockstack
Public Benefit Corp. (PBC) started development of the Blockstack platform in 2017.  

The platform’s development philosophy followed two simple principles. First,
create backend services that allow decentralized applications to be both
performant and scalable.  Second, provide simple, familiar development
interfaces to blockchain technology. The result of this philosophy is a
technology platform that allows you to:

* **Build your application in any Javascript framework.**  You can use the blockchain without learning a new programming language or extending your application stack. Currently, Blockstack supports a react generator for web applications and SDKs for both iOS and Android.
* **Use well-defined REST endpoints that simplify and encapsulate the blockchain backend.** The Blockstack Javascript API reduces blockchain operations to familiar GET and PUT operations.
* **Access the Blockstack’s Naming System (BNS).**  The system has over 90K users that can immediately start using your application.
* **Scale quickly to large, performant production systems.**  Blockstack’s Gaia storage system gives fast, scalable performance on a level comparable to Amazon S3, Google Drive, or Azure.

Using Blockstack’s technology you can start building immediately on the
blockchain with the knowledge you have today.  You won’t need to spend time or
effort developing additional knowledge of specialized languages or technologies.

## Get prerequisites and set up your environment

To follow the procedures in the rest of this tutorial, you need the following:

* A Blockstack ID (identity) to test your Animal Kingdom.
* Access to the a terminal window and some familiarity with the command line it provides.
* On Mac, an installation of the XCode command-line tools to support Node Package Manager (`npm`)
* The Node Package Manager package manager.

Follow the procedures in this section to install these components.

{% include note.html content="For best results, please use the Chrome browser for this tutorial. Currently, the Blockstack Browser works best in Chrome and you can encounter problems using browsers such as Safari or Firefox. We are working on a fix for these issues." %}


### Confirm or get a Blockstack ID
{:.no_toc}

Confirm you have a Blockstack ID also known as an identity; `joe.id.blockstack`
is an example of an identity.

* If you have an existing ID, log into the <a href="https://browser.blockstack.org/" target="\_blank">Blockstack Browser</a> in your browser.

   Logging in confirms you have a valid ID with the required _secret recovery
   key_ or _magic recovery code_. The secret recovery key is a 12 or 24 word
   phrase you recorded when you created the ID. The magic recovery code is a
   string of characters Blockstack emailed to you when you created your
   identity. You can confirm your identity with either.

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
    <td><code>pwd</code></td>
    <td>Print the name of the working directory; the current directory your command line is in.</td>
  </tr>
  <tr>
    <td><code>ls</code></td>
    <td>Lists the files and directories in the current directory.</td>
  </tr>
  <tr>
    <td><code>cd</code></td>
    <td>Change directory to navigate to locations in your file system.</td>
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

## Get the Animal Kingdom code

In this section, you copy the code for Animal Kingdom to your workstation.

1. In your browser (Chrome is recommended), <a href="https://github.com/blockstack/animal-kingdom" target="\_blank">open the Animal Kingdom code repository</a>.

   The AnimalKingdom code is kept in a public GitHub repository.

2. Click the **Clone or download** button.

   If you have a GitHub account you can choose to clone the original repository
   or fork it and then clone it. These instructions assume you are downloading
   the code.

3. Choose the **Download ZIP** for Animal Kingdom.

   <img src="images/kingdom-copy.png" alt="">

4. Check your download directory for the `animal-kingdom-master.zip` file.
5. Copy the download zip file to a directory where you keep code projects.
6. Unzip the file.

   <img src="images/kingdom-download.png" alt="">

   After unzipping the file you should have the `animal-kingdom-master` directory.

7. In your terminal change directory into the top of the directory by entering:

   ```bash
   $ cd animal-kingdom-master
   ```

   Use the `pwd` command to confirm which directory you are in.

   ```bash
   $ pwd
   /Users/manthony/animal-kingdom-master
   ```

8. Take a minute review the files and subdirectories in your Animal Kingdom project.

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

## Build the sample in development mode

You can build and run the Animal Kingdom on your local workstation. Before you
can run the program you use NPM to get install all the dependent packages. One
of the key packages `npm` installs for you is the Blockstack Javascript library.

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


## Start your Animal Kingdom DApp

1. Start the Animal Kingdom DApp running on your workstation by entering:

   ```bash
   npm start
   ```

   The `npm` program uses the `scripts/start.js` file to package the Animal
   Kingdom application. Once the code is packaged, the DApp opens Animal Kingdom
   running at the `http://localhost:3000` URL in your browser.

2. From the initial Animal Kingdom screen, choose an animal person and a territory.

   <img src="images/initialkingdom.png" alt="">

3. Press **Done** at the bottom of the page.

   The Animal Kingdom makes a call to the Gaia hub to store your selection.
   After a brief pause, the DApp returns you to the **Your Kingdom** page. If
   you have problems,  refresh the page and click **Your Kingdom** in the menu.

   <img src="images/kingdom-ruler.png" alt="">

4. Spend a little time exploring the application.

   For example, you could edit your animal or visit the other pages such as **Animals** or **Territories**.

5. Go back to your terminal where you started your application is running.
6. Press `CTRL-C` to stop the application.

   <img src="images/kingdom-stop.png" alt="">

You can always start the application again with `npm start` command as you will later in this tutorial.

## Resources for Blockstack developers

Blockstack provides several resources that help developers who are building on
the Platform. Take a moment to investigate these resources:

* Visit <a href="https://forum.blockstack.org/" target="\_blank">the Blockstack forum</a>.
  This is a valuable resource to learn about the questions that other developers have now or have had in the past.
* Visit the <a href="https://community.blockstack.org/" target="\_blank">Blockstack Community website</a> to learn about events that may be coming to your area.
* Join the Blockstack <a href="https://slofile.com/slack/blockstack" target="\_blank"> Slack channel</a> which you can join by filling in the following <a href="https://docs.google.com/forms/d/e/1FAIpQLSed5Mnu0G5ZMJdWs6cTO_8sTJfUVfe1sYL6WFDcD51_XuQkZw/viewform">form</a>.


## Where to go next
{:.no_toc}

In this section, you learned about the Blockstack platform and why it makes
Blockchain development a painless process by encapsulating the complexity of the
blockstack backend. You also set up a typical development environment for
developing a Blockstack web application.  Finally, you started and ran the
Animal Kingdom application locally.

In the next section, you explore the application code and learn which recorded
elements in a DApp make it eligible for App Mining. Continue to [Zero-to-DApp, 3
of 4](zero_to_dapp_3.html).
