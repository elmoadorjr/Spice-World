// ============ CHARACTER SHEETS: DATA + LIST/DETAIL RENDERING ============
const characters = [
  {
    name: "Angin",
    role: "nakhoda",
    title: "A First Ship's Nakhoda — origins disputed, even by him",
    intro: "Nobody in the strait agrees on where Angin actually comes from. The Orang Laut crew that fished him half-drowned off a nameless wreck as a boy swear his cradle-tongue wasn't Malay. A Bugis prahu that took him in for two seasons afterward claim he answered instantly to a Makassar war-chant nobody had taught him. Angin himself remembers nothing before the wreck — no mother, no name, no flag that ship sailed under — only water, and then hands pulling him out of it. \"Angin\" is what the Orang Laut who found him called him, after the wind that was driving the storm that night — the only thing anyone could agree had actually been there. Pulled from the wreck around age seven, roughly 1491; fourteen when the book opens in 1498. In 1500, sixteen years old, he has just won his first ship, a half-repaired kelulus, taken after killing his own captain mid-raid for attempting to rape a captive woman aboard — a Malaccan princess, daughter of Mahmud Shah, being sent as a peace-bride to the Siamese court. He never returns her, for reasons even he doesn't fully untangle, and her non-arrival becomes the unwitting spark of the real 1500 Siamese invasion of Malacca — a truth he never learns and the book never lets him find out. He has never once corrected anyone who guesses at the rest of his story. What almost no one knows: his first assigned kill, ordered by the same Orang Laut crew that raised him, was Tun Perak himself — spared rather than killed, the world told otherwise, minutes after the crew's own raid cost him the closest thing he had to a brother. Publicly he trades; privately, through that same crew, he still raids — opportunistic, small-time, whatever's weak enough to take. He reaches full Nakhoda status at eighteen, in 1502, and Sea Lord status at twenty-seven, in 1511.",
    facts: [
      ["Domain", "No court, no coastline — a kelulus taken by force, and whatever water he can hold this season"],
      ["Age", "Found ~1491 (age ~7) · 14 in 1498 (book opens) · 16 in 1500 (Siamese invasion) · 18 in 1502 (full Nakhoda) · 27 in 1511 (Sea Lord) · 37 in 1521 (book closes)"],
      ["Signature asset", "A blank where his birth should be — no throne can claim him and no rival can use his family against him, because nobody, including Angin, knows who they'd be"],
      ["Defining trait", "Reads as Orang Laut to the Orang Laut and Bugis to the Bugis, and has long since stopped correcting either — whether that's a survival habit or the plain truth is the one question he's never let anyone follow up on"],
      ["Rivalry", "None chosen yet — every relationship above a deckhand's is still being built or tested in 1500, on a roster where everyone else has already picked a side"],
      ["Signature legend", "Not his own — the wreck he was pulled from as a boy has never been identified, and one or two old hands still swear they recognize her broken figurehead from somewhere they can't quite place"],
      ["Carries", "A jade amulet given to him by a man the world believes he killed — meaning withheld, never explained, never removed"],
      ["Trained by", "A Bugis mentor, now dead, who taught him combat and siri (the Bugis honor/shame code) together during his drifting stretch — the doctrine behind a compass he'd so far only followed by instinct"],
      ["First trusted", "An unremarkable, decent captain gave him the rudder of his kelulus during the same drifting stretch — no ceremony, just the day the captain stopped taking it back. The second man to trust him after the big brother, and the second he lost in short order when that voyage ended, leaving him adrift again just before the mentor's death and the captain who assaulted him"],
      ["Taught the water", "A reclusive Micronesian malim, a former rebel against Nan Madol's Saudeleur dynasty, teaches him reef-reading, star-paths, and monsoon-timing during the same drifting stretch — running alongside the mentor's combat and siri training rather than duplicating it. Outside Cabral's cleanup thread entirely; his fate stays genuinely open"],
      ["Open threat", "Cabral's people are quietly eliminating anyone who was present at the Tun Perak raid, as standard tradecraft — not because anyone suspects Angin lied about the kill, simply because loose ends get cut. Unresolved, live into Act 2/3."],
      ["The war he doesn't know he started", "Kills his own captain during a raid on a Malaccan diplomatic convoy for attempting to rape a captive princess — Mahmud Shah's own daughter, sent as a peace-bride to Siam — then doesn't return her. Her non-arrival is read by Ayutthaya as a deliberate insult, and becomes the unwitting fictional trigger for the real 1500 Siamese invasion of Malacca. Angin never learns this, and the book never tells him — the single largest secret he carries without knowing he's carrying it."],
      ["Wives, eventually", "By Act 3, Angin takes multiple wives — not one alliance-marriage but the working government of his Route A patchwork empire. Each governs a scattered holding in his name while he's elsewhere; the harem is his actual institution of rule, not a subplot alongside it. The Malaccan princess becomes his first, resurfacing after Malacca's fall carries no political weight left to exploit. See The Ledger, Marriages and Regional Stewardship"],
      ["By 1502, entire", "The wayfinding of a Micronesian pilot, the combat and code of a Bugis warrior, the shrewdness of a Gujarati trader, and the connections of the Orang Laut — four skill sets, none inherited, all earned from people who owed him nothing and taught him anyway. No single mentor made him; the sum of four did. Each one is proven more than once on the page by 1502, not just claimed: wayfinding through the Brunei run, combat through both the captain's death and a second real fight leading his own crew, trade through the Nina Chatu partnership and the transaction with Tun Perpatih Putih's agent, connections through an Orang Laut warning that pulls his crew clear of a raid gone bad"],
      ["A crew built from the whole archipelago", "By the end of Act 1, Angin's found family is a working cross-section of the Nusantara itself: a Dayak helmsman, a Batak headfighter and bodyguard, a Minangkabau crewmember living out merantau on her own terms, and a Bajau diver for the reef-work no one else aboard can do — alongside the original Orang Laut crew that raised him. No single culture, including his own uncertain one, defines the ship. It runs the same way the era does: on skill and choice, not blood"],
      ["First real reputation", "Fighting in Malacca's defense during the 1500 Siamese invasion, he becomes locally known as the boy who cut down Siamese attackers defending the port — his first reputation with anyone outside his own small, mostly-dead circle, and, unknown to everyone including him, formed in the very war his own hand set in motion. Not yet a name known in three ports, but the first real seed of one"],
      ["Seen once by a legend", "Hang Tuah himself, commanding Malacca's defense during the same 1500 invasion, catches sight of him fighting and files it away without acting on it. Neither of them knows it yet — a seed for a possible Act 2 First Contact, not a relationship yet"],
      ["The Boy ends (Act 1 finale)", "At eighteen, running his Brunei trade lane, Angin is handed a small incidental task by Bolkiah's court and completes it competently — but what actually lands is the scale of a real Sea Lord's power and aura up close. No ceremony, no title, per the Ascension ladder's own rule — just the moment he sees exactly how far Nakhoda still is from Sea Lord, and decides, quietly, to climb for it on purpose rather than by accident"],
      ["Double life", "Publicly a pencalang (trader); privately, through the Orang Laut crew that raised him, still a penjajap (raider) — the trading front exists chiefly to launder what the raiding side takes"],
      ["The war at sixteen", "The 1500 Siamese invasion of Malacca lands in the same year he wins his first ship and a bendahara's suspicion both — the single most dangerous year of his adolescence, and the one that teaches him, at sixteen, that history itself can be the thing that saves him when nothing else will"],
    ]
  },
  {
    name: "[Placeholder — Angin's Orang Laut \"Big Brother\"]",
    role: "side",
    title: "The First Death — Real Kin, Killed Before Angin Ever Reaches Tun Perak",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. Orang Laut himself, older and already proven within the same crew that raised Angin — real kin in practice if not blood, the closest thing Angin has to family. Argues against letting Angin join the raid on Tun Perak's vessel, seeing something in the stakes that Angin doesn't yet. Loses that argument, or is overruled, and dies during the raid — killed by Tun Perak's own guards, who prove heavier and more willing to fight than the intelligence promised. His death is the first real cost of the book, landing minutes before Angin is left alone with Tun Perak restrained and the kill now his to finish. Everything that follows — the sparing, the amulet, the life Angin goes on to build — happens in the direct shadow of losing him.",
    facts: [
      ["Domain", "The same Orang Laut crew that raised Angin — no seat of his own"],
      ["Signature asset", "Whatever proven standing within the crew that Angin himself doesn't have yet — enough to argue, and be listened to, even if not enough to win"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and specific reason for arguing against Angin's inclusion before this can be drafted"],
      ["Rivalry", "None — the opposite of a rival; his death is what the rest of Angin's arc is measured against"],
      ["Signature legend", "None yet — he dies before the book's own historical record could ever notice him"],
    ]
  },
  {
    name: "[Placeholder — Angin's Bugis Mentor]",
    role: "side",
    title: "Siri and the Blade — Tun Perak's Man, and a Second Father Who Never Told Him So",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. A Bugis warrior or former warrior who takes Angin in during his drifting stretch after the Tun Perak raid, and teaches him two things at once: how to fight, and siri — the Bugis code of honor and shame that governs when a life is owed, when an insult must be answered, and when it must not. What Angin never learns: this isn't chance. The mentor is one of Tun Perak's own old contacts, quietly steered into Angin's path and knowingly tasked with watching over the boy who spared his benefactor's life — a real relationship that began as an assignment. Where the Orang Laut crew raised Angin without ever giving him language for the choice he made sparing Tun Perak, the mentor gives him the doctrine after the fact — turning an instinct into something he can actually reason from. He dies defending Angin when Cabral's people, quietly eliminating anyone tied to the raid or to what remains of Tun Perak's network, come for him, having tracked him as a thread in that network rather than merely a witness. Angin never learns any of this — not the assignment, not the network, not that the man who taught him when a killing is owed died paying a debt that was never really his own to owe.",
    facts: [
      ["Domain", "No fixed seat — a wandering warrior's life, wherever Angin finds him during the drifting stretch"],
      ["Signature asset", "Siri itself — the one thing he actually has to give, and the one thing he manages to pass on before he's killed for it"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and specific history before this can be drafted"],
      ["Real assignment", "A member of Tun Perak's hidden network, tasked knowingly with watching over Angin — not a chance meeting, though it becomes real affection regardless. Angin never learns this"],
      ["Rivalry", "None personal — killed by Cabral's people as network cleanup, not out of any conflict of his own"],
      ["Signature legend", "None yet — like the big brother, dies before history could ever record him"],
    ]
  },
  {
    name: "[Placeholder — Angin's Micronesian Malim]",
    role: "side",
    title: "The Pilot Who Answers to No Port — Star-Paths, and a Rebellion He Never Names",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. A reclusive malim, far from home even by the standards of a world full of resident foreigners: Micronesian, and — by his own rare, unguarded admissions — once part of a failed uprising against the Saudeleur dynasty of Nan Madol on Pohnpei, an ocean and more away from the Nusantara. What exactly happened to the rebellion, and why he can never go home, is left deliberately unspoken, the same way Bawan's corruption and the mentor's full history stay close to the chest — a detail or two let slip, never a full account. He takes almost no work and answers to no syahbandar, until Angin — the rare deckhand who doesn't laugh at an old foreigner's superstitions about water that 'doesn't hold still' — earns, almost by accident, what the malim has stopped offering anyone: real teaching. Reef-reading, star-paths, monsoon-timing, the doctrine behind seamanship Angin has so far only picked up by watching. Runs alongside the Bugis mentor's combat and siri training rather than replacing it, and stays outside Cabral's cleanup thread entirely — not raid-involved, and so, unlike the mentor, not fated to die for Angin's sake. <b>Locked:</b> once he judges Angin's own wayfinding sound, he chooses to go home — the pull of Pohnpei outlasting even the risk of return, after so many years away. A clean, warm resolution among Act 1's father-figure relationships.",
    facts: [
      ["Domain", "No fixed seat — a pilot's life, taking work rarely and only on his own terms"],
      ["Signature asset", "Star-path and reef knowledge that took a lifetime and an ocean crossing to accumulate, and that he has refused to sell to any court since arriving"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and a decision on how much of his past he ever actually says aloud"],
      ["Origin", "A former rebel against the Saudeleur dynasty of Nan Madol, Pohnpei — fled across the ocean after the uprising failed; the specifics deliberately withheld from the reader as well as from Angin"],
      ["Rivalry", "None chosen — his distrust runs toward centralized power in general, a quiet echo of the rebellion, rather than toward any single person on the roster"],
      ["Signature legend", "None yet — his real legend, if he has one, belongs to a rebellion three thousand miles from any port on this roster's map, and nobody here has ever heard of it"],
      ["Mirror to Angin", "A man with a past he can't afford to reveal, teaching a man with no past to reveal at all — the resonance is never stated outright by either of them"],
      ["Ending", "Locked: goes home to Pohnpei once his teaching is done. Doesn't die, doesn't simply vanish from the narrative — a deliberate, warm departure"],
    ]
  },
  {
    name: "[Placeholder — The Malaccan Princess]",
    role: "side",
    title: "A Peace-Bride Who Chose Not to Arrive — Angin's First Wife, Nine Years Later",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. A daughter of Mahmud Shah of Malacca, sent in 1500 as a peace-bride to the Siamese court to head off the war that comes anyway. Taken as cargo-adjacent in a raid Angin's own captain leads, she's saved from that captain's attempt to rape her when Angin kills him and takes his boat — Angin's real First Ship, and his first fully chosen kill. <b>Locked reason she isn't returned:</b> she asks him not to — plainly refuses the marriage and the court that was ready to spend her on a peace deal, and asks Angin to let her go rather than hand her back. He respects it, already carrying the mentor's siri doctrine about honoring what's asked of him. Her non-arrival is read by Ayutthaya as deliberate insult rather than accident, and becomes the book's fictional trigger for the real, historically documented 1500 Siamese invasion of Malacca. Neither of them learns the connection at the time. She survives independently through the years that follow — deliberately unaccounted-for by any court, neither returned home nor married off elsewhere, her own choice from the very start rather than a fate that simply happened to her — and resurfaces in Act 3, after Malacca has already fallen and her father's court no longer holds real power. She becomes Angin's first wife, but the marriage carries none of the political weight it would have carried in 1500; whatever draws them back together by then is personal, not dynastic. Placed near the Albuquerque temptation late in Act 3: the same stretch of the book where Angin refuses a seat in the new imperial order is where he learns, or nearly learns, that the old order's collapse traces back to a choice he made as a sixteen-year-old and never understood.",
    facts: [
      ["Domain", "None at the time of the raid — cargo-adjacent, a bride in transit. By Act 3, Angin's first wife under the Regional Stewardship system, governing a holding of her own in his name"],
      ["Signature asset", "Survival on her own terms through nine unaccounted-for years — neither a rescued princess nor a political pawn returned to circulation, but someone who made herself unfindable by any court on either side of the war her disappearance triggered"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and a specific account of how she spent 1500–1511 before this can be drafted"],
      ["The refusal", "Locked: she is the one who chooses not to return, asking Angin directly rather than leaving the decision ambiguously his. A real act of agency at sixteen or so, not something that simply happens to her"],
      ["Rivalry", "None chosen — her real antagonist, if she has one, is the political machinery that tried to use her as currency in 1500 and never fully stopped looking, quietly, for where she went"],
      ["Signature legend", "None yet, and possibly none ever — like Angin, her real story (a war that traces back to her) is one almost nobody alive could actually piece together"],
      ["The unspoken thread", "Does she ever learn Angin caused the war that upended her life? Does he? Genuinely open — the reunion could be built around one, both, or neither of them ever fully knowing, and that choice significantly changes what Act 3 does with her"],
    ]
  },
  {
    name: "[Placeholder — Angin's Dayak Helmsman]",
    role: "side",
    title: "The First Rudder, and the Last — a Scout Who Comes Back",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. A Dayak scout from interior Borneo, headhunter-trained, river-and-jungle competence turned toward reef and current — a long way from his own longhouse, for reasons never fully explained. The first to give Angin real trust rather than a test: hands him the rudder of a kelulus during the drifting stretch, open water first, then the strait, then at night, no ceremony, exactly as the Ascension ladder's own text describes the Helmsman rung. Recognizes something of his own displacement in Angin rather than testing him the way most captains would. Pulled away for a stretch by his own unexplained business shortly before the mentor's death, leaving Angin doubly adrift — but returns for good once Angin has his own hull, stepping into permanent helmsman aboard the same ship he once taught Angin to steer.",
    facts: [
      ["Domain", "No fixed seat — interior Borneo by birth, the water by choice, for reasons he doesn't explain"],
      ["Signature asset", "Reef and current reading translated from a lifetime of river and jungle competence — the same instinct for terrain, applied to a different terrain entirely"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and a decision on what pulled him away from his longhouse and what pulled him back to Angin"],
      ["Rivalry", "None chosen — whatever conflict shaped his own past stays with his own people, off the page"],
      ["Signature legend", "None yet — his real reputation, if he has one, belongs to a longhouse this roster never visits"],
      ["Role aboard", "Helmsman, permanently, once he rejoins — the literal hands on the rudder for the rest of the book, unless the outline changes"],
    ]
  },
  {
    name: "[Placeholder — Angin's Batak Headfighter]",
    role: "side",
    title: "The Bodyguard No One Tests Twice",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. From the Batak highlands of interior North Sumatra, outside both Islamic and Hindu-Buddhist reach in 1500 — a people with a real, historically documented tradition of ritual, judicial execution-by-consumption, which travels with him as reputation whether or not he's ever asked to confirm it. Joins Angin's crew once the Bugis mentor's death leaves a protection gap no one else fills — not a second mentor, no doctrine or siri, just total, blunt loyalty and a level of violence rival crews think twice about provoking. Becomes Angin's permanent headfighter and bodyguard from the raiding stretch onward. What he actually believes, wants, or is running from is deliberately left closer to the chest than most of the crew — the least explained member of the found family by design.",
    facts: [
      ["Domain", "No fixed seat — Batak highlands by birth, Angin's crew by choice"],
      ["Signature asset", "A reputation that does the fighting before the fighting starts — most crews who know what's said about Batak tradition don't test him twice"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and a decision on how much (if anything) he ever confirms about what's said of his people"],
      ["Rivalry", "None chosen — his loyalty is to Angin specifically, not to any cause or grudge of his own that's been built out yet"],
      ["Signature legend", "Whatever's said about him in the ports he's worked — deliberately left as rumor rather than confirmed fact, even to the reader"],
      ["Role aboard", "Headfighter and bodyguard, permanently, from Beat 10a onward"],
    ]
  },
  {
    name: "[Placeholder — Angin's Minangkabau Crewmember]",
    role: "side",
    title: "Merantau — Making Her Own Name, On Her Own Terms",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. A young woman from the Minangkabau highlands of West Sumatra, living out <em>merantau</em> — the real Minangkabau tradition of deliberately leaving home to make a name and a fortune before any claim to return with honor. Where Angin's rootlessness was forced on him by a wreck he doesn't remember, hers is chosen: Minangkabau inheritance runs matrilineal, so she isn't needed at home the way a son would be, which makes her departure a freedom rather than an exile. Joins Angin's crew during the raiding/trading buildup stretch, and becomes, in practice, the one person aboard who actually understands the shape of his ambition on its own terms rather than just following it — sharp, unsentimental, and climbing for herself even while nominally serving him.",
    facts: [
      ["Domain", "No fixed seat — West Sumatran highlands by birth, the sea by deliberate choice, not displacement"],
      ["Signature asset", "A clarity about ambition nobody else aboard has — she left home on purpose, to become someone on purpose, and reads Angin's own climb more accurately for it"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and a decision on what she's actually chasing for herself, distinct from Angin's own goals"],
      ["Rivalry", "None chosen yet — open to becoming a genuine parallel climber in her own right rather than only crew, if the outline wants that later"],
      ["Signature legend", "None yet — hers is still being built, on her own terms, the same as Angin's"],
      ["Role aboard", "Joins during the raiding/trading buildup (Beat 10b) — exact function (navigator, negotiator, second-in-command) still open"],
    ]
  },
  {
    name: "[Placeholder — Angin's Bajau Crewmember]",
    role: "side",
    title: "The Diver — a Second Voice From the Water",
    intro: "Not yet named or fully built — a placeholder, to be developed as the outline continues. From the Bajau (Sama-Bajau) people, sea nomads distinct from Angin's own Orang Laut upbringing and concentrated further toward Sulu and Sulawesi waters — free-diving and boat-dwelling traditions built for work no Malay-tradition sailor trains for: salvage, hull inspection below the waterline, working a wreck or a shallow passage from underneath rather than above. Picked up running the Brunei trade lane through unfamiliar reef water. Where the malim reads the water from the deck, the Bajau works it from beneath the surface — a second '<em>belongs to the water, not the land</em>' voice on the crew, distinct in texture from Angin's own background rather than redundant with it, and a quiet, ongoing reminder that Angin's own Orang Laut identity is only one of several ways a person can belong entirely to the sea.",
    facts: [
      ["Domain", "No fixed seat — Sulu/Sulawesi waters by tradition, wherever the crew's hull takes him by choice"],
      ["Signature asset", "Free-diving and underwater work no one else aboard can do — salvage and reef-work that opens routes and recovers cargo otherwise lost"],
      ["Defining trait", "TBD — placeholder only; needs a real name, voice, and a decision on how his own people's traditions read against Angin's more Orang-Laut-inflected worldview"],
      ["Rivalry", "None chosen — no conflict built out yet"],
      ["Signature legend", "None yet"],
      ["Role aboard", "Joins during the Brunei run (Beat 11a-i) — diver, salvage, underwater work"],
    ]
  },
  {
    name: "Nina Chatu",
    role: "side",
    title: "A Young Fence Building Toward Something — the Man Who Knows What Angin Actually Is",
    intro: "Butterfly Effect flag, same category as Tun Perak's survival: the historical Nina Chatu is a real figure, but a Hindu (Kling) merchant who doesn't emerge as significant until after Malacca falls in 1511, when he helps free Portuguese prisoners and is made the city's administrator under Albuquerque. Everything about his presence here, over a decade earlier and in an entirely different role, is invented — a deliberate divergence, not a retelling of anything on record. In 1498&ndash;1500 he is simply young and rising himself, a street-level merchant willing to move goods nobody asks too many questions about. He and Angin build up together, small-time to bigger, over the same stretch that turns Angin's stolen kelulus into a real trading front — Nina Chatu is the fence who launders what the raiding side takes, which means he is also the one person outside the Orang Laut crew who has quietly watched Angin's double life take shape from the very start.",
    facts: [
      ["Domain", "No fixed seat yet — a street-level merchant's reach, not a court's"],
      ["Signature asset", "A willingness to ask fewer questions than anyone else Angin could sell to, at exactly the moment that's worth more than coin"],
      ["Defining trait", "Building himself up the same way Angin is — through what he's willing to launder, not what he's willing to declare"],
      ["Rivalry", "None yet in the political sense — his real leverage over Angin isn't rivalry, it's proof"],
      ["Signature legend", "Not yet his own — history remembers a very different Nina Chatu, a decade-plus from now and on the other side of Malacca's fall; nothing about that man has happened yet"],
      ["Leverage", "Has personally handled enough of what the raiding side takes to know exactly what Angin's trading front is actually built on — and is, within Act 1, the one who threatens to use it"],
    ]
  },
  {
    name: "Tun Perpatih Putih",
    role: "side",
    title: "6th Bendahara of Malacca — a Ceasefire, a Suspicion, and a War That Answers It",
    intro: "A real historical figure: Tun Perak's own brother, and Malacca's 6th bendahara from 1498 (succeeding Tun Perak in the history this book otherwise follows) until his death in 1500 — described by the record as an ineffective, aging chief minister, presiding over rising corruption and Gujarati–Malay factional tension he can't fully control. In this telling, he becomes the court official who almost ends Angin's rise before it starts. Anxious to avoid provoking Ayutthaya into open war Malacca's weakened court can't afford, he orders a ceasefire policy toward Siam — and when word reaches him that an unlicensed raider has been hitting Siamese shipping, undermining exactly that policy, Angin becomes his prime suspect, the accusation of treason all but spoken. He never gets to act on it. Ramathibodi II's fleet arrives in 1500 regardless, and Tun Perpatih Putih dies in the attack he tried to prevent — his actual cause of death left unspecified by the historical record, the same kind of gap the book already uses for Tun Perak. Tun Mutahir succeeds him within the same year.",
    facts: [
      ["Domain", "Bendahara of Malacca (1498–1500) — chief minister, second in court authority only to the sultan"],
      ["Signature asset", "The office itself, inherited from his brother — though the book, like the historical record, treats him as holding the title without Tun Perak's real command of it"],
      ["Defining trait", "A cautious, anxious administrator, trying to hold a fraying court together by avoiding war rather than by commanding respect"],
      ["Rivalry", "Suspects Angin of treason — provoking Siam through unlicensed raiding — in direct defiance of his ceasefire policy"],
      ["Signature legend", "Dies in the actual 1500 Siamese invasion of Malacca, historically undocumented in cause — the accusation against Angin dies with him, unresolved rather than disproven"],
    ]
  },
  {
    name: "Lapu-Lapu",
    role: "sea-lord",
    team: "Lapu-Lapu",
    title: "Datu of Mactan, Visayas",
    intro: "The last free chief of the central islands — a man who answers to no rajah and no sultan, only to the sea around Mactan. Where Cebu's rulers have begun courting foreign traders and foreign gods, Lapu-Lapu holds the old ways: his authority comes from the loyalty of his timawa warriors, not from tribute rolls or treaties.",
    facts: [
      ["Domain", "Mactan Island, Visayas"],
      ["Signature weapon", "Kampilan (single-edged, forked-pommel sword) and a warrior's kalasag shield"],
      ["Defining trait", "Stubborn sovereignty — he treats every foreign sail on the horizon as a test of whether Mactan still belongs to Mactan"],
      ["Rivalry", "A cold, simmering rivalry with the rulers of neighboring Cebu, who favor accommodation with outside powers over resistance"],
      ["Signature legend", "Even before any foreign fleet arrives, he is already known up and down the strait as the datu who has never lost a raid or been made to kneel"],
      ["Carries", "A jade amulet worn since childhood, its match found on a handful of others scattered across the archipelago — its meaning unexplained, its bond unmistakable"],
    ]
  },
  {
    name: "Bolkiah",
    role: "sea-lord",
    team: "Bolkiah",
    title: "Sultan of Brunei",
    intro: "The sultan under whom Brunei stops being a regional trading port and becomes an empire. His fleets and his court's wealth reach from the Philippines to the fringes of Java. Brunei under Bolkiah is less a kingdom than a web — vassal datus, tribute routes, and marriage alliances radiating outward from the water-city of Kota Batu.",
    facts: [
      ["Domain", "Brunei, with tributary reach into northern Borneo, Sulu, and parts of Luzon"],
      ["Signature asset", "Not a weapon but a fleet — Brunei's navy and its merchant convoys are the true instrument of his power"],
      ["Defining trait", "Expansion through marriage and trade agreements as much as conquest — a builder-king, not merely a warrior-king"],
      ["Rivalry", "Contests influence over the Sulu and Luzon datus with the Sulu Sultanate itself"],
      ["Signature legend", "Said to have never lost a war he personally led, and to have expanded Brunei's reach further than any sultan before or after him"],
      ["A quiet suspicion", "Has, for some time, quietly suspected that Tun Perak never actually died in 1498 — old trade patterns, an unclaimed stretch of coast near Malacca, rumors too specific to be nothing. Tests a young trader named Angin in Beat 14 partly for this reason; learns nothing conclusive, but doesn't fully let the thread go either"],
    ]
  },
  {
    name: "Tun Perak",
    role: "side",
    title: "Officially Dead — the Kingmaker's Second, Secret War",
    intro: "Historically, Malacca's fifth and most famous bendahara, dead by 1498 in the chronology this book otherwise follows. In this telling, he's alive in 1498 — and has been living a double life for longer than anyone around him suspects. Tun Perak had, in secret, been in contact with Siamese intelligence — not out of disloyalty to Malacca so much as an old kingmaker's private, unauthorized attempt to manage a threat (Ayutthaya) he judged Malacca's own court too complacent to take seriously. It's that secret contact, not simple bad luck, that puts unexpectedly heavy guards on his vessel the night Angin's raiding crew (sent, unknowingly, by Cabral) tries to kill him — Siamese-sourced intelligence about the coming hit reached him first. The raid that should have been a clean, quiet kill instead turns into real fighting, and costs Angin's crew a death, because the man they came for already knew more than anyone assumed a spy network's target should. Angin spares him anyway, in the raid's immediate aftermath — and Tun Perak, rather than reclaiming his seat, lets the world believe him dead. Not peaceful retirement, but fear and genuine regret: an old man who let a private war against one threat (Siam) blind him to how badly it could cost the people around him, and who now uses his own presumed death as cover to keep working, quietly, against what he now judges the truly existential danger — Cabral, and the Portuguese intelligence and military apparatus moving into the region years ahead of their fleet's actual arrival. He is, in effect, running a second secret war under everyone's nose, including Angin's, using a scattered, informal network of old contacts and favors — the Bugis mentor among them — to gather what Malacca's own complacent court refuses to take seriously. He is old, and knows he's running out of time to finish what he's started.",
    facts: [
      ["Domain", "None on record — presumed dead. In practice, a hidden network of old contacts, debts, and favors spanning ports Malacca's own court no longer thinks to watch"],
      ["Signature asset", "Decades of accumulated relationships and intelligence-gathering instinct that outlast his official career entirely — the same skill that built Malacca's dominance now spent in secret against a threat the court can't see coming"],
      ["Defining trait", "Guilt-driven persistence — a man trying to atone for one costly secret war (the Siam contact that got a boy's brother-figure killed) by fighting a second, more dangerous one (against Cabral and Portugal) before his body gives out"],
      ["The amulet", "Given to Angin at their parting. Its real, functional purpose: a recognition token for Tun Perak's own scattered network — carried, unknowingly, by a boy who has no idea he's holding a spy's signal. Meant to eventually draw Angin into contact with the rest of the network, or be recognized by someone within it, whether or not Tun Perak lives to see it happen"],
      ["The beach across the strait", "Owns, secretly, a small stretch of Sumatran coast directly across from Malacca — the same beach Angin later buys outright with his own trade profit in Beat 11b, unaware it once belonged to the very man who spared his life. Tun Perak leads Angin near this stretch of coast during their parting in Beat 7, without explaining why"],
      ["Network members (known so far)", "The Bugis mentor who later trains Angin in combat and siri — part of Tun Perak's informal network, tasked (knowingly, unlike Angin) with quietly keeping an eye on the boy who spared him. His death at Cabral's hands is a real loss to Tun Perak's own effort, not just to Angin"],
      ["What Angin doesn't know", "Any of this. The amulet's true purpose, the mentor's real assignment, the beach's original owner, the existence of a second secret war — all withheld from Angin and, per the Butterfly Effect device, revealed to the reader on the book's own schedule rather than his"],
    ]
  },
  {
    name: "Mahmud Shah",
    role: "sea-lord",
    team: "Mahmud Shah",
    title: "Sultan of Malacca",
    intro: "The last sultan to rule an undivided Malacca — though he does not yet know that. Malacca grows no spice of its own; its wealth comes from sitting astride the one strait every ship between India and China has to thread, taxing and porting the goods of others rather than producing any of them. In 1500 that toll has made him sovereign of the richest entrepôt in the spice world, inheriting an empire built by his father Muzaffar Shah and the great bendahara Tun Perak. Malacca's wealth is staggering; so is the complacency it's bred in its court.",
    facts: [
      ["Domain", "Malacca, dominant over the Malay Peninsula and eastern Sumatra"],
      ["Signature asset", "The port of Malacca itself — the single most valuable strait-choke in the known trading world"],
      ["Defining trait", "Inherited grandeur — Mahmud Shah rules an empire he did not have to build, and the story of this era asks whether he can defend what he was given"],
      ["Rivalry", "Uneasy tension with his own court, especially the bendahara's office (Tun Mutahir), and looming pressure from Siam to the north"],
      ["Signature legend", "Malacca's wealth is so famous that merchants say gold flows into the strait the way rivers flow into the sea — a reputation starting to attract dangerous foreign attention"],
    ]
  },
  {
    name: "Tun Mutahir",
    role: "vassal",
    team: "Mahmud Shah",
    title: "Bendahara (Chief Minister) of Malacca, installed 1500",
    intro: "The newest man to hold the second most powerful office in Malacca, stepping into shoes vacated by the legendary Tun Perak. Where Tun Perak was a warrior-statesman who built the empire through conquest and alliance, Tun Mutahir inherits a court thick with rivals, palace factions, and old loyalties he did not personally earn.",
    facts: [
      ["Domain", "Malacca court and administration"],
      ["Signature asset", "Command of the bureaucracy and the merchant-tax apparatus that funds Malacca's wealth"],
      ["Defining trait", "A political survivor navigating a court where the old guard's loyalty was to Tun Perak, not to him"],
      ["Rivalry", "Court factions skeptical of an outsider filling Tun Perak's role; potential friction with Sultan Mahmud Shah himself over the true center of power in Malacca"],
      ["Signature legend", "Whispers already circulate that his rise was too fast, too convenient — the kind of talk that ages badly in royal courts"],
    ]
  },
  {
    name: "Al-Mansur",
    role: "sea-lord",
    team: "Al-Mansur",
    title: "Sultan of Ternate",
    intro: "Ruler of the true heart of the spice trade — Ternate is one of the only places on earth where cloves grow, which makes Al-Mansur's tiny island sultanate disproportionately powerful. Every spice merchant from Malacca to China ultimately answers to what happens on Ternate's shores.",
    facts: [
      ["Domain", "Ternate and its sphere in Maluku (the Spice Islands)"],
      ["Signature asset", "A monopoly — literal, geographic — on clove production"],
      ["Defining trait", "Quiet, immense leverage. He doesn't need a large territory or a large army; he needs only to control the one thing the whole world wants"],
      ["Rivalry", "The neighboring sultanate of Tidore, locked in perpetual competition for dominance of the spice trade"],
      ["Signature legend", "Foreign traders speak of Ternate the way they speak of legendary treasure — a place everyone wants to reach and few fully understand"],
    ]
  },
  {
    name: "Sri Baduga Maharaja",
    role: "sea-lord",
    team: "Sri Baduga Maharaja",
    title: "King of Sunda (Pakuan Pajajaran)",
    intro: "The Hindu king of West Java, reigning over a kingdom increasingly surrounded by rising Islamic sultanates (Demak, Cirebon) on his own island. His reign (1482–1521) is remembered — at least in later memory — as an age of peace and prosperity, but it's peace bought under mounting pressure.",
    facts: [
      ["Domain", "Sunda Kingdom, West Java, capital at Pakuan Pajajaran"],
      ["Signature asset", "Control of the pepper trade through the port of Sunda Kalapa"],
      ["Defining trait", "A ruler holding the old Hindu-Sundanese order together while the religious and political map of Java shifts around him"],
      ["Rivalry", "The newly Islamic Demak Sultanate under Raden Patah, expanding at Sunda's expense"],
      ["Signature legend", "His court is remembered afterward as the last great flowering of old Sunda before everything changed"],
    ]
  },
  {
    name: "Raden Patah",
    role: "sea-lord",
    team: "Raden Patah",
    title: "Founder of the Demak Sultanate",
    intro: "A new kind of power on Java — where Majapahit represents the fading Hindu-Buddhist old order and Sunda represents its western holdout, Demak under Raden Patah is the rising Islamic force reshaping the island's politics. Founding a sultanate from what was once Majapahit territory is as much a political statement as a religious one.",
    facts: [
      ["Domain", "Demak, Central Java"],
      ["Signature asset", "Religious and political legitimacy as the standard-bearer of Islam's rise on Java"],
      ["Defining trait", "A founder-king building institutions from nothing, aware that he's creating something that will outlast him — or needs to"],
      ["Rivalry", "Territorial and ideological rivalry with both the fading Majapahit court and the Hindu Sunda Kingdom"],
      ["Signature legend", "Said by later chroniclers to be of Majapahit royal blood himself, making his rise as much a succession as a rebellion"],
    ]
  },
  {
    name: "Hang Tuah",
    role: "vassal",
    team: "Mahmud Shah",
    title: "Laksamana (Admiral) of Malacca",
    intro: "The oldest living legend in Malacca's court — born around 1431, he is roughly seventy years old in 1500 and has already served under four sultans. Where younger courtiers scheme for advantage, Hang Tuah's authority comes from having simply outlasted everyone else's claim to loyalty. He has seen Malacca's rise firsthand and, though he doesn't know it yet, will live to see its fall to the Portuguese in 1511.",
    facts: [
      ["Domain", "Malacca's navy and court, serving the Sultan directly"],
      ["Signature weapon", "The keris Taming Sari, said to be unbeatable in single combat"],
      ["Defining trait", "Unshakeable loyalty to the throne itself, regardless of who sits on it — a living embodiment of Malacca's continuity"],
      ["Rivalry", "His old bond with fellow warrior Hang Jebat ended in tragedy years ago; he carries that history quietly"],
      ["Signature legend", "Foreign envoys are told his name before they're told the Sultan's — he is Malacca's memory as much as its sword"],
      ["Crosses paths with Angin", "Commanding Malacca's defense in person during the 1500 Siamese invasion, he catches sight of a sixteen-year-old fighting with a discipline no untrained raider should have — and says nothing, files it away. Neither of them treats it as a meeting at the time; a possible seed for a real First Contact in Act 2, not yet a relationship"],
    ]
  },
  {
    name: "Hang Nadim",
    role: "unrisen",
    cohort: "rivals-mirrors",
    team: "Mahmud Shah",
    title: "A Fellow Climber, Not Yet Risen — son of Hang Jebat, foster son of Hang Tuah",
    intro: "By the tradition later chroniclers settle on — the Sejarah Melayu first, the Tuhfat al-Nafis more fully a century after that — Hang Nadim is born into a name split against itself: son of Hang Jebat, the warrior who rose against his own sultan out of loyalty to a wronged friend, and raised after by Hang Tuah, the man who killed him for it. In 1500 he is young, unproven, and carries both inheritances at once with no way to reconcile them. History (such as the later chronicles record it) has him grown into Johor's admiral within two decades, leading raid after raid to retake a Malacca that will, by then, already belong to Portugal. None of that has happened yet. He is, right now, exactly what Angin is — a young man climbing toward the same rungs of the same ladder, a name that isn't settled — except his name is over-determined by two legendary fathers pulling in opposite directions, where Angin's is empty. One of this era's several nakhoda-in-the-making, not Angin's antagonist so much as his mirror: whichever of them the chronicles remember, it likely won't be both.",
    facts: [
      ["Domain", "None yet — a name, not a territory, and even the name is contested by which chronicle you trust"],
      ["Signature asset", "Two legacies at open war with each other — rebellion and loyalty, both worn at once, neither fully claimed"],
      ["Defining trait", "Unresolved inheritance — where Angin has no story handed to him, Hang Nadim has been handed two incompatible ones"],
      ["Rivalry", "Angin, though neither yet knows it — two young men climbing the same nakhoda's ladder in the same narrow decade, one of whom history will remember and one of whom it won't. His declared fight (against the Portuguese, for a Malacca already lost) is still more than a decade off the roster's present"],
      ["Signature legend", "History remembers him imperfectly and late — the earliest chronicles barely name him; it's the later ones that give him a face. A caution the book can use rather than smooth over: even the figures who ARE remembered are remembered unevenly."],
    ]
  },
  {
    name: "Gurabesi",
    role: "vassal",
    team: "Tidore",
    title: "War Chief of Biak, servant of Tidore",
    intro: "A legendary Papuan war leader from Biak in West New Guinea, Gurabesi built his reputation defeating the Sawai people in the waters around Raja Ampat before offering his sword to the Sultanate of Tidore. Around 1500, under Sultan Jamaluddin's court, his alliance becomes the bridge between the Malayo-Islamic sultanates of Maluku and the Papuan world further east — a partnership sealed, as the old stories tell it, by marriage to a Tidore princess.",
    facts: [
      ["Domain", "Waigeo and the Raja Ampat Islands, in service to Tidore"],
      ["Signature asset", "Command of Biak's seafaring warriors and deep knowledge of the eastern waters beyond Maluku"],
      ["Defining trait", "A bridge-builder between two very different worlds — Papuan Waigeo and the Islamic court of Tidore — through cunning as much as combat"],
      ["Rivalry", "Old hostility with the Sawai people of southeastern Halmahera, won through strategy rather than open battle"],
      ["Signature legend", "Said to have taken a Sawai fortress by poisoning their watchdogs in the night — a story still told for its cunning, not its brutality"]
    ]
  },
  {
    name: "Pati Unus",
    role: "heir",
    cohort: "rivals-mirrors",
    team: "Raden Patah",
    title: "Crown Prince of Demak — the Photonegative of Angin's Climb",
    intro: "Not yet a ruler, not yet a warrior — in 1500 he is simply the son of Raden Patah, growing up in a court that is actively reshaping Java's religious and political map. History remembers him as Pangeran Sabrang Lor, the prince who would one day lead a great naval assault on Portuguese Malacca and die in the attempt. In 1500, none of that has happened yet; he is a child watching his father build something new. He is, in every way Angin isn't, the inverse of the same era's ambition: where Angin has to build a name out of nothing, Pati Unus is handed one before he's old enough to have earned it — and where Angin's story (as it's currently plotted) ends old and forgotten, Pati Unus's ends young, glorious, and remembered. Neither man will ever meet the other and call it rivalry; the mirror is the reader's to see, not theirs.",
    facts: [
      ["Domain", "None yet — heir to Demak, still a child in his father's court"],
      ["Signature asset", "Proximity to power at the exact moment Demak is being founded — a front-row seat to history before he's old enough to shape it himself"],
      ["Defining trait", "Inherited ambition not yet tested — everything that will define him (the Malacca campaigns, the title Sabrang Lor) is still two decades away"],
      ["Rivalry", "None yet in the political sense — his future campaigns against the Portuguese in Malacca are decades off. The only rivalry that matters here is structural, not personal: Pati Unus climbs by inherited legitimacy where Angin climbs by merit alone, and history keeps the name of the one who was born to it"],
      ["Signature legend", "Later chroniclers will remember him as the prince who sailed a hundred ships against Malacca; in 1500 he is only just learning what Demak is for"]
    ]
  },
  {
    name: "Udara",
    role: "sea-lord",
    team: "Udara",
    title: "Ruler of the Majapahit rump court, Daha (Kediri)",
    intro: "The general who made himself king. Udara stormed Trowulan for Girindrawardhana in 1478 and, when Girindrawardhana died in 1489, took the throne himself rather than see it pass to a weaker claimant — an unusual break from bloodline succession in a court that still calls itself the heir of Hayam Wuruk's empire. In 1500 he presides over what is left of Majapahit's name: a court at Daha with no navy, no coastline of consequence, and a religion — Hindu-Buddhist orthodoxy — that is being politely, and then not so politely, displaced on every side.",
    facts: [
      ["Domain", "The Majapahit rump court at Daha, in the Kediri interior of East Java"],
      ["Signature asset", "Legitimacy without leverage — the Majapahit name still commands ritual deference, even as the sultanates now hold the ports, the trade, and the soldiers"],
      ["Defining trait", "A soldier who became a king by conquest rather than blood, ruling a court whose entire claim to authority rests on the idea that blood is what legitimizes a throne"],
      ["Rivalry", "Demak under Raden Patah, who claims descent from Majapahit's own royal line and is absorbing what remains of its coastal territory piece by piece"],
      ["Signature legend", "Chronicles disagree on exactly how he came to rule — general, regent, or usurper — a fittingly unresolved footnote for a kingdom whose ending nobody can quite agree on either"],
    ]
  },
  {
    name: "Ramathibodi II",
    role: "external",
    title: "King of Ayutthaya (Siam)",
    intro: "Not a Nusantara ruler at all, but the outside pressure the roster can already feel. Crowned in 1491 in his teens, Ramathibodi II inherits a Siam that has never accepted Malacca's independence as final — Malacca was, within living memory, a Siamese tributary before it slipped free and grew rich. In 1500 he does something about it: he sends an army south to bring Malacca back under Ayutthaya's hand.",
    facts: [
      ["Domain", "Ayutthaya, dominant over the Chao Phraya basin and claiming old tributary right over the upper Malay Peninsula"],
      ["Signature asset", "Siam's standing army and its unrelinquished historical claim on Malacca as a former vassal state"],
      ["Defining trait", "Unfinished business — where Mahmud Shah treats Malacca's independence as settled fact, Ramathibodi II treats it as an open question, and 1500 is the year he acts on that"],
      ["Rivalry", "Sultan Mahmud Shah of Malacca, directly — his 1500 campaign is the clearest act of open aggression anywhere on the roster this year"],
      ["Signature legend", "The invasion fails to retake Malacca outright, but extracts tribute from Malacca and its neighbors anyway — a partial win that keeps the old claim alive rather than closing it"],
    ]
  },
  {
    name: "Pedro Álvares Cabral",
    role: "external",
    title: "Portuguese fleet commander, Calicut (Malabar Coast, India)",
    intro: "Not in the Nusantara at all in 1500 — not within a thousand leagues of it — but the closest thing this roster's present has to the shape of what's coming. In September 1500, Cabral's fleet reaches Calicut on India's Malabar Coast and opens the first European trading post anywhere in Asia. It does not go well. Within months the factory is overrun by a mob backed by the resident Arab merchant guild, dozens of his men are killed, and Cabral answers by burning ships in the harbor and bombarding the city itself. None of the roster has heard his name. His ships are still nine years from Malacca's own harbor mouth. But the method has already been demonstrated: trade backed by cannon, and a willingness to burn a city over a broken agreement.",
    facts: [
      ["Domain", "A single contested factory at Calicut, India — no Nusantara territory or trade route yet"],
      ["Signature asset", "Cannon and the willingness to use them over a trade dispute — a negotiating posture nothing on this roster's own board currently answers with"],
      ["Defining trait", "The Game's own rule made flesh nine years early: not a player competing within the system, but the first sign of a force that intends to rewrite it — see The Game tab's account of what 1511 actually breaks"],
      ["Rivalry", "The Arab merchant guild resident in Calicut, whose alarm at Portuguese trade ambitions boils over into the attack that burns his factory down within the same year"],
      ["Signature legend", "None yet in these waters — but the ships that reach Malacca in 1509, and the fleet that takes it in 1511 under Afonso de Albuquerque, follow the same playbook Cabral is writing in Calicut this very year"],
    ]
  },
  {
    name: "Ali Mughayat Syah",
    role: "unrisen",
    cohort: "rivals-mirrors",
    team: "Ali Mughayat Syah",
    title: "Founder of the Future Aceh Sultanate — Rising in Angin's Own Waters",
    intro: "Not yet a sultan — in 1500 the man who will found Aceh's sultanate and, within a generation, turn it into one of the most powerful Islamic states in the archipelago is still a rising figure in the crowded politics of North Sumatra's coast, where Pasai has long been the dominant pepper port. His eventual founding of Aceh (traditionally dated to 1496–1511, with his full sultanate consolidating in the 1510s) will happen in the same turbulent window as Malacca's fall to the Portuguese — and Aceh will spend the following century positioning itself as the power that could avenge it. He is, in every way that matters to the Ascension, climbing the same ladder Angin climbs, in the same waters, across the same years — the most direct geographic rival on the whole roster, not because either man has chosen the other as an enemy, but because North Sumatra's coast can only hold so many men making themselves out of nothing at once.",
    facts: [
      ["Domain", "North Sumatra's coast, in the orbit of the older pepper port of Pasai, before Aceh's sultanate is fully consolidated"],
      ["Signature asset", "Proximity to Pasai's pepper wealth and the Indian Ocean trade lanes that make North Sumatra's coast worth ruling in the first place"],
      ["Defining trait", "A founder-in-waiting — everything that will define Aceh as a regional power (its rivalry with the Portuguese, its later reach into the Malay Peninsula) is still ahead of him in 1500"],
      ["Rivalry", "The older, still-dominant pepper port of Pasai, whose position his rising sultanate will eventually eclipse — and, unknowingly, Angin himself: one of them ends up founding a dynasty that outlasts the century, the other ends up with neither throne nor name"],
      ["Signature legend", "Later Acehnese chronicles trace the sultanate's entire founding story back to him — a beginning that, in 1500, has not yet fully happened"],
    ]
  },
  {
    name: "Dalem Waturenggong",
    role: "sea-lord",
    team: "Dalem Waturenggong",
    title: "King of Bali (Gelgel dynasty)",
    intro: "Roughly a decade into a reign that Balinese chronicles will eventually remember as the island's golden age — a long, stable rule (traditional dating places its start around 1460) that later generations look back on the way Malacca's own courtiers look back on Tun Perak's era. In 1500 that legendary status is still being built rather than already secured: he is simply the King of Bali, ruling from Gelgel while the Hindu-Buddhist order he represents holds firm on his island even as it erodes on Java just across the strait.",
    facts: [
      ["Domain", "The Gelgel Kingdom, Bali, with expanding influence toward Lombok and Sumbawa"],
      ["Signature asset", "A stable, prosperous court at a moment when nearly every neighboring polity is mid-transition — religiously, politically, or both"],
      ["Defining trait", "Continuity as strength — where Java's courts are being founded, converted, or hollowed out around him, Waturenggong simply keeps Bali's old order working"],
      ["Rivalry", "No sharp rivalry recorded for 1500 itself, though Bali's raiding and trading relationship with Java's shifting courts (Demak among them) keeps the border never fully settled"],
      ["Signature legend", "Later Balinese chronicles remember his reign as the high-water mark of literature, religion, and court culture the island would spend centuries trying to recapture"],
    ]
  },
  {
    name: "Syarif Hidayatullah",
    role: "sea-lord",
    team: "Syarif Hidayatullah",
    title: "Founder-ruler of Cirebon",
    intro: "A court not yet fully independent, not yet fully absorbed — Cirebon in 1500 sits in the same current as Demak, part of the same wave of Islamic courts rising along Java's north coast, but with its own founder and its own claim to religious authority. Syarif Hidayatullah is remembered in later tradition as one of the Wali Sanga, the nine saints credited with spreading Islam across Java, which makes his rule as much a religious mission as a political one.",
    facts: [
      ["Domain", "Cirebon, on Java's north coast between Sunda and Demak's sphere"],
      ["Signature asset", "Religious authority that travels ahead of political power — his reputation as a teacher and holy man opens doors his small territory alone would not"],
      ["Defining trait", "A ruler operating on two registers at once, court politics and religious mission, in a period when the two are barely separable on Java's coast"],
      ["Rivalry", "Caught geographically between the Hindu Sunda Kingdom to the west and the rising Demak Sultanate to the east — Cirebon's independence is real but narrow"],
      ["Signature legend", "Later tradition folds him into the Wali Sanga, the nine saints of Javanese Islam — a status that, in 1500, is only beginning to attach to his name"],
    ]
  },
  {
    name: "Tumapaqrisiq Kallonna",
    role: "sea-lord",
    team: "Tumapaqrisiq Kallonna",
    title: "Ruler of Gowa, South Sulawesi",
    intro: "An early figure in Gowa's long climb toward becoming, a century later, the dominant power of eastern Indonesia under the Makassar sultanate. In 1500 that future is not yet written — Gowa is one of several competing polities in South Sulawesi, sharing the peninsula uneasily with Bone, and Islam has not yet arrived to reshape the kingdom's identity the way it will in the early 1600s.",
    facts: [
      ["Domain", "Gowa, South Sulawesi, contesting regional primacy with neighboring Bone"],
      ["Signature asset", "Position astride the Makassar Strait feeder routes linking Java's rice and textile trade to the clove markets of Maluku"],
      ["Defining trait", "A ruler building toward regional dominance a century before Gowa's Islamic sultanate reaches its own golden age — the foundation, not yet the edifice"],
      ["Rivalry", "The neighboring kingdom of Bone, the other major power of the South Sulawesi peninsula, in a rivalry that will define the region for generations"],
      ["Signature legend", "Remembered chiefly as a forerunner — the name later Makassar chronicles reach back to when tracing the kingdom's rise to its 17th-century height"],
    ]
  },
  {
    name: "Orang Kayo Hitam",
    role: "sea-lord",
    team: "Orang Kayo Hitam",
    title: "Sultan of Jambi (took the throne in 1500)",
    intro: "The newest ruler on the entire roster — he takes Jambi's throne in exactly 1500 and will hold it for fifteen years. Where other courts on the map are mid-reign, Jambi's story is starting fresh this very year, on the east coast of Sumatra, in the gold and pepper country that feeds Malacca's markets from the south.",
    facts: [
      ["Domain", "Jambi, east coast of Sumatra, a steady supplier of gold and pepper into Malacca's trade network"],
      ["Signature asset", "The legendary keris Siginjai, a weapon whose story is already bound up with his own by the time he takes the throne"],
      ["Defining trait", "A reputation for courage that precedes his reign — he arrives at the throne already known for it, rather than needing to prove it once crowned"],
      ["Rivalry", "None sharply recorded for 1500 — his story this year is accession, not conflict, though Jambi's position keeps it perpetually in Malacca's economic orbit"],
      ["Signature legend", "The keris Siginjai remains associated with his name in Jambi's memory long after his fifteen-year reign ends"],
    ]
  },
  {
    name: "Bayanullah",
    role: "sea-lord",
    team: "Bayanullah",
    title: "Sultan of Sulu",
    intro: "Ruler of an archipelago sultanate whose wealth comes from the sea rather than the land — Sulu's pearling grounds are already famous enough that Brunei, far larger and far more powerful, still finds it worth trading directly rather than simply absorbing the smaller sultanate outright. Sulu answers fully to no one, threading its own trade lines to Manila Bay independent of Brunei's overlapping tributary network.",
    facts: [
      ["Domain", "Sulu (Jolo) and the Sulu Archipelago, between Borneo and Mindanao"],
      ["Signature asset", "Sulu's pearling grounds and tortoiseshell trade, valuable enough to draw merchants past larger, closer powers"],
      ["Defining trait", "Independence maintained through trade leverage rather than military strength — Sulu stays its own sultanate by being too useful to conquer"],
      ["Rivalry", "An uneasy overlap of interest with Brunei under Bolkiah, whose tributary reach touches Sulu's waters without fully absorbing them"],
      ["Signature legend", "Sulu pearls are already known in Chinese and Bruneian courts alike — a small sultanate's name carried much further than its size would suggest"],
    ]
  },
  {
    name: "Mansur Shah I of Pahang",
    role: "vassal",
    team: "Mahmud Shah",
    title: "Sultan of Pahang, joint ruler since 1495",
    intro: "Placed on Pahang's throne as a boy after his father Ahmad Shah I abdicated in 1495, Mansur Shah I in 1500 is still five years short of ruling in his own right — real authority rests with his uncle and co-ruler, Sultan Abdul Jamil Shah, who will hold the reins until his death in 1512. Pahang itself answers to Malacca, which installed Mansur on the throne through its own minister in the first place, making him a vassal's vassal in practice even while he carries the title of sultan.",
    facts: [
      ["Domain", "Pahang, a Malaccan vassal state on the peninsula's east coast, ruled jointly with his uncle"],
      ["Signature asset", "Blood ties to Malacca's ruling house on both sides — the throne he sits on and the overlordship above it both trace back to the same royal line"],
      ["Defining trait", "A sultan in name well before he is one in practice — the real decisions in Pahang's court in 1500 are his uncle's to make, not his"],
      ["Rivalry", "None of his own yet — Pahang's position is defined by its subordination to Malacca rather than by any conflict Mansur has personally entered"],
      ["Signature legend", "Later, after Malacca's fall in 1511, Sultan Mahmud Shah will take refuge in Pahang and marry his daughter to Mansur — a turn neither man can see coming in 1500"],
    ]
  },
  {
    name: "Shariff Kabungsuwan",
    role: "unrisen",
    cohort: "rivals-mirrors",
    team: "Shariff Kabungsuwan",
    title: "A Name Not Yet Spoken in Mindanao — a Distant Mirror of Angin's Climb",
    intro: "In 1500 he has not yet left Johor, and the Maguindanao Sultanate he will found does not exist. The Pulangi River basin is governed instead by the brother-chiefs Tabunaway and Mamalu, presiding over a still-animist Mindanao. Roughly fifteen years from now, Kabungsuwan will arrive claiming descent from both a Meccan holy line and the royal house of Malacca, convert Tabunaway's people to Islam, marry into the local nobility, and found a sultanate that will outlast every other polity on this map by centuries. None of that has started yet — but the shape of what's coming is the same shape as Angin's own climb: a man with no fixed seat, making a claim nobody can fully verify, about to build something out of a gap nobody else was watching. Distant from Angin's own gauntlet for most of the book, but their paths do cross by the time Angin's own worldview has matured enough for a real second contact to land — proof the ladder is being climbed simultaneously in more than one corner of the archipelago, arriving at a genuinely different answer to the same pressure.",
    facts: [
      ["Domain", "None in 1500 — Johor, most likely, though the record of his early life is thin even by the standards of founder-legends"],
      ["Signature asset", "A claimed lineage he hasn't yet had occasion to use — descent from a Meccan sharif on one side and Malacca's sultans on the other, the exact combination that will make his eventual arrival persuasive"],
      ["Defining trait", "A future entirely unwritten in 1500 — every part of his legend (the river crossing, the brothers' pact, the mass conversion) belongs to a story that hasn't started"],
      ["Rivalry", "None in the personal sense — his eventual rivalry with Mindanao's animist chiefs, resolved through conversion rather than conquest, is still a decade and a half away. The one relationship that does eventually mature is ideological, with Angin himself: conversion and marriage as a theory of lasting legitimacy, set against Angin's unity of shared interest"],
      ["Signature legend", "The Maguindanao tarsila will one day trace an unbroken royal line back to his arrival — a foundation story that, in 1500, hasn't been written because the man it's about hasn't come"],
    ]
  },
  {
    name: "Po Kabih",
    role: "sea-lord",
    team: "Po Kabih",
    title: "Ruler of Panduranga, surviving rump of Champa (r. 1494–1530)",
    intro: "What's left of Champa after Đại Việt sacked Vijaya, the old capital, in 1471 — a coastline that once commanded far more of central Vietnam, reduced now to the southern remnant at Panduranga. Po Kabih has held that remnant since 1494, ruling a kingdom whose entire political character in 1500 is defined by survival rather than ambition: not expanding, not contesting, simply enduring on a stretch of coast that both larger neighbors have so far found more useful intact than absorbed.",
    facts: [
      ["Domain", "Panduranga, the rump of Champa — a fraction of the coastline the old kingdom once held"],
      ["Signature asset", "Inertia itself — Panduranga persists less through strength than because neither Đại Việt nor its other neighbors have yet found reason to finish what 1471 started"],
      ["Defining trait", "A kingdom in eclipse holding on by sheer persistence — in a period when merely surviving is itself the accomplishment"],
      ["Rivalry", "Đại Việt's shadow, decades old and unresolved — the power that broke Vijaya in 1471 remains the standing threat Panduranga has never stopped living under"],
      ["Signature legend", "None yet made — Po Kabih's reign is remembered, when it's remembered at all, for what it didn't lose rather than for anything it won"],
    ]
  },
];

