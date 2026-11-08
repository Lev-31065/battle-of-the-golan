# Next session

## Where we stopped (2026-11-08)
- Confirmed on phones: the delete-account popup and the 🏠 Home button in the lobby both work (the popups had been hidden behind the screens).
- Built and tested in headless Edge (28 checks pass), but not yet on phones:
  - Hebrew-first everywhere
  - Teacher decks ("My decks")
  - 3 topic decks
  - Rejoin fixes
  - Level 1 renamed to "1"
- Daniel may not have uploaded everything yet. To be safe, upload all of these: `index.html`, `style.css`, `rules.js`, `words.js`, `game.js`, `draw.js`, `server.js`, `account.js`, `decks.js` (new), `privacy.html`.

## Next steps
1. Upload, then test on phones:
   - **Teacher decks:** log in → 📚 My decks → make a deck (`כֶּלֶב = dog`, at least 4 lines). Host a room, pick it under "My decks". A second phone should get the deck's name and its words.
   - **Topic decks:** play each one. Daniel should check the nikud (`TOPIC_DECKS` in `words.js`).
   - **Rejoin:** switch apps for about 15 s and come back, close and reopen, and join a different room after being hit. There should be no red, shaking screen, and you should come back at your base.
   - **Hebrew-first look:** check every screen on a real phone.
2. Maybe install Git so Claude can upload. Settings: VS Code as the editor, branch name `main`, everything else default. Then set a name and GitHub's noreply email.
3. Ideas if wanted:
   - A possessives topic deck (שֶׁלִּי, שֶׁלָּהּ…).
   - Teachers adding their own wrong answers to a line: `אוֹתָהּ = her | אוֹתוֹ | הִיא`.
   - Sharing decks between teachers.

## Open questions for Daniel
- Install Git now?
- Should the quiz's "How do you say this in Hebrew?" stay as it is? (The English word asked in the quiz stays English, since its Hebrew is the answer.)
- Domain plus Resend for nicer login emails: when?
