# AIOS Decisions
*Rule: Append only. Never delete entries. Most recent at top.*

---

## 2026-06-17

**Decision: Use local JSON for v0.1 storage**
SQLite adds migration complexity. Local JSON is readable, editable, Git-friendly. Switch to Supabase when query complexity demands it.

**Decision: No authentication in v0.1**
AIOS v0.1 runs locally on Jim's machine. Auth adds complexity with no current benefit. Add when AIOS runs on a shared server.

**Decision: CEO Dashboard is always the first screen**
`/` is always the command center. Every other module is one click away from it.

**Decision: Constitution lives in /aios-core/AIOS_CONSTITUTION.md**
The Constitution is a permanent file. It is also rendered at `/constitution` in the UI. Both locations are permanent.

**Decision: Agent hierarchy uses industry-standard terms**
Orchestrator Agent → Specialized Agent → Tool / Skill. These terms map to how the AI industry actually works.

**Decision: Roadmap has 5 phases**
Phase 0: AIOS foundation. Phase 1: LocalSEOAEOPro demo. Phase 2: PingClose launch. Phase 3: First $10k. Phase 4: Full platform.
