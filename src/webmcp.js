import { inspectPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing } from './engine.js';

export function createBlendgineTools(onTool = () => {}) {
  const wrap = (name, fn) => async args => { const result = fn(args ?? {}); onTool({ name, args: args ?? {}, result }); return { content: [{ type: 'text', text: JSON.stringify(result) }] }; };
  const mode = { type:'string', enum:['menu','chaos'], description:'menu = restaurant-ready zero-proof pairing; chaos = playful unexpected pairing.' };
  return [
    { name:'blendgine_inspect_pairing', description:'Inspect a tea-and-food pairing experiment, its rationale, provenance, and the boundary between an agent hypothesis and human taste.', inputSchema:{type:'object',properties:{mode},additionalProperties:false}, annotations:{readOnlyHint:true}, execute:wrap('blendgine_inspect_pairing',inspectPairing) },
    { name:'blendgine_record_tasting', description:'Record what a human explicitly reports while tasting a specific tea with food. Never infer unreported sensory experience or universalize one person’s observation.', inputSchema:{type:'object',required:['descriptor','humanWords'],properties:{mode,descriptor:{type:'string'},intensity:{type:'string'},phase:{type:'string'},humanWords:{type:'string',description:'The human’s own words about the tea-food pairing.'}},additionalProperties:false}, execute:wrap('blendgine_record_tasting',recordSensoryObservation) },
    { name:'blendgine_what_did_i_teach_you', description:'Show the tea-food sensory observations humans explicitly contributed, including pairing context and provenance.', inputSchema:{type:'object',properties:{},additionalProperties:false}, annotations:{readOnlyHint:true}, execute:wrap('blendgine_what_did_i_teach_you',whatDidHumanTeach) },
    { name:'blendgine_refine_pairing', description:'Propose the next tea-food tasting experiment using the pairing hypothesis plus recorded human sensory evidence. The proposal still requires human tasting.', inputSchema:{type:'object',properties:{mode},additionalProperties:false}, annotations:{readOnlyHint:true}, execute:wrap('blendgine_refine_pairing',refinePairing) }
  ];
}
export function registerBlendgineWebMCP(onTool){ if(typeof document==='undefined'||!document.modelContext?.registerTool)return false; for(const tool of createBlendgineTools(onTool)){document.modelContext.registerTool({name:tool.name,description:tool.description,inputSchema:tool.inputSchema,annotations:tool.annotations,execute:tool.execute});} return true; }
