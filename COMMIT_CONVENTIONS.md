# 📝 Semantic Commit Conventions

**Project:** PFA-TallerProyectos2  
**Standard:** Conventional Commits v1.0.0  
**Enforcement:** Git Flow + Branch Protection  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Commit Format](#commit-format)
3. [Commit Types](#commit-types)
4. [Scope Definitions](#scope-definitions)
5. [Examples by HU](#examples-by-hu)
6. [Best Practices](#best-practices)
7. [Validation & Tooling](#validation--tooling)

---

## Overview

Semantic commits provide machine-readable commit messages that enable:
- ✅ **Automatic changelog generation** from commit history
- ✅ **Semantic versioning** (major.minor.patch)
- ✅ **Clear project history** - understand what changed and why
- ✅ **Git archaeology** - easily find related commits
- ✅ **CI/CD integration** - trigger builds based on commit types

**Impact on Grade:**
- GitHub commits follow semantic conventions: **+1.0 pt** (Consigna 3.2)
- Git Flow branching implemented: **+2.0 pts** (Consigna 3.1)
- **Total: +3.0 pts → SOBRESALIENTE**

---

## Commit Format

### Basic Structure

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Detailed Format

```
<type>(<scope>): <subject> [#issue-number]

[Body: optional, 72 characters per line]

[Footer: BREAKING CHANGE or other refs]
```

### Rules

1. **Type** (required)
   - Must be one of: `feat`, `fix`, `test`, `docs`, `style`, `refactor`, `perf`, `chore`
   - Lowercase only

2. **Scope** (optional but recommended)
   - Component or module affected: `HU-XX`, `auth`, `csp`, `api`, `db`, `ui`
   - Lowercase, hyphenated
   - For multiple scopes: use semicolon `HU-05;or-tools`

3. **Subject** (required)
   - Imperative mood: "add" not "added" or "adds"
   - No period at end
   - Max 50 characters
   - First letter lowercase
   - No issue number here (use footer)

4. **Body** (optional, max 72 chars/line)
   - Motivation for the change
   - Contrast with previous behavior
   - Reference related issues: "Fixes #123"

5. **Footer** (optional)
   - `BREAKING CHANGE:` section for API-breaking changes
   - `Fixes #123` or `Closes #123` for issue linking
   - Co-authored-by for pair programming

---

## Commit Types

### 1. **feat** - New Feature
Adding new functionality aligned with user stories.

```bash
feat(HU-XX): brief description of feature
```

**When to use:**
- ✅ New API endpoint
- ✅ New algorithm implementation
- ✅ New validation rule
- ✅ New UI component

**Semantic impact:** MINOR version bump (0.0.0 → 0.1.0)

**Examples:**
```
feat(HU-01): add docente CRUD endpoints with validation
feat(HU-05): implement CSP solver with OR-Tools integration
feat(HU-08): create schedule visualization grid component
feat(auth): add JWT token refresh mechanism
```

### 2. **fix** - Bug Fix
Fixing a broken feature or unintended behavior.

```bash
fix(HU-XX): brief description of fix
```

**When to use:**
- ✅ Production bug fix
- ✅ Failing test fix
- ✅ Logic error correction
- ✅ Performance regression

**Semantic impact:** PATCH version bump (0.1.0 → 0.1.1)

**Examples:**
```
fix(HU-05): resolve timeout overflow in large dataset CSP
fix(HU-03): correct room capacity validation logic
fix(auth): handle token expiration in middleware
fix(api): return correct HTTP status codes for edge cases
```

### 3. **test** - Testing
Adding or modifying tests; no production code changes.

```bash
test(HU-XX): brief description of test addition
```

**When to use:**
- ✅ New test cases
- ✅ Test coverage improvements
- ✅ Integration test additions
- ✅ Performance test suites

**Semantic impact:** No version bump (test coverage only)

**Examples:**
```
test(HU-05): add 25 test cases for CSP hard constraints
test(HU-01): add docente validation edge cases
test(integration): add end-to-end schedule generation test
test(performance): benchmark CSP solver with 1000+ courses
```

### 4. **docs** - Documentation
Documentation changes without code modifications.

```bash
docs: brief description of documentation change
```

**When to use:**
- ✅ README updates
- ✅ API documentation
- ✅ Architecture guides
- ✅ User manuals
- ✅ Code comments for complex logic

**Semantic impact:** No version bump

**Examples:**
```
docs: update README with architecture diagram
docs: add API endpoint documentation for /horarios endpoint
docs: document CSP constraint mapping to HUs
docs(HU-05): explain OR-Tools solver configuration
```

### 5. **style** - Code Style
Non-functional formatting changes (whitespace, semicolons, etc.)

```bash
style: brief description of style change
```

**When to use:**
- ✅ Code formatting (Prettier, ESLint)
- ✅ Import organization
- ✅ Indentation fixes
- ✅ Variable naming consistency

**Semantic impact:** No version bump

**Note:** Run style fixes separately from logic changes.

**Examples:**
```
style: run prettier on entire codebase
style: fix eslint warnings in server/
style(HU-05): format CSP solver code blocks
```

### 6. **refactor** - Refactoring
Code changes that don't fix bugs or add features.

```bash
refactor(HU-XX): brief description of refactoring
```

**When to use:**
- ✅ Code restructuring
- ✅ DRY principle application
- ✅ Pattern improvements
- ✅ Test refactoring (logic unchanged)

**Semantic impact:** No version bump

**Examples:**
```
refactor(HU-05): extract constraint validation to separate module
refactor(api): consolidate error handling middleware
refactor(HU-08): split visualization component into smaller pieces
```

### 7. **perf** - Performance
Code changes that improve performance.

```bash
perf(HU-XX): brief description of performance improvement
```

**When to use:**
- ✅ Algorithm optimization
- ✅ Database query optimization
- ✅ Memory reduction
- ✅ Caching implementation

**Semantic impact:** No version bump (unless part of feature)

**Examples:**
```
perf(HU-05): optimize CSP variable initialization from 2s to 0.5s
perf(api): add pagination to docente listing endpoint
perf(HU-08): implement virtual scrolling for large schedules
```

### 8. **chore** - Maintenance
Maintenance tasks not affecting production code.

```bash
chore: brief description of maintenance task
```

**When to use:**
- ✅ Dependency updates
- ✅ Build script changes
- ✅ Configuration changes
- ✅ CI/CD pipeline updates

**Semantic impact:** No version bump

**Examples:**
```
chore(deps): update express from 4.18 to 4.19
chore: add github actions workflow for CI/CD
chore(build): optimize webpack configuration
chore: configure ESLint and Prettier
```

---

## Scope Definitions

### By Component

| Scope | Description | Example HU |
|-------|-------------|-----------|
| `HU-01` | Docente Management | CRUD operations |
| `HU-02` | Course Management | CRUD, co-requisites |
| `HU-03` | Room Management | CRUD, types, capacity |
| `HU-04` | Availability | Docente scheduling |
| `HU-05` | CSP Motor | Solver, constraints |
| `HU-06` | Conflict Detection | HC validation |
| `HU-07` | Soft Constraints | SC optimization |
| `HU-08` | Visualization | UI grid, calendar |
| `HU-09` | Export | PDF, CSV generation |
| `HU-10` | Authentication | JWT, login |
| `HU-11` | Access Control | Roles, permissions |
| `HU-12` | Testing | Test suites |
| `HU-13` | Improvements | Polish, optimization |
| `HU-14` | Final Integration | System assembly |

### By Technical Layer

| Scope | Description | Files |
|-------|-------------|-------|
| `auth` | Authentication | server/auth/*, middleware |
| `api` | API routes | server/routes/*, controllers |
| `db` | Database | server/models/*, queries |
| `csp` | CSP solver | server/CSPScheduler.js |
| `or-tools` | OR-Tools integration | server/or-tools/* |
| `ui` | Frontend components | client/src/components/* |
| `tests` | Test files | **/*.test.js |
| `config` | Configuration | .env, webpack, etc |
| `deps` | Dependencies | package.json |

### Combination Example

```bash
# Scope for CSP with OR-Tools specific work
feat(HU-05;or-tools): implement constraint propagation with AC-3

# Scope for API affecting multiple HUs
feat(api): add schedule generation endpoint for HU-05
```

---

## Examples by HU

### HU-01: Docente Management (Sprint 1)

```bash
# Add CRUD endpoints
feat(HU-01): implement docente CRUD endpoints with validation

# Add database model
feat(HU-01;db): create docente schema with availability fields

# Add tests
test(HU-01): add 8 test cases for docente validation

# Fix validation bug
fix(HU-01): correct email validation regex pattern

# Documentation
docs(HU-01): document docente API endpoints in README
```

### HU-05: CSP Motor (Sprint 3 - CRITICAL)

```bash
# Initial variable setup
feat(HU-05): initialize 8750 boolean variables for course-teacher-room-slot

# Add hard constraints
feat(HU-05): implement HC-1 unique assignment constraint

feat(HU-05): implement HC-2 through HC-4 docent/room overlap prevention

feat(HU-05): implement HC-5 through HC-7 capacity and availability checks

# Add soft constraints
feat(HU-05): implement SC-1 course distribution optimization

feat(HU-05): implement SC-2 through SC-5 soft constraint scoring

# OR-Tools integration
feat(HU-05;or-tools): integrate Google OR-Tools solver with MRV heuristic

feat(HU-05;or-tools): configure AC-3 constraint propagation

# Performance optimization
perf(HU-05): optimize constraint initialization from 3s to 0.5s

# Comprehensive testing
test(HU-05): add HC-1 to HC-7 hard constraint test cases

test(HU-05): add SC-1 to SC-5 soft constraint optimization tests

test(HU-05): add edge cases and stress testing for 1000+ courses

test(HU-05): add performance benchmark suite (5s timeout target)

# Bug fixes
fix(HU-05): resolve timeout overflow for datasets >100 courses

fix(HU-05): correct soft constraint cost multiplier calculation

# Refactoring
refactor(HU-05): extract constraint validation to separate modules

refactor(HU-05): improve solver readability with helper functions

# Documentation
docs(HU-05): document CSP model architecture and constraint definitions
```

### HU-08: Visualization (Sprint 5)

```bash
# Component structure
feat(HU-08): create schedule grid React component

feat(HU-08): implement time-slot coloring by status

feat(HU-08): add filter functionality for courses/teachers

# Data binding
feat(HU-08;api): create endpoint to fetch generated schedules

feat(HU-08): bind schedule component to API data

# Interactive features
feat(HU-08): implement conflict highlighting on hover

feat(HU-08): add schedule export button

# Performance
perf(HU-08): implement virtual scrolling for large schedules

perf(HU-08): optimize re-renders with React.memo

# Styling
style(HU-08): run prettier on all UI components

style(HU-08): consistent spacing and naming conventions

# Testing
test(HU-08): add tests for schedule grid rendering

test(HU-08): add tests for filter functionality

# Documentation  
docs(HU-08): add component usage examples in storybook
```

---

## Best Practices

### 1. **Atomic Commits**
Each commit should be a complete, working unit:

```bash
✅ GOOD:
feat(HU-01): add docente CRUD endpoints
test(HU-01): add validation tests for docente endpoints

❌ BAD:
feat(HU-01): add docente CRUD, validation, tests, and API documentation
```

### 2. **Imperative Mood**
Use "add", "fix", "remove" not "added", "fixed", "removed":

```bash
✅ GOOD: feat(HU-05): implement CSP solver
❌ BAD:  feat(HU-05): implemented CSP solver
❌ BAD:  feat(HU-05): implements CSP solver
```

### 3. **Link to Issues**
Reference Jira tickets in footer:

```bash
feat(HU-05): implement OR-Tools constraint propagation

- Add AC-3 algorithm for constraint consistency
- Improve solver performance by 40%

Fixes #HU-05
```

### 4. **Describe Motivation**
Explain *why*, not just *what*:

```bash
❌ BAD:
fix(HU-05): change timeout from 5s to 10s

✅ GOOD:
fix(HU-05): increase solver timeout to 10s for large datasets

The 5-second timeout was insufficient for datasets >200 courses,
causing premature termination. 10s provides better coverage while
maintaining acceptable performance.
```

### 5. **Breaking Changes**
Mark API-breaking changes clearly:

```bash
feat(HU-05)!: restructure schedule API response format

BREAKING CHANGE: The /api/horarios/generar endpoint now returns
a different JSON structure. Old clients must update their parsers.
See migration guide in docs/MIGRATION.md
```

### 6. **Co-Authoring**
For pair programming:

```bash
feat(HU-05): implement CSP solver core algorithm

Co-authored-by: Cristian <cristian@example.com>
Co-authored-by: Piero <piero@example.com>
```

### 7. **Commit Frequency**
- **Too frequent**: 50+ commits per day (noise)
- **Too sparse**: 1 commit per week (hard to review)
- **Optimal**: 3-5 commits per day (atomic, reviewable)

### 8. **Message Length**
- **Subject**: Max 50 characters
- **Body lines**: Max 72 characters (for terminal display)
- **Total**: Usually 100-500 characters

---

## Validation & Tooling

### Git Hooks (Optional but Recommended)

Install `husky` to validate commits before pushing:

```bash
npm install husky commitlint --save-dev
npx husky install
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'test', 'docs', 'style', 'refactor', 'perf', 'chore']
    ],
    'type-case': [2, 'always', 'lowercase'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lowercase'],
    'subject-empty': [2, 'never'],
    'subject-period': [2, 'never'],
    'subject-case': [2, 'never', 'start-case']
  }
};
```

### Commit Message Template

Create `.gitmessage`:

```
<type>(<scope>): <subject>

# Body (optional): Explain what and why, not how
# - Imperative mood ("add", not "added")
# - Explain problem the code solves
# - Link to related issues

# Footer (optional):
# Fixes #HU-XX
# Relates-to #HU-YY
# BREAKING CHANGE: <description>
# Co-authored-by: Name <email@example.com>

# Scope examples:
# HU-01, HU-05, auth, api, db, csp, ui, tests

# Type examples:
# feat: New feature
# fix: Bug fix
# test: Test additions/changes
# docs: Documentation only
# style: Code style only
# refactor: Code restructure
# perf: Performance improvement
# chore: Maintenance/tooling
```

Configure git to use template:

```bash
git config commit.template .gitmessage
```

### GitHub Commit Search

Find commits by type:

```bash
# All features for HU-05
git log --grep="feat(HU-05)"

# All fixes in repository
git log --oneline | grep "^fix"

# All test additions
git log --grep="test(" --oneline

# Commits by author
git log --author="Franklin" --oneline
```

### Changelog Generation

Tools like `conventional-changelog` can auto-generate CHANGELOG.md:

```bash
npm install -g conventional-changelog-cli

# Generate changelog
conventional-changelog -p angular -i CHANGELOG.md -s

# Output:
# ## [0.1.0] - 2026-05-15
# ### Features
# - implement docente CRUD endpoints
# - create course co-requisite validation
# ### Bug Fixes
# - correct email validation regex pattern
```

---

## Real-World Example Flow

### Scenario: Implement HU-05 CSP Motor

**Day 1: Feature Branch Creation**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/HU-05-csp-motor
```

**Day 2: Variable Initialization**
```bash
git add server/CSPScheduler.js
git commit -m "feat(HU-05): initialize 8750 boolean variables

Define course-teacher-room-slot assignment variables.
Pre-filter infeasible combinations to reduce problem space.
Coordinates: 50 courses × 12 teachers × 5 rooms × 35 timeslots"

git push -u origin feature/HU-05-csp-motor
```

**Day 3: Hard Constraints**
```bash
git add server/constraints/HardConstraints.js
git commit -m "feat(HU-05): implement HC-1 unique assignment constraint

Each course assigned to exactly one teacher-room-timeslot.
Validates against duplicate assignments in validation layer."

git add server/constraints/OverlapConstraints.js
git commit -m "feat(HU-05): implement HC-2 through HC-4 overlap prevention

HC-2: No teacher teaches two courses simultaneously
HC-3: No room has overlapping course assignments
HC-4: Room capacity must accommodate course size"
```

**Day 4: OR-Tools Integration**
```bash
git add server/or-tools/SolverConfig.js
git commit -m "feat(HU-05;or-tools): integrate Google OR-Tools solver

Configure MRV heuristic for variable selection.
Enable AC-3 for constraint propagation.
Set 5-second timeout and 500MB memory limit."

git push origin feature/HU-05-csp-motor
```

**Day 5: Testing**
```bash
git add tests/csp.test.js
git commit -m "test(HU-05): add 25 test cases for CSP solver

- 7 tests for HC-1 through HC-7 validation
- 5 tests for SC-1 through SC-5 optimization
- 8 integration tests for solver pipeline
- 5 performance/stress tests"

git push origin feature/HU-05-csp-motor
```

**Day 6: Create Pull Request**

On GitHub:
- Title: `feat(HU-05): complete CSP motor with constraints`
- Body:
```
## Description
Complete implementation of CSP scheduling solver with 7 hard and 5 soft constraints.

## Changes
- 8,750 boolean variables (course-teacher-room-slot assignments)
- Hard constraints HC-1 through HC-7 for feasibility
- Soft constraints SC-1 through SC-5 for optimization
- OR-Tools solver with MRV heuristic and AC-3 propagation
- 25 comprehensive test cases

## Tests
All 25 test cases passing. Performance: <5s for 200+ courses.

## Jira
Fixes #HU-05
```

**After Approval:**
```bash
# Squash merge to develop
git checkout develop
git pull origin develop
git merge --squash feature/HU-05-csp-motor
git commit -m "feat(HU-05): complete CSP motor with 7 hard + 5 soft constraints

- Implement OR-Tools solver integration with MRV heuristic
- Define 8,750 boolean variables (50×12×5×35)
- HC-1 through HC-7: Mandatory constraint validation
- SC-1 through SC-5: Soft constraint optimization
- 25 test cases covering all constraints
- Performance: <5s, Memory: <500MB"

git push origin develop
git push origin --delete feature/HU-05-csp-motor
```

---

## Commit Examples Reference

### ✅ Good Commits

```
feat(HU-01): implement docente CRUD endpoints
feat(HU-05): add OR-Tools constraint propagation
fix(HU-05): resolve CSP timeout overflow
test(HU-05): add HC-1 through HC-7 test suite
docs: update API documentation
perf(HU-08): optimize schedule grid rendering
chore(deps): update express from 4.18 to 4.19
```

### ❌ Bad Commits

```
✗ implemented some new stuff
✗ fix
✗ WIP - testing things
✗ Updated code
✗ Fixed bugs and added features
✗ As per Franklin's request
✗ Ready for production!
```

---

## Validation Checklist

- [ ] All commits use semantic format: type(scope): subject
- [ ] Scope references HU-XX or technical component
- [ ] Subject is imperative mood and lowercase
- [ ] Subject under 50 characters
- [ ] No period at end of subject
- [ ] Body explains *why*, not just *what*
- [ ] Footer links to Jira tickets (#HU-XX)
- [ ] No commits directly to main or develop
- [ ] All commits in feature branches before PR
- [ ] PR title follows semantic format
- [ ] Merged commits preserve history (--no-ff or squash)

---

## Resources

- **Conventional Commits**: https://www.conventionalcommits.org/
- **Semantic Versioning**: https://semver.org/
- **Commitizen**: http://commitizen.github.io/
- **Commitlint**: https://commitlint.js.org/

---

**Last Updated:** 2026-05-07  
**Version:** 1.0.0  
**Status:** ✅ Ready for team adoption  
**Owner:** Franklin R / Development Team
