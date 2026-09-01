import { inspectPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing } from './engine.js';

export function createBlendgineTools(onTool = () => {}) {
  const wrap = (name, fn) => async args => {
    const result = fn(args ?? {});
    onTool({ name, args: args ?? {}, result });
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  };

  return [
    {
      name: 'blendgine_inspect_pairing',
      description: 'Inspect the current formulation, ingredient evidence, pairing hypothesis, provenance, and the explicit boundary between chemical evidence and human taste.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: wrap('blendgine_inspect_pairing', inspectPairing)
    },
    {
      name: 'blendgine_record_tasting',
      description: 'Record what a human explicitly reports tasting. Never infer sensory experience the human did not provide and never promote one observation into a universal taste claim.',
      inputSchema: {
        type: 'object',
        required: ['descriptor', 'humanWords'],
        properties: {
          descriptor: { type: 'string', description: 'A concise descriptor grounded in the human’s explicit report.' },
          intensity: { type: 'string' },
          phase: { type: 'string', description: 'Where it appears, e.g. aroma, first sip, middle, finish, overall.' },
          humanWords: { type: 'string', description: 'The human’s own sensory wording.' }
        },
        additionalProperties: false
      },
      execute: wrap('blendgine_record_tasting', recordSensoryObservation)
    },
    {
      name: 'blendgine_what_did_i_teach_you',
      description: 'Show the sensory observations the human has explicitly contributed and their provenance boundaries.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: wrap('blendgine_what_did_i_teach_you', whatDidHumanTeach)
    },
    {
      name: 'blendgine_refine_pairing',
      description: 'Propose the next formulation adjustment using the pairing hypothesis plus recorded human sensory evidence. The proposal still requires another human tasting.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: wrap('blendgine_refine_pairing', refinePairing)
    }
  ];
}

export function registerBlendgineWebMCP(onTool) {
  if (typeof document === 'undefined' || !document.modelContext?.registerTool) return false;
  for (const tool of createBlendgineTools(onTool)) {
    document.modelContext.registerTool({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: tool.annotations,
      execute: tool.execute
    });
  }
  return true;
}
