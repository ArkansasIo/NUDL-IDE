# Noodle Logic Algorithm Catalog

This catalog defines the logic-algorithm families targeted by the Noodle research corpus. It is intentionally comprehensive by major algorithmic family rather than claiming to enumerate every published algorithm.

## A. Boolean and propositional logic

- truth-table evaluation
- Boolean simplification
- De Morgan transformations
- implication elimination
- biconditional elimination
- negation normal form (NNF)
- conjunctive normal form (CNF)
- disjunctive normal form (DNF)
- Shannon expansion
- Boolean derivative
- Quine-McCluskey minimization
- Karnaugh-map minimization
- Tseitin transformation

## B. SAT and constraint solving

- DPLL
- CDCL
- unit propagation
- pure-literal elimination
- watched literals
- clause learning
- non-chronological backtracking
- VSIDS-style branching
- conflict analysis
- cardinality constraints
- pseudo-Boolean constraints
- SMT-style theory separation

## C. Deductive inference

- modus ponens
- modus tollens
- hypothetical syllogism
- disjunctive syllogism
- resolution
- forward chaining
- backward chaining
- proof by contradiction
- proof by cases
- natural deduction
- sequent-style reasoning
- Horn-clause inference

## D. First-order logic

- term matching
- first-order unification
- Robinson unification
- occurs check
- substitution
- Skolemization
- Herbrand expansion
- resolution refutation
- equality reasoning
- congruence closure

## E. Logic programming

- SLD resolution
- Prolog-style depth-first search
- breadth-first proof search
- backtracking
- tabling/memoization
- constraint logic programming

## F. Automated theorem proving

- resolution theorem proving
- semantic tableaux
- natural-deduction proof search
- term rewriting
- completion procedures
- rewriting with critical pairs
- superposition
- congruence closure
- proof certificates

## G. Temporal, modal, and state logic

- Kripke-model evaluation
- modal reachability
- CTL model checking
- LTL model checking
- Büchi-automaton-based LTL checking
- temporal fixed-point evaluation
- state-transition exploration

## H. Description and knowledge logic

- concept subsumption
- classification
- tableau reasoning
- rule-based inference
- forward-chaining knowledge bases
- backward-chaining queries
- truth-maintenance systems

## I. Graph and relational logic

- graph reachability
- transitive closure
- Warshall/Floyd-Warshall closure
- strongly connected components
- dependency analysis
- constraint propagation
- graph coloring constraints

## J. Decision procedures

- equality reasoning
- interval reasoning
- linear arithmetic
- integer constraint reasoning
- finite-domain constraint propagation
- Presburger-arithmetic research track
- type inhabitation
- finite-state verification

## K. Probabilistic and fuzzy logic

- Bayesian inference
- belief propagation
- variable elimination
- fuzzy membership evaluation
- fuzzy rule aggregation
- probabilistic model checking

These require explicit numerical semantics and must not be confused with classical Boolean truth.

## Noodle research rule

Each algorithm is represented by:

1. a mathematical definition
2. a Noodle implementation or interface
3. test propositions
4. expected result
5. complexity analysis
6. correctness invariant
7. comparison implementation where useful
8. benchmark specification
9. limitations

No algorithm is marked implemented merely because an interface exists.
