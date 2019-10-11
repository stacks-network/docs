---
layout: learn
permalink: /:collection/:path.html
---
# How apps are reviewed and scored
{:.no_toc}

Blockstack uses third-party reviewers who interact with, review and provide scores for the apps in the App Mining program. The scores from each reviewer are used to determine an app`s ultimate rank. In this section, you learn more about the reviewers and how they score.

* TOC
{:toc}

## Product Hunt

Product Hunt is the place to find the best new products in tech. They have a massive trove of user data (upvotes, comments, etc.) that they use for ranking. Product Hunt ranks apps based on a “community” score.

Their community score is determined only by the number of **credible** upvotes an app received on Product Hunt, relative to other apps that are registered. For example, if an app got more upvotes than any other app in a cohort, their community score would be 100. If a different app got 60% as many upvotes, they’d get a score of 60. Blockstack converts these scores into *z-scores*.

More info on the Product Hunt launch component and recommendations in the [Application Miner's Guide to Promoting your App]({{ site.baseurl }}/community/app-miners-guide.html).  

## TryMyUI

TryMyUI provides 1.5M application testers around the globe, and apps enrolled in app mining are reviewed by 10 users every other month and rated on the following dimensions:

* Usability
* Usefulness
* Credibility
* Desirability

TryMyUI drops the highest and lowest test scores and uses the middle 8 scores each month for the rankings and calculates and average of scores for each component. Apps that are not being tested will receive the same scores as the last test round.  TryMyUI has it’s own “history” component to increase reliability of the tests. On average, projects need around 20 user tests to get actionable and reliable feedback. TryMyUI provides a monthly score that reflects 75% of the new month’s score, and 25% from last month’s score. The calculation to find that is: 

```
X = raw score of new month
Y = final (rolled) score from previous month

0.75X + 0.25Y = new month’s final score
```

TryMyUI tests occur from the beginning to middle of the month, and Blockstack PBC cannot provide exact timing of the tests. App founders should not make any breaking changes to the app during this time. TryMyUI testers are English speaking. TryMyUI provides niche audiences based on the type of app.  Founders can take <a href="https://docs.google.com/forms/d/1y_1i5eTYpUQ0119cUieFaj4B9CPfmJilz9zIM5fGjgU/viewform?edit_requested=true" target="_blank">this brief survey</a> to fill out their preferred audiences.  Read more about TryMyUI Scoring and recommendations in our [App Miner's Guide]({{ site.baseurl }}/community/app-miners-guide#recommendations-from-trymyui). 

## New Internet Labs 

New Internet Labs ranks apps based on their use of Blockstack Authentication (Auth) and Gaia as a measure of Digital Rights. New Internet Labs may test on any browser or device of their choosing for web apps. If the application is a mobile app, then it is tested on the appropriate mobile OS. 

For authentication, the scoring criteria follows: 

| Rating | Blockstack Auth|
|---|---|
| `4` | Is the only authentication method.|
| `3` |  Is the primary authentication method.|
| `2` | Is one of many authentication methods. |
| `1` | Is of secondary importance among many authentication methods.|
| `0` |  Is not used at all.|
| `-1` |  Is not used at all.|


For Gaia, the scoring criteria follows: 

| Rating | Gaia|
|---|---|
| `1` | Is used. |
| `0` | Is not used or the reviewer could not determine.|
| `-1` | Is used but is broken. |

New Internet Labs provides these raw scores to Blockstack. Apps that are found ineligible by New Internet Labs due to having an error in Auth are disqualified from app mining.  

## Awario 

Awario provides data about app awareness by scanning the web for 'Mentions' of the app name. The Awario score for App Mining is a result of measuring the Reach of these Mentions (specifically, Blog/News mentions), combined with the growth rate of overall Reach, combine with a binary examination of Mentions on social media. 

Awario rankings start counting at the start of the month the app was submitted, and the results are incorporated into the rankings the month following. This means that any data used in calculations is from the previous month. New apps to the program do not incorporate this score on their first month of being enrolled.

As of October 2019, Awario ranks apps based on Blended Awareness.

Blended Awareness is comprised of 3 parts:
1. A binary scoring on social networks. i.e. you get a number out of 5 max (1 point for any Mention registered on Facebook, Twitter, YouTube, Reddit, or Instagram).
2. A “Reach score” for any Mentions in the News/Blog section. The Reach will have log10 scoring applied to it.
3. A growth score, this will be calculated the same way, just limited to the growth in Reach from the News/Blog Mentions. 

Each of these three pieces will make up 1/3 of your overall Awario score.

Blockstack publishes the Awario data sheet with all app mentions for auditing at the start of the audit period. Blockstack PBC employee social media accounts are omitted from the reach scores. There is also a manual scan of Awario data to remove any data suspected of a false match.

