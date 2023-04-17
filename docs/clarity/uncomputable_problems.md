## Intuition on uncomputability

Intuitively, uncomputability is an algorithmic view of undecidability.  Uncomputability has the same foundations as undecidability. Undecidable questions are framed as logic statements or statements about integers.  Of course, programs are logic statements and may even be viewed as integers. Though, we view programs differently. We often view programs with additional details of memory models, implementation details, and execution semantics.

The Halting problem: As an example, given any program P and any finite input I for P, then the Halting Problem is the challenge of determining if P halts on input I.
Alonzo Church and Alan Turing showed the Halting Problem is unsolvable.

Christopher Strachey gave an intuitive proof-by-contradiction showing the Halting problem is uncomputable. This is set up by supposing there is a program H that can solve the Halting problem for any program P.  H(P) returns true if P halts and false otherwise. Then build a program P that does not halt when H(P) is true, giving a contradiction. Similarly, this program P halts when H(P) is false, also a contradiction.

Uncomputable problems take many forms. Emil Post gave what is not called the Post correspondence problem. At first glance, most developers try a direct solution of the correspondence problem using indeterminate loops, rather than recursion.

Post’s correspondence problem: Consider n pairs of strings P from UTF8 (or any alphabet with at least two symbols), 


P =  { (x1, y1), (x2, y2), … , (xn, yn) }


and an integer m > 0.  Is there  a list of, possibly repeated, indices i1, i2, …, im,  so that


x(i1) x(i2) … x(im) = y(i1) y(i2)  … y(im) ?


Post’s correspondence problem is uncomputable.

It turns out, many questions about how programs behave are uncomputable. This has a number of consequences for smart contracts that are built in Turing complete languages.