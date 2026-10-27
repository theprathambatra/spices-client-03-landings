# Gates: <vN> <feature, e.g. homepage hero + product grid>

OWNS: site/<vN>/**, site/tools/gates/<vN>-*.mjs

Scope: <one sentence: the complete deliverable a real customer would notice, e.g. the vN homepage opens on a layered readable hero and a shoppable product grid on desktop and phone>

- [ ] G0: this ledger states outcomes that can fail
  CHECK: node .claude/skills/unlazy/scripts/gate-lint.mjs .unlazy/<scope>/GATES.md
  EXPECT: LINT OK
  EVIDENCE: pending

- [ ] G1: <vN> production build compiles with no errors
  CHECK: PAGE=<vN> npx vite build --outDir /tmp/gates-<vN> --emptyOutDir
  EXPECT: /built in \d/
  CWD: site
  EVIDENCE: pending

- [ ] G2: <observable outcome read from the rendered page, e.g. hero shows the full h1 in at most two lines and the Shop CTA inside the first viewport at desktop and phone sizes, with no console errors>
  CHECK: node tools/gates/<vN>-<what>.mjs
  EXPECT: <what> verification passed
  CWD: site
  EVIDENCE: pending

- [ ] G3: <next observable outcome, one per gate>
  CHECK: node tools/gates/<vN>-<what>.mjs
  EXPECT: <what> verification passed
  CWD: site
  EVIDENCE: pending

- [ ] G4: no horizontal overflow at phone and desktop widths
  CHECK: node tools/gates/<vN>-overflow.mjs
  EXPECT: overflow verification passed
  CWD: site
  EVIDENCE: pending

- [ ] G5: production preview meets the BUILD-BRIEF perf floor on desktop and mobile
  CHECK: node tools/gates/<vN>-perf.mjs
  EXPECT: perf verification passed
  CWD: site
  EVIDENCE: pending

- [ ] G6: the taste-skill gate (lint + inspector on the production preview) reports zero undeclared FAIL findings for this variation
  CHECK: node tools/gates/<vN>-taste.mjs
  EXPECT: taste verification passed
  CWD: site
  EVIDENCE: pending

- [ ] G7: <manual outcome no command can decide, e.g. art direction passes the TASTE-SKILL.md look-and-fix review on the desktop and phone contact sheets>
  EVIDENCE: pending

<!--
HOW TO USE (full guide: docs/playbook/UNLAZY.md)

1. Copy to .unlazy/<scope>/GATES.md, scope = <vN>-<feature> (e.g. v3-hero-grid).
   .unlazy/ is git-ignored on purpose (machine-specific state).
2. Replace every <placeholder>. Delete gates that do not apply; add one gate per
   independently required outcome in the request.
3. Write the check scripts in site/tools/gates/ BEFORE building. Each one:
   asserts everything, exits 1 on any failure, prints its success marker LAST
   and only on success, builds and serves its own preview on a free port in
   5340-5399, and kills that server in a finally block.
4. From the repo root:
     UL=.claude/skills/unlazy/scripts
     node $UL/gate-lint.mjs .unlazy/<scope>/GATES.md          # fix every error
     node $UL/gate-check.mjs --scope <scope> --status          # parse only, runs nothing
     node $UL/gate-check.mjs --scope <scope> --approve         # after reading every CHECK and script
     node $UL/gate-check.mjs --scope <scope>                   # run unmet gates
     node $UL/gate-check.mjs --scope <scope> --reverify        # before ANY completion claim
5. Negative control: break the thing a gate guards once (e.g. comment out the
   add-to-cart handler), confirm the gate FAILS, restore, confirm it passes.
   Record that in the gate's manual review or the final report.
6. Manual gates: record exact evidence (screenshot paths, reviewer, verdict)
   on the EVIDENCE line, then tick the box yourself.
7. Impossible gate: keep it and add this line at column 1 (outside any fence):

```text
ABANDON: G<n> <reason and who owns the handoff>
```

   An abandoned gate is a handoff, never completion.

Strict format: unique ids; CHECK/EXPECT/CWD/EVIDENCE indented under their gate;
runnable gates need both CHECK and EXPECT, manual gates neither; EXPECT is a
substring or /regex/; OWNS paths are repo-relative globs with no "..".
-->
