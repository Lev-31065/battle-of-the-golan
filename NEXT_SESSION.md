# Next session

## Where we stopped (2026-11-13)
- Live version: **v 2026-11-13a** (shown under Privacy on the home screen). Everything is uploaded.
- Daniel: tilt steering is great (better than tapping). The visuals "have a long way to go": he wants to coast through valleys and over peaks, and crashes that look like real hits.
- This session: **Mt Hermon Racing is now drawn in real 3D** (`race-3d.js` + three.js; details in STATE.md), and **crashes are solid** (stop, bounce back, slide round; the tree rocks and snow bursts off).
- **Daniel hasn't seen the 3D version yet.** Only tested in headless Edge.

## Next steps
1. Ask Daniel how 3D looks and runs on his phone (smooth? anything ugly?). If choppy: lower `RACE.viewDistance` or `RACE.sharpness`.
2. Visual polish he asks for. Ideas: bigger hills (`RACE.hills`, or stretch them in 3D only), more ridge views, 3D snow spray, nicer far mountains, other sleds' crashes.
3. Then back to the race plan: **step 3 bots**, step 4 gift boxes (🍌 dropped behind, 🥭 thrown forward; original names and art), step 5 multiplayer polish, step 6 sounds + podium.

## Questions for Daniel
- Capture the Flag lag: when does it happen (school Wi-Fi? many players?). It's the network, not the drawing.
- How many bots, and should they get easier or harder by level?
- What's the 3rd game?
- Older questions:
  - Levels 18–20 use לְ/אֶל + pronoun: keep, or give it its own level?
  - More Key concepts decks?
  - Decks for the other verb patterns?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the race test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test copy if they're gone (see the Gotchas in STATE.md).
- In PowerShell, don't name a helper `R` or `rd` (built-in shortcuts; `rd` = delete).
