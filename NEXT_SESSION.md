# Next session

## Where we stopped (2026-11-14)
- Live version: **v 2026-11-14c** (shown under Privacy on the home screen). Everything is uploaded.
- Daniel played v 14a and sent a second, bigger list. **All of it is built and live, not yet tried by him** (details in STATE.md):
  - v 14b: same-size gates (6, no small ones), wrong answer bounces you back until you get it right, skid by holding a turn for 1 s, bushes and snowmen only slow you, trees and rocks clack and knock you aside, far-away explosions are silent.
  - v 14c: a whole new hand-written track: downhill → sharp bend into deep woods → bridge → loop → tunnel under the bridge → steep mountain face with a shortcut → hills with jumps and tilted bends → Kinneret. Plus mountain goats.

## Next steps
1. Ask Daniel how v 14c feels. Most likely tuning, all in `RACE` (rules.js) or in "THE RIDE" (race-track.js):
   - sharp bends too hard? `sharpSteer` (1.25; lower = easier), or the `sharp` number of each `turn(…)` in the woods (11–12.5 now)
   - skids starting by accident? `skidAfter` (1 s)
   - bounce after a wrong answer: `gateBounce` (9000), `gateBounceTime`
   - woods too short / too long? Add or remove `turn` / `fork` pieces in section 2 of "THE RIDE", then check the map
   - goats: `goatHitSpeed`, `goatAway`; hits: `softHitSpeed`, `hardHitSpeed`, `hardHitTurn`
2. Then race step 5 (two phones racing: do skids, bounces, goats, rimonim look right on the other phone?) and step 6 (podium).

## Questions for Daniel
- Is 6 gates right now that a wrong answer costs a lot?
- The shortcut down the mountain face is the same length as the big curve, only faster. Good enough, or should it look more different?
- Capture the Flag lag: when does it happen (school Wi-Fi? many players?).
- Bots: is 4 sleds right, and should bots get easier or harder by level? Should bots skid?
- What's the 3rd game?
- Older: levels 18–20 use לְ/אֶל + pronoun: keep, or its own level? More Key concepts decks? Decks for the other verb patterns?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the race test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test copy if they're gone (see the Gotchas in STATE.md).
- Test scripts in the scratchpad (rebuild if gone): `t-map.js` prints the track's numbers (crossing gap and drop, closest approach of far-apart pieces, gates, goats) and with `?map=1` draws the map; `t-race.js` drives a whole race (`?fork=special` takes the jump / shortcut sides, `?seg=N` stops for a screenshot at segment N, `?flat=1` uses the flat drawing).
- Test rig that worked on 2026-11-14: a perl script copies index.html with a `<base href>` + an error catcher + one test script; a PowerShell script runs headless Edge (`--dump-dom` for numbers, `--screenshot` for pictures). Perl only exists inside Git Bash: from PowerShell call `C:\Program Files\Git\usr\bin\perl.exe`. For screenshots do NOT block `requestAnimationFrame` (the HUD canvas stays blank).
- In PowerShell, don't name a helper `R` or `rd` (built-in shortcuts; `rd` = delete). Scripts need `-ExecutionPolicy Bypass`.
- Perl: `@` inside a double-quoted string gets eaten; `\|\|` in a pattern means "or".
- Scripted edits: Git Bash heredocs break on quotes and garble Hebrew/emoji. Use the Edit tool, or write new code with the Write tool and splice it in with a small perl script.
