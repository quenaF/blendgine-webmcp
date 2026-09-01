import { findPairing, defaultPairingId, pairingCatalog } from './data.js';

const observations = [];
let activeExperiment = pairingCatalog.find(p => p.id === defaultPairingId) ?? pairingCatalog[0];

export function requestPairing(input = {}) {
  const anchorType = input.anchorType === 'tea' ? 'tea' : 'food';
  const mode = input.mode === 'chaos' ? 'chaos' : 'menu';
  activeExperiment = findPairing({ anchorType, anchor: input.anchor ?? '', mode });
  return inspectPairing();
}

export function setPairingMode(mode) {
  return requestPairing({ anchorType:'food', anchor:'', mode });
}

export function resetObservations() {
  observations.length = 0;
  activeExperiment = pairingCatalog.find(p => p.id === defaultPairingId) ?? pairingCatalog[0];
}

export function inspectPairing(input = {}) {
  if (input.anchorType || input.anchor || input.mode) {
    const mode = input.mode ?? activeExperiment.mode;
    const anchorType = input.anchorType ?? 'food';
    activeExperiment = findPairing({ anchorType, anchor: input.anchor ?? '', mode });
  }
  const experiment = activeExperiment;
  return {
    mode: experiment.mode,
    experiment,
    food: experiment.food,
    tea: experiment.tea,
    formula: { id: experiment.id, name: `${experiment.tea.name} × ${experiment.food.name}`, preparation: experiment.tea.preparation },
    hypothesis: experiment.hypothesis,
    provenance: 'verified_external_evidence_pending → Blendgine_hypothesis',
    sensoryAuthority: 'human',
    evidenceBoundary: 'The interaction model is complete. Compound-level scientific evidence will be attached only after the external records are verified and attributed.'
  };
}

export function recordSensoryObservation(input) {
  if (!input?.descriptor?.trim() || !input?.humanWords?.trim()) throw new Error('descriptor and humanWords are required');
  const experiment = activeExperiment;
  const observation = {
    id: `obs-${String(observations.length + 1).padStart(3, '0')}`,
    experimentId: experiment.id,
    mode: experiment.mode,
    pairing: `${experiment.tea.name} × ${experiment.food.name}`,
    food: experiment.food.name,
    tea: experiment.tea.name,
    preparation: experiment.tea.preparation,
    descriptor: input.descriptor.trim(),
    intensity: input.intensity ?? 'unspecified',
    phase: input.phase ?? 'overall pairing',
    humanWords: input.humanWords.trim(),
    provenance: 'human_sensory_observation',
    epistemicStatus: 'individual_observation',
    universalClaim: false
  };
  observations.push(observation);
  return observation;
}

export function whatDidHumanTeach() {
  return { observations: observations.map(o => ({ ...o })), interpretationBoundary: 'These are attributed human observations about specific tea-food pairings, not facts about universal taste.' };
}

export function refinePairing() {
  const experiment = activeExperiment;
  const relevant = [...observations].reverse().find(o => o.experimentId === experiment.id);
  if (!relevant) return { proposal: 'Taste the pairing first. Blendgine will not invent a sensory adjustment without a human observation.', reason: 'There is not enough human sensory evidence to justify an adjustment yet.', evidenceChain: ['pairing_hypothesis'], status: 'proposal_requires_human_tasting' };
  return { proposal: experiment.remix.proposal, reason: experiment.remix.reason, sourceObservationId: relevant.id, evidenceChain: ['pairing_hypothesis', relevant.id], status: 'proposal_requires_human_tasting' };
}
