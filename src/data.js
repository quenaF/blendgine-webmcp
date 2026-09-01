export const pairingCatalog = [
  {
    id:'menu-figleaf-risotto', mode:'menu', modeLabel:'Pairing Menu', modeEmoji:'🍽️',
    food:{id:'mushroom-risotto',name:'Mushroom Risotto',detail:'roasted mushrooms · parmesan · thyme',emoji:'🍄'},
    tea:{id:'fig-leaf',name:'Fig Leaf',detail:'green · herbaceous · softly toasted',ingredients:['fig leaf'],emoji:'🍃',preparation:'slightly toasted · hot infusion',processing:{state:'slightly toasted',source:'assumed_default',confidence:'medium'}},
    evidence:{level:'bridged',sources:['peer_reviewed_sensory_literature','FlavorDB_descriptor_mapping'],note:'Fig-leaf tea has direct sensory and volatile literature. This demo assumes a slightly toasted consumable preparation; the published study establishes that processing materially changes the sensory profile.'},
    hypothesis:{id:'hyp-menu-001',basis:['Published fig-leaf tea research supports green/herbaceous sensory character and shows processing can shift the volatile profile toward fruitier and honey-like notes.','A lightly toasted leaf profile is a testable bridge to browned mushroom notes while retaining contrast against creamy richness.'],epistemicStatus:'evidence_informed_hypothesis',boundary:'The fig-leaf sensory evidence is literature-grounded; the slightly toasted preparation is an explicit demo assumption, and the pairing still requires human tasting.'},
    defaultWords:'',defaultDescriptor:'interesting',remix:{trigger:['heavy','rich','green','toast'],proposal:'Try a slightly lighter fig-leaf infusion and retaste against the risotto.',reason:'The human observation can tell us whether the toasted bridge or the green contrast is dominating.'}
  },
  {
    id:'menu-rosehip-chocolate', mode:'menu', modeLabel:'Pairing Menu', modeEmoji:'🍽️',
    food:{id:'dark-chocolate-torte',name:'Dark Chocolate Torte',detail:'cocoa · bittersweet · silky',emoji:'🍫'},
    tea:{id:'rosehip-hibiscus-sumac',name:'Rose Hip · Hibiscus · Sumac',detail:'tangy · fruity · bright · deeply red',ingredients:['rose hip','hibiscus','sumac'],emoji:'🌺',preparation:'dried ingredients · hot infusion',processing:{state:'prepared for tea',source:'assumed_default',confidence:'medium'}},
    evidence:{level:'bridged',sources:['FlavorDB','botanical_flavor_literature'],note:'Blend-level profile is composed from ingredient evidence; it is not represented as a single FlavorDB entity.'},
    hypothesis:{id:'hyp-menu-002',basis:['Bright fruit and tart sensory signals make this a plausible contrast to dense cocoa richness.','The hypothesis is generated from ingredient-level evidence rather than pretending the proprietary blend exists in a flavor database.'],epistemicStatus:'evidence_informed_hypothesis',boundary:'Ingredient evidence motivates the experiment; preference and balance remain human sensory judgments.'},
    defaultWords:'',defaultDescriptor:'balanced',remix:{trigger:['sour','sharp','bitter'],proposal:'Shorten the infusion slightly and retaste with the chocolate.',reason:'The human response may indicate that tartness is competing with the dessert rather than refreshing it.'}
  },
  {
    id:'menu-healall-goatcheese', mode:'menu', modeLabel:'Pairing Menu', modeEmoji:'🍽️',
    food:{id:'goat-cheese-toast',name:'Goat Cheese Toast',detail:'tangy cheese · toasted bread · olive oil',emoji:'🥖'},
    tea:{id:'heal-all',name:'Heal-All',detail:'herbal · green · aromatic',ingredients:['self-heal (Prunella vulgaris)'],emoji:'🌿',preparation:'dried herb · hot infusion',processing:{state:'processed/dried for tea',source:'assumed_default',confidence:'medium'}},
    evidence:{level:'bridged',sources:['peer_reviewed_volatile_literature','FlavorDB_descriptor_mapping'],note:'Prunella vulgaris has published volatile-component research. Flavor descriptors are bridged to FlavorDB vocabulary rather than attributed to a direct FlavorDB ingredient record.'},
    hypothesis:{id:'hyp-menu-003',basis:['Published Prunella volatile research supports a complex aromatic profile that can be normalized into documented flavor vocabulary.','A green aromatic infusion creates a plausible contrast experiment against tangy, fatty cheese and toast.'],epistemicStatus:'evidence_bridge_hypothesis',boundary:'Blendgine distinguishes published botanical chemistry from the FlavorDB vocabulary used to reason about a pairing.'},
    defaultWords:'',defaultDescriptor:'interesting',remix:{trigger:['green','bitter','soft'],proposal:'Retaste with a smaller bite of goat cheese and note whether the herb reads fresher or more bitter.',reason:'The human observation determines which part of the bridged profile is actually perceptible in the cup.'}
  },
  {
    id:'chaos-pine-honeybun', mode:'chaos', modeLabel:'Chaos Lab', modeEmoji:'🤪',
    food:{id:'honey-bun',name:'Honey Bun',detail:'sticky glaze · cinnamon · soft pastry',emoji:'🍯'},
    tea:{id:'pine-spruce-lemon',name:'Loblolly Pine Needle · Spruce Tip · Lemon',detail:'resinous · evergreen · citrus · bright',ingredients:['loblolly pine needle','spruce tip','lemon'],emoji:'🌲',preparation:'processed edible botanicals · hot infusion',processing:{state:'prepared for tea consumption',source:'assumed_default',confidence:'medium'}},
    evidence:{level:'bridged',sources:['botanical_volatile_literature','FlavorDB','PubChem'],note:'Evergreen sensory language is mapped only where ingredient-to-compound evidence supports it; lemon has established flavor-database coverage.'},
    hypothesis:{id:'hyp-chaos-001',basis:['Evergreen/resinous and citrus signals make this a deliberately weird aromatic contrast to cinnamon glaze.','The point is not to prove the pairing works—it is to create a traceable experiment a human can actually judge.'],epistemicStatus:'evidence_informed_hypothesis',boundary:'No compound is attributed to loblolly or spruce unless an ingredient-specific source supports that association.'},
    defaultWords:'',defaultDescriptor:'interesting',remix:{trigger:['pine','resinous','christmas','tree','strong'],proposal:'Brew the evergreen blend lighter and retaste with the honey bun.',reason:'If the human experiences the evergreen character as overpowering, concentration is the cleanest next variable to test.'}
  },
  {
    id:'chaos-lemonbalm-pickle', mode:'chaos', modeLabel:'Chaos Lab', modeEmoji:'🤪',
    food:{id:'dill-pickle',name:'Dill Pickle',detail:'salty · sour · dill',emoji:'🥒'},
    tea:{id:'maypop-lemonbalm-chamomile',name:'Maypop Passionflower · Lemon Balm · Chamomile',detail:'floral · lemony · soft · aromatic',ingredients:['maypop passionflower','lemon balm','chamomile'],emoji:'🌼',preparation:'dried botanicals · warm infusion',processing:{state:'prepared/dried for tea',source:'assumed_default',confidence:'medium'}},
    evidence:{level:'bridged',sources:['FlavorDB','botanical_flavor_literature'],note:'Direct database coverage varies by ingredient, so the blend-level profile preserves that uncertainty.'},
    hypothesis:{id:'hyp-chaos-002',basis:['Floral and lemony cues make a high-contrast experiment against salty dill acidity.','This is intentionally a Chaos Lab hypothesis: enough evidence to justify tasting, not enough to predict delight.'],epistemicStatus:'evidence_informed_hypothesis',boundary:'A flavor signal can justify an experiment; only a human can say whether the result is delightful or terrible.'},
    defaultWords:'',defaultDescriptor:'interesting',remix:{trigger:['sour','sharp','floral'],proposal:'Cool the infusion slightly and retaste with a smaller pickle bite.',reason:'The human feedback can reveal whether temperature and bite size soften the contrast.'}
  }
];

export const defaultPairingId='menu-figleaf-risotto';
export const availableTeas=pairingCatalog.map(p=>p.tea).filter((tea,index,all)=>all.findIndex(t=>t.id===tea.id)===index);
export const availableFoods=pairingCatalog.map(p=>p.food).filter((food,index,all)=>all.findIndex(f=>f.id===food.id)===index);

function matchesAnchor(item, normalized){
 if(!item)return false;
 const values=[item.name,item.id,...(item.ingredients??[])].map(v=>String(v).toLowerCase());
 return values.some(v=>v===normalized||v.includes(normalized)||normalized.includes(v));
}

export function findPairing({anchorType='food',anchor='',mode='menu'}={}){
 const normalized=String(anchor).trim().toLowerCase();
 const modePool=pairingCatalog.filter(p=>p.mode===mode);
 if(!normalized)return modePool[0]??pairingCatalog[0];

 // The thing the human supplied is authoritative. Search every experiment for
 // that anchor before considering mode so switching Menu/Chaos can never
 // silently replace Fig Leaf, Heal-All, or another selected tea/food.
 const anchored=pairingCatalog.find(p=>matchesAnchor(p[anchorType],normalized));
 if(anchored)return anchored;

 // Unknown anchors are explicit. Never silently substitute the first catalog item.
 return null;
}
