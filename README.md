# SceneStudy

Hidden Figures study application with 64 scenes, a searchable library, flashcards, matching, essay quizzes, recall notes and progress tracking.

## Scenes and filters

Eight themes organize the catalogue: Discrimination & Segregation, Education & Opportunity, Expertise & Recognition, Leadership & Teamwork, Family & Community, Space Race & Technology, Self-Respect & Resistance, and Visibility & Legacy. Each scene has a small, primary-first set of themes and up to three technique tags selected from a shared set of 15 film techniques.

The Library and Choose Scenes each have independent search, filters and sorting. Multiple choices within a filter combine with OR; different filters combine with AND. The essay-type filter has been removed. Importance is scored out of 10 for usefulness as essay evidence, not plot or historical importance.

Technique tags and descriptions were reviewed against silent frames from the current clip ranges. Camera movement, sound, and editing patterns are only named when the available visual evidence supports them; descriptions avoid presenting the film's dramatized scenes as proof of historical events.

Five identical clip ranges have been merged, preserving saved notes, bookmarks, reviews and selections. Two running scenes feature Sam alone and Sam with Katherine. Overlapping clips remain when they show different parts of an event.

## Run and build

Serve this directory with a static web server and open `index.html`:

```sh
python -m http.server 8765
```

Build the production output:

```sh
node scripts/build.mjs
```

The output is `dist/`. The website also works directly from the root `index.html`, with `src/`, `styles/` and `data/` alongside it. No package installation is needed to build.

## Film source

Watch Film uses the existing third-party MP4 URL. Hosting availability and playback permissions are controlled by that provider. Movie files are excluded from builds and version control. Leaving Watch Film unloads playback, including headphone media controls.

## Desktop interface

Desktop layouts are the supported review scope. Both light and dark themes are checked across the nine views, filters, exercises and scene details. Tab changes have a randomized 60–100 ms transition; choosing a film clip starts immediately.

Buttons, cards, quiz feedback and view changes use short motion cues. The interface honors the system reduced-motion preference.

Watch Film is grouped with Exercises. Print Study Pack, Related Scenes, streak/due badges and shortcut help have been removed. Exercises, bookmarks, recall notes, review scheduling and backup/export remain available.

## Repository

`main` contains the website with `index.html` at its root and fresh `dist/` output. The former `workspace` branch is removed. Movies, extracted audio, credentials and local review files are not published.
