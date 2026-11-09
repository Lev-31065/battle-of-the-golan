# Next session

## Where we stopped (2026-11-08)
- Did the whole 5-step restructure in one session. Steps 1–4 are tested and Daniel is happy ("It works great", "I love the dropdown list").
  1. Teacher dashboard (replaces "My decks"); a class game is hosted from there.
  2. Game-mode screen after "Create a room" (Capture the Flag + 2 "coming soon").
  3. Normal rooms: each player picks their own level (Auto + levels only). Class games: the teacher picks for everyone.
  4. Deck editor as a table with ➕ wrong answers, Excel paste, and 📋 copy & edit of premade decks.
- **Step 5 (auto-translate Hebrew → English with MyMemory) is built but NOT tested.** Daniel will test on 2026-11-09.
- Upload for Step 5 (if not done yet): `index.html`, `style.css`, `decks.js`, `rules.js`, `privacy.html`.

## Next steps
1. Test auto-translate on a computer: dashboard → New deck → type כֶּלֶב → Enter: "dog" should appear in purple. Paste a column of Hebrew words from Excel: each row should get English. Read the new MyMemory line on the privacy page.
2. Check the nikud in the premade decks (`TOPIC_DECKS` in `words.js`) and the 27 pronoun sentences (levels 4, 7, 8, 10–14).
3. Design the 2 other game modes (the "coming soon" buttons). Ask Daniel what they should be.

## Open questions for Daniel
- What are the other 2 game modes?
- When a teacher leaves a class game, should they land on the dashboard instead of the home screen?
- Should "My decks" also show in normal rooms for a logged-in teacher? (Right now: class games only.)
- Should "📋 Copy & edit" also work on the regular levels, not just premade decks?
- Is MyMemory good enough, or switch to Google Translate later (needs a billing card)?
- When to add payments for the teacher dashboard (Stripe or similar)?
- Install Git so Claude can upload? Domain + Resend for nicer login emails: when?
