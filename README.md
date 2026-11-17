# Battle of the Golan

Phone games for learning Hebrew, played together in a browser. Nothing to install: open the link and play.

**Play it:** https://lev-31065.github.io/battle-of-the-golan/

There are two games. In both, the Hebrew questions are part of the game, not a quiz between rounds.

- **🛷 Mt Hermon Racing:** a sled race in 3D from the snowy top of Mt Hermon down to the Kinneret. You answer by driving through a gate.
- **🚩 Capture the Flag:** two teams, Blue and Red, on a map of rivers, bushes and hollow logs. You answer to buy weapons, grab a flag, or get past a rock.

The game is in beta. The Hebrew in the menus has not been checked by a Hebrew teacher yet.

## How to start a game

- **Play Game** drops you into a public room for the game you pick. You get a made-up animal name, and the game starts by itself 20 seconds after the first player arrives. Up to 8 players share a room.
- **🔒 Private room** is for playing with people you know. One person taps **Create a room** and gets a 4-letter code. Everyone else types the code, or opens the invite link the host shares.
- **Log in** is optional. It saves your words and your level to an account, so they follow you to another phone.

## Mt Hermon Racing

One long ride, about 5 minutes, for one player or more. Computer sleds fill the race up to 10.

| On a phone | On a computer | Does |
|---|---|---|
| Hold the left or right half of the screen | Arrow keys | Steer |
| Hold a skid button (bottom corners) | Shift + arrow | Skid round a very sharp bend |
| Big round button | Space | Use your gift |
| Small button under it | B | Drop a rimon behind you |
| Back to the path | R | Go back to where you left the path |

- **Gates:** each gate shows an English word, with a Hebrew answer over each of its 3 lanes. Drive under the right one for a speed boost and a gift. A wrong answer bounces you back up the path to try again.
- **Other sleds:** sleds never bump. They pass through each other from any direction.
- **Gifts:** banana peel, mango, rimon (a pomegranate grenade), gas cloud, anona (a speed boost), and orange (a very fast, very short burst).
- **Off the path:** you can leave the path and ride anywhere on the mountain. There are secret trails, gaps in the rocks on the zigzags, and a rocky shortcut down the mountain face.
- **🐣 Easy mode** (for little kids; on by itself if you are not logged in): the sled follows the path by itself and the two arrows change lanes. The lanes pick your answer at a gate, get you round other sleds, and choose a way where the path splits. When an arrow glows gold, go to that edge of the path and tap it once more to take a secret shortcut.

## Capture the Flag

Two teams. To score, both flags have to be inside your base. The first team to 3 wins. With fewer than 4 players, computer players join so it is 3 against 3.

| On a phone | On a computer | Does |
|---|---|---|
| Joystick (left side), or drag from your player | Arrows / W A S D | Move |
| 🛒 Shop (near your shopkeeper) | E | Buy something, paid with right answers |
| Hit / Throw, or tap an enemy | Space | Use what you are holding |
| Tap anywhere | | Throw that way |
| 🚩 Grab / Drop | F | Pick up a flag (a question), or drop it |
| Toolbar | 1 to 9 | Switch what you are holding |
| Tap an answer | 1 2 3 4 | Answer a question |

- **The shop:** stick, hammer, one-use spear, forest boots, rocks that freeze, ninja stars, pomegranate grenades, and a pomegranate tree. Each costs a number of right answers. Getting knocked out loses everything.
- **The map:** rivers are slow and push you downstream, bushes are slow, berries speed you up and heal you, and hollow logs hide you. Rocks are solid: bump one and you answer a question to pass.
- **Flags:** carrying one makes you slower, and you can't throw. Getting knocked out drops it.

## The Hebrew

- **20 levels**, each with an A list (the level's own words) and a B list (sentences that mix it with earlier levels), plus 5 review checkpoints.
- **Auto level** (the default): each phone plays its own level, and moves up or down by how you answer.
- **Flashcard memory:** words you miss come back sooner.
- **Masculine / feminine:** picked on the first screen, so "I" and "we" sentences match the player.
- **Voice:** questions are read out loud (the 🗣️ button turns it off).
- **Hebrew first:** every label shows Hebrew on top and English underneath.

## Mastery points and looks

You earn a mastery point each time a word reaches a flashcard level it has never reached before. Points unlock **looks**: whole outfits (kibbutznik, cool kid, cowboy, ninja, wizard, bandit, king) that show on your player in Capture the Flag and on your sled rider. Looks are for logged-in players.

## For teachers: the Deck dashboard

Log in on a computer and open **🗂️ Deck dashboard** to:

- host a **class game**, where you pick one deck for everyone;
- see your % mastery of each deck;
- make your own decks (type them, or paste from a spreadsheet), with auto-translate for the English;
- copy and edit the premade decks: themes, past and future tense, and verb-root decks grouped by verb pattern.

## What the game saves

The privacy page (linked from the home screen) has the details. In short: with no login, your progress stays on your phone. With a login, your email, progress and decks are stored by Supabase. The game also counts how often it is opened and how many games are played, with no names.

## How multiplayer works

- The phone that opens a room is the **host**. It runs the **referee**, which decides who got hit, who has the flag, where the gifts fly, and the score.
- Every phone moves its *own* player or sled, so moving feels instant, and tells the referee where it is.
- The referee sends every phone the whole game 20 times a second (a "snapshot"), and each phone draws it.
- The phones find each other through PeerJS's free matchmaking server, then talk directly. There is no game server.
- If the host leaves, the room closes.

**If phones can't connect:** some school or office Wi-Fi networks block phone-to-phone connections. Try mobile data or a home network.

## What each file does

Plain HTML, CSS and JavaScript. There is no build step.

| File | Job |
|---|---|
| `index.html` | Every screen, button and popup |
| `style.css` | How it looks |
| `rules.js` | **All the settings**, for both games |
| `words.js`, `levels-b.js` | The Hebrew: levels, checkpoints, premade decks |
| `progress.js` | Flashcard memory, Auto level, mastery points |
| `quiz.js`, `speech.js`, `sound.js` | The question popup, the voice, the sound effects |
| `account.js`, `decks.js`, `looks.js`, `stats.js` | Logins, the Deck dashboard, looks, usage counting |
| `network.js` | Connects phones with room codes (PeerJS) |
| `server.js`, `game.js` | The shared referee and the shared phone code (rooms, lobby, snapshots) |
| `ctf-server.js`, `ctf-bots.js`, `ctf-game.js`, `ctf-draw.js`, `map.js` | Capture the Flag: its rules, its computer players, its phone side, its drawing, its map |
| `race-server.js`, `race-game.js`, `race-track.js`, `race-3d.js`, `race-draw.js` | Mt Hermon Racing: its rules and bots, its phone side, the track, the 3D drawing, the flat fallback and the race info |
| `three.min.js` | three.js, the 3D library (MIT licence) |
| `privacy.html` | The privacy page |

## Run it and change it

- **Run it:** double-click `index.html`. To test multiplayer on one computer, open it in two browser windows, create a private room in one and join it from the other.
- **Change a setting:** almost everything is in `rules.js`, with a comment on every line. Save, then refresh the browser (`F5`).
  - Walk faster in Capture the Flag: `PLAYER_SPEED = 172`.
  - Shorter or longer games: `WIN_SCORE = 3`.
  - Faster sleds: `maxSpeed` in `RACE`.
  - Stronger or weaker bots: `botSkill` and `botRight` in `RACE` (the race), `CTF_BOTS` (Capture the Flag).
  - What a look costs: `LOOKS`.
- **Add a Hebrew word:** in `words.js`, copy a line like `{ english: "horse", hebrew: "סוּס" },` and change it.
- **If something breaks:** press `F12` and look at the **Console** tab. Red text there says which file and line has the problem.

The host's copy of the game decides the rules, so every phone needs the same version. The version is shown under Privacy on the home screen.

## Putting your own copy online (free)

1. Make a free account at [github.com](https://github.com) and create a **public** repository.
2. Upload every file in this folder (**Add file → Upload files → Commit changes**).
3. In the repository, open **Settings → Pages**, choose the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the Pages settings show your link.

Logins, saved decks and usage counting need a Supabase project of your own: its URL and publishable key go in `account.js`, and its database tables have to be created there. Without that, everything else still works.

Before each upload, change `GAME_VERSION` in `rules.js` and every `?v=` in `index.html` to the same new value. Otherwise phones keep running their old saved copy.
