import test from 'node:test';
import assert from 'node:assert/strict';
import { requestPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing, resetObservations } from '../src/engine.js';
import { rankPairings } from '../src/data.js';
import { createBlendgineTools } from '../src/webmcp.js';

test.beforeEach(() => resetObservations());

test('food anchor is preserved while Blendgine generates an herbal tea candidate', () => {const result=requestPairing({anchorType:'food',anchor:'Mushroom Risotto',mode:'menu'});assert.equal(result.supported,true);assert.equal(result.food.name,'Mushroom Risotto');assert.ok(result.tea.name);assert.match(result.hypothesis.epistemicStatus,/hypothesis/);assert.match(result.evidenceBoundary,/generated/i);});

test('Fig Leaf keeps direct tea sensory evidence separate from the toast assumption',()=>{const result=requestPairing({anchorType:'tea',anchor:'Fig Leaf',mode:'menu'});assert.equal(result.tea.name,'Fig Leaf');assert.equal(result.tea.processing.state,'slightly toasted');assert.equal(result.evidence.level,'verified');assert.equal(result.evidence.records[0].doi,'10.3390/beverages11010016');assert.equal(result.evidence.records[0].plantPart,'leaf');assert.match(result.evidence.records[0].doesNotSupport,/toast-specific/i);});

test('Heal-All has plant-part-aware volatile and tea taste provenance',()=>{const result=requestPairing({anchorType:'tea',anchor:'Heal-All',mode:'menu'});assert.equal(result.tea.name,'Heal-All');assert.equal(result.evidence.level,'verified');assert.equal(result.evidence.records.length,2);assert.equal(result.evidence.records[0].doi,'10.13386/j.issn1002-0306.2019.13.029');assert.equal(result.evidence.records[1].pmid,'24946541');});

test('Chaos Lab keeps loblolly chemistry boundaries even when the generated food changes',()=>{const result=requestPairing({anchorType:'tea',anchor:'Loblolly Pine Needle · Spruce Tip · Lemon',mode:'chaos'});assert.equal(result.mode,'chaos');assert.equal(result.tea.name,'Loblolly Pine Needle · Spruce Tip · Lemon');assert.equal(result.evidence.records[0].doi,'10.1080/10412905.2006.9699378');assert.match(result.evidence.records[0].doesNotSupport,/spruce-tip/i);});

test('different teas do not all collapse to the same top food',()=>{const anchors=['Fig Leaf','Heal-All','Rose Hip · Hibiscus · Sumac','Loblolly Pine Needle · Spruce Tip · Lemon','Maypop Passionflower · Lemon Balm · Chamomile'];const winners=anchors.map(anchor=>rankPairings({anchorType:'tea',anchor,mode:'menu'})[0]?.food.name);assert.ok(new Set(winners).size>=3,`Expected at least 3 distinct winners, got ${winners.join(' | ')}`);});

test('score exposes breadth and generic-signal penalty for auditability',()=>{const ranked=rankPairings({anchorType:'tea',anchor:'Fig Leaf',mode:'menu'});assert.ok(ranked[0].breakdown);assert.ok(Array.isArray(ranked[0].breakdown.matchedTeaSignals));assert.equal(typeof ranked[0].breakdown.genericPenalty,'number');});

test('unknown anchors fail explicitly instead of substituting a recipe',()=>{const result=requestPairing({anchorType:'tea',anchor:'Mystery Moon Dust Tea',mode:'menu'});assert.equal(result.supported,false);assert.match(result.reason,/will not silently substitute/i);});

test('human tasting retains exact generated-pairing provenance and is not universalized',()=>{const pairing=requestPairing({anchorType:'tea',anchor:'Fig Leaf',mode:'menu'});const observation=recordSensoryObservation({descriptor:'balanced',intensity:'high',phase:'finish',humanWords:'The toasted leaf works here.'});assert.equal(observation.provenance,'human_sensory_observation');assert.equal(observation.universalClaim,false);assert.equal(observation.tea,'Fig Leaf');assert.equal(observation.food,pairing.food.name);assert.equal(observation.preparationContext.source,'assumed_default');});

test('what did I teach you returns only explicit human observations',()=>{requestPairing({anchorType:'food',anchor:'Honey Bun',mode:'chaos'});recordSensoryObservation({descriptor:'weirdly good',intensity:'medium',humanWords:'Girl… this tastes like a Christmas tree 🤣'});const learned=whatDidHumanTeach();assert.equal(learned.observations.length,1);assert.equal(learned.observations[0].descriptor,'weirdly good');assert.match(learned.interpretationBoundary,/not facts about universal taste/i);});

test('human observation can drive a traceable next proposal',()=>{requestPairing({anchorType:'food',anchor:'Mushroom Risotto',mode:'menu'});recordSensoryObservation({descriptor:'rich',intensity:'high',humanWords:'I want more lift after the creamy finish.'});const proposal=refinePairing();assert.equal(proposal.sourceObservationId,'obs-001');assert.equal(proposal.status,'proposal_requires_human_tasting');assert.ok(proposal.evidenceChain.includes('generated_pairing_hypothesis'));});

test('without human sensory evidence the engine does not invent an adjustment',()=>{requestPairing({anchorType:'food',anchor:'Mushroom Risotto',mode:'menu'});const proposal=refinePairing();assert.match(proposal.reason,/not enough human sensory evidence/i);});

test('WebMCP exposes pairing generation plus the collaboration loop',()=>{const names=createBlendgineTools().map(tool=>tool.name);assert.deepEqual(names,['blendgine_find_pairing','blendgine_inspect_pairing','blendgine_record_tasting','blendgine_what_did_i_teach_you','blendgine_refine_pairing']);});
