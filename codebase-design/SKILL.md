---
name: codebase-design
description: Apply deep-module vocabulary when a change affects a module, interface, seam, adapter, dependency direction, or testability; return a Design Delta for the parent workflow.
hide: true
license: MIT
metadata:
  adapted-from: .agents/skills/codebase-design/SKILL.md
  upstream-sha256: caea3cb8a8281ff829fd1a2b985044e77601b62f301adf43f689ccfc74c15f6f
---

# Codebase design

Design deep modules: substantial behavior behind a small interface, placed at a clean seam and tested through that interface. This skill supplies a design lens, not a new approval gate.

Adapted from `.agents/skills/codebase-design/SKILL.md` at pinned SHA-256 `caea3cb8a8281ff829fd1a2b985044e77601b62f301adf43f689ccfc74c15f6f`; distributed under the folder-local MIT license.

## Trigger and skip

Use when the proposed change affects a module, its interface or invariants, seam placement, adapters, dependency direction, or test surface. Skip for a local implementation change that leaves those properties unchanged. `not-needed` is a valid result.

The parent retains authority: G3 for a Feature, or the Bounded approval for an existing flow. This specialist cannot approve either.

## Vocabulary

- **Module:** anything with an interface and implementation; scale-agnostic.
- **Interface:** everything a caller must know: types, invariants, ordering, errors, configuration, and performance characteristics.
- **Implementation:** behavior hidden inside a module.
- **Seam:** a place where behavior can change without editing the caller; the location of an interface.
- **Adapter:** a concrete participant that satisfies an interface at a seam.
- **Depth:** leverage at the interface: substantial behavior for little caller knowledge.
- **Leverage:** capability callers gain per unit of interface learned.
- **Locality:** change, bugs, knowledge, and verification concentrated behind the interface.

Use these terms consistently; do not substitute vague “service”, “component”, or “boundary” when the precise term matters.

## Evaluation

1. Identify callers and the facts they must know today.
2. State the smallest honest interface and its invariants/error modes.
3. Place the seam where behavior or dependency genuinely varies.
4. Keep dependencies and complexity behind that interface.
5. Use the same interface as the observable test surface.
6. Apply the deletion test: deleting a useful module should redistribute real complexity to callers, not make it vanish.

A single implementation without real variation does not justify a seam or adapter. Do not add indirection solely for hypothetical reuse or testing. Internal seams may support the implementation without becoming public interface.

For dependency categories and replace-don't-layer tests, read [DEEPENING.md](DEEPENING.md). For materially different interface alternatives, read [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md).

## Unavailable evidence

If required callers, dependencies, or contracts cannot be inspected, do not emit a completed Design Delta or an approval-ready conclusion. Return a separate handoff with `status: unknown | blocked`, the unavailable evidence/tool, attempts made, affected fields, and the person or access that can resolve it. The parent remains blocked for the dependent design work.

## Design Delta (C-SI-04)

Return every field:

```text
status: not-needed | drafted | approved-input | needs-revalidation
module: responsibility and excluded responsibility
interface: caller-visible operations, invariants, ordering, errors, configuration, and performance facts
seam: placement and why behavior varies there
adapters: existing/required concrete participants, or none with reason
invariants: properties the module must preserve
caller_impact: callers and migration/cutover effects
test_surface: observable behavior exercised through the interface
rejected_abstractions: options rejected as shallow, hypothetical, or scope creep
```

`approved-input` means the parent gate has approved the containing design; this skill never self-approves. Contract changes after approval return `needs-revalidation`.
