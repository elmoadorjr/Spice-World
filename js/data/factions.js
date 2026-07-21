// ============ SHARED WORLD DATA: THE POLITIES OF THE SPICE WORLD ============
// The powers a nakhoda actually deals with. Names, colors and territorial
// scope are drawn straight from the atlas's own territoriesGeoJSON (see
// js/atlas/01-map-base.js) so the sim's factions are the same polities the
// map already shades — not an invented parallel roster. Ports the document
// doesn't clearly assign to a court (Banda's merchant oligarchy, Palembang's
// faded Srivijaya, the still-animist Mindanao river chiefs, etc.) are left
// unclaimed on purpose: independent ports carry no tariff, for better or worse.
//
// Loaded as a classic script by BOTH index.html and sim.html.

const FACTIONS = {
  malacca: { name: "Sultanate of Melaka", ruler: "Sultan Mahmud Shah", color: "#8B3A3A" },
  aceh:    { name: "Pasai / Aceh",        ruler: null,                 color: "#5C6B3A" },
  sunda:   { name: "Sunda Kingdom",       ruler: null,                 color: "#3A5C6B" },
  demak:   { name: "Sultanate of Demak",  ruler: null,                 color: "#6B4F3A" },
  brunei:  { name: "Sultanate of Brunei", ruler: "Sultan Bolkiah",     color: "#B8873D" },
  gowa:    { name: "Gowa / Makassar",     ruler: "Tumapa'risi' Kallonna", color: "#6B3A5C" },
  ternate: { name: "Sultanate of Ternate",ruler: "Sultan Al-Mansur",   color: "#A8542E" },
  tidore:  { name: "Sultanate of Tidore", ruler: null,                 color: "#7A4F1F" },
  sulu:    { name: "Sultanate of Sulu",   ruler: "Sultan Bayanullah",  color: "#4F6B3A" },
  patani:  { name: "Patani",              ruler: null,                 color: "#5C3A6B" },
  jambi:   { name: "Jambi",               ruler: "Orang Kayo Hitam",   color: "#3A6B6B" },
  pahang:  { name: "Pahang",              ruler: "Mansur Shah I",      color: "#6B5C3A" },
  wehali:  { name: "Wehali (Timor)",      ruler: null,                 color: "#4F3A6B" }
};

// Port name -> faction key. Ports not listed here are independent/unclaimed.
const PORT_FACTION = {
  "Melaka": "malacca",
  "Pasai": "aceh", "Aceh": "aceh",
  "Banten": "sunda", "Sunda Kelapa": "sunda",
  "Demak": "demak", "Tuban": "demak", "Gresik": "demak", "Surabaya": "demak",
  "Brunei": "brunei",
  "Makassar": "gowa", "Gowa": "gowa",
  "Ternate": "ternate",
  "Tidore": "tidore",
  "Jolo": "sulu",
  "Patani": "patani",
  "Jambi": "jambi",
  "Pahang": "pahang",
  "Timor": "wehali", "Kupang": "wehali"
};

function factionForPort(portName) {
  return PORT_FACTION[portName] || null;
}
