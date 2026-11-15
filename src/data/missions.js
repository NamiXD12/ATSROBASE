/* ─── Mission data ─────────────────────────────────────────────────────────
   RISING TIDE — CO₂ Scrubber Failure aboard fictional station HELIX-1.

   DISCLAIMER (also shown on-screen at mission start):
   This is a fictional educational training simulation. Station HELIX-1,
   its crew, systems, and all procedures are invented for this exercise.
   The countdown timer and stability meter are gameplay abstractions —
   they do not represent real spacecraft safety limits or NASA timelines.
   Scientific content references NASA ECLSS educational materials
   (nasa.gov/reference/environmental-control-and-life-support-systems-eclss/)
   but is simplified and must not be treated as official procedure.

   Data shape:
     mission.acts = array of Act objects
     Act type 'briefing'  → has .scenes[]  (dialogue)
     Act type 'decision'  → has .situation, .context, .choices[]
─────────────────────────────────────────────────────────────────────────── */

const RISING_TIDE = {
  id:       'rising-tide',
  title:    'RISING TIDE',
  subtitle: 'CO₂ Scrubber Failure — Station HELIX-1',

  disclaimer:
    'FICTIONAL TRAINING SIMULATION — This scenario and all procedures are invented ' +
    'for educational purposes. The countdown and resource meters are gameplay ' +
    'abstractions only. Content references NASA ECLSS educational material but ' +
    'does not represent official NASA emergency protocols.',

  /* Initial resource values (gameplay abstractions) */
  initialResources: {
    co2Level:    0.6,   // % — rising; safe limit is 0.5%
    stability:   100,   // % — crew safety meter; drains on wrong choices
    timeLeft:    720,   // seconds — 12-minute simulation window
  },

  /* Penalty per incorrect decision */
  wrongChoicePenalty: {
    stability: -15,   // stability drops
    timeLeft:  -60,   // 60 s lost
  },

  /* ══════════════════════════════════════════════════════════════
     ACTS
  ══════════════════════════════════════════════════════════════ */
  acts: [

    /* ── ACT 1 — MISSION BRIEFING (dialogue) ─────────────────── */
    {
      id:    'act1',
      type:  'briefing',
      title: 'ACT 1 — MISSION BRIEFING',
      scenes: [
        {
          speaker:   'COMMANDER VASQUEZ',
          role:      'Station Commander',
          avatar:    'commander',
          text:
            'Flight Engineer, we have a Level-2 atmospheric advisory on HELIX-1. ' +
            'The primary Carbon Dioxide Removal Unit in Module B has gone offline. ' +
            'CO₂ is currently reading 0.6% and climbing.',
        },
        {
          speaker:   'COMMANDER VASQUEZ',
          role:      'Station Commander',
          avatar:    'commander',
          text:
            'I want to be clear: this is not an oxygen shortage. The O₂ supply is nominal ' +
            'at 20.9%. The danger is CO₂ accumulation. Above 1%, crew members will begin ' +
            'to experience headaches and reduced cognitive function.',
        },
        {
          speaker:   'DR. CHEN',
          role:      'Station Medical Officer',
          avatar:    'medic',
          text:
            'Medically speaking, CO₂ becomes acutely dangerous above 3–4%. At current rate ' +
            'of rise we have a window to act carefully and correctly. Rushing and making ' +
            'the wrong call will cost us more time than a measured approach.',
        },
        {
          speaker:   'YOU',
          role:      'Flight Engineer',
          avatar:    'player',
          text:
            'Understood. I\'ll start with a full diagnostic before touching any hardware. ' +
            'The backup LiOH canisters are in the emergency locker if we need them while ' +
            'I work on restoring the primary unit.',
        },
        {
          speaker:   'COMMANDER VASQUEZ',
          role:      'Station Commander',
          avatar:    'commander',
          text:
            'Good thinking. Station HELIX-1\'s Air Revitalization System uses molecular ' +
            'sieve beds — similar in concept to the CDRA described in NASA\'s ECLSS ' +
            'documentation. Your training covers this. Trust it. Begin your diagnosis.',
        },
      ],
    },

    /* ── ACT 2 — DIAGNOSIS (3 decisions) ─────────────────────── */
    {
      id:    'act2-d1',
      type:  'decision',
      actLabel: 'ACT 2 — DIAGNOSIS',
      decisionNumber: 1,
      totalInAct: 3,
      situation:
        'Station sensors show: O₂ = 20.9% (normal), CO₂ = 0.6% and rising, ' +
        'cabin pressure = 101.1 kPa (normal). The primary CO₂ removal unit shows ' +
        'a fault light. What is the correct characterisation of this emergency?',
      context:
        'Reading all available sensor data before acting is a core principle of ' +
        'spacecraft systems management. The numbers tell a specific story.',
      choices: [
        {
          text:        'The O₂ supply is failing. Open the backup oxygen tanks immediately.',
          isCorrect:   false,
          consequence: 'Incorrect. Opening O₂ tanks does nothing about CO₂ — and wastes limited reserve oxygen. The CO₂ unit fault light is still active. Time lost.',
          explanation:
            'O₂ reads 20.9% — perfectly normal. This is not a hypoxia scenario. ' +
            'Adding oxygen to a CO₂-rich atmosphere does not remove CO₂ molecules; ' +
            'it only changes the O₂ partial pressure. These are entirely separate systems. ' +
            '(Reference: NASA ECLSS — Oxygen Generation System and Air Revitalization System are distinct subsystems.)',
        },
        {
          text:        'The CO₂ removal system has failed. O₂ supply is unaffected and normal.',
          isCorrect:   true,
          consequence: 'Correct. Sensor data confirms normal O₂ and rising CO₂ — a classic CO₂ removal failure. Accurate diagnosis is the foundation of everything that follows.',
          explanation:
            'O₂ at 20.9% is normal. Rising CO₂ with stable pressure and normal O₂ ' +
            'is the signature of a CO₂ removal failure, not an O₂ shortage. ' +
            'NASA\'s ECLSS separates these functions: the Oxygen Generation System ' +
            'and the Air Revitalization System (which handles CO₂ removal) are ' +
            'independent hardware with independent failure modes.',
        },
        {
          text:        'Both O₂ supply and CO₂ removal have failed simultaneously.',
          isCorrect:   false,
          consequence: 'Incorrect. The data does not support a dual failure. Acting on a false assumption wastes critical diagnostic time.',
          explanation:
            'O₂ reads normal. Only CO₂ removal shows a fault. Assuming a dual ' +
            'failure without evidence is a diagnostic error that leads to unnecessary ' +
            'interventions. In any life-support fault, accurate reading of available ' +
            'sensor data must precede action.',
        },
      ],
    },

    {
      id:    'act2-d2',
      type:  'decision',
      actLabel: 'ACT 2 — DIAGNOSIS',
      decisionNumber: 2,
      totalInAct: 3,
      situation:
        'CO₂ is now 0.8% and rising. At the current rate it will reach 1.0% in ' +
        'approximately 60 minutes. Dr. Chen is monitoring the crew. How urgent is ' +
        'this situation and how should you respond?',
      context:
        'Understanding the actual danger timeline prevents both dangerous complacency ' +
        'and equally dangerous panic-driven errors.',
      choices: [
        {
          text:        'Extreme urgency — the crew will lose consciousness within minutes. Skip diagnosis and act immediately.',
          isCorrect:   false,
          consequence: 'Incorrect assessment. This conflates CO₂ toxicity with acute hypoxia. Rushing without diagnosis causes additional errors, consuming more time and resources.',
          explanation:
            'Rapid loss of consciousness is associated with acute oxygen deprivation ' +
            '(hypoxia), not CO₂ toxicity at these concentrations. CO₂ below 2% causes ' +
            'symptoms (headache, reduced cognition) but not rapid incapacitation. ' +
            'Earth\'s atmosphere is 0.04% CO₂; spacecraft limits target below ~0.5–0.7%. ' +
            'At 0.8–1.0% there is time to diagnose carefully.',
        },
        {
          text:        'Moderate urgency — symptoms begin around 1% CO₂, but there is time to diagnose properly before acting on the primary unit.',
          isCorrect:   true,
          consequence: 'Correct assessment. Measured, accurate action is more effective than rushed intervention. Beginning proper diagnosis now.',
          explanation:
            'CO₂ becomes acutely dangerous above ~3–4% (30,000–40,000 ppm). ' +
            'At 1%, crew members may experience mild headaches and slight reduction ' +
            'in concentration — uncomfortable but not immediately life-threatening. ' +
            'Acting on accurate information is always preferable to panic-driven decisions ' +
            'that may cause secondary failures.',
        },
        {
          text:        'No urgency — CO₂ at 1% is harmless. Continue monitoring without action.',
          isCorrect:   false,
          consequence: 'Incorrect. 1% CO₂ is above spacecraft health limits and will worsen without intervention. Failing to act allows CO₂ to continue rising.',
          explanation:
            'While 1% CO₂ is not immediately fatal, it is well above the target ' +
            'cabin limit of ~0.5–0.7%. Left unaddressed it will continue climbing. ' +
            'Each crew member exhales roughly 200g of CO₂ per hour at rest — without ' +
            'removal the problem only escalates. Complacency is as dangerous as panic.',
        },
      ],
    },

    {
      id:    'act2-d3',
      type:  'decision',
      actLabel: 'ACT 2 — DIAGNOSIS',
      decisionNumber: 3,
      totalInAct: 3,
      situation:
        'You inspect the primary CO₂ removal unit. The display shows "SIEVE BED SATURATION — ' +
        'REGEN CYCLE HALTED". The molecular sieve beds capture CO₂ from cabin air; ' +
        'a regeneration cycle heats the bed to release captured CO₂ overboard and reset it. ' +
        'What does this fault mean and what should you check first?',
      context:
        'NASA\'s ECLSS documentation describes how the Carbon Dioxide Removal Assembly ' +
        'uses zeolite molecular sieve beds that alternate between adsorption and ' +
        'regeneration. Understanding this tells you exactly where to look.',
      choices: [
        {
          text:        'The sieve bed is full of CO₂ and the regeneration cycle has stopped. Check whether the regeneration heater has tripped its thermal cutout.',
          isCorrect:   true,
          consequence: 'Correct. A saturated bed with a halted regen cycle points directly to the regeneration heater circuit. Checking the thermal cutout is the right first step.',
          explanation:
            'Molecular sieve beds (zeolite-based) capture CO₂ molecules during the ' +
            'adsorption phase. When saturated, the regen cycle heats the bed to ~200°C ' +
            'to release CO₂ overboard and reset it for the next cycle. If the regen ' +
            'cycle halts, the bed saturates and CO₂ scrubbing stops entirely. ' +
            'A tripped thermal cutout (a safety device that interrupts power when ' +
            'a heater overheats) is a common cause. ' +
            '(Reference: NASA ECLSS — Carbon Dioxide Removal Assembly)',
        },
        {
          text:        'The unit has run out of chemical reagent. Request an emergency resupply from Earth.',
          isCorrect:   false,
          consequence: 'Incorrect. Molecular sieve beds are regenerated, not consumed. Requesting resupply wastes time and misidentifies the problem.',
          explanation:
            'This answer confuses two different CO₂ scrubber technologies. ' +
            'Lithium hydroxide (LiOH) canisters are expendable — the chemical ' +
            'reaction LiOH + CO₂ → LiHCO₃ consumes the LiOH. ' +
            'Molecular sieve (zeolite) beds are regenerative — they are cleaned ' +
            'by heating and can be reused. HELIX-1\'s primary unit uses sieve beds; ' +
            'they do not "run out." Resupply is irrelevant here.',
        },
        {
          text:        'Shut everything down and restart station ventilation fans to circulate the air.',
          isCorrect:   false,
          consequence: 'Incorrect. Fans move air but do not remove CO₂ molecules. Shutting down systems without diagnosis risks creating additional faults.',
          explanation:
            'Ventilation fans improve air circulation and prevent CO₂ pockets ' +
            '(localised high-concentration areas) but they do not reduce the total ' +
            'amount of CO₂ in the cabin atmosphere. CO₂ concentration only decreases ' +
            'when molecules are physically removed by a scrubber or chemically bound ' +
            'by an absorbent. Shutting down systems without diagnosis is never the ' +
            'correct first action.',
        },
      ],
    },

    /* ── ACT 3 — REPAIR (3 decisions) ────────────────────────── */
    {
      id:    'act3-d1',
      type:  'decision',
      actLabel: 'ACT 3 — REPAIR',
      decisionNumber: 1,
      totalInAct: 3,
      situation:
        'CO₂ has reached 0.9%. The primary unit is offline. You have confirmed the ' +
        'regen heater has tripped. While you work on the primary unit, CO₂ continues ' +
        'to rise. What is the correct immediate action to stabilise the crew environment?',
      context:
        'Backup systems exist precisely for situations like this. Using them correctly ' +
        'buys time for primary system repair.',
      choices: [
        {
          text:        'Deploy the LiOH (lithium hydroxide) backup canisters from the emergency locker. They passively absorb CO₂ with no power required.',
          isCorrect:   true,
          consequence: 'Correct. LiOH canisters activate immediately with no power, begin absorbing CO₂, and stabilise the crew environment while you repair the primary unit.',
          explanation:
            'Lithium hydroxide reacts with CO₂ in a simple chemical reaction: ' +
            'LiOH + CO₂ → LiHCO₃. The reaction requires no power or moving parts, ' +
            'making LiOH canisters an ideal backup for a powered system failure. ' +
            'They are expendable (cannot be regenerated), so the goal remains to ' +
            'restore the primary sieve-bed unit. ' +
            '(Reference: NASA ECLSS — backup CO₂ removal methods)',
        },
        {
          text:        'Increase O₂ flow rate to maximum to dilute the CO₂.',
          isCorrect:   false,
          consequence: 'Incorrect. Adding oxygen does not remove CO₂. The CO₂ concentration continues to rise and O₂ reserves are depleted unnecessarily.',
          explanation:
            'This is a critical conceptual error. CO₂ and O₂ are measured as ' +
            'separate partial pressures. Increasing O₂ raises the O₂ partial ' +
            'pressure — it does not reduce the number of CO₂ molecules in the ' +
            'atmosphere. The CO₂ scrubbing capacity of the cabin is entirely ' +
            'determined by the removal system, not by O₂ levels.',
        },
        {
          text:        'Instruct the crew to hold their breath periodically to reduce CO₂ output.',
          isCorrect:   false,
          consequence: 'Incorrect. This is not a viable intervention and impairs crew cognitive function at exactly the wrong moment.',
          explanation:
            'Each crew member exhales ~200g of CO₂ per hour at rest — this cannot ' +
            'be meaningfully reduced by breath-holding and doing so impairs ' +
            'the cognitive performance needed to fix the actual problem. ' +
            'Reducing crew activity slightly may slow the rate of CO₂ rise ' +
            'marginally, but it cannot substitute for a functioning removal system ' +
            'and is not an accepted emergency intervention.',
        },
      ],
    },

    {
      id:    'act3-d2',
      type:  'decision',
      actLabel: 'ACT 3 — REPAIR',
      decisionNumber: 2,
      totalInAct: 3,
      situation:
        'LiOH canisters are deployed and CO₂ rise has slowed. You confirm the regen ' +
        'heater\'s thermal cutout has tripped. The cutout interrupted power to prevent ' +
        'the heater from overheating. What is the correct procedure to restart it?',
      context:
        'Thermal cutouts are safety devices. How you handle them under pressure ' +
        'determines whether you solve one problem or create another.',
      choices: [
        {
          text:        'Bypass the thermal cutout entirely to force the heater on as fast as possible.',
          isCorrect:   false,
          consequence: 'Incorrect. Bypassing a thermal safety device on a heater in a sealed spacecraft is a critical safety violation — potential overheating or fire hazard created.',
          explanation:
            'Thermal cutouts exist to prevent fire and equipment damage. ' +
            'Bypassing one without first determining why it tripped risks ' +
            'a repeat trip — or worse, a heater fire in an oxygen-enriched ' +
            'spacecraft atmosphere. This is an example of solving one emergency ' +
            'by creating a potentially worse one. Under pressure, removing ' +
            'safeguards is a known human factors error in aerospace operations.',
        },
        {
          text:        'Verify the heater temperature has returned to a safe range, reset the thermal cutout, then restart the regen cycle in manual mode.',
          isCorrect:   true,
          consequence: 'Correct. Confirming safe temperature before resetting prevents a repeat trip. Manual-mode restart gives you direct control of the regen cycle.',
          explanation:
            'The correct sequence: (1) wait for the heater to cool to within ' +
            'its safe operating range, (2) reset the thermal cutout, (3) restart ' +
            'in manual mode so you can monitor behaviour directly. This approach ' +
            'confirms the fault was transient (a brief overtemp) rather than ' +
            'persistent (a failed heating element), and maintains full safety ' +
            'margins throughout the repair.',
        },
        {
          text:        'Leave the primary unit offline permanently and rely on LiOH canisters indefinitely.',
          isCorrect:   false,
          consequence: 'Incorrect. LiOH canisters are limited and will eventually saturate. Relying on a backup as a permanent solution is not viable.',
          explanation:
            'LiOH canisters are expendable — once the LiOH is fully converted to ' +
            'LiHCO₃, the canister is spent. A finite number of backup canisters ' +
            'means this is a bridge, not a solution. Backup systems are designed ' +
            'to buy time while the primary system is restored, not to serve as ' +
            'permanent replacements. The primary unit must be repaired.',
        },
      ],
    },

    {
      id:    'act3-d3',
      type:  'decision',
      actLabel: 'ACT 3 — REPAIR',
      decisionNumber: 3,
      totalInAct: 3,
      situation:
        'The regen cycle has restarted in manual mode. CO₂ reads 0.7% and the ' +
        'trend appears to be downward. What is the correct final step before ' +
        'standing down the Level-2 atmospheric advisory?',
      context:
        'A single improving reading is not confirmation. Trend verification prevents ' +
        'premature stand-down — a known contributor to incident recurrence.',
      choices: [
        {
          text:        'Declare the situation resolved immediately — CO₂ is falling so the problem is fixed.',
          isCorrect:   false,
          consequence: 'Incorrect. One downward reading does not confirm system recovery. Premature stand-down risks missing a recurring fault.',
          explanation:
            'Premature stand-down is a documented human factors failure in aviation, ' +
            'medicine, and spaceflight. A single data point showing improvement does ' +
            'not confirm stable system recovery. The regen cycle may trip again, ' +
            'the sieve bed may re-saturate, or the CO₂ level may stabilise above ' +
            'the target threshold. Verification over time is essential.',
        },
        {
          text:        'Shut down the LiOH canisters immediately to conserve them, then monitor for 5 minutes.',
          isCorrect:   false,
          consequence: 'Incorrect. Removing backup support before confirming primary system stability is premature. If the primary unit trips again, the CO₂ rise will resume unchecked.',
          explanation:
            'LiOH backup canisters should remain active until the primary system ' +
            'is confirmed stable and CO₂ is verified below the safety threshold. ' +
            'Removing backup support at the first sign of improvement — before ' +
            'confirmation — leaves no safety margin if the primary fault recurs. ' +
            '5 minutes of monitoring with no backup is insufficient.',
        },
        {
          text:        'Monitor CO₂ readings continuously for 20 minutes to confirm a consistent downward trend before standing down the advisory.',
          isCorrect:   true,
          consequence: 'Correct. Sustained trend monitoring confirms recovery is stable. CO₂ drops to 0.4% — below the safety threshold. Advisory stood down. Mission complete.',
          explanation:
            'Trend verification over a sustained period — rather than reacting to ' +
            'a single reading — is the correct approach to confirming system recovery. ' +
            'During monitoring: CO₂ should fall steadily as the sieve bed cycles, ' +
            'the LiOH canisters provide a safety buffer, and any recurrence of the ' +
            'regen fault would be caught before CO₂ rises dangerously again. ' +
            'Standing down the advisory only when the target level is reached and ' +
            'confirmed stable is correct operational practice.',
        },
      ],
    },

  ], // end acts
}

const missions = [RISING_TIDE]

export default missions
