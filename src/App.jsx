import React, { useEffect, useMemo, useState } from 'react';
import { inspectPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing, resetObservations } from './engine.js';
import { registerBlendgineWebMCP } from './webmcp.js';

const tones = {
  playful: {
    opener: 'Chemistry says these ingredients have a reason to get along. Your mouth gets the final vote 😌',
    prompt: 'Taste it. What happened?',
    logged: 'Got it. I’m treating that as your tasting observation—not a universal truth.'
  },
  technical: {
    opener: 'The formulation is based on volatile-compound overlap and complementary aromatic signals. Sensory validation still requires a human taster.',
    prompt: 'Describe the sensory result.',
    logged: 'Observation recorded with formulation and provenance context.'
  }
};

export default function App() {
  const pairing = useMemo(() => inspectPairing(), []);
  const [tone, setTone] = useState('playful');
  const [descriptor, setDescriptor] = useState('resinous');
  const [intensity, setIntensity] = useState('high');
  const [phase, setPhase] = useState('finish');
  const [humanWords, setHumanWords] = useState('The finish is way too piney.');
  const [observations, setObservations] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [activity, setActivity] = useState([]);
  const [webmcpReady, setWebmcpReady] = useState(false);

  useEffect(() => {
    const ready = registerBlendgineWebMCP(event => {
      setActivity(current => [event, ...current].slice(0, 8));
    });
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
    resetObservations();
    setObservations([]);
    setProposal(null);
    setActivity([]);
  }

  const copy = tones[tone];

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <div className="eyebrow">BLENDGINE × WEBMCP</div>
          <h1>The agent reasons.<br />You taste.</h1>
          <p className="lede">{copy.opener}</p>
        </div>
        <div className={`status ${webmcpReady ? 'ready' : ''}`}>
          {webmcpReady ? 'WebMCP ready' : 'WebMCP unavailable in this browser'}
        </div>
      </section>

      <section className="grid">
        <article className="card formula-card">
          <div className="card-head">
            <div>
              <span className="mini">TODAY'S EXPERIMENT</span>
              <h2>{pairing.formula.name}</h2>
            </div>
            <span className="pill">{pairing.formula.preparation}</span>
          </div>

          <div className="ingredients">
            {pairing.ingredients.map(item => (
              <div className="ingredient" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.botanical}</small>
                </div>
                <span>{item.parts} part{item.parts === 1 ? '' : 's'}</span>
              </div>
            ))}
          </div>

          <div className="science-box">
            <span className="mini">WHY THE AI WANTS TO TRY IT</span>
            {pairing.hypothesis.basis.map(reason => <p key={reason}>{reason}</p>)}
            <div className="boundary">Hypothesis, not a taste claim.</div>
          </div>
        </article>

        <article className="card taste-card">
          <div className="card-head">
            <div>
              <span className="mini">YOUR TURN</span>
              <h2>{copy.prompt}</h2>
            </div>
            <div className="tone-toggle">
              <button className={tone === 'playful' ? 'active' : ''} onClick={() => setTone('playful')}>Playful</button>
              <button className={tone === 'technical' ? 'active' : ''} onClick={() => setTone('technical')}>Technical</button>
            </div>
          </div>

          <label>Your words
            <textarea value={humanWords} onChange={e => setHumanWords(e.target.value)} />
          </label>

          <div className="triple">
            <label>Descriptor
              <input value={descriptor} onChange={e => setDescriptor(e.target.value)} />
            </label>
            <label>Intensity
              <select value={intensity} onChange={e => setIntensity(e.target.value)}>
                <option>low</option><option>medium</option><option>high</option>
              </select>
            </label>
            <label>Where?
              <select value={phase} onChange={e => setPhase(e.target.value)}>
                <option>aroma</option><option>first sip</option><option>middle</option><option>finish</option><option>overall</option>
              </select>
            </label>
          </div>

          <button className="primary" onClick={submitTaste}>Teach Blendgine</button>
          {observations.length > 0 && <p className="after-note">{copy.logged}</p>}
        </article>
      </section>

      <section className="grid lower">
        <article className="card learned-card">
          <div className="card-head">
            <div><span className="mini">WHAT DID I TEACH YOU?</span><h2>Human evidence</h2></div>
            <span className="count">{observations.length}</span>
          </div>
          {observations.length === 0 ? (
            <p className="empty">Nothing yet. Blendgine won't pretend you've taught it something you haven't.</p>
          ) : observations.map(obs => (
            <div className="observation" key={obs.id}>
              <p>“{obs.humanWords}”</p>
              <div>{obs.descriptor} · {obs.intensity} · {obs.phase}</div>
              <small>{obs.provenance} · individual observation</small>
            </div>
          ))}
        </article>

        <article className="card next-card">
          <div className="card-head">
            <div><span className="mini">NEXT EXPERIMENT</span><h2>Refine together</h2></div>
          </div>
          <p>Blendgine can use the scientific hypothesis plus your explicit tasting evidence to suggest the next test.</p>
          <button className="secondary" onClick={refine}>Propose next move</button>
          {proposal && (
            <div className="proposal">
              <strong>{proposal.proposal}</strong>
              <p>{proposal.reason}</p>
              <span>{proposal.status.replaceAll('_', ' ')}</span>
            </div>
          )}
          <button className="ghost" onClick={reset}>Reset tasting</button>
        </article>
      </section>

      <section className="activity-wrap">
        <div className="activity-title"><span className="mini">STRUCTURED COLLABORATION</span><h2>What the agent can actually do</h2></div>
        <div className="tool-row">
          {['inspect pairing', 'record tasting', 'show what I taught', 'refine pairing'].map(tool => <span key={tool}>{tool}</span>)}
        </div>
        {activity.length > 0 && <div className="activity-log">Latest: {activity[0].name.replaceAll('_', ' ')}</div>}
      </section>

      <footer>
        <span>Scientific evidence → hypothesis → human tasting → attributed observation → refinement</span>
        <span>Blendgine · WebMCP Challenge 2026</span>
      </footer>
    </main>
  );
}
