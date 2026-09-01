export const ingredients = {
  peppermint: {
    id: 'peppermint', name: 'Peppermint', botanical: 'Mentha × piperita',
    sensory: ['cooling', 'bright', 'minty'],
    compounds: ['menthol', 'menthone'],
    evidence: { type: 'scientific_reference', note: 'Menthol and menthone are characteristic volatile constituents used here as pairing signals, not as a claim that chemistry determines taste.' }
  },
  pine: {
    id: 'pine', name: 'Pine needle', botanical: 'Pinus spp.',
    sensory: ['resinous', 'citrusy', 'forest-like'],
    compounds: ['alpha-pinene', 'beta-pinene', 'limonene'],
    evidence: { type: 'scientific_reference', note: 'Terpene overlap provides a hypothesis signal. Species and preparation materially affect composition and flavor.' }
  },
  lemonBalm: {
    id: 'lemonBalm', name: 'Lemon balm', botanical: 'Melissa officinalis',
    sensory: ['lemony', 'soft', 'herbal'],
    compounds: ['citral', 'citronellal'],
    evidence: { type: 'scientific_reference', note: 'Citrus-associated volatile compounds provide a complementary hypothesis signal.' }
  }
};

export const starterFormula = {
  id: 'trial-001',
  name: 'Forest Spark',
  preparation: 'hot infusion · 8 min',
  parts: [
    { ingredientId: 'peppermint', parts: 2 },
    { ingredientId: 'pine', parts: 1 },
    { ingredientId: 'lemonBalm', parts: 1 }
  ]
};

export const pairingHypothesis = {
  id: 'hypothesis-001',
  formulaId: starterFormula.id,
  basis: [
    'Pine and peppermint offer overlapping terpene-family signals worth testing.',
    'Lemon balm provides a softer citrus/herbal bridge between cooling mint and resinous pine.'
  ],
  epistemicStatus: 'hypothesis',
  boundary: 'Chemical composition can motivate a tasting hypothesis; it cannot establish whether the blend tastes good.'
};
