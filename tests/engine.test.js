import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectPairing, setPairingMode, recordSensoryObservation, whatDidHumanTeach, refinePairing, resetObservations } from '../src/engine.js';
import { createBlendgineTools } from '../src/webmcp.js';

test.beforeEach(() => resetObservations());

test('restaurant pairing starts as a hypothesis and admits AI cannot establish taste', () => {
  const result = inspectPairing({ mode: 'menu' });
  assert.equal(result.hypothesis.epistemicStatus, 'hypothesis');
  assert.equal(result.food.name, 'Mushroom Risotto');
  assert.equal(result.tea.name, 'Roasted Hojicha');
  assert.match(result.hypothesis.boundary, /cannot establish/i);
});

test('chaos mode is a distinct tea-food experiment', () => {
  const result = setPairingMode('chaos');
  assert.equal(result.food.name, 'Honey Bun');
  assert.equal(result.tea.name, 'Masala Chai');
});

test('human tasting retains exact pairing provenance and is not universalized', () => {
  const observation = recordSensoryObservation({ mode:'menu', descriptor:'balanced', intensity:'high', phase:'finish', humanWords:'The roast works with the mushrooms.' });
  assert.equal(observation.provenance, 'human_sensory_observation');
  assert.equal(observation.universalClaim, false);
  assert.equal(observation.pairing, 'Roasted Hojicha × Mushroom Risotto');
});

test('what did I teach you returns only explicit human observations', () => {
  recordSensoryObservation({ mode:'chaos', descriptor:'weirdly good', intensity:'medium', humanWords:'This is weirdly good.' });
  const learned = whatDidHumanTeach();
  assert.equal(learned.observations.length, 1);
  assert.equal(learned.observations[0].descriptor, 'weirdly good');
  assert.match(learned.interpretationBoundary, /not facts about universal taste/i);
});

test('human observation can drive a traceable next pairing proposal', () => {
  recordSensoryObservation({ mode:'menu', descriptor:'rich', intensity:'high', humanWords:'I want more lift after the creamy finish.' });
  const proposal = refinePairing({ mode:'menu' });
  assert.equal(proposal.sourceObservationId, 'obs-001');
  assert.equal(proposal.status, 'proposal_requires_human_tasting');
});

test('without human sensory evidence the engine does not invent an adjustment', () => {
  const proposal = refinePairing({ mode:'menu' });
  assert.match(proposal.reason, /not enough human sensory evidence/i);
});

test('WebMCP exposes the four collaboration tools', () => {
  const names = createBlendgineTools().map(tool => tool.name);
  assert.deepEqual(names, ['blendgine_inspect_pairing','blendgine_record_tasting','blendgine_what_did_i_teach_you','blendgine_refine_pairing']);
});
