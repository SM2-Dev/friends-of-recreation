---
name: pr
disable-model-invocation: true
description: >-
  Draft a pull request title and description from the branch commits, then show
  a GUI selector to Approve, Deny, or Edit before opening a PR into the dev
  branch. Use when the user runs /pr, asks to open a pull request to dev, or
  wants a proposed PR reviewed in a GUI before gh pr create.
---

# /pr

Open a pull request **into `dev`** only after the user Approves the draft in the GUI selector.

Invoking `/pr` is explicit permission to push the current branch and run `gh pr create --base dev` **after Approve**. Do not create a PR on Deny.

## Target

Base branch is always `dev`. Head is the current feature branch.

## 1. Inspect

Run in parallel:

```bash
git status
git remote -v
git rev-parse --abbrev-ref HEAD
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true
git log -8 --oneline
git log origin/dev..HEAD 2>/dev/null || git log dev..HEAD 2>/dev/null || true
git diff origin/dev...HEAD 2>/dev/null || git diff dev...HEAD 2>/dev/null || true
```

Use `gh` for all GitHub work.

Stop if:

- The working tree has uncommitted changes the PR should include — tell the user to run `/commit` first (or confirm they want the PR without those files).
- `HEAD` is `dev` and there is nothing unique to propose.

### Missing `dev`

If `origin/dev` (or local `dev`) does not exist, stop and say a `dev` branch is required as the PR base. Do not invent a different base.

### Branch for the PR

Do not open a PR whose head is `dev`. If `HEAD` is `main` or `dev`, create a feature branch from current `HEAD` named from the primary commit subject (lowercase, hyphens), check it out, then continue. Do not otherwise rename an existing feature branch.

If a PR for this head into `dev` already exists, return that URL and stop.

## 2. Draft

Summarize **all** commits that will land on `dev` (`git log origin/dev..HEAD`), not only the latest commit.

Title: one line, imperative, why-focused.

Body:

```markdown
## Summary
- <1-3 bullets covering why and scope>

## Test plan
- [ ] <concrete checks>
```

Show title and body in the chat.

## 3. GUI selector (required)

Use the AskQuestion tool. Do not use a numbered list in chat as a substitute.

- Prompt: include the proposed PR title and that the base is `dev`. Mention that the full description is in the chat.
- Options (exactly these labels):
  - `Approve` — push this branch and create the PR into `dev`
  - `Deny` — do not create a PR
  - `Edit` — I will send a revised title and description

If **Deny**: stop. Do not push for the PR and do not run `gh pr create`.

If **Edit**: wait for the revised title and description (AskQuestion Other text or a follow-up message). Replace the draft. Show the same GUI selector again. Repeat until Approve or Deny.

If **Approve**: continue.

## 4. Create the PR

Push if needed (`git push -u origin HEAD`). Never force-push. Never skip hooks.

```bash
gh pr create --base dev --title "the pr title" --body "$(cat <<'EOF'
## Summary
- …

## Test plan
- [ ] …

EOF
)"
```

Return the PR URL. Do not merge.