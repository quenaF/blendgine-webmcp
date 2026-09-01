import React, { useEffect, useState } from 'react';
import { requestPairing, recordSensoryObservation, whatDidHumanTeach, refinePairing, resetObservations } from './engine.js';
import { registerBlendgineWebMCP } from './webmcp.js';

const reactions = [['😍','delicious','Oh wow'],['🤔','interesting','Interesting'],['✨','balanced','Balanced'],['😵‍💫','overpowering','Too much'],['😂','weirdly good','Weirdly good']];
const foodExamples = ['Mushroom Risotto','Dark Chocolate Torte','Honey Bun','Dill Pickle'];
const teaExamples = ['Roasted Hojicha','Assam Black Tea','Masala Chai','Sencha Green Tea'];
const tastingVoices = [
  'Girl… this tastes like a Christmas tree 🤣',
  'It’s good, but something feels heavy at the end.',
  'Bright at first, then kind of bitter?',
  'The acidity cuts through the richness really nicely.',
  'Strong resinous aroma with a lingering astringent finish.',
  'IDK 😭 I just don’t like it.'
];

export default function App(){
 const [anchorType,setAnchorType]=useState('food'); const [mode,setMode]=useState('menu'); const [anchor,setAnchor]=useState('Mushroom Risotto');
 const [pairing,setPairing]=useState(()=>requestPairing({anchorType:'food',anchor:'Mushroom Risotto',mode:'menu'}));
 const [descriptor,setDescriptor]=useState(pairing.experiment.defaultDescriptor); const [intensity,setIntensity]=useState('medium'); const [phase,setPhase]=useState('overall pairing'); const [humanWords,setHumanWords]=useState('');
 const [promptIndex,setPromptIndex]=useState(0); const [promptFading,setPromptFading]=useState(false); const [tastingFocused,setTastingFocused]=useState(false);
 const [observations,setObservations]=useState([]); const [proposal,setProposal]=useState(null); const [activity,setActivity]=useState([]); const [webmcpReady,setWebmcpReady]=useState(false);
 useEffect(()=>{setWebmcpReady(registerBlendgineWebMCP(event=>setActivity(c=>[event,...c].slice(0,8))));},[]);
 useEffect(()=>{
   if(tastingFocused || humanWords.trim()) return;
   let fadeTimer;
   const interval=setInterval(()=>{
     setPromptFading(true);
     fadeTimer=setTimeout(()=>{setPromptIndex(i=>(i+1)%tastingVoices.length);setPromptFading(false);},260);
   },5000);
   return ()=>{clearInterval(interval);clearTimeout(fadeTimer);};
 },[tastingFocused,humanWords]);
 function changeAnchorType(next){setAnchorType(next);setAnchor(next==='food'?'Mushroom Risotto':'Roasted Hojicha');}
 function find(){const p=requestPairing({anchorType,anchor,mode});setPairing(p);setDescriptor(p.experiment.defaultDescriptor);setHumanWords('');setPromptIndex(0);setProposal(null);setActivity(c=>[{name:'pairing_requested',result:p},...c].slice(0,8));}
 function submitTaste(){if(!humanWords.trim()) return; const o=recordSensoryObservation({descriptor,intensity,phase,humanWords});setObservations(whatDidHumanTeach().observations);setActivity(c=>[{name:'human_tasting',result:o},...c].slice(0,8));}
 function refine(){const n=refinePairing();setProposal(n);setActivity(c=>[{name:'refinement_proposal',result:n},...c].slice(0,8));}
 function reset(){resetObservations();setObservations([]);setProposal(null);setActivity([]);setAnchorType('food');setMode('menu');setAnchor('Mushroom Risotto');setHumanWords('');setPromptIndex(0);setPairing(requestPairing({anchorType:'food',anchor:'Mushroom Risotto',mode:'menu'}));}
 const x=pairing.experiment; const examples=anchorType==='food'?foodExamples:teaExamples;
 return <main className="shell">
  <section className="hero"><div className="hero-copy"><div className="eyebrow">✦ BLENDGINE · TEA × FOOD × WEBMCP</div><h1>Bring the tea.<br/>Or bring the food.<br/><em>We'll find its match.</em></h1><p className="lede">Start with either side of the table. Blendgine uses evidence to propose the other half, then a human tastes the pairing and teaches the system what actually happened.</p><div className="hero-stickers"><span>🍽️ food</span><b>↔</b><span>🍵 tea</span><b>+</b><span>👅 human taste</span></div></div><div className={`status ${webmcpReady?'ready':''}`}><i/>{webmcpReady?'Agent connected':'WebMCP needs a supported browser'}</div></section>

  <section className="pair-finder card">
   <div className="finder-top"><div><span className="mini">START WITH WHAT YOU HAVE</span><h2>What are we pairing today?</h2></div><div className="mode-pills"><button className={mode==='menu'?'active':''} onClick={()=>setMode('menu')}>🍽️ Pairing Menu</button><button className={mode==='chaos'?'active chaos':''} onClick={()=>setMode('chaos')}>🤪 Chaos Lab</button></div></div>
   <div className="anchor-tabs"><button className={anchorType==='food'?'active':''} onClick={()=>changeAnchorType('food')}>🍽️ I have a food</button><button className={anchorType==='tea'?'active':''} onClick={()=>changeAnchorType('tea')}>🍵 I have a tea</button></div>
   <div className="finder-row"><div className="finder-input"><span>{anchorType==='food'?'🍽️':'🍵'}</span><input value={anchor} onChange={e=>setAnchor(e.target.value)} placeholder={anchorType==='food'?'Type a dish or snack…':'Type a tea…'}/></div><button className="find-button" onClick={find}>Find my pairing →</button></div>
   <div className="quick-picks"><small>Try:</small>{examples.map(v=><button key={v} onClick={()=>setAnchor(v)}>{v}</button>)}</div>
  </section>

  <section className="experiment-banner"><span>{x.modeEmoji} {x.modeLabel.toUpperCase()}</span><strong>{x.food.name} × {x.tea.name}</strong><span className="spark">✦ evidence → taste → teach → remix ✦</span></section>
  <section className="grid">
   <article className="card formula-card"><div className="card-head"><div><span className="mini">BLENDGINE'S MATCH</span><h2>{anchorType==='food'?`Try ${x.tea.name}`:`Try it with ${x.food.name}`}</h2></div><span className="pill">{mode==='menu'?'zero-proof table pairing':'chaos approved 🎲'}</span></div><div className="pair-stage"><div className="pair-item"><span>{x.food.emoji}</span><strong>{x.food.name}</strong><small>{x.food.detail}</small></div><div className="pair-x">×</div><div className="pair-item"><span>{x.tea.emoji}</span><strong>{x.tea.name}</strong><small>{x.tea.detail}</small></div></div><div className="prep">🫖 {x.tea.preparation}</div><div className="science-box"><span className="mini">💡 WHY THIS PAIRING?</span>{x.hypothesis.basis.map(r=><p key={r}>{r}</p>)}<div className="boundary">⚠️ {x.hypothesis.boundary}</div></div></article>
   <article className="card taste-card"><div className="card-head"><div><span className="mini">👅 YOUR TURN</span><h2>{mode==='menu'?'Taste them together. What changes?':'Now do the ridiculous experiment. 😂'}</h2></div></div><div className="reaction-row">{reactions.map(([e,v,l])=><button key={v} className={descriptor===v?'selected':''} onClick={()=>setDescriptor(v)}><span>{e}</span>{l}</button>)}</div><label>Say it how you'd actually say it<div className={`voice-example ${promptFading?'fading':''}`} aria-live="polite"><span>Try your voice:</span> “{tastingVoices[promptIndex]}”</div><textarea value={humanWords} onFocus={()=>setTastingFocused(true)} onBlur={()=>setTastingFocused(false)} onChange={e=>setHumanWords(e.target.value)} placeholder="Your words—not tasting jargon."/></label><div className="triple"><label>Taste signal<input value={descriptor} onChange={e=>setDescriptor(e.target.value)}/></label><label>How loud?<select value={intensity} onChange={e=>setIntensity(e.target.value)}><option>low</option><option>medium</option><option>high</option></select></label><label>Where?<select value={phase} onChange={e=>setPhase(e.target.value)}><option>first bite + sip</option><option>middle</option><option>finish</option><option>overall pairing</option></select></label></div><button className="primary" onClick={submitTaste} disabled={!humanWords.trim()}><span>Teach Blendgine</span><b>→</b></button></article>
  </section>
  <section className="grid lower"><article className="card learned-card"><div className="card-head"><div><span className="mini">💬 RECEIPTS</span><h2>What did I teach you?</h2></div><span className="count">{observations.length}</span></div>{observations.length===0?<p className="empty">Nothing yet—and we're not making anything up. Taste first. ☝️</p>:observations.slice().reverse().map(o=><div className="observation" key={o.id}><div className="quote-mark">“</div><p>{o.humanWords}</p><div>{o.tea} × {o.food}</div><small>{o.descriptor} · {o.intensity} · {o.phase} · 🧍 human observation</small></div>)}</article><article className="card next-card"><div className="card-head"><div><span className="mini">🎛️ REMIX</span><h2>What should we try next?</h2></div></div><p>Blendgine can use the pairing hypothesis plus what <em>you actually experienced</em> to propose another tasting.</p><button className="secondary" onClick={refine}>✨ Remix the pairing</button>{proposal&&<div className="proposal"><strong>{proposal.proposal}</strong><p>{proposal.reason}</p><span>{proposal.status.replaceAll('_',' ')}</span></div>}<button className="ghost" onClick={reset}>↻ Reset lab</button></article></section>
  <section className="activity-wrap"><div className="activity-title"><span className="mini">⚡ WEBMCP LOOP</span><h2>The human chooses the anchor. The agent finds the match.</h2></div><div className="tool-row">{['🔎 find pairing','🧪 inspect rationale','👅 record tasting','💬 show what I taught','🎛️ refine pairing'].map(t=><span key={t}>{t}</span>)}</div>{activity.length>0&&<div className="activity-log">● Latest move: {activity[0].name.replaceAll('_',' ')}</div>}</section>
  <footer><span>choose tea or food → evidence-backed match → human taste → attributed observation → next pairing</span><span>Blendgine · WebMCP Challenge 2026</span></footer>
 </main>;
}
