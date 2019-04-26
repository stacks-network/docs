---
layout: learn
permalink: /:collection/:path.html
---
# How third-parties reviewers operate
{:.no_toc}

Blockstack uses third-party reviewers who interact with, review and provide scores for the apps in the App Mining program. The scores from each reviewer are used to determine an app`s ultimate rank. In this section, you learn more about the reviewers and how they score.

* TOC
{:toc}

## Product Hunt

Product Hunt is the place to find the best new products in tech. They have a massive trove of user data (upvotes, comments, etc.) that they use for ranking. Product Hunt ranks apps based on a “community” score.

Their community score is determined only by the number of **credible** upvotes an app received on Product Hunt, relative to other apps that are registered. For example, if an app got more upvotes than any other app in a cohort, their community score would be 100. If a different app got 60% as many upvotes, they’d get a score of 60. Blockstack converts these scores into *z-scores*.


## Democracy Earth

Democracy Earth is a platform for borderless peer-to-peer democracy. They’ve
built a platform that anyone can use to gather votes in a trust-less,
decentralized way.

Democracy Earth has built a platform for Stacks token holders to vote on how
apps should be ranked. Each token holder gets a 1000 votes, and they can
distribute those votes however they want. It’s possible to give all of your
votes to a single app, and you can also “downvote” an app with one of your
votes.

After a voting period, each app has a certain amount of upvotes and downvotes.
First, Democracy Earth calculates the percentage of total votes that are
upvotes. If an app receives 90 upvotes and ten downvotes, the resulting
“likability score” is 90. Secondly, Democracy Earth calculates a “traction
score," which ranks how many total votes (including downvotes) an app received,
relative to other apps.

## Digital Rights Reviewer 

As a "digital rights reviewer," New Internet Labs reviews apps submitted to the app mining program based on the degree to which the apps respect and protect users` fundamental digital rights. For these review, the use of Blockstack Auth and Blockstack IDs are evaluated. The reviewer checks if Blockstack Auth is:

- the only auth method
- one of multiple methods (presented equally with all others)
- a secondary auth method
- not used at all


{% include note.html content="The digital rights reviewer does not provide an exact testing environment. Instead, the reviewer tests various environments changing month to month. Reviews are conducted on the latest version of macOS, Windows, iOS, or Android with either the platform's default browser or the latest version of Chrome or Firefox." %} 

If your app fails a test, by definition you`re not eligible for App Mining since your app does not have working Blockstack Auth. For more detail [here](https://github.com/blockstack/app-mining/blob/master/DigitalRightsAuthScoringCriteria.pdf). 

The digital rights reviewer also checks for an app`s use of Gaia Storage System. Each app is given a rating based on which category it falls into:

- doesn`t use it at all
- uses it for some things (some data is stored elsewhere, or the reviewer is unable to determine if some critical user data is sent elsewhere)
- data is only stored in the Gaia Storage System

## Awario 

Awario is a tool that brands world-wide use to better understand the online "conversation" surrounding their brand and to collect meaningful data with which to grow it. If you are interested in using Awario independent of App Mining, please [see Awario’s documentation](https://awario.com/help/) as it answers most questions about how the platform works.

Awario provides Blockstack with an awareness score. App Miners do not receive a score from Awario in their first eligible month. The first month Awario instead spends evaluating, honing, and updating an apps' brand data queries. The purpose of this is to zero in on only relevant data. 

### Awareness scoring

At a high-level, Awario focuses on two major aspects of awareness mentions and reach.

<table class="uk-table">
  <tr>
    <td>mentions</td>
    <td>Captured mentions of a brand or app online, on social networks, and on news sites. A mention is registered when the name the brand or app appears publicly, for example, a tweet mentioning the app name.</td>
  </tr>
  <tr>
    <td>reach</td>
    <td>The estimated reach of the combined mentions collected for your brand, for example, how far the tweet about said app traveled online.</td>
  </tr>
</table>

Mentions are captured and provided to App Miners. For App Mining, the focus is on reach which is the less gameable and thus more suitable for App Mining. For example, it would be reasonably easy to create many fake individual mentions (for example, a Twitter bot), but it would be unlikely that those fake mentions generate much if any actual reach. Using reach, Awario provides beginning in the second month of an app`s entry, a **Reach Score** and a **Growth Score**.

An app's **Reach Score** is based on the total reach of all eligible mentions for the previous calendar month. A score is `log10(total_reach)`. So, if an app reaches 10 people, the score is 1, 100 is 2, 1000 is 3, and so on. A `log10` calculation is much better than only using the actual reach because outliers would totally skew the distribution. No matter what an app's reach is, to improve 10x its reach only nees to increase this by 1. Using `log10` is also similar to how Blockstack handles the `theta` function in the mining algorithm, because the higher a score, the more an app needs to improve to bump its score.

A **Growth Score** is the month-over-month (MoM) growth in an apps total reach (not `log10`). If an app went from a reach of 1000 to 1500, its MoM growth is 0.5 (or 50%). 

Like all the other reviewers, the z-score is first calculated for each of these metrics, and then averaged. Then, the theta function is applied, resulting in a `final` Awario score.

### What counts as reach

The Awario team directly builds the query and search parameters for mention alerts. This leverages their expertise on their own platform. For unique brand or app names, the query is fairly straightforward, the name is loaded into Awario and it begins crawling sites and networks for public instances of it. For common names or names where context is important, such as a brand name like Stealthy, it is  important to filter out non-relevant results like someone simply using the verb ‘stealthy’. For these cases, Awario sets up much [more complex queries](https://awario.com/help/boolean-search/boolean-syntax-and-operators/) to trim it down to the ones actually related to the project. 

Websites are also excluded from reach totals. Such exclusion is generally pretty accurate and useful in a normal business use-case, it can be gamed because of the way Awario estimates the website reach. The site`s Alexa rank is used in the reach calculation meaning, for example, a mention on Github would register as massive reach, even if that particular mention didn’t really spread that far.

Mentions and associated reach from Blockstack accounts are not counted. This allows Blockstack PBC to support apps publicly, without worrying that it needs to be evenly distributed across apps, which simply isn’t possible. Also not counted are the handles of all Blockstack PBC employees and all official Blockstack PBC managed accounts such as `@blockstack`. This is so everyone at Blockstack PBC can continue to freely support applications without running the risk of unintentionally biasing the results.

### Mention auditing

As part of the monthly process for generating Awario scores, Awario also helps to audit the mentions coming in. This audit ensures that mentions that shouldn’t count don`t. Awario is confident in their ability to only collect and count relevant mentions through their search operators. The Awario teamis also available to answer and questions or concerns App Miners may have. Last, with Awario’s platform, it is extremely easy to remove individual mentions (and thus the associated reach count) or to blacklist any accounts found to be fraudulent or accounting for false-positive mentions.

## TryMyUI

TryMyUI’s panelists score using a special survey they developed expressly for the App Mining program: the ALF Questionnaire (Adoption Likelihood Factors). Desktop, iOS, and Android versions of apps are tested as they are applicable.

Answers to this questionnaire will be used to calculate an overall score reflecting the following 4 factors:

* Usability
* Usefulness
* Credibility
* Desirability

Each factor corresponds to 4 questionnaire items, for a total of 16 items that comprise the ALFQ. Users mark their answers on a 5-point Likert scale, with 5 meaning **Strongly agree** and 1 meaning **Strongly disagree**. The final result is a score for each of the 4 factors, and a composite ALF score.

<img src="images/alf-score.png" alt="">

For example, consider an application that is both Android and iOS. Each platform version receives 4 tests of each. In total, 8 user tests are created, the highest and lowest scores are dropped. App developers receive the raw TryMyUI scores. The App Mining process calculates Z scores for each category. As a result, the TryMyUI results in the App Mining scores differ from raw scores visible in an app`s TryMyUI account.
