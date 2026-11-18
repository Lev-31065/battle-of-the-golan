# Next session

## Where we stopped (2026-11-18)
- Live version: **v 2026-11-18b**. Everything is uploaded; the project folder matches the repo.
- This session (details at the top of STATE.md):
  - **18a:** the shop no longer buys the item under the finger that opened it; new prices; you can buy several spears; hurt bots go eat berries; the Auto level reset; race bots take shortcuts.
  - **18b:** every outfit has a blue and a red version. The Bandit is now a hooded **Archer** (cloak, hood, bow, quiver; no round body).
- Daniel said the race bots are good for now.

## Next steps
1. Daniel tests 18b on his phone (check the version under Privacy): the shop tap, prices, buying 2 spears, bots healing, and the new outfits in Capture the Flag.
2. Ask Daniel:
   - Do the team outfits and the Archer look right? Should other outfits become whole figures like the Archer?
   - Should the race outfits change too? (The race has no teams; the Archer still looks like the old bandit on the sled.)
   - The "My look" picker shows the blue version only. Is that OK?
   - The old shop bug (right answer closes the popup, no item): has it happened again?
3. Still open from before: easy-mode shortcuts for little kids, the orange gift, outfit prices, an app icon, the log-in card after every game or once per visit.

## Reminders for Claude
- End every reply with a short "Next steps". Upload every tested change without asking.
- Never upload the `supabase` folder (Daniel's local `usage.sql` has his email in it). Never write his email into a project file.
- Before editing, compare the project folder with the repo clone (`diff -rq --strip-trailing-cr -x .git -x supabase`): VS Code once saved an old open copy over a new file. The folder path has spaces: copy files by name, not through `xargs`.
- GitHub sometimes refuses the connection for a few minutes ("SSL/TLS connection failed"). Carry on and retry later.
- Test rig: `run.sh` in the 2026-11-18 scratchpad (search `.../5ccf3e30dafa3e55/*/scratchpad/run.sh`; change the `S=` path). It now reads multi-line results (`perl -0777`). `run-repo.sh` runs the same test on the repo clone (the live version), for before/after comparisons. Test scripts: `t-ctfbots.js` (bot games + berry counts), `t-shop2.js` (shop tap, spears, prices), `t-reset.js` (Auto reset), `t-looks.js` / `t-zoom.js` (outfit pictures), older: `t-bots.js` (race).
  - Number tests: `requestAnimationFrame = () => 0`. Screenshots: freeze with `update = () => {}; serverUpdate = () => {}` and `setInterval(render, 50)`; call `showScreen(null)`.
  - Setting MY player's spot: set both `server.players.me` and `myPlayer()`.
  - `node` isn't installed: no node one-liners for reading results.
- Scripted edits with perl: NEVER use `|` as the `s|…|…|` delimiter when the pattern has `||` in it. Use `s{…}{…}` or the Edit tool. Read/write with `:raw`; files use plain LF. Use the Edit tool for anything with Hebrew.
- In PowerShell, don't name a helper `R` or `rd`. Scripts need `-ExecutionPolicy Bypass`.
- Popups that open over a screen need z-index 40 (add their id to the rule in style.css).
