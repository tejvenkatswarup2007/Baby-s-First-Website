# Mochi the Baby T-Rex — Baby's First Portfolio (Track 2)

A 9-page, plain HTML / CSS / JavaScript site. No build step, no installs.

## Run it
Open the folder in VS Code and use the **Live Server** extension (right-click `index.html` → *Open with Live Server*).
Or just double-click `index.html`.

## Folder structure
```
mochi-portfolio/
├── index.html          Home: hero, slideshow, link bubbles
├── about.html          5-point character sheet, growth chart, flip cards
├── projects.html       4 project cards (each opens its own page)
├── story.html          Scroll-driven origin story
├── guestbook.html      Sign the wall
├── bubble-lab.html     Game: pop bubbles
├── roar-box.html       Web Audio music box + lullaby
├── egg-hatchery.html   Collectible egg hatching
├── lantern-cave.html   Flashlight-cursor treasure hunt
├── css/
│   ├── style.css       Global: theme, header, buttons, Mochi, effects
│   └── pages.css       Styles for each individual page
└── js/
    ├── rex.js          Mochi the T-Rex (SVG)
    ├── audio.js        Web Audio sounds + mute
    ├── main.js         Header/footer, theme, sparkles, eye-tracking, Easter eggs
    └── pages/          One small script per page
```

## Things to personalise before submitting
1. Search for `YOUR NAME` (injected in the footer by `js/main.js`) and put your name.
2. Edit the skill percentages in `about.html` to match your real skills.
3. Add a link to your GitHub repo in the footer if you like.

## Easter eggs (don't tell anyone)
- Tap Mochi's eggshell hat 5 times.
- Type `rawr` on any page.

## Deploy
**GitHub Pages:** push to a public repo → Settings → Pages → Deploy from branch `main` / root.
**Vercel / Netlify:** drag the folder in, or import the repo (no build command, output directory = `.`).

Remember: the hackathon needs **public GitHub commit history between 17–19 October**.
