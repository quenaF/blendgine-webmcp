export const pairingCatalog = [
  {
    id: 'menu-risotto-hojicha', mode: 'menu', modeLabel: 'Pairing Menu', modeEmoji: '🍽️',
    food: { id:'mushroom-risotto', name:'Mushroom Risotto', detail:'roasted mushrooms · parmesan · thyme', emoji:'🍄' },
    tea: { id:'roasted-hojicha', name:'Roasted Hojicha', detail:'toasty · nutty · roast character', emoji:'🍵', preparation:'hot · 175°F · 2 min' },
    hypothesis: { id:'hyp-menu-001', basis:['Roasted tea character is a plausible bridge to browned, savory notes in the mushrooms.','A dry, warm tea profile may contrast the risotto’s richness without adding alcohol or sweetness.'], epistemicStatus:'hypothesis', boundary:'Pairing evidence can motivate a tasting experiment; only a human can establish how this pairing actually tastes.' },
    defaultWords:'The roast works with the mushrooms, but I want a little more lift after the creamy finish.', defaultDescriptor:'roasted',
    remix:{trigger:['heavy','rich','lift','creamy'],proposal:'Keep the hojicha, brew it slightly lighter and retaste against the risotto.',reason:'The human liked the roasted bridge but wanted more lift against the creamy finish.'}
  },
  {
    id: 'menu-chocolate-assam', mode: 'menu', modeLabel: 'Pairing Menu', modeEmoji: '🍽️',
    food:{id:'dark-chocolate-torte',name:'Dark Chocolate Torte',detail:'cocoa · bittersweet · silky',emoji:'🍫'},
    tea:{id:'assam-black-tea',name:'Assam Black Tea',detail:'malty · brisk · full-bodied',emoji:'🫖',preparation:'hot · 200°F · 3 min'},
    hypothesis:{id:'hyp-menu-002',basis:['A malty, structured black tea can plausibly echo roasted cocoa notes.','Briskness may provide contrast against the dessert’s dense richness.'],epistemicStatus:'hypothesis',boundary:'This is a pairing hypothesis, not a claim that every diner will prefer it.'},
    defaultWords:'The tea cleans up the chocolate finish without disappearing next to it.',defaultDescriptor:'balanced',
    remix:{trigger:['bitter','dry','strong'],proposal:'Shorten the Assam steep slightly and retaste.',reason:'The human response suggests the tea structure may be competing with the dessert.'}
  },
  {
    id: 'chaos-honeybun-chai', mode:'chaos', modeLabel:'Chaos Lab', modeEmoji:'🤪',
    food:{id:'honey-bun',name:'Honey Bun',detail:'sticky glaze · cinnamon · soft pastry',emoji:'🍯'},
    tea:{id:'masala-chai',name:'Masala Chai',detail:'spiced · tannic · aromatic',emoji:'🫖',preparation:'strong · hot · splash of milk optional'},
    hypothesis:{id:'hyp-chaos-001',basis:['Warm spice cues make this a plausible echo pairing.','Tea structure may keep the glazed pastry from reading as only sweet.'],epistemicStatus:'hypothesis',boundary:'This is a playful hypothesis, not proof that a honey bun and chai slap together.'},
    defaultWords:'Wait… why is this actually good? The chai makes the honey bun taste less aggressively sweet.',defaultDescriptor:'weirdly good',
    remix:{trigger:['sweet','balanced','good','spice'],proposal:'Brew the chai a little stronger and retaste against a warm honey bun.',reason:'The human reported that spice and tea structure balanced the pastry’s sweetness.'}
  },
  {
    id:'chaos-pickle-green', mode:'chaos', modeLabel:'Chaos Lab', modeEmoji:'🤪',
    food:{id:'dill-pickle',name:'Dill Pickle',detail:'salty · sour · dill',emoji:'🥒'},
    tea:{id:'sencha-green-tea',name:'Sencha Green Tea',detail:'green · umami · brisk',emoji:'🍵',preparation:'warm · 165°F · 75 sec'},
    hypothesis:{id:'hyp-chaos-002',basis:['Green and savory flavor cues make this an intentionally weird but testable pairing.','Tea bitterness and pickle acidity create a high-contrast experiment worth human tasting.'],epistemicStatus:'hypothesis',boundary:'A signal can justify the experiment; it cannot tell us whether the experience is delightful or terrible.'},
    defaultWords:'This is bizarre, but the green tea makes the dill taste fresher.',defaultDescriptor:'interesting',
    remix:{trigger:['sour','bitter','sharp'],proposal:'Cool the sencha slightly and retaste with a smaller pickle bite.',reason:'The human feedback suggests the contrast may be too aggressive.'}
  }
];

export const defaultPairingId = 'menu-risotto-hojicha';

export function findPairing({ anchorType='food', anchor='', mode='menu' }={}) {
  const normalized = String(anchor).trim().toLowerCase();
  const pool = pairingCatalog.filter(p => p.mode === mode);
  if (!normalized) return pool[0] ?? pairingCatalog[0];
  const exact = pool.find(p => String(p[anchorType]?.name || '').toLowerCase() === normalized || String(p[anchorType]?.id || '').toLowerCase() === normalized);
  if (exact) return exact;
  const fuzzy = pool.find(p => String(p[anchorType]?.name || '').toLowerCase().includes(normalized));
  return fuzzy ?? pool[0] ?? pairingCatalog[0];
}
