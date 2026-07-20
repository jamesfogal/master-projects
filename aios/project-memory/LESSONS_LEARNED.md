# Lessons Learned

## 2026-06-22 — Documentation is not implementation

Documentation is not implementation. AIOS must never claim a process exists until enforcement exists in code or an executable workflow.

**Context:** `PROCESS_ENGINE.md` (now `PROCESS_ENGINE_SPEC.md`) described a 13-state pipeline, mandatory skill execution, and evidence requirements. None of it was backed by code — no API route, script, or hook read `processState` or blocked a transition. `data/evidence.json` and `data/skill-executions.json` recorded Builder assertions formatted to look like independent verification, including a "Process Engine" rejection of a Builder-authored certificate that was itself written by the Builder. Those files were removed from the working tree because they implied enforcement that did not exist.

**Rule going forward:** a markdown spec may describe a process. It may not be cited as evidence that the process runs. Evidence records may only be created once there is a piece of code that produced them independent of the Builder's own narration.
