# Next session

## Where we stopped (2026-11-14)
- Live version: **v 2026-11-14a** (shown under Privacy on the home screen). Everything is uploaded.
- Daniel played v 13d ("very good") and asked for a list of race changes. **Part 1 is built and live, not yet tried by him** (details in STATE.md):
  1. Tilt steering removed.
  2. Skid: double-tap a side and hold.
  3. Start hint circles ("hold to turn / double-tap and hold to skid").
  4. Camera higher, looking down more.
  5. Gifts come from question gates (6 new small gates on the island paths); gift boxes are gone.
  6. Rimon grenade: throw ahead or drop behind.
  7. Rounder sled and rider.
  8. Soft crash / bump / hit sounds.

## Next steps
1. Ask Daniel how v 14a feels. Tuning knobs, all in `RACE` (rules.js):
   - skid: `skidTurn` (how far it swings), `skidTurnRate`, `skidSpeed` (how much it slows), `skidTapGap` (double-tap window; raise it if skids are hard to start, lower it if they start by accident)
   - view: `camHeight`, `camBack`, `camAhead`, `camFov`
   - rimon: `rimonRange`, `rimonBlast`, `rimonBlastLong`; gift chances `giftsInFront` / `giftsBehind`
2. **Part 2 of Daniel's list (track changes, in race-track.js + race-3d.js):**
   - some much sharper bends (now max curve 7; skidding makes sharper ones possible)
   - shortcuts that cut over the hill a bend goes round: shorter, but bumpy/steep so you can fly off
   - banked (tilted) bends you can take fast
3. Then race step 5 (two phones racing: do skids, rimonim and explosions look right on the other phone?) and step 6 (podium).

## Questions for Daniel
- Should the big gates give gifts too (they do now), or only the small island gates?
- Capture the Flag lag: when does it happen (school Wi-Fi? many players?).
- Bots: is 4 sleds right, and should bots get easier or harder by level? Should bots skid?
- What's the 3rd game?
- Older: levels 18–20 use לְ/אֶל + pronoun: keep, or its own level? More Key concepts decks? Decks for the other verb patterns?

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr`): VS Code once saved an old open copy over a new file.
- The repo clone and the race test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test copy if they're gone (see the Gotchas in STATE.md).
- Test rig that worked on 2026-11-14: a perl script copies index.html with a `<base href>` + an error catcher + one test script; a PowerShell script runs headless Edge (`--dump-dom` for numbers, `--screenshot` for pictures). Perl only exists inside Git Bash: from PowerShell call `C:\Program Files\Git\usr\bin\perl.exe`. For screenshots do NOT block `requestAnimationFrame` (the HUD canvas stays blank).
- In PowerShell, don't name a helper `R` or `rd` (built-in shortcuts; `rd` = delete). Scripts need `-ExecutionPolicy Bypass`.
- Perl: `@` inside a double-quoted string gets eaten; `\|\|` in a pattern means "or".
- Scripted edits: Git Bash heredocs break on quotes and garble Hebrew/emoji. Use the Edit tool, or write new code with the Write tool and splice it in with a small perl script.
