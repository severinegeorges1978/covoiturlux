import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG SUPABASE ─────────────────────────────────────────────────────────
// Remplace ces deux valeurs par celles de ton projet Supabase
const SUPABASE_URL = "https://mvsuqyfmntukrynpigdh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12c3VxeWZtbnR1a3J5bnBpZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzE2NjMsImV4cCI6MjA5MzQwNzY2M30.Wm3opy41JBQLy7OgOwtFTIgC4CJEv4OVHkNthyhX3mA";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── DONNÉES GÉOGRAPHIQUES ────────────────────────────────────────────────────
const COMMUNES_VILLAGES = {
  "Arlon": ["Arlon (centre)","Bonnert","Freylange","Grass","Heinsch","Lagland","Toernich"],
  "Attert": ["Attert","Bigonville","Nobressart","Tontelange","Useldange"],
  "Aubange": ["Aubange","Athus","Halanzy","Battincourt","Turpange"],
  "Bastogne": ["Bastogne","Wardin","Bizory","Villers-la-Bonne-Eau","Longvilly","Noville","Foy","Hardigny","Sibret"],
  "Bertogne": ["Bertogne","Compogne","Givry","Luzery","Vaux","Wicourt"],
  "Bertrix": ["Bertrix","Cugnon","Jehonville","Libramont","Maissin","Orgeo","Villance"],
  "Bouillon": ["Bouillon","Corbion","Dohan","Les Hayons","Noirefontaine","Poupehan","Rochehaut","Sensenruth"],
  "Chiny": ["Chiny","Izel","Jamoigne","Les Bulles","Muno","Suxy"],
  "Daverdisse": ["Daverdisse","Haut-Fays","Porcheresse","Sohier","Gembes"],
  "Durbuy": ["Durbuy","Barvaux","Bomal","Grandhan","Heyd","Tohogne","Wéris"],
  "Étalle": ["Étalle","Chantemelle","Couvreux","Gérouville","Sainte-Marie"],
  "Fauvillers": ["Fauvillers","Burnon","Hollange","Strainchamps","Tintange"],
  "Florenville": ["Florenville","Chassepierre","Fontenoille","Lacuisine","Meix-le-Tige","Sainte-Cécile"],
  "Gouvy": ["Gouvy","Beho","Bovigny","Cherain","Limerlé","Montleban","Steinbach"],
  "Habay": ["Habay-la-Neuve","Habay-la-Vieille","Anlier","Barnich","Hachy","Rulles"],
  "Herbeumont": ["Herbeumont","Martilly","Saint-Médard"],
  "Houffalize": ["Houffalize","Achouffe","Engreux","Mabompré","Nadrin","Tailles","Wibrin"],
  "La Roche-en-Ardenne": ["La Roche-en-Ardenne","Berismenil","Beausaint","Buisson","Cielle","Halleux","Hives","Mierchamps","Ortho","Samrée","Vecmont"],
  "Léglise": ["Léglise","Assenois","Ebly","Mellier","Witry"],
  "Libin": ["Libin","Anloy","But","Smuid","Villance"],
  "Libramont-Chevigny": ["Libramont","Recogne","Remagne","Saint-Pierre","Freux"],
  "Manhay": ["Manhay","Dochamps","Grandménil","Harre","Malempré","Odeigne","Vaux-Chavanne"],
  "Marche-en-Famenne": ["Marche-en-Famenne","Aye","Bourdon","Hargimont","Humain","Marloie","On","Roy","Waha"],
  "Martelange": ["Martelange"],
  "Meix-devant-Virton": ["Meix-devant-Virton","Bellefontaine","Gérouville","Houdrigny","Saint-Mard"],
  "Messancy": ["Messancy","Aubange","Clémency","Sélange"],
  "Musson": ["Musson","Baranzy","Châtillon"],
  "Nassogne": ["Nassogne","Bande","Forrières","Grune","Harsin","Hatrival","Masbourg","Resteigne","Waillet"],
  "Neufchâteau": ["Neufchâteau","Bertrix","Hamipré","Longlier","Massul","Tournay"],
  "Paliseul": ["Paliseul","Carlsbourg","Maissin","Opont","Paliseul","Offagne"],
  "Rendeux": ["Rendeux","Beffe","Grandhan","Hotton","Melreux"],
  "Rouvroy": ["Rouvroy","Torgny","Lamorteau","Dampicourt"],
  "Saint-Hubert": ["Saint-Hubert","Awenne","Hatrival","Mirwart","Vesqueville"],
  "Saint-Léger": ["Saint-Léger","Châtillon","Harnoncourt","Villers-la-Loue"],
  "Sainte-Ode": ["Sainte-Ode","Amberloup","Tillet","Lavacherie"],
  "Tellin": ["Tellin","Bure","Grupont","Resteigne","Wavreille"],
  "Tintigny": ["Tintigny","Bellefontaine","Breuvanne","Lahage","Rossignol","Saint-Vincent"],
  "Vaux-sur-Sûre": ["Vaux-sur-Sûre","Bercheux","Cobreville","Juseret","Morhet","Nives","Sibret"],
  "Vielsalm": ["Vielsalm","Bihain","Grand-Halleux","Petit-Thier","Rencheux","Salmchâteau"],
  "Virton": ["Virton","Ethe","Latour","Ruette","Saint-Mard"],
  "Wellin": ["Wellin","Chanly","Froidlieu","Lomprez","Sohier"],
};

const TYPE_COLORS = { "Bal de kermesse":"#e8650a","Discothèque":"#6b21a8","Festival/Concert":"#0369a1","Soirée privée":"#be185d","Soirée carnaval":"#b45309","Autre":"#6b7280" };
const TYPE_ICONS  = { "Bal de kermesse":"🎪","Discothèque":"🎵","Festival/Concert":"🎸","Soirée privée":"🎂","Soirée carnaval":"🎭","Autre":"🎉" };

function formatDate(d) {
  return new Date(d).toLocaleDateString("fr-BE",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}
function daysUntil(d) {
  const diff = Math.round((new Date(d)-new Date())/86400000);
  if(diff<0) return "Passée"; if(diff===0) return "Ce soir!"; if(diff===1) return "Demain";
  return `Dans ${diff} jours`;
}
function timeAgo(ts) {
  const s = Math.round((Date.now()-new Date(ts))/1000);
  if(s<60) return "À l'instant";
  if(s<3600) return `Il y a ${Math.floor(s/60)} min`;
  if(s<86400) return `Il y a ${Math.floor(s/3600)} h`;
  return new Date(ts).toLocaleDateString("fr-BE");
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --cream:#fdf6ee;--warm:#f5e6d3;--orange:#e8650a;--orange-light:#fbd5b5;
  --brown:#7c3d12;--dark:#1c1008;--green:#2d6a4f;--green-light:#d8f3dc;
  --muted:#a07850;--white:#fff;--purple:#6b21a8;--blue:#0369a1;
  --shadow:0 2px 16px rgba(28,16,8,.10);--shadow-lg:0 8px 32px rgba(28,16,8,.15);
  --radius:16px;--radius-sm:10px;
}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--dark);min-height:100vh;line-height:1.6}
h1,h2,h3,h4{font-family:'Fraunces',serif}
.auth-bg{min-height:100vh;background:linear-gradient(145deg,#7c3d12 0%,#e8650a 60%,#fbd5b5 100%);display:flex;align-items:center;justify-content:center;padding:24px}
.auth-card{background:var(--white);border-radius:24px;padding:48px 40px;width:100%;max-width:440px;box-shadow:var(--shadow-lg)}
.auth-logo{text-align:center;margin-bottom:32px}
.auth-logo .logo-icon{font-size:52px;display:block;margin-bottom:8px}
.auth-logo h1{font-size:2rem;color:var(--orange);line-height:1.1}
.auth-logo p{color:var(--muted);font-size:.9rem;margin-top:4px}
.auth-tabs{display:flex;border-bottom:2px solid var(--warm);margin-bottom:28px}
.auth-tab{flex:1;padding:10px;text-align:center;font-weight:600;color:var(--muted);cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif;font-size:.95rem;border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .2s}
.auth-tab.active{color:var(--orange);border-bottom-color:var(--orange)}
.form-group{margin-bottom:16px}
.form-label{display:block;font-weight:500;font-size:.86rem;margin-bottom:5px;color:var(--brown)}
.form-input,.form-select{width:100%;padding:11px 14px;border:2px solid var(--warm);border-radius:var(--radius-sm);font-family:'DM Sans',sans-serif;font-size:.93rem;color:var(--dark);background:var(--cream);transition:border-color .2s;outline:none}
.form-input:focus,.form-select:focus{border-color:var(--orange);background:var(--white)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:var(--radius-sm);font-weight:600;font-family:'DM Sans',sans-serif;font-size:.93rem;cursor:pointer;border:none;transition:all .2s}
.btn-primary{background:var(--orange);color:#fff;box-shadow:0 4px 12px rgba(232,101,10,.3)}
.btn-primary:hover{background:#c9550a;transform:translateY(-1px)}
.btn-outline{background:transparent;color:var(--orange);border:2px solid var(--orange)}
.btn-outline:hover{background:var(--orange-light)}
.btn-ghost{background:var(--warm);color:var(--brown)}
.btn-ghost:hover{background:var(--orange-light)}
.btn-green{background:var(--green);color:#fff}
.btn-green:hover{background:#235740}
.btn-full{width:100%}
.btn-sm{padding:7px 14px;font-size:.82rem}
.btn-icon{padding:8px;border-radius:50%;min-width:36px;height:36px}
.app-layout{display:flex;flex-direction:column;min-height:100vh}
.app-header{background:var(--white);border-bottom:2px solid var(--warm);padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px;position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(28,16,8,.06)}
.header-logo{display:flex;align-items:center;gap:10px}
.header-logo span{font-size:28px}
.header-logo strong{font-family:'Fraunces',serif;font-size:1.25rem;color:var(--orange)}
.header-right{display:flex;align-items:center;gap:12px}
.avatar{width:36px;height:36px;border-radius:50%;background:var(--orange);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem;flex-shrink:0}
.avatar-lg{width:48px;height:48px;font-size:1.1rem}
.user-info{text-align:right}
.user-name{font-weight:600;font-size:.88rem;color:var(--dark)}
.user-loc{font-size:.75rem;color:var(--muted)}
.btn-logout{background:none;border:none;cursor:pointer;color:var(--muted);font-size:.8rem;text-decoration:underline}
.notif-btn{position:relative;background:var(--warm);border:none;cursor:pointer;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;transition:background .2s}
.notif-btn:hover{background:var(--orange-light)}
.notif-badge{position:absolute;top:-2px;right:-2px;background:var(--orange);color:#fff;font-size:10px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif}
.app-content{flex:1;padding:28px 24px;max-width:920px;margin:0 auto;width:100%}
.nav-tabs{display:flex;gap:4px;background:var(--warm);padding:5px;border-radius:var(--radius);margin-bottom:28px;overflow-x:auto}
.nav-tab{flex:1;min-width:80px;padding:9px 6px;border-radius:var(--radius-sm);text-align:center;cursor:pointer;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-weight:500;font-size:.82rem;color:var(--muted);transition:all .2s;white-space:nowrap}
.nav-tab.active{background:var(--white);color:var(--orange);font-weight:700;box-shadow:var(--shadow)}
.welcome-banner{background:linear-gradient(120deg,var(--orange) 0%,#c9550a 100%);color:#fff;border-radius:var(--radius);padding:28px 32px;margin-bottom:24px;position:relative;overflow:hidden}
.welcome-banner::after{content:'🚗';font-size:80px;position:absolute;right:24px;top:50%;transform:translateY(-50%);opacity:.25}
.welcome-banner h2{font-size:1.6rem;margin-bottom:4px}
.welcome-banner p{opacity:.9;font-size:.9rem}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px}
.stat-card{background:var(--white);border-radius:var(--radius);padding:20px;text-align:center;box-shadow:var(--shadow);border-top:4px solid var(--orange-light)}
.stat-num{font-family:'Fraunces',serif;font-size:2rem;color:var(--orange);font-weight:900}
.stat-label{font-size:.78rem;color:var(--muted);margin-top:2px}
.section-title{font-size:1.1rem;color:var(--brown);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.soiree-card{background:var(--white);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);margin-bottom:14px;cursor:pointer;border:2px solid transparent;transition:all .2s}
.soiree-card:hover{border-color:var(--orange-light);box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.soiree-card.selected{border-color:var(--orange)}
.soiree-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.soiree-title{font-family:'Fraunces',serif;font-size:1.1rem;color:var(--dark)}
.soiree-meta{font-size:.82rem;color:var(--muted);margin-top:4px}
.badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.75rem;font-weight:600;white-space:nowrap}
.badge-type{color:#fff}
.soiree-footer{display:flex;align-items:center;justify-content:space-between;margin-top:12px}
.soiree-inscrits{font-size:.83rem;color:var(--green);font-weight:600}
.detail-panel{background:var(--cream);border-radius:var(--radius-sm);padding:22px;margin-top:16px;border:1px solid var(--warm)}
.parent-card{background:var(--white);border-radius:var(--radius-sm);padding:14px;margin-bottom:10px;display:flex;align-items:flex-start;gap:12px;box-shadow:var(--shadow)}
.parent-info{flex:1}
.parent-name{font-weight:600;font-size:.93rem}
.parent-loc{font-size:.78rem;color:var(--orange);font-weight:500;margin-top:1px}
.parent-detail{font-size:.8rem;color:var(--muted)}
.trajet-badges{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}
.trajet-badge{font-size:.7rem;padding:2px 7px;border-radius:999px;font-weight:600}
.trajet-aller{background:var(--green-light);color:var(--green)}
.trajet-retour{background:#dbeafe;color:#1d4ed8}
.places-badge{background:var(--warm);color:var(--brown)}
.inscription-form{background:var(--white);border-radius:var(--radius-sm);padding:18px;margin-top:16px;border:2px dashed var(--orange-light)}
.checkbox-group{display:flex;gap:16px;margin-bottom:14px;flex-wrap:wrap}
.checkbox-label{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:.88rem;font-weight:500}
.checkbox-label input{width:17px;height:17px;accent-color:var(--orange)}
.search-bar{width:100%;padding:13px 16px;border:2px solid var(--warm);border-radius:var(--radius-sm);font-family:'DM Sans',sans-serif;font-size:.95rem;background:var(--white);margin-bottom:18px;transition:border-color .2s;outline:none}
.search-bar:focus{border-color:var(--orange)}
.communes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:9px}
.commune-card{background:var(--white);border-radius:var(--radius-sm);padding:13px 16px;box-shadow:var(--shadow);cursor:pointer;border:2px solid transparent;transition:all .2s;font-weight:500;font-size:.9rem}
.commune-card:hover{border-color:var(--orange-light)}
.commune-card.selected{border-color:var(--orange);background:var(--orange-light);color:var(--brown)}
.commune-count{font-size:.74rem;color:var(--muted);font-weight:400;margin-top:2px}
.trajet-card{background:var(--white);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow);margin-bottom:12px;border-left:5px solid var(--orange)}
.chip-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px}
.chip{padding:5px 13px;border-radius:999px;font-size:.8rem;font-weight:600;cursor:pointer;border:2px solid transparent;transition:all .15s;background:var(--white);color:var(--muted);box-shadow:var(--shadow)}
.chip.active{border-color:var(--orange);color:var(--orange);background:var(--orange-light)}
.alert{padding:11px 15px;border-radius:var(--radius-sm);font-size:.86rem;margin-bottom:14px}
.alert-success{background:var(--green-light);color:var(--green)}
.alert-error{background:#fee2e2;color:#991b1b}
.alert-info{background:#dbeafe;color:#1d4ed8}
.empty-state{text-align:center;padding:36px;color:var(--muted)}
.empty-icon{font-size:44px;margin-bottom:10px}
.modal-overlay{position:fixed;inset:0;background:rgba(28,16,8,.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}
.modal{background:var(--white);border-radius:var(--radius);padding:28px;width:100%;max-width:500px;box-shadow:var(--shadow-lg);max-height:92vh;overflow-y:auto}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}

/* ── MESSAGERIE ── */
.msg-layout{display:grid;grid-template-columns:300px 1fr;gap:0;background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;height:600px;border:2px solid var(--warm)}
.msg-sidebar{border-right:2px solid var(--warm);display:flex;flex-direction:column;overflow:hidden}
.msg-sidebar-header{padding:16px;border-bottom:2px solid var(--warm);background:var(--cream)}
.msg-sidebar-header h3{font-size:1rem;color:var(--brown)}
.msg-tabs{display:flex;gap:0;border-bottom:2px solid var(--warm)}
.msg-tab{flex:1;padding:10px;text-align:center;font-size:.8rem;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s;font-family:'DM Sans',sans-serif}
.msg-tab.active{color:var(--orange);border-bottom-color:var(--orange);background:var(--cream)}
.conv-list{flex:1;overflow-y:auto}
.conv-item{padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--warm);transition:background .15s;display:flex;gap:10px;align-items:flex-start}
.conv-item:hover{background:var(--cream)}
.conv-item.active{background:var(--orange-light)}
.conv-meta{flex:1;min-width:0}
.conv-name{font-weight:600;font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.conv-preview{font-size:.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.conv-time{font-size:.72rem;color:var(--muted);white-space:nowrap}
.unread-dot{width:8px;height:8px;border-radius:50%;background:var(--orange);flex-shrink:0;margin-top:6px}
.msg-main{display:flex;flex-direction:column;overflow:hidden}
.msg-main-header{padding:16px 20px;border-bottom:2px solid var(--warm);background:var(--cream);display:flex;align-items:center;gap:12px}
.msg-main-header h3{font-size:1rem;font-family:'Fraunces',serif;color:var(--dark)}
.msg-main-header p{font-size:.78rem;color:var(--muted)}
.msg-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px}
.msg-bubble-wrap{display:flex;gap:8px;align-items:flex-end}
.msg-bubble-wrap.me{flex-direction:row-reverse}
.msg-bubble{max-width:70%;padding:10px 14px;border-radius:16px;font-size:.88rem;line-height:1.5;word-break:break-word}
.msg-bubble.them{background:var(--warm);color:var(--dark);border-bottom-left-radius:4px}
.msg-bubble.me{background:var(--orange);color:#fff;border-bottom-right-radius:4px}
.msg-ts{font-size:.68rem;color:var(--muted);margin-top:3px;text-align:right}
.msg-ts.me{text-align:left;color:rgba(255,255,255,.7)}
.msg-input-bar{padding:14px 18px;border-top:2px solid var(--warm);display:flex;gap:10px;align-items:center;background:var(--white)}
.msg-input{flex:1;padding:10px 14px;border:2px solid var(--warm);border-radius:999px;font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;transition:border-color .2s;background:var(--cream)}
.msg-input:focus{border-color:var(--orange)}
.msg-send{background:var(--orange);border:none;cursor:pointer;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;transition:background .2s;flex-shrink:0}
.msg-send:hover{background:#c9550a}
.msg-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--muted);gap:10px;padding:32px}
.msg-empty .empty-icon{font-size:48px}
.forum-msg{background:var(--white);border-radius:var(--radius-sm);padding:12px 16px;box-shadow:var(--shadow)}
.forum-msg-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.forum-sender{font-weight:600;font-size:.88rem;color:var(--dark)}
.forum-loc{font-size:.75rem;color:var(--orange)}
.forum-text{font-size:.88rem;line-height:1.5}
.forum-ts{font-size:.72rem;color:var(--muted);margin-top:4px}
.new-conv-btn{padding:12px 16px;border-top:2px solid var(--warm);background:var(--cream)}
@media(max-width:700px){
  .msg-layout{grid-template-columns:1fr;height:auto}
  .msg-sidebar{height:250px;border-right:none;border-bottom:2px solid var(--warm)}
  .msg-main{height:400px}
  .form-row{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:repeat(3,1fr)}
  .app-content{padding:16px 12px}
  .auth-card{padding:28px 20px}
}
`;

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("dashboard");
  const [authTab, setAuthTab]   = useState("login");
  const [authError, setAuthError] = useState("");

  // Données
  const [soirees, setSoirees]   = useState([]);
  const [parents, setParents]   = useState([]);
  const [profile, setProfile]   = useState(null);

  // Soirées
  const [selectedSoiree, setSelectedSoiree] = useState(null);
  const [filterType, setFilterType] = useState("Tous");
  const [inscription, setInscription] = useState({ aller:false, retour:true, places:2 });
  const [inscriptionMsg, setInscriptionMsg] = useState("");
  const [showAddSoiree, setShowAddSoiree]   = useState(false);
  const [editSoiree, setEditSoiree] = useState(null);
  const [newSoiree, setNewSoiree] = useState({ nom:"",date:"",lieu:"",salle:"",type:"Bal de kermesse" });

  // Communes
  const [communeSearch, setCommuneSearch] = useState("");
  const [selectedCommune, setSelectedCommune] = useState(null);

  // Messagerie
  const [msgTab, setMsgTab]       = useState("prives");
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [forumMessages, setForumMessages] = useState({});
  const [msgInput, setMsgInput]           = useState("");
  const [activeForum, setActiveForum]     = useState(null);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [showNewConv, setShowNewConv]     = useState(false);
  const msgEndRef = useRef(null);

  // Auth
  const [loginData, setLoginData]     = useState({ email:"", password:"" });
  const [regData, setRegData]         = useState({ prenom:"",email:"",password:"",commune:"",village:"" });

  // ── Init ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data:{ session } }) => {
      if(session) loadProfile(session.user.id);
      setLoading(false);
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_,session) => {
      if(session) loadProfile(session.user.id);
      else { setUser(null); setProfile(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if(user) { loadSoirees(); loadParents(); loadConversations(); } }, [user]);
  useEffect(() => { if(activeConv) loadMessages(activeConv); }, [activeConv]);
  useEffect(() => { if(activeForum) loadForumMessages(activeForum); }, [activeForum]);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  async function loadProfile(uid) {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if(data) { setProfile(data); setUser({ id:uid, ...data }); }
  }

  async function loadSoirees() {
    const { data } = await supabase.from("soirees")
      .select("*, inscriptions(*, profiles(prenom,commune,village,telephone))")
      .order("date", { ascending:true });
    if(data) setSoirees(data);
  }

  async function loadParents() {
    const { data } = await supabase.from("profiles").select("*");
    if(data) setParents(data);
  }

  async function loadConversations() {
    const { data } = await supabase.from("conversations")
      .select("*, messages(content,created_at,sender_id), p1:profiles!conversations_user1_fkey(prenom,commune,village), p2:profiles!conversations_user2_fkey(prenom,commune,village)")
      .or(`user1.eq.${user?.id},user2.eq.${user?.id}`)
      .order("updated_at", { ascending:false });
    if(data) {
      setConversations(data);
      const unread = data.filter(c => c.messages?.length > 0 && c.last_reader !== user?.id).length;
      setUnreadCount(unread);
    }
  }

  async function loadMessages(convId) {
    const { data } = await supabase.from("messages")
      .select("*, profiles(prenom,commune,village)")
      .eq("conversation_id", convId)
      .order("created_at", { ascending:true });
    if(data) setMessages(data);
    await supabase.from("conversations").update({ last_reader:user.id }).eq("id", convId);
  }

  async function loadForumMessages(soireeId) {
    const { data } = await supabase.from("forum_messages")
      .select("*, profiles(prenom,commune,village)")
      .eq("soiree_id", soireeId)
      .order("created_at", { ascending:true });
    if(data) setForumMessages(prev => ({ ...prev, [soireeId]:data }));
  }

  // ── Auth ──
  async function handleLogin() {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email:loginData.email, password:loginData.password });
    if(error) setAuthError("Email ou mot de passe incorrect.");
  }

  async function handleRegister() {
    setAuthError("");
    if(!regData.prenom||!regData.email||!regData.password||!regData.commune||!regData.village) {
      setAuthError("Veuillez remplir tous les champs."); return;
    }
    const { data, error } = await supabase.auth.signUp({ email:regData.email, password:regData.password });
    if(error) { setAuthError(error.message); return; }
    await supabase.from("profiles").insert({
      id: data.user.id,
      prenom: regData.prenom,
      commune: regData.commune,
      village: regData.village,
      telephone: "",
    });
    await loadProfile(data.user.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setTab("dashboard");
  }

  // ── Soirées ──
  async function handleInscription(soireeId) {
    const already = soirees.find(s=>s.id===soireeId)?.inscriptions?.find(i=>i.user_id===user.id);
    if(already) return;
    await supabase.from("inscriptions").insert({
      soiree_id:soireeId, user_id:user.id,
      aller:inscription.aller, retour:inscription.retour, places:inscription.places
    });
    setInscriptionMsg("✓ Inscription enregistrée !");
    setTimeout(()=>setInscriptionMsg(""),3500);
    loadSoirees();
  }

  async function handleDesister(soireeId) {
    await supabase.from("inscriptions").delete()
      .eq("soiree_id", soireeId).eq("user_id", user.id);
    loadSoirees();
  }

  async function handleEditSoiree() {
    if(!editSoiree || !editSoiree.nom || !editSoiree.date || !editSoiree.lieu) return;
    await supabase.from("soirees").update({
      nom: editSoiree.nom, date: editSoiree.date,
      lieu: editSoiree.lieu, salle: editSoiree.salle, type: editSoiree.type
    }).eq("id", editSoiree.id);
    setEditSoiree(null);
    loadSoirees();
  }

  async function handleAddSoiree() {
    if(!newSoiree.nom||!newSoiree.date||!newSoiree.lieu) return;
    await supabase.from("soirees").insert({ ...newSoiree, created_by:user.id });
    setShowAddSoiree(false);
    setNewSoiree({ nom:"",date:"",lieu:"",salle:"",type:"Bal de kermesse" });
    loadSoirees();
  }

  // ── Messagerie privée ──
  async function startConversation(otherId) {
    const existing = conversations.find(c =>
      (c.user1===user.id&&c.user2===otherId)||(c.user1===otherId&&c.user2===user.id)
    );
    if(existing) { setActiveConv(existing.id); setMsgTab("prives"); setTab("messagerie"); return; }
    const { data } = await supabase.from("conversations")
      .insert({ user1:user.id, user2:otherId, updated_at:new Date().toISOString() })
      .select().single();
    if(data) { setConversations(prev=>[data,...prev]); setActiveConv(data.id); }
    setMsgTab("prives"); setTab("messagerie");
  }

  async function sendMessage() {
    if(!msgInput.trim()) return;
    if(msgTab==="prives" && activeConv) {
      await supabase.from("messages").insert({
        conversation_id:activeConv, sender_id:user.id, content:msgInput.trim()
      });
      await supabase.from("conversations").update({ updated_at:new Date().toISOString() }).eq("id",activeConv);
      setMsgInput("");
      loadMessages(activeConv);
    } else if(msgTab==="forum" && activeForum) {
      await supabase.from("forum_messages").insert({
        soiree_id:activeForum, sender_id:user.id, content:msgInput.trim()
      });
      setMsgInput("");
      loadForumMessages(activeForum);
    }
  }

  // ── Helpers UI ──
  const convPartner = (conv) => {
    if(!conv) return null;
    return conv.user1===user?.id ? conv.p2 : conv.p1;
  };

  const filteredSoirees = soirees.filter(s=>filterType==="Tous"||s.type===filterType);
  const filteredCommunes = Object.keys(COMMUNES_VILLAGES).filter(c=>c.toLowerCase().includes(communeSearch.toLowerCase()));
  const myTrajets = soirees.filter(s=>s.inscriptions?.find(i=>i.user_id===user?.id));

  const communeParentsList = (commune) => parents.filter(p=>p.commune===commune);

  if(loading) return (
    <>
      <style>{css}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--cream)"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:16}}>🚗</div>
          <p style={{color:"var(--muted)"}}>Chargement…</p>
        </div>
      </div>
    </>
  );

  // ════ PAGE AUTH ════
  if(!user) return (
    <>
      <style>{css}</style>
      <div className="auth-bg">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="logo-icon">🚗</span>
            <h1>CovoiturLux</h1>
            <p>Entraide entre parents · Province de Luxembourg</p>
          </div>
          <div className="auth-tabs">
            <button className={`auth-tab ${authTab==="login"?"active":""}`} onClick={()=>{setAuthTab("login");setAuthError("")}}>Connexion</button>
            <button className={`auth-tab ${authTab==="register"?"active":""}`} onClick={()=>{setAuthTab("register");setAuthError("")}}>Créer un compte</button>
          </div>
          {authError && <div className="alert alert-error">{authError}</div>}
          {authTab==="login" ? (
            <>
              <div className="form-group">
                <label className="form-label">Adresse email</label>
                <input className="form-input" type="email" placeholder="votre@email.be" value={loginData.email} onChange={e=>setLoginData(p=>({...p,email:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input className="form-input" type="password" placeholder="••••••••" value={loginData.password} onChange={e=>setLoginData(p=>({...p,password:e.target.value}))} />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleLogin}>Se connecter</button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input className="form-input" placeholder="Votre prénom" value={regData.prenom} onChange={e=>setRegData(p=>({...p,prenom:e.target.value}))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Commune</label>
                  <select className="form-select" value={regData.commune} onChange={e=>setRegData(p=>({...p,commune:e.target.value,village:""}))}>
                    <option value="">— Commune —</option>
                    {Object.keys(COMMUNES_VILLAGES).sort().map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Village</label>
                  <select className="form-select" value={regData.village} onChange={e=>setRegData(p=>({...p,village:e.target.value}))} disabled={!regData.commune}>
                    <option value="">— Village —</option>
                    {regData.commune && COMMUNES_VILLAGES[regData.commune]?.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="votre@email.be" value={regData.email} onChange={e=>setRegData(p=>({...p,email:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input className="form-input" type="password" placeholder="Minimum 6 caractères" value={regData.password} onChange={e=>setRegData(p=>({...p,password:e.target.value}))} />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleRegister}>Créer mon compte</button>
            </>
          )}
        </div>
      </div>
    </>
  );

  // ════ APP PRINCIPALE ════
  return (
    <>
      <style>{css}</style>
      <div className="app-layout">
        <header className="app-header">
          <div className="header-logo"><span>🚗</span><strong>CovoiturLux</strong></div>
          <div className="header-right">
            <button className="notif-btn" onClick={()=>setTab("messagerie")}>
              💬 {unreadCount>0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            <div className="avatar avatar-lg">{profile?.prenom?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{profile?.prenom}</div>
              <div className="user-loc">📍 {profile?.village}, {profile?.commune}</div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Déco.</button>
          </div>
        </header>

        <div className="app-content">
          <div className="nav-tabs">
            {[["dashboard","🏠 Accueil"],["soirees","🎪 Soirées"],["communes","📍 Communes"],["mestrajets","🗓️ Mes trajets"],["messagerie","💬 Messages"]].map(([k,l])=>(
              <button key={k} className={`nav-tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}{k==="messagerie"&&unreadCount>0?` (${unreadCount})`:""}</button>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard" && (
            <div>
              <div className="welcome-banner">
                <h2>Bonjour, {profile?.prenom} ! 👋</h2>
                <p>Vous êtes à {profile?.village} · {soirees.length} soirées répertoriées en Province de Luxembourg</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-num">{soirees.length}</div><div className="stat-label">Soirées</div></div>
                <div className="stat-card"><div className="stat-num">{parents.length}</div><div className="stat-label">Parents inscrits</div></div>
                <div className="stat-card"><div className="stat-num">{myTrajets.length}</div><div className="stat-label">Mes trajets</div></div>
              </div>
              <div className="section-title">🔜 Prochaines soirées</div>
              {soirees.slice(0,3).map(s=>(
                <div key={s.id} className="soiree-card" onClick={()=>{setSelectedSoiree(s.id);setTab("soirees")}}>
                  <div className="soiree-header">
                    <div>
                      <div className="soiree-title">{TYPE_ICONS[s.type]} {s.nom}</div>
                      <div className="soiree-meta">📍 {s.lieu} · {formatDate(s.date)}</div>
                    </div>
                    <span className="badge badge-type" style={{background:TYPE_COLORS[s.type]||"#666"}}>{s.type}</span>
                  </div>
                  <div className="soiree-footer">
                    <span className="soiree-inscrits">👥 {s.inscriptions?.length||0} parent{(s.inscriptions?.length||0)>1?"s":""}</span>
                    <span style={{fontSize:".8rem",color:"var(--muted)"}}>{daysUntil(s.date)}</span>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline btn-full" style={{marginTop:8}} onClick={()=>setTab("soirees")}>Voir toutes les soirées →</button>
            </div>
          )}

          {/* ── SOIRÉES ── */}
          {tab==="soirees" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <h2 style={{fontFamily:"Fraunces,serif",fontSize:"1.4rem",color:"var(--brown)"}}>Soirées répertoriées</h2>
                <button className="btn btn-primary btn-sm" onClick={()=>setShowAddSoiree(true)}>+ Ajouter</button>
              </div>
              <div className="chip-row">
                {["Tous","Bal de kermesse","Discothèque","Festival/Concert","Soirée privée","Soirée carnaval","Autre"].map(t=>(
                  <button key={t} className={`chip ${filterType===t?"active":""}`} onClick={()=>setFilterType(t)}>
                    {t!=="Tous"&&TYPE_ICONS[t]+" "}{t}
                  </button>
                ))}
              </div>
              {filteredSoirees.map(s=>{
                const isSelected=selectedSoiree===s.id;
                const meInscrit=s.inscriptions?.find(i=>i.user_id===user.id);
                return (
                  <div key={s.id} className={`soiree-card ${isSelected?"selected":""}`} onClick={()=>setSelectedSoiree(isSelected?null:s.id)}>
                    <div className="soiree-header">
                      <div>
                        <div className="soiree-title">{TYPE_ICONS[s.type]} {s.nom}</div>
                        <div className="soiree-meta">📍 {s.salle||s.lieu} · {formatDate(s.date)}</div>
                      </div>
                      <span className="badge badge-type" style={{background:TYPE_COLORS[s.type]||"#666"}}>{s.type}</span>
                    </div>
                    <div className="soiree-footer">
                      <span className="soiree-inscrits">👥 {s.inscriptions?.length||0} parent{(s.inscriptions?.length||0)>1?"s":""} · 💬 Forum</span>
                      <span style={{fontSize:".8rem",color:"var(--muted)"}}>{daysUntil(s.date)}</span>
                    </div>

                    {isSelected && (
                      <div className="detail-panel" onClick={e=>e.stopPropagation()}>
                        <div style={{display:"flex",gap:10,marginBottom:16}}>
                          <button className="btn btn-ghost btn-sm" onClick={()=>{setActiveForum(s.id);loadForumMessages(s.id);setMsgTab("forum");setTab("messagerie")}}>💬 Ouvrir le forum de cette soirée</button>
                        </div>
                        <div className="section-title" style={{fontSize:"1rem"}}>👥 Parents disponibles</div>
                        {(s.inscriptions?.length||0)===0 ? (
                          <div className="empty-state"><div className="empty-icon">🚗</div><p>Soyez le premier à proposer un trajet !</p></div>
                        ) : s.inscriptions.map(ins=>{
                          const p=ins.profiles;
                          return (
                            <div key={ins.id} className="parent-card">
                              <div className="avatar">{p?.prenom?.[0]}</div>
                              <div className="parent-info">
                                <div className="parent-name">{p?.prenom}</div>
                                <div className="parent-loc">📍 {p?.village}, {p?.commune}</div>
                                <div className="parent-detail">{p?.telephone||"Pas de tél. renseigné"}</div>
                                <div className="trajet-badges">
                                  {ins.aller&&<span className="trajet-badge trajet-aller">✓ Aller</span>}
                                  {ins.retour&&<span className="trajet-badge trajet-retour">✓ Retour</span>}
                                  <span className="trajet-badge places-badge">{ins.places} place{ins.places>1?"s":""}</span>
                                </div>
                              </div>
                              {ins.user_id!==user.id && (
                                <button className="btn btn-outline btn-sm" onClick={()=>startConversation(ins.user_id)}>💬 Contacter</button>
                              )}
                            </div>
                          );
                        })}
                        {inscriptionMsg&&<div className="alert alert-success">{inscriptionMsg}</div>}
                        {s.created_by===user.id && <button className="btn btn-outline btn-sm" style={{marginBottom:10}} onClick={e=>{e.stopPropagation();setEditSoiree({...s})}}>Modifier</button>}
                        {meInscrit ? (
                          <button className="btn btn-ghost btn-sm" onClick={()=>handleDesister(s.id)}>Se désister</button>
                        ) : (
                          <div className="inscription-form">
                            <h4 style={{marginBottom:14}}>Je propose un trajet</h4>
                            <div className="form-group">
                              <label className="form-label">Places disponibles</label>
                              <select className="form-select" value={inscription.places} onChange={e=>setInscription(p=>({...p,places:Number(e.target.value)}))}>
                                {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} place{n>1?"s":""}</option>)}
                              </select>
                            </div>
                            <div className="checkbox-group">
                              <label className="checkbox-label"><input type="checkbox" checked={inscription.aller} onChange={e=>setInscription(p=>({...p,aller:e.target.checked}))} />Disponible à l'aller</label>
                              <label className="checkbox-label"><input type="checkbox" checked={inscription.retour} onChange={e=>setInscription(p=>({...p,retour:e.target.checked}))} />Disponible au retour</label>
                            </div>
                            <button className="btn btn-green" onClick={()=>handleInscription(s.id)}>✓ Je m'inscris comme covoitureur</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── COMMUNES ── */}
          {tab==="communes" && (
            <div>
              <h2 style={{fontFamily:"Fraunces,serif",fontSize:"1.4rem",color:"var(--brown)",marginBottom:18}}>Recherche par commune</h2>
              {selectedCommune ? (
                <div>
                  <button className="btn btn-ghost btn-sm" style={{marginBottom:18}} onClick={()=>setSelectedCommune(null)}>← Retour</button>
                  <h3 style={{fontFamily:"Fraunces,serif",color:"var(--brown)",marginBottom:6}}>Parents de {selectedCommune}</h3>
                  <p style={{fontSize:".85rem",color:"var(--muted)",marginBottom:18}}>Cliquez sur un parent pour lui envoyer un message</p>
                  {communeParentsList(selectedCommune).length===0 ? (
                    <div className="empty-state"><div className="empty-icon">👥</div><p>Aucun parent inscrit de {selectedCommune}.</p></div>
                  ) : communeParentsList(selectedCommune).map(p=>(
                    <div key={p.id} className="parent-card">
                      <div className="avatar avatar-lg">{p.prenom?.[0]}</div>
                      <div className="parent-info">
                        <div className="parent-name">{p.prenom}</div>
                        <div className="parent-loc">📍 {p.village}, {p.commune}</div>
                        <div className="parent-detail">{p.telephone||"Pas de tél."}</div>
                        <div style={{fontSize:".8rem",color:"var(--muted)",marginTop:4}}>
                          Inscrit à {soirees.filter(s=>s.inscriptions?.find(i=>i.user_id===p.id)).length} soirée(s)
                        </div>
                      </div>
                      {p.id!==user.id && (
                        <button className="btn btn-outline btn-sm" onClick={()=>startConversation(p.id)}>💬 Contacter</button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <input className="search-bar" placeholder="🔍 Rechercher une commune..." value={communeSearch} onChange={e=>{setCommuneSearch(e.target.value);setSelectedCommune(null)}} />
                  <div className="communes-grid">
                    {filteredCommunes.sort().map(c=>{
                      const count=communeParentsList(c).length;
                      return (
                        <div key={c} className="commune-card" onClick={()=>setSelectedCommune(c)}>
                          <div>{c}</div>
                          <div className="commune-count">{count>0?`${count} parent${count>1?"s":""}`:"Aucun parent"}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── MES TRAJETS ── */}
          {tab==="mestrajets" && (
            <div>
              <h2 style={{fontFamily:"Fraunces,serif",fontSize:"1.4rem",color:"var(--brown)",marginBottom:18}}>Mes trajets</h2>
              {myTrajets.length===0 ? (
                <div className="empty-state" style={{marginTop:40}}>
                  <div className="empty-icon">🗓️</div>
                  <p>Aucun trajet enregistré pour l'instant.</p>
                  <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setTab("soirees")}>Voir les soirées</button>
                </div>
              ) : myTrajets.map(s=>{
                const ins=s.inscriptions?.find(i=>i.user_id===user.id);
                return (
                  <div key={s.id} className="trajet-card">
                    <div style={{fontFamily:"Fraunces,serif",fontSize:"1.05rem"}}>{TYPE_ICONS[s.type]} {s.nom}</div>
                    <div style={{fontSize:".83rem",color:"var(--muted)",marginTop:4}}>📅 {formatDate(s.date)} · 📍 {s.lieu}</div>
                    <div className="trajet-badges" style={{marginTop:8}}>
                      {ins?.aller&&<span className="trajet-badge trajet-aller">✓ Aller</span>}
                      {ins?.retour&&<span className="trajet-badge trajet-retour">✓ Retour</span>}
                      <span className="trajet-badge places-badge">{ins?.places} place{ins?.places>1?"s":""}</span>
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:12}}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>handleDesister(s.id)}>Se désister</button>
                      <button className="btn btn-outline btn-sm" onClick={()=>{setActiveForum(s.id);loadForumMessages(s.id);setMsgTab("forum");setTab("messagerie")}}>💬 Forum de la soirée</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── MESSAGERIE ── */}
          {tab==="messagerie" && (
            <div>
              <h2 style={{fontFamily:"Fraunces,serif",fontSize:"1.4rem",color:"var(--brown)",marginBottom:18}}>Messagerie</h2>
              <div className="msg-layout">
                {/* Sidebar */}
                <div className="msg-sidebar">
                  <div className="msg-tabs">
                    <button className={`msg-tab ${msgTab==="prives"?"active":""}`} onClick={()=>setMsgTab("prives")}>💬 Messages privés</button>
                    <button className={`msg-tab ${msgTab==="forum"?"active":""}`} onClick={()=>setMsgTab("forum")}>🎪 Forums soirées</button>
                  </div>

                  {msgTab==="prives" && (
                    <>
                      <div className="conv-list">
                        {conversations.length===0 ? (
                          <div style={{padding:24,textAlign:"center",color:"var(--muted)",fontSize:".85rem"}}>
                            Aucune conversation.<br/>Contactez un parent depuis une soirée ou une commune.
                          </div>
                        ) : conversations.map(conv=>{
                          const partner=convPartner(conv);
                          const lastMsg=conv.messages?.[conv.messages.length-1];
                          return (
                            <div key={conv.id} className={`conv-item ${activeConv===conv.id?"active":""}`} onClick={()=>setActiveConv(conv.id)}>
                              <div className="avatar">{partner?.prenom?.[0]}</div>
                              <div className="conv-meta">
                                <div className="conv-name">{partner?.prenom} · {partner?.village}</div>
                                <div className="conv-preview">{lastMsg?.content||"Nouvelle conversation"}</div>
                              </div>
                              <div style={{textAlign:"right"}}>
                                <div className="conv-time">{lastMsg?timeAgo(lastMsg.created_at):""}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {msgTab==="forum" && (
                    <div className="conv-list">
                      {soirees.length===0 ? (
                        <div style={{padding:24,textAlign:"center",color:"var(--muted)",fontSize:".85rem"}}>Aucune soirée répertoriée.</div>
                      ) : soirees.map(s=>(
                        <div key={s.id} className={`conv-item ${activeForum===s.id?"active":""}`} onClick={()=>{setActiveForum(s.id);loadForumMessages(s.id)}}>
                          <div style={{fontSize:22}}>{TYPE_ICONS[s.type]}</div>
                          <div className="conv-meta">
                            <div className="conv-name">{s.nom}</div>
                            <div className="conv-preview">📅 {new Date(s.date).toLocaleDateString("fr-BE")} · {s.inscriptions?.length||0} parents</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Zone de chat */}
                <div className="msg-main">
                  {msgTab==="prives" && (
                    activeConv ? (()=>{
                      const conv=conversations.find(c=>c.id===activeConv);
                      const partner=convPartner(conv);
                      return (
                        <>
                          <div className="msg-main-header">
                            <div className="avatar">{partner?.prenom?.[0]}</div>
                            <div>
                              <h3>{partner?.prenom}</h3>
                              <p>📍 {partner?.village}, {partner?.commune}</p>
                            </div>
                          </div>
                          <div className="msg-body">
                            {messages.length===0&&<div style={{textAlign:"center",color:"var(--muted)",padding:24,fontSize:".85rem"}}>Démarrez la conversation 👋</div>}
                            {messages.map(m=>{
                              const isMe=m.sender_id===user.id;
                              return (
                                <div key={m.id} className={`msg-bubble-wrap ${isMe?"me":""}`}>
                                  {!isMe&&<div className="avatar" style={{width:28,height:28,fontSize:".75rem"}}>{m.profiles?.prenom?.[0]}</div>}
                                  <div>
                                    <div className={`msg-bubble ${isMe?"me":"them"}`}>{m.content}</div>
                                    <div className={`msg-ts ${isMe?"me":""}`}>{timeAgo(m.created_at)}</div>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={msgEndRef}/>
                          </div>
                          <div className="msg-input-bar">
                            <input className="msg-input" placeholder="Votre message…" value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} />
                            <button className="msg-send" onClick={sendMessage}>➤</button>
                          </div>
                        </>
                      );
                    })() : (
                      <div className="msg-empty">
                        <div className="empty-icon">💬</div>
                        <p style={{fontFamily:"Fraunces,serif",fontSize:"1.1rem",color:"var(--brown)"}}>Sélectionnez une conversation</p>
                        <p style={{fontSize:".85rem"}}>ou contactez un parent depuis une soirée ou une commune.</p>
                      </div>
                    )
                  )}

                  {msgTab==="forum" && (
                    activeForum ? (()=>{
                      const s=soirees.find(s=>s.id===activeForum);
                      const fmsgs=forumMessages[activeForum]||[];
                      return (
                        <>
                          <div className="msg-main-header">
                            <div style={{fontSize:28}}>{TYPE_ICONS[s?.type]}</div>
                            <div>
                              <h3>{s?.nom}</h3>
                              <p>Forum partagé · {s?.inscriptions?.length||0} parents inscrits</p>
                            </div>
                          </div>
                          <div className="msg-body">
                            {fmsgs.length===0&&<div style={{textAlign:"center",color:"var(--muted)",padding:24,fontSize:".85rem"}}>Aucun message dans ce forum. Soyez le premier ! 👋</div>}
                            {fmsgs.map(m=>(
                              <div key={m.id} className="forum-msg">
                                <div className="forum-msg-header">
                                  <div className="avatar" style={{width:30,height:30,fontSize:".78rem"}}>{m.profiles?.prenom?.[0]}</div>
                                  <span className="forum-sender">{m.profiles?.prenom}</span>
                                  <span className="forum-loc">📍 {m.profiles?.village}</span>
                                </div>
                                <div className="forum-text">{m.content}</div>
                                <div className="forum-ts">{timeAgo(m.created_at)}</div>
                              </div>
                            ))}
                            <div ref={msgEndRef}/>
                          </div>
                          <div className="msg-input-bar">
                            <input className="msg-input" placeholder="Écrire dans le forum…" value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} />
                            <button className="msg-send" onClick={sendMessage}>➤</button>
                          </div>
                        </>
                      );
                    })() : (
                      <div className="msg-empty">
                        <div className="empty-icon">🎪</div>
                        <p style={{fontFamily:"Fraunces,serif",fontSize:"1.1rem",color:"var(--brown)"}}>Choisissez une soirée</p>
                        <p style={{fontSize:".85rem"}}>pour accéder à son fil de discussion commun.</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {editSoiree && (
        <div className="modal-overlay" onClick={()=>setEditSoiree(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3 style={{marginBottom:20}}>Modifier la soiree</h3>
            <div className="form-group"><label className="form-label">Nom</label><input className="form-input" value={editSoiree.nom} onChange={e=>setEditSoiree(p=>({...p,nom:e.target.value}))} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={editSoiree.date} onChange={e=>setEditSoiree(p=>({...p,date:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={editSoiree.type} onChange={e=>setEditSoiree(p=>({...p,type:e.target.value}))}><option>Bal de kermesse</option><option>Discothèque</option><option>Festival/Concert</option><option>Soirée privée</option><option>Soirée carnaval</option><option>Autre</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Commune</label><select className="form-select" value={editSoiree.lieu} onChange={e=>setEditSoiree(p=>({...p,lieu:e.target.value}))}><option value="">Choisir</option>{Object.keys(COMMUNES_VILLAGES).sort().map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Salle</label><input className="form-input" value={editSoiree.salle||""} onChange={e=>setEditSoiree(p=>({...p,salle:e.target.value}))} /></div>
            <div className="modal-actions"><button className="btn btn-ghost" onClick={()=>setEditSoiree(null)}>Annuler</button><button className="btn btn-primary" onClick={handleEditSoiree}>Enregistrer</button></div>
          </div>
        </div>
      )}

      {/* MODAL AJOUT SOIRÉE */}
      {showAddSoiree && (
        <div className="modal-overlay" onClick={()=>setShowAddSoiree(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3 style={{marginBottom:20}}>➕ Ajouter une soirée</h3>
            <div className="form-group">
              <label className="form-label">Nom de la soirée *</label>
              <input className="form-input" placeholder="Ex: Bal de Kermesse de Virton" value={newSoiree.nom} onChange={e=>setNewSoiree(p=>({...p,nom:e.target.value}))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input className="form-input" type="date" value={newSoiree.date} onChange={e=>setNewSoiree(p=>({...p,date:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={newSoiree.type} onChange={e=>setNewSoiree(p=>({...p,type:e.target.value}))}>
                  <option>Bal de kermesse</option>
                  <option>Discothèque</option>
                  <option>Festival/Concert</option>
                  <option>Soirée privée</option>
                  <option>Soirée carnaval</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Commune *</label>
              <select className="form-select" value={newSoiree.lieu} onChange={e=>setNewSoiree(p=>({...p,lieu:e.target.value}))}>
                <option value="">— Choisir —</option>
                {Object.keys(COMMUNES_VILLAGES).sort().map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nom de la salle / lieu</label>
              <input className="form-input" placeholder="Ex: Salle des fêtes de Virton" value={newSoiree.salle} onChange={e=>setNewSoiree(p=>({...p,salle:e.target.value}))} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={()=>setShowAddSoiree(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleAddSoiree}>Ajouter la soirée</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
