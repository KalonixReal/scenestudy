# SceneStudy improvements — 8 October 2026

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
- Independent critic rounds and verification evidence are recorded in `audit/REVIEW-ROUNDS.md` on the workspace branch.

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

Final verification: 75 view/state captures, all 13 interaction checks, seven backup/cache/export checks, nine selection/filter checks and ten final exercise checks passed. No screened contrast failure, horizontal overflow or JavaScript exception was found in those runs. Independent critic evidence is recorded in the workspace branch.
