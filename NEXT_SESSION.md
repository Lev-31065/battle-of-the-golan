# Next session

## Where we stopped (2026-11-14)
- Live version: **v 2026-11-14e** (shown under Privacy on the home screen). Everything is uploaded.
- Daniel played v 14c and sent a third list. **All of it is built and live, not yet tried by him** (details in STATE.md):
  - v 14d: skid buttons in the bottom corners, slower sleds, rocks nearly stop you, the carve-boost sound (which sounded like other players jumping) is now a soft swish.
  - v 14e: 10 gates, giant trees in the woods, sharper and more sharp bends (hairpins), 3 loops with bridges and tunnels, 3 secret shortcuts with rocks to skid round.

## Next steps
1. Ask Daniel how v 14e feels. Most likely tuning, in `RACE` (rules.js) or "THE RIDE" (race-track.js):
   - race too long (about 4½ min)? Cut pieces from "THE RIDE", or raise `maxSpeed` (4200)
   - skid buttons: size and place (`.skid-button` in style.css)
   - sharp bends: the `sharp` number of each `turn(…)` (14–17 now), or `sharpSteer`
   - secret ways: `secretRocks` (30), `secretSpeed` (1.5), `secretWidth`; how well hidden (`hideSecretWay` in race-track.js)
   - rocks: `rockHitSpeed` (0.1)
   - bots: too slow now? `botSkill`, `botRight`
2. Then race step 5 (two phones racing: do skids, bounces, goats, rimonim look right on the other phone?) and step 6 (podium).

## Questions for Daniel
- Is about 4½ minutes a good race length?
- "The sharp bends were not nearly enough": Claude made them both sharper AND more of them. Right reading?
- Should bots get faster, or learn the secret ways?
- Capture the Flag lag: when does it happen (school Wi-Fi? many players?).
- What's the 3rd game?
- Older: levels 18–20 use לְ/אֶל + pronoun: keep, or its own level? More Key concepts decks? Decks for the other verb patterns?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the race test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test files if they're gone (see the Gotchas in STATE.md).
- Test rig that worked on 2026-11-14 (rebuild if gone):
  - `mk.pl` copies index.html with a `<base href>` + an error catcher + one test script pasted in at the end.
  - `go.ps1` runs headless Edge on it (`--dump-dom` for numbers, `--screenshot` for pictures). The test writes its result into a `<pre>`; build the marker text in pieces ("RES" + "ULT"), or the search finds the script's own text.
  - `t-map.js` prints the track's numbers (every crossing's gap and drop, far-apart pieces of path closer than 118 units, gates, forks, ramps) and with `?map=1` draws the map.
  - `t-race.js` drives a whole race with an autopilot (replaces `steerInput` and `skidInput`): `?fork=special` takes the jump / shortcut / secret sides, `?noskid=1`, `?wrong=1`, `?seg=N` stops for a screenshot, `?flat=1`. It lists where it crashed and how long each split took.
  - After changing "THE RIDE": the map check must show `close: []` and every crossing with a gap near 0 and a drop of 40+.
- Perl only exists inside Git Bash (from PowerShell: `C:\Program Files\Git\usr\bin\perl.exe`). For screenshots do NOT block `requestAnimationFrame`.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Scripted edits: Git Bash heredocs break on quotes and garble Hebrew/emoji. Write the perl script with the Write tool, then run it. Perl: `@` inside a double-quoted string gets eaten.
