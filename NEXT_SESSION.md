# Next session

## Where we stopped (2026-11-07)
- Done and tested on phones: 3A/3B level names and side tag, back to the teams after a game plus the Home button, masculine/feminine choice.
- Built but not yet confirmed on phones: the two-flags scoring fix, 🚪 leave popup, room code on screen and easier rejoin, iPhone zoom fix, full screen, new Auto numbers, 27 new pronoun sentences.
- Daniel may still need to upload `words.js` (step 4). The other files from this session were uploaded for testing.

## Next steps
1. Upload `words.js`, then play levels 10, 11 and 13 (most of the new sentences are there). Check the nikud on the new lines.
2. Check on phones:
   - The flag fix: drop the enemy flag in your base, then bring your own flag home. It should score.
   - Does the iPhone still zoom to 2×?
   - Does full screen work on Android?
   - Do the new Auto numbers feel right?
3. Build **teacher decks**: a "My decks" page for logged-in users (make, edit, delete; paste lines like `dog = כֶּלֶב`). Their decks appear in the lobby picker when they host. The Supabase `decks` table already exists.

## Open questions for Daniel
- If the iPhone still zooms: when exactly does it happen (which screen, and what was tapped)?
- Level 1 is called "1A" even though there's no 1B. Keep it, or call it just "1"?
- Privacy page plus "delete my account": when? Domain plus Resend for nicer emails?
