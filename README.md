# SceneStudy

Hidden Figures study application with 67 authored scenes, a searchable scene library, flashcards, matching, essay quizzes, recall notes, progress tracking, PDF scene import and an essay builder.

## Tags and Importance

Every scene uses one consistent Tags list throughout the application. Former essay tags and theme classifications are combined without duplicate labels; names such as Teamwork, Recognition and Self-Respect make them easier to understand.

Importance uses the supplied scores out of 10 for usefulness as essay evidence. A compact star and numeric score appear throughout the application. Library sorting places the highest scores first, and Importance filters can be combined with tags. Details explain how each scene can support an essay; choose examples that fit your argument.

The latest update passed 51 focused checks and 36 production page states. It visually reviews all 67 clips against the hosted film cut, refining starts and ends with consecutive 25 fps frames at the boundaries. Scene IDs and saved study progress stay stable. Minimal factual corrections remove descriptions of actions not shown in the chosen clips. The complete boundary review and focused checks are in `audit/timing-update/` on the workspace branch; earlier tag and repair audits remain historical evidence.

## Run and build

Serve this directory with a static web server and open `index.html`. For example:

```sh
python -m http.server 8765
```

Build the Cloudflare Pages output:

```sh
node scripts/build.mjs
```

The output is `dist/`. The website also works directly from the root `index.html`, with `src/`, `styles/` and `data/` alongside it. No package installation is needed to build.

## Film source

Watch Film uses the existing third-party MP4 URL. Hosting availability and playback permissions are controlled by that provider. Movie files are excluded from builds and version control.

## Project layout

- `index.html`: application shell and initial theme.
- `src/app.js`: view rendering, exercises, filters and progress.
- `styles/app.css`: theme tokens, components, responsive and print styles.
- `data/`: authored scene catalogue and its source JSON.
- `scripts/build.mjs`: static production build.
- `audit/`: baseline, independent reviews, screenshots and verification evidence in the workspace branch.

## Verification

The audit checks all nine views in light and dark at 1280, 768, 390 and 320 pixels, plus important interaction states. Browser audits use isolated headless Chrome with audio muted. `audit/REVIEW-ROUNDS.md` records completed critic and improvement rounds and their limits.

The verification scripts use Playwright. Their runtime paths reflect the audit environment; adjust the import path and Chrome executable when running elsewhere. Start the static server on port 8765 before running them.

Completed the initial repair loop and all three practical improvement loops with clean independent critics. Final checks include 75 view states and 39 focused interaction assertions, plus 36 page states served from the actual production output. Movie playback was simulated or blocked during these checks; the hosted source was checked separately.

## Repository branches and release

`main` contains the finished website with `index.html` at its root and the fresh `dist/` output. `workspace` contains the complete project, source references, screenshots, review evidence and scripts, excluding movies, their extracted audio and credentials. `release/scenestudy-site.zip` and its hash manifest on the workspace branch provide a portable website package.
