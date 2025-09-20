import random
import time
from enum import Enum, auto

class State(Enum):
    """Represents the different states of being."""
    AWAKE = auto()
    ASLEEP = auto()
    HAPPY = auto()
    SAD = auto()
    WORKING = auto()
    LEARNING = auto()
    LOVING = auto()

class Life:
    """A class to represent the concept of a life journey."""

    def __init__(self, name, parents=None):
        self.name = name
        self.parents = parents if parents else "the universe"
        self.is_alive = True
        self.age = 0
        self.experiences = []
        self.state = State.AWAKE
        self.children = []
        print(f"A new life, {self.name}, begins, born from {self.parents}.")

    def live_a_day(self):
        """Simulates a single day of life."""
        if not self.is_alive:
            print(f"{self.name}'s time has passed.")
            return

        # Life is a mix of different states
        self.state = random.choice(list(State))
        experience = f"Day {self.age * 365}: Felt {self.state.name.lower()}."
        self.experiences.append(experience)
        print(experience)

        # Random chance for a significant life event
        if random.random() < 0.05: # 5% chance of a major event
            self._have_major_life_event()

        time.sleep(0.01) # Each day passes in a moment

    def grow_older(self, years=1):
        """Age by a number of years, simulating the passage of time."""
        for _ in range(years * 365):
            if self.is_alive:
                self.live_a_day()
        self.age += years
        print(f"\n{self.name} is now {self.age} years old.\n")

    def _have_major_life_event(self):
        """Represents significant, unpredictable moments."""
        event = random.choice(["found a calling", "faced a great challenge", "fell in love", "created something beautiful"])
        experience = f"A major event occurred: {self.name} {event}."
        self.experiences.append(experience)
        print(f"✨ {experience} ✨")
        if event == "fell in love" and random.random() > 0.5:
            self.reproduce()

    def reproduce(self):
        """The ability to create new life."""
        if self.age > 18 and self.age < 50:
            child_name = f"Child of {self.name}"
            child = Life(name=child_name, parents=self.name)
            self.children.append(child)
            return child
        return None

    def reflect(self):
        """Look back on the journey so far."""
        print(f"\n{self.name} reflects on a life of {len(self.experiences)} moments.")
        if self.children:
            print(f"Legacy continues through: {[child.name for child in self.children]}.")

    def end(self):
        """The end of this life journey."""
        self.is_alive = False
        self.reflect()
        print(f"All journeys end. {self.name} is now at peace.")
        return self.children # The legacy left behind

# --- Let's simulate a life ---
if __name__ == "__main__":
    # A life begins
    first_life = Life("Genesis")

    # It grows and experiences time
    first_life.grow_older(25)

    # It may create new life, which then starts its own journey
    new_generation = first_life.children
    if new_generation:
        print("\n--- A new generation begins ---")
        for child in new_generation:
            child.grow_older(10)

    # Time continues for the first life
    first_life.grow_older(55)

    # The journey concludes
    legacy = first_life.end()

    print("\nLife goes on...")
