---
name: commit
disable-model-invocation: true
description: >-
  Draft a git commit title and description from the current changes, then show a
  GUI selector to Approve, Deny, or Edit before committing. Use when the user
  runs /commit, asks to commit with a GUI approval step, or wants a proposed
  commit message reviewed before git commit.
---

# /commit

Create a commit only after the user Approves the draft in the GUI selector.

Invoking `/commit` is explicit permission to stage and commit **after Approve**. Do not commit on Deny. Do not commit a draft the user has not Approved.

## 1. Inspect

Run in parallel:

```bash
git status
git diff
git diff --cached
git log -8 --oneline
git rev-parse --abbrev-ref HEAD
```

If there is nothing to commit, stop and say so.

Never stage secrets (`.env`, credentials, keys). If a secret would be included, stop and ask. Do not use `git add -i`. Do not skip hooks (`--no-verify`, `--no-gpg-sign`). Do not amend unless the user explicitly asked to amend **and** the amend rules in the user git protocol are all met.

## 2. Draft

Write a **title** (one line, imperative, focus on why) and a **description** (1–2 sentences on why, not a file list). Match recent `git log` style.

Show both in the chat.

## 3. GUI selector (required)

Use the AskQuestion tool. Do not use a numbered list in chat as a substitute.

- Prompt: include the proposed title. Mention that the full description is in the chat.
- Options (exactly these labels):
  - `Approve` — stage relevant files and commit this title and description
  - `Deny` — do not commit
  - `Edit` — I will send a revised title and description

If **Deny**: stop. Do not stage or commit.

If **Edit**: wait for the revised title and description (AskQuestion Other text or a follow-up message). Replace the draft. Show the same GUI selector again. Repeat until Approve or Deny.

If **Approve**: continue.

## 4. Commit

Stage only the intended files (not `.env`). Commit with HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
Title here.

Description here.

EOF
)"
```

Then `git status` to confirm. Report the new commit short hash and subject. Do not push unless the user also asked to push or invoked `/pr`.
