// Shared data for the three Agnihotra Wellness Retreat formats.
// Used by the retreats listing page (cards) and the per-format detail pages.

export interface RetreatJourneyPhase {
    day: string;
    title: string;
    description: string;
    highlights: string[];
}

export interface RetreatTherapy {
    name: string;
    description: string;
}

export interface RetreatFormat {
    slug: string;
    title: string;
    tagline: string;
    focus: string;
    bestFor: string;
    includes: string[];
    linkText: string;
    accent: string;
    duration: string;
    groupSize: string;
    intensity: string;
    overview: string[];
    journey: RetreatJourneyPhase[];
    therapies: RetreatTherapy[];
    outcomes: string[];
    idealIf: string[];
    goodToKnow: string[];
}

export const retreatFormats: RetreatFormat[] = [
    {
        slug: "3-day-pain-stress-reset",
        title: "3-Day Pain & Stress Reset",
        tagline: "A short, precise immersion that calms the nervous system and restores your natural rhythm.",
        focus: "Immediate relief, nervous system calming, and rhythm correction.",
        bestFor: "First-time participants, working professionals, stress and pain management.",
        includes: [
            "Daily Agnihotra",
            "Bhasma Snān™, Lepam™, Pāna™",
            "Agni Jal™ support",
            "Restorative routines"
        ],
        linkText: "Explore 3-Day Retreat",
        accent: "var(--color-terracotta)",
        duration: "3 days · 2 nights",
        groupSize: "8–12 participants",
        intensity: "Gentle — ideal first immersion",
        overview: [
            "The 3-Day Pain & Stress Reset is designed for people who cannot step away from life for long — but urgently need to step out of its pace. In three carefully structured days, the retreat interrupts the stress cycle, quiets the nervous system, and re-establishes the daily rhythm the body heals by.",
            "Each day is anchored by sunrise and sunset Agnihotra — the sacred fire ceremony at the heart of Agnihotra Wellness Therapy™. Around this anchor, ash-based therapies, Agni Jal™ support, and restorative routines work together to release accumulated tension and physical pain.",
            "Nothing about this retreat is rushed or extreme. The aim is precision: the minimum effective immersion that lets you return to your life calmer, lighter, and carrying a rhythm you can keep."
        ],
        journey: [
            {
                day: "Day 1",
                title: "Arrival & Attunement",
                description: "You arrive, slow down, and attune to the rhythm of the fire. A personal consultation maps your stress patterns and pain points so therapies can be tailored from the first evening.",
                highlights: [
                    "Welcome and personal wellness consultation",
                    "Introduction to Agnihotra and the Bhasma Ritual System™",
                    "First sunset Agnihotra ceremony",
                    "Calming evening routine and early rest"
                ]
            },
            {
                day: "Day 2",
                title: "The Deep Reset",
                description: "The core therapeutic day. Sunrise fire, full ash therapies, and guided rest cycles work on the nervous system, muscular tension, and sleep quality.",
                highlights: [
                    "Sunrise Agnihotra and guided breathwork",
                    "Bhasma Snān™ (therapeutic ash bath)",
                    "Lepam™ application on pain and tension points",
                    "Pāna™ and Agni Jal™ internal support",
                    "Restorative afternoon and sunset ceremony"
                ]
            },
            {
                day: "Day 3",
                title: "Integration & Return",
                description: "The final morning consolidates the reset and prepares you to carry it home. You leave with a simple, personalised daily routine — not just a memory of relief.",
                highlights: [
                    "Final sunrise Agnihotra",
                    "Closing ash therapy session",
                    "Personalised home routine and product guidance",
                    "Integration circle and departure"
                ]
            }
        ],
        therapies: [
            {
                name: "Agnihotra",
                description: "Sunrise and sunset fire ceremonies performed at the exact biorhythmic moments, anchoring each day and calming the nervous system."
            },
            {
                name: "Bhasma Snān™",
                description: "A therapeutic ash bath that draws out tension and supports the skin and circulation."
            },
            {
                name: "Lepam™",
                description: "Targeted application of prepared ash paste on areas of pain, stiffness, and stress accumulation."
            },
            {
                name: "Pāna™ & Agni Jal™",
                description: "Gentle internal support — prepared ash and fire-charged water — taken under supervision to support the reset from within."
            }
        ],
        outcomes: [
            "Noticeably calmer nervous system and deeper sleep",
            "Relief from acute muscular pain and tension",
            "A corrected daily rhythm anchored to sunrise and sunset",
            "A simple personalised routine to continue at home",
            "First-hand understanding of the Bhasma Ritual System™"
        ],
        idealIf: [
            "You are experiencing work stress, burnout symptoms, or persistent tension",
            "You have limited time but need a genuine reset, not just a break",
            "You are new to Agnihotra Wellness and want a guided first immersion",
            "You struggle with sleep or an irregular daily rhythm"
        ],
        goodToKnow: [
            "All therapies are guided and supervised — no prior experience is needed.",
            "Days begin before sunrise; early rest is part of the protocol.",
            "Simple sattvic meals aligned with the therapy are included.",
            "Share any medical conditions during the consultation so protocols can be adapted safely."
        ]
    },
    {
        slug: "7-day-detox-metabolic-reset",
        title: "7-Day Detox & Metabolic Reset",
        tagline: "A full week of internal cleansing that rebuilds digestion, energy, and metabolic balance.",
        focus: "Internal cleansing, digestive balance, inflammation reduction, and energy restoration.",
        bestFor: "Metabolic issues, chronic fatigue, digestive disorders, toxin overload.",
        includes: [
            "Deeper Bhasma therapies",
            "Structured Agni-aligned diet",
            "Extended internal support",
            "Lifestyle rhythm recalibration"
        ],
        linkText: "Explore 7-Day Retreat",
        accent: "var(--color-ochre)",
        duration: "7 days · 6 nights",
        groupSize: "8–12 participants",
        intensity: "Moderate — structured cleansing week",
        overview: [
            "The 7-Day Detox & Metabolic Reset goes beyond surface relief. A full week gives the body enough time to move through a complete cleansing arc — preparation, deep cleanse, and rebuild — without shocking the system.",
            "The retreat combines deeper Bhasma therapies with a structured Agni-aligned diet: meals timed and composed to strengthen digestive fire rather than burden it. Extended Pāna™ and Agni Jal™ protocols support the internal cleanse throughout the week.",
            "By the final days the focus shifts from cleansing to recalibration — rebuilding steady energy, balanced digestion, and a sustainable daily rhythm you take home with you."
        ],
        journey: [
            {
                day: "Days 1–2",
                title: "Preparation & Attunement",
                description: "The body is prepared gently. Lighter meals, first ash therapies, and the twice-daily fire rhythm ease the system toward the deeper cleanse ahead.",
                highlights: [
                    "Personal consultation and metabolic assessment",
                    "Transition to the Agni-aligned diet",
                    "Introductory Bhasma Snān™ and Lepam™ sessions",
                    "Sunrise and sunset Agnihotra established as the daily anchor"
                ]
            },
            {
                day: "Days 3–5",
                title: "The Deep Cleanse",
                description: "The core of the week. Deeper ash therapies and extended internal protocols support the body's own cleansing processes while rest cycles protect your energy.",
                highlights: [
                    "Deeper Bhasma therapies tailored to your constitution",
                    "Extended Pāna™ and Agni Jal™ internal protocols",
                    "Structured cleansing meals and digestive support",
                    "Guided rest, gentle movement, and daily supervision"
                ]
            },
            {
                day: "Days 6–7",
                title: "Rebuild & Rhythm",
                description: "Cleansing gives way to rebuilding. Nourishing meals return in a deliberate sequence, and the focus turns to the routine that will hold your results at home.",
                highlights: [
                    "Rebuilding diet sequence to consolidate digestive strength",
                    "Closing therapy sessions and final assessment",
                    "Personalised lifestyle and rhythm plan",
                    "Integration circle and final sunrise Agnihotra"
                ]
            }
        ],
        therapies: [
            {
                name: "Agnihotra",
                description: "Twice-daily fire ceremonies that structure the entire week and support the body's natural cleansing clock."
            },
            {
                name: "Deeper Bhasma Therapies",
                description: "Extended Bhasma Snān™ and Lepam™ protocols adapted day by day to the stage of the cleanse."
            },
            {
                name: "Agni-Aligned Diet",
                description: "A structured meal plan — timed to digestive fire — that carries the body through preparation, cleanse, and rebuild."
            },
            {
                name: "Extended Pāna™ & Agni Jal™",
                description: "Week-long internal support protocols, supervised and adjusted to your response."
            }
        ],
        outcomes: [
            "Lighter digestion and reduced bloating and inflammation",
            "Steadier energy through the day, without afternoon crashes",
            "A recalibrated relationship with food timing and quantity",
            "Improved sleep and a stable sunrise-to-sunset rhythm",
            "A personalised diet and lifestyle plan for the months ahead"
        ],
        idealIf: [
            "You experience chronic fatigue, sluggish digestion, or frequent bloating",
            "You feel the accumulated effect of years of irregular eating and stress",
            "You have tried short detoxes that didn't last and want a supervised, complete arc",
            "You want to rebuild energy rather than just restrict intake"
        ],
        goodToKnow: [
            "The diet is structured but never punishing — cleansing here works with the body, not against it.",
            "Daily supervision means protocols are adjusted to how you respond.",
            "Caffeine and heavy foods are tapered in the first days; arriving lightly helps.",
            "Share medical conditions and medications in advance so the protocol can be adapted safely."
        ]
    },
    {
        slug: "15-day-advanced-rejuvenation",
        title: "15-Day Advanced Rejuvenation",
        tagline: "The complete immersion — deep regeneration for long-standing imbalance and profound renewal.",
        focus: "Long-standing imbalance, deep regeneration, and systemic restoration.",
        bestFor: "Chronic conditions, long-term stress, and those seeking profound renewal.",
        includes: [
            "Full Agnihotra Wellness immersion",
            "Advanced ash therapies",
            "Extended Agni Jal™ protocols",
            "Long-term lifestyle guidance"
        ],
        linkText: "Explore 15-Day Retreat",
        accent: "var(--color-forest)",
        duration: "15 days · 14 nights",
        groupSize: "8–12 participants",
        intensity: "Deep — complete systemic immersion",
        overview: [
            "Some imbalances were not built in a week, and they will not resolve in one. The 15-Day Advanced Rejuvenation is the complete expression of Agnihotra Wellness Therapy™ — enough time for the body to move through cleansing, deep regeneration, and true restoration in one continuous arc.",
            "The first days establish foundation: rhythm, diet, and the opening ash therapies. The long middle phase is where this retreat differs from anything shorter — advanced ash therapies and extended Agni Jal™ protocols work systemically, layer by layer, under daily supervision.",
            "The final phase is devoted to restoration and integration. You do not leave with a list of instructions; you leave with a rhythm already lived for two weeks, long-term lifestyle guidance, and continued support for the months that follow."
        ],
        journey: [
            {
                day: "Days 1–3",
                title: "Foundation",
                description: "Arrival, assessment, and attunement. The daily fire rhythm, Agni-aligned diet, and opening therapies prepare body and mind for the depth ahead.",
                highlights: [
                    "In-depth personal consultation and health mapping",
                    "Establishing the sunrise–sunset Agnihotra rhythm",
                    "Opening Bhasma Snān™ and Lepam™ sessions",
                    "Gradual transition into the full Agni-aligned diet"
                ]
            },
            {
                day: "Days 4–10",
                title: "Deep Regeneration",
                description: "The heart of the retreat. A full week of advanced ash therapies and extended internal protocols addresses long-standing imbalance at a systemic level.",
                highlights: [
                    "Advanced ash therapies sequenced to your constitution",
                    "Extended Agni Jal™ and Pāna™ protocols",
                    "Daily supervision with protocol adjustments",
                    "Deep rest cycles, gentle movement, and guided practices"
                ]
            },
            {
                day: "Days 11–15",
                title: "Restoration & Integration",
                description: "Regeneration settles into restoration. Strength and routine are rebuilt deliberately, and the final days are devoted to the life you return to.",
                highlights: [
                    "Rebuilding diet and strengthening routines",
                    "Closing therapy sessions and final assessment",
                    "Long-term lifestyle plan and home ritual training",
                    "Integration circle and closing fire ceremony"
                ]
            }
        ],
        therapies: [
            {
                name: "Full Agnihotra Immersion",
                description: "Thirty consecutive fire ceremonies — every sunrise and sunset for fifteen days — the deepest rhythm correction the therapy offers."
            },
            {
                name: "Advanced Ash Therapies",
                description: "The complete Bhasma Ritual System™, including protocols reserved for extended stays, sequenced across the full arc."
            },
            {
                name: "Extended Agni Jal™ Protocols",
                description: "Long-form internal protocols that shorter retreats cannot accommodate, supervised and adjusted daily."
            },
            {
                name: "Long-Term Lifestyle Guidance",
                description: "A personally designed rhythm, diet, and home practice plan — plus follow-up support after you leave."
            }
        ],
        outcomes: [
            "Systemic restoration addressing long-standing imbalance",
            "Deep, stable energy rebuilt over the full arc of the retreat",
            "A lived daily rhythm — practised for fifteen days, not just prescribed",
            "Training to continue home Agnihotra practice independently",
            "A long-term lifestyle plan with post-retreat follow-up support"
        ],
        idealIf: [
            "You live with chronic conditions or imbalance that shorter interventions haven't touched",
            "Years of stress have accumulated into persistent fatigue or systemic symptoms",
            "You are at a turning point and ready to invest real time in renewal",
            "You want to learn the practice deeply enough to carry it for life"
        ],
        goodToKnow: [
            "This retreat asks for a genuine commitment — fifteen days fully present on site.",
            "A detailed health consultation is required before confirmation so protocols can be designed safely.",
            "The pace is deep but never harsh; rest is treated as therapy, not downtime.",
            "Post-retreat follow-up support is included to protect your results."
        ]
    }
];

export function getRetreatFormat(slug: string): RetreatFormat | undefined {
    return retreatFormats.find((format) => format.slug === slug);
}
