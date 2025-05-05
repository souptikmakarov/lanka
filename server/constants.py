MAX_TEAM_SIZES = {
    "team1": 4,
    "team2": 4,
    "neutral": 1
}

MAX_HEALTH = 5

CARD_DEFINITIONS = [
    # --- Attack Cards ---
    {
        "id": "agniastra",
        "type": "attack",
        "subtype": "arrow",
        "damage": 1,
        "targets": 1,
        "self_damage": 0,
        "stackable": True,
    },
    {
        "id": "bramhastra",
        "type": "attack",
        "subtype": "trident",
        "damage": 1,
        "targets": "all_except_caster",
        "self_damage": 0,
        "stackable": False,
    },
    {
        "id": "gatiastra",
        "type": "attack",
        "subtype": "trident",
        "damage": 1,
        "targets": 1,
        "self_damage": 0,
        "stackable": False,
    },
    {
        "id": "nagastra",
        "type": "attack",
        "subtype": "arrow",
        "damage": 1,
        "targets": 1,
        "self_damage": 1,
        "stackable": False,
    },
    {
        "id": "shakti",
        "type": "special_attack",
        "subtype": "trident",
        "max_damage": 3,
        "targets": 1,
        "max_self_damage": 0,
        "stackable": False,
    },
    {
        "id": "vanar sena",
        "type": "attack",
        "subtype": "arrow",
        "damage": 2,
        "targets": 1,
        "self_damage": 0,
        "stackable": False,
    },
    {
        "id": "vayuastra",
        "type": "attack",
        "subtype": "arrow",
        "damage": 1,
        "targets": 2,
        "self_damage": 0,
        "stackable": False,
    },

    # --- Defense Cards ---
    {
        "id": "aina",
        "type": "defense",
        "blocks": ["arrow", "trident"],
    },
    {
        "id": "jatayu",
        "type": "defense",
        "blocks": ["arrow"],
    },

    # --- Health Cards ---
    {
        "id": "sanjeevani",
        "type": "health",
        "heal": 1,
        "revives": True,
        "targets": 1,
    },
    {
        "id": "shabari",
        "type": "health",
        "heal": 1,
        "targets": "all",
    },

    # --- Luck Cards ---
    {
        "id": "bramha",
        "type": "luck",
        "draw": 1,
        "targets": "all",
    },
    {
        "id": "vishnu",
        "type": "luck",
        "draw": 2,
        "targets": "self",
    },

    # --- Power Cards ---
    {
        "id": "laxman_rekha",
        "type": "power",
        "effect": "shield_all",
        "broken_by": "trident",
        "duration": "until_broken",
    },
    {
        "id": "vanvas",
        "type": "power",
        "effect": "silence",
        "duration": "1_turn",
    },

    # --- Theft Cards ---
    {
        "id": "garuda",
        "type": "theft",
        "action": "steal_effect_or_card",
    },
    {
        "id": "kaikeyi",
        "type": "theft",
        "action": "swap_hands",
    },
    {
        "id": "mareecha",
        "type": "theft",
        "action": "steal_random_card",
    },
    {
        "id": "vimana",
        "type": "theft",
        "action": "ask_for_specific_card",
    },
]

number_of_cards_per_type = {
    "agniastra": 5,
    "bramhastra": 3,
    "gatiastra": 5,
    "nagastra": 4,
    "shakti": 1,
    "vanar sena": 4,
    "vayuastra": 4,
    "aina": 3,
    "jatayu": 10,
    "sanjeevani": 6,
    "shabari": 2,
    "bramha": 3,
    "vishnu": 4,
    "laxman_rekha": 2,
    "vanvas": 2,
    "garuda": 5,
    "kaikeyi": 3,
    "mareecha": 7,
    "vimana": 4,
}