# Next session

## Where we stopped (2026-11-10)
- Big Capture-the-Flag upgrade, tested by Daniel ("everything is amazing"): always-visible joystick, players bounce off each other, new map look with a 3D feel, a bigger mirrored map, hollow logs to hide in, a river current, two kinds of bushes (both slow you down), speed box every 30 s.
- **Built + uploaded, NOT tested yet:**
  - Berries v2: touch each berry to eat it, +10% speed for 8 s each, adding up to +50%. Two huge berry bushes with 12 berries each.
  - 11 new premade decks: 🔁 לְלַמֵּד + 🌱/🔁 for ק־ר־א, ש־א־ל, ש־מ־ע, ר־א־ה, נ־ת־ן.
- Everything is uploaded. Claude now uploads with git (see Deploy in `AGENTS.md`).

## Next steps
1. Test berries v2 on phones. Is the +50% cap right? Are berries easy enough to touch? Settings: `BERRY` in `rules.js`.
2. Test the new premade decks and check their nikud (list in `STATE.md`).
3. Tune by feel if needed: `MAP.riverFlow` (current), `LOG.darkness`, `BUMP.bounceSpeed`.
4. Design the 2 other game modes (the "coming soon" buttons).

## Open questions for Daniel
- What are the other 2 game modes?
- Should a player hiding in a log be safe from hammers? (Right now they can still be hit.)
- Is the ground sharp enough on phones? (`GROUND_RES` 1.5; higher = sharper but uses more memory.)
- When a teacher leaves a class game, should they land on the dashboard instead of the home screen?
- Should "My decks" also show in normal rooms for a logged-in teacher? Should "📋 Copy & edit" work on the regular levels?
- MyMemory is OK for simple words. Switch to Google Translate later (needs a billing card)?
- When to add payments for the teacher dashboard? Domain + Resend for nicer login emails: when?
