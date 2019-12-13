---
layout: learn
description: Blockstack app mining documentation
permalink: /:collection/:path.html
---
# How scores become rankings
{:.no_toc}

{% include mining-ranking.md %}

* TOC
{:toc}

## Z- Scores

First Blockstack determines a `z-score` for each ranking. This is a statistical technique to account for different distributions of scores within categories. For each app’s score in a category, Blockstack determines how many standard deviations it is away from the average score in that category. The following formula is used to calculate a `z-score` for an app.

`if(App score=0, -1, (App score -average App score:App score))/stdev(App score:App score))`

For example, let’s say a category has an average score of 60, with a standard deviation of 15. A score of 90 would get a z-score of 2, because it’s 2 standard deviations higher than the average. 

After computing the z-scores, Blockstack considers the app category. It computes the average of that category's z-scores and the standard deviation of each category.
 
## Theta-Scores

Theta scores standardize reviewer results so they can be compared to other app reviewer data. Theta-scores are calculated by this formulat

`if(App’s Avg. Z-score > 0, App’s Avg. Z-score^0.5, -(ABS(App’s Avg. Z-score)^0.5))`

Once each app has a calculated a theta-score in every category, the average of those theta-scores results in a score.


## Final Results

The final results are determined by taking the average Theta values of the app’s scores and combining that value with a history score. App mining weighs past results of the program alongside new results to track improvements and give weight to each months rankings. 

Apps that have been in the program for a month take into account a 25% history score from their score last round and 75% of their average score this month. Here is the equation that is used:

`if(Score last round=0, New Average Score, (0.75*New average score+0.25*Score last round))`

A higher final score is better than a lower one, and so apps are ranked from highest to lowest.

To see all the formulas in action, please see the results and formulas used in [the full sheet of App Mining audit results](https://docs.google.com/spreadsheets/d/13PXIJhEhTusjVT9elYS3LnGqSj6DBjTUDCzB_R6Inkw/edit?usp=sharing).
