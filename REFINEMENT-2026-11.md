# Spa City Tub Rally refinement, November 2026

**Source fixes integrated. Formal release HOLD.**

The user ended testing early and directed integration of the recorded fixes. This closure records the fixes and retained generated runtime on the game repository’s main branch. Earlier findings and results retain their original scope. Full qualification and production deployment remain unverified. [R41 campaign record](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-progress-d9696d13-41ae-427a-bb9e-a366f45ed43c/report.json>)

## Source and publication

- Integrated source tip `b89bfdb9c922d17e1c60cd648bea4282fa690f99`. The original fix commits remain in the main history.
- The root `index.html` was updated from the retained candidate artifact, SHA-256 `542efddfac1c28fd440dda0b0fed00c76067ac5f5ffd22763173eced02e0f53c`. No additional testing was run for this closure.


The historical publication inventory records `v2.0.1` at commit `a26ce524fe1452b87dc52076361f77b96ef37940`. The corresponding committed index SHA-256 was `e12f60261bc40553634b0a1a60704f44c8dcfbbfce208e38d58f66d8fa6f1834`. Current public response bytes and deployment identity still require verification. [Historical site ref inventory](<C:/Video Game Projects/campaigns/refinement-2026-11/preflight/p0-01-attempt1/stdout.txt>) · [Committed index inventory](<C:/Video Game Projects/campaigns/refinement-2026-11/preflight/p0-11-assessment/stdout.txt>)

- Local `refine/2026-11` at `b89bfdb9c922d17e1c60cd648bea4282fa690f99` in `D:/hsg-campaign/worktrees/tub-rally/desktop-refine-20261104`.

The accepted local candidate runtime index SHA-256 is `542efddfac1c28fd440dda0b0fed00c76067ac5f5ffd22763173eced02e0f53c`. The candidate build and its source commit are retained separately from the historical shipped body. [Candidate build](<D:/hsg-campaign/desktop-assessment/tub-rally-3c7a435a-3824-4b3d-9c1c-d06377049046/ipad-source-composition-r1/artifact/index.html>) · [Candidate source review](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/tub-candidate66-stage-root-review.json>)

## Coverage matrix

The rows record bounded observations by workflow. Formal completion of each applicable workflow and profile is still pending. [Workflow and profile requirements](<C:/Video Game Projects/campaigns/refinement-2026-11/MASTER-PROMPT.md>)

| Workflow | Scoped evidence and remaining work |
| --- | --- |
| WF-01 Build and integrity | Historical preflight retained the committed index and the rebuilt digest. The generated timestamp difference was recorded as a baseline build-integrity failure. |
| WF-02 Feature inventory | Complete feature-to-real-input coverage map remains pending. |
| WF-03 Core loop | Scoped natural evidence includes one complete original three-lap race and two candidate save-retention races. The scheduled singleton remains incomplete separately. |
| WF-04 Input | Physical iPad Safari exercised simultaneous steering and Push, release, and the local candidate’s Pause and Resume controls in scoped race observations. |
| WF-05 Layout | Scoped desktop rendering and physical iPad rendering are retained. Full viewport, safe-area, scale and rotation checks remain pending. |
| WF-06 Mechanics | Independent full rules, seeded shadow models and balance comparisons remain pending. |
| WF-07 Persistence | Candidate results, reload and public-best persistence were checked locally. One prior original-reader origin error is retained alongside the corrected follow-up. |
| WF-08 Audio | Physical iPad next-touch AudioContext resume and retained mute preferences were observed. Audible output and original Android audio criteria remain pending. |
| WF-09 Lifecycle | Scoped pause, resume and reload ran. Full rotation, interruption and adverse-network matrix remains pending. |
| WF-10 Performance | Original performance assertions and timing are proxy evidence. Real-GPU reference, 30-minute soak and governor evidence remain pending. |
| WF-11 Accessibility | Keyboard focus now scrolls the highlighted choices into view in the checked lists. Full accessibility coverage remains pending. |
| WF-12 Content and licensing | Complete help, site controls, claims and licensing audit remains pending. |
| WF-13 Player integration | Scoped local player paths were observed in Chrome and Edge. Current formal workflow, exact production routes and candidate smoke remain pending. |
| WF-14 Visual polish | Scoped screenshots and visual review are retained. Complete all-screen visual assessment remains pending. |

## Defect log

| Severity | Recorded defect or finding | Local status |
| --- | --- | --- |
| S2 | Escape pause failure | Integrated fix `e5ace45dcb1c750d7255d1b99e286e254775df22`. Formal release HOLD. |
| S2 | Keyboard navigation did not scroll focused choices into view | Integrated fix `e26b92cfaa85bfe05f3bf0a8a5f7fa56f9f92161`. Formal release HOLD. |
| S0 | Stale tab setting overwrote earned records | Integrated fix `cc7b0801296e9de914806aa049d0759e0faccff1`. Formal release HOLD. |
| S1 | `IPAD-TUB-TOUCH-PAUSE-001` Visible touch Pause in portrait and landscape. resumes same race | Integrated fix `b89bfdb9c922d17e1c60cd648bea4282fa690f99`. Formal release HOLD. |
| S1 | `IPAD-TUB-AUDIO-RECOVERY-001` Existing suspended context resumes on next trusted gesture. mute preferences preserved. human audibility unproven | Integrated fix `b89bfdb9c922d17e1c60cd648bea4282fa690f99`. Formal release HOLD. |

The integrated changes affect play as follows. Escape pauses. Focused choices scroll into view. Newer race records survive stale settings. A visible touch Pause resumes the same race, and the next trusted gesture recovers a suspended audio context. [Local commit and worktree index](<D:/hsg-campaign/platform-support/release-controller/final-report-readiness-031009b8-9c99-4849-87ee-76e539afcebb/REPORT-READINESS.json>)

## Before and after

The matched original suites passed 66/66 on the historical shipped body and 66/66 on the separate fixed build. Four added candidate tests are outside the comparison. The composed candidate separately passed nine normal and six affected desktop checks. A scheduled natural singleton ended INCOMPLETE_PENDING_CLASSIFICATION. [Evidence 1 · 8817](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-tub-final-handoff-43ef9095-61c8-4304-a02b-7dbf7012ca90/handoff.json>) · [Evidence 2 · 11349](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-tub-save-final-handoff-4f043dfa-bc90-43e9-a049-3308addb1562/handoff.json>) · [Evidence 3 · 16861](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/tub66-original-suite-actual-acceptance.json>) · [Evidence 4 · 17001](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/tub-candidate66-suite-actual-acceptance.json>)

## Evidence tiers

- Installed Chrome and Edge basic player observations are scoped E2 desktop evidence. Hardware qualification and broader workflow coverage remain separate. [Desktop scope and profile limits](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-progress-d9696d13-41ae-427a-bb9e-a366f45ed43c/report.json>)
- The original browser suites use their frozen proxy settings and test hooks where applicable. Emulated mobile observations carry browser-proxy scope. [Historical body acceptance](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/tub66-original-suite-actual-acceptance.json>) · [Fixed candidate acceptance](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/tub-candidate66-suite-actual-acceptance.json>)
- The physical iPad Safari lane records 3 completed bounded gameplay runs across 3 attempts. The R8 local route returned 200 with body SHA-256 `5840caec7dba5855c6c50820385dfcdf88dd155e6309c04b1483511b1b5028a2`. The last gameplay body SHA-256 was `542efddfac1c28fd440dda0b0fed00c76067ac5f5ffd22763173eced02e0f53c` before the subsequent local source commit. Physical iPad scope is recorded separately from the Android and WebKit proxy tiers. [Physical iPad route](<D:/hsg-campaign/evidence/refinement-2026-11/ipad-route-verification-r8-9157fa31-c2c2-46ee-a788-e9bb70e3a59e/route-report.json>) · [Physical iPad gameplay](<D:/hsg-campaign/evidence/refinement-2026-11/ipad-final-report-c14434a9-3a6e-49f6-83fa-a1bea341c260/FINAL-REPORT.json>) · [Subsequent local commit](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-tub-composed-commit-closure-94152dd8-2437-4824-a1ee-5189df24d946/review.json>)

## Coverage left open at closure

- Matched original 66 on both builds. Four added candidate tests are outside that comparison. Separate scheduled natural singleton ended INCOMPLETE_PENDING_CLASSIFICATION. Scoped natural races and physical touch/audio context exist, with audibility open.
- The scheduled singleton ended with the workflow unreached and classification incomplete. The separately scoped original suites and physical audio-context observation remain accepted. [Scheduled singleton closure](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/tub-single-natural-run-actual-closure.json>)
- Full A1 and A2 Android Chrome workflow evidence, the complete device and mode matrix, all historical save/rollback paths, independent rounds and production smoke remain pending. [R41 campaign record](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-progress-d9696d13-41ae-427a-bb9e-a366f45ed43c/report.json>)

## Not Covered

No approved exclusions. Pending work is listed above.

## Manual checklist candidates

- Real iPhone Safari, Android handset performance and heat, and audible-output review remain for the end-of-campaign manual checklist. [Manual-checklist requirement](<C:/Video Game Projects/campaigns/refinement-2026-11/MASTER-PROMPT.md>)
