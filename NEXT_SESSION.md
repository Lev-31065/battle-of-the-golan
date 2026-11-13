# Next session

## Where we stopped (2026-11-13)
- Live version: **v 2026-11-13c** (shown under Privacy on the home screen). Everything is uploaded.
- Daniel raced the bots on v 13b: **"Awesome, the racing was great."**
- He then asked for 5 things, all built in v 13c (details in STATE.md), **not yet tried by him**:
  1. Sleds can't overlap; they bump each other a bit.
  2. Big open snowfields (the start, and here and there on the way down).
  3. The screen stays on (it used to switch off after a minute with tilt steering).
  4. Snow that looks more like real snow, better spray, runner tracks.
  5. Steering that turns the sled slowly and keeps its direction (no swinging back to straight).

## Next steps
1. Ask Daniel how v 13c feels. The likely tuning knobs, all in `RACE` (rules.js):
   - steering: `turnRate` (how fast it turns), `steerReturn` (0 = keeps direction; 0.5 = straightens slowly)
   - bumping: `bumpShove`, `bumpBoost`
   - snowfields: `fieldWidth`, `fieldTrees`; how often they come is `wr > 0.82` in race-track.js
   - did the screen stay on? (If not: which phone? Old iPhones need a different trick.)
2. Race plan next: **step 4 gift boxes** (🍌 dropped behind, 🥭 thrown forward; original names and art), step 5 multiplayer polish, step 6 sounds + podium.
3. Other visual ideas: bigger hills (`RACE.hills`), more ridge views, nicer far mountains, other sleds' crashes.

## Questions for Daniel
- Capture the Flag lag: when does it happen (school Wi-Fi? many players?). It's the network, not the drawing.
- Bots: is 4 sleds right, and should bots get easier or harder by level?
- What's the 3rd game?
- Older questions:
  - Levels 18–20 use לְ/אֶל + pronoun: keep, or give it its own level?
  - More Key concepts decks?
  - Decks for the other verb patterns?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the race test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test copy if they're gone (see the Gotchas in STATE.md).
- In PowerShell, don't name a helper `R` or `rd` (built-in shortcuts; `rd` = delete). Scripts need `-ExecutionPolicy Bypass`.
- Perl one-liners with `s|…|…|`: a `\|\|` in the PATTERN means "or" and matches nothing at the file's start. Use another delimiter.
