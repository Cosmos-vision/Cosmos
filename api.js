/* COSMOS — api.js v6.0 — via fonction Netlify, sans clé dans le code */

async function generateCosmosProfile(userData, answers) {
  try {
    var response = await fetch('/.netlify/functions/generate-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData: userData, answers: answers })
    });
    if (!response.ok) throw new Error('Erreur serveur : ' + response.status);
    var data = await response.json();
    if (!data.success) throw new Error(data.error || 'Erreur inconnue');
    return { success: true, demo: false, profile: data.profile };
  } catch(err) {
    return { success: false, demo: true, profile: getDemoProfile(userData), error: err.message };
  }
}

function getDemoProfile(userData) {
  var p = (userData&&userData.prenom)||'Toi';
  return {
    profil:{nom:"L'Architecte Lunaire",code:"LUN-SYS-PRO",sous_titre:"Lune · Systémique · Protecteur",rarete:"3,2%",signe_solaire:"À calculer",planete:"Lune"},
    portrait:[p+" ne s'explique pas — il ou elle se révèle lentement, à ceux qui savent attendre.","Là où les autres voient du bruit, tu perçois une architecture cachée.","Tu portes une loyauté silencieuse que peu remarquent.","Ton intelligence est nocturne — elle travaille quand le monde dort.","Tu cherches une seule personne qui comprend ce que tu ne dis pas."],
    forces:[{nom:"La vision structurelle",desc:"Tu captes les patterns avant les détails.",paradoxe:"Ce que les autres voient : calme. La réalité : analyse permanente.",couleur:"#7F77DD"},{nom:"La protection instinctive",desc:"Tu crées de la sécurité sans t'en rendre compte.",paradoxe:"Tu protèges tout le monde sauf toi-même.",couleur:"#1D9E75"},{nom:"L'intelligence de l'ombre",desc:"Tu penses mieux dans le silence.",paradoxe:"Protège tes heures creuses comme un territoire sacré.",couleur:"#BA7517"}],
    blocages:[{nom:"La vigilance permanente",desc:"Tu scannes les environnements avant de te détendre.",cle:"Autorise-toi 1 espace sans analyser par semaine."},{nom:"La retenue émotionnelle",desc:"Tu ressens profondément mais tu montres peu.",cle:"Dis quelque chose que tu ressens vraiment à quelqu'un cette semaine."}],
    amour:{style:"Sécure-distancié",desc:"Tu aimes profondément mais tu testes avant de faire confiance.",offre:"Une loyauté absolue.",besoin:"De constance silencieuse.",pattern:"Attendre que l'autre prouve sa valeur."},
    miroir:{nom:"Le Gardien du Feu Doux",sous_titre:"Soleil · Narratif · Expansif",citation:"Cette personne arrive avec une constance tranquille — cette façon d'être là sans calculer.",resonance:92,complementarite:79,harmonie:86,friction:61,signaux:"Tu te sentiras calme dès les premières minutes.",eveil:"Elle va t'apprendre à recevoir sans calculer."},
    actions:[{num:1,titre:"Journal des structures",desc:"Chaque matin, 5 min. Note un pattern observé hier.",freq:"Chaque matin · 5 min",dim:"Cognitif",couleur:"#7F77DD"},{num:2,titre:"Pause de réception",desc:"Attends 3 secondes avant de répondre.",freq:"Cette semaine",dim:"Émotionnel",couleur:"#D4537E"},{num:3,titre:"Rituel lunaire",desc:"Une soirée sans écrans après 21h.",freq:"1 soir / semaine",dim:"Cosmique",couleur:"#1D9E75"},{num:4,titre:"La phrase non dite",desc:"Dis à quelqu'un quelque chose que tu ressens.",freq:"Cette semaine",dim:"Relationnel",couleur:"#BA7517"},{num:5,titre:"Carte du cosmos",desc:"Note les 5 personnes qui comptent.",freq:"Ce week-end",dim:"Relationnel",couleur:"#7F77DD"},{num:6,titre:"Invitation inattendue",desc:"Contacte quelqu'un non vu depuis 6 mois.",freq:"Ce mois",dim:"Émotionnel",couleur:"#D4537E"}],
    dims:{cosmique:[78,86],cognitif:[87,95],emotionnel:[70,78],relationnel:[84,92]}
  };
}

function applyProfileToPage(profile) {
  if(!profile) return;
  var p=profile, el;
  el=document.getElementById('profile-name'); if(el) el.textContent=p.profil.nom;
  el=document.getElementById('profile-code'); if(el) el.textContent=p.profil.code.replace(/-/g,' · ');
  el=document.getElementById('dim-pills');
  if(el&&p.dims){
    var parts=(p.profil.sous_titre||'').split('·').map(function(s){return s.trim();});
    el.innerHTML=[
      {label:parts[0]||'Cosmique',val:p.dims.cosmique[0],bg:'rgba(127,119,221,.2)',tc:'#AFA9EC'},
      {label:parts[1]||'Cognitif',val:p.dims.cognitif[0],bg:'rgba(29,158,117,.18)',tc:'#9FE1CB'},
      {label:parts[2]||'Émotionnel',val:p.dims.emotionnel[0],bg:'rgba(212,83,126,.18)',tc:'#F4C0D1'},
      {label:'Lien',val:p.dims.relationnel[0],bg:'rgba(186,117,23,.18)',tc:'#FAC775'}
    ].map(function(d){return '<span class="dim-pill" style="background:'+d.bg+';color:'+d.tc+'">'+d.label+' '+d.val+'%</span>';}).join('');
  }
  el=document.getElementById('portrait-lines');
  if(el&&p.portrait) el.innerHTML=p.portrait.map(function(l){return '<p class="portrait-line">'+l+'</p>';}).join('');
  el=document.getElementById('share-profile-name'); if(el) el.textContent=p.profil.nom;
  try{sessionStorage.setItem('cosmos_profile',JSON.stringify(profile));}catch(e){}
}

async function initCosmosResult() {
  var userData={}, quizAnswers=[];
  try{
    userData=JSON.parse(sessionStorage.getItem('cosmos_user')||'{}');
    var qData=JSON.parse(sessionStorage.getItem('cosmos_quiz')||'{}');
    quizAnswers=qData.answers||[];
  }catch(e){}
  var cached=null;
  try{cached=JSON.parse(sessionStorage.getItem('cosmos_profile'));}catch(e){}
  if(cached&&cached.profil){
    applyProfileToPage(cached);
    var b=document.getElementById('demo-banner');
    if(b) b.style.display='none';
    return;
  }
  var result=await generateCosmosProfile(userData,quizAnswers);
  var banner=document.getElementById('demo-banner');
  if(result.demo){
    if(banner){banner.style.display='block';banner.textContent='Mode démo — '+(result.error||'erreur');}
  }else{
    if(banner) banner.style.display='none';
  }
  applyProfileToPage(result.profile);
}

window.CosmosAPI={init:initCosmosResult,apply:applyProfileToPage,getDemo:getDemoProfile};
