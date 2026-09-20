#!/usr/bin/env bash
# Human-in-the-loop reproduction loop.
# Copy this file to a throwaway location, edit the steps below, and run it.
# Before Bounded approval, do not place the copy in permanent product source,
# tests, or configuration. Capture observations only; never capture secrets.
#
# Usage: bash hitl-loop.template.sh

set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [Enter when done] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

# --- edit below ---------------------------------------------------------

step "Perform the smallest action that triggers the reported symptom."
capture REPRODUCED "Did the exact reported symptom occur? (y/n)"
capture OBSERVATION "Describe the observable result without credentials or sensitive data:"

# --- edit above ---------------------------------------------------------

printf '\n--- Captured ---\n'
printf 'REPRODUCED=%s\n' "$REPRODUCED"
printf 'OBSERVATION=%s\n' "$OBSERVATION"
