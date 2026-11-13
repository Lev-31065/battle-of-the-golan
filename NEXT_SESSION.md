# Next session

## Where we stopped (2026-11-13)
- Live version: **v 2026-11-13d** (shown under Privacy on the home screen). Everything is uploaded.
- Built in v 13d (details in STATE.md), headless-tested, **not yet tried by Daniel**:
  1. **Race step 4: gift boxes** → 🍌 banana peel (dropped behind) or 🥭 mango (thrown ahead). Big round button on the right, or Space.
  2. **Kart-style steering:** in bends you have to steer round; the sled slides a little; a whole bend on the path = "carve boost".
  3. **The sled sits on the ground** (tips with the slope, no more leaning over when turning).
  4. **Snow jumps** (about 20 ramps) with a boost for landing on the path.
  5. **Alternate paths:** 6 places where the path splits around an island (one way = 2 jumps, the other = gift boxes).
  6. **The finish:** cross the line, up a wooden ramp, fly into the Kinneret, splash.
- Still untried from v 13c: sleds bumping, snowfields, screen staying on, snow look.

## Next steps
1. Ask Daniel how v 13d feels. The likely tuning knobs, all in `RACE` (rules.js):
   - bends too hard / too easy: `curveSteer` (0 = sled follows bends by itself, 1 = fully real; now 0.5)
   - too slippery: `grip` (higher = less sliding); turning too fast/slow: `turnRate`
   - jumps: `gravity` (lower = floatier), `rampHeight`, `rampEvery` (lower = more ramps)
   - too many boosts: `carveAfter`, `carveBoost`, `landBoostTime`
   - items: `boxEvery`, `spinTime`, `spinSpeed`, `mangoSpeed`, `mangoRange`
   - splits: `forkLength`, `forkIsland`
   - is the gift button in a good place for touch steering? (`.item-button` in style.css)
2. Race plan next: step 5 multiplayer polish (2 phones: do jumps, peels and mangoes look right on the other phone?), step 6 sounds + podium.
3. Ideas: a gift box floating in the air over a jump; more gift kinds; tricks in the air.

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
- Scripted edits: write a perl script with the Write tool (exact-text replace, each found once), not a bash heredoc.
