# Agent Execution Protocol

All AI coding assistants must strictly follow this protocol. Always consult applicable domain rules in `rules/`, design specifications, and agent skills before implementation.

---

## 1. Core Principles

### 1.1 Deliberate & Thorough Execution (Anti-Lazy Protocol)
- **Deep Thinking over Shortcuts**:
  - Think deeply about the root cause, systemic architecture, and user intent before acting.
  - Strictly prohibit superficial hacks, lazy regex/script workarounds, and hasty, unverified edits.
  - Approach every task with craftsmanship and thoroughness, even for a single-line change.
- **Ask When Unclear — No Guessing**:
  - Whenever requirements, user intent, naming conventions, or architectural impacts are ambiguous, **NEVER GUESS OR ASSUME ARBITRARILY**.
  - Always proactively ask the user for clarification before executing or writing code.
- **No Scope Truncation or Deception**:
  - Never arbitrarily narrow down the instructed task scope (e.g., modifying only a few recent entries while claiming the whole file is updated).
  - When asked to summarize documentation, synthesize key functional changes with substance rather than deleting content and leaving only hollow headers.
- **Documentation Integrity**:
  - Keep project documentation in clean Markdown, use readable names, and log detailed, structured errors.

### 1.2 Safety & Authority (Write Permission Control)
- **Strict Read-Only Mode for Questions and Observations**:
  - When the user asks a question, expresses doubt, or reports an issue/observation (e.g., "~왜 이래?", "~뜨는데?", "why does this happen?"), **PROVIDE ONLY AN EXPLANATION AND TEXT ANSWER**.
  - NEVER call write tools, modify code, or run modifying shell commands without explicit user instruction (e.g., "작업해", "수정해줘", "진행해", "fix this", "implement this").
  - Always explain the diagnosis and proposed solution first, and await explicit user confirmation.
- **Never Push Automatically upon Commit**:
  - Make commits locally only after user review and approval.
  - NEVER run `git push` automatically. Push to remote only when the user explicitly requests it.

### 1.3 Engineering & Quality Standards
- **Mandatory TDD for Logic & Utilities**:
  - When implementing or modifying mathematical formulas, financial/medical/date calculation logic, business rules, or utilities, strictly apply the `/tdd` skill (`.agents/skills/tdd/SKILL.md`).
  - Strictly enforce the Red-Green-Refactor cycle: write unit tests first before writing production code, verify test failures, implement code to pass tests, and ensure 100% test suite pass rate (`npm test -- --run`) without regressions.
- **Strict Semantic Versioning (`MAJOR.MINOR.PATCH`)**:
  - New calculator modules or major features (`feat`) MUST increment `MINOR` and reset `PATCH` to 0.
  - Bug fixes, refactoring, and UI polish (`fix`, `refactor`) increment `PATCH`.
  - Always synchronize version across `package.json`, `src/config/site.ts`, `src/config/site.test.ts`, `CHANGELOG.md`, `README.md`, and `PRD.md`.
- **Design System Single Source of Truth**:
  - Before writing or modifying UI, always comply with `./ui-ux.md` (component layout & interaction) and `./ghost.design.md` (typography & color tokens), utilizing skills `.agents/skills/shadcn/SKILL.md` and `.agents/skills/frontend-design/SKILL.md`.
  - Mandatory reuse of standard components defined in `./ui-ux.md` instead of writing duplicate inline tags.
  - Never write raw Tailwind classes or inline styles into `./PRD.md`; keep PRD focused on functional logic and component architecture, and place UI/UX/layout specifications in `./ui-ux.md`.
- **Archetype-First UI Development (원형 복제 원칙)**:
  - 신규 UI/계산기 구현 시 백지에서 임의로 창작하는 행위를 금지한다.
  - 기존 검증된 표준 페이지(`SalaryApp` 등)를 '기준 원형(Archetype)'으로 삼아 구조·컴포넌트를 복제한 뒤 도메인 로직만 치환한다.

### 1.4 Domain Governance & Rules
- Consult domain rules before performing specialized tasks:
  - [rules/language-markdown.md](rules/language-markdown.md): Standards for user-facing responses, generated documentation, and source comments.
  - [rules/security.md](rules/security.md): Handling sensitive data, environment configurations, and destructive operations.
  - [rules/git-workflow.md](rules/git-workflow.md): Commit messages, branching, and release conventions.
  - [rules/frontend-mobile.md](rules/frontend-mobile.md): Mobile-first viewport standards and screen validation flows.
- For external libraries, frameworks, SDKs, or APIs, check official documentation and Context7 tools first. Do not guess unknown behaviors.

---

## 2. Standard Workflow

1. **Step 1: Analyze**
   - Classify request (feature, bug fix, refactoring, docs) and inspect relevant code, data structures, and dependencies.
   - Validate API usage and recommended patterns against authoritative documentation.
2. **Step 2: Propose & Update PRD**
   - When requirements, data structures, business logic, or behaviors change, update `./PRD.md` before touching code.
   - Clearly explain the diagnosis and proposed solution to the user.
3. **Step 3: Await Confirmation**
   - Wait for explicit user approval before touching any code or making file edits.
4. **Step 4: Implement & Verify**
   - Implement according to the approved PRD using TDD.
   - Validate with all unit tests (`npm test -- --run`) and production build checks (`npm run build`).
   - **시각적·구조적 동등성 검증**: 개발 서버에서 기준 원형 페이지와 신규 페이지를 렌더링하여 공용 컴포넌트, 여백, 레이아웃의 시각적 일치를 직접 확인한다.
5. **Step 5: Review & Local Commit**
   - Share change summary with the user and commit locally only after confirmation. Never push automatically.

---

## 3. Rule Priority

- The core rules in this protocol apply to every task.
- If a detailed rule conflicts with a task requirement, surface the conflict and confirm the intended behavior with the user before proceeding.

---

## 4. Definition of Done for New Calculators / Pages

Whenever adding a new calculator, page, or route, the following must be satisfied before completion:
1. **Sitemap Registration**: Add canonical endpoint (`<loc>`, `<changefreq>`, `<priority>`) to `public/sitemap.xml`.
2. **SEO Metadata & Structured Data**: Register route in `src/components/common/PageMetaUpdater.tsx` (`PAGE_SEO_DATA`) with unique `title`, `description`, `keywords`, and JSON-LD schema.
3. **Semantic Crawling & Linking**: Ensure home cards (`HomeApp.tsx`), sidebar (`SidebarDrawer.tsx`), and footer render semantic `<Link>` / `<a href>` elements.
4. **Canonical Tag Verification**: Ensure the dynamic canonical tag updates correctly upon route transition.
5. **Visual & Structural Parity**: 기준 원형(`SalaryApp` 등)과 대조하여 공용 컴포넌트(`FormHeader`, `ResultHeroCard`, `SubMetricCard`, `Table`), 여백, 정보 구조의 일치를 개발 서버 화면에서 검증 완료.
