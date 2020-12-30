---
title: Deploy on Amazon EC2
description: Learn how to run a Gaia hub on Amazon EC2
---

## Introduction

This teaches you how to run a Gaia hub on Amazon EC2. Amazon EC2 is an affordable and convenient cloud computing provider.
This example uses Amazon EC2 instance together with an [EBS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html)
disk for file storage.

#### Is this tutorial for you?

-> This documentation is appropriate for advanced power users who are familiar with command line tools, `ssh`, and basic editing configuration files.

-> If you are planning on running an _open-membership hub_ or an _application-specific hub_, see [the Hub Overview](/storage-hubs/overview).

## Prerequisites you need

This procedure uses Amazon AWS to choose and configure an Amazon Machine Image
(AMI) running a Gaia service. For this reason, you should have an AWS account
on the [Amazon AWS free tier](https://aws.amazon.com/free/), personal account,
or corporate account. These instructions assume you are using a free tier account.

These instructions assume you have already created a free [domain through the freenom service](https://www.freenom.com).
If you have another domain, you can use that instead.

Finally, setting up the SSL certificates on your EC2 instance requires you to use the terminal
command line on your workstation. Make sure you have the `watch` command installed using the `which` command.

```bash
which watch
```

```bash
/usr/local/bin/watch
```

If `watch` is not located, install it on your workstation.

## Task 1: Launch an EC2 instance

1.  Visit the [AWS Free Tier page](https://aws.amazon.com/free/) and choose **Sign in to the Console**.

    ![](/images/aws-console.png)

2.  Make sure your region is set to one close to you.

    ![](/images/us-west-2.png)

3.  Under **Build a solution** choose **Launch a virtual machine**.

    The system opens the EC2 dashboard.

4.  Enter `blockstack-gaia` in the search bar.

    The system finds AMIs in the Marketplace and the Community.

5.  Choose **Community AMIs**.

    The system displays the available Gaia hub images.

    ![](/images/gaia-community.png)

    Each image name has this format:

    `blockstack-gaia_hub-STORAGETYPE-VERSION-hvm - ami-BUILDTAG`

    You can choose an image that uses **ephemeral** or **EBS** storage. The ephemeral
    storage is very small but free. Only choose this if you plan to test or use
    a personal hub. Otherwise, choose the AMI for elastic block storage (EBS) which provides a persistent data store on
    a separate disk backed by [EBS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html).

    So, the `blockstack-gaia_hub-ephemeral-2.5.3-hvm - ami-0c8fc48c10a42737e` image uses ephemeral storage, is at
    version `2.5.3` and has the `0c8fc48c10a42737e` tag.

6.  Select the most recent version image with the storage you want. The images are not sorted; The most recent images
    is not necessarily at the top of the list.

        After you select an image, the system displays **Step 2: Choose an Instance Type** page.

        ![](/images/tier-2-image.png)

7.  Select **t2.micro** and choose **Next: Configure Instance Details**.

    To configure instance details, do the following:

    <div class="uk-card uk-card-body">
    <ol>
       <li>
          <p>Select a VPC.</p>
          <p>A default VPC is created with a free tier account. You can use this
             default VPC. Or you can choose another VPC. If you choose another VPC,
             ensure the <code class="highlighter-rouge">Subnet</code> value is set to a subnet reachable by a public IP.
          </p>
          <div class="uk-alert-warning uk-alert" uk-alert=""><b>Important:</b> If you're using a private subnet, you
             should attach an elastic IP (EIP) to the VM. This EIP allows you to
             reboot the instance without worrying whether the address will reset. To
             attach an IP, <strong>press allocate new address</strong> and follow the
             instructions to <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#using-instance-addressing-eips-associating" target="_blank">attach the EIP</a> to your new EC2 instance.
          </div>
       </li>
       <li>
          <p>Set <strong>Protect against accidental termination</strong>.</p>
          <p>If you terminate a Gaia instance, you lose all the data associated with it. Protection adds an extra step to terminating your Gaia instance.</p>
       </li>
       <li>
          <p>Open the <strong>Advanced Details</strong>.</p>
          <p>At this point, you are going to configure environment variables for your instance.</p>
       </li>
       <li>
          <p>Paste the following into the <strong>Advanced Details</strong>.</p>

          <div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code>
          {
             "ignition": { "version": "2.2.0" },
             "storage": {
                "files": [{
                "filesystem": "root",
                "path": "/etc/environment",
                "mode": 420,
                "contents": {
                   "source": "data:application/octet-stream,API_KEY%3DKEYPHRASE%0ADOMAIN%3DNAME_OF_DOMAIN%0ASTAGING%3DSTAGING_VALUE"
                }
                }]
             }
          }
          </code></pre></div>        </div>

       </li>
       <li>
          <p>Replace the following values in the JSON.</p>
          <table class="uk-table uk-table-small uk-table-divider">
             <tbody>
                <tr>
                   <th>Value</th>
                   <th>Description</th>
                </tr>
                <tr>
                   <td><code>&lt;KEYPHRASE&gt;</code></td>
                   <td>A phrase to pass when using the hub admin. For example, <code>hubba</code> is a fun key phrase.</td>
                </tr>
                <tr>
                   <td><code>&lt;NAME_OF_DOMAIN&gt;</code></td>
                   <td>Your hub's domain name. For example, <code>maryhub.ml</code> is the domain name in this example.</td>
                </tr>
                <tr>
                   <td><code>&lt;STAGING_VALUE&gt;</code></td>
                   <td>
                      <p>Indicates what type of SSL to create, testing (`1`) or production (`0`). Set testing if you want to test without worrying about rate limiting. A testing cerificate is not secure.</p>
                      <p>For this tutorial, use production (`0`).</p>
                   </td>
                </tr>
             </tbody>
          </table>
       </li>
       <li>
         <p>Check your <strong>Advanced Details</strong> they should look similar to the following:</p>

                <div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code>  {
             "ignition": { "version": "2.2.0" },
             "storage": {
                "files": [{
                "filesystem": "root",
                "path": "/etc/environment",
                "mode": 420,
                "contents": {
                   "source": "data:application/octet-stream,API_KEY%3Dhubba%0ADOMAIN%3Dmaryhub.ml%0ASTAGING%3D0"
                }
                }]
             }
          }
          </code></pre></div>        </div>

       </li>
    </ol>
    </div>

    At this point, you have configured your instance details.

8.  Choose **Next: Add Storage**.

    ![](/images/add-storage.png)

    The storage is set according to the AMI you selected.

9.  Choose **Next: Add tags**.
10. Optionally, add the following tags:

    The tags are not required, they just apply searchable labels to an instance on an EC2 console.

    - **Key** of `Purpose` with the **Value** `gaia`
    - **Key** of `Name` with the **Value** `gaia-hub`
    - **Key** of `Version` with the **Value** `2.5.3` (This value is an example, your version may be different.)

    ![](/images/tag-add.png)

11) Choose **Next: Configure Security Group**.
12) Create a security group with the following three types:

    <table class="uk-table uk-table-small uk-table-divider">
      <tr>
        <th>Type</th>
        <th>Protocol</th>
        <th>Port Range</th>
        <th>Source</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>SSH</td>
        <td>TCP</td>
        <td>22</td>
        <td>My IP</td>
        <td>optional</td>
      </tr>
      <tr>
        <td>HTTP</td>
        <td>TCP</td>
        <td>80</td>
        <td>Anywhere</td>
        <td>optional</td>
      </tr>
      <tr>
        <td>HTTPS</td>
        <td>TCP</td>
        <td>443</td>
        <td>Anywhere</td>
        <td>optional</td>
      </tr>
    </table>

13) Choose **Review and Launch**.

    The system may warn you that the selection is not free tier eligible. You can ignore this for now.

14) Press **Launch**.

    The system prompts you for a key pair.

15) Select **Create a new keypair** or **Choose an existing key pair**.
16) Select **Launch Instances**.

    The system launches your instance.

    ![](/images/aws-launch-status.png)

During the launch process the machine starts and runs some initial setup processes. These processes take a few minutes depending on the network, typically launching does not take more than 10 minutes. While this is happening the instance **Status Checks** reflect the **Initializing** status.

![](/images/instance-initialize.png)

## Task 2: Connect your Gaia server to your domain

Now, you are ready to test your Gaia server. This procedure ensures the Gaia services started correctly and they are configured to the domain name you provided in **Advanced Details** above.

1. Visit the <a href="https://aws.amazon.com/free/" target="\_blank">AWS Free Tier page</a> and choose **Sign in to the Console**.

   ![](/images/aws-console.png)

2. Choose **All services > EC2**.

   The system displays the **EC2 Dashboard**.

   ![](/images/ec2-dashboard.png)

3. Select **Running Instances**.

   The system displays your running instances.

4. Locate your recently launched Gaia server.

   Make sure the instance shows as running and **Status Checks** are complete.
   Completed status checks ensures the Gaia processes and service were started.

5. Select the **Description** tab.

   ![](/images/ec2-instance.png)

6. Locate the **IPv4 Public IP** value.

   The public IP must match the DNS configured for the domain you entered in **Advanced Details** in the previous procedure.

7. Copy the IP and paste it in your browser.

   <table class="uk-table uk-table-small uk-table-divider">
    <tr>
      <th>If the response is</th>
      <th>Do this...</th>
    </tr>
    <tr>
      <td><img src="/images/private-connection.png"/></td>
      <td> You should see a message that your connection is not private.
Everything is fine, continue to the next step, step 8.</td>
    </tr>
    <tr>
      <td><img src="/images/bad-connection.png"/></td>
      <td>
      <ol>
      <li>Check that your domain's DNS configuration matches the public IP address of your instance.</li>
      <li>Update the DNS site's configuration.</li>
      <li>Restart your EC2 instance as per the <a href="#restart-services-and-reload-certificates">Restart and reload certificates</a> procedure on this page.</li>
      <li>Continue with next step, step 8.</li>
      </ol>
      </td>
    </tr>
  </table>

8) Press **Advanced**.
9) Choose to proceed.
10) Extend the IP with the `PUBLIC_IP/hub_info` tag like so.

    You should see a response from your Gaia hub.

    ![Hub test](/images/aws-hub.png)

    At this point, you should see a **Not secure** message in the browser.
    That's because you haven't yet enabled SSL certification. While `HTTPS` is
    not required simple to run the hub services, Blockstack will only connect to
    a hub and write to its storage over a valid `HTTPS` connection.

## Task 3: Configure a domain name

At this point, you can point a domain to your Gaia hub. Although it's not required, it is highly recommended. If you use a domain, you can migrate your instance to a different server (or even provider such as Azure or Dropbox) at any time, and still access it through the domain URL. Just point your domain at the IP address for your EC2 instance. Use an `A Record` DNS type.

These instructions assume you have already created a free <a href="https://www.freenom.com" target="\_blank">domain through the freenom service</a>. To point this freenom domain to your Gaia hub, do the following:

1. Log into your freenom account.
2. Choose the **Manage Freenom Domain** tab.
3. Add an **A** record leave the **Name** field blank.

   This points your entire domain to the hub IP.

4. Save your changes.

5. Create a CNAME record.

   For example, you can use the prefix `www` with your domain name. When you are done, your

6. Save your changes.

   At this point, your DNS management should look similar to the following except that with your domain rather than the `maryhub.ga` domain.

   ![DNS fields](/images/aws-dns-fields.png)

7. After your changes propagate, visit your new domain at the `hub_info` page.

   ![Domain test](/images/domain-test.png)

   If you receive another **Your connection is not private** dialogs, take the option to proceed to your domain. The _Not secure_ message should no longer appear in the browser bar. If the message does appear, try waiting a few minutes for your recent changes to propagate across the net domain servers. Then, refresh the page.

8. Check the SSL certificate for your hub.

   Each browser has its own check procedure, for example, Chrome:

   ![](/images/cert-check.png)

At this point, you have the following. An EC2 instance running Gaia and a DNS
record pointing your domain to this instance.

## AWS hub tips and tricks

Once your Gaia storage hub is up and running on AWS, you may occassionally need to troubleshoot. This section contains some useful information for interacting with your EC2 instance.

### SSH into the Host

To SSH to the EC2 host directly:

```bash
ssh -t -i <your keyfile.pem> core@<public ip address>
```

### Displaying the docker services

Your EC2 instance is running several `docker` services that support the Gaia hub. You can list these services using the `docker ps` command.

```bash
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Command}}\t{{.Names}}"
```

```bash
CONTAINER ID        IMAGE                                   COMMAND                  NAMES
6b170ce9b0d6        nginx:alpine                            "nginx -g 'daemon of…"   nginx
91c5ff651586        quay.io/blockstack/gaia-hub:v2.5.3      "docker-entrypoint.s…"   gaia-hub
16b229a20320        quay.io/blockstack/gaia-reader:v2.5.3   "node lib/index.js"      gaia-reader
89739e338573        quay.io/blockstack/gaia-admin:v2.5.3    "docker-entrypoint.s…"   gaia-admin
```

Each service plays a particular role in running your Gaia hub.

<table class="uk-table uk-table-small uk-table-divider">
   <thead>
      <tr>
         <th>Service</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>certbot</code></td>
         <td>This service runs every 12 hours so you may not see it in the output. The service runs Let's Encrypt <code>certbot</code> client to support SSL. Certbot renews your certificates and reloads Nginx to pick up the changes. This service will run 2x per day checking if the certificate needs to be renewed. </td>
      </tr>
      <tr>
         <td><code>nginx</code></td>
         <td>Runs an Nginx proxy in front of the Gaia Hub. This service does things like rate-limiting, SSL termination, and redirects to HTTPS. Your nginx service relies on your hub's <code>readURL</code> to make requests. Changes to a hub's <code>readURL</code> must be reflected in the <code>nginx</code> service configuration in <code>/gaia/nginx/conf.d/default.conf</code></td>
      </tr>
      <tr>
         <td><code>gaia-admin</code></td>
         <td>A simple administrative service that allows you to administer the Gaia hub. Use REST calls with this service to get and set hub configuration values.</td>
      </tr>
      <tr>
         <td><code>gaia-reader</code></td>
         <td>The Gaia read side-car services get file requests on URLs that start with
         your Gaia hub's <code>readURL</code>. You can determine your Gaia hub's read URL by either
         looking for the <code>readURL</code> key in your Gaia hub's config file. This value is  or by looking for
         the <code>read_url_prefix</code> field in the data returned by a <code>HUB_URL/hub_info</code> page on your
         Gaia hub.</td>
      </tr>
      <tr>
         <td><code>gaia-hub</code></td>
         <td>The Gaia hub service.</td>
      </tr>
   </tbody>
</table>

### Locations of key files

<table class="uk-table uk-table-small uk-table-divider">
   <thead>
      <tr>
         <th>File or Directory</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>/etc/systemd/system</code></td>
         <td>Contains systemd unit-files for managing your Gaia hub.</td>
      </tr>
      <tr>
         <td><code>/etc/environment</code></td>
         <td>Contains the <code>DOMAIN</code> and <code>STAGING</code> variables you entered when creating your EC2 instance.
         </td>
      </tr>
      <tr>
         <td><code>/gaia/gaia.env</code></td>
         <td>Contains the environment variables used by the Gaia <code>systemd</code> unit-files.
         </td>
      </tr>
      <tr>
         <td><code>/etc/systemd/system/reset-ssl-certs.service</code></td>
         <td>A service that removes all existing certificates and restarts all the Gaia hub services. Use this sparingly, since the Lets Encrypt service will throttle too many requests for certificates.</td>
      </tr>
      <tr>
         <td><code>/gaia/hub-config</code></td>
         <td>Configuration for the Gaia Hub service.</td>
      </tr>
      <tr>
         <td><code>/gaia/admin-config</code></td>
         <td>Configuration for the Gaia Hub admin service.</td>
      </tr>
      <tr>
         <td><code>/gaia/reader-config</code></td>
         <td>Configuration for the Gaia Hub reader service.</td>
      </tr>
      <tr>
         <td><code>/gaia/nginx/conf.d</code></td>
         <td>Configuration files for the Nginx service.</td>
      </tr>
      <tr>
         <td><code>/gaia/nginx/certbot/conf</code></td>
         <td>Lets Encrypt SSL certificates/configs.</td>
      </tr>
      <tr>
         <td><code>/gaia/scripts</code></td>
         <td>Scripts run by the systemd services on startup.</td>
      </tr>
   </tbody>
</table>

You can `cat` the various services to see what settings they are using.

```bash
cat /etc/systemd/system/reset-ssl-certs.service
```

```yaml
# reset-ssl-certs.service
[Unit]
Description=Reset Gaia to first boot
ConditionFileIsExecutable=/gaia/scripts/reset-certs.sh

[Service]
Type=oneshot
RemainAfterExit=no
EnvironmentFile=/gaia/gaia.env
EnvironmentFile=/etc/environment
ExecStart=/bin/bash /gaia/scripts/reset-certs.sh

[Install]
WantedBy=multi-user.target
```

### Restart services and reload certificates

This procedures requires you to interact from a workstation command line with your running EC2 instance.

1. Open a terminal on your local workstation.
2. Confirm the hub DNS is set correctly with the following command:

   ```bash
   watch -n 2 -t -g -x host <domain>
   ```

   Substitute your domain name for the `<domain>` variable. For example:

   ```bash
   watch -n 2 -t -g -x host maryhub.ga
   maryhub.ml has address 34.219.71.143
   ```

   If the command returns the correct IP, the same as appears on your EC2 dashboard, stop the process with a`CTRL-C` on your keyboard.

3. Change the permissions on your downloaded `.pem` file.

   For example, this

   ```
   chmod 400 <location-of-pem>
   ```

4. SSH from your workstation and restart Gaia Hub:

   This process requires that you know the location of the `.pem` file you downloaded when you created the keypair.

   ```
   ssh -t -i <your keyfile.pem> -A core@<public ip address> "sudo systemctl restart gaia.service"
   ```

   For example:

   ```
   ssh -t -i /Users/manthony/gaia.pem -A core@34.219.71.143 "sudo systemctl restart gaia.service"
   Connection to 34.219.71.143 closed.
   ```

   This will restart all services required for running a Gaia Hub (nginx, hub, reader, admin, certbot)

5. SSH from your workstation to reset back to first boot:

   \*\* This process will stop Gaia Hub, Nginx and remove any existing SSL certificates. It will then start the process of retrieving certificates and setting up the services again. This will not affect any existing data stored on the server.

   This process requires that you know the location of the `.pem` file you downloaded when you created the keypair.

   ```
   ssh -t -i <your keyfile.pem> -A core@<public ip address> "sudo systemctl restart reset-ssl-certs.service"
   ```

   For example:

   ```
   ssh -t -i /Users/manthony/gaia.pem -A core@34.219.71.143 "sudo systemctl restart reset-ssl-certs.service"
   Connection to 34.219.71.143 closed.
   ```

   After a few minutes, all Gaia Hub services will restart automatically and will retrieve a new SSL certificate.
