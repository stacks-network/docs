---
layout: learn
permalink: /:collection/:path.html
---
# Understand App Mining
{:.no_toc}

This section explains App Mining, a program for developers. For Blockstack, App Mining is a crucial factor in the growth of both blockchain applications and users.  

* TOC
{:toc}

## What is App Mining?

{% include intro-appmining.md %}

## How apps are reviewed

Blockstack worked with a team of Ph.D. game theorist and economists from
Princeton and NYU to put together a [ranking
algorithm](https://blog.blockstack.org/app-mining-game-theory-algorithm-design/)
which is fair and resistant to abuse. Blockstack uses the third-party
reviewers: Product Hunt, Awario, TryMyUI, and Democracy.. These reviewers are
independent, and generally rely on their own proprietary data and insights to
generate rankings.

To learn in detail about the reviewers' methods, see the page on [who reviews apps](app-reviewers.html).

## Reaching the final scores

Once the reviewer-partners generate reviews, each app has 5 raw scores between 0
and 100 for the following:

* Product Hunt team score
* TryMyUI ALF score
* Awario
* digital rights review

First Blockstack's determine a ‘z-score’ for each ranking category community,
team, likability, and traction. This is a statistical technique to account for
different distributions of scores within categories. Second, Blockstack computes
the average and standard deviation of each category. Finally, for each app’s
score in that category, Blockstack determines how many standard deviations it is
away from the average score in that category.

For example, let’s say a category has an average score of 60, with a standard
deviation of 15. A score of 90 would get a z-score of 2, because it’s 2 standard
deviations higher than the average.

Once each app has a calculated a z-score in every category, the average of those
4 z-scores results in a final number. A higher number is better than a lower
one, and so apps are ranked from highest to lowest.


## Determining how much an app is paid

{% include payout-appmining.md %}

This first release of App Mining uses the initial version of our ranking and
payout mechanism. Blockstack has taken care to be thoughtful and fair, but
things may change as we learn more and get feedback from the community. Please
let us know what you think by commenting <a href="https://forum.blockstack.org"
target="\_blank">in our forum</a> or by emailing us at <hello@app.co>!

The ranking and payout mechanisms are under constant review and are documented at <a href="https://github.com/blockstack/app-mining">the app mining's github repository</a>.
