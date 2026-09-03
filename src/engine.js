import { findPairing, normalizeAnchor } from './data.js';

const observations=[];
let activeExperiment=findPairing({anchorType:'food',anchor:'Mushroom Risotto',mode:'menu'});

export function requestPairing(input={}){
 const anchorType=input.anchorType==='tea'?'tea':'food';const mode=input.mode==='chaos'?'chaos':'menu';
 const rawAnchor=String(input.anchor??'');const normalizedAnchor=normalizeAnchor(rawAnchor,{anchorType});
 const found=findPairing({anchorType,anchor:rawAnchor,mode});
 if(!found)return {supported:false,anchorType,anchor:rawAnchor,normalizedAnchor,mode,reason:'Blendgine does not have enough evidence for that anchor yet. It will not silently substitute another item.'};
 activeExperiment=found;const result=inspectPairing();return {...result,request:{anchorType,anchor:rawAnchor,normalizedAnchor,interpretationNote:rawAnchor.trim().toLowerCase()!==normalizedAnchor?`Blendgine interpreted “${rawAnchor.trim()}” as “${normalizedAnchor}”.`:null}};
}
export function setPairingMode(mode){return requestPairing({anchorType:'food',anchor:'Mushroom Risotto',mode});}
export function resetObservations(){observations.length=0;activeExperiment=findPairing({anchorType:'food',anchor:'Mushroom Risotto',mode:'menu'});}

export function inspectPairing(input={}){
 if(input.anchorType||input.anchor||input.mode){const found=findPairing({anchorType:input.anchorType??'food',anchor:input.anchor??'',mode:input.mode??activeExperiment.mode});if(!found)return {supported:false,reason:'No evidence-backed candidate is available for that anchor yet.'};activeExperiment=found;}
 const experiment=activeExperiment;
 return {supported:true,mode:experiment.mode,experiment,food:experiment.food,tea:experiment.tea,formula:{id:experiment.id,name:`${experiment.tea.name} × ${experiment.food.name}`,preparation:experiment.tea.preparation},hypothesis:experiment.hypothesis,evidence:experiment.evidence,preparationContext:experiment.tea.processing,provenance:`${experiment.evidence.level}_external_evidence → generated_Blendgine_hypothesis`,sensoryAuthority:'human',evidenceBoundary:'The recommendation is generated from evidence-backed sensory profiles. It is a pairing hypothesis, not a predetermined recipe or universal taste claim.'};
}

export function recordSensoryObservation(input){
 if(!input?.descriptor?.trim()||!input?.humanWords?.trim())throw new Error('descriptor and humanWords are required');
 const experiment=activeExperiment;
 const suppliedPrep=typeof input.preparationContext==='string'&&input.preparationContext.trim()?{state:input.preparationContext.trim(),source:'expert_supplied',confidence:'high'}:input.preparationContext&&typeof input.preparationContext==='object'?input.preparationContext:experiment.tea.processing;
 const observation={id:`obs-${String(observations.length+1).padStart(3,'0')}`,experimentId:experiment.id,mode:experiment.mode,pairing:`${experiment.tea.name} × ${experiment.food.name}`,food:experiment.food.name,tea:experiment.tea.name,teaIngredients:experiment.tea.ingredients,preparation:experiment.tea.preparation,preparationContext:{...suppliedPrep},evidenceLevel:experiment.evidence.level,descriptor:input.descriptor.trim(),intensity:input.intensity??'unspecified',phase:input.phase??'overall pairing',humanWords:input.humanWords.trim(),provenance:'human_sensory_observation',epistemicStatus:'individual_observation',universalClaim:false};
 observations.push(observation);return observation;
}

export function whatDidHumanTeach(){return{observations:observations.map(o=>({...o})),interpretationBoundary:'These are attributed human observations about specific tea-food pairings and preparation contexts, not facts about universal taste.'};}
export function refinePairing(){const experiment=activeExperiment;const relevant=[...observations].reverse().find(o=>o.experimentId===experiment.id);if(!relevant)return{proposal:'Taste the pairing first. Blendgine will not invent a sensory adjustment without a human observation.',reason:'There is not enough human sensory evidence to justify an adjustment yet.',evidenceChain:['generated_pairing_hypothesis'],status:'proposal_requires_human_tasting'};return{proposal:experiment.remix.proposal,reason:experiment.remix.reason,sourceObservationId:relevant.id,evidenceChain:[`${experiment.evidence.level}_evidence`,'generated_pairing_hypothesis',relevant.id],preparationContext:relevant.preparationContext,status:'proposal_requires_human_tasting'};}
