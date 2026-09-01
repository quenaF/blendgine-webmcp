export const teaProfiles=[
 {id:'fig-leaf',name:'Fig Leaf',detail:'green · herbaceous · softly toasted',ingredients:['fig leaf'],emoji:'🍃',preparation:'slightly toasted · hot infusion',processing:{state:'slightly toasted',source:'assumed_default',confidence:'medium'},signals:['green','herbaceous','toasted','honeyed'],evidence:{level:'bridged',sources:['peer_reviewed_sensory_literature','FlavorDB_descriptor_mapping'],note:'Fig-leaf tea has direct sensory and volatile literature; processing materially changes its profile.'}},
 {id:'heal-all',name:'Heal-All',detail:'herbal · green · aromatic',ingredients:['self-heal (Prunella vulgaris)'],emoji:'🌿',preparation:'dried herb · hot infusion',processing:{state:'processed/dried for tea',source:'assumed_default',confidence:'medium'},signals:['green','herbal','aromatic','woody'],evidence:{level:'bridged',sources:['peer_reviewed_volatile_literature','FlavorDB_descriptor_mapping'],note:'Prunella vulgaris volatile research is bridged into controlled flavor vocabulary.'}},
 {id:'rosehip-hibiscus-sumac',name:'Rose Hip · Hibiscus · Sumac',detail:'tangy · fruity · bright · deeply red',ingredients:['rose hip','hibiscus','sumac'],emoji:'🌺',preparation:'dried ingredients · hot infusion',processing:{state:'prepared for tea',source:'assumed_default',confidence:'medium'},signals:['tart','fruity','bright','acidic'],evidence:{level:'bridged',sources:['FlavorDB','botanical_flavor_literature'],note:'Blend profile is composed from ingredient evidence, not represented as one FlavorDB entity.'}},
 {id:'pine-spruce-lemon',name:'Loblolly Pine Needle · Spruce Tip · Lemon',detail:'resinous · evergreen · citrus · bright',ingredients:['loblolly pine needle','spruce tip','lemon'],emoji:'🌲',preparation:'processed edible botanicals · hot infusion',processing:{state:'prepared for tea consumption',source:'assumed_default',confidence:'medium'},signals:['resinous','evergreen','citrus','bright'],evidence:{level:'bridged',sources:['botanical_volatile_literature','FlavorDB','PubChem'],note:'Evergreen evidence remains ingredient-specific; lemon has established flavor-database coverage.'}},
 {id:'maypop-lemonbalm-chamomile',name:'Maypop Passionflower · Lemon Balm · Chamomile',detail:'floral · lemony · soft · aromatic',ingredients:['maypop passionflower','lemon balm','chamomile'],emoji:'🌼',preparation:'dried botanicals · warm infusion',processing:{state:'prepared/dried for tea',source:'assumed_default',confidence:'medium'},signals:['floral','lemony','soft','aromatic'],evidence:{level:'bridged',sources:['FlavorDB','botanical_flavor_literature'],note:'Direct database coverage varies by ingredient, so blend-level uncertainty is preserved.'}}
];

export const foodProfiles=[
 {id:'mushroom-risotto',name:'Mushroom Risotto',detail:'roasted mushrooms · parmesan · thyme',emoji:'🍄',signals:['roasted','earthy','creamy','rich','savory']},
 {id:'dark-chocolate-torte',name:'Dark Chocolate Torte',detail:'cocoa · bittersweet · silky',emoji:'🍫',signals:['bitter','roasted','rich','sweet']},
 {id:'goat-cheese-toast',name:'Goat Cheese Toast',detail:'tangy cheese · toasted bread · olive oil',emoji:'🥖',signals:['tangy','fatty','toasted','savory']},
 {id:'hot-honey-pizza',name:'Hot Honey Pizza',detail:'pepperoni · chile honey · mozzarella',emoji:'🍕',signals:['spicy','sweet','fatty','savory','rich']},
 {id:'birthday-cake',name:'Birthday Cake',detail:'vanilla frosting · butter cake · sprinkles',emoji:'🎂',signals:['sweet','vanilla','creamy','rich']},
 {id:'fried-chicken-waffles',name:'Fried Chicken & Waffles',detail:'crispy chicken · maple · butter',emoji:'🍗',signals:['fried','savory','sweet','fatty','rich']},
 {id:'nacho-cheese-doritos',name:'Nacho Cheese Chips',detail:'cheesy · salty · crunchy · loud',emoji:'🧀',signals:['salty','cheesy','savory','fatty']},
 {id:'sour-gummy-worms',name:'Sour Gummy Worms',detail:'sour sugar · fruit candy · chaos',emoji:'🪱',signals:['sour','fruity','sweet','acidic']},
 {id:'dill-pickle',name:'Dill Pickle',detail:'salty · sour · dill',emoji:'🥒',signals:['salty','sour','herbal','acidic']},
 {id:'honey-bun',name:'Honey Bun',detail:'sticky glaze · cinnamon · soft pastry',emoji:'🍯',signals:['sweet','spiced','rich','baked']}
];

const complement={toasted:['roasted','baked','sweet'],honeyed:['sweet','baked'],green:['creamy','fatty','rich'],herbaceous:['savory','fatty'],herbal:['savory','cheesy'],aromatic:['spiced','savory'],woody:['roasted','rich'],tart:['rich','sweet','fatty'],fruity:['sweet','bitter','sour'],bright:['rich','fatty','fried'],acidic:['rich','fatty','sweet'],resinous:['sweet','spiced','fatty'],evergreen:['sweet','spiced'],citrus:['fried','fatty','sweet'],floral:['sweet','salty','sour'],lemony:['fried','fatty','salty'],soft:['spicy','salty']};
const contrast={green:['rich','creamy'],bright:['rich','fatty'],acidic:['fatty','sweet'],citrus:['fatty','fried'],floral:['salty','savory'],soft:['spicy','sour'],tart:['sweet','rich'],resinous:['sweet','creamy'],evergreen:['sweet','rich']};
const chaosFoods=new Set(['hot-honey-pizza','birthday-cake','fried-chicken-waffles','nacho-cheese-doritos','sour-gummy-worms','dill-pickle','honey-bun']);

function scoreTeaFood(tea,food,mode){
 let score=0;const reasons=[];
 for(const signal of tea.signals){for(const f of food.signals){if((complement[signal]||[]).includes(f)){score+=2;reasons.push(`${signal} ↔ ${f} complement`);}if((contrast[signal]||[]).includes(f)){score+=1;reasons.push(`${signal} ↔ ${f} contrast`);}}}
 if(mode==='chaos'&&chaosFoods.has(food.id))score+=3;
 if(mode==='menu'&&!chaosFoods.has(food.id))score+=2;
 return {score,reasons:[...new Set(reasons)]};
}
function matches(item,q){if(!item)return false;const n=String(q).trim().toLowerCase();return [item.name,item.id,...(item.ingredients||[])].some(v=>String(v).toLowerCase()===n||String(v).toLowerCase().includes(n));}
function buildExperiment(tea,food,mode,score){
 const evidence=tea.evidence;const why=score.reasons.slice(0,3);
 return {id:`${mode}-${tea.id}-${food.id}`,mode,modeLabel:mode==='chaos'?'Chaos Lab':'Pairing Menu',modeEmoji:mode==='chaos'?'🤪':'🍽️',food,tea,evidence,hypothesis:{id:`hyp-${tea.id}-${food.id}`,basis:[`Blendgine compared ${tea.name}'s evidence-backed sensory signals (${tea.signals.join(', ')}) with ${food.name}'s food profile.`,why.length?`Strongest candidate signals: ${why.join('; ')}.`:'This is an exploratory candidate with limited signal overlap.'],epistemicStatus:'evidence_informed_hypothesis',boundary:'This is a generated pairing hypothesis, not a scientifically proven preference. Human tasting decides whether it works.'},defaultDescriptor:'interesting',remix:{proposal:`Change one variable—brew strength, temperature, or bite size—and retaste ${tea.name} with ${food.name}.`,reason:'The next proposal uses the human observation to test which sensory variable is driving the experience.'},score:score.score};
}

export function findPairing({anchorType='food',anchor='',mode='menu'}={}){
 const teas=teaProfiles;const foods=foodProfiles;
 if(anchorType==='tea'){
  const tea=teas.find(t=>matches(t,anchor));if(!tea)return null;
  const candidates=foods.map(food=>({food,...scoreTeaFood(tea,food,mode)})).filter(c=>mode!=='chaos'||chaosFoods.has(c.food.id)).sort((a,b)=>b.score-a.score||a.food.name.localeCompare(b.food.name));
  const best=candidates[0];return best?buildExperiment(tea,best.food,mode,best):null;
 }
 const food=foods.find(f=>matches(f,anchor));if(!food)return null;
 const candidates=teas.map(tea=>({tea,...scoreTeaFood(tea,food,mode)})).sort((a,b)=>b.score-a.score||a.tea.name.localeCompare(b.tea.name));
 const best=candidates[0];return best?buildExperiment(best.tea,food,mode,best):null;
}

export const defaultPairingId='generated-default';
export const pairingCatalog=[];
export const availableTeas=teaProfiles;
export const availableFoods=foodProfiles;
