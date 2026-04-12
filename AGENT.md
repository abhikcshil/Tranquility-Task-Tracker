# AGENTS.md

## Project Overview
This is a self-hosted personal productivity web app focused on:
- task management
- recurring tasks (daily, weekly, monthly, yearly)
- habits with streak tracking
- notes
- reminders (future phase)
- gamification via points and weekly goals
- visual dashboard with progress rings

The app is designed for **low friction daily use**, not enterprise complexity.

## Core Principles
- Fast task entry is critical (natural language support in MVP)
- Mobile-first UX (must work cleanly on iPhone)
- Minimal friction: avoid unnecessary forms or steps
- Visual feedback (progress rings, streaks, weekly progress)
- Weekly structure > strict calendar structure
- Clean, subtle UI (no flashy colors)

## Tech Stack
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM
- SQLite (for MVP, self-hosted)
- PWA support (installable on mobile)

## UI/UX Guidelines
- Dark mode default
- Use subtle accent colors for categories:
  - health (green)
  - work (orange)
  - school (blue)
  - personal (purple)
  - home (yellow)
  - finance (red)
- Avoid heavy UI clutter
- Large tap targets for mobile
- Dashboard-first design

## Core Concepts

### Task Types
1. One-time tasks (optional due date)
2. Recurring tasks:
   - daily
   - specific weekdays
   - weekly (flexible, not tied to a day)
   - monthly
   - yearly
3. Habits (tracked with streaks and frequency targets)

### Weekly Tasks
- Must be completed sometime during the week
- Not tied to a specific day
- Can have frequency targets (e.g. 2x/week)

### Recurring System
Recurring tasks generate **instances** when due.
Never treat recurring tasks as one static object.

### Points System
- Tasks and habits award points on completion
- Weekly point goal exists
- Streak bonuses apply
- Future: milestone rewards

### Notes
- Simple, fast, editable
- Can be standalone or attached to tasks
- Must be searchable

## Natural Language Input
- Use parsing libraries for MVP (not hardcoded rules)
- Extract:
  - due dates
  - recurrence patterns
  - frequency (e.g. "3x per week")
- If parsing fails, fall back to plain task

## Constraints
- No external paid APIs for MVP
- Must remain fully self-hostable
- SQLite only for MVP
- Avoid over-engineering

## Code Guidelines
- Strong typing (TypeScript everywhere)
- Clean Prisma schema
- Modular structure (separate services for logic)
- No massive monolithic files
- Reusable UI components

## Testing Expectations
- Unit tests for:
  - recurrence logic
  - streak calculations
  - weekly progress calculations
- Keep logic testable outside UI

## What NOT to do
- Do not build full calendar UI yet
- Do not add collaboration/multi-user complexity
- Do not add advanced analytics yet
- Do not overcomplicate reminders in early phases

## Definition of Done (per phase)
- Code compiles
- App runs locally
- Core functionality works
- Minimal UI exists for testing
- Tests pass
- Summary of changes provided

## Workflow
- Work phase-by-phase
- Do not implement future phases early
- Focus only on requested scope