# Next session

## Where we stopped (2026-11-14)
- Live version: **v 2026-11-14g** (shown under Privacy on the home screen). Everything is uploaded.
- Daniel played v 14e ("It's great") and sent a fourth list. **Built and live, not yet tried by him** (details at the top of the race section in STATE.md):
  - v 14f: slower, steady speed that follows the slope (no surprise boosts), off-path only 30% slower, tighter skid bends, gas gift, homing mangoes, open bridges you ride under, and the fix for path pieces that were not drawn.
  - v 14g: free off-roading with a "Back to the path" button, a track full of zigzags with a secret gap in each row of rocks, 4 winding secret trails (one over the hills after gate 1), solid scenery trees, gates that can't be skipped.

## Next steps
1. Ask Daniel how v 14g feels. Likely tuning, in `RACE` (rules.js) or "THE RIDE" / the `addTrail` lines (race-track.js):
   - roaming: `roamTurn`, `roamSkidTurn`, `roamSlope`, `offTrackSpeed`; how easily you rejoin the path (`roamJoin`)
   - zigzag gaps too strong or too hard to hit: `zigGap` (17), where the gap is on the leg (the `0.45 + random() * 0.35` line), rocks (`rockHitSpeed`)
   - trails: `speed`, `wiggle`, `wave`, `half` in each `addTrail(…)`; the hill trail's `via` points and `hills`
   - race length (about 4½ min on the path): fewer legs in a `zigzag(…)`, or `maxSpeed`
   - phones too slow? `nearView` (300), `viewDistance`
2. **"You can add the next thing"** (Daniel, 2026-11-14): not built. Ask what he meant. Claude's guess: the podium (race step 6) and two-phone polish (step 5).
3. Two phones: do roaming sleds, gas and drops between zigzag legs look right on the other phone?

## Questions for Daniel
- What is "the next thing": the podium, the two-phone polish, or the 3rd game?
- Should the zigzag gaps be marked a little (two poles?), or stay fully secret?
- Should bots use the gaps and trails sometimes?
- Capture the Flag lag: when does it happen (school Wi-Fi? many players?).
- Older: levels 18–20 use לְ/אֶל + pronoun: keep, or its own level? More Key concepts decks? Decks for the other verb patterns?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the race test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test files if they're gone (see the Gotchas in STATE.md).
- Test rig that worked on 2026-11-14 (rebuild if gone):
  - `mk.pl` copies index.html with a `<base href>` + an error catcher + one test script pasted in at the end.
  - `go.ps1` runs headless Edge on it (`--dump-dom` for numbers, `--screenshot` for pictures). The test writes its result into a `<pre>`; build the marker text in pieces ("RES" + "ULT"), or the search finds the script's own text.
  - `t-map.js` prints the track's numbers and with `?map=1` draws the map (trails in pink, zigzag gaps as green dots). It must show `close: []` (no two stretches closer than their widths), every crossing with a gap near 0 and a drop of about 23, and each trail's `nearest` (how close it comes to the path away from its ends) above about 10.
  - `t-race.js` drives a whole race with an autopilot (it replaces `steerInput` and `skidInput`): `?fork=special`, `?noskid=1`, `?wrong=1`, `?seg=N` (stop for a screenshot), `?flat=1`, `?roam=GAPSEG&side=-1&time=8` (leave the path through a zigzag gap, go straight for 8 s, press the button), `?trail=N` (ride secret trail N), `?stoproam=T` (screenshot T seconds after leaving the path). It lists where it crashed and into what.
- Perl only exists inside Git Bash (from PowerShell: `C:\Program Files\Git\usr\bin\perl.exe`). For screenshots do NOT block `requestAnimationFrame`.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Scripted edits: Git Bash heredocs break on quotes and garble Hebrew/emoji. Write the perl script with the Write tool, then run it. Perl: `@` inside a double-quoted string gets eaten.
- A test autopilot that never leaves "hug the edge" mode misses gates and loops forever on the bounce: that is the test's fault, not the game's.
