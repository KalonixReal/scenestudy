# Hidden Figures — SceneStudy

A standalone, offline-capable essay study tool for the film *Hidden Figures* (2016), built around a curated Katherine Johnson-centred scene catalogue: **22 scenes** selected for essay writing, each anchoring either a **theme essay** or a **character study** — filterable by essay type everywhere.

**Study modes:** flashcards with spaced repetition (by character, essay tag or analysis type), a **271-question essay-skills quiz** across 10 archetypes (argument → evidence, technique → effect, topic sentences, barrier analysis, analysis vs summary, paragraph building, turning points, counter-claims, scope discipline…), scene matching in three categories (technique / big idea / essay tag), recall practice with per-scene essay angles, and a scene library organised by **17 color-coded essay tags** (racism, sexism, segregation, intersectionality, solidarity, family and more) plus 7 themes and 5 characters.

**Progress tooling:** dark / light theme (persisted), mastery-by-tag analytics with one-click practice deep-links, per-scene mastery rings + mastery filter in the library, study streak tracking, a 7-day review forecast chart, full answer review with per-skill and per-essay-type breakdowns, **progress backup export + restore** (JSON, moves your progress between browsers), **Markdown study-notes export** (Notion/Docs-ready), a printable study pack (evidence cards + visual cues on paper), and a keyboard shortcut cheat sheet (press `?`).

**Custom sheets:** upload any film's scenes as JSON or CSV (optional `tags` and `analysisType` columns) — every mode switches instantly; templates included.

**Deploying (Cloudflare Pages):** this branch is the entire site — no build step, no dependencies.

- Build command: *(leave empty)*
- Build output directory: `/`
- Everything is inlined in `index.html`; it works offline once loaded.

The full development workspace lives on the `workspace` branch.
