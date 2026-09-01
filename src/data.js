export const ingredients = {
  peppermint: {
    id: 'peppermint', name: 'Peppermint', botanical: 'Mentha × piperita',
    sensory: ['cooling', 'bright', 'minty'],
    compounds: ['menthol', 'menthone', 'limonene'],
    evidence: { type: 'scientific_reference', note: 'Characteristic volatile constituents are used here as pairing signals, not as a claim that chemistry determines taste.' }
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
    'Pine and peppermint share limonene in this reference model, creating a concrete compound-overlap signal worth testing.',
    'Lemon balm contributes citrus-associated volatile signals that make it a candidate bridge in the formulation.'
  ],
  epistemicStatus: 'hypothesis',
  boundary: 'Chemical composition can motivate a tasting hypothesis; it cannot establish whether the blend tastes good.'
};
