export const evidenceSources = {
  flavorDb: {
    id: 'flavordb2',
    name: 'FlavorDB2',
    url: 'https://cosylab.iiitd.edu.in/flavordb2/',
    role: 'external_scientific_reference',
    license: 'CC BY-NC-SA 3.0 (per FlavorDB FAQ)',
    usageBoundary: 'Reference evidence only in this challenge demo. Do not redistribute the FlavorDB dataset as Blendgine data.'
  }
};

export function scientificEvidenceFor(ingredient) {
  return {
    ingredientId: ingredient.id,
    compounds: [...ingredient.compounds],
    source: evidenceSources.flavorDb,
    epistemicStatus: 'reference_signal',
    interpretationBoundary: 'Compound information can motivate a pairing hypothesis. It does not establish perceived flavor, preference, safety, or universal compatibility.'
  };
}

export function pairingEvidence(a, b) {
  const overlap = a.compounds.filter(compound => b.compounds.includes(compound));
  return {
    ingredients: [a.id, b.id],
    sharedSignals: overlap,
    evidenceType: 'compound_overlap_hypothesis',
    source: evidenceSources.flavorDb,
    epistemicStatus: 'hypothesis_input',
    requiresHumanTasting: true
  };
}
