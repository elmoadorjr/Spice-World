# Spice World

**The Nusantara, 1500 AD** — an interactive map and voyage game of the spice trade era in maritime Southeast Asia.

## What's inside

- **Spice World Map** (`index.html`) — an interactive Leaflet chart of the Nusantara with layers for kingdoms and spheres of influence, trade routes and goods flows, monsoon winds, volcanoes, settlements, and pilgrimage sites — plus worldbuilding tabs: character sheets, locations, connections, conflicts, mythos, ledger, almanac, vessels, goods, and economy. The chart also shows your live voyage: your ship's position, every port you've charted, and your active charter.
- **Nakhoda Mode** (`sim.html`) — a 3D sailing sim (Three.js): captain a jong through the Eastern Seas, trading between ports, riding the monsoon, and dodging pirates. Its world *is* the atlas map: every island sits where the real port sits, so Melaka truly guards the strait and the Maluku spice islands truly are the far east.

The map and the sim share one save (`nakhoda-save-v3`): money, cargo, ship, reputation, position, and charted-port intel persist across both, and across reloads.

## Project layout

```
index.html            atlas shell (menu, map, codex tabs)
sim.html              the Nakhoda voyage sim
css/atlas.css         atlas styles
js/data/ports.js      the 40 ports: names, coordinates, projection (shared by both pages)
js/atlas/*.js         atlas code, in load order (10-voyage-layer.js draws live sim state)
vendor/               Leaflet, Three.js, generated Tailwind — no CDNs, works offline
```

No build step — plain static files.

## Play

Play online: https://elmoadorjr.github.io/Spice-World/

Or locally: serve the folder (`python3 -m http.server`) and open `http://localhost:8000`. Everything is vendored, so it works offline; only the display fonts load from Google Fonts when a connection exists.
