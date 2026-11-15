# Next session

## Where we stopped (2026-11-15)
- **v 15d = usage statistics** (stats.js, supabase/usage.sql; top of STATE.md). Daniel's first run of supabase/usage.sql failed only because the quote marks around his email were missing on the last line; he was told to add them and run it again. FIRST THING: ask whether the second run said "Success" and whether "📊 Usage" shows on the home screen when he is logged in. No button after a successful run = the email on the last line is not his game login. If Supabase showed another error, ask for a screenshot.
- Usage SQL worked: Daniel sees "📊 Usage" (2026-11-15).
- **v 15e:** a public Capture the Flag game starts 20 s after the FIRST player is in (was: waited for 2).
- Live version: **v 2026-11-15e** (shown under Privacy on the home screen). Everything is uploaded; the project folder matches the live site.
- **v 15a = Daniel's fifth race list** (details at the top of the race section in STATE.md): one-tap start, countdown from 10, steering arrows twice as long, tight-bend "vacuum" fix, gentler skid, slow crashes nudge / fast crashes spin out, momentum, boulders with a question, "back to the path" returns to where you left it, 14 gates, anona speed-boost gift, camera follows the sled.
- **v 15b = the "overarching" things:** mastery points, 6 looks (hats) for both games, and a log-in card after a game for guests (top of STATE.md).
- Daniel on v 15a + 15b: "It's very good."
- **v 15c = public games:** Play Game → pick a game → dropped into a public room (auto-start timer, made-up animal names). "🔒 Private room" under it = the old create / join with a code. Details at the top of STATE.md. Daniel has NOT tried it yet.

## Next steps
0. Ask Daniel to try a public game with two phones (both tap Play Game → the same game). Watch for: does the second phone land in the first phone's room, does anyone get "Lost connection", is 20 s the right wait (`PUBLIC.startDelay` in rules.js), what should happen to someone who lands in the middle of a race.
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
- The Hebrew on the privacy page (public games, mastery points, the new counting section) was written by Claude and not checked by a Hebrew speaker. Has anyone read it?
- The README does not mention public games, looks or usage counting. Update it?
- "Returning to where you left the path": Claude kept riding back onto the path by yourself (zigzag gaps, trails) as allowed. Is that what you meant?
- Should the log-in card show after every game, or only once per visit?
- Older: zigzag gaps marked or secret? Bots using gaps and trails? Capture the Flag lag? Levels 18–20 with לְ/אֶל + pronoun?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test files if they're gone.
- Test rig that worked on 2026-11-15 (rebuild if gone):
  - `go.ps1 -script X -query "…" [-shot file.png]`: copies index.html into the scratchpad with a `<base href>` to the project, an error catcher, and one test script at the end; runs headless Edge (`--dump-dom`, or `--screenshot` with `--virtual-time-budget=4000`); prints what is between "RES"+"ULT" and "END"+"RES" in a `<pre>`. Edge needs `--user-data-dir`, `--enable-unsafe-swiftshader` (3D), `--allow-file-access-from-files`.
  - `t-race.js`: map check (`close` must be `[]`) + a whole autopilot race (it replaces `steerInput` and `skidInput`). `?hold=1` (holds the skid all the way round hairpins), `?noskid=1`, `?wrong=1`, `?crash=SPEED&stop=75` (puts a rock in front of the sled), `?stop=N&shot=1`, `?maponly=1`.
  - `t-roam.js`: leaves the path at `?seg=N`, hits a fake boulder (wraps `landTreesNear`), answers (`quiz.onCorrect`), presses "back to the path". `?shot=real` parks the sled in front of a real boulder.
  - `t-public.js`: public-room referee checks (names, timer, full room, private rooms unchanged). `two.ps1 -game ctf` starts TWO live headless Edges (`--remote-debugging-port` 9333 / 9334, own profiles) that really go online with `?mode=net`; each page writes its state into `document.title`, read back from `http://localhost:PORT/json`. (Screenshots with `--virtual-time-budget` are useless for anything that waits on the network.)
  - `t-stats.js`: usage counting with a pretend `supa` (it waits on promises, so run Edge with `--dump-dom` AND `--virtual-time-budget=3000`; `?shot=1` leaves the Usage screen open). `players` in game.js is a const: fill it with `Object.assign`.
  - `t-looks.js`: points sums, `myLook`, `?mode=picker|ctf|race|nudge` for screenshots. It fakes a login with `account.user = { id, email }`.
  - Number tests set `requestAnimationFrame = () => 0`; screenshot tests leave it alone and freeze with `update = () => {}; serverUpdate = () => {}`.
- Scripted edits: Git Bash heredocs break on quotes and garble Hebrew/emoji. Write a perl script with the Write tool (no apostrophes inside its single-quoted strings; read and write with `:raw`), then run it with Git Bash's perl.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Popups that open over a screen need z-index 40 (add their id to the rule in style.css).
