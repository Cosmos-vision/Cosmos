/* COSMOS — api.js v9.0 — appel direct Claude */

var k1 = 'sk-ant-api03-JTrcaRX9C9IuRzQxX2DZmOVniXyFO0GsWT5J_3usr1F';
var k2 = 'GQxg9RisakvrbU7C8k-T0nYQJxe41hn7dmuqU0Mlq7A-w9uTKwAA';
var ANTHROPIC_API_KEY = k1 + k2;
var b1 = 'xkeysib-dddc0f97d230f98d8602ce535c1ad70';
var b2 = 'a17440e34e641c4bd6845c67a8ffa8aa4-QseNhuLBtuIo9nYl';

var SCENE_LABELS = [
  'Lumière sous la porte','Décision 60 secondes','Objet à sauver',
  'Regard dans le café','La forêt','Silence 3 secondes',
  'Douleur portée','La nuit et les étoiles','Deux chaises vides'
];

async function generateCosmosProfile(userData, answers) {
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY.length < 20) {
    return { success: false, demo: true, profile: getDemoProfile(userData) };
  }
  try {
    var dob = userData.dateNaissance || {};
    var loc = userData.localisation || {};
    var locStr = [loc.ville, loc.region, loc.pays].filter(Boolean).join(', ');
    var msg = 'Prénom : ' + (userData.prenom||'?') + '\n';
    msg += 'Naissance : ' + (dob.jour||'?') + '/' + (dob.mois||'?') + '/' + (dob.annee||'?') + '\n';
    msg += 'Genre : ' + (userData.genre||'neutre') + '\n';
    msg += 'Lieu : ' + (locStr||'?') + '\n\nRéponses aux 9 scènes :\n';
    for (var k=0; k<9; k++) {
      msg += 'Scène '+(k+1)+' ('+SCENE_LABELS[k]+') : index '+(answers[k]!=null?answers[k]:'?')+'\n';
    }
    var appro = {};
    try{ appro = JSON.parse(sessionStorage.getItem('cosmos_appro')||'{}'); }catch(e){}
    if(appro.answers && appro.answers.length > 0) {
      msg += '\nRÉPONSES APPROFONDISSEMENT :\n';
      var qlabels = ['Style amoureux','Réaction blessure','Rêves récurrents','Solitude incompréhension','Changement affectif'];
      for(var j=0;j<5;j++) msg += qlabels[j]+' : index '+(appro.answers[j]!=null?appro.answers[j]:'?')+'\n';
    }
    msg += '\nGénère le JSON du profil Cosmos.';

    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        system: "Tu es le moteur d'analyse de Cosmos.\n\nCALCUL DU PROFIL :\nDimension COSMIQUE (scènes 1,5,8) : 0=Lune, 1=Mercure, 2=Saturne, 3=Soleil\nDimension COGNITIVE (scènes 2,5) : 0=Intuitif, 1=Systémique, 2=Narratif, 3=Analytique\nDimension ÉMOTIONNELLE (scènes 3,6,7) : 0/3=Expansif, 1/2=Protecteur\nDimension RELATIONNELLE (scènes 4,9) : 0/3=Lien profond, 1/2=Lien fluide\n\nGÉNÈRE UNIQUEMENT ce JSON valide sans texte avant ni après :\n{\"profil\":{\"nom\":\"[nom poétique]\",\"code\":\"[AAA-BBB-CCC]\",\"sous_titre\":\"[Énergie · Cognitif · Émotionnel]\",\"rarete\":\"[x,x%]\",\"signe_solaire\":\"[signe]\",\"planete\":\"[planète]\"},\"portrait\":[\"[ligne1 avec prénom]\",\"[ligne2]\",\"[ligne3]\",\"[ligne4]\",\"[ligne5]\"],\"forces\":[{\"nom\":\"[nom]\",\"desc\":\"[2 phrases]\",\"paradoxe\":\"[1 phrase]\",\"couleur\":\"#7F77DD\"},{\"nom\":\"[nom]\",\"desc\":\"[2 phrases]\",\"paradoxe\":\"[1 phrase]\",\"couleur\":\"#1D9E75\"},{\"nom\":\"[nom]\",\"desc\":\"[2 phrases]\",\"paradoxe\":\"[1 phrase]\",\"couleur\":\"#BA7517\"}],\"blocages\":[{\"nom\":\"[nom]\",\"desc\":\"[2 phrases]\",\"cle\":\"[solution]\"},{\"nom\":\"[nom]\",\"desc\":\"[2 phrases]\",\"cle\":\"[solution]\"}],\"amour\":{\"style\":\"[style]\",\"desc\":\"[3 phrases]\",\"offre\":\"[1 phrase]\",\"besoin\":\"[1 phrase]\",\"pattern\":\"[1 phrase]\"},\"miroir\":{\"nom\":\"[nom]\",\"sous_titre\":\"[dims]\",\"citation\":\"[35 mots]\",\"resonance\":88,\"complementarite\":76,\"harmonie\":84,\"friction\":61,\"signaux\":\"[2 phrases]\",\"eveil\":\"[1 phrase]\"},\"actions\":[{\"num\":1,\"titre\":\"[titre]\",\"desc\":\"[2 phrases]\",\"freq\":\"[fréq]\",\"dim\":\"Cosmique\",\"couleur\":\"#7F77DD\"},{\"num\":2,\"titre\":\"[titre]\",\"desc\":\"[2 phrases]\",\"freq\":\"[fréq]\",\"dim\":\"Émotionnel\",\"couleur\":\"#D4537E\"},{\"num\":3,\"titre\":\"[titre]\",\"desc\":\"[2 phrases]\",\"freq\":\"[fréq]\",\"dim\":\"Cognitif\",\"couleur\":\"#1D9E75\"},{\"num\":4,\"titre\":\"[titre]\",\"desc\":\"[2 phrases]\",\"freq\":\"[fréq]\",\"dim\":\"Relationnel\",\"couleur\":\"#BA7517\"},{\"num\":5,\"titre\":\"[titre]\",\"desc\":\"[2 phrases]\",\"freq\":\"[fréq]\",\"dim\":\"Cosmique\",\"couleur\":\"#7F77DD\"},{\"num\":6,\"titre\":\"[titre]\",\"desc\":\"[2 phrases]\",\"freq\":\"[fréq]\",\"dim\":\"Émotionnel\",\"couleur\":\"#D4537E\"}],\"dims\":{\"cosmique\":[70,90],\"cognitif\":[75,95],\"emotionnel\":[65,85],\"relationnel\":[70,90]}}\nGENRE : si genre=homme utilise il/son/lui dans tout le texte, si genre=femme utilise elle/sa/lui, si genre=neutre ou vide utilise le prénom ou cette personne.",
        messages: [{ role: 'user', content: msg }]
      })
    });

    if (!res.ok) throw new Error('API ' + res.status);
    var data = await res.json();
    var raw = data.content[0].text.trim()
      .replace(/^```json\n?/,'').replace(/\n?```$/,'').trim();
    var profile = JSON.parse(raw);
    if (!profile.profil) throw new Error('JSON incomplet');
    return { success: true, demo: false, profile: profile };

  } catch(err) {
    console.error('Cosmos error:', err.message);
    return { success: false, demo: true, profile: getDemoProfile(userData), error: err.message };
  }
}

function getDemoProfile(userData) {
  var p = (userData&&userData.prenom)||'Toi';
  return {
    profil:{nom:"L'Architecte Lunaire",code:"LUN-SYS-PRO",sous_titre:"Lune · Systémique · Protecteur",rarete:"3,2%",signe_solaire:"À calculer",planete:"Lune"},
    portrait:[p+" ne s'explique pas — il ou elle se révèle lentement, à ceux qui savent attendre.","Là où les autres voient du bruit, tu perçois une architecture cachée.","Tu portes une loyauté silencieuse que peu remarquent.","Ton intelligence est nocturne — elle travaille quand le monde dort.","Tu cherches une seule personne qui comprend ce que tu ne dis pas."],
    forces:[
      {nom:"La vision structurelle",desc:"Tu captes les patterns avant les détails. Tu vois la mécanique sous-jacente avant que quiconque l'ait nommée.",paradoxe:"Ce que les autres voient : calme. La réalité : analyse permanente.",couleur:"#7F77DD"},
      {nom:"La protection instinctive",desc:"Tu crées de la sécurité sans t'en rendre compte. Les gens s'apaisent en ta présence.",paradoxe:"Tu protèges tout le monde sauf toi-même.",couleur:"#1D9E75"},
      {nom:"L'intelligence de l'ombre",desc:"Tu penses mieux dans le silence. Tes meilleures idées viennent dans les espaces vides.",paradoxe:"Protège tes heures creuses comme un territoire sacré.",couleur:"#BA7517"}
    ],
    blocages:[
      {nom:"La vigilance permanente",desc:"Tu scannes les environnements avant de te détendre. Cela t'épuise sans que tu le saches.",cle:"Autorise-toi 1 espace sans analyser par semaine."},
      {nom:"La retenue émotionnelle",desc:"Tu ressens profondément mais tu montres peu. Cela crée une distance involontaire.",cle:"Dis quelque chose que tu ressens vraiment à quelqu'un cette semaine."}
    ],
    amour:{style:"Sécure-distancié",desc:"Tu aimes profondément mais tu testes avant de faire confiance. Tu as besoin qu'on reste. Quand tu choisis quelqu'un, c'est avec une intensité rare.",offre:"Une loyauté absolue et une présence calme.",besoin:"De constance silencieuse — quelqu'un qui est là encore et encore.",pattern:"Attendre que l'autre prouve sa valeur avant de s'engager."},
    miroir:{nom:"Le Gardien du Feu Doux",sous_titre:"Soleil · Narratif · Expansif",citation:"Cette personne arrive avec une constance tranquille — cette façon d'être là sans calculer, sans condition.",resonance:92,complementarite:79,harmonie:86,friction:61,signaux:"Tu te sentiras calme dès les premières minutes. Le silence entre vous sera plein.",eveil:"Elle va t'apprendre à recevoir sans calculer."},
    actions:[
      {num:1,titre:"Journal des structures",desc:"Chaque matin, 5 min. Note un pattern observé hier.",freq:"Chaque matin · 5 min",dim:"Cognitif",couleur:"#7F77DD"},
      {num:2,titre:"Pause de réception",desc:"Attends 3 secondes avant de répondre.",freq:"Cette semaine · Continu",dim:"Émotionnel",couleur:"#D4537E"},
      {num:3,titre:"Rituel lunaire",desc:"Une soirée sans écrans après 21h.",freq:"1 soir / semaine",dim:"Cosmique",couleur:"#1D9E75"},
      {num:4,titre:"La phrase non dite",desc:"Dis à quelqu'un quelque chose que tu ressens vraiment.",freq:"Cette semaine · 1 fois",dim:"Relationnel",couleur:"#BA7517"},
      {num:5,titre:"Carte du cosmos",desc:"Note les 5 personnes qui comptent.",freq:"Ce week-end · 20 min",dim:"Relationnel",couleur:"#7F77DD"},
      {num:6,titre:"Invitation inattendue",desc:"Contacte quelqu'un non vu depuis 6 mois.",freq:"Ce mois · 1 fois",dim:"Émotionnel",couleur:"#D4537E"}
    ],
    dims:{cosmique:[78,86],cognitif:[87,95],emotionnel:[70,78],relationnel:[84,92]}
  };
}

function applyProfileToPage(profile) {
  if(!profile) return;
  var p=profile, el;

  /* ══ PROFIL DE BASE ══ */
  el=document.getElementById('profile-name');
  if(el) el.textContent=p.profil.nom;
  el=document.getElementById('profile-code');
  if(el) el.textContent=p.profil.code.replace(/-/g,' · ');
  el=document.getElementById('dim-pills');
  if(el&&p.dims){
    var parts=(p.profil.sous_titre||'').split('·').map(function(s){return s.trim();});
    el.innerHTML=[
      {label:parts[0]||'Cosmique',val:p.dims.cosmique[0],bg:'rgba(127,119,221,.2)',tc:'#AFA9EC'},
      {label:parts[1]||'Cognitif',val:p.dims.cognitif[0],bg:'rgba(29,158,117,.18)',tc:'#9FE1CB'},
      {label:parts[2]||'Émotionnel',val:p.dims.emotionnel[0],bg:'rgba(212,83,126,.18)',tc:'#F4C0D1'},
      {label:'Lien',val:p.dims.relationnel[0],bg:'rgba(186,117,23,.18)',tc:'#FAC775'}
    ].map(function(d){
      return '<span class="dim-pill" style="background:'+d.bg+';color:'+d.tc+'">'+d.label+' '+d.val+'%</span>';
    }).join('');
  }
  el=document.getElementById('portrait-lines');
  if(el&&p.portrait){
    el.innerHTML=p.portrait.map(function(l){
      return '<p class="portrait-line">'+l+'</p>';
    }).join('');
  }
  el=document.getElementById('portrait-lines');
  if(el&&p.portrait){
    el.innerHTML=p.portrait.map(function(l){
      return '<p class="portrait-line">'+l+'</p>';
    }).join('');
  }
  /* FORCES GRATUITES */
  if(p.forces && p.forces.length >= 2) {
    var forceCards = document.querySelectorAll('.forces-section .force-card:not(.force-locked)');
    if(forceCards[0]) {
      forceCards[0].querySelector('.force-name').textContent = p.forces[0].nom;
      forceCards[0].querySelector('.force-desc').textContent = p.forces[0].desc;
      forceCards[0].querySelector('.force-paradox').textContent = p.forces[0].paradoxe;
    }
    if(forceCards[1]) {
      forceCards[1].querySelector('.force-name').textContent = p.forces[1].nom;
      forceCards[1].querySelector('.force-desc').textContent = p.forces[1].desc;
      forceCards[1].querySelector('.force-paradox').textContent = p.forces[1].paradoxe;
    }
  }
  /* ACTIONS GRATUITES */
  if(p.actions && p.actions.length >= 2) {
    var actionCards = document.querySelectorAll('.actions-free .action-card');
    if(actionCards[0]) {
      actionCards[0].querySelector('.action-title').textContent = p.actions[0].titre;
      actionCards[0].querySelector('.action-desc').textContent = p.actions[0].desc;
      actionCards[0].querySelector('.action-freq').textContent = p.actions[0].freq;
    }
    if(actionCards[1]) {
      actionCards[1].querySelector('.action-title').textContent = p.actions[1].titre;
      actionCards[1].querySelector('.action-desc').textContent = p.actions[1].desc;
      actionCards[1].querySelector('.action-freq').textContent = p.actions[1].freq;
    }
  }
  /* LÉGENDE RADAR */
if(p.dims && p.profil) {
  var parts2=(p.profil.sous_titre||'').split('·').map(function(s){return s.trim();});
  var legItems = document.querySelectorAll('.radar-leg-item');
  if(legItems[0]) legItems[0].innerHTML='<div class="radar-leg-dot" style="background:#AFA9EC"></div>Cosmique · '+parts2[0]+' '+p.dims.cosmique[0]+'%';
  if(legItems[1]) legItems[1].innerHTML='<div class="radar-leg-dot" style="background:#9FE1CB"></div>Cognitif · '+parts2[1]+' '+p.dims.cognitif[0]+'%';
  if(legItems[2]) legItems[2].innerHTML='<div class="radar-leg-dot" style="background:#F4C0D1"></div>Émotionnel · '+parts2[2]+' '+p.dims.emotionnel[0]+'%';
  if(legItems[3]) legItems[3].innerHTML='<div class="radar-leg-dot" style="background:#FAC775"></div>Relationnel · Lien '+p.dims.relationnel[0]+'%';
}
  el=document.getElementById('share-profile-name');
    if(el) el.textContent=p.profil.nom;
    el=document.getElementById('share-code');
    if(el) el.textContent=p.profil.code.replace(/-/g,' · ')+' · cosmos-vision.com';

  /* ══ SECTIONS PAYANTES ══ */

  /* 3e FORCE */
  if(p.forces && p.forces[2]) {
    var f3 = p.forces[2];
    var elF3Name = document.getElementById('force3-name');
    var elF3Desc = document.getElementById('force3-desc');
    var elF3Para = document.getElementById('force3-paradox');
    if(elF3Name) elF3Name.textContent = f3.nom;
    if(elF3Desc) elF3Desc.textContent = f3.desc;
    if(elF3Para) elF3Para.textContent = f3.paradoxe;
  }

  /* BLOCAGES */
  if(p.blocages && p.blocages.length) {
    var blocContainer = document.getElementById('blocages-container');
    if(blocContainer) {
      blocContainer.innerHTML = '<p class="sec-label" style="margin-bottom:0.75rem">Tes 2 blocages inconscients</p>'
        + p.blocages.map(function(b){
          return '<div class="blocage-card">'
            +'<p class="blocage-name">'+b.nom+'</p>'
            +'<p class="blocage-desc">'+b.desc+'</p>'
            +'<span class="blocage-key">'+b.cle+'</span>'
            +'</div>';
        }).join('');
    }
  }

  /* AMOUR */
  if(p.amour) {
    var a = p.amour;
    var elStyle = document.getElementById('love-style-text');
    var elDesc = document.getElementById('love-desc-text');
    var elOffre = document.getElementById('love-offre');
    var elBesoin = document.getElementById('love-besoin');
    var elPattern = document.getElementById('love-pattern');
    if(elStyle) elStyle.textContent = a.style;
    if(elDesc) elDesc.textContent = a.desc;
    if(elOffre) elOffre.textContent = a.offre;
    if(elBesoin) elBesoin.textContent = a.besoin;
    if(elPattern) elPattern.textContent = a.pattern;
  }

  /* MIROIR */
  if(p.miroir) {
    var m = p.miroir;
    var elMName = document.getElementById('mirror-name');
    var elMSub = document.getElementById('mirror-sub');
    var elMQuote = document.getElementById('mirror-quote');
    if(elMName) elMName.textContent = m.nom;
    if(elMSub) elMSub.textContent = m.sous_titre;
    if(elMQuote) elMQuote.textContent = m.citation;
    var fills = document.querySelectorAll('.compat-fill');
    var vals = [m.resonance, m.complementarite, m.harmonie, m.friction];
    fills.forEach(function(f, i){ if(vals[i]) f.setAttribute('data-w', vals[i]); });
  }

  try{ sessionStorage.setItem('cosmos_profile', JSON.stringify(profile)); }catch(e){}
}

async function initCosmosResult() {
  var userData={}, quizAnswers=[];
  try{
    userData=JSON.parse(sessionStorage.getItem('cosmos_user')||'{}');
    var qData=JSON.parse(sessionStorage.getItem('cosmos_quiz')||'{}');
    quizAnswers=qData.answers||[];
  }catch(e){}

  var cached=null;
  try{ cached=JSON.parse(sessionStorage.getItem('cosmos_profile')); }catch(e){}
  if(cached&&cached.profil){
    applyProfileToPage(cached);
    var b=document.getElementById('demo-banner');
    if(b) b.style.display='none';
    document.querySelectorAll('.portrait-block,.radar-wrap,.actions-free,.paywall,.force-card,#dim-pills,.forces-section').forEach(function(el){
      el.style.opacity='1';
    });
    return;
  }

  var result=await generateCosmosProfile(userData, quizAnswers);
  var banner=document.getElementById('demo-banner');
  if(result.demo){
    if(banner){
      banner.style.display='block';
      banner.textContent='Mode démo — '+(result.error||'erreur');
    }
  } else {
    if(banner) banner.style.display='none';
  }
  document.querySelectorAll('.portrait-block,.radar-wrap,.actions-free,.paywall,.force-card,#dim-pills,.forces-section').forEach(function(el){
    el.style.opacity='1';
    el.style.transition='opacity 0.5s ease';
  });
  applyProfileToPage(result.profile);
}

async function sendBrevoEmail(email, prenom) {
  try {
    var profile = {};
    try{ profile = JSON.parse(sessionStorage.getItem('cosmos_profile')||'{}'); }catch(e){}
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': b1 + b2
      },
      body: JSON.stringify({
        templateId: 1,
        to: [{ email: email, name: prenom }],
        params: {
          profil_nom: (profile.profil||{}).nom || 'Ton profil Cosmos',
          profil_code: (profile.profil||{}).code || '',
          prenom: prenom
        }
      })
    });
  } catch(e) {
    console.error('Brevo error:', e);
  }
}

window.CosmosAPI={init:initCosmosResult, apply:applyProfileToPage, getDemo:getDemoProfile};
