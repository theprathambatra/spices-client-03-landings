# superpowers playbook (the build process for this contract)

**superpowers** is the process spine: brainstorm, write the spec, write the plan,
isolate the work, execute with subagents, verify, review, finish the branch. It
decides *how work moves*. It does not decide how the site looks or scrolls.

**Governing doc:** [`TASTE-SKILL.md`](TASTE-SKILL.md) for every design judgment.
Inside the flow: [`SCROLL-CRAFT.md`](SCROLL-CRAFT.md) supplies the scroll/hero
method and the ChatGPT asset pipeline, [`UNLAZY.md`](UNLAZY.md) supplies the
acceptance gates, [`CLAUDE-MEM.md`](CLAUDE-MEM.md) supplies cross-session memory,
[`../BUILD-BRIEF.md`](../BUILD-BRIEF.md) is the store and performance requirement.

Precedence (from `using-superpowers`): the user's explicit instructions and
CLAUDE.md > skills > default behaviour. If the user says "skip the questions",
brainstorming ends and the work proceeds.

---

## 0. What is installed and what runs at session start

| Thing | Where |
|---|---|
| Plugin `superpowers@superpowers-dev` 7.0.1 (project scope) | `~/.claude/plugins/cache/superpowers-dev/superpowers/7.0.1/` |
| Project copies of all 15 skills (byte-identical to plugin and `repos/superpowers`) | `.claude/skills/<skill>/` |

Skills: `using-superpowers`, `brainstorming`, `writing-plans`,
`subagent-driven-development`, `executing-plans`, `dispatching-parallel-agents`,
`using-git-worktrees`, `test-driven-development`, `systematic-debugging`,
`verification-before-completion`, `requesting-code-review`,
`receiving-code-review`, `finishing-a-development-branch`, `writing-skills`,
`diagnosing-superpowers`.

**SessionStart hook** (`hooks/hooks.json`, matcher `startup|clear|compact`): runs
`hooks/run-hook.cmd session-start`, a bash script that reads
`skills/using-superpowers/SKILL.md` and injects it as additional context ("You have
superpowers ... invoke relevant skills BEFORE any response"). No network, no
installs. Effect: from the next session on, Claude checks for a matching skill
before acting, and "let's build X" routes to brainstorming first.

Because the skills exist twice (project copy and plugin), the skill list shows
both `brainstorming` and `superpowers:brainstorming`. They are identical; either
name works. If you ever update one, update both (or delete the project copies and
rely on the plugin).

Do not mix planners: claude-mem also ships `make-plan` / `do`, and the ECC set
ships `plan`, `prp-plan`, `multi-plan` and others. For contract work, use the
superpowers chain end to end.

---

## 1. The contract build flow

```
session start ── using-superpowers injected; claude-mem injects past context
      │
      ▼
1 brainstorming ─────────► docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md   (approved by user)
      │                     + scroll-craft BRIEF.md / LAYERS.md for scroll pages
      ▼
2 writing-plans ─────────► docs/superpowers/plans/YYYY-MM-DD-<feature>.md        (reviewed by user)
      │                     + unlazy ledger .unlazy/<scope>/GATES.md (+ check scripts)
      ▼
3 using-git-worktrees ───► isolated branch/worktree, npm install, clean baseline
      │
      ▼
4 execute ── subagent-driven-development (fresh implementer + reviewer per task)
      │      or executing-plans (inline, one final reviewer)
      │      ledger: .superpowers/sdd/<plan-basename>/progress.md
      │      parallel fan-out only for independent domains: dispatching-parallel-agents
      ▼
5 verification-before-completion + unlazy --reverify + scroll-craft shoot + perf
      ▼
6 requesting-code-review (whole branch, most capable model) / receiving-code-review
      ▼
7 finishing-a-development-branch ─► merge locally | push + PR | keep as-is
```

Bug at any point: **systematic-debugging** first. Any logic code:
**test-driven-development**.

### Phase 1: brainstorming (spec)

- **Trigger:** "Let's build the v3 homepage", "I want a bundles section",
  "brainstorm the hero", or `/brainstorming`. Auto-fires before any creative work.
- **What happens:** Claude reads the relevant code and docs first (BUILD-BRIEF,
  SYNTHESIS, TASTE-SKILL.md), then asks **one question per message**, Socratic,
  in plain language; plays back each understood part in 200 to 300 words; lays out
  **two or three approaches in a message of their own** with a recommendation; sizes
  the work. It offers a **visual companion** (a browser tab with mockups) the first
  time something visual comes up.
- **For scroll pages**, the conversation also produces scroll-craft's Step 0 to 2
  artifacts: the eight-question `BRIEF.md`, journey, grammar, signature move,
  fingerprint check, feeling curve and score table (SCROLL-CRAFT.md §2). The spec
  links to them.
- **Output:** `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`, committed.
  Contents: intent and why; goals, non-goals, anti-goals; constraints (copy the
  BUILD-BRIEF hard rules and perf floor); approaches considered and the pick; the
  decided parts of the how; what is left to the builder.
- **Builder check:** for a project-sized spec, a fresh subagent reads the doc as
  the builder (`brainstorming/builder-check-prompt.md`) and lists questions; only
  the "theirs" pile comes back to the user, once.
- **Hard gate:** nothing is built (no code, scaffolding, installs) until the user
  approves the doc. A spike the user said yes to is allowed and stays throwaway.
- Visual companion files: `.superpowers/brainstorm/<session>/` (git-ignored).
  It needs the full `?key=` URL it prints.

### Phase 2: writing-plans (plan + gates)

- **Trigger:** automatically after the spec is approved, or "write the plan for
  docs/superpowers/specs/...".
- **Output:** `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` with the required header:
  Goal, Architecture, Tech Stack, **Spec** path, **Global Constraints** (exact values
  copied verbatim: previews on 531N, gate scripts on 5340 to 5399, never 5300 (main dev server), 5171 to 5175 or 5180; dpr clamps;
  one Lenis on `gsap.ticker`; no setState per frame; max 2 live WebGL contexts;
  perf floor avgFps ≥ 55, p95 ≤ 20ms, jank ≤ 2, no long task > 250ms; 390px with no
  horizontal scroll), and **Review Focus** (the five untested failure modes most
  likely to bite a shopper; for this site typically: Lenis/ScrollTrigger desync
  after a drawer opens, reduced motion, 360px phones, localStorage unavailable,
  WebGL unavailable or context lost).
- **Tasks** are right-sized (smallest unit with its own test cycle and a
  meaningful review), each with exact files, an **Interfaces** block (consumes /
  produces with exact names), and checkbox steps: failing test, run (expect FAIL),
  implement the signature, run (expect PASS), commit.
- **Add the unlazy layer here:** create `.unlazy/<scope>/GATES.md` from
  `templates/GATES.template.md`, write the `site/tools/gates/*.mjs` scripts, and
  name in each task which gate ids it must turn green. The plan is the argument;
  the gates are the proof.
- **Handoff:** Claude asks the user to review the plan and choose:
  **Subagent-driven** (fresh implementer and fresh reviewer per task; most
  thorough) or **Native** (Claude implements inline; one fresh reviewer at the end;
  cheapest). Recommendation for this contract: subagent-driven for a whole
  variation or the store; native for a small contained change.

### Phase 3: using-git-worktrees (isolation)

- Claude checks whether it is already in a worktree; if not, **asks consent**.
- In Claude Code it uses the **native `EnterWorktree` tool** (preferred; it owns
  placement, branch and cleanup). Fallback: `git worktree add .worktrees/<branch> -b <branch>`
  (`.worktrees/` is git-ignored).
- Setup for this repo: `cd site && npm install` inside the worktree (each worktree
  needs its own `node_modules`), then the baseline check.
- Never implement on `main` without explicit consent.
- Each worktree's preview servers need their own free ports (531N for previews, 5340 to 5399 for gate scripts); never 5300, 5171 to 5175 or 5180.

### Phase 4: execution

**subagent-driven-development** (recommended for multi-task plans)

- Setup: `bash .claude/skills/subagent-driven-development/scripts/sdd-workspace <plan>`
  prints the plan's workspace `.superpowers/sdd/<plan-basename>/` (self-ignored).
  The ledger `progress.md` starts `# SDD ledger — plan: <plan path>`. After a
  context compaction, the ledger and `git log` are the truth.
- **Pre-flight scan** before Task 1: a table of every pair of tasks that share a
  file or interface, and each task's self-consistency; rulings go in the ledger.
- Per task: record BASE (`git rev-parse HEAD`); `scripts/task-brief <plan> N`
  writes the brief file; dispatch **one** implementer (template
  `implementer-prompt.md`) with the brief path, interfaces from earlier tasks, and
  a report-file path; the implementer does TDD, commits, self-reviews, never
  spawns subagents; then `scripts/review-package <plan> BASE HEAD` writes the diff
  package and a **task reviewer** (`task-reviewer-prompt.md`) returns two verdicts:
  spec compliance and quality.
- **Fix loop:** spec fail or any Critical/Important finding: rounds 1 to 3 resume
  the same implementer, rounds 4 and 5 a fresh one on a stronger model; each round
  ends with a scoped re-review (`re-review-prompt.md`). After round 5 the
  controller adjudicates and records `Ruling:` lines. Minor findings are ledgered,
  never looped.
- **Model per seat, always explicit** (Claude Code `Agent` tool `model`):
  `haiku` for transcription-level tasks with complete code in the plan, `sonnet` as
  the floor for reviewers and prose-specified implementers, `opus` for
  architecture, R3F/shader judgment, round 4 to 5 fixes, and the **final
  whole-branch review**. An omitted model inherits the session's.
- **Never two implementers in parallel** inside one plan (they collide).
- **Runs continuously.** It stops only for: an irreversible or destructive
  operation, a security-sensitive action, an outside side effect (merge, push,
  publish), or a plan so broken every path is a guess. Everything else is a
  recorded `Ruling: <decision> — <why> — <cost if wrong>`, reported at the end
  under "Rulings I made".
- Cheaper variant (opt-in, Claude Code only): dispatch one orchestrator subagent
  on `sonnet` to run the whole SDD loop one layer down; it must return the
  "Rulings I made" list verbatim.

**executing-plans** (inline / "Native")

- Same workspace and ledger format (executors can switch mid-plan).
- `.claude/skills/executing-plans/scripts/task-start <plan> N` prints the brief and BASE;
  work the steps under TDD; `scripts/task-done <plan> N <BASE> -- <test command>`
  runs the tests and appends the ledger line only if they pass.
- One fresh reviewer (most capable model) over the whole branch at the end, one
  fix pass with RED to GREEN tests per finding.

**dispatching-parallel-agents** (independent domains only)

- Use when two or more problems share no files or state: e.g. five variations,
  each owning `site/vN/**` (the BUILD-BRIEF already isolates builders this way),
  or three unrelated failures. Put **all Agent calls in one message** so they run
  concurrently; each prompt is self-contained (scope, goal, constraints, expected
  return); afterwards check for conflicts and run the full verification.
- For parallel *builds*, wrap it in unlazy orchestrated mode: `OWNS:` leases per
  leaf, a dispatch wave (open, start each handle, seal before reading results),
  parent `--reverify` per return (UNLAZY.md §4). Inside each leaf, the builder
  still follows its own plan sequentially.

### Phase 5: verification-before-completion

- Iron law: **no completion claim without fresh evidence from this message.**
  Identify the command that proves the claim, run it fully, read the output and
  exit code, then claim (with the evidence) or report the real state.
- For this project the proving commands are:
  `node .claude/skills/unlazy/scripts/gate-check.mjs --scope <scope> --reverify`,
  the scroll-craft harness (`shoot.mjs` desktop / mobile / reduced, then read
  `sheet.png`), `TASTE_BASE=http://localhost:531N node site/tools/taste.mjs check vN` (must print `VERDICT vN: 0 FAIL`), and the perf gate on a production
  preview. An agent's "success" report is not evidence: check the diff.

### Phase 6: code review

- **requesting-code-review:** dispatch a reviewer with
  `requesting-code-review/code-reviewer.md`, filled with what was built, the
  plan/spec path, BASE and HEAD SHAs (or the review-package file). Mandatory after
  each SDD task (built in), after a major feature, and before merge. The reviewer
  is read-only, never spawns reviewers, lists what it **declined to judge**, and
  returns Strengths, Critical / Important / Minor issues with file:line, and a
  merge verdict.
- **receiving-code-review:** read all feedback, restate it, verify against the
  code, then act one item at a time with tests. No performative agreement ("You're
  absolutely right", "Great point", thanks); push back with technical reasons when
  a suggestion is wrong for this stack; YAGNI check on "do it properly" suggestions;
  ask before implementing anything unclear.

### Phase 7: finishing-a-development-branch

- Runs the full test suite first; red means stop.
- Detects normal repo vs worktree, confirms the base branch, then presents
  **exactly**: 1) merge back to `<base>` locally, 2) push and create a PR,
  3) keep the branch as-is. Discard only on an explicit request plus the typed
  word `discard`.
- Worktrees under `.worktrees/` are cleaned up after a merge; a PR keeps the worktree.

### Anytime

- **systematic-debugging:** four phases (root cause, pattern, single hypothesis,
  fix with a failing test). Three failed fixes means stop and question the
  architecture with the user. Use for jank, WebGL errors, Lenis/ScrollTrigger
  desyncs, build failures.
- **test-driven-development:** no production code without a failing test first.
  Applies fully to store logic (cart, coupon `FIRST10`, size-based pricing, filters,
  sort, free-shipping threshold, localStorage persistence). For visual and 3D work
  the "failing test" is the gate script (UNLAZY.md) that fails before the feature exists.
- **writing-skills:** if we turn a repeated workflow (e.g. the ChatGPT image
  pipeline) into a project skill, write it test-first with pressure scenarios.
- **diagnosing-superpowers:** "why did that session redo work / cost so much?";
  writes to `~/.superpowers/diagnosing-superpowers/<session-id>/`.

---

## 2. Trigger phrases and commands

| Skill | Say | Or invoke |
|---|---|---|
| brainstorming | "Let's build ...", "I want to add ...", "brainstorm ..." | `/brainstorming` or `/superpowers:brainstorming` |
| writing-plans | "Write the implementation plan for <spec path>" | `/writing-plans` |
| subagent-driven-development | "Execute the plan with subagents" / choose **Subagent-driven** at handoff | `/subagent-driven-development` |
| executing-plans | "Execute the plan inline" / choose **Native** | `/executing-plans` |
| dispatching-parallel-agents | "Investigate these independently in parallel" | `/dispatching-parallel-agents` |
| using-git-worktrees | "Set up an isolated worktree for this" | `/using-git-worktrees` |
| test-driven-development | auto before implementing; "TDD this" | `/test-driven-development` |
| systematic-debugging | "This is broken / failing / janky" | `/systematic-debugging` |
| verification-before-completion | auto before any "done"; "verify before you claim it" | `/verification-before-completion` |
| requesting-code-review | "Review this branch / this task" | `/requesting-code-review` |
| receiving-code-review | paste review feedback | `/receiving-code-review` |
| finishing-a-development-branch | "We're done, wrap up the branch" | `/finishing-a-development-branch` |
| writing-skills | "Make this a skill" | `/writing-skills` |
| diagnosing-superpowers | "Why did that session go wrong?" | `/diagnosing-superpowers` |

Composite kick-off for a variation (copy and adapt):

> Use superpowers. Brainstorm the v3 homepage with me (hero + bestsellers + shop),
> using scroll-craft for the journey and layered hero, TASTE-SKILL.md as the
> governing design doc, and BUILD-BRIEF.md for store and perf requirements. After
> I approve the spec, write the plan with unlazy gates, then execute it
> subagent-driven in a worktree.

---

## 3. Where everything goes

| Artifact | Path | In git? |
|---|---|---|
| Design spec | `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` | yes |
| Implementation plan | `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` | yes |
| Scroll brief / layer contract | `scrollcraft/builds/kesari-vN/BRIEF.md`, `LAYERS.md` | yes |
| Shot list (every image prompt + asset spec) | `.taste-skill/vN/shot-list.md` | per TASTE-SKILL.md |
| Raw generated images | `scrollcraft/builds/<build>/out/` | no (back up) |
| Delivery images | `site/public/vN/img/` (served at `/vN/img/`) | yes |
| Gate ledger(s) | `.unlazy/<scope>/` | no |
| Gate check scripts | `site/tools/gates/*.mjs` | yes |
| SDD/inline ledger, briefs, reports, review packages | `.superpowers/sdd/<plan-basename>/` | no (deleted after a clean final review) |
| Visual companion mockups | `.superpowers/brainstorm/<session>/` | no |
| Worktrees (fallback) | `.worktrees/<branch>/` | no |
| Harness screenshots | `scrollcraft/lab/` | no |
| Session diagnostics | `~/.superpowers/diagnosing-superpowers/<session-id>/` | n/a |

`.gitignore` already covers `.unlazy/`, `.superpowers/`, `.worktrees/`,
`scrollcraft/lab/`, `scrollcraft/builds/*/out/`.

---

## 4. Gaps to close before the first full run (user decisions)

1. **No test runner.** `site/package.json` has `"test": "echo \"Error: no test specified\" && exit 1"`.
   TDD, `task-done`, and `finishing-a-development-branch` all run the suite. Proposal
   (needs your OK, since builders are told not to touch `package.json`): add
   `vitest` for store logic and make `npm test` run vitest plus the gate scripts.
2. **Commits.** superpowers plans commit after every task on the feature branch.
   Approving a plan for execution is taken as approval for those branch commits;
   merges and pushes still go through the finishing menu.
3. **Playwright browser.** The site's Playwright 1.47.2 bundled Chromium is not
   downloaded; `site/tools/shot.mjs`, `perf.mjs`, `audit.mjs` fail to launch until
   `cd site && npx playwright install chromium` is run, or their `launch()` calls get
   `channel: 'chrome'` (installed Chrome).
4. **Restart Claude Code** in this project so the newly installed plugins' hooks
   and MCP server load.
