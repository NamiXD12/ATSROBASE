/* ─── Training module data ─────────────────────────────────────────────────
   Two educational modules for the ASTROBASE Astronaut Training Academy.

   Scientific note: lesson content is based on publicly available NASA
   educational resources. It is simplified for a training simulation and
   does not represent official NASA procedures or emergency protocols.

   Sources referenced:
   - NASA Life Sciences / Human Research Program educational materials
   - NASA Artemis crew health and performance overviews
   - NASA "Spacewalk" educational content (nasa.gov)
─────────────────────────────────────────────────────────────────────────── */

const trainingModules = [
  /* ══════════════════════════════════════════════════════════════
     MODULE 1 — Spacecraft Life-Support Systems
  ══════════════════════════════════════════════════════════════ */
  {
    id:          'life-support',
    title:       'Spacecraft Life-Support Systems',
    subtitle:    'Keeping crew alive in the vacuum of space',
    icon:        '🌬️',
    color:       'blue',
    description:
      'Spacecraft cannot tap into Earth\'s atmosphere. Every breath astronauts take depends on engineered life-support systems that generate oxygen, remove exhaled carbon dioxide, recycle water, and maintain safe cabin pressure.',

    lessons: [
      {
        id:    'ls-1',
        title: 'Oxygen Generation',
        icon:  '💨',
        body: [
          'On Earth, oxygen makes up about 21% of the atmosphere and is naturally replenished by photosynthesis. In space, there is no such luxury — spacecraft must generate or carry every molecule of oxygen the crew breathes.',
          'The primary method used aboard the International Space Station is electrolysis: passing an electric current through purified water (H₂O) splits it into hydrogen (H₂) and oxygen (O₂). The oxygen is released into the cabin atmosphere; the hydrogen is vented overboard or used in other systems.',
          'Backup methods include solid-fuel oxygen generators (sometimes called "oxygen candles") — pellets of sodium chlorate that release oxygen when ignited — and compressed oxygen stored in high-pressure tanks, which can be used when electrolysis is unavailable.',
          '⚠️ Educational note: Adding more oxygen to a cabin does NOT remove carbon dioxide. Oxygen supply and CO₂ removal are entirely separate systems, each with its own hardware and failure modes.',
        ],
      },
      {
        id:    'ls-2',
        title: 'Carbon Dioxide Removal',
        icon:  '🫁',
        body: [
          'Every person exhales roughly 200 grams of carbon dioxide (CO₂) per hour at rest. In a sealed spacecraft cabin, CO₂ accumulates quickly. Earth\'s atmosphere contains about 0.04% CO₂; spacecraft systems aim to keep cabin levels below roughly 0.5–0.7% — above that, crew members begin to experience headaches and reduced concentration.',
          'The primary CO₂ removal system on the ISS uses a process called pressure-swing adsorption. Zeolite sorbent beds chemically capture CO₂ molecules from the cabin air. When a bed is saturated, the system heats it to release the CO₂ overboard — this is called "regeneration." Two beds alternate so scrubbing is continuous.',
          'Backup systems use lithium hydroxide (LiOH) canisters. The chemical reaction LiOH + CO₂ → LiHCO₃ passively absorbs CO₂ with no power required. These canisters are expendable — once saturated they cannot be regenerated and must be replaced.',
          '⚠️ Educational note: Increasing oxygen flow does NOT reduce CO₂. CO₂ molecules are only removed when physically captured or chemically bound by a scrubber system.',
        ],
      },
      {
        id:    'ls-3',
        title: 'Water Recovery',
        icon:  '💧',
        body: [
          'Launching water from Earth is extremely expensive — roughly $20,000 per kilogram to low Earth orbit in historical estimates. The ISS Water Recovery System therefore recycles nearly all water aboard: urine, condensation from cabin air, and water from other sources are all processed.',
          'Urine is first treated to remove ammonia and other impurities, then distilled. Cabin humidity is collected by condensation and also treated. The resulting water goes through a multi-stage purification system including iodination to prevent microbial growth. Recovery rates on the ISS have reached over 90% in operational conditions.',
          'Water produced this way is used for drinking, food preparation, and electrolysis (to generate oxygen). The goal is a fully closed loop where as little water as possible is wasted.',
        ],
      },
      {
        id:    'ls-4',
        title: 'Cabin Pressure Management',
        icon:  '🔧',
        body: [
          'The ISS cabin is maintained at a total pressure of roughly 101.3 kPa (1 atmosphere), with an oxygen partial pressure similar to sea level — the same mixture humans breathe on Earth. This avoids decompression sickness risks associated with lower-pressure, high-oxygen environments used in some earlier spacecraft.',
          'Pressure is monitored continuously. A sudden drop may indicate a micro-meteoroid or debris impact that has caused a hull breach. Procedures in that scenario involve locating and sealing the breach — crew members have used materials ranging from purpose-built plugs to improvised patches in training scenarios.',
          'Gradual pressure changes (from crew activities, hatch cycles, or small leaks) are managed by releasing stored nitrogen or oxygen from high-pressure tanks to maintain the target pressure level.',
          '⚠️ Educational note: This simulation simplifies real spacecraft atmospheric control, which involves dozens of sensors, redundant systems, and detailed procedures developed over decades of human spaceflight experience.',
        ],
      },
    ],

    quiz: [
      {
        question: 'Which process does the ISS primarily use to generate oxygen for the crew?',
        options: [
          'Burning stored oxygen candles continuously',
          'Electrolysis — splitting water molecules using electricity',
          'Pumping oxygen from pressurised tanks only',
          'Carbon dioxide conversion back into oxygen',
        ],
        correctIndex: 1,
        explanation:
          'The ISS Oxygen Generation System uses electrolysis to split purified water (H₂O) into hydrogen and oxygen. The oxygen enters the cabin atmosphere; the hydrogen is vented or used in other systems. Oxygen candles and tanks serve as backups, not the primary source.',
      },
      {
        question: 'CO₂ levels are rising in the cabin. An astronaut suggests opening the backup oxygen valves to fix the problem. Is this correct?',
        options: [
          'Yes — adding oxygen dilutes the CO₂ concentration',
          'Yes — oxygen and CO₂ systems are linked',
          'No — oxygen and CO₂ removal are separate systems; adding O₂ does not remove CO₂',
          'No — opening oxygen valves would make CO₂ levels worse',
        ],
        correctIndex: 2,
        explanation:
          'Oxygen supply and CO₂ removal are entirely independent systems. Adding more oxygen changes the O₂ partial pressure but does not remove a single CO₂ molecule from the atmosphere. CO₂ can only be reduced by routing cabin air through a scrubber system.',
      },
      {
        question: 'What happens when a zeolite sorbent bed in a CO₂ scrubber becomes "saturated"?',
        options: [
          'It explodes and must be replaced immediately',
          'It becomes full of CO₂ and can no longer absorb more — it must be regenerated by heating',
          'It starts producing extra oxygen as a by-product',
          'It automatically vents all CO₂ overboard and resets',
        ],
        correctIndex: 1,
        explanation:
          'A saturated sorbent bed is full of captured CO₂ and cannot absorb more. Regeneration involves heating the bed, which releases the CO₂ overboard and resets the bed for continued use. Two beds alternate so scrubbing is never interrupted during regeneration.',
      },
      {
        question: 'Why does the ISS recycle water from sources including urine rather than relying entirely on water launched from Earth?',
        options: [
          'Because drinking water is toxic when stored in space',
          'Because recycled water tastes better in microgravity',
          'Because launching water from Earth is extremely expensive and logistically limiting',
          'Because NASA regulations require it for environmental reasons',
        ],
        correctIndex: 2,
        explanation:
          'Launching mass to low Earth orbit is very costly. The Water Recovery System allows the ISS to operate with far less resupply, achieving recovery rates above 90% in operational conditions. The treated water meets safe drinking standards.',
      },
      {
        question: 'The ISS cabin pressure drops suddenly. What is the most likely cause, and what is the first priority?',
        options: [
          'The CO₂ scrubber has failed; restart it immediately',
          'A possible hull breach from micro-meteoroid or debris impact; locate and seal it',
          'The oxygen tanks are over-pressurised; reduce flow',
          'The water recovery system has flooded the cabin; switch it off',
        ],
        correctIndex: 1,
        explanation:
          'A sudden pressure drop in a sealed cabin strongly suggests a hull breach — the most likely cause in orbit is micro-meteoroid or orbital debris impact. The immediate priority is locating the breach and sealing it. CO₂ scrubber faults typically cause rising CO₂ with stable pressure, not a pressure drop.',
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════════
     MODULE 2 — Spacewalk Safety Protocols
  ══════════════════════════════════════════════════════════════ */
  {
    id:          'spacewalk',
    title:       'Spacewalk Safety Protocols',
    subtitle:    'Working safely outside the spacecraft',
    icon:        '🧑‍🚀',
    color:       'purple',
    description:
      'An extravehicular activity (EVA) — commonly called a spacewalk — is one of the most demanding and hazardous tasks an astronaut performs. This module covers the suit that keeps astronauts alive, the tether systems that keep them attached, the debris environment they operate in, and emergency return concepts.',

    lessons: [
      {
        id:    'sw-1',
        title: 'The Extravehicular Mobility Unit (EMU)',
        icon:  '🥼',
        body: [
          'The Extravehicular Mobility Unit (EMU) is a self-contained spacesuit used by NASA astronauts for spacewalks outside the ISS. It is effectively a one-person spacecraft: it provides oxygen, removes CO₂, regulates temperature and pressure, and supplies power and communications — all while allowing the astronaut to move and work.',
          'The suit operates at a lower pressure than the ISS cabin (around 29.6 kPa, or about 4.3 psi, compared to the cabin\'s ~101.3 kPa). This lower pressure makes the suit more flexible for working. However, it also means astronauts must spend several hours pre-breathing pure oxygen before an EVA to purge dissolved nitrogen from their blood — without this, rapid decompression could cause decompression sickness (the "bends").',
          'The Primary Life Support System (PLSS) is the backpack that houses oxygen tanks, CO₂ scrubbers, water for thermal control, and batteries. It carries enough supplies for approximately 7–8 hours of EVA, with a 30-minute emergency reserve.',
          '⚠️ Educational note: Spacesuit design is an active area of engineering. The EMU described here reflects the suit used on the ISS; NASA\'s next-generation exploration spacesuits (xEMU / Axiom) will differ in design.',
        ],
      },
      {
        id:    'sw-2',
        title: 'Tether Procedures',
        icon:  '🔗',
        body: [
          'Without gravity or atmosphere, an untethered astronaut who lets go of the spacecraft will drift away with no means of return. Tethers are therefore a critical safety system during every EVA.',
          'EVA crewmembers use a system of safety tethers that attach from the suit to fixed points on the spacecraft. The standard protocol involves being attached to at least one tether at all times — when moving from one anchor point to another, the second tether is attached before releasing the first. This "always-attached" principle ensures there is no moment of unattached floating.',
          'Some EVAs also use a device called the SAFER (Simplified Aid for EVA Rescue) — a small jet-pack worn on the back of the PLSS. SAFER is intended only as a last-resort emergency system to allow an untethered astronaut to manoeuvre back to the station. It is not a standard method of movement and carries limited propellant for a single recovery attempt.',
          '⚠️ Educational note: Tether procedures and SAFER use involve detailed training and checklists developed over many years of EVA operations. This module presents an educational overview, not operational procedures.',
        ],
      },
      {
        id:    'sw-3',
        title: 'Micrometeoroid and Orbital Debris Awareness',
        icon:  '☄️',
        body: [
          'Low Earth orbit contains millions of pieces of orbital debris — fragments from old satellites, rocket stages, and past collisions — travelling at speeds of around 7–8 km/s. At those velocities, even a fleck of paint can cause significant damage on impact.',
          'The ISS is tracked by space surveillance networks and can manoeuvre to avoid larger tracked objects. However, objects smaller than about 10 cm cannot be reliably tracked, and objects smaller than 1 cm are far too numerous to monitor individually.',
          'Spacesuit materials include multiple layers specifically designed to resist small impacts: woven Kevlar and Dacron layers in the outer torso provide protection against micro-particles. The suit cannot stop a large debris strike, but the probability of a direct hit during a 7-hour EVA is very low due to the small cross-sectional area of the suit.',
          'EVA scheduling considers debris risk. If a collision avoidance manoeuvre (CAM) is required near an EVA window, the EVA may be delayed or cancelled. Astronauts are also trained to report any unusual sounds or sensations that might indicate a small impact during a spacewalk.',
        ],
      },
      {
        id:    'sw-4',
        title: 'Emergency Re-entry Concepts',
        icon:  '🚨',
        body: [
          'Despite extensive preparation, emergencies can occur during EVAs. Common EVA emergency scenarios in training include sudden suit pressure loss, water intrusion into the helmet (a real incident occurred in 2013 during an ISS EVA), equipment failures, or a crewmember becoming incapacitated.',
          'The standard response to most EVA emergencies is to end the EVA and return to the airlock as quickly and safely as possible. The two-person EVA team means one crewmember can assist the other in an emergency. A solo crewmember emergency would trigger response from the crew inside the station.',
          'If a crewmember becomes untethered, the SAFER jet-pack provides a last-resort self-rescue capability. If a crewmember is incapacitated, the other EVA crewmember — or the station crew using the robotic arm — may attempt a rescue. All these scenarios are practised extensively in the Neutral Buoyancy Laboratory (NBL) water tank at NASA\'s Johnson Space Center.',
          '⚠️ Educational note: Actual EVA emergency procedures are detailed, context-specific, and updated regularly by NASA flight operations. This module provides conceptual awareness only.',
        ],
      },
    ],

    quiz: [
      {
        question: 'Why do astronauts spend several hours breathing pure oxygen before an EVA in the EMU suit?',
        options: [
          'To increase their lung capacity for the physical work ahead',
          'To purge dissolved nitrogen from the blood and prevent decompression sickness',
          'Because the EMU requires a pure-oxygen atmosphere at all times',
          'To test whether the oxygen supply system is functioning correctly',
        ],
        correctIndex: 1,
        explanation:
          'The EMU operates at a lower pressure than the ISS cabin. If an astronaut moved directly from cabin pressure to suit pressure, dissolved nitrogen in the blood could form bubbles — decompression sickness (the "bends"). Pre-breathing pure oxygen gradually removes nitrogen from tissues, making the pressure transition safe.',
      },
      {
        question: 'What is the correct tether protocol when moving from one anchor point to another during an EVA?',
        options: [
          'Release the first tether, move to the new point, then attach the second tether',
          'Attach the second tether before releasing the first — always stay attached to at least one',
          'Move without tethers between anchor points to avoid tangling',
          'Only use one tether at a time to keep equipment simple',
        ],
        correctIndex: 1,
        explanation:
          'The always-attached principle: a second tether must be secured at the new anchor point before the first is released. This ensures there is never a moment when the astronaut is not physically connected to the spacecraft. An untethered astronaut in space has no means of self-rescue except SAFER, which is a last resort.',
      },
      {
        question: 'What is the SAFER device, and when should it be used?',
        options: [
          'A backup oxygen supply worn on the chest — used whenever the PLSS runs low',
          'A tether reel that automatically retrieves a drifting astronaut — standard movement equipment',
          'A small jet-pack worn on the back — a last-resort emergency tool if an astronaut becomes untethered',
          'A thermal protection layer added over the suit for extreme cold — always worn on EVAs',
        ],
        correctIndex: 2,
        explanation:
          'SAFER (Simplified Aid for EVA Rescue) is a small propulsive backpack worn over the PLSS. It carries limited propellant intended for one recovery attempt. It is not used for routine manoeuvring — it is strictly a last-resort emergency device for a crewmember who has become untethered.',
      },
      {
        question: 'Which of the following best describes the debris environment in low Earth orbit during an EVA?',
        options: [
          'Only natural meteoroids pose a risk; human-made debris has largely decayed',
          'All debris larger than 1 mm is tracked and EVAs are only scheduled when the orbit is clear',
          'Millions of debris fragments exist at high speeds; objects smaller than 10 cm cannot be reliably tracked',
          'The ISS shields prevent any debris risk during EVAs',
        ],
        correctIndex: 2,
        explanation:
          'Low Earth orbit contains a large population of orbital debris. Space surveillance networks track objects roughly 10 cm and larger, but smaller fragments — still capable of causing suit damage at orbital velocities — are far too numerous to monitor individually. Suit materials include protective layers, and EVA scheduling considers known debris risks.',
      },
      {
        question: 'An EVA crewmember reports water entering their helmet during a spacewalk. What is the correct immediate priority?',
        options: [
          'Continue the task — helmet water is normal condensation and not dangerous',
          'Switch to the backup oxygen supply and continue at a reduced pace',
          'End the EVA and return to the airlock as quickly and safely as possible',
          'Remove the helmet to clear the water, then resume the EVA',
        ],
        correctIndex: 2,
        explanation:
          'Water in the helmet is a serious emergency — it can obstruct breathing and vision, and in sufficient quantity poses a drowning risk in microgravity. A real incident of this type occurred during a 2013 ISS EVA. The correct response is to end the EVA immediately and return to the airlock. Removing the helmet in the vacuum of space would be fatal.',
      },
    ],
  },
]

export default trainingModules
