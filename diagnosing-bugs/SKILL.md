---
name: diagnosing-bugs
description: Diagnose bugs and performance regressions whose root cause is not yet supported by evidence; return a structured Diagnosis Packet before a Bounded proposal.
hide: true
license: MIT
metadata:
  adapted-from: .agents/skills/diagnosing-bugs/SKILL.md
  upstream-sha256: dcaaa3eb81195329f65f27574d9a67dc776160dd2e4d7798d1afb1e4a5f3695a
---

# Diagnosing bugs

A specialist for unclear bug, regression, and performance root causes. The user-reported symptom is ground truth: reproduction sharpens the feedback loop and never disproves the report.

Adapted from `.agents/skills/diagnosing-bugs/SKILL.md` at pinned SHA-256 `dcaaa3eb81195329f65f27574d9a67dc776160dd2e4d7798d1afb1e4a5f3695a`; distributed under the folder-local MIT license.

## Trigger and boundary

Run only when root cause is uncertain. Skip this specialist when the root cause and supporting evidence are already clear; the parent may prepare the normal Bounded proposal.

Before Bounded approval, work is diagnostic only:

- MAY read source and run existing tests, applications, CLIs, debuggers, or browsers.
- MAY create a throwaway harness outside permanent product source, tests, and configuration.
- MUST NOT create or modify permanent source, tests, configuration, dependencies, or migrations.
- MUST redact secrets and sensitive captured data. Keep credentials in environment variables.

After approval, hand the reproduction and regression seam to `task-execution`; that workflow owns permanent tests and the fix.

## 1. Build a red-capable feedback loop

Prefer, in order: an existing focused test, HTTP/CLI exercise, browser scenario, trace replay, throwaway harness, property/fuzz loop, bisection/differential loop, then [`scripts/hitl-loop.template.sh`](scripts/hitl-loop.template.sh).

The loop must assert the exact reported symptom, be deterministic or have a measured high reproduction rate, run as quickly as practical, and be agent-runnable. Show the command/scenario and observed red result. A bare “did not crash” check is insufficient.

If no red-capable loop can be built, stop diagnosis as `blocked`. Record attempts and the missing environment or redacted artifact. Do not promote a hypothesis to root cause.

## 2. Reproduce and minimise

Run the loop and capture the exact symptom. Remove inputs, callers, configuration, data, and steps one at a time until every remaining element is load-bearing. A nearby failure is not evidence for the reported bug.

For nondeterministic bugs, raise and record the reproduction rate. For performance regressions, establish a measured baseline before changing code.

## 3. Test hypotheses

Generate 3–5 ranked, falsifiable hypotheses. For each, state the observation that would confirm or reject it. Prefer debugger/REPL inspection, then targeted uniquely tagged logs. Change one variable at a time; never “log everything and search later.”

Root cause is `confirmed` only when a probe distinguishes it from the alternatives and the evidence explains the symptom. Otherwise return `unknown` or `blocked`.

## 4. Identify the regression seam

Name the interface where a post-approval regression test can observe the real failure pattern. If no correct seam exists, record that architecture limitation; do not add a shallow test that cannot fail for the reported bug.

## Diagnosis Packet (C-SI-03)

Return every field:

```text
status: confirmed | unknown | blocked
symptom: exact user-reported observable failure
tight_loop: command/scenario and observed result
evidence: redacted observations that distinguish hypotheses
root_cause: evidence-backed cause, or unknown
affected_symbols: files/symbols implicated by evidence
regression_seam: observable interface for a post-approval test, or missing
remaining_uncertainty: open hypotheses, missing access, and limits
```

`unknown` and `blocked` are not sufficient to present a root cause as fact or request approval for a claimed fix. The parent may ask for the specific missing artifact or continue read-only diagnosis.

## Post-approval handoff

`task-execution` converts the minimised reproduction into a regression test only at the correct seam, observes it fail, applies the approved fix, observes it pass, reruns the original loop, and removes temporary instrumentation and harnesses.