# Next session

## Where we stopped (2026-11-15)
- Live version: **v 2026-11-15b** (shown under Privacy on the home screen). Everything is uploaded; the project folder matches the live site.
- **v 15a = Daniel's fifth race list** (details at the top of the race section in STATE.md): one-tap start, countdown from 10, steering arrows twice as long, tight-bend "vacuum" fix, gentler skid, slow crashes nudge / fast crashes spin out, momentum, boulders with a question, "back to the path" returns to where you left it, 14 gates, anona speed-boost gift, camera follows the sled.
- **v 15b = the "overarching" things:** mastery points, 6 looks (hats) for both games, and a log-in card after a game for guests (top of STATE.md).
- Daniel has NOT played either yet.

## Next steps
1. Ask Daniel how v 15a feels. Tuning is all in `RACE` (rules.js):
   - hairpins: `skidSlide`, `skidTurn`, `skidTurnRate`, `skidSpeed`
   - crashes: `spinHitFrom` (spin out from this speed), `hardHitTurn`, `crashShove`
   - momentum and slope: `coast`, `roamCoast`, `slopeSpeed`, `slopeLimits`
   - camera: `cameraTurn`, `cameraFollow`
   - boulders: `boulders`, `boulderSize`, `boulderHop`; anona: `anonaSpeed`, `anonaTime`, the gift chances
   - gates: the `gate(…)` lines in "THE RIDE" (race-track.js), `gateZoneShort`
2. Ask about points and looks: are the prices right (`LOOKS` in rules.js)? More looks, or whole characters instead of hats? Should points be spent rather than just reached?
3. Still open from before: "the next thing" (podium? two-phone polish? the 3rd game?), and a two-phone race test.

## Questions for Daniel
- "Returning to where you left the path": Claude kept riding back onto the path by yourself (zigzag gaps, trails) as allowed. Is that what you meant?
- Should the log-in card show after every game, or only once per visit?
- Should the privacy page mention that the chosen look is saved with the progress?
- Older: zigzag gaps marked or secret? Bots using gaps and trails? Capture the Flag lag? Levels 18–20 with לְ/אֶל + pronoun?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test files if they're gone.
- Test rig that worked on 2026-11-15 (rebuild if gone):
  - `go.ps1 -script X -query "…" [-shot file.png]`: copies index.html into the scratchpad with a `<base href>` to the project, an error catcher, and one test script at the end; runs headless Edge (`--dump-dom`, or `--screenshot` with `--virtual-time-budget=4000`); prints what is between "RES"+"ULT" and "END"+"RES" in a `<pre>`. Edge needs `--user-data-dir`, `--enable-unsafe-swiftshader` (3D), `--allow-file-access-from-files`.
  - `t-race.js`: map check (`close` must be `[]`) + a whole autopilot race (it replaces `steerInput` and `skidInput`). `?hold=1` (holds the skid all the way round hairpins), `?noskid=1`, `?wrong=1`, `?crash=SPEED&stop=75` (puts a rock in front of the sled), `?stop=N&shot=1`, `?maponly=1`.
  - `t-roam.js`: leaves the path at `?seg=N`, hits a fake boulder (wraps `landTreesNear`), answers (`quiz.onCorrect`), presses "back to the path". `?shot=real` parks the sled in front of a real boulder.
  - `t-looks.js`: points sums, `myLook`, `?mode=picker|ctf|race|nudge` for screenshots. It fakes a login with `account.user = { id, email }`.
  - Number tests set `requestAnimationFrame = () => 0`; screenshot tests leave it alone and freeze with `update = () => {}; serverUpdate = () => {}`.
- Scripted edits: Git Bash heredocs break on quotes and garble Hebrew/emoji. Write a perl script with the Write tool (no apostrophes inside its single-quoted strings; read and write with `:raw`), then run it with Git Bash's perl.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Popups that open over a screen need z-index 40 (add their id to the rule in style.css).
