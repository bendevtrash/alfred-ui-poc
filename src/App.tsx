import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'

type Screen = 'home' | 'floor' | 'room' | 'departure' | 'absence'
type Light = { id:string; name:string; on:boolean; brightness:number }

type CheckItem = { id:string; label:string; detail:string; ok:boolean }

const initialLights: Light[] = [
  { id:'canape', name:'Canapé', on:true, brightness:42 },
  { id:'bibliotheque', name:'Bibliothèque', on:true, brightness:62 },
  { id:'plafond', name:'Plafond', on:false, brightness:70 },
  { id:'lampadaire', name:'Lampadaire', on:true, brightness:28 },
]

function Nav({active,onNavigate}:{active:Screen;onNavigate:(s:Screen)=>void}){
  return <nav className="nav">
    <button className={active==='home'?'active':''} onClick={()=>onNavigate('home')}>Maison</button>
    <button className={active==='floor'||active==='room'?'active':''} onClick={()=>onNavigate('floor')}>Pièces</button>
    <button className={active==='departure'||active==='absence'?'active':''} onClick={()=>onNavigate('departure')}>Présence</button>
  </nav>
}

function Shell({active,onNavigate,children}:{active:Screen;onNavigate:(s:Screen)=>void;children:React.ReactNode}){
  return <div className="shell"><main>{children}</main><Nav active={active} onNavigate={onNavigate}/></div>
}

function Back({title,eyebrow,onBack}:{title:string;eyebrow:string;onBack:()=>void}){
  return <header className="top"><button className="round" onClick={onBack}>‹</button><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div><span/></header>
}

function HouseStack({onFloor}:{onFloor:()=>void}){
  const floors=[['2e','Chambres · Bureau','20,1°'],['1er','Chambres · Salles d’eau','20,4°'],['RDC','Séjour · Cuisine · Salon','21,2°'],['SS','Chaufferie · Caves','18,9°']]
  return <button className="house" onClick={onFloor}>{floors.map(([n,l,t],i)=><motion.div key={n} className={`floor ${n==='RDC'?'focus':''}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}><b>{n}</b><span><strong>{l}</strong><small>{t}</small></span><i/></motion.div>)}</button>
}

function Home({go}:{go:(s:Screen)=>void}){
  return <Shell active="home" onNavigate={go}><section className="page">
    <header className="hero"><div><p className="eyebrow">ALFRED</p><h1>Bonjour.</h1><p>Tout est calme à la maison.</p></div><div className="monogram">A</div></header>
    <div className="summary"><article><span>Confort</span><strong>21,2°</strong><small>Température moyenne</small></article><article><span>Sécurité</span><strong>Tout est en ordre</strong><small>Portes et fenêtres fermées</small></article></div>
    <div className="heading"><div><p className="eyebrow">MAISON</p><h2>Vue d’ensemble</h2></div><span className="pill">Occupée</span></div>
    <HouseStack onFloor={()=>go('floor')}/>
    <div className="temps"><div>Salon <b>21,6°</b></div><div>Cuisine <b>20,8°</b></div><div>Chambre <b>19,9°</b></div></div>
    <button className="primary" onClick={()=>go('departure')}><span>Je pars</span><small>Préparer la maison avant votre départ</small><b>→</b></button>
  </section></Shell>
}

function Floor({go}:{go:(s:Screen)=>void}){
  return <Shell active="floor" onNavigate={go}><section className="page"><Back title="Rez-de-chaussée" eyebrow="Vue des pièces" onBack={()=>go('home')}/>
    <div className="tabs"><button className="active">RDC</button><button>1er</button><button>2e</button><button>SS</button></div>
    <div className="plan"><img src={`${import.meta.env.BASE_URL}plans/rdc.svg`} alt="Plan du rez-de-chaussée"/><button className="hotspot" onClick={()=>go('room')}>Ouvrir le Salon</button></div>
    <div className="heading"><div><p className="eyebrow">RDC</p><h2>Pièces</h2></div><span className="pill">21,2°</span></div>
    <div className="roomlist"><button><span><b>Cuisine</b><small>Tout est calme</small></span><strong>20,8°</strong></button><button><span><b>Séjour</b><small>Tout est calme</small></span><strong>21,2°</strong></button><button onClick={()=>go('room')}><span><b>Salon</b><small>3 lumières allumées</small></span><strong>21,6°</strong></button></div>
  </section></Shell>
}

function Accordion({title,summary,children}:{title:string;summary:string;children:React.ReactNode}){
  const [open,setOpen]=useState(false)
  return <div className="accordion"><button onClick={()=>setOpen(!open)}><span><b>{title}</b><small>{summary}</small></span><motion.i animate={{rotate:open?180:0}}>⌄</motion.i></button><AnimatePresence>{open&&<motion.div className="accordionBody" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><div>{children}</div></motion.div>}</AnimatePresence></div>
}

function Room({go}:{go:(s:Screen)=>void}){
  const [lights,setLights]=useState(initialLights)
  const [selected,setSelected]=useState<string[]>([])
  const [windowOpen,setWindowOpen]=useState(false)
  const onCount=lights.filter(l=>l.on).length
  const avg=useMemo(()=>{const x=lights.filter(l=>selected.includes(l.id));return x.length?Math.round(x.reduce((a,b)=>a+b.brightness,0)/x.length):0},[lights,selected])
  const toggle=(id:string)=>setLights(v=>v.map(l=>l.id===id?{...l,on:!l.on}:l))
  const select=(id:string)=>setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])
  const brightness=(n:number)=>setLights(v=>v.map(l=>selected.includes(l.id)?{...l,brightness:n,on:n>0}:l))
  return <Shell active="room" onNavigate={go}><section className="page roomPage"><Back title="Salon" eyebrow="Pièce" onBack={()=>go('floor')}/>
    <div className="roomStatus"><div><strong>21,6°</strong><span>Confortable</span></div><div><span>2 fenêtres</span><span>{onCount} lumières</span><span>2 automatismes</span></div></div>
    <div className="plan compact"><img src={`${import.meta.env.BASE_URL}plans/rdc.svg`} alt="Plan du salon"/></div>
    <div className="heading"><div><p className="eyebrow">CONTRÔLE</p><h2>Lumières</h2></div><button className="link" onClick={()=>setLights(v=>v.map(l=>({...l,on:onCount===0})))}>{onCount?'Tout éteindre':'Tout allumer'}</button></div>
    <p className="hint">Touchez une lampe pour l’allumer. « Sélectionner » crée un groupe temporaire.</p>
    <div className="lights">{lights.map(l=><motion.article layout key={l.id} className={`${l.on?'on':''} ${selected.includes(l.id)?'selected':''}`}><button className="lightMain" onClick={()=>toggle(l.id)}><span>◉</span><div><b>{l.name}</b><small>{l.on?`${l.brightness}%`:'Éteinte'}</small></div></button><button className="select" onClick={()=>select(l.id)}>{selected.includes(l.id)?'✓ Sélectionnée':'Sélectionner'}</button></motion.article>)}</div>
    <Accordion title="Ouvertures" summary={windowOpen?'1 ouverte':'Tout est fermé'}><button className="detail" onClick={()=>setWindowOpen(!windowOpen)}><span>Baie vitrée</span><b>{windowOpen?'Ouverte':'Fermée'}</b></button><div className="detail"><span>Fenêtre sud</span><b>Fermée</b></div></Accordion>
    <Accordion title="Automatismes" summary="2 actifs"><div className="detail"><span>Éclairage automatique</span><b>Actif</b></div><div className="detail"><span>Volets soirée</span><b>Actif</b></div></Accordion>
    <Accordion title="Capteurs" summary="Air bon"><div className="sensors"><div>Température <b>21,6°</b></div><div>Humidité <b>48%</b></div><div>CO₂ <b>612 ppm</b></div><div>Luminosité <b>126 lx</b></div></div></Accordion>
    <AnimatePresence>{selected.length>0&&<motion.div className="sheet" initial={{y:180}} animate={{y:0}} exit={{y:180}} transition={{type:'spring',stiffness:360,damping:34}}><div className="handle"/><div className="sheetHead"><div><p className="eyebrow">GROUPE TEMPORAIRE</p><h3>{selected.length} lumière{selected.length>1?'s':''}</h3></div><button onClick={()=>setSelected([])}>×</button></div><label><span>Luminosité commune</span><b>{avg}%</b></label><input type="range" min="0" max="100" value={avg} onChange={e=>brightness(Number(e.target.value))}/><div className="sheetBtns"><button onClick={()=>setLights(v=>v.map(l=>selected.includes(l.id)?{...l,on:false}:l))}>Éteindre</button><button onClick={()=>setLights(v=>v.map(l=>selected.includes(l.id)?{...l,on:true}:l))}>Allumer</button></div></motion.div>}</AnimatePresence>
  </section></Shell>
}

function Departure({go}:{go:(s:Screen)=>void}){
  const [items,setItems]=useState<CheckItem[]>([
    {id:'windows',label:'Fenêtres',detail:'Tout est fermé',ok:true},
    {id:'door',label:'Porte arrière',detail:'À fermer avant de partir',ok:false},
    {id:'locks',label:'Serrures',detail:'Prêtes',ok:true},
    {id:'lights',label:'Lumières',detail:'3 encore allumées',ok:false},
    {id:'heat',label:'Chauffage',detail:'Mode absence prêt',ok:true},
    {id:'presence',label:'Simulation de présence',detail:'Prête',ok:true},
  ])
  const remaining=items.filter(i=>!i.ok).length
  return <Shell active="departure" onNavigate={go}><section className="page"><Back title="Je pars" eyebrow="Préparation" onBack={()=>go('home')}/><div className="departure"><div className={`big ${remaining===0?'ready':''}`}>{remaining===0?'✓':'⌂'}</div><h2>{remaining===0?'Prêt à partir':'Préparons la maison'}</h2><p>{remaining===0?'Toutes les vérifications sont au vert.':'Alfred vérifie ce qui mérite votre attention avant le départ.'}</p></div><div className="checklist">{items.map(i=><motion.div layout key={i.id} className={i.ok?'ok':'todo'}><span>{i.ok?'✓':'!'}</span><div><b>{i.label}</b><small>{i.detail}</small></div>{!i.ok&&<button onClick={()=>setItems(v=>v.map(x=>x.id===i.id?{...x,ok:true,detail:'Corrigé'}:x))}>Simuler corrigé</button>}</motion.div>)}</div><div className="note">Le mode Absence s’activera lorsque le départ réel des occupants sera détecté.</div>{remaining===0&&<motion.button initial={{opacity:0}} animate={{opacity:1}} className="primary" onClick={()=>go('absence')}><span>Simuler le départ détecté</span><small>Passer en mode Absence</small><b>→</b></motion.button>}</section></Shell>
}

function Absence({go}:{go:(s:Screen)=>void}){
  return <Shell active="absence" onNavigate={go}><section className="page"><header className="hero"><div><p className="eyebrow">ALFRED · ABSENCE</p><h1>Maison protégée.</h1><p>Tout est calme pendant votre absence.</p></div><div className="monogram">✓</div></header><HouseStack onFloor={()=>go('floor')}/><div className="absence"><div>Sécurité <b>Protégée</b></div><div>Simulation <b>Active ce soir</b></div><div>Température <b>19,1°</b></div></div><div className="note">Dans la version réelle, l’auto-déverrouillage de la serrure servira de signal de retour.</div><button className="secondary" onClick={()=>go('home')}>Simuler le retour à la maison</button></section></Shell>
}

export default function App(){
  const [screen,setScreen]=useState<Screen>('home')
  const render=screen==='floor'?<Floor go={setScreen}/>:screen==='room'?<Room go={setScreen}/>:screen==='departure'?<Departure go={setScreen}/>:screen==='absence'?<Absence go={setScreen}/>:<Home go={setScreen}/>
  return <AnimatePresence mode="wait" initial={false}><motion.div key={screen} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}} transition={{duration:.18}}>{render}</motion.div></AnimatePresence>
}
