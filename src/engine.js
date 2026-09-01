import { ingredients, starterFormula, pairingHypothesis } from './data.js';

const observations = [];

export function resetObservations() { observations.length = 0; }

export function inspectPairing() {
  return {
    formula: starterFormula,
    ingredients: starterFormula.parts.map(p => ({ ...p, ...ingredients[p.ingredientId] })),
    hypothesis: pairingHypothesis,
    provenance: 'scientific_reference + deterministic_pairing_rules'
  };
}

export function recordSensoryObservation(input) {
  if (!input?.descriptor || !input?.humanWords) throw new Error('descriptor and humanWords are required');
  const observation = {
    id: `obs-${String(observations.length + 1).padStart(3, '0')}`,
    formulaId: starterFormula.id,
    preparation: starterFormula.preparation,
    descriptor: input.descriptor,
    intensity: input.intensity ?? 'unspecified',
    phase: input.phase ?? 'overall',
    humanWords: input.humanWords,
    provenance: 'human_sensory_observation',
    epistemicStatus: 'individual_observation',
    universalClaim: false
  };
  observations.push(observation);
  return observation;
}

export function whatDidHumanTeach() {
  return {
    observations: observations.map(o => ({ ...o })),
    interpretationBoundary: 'These are attributed human observations, not facts about universal taste.'
  };
}

export function refinePairing() {
  const resinous = observations.find(o => o.descriptor.toLowerCase().includes('resin'));
  if (resinous && ['high', 'strong', 'too much'].includes(String(resinous.intensity).toLowerCase())) {
    return {
      proposal: 'Pull pine back from 1 part to 0.5 part and retaste.',
      reason: 'A human sensory observation reported high resinous intensity.',
      sourceObservationId: resinous.id,
      status: 'proposal_requires_human_tasting'
    };
  }
  return {
    proposal: 'Keep the current ratio for the next tasting and collect another sensory observation.',
    reason: 'There is not enough human sensory evidence to justify a deterministic adjustment yet.',
    status: 'proposal_requires_human_tasting'
  };
}
