import random
from constants import *
import copy

# Game definitions
CHARACTERS = ["Rama", "Sita", "Laxman", "Hanuman", "Ravana", "Kumbhakarna", "Manthara", "Meghnad", "Vibhishana"]


# Generate the deck based on the definitions and number of cards per type
def generate_deck():
    print("Generating deck...")
    deck = []
    for card_def in CARD_DEFINITIONS:
        print("Card definition:", card_def)
        card_id = card_def["id"]
        if card_id in number_of_cards_per_type:
            count = number_of_cards_per_type[card_id]
            print(f"Adding {count} cards of type {card_id} to the deck")
            for _ in range(count):
                deck.append(card_def.copy())  # Use copy to avoid modifying the original definition
        print(f"Card {card_id} added to deck. Deck length: {len(deck)}")
    print("Deck generation complete. Total cards in deck:", len(deck))
    return deck

class GameState:
    def __init__(self):
        self.started = False
        self.current_turn = 0
        self.deck = generate_deck()
        random.shuffle(self.deck)  # Shuffle the deck after generating it
        print("Deck generated:", self.deck)
        self.discard_pile = []
        self.turn_order = []
        self.current_player = None
        self.current_card = None
        self.current_action = None
        self.current_target = None
        self.game_over = False
        self.players = {}

    def start_game(self, team1, team2, neutral):
        self.started = True
        self.current_turn = 0
        # Initialize the turn order with player ids alternating between teams T1P1, T2P1, T1P2, T2P2,... If there is a neutral player, add them at the middle
        # Alternate player IDs between team1 and team2
        turn_order = []
        max_length = max(len(team1), len(team2))
        for i in range(max_length):
            if i < len(team1):
                turn_order.append(team1[i]["sid"])
            if i < len(team2):
                turn_order.append(team2[i]["sid"])

        # If there is a neutral player, insert them in the middle
        if neutral:
            neutral_player = neutral[0]["sid"]  # Assuming only one neutral player
            middle_index = len(turn_order) // 2
            turn_order.insert(middle_index, neutral_player)

        self.turn_order = turn_order
        self.current_player = self.turn_order[self.current_turn]
        self.current_card = None
        self.current_action = None
        self.current_target = None
        self.game_over = False
        # Create a dictionary to hold player information
        # Each player will have a dictionary with their name, health, applied_power_effects, and cards
        # Initialize player health and effects
        self.players = {
            player["sid"]: {
                "name": player["name"],
                "health": MAX_HEALTH,
                "applied_power_effects": [],
                "cards": [],
                "team": "team1" if player["sid"] in [p["sid"] for p in team1] else "team2" if player["sid"] in [p["sid"] for p in team2] else "neutral",
            }
            for player in team1 + team2 + neutral
        }
        # Deal cards to players
        for player_sid in self.players.keys():
            self.players[player_sid]["cards"] = [self.deck.pop() for _ in range(5)]
        
    def pull_card_from_deck(self, player_sid):
        if self.deck:
            card = self.deck.pop()
            self.players[player_sid]["cards"].append(card)
            if len(self.deck) < 5:
                to_add = copy.deepcopy(self.discard_pile[5:])
                random.shuffle(to_add)
                self.deck.extend(to_add)
                self.discard_pile = self.discard_pile[:5]
            return card
        else:
            return None
        
    def discard_card(self, player_sid, card):
        if card in self.players[player_sid]["cards"]:
            self.players[player_sid]["cards"].remove(card)
            self.discard_pile.append(card)
            return True
        return False