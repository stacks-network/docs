---
layout: learn
permalink: /:collection/:path.html
---
# How apps are reviewed and scored
{:.no_toc}

Blockstack uses third-party reviewers who interact with, review and provide scores for the apps in the App Mining program. The scores from each reviewer are used to determine an app`s ultimate rank. In this section, you learn more about the reviewers and how they score.

* TOC
{:toc} 

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

As of October 2019, Awario ranks apps based on Blended Awareness which is comprised of these parts:

* A binary scoring on social networks, that is, you get a number out of 5 max (1 point for any Mention registered on Facebook, Twitter, YouTube, Reddit, or Instagram).
* A _reach score_ for any mentions in the news or blog section. The reach will have `log10` scoring applied to it.
* A _growth score_ which is calculated the same way, just limited to the growth in reach from the news or blog mentions. 

Each of these three pieces will make up 1/3 of your overall Awario score. Some special conditions to understand about these values:

* The first month you have Awario data you won't receive a growth score. This means your score for the first month is only comprised of reach and social.
* If your reach in the last month was less than 1000, you don't get a growth score. This is designed to prevent huge growth percentage outliers.

{% include note-list.html content="<ul>
  <li>To make sure <strong>Mentions</strong> on Instagram are picked up, <a href='https://help.instagram.com/502981923235522' target='_blank'>set your account to a <strong>Business</strong> account</a>.</li>
  <li>Medium links will not count in your Reach score for the time being. The way Reach is calculated currently on Medium.com is too clumsy. Awario is shipping updates to this soon, so Blockstack can revisit then. Medium Reach will be zeroed out for everyone <a href='https://github.com/blockstack/app-mining/issues/171' target='_blank'>as described here</a>.</li>
  <li>If you change your app name, you need to let us know. Email <a href='mailto:mining@app.co'>mining@app.co</a> to start the process. Anticipate a month not getting an Awario score to allow for Blockstack to set up and train a new query.</li>
  <li>Please wait until the audit period to contact us about Mentions you feel are missing. In all the cases where someone has reached out, the Mentions show in the dashboard later as there is a delay as data is processed- you Awario dashboard is not meant to be real-time.</li>
</ul>" %}

Blockstack publishes the Awario data sheet with all app mentions for auditing at the start of the audit period. Blockstack PBC employee social media accounts are omitted from the reach scores. There is also a manual scan of Awario data to remove any data suspected of a false match.

