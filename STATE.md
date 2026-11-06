# State

## Works now (all 5 build steps done)
- **Map:** 2 rivers (10% speed), 4 bridges, 8 bushes (30% speed), 6 solid rocks, a base for each team with a shopkeeper and a flag.
- **Rocks:** bumping into one opens a question you can't close. A right answer lets you walk through rocks for 2 seconds.
- **Questions:** English prompt with 4 Hebrew answers (with nikud). A wrong answer shows the right one, then waits 3 seconds before a new question.
- **Shop:** the hammer costs one right answer. It's an area attack, 3 hits knock someone out, with a 0.6-second cooldown.
- **Speed box** in the center: 3 hits to break, gives 1.5× speed for 8 seconds, comes back after 60 seconds.
- **Flags:** grabbing any flag takes a question. Carriers move at 70% speed and can't attack. They can drop the flag, and they drop it when knocked out. Dropped flags go home after 30 seconds. Scoring needs your own flag at home. First to 3 wins.
- **Multiplayer:** 4-letter room codes, nicknames, Blue vs Red lobby with team switching. The host starts the game and can play again. Players respawn 3 seconds after a knockout, with nothing.
- **Polish:** sounds with a mute button, minimap, screen shake and red flash when hit, confetti, `?room=CODE` invite links, a tip to turn the phone sideways.
- Published on GitHub Pages.

## Unverified or incomplete
- Not yet play-tested on real phones, and nobody has listened to the sounds yet.
- The nikud in `words.js` hasn't been checked by a Hebrew teacher.

## Key decisions
- **PeerJS with the host as referee:** free, no server to run, and everyone agrees on what happened.
- **Each phone moves its own player:** movement feels instant. The referee trusts those positions, which is fine for friends.
- **GitHub Pages through web upload:** git isn't installed, and uploading in the browser is easy for a beginner.
- **The speed box is in the center** so neither team has an advantage.

## Gotchas
- If the host leaves, the game ends for everyone.
- Some school Wi-Fi blocks phone-to-phone connections, and there's no relay server. Mobile data is the fallback.
- The referee removes a player after 8 seconds of silence. A joiner gives up after 6 seconds without updates from the host.
- The host's copy of the game decides the rules, so upload changes before playing.
- Enemies show on the minimap only while they're carrying a flag.
