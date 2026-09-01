import test from 'node:test';
import assert from 'node:assert/strict';
import { requestPairing, inspectPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing, resetObservations } from '../src/engine.js';
import { createBlendgineTools } from '../src/webmcp.js';

test.beforeEach(() => resetObservations());

test('human can start with a food and receive a tea pairing', () => {
  const result = requestPairing({ anchorType:'food', anchor:'Mushroom Risotto', mode:'menu' });
  assert.equal(result.food.name, 'Mushroom Risotto');
  assert.equal(result.tea.name, 'Roasted Hojicha');
  assert.equal(result.hypothesis.epistemicStatus, 'hypothesis');
});

test('human can start with a tea and receive a food pairing', () => {
  const result = requestPairing({ anchorType:'tea', anchor:'Assam Black Tea', mode:'menu' });
  assert.equal(result.tea.name, 'Assam Black Tea');
  assert.equal(result.food.name, 'Dark Chocolate Torte');
});

test('chaos mode uses the same anchored interaction model', () => {
  const result = requestPairing({ anchorType:'food', anchor:'Honey Bun', mode:'chaos' });
  assert.equal(result.food.name, 'Honey Bun');
  assert.equal(result.tea.name, 'Masala Chai');
});

test('human tasting retains exact pairing provenance and is not universalized', () => {
  requestPairing({ anchorType:'tea', anchor:'Roasted Hojicha', mode:'menu' });
  const observation = recordSensoryObservation({ descriptor:'balanced', intensity:'high', phase:'finish', humanWords:'The roast works with the mushrooms.' });
  assert.equal(observation.provenance, 'human_sensory_observation');
  assert.equal(observation.universalClaim, false);
  assert.equal(observation.pairing, 'Roasted Hojicha × Mushroom Risotto');
});

test('what did I teach you returns only explicit human observations', () => {
  requestPairing({ anchorType:'food', anchor:'Honey Bun', mode:'chaos' });
  recordSensoryObservation({ descriptor:'weirdly good', intensity:'medium', humanWords:'This is weirdly good.' });
  const learned = whatDidHumanTeach();
  assert.equal(learned.observations.length, 1);
  assert.equal(learned.observations[0].descriptor, 'weirdly good');
  assert.match(learned.interpretationBoundary, /not facts about universal taste/i);
});

test('human observation can drive a traceable next pairing proposal', () => {
  requestPairing({ anchorType:'food', anchor:'Mushroom Risotto', mode:'menu' });
  recordSensoryObservation({ descriptor:'rich', intensity:'high', humanWords:'I want more lift after the creamy finish.' });
  const proposal = refinePairing();
  assert.equal(proposal.sourceObservationId, 'obs-001');
  assert.equal(proposal.status, 'proposal_requires_human_tasting');
});

test('without human sensory evidence the engine does not invent an adjustment', () => {
  requestPairing({ anchorType:'food', anchor:'Mushroom Risotto', mode:'menu' });
  const proposal = refinePairing();
  assert.match(proposal.reason, /not enough human sensory evidence/i);
});

test('WebMCP exposes anchored pairing plus the collaboration loop', () => {
  const names = createBlendgineTools().map(tool => tool.name);
  assert.deepEqual(names, ['blendgine_find_pairing','blendgine_inspect_pairing','blendgine_record_tasting','blendgine_what_did_i_teach_you','blendgine_refine_pairing']);
});
