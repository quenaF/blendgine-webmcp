export const pairingExperiments = {
  menu: {
    id: 'menu-001',
    mode: 'Pairing Menu',
    modeEmoji: '🍽️',
    food: { name: 'Mushroom Risotto', detail: 'roasted mushrooms · parmesan · thyme', emoji: '🍄' },
    tea: { name: 'Roasted Hojicha', detail: 'toasty · nutty · low-smoke roast character', emoji: '🍵', preparation: 'hot · 175°F · 2 min' },
    hypothesis: {
      id: 'hypothesis-menu-001',
      basis: [
        'Roasted tea character is a plausible bridge to the browned, savory notes in the mushrooms.',
        'A dry, warm tea profile may contrast the risotto’s richness without adding alcohol or sweetness.'
      ],
      epistemicStatus: 'hypothesis',
      boundary: 'Pairing logic can motivate a tasting experiment; it cannot establish that this food-and-tea pairing tastes good.'
    },
    intent: 'A restaurant-ready, non-alcoholic pairing experiment.',
    defaultWords: 'The roast works with the mushrooms, but I want a little more lift after the creamy finish.',
    defaultDescriptor: 'roasted',
    remix: {
      trigger: ['heavy', 'rich', 'lift', 'creamy'],
      proposal: 'Keep the hojicha, serve it slightly lighter and add a bright aromatic accent for the next tasting.',
      reason: 'The human liked the roasted bridge but asked for more lift against the creamy finish.'
    }
  },
  chaos: {
    id: 'chaos-001',
    mode: 'Chaos Lab',
    modeEmoji: '🤪',
    food: { name: 'Honey Bun', detail: 'sticky glaze · cinnamon · soft pastry', emoji: '🍯' },
    tea: { name: 'Masala Chai', detail: 'spiced · tannic · aromatic', emoji: '🫖', preparation: 'strong · hot · splash of milk optional' },
    hypothesis: {
      id: 'hypothesis-chaos-001',
      basis: [
        'Warm spice and cinnamon-adjacent flavor cues make this a plausible echo pairing.',
        'Tea tannin and spice may keep the glazed pastry from reading as only sweet.'
      ],
      epistemicStatus: 'hypothesis',
      boundary: 'This is a playful pairing hypothesis, not proof that a honey bun and chai slap together.'
    },
    intent: 'A ridiculous-on-purpose pairing that still has a reason to be tested.',
    defaultWords: 'Wait… why is this actually good? The chai makes the honey bun taste less aggressively sweet.',
    defaultDescriptor: 'surprisingly balanced',
    remix: {
      trigger: ['sweet', 'balanced', 'good', 'spice'],
      proposal: 'Push the experiment: brew the chai a little stronger and retaste against a warm honey bun.',
      reason: 'The human reported that spice and tea structure balanced the pastry’s sweetness.'
    }
  }
};

export const defaultMode = 'menu';
