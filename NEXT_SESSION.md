# Next session

## Where we stopped (2026-11-16)
- Live version: **v 2026-11-16a** (shown under Privacy on the home screen). The project folder matches the live site (the `supabase` folder stays off GitHub on purpose).
- **v 16a (top of STATE.md), headless-tested, NOT yet tried by Daniel:**
  - Race, easy mode: lanes across the whole path; both ways round the splits (also the mountain-face shortcut); secret shortcuts by tapping a glowing gold arrow.
  - Race: orange gift (short, very fast burst); stronger bots.
  - Looks are whole outfits now (bandit is new), prices up, drawings in the picker.
  - Modes screen: race first, Capture the Flag second, no third slot.
  - README rewritten.
- Daniel said (2026-11-16): easy mode is really good; the sledding game is really good; 2 games is plenty; assume the Hebrew is fine during beta.

## Next steps
1. FIRST THING: ask how v 16a feels on a real phone:
   - Easy mode: can a little kid find and take a secret shortcut (gold arrow, then one more tap at the edge)? Window: `RACE.easySecretAt`. Enough lanes to pass? `RACE.easyLane`.
   - Bots: too strong, too weak? `botSkill`, `botRight`, `botEase`, `botPush`, `botShortcut`.
   - Orange: `orangeSpeed`, `orangeTime`, `orangeFade`; how often: `giftsInFront` / `giftsBehind`.
   - Outfits: does the bandit look right? Are the prices right (`LOOKS`)? Can teams still be told apart in Capture the Flag?
2. Still unanswered from 15f + 15g: the regular-mode camera (`RACE.cameraMotion`), Capture the Flag taps (`TOUCH`), details of the public game.
3. Still open: a two-phone race test; the log-in card after every game or once per visit.

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
  - `t-race.js`: a whole race. `?easy=1` (pretend finger: answers gates right; `&wander=1` random lanes, `&secret=1` takes every secret shortcut, `&fork=fast|slow`, `&wrong=1` first answer wrong, `&orange=1` every gift is an orange) or `?easy=0` (a rough autopilot). `&shot=1&stop=SECONDS` freezes there for a screenshot. Reports time, place, bot times, real tree hits (`hits`), shortcut rides, forks taken. `crashes` also counts rimon bangs, so read `hits`.
  - `t-looks.js`: `?mode=sheet` (every outfit in Capture the Flag, big), `picker` (fakes a login: `account.user`, `masteryPoints = () => N`), `race&order=look,look,…` (sleds on the start grid; crop the right-hand sled).
  - `t-smoke.js`: a short Capture the Flag game with outfits; reports errors.
  - Number tests set `requestAnimationFrame = () => 0`; screenshot tests leave it alone and freeze with `update = () => {}; serverUpdate = () => {}`.
- Scripted edits: write a perl script with the Write tool (read and write with `:raw`; the files use plain LF line endings), then run it with Git Bash's perl. Heredocs in Git Bash break on apostrophes and can garble Hebrew: use the Edit tool for anything with Hebrew in it.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Popups that open over a screen need z-index 40 (add their id to the rule in style.css).
