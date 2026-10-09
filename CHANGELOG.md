# SceneStudy changes

## Motion polish (2026-10-09)

- Added consistent press and hover feedback across enabled buttons and interactive controls, plus a short entrance for newly opened views.
- Flashcards now animate both reveal directions, card changes and session completion; quiz feedback and the completion mark have restrained motion.
- All added motion respects the operating system's reduced-motion setting.

## Evidence-based content review (2026-10-08)

- Recalibrated Importance scores and reasons for all 64 scenes on a 1–10 essay-evidence scale. Scores name scene-specific evidence and reserve 10 for the strongest, most analyzable essay anchors.
- Reworked the theme taxonomy into eight primary-first groups, adding Self-Respect & Resistance and Visibility & Legacy. Each scene has no more than three theme tags.
- Ranked the technique tags against silent frames sampled from all 64 current ranges. Each scene now has at most three technique tags, keeping the combined theme and technique chips to six or fewer. Replaced 22 technique descriptions where camera movement, shot composition, or editing claims were unsupported, and shortened 21 headings that were being hidden by the app's length limit.
- Added clear essay prompts for the two new themes, updated quiz thesis examples to avoid overclaiming what a single scene proves, and clarified that Importance measures essay evidence rather than plot or historical significance.
- Fixed spacing in the checked Recall & Explain reference panel, removed the essay-type filter, and grouped Watch Film under Exercises.
- Sorted the catalogue by clip start time and assigned consecutive IDs 1–64. Older saved progress and backups are not remapped to the new IDs.
- Focused review relied on visible frames only; no audio claims were newly verified. One existing clip begins on an advertisement frame; timestamps were left unchanged.

## User-edited scene times and shorter tab changes (2026-10-08)

- Applied the 30 timestamp edits made in the dist scene JSON to the current source catalogue, mapping changes for merged duplicate IDs to their surviving scene records. Kept all newer theme, technique, Importance and scene additions.
- Synchronized the JSON and JavaScript catalogue mirrors, rebuilt dist, and updated the scene generator to preserve these timestamp edits on future regeneration.
- Reduced randomized tab transitions to 60–100 ms.

## Desktop catalogue and interface update (2026-10-08)

- Preserved the Choose Scenes filters previously present only in dist, bringing them into source.
- Simplified themes to six groups and added 15 common technique tags across all scenes and both filter panels.
- Merged five identical clip ranges while retaining saved notes, bookmarks, review history and selections. Added Sam running and Sam with Katherine running; the catalogue now has 64 scenes.
- Removed Print Study Pack, Related Scenes, streak/due badges and shortcut help; retained study tools and backups.
- Improved desktop spacing, wrapping and filter keyboard visibility in both themes.
- Added randomized 350–650 ms navigation transitions and fully unloaded movie playback when leaving Watch Film. Selecting another clip also unloads the previous player.
- Corrected quiz evidence and matching ambiguity after independent data, state and desktop layout critic reviews.
- Publication now updates main only and removes the former workspace branch. Movie and audio files are excluded.

# SceneStudy improvements — 8 October 2026

## Importance out of 10 and visually reviewed clips (2026-10-08)

- Applied the supplied Importance scores exactly, with one compact star and x/10 throughout the interface, filters and exports.
- Three subagents visually reviewed all 67 scenes and refined boundaries using consecutive 25 fps frames. The bathroom sign clip now begins before the crowbar action at 1:12:29.04.
- Relocated clips that pointed to different events, and corrected unsupported study descriptions, including the invented dinner-table trajectory lesson. Scene IDs, tags and the saved-progress format remain stable.
- Clip playback now stops on the last included frame through video frame callbacks, with a time-update fallback.
- 51 focused checks and 36 production page states passed, including real muted video playback. No critic or next-step loops. Full results and precision limits are recorded in audit/timing-update/REPORT.md in the original local audit.

## Unified tags and Importance

- Merged former essay tags and theme classifications into one Tags system. Preserved all 13 stable IDs and original primary tags, added 97 assignments from former themes, and removed duplicate classification displays.
- Simplified labels, including Teamwork, Self-Respect, Recognition, Space Race, Gender Bias, Racial Separation and Unfair Treatment. Library filters, flashcards, matching, quizzes, progress and Markdown exports share the same tags.
- Added curated 1–5-star Importance ratings for all 67 scenes, based on strength as essay evidence: argument, specific film technique, turning point or comparison. Every scene has an explanation; brief context and narrower supporting details rank lower.
- Importance appears in the Library, Choose Scenes, flashcards and details. Sort highest first or combine star-level filters with tags and other filters. Ratings remain separate from saved study progress.
- All other existing scene fields are unchanged, including start and end times. No timestamp work was performed following the user's cancellation.
- Focused checks only for this update: 11 tag checks, seven Importance checks, 13 general interaction checks, nine selection/filter checks, seven backup/cache/export checks and ten exercise regression checks passed. 75 page states had no detected overflow, contrast failures or page errors; the production output passed 36 further states. No critic or improvement loops were run for this update.

## Earlier repair and improvement release

- Consistent light and dark themes, including selected/hovered navigation, controls, icons, tags, disabled states, exercise feedback, dialogs and print colors.
- Revised all 27 shared scene SVG cues; clearer forms, consistent proportions and theme-aware outlines.
- Exactly two navigation sections: Home and Exercises.
- Removed storage-location and browser-only claims from the interface.
- Compact scene library toolbar, expandable multi-select filters, live facet counts, active filter chips, group clearing and deterministic sorting. Multiple choices within a group combine with OR; separate groups combine with AND.
- Scene selection retains valid exercise context, drafts, search and filters. Counts describe the 67-scene catalogue and actual selections.
- Hosted film source only, with retry/error feedback, consistent chapter highlighting and guarded asynchronous playback. Movie files are not bundled.
- Phone layouts fit 320px and wider; mobile navigation and dialogs contain keyboard focus, support Escape and restore focus to the originating control.
- Quiz answers are concealed before answering; contrasting choices remain valid for narrow selections; native keyboard button activation is preserved.
- Calendar-based progress ranges, monthly buckets, explicit invalid-date feedback and daylight-saving-safe streaks.
- Invalid stored data is normalized; save failures are visible and do not produce successful-save feedback.
- Independent critic rounds and verification evidence are recorded in `audit/REVIEW-ROUNDS.md` in the original local audit.

## Practical improvement iteration 1

- Complete backups now include selected scenes, activity history, film position and date preferences. Older partial backups preserve fields they do not contain; the preview states exactly what will be restored.
- Quiz setup and Overview reuse cached metadata for the current scene selection. Answer feedback, next questions and results no longer regenerate unused question banks.
- Markdown study notes avoid repeating identical analysis sentences and retain personal drafts and authored evidence.

## Practical improvement iteration 2

- Search Choose Scenes across the whole catalogue; select or deselect only matching results while retaining selections outside the search.
- Compact phone filter disclosures retain opened groups and selected counts. Show Scenes returns directly to results with keyboard focus preserved.
- Search and clear controls remain usable with caret editing and composition input; bulk actions provide a stable focus target when they become disabled.

## Practical improvement iteration 3

- Empty or undersized exercises offer direct recovery actions. Tag matching can switch to Film Techniques, and empty flashcard decks offer relevant destinations without adding scenes.
- Empty-card navigation and Shuffle for fewer than two cards are disabled. Empty-deck keyboard shortcuts leave the page available for normal navigation.
- Quiz results list each missed scene once, in first-miss order, with accurate missed-question counts. Scores, complete answer review and retry scope still count questions.

Final verification: 75 view/state captures, all 13 interaction checks, seven backup/cache/export checks, nine selection/filter checks and ten final exercise checks passed. No screened contrast failure, horizontal overflow or JavaScript exception was found in those runs. Independent critic evidence is recorded in the original local audit.
