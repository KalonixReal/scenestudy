# Hidden Figures — SceneStudy

A standalone, offline-capable essay study tool for the film *Hidden Figures* (2016), built on a curated catalogue of **22 key scenes selected for essay writing** — every scene anchors a theme essay or a character study of Katherine Johnson, and each one is labelled **Character essay** or **Theme essay** (filterable in the scene library).

Features: flashcards with spaced repetition (by character or essay tag), a **271-question essay-skills quiz** across 10 archetypes (argument → evidence, theme evidence, technique → effect, topic sentences, barrier analysis, analysis vs summary, scene pairing, turning points, counter-claims, scope discipline), scene matching in three modes (technique / big idea / essay tag), recall practice with per-scene essay angles, and a scene library organised by **17 color-coded essay tags** (racism, sexism, segregation, intersectionality, solidarity, family & home and more), each scene with its own hand-drawn visual cue artwork.

Also included: **dark / light theme** (persisted per browser), **mastery-by-tag analytics** (weakest essay tags first), **Markdown study-notes export** (Notion/Docs-ready, includes your own recall notes), a **printable study pack** (evidence cards on paper), study streak tracking, a 7-day review forecast chart, full answer review after each quiz round, keyboard shortcuts (Space/1-3 for cards, 1-4/Enter for the quiz), and custom scene-sheet upload (JSON/CSV with optional `tags` and `analysisType` columns) to study any film.

**Deploying (Cloudflare Pages):** this branch is the entire site — no build step, no dependencies.

- Build command: *(leave empty)*
- Build output directory: `/`
- Everything is inlined in `index.html`; it works offline once loaded.

The full development workspace lives on the `workspace` branch.
