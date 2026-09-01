import React, { useEffect, useMemo, useState } from 'react';
import { inspectPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing, resetObservations } from './engine.js';
import { registerBlendgineWebMCP } from './webmcp.js';

const tones = {
  playful: {
    opener: 'AI brought the chemistry. You brought the taste buds. Let’s make something delicious. ✨',
    prompt: 'Okayyy… what did your mouth say?',
    logged: 'Taste note caught ✨ That is your experience—not a universal truth.'
  },
  technical: {
    opener: 'The formulation is based on volatile-compound overlap and complementary aromatic signals. Sensory validation still requires a human taster.',
    prompt: 'Describe the sensory result.',
    logged: 'Observation recorded with formulation and provenance context.'
  }
};

const reactionOptions = [
  ['🌲', 'resinous', 'Forest'],
  ['🌿', 'herbal', 'Herbal'],
  ['🍋', 'citrusy', 'Bright'],
  ['✨', 'balanced', 'Just right'],
  ['😵‍💫', 'overpowering', 'Too much']
];

export default function App() {
  const pairing = useMemo(() => inspectPairing(), []);
  const [tone, setTone] = useState('playful');
  const [descriptor, setDescriptor] = useState('resinous');
  const [intensity, setIntensity] = useState('high');
  const [phase, setPhase] = useState('finish');
  const [humanWords, setHumanWords] = useState('Girl… this tastes like a Christmas tree.');
  const [observations, setObservations] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [activity, setActivity] = useState([]);
  const [webmcpReady, setWebmcpReady] = useState(false);

  useEffect(() => {
    const ready = registerBlendgineWebMCP(event => setActivity(current => [event, ...current].slice(0, 8)));
    setWebmcpReady(ready);
  }, []);

  function submitTaste() {
    const observation = recordSensoryObservation({ descriptor, intensity, phase, humanWords });
    setObservations(whatDidHumanTeach().observations);
    setActivity(current => [{ name: 'human_tasting', result: observation }, ...current].slice(0, 8));
  }

  function refine() {
    const next = refinePairing();
    setProposal(next);
    setActivity(current => [{ name: 'refinement_proposal', result: next }, ...current].slice(0, 8));
  }

  function reset() {
    resetObservations(); setObservations([]); setProposal(null); setActivity([]);
  }

  const copy = tones[tone];

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">✦ BLENDGINE TASTE LAB · WEBMCP</div>
          <h1>AI can know flavor.<br /><em>You</em> know taste.</h1>
          <p className="lede">{copy.opener}</p>
          <div className="hero-stickers"><span>🧪 evidence</span><b>+</b><span>👅 human taste</span><b>=</b><span>💡 better pairing</span></div>
        </div>
        <div className={`status ${webmcpReady ? 'ready' : ''}`}><i />{webmcpReady ? 'Agent connected' : 'WebMCP needs a supported browser'}</div>
      </section>

      <section className="experiment-banner"><span>EXPERIMENT 001</span><strong>{pairing.formula.name}</strong><span className="spark">✦ taste → teach → tweak ✦</span></section>

      <section className="grid">
        <article className="card formula-card">
          <div className="card-head"><div><span className="mini">🧪 AI'S HYPOTHESIS</span><h2>Why these might vibe</h2></div><span className="pill">☕ {pairing.formula.preparation}</span></div>
          <div className="ingredients">
            {pairing.ingredients.map((item, i) => <div className="ingredient" key={item.id}><div className="ingredient-icon">{['🌿','🌲','🍋'][i] || '✦'}</div><div className="ingredient-copy"><strong>{item.name}</strong><small>{item.botanical}</small></div><span>{item.parts}×</span></div>)}
          </div>
          <div className="science-box"><span className="mini">🔬 SCIENCE UNDER THE HOOD</span>{pairing.hypothesis.basis.map(reason => <p key={reason}>{reason}</p>)}<div className="boundary">⚠️ Chemistry predicts. It does not taste.</div></div>
        </article>

        <article className="card taste-card">
          <div className="card-head"><div><span className="mini">👅 HUMAN INTELLIGENCE</span><h2>{copy.prompt}</h2></div><div className="tone-toggle"><button className={tone === 'playful' ? 'active' : ''} onClick={() => setTone('playful')}>✨ Play</button><button className={tone === 'technical' ? 'active' : ''} onClick={() => setTone('technical')}>🔬 Nerd</button></div></div>
          <div className="reaction-row">{reactionOptions.map(([emoji, value, label]) => <button key={value} className={descriptor === value ? 'selected' : ''} onClick={() => setDescriptor(value)}><span>{emoji}</span>{label}</button>)}</div>
          <label>Say it how you'd actually say it<textarea value={humanWords} onChange={e => setHumanWords(e.target.value)} /></label>
          <div className="triple"><label>Taste signal<input value={descriptor} onChange={e => setDescriptor(e.target.value)} /></label><label>How loud?<select value={intensity} onChange={e => setIntensity(e.target.value)}><option>low</option><option>medium</option><option>high</option></select></label><label>Where?<select value={phase} onChange={e => setPhase(e.target.value)}><option>aroma</option><option>first sip</option><option>middle</option><option>finish</option><option>overall</option></select></label></div>
          <button className="primary" onClick={submitTaste}><span>Teach Blendgine</span><b>→</b></button>
          {observations.length > 0 && <p className="after-note">{copy.logged}</p>}
        </article>
      </section>

      <section className="grid lower">
        <article className="card learned-card"><div className="card-head"><div><span className="mini">💬 RECEIPTS</span><h2>What did I teach you?</h2></div><span className="count">{observations.length}</span></div>{observations.length === 0 ? <p className="empty">Nothing yet—and we're not making anything up. Give Blendgine a taste note above. ☝️</p> : observations.map(obs => <div className="observation" key={obs.id}><div className="quote-mark">“</div><p>{obs.humanWords}</p><div>{obs.descriptor} · {obs.intensity} · {obs.phase}</div><small>🧍 human observation · kept in context</small></div>)}</article>
        <article className="card next-card"><div className="card-head"><div><span className="mini">🎛️ REMIX</span><h2>Okay, let's tweak it</h2></div></div><p>Now the agent can combine what chemistry suggested with what <em>you actually experienced</em>—and propose another round.</p><button className="secondary" onClick={refine}>✨ Remix the next sip</button>{proposal && <div className="proposal"><strong>{proposal.proposal}</strong><p>{proposal.reason}</p><span>{proposal.status.replaceAll('_', ' ')}</span></div>}<button className="ghost" onClick={reset}>↻ Start the experiment over</button></article>
      </section>

      <section className="activity-wrap"><div className="activity-title"><span className="mini">⚡ WEBMCP LOOP</span><h2>The browser becomes the collaboration layer.</h2></div><div className="tool-row">{['🔎 inspect pairing','👅 record tasting','💬 show what I taught','🎛️ refine pairing'].map(tool => <span key={tool}>{tool}</span>)}</div>{activity.length > 0 && <div className="activity-log">● Latest move: {activity[0].name.replaceAll('_', ' ')}</div>}</section>
      <footer><span>🧪 evidence → 💡 hypothesis → 👅 taste → 💬 teach → 🎛️ refine</span><span>Blendgine · WebMCP Challenge 2026</span></footer>
    </main>
  );
}
