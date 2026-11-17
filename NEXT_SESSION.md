# Next session

## Where we stopped (2026-11-17)
- Live version: **v 2026-11-17g** (shown under Privacy on the home screen). The project folder matches the live site (the `supabase` folder stays off GitHub on purpose).
- Daniel tried the Capture the Flag bots (16b): "very good", then asked for more; he liked the plan for 17g ("very good job") and is testing now.
- Built this session, all headless-tested, NOT yet tried by Daniel (details at the top of STATE.md):
  - **17a** race: sleds overlap (no bumps), 7 sleds, bot levels spread out, lower gates, thin question box (for Mom's iPhone).
  - **17b** race: sound/voice/leave/full-screen buttons at the top; gift + Drop buttons under them.
  - **17c** Capture the Flag bots buy and use every shop item, a bit faster, aim ahead. Bot-only games now run longer.
  - **17d** Auto level: new players jump up 10 levels, then halfway steps (3 more right than wrong = pass, 2 more wrong = too hard).
  - **17e** iPhone bug (question closed, no next question, no item): the reward always runs now; errors show "⚠️ Problem … @ part". Not reproduced, so not sure it's fixed.
  - **17f** question popup + shop fit short sideways screens; ⛶ on iPhones explains "Add to Home Screen" (the only real full screen on iPhone).
  - **17g** bots wade straight across rivers; bots are hexagons; "Join the game" button for games already going on (both games); race late joiners start beside 4th place.

## Next steps
1. FIRST THING: ask Daniel how his phone tests went, newest first:
   - 17g: the Join button with two phones (both games); race joiner beside 4th place; bots at the rivers.
   - 17f: on an iPhone, all 4 answers and the whole shop without scrolling? Did "Add to Home Screen" fill the screen?
   - 17e: did the "question closed, no item" problem come back? What did any ⚠️ Problem message say?
   - 17d: does Auto find the right level for a new player? Is 10 the right jump (`AUTO_LEVEL.bigJump`)?
   - 17c: bots too strong / too weak, games too long? Knobs: `CTF_BOTS.swingWait`, `speed`, `shopping`, `trapEvery`, `spearAt`.
   - 17a/17b: Mom's iPhone in the race (gates, question box), the buttons at the top.
2. Open idea (not done): players whose Auto level was found the OLD way still climb slowly (1 level per 5 good answers). Re-test them, or let them climb faster?
3. Still unanswered from before: easy-mode secret shortcuts for a little kid, the orange gift, outfit prices, the regular-mode camera (`RACE.cameraMotion`), Capture the Flag taps (`TOUCH`), the log-in card after every game or once per visit.
4. Not now: payments for the dashboard (plan under Key decisions in STATE.md). Still beta.

## Questions for Daniel
- Outfits Claude made up: kibbutznik, cool kid, cowboy, ninja, wizard, bandit, king. Keep, change, add?
- A player in the left or right lane before the mountain face is taken into the shortcut on that side without asking. Fine?
- Race bots never take the secret trails or the zigzag gaps. Should they?
- An app icon for "Add to Home Screen" (right now the iPhone uses a picture of the page)?
- The Hebrew in the menus, the outfit names and the privacy page was written by Claude; Daniel said to assume it is good during beta.

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Never upload the `supabase` folder (Daniel's local `usage.sql` has his email in it). Never write his email into a project file.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr -x .git -x supabase`): VS Code once saved an old open copy over a new file.
- GitHub sometimes refuses the connection for a few minutes ("SSL/TLS connection failed"). Carry on and retry later.
- The repo clone and the test files live in the session scratchpad; re-clone `Lev-31065/battle-of-the-golan` and rebuild the test files if they're gone.
- Test rig (rebuild if gone): copy index.html into the scratchpad with `<base href="file:///c:/Users/ehrli/Documents/Coding%20in%20keshet/battle-of-the-golan/">`, an error catcher (`window.__errs`) and one test script before `</body>`; run headless Edge (`--headless=new --allow-file-access-from-files --user-data-dir=<scratchpad>/edgeprofile`, `--enable-unsafe-swiftshader` for 3D) with `--dump-dom` (print between "RES"+"ULT" and "END"+"RES") or `--screenshot --window-size=W,H --virtual-time-budget=2500`.
  - REBUILD the test copy whenever index.html changes (an old copy + new game.js crashes on missing elements).
  - Number tests: `requestAnimationFrame = () => 0`. Screenshots: freeze with `update = () => {}; serverUpdate = () => {}` and `setInterval(render, 50)`; call `showScreen(null)` or the home screen covers the game.
  - Setting MY player's spot: set both `server.players.me` and `myPlayer()` (the phone keeps its own copy).
  - A `setInterval` that draws 3D during `--dump-dom` can hang Edge: only draw for screenshots.
  - Session 2026-11-17 scripts: `t-ctfbots.js` (`?games=N&secs=S`: score, items bought/used, knockouts by weapon, time in water), `t-auto.js` (pretend players of every level → where Auto puts them), `t-shop.js` (buy a hammer by clicking answers; `?broken=1` = voice errors), `t-pop.js` (`?show=quiz|long|shop|tip` screenshots), `t-join.js` (`?mode=ctf|race[&public=1][&shot=lobby|game]`: the waiting list and joining late), `t-btn.js` (race buttons screenshot).
- Scripted edits with perl: NEVER use `|` as the `s|…|…|` delimiter when the pattern has `||` in it (`\|\|` became "or nothing" and pasted code at the top of game.js). Use `s{…}{…}` or the Edit tool. Read/write with `:raw`; files use plain LF. Use the Edit tool for anything with Hebrew.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Popups that open over a screen need z-index 40 (add their id to the rule in style.css).
