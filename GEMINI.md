# Agent Execution Protocol

All AI coding assistants must follow this protocol. Read the applicable rule file before beginning work in that domain.

## 1. Absolute Core Rules (CRITICAL - HIGHEST PRIORITY)

- **NEVER MODIFY CODE OR EXECUTE WRITE TOOLS WITHOUT EXPLICIT USER INSTRUCTION**:
  - Only edit files, create files, or run modifying commands when the user explicitly instructs you to do so (e.g., "작업해", "수정해줘", "진행해", "fix this", "implement this").
  - When the user asks a question, expresses doubt, or reports an observation/issue (e.g., "~왜 이래?", "~뜨는데?", "why does this happen?"), **PROVIDE ONLY AN EXPLANATION AND TEXT ANSWER**. Never touch the code or make tool calls to edit files.
- **EXPLAIN AND PROPOSE FIRST, AWAIT CONFIRMATION**:
  - Clearly explain the cause and the proposed solution first. Do NOT start implementing until the user explicitly approves.
- **NEVER PUSH AUTOMATICALLY UPON COMMIT**:
  - Commit locally only after explicit approval. Never run `git push` unless the user explicitly requests a push.
- **STRICT ADHERENCE TO PRD, GHOST DESIGN SYSTEM & SHADCN SKILL**:
  - Before writing or modifying any UI, always thoroughly refer to and comply with `./PRD.md` (especially Chapter 11 for Common Components), `./ghost.design.md`, and the `/shadcn` agent skill (`.agents/skills/shadcn/SKILL.md`).
  - Mandatory reuse of existing common components (`Tabs`, `FormHeader`, `SelectableChip`, `SegmentedControl`, `NumericInput`, `DatePicker`, `Calendar`, `Popover`, `InfoCard`, `SummaryCards`) instead of writing duplicate inline tags.
  - Never write raw Tailwind classes or inline styles into `./PRD.md`; keep PRD focused on functional logic and component architecture.
- **MANDATORY TDD SKILL FOR LOGIC, FORMULAS & UTILITIES**:
  - When implementing or modifying mathematical formulas, financial/medical/date calculation logic, business rules, or data transformation utilities, ALWAYS refer to and follow the `/tdd` agent skill (`.agents/skills/tdd/SKILL.md`).
  - Strictly enforce the Red-Green-Refactor cycle: write unit tests first before writing production code, verify test failures, implement code to pass tests, and ensure 100% test suite pass rate without regressions.
- Analyze the request and relevant code before implementing feature work, spec changes, or bug fixes.
- Update ./PRD.md before changing code when the request affects the product or behavior.
- Ask the user when the PRD impact is unclear, and wait for explicit approval before implementation.
- Follow [rules/language-markdown.md](rules/language-markdown.md) for user-facing responses, generated documentation, and source comments.
- Follow [rules/security.md](rules/security.md) for sensitive data and destructive operations.
- Follow [rules/git-workflow.md](rules/git-workflow.md) for commits and releases.
- Keep project documentation in Markdown, use readable names, and log detailed errors.

## 2. Workflow

### Step 1: Analyze

- Classify the request as a feature, bug fix, or spec change.
- Review the relevant code, data structures, and dependencies.
- For external libraries, frameworks, SDKs, APIs, CLIs, or configuration systems, check official documentation or Context7-style MCP tools first.
- Do not guess unknown behavior. Validate API usage, versions, and recommended patterns against authoritative references and examples.

### Step 2: Update the PRD

- Update ./PRD.md before touching code when the request changes requirements, data structures, business logic, or expected behavior.

### Step 3: Get User Approval

- Share the updated PRD with the user and wait for approval.
- Do not begin implementation until the user explicitly approves.

### Step 4: Implement and Verify

- Implement according to the approved PRD.
- For calculation algorithms, formulas, and utility logic, strictly apply the `/tdd` skill (`.agents/skills/tdd/SKILL.md`) test-first approach.
- For frontend work, read [rules/frontend-mobile.md](rules/frontend-mobile.md) and validate the screen and UX flow before backend integration.
- Batch jobs, ETL tasks, internal schedulers, CLI-only tools, and pure backend services may follow an API- or logic-first approach.
- Validate with all unit tests (`npm test -- --run`) and production build checks (`npm run build`) before finalizing.


### Step 5: Final Review and Commit

- Share the change summary and scope with the user.
- Commit only after final confirmation.
- Apply [rules/git-workflow.md](rules/git-workflow.md) for commit and versioning details.

## 3. Rule Priority

- The core rules in this file apply to every task.
- If a detailed rule conflicts with a task requirement, surface the conflict and confirm the intended behavior before proceeding.

## 4. Mandatory SEO Checklist (Definition of Done for New Calculators / Pages)

Whenever adding a new calculator, page, or modifying routes, the following SEO requirements MUST be satisfied before finalizing the task:
1. **Sitemap Registration**: Add the new canonical endpoint (`<loc>`, `<changefreq>`, and `<priority>`) to `public/sitemap.xml`.
2. **Dynamic Metadata & Structured Data**: Add route configuration in `src/components/common/PageMetaUpdater.tsx` (`PAGE_SEO_DATA`) specifying unique `title`, `description`, `keywords`, and JSON-LD `applicationCategory`.
3. **Semantic Crawling & Internal Linking**: Ensure all navigation links (dashboard cards in `HomeApp.tsx`, sidebar drawer menu in `SidebarDrawer.tsx`, and footer navigation) render semantic `<Link>` / `<a href>` elements so search engine crawlers can index the complete site graph without relying on JavaScript `onClick` handlers.
4. **Verification**: Verify that the dynamic canonical tag correctly updates upon route transition and prevents duplicate URL penalties.
