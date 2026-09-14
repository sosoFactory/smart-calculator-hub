# Git and Release Rules

Read this file when committing changes or preparing a release.

- Share the final change summary and scope with the user.
- Commit only after the user gives final confirmation.
- **NEVER PUSH AUTOMATICALLY UPON COMMIT**: Do NOT run `git push` automatically. Only push when the user explicitly requests it.
- Use the commit format `type: Korean summary`.
- Follow `MAJOR.MINOR.PATCH` for version numbers.
- Record changes by type in `CHANGELOG.md`.
- If the project has a `package.json`, synchronize its version with the latest `CHANGELOG.md` version.
