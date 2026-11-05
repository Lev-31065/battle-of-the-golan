# Battle of the Golan

A capture-the-flag phone game for learning Hebrew. Two teams, Blue and Red, try to grab each other's flag. To buy a weapon, pick up a flag, or get past a rock, you have to answer a Hebrew vocabulary question.

## Progress

- [x] **Step 1:** map, rivers, bridges, bases, and walking around
- [x] **Step 2:** Hebrew questions, the shop and the hammer, bushes
- [x] **Step 3:** flags and scoring (first team to 3 captures), speed boost box
- [x] **Step 4:** multiplayer with room codes and nicknames
- [x] **Step 5:** solid rocks, sounds, minimap, hit effects, confetti, invite links, publishing

## How to play

1. One person opens the game and taps **Create a room**. A 4-letter room code appears.
2. Everyone else opens the game, types a nickname and the code, and taps **Join**. Or the host taps **📋 Share invite link** and sends it, and the code fills itself in.
3. The host taps **Start the battle!**

| On a phone | On a computer | Does |
|---|---|---|
| Drag on the left half of the screen | Arrows / W A S D | Move |
| 🛒 Shop (near your shopkeeper) | E | Buy the hammer with a Hebrew question |
| 🔨 Hit | Space | Swing the hammer |
| 🚩 Grab / Drop | F | Pick up a flag (question), or drop it |
| Tap an answer | 1 2 3 4 | Answer a question |

**Rules:** rivers make you very slow, and bushes make you slow. Rocks are solid: bump into one and you have to answer a question to pass through. Carrying a flag makes you slower and you can't attack. Getting knocked out drops the flag, and you come back at your base with nothing. A dropped flag goes home by itself after 30 seconds. To score, carry the enemy flag into your base while your own flag is at home. The first team to 3 wins.

**Testing on one computer:** open `index.html` in two browser windows. Create a room in one and join it from the other.

## Putting it online with GitHub Pages (free)

You only need to do this once. Afterwards, anyone can play from a link like `https://YOUR-NAME.github.io/battle-of-the-golan/`.

1. **Make an account** at [github.com](https://github.com) (free).
2. **Make a repository.** A repository is a project folder that lives on GitHub. Click the **+** at the top right, then **New repository**.
   - Repository name: `battle-of-the-golan`
   - Choose **Public**. Free GitHub Pages sites need public repositories, so anyone can see the code. That's normal for websites.
   - Click **Create repository**.
3. **Upload the files.** On the new, empty repository page, click the link **uploading an existing file**. In File Explorer, open the `battle-of-the-golan` folder, press `Ctrl+A` to select every file, and drag them all onto the GitHub page. Scroll down and click **Commit changes**. ("Commit" means "save this version.")
4. **Turn on the website.** Click **Settings** (top of the repository), then **Pages** (left side). Under **Branch**, choose `main`, keep the folder as `/ (root)`, and click **Save**.
5. **Wait 1–2 minutes** and refresh the Pages settings page. Your link appears at the top. Open it on your phone and share it with your friends.

**Changing the game later:** edit the files on your computer and test them. Then in your GitHub repository click **Add file → Upload files**, drag in the files you changed, and click **Commit changes**. The website updates within about a minute. If a phone still shows the old version, refresh the page.

**If phones can't connect:** some school or office Wi-Fi networks block phone-to-phone connections. Try mobile data or a home network.

## How multiplayer works

- The phone that taps **Create a room** is the **host**. It runs the **referee** (`server.js`), which decides who got hit, who has the flag, and the score.
- Every phone moves its *own* player, so walking feels instant. It tells the referee its position 20 times a second.
- The referee sends every phone the whole game 20 times a second (a "snapshot"), and each phone draws it.
- The phones find each other through PeerJS's free matchmaking server, then talk directly.
- If the host leaves, the game ends for everyone.

## What each file does

| File | Job | Think of it as… |
|---|---|---|
| `index.html` | What's on the page: screens, buttons, popups | The skeleton |
| `style.css` | How it looks: colors, sizes, positions | The clothes |
| `map.js` | Where the rivers, bridges, bushes, rocks, bases and trees are | The map designer |
| `rules.js` | **All the settings**: speed, damage, timers, score to win | The rulebook |
| `sound.js` | Sound effects, made from code | The band |
| `words.js` | The Hebrew words and phrases used in questions | The dictionary |
| `quiz.js` | The question popup: right answer, wrong answer, wait time | The teacher |
| `draw.js` | Paints everything onto the screen, including the minimap | The artist |
| `network.js` | Connects phones with room codes (using PeerJS) | The telephone |
| `server.js` | Decides hits, knockouts, flags and score (host only) | The referee |
| `game.js` | Home screen, lobby, your controls, drawing each frame | Each player's brain |

## Things you can try changing

Save the file after each change, then refresh the browser (`F5`) to see it.

- **Add a Hebrew word:** in `words.js`, copy a line like `{ english: "dog", hebrew: "כֶּלֶב" },` and change it.
- **Walk faster:** in `rules.js`, change `PLAYER_SPEED = 172` to `300`.
- **Change how slow rivers and bushes are:** in `map.js`, change `waterSlowdown: 0.1` or `bushSlowdown: 0.3`.
- **Add a rock or a bush:** in `map.js`, add `[800, 300],` to the `rocks` list, or `[800, 300, 50],` to `bushes`. The numbers are x (left to right, 0–2000) and y (top to bottom, 0–1200). Bushes also get a size.
- **Make the hammer stronger:** in `rules.js`, change `damage: 34` to `damage: 50` (2 hits to knock out).
- **Shorter or longer games:** in `rules.js`, change `WIN_SCORE = 3`.
- **Tweak the speed box:** in `rules.js`, look for `SPEED_BOOST` (multiplier, duration, respawn time).
- **Change a sound:** in `sound.js`, change the numbers in `SOUNDS`. Bigger numbers mean higher notes.

The host's copy of the game decides the rules, so upload your changes to GitHub before playing together.

If something breaks, press `F12` and look at the **Console** tab. Red text there tells you which file and line has the problem.
