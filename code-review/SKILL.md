---
name: code-review
description: Review an owned change against repository standards and its approved specification as two independent axes before Feature or Risky Bounded completion.
hide: true
license: MIT
metadata:
  adapted-from: .agents/skills/code-review/SKILL.md
  upstream-sha256: b4f17857c85ca60af1df7d0b623dd03c2a48419f6123e714f3d9748ca744a1bf
---

# Code review

Review the same owned change along two deliberately separate axes:

Adapted from `.agents/skills/code-review/SKILL.md` at pinned SHA-256 `b4f17857c85ca60af1df7d0b623dd03c2a48419f6123e714f3d9748ca744a1bf`; distributed under the folder-local MIT license.

- **Standards:** conformance to repository instructions and documented engineering standards; code-smell heuristics are advisory and repository rules override them.
- **Spec:** fidelity to the approved task, stories/AC, and architecture contracts, including missing behavior and unrequested scope.

Never merge, rerank, or let one axis mask the other.

## Required Review Input (C-SI-05)

Require all fields before review:

```text
baseline_revision
owned_changed_areas
task_card
stories_and_ac
architecture_contract
standards_sources
required_checks
```

For a Feature, baseline is the revision captured when execution began after G4. For Bounded work, use the revision before first write and record pre-existing dirty paths. Review only owned changes; never attribute unrelated working-tree changes to the task.

Resolve specification sources in this order: task card; approved stories/AC; approved architecture contract; linked real issue; user-provided spec. Repository instructions and contribution/coding documents are Standards sources. Missing a required baseline or spec source returns `blocked`; do not invent requirements or silently skip an axis.

## Execute the two axes

When subagents are available, dispatch Standards and Spec in parallel with separate context and the same fixed baseline/owned areas. When they are unavailable, run two isolated sequential passes: complete and record Standards first, clear that evaluative frame, then complete Spec. Sequential fallback never removes an axis.

### Standards pass

Report documented-standard violations with the rule source and affected location. Also report plausible smells as judgement calls: mysterious names, duplication, feature envy, data clumps, primitive obsession, repeated switches, shotgun surgery, divergent change, speculative generality, message chains, middle men, and refused bequest. Skip issues already enforced by tooling unless the actual diff still violates them.

### Spec pass

For each finding, cite the task/AC/contract source and affected location. Report missing or partial requirements, behavior outside approved scope, and implementation that appears inconsistent with the requirement.

## Review Output (C-SI-06)

```text
standards:
  findings[]
  verdict: pass | changes-required | blocked
spec:
  findings[]
  verdict: pass | changes-required | blocked
inputs_revision: exact revision of Review Input sources
execution_mode: parallel | sequential
unavailable_inputs[]
```

Each finding includes severity, source, changed location, observable risk, and concrete correction. Preserve both reports separately, including separate finding counts and worst finding per axis.

A material finding requires a fix followed by review of the affected axis, or an explicitly sourced accepted exception. Missing evidence, `blocked`, or an unresolved finding cannot become pass. This specialist does not merge, publish, update Jira, or mark work Done.
