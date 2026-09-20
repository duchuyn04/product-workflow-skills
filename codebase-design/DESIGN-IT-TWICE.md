# Design It Twice

Use this pattern when a chosen candidate genuinely needs alternative interfaces. It uses [SKILL.md](SKILL.md) vocabulary and the dependency categories in [DEEPENING.md](DEEPENING.md).

## Frame the problem

State the constraints every interface must satisfy, dependencies and their categories, callers, invariants, errors, and a small illustrative sketch. The sketch grounds the problem; it is not a preferred solution.

## Generate distinct designs

When subagents are available, run at least three independent briefs in parallel. Otherwise perform three isolated passes sequentially without carrying a preferred design forward:

1. Minimize the interface to 1–3 high-leverage entry points.
2. Maximize justified flexibility for known use cases.
3. Optimize the common caller so its default path is trivial.
4. When remote/external dependencies require it, explore ports and adapters.

Each proposal must include the full interface, a caller example, hidden implementation, dependency/adapters strategy, invariants and errors, and trade-offs in depth, locality, and seam placement.

## Compare and recommend

Present proposals separately before comparing them. Reject speculative seams and shallow pass-through layers. Recommend one design or a specific hybrid based on interface depth, locality, caller impact, test surface, and approved scope. The comparison is input to the parent G3 or Bounded decision, not an independent gate.
