import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing, resetObservations } from '../src/engine.js';
import { createBlendgineTools } from '../src/webmcp.js';

test.beforeEach(() => resetObservations());

test('pairing starts as a hypothesis and admits AI cannot establish taste', () => {
  const result = inspectPairing();
  assert.equal(result.hypothesis.epistemicStatus, 'hypothesis');
  assert.match(result.hypothesis.boundary, /cannot establish whether the blend tastes good/i);
});

test('human tasting retains provenance and is not universalized', () => {
  const observation = recordSensoryObservation({
    descriptor: 'resinous', intensity: 'high', phase: 'finish', humanWords: 'The finish is way too piney.'
  });
  assert.equal(observation.provenance, 'human_sensory_observation');
  assert.equal(observation.universalClaim, false);
  assert.equal(observation.humanWords, 'The finish is way too piney.');
});

test('what did I teach you returns only explicit human observations', () => {
  recordSensoryObservation({ descriptor: 'cooling', intensity: 'medium', humanWords: 'The mint cools it down.' });
  const learned = whatDidHumanTeach();
  assert.equal(learned.observations.length, 1);
  assert.equal(learned.observations[0].descriptor, 'cooling');
  assert.match(learned.interpretationBoundary, /not facts about universal taste/i);
});

test('high resinous observation can drive a traceable refinement proposal', () => {
  recordSensoryObservation({ descriptor: 'resinous', intensity: 'high', phase: 'finish', humanWords: 'Too resinous at the end.' });
  const proposal = refinePairing();
  assert.match(proposal.proposal, /pine back/i);
  assert.equal(proposal.sourceObservationId, 'obs-001');
  assert.equal(proposal.status, 'proposal_requires_human_tasting');
});

test('without sufficient sensory evidence the engine does not invent an adjustment', () => {
  const proposal = refinePairing();
  assert.match(proposal.reason, /not enough human sensory evidence/i);
});

test('WebMCP exposes the four collaboration tools', () => {
  const names = createBlendgineTools().map(tool => tool.name);
  assert.deepEqual(names, [
    'blendgine_inspect_pairing',
    'blendgine_record_tasting',
    'blendgine_what_did_i_teach_you',
    'blendgine_refine_pairing'
  ]);
});
