# Git and Release Rules

Read this file when committing changes or preparing a release.

## 1. Commit and Release Protocol
- Share the final change summary and scope with the user.
- Commit only after the user gives final confirmation.
- **NEVER PUSH AUTOMATICALLY UPON COMMIT**: Do NOT run `git push` automatically. Only push when the user explicitly requests it.
- Use the commit format `type: Korean summary (vX.Y.Z)`.

## 2. Strict SemVer (Semantic Versioning) Standards (`MAJOR.MINOR.PATCH`)
버전은 끝자리(+0.0.1)만 기계적으로 올리는 것을 엄격히 금지하며, 작업의 성격(commit type)에 따라 다음 규칙을 준수한다:

1. **MAJOR (X.0.0)**:
   - 이전 버전과 호환되지 않는 전면적 아키텍처 개편, 전체 플랫폼 리뉴얼 등 파괴적 변경(Breaking Change).
2. **MINOR (1.X.0)**:
   - **`feat`**: 신규 계산기 모듈 추가, 주요 신규 기능 신설(예: 즐겨찾기, PWA 대규모 개편 등).
   - 마이너 버전이 증가할 때는 PATCH 자리를 반드시 `0`으로 리셋한다 (예: `1.14.2` ➔ `1.15.0`).
3. **PATCH (1.X.Y)**:
   - **`fix`, `refactor`, `docs`, `style`, `chore`**: 버그 수정, UI/UX 디테일 폴리싱, 리팩토링, 문서 갱신, 성능 개선.
   - 직전 패치 번호에서 1 증가한다 (예: `1.14.0` ➔ `1.14.1`).

## 3. Mandatory Version Synchronization
- 버전을 올릴 때는 다음 파일들의 버전을 예외 없이 100% 동일하게 일괄 동기화한다:
  1. `package.json` (`version`)
  2. `src/config/site.ts` (`siteConfig.version`)
  3. `src/config/site.test.ts`
  4. `CHANGELOG.md`
  5. `README.md` (버전 뱃지)
  6. `PRD.md` (헤더 버전 및 참조)

