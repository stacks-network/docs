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

TryMyUI provides 1.5M application testers around the globe, and apps enrolled in app mining are reviewed by 10 users each month and rated on the following dimensions:

* Usability
* Usefulness
* Credibility
* Desirability

TryMyUI drops the highest and lowest test scores and uses the middle 8 scores each month for the rankings and calculates and average of scores for each component. TryMyUI has it’s own “history” component to increase reliability of the tests. On average, projects need around 20 user tests to get actionable and reliable feedback. TryMyUI provides a monthly score that reflects 75% of the new month’s score, and 25% from last month’s score. The calculation to find that is: 

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

Awario providees data about app awareness through measure of reach, mentions, and growth. Awario rankings start counting at the start of the month the app was submitted, and the results are incorporated into the rankings the month following. This means that any data used in calculations is from the previous month. New apps to the program do not incorporate this score on their first month of being enrolled. 

Awario provides the following information for ranking: 


- Reach is the estimated online *Reach of the Mention* collected on the brand. For example, reach would include how many impressions a tweet mentioning the app actually generated. 
- The log of the `reach` score is calculated by `= if(X2=0, "", log10(X2))`
- The Awario growth score is the percentage change in total reach from the last month to this month (`NOT log10`)
- Awario Average is calculated by `reach/growth Z`. If `growth` is omitted, then this is just `reach z`.

Blockstack publishes the Awario data sheet with all app mentions for auditing at the start of the audit period. Blockstack PBC employee social media accounts are omitted from the reach scores. There is also a manual scan of Awario data to remove any data suspected of a false match.

