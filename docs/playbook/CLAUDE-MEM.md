# claude-mem playbook (memory across sessions)

**claude-mem** records what Claude does in this project (every Read, Edit, Bash,
Grep...), compresses it into short *observations*, summarizes each session, and
injects the relevant past into the next session. For a multi-week contract with
five variations, many subagents and repeated perf passes, that means the next
session starts knowing what was decided, what broke and why.

**Governing doc:** [`TASTE-SKILL.md`](TASTE-SKILL.md) for design; memory never
overrides it. Related: [`SUPERPOWERS.md`](SUPERPOWERS.md) (process),
[`UNLAZY.md`](UNLAZY.md) (gates).

---

## 0. Status on this machine (checked 2026-10-24)

| Check | Result |
|---|---|
| Plugin | `claude-mem@thedotmack` 15.0.1, project scope, files at `~/.claude/plugins/cache/thedotmack/claude-mem/15.0.1/`; all runtime deps present |
| Hook launcher | `~/.local/bin/claude-mem` (compiled with Bun, protocol 1), on PATH |
| Runtimes | bun 1.4.3 (`~/.bun/bin/bun`), uv/uvx 0.13.1 (`~/.local/bin`, runs the Chroma vector DB), node 24.22 (nvm) |
| Worker | v15.0.1 healthy on `http://127.0.0.1:37701` (`/api/health` ok, MCP ready), Chroma subprocess running |
| Viewer | `http://127.0.0.1:37701/viewer` (memory, sessions, settings); `http://127.0.0.1:37701/` (My Work) |
| Data | `~/.claude-mem/` (SQLite `claude-mem.db`, Chroma index, logs, `settings.json`). Shared by every project on this Mac |
| This project | 0 observations so far (the database holds other client projects) |

### Two things stop new memories right now (user action)

1. **Quota guard is on.** `~/.claude-mem/quota-cooldown.json`: "Memory capture
   paused: weekly Claude usage is 99.0%, at or above the 93% pause threshold."
   Compression runs on your own Claude subscription (Claude Code OAuth, model
   `claude-haiku-4-5`), and claude-mem pauses itself at
   `CLAUDE_MEM_QUOTA_THRESHOLD_SEVEN_DAY = 0.93` to protect interactive use. It
   resumes when the weekly window drops below the threshold.
2. **The observer was signed out.** `~/.claude-mem/observer-health.json`:
   5 consecutive failures, "401 OAuth access token has expired", action "Run
   /login in Claude Code (or `claude auth login` in a terminal)". A worker restart
   at 16:14 discarded 19 buffered messages from another session.

To get capture working: run `claude auth login` (or `/login`) once. Optionally,
to stop memory from competing with your Claude quota, give claude-mem its own
provider in the viewer settings or `~/.claude-mem/settings.json`
(`CLAUDE_MEM_PROVIDER` gemini or openrouter, with `CLAUDE_MEM_GEMINI_API_KEY` /
`CLAUDE_MEM_OPENROUTER_API_KEY`). Search, timeline and context injection of
*existing* memories work regardless; only new compression is paused.

Then **restart Claude Code in this project** so the plugin's hooks and its
`mcp-search` MCP server load.

---

## 1. What runs, and when (`hooks/hooks.json`)

| Event | Command | What it does |
|---|---|---|
| Setup (`claude --init` / maintenance) | `node scripts/version-check.js` | dependency and version check; finds the newest installed plugin version |
| SessionStart (startup, resume, clear, compact), async | `claude-mem start` | starts the worker if it is not running |
| SessionStart (startup, clear, compact) | `claude-mem hook claude-code context` | **injects past context**: last session summary, recent sessions (10), observations (up to 50) for this project |
| SessionStart (startup) | `node scripts/ensure-launcher.cjs` | self-heal: if the launcher is missing it compiles it with Bun into `~/.local/bin/claude-mem` (and, only if `~/.local/bin` is not already on PATH, appends it to `~/.zshrc`); prints a system message if hooks cannot run. Here the launcher is current, so it is a no-op |
| UserPromptSubmit | `claude-mem hook claude-code session-init` | opens/updates the session record |
| PreToolUse (Read, Bash, Grep, Glob, memory search) | `claude-mem hook claude-code file-context` | **injects what memory knows about the file** you are about to read |
| PostToolUse / PostToolUseFailure, async | `claude-mem hook claude-code observation` | queues the tool call for compression into an observation |
| Stop, async | `claude-mem hook claude-code summarize` | summarizes the session so far |
| SessionEnd, async | `claude-mem hook claude-code session-end` | closes the session |

Also loaded: MCP server `mcp-search` (node, `scripts/mcp-server.cjs`), giving
Claude the memory tools below. Current settings worth knowing: mode `code`
(English), context `50` observations / `10` sessions, injection for the main agent
only, subagent observations **captured** (SDD implementers' work is remembered),
Chroma semantic search on, folder CLAUDE.md generation **off**.

---

## 2. What it gives this project

- **Warm starts.** Session two onward opens with what happened before: "v3 perf
  pass cut particles to 60k; Bloom dropped on mobile; jank came from
  MeshTransmissionMaterial". No re-explaining, no re-discovering.
- **File-level recall.** Opening `site/v3/src/Hero.jsx` brings back prior
  observations about that file (bugs fixed, decisions, failed attempts) before
  Claude reads it.
- **Searchable history** across every session and subagent in this project, with
  citations (observation ids) you can open in the viewer.
- **Durable decisions** you save on purpose (client approvals, brand rules, prices
  the client confirmed).
- **Cheap code exploration** via tree-sitter (`smart-explore`), useful across five
  variation folders.
- **Narratives and handoffs**: a project timeline report for the client update, a
  `HANDOFF.md` when a long session must continue in a fresh one.

---

## 3. How to use it

### 3.1 Search before you build or decide

Ask in plain words: "did we already solve the Lenis + ScrollTrigger desync?",
"what did we decide for v2's palette?", "what broke in the last v1 perf pass?".
That fires the **mem-search** skill, which always works in three steps (about 10x
cheaper than fetching everything):

```
search(query="lenis scrolltrigger desync", project="Spices Client-03", limit=20)   # index: ids + titles
timeline(anchor=<id>, depth_before=3, depth_after=3, project="Spices Client-03")   # what happened around it
get_observations(ids=[<id>, <id>])                                                 # full detail, selected only
get_tool_uses(ids=["toolu_..."])                                                   # exact raw output, last resort
```

Filters: `type` (observations | sessions | prompts), `obs_type` (bugfix, feature,
decision, discovery, change), `dateStart`/`dateEnd`, `orderBy`. **Always pass
`project="Spices Client-03"`**: the database also holds other clients' work.

Good moments to search: before brainstorming a section (prior decisions), before
writing an unlazy ledger (past gate failures), when a bug looks familiar
(systematic-debugging Phase 1), when resuming after a break.

### 3.2 Save decisions on purpose

"Save to memory: client approved Midnight Masala for v3; saffron accent stays;
no cream-and-brass anywhere." becomes
`save_memory(title="v3 direction approved", text="...", project="Spices Client-03")`.
Search first so you do not save duplicates. Save facts with evidence: approvals,
confirmed prices and origins, rejected ideas and why, the root cause of a nasty
bug. Never save secrets or whole transcripts.

### 3.3 Skills that come with it

| Skill | Use it for |
|---|---|
| `mem-search` | the three-step search above (default) |
| `smart-explore` | AST code search: `smart_search(query, path="./site/v3/src")`, `smart_outline(file)`, `smart_unfold(file, symbol)` instead of Glob/Grep/Read loops |
| `timeline-report` | "Journey into Kesari" narrative of the whole build, for a client update |
| `knowledge-agent` | build a queryable "brain" from observations (e.g. all perf findings) |
| `handoff` | writes `HANDOFF.md` (goal, state, files, failed attempts, next steps) for a fresh session |
| `how-it-works` | explains claude-mem itself |
| `learn-codebase` | reads every source file in full to prime memory. **Never on the repo root** (`repos/` is 2.3 GB of third-party clones, `.claude/` holds hundreds of skills). If used, say "only `site/` and `docs/`" |
| `make-plan` / `do` | claude-mem's own planner/executor. **Do not use for contract work**; superpowers' writing-plans and subagent-driven-development are the chain here |

### 3.4 Privacy and scope

- Wrap anything sensitive in `<private>...</private>` in your prompt; it is
  excluded from storage. Contract terms, client pricing strategy, credentials:
  private, always.
- Compression sends tool inputs and outputs to the configured AI provider
  (currently Claude). Everything else stays in `~/.claude-mem/`.
- To exclude a project entirely: `CLAUDE_MEM_EXCLUDED_PROJECTS` in settings.
- Mode can be switched per language (`CLAUDE_MEM_MODE`, e.g. `code--hi`); restart
  Claude Code after changing it.

### 3.5 How it fits the other skills

- superpowers' SDD ledger (`.superpowers/sdd/<plan>/progress.md`) survives a
  context compaction inside a session; claude-mem carries knowledge across
  sessions. Use both: trust the ledger and `git log` for task state, memory for
  decisions and history.
- End a long session with `handoff`, start the next with a memory search.
- Each tool call becomes a compression request against the provider's quota.
  Heavy subagent runs (SDD, parallel variation builds) multiply that; this is why
  the quota guard tripped. A separate provider (3.0 above) removes the contention.

---

## 4. Health checks and troubleshooting

```bash
claude-mem --version                                   # prints 1 (launcher protocol)
curl -s http://127.0.0.1:37701/api/health              # status ok, version, mcpReady
cat ~/.claude-mem/quota-cooldown.json                  # present = capture paused for quota
cat ~/.claude-mem/observer-health.json                 # auth / provider failures and the fix
tail -n 100 ~/.claude-mem/logs/claude-mem-$(date +%F).log
```

- "memory hooks are not active" system message at start: run
  `npx claude-mem install` (or `repair`), then restart Claude Code from a new terminal.
- Port: the worker listens on `CLAUDE_MEM_WORKER_PORT` (37701 here); this does not
  collide with the site's ports (5300 dev, 531N previews, 5340 to 5399 gate scripts).
- Nothing here modifies the project; all state is under `~/.claude-mem/`.
