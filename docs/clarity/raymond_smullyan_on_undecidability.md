## A selection of Raymond Smullyan’s intuition on undecidability 


This is a part of Raymond Smullyan’s approach to understanding undecidability in propositional logic. It uses meta-information to show something must be true, though it cannot be proved in propositional logic. This is based on a paradox.

In propositional logic, a logical statement is undecidable if we cannot prove it true or false.
Given a propositional logic statement S, a proof is a sequence of formal logical deductions, starting from basic facts and ending by indicating if S is true or false. 

Smullyan’s starts with an island of Knights and Knaves.  Knights always tell the truth. Knaves always lie.  We cannot distinguish islanders otherwise.

There is a great logician named Ray.  Whatever Ray proves is true. This is just like a good theorem prover.

An islander Jack proclaims: “You cannot prove I am a Knight” to the logician Ray.

The next reasoning is based on meta-knowledge of this situation. This meta-knowledge shows that some problems are undecidable in propositional logic.

If Ray can prove Jack is a Knight, then Jack must be a Knave, since Jack must have lied. That is because Ray proved Jack is a Knight. Since Jack is a Knave, Ray’s proof contradicts the assumption that Ray only proves true things. So, this case cannot hold.

If Ray cannot prove Jack is a Knight, then Jack must be a Knight,  since Jack stated the truth. But Ray cannot prove the fact that Jack is a Knight. 

## Reference

The Mathematics of Various Entertaining Subjects: Research in Recreational Math Illustrated Edition, Jennifer Beineke (Editor), Jason Rosenhouse (Editor), Raymond M. Smullyan (Foreword), Princeton University Press, 2016.