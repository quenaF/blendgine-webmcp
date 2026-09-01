import { pairingExperiments, defaultMode } from './data.js';

const observations = [];
let activeMode = defaultMode;

export function setPairingMode(mode) {
  if (!pairingExperiments[mode]) throw new Error('Unknown pairing mode');
  activeMode = mode;
  return inspectPairing();
}
export function resetObservations() { observations.length = 0; activeMode = defaultMode; }

export function inspectPairing(input = {}) {
  const mode = input.mode && pairingExperiments[input.mode] ? input.mode : activeMode;
  const experiment = pairingExperiments[mode];
  return {
    mode,
    experiment,
    food: experiment.food,
    tea: experiment.tea,
    formula: { id: experiment.id, name: `${experiment.tea.name} × ${experiment.food.name}`, preparation: experiment.tea.preparation },
    ingredients: [],
    scientificEvidence: [],
    pairingSignals: [],
    hypothesis: experiment.hypothesis,
    provenance: 'pairing_reference_signals → Blendgine_hypothesis',
    sensoryAuthority: 'human',
    evidenceBoundary: 'Demo pairing rationale is a hypothesis layer. External compound-level records must be independently sourced before being represented as scientific evidence.'
  };
}

export function recordSensoryObservation(input) {
  if (!input?.descriptor?.trim() || !input?.humanWords?.trim()) throw new Error('descriptor and humanWords are required');
  const mode = input.mode && pairingExperiments[input.mode] ? input.mode : activeMode;
  const experiment = pairingExperiments[mode];
  const observation = {
    id: `obs-${String(observations.length + 1).padStart(3, '0')}`,
    experimentId: experiment.id,
    mode,
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

export function refinePairing(input = {}) {
  const mode = input.mode && pairingExperiments[input.mode] ? input.mode : activeMode;
  const experiment = pairingExperiments[mode];
  const relevant = [...observations].reverse().find(o => o.mode === mode);
  if (!relevant) return { proposal: 'Taste the pairing first. Blendgine will not invent a sensory adjustment without a human observation.', reason: 'There is not enough human sensory evidence to justify an adjustment yet.', evidenceChain: ['pairing_hypothesis'], status: 'proposal_requires_human_tasting' };
  return { proposal: experiment.remix.proposal, reason: experiment.remix.reason, sourceObservationId: relevant.id, evidenceChain: ['pairing_hypothesis', relevant.id], status: 'proposal_requires_human_tasting' };
}
