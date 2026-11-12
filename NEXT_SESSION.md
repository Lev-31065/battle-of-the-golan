# Next session

## Where we stopped (2026-11-12, night)
- Live version: **v 2026-11-12p** (shown under Privacy on the home screen). Everything is uploaded.
- This session: built game 2, **Mt Hermon Racing** 🛷 (details in STATE.md).
  - One downhill sled ride from Mt Hermon to the Kinneret.
  - Answer gates: an English word on the sign, Hebrew answers over 3 lanes.
  - Curves, hills, trees on the path.
  - Touch or tilt steering, and a view that turns with the sled.
  - A rustic sled: kippah, tallit-striped scarf, tzitzit, Israeli flag.
- Daniel on v 12p: **"its great!"**
- **Not tested yet:**
  - tilt steering on a real phone
  - auto-sideways at race start (Android; iPhones get the "turn your phone" card)
  - 2 phones racing each other
  - speed on an older phone

## Next steps (the race plan: steps 1–2 of 6 done)
1. Ask how tilt steering and the sideways start felt on the phone. If it's choppy, lower `RACE.drawDistance`.
2. **Step 3: bots.**
   - Computer sleds that race too, so 1 player has someone to beat.
   - They run on the referee (host) phone: they steer along the path, dodge trees and sometimes pick the right lane at gates.
3. **Step 4: gift boxes.**
   - Some gates give a mystery gift: 🍌 banana (dropped behind, makes a sled spin) and 🥭 mango (thrown forward at the sled ahead).
   - Keep the names and art original.
4. Then step 5 (multiplayer polish) and step 6 (sounds, a podium at the finish).

## Questions for Daniel
- How many bots, and should they get easier or harder by level?
- What's the 3rd game?
- Older questions:
  - Levels 18–20 use לְ/אֶל + pronoun: keep, or give it its own level?
  - More Key concepts decks?
  - Decks for the other verb patterns?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -q --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone lives in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` if it's gone. The race test copy (`<scratchpad>/t/`) is there too; rebuild it from `index.html` + `test.js` if it's gone (see the Gotchas in STATE.md).
- In PowerShell, don't name a helper `R` or `rd` (built-in shortcuts; `rd` = delete).
