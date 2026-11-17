# Next session

## Where we stopped (2026-11-17)
- **v 2026-11-17b** (same day): race round buttons moved to the top, gift + Drop buttons up under them. Not yet tried by Daniel.
- Live version: **v 2026-11-17b** (shown under Privacy on the home screen). The project folder matches the live site (the `supabase` folder stays off GitHub on purpose).
- Daniel tried 16a + 16b: "pretty good". Capture the Flag (bots, joystick on the player) NOT tested yet.
- Daniel was about to try 17a when the session ended; he said the list of changes "sounds good".
- **v 17a, headless-tested, NOT yet tried by Daniel (details at the top of STATE.md):**
  - Race: no bumps at all (sleds overlap and cross), 7 sleds, bot levels spread out.
  - Race: lower gates (same width), and a thin one-row question box at the top. Both because his mom (iPhone) could not see the path or read the gates.

## Next steps
1. FIRST THING: ask how v 17a feels, especially on Mom's iPhone:
   - Can she see where she is going? Is the question box small enough (`RACE.panelSee`, `panelWide`), or should it go away?
   - Are the gates low enough to read while racing (`RACE.gateClear`, `gateAnswerTall`)?
   - Bots: spread out enough? Best bot too strong (`botSkill`, `botRight`, `botLead`)?
2. Still waiting from 16b: Capture the Flag bots (fun alone? too strong? `CTF_BOTS`), the joystick dragged from the player.
3. Still unanswered: easy-mode secret shortcuts for a little kid, the orange gift, outfit prices, the regular-mode camera (`RACE.cameraMotion`), Capture the Flag taps (`TOUCH`).
4. Still open: a two-phone race test; the log-in card after every game or once per visit.
5. Not now: payments for the dashboard (plan under Key decisions in STATE.md). Daniel: still beta testing; paying may become a requirement later.

## Questions for Daniel
- Outfits Claude made up: kibbutznik, cool kid, cowboy, ninja, wizard, bandit, king. Keep, change, add?
- A player in the left or right lane before the mountain face is taken into the shortcut on that side without asking. Fine?
- Bots never take the secret trails or the zigzag gaps. Should they?
- The Hebrew in the menus, the outfit names and the privacy page was written by Claude; Daniel said to assume it is good during beta.

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Never upload the `supabase` folder (Daniel's local `usage.sql` has his email in it). Never write his email into a project file.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr -x .git -x supabase`): VS Code once saved an old open copy over a new file.
- GitHub sometimes refuses the connection for a few minutes ("SSL/TLS connection failed"). Carry on with the work and retry later; it came back within the hour on 2026-11-16.
- The repo clone and the test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test files if they're gone.
- Test rig that worked on 2026-11-16 (rebuild if gone):
  - `run.sh script.js "query" [shot.png] [w,h] [budget-ms]` (Git Bash): copies index.html into the scratchpad with a `<base href>` to the project, an error catcher (`window.__errs`), and one test script at the end; runs headless Edge (`--dump-dom`, or `--screenshot` with `--virtual-time-budget`); prints what is between "RES"+"ULT" and "END"+"RES" in a `<pre>`. Edge needs `--user-data-dir`, `--enable-unsafe-swiftshader` (3D), `--allow-file-access-from-files`.
  - `t-race.js`: a whole EASY-mode race by a pretend finger (answers gates right; `&wrong=1` first answer wrong). `&shot=1&gate=N&near=SEGMENTS` freezes that close to gate N for a screenshot. Reports my time and place and every bot's finish time and progress. (The 2026-11-16 version with a regular-mode autopilot, `wander`, `secret`, `fork`, `orange` is gone: rebuild if needed.)
  - `t-looks.js`: `?mode=sheet` (every outfit in Capture the Flag, big), `picker` (fakes a login: `account.user`, `masteryPoints = () => N`), `race&order=look,look,…` (sleds on the start grid; crop the right-hand sled).
  - `t-ctfbots.js`: Capture the Flag with bots. `?humans=N&secs=S` (the people stand still); reports the score every 30 s, grabs, knockouts, stuck seconds; `&shot=1` for a screenshot.
  - `t-smoke.js`: a short Capture the Flag game with outfits; reports errors.
  - Number tests set `requestAnimationFrame = () => 0`; screenshot tests leave it alone and freeze with `update = () => {}; serverUpdate = () => {}`.
- Scripted edits: write a perl script with the Write tool (read and write with `:raw`; the files use plain LF line endings), then run it with Git Bash's perl. Heredocs in Git Bash break on apostrophes and can garble Hebrew: use the Edit tool for anything with Hebrew in it.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Popups that open over a screen need z-index 40 (add their id to the rule in style.css).
