# Next session

## Where we stopped (2026-11-15)
- Live version: **v 2026-11-15g** (shown under Privacy on the home screen). Everything is uploaded; the project folder matches the live site (the `supabase` folder stays off GitHub on purpose).
- **v 15f + 15g (top of STATE.md), headless-tested, NOT yet tried by Daniel:**
  - Race: faded ◀ ▶ steering arrows next to faded skid buttons; easy mode (on for guests, "🐣 Easy mode" switch in the race lobby, arrows change lanes, sled follows the path); regular-mode camera follows the real direction of motion.
  - Capture the Flag: tap an enemy to hit / throw at them, tap anywhere to throw there, drag from your own player to walk.
- Done and confirmed by Daniel this session: "📊 Usage" button shows (usage SQL worked); public Capture the Flag starts after 20 s with 1 player (15e, "Looks good"); he tried a public game (said only "I did do the public game", no problems reported, no details).
- Earlier the same day: 15a fifth race list, 15b mastery points + looks + log-in card ("It's very good"), 15c public games, 15d usage statistics.

## Next steps
1. FIRST THING: ask how v 15f + 15g feel on a real phone, with a little kid if possible:
   - Easy mode: are the lane changes clear at gates? Is 92% speed right (`RACE.easySpeed`)? Lane feel: `easyLane`, `easyLaneSpeed`, `easyRepeat`.
   - Camera in regular mode: does it swing too much on small lane changes? Off switch: `RACE.cameraMotion`.
   - Capture the Flag taps: do taps get mistaken for joystick drags or the other way round? (`TOUCH` in rules.js: `tapMove`, `tapTime`, `grab`, `target`.)
2. Ask for details on the public game: was it two phones? Did the second phone land in the first phone's room? Any "Lost connection"? Is 20 s the right wait (`PUBLIC.startDelay`)? What should happen to someone who lands in the middle of a race?
3. Older race tuning, if he brings it up (all in `RACE`, rules.js): hairpins (`skidSlide`, `skidTurn`, `skidTurnRate`, `skidSpeed`), crashes (`spinHitFrom`, `hardHitTurn`, `crashShove`), momentum (`coast`, `roamCoast`, `slopeSpeed`, `slopeLimits`), boulders, anona, gates.
4. Still open: points and looks prices (`LOOKS`), "the next thing" (podium? the 3rd game?), a two-phone race test.

## Questions for Daniel
- Easy mode choices Claude made: 8% slower than regular; always avoids the rocky mountain-face shortcut; tapping with the spear turns you to point it that way. Keep all three?
- A grenade flies its full distance in the tapped direction instead of landing on the tapped spot. Fine?
- The Hebrew on the privacy page and the new easy-mode / tap how-to text was written by Claude and not checked by a Hebrew speaker.
- The README does not mention public games, looks, usage counting or easy mode. Update it?
- Should the log-in card show after every game, or only once per visit?
- Older: zigzag gaps marked or secret? Bots using gaps and trails? Capture the Flag lag? Levels 18–20 with לְ/אֶת + pronoun?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Never upload the `supabase` folder (Daniel's local `usage.sql` has his email in it). Never write his email into a project file.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr -x .git -x supabase`): VS Code once saved an old open copy over a new file.
- The repo clone and the test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test files if they're gone.
- Test rig that worked on 2026-11-15 (rebuild if gone):
  - `go.ps1 -script X -query "…" [-shot file.png] [-size "w,h"] [-budget ms]`: copies index.html into the scratchpad with a `<base href>` to the project, an error catcher, and one test script at the end; runs headless Edge (`--dump-dom`, or `--screenshot` with `--virtual-time-budget=4000`); prints what is between "RES"+"ULT" and "END"+"RES" in a `<pre>`. Edge needs `--user-data-dir`, `--enable-unsafe-swiftshader` (3D), `--allow-file-access-from-files`.
  - `t-race.js`: map check (`close` must be `[]`) + a whole autopilot race (it replaces `sideInput` / `steerInput` and `skidInput`). `?easy=1|0`, `?wander=1` (random lane changes), `?hold=1`, `?noskid=1`, `?wrong=1`, `?crash=SPEED&stop=75`, `?stop=N&shot=1`, `?maponly=1`. Good easy run: about 308 s, 0 crashes, 0 off-path.
  - `t-ctf.js`: pretend PointerEvents for the tap controls (hammer tap on an enemy, tap on empty ground, rock throw, drag from the player, old joystick). Reset the swing cooldown and snap the enemy's drawn position first, or the hit reads 0.
  - `t-solo.js`: one player in a public Capture the Flag room; the game must start at 20 s.
  - `t-roam.js`: leaves the path at `?seg=N`, hits a fake boulder (wraps `landTreesNear`), answers (`quiz.onCorrect`), presses "back to the path". `?shot=real` parks the sled in front of a real boulder.
  - `t-public.js`: public-room referee checks. `two.ps1 -game ctf` starts TWO live headless Edges (`--remote-debugging-port` 9333 / 9334, own profiles) that really go online with `?mode=net`; each page writes its state into `document.title`, read back from `http://localhost:PORT/json`.
  - `t-stats.js`: usage counting with a pretend `supa` (run Edge with `--dump-dom` AND `--virtual-time-budget=3000`; `?shot=1` leaves the Usage screen open). `players` in game.js is a const: fill it with `Object.assign`.
  - `t-looks.js`: points sums, `myLook`, `?mode=picker|ctf|race|nudge` for screenshots. It fakes a login with `account.user = { id, email }`.
  - Number tests set `requestAnimationFrame = () => 0`; screenshot tests leave it alone and freeze with `update = () => {}; serverUpdate = () => {}`.
- Scripted edits: Git Bash heredocs break on quotes and garble Hebrew/emoji. Write a perl script with the Write tool (no apostrophes inside its single-quoted strings; read and write with `:raw`), then run it with Git Bash's perl.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Popups that open over a screen need z-index 40 (add their id to the rule in style.css).
