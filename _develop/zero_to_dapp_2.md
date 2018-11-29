---
layout: learn
permalink: /:collection/:path.html
---
# 2 - Discover how DApps are different
{:.no_toc}

**Zero to DApp, 2 of 4**

This page explains how DApp user interactions differ from interactions on web
applications. If you don't have one, you'll also create a Blockstack ID.
Finally, you'll also learn what industry experts say are fertile grounds for
DApp development. This page has the following topics:

* TOC
{:toc}

<div class="uk-card uk-card-default uk-card-body">
<h5>Can you skip this page?</h5>
<p>If you already have a good understanding of how DApps change user
interactions, have a Blockstack ID, and have a good idea of the DApp you want to develop, skip
this page and <a href="zero_to_dapp_3.html">move onto 3 of 4 immediately</a>.
</p>
</div>

## Get the user perspective on DApps

![](https://d2mxuefqeaa7sj.cloudfront.net/s_65D38DE36A9E0559639DF0B6F5271AA88578C54592AF9D85F6A7C7F9A62C47D4_1537556532237_image.png)

This old proverb is all about how our environment shapes our thinking. As a
user, you have lived in the centralized application environment for a
long time. To develop a DApp, you have to shift your thinking to new
interaction paradigms. You must discover what you don’t know and reimagine
application interactions.

For example, traditional applications allow users to “safely” forget their
application passwords because they can recover the password and their data
access from the a central authority. This isn’t true for a DApp. Users must be
responsible for keeping their own identity access and managing their own data.
How do you convey this to users?

### How Dapp onboarding differs
{:.no_toc}

Currently, users can create a Blockstack ID for free or buy their own ID. Dapps
that are submitted for app mining must include Blockstack authentication. This
authentication includes onboarding flow for users delivered through the
Blockstack Browser. The language and concepts presented by the flow are
important for you to understand before writing your own DApp.

If you haven't already created your own Blockstack ID, do this now. As you
create an ID, consider what interactions are familiar to you and which are not.
If you already have a Blockstack ID, launch the browser and try resetting it. Or
trying logging on from a device or browser software you haven't used before.

{% include create_id.md %}

Once in the browser, investigate the account and locate the storage settings.
Consider the interaction as both a user and an app designer. Are these settings
what you expected or would you change them?

### Take a user perspective
{:.no_toc}

If you want to solve for an existing, traditional space, you must take time to
really consider what problems a DApp replacement would solve. But make sure you
also take the time to consider what challenges your new application has in
shifting user experiences.

- What identity or data ownership features make my application unique or powerful?
- What typical expectations will users have that must be adjusted?
- How can my interaction design convey these new features to users so users can succeed?

As a developer, your understanding of applications is vastly different from a
standard application user. Prototyping (paper or wireframes) and user testing
can help you determine if your approach is correct before you begin coding.

1. Choose an application from the Blockstack Browser homepage or from the <a href="https://app.co/" target="\_blank">list on the App.co site</a>.

   Blockstack maintains the App.co website as a central place for users and
   developers to explore and review blockchain applications. This site has
   application categories such as:

    - Business Tools
    - Developer Tools
    - Education & News
    - Financial Services
    - Games & Digital Assets
    - Social Networking
    - Health & Fitness
    - Marketplaces

2. Spend 20 minutes reviewing the application.

   - Is the application free?
   - How did the application designers expose or hide decentralized features?

3. Try logging into the same application from another device such as your phone.

   - You'll need to authenticate on this device with Blockstack too.
   - How does the mobile experience differ from your desktop experience?

Repeat this exercise with a friend or relative who is not a developer. This
should give you perspective on the problems users will encounter with your
potential application.

## Research existing in decentralized applications

![](https://d2mxuefqeaa7sj.cloudfront.net/s_65D38DE36A9E0559639DF0B6F5271AA88578C54592AF9D85F6A7C7F9A62C47D4_1537563661663_image.png)

This quote from Gene Luen Yang, a Genius Grant recipient and comic book artist,
has a good point. Have you researched what other top industry thinkers have said about
potential applications of blockchain technology? For example, EY developed a five-point
test to help determine if a blockchain solution would help for a problem:

<div class="uk-card uk-card-default uk-card-body">
<ul> <li>Are there multiple parties in this ecosystem?
  Blockchains are fundamentally multiparty collaboration systems.</li>
<li>Is establishing trust between all parties an issue?
  Blockchains improve trust between participants by having multiple points of verification.</li>
<li>Is it critical to have a detailed transactional record of activity?
  If everyone agreed on everything, you wouldn't need a blockchain to verify who did what and when it was done.</li>
<li>Are we securing the ownership or management of a finite source?
  Core logic in the blockchain system is designed to prevent double-counting of assets and to record ownership and transfers.</li>
<li>Does the network of partners benefit from increased transparency across the ecosystem? Blockchains are transparent by design.</li></ul>

<p>From <a href="http://go.galegroup.com/ps/i.do?p=AONE&u=plan_smcl&id=GALE|A547075763&v=2.1&it=r&sid=AONE&asid=f2f8ee00" target="\_blank">Maslova, Natalia. "BLOCKCHAIN: DISRUPTION AND OPPORTUNITY." Strategic Finance, July 2018</a></p>
</div>

The EY test is a general test about the domains that blockchain applications can disrupt. You can also consider more specific behaviors a DApp should meet. Blockstack defines three principles that Blockstack applications should meet:

* Users own their own data
* Users own their identities
* Users have free choice of clients

If you haven't read it, read the full article <a href="/develop/dapp_principles.html" target="\_blank">on principles of Blockstack applications</a>.

### Tips for coming up with application ideas
{:.no_toc}

Before developing a DApp, research the blockchain space and engage with the Blockstack community.

* Visit <a href="https://forum.blockstack.org/" target="\_blank">the Blockstack forum</a>.
  This is a valuable resource to learn about the questions that other developers have now or have had in the past.
* Visit the <a href="https://community.blockstack.org/" target="\_blank">Blockstack Community website</a> to learn about events that may be coming to your area.
* Join the Blockstack <a href="https://slofile.com/slack/blockstack" target="\_blank"> Slack channel</a> which you can join by filling in the following <a href="https://docs.google.com/forms/d/e/1FAIpQLSed5Mnu0G5ZMJdWs6cTO_8sTJfUVfe1sYL6WFDcD51_XuQkZw/viewform">form</a>.

When coming up with ideas for an application, you can try some thought experiments.

- Imagine if an identity acted as an internet phone number? Could a service pre-screen email so that only those identities that showed an interaction on the blockchain could communicate?
- How could you use the blockchain to verify reviewers in an application like Yelp? What kind of features would you allow unverified reviewers?
- How could you use the blockchain to make online dating safer?

A fun game is to use Google to combine the word blockchain with some word you
think might be unrelated such as juice or zoo. This kind of play can result in
some surprising finds and interesting ideas.


## Where to go next
{:.no_toc}

In this section, you learned important areas for consideration and tips for
where to research. You learned some techniques for formulating and solidifying
your development efforts. Of course, building an app is a great way to generate
ideas.

In the next section, you dive into the features of the Blockstack technology by
developing a sample application. Continue to [Zero to DApp, 3 of 4](zero_to_dapp_3.html).
