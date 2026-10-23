# Spice World

**The Nusantara, 1500 AD** — an interactive map and voyage game of the spice trade era in maritime Southeast Asia.

## What's inside

- **Spice World Map** (`index.html`) — an interactive Leaflet chart of the Nusantara with layers for kingdoms and spheres of influence, trade routes and goods flows, monsoon winds, volcanoes, settlements, and pilgrimage sites — plus worldbuilding tabs: character sheets, locations, connections, conflicts, mythos, ledger, almanac, vessels, goods, and economy. The chart also shows your live voyage: your ship's position, every port you've charted, and your active charter.
- **Nakhoda: The Spice Sea** (`sim.html`): an open-world sailing game (Three.js). One seamless sea built from the real coastlines of the Nusantara: Sumatra, Java, Borneo, the Philippines and the Maluku spice islands as actual landmasses with beaches, jungle and volcanoes, and 40 port towns on their historical shores. Sail on a real points-of-sail model, ride the monsoon calendar (the winds reverse with the seasons), trade in living markets, take charters, fight pirates broadside to broadside, plot courses on the pilot's chart, and climb from a borrowed kelulus to a jong and Sea Lord.

The map and the voyage share one save (`nakhoda-save-v4`): money, cargo, ship, reputation, faction standing, markets, position, and charted-port intel persist across both, and across reloads.

### Sailing

| Key | Action |
|---|---|
| A / D | Steer |
| W / S | Raise / furl sail (furled, half, full) |
| Q / E | Port / starboard broadside |
| F | Drop anchor at a port |
| M | The pilot's chart: click a port to plot a course |
| R | Give the pilot the helm (he tacks upwind for you) |
| T | Fair winds: time passes three times as fast |
| (in Melaka) | Dock, choose *Walk ashore*: WASD to walk, Shift to run, E to talk, walk back to the jetty end to board |
| Drag / scroll | Look around / zoom |

## Project layout

```
index.html            atlas shell (menu, map, codex tabs)
sim.html              the Nakhoda voyage sim
css/atlas.css         atlas styles
js/data/ports.js      the 40 ports: names, coordinates, projection (shared by both pages)
js/data/factions.js   the polities each port answers to, and their reputation
js/data/coastlines.js the landmass polygons (atlas map + the sim's 3D islands)
js/voyage/*.js        the voyage game, in load order (world field, sky, sea, land, towns,
                      ships, economy, game state, helm, fleet, sound, chart, HUD, port, main)
css/voyage.css        the voyage game's interface
js/atlas/*.js         atlas code, in load order (10-voyage-layer.js draws live sim state)
vendor/               Leaflet, Three.js, generated Tailwind — no CDNs, works offline
```

`borobudur-trading-sim.html` is a standalone prototype exploring the same trading-sim idea from a different angle (its own faction set, procedural Tone.js audio, single-cargo-slot delivery runs). It's a separate, self-contained page — not wired into the atlas or the Nakhoda save.

No build step — plain static files.

3D models: [Kenney](https://kenney.nl) Nature Kit, Pirate Kit, Mini Characters and Mini Market (CC0, see `assets/models/*/License.txt`).

## Play

Play online: https://elmoadorjr.github.io/Spice-World/

Or locally: serve the folder (`python3 -m http.server`) and open `http://localhost:8000`. Everything is vendored, so it works offline; only the display fonts load from Google Fonts when a connection exists.
