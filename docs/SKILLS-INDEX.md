# Skills Index

All skills installed at project level in `.claude/skills/<name>/` (365 skills). Relevance is for building premium animated React + Three.js landing pages for an Indian spice D2C brand.

Note: `.claude/skills/` also holds GSAP (`gsap-*`) and Three.js (`threejs-*`) skills installed separately by another setup step; they are not listed in the table below but are directly relevant (HIGH) to the build.

| Skill (folder) | Source repo | Purpose | Relevance |
|---|---|---|---|
| `accessibility` | ECC | Design, implement, and audit accessible UI to WCAG 2.2 Level AA across Web, iOS, and Android — semantic ARIA roles and labels, accessibility traits and hints, focus ma... | HIGH |
| `browser-qa` | ECC | Run automated post-deploy UI verification with a browser automation MCP (claude-in-chrome, Playwright, or Puppeteer): console-error and Core Web Vitals smoke checks, f... | HIGH |
| `design-system` | ECC | Generate a design system from an existing codebase or audit one for visual consistency: extract tokens (colors, typography, spacing, shadows) into design-tokens.json a... | HIGH |
| `frontend-a11y` | ECC | Accessibility patterns for React and Next.js — semantic HTML, ARIA attributes, form labeling, keyboard navigation, focus management, and screen reader support. | HIGH |
| `frontend-design-direction` | ECC | Set an ECC-specific frontend design direction for production UI work. | HIGH |
| `frontend-patterns` | ECC | Frontend development patterns for React, Next.js, state management, performance optimization, and UI best practices. | HIGH |
| `make-interfaces-feel-better` | ECC | Apply concrete design-engineering details that make interfaces feel polished. | HIGH |
| `motion-advanced` | ECC | Advanced motion patterns for React / Next.js — drag & drop, gestures, text animations, SVG path drawing, custom hooks, imperative sequences (useAnimate), loaders, and... | HIGH |
| `motion-foundations` | ECC | Motion tokens, spring presets, performance rules, device adaptation, accessibility enforcement, and SSR safety for React / Next.js using motion/react. | HIGH |
| `motion-patterns` | ECC | Production-ready animation patterns for React / Next.js — button, modal, toast, stagger, page transitions, exit animations, scroll, and layout — built on motion-founda... | HIGH |
| `react-patterns` | ECC | React 18/19 patterns including hooks discipline, server/client component boundaries, Suspense + error boundaries, form actions, data fetching, state management decisio... | HIGH |
| `react-performance` | ECC | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/vercel-labs/agent-skills). | HIGH |
| `composition-patterns` (frontmatter name: `vercel-composition-patterns`) | agent-skills | React composition patterns that scale. | HIGH |
| `react-best-practices` (frontmatter name: `vercel-react-best-practices`) | agent-skills | React and Next.js performance optimization guidelines from Vercel Engineering. | HIGH |
| `react-view-transitions` (frontmatter name: `vercel-react-view-transitions`) | agent-skills | Guide for implementing smooth, native-feeling animations using React's View Transition API (`<ViewTransition>` component, `addTransitionType`, and CSS view transition... | HIGH |
| `web-design-guidelines` | agent-skills | Review UI code for Web Interface Guidelines compliance. | HIGH |
| `scroll-craft` | scroll-craft | Build premium scroll-driven landing pages for service, product, food, and drink brands. | HIGH |
| `taste-skill` (frontmatter name: `design-taste-frontend`) | taste-skill | tasteskill v2, the anti-slop frontend skill. | HIGH |
| `unlazy` | unlazy | Enforces completion discipline for substantial autonomous work by writing acceptance gates before execution, decomposing work with the Depth Tree, running approved che... | HIGH |
| `agentic-engineering` | ECC | Operate as an agentic engineer using eval-first execution, decomposition, and cost-aware model routing. | MED |
| `article-writing` | ECC | Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content in a distinctive voice derived from supplied examples or brand guidance. | MED |
| `benchmark` | ECC | Measure performance baselines and detect regressions across browser Core Web Vitals (LCP, INP, CLS, page weight), API endpoint latency percentiles, and build/test feed... | MED |
| `brand-discovery` | ECC | Run a structured, resumable multi-session brand identity interview across 8 modules (purpose, positioning, audience, personality, voice, narrative, founder tension) us... | MED |
| `brand-voice` | ECC | Build a source-derived writing style profile from real posts, essays, launch notes, docs, or site copy, then reuse that profile across content, outreach, and social wo... | MED |
| `canary-watch` | ECC | Use this skill to monitor and verify a deployed URL after releases — checks HTTP endpoints, SSE streams, static assets, console errors, and performance regressions aft... | MED |
| `click-path-audit` | ECC | Trace every user-facing button/touchpoint through its full state change sequence to find bugs where functions individually work but cancel each other out, produce wron... | MED |
| `coding-standards` | ECC | Baseline cross-project coding conventions for naming, readability, immutability, and code-quality review. | MED |
| `competitive-platform-analysis` | ECC | Use when scoping a competitive landscape — identifying, categorising, and score-filtering a competitor set before any benchmarking begins. | MED |
| `content-engine` | ECC | Create platform-native content systems for X, LinkedIn, TikTok, YouTube, newsletters, and repurposed multi-platform campaigns. | MED |
| `content-hash-cache-pattern` | ECC | Cache expensive file processing results using SHA-256 content hashes — path-independent, auto-invalidating, with service layer separation. | MED |
| `context-budget` | ECC | Routes live context checks to the native Codex or Claude Code meter without scanning files, and performs a bounded static component audit only when explicitly requested. | MED |
| `dashboard-builder` | ECC | Build monitoring dashboards that answer real operator questions for Grafana, SigNoz, and similar platforms. | MED |
| `deployment-patterns` | ECC | Deployment workflows, CI/CD pipeline patterns, Docker containerization, health checks, rollback strategies, and production readiness checklists for web applications. | MED |
| `documentation-lookup` | ECC | Use up-to-date library and framework docs via Context7 MCP instead of training data. | MED |
| `e2e-testing` | ECC | Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies. | MED |
| `error-handling` | ECC | Patterns for robust error handling across TypeScript, Python, and Go. | MED |
| `fal-ai-media` | ECC | Unified media generation via fal.ai MCP — image, video, and audio. | MED |
| `frontend-slides` | ECC | Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files. | MED |
| `git-workflow` | ECC | Git workflow patterns including branching strategies, commit conventions, keeping history clean and readable, tidying local commits before merging, merge vs rebase, co... | MED |
| `i18n-sync` | ECC | Translate and synchronize application JSON locale files using source-key usage, project terminology, and focused validation. | MED |
| `market-research` | ECC | Conduct market research, competitive analysis, investor due diligence, and industry intelligence with source attribution and decision-oriented summaries. | MED |
| `nextjs-turbopack` | ECC | Next.js 16+ and Turbopack guidance — incremental Rust bundling, file-system caching, faster dev startup and HMR, Turbopack vs webpack tradeoffs, and the middleware.ts... | MED |
| `parallel-execution-optimizer` | ECC | Speed up a task by turning it into a dependency graph of parallel lanes with a lane matrix, batched reads and checks, write surfaces isolated by file, worktree, branch... | MED |
| `plan-orchestrate` | ECC | Read a plan document, decompose it into steps, classify each step, and emit the ready-to-paste ECC slash command for that step, carrying the step identifier and scope... | MED |
| `product-lens` | ECC | Validate the why before building through four product diagnostics — a YC-style product diagnostic that produces PRODUCT-BRIEF.md with a go/no-go recommendation, a foun... | MED |
| `prompt-optimizer` | ECC | Analyze draft prompts, detect intent and missing context, match ECC commands, skills, and agents, and output a ready-to-paste optimized prompt with diagnosis and ratio... | MED |
| `react-testing` | ECC | React component testing with React Testing Library, Vitest/Jest, MSW for network mocking, accessibility assertions with axe, and the decision boundary between componen... | MED |
| `remotion-video-creation` | ECC | Best practices for Remotion - Video creation in React. | MED |
| `search-first` | ECC | Research-before-coding workflow: search npm/PyPI, MCP servers, skills, and GitHub for existing tools before writing custom code, then adopt, extend, or build. | MED |
| `security-review` | ECC | Use this skill when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing payment/sensitive features. | MED |
| `security-scan` | ECC | Scan your Claude Code configuration (.claude/ directory) for security vulnerabilities, misconfigurations, and injection risks using AgentShield. | MED |
| `seo` | ECC | Audit, plan, and implement SEO improvements across technical SEO, on-page optimization, structured data, Core Web Vitals, and content strategy. | MED |
| `strategic-compact` | ECC | Suggests manual context compaction at logical intervals to preserve context through task phases rather than arbitrary auto-compaction. | MED |
| `tdd-workflow` | ECC | Test-driven development workflow: write a failing test first, watch it fail, implement the smallest change to green, then refactor with 80%+ coverage across unit, inte... | MED |
| `token-budget-advisor` | ECC | Offer a choice of response depth (25%/50%/75%/100%) with token estimates before answering, then answer at that level. | MED |
| `ui-demo` | ECC | Record polished UI demo videos using Playwright. | MED |
| `verification-loop` | ECC | Run a six-phase verification of a Claude Code session's work — build, type check, lint, tests with coverage, security grep, and diff review — then produce a PASS/FAIL... | MED |
| `vite-patterns` | ECC | Vite build tool patterns including config, plugins, HMR, env variables, proxy setup, SSR, library mode, dependency pre-bundling, and build optimization. | MED |
| `deploy-to-vercel` | agent-skills | Deploy applications and websites to Vercel. | MED |
| `vercel-cli-with-tokens` | agent-skills | Deploy and manage projects on Vercel using token-based authentication. | MED |
| `vercel-optimize` | agent-skills | Use for Vercel cost and performance optimization on deployed projects, especially Next.js, SvelteKit, Nuxt, and limited Astro apps. | MED |
| `writing-guidelines` | agent-skills | Review docs/prose for Writing Guidelines compliance. | MED |
| `do` | claude-mem | Execute a phased implementation plan using subagents. | MED |
| `make-plan` | claude-mem | Create a detailed, phased implementation plan with documentation discovery. | MED |
| `mem-search` | claude-mem | Smart search (default). | MED |
| `smart-explore` | claude-mem | Token-optimized structural code search using tree-sitter AST parsing. | MED |
| `brainstorming` | superpowers | You MUST use this before any creative work - creating features, building components, adding functionality, modifying behavior, or planning anything new, in software or... | MED |
| `dispatching-parallel-agents` | superpowers | Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies | MED |
| `executing-plans` | superpowers | Use when executing an implementation plan in the current session as the implementer yourself — your human partner chose inline execution, or no subagent tool is available | MED |
| `finishing-a-development-branch` | superpowers | Use when implementation is complete, all tests pass, and you need to decide how to integrate the work | MED |
| `receiving-code-review` | superpowers | Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor a... | MED |
| `requesting-code-review` | superpowers | Use when completing tasks, implementing major features, or before merging to verify work meets requirements | MED |
| `subagent-driven-development` | superpowers | Use when executing implementation plans with independent tasks in the current session | MED |
| `systematic-debugging` | superpowers | Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes | MED |
| `test-driven-development` | superpowers | Use when implementing any feature or bugfix, before writing implementation code | MED |
| `using-git-worktrees` | superpowers | Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace exists via native t... | MED |
| `using-superpowers` | superpowers | Use when starting any conversation - establishes how to find and use skills, requiring skill invocation before ANY response including clarifying questions | MED |
| `verification-before-completion` | superpowers | Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before ma... | MED |
| `writing-plans` | superpowers | Use when you have a spec or requirements for a multi-step task, before touching code | MED |
| `writing-skills` | superpowers | Use when creating new skills, editing existing skills, or verifying skills work before deployment | MED |
| `agent-architecture-audit` | ECC | Full-stack diagnostic for agent and LLM applications. | LOW |
| `agent-eval` | ECC | Head-to-head comparison of coding agents (Claude Code, Aider, Codex, etc.) on custom tasks with pass rate, cost, time, and consistency metrics. | LOW |
| `agent-harness-construction` | ECC | Design and optimize AI agent action spaces, tool definitions, and observation formatting for higher completion rates. | LOW |
| `agent-introspection-debugging` | ECC | Structured self-debugging workflow for AI agent failures using capture, diagnosis, contained recovery, and introspection reports. | LOW |
| `agent-payment-x402` | ECC | Add x402 payment execution to AI agents with per-task budgets, spending controls, and non-custodial wallets. | LOW |
| `agent-runtime-gateway-smoke-test` | ECC | Verify a local agent API, temporary gateway tunnel, and remote sandbox callback with a tool-free task, then restore the original app connection. | LOW |
| `agent-security-hardening` | ECC | Security hardening guidance for AI agent frameworks that process untrusted content, invoke tools, write workspace files, manage runtime identifiers, or handle credenti... | LOW |
| `agent-self-evaluation` | ECC | Use after completing any non-trivial task. | LOW |
| `agent-sort` | ECC | Build an evidence-backed ECC install plan for a specific repo by sorting skills, commands, rules, hooks, and extras into DAILY vs LIBRARY buckets using parallel repo-a... | LOW |
| `agentic-os` | ECC | Build persistent multi-agent operating systems on Claude Code. | LOW |
| `ai-first-engineering` | ECC | Engineering operating model for teams where AI agents generate a large share of implementation output. | LOW |
| `ai-regression-testing` | ECC | Regression testing strategies for AI-assisted development. | LOW |
| `android-clean-architecture` | ECC | Clean Architecture patterns for Android and Kotlin Multiplatform projects — module structure, dependency rules, UseCases, Repositories, and data layer patterns. | LOW |
| `angular-developer` | ECC | Generates Angular code and provides architectural guidance. | LOW |
| `api-connector-builder` | ECC | Build a new API connector or provider by matching the target repo's existing integration pattern exactly. | LOW |
| `api-design` | ECC | REST API design patterns including resource naming, status codes, pagination, filtering, error responses, versioning, and rate limiting for production APIs. | LOW |
| `architecture-decision-records` | ECC | Capture architectural decisions as numbered ADR markdown files in docs/adr/ with context, alternatives considered, consequences, and an index README. | LOW |
| `automation-audit-ops` | ECC | Evidence-first automation inventory and overlap audit workflow for ECC. | LOW |
| `autonomous-agent-harness` | ECC | Transform Claude Code into a fully autonomous agent system with persistent memory, scheduled operations, computer use, and task queuing. | LOW |
| `autonomous-loops` | ECC | Patterns and architectures for autonomous Claude Code loops — from simple sequential pipelines to RFC-driven multi-agent DAG systems. | LOW |
| `backend-patterns` | ECC | Backend architecture patterns, API design, database optimization, and server-side best practices for Node.js, Express, and Next.js API routes. | LOW |
| `benchmark-methodology` | ECC | Score a scoped competitor set into comparable profile cards: nine weighted dimensions (positioning, voice, visual craft, offer packaging, evidence, enterprise-readines... | LOW |
| `benchmark-optimization-loop` | ECC | Convert 'make it faster' requests into a bounded measured optimization loop — baseline first, generate one-hypothesis variants, benchmark each against a correctness ga... | LOW |
| `bengali-nlp` | ECC | Bengali (Bangla) text processing patterns including Unicode normalization, script detection, tokenization, conjunct handling, and Bangla-specific NLP best practices fo... | LOW |
| `blender-motion-state-inspection` | ECC | Use this skill when inspecting Blender characters, rigs, poses, animation retargeting, ground contact, facing direction, or model-vs-motion alignment where screenshots... | LOW |
| `blueprint` | ECC | Turn a one-line objective into a step-by-step construction plan for multi-session, multi-agent engineering projects: one-PR-sized steps with self-contained context bri... | LOW |
| `brownfield-retrospective` | ECC | Run the ECC engineering process retroactively against an existing project slice. | LOW |
| `bun-runtime` | ECC | Bun as runtime, package manager, bundler, and test runner. | LOW |
| `carrier-relationship-management` | ECC | Manage truckload, LTL, and intermodal carrier portfolios: sourcing and FMCSA vetting, freight rate and fuel-surcharge negotiation, RFPs and routing guides, carrier sco... | LOW |
| `change-impact` | ECC | Perform evidence-backed impact analysis before changing code, data, interfaces, or governance documents, then compare the planned impact with the actual diff after imp... | LOW |
| `cisco-ios-patterns` | ECC | Cisco IOS and IOS-XE review patterns for show commands, config hierarchy, wildcard masks, ACL placement, interface hygiene, and safe change-window verification. | LOW |
| `ck` | ECC | Persistent per-project memory for Claude Code (Context Keeper) driven by deterministic Node.js /ck commands: init, save, resume, info, list, forget, and v1-to-v2 migra... | LOW |
| `claude-devfleet` | ECC | Orchestrate multi-agent coding tasks via Claude DevFleet — plan projects, dispatch parallel agents in isolated worktrees, monitor progress, and read structured reports. | LOW |
| `clickhouse-io` | ECC | ClickHouse database patterns, query optimization, analytics, and data engineering best practices for high-performance analytical workloads. | LOW |
| `code-tour` | ECC | Create CodeTour `.tour` files — persona-targeted, step-by-step walkthroughs with real file and line anchors. | LOW |
| `codebase-onboarding` | ECC | Analyze an unfamiliar codebase and generate a structured onboarding guide with architecture map, key entry points, conventions, and a starter CLAUDE.md. | LOW |
| `codehealth-mcp` | ECC | Real-time structural Code Health via CodeScene MCP — review before edits, verify score deltas after changes, gate commits and PRs. | LOW |
| `competitive-report-structure` | ECC | Assemble scored competitor profile cards (from benchmark-methodology) into a decision-grade competitive report with landscape map, competitor tiers, benchmarking matri... | LOW |
| `compose-multiplatform-patterns` | ECC | Compose Multiplatform and Jetpack Compose patterns for KMP projects — state management, navigation, theming, performance, and platform-specific UI. | LOW |
| `config-gc` | ECC | Garbage collection for your Claude Code configuration. | LOW |
| `configure-ecc` | ECC | Run the conversational ECC setup wizard inside the current harness: inventory the install, collect scope (user/project/local) and hook mode (off/minimal/standard/stric... | LOW |
| `connections-optimizer` | ECC | Reorganize the user's X and LinkedIn network with review-first pruning, add/follow recommendations, and channel-specific warm outreach drafted in the user's real voice. | LOW |
| `context-and-decisions` | ECC | Govern stable domain context with a narrowly scoped CONTEXT.md when needed, and route hard-to-reverse decisions to ECC's existing architecture-decision-records skill. | LOW |
| `continuous-agent-loop` | ECC | Patterns for continuous autonomous agent loops with quality gates, evals, and recovery controls. | LOW |
| `continuous-learning` | ECC | [DEPRECATED - use continuous-learning-v2] Legacy v1 stop-hook skill extractor. | LOW |
| `continuous-learning-v2` | ECC | Instinct-based learning system that observes sessions via hooks, creates atomic instincts with confidence scoring, and evolves them into skills/commands/agents. | LOW |
| `contract-first` | ECC | Coordinate frontend/backend or service-to-service work through one authoritative machine-checkable contract (OpenAPI, AsyncAPI, Protocol Buffers, or JSON Schema), with... | LOW |
| `conventional-commit-review` | ECC | Reviews staged changes and drafts a Conventional Commits-compliant commit message with the right type, scope, and length. | LOW |
| `cost-aware-llm-pipeline` | ECC | Cost optimization patterns for LLM API usage — model routing by task complexity, budget tracking, retry logic, and prompt caching. | LOW |
| `cost-tracking` | ECC | Track and report Claude Code token usage, spending, and budgets from the local ECC cost-tracker metrics log. | LOW |
| `council` | ECC | Convene a four-voice council for ambiguous decisions, tradeoffs, and go/no-go calls. | LOW |
| `council-multi-model` | ECC | Add one optional external Codex critique after the existing council has produced a decision draft. | LOW |
| `counterparty-channel-discipline` | ECC | Per-channel strict prompts, mention gating, silent observation, and a communication autonomy policy for agents that sit in shared channels with external counterparties. | LOW |
| `cpp-coding-standards` | ECC | C++ coding standards based on the C++ Core Guidelines (isocpp.github.io). | LOW |
| `cpp-testing` | ECC | Use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests, or adding coverage/sanitizers. | LOW |
| `crosspost` | ECC | Multi-platform content distribution across X, LinkedIn, Threads, and Bluesky. | LOW |
| `csharp-testing` | ECC | C# and .NET testing patterns with xUnit, FluentAssertions, mocking, integration tests, and test organization best practices. | LOW |
| `customer-billing-ops` | ECC | Operate customer billing workflows such as subscriptions, refunds, churn triage, billing-portal recovery, and plan analysis using connected billing tools like Stripe. | LOW |
| `customs-trade-compliance` | ECC | Codified customs and trade compliance expertise — HS/HTS tariff classification with GRI rules, commercial invoices and entry documentation, Incoterms 2020, FTA qualifi... | LOW |
| `dart-flutter-patterns` | ECC | Production-ready Dart and Flutter patterns covering null safety, immutable state with Freezed, async composition, widget architecture, state management (BLoC, Riverpod... | LOW |
| `data-scraper-agent` | ECC | Build a fully automated AI-powered data collection agent for any public source — job boards, prices, news, GitHub, sports, anything. | LOW |
| `data-throughput-accelerator` | ECC | Diagnose and accelerate large data movement — ingestion, backfill, export, ETL, warehouse loading, manifest catch-up, and table synchronization — by isolating the true... | LOW |
| `database-migrations` | ECC | Safe, reversible database migration patterns: forward-only production changes, expand-contract zero-downtime renames, concurrent indexes, batched backfills, and per-to... | LOW |
| `deep-research` | ECC | Produce cited research reports from multiple web sources using firecrawl and exa MCP tools — plan sub-questions, search and deep-read sources, then synthesize findings... | LOW |
| `deepseek-harness-setup` | ECC | Install and operate Everything Claude Code (ECC) on the DeepSeek Harness (DSH): native skill roots (~/.dsh/skills, .agents/skills), the @deepseek-ai/dsh-hooks-claude-c... | LOW |
| `defi-amm-security` | ECC | Security checklist for Solidity AMM contracts, liquidity pools, and swap flows. | LOW |
| `delivery-gate` | ECC | Stop hook that blocks Claude from finishing until quality checks pass. | LOW |
| `dev-team` | ECC | Simulate a collaborative dev team session where multiple role-based personas (PM, Architect, Developer, QA) respond to the same problem together in one session. | LOW |
| `django-celery` | ECC | Django + Celery async task patterns — configuration, task design, beat scheduling, retries, canvas workflows, monitoring, and testing. | LOW |
| `django-patterns` | ECC | Django architecture patterns, REST API design with DRF, ORM best practices, caching, signals, middleware, and production-grade Django apps. | LOW |
| `django-security` | ECC | Django security best practices, authentication, authorization, CSRF protection, SQL injection prevention, XSS prevention, and secure deployment configurations. | LOW |
| `django-tdd` | ECC | Django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework APIs. | LOW |
| `django-verification` | ECC | Run the full Django verification loop — environment check, mypy/ruff/black linting, migration safety, pytest with coverage targets, pip-audit and bandit security scans... | LOW |
| `dmux-workflows` | ECC | Multi-agent orchestration using dmux (tmux pane manager for AI agents). | LOW |
| `docker-patterns` | ECC | Docker and Docker Compose patterns for local development, hardened CLI installer harnesses, container security, networking, volumes, and multi-service orchestration. | LOW |
| `docs-governance` | ECC | Route broad documentation-governance requests to existing ECC skills and run an opt-in, read-only audit of mapped documentation roles, links, ADR indexes, and evidence... | LOW |
| `dotnet-patterns` | ECC | Idiomatic C# and .NET patterns, conventions, dependency injection, async/await, and best practices for building robust, maintainable .NET applications. | LOW |
| `dynamic-workflow-mode` | ECC | Design task-local harnesses, eval gates, and reusable skill extraction for Claude dynamic workflow mode and other adaptive agent harnesses. | LOW |
| `ecc-guide` | ECC | Answer questions about ECC by reading the live repo surface — agents, skills, commands, hooks, rules, install profiles, and docs — instead of memory. | LOW |
| `ecc-recipes` | ECC | Map a described workflow to the right ECC command group with run-order and stop condition, or browse all command-group recipe families read live from the commands dire... | LOW |
| `ecc-tools-cost-audit` | ECC | Evidence-first ECC Tools burn and billing audit workflow. | LOW |
| `email-ops` | ECC | Evidence-first mailbox triage, drafting, send verification, and sent-mail-safe follow-up workflow for ECC. | LOW |
| `energy-procurement` | ECC | Procure electricity and natural gas for commercial and industrial facilities: tariff and rate-schedule optimization, demand-charge mitigation, supplier RFPs, fixed/ind... | LOW |
| `enterprise-agent-ops` | ECC | Operational controls for long-lived or cloud-hosted agent systems — runtime lifecycle (start, pause, stop, restart), observability (logs, metrics, traces), least-privi... | LOW |
| `esign-field-placement` | ECC | Deterministic method for placing signature, date, and text fields in a web e-signature composer through a browser automation session, using a fixed signature page, num... | LOW |
| `eval-harness` | ECC | Eval-driven development (EDD) framework for AI coding sessions — define capability and regression evals before coding, grade with code-based, model-based, rule, or hum... | LOW |
| `evm-token-decimals` | ECC | Prevent silent decimal mismatch bugs across EVM chains. | LOW |
| `exa-search` | ECC | Neural search via Exa MCP for web, code, and company research. | LOW |
| `fastapi-patterns` | ECC | FastAPI best practices covering project structure, Pydantic v2 schemas, dependency injection, async handlers, authentication, authorization, transactional service laye... | LOW |
| `finance-billing-ops` | ECC | Evidence-first revenue, pricing, refunds, team-billing, and billing-model truth workflow for ECC. | LOW |
| `flox-environments` | ECC | Create reproducible, cross-platform (macOS/Linux) development environments with Flox, a declarative Nix-based environment manager. | LOW |
| `flutter-dart-code-review` | ECC | Library-agnostic Flutter/Dart code review checklist covering widget best practices, state management patterns (BLoC, Riverpod, Provider, GetX, MobX, Signals), Dart idi... | LOW |
| `foundation-models-on-device` | ECC | Apple FoundationModels framework for on-device LLM — text generation, guided generation with @Generable, tool calling, and snapshot streaming in iOS 26+. | LOW |
| `fsharp-testing` | ECC | F# testing patterns with xUnit, FsUnit, Unquote, FsCheck property-based testing, integration tests, and test organization best practices. | LOW |
| `gan-style-harness` | ECC | GAN-inspired Generator-Evaluator agent harness for building high-quality applications autonomously. | LOW |
| `gateguard` | ECC | PreToolUse fact-forcing gate that denies the first Edit/Write/Bash (including MultiEdit and NotebookEdit) attempt until the agent presents concrete facts (importers, d... | LOW |
| `generating-python-installer` | ECC | Commercial-grade Python installer expert for Windows: Nuitka extreme compilation, dist slimming, DLL footprint analysis, and Inno Setup packaging to ship the smallest,... | LOW |
| `github-ops` | ECC | GitHub repository operations, automation, and management. | LOW |
| `golang-patterns` | ECC | Idiomatic Go patterns, best practices, and conventions for building robust, efficient, and maintainable Go applications. | LOW |
| `golang-testing` | ECC | Go testing patterns including table-driven tests, subtests, benchmarks, fuzzing, and test coverage. | LOW |
| `google-workspace-ops` | ECC | Operate across Google Drive, Docs, Sheets, and Slides as one workflow surface for plans, trackers, decks, and shared documents. | LOW |
| `growth-log` | ECC | Write growth log entries that extract reusable patterns from completed work — root cause, transferable rule, and a recognizable signal — instead of diary-style event n... | LOW |
| `healthcare-cdss-patterns` | ECC | Clinical Decision Support System (CDSS) development patterns. | LOW |
| `healthcare-emr-patterns` | ECC | EMR/EHR development patterns for healthcare applications. | LOW |
| `healthcare-eval-harness` | ECC | Patient safety evaluation harness for healthcare application deployments. | LOW |
| `healthcare-phi-compliance` | ECC | Protected Health Information (PHI) and PII compliance patterns for healthcare applications: data classification, row-level access control, tamper-proof audit trails, s... | LOW |
| `hermes-imports` | ECC | Convert local Hermes operator workflows into sanitized ECC skills and release-pack artifacts. | LOW |
| `hexagonal-architecture` | ECC | Design, implement, and refactor Ports & Adapters systems with clear domain boundaries, dependency inversion, and testable use-case orchestration across TypeScript, Jav... | LOW |
| `hipaa-compliance` | ECC | HIPAA-specific entrypoint for healthcare privacy and security work. | LOW |
| `homelab-network-readiness` | ECC | Readiness checklist for homelab VLAN segmentation, local DNS filtering (Pi-hole, AdGuard Home), and WireGuard-style remote access. | LOW |
| `homelab-network-setup` | ECC | Practical home and homelab network planning for gateways, switches, access points, IP ranges, DHCP reservations, DNS, cabling, and common beginner mistakes. | LOW |
| `homelab-pihole-dns` | ECC | Pi-hole installation, blocklist management, DNS-over-HTTPS setup, DHCP integration, local DNS records, and troubleshooting broken DNS resolution on a home network. | LOW |
| `homelab-vlan-segmentation` | ECC | Segmenting home networks into VLANs for IoT, guest, trusted, and server traffic using UniFi, pfSense/OPNsense, and MikroTik — including switch trunk config, firewall r... | LOW |
| `homelab-wireguard-vpn` | ECC | WireGuard VPN server setup, peer configuration, key generation, split tunneling vs full tunnel routing, and remote access to a home network from mobile and laptop clie... | LOW |
| `hookify-rules` | ECC | Create and configure hookify rules — markdown files with YAML frontmatter that match bash, file, prompt, or stop events by regex or conditions and show warn/block mess... | LOW |
| `inherit-legacy-style` | ECC | Prevent AI style drift on legacy projects by scanning the codebase for implicit conventions, resolving conflicts with the operator one at a time, and writing an enforc... | LOW |
| `intent-driven-development` | ECC | Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside implementation. | LOW |
| `inventory-demand-planning` | ECC | Codified demand planning expertise for multi-location retailers: demand forecasting method selection, ABC/XYZ segmentation, safety stock and reorder-point optimization... | LOW |
| `investor-materials` | ECC | Create and update pitch decks, one-pagers, investor memos, accelerator applications, financial models, and fundraising materials. | LOW |
| `investor-outreach` | ECC | Draft cold emails, warm intro blurbs, follow-ups, update emails, and investor communications for fundraising. | LOW |
| `ios-icon-gen` | ECC | Generate iOS app icons as PNG imagesets for Xcode asset catalogs from SF Symbols (5000+ Apple-native) or Iconify API (275k+ open source icons from 200+ collections). | LOW |
| `iterative-retrieval` | ECC | Pattern for progressively refining context retrieval to solve the subagent context problem. | LOW |
| `ito-baskets` | ECC | Read-only Itô basket and prediction-market data skill. | LOW |
| `ito-compute` | ECC | Query live GPU inventory, submit an authenticated Itô fixed-rate RFQ, inspect RFQ or procurement status, revoke device credentials, and run explicitly gated node quali... | LOW |
| `ito-inference` | ECC | Inspect the availability of model serving on a completed Itô compute booking and, when the canonical backend becomes available, hand off an explicitly confirmed servin... | LOW |
| `ito-training` | ECC | Inspect the availability of ML training on a completed Itô compute booking and, when the canonical backend becomes available, hand off an explicitly confirmed training... | LOW |
| `java-coding-standards` | ECC | Java coding standards for Spring Boot and Quarkus services: naming, immutability, Optional usage, streams, exceptions, generics, CDI, reactive patterns, and project la... | LOW |
| `jira-integration` | ECC | Use this skill when retrieving Jira tickets, analyzing requirements, updating ticket status, adding comments, or transitioning issues. | LOW |
| `jpa-patterns` | ECC | JPA/Hibernate patterns for entity design, relationships, query optimization, transactions, auditing, indexing, pagination, and pooling in Spring Boot. | LOW |
| `knowledge-ops` | ECC | Knowledge base management, ingestion, sync, and retrieval across multiple storage layers (local files, MCP memory, vector stores, Git repos). | LOW |
| `kotlin-coroutines-flows` | ECC | Kotlin Coroutines and Flow patterns for Android and KMP — structured concurrency, Flow operators, StateFlow, error handling, and testing. | LOW |
| `kotlin-exposed-patterns` | ECC | JetBrains Exposed ORM patterns including DSL queries, DAO pattern, transactions, HikariCP connection pooling, Flyway migrations, and repository pattern. | LOW |
| `kotlin-ktor-patterns` | ECC | Ktor server patterns including routing DSL, plugins, authentication, Koin DI, kotlinx.serialization, WebSockets, and testApplication testing. | LOW |
| `kotlin-patterns` | ECC | Idiomatic Kotlin patterns, best practices, and conventions for building robust, efficient, and maintainable Kotlin applications with coroutines, null safety, and DSL b... | LOW |
| `kotlin-testing` | ECC | Kotlin testing patterns with Kotest, MockK, coroutine testing, property-based testing, and Kover coverage. | LOW |
| `kubernetes-patterns` | ECC | Kubernetes workload patterns, resource management, RBAC, probes, autoscaling, ConfigMap/Secret handling, and kubectl debugging for production-grade deployments. | LOW |
| `laravel-patterns` | ECC | Laravel architecture patterns, routing/controllers, Eloquent ORM, service layers, queues, events, caching, and API resources for production apps. | LOW |
| `laravel-plugin-discovery` | ECC | Discover and evaluate Laravel packages via LaraPlugins.io MCP. | LOW |
| `laravel-security` | ECC | Laravel security best practices — authentication, authorization, Eloquent safety, CSRF, XSS prevention, API security, and secure deployment configurations. | LOW |
| `laravel-tdd` | ECC | Laravel testing strategies with PHPUnit, Pest, model factories, HTTP tests, Sanctum authentication testing, mocking, and coverage. | LOW |
| `laravel-verification` | ECC | Verification loop for Laravel projects: env checks, linting, static analysis, tests with coverage, security scans, and deployment readiness. | LOW |
| `latency-critical-systems` | ECC | Optimize and verify latency-sensitive systems — realtime dashboards, market data feeds, streaming agents, execution gateways, queues, and caches — by tracking p50/p95/... | LOW |
| `lead-intelligence` | ECC | AI-native lead intelligence and outreach pipeline. | LOW |
| `liquid-glass-design` | ECC | iOS 26 Liquid Glass design system — dynamic glass material with blur, reflection, and interactive morphing for SwiftUI, UIKit, and WidgetKit. | LOW |
| `living-docs-governance` | ECC | Keep a long-lived project's documentation from rotting by assigning existing project docs clear constitution, map, status, and history roles, then wiring the active ag... | LOW |
| `llm-trading-agent-security` | ECC | Security patterns for autonomous trading agents with wallet or transaction authority. | LOW |
| `logistics-exception-management` | ECC | Codified freight-exception handling expertise for shipment delays, damages, losses, shortages, and carrier disputes, with escalation protocols, carrier-specific behavi... | LOW |
| `loop-design-check` | ECC | Design a goal-oriented agent loop or review one for failure modes: spinning, Goodhart-gaming the verifier, or running a wrong answer to completion. | LOW |
| `mailtrap-email-integration` | ECC | Guides agents through integrating transactional email sending via Mailtrap's Email API, including sandbox testing, domain verification, and API authentication. | LOW |
| `manim-video` | ECC | Build reusable Manim explainers for technical concepts, graphs, system diagrams, and product walkthroughs, then hand off to the wider ECC video stack if needed. | LOW |
| `marketing-campaign` | ECC | End-to-end marketing campaign planning and execution. | LOW |
| `master-agreement-generator` | ECC | Generate review drafts of counterparty master agreements from one template plus a JSON spec, with role-selected clauses and a Schedule A workflow limited to the execut... | LOW |
| `mcp-dependency-review` | ECC | Statically review MCP configuration for mutable package references before approval or CI, without executing discovered MCP servers. | LOW |
| `mcp-server-patterns` | ECC | Build MCP servers with Node/TypeScript SDK — tools, resources, prompts, Zod validation, stdio vs Streamable HTTP. | LOW |
| `messages-ops` | ECC | Evidence-first live messaging workflow for ECC. | LOW |
| `ml-adoption-playbook` | ECC | End-to-end methodology for AI agents and software engineers to add machine learning algorithms to existing non-ML codebases. | LOW |
| `mle-workflow` | ECC | Production machine-learning engineering workflow for data contracts, reproducible training, model evaluation, deployment, monitoring, and rollback. | LOW |
| `module-regression` | ECC | Govern cross-module regression in large repositories with a REGRESSION.md ledger that records each module's downstream consumers and executable acceptance command. | LOW |
| `mybatis-patterns` | ECC | MyBatis and MyBatis-Spring patterns for mapper design, XML and annotation SQL, result mapping, dynamic SQL safety, transactions, batching, pagination, and query perfor... | LOW |
| `mysql-patterns` | ECC | MySQL and MariaDB schema, query, indexing, transaction, replication, and connection-pool patterns for production backends. | LOW |
| `nanoclaw-repl` | ECC | Operate and extend NanoClaw, ECC's zero-dependency session-aware REPL, with persistent markdown-backed sessions and slash commands for model switching, skill loading,... | LOW |
| `nasiko-control-plane` | ECC | Manage the experimental Nasiko CLI lifecycle through ECC — read-only status checks, consent-gated install of the pinned qualified version with dry-run preview, and own... | LOW |
| `nestjs-patterns` | ECC | NestJS architecture patterns for modules, controllers, providers, DTO validation, guards, interceptors, config, and production-grade TypeScript backends. | LOW |
| `netmiko-ssh-automation` | ECC | Safe Python Netmiko patterns for read-only collection, bounded batch SSH, TextFSM parsing, guarded config changes, timeouts, and network automation error handling. | LOW |
| `network-bgp-diagnostics` | ECC | Diagnostics-only BGP troubleshooting patterns for neighbor state, route exchange, prefix policy, AS path inspection, and safe evidence collection. | LOW |
| `network-config-validation` | ECC | Pre-deployment checks for router and switch configuration, including dangerous commands, duplicate addresses, subnet overlaps, stale references, management-plane risk,... | LOW |
| `network-interface-health` | ECC | Diagnose interface errors, drops, CRCs, duplex mismatches, flapping, speed negotiation issues, and counter trends on routers, switches, and Linux hosts. | LOW |
| `nodejs-keccak256` | ECC | Prevent Ethereum hashing bugs in JavaScript and TypeScript. | LOW |
| `nutrient-document-processing` | ECC | Process, convert, OCR, extract, redact, sign, and fill documents using the Nutrient DWS API. | LOW |
| `nuxt4-patterns` | ECC | Nuxt 4 app patterns for hydration safety, performance, route rules, lazy loading, and SSR-safe data fetching with useFetch and useAsyncData. | LOW |
| `openclaw-persona-forge` | ECC | 为 OpenClaw AI Agent 锻造完整的龙虾灵魂方案。根据用户偏好或随机抽卡， 输出身份定位、灵魂描述(SOUL.md)、角色化底线规则、名字和头像生图提示词。 如当前环境提供已审核的生图 skill，可自动生成统一风格头像图片。 当用户需要创建、设计或定制 OpenClaw 龙虾灵魂时使用。 不适用于：微调已有 SOUL... | LOW |
| `opensource-pipeline` | ECC | Open-source pipeline: fork, sanitize, and package private projects for safe public release. | LOW |
| `operator-approval-loop` | ECC | Operator approval contract with internal filing notices for agent-drafted outbound messages, hashed drafts, epoch-keyed decisions, durable delivery claims and receipts... | LOW |
| `orch-add-feature` | ECC | Orchestrate building a brand-new feature end to end — research, plan, TDD implementation, review, and gated commit — by delegating each phase to the matching ECC agent. | LOW |
| `orch-build-mvp` | ECC | Orchestrate bootstrapping a working MVP from a design or spec document — ingest the SDD/PRD, plan thin vertical slices, scaffold the first end-to-end slice, then drive... | LOW |
| `orch-change-feature` | ECC | Orchestrate altering an existing, working feature to new desired behavior — update its tests to the new spec, change the implementation to match, review, and gated com... | LOW |
| `orch-fix-defect` | ECC | Orchestrate fixing a bug — reproduce it as a failing regression test, fix to green, review, and gated commit — by delegating each phase to the matching ECC agent. | LOW |
| `orch-pipeline` | ECC | Shared orchestration engine behind the orch-* skill family — the gated Research-Plan-TDD-Review-Commit pipeline, size classifier, agent and command map, and two human... | LOW |
| `orch-refine-code` | ECC | Orchestrate a behavior-preserving refactor — confirm tests are green, restructure without changing behavior, keep tests green, review, and gated commit. | LOW |
| `osint-investigation` | ECC | Sparse-clue OSINT investigation methodology for extracting overlooked leads, connecting fragmented evidence, and testing explanations across sources. | LOW |
| `perl-patterns` | ECC | Modern Perl 5.36+ idioms, best practices, and conventions for building robust, maintainable Perl applications. | LOW |
| `perl-security` | ECC | Comprehensive Perl security covering taint mode, input validation, safe process execution, DBI parameterized queries, web security (XSS/SQLi/CSRF), and perlcritic secu... | LOW |
| `perl-testing` | ECC | Perl testing patterns using Test2::V0, Test::More, prove runner, mocking, coverage with Devel::Cover, and TDD methodology. | LOW |
| `plan-canvas` | ECC | Open plans and HTML artifacts in a local browser canvas where the human annotates elements, chats, and approves or requests changes without leaving the page. | LOW |
| `plankton-code-quality` | ECC | Write-time code quality enforcement using Plankton — auto-formatting, linting, and Claude-powered fixes on every file edit via hooks. | LOW |
| `postgres-patterns` | ECC | PostgreSQL database patterns for query optimization, schema design, indexing, and security. | LOW |
| `prediction-market-oracle-research` | ECC | Research prediction markets as data sources or oracle signals for products, agents, dashboards, and corporate decision intelligence. | LOW |
| `prediction-market-risk-review` | ECC | Review prediction-market, basket, oracle, and trading-agent workflows for compliance, safety, data-quality, privacy, and execution risk. | LOW |
| `prisma-patterns` | ECC | Prisma ORM patterns for TypeScript backends — schema design, query optimization, transactions, pagination, and critical traps like updateMany returning count not recor... | LOW |
| `product-capability` | ECC | Translate PRD intent, roadmap asks, or product discussions into an implementation-ready capability plan that exposes constraints, invariants, interfaces, and unresolve... | LOW |
| `production-audit` | ECC | Local-evidence production readiness audit for shipped apps, pre-launch reviews, post-merge checks, and "what breaks in prod?" questions without sending repo data to an... | LOW |
| `production-scheduling` | ECC | Codified expertise for production scheduling, job sequencing, line balancing, changeover optimization, and bottleneck resolution in discrete and batch manufacturing. | LOW |
| `project-flow-ops` | ECC | Operate execution flow across GitHub and Linear by triaging issues and pull requests, linking active work, and keeping GitHub public-facing while Linear remains the in... | LOW |
| `prompt-caching-strategy` | ECC | Optimize LLM prompt caching hit rate to reduce API costs and improve latency. | LOW |
| `python-patterns` | ECC | Pythonic idioms, PEP 8 standards, type hints, and best practices for building robust, efficient, and maintainable Python applications. | LOW |
| `python-testing` | ECC | Python testing strategies using pytest, TDD methodology, fixtures, mocking, parametrization, and coverage requirements. | LOW |
| `pytorch-patterns` | ECC | PyTorch deep learning patterns and best practices for building robust, efficient, and reproducible training pipelines, model architectures, and data loading. | LOW |
| `quality-nonconformance` | ECC | Quality control and non-conformance management for regulated manufacturing (FDA 21 CFR 820, IATF 16949, AS9100): NCR lifecycle and disposition, 5-Why/Ishikawa/fault-tr... | LOW |
| `quarkus-patterns` | ECC | Quarkus 3.x LTS architecture patterns with Camel for messaging, RESTful API design, CDI services, data access with Panache, and async processing. | LOW |
| `quarkus-security` | ECC | Quarkus security implementation patterns: JWT and OIDC authentication, @RolesAllowed RBAC and SecurityIdentity checks, Bean Validation and custom validators, parameter... | LOW |
| `quarkus-tdd` | ECC | Test-driven development for Quarkus 3.x LTS using JUnit 5, Mockito, REST Assured, Camel testing, and JaCoCo. | LOW |
| `quarkus-verification` | ECC | Verification loop for Quarkus projects: build, static analysis (Checkstyle, PMD, SpotBugs), tests with JaCoCo coverage, OWASP dependency and container security scans,... | LOW |
| `rails-patterns` | ECC | Ruby on Rails framework patterns for Rails 7.1+ and 8.x apps. | LOW |
| `ralphinho-rfc-pipeline` | ECC | Split an RFC into a multi-agent execution DAG — decompose into work units with dependencies and acceptance tests, run research, plan, implement, test, and review per u... | LOW |
| `react-native-patterns` | ECC | React Native and Expo app patterns — Expo Router navigation, state separation (server/client/route/form), TanStack Query data fetching with Zod, performant lists, Nati... | LOW |
| `recsys-pipeline-architect` | ECC | Design composable recommendation, ranking, and feed pipelines using the six-stage Source→Hydrator→Filter→Scorer→Selector→SideEffect framework popularized by xAI's open... | LOW |
| `recursive-decision-ledger` | ECC | Run repeated rollouts ("Prime Gauss" style recursive prompting) while keeping an append-only decision ledger of trials, marks, coherence checks, and promotion gates, s... | LOW |
| `redis-patterns` | ECC | Redis data structure patterns, caching strategies, distributed locks, rate limiting, pub/sub, and connection management for production applications. | LOW |
| `regex-vs-llm-structured-text` | ECC | Decision framework for parsing structured text (quizzes, forms, invoices, receipts, tables) with a hybrid regex-first pipeline — regex extraction handles 95%+ cheaply,... | LOW |
| `repo-scan` | ECC | Bootstrap pointer that installs the external repo-scan skill from a pinned, reviewable commit. | LOW |
| `research-ops` | ECC | Evidence-first current-state research workflow for ECC. | LOW |
| `returns-reverse-logistics` | ECC | Codified expertise for returns authorization, receipt and inspection, disposition decisions, refund processing, fraud detection, and warranty claims management. | LOW |
| `rules-distill` | ECC | Scan skills to extract cross-cutting principles and distill them into rules — append, revise, or create new rule files. | LOW |
| `rust-patterns` | ECC | Idiomatic Rust patterns, ownership, error handling, traits, concurrency, and best practices for building safe, performant applications. | LOW |
| `rust-testing` | ECC | Rust testing patterns including unit tests, integration tests, async testing, property-based testing, mocking, and coverage. | LOW |
| `safety-guard` | ECC | Guard against destructive operations with three modes: Careful intercepts dangerous commands (rm -rf, git push --force, DROP TABLE) for confirmation, Freeze locks writ... | LOW |
| `santa-method` | ECC | Multi-agent adversarial verification: two independent reviewers with the same rubric must both pass before output ships, with a fix-and-re-review convergence loop and... | LOW |
| `scientific-db-pubmed-database` | ECC | Direct PubMed and NCBI E-utilities search workflows for biomedical literature, MeSH queries, PMID lookup, citation retrieval, and API-backed literature monitoring. | LOW |
| `scientific-db-uspto-database` | ECC | USPTO patent and trademark data workflow for official record lookup, PatentSearch queries, TSDR checks, assignment data, and reproducible IP research logs. | LOW |
| `scientific-pkg-gget` | ECC | gget CLI and Python workflow for quick genomic database queries, sequence lookup, BLAST-style searches, enrichment checks, and reproducible bioinformatics evidence logs. | LOW |
| `scientific-thinking-literature-review` | ECC | Systematic literature-review workflow for academic, biomedical, technical, and scientific topics, including search planning, source screening, synthesis, citation chec... | LOW |
| `scientific-thinking-scholar-evaluation` | ECC | Structured scholarly-work evaluation for papers, proposals, literature reviews, methods sections, evidence quality, citation support, and research-writing feedback. | LOW |
| `security-bounty-hunter` | ECC | Hunt for exploitable, bounty-worthy security issues in repositories. | LOW |
| `skill-comply` | ECC | Visualize whether skills, rules, and agent definitions are actually followed — auto-generates scenarios at 3 prompt strictness levels, runs agents, classifies behavior... | LOW |
| `skill-host-compat` | ECC | Lint ECC skills for Codex/Cursor-safe frontmatter and Claude-only substitutions before a skill PR. | LOW |
| `skill-scout` | ECC | Search existing local, marketplace, GitHub, and web skill sources before creating a new skill. | LOW |
| `skill-stocktake` | ECC | Use when auditing Claude skills and commands for quality. | LOW |
| `social-graph-ranker` | ECC | Weighted social-graph ranking for warm intro discovery, bridge scoring, and network gap analysis across X and LinkedIn. | LOW |
| `social-publisher` | ECC | Agent-driven scheduling and publishing of social media posts across 13 platforms via SocialClaw. | LOW |
| `springboot-patterns` | ECC | Spring Boot architecture patterns, REST API design, layered services, data access, caching, async processing, and logging. | LOW |
| `springboot-security` | ECC | Spring Security best practices for authn/authz, validation, CSRF, secrets, headers, rate limiting, and dependency security in Java Spring Boot services. | LOW |
| `springboot-tdd` | ECC | Test-driven development for Spring Boot using JUnit 5, Mockito, MockMvc, Testcontainers, and JaCoCo. | LOW |
| `springboot-verification` | ECC | Run the full Spring Boot verification loop — Maven or Gradle build, SpotBugs, PMD, and Checkstyle static analysis, unit and Testcontainers integration tests with JaCoC... | LOW |
| `story-lifecycle` | ECC | Manage a file-based epic → story → sprint development loop without requiring an external project management tool. | LOW |
| `swift-actor-persistence` | ECC | Thread-safe data persistence in Swift using actors — in-memory cache with file-backed storage, eliminating data races by design. | LOW |
| `swift-concurrency-6-2` | ECC | Swift 6.2 Approachable Concurrency — single-threaded by default, @concurrent for explicit background offloading, isolated conformances for main actor types. | LOW |
| `swift-protocol-di-testing` | ECC | Protocol-based dependency injection for testable Swift code — mock file system, network, and external APIs using focused protocols and Swift Testing. | LOW |
| `swiftui-patterns` | ECC | SwiftUI architecture patterns, state management with @Observable, view composition, navigation, performance optimization, and modern iOS/macOS UI best practices. | LOW |
| `taste` | ECC | Creative-direction layer for music videos and short-form edits in the angelcore / cloud-trance / hyperpop family — a named-genre aesthetic vocabulary, mood + color + l... | LOW |
| `taste-application` | ECC | Generate new video against a distilled style pack and cut it into a finished piece - plan takes from the reference's cut rhythm, generate on fal, grade with the pack's... | LOW |
| `taste-distillation` | ECC | Measure a set of reference videos into a reusable style pack - colour grade as a 3D LUT, cut rhythm as a shot-length distribution, hero stills, screen-blend overlay pl... | LOW |
| `tasteforge-video` | ECC | Use for file-driven multimodal image, video, and 3D-asset discovery; taste interviews; distill or apply workflows; style-pack validation; editable EDL/FCPXML export; p... | LOW |
| `team-agent-orchestration` | ECC | Run team-based orchestration for agent squads: work items with owners and scope, agent Kanban state, branch isolation, control pane visibility, and merge gates. | LOW |
| `team-builder` | ECC | Interactive picker that discovers available agent personas via the claude agents command and agents/ markdown globs, groups them into domains, has the user select up t... | LOW |
| `terminal-opener` | ECC | Open an executable and its argument array in a visible terminal window through a reusable, shell-free launch plan with dry-run, JSON, capability detection, detached fa... | LOW |
| `terminal-ops` | ECC | Evidence-first repo execution workflow for ECC. | LOW |
| `test-collaboration` | ECC | Inventory and govern a project's test assets. | LOW |
| `tinystruct-patterns` | ECC | Expert guidance for developing with the tinystruct Java framework. | LOW |
| `token-card` | ECC | Render a token-usage stat card from local Claude Code, Codex, Gemini CLI, and OpenCode session logs and commit it into the repository as a file. | LOW |
| `ui-to-vue` | ECC | Use when the user has UI screenshots or design exports that need batch conversion into Vue 3 components, especially with Vant, Element Plus, or Ant Design Vue. | LOW |
| `uncloud` | ECC | Use when managing an Uncloud cluster — deploying services, configuring Caddy ingress, adding static proxy routes for non-cluster devices, publishing ports, scaling, in... | LOW |
| `unified-memory` | ECC | Share durable, inspectable context and handoffs between Claude, Codex, Hermes, Cursor, OpenCode, and other agents through the local ECC Memory Vault. | LOW |
| `unified-notifications-ops` | ECC | Operate notifications as one ECC-native workflow across GitHub, Linear, desktop alerts, hooks, and connected communication surfaces. | LOW |
| `video-editing` | ECC | AI-assisted video editing workflows for cutting, structuring, and augmenting real footage. | LOW |
| `videodb` | ECC | Ingest, index, search, edit, and monitor video and audio with the VideoDB Python SDK — upload from files, URLs, or RTSP feeds, build spoken and scene indexes with time... | LOW |
| `visa-doc-translate` | ECC | Translate visa document images (bank deposit, employment, income, and retirement certificates; HEIC, PNG, or JPG) into English via OCR and produce a bilingual PDF pair... | LOW |
| `vue-patterns` | ECC | Vue.js 3 Composition API patterns, component architecture, reactivity best practices, Pinia state management, Vue Router navigation, and Nuxt SSR patterns. | LOW |
| `windows-desktop-e2e` | ECC | E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. | LOW |
| `workspace-surface-audit` | ECC | Audit the active repo, MCP servers, plugins, connectors, env surfaces, and harness setup, then recommend the highest-value ECC-native skills, hooks, agents, and operat... | LOW |
| `x-api` | ECC | X/Twitter API integration for posting tweets, threads, reading timelines, search, and analytics. | LOW |
| `react-native-skills` (frontmatter name: `vercel-react-native-skills`) | agent-skills | React Native and Expo best practices for building performant mobile apps. | LOW |
| `agent-cost-report` (frontmatter name: `Agent Cost Report`) | claude-mem | Believable agent cost report for any period, default the last 7 full days PT, not counting today. | LOW |
| `babysit` | claude-mem | Watch a pull request or review cycle until it is ready to merge. | LOW |
| `build` | claude-mem | Fully automate a coding task with make-plan, do, and babysit. | LOW |
| `build-and-release` | claude-mem | Fully automate building and releasing a coding task. | LOW |
| `ccs-align` | claude-mem | Run the CCS Align seat's hourly breathing cycle — prove the local claude-mem worker is healthy, pull needle observations through search → timeline → get_observations,... | LOW |
| `childhood` | claude-mem | Babysit a shipped release after merge, publication, or deployment. | LOW |
| `cloud-sync` | claude-mem | Set up or check claude-mem cloud sync with cmem.ai Pro. | LOW |
| `design-is` | claude-mem | Audit a design against Dieter Rams' ten "Good design is..." principles, then hand off a /make-plan prompt for one of three outcomes — new design, refine design, or red... | LOW |
| `handoff` | claude-mem | Generate a HANDOFF.md that captures goal, current state, files touched, failed attempts, and next steps — so a fresh Claude session can continue exactly where this one... | LOW |
| `how-it-works` | claude-mem | Explain how claude-mem captures observations, when memory injection kicks in, and where data lives. | LOW |
| `knowledge-agent` | claude-mem | Build and query AI-powered knowledge bases from claude-mem observations. | LOW |
| `learn-codebase` | claude-mem | Prime a codebase by reading every source file in full. | LOW |
| `mode-creator` | claude-mem | Interactively create, install, activate, and verify custom claude-mem modes, including domain-specific observation types, concept tags, optional Telegram alerts, bot s... | LOW |
| `oh-my-issues` | claude-mem | Cluster a GitHub issue backlog by root cause into a small set of plan-master issues, redirect children with a standardized comment, and bundle architectural-fix PRs th... | LOW |
| `pathfinder` | claude-mem | Map a codebase into feature-grouped flowcharts, identify duplicated concerns across features, and propose a unified architecture. | LOW |
| `release` | claude-mem | Fully automate a release with version-bump and childhood. | LOW |
| `screenpipe` | claude-mem | Search screen and audio history recorded by Screenpipe and optionally save selected context into claude-mem. | LOW |
| `standup` | claude-mem | Facilitate a read-only standup across git worktrees, branches, or PRs to compare changes and produce one consolidation plan. | LOW |
| `timeline-report` | claude-mem | Generate a "Journey Into [Project]" narrative report analyzing a project's entire development history from claude-mem's timeline. | LOW |
| `version-bump` | claude-mem | Automated semantic versioning and release workflow for Claude Code plugins. | LOW |
| `weekly-digests` | claude-mem | Generate a serial week-by-week narrative digest of a project's full claude-mem timeline. | LOW |
| `what-the` | claude-mem | What the? | LOW |
| `wowerpoint` | claude-mem | Turn one document into a kawaii NotebookLM slide deck. | LOW |
| `diagnosing-superpowers` | superpowers | Use when a superpowers session went wrong and your human partner wants to know why — repeated work, ignored plans, stumbles, poor results, a skill that didn't fire, "i... | LOW |

# Top skills for the landing-page build

Digest for the 5 builder agents. Stack: React + Three.js (R3F) + GSAP/Lenis; brand: premium Indian spice D2C. Full detail lives in each skill folder under `.claude/skills/<name>/`. Also use the already-installed `gsap-*` and `threejs-*` skills for implementation APIs.

Conflict note: taste-skill is deliberately austere (no gradients, glass, shadows, monospace, eyebrows). A spice brand wants warmth, rich photography and 3D. Resolve it this way: adopt taste-skill's process, hierarchy, copy, imagery and motion-budget rules fully; where the brand itself needs a banned device (a gradient scrim, a soft shadow on a floating pack), keep it minimal, justify it in the report, and pass `--allow <rule>` to `inspect.mjs`.

## taste-skill (folder `taste-skill`, name `design-taste-frontend`)
- Process: read brief, inventory 8-12 things unique to the client (name meaning, regions, spices, rituals, packaging, labels), write the page as claims-with-proof (delete sections with no claim), deal 3 directions with `scripts/draw.mjs`, pick one, adopt it, do not blend with your default layout.
- Fill the idea sentence: "On this page, [something that belongs to the subject] becomes [the device]". Competitor test: if another spice brand fits in the blank, the idea is generic.
- Give the page ONE live thing built from real content (e.g. pick a spice and see the blend/heat, or a grind-size or masala builder); it must work with a thumb, have a no-JS fallback, never block reading.
- Copy: every headline <= 2 lines at every width (about 32 chars safe); one supporting sentence 32-48px below; one primary action as a real button on the first screen; first screen answers "what is it / what does it cost or do" in large type. Write full content in every section; thin sections lose.
- Never invent proof: no fake customers, reviews, press logos, business stats. Sample product names/prices are fine but must be listed for client confirmation.
- Type: only 2-3 sizes do the work (one huge, one small); display tracking -0.02 to -0.05em, leading 0.85-1.05; body 16-20px, leading 1.45-1.6, 45-75ch; max two typefaces; left-align by default, centre at most one moment; <= 5 sizes total.
- Layout: one grid, equal outer margins (16-32px), sections 120-240px apart, neighbouring sections never share a layout, no row of identical icon cards, no void taller than half a screen without something on the far side, every section has a heading, page has one `h1`.
- Colour: one ground, one ink, one accent; running text in full ink (not soft grey); separate surfaces by tone steps not lines/shadows; take colours from the subject (turmeric, chilli, cardamom, saffron, clay, brass) rather than the dealt palette if they clash; avoid violet/indigo and cream+terracotta "assistant palette" unless it is truly the brand.
- Imagery: floor of at least 4 real pictures (6-12 typical), one dominant hero image covering >= 40-50% of first screen; SVG does not count; order of preference: client's own, generated, open-collection finds (`scripts/assets.mjs`, credit them), drawn in code, type/colour only. Add one muted looping clip with a poster.
- Motion layer (step 9): at least 8 elements really move (warn < 16): one signature move, per-section staggered entrances (60-90ms, 16-32px rise + opacity, once), feedback on every control, one moving picture. Transform/opacity/clip-path only; `prefers-reduced-motion` keeps content, drops travel.
- Motion tells to avoid: same fade-up on every block, hover-lift on every card, bounce/elastic, meaningless infinite loops, preloaders/counters, custom cursors, scroll hijacking, scramble/typewriter text, content held at zero opacity.
- Gate: `lint.mjs`, `inspect.mjs` (1440/768/390; zero FAIL), `scenes.mjs` for scroll scenes; open every screenshot, write the critique per `references/critique.md`, fix top 3, max 3 rounds. Do not claim checks you did not run.

## scroll-craft (folder `scroll-craft`)
- Establish a brief first (vibe in 3-5 words, journey, energy curve, ONE remembered moment, one thing no site does, how far from premium-minimal, continuous world vs distinct scenes, existing assets); write it to a BRIEF.md.
- Write the journey as 4-7 beats (Recognition, Tension, Turn, Substance, Range, Commitment); every section serves a beat or is cut.
- Write the feeling curve before choosing devices; name one engineered peak that gets the most scroll room and the most asset budget; the act before it is quieter; no two adjacent acts with the same feeling.
- Use at least 4 device families and never the same one twice in a row: scrub (max 2), pin, pan, reveal (clip-path wipe), kinetic type, parallax, count, flow, drift. Total length should be earned; no filler pinning.
- Standing hero rule: build a dimensional hero with independent planes (background plate, subject, foreground, atmosphere) moving at visibly different rates with occlusion; headline between planes; shared contact anchors so objects do not float; real alpha cutouts (inspect the alpha), clean plates.
- Design a separate mobile composition (portrait crops, smaller type: step hero type down one rung below ~700px; touch-tuned smoothing; bigger tap targets).
- Hard bans: clay/low-poly default world, "scroll" cue/mouse icon, `01 / 06` counters, eyebrow on every heading, em dash in visible copy, centred copy in every act, full-frame dark overlay for contrast (scrim only where text sits), text baked into images, invented stats in counters, `transition: all`, animating width/height/top/left, gradient text/neon glow.
- One style preamble reused verbatim across all generated assets; look at every asset; encode scrub video with dense GOP (`scripts/encode.sh`); strip audio.
- Type/colour floor: 2 families max, tracking tightens as size grows, `text-wrap: balance` on headings, no pure `#000`, tinted secondary text, body contrast >= 4.5:1, one accent locked for the page. Warm cream + brass/clay is the default "artisan food" trap; spice brand should find a distinct palette from the product itself.
- Verify by scrolling: screenshots at 6 positions per act on desktop, 390px mobile and reduced-motion; read the contact sheet; report what a headless run could not verify (real phone video behaviour).
- Every build needs one bespoke signature move coded in the page (not a parameter tweak); log fingerprints so the 5 pages do not share grammar, nav, hero device, act shape, close pattern and signature move (differ on >= 4 of 6 dimensions between any two pages). Highly relevant: the 5 pages must be distinct from each other.

## unlazy (folder `unlazy`)
- Before building each page, write `GATES.md`: one observable outcome per gate, each runnable gate with indented `CHECK:` and `EXPECT:`; lint with `scripts/gate-lint.mjs`.
- Treat CHECK lines as code: view with `gate-check.mjs --status`, approve only commands you understand (`--approve`), re-run with `--reverify` after delegated work.
- Suggested gates per page: `npm run build` exits 0; no console errors in a headless load; Lighthouse/CWV budget; screenshots exist at 1440/768/390 and reduced-motion; every section has an `h1`/heading; no placeholder text (`lorem`, `TODO`); image alt present; bundle size limit for Three.js chunk.
- Four passes per leaf: complete, expert re-read (replace the cheap version), hunt defects, polish until a clean pass. No placeholders or deferred remainder.
- Never silently drop an impossible gate: `ABANDON: <id> <reason>`, which forces a handoff. Re-measure every number before the final report.
- For 5 parallel builders: PLAN with Depth Tree, each leaf has exact file ownership (`OWNS:`) so builders do not collide; parent verifies each leaf.
- Do not install the Stop hook without user consent.

## react-best-practices (folder `react-best-practices`, vercel)
- Priority order: eliminate waterfalls (CRITICAL), bundle size (CRITICAL), server perf, client fetching, re-renders, rendering, JS micro-perf.
- Import directly, avoid barrel files (`bundle-barrel-imports`); this matters for three/drei/lucide.
- Lazy-load heavy components (Three.js canvas, GSAP plugins) with dynamic import (`bundle-dynamic-imports`); defer analytics until after hydration; preload on hover/focus.
- Promise.all for independent async work; start promises early, await late; Suspense boundaries to stream.
- Re-render hygiene: derive state during render rather than in effects, functional setState, lazy state init, hoist non-primitive default props, memoize expensive subtrees, do not subscribe to state only used in callbacks.
- Rendering: `content-visibility: auto` for long below-the-fold sections, hoist static JSX, avoid hydration flicker, animate an SVG wrapper not the SVG itself, trim SVG precision, use resource hints, `defer`/`async` scripts.
- Use passive listeners for scroll/touch handlers; dedupe global listeners; use `requestIdleCallback` for non-urgent work.

## web-design-guidelines (folder `web-design-guidelines`)
- Run it as a final audit on finished component files; it fetches the current Web Interface Guidelines (needs network/WebFetch) and reports `file:line` findings. Fix all findings before sign-off.

## composition-patterns (folder `composition-patterns`)
- No boolean-prop proliferation: use explicit variant components and compound components (e.g. `<Hero.Root><Hero.Media/><Hero.Copy/></Hero.Root>`).
- Lift state into providers; the provider is the only place that knows how state is stored; expose `{state, actions, meta}`.
- Prefer `children` over render props; React 19: `ref` as a prop, `use()` instead of `useContext`. Good fit for shared section kits across the 5 pages.

## react-view-transitions (folder `react-view-transitions`)
- Animate only when it communicates spatial continuity: shared element (product tile to product detail), Suspense reveal, list reorder, enter/exit, route change, in that priority.
- Forward/back navigation uses typed transitions (`addTransitionType`); lateral navigation uses a plain fade. Needs React canary outside Next.js. Unsupported browsers skip it gracefully, so it is safe progressive enhancement.

## motion-foundations / motion-patterns / motion-advanced (ECC)
- Use `motion/react` only (never mix with `framer-motion`); every file importing it needs `"use client"`. Skip if the project standardises on GSAP; do not mix both for the same element.
- All durations/easings come from a shared `motionTokens`; all springs from a shared `springs` map (snappy, gentle, bouncy, instant, release); no inline magic numbers.
- Motion must guide attention, communicate state or preserve continuity; otherwise remove it.
- Never animate layout properties (width/height/top/left/margin/padding); transform and opacity only.
- Reduced motion overrides everything: transforms off; opacity fades <= 0.2s only. Gate with `shouldAnimate()` (also off for low-end devices and off-screen elements).
- SSR safety: `initial` must equal the server output; never read `window` at module level.
- Patterns available: button feedback, modal, toast, stagger, page transitions, exit animations, scroll, layout; advanced: gestures, text animation, SVG path draw, `useAnimate` sequences.

## frontend-design-direction (ECC)
- Pick direction before coding: purpose, audience, tone, one memorable detail, constraints; match the domain (a launch/brand page can be expressive).
- Record product surface, primary action, hierarchy, target viewports and a reference observation per key choice; make constraints checkable.
- Cover content states: loading, empty, error, partial, success (cart, forms, image loading).
- Use CSS variables/tokens; keep palettes multi-dimensional; use real/generated visual assets for product-led UI.

## make-interfaces-feel-better (ECC)
- Concentric radius: outer = inner + padding. Optical (not geometric) alignment for icons/arrows.
- Borders for separation/focus, subtle layered transparent shadows for floating layers only.
- `text-wrap: balance` on headings, `pretty` on short body; `font-variant-numeric: tabular-nums` for prices/counters.
- Antialiased font smoothing on root; image outlines for edge definition; larger hit areas (>= 44px touch); proper hover/active/focus/disabled states on every control.

## design-system (ECC)
- Extract tokens (colour, type, spacing, radius, shadow, breakpoints) into `design-tokens.json` + CSS variables + `DESIGN.md` rationale; run its 10-dimension audit and AI-slop flags. Do this once per page (or one shared base + per-page overrides) before building sections.

## react-performance / react-patterns / frontend-patterns (ECC)
- React 18/19 hook discipline, server/client boundaries, Suspense + error boundaries, state decision trees, accessibility-first composition; mirrored Vercel perf rules (see react-best-practices).
- Keep the R3F `<Canvas>` as a client-only lazy island; do not re-render it from React state each frame (use refs, `useFrame`, store selectors).

## accessibility / frontend-a11y (ECC)
- WCAG 2.2 AA: contrast 4.5:1 body / 3:1 large and controls, visible focus, keyboard reachability, target size >= 24px (aim 44px), semantic landmarks/headings, alt text, labelled forms.
- Provide a static/poster fallback for WebGL and honour `prefers-reduced-motion` (stop autoplay video, freeze 3D camera moves, remove parallax travel).
- Menus, dialogs, tabs, carousels: trap/restore focus, Escape closes, ARIA only where native elements cannot do the job.

## browser-qa (ECC)
- Post-build verification via Playwright/Chrome: console-error and Core Web Vitals smoke check (LCP, INP, CLS), screenshots at three breakpoints, axe-core audit, interaction tests, ending with a SHIP / DO-NOT-SHIP verdict. Pair with unlazy gates.

## Medium-priority skills worth loading when relevant
- `seo`: titles/meta, JSON-LD Product/Organization/FAQ schema, sitemap, CWV.
- `vite-patterns`: chunk splitting (`manualChunks` for three), env, asset handling, pre-bundling.
- `nextjs-turbopack`, `vercel-optimize`, `deploy-to-vercel`: if deploying on Next.js/Vercel.
- `superpowers` set: `dispatching-parallel-agents`, `subagent-driven-development`, `writing-plans`, `verification-before-completion` for orchestrating the 5 builders.
- `brand-voice`, `article-writing`, `content-engine`: spice storytelling copy; `fal-ai-media`, `remotion-video-creation`: generated imagery/video (paid APIs, ask first).

## Perf and motion quick rules (consolidated)
- Animate transform/opacity/clip-path only; `will-change` only on elements about to animate; pause loops off-screen and when the tab is hidden.
- Easing: strong ease-outs (`cubic-bezier(.16,1,.3,1)` expo, `.22,1,.36,1`), in-out only for wipes/travel; durations: hover 200-300ms, small UI 300-450ms, reveals 600-1000ms, big openings 1100-1600ms; staggers 20-40ms per char, 75-120ms per line, 50-100ms per list item.
- Scroll-linked motion locked to the scrollbar (no smoothing or lerp 0.1-0.14 via Lenis; off for touch and reduced motion). Reveals fire once at 80-95% viewport entry.
- First screen (headline, image, CTA) must be in the HTML and paint immediately; no preloader gating content; lazy-load Three.js after first paint with a poster image in place.
- Three.js: cap DPR (e.g. `Math.min(devicePixelRatio, 2)`, lower on mobile), on-demand rendering when idle, compress textures (KTX2/WebP/AVIF), Draco/meshopt for GLB, dispose geometries/materials, one canvas per page where possible, pause when off-screen, fallback image on low-end/no-WebGL.
