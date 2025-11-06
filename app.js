// app.js
// Utilidades
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
// Normaliza: minúsculas, sin tildes, sin puntuación, espacios simples.
const norm = s => (s||'')
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[.,;:!?()\"'`´]/g,'')
  .replace(/\s+/g,' ')
  .trim();

const shuffle = arr => {
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
};

// Estado
const state = {
  student:{first:'',last:'',course:'4ESO'},
  scores:{mc:null, fill:null, rel:null},
  fcIndex:0,
  fcOrder:[]
};

// Vocabulario con ejemplos (ES anverso / EN reverso)
const VOCAB = [
  {en:'attach', es:'pegar(se); relacionar; adjuntar', esEx:'Adjunta este documento a tu email.', enEx:'Attach this document to your email.'},
  {en:'attempt', es:'intentar', esEx:'Voy a intentar resolver este problema.', enEx:'I will attempt to solve this problem.'},
  {en:'block of flats', es:'bloque de pisos', esEx:'Vivimos en un bloque de pisos céntrico.', enEx:'We live in a central block of flats.'},
  {en:'brick', es:'ladrillo', esEx:'La casa está construida con ladrillos rojos.', enEx:'The house is built with red bricks.'},
  {en:'bright', es:'listo/a, inteligente', esEx:'Mi hermana es muy lista para los idiomas.', enEx:'My sister is very bright at languages.'},
  {en:'check (something) out', es:'mirar (algo)', esEx:'Deberías mirar ese nuevo restaurante.', enEx:'You should check out that new restaurant.'},
  {en:'common sense', es:'sentido común', esEx:'Hace falta sentido común en estos temas.', enEx:'You need common sense in these matters.'},
  {en:'concrete', es:'hormigón', esEx:'El suelo está hecho de hormigón.', enEx:'The floor is made of concrete.'},
  {en:'contain', es:'contener', esEx:'La caja contiene libros valiosos.', enEx:'The box contains valuable books.'},
  {en:'end up', es:'terminar', esEx:'Terminamos comiendo pizza.', enEx:'We ended up eating pizza.'},
  {en:'facilities', es:'instalaciones', esEx:'El gimnasio tiene excelentes instalaciones.', enEx:'The gym has excellent facilities.'},
  {en:'figure out', es:'entender; darse cuenta de', esEx:'Por fin entendí el problema.', enEx:'I finally figured out the problem.'},
  {en:'find out', es:'descubrir; averiguar', esEx:'Descubrimos que había ganado.', enEx:'We found out she had won.'},
  {en:'genius', es:'genio', esEx:'Einstein fue un genio.', enEx:'Einstein was a genius.'},
  {en:'gifted', es:'talentoso/a', esEx:'Es un alumno talentoso.', enEx:'He is a gifted student.'},
  {en:'hidden', es:'oculto/a', esEx:'El tesoro estaba oculto.', enEx:'The treasure was hidden.'},
  {en:'high-rise', es:'de muchos pisos', esEx:'Trabaja en un edificio de muchos pisos.', enEx:'He works in a high-rise building.'},
  {en:'inhabitant', es:'habitante', esEx:'Los habitantes son amables.', enEx:'The inhabitants are friendly.'},
  {en:'landmark', es:'lugar/monumento famoso', esEx:'Es un monumento famoso de la ciudad.', enEx:'It is a famous landmark in the city.'},
  {en:'lift', es:'ascensor', esEx:'El ascensor está averiado.', enEx:'The lift is out of order.'},
  {en:'make the most of', es:'aprovechar al máximo', esEx:'Aprovecha al máximo el tiempo.', enEx:'Make the most of your time.'},
  {en:'melt', es:'derretir(se)', esEx:'El hielo se derrite al sol.', enEx:'Ice melts in the sun.'},
  {en:'multitasking', es:'(hacer) multitarea', esEx:'Hacer multitarea reduce la concentración.', enEx:'Multitasking reduces concentration.'},
  {en:'natural leader', es:'líder por naturaleza', esEx:'Ella es una líder innata.', enEx:'She is a natural leader.'},
  {en:'office block', es:'bloque de oficinas', esEx:'Se mudaron a un bloque de oficinas.', enEx:'They moved to an office block.'},
  {en:'operate', es:'manejar; funcionar', esEx:'¿Sabes manejar esta máquina?', enEx:'Do you know how to operate this machine?'},
  {en:'outstanding', es:'excepcional', esEx:'Su trabajo fue excepcional.', enEx:'Her work was outstanding.'},
  {en:'property', es:'propiedad, terreno', esEx:'Compraron una gran propiedad.', enEx:'They bought a large property.'},
  {en:'pull down', es:'derribar', esEx:'Van a derribar el edificio.', enEx:'They are going to pull down the building.'},
  {en:'put up', es:'construir', esEx:'Construyeron un hospital nuevo.', enEx:'They put up a new hospital.'},
  {en:'remove', es:'quitar(se)', esEx:'Quitaron los carteles viejos.', enEx:'They removed the old posters.'},
  {en:'sensitive', es:'sensible', esEx:'Es muy sensible con las críticas.', enEx:'She is very sensitive to criticism.'},
  {en:'skyscraper', es:'rascacielos', esEx:'La ciudad tiene rascacielos modernos.', enEx:'The city has modern skyscrapers.'},
  {en:'spill', es:'derramar(se)', esEx:'No derrames el café.', enEx:'Do not spill the coffee.'},
  {en:'spread out', es:'extendido/a', esEx:'Las casas están extendidas por el valle.', enEx:'The houses are spread out across the valley.'},
  {en:'steel', es:'acero', esEx:'El puente es de acero.', enEx:'The bridge is made of steel.'},
  {en:'stick to', es:'pegarse a; ceñirse a', esEx:'Cumple el plan y cíñete a él.', enEx:'Follow the plan and stick to it.'},
  {en:'storey', es:'piso, planta', esEx:'El edificio tiene 20 pisos.', enEx:'The building has 20 storeys.'},
  {en:'strength', es:'punto fuerte', esEx:'La comunicación es su punto fuerte.', enEx:'Communication is her strength.'},
  {en:'successful', es:'exitoso/a', esEx:'Fue exitoso con su negocio.', enEx:'He was successful with his business.'},
  {en:'surround', es:'rodear', esEx:'La ciudad está rodeada de montañas.', enEx:'The city is surrounded by mountains.'},
  {en:'take for granted', es:'dar por hecho', esEx:'No des por hecho tu salud.', enEx:'Do not take your health for granted.'},
  {en:'turn into', es:'convertir(se) en', esEx:'La oruga se convierte en mariposa.', enEx:'The caterpillar turns into a butterfly.'},
  {en:'valuable', es:'valioso/a', esEx:'Es un consejo muy valioso.', enEx:'It is very valuable advice.'},
  {en:'warn', es:'advertir, avisar', esEx:'Me advirtió del peligro.', enEx:'He warned me about the danger.'},
  {en:'weakness', es:'punto débil', esEx:'Reconoce tu punto débil.', enEx:'Recognize your weakness.'},
  {en:'well-liked', es:'querido/a', esEx:'Es una profesora muy querida.', enEx:'She is a well-liked teacher.'},
  {en:'amazing', es:'asombroso/a', esEx:'La vista era asombrosa.', enEx:'The view was amazing.'},
  {en:'outstanding (adj)', es:'excepcional', esEx:'Un logro excepcional.', enEx:'An outstanding achievement.'},
  {en:'remarkable', es:'notable', esEx:'Hizo un progreso notable.', enEx:'She made remarkable progress.'},
  {en:'fantastic', es:'fantástico/a', esEx:'Fue un concierto fantástico.', enEx:'It was a fantastic concert.'},
  {en:'incredible', es:'increíble', esEx:'Una historia increíble.', enEx:'An incredible story.'},
  {en:'unbelievable', es:'increíble (difícil de creer)', esEx:'Resultados difíciles de creer.', enEx:'Unbelievable results.'},
  {en:'a close relationship', es:'relación estrecha', esEx:'Tienen una relación estrecha.', enEx:'They have a close relationship.'},
  {en:'a close shave', es:'un susto por poco', esEx:'Fue un susto por poco.', enEx:'It was a close shave.'},
  {en:'at close range', es:'a corta distancia', esEx:'Lo vio a corta distancia.', enEx:'He saw it at close range.'},
  {en:'close-up', es:'primer plano', esEx:'Hicieron un primer plano.', enEx:'They took a close-up.'},
  {en:'close at hand', es:'a mano', esEx:'Ten las llaves a mano.', enEx:'Keep the keys close at hand.'},
  {en:'close-knit', es:'muy unido/a', esEx:'Una familia muy unida.', enEx:'A close-knit family.'},
  {en:'advert', es:'anuncio', esEx:'Vi un anuncio en la tele.', enEx:'I saw an advert on TV.'},
  {en:'warning', es:'advertencia', esEx:'Ignoró la advertencia.', enEx:'He ignored the warning.'},
  {en:'advice', es:'consejo(s)', esEx:'Necesito tus consejos.', enEx:'I need your advice.'},
  {en:"prove one's point", es:'demostrar su argumento', esEx:'Intentó demostrar su argumento.', enEx:"He tried to prove his point."},
  {en:'make a point of', es:'esforzarse en; no dejar de', esEx:'Siempre se esfuerza en llegar puntual.', enEx:'She always makes a point of being on time.'},
  {en:'miss the point', es:'no entender la cuestión', esEx:'No entendiste la cuestión.', enEx:'You missed the point.'},
  {en:"there's no point in", es:'no tiene sentido', esEx:'No tiene sentido discutir.', enEx:"There is no point in arguing."},
  {en:'point of view', es:'punto de vista', esEx:'Respeto tu punto de vista.', enEx:'I respect your point of view.'},
  {en:'point out', es:'señalar; indicar', esEx:'Señaló el error.', enEx:'He pointed out the mistake.'},
  {en:'review', es:'reseña; repasar', esEx:'Escribió una reseña del libro.', enEx:'She wrote a book review.'},
  {en:'revision', es:'repaso', esEx:'Hice un repaso antes del examen.', enEx:'I did some revision before the exam.'}
];

// Bancos de ejercicios
const E1_MC = [
  { q:'She always ____ being on time.', opts:['make a point of','makes a point of','point out','close-up'], a:'makes a point of', exp:'3ª persona del singular: "makes a point of being on time".' },
  { q:'He managed to ____ the error before printing.', opts:['point out','miss the point','review','attach'], a:'point out', exp:'"point out" = señalar/indicar un error.' },
  { q:'They decided to ____ the old factory next month.', opts:['pull down','put up','lift','spread out'], a:'pull down', exp:'"pull down" = derribar un edificio.' },
  { q:'The council will ____ a new bridge over the river.', opts:['put up','pull down','warn','remove'], a:'put up', exp:'"put up" = construir/levantar.' },
  { q:'Please ____ the file to your email.', opts:['attach','attempt','review','operate'], a:'attach', exp:'"attach" = adjuntar un archivo.' },
  { q:'He couldn\'t ____ the problem, so he asked for help.', opts:['figure out','find out','stick to','melt'], a:'figure out', exp:'"figure out" = entender/descubrir cómo se hace.' },
  { q:'We need to ____ whether the rumor is true.', opts:['find out','figure out','warn','contain'], a:'find out', exp:'"find out" = averiguar/descubrir.' },
  { q:'The building has twenty ____.', opts:['storeys','skyscraper','brick','facilities'], a:'storeys', exp:'"storeys" = pisos/plantas.' },
  { q:'The floor is made of ____.', opts:['concrete','steel','brick','advice'], a:'concrete', exp:'"concrete" = hormigón.' },
  { q:'The bridge structure uses stainless ____.', opts:['steel','brick','advice','warning'], a:'steel', exp:'"steel" = acero.' },
  { q:'She is a ____ teacher and students respect her.', opts:['natural leader','inhabitant','landmark','lift'], a:'natural leader', exp:'"natural leader" = líder por naturaleza.' },
  { q:'This is the city\'s most famous ____.', opts:['landmark','block of flats','office block','warning'], a:'landmark', exp:'"landmark" = monumento/lugar famoso.' },
  { q:'Please ____ your shoes before entering the room.', opts:['remove','operate','review','warn'], a:'remove', exp:'"remove" = quitar/retirar.' },
  { q:'Try not to ____.', opts:['spill','melt','attach','surround'], a:'spill', exp:'"spill" = derramar.' },
  { q:'The houses ____ across the valley.', opts:['are spread out','take for granted','turn into','stick to'], a:'are spread out', exp:'"spread out" = estar extendidas.' },
  { q:'If you ignore the context, you completely ____.', opts:['miss the point','make a point of','point out','warn'], a:'miss the point', exp:'"miss the point" = no entender la cuestión.' },
  { q:'He tried to ____ during the debate.', opts:["prove his point",'advert','warning','review'], a:"prove his point", exp:'Modismo: "prove one\'s point" en contexto de debate.' },
  { q:'There is ____ arguing with him; he never listens.', opts:["no point in",'advice','a close shave','remarkable'], a:"no point in", exp:'"There is no point in …" = no tiene sentido.' },
  { q:'Let's ____ this new café downtown.', opts:['check (something) out','operate','attach','inhabitant'], a:'check (something) out', exp:'"check out" = mirar/probar un sitio.' },
  { q:'The company moved to a modern ____.', opts:['office block','block of flats','skyscraper','landmark'], a:'office block', exp:'"office block" = bloque de oficinas.' },
  { q:'He lives in a ____, not a detached house.', opts:['block of flats','close-knit','review','warning'], a:'block of flats', exp:'"block of flats" = bloque de pisos.' },
  { q:'The city is ____ by mountains.', opts:['surrounded','contained','removed','attached'], a:'surrounded', exp:'Pasiva de "surround" = rodear.' },
  { q:'Don\'t ____ your family for granted; you never know how long you’ll have them.', opts:['take','turn into','stick to','attempt'], a:'take for granted', exp:'"take for granted" = dar por hecho.' },
  { q:'Ice ____ when the temperature rises.', opts:['melts','removes','spills','attaches'], a:'melts', exp:'3ª persona de "melt".' },
  { q:'She is very ____ to criticism.', opts:['sensitive','successful','well-liked','gifted'], a:'sensitive', exp:'"sensitive to" = sensible a.' },
  { q:'Her work was truly ____.', opts:['outstanding','warning','advice','review'], a:'outstanding', exp:'"outstanding" = excepcional.' },
  { q:'He was ____ with his new business.', opts:['successful','amazing','incredible','remarkable'], a:'successful', exp:'"successful" = exitoso.' },
  { q:'They plan to ____ a pedestrian bridge downtown.', opts:['put up','pull down','warn','remove'], a:'put up', exp:'"put up" = construir.' },
  { q:'Keep the manual ____, just in case.', opts:['close at hand','close-up','a close shave','close-knit'], a:'close at hand', exp:'"close at hand" = a mano.' },
  { q:'The rescue was ____, but everyone was fine.', opts:['a close shave','point of view','advert','revision'], a:'a close shave', exp:'"a close shave" = por los pelos.' },
  { q:'Let me share my ____ on this topic.', opts:['point of view','warning','advice','review'], a:'point of view', exp:'"point of view" = punto de vista.' }
];

const E2_FILL = [
  { q:'Please ____ the file to your message. (adjuntar)', a:[ 'attach' ] },
  { q:'We finally ____ how to fix it. (entender)', a:[ 'figured out','figure out' ] },
  { q:'They want to ____ the old bridge. (derribar)', a:[ 'pull down' ] },
  { q:'They will ____ a new sports hall. (construir)', a:[ 'put up','build' ] },
  { q:'The box ____ two laptops. (contener)', a:[ 'contains','contain' ] },
  { q:'New York has many ____. (rascacielos)', a:[ 'skyscrapers','skyscraper' ] },
  { q:'Keep the keys ____. (a mano)', a:[ 'close at hand' ] },
  { q:'She always ____ being polite. (esforzarse en)', a:[ 'makes a point of','make a point of' ] },
  { q:'There is ____ arguing now. (no tiene sentido)', a:[ 'no point in' ] },
  { q:'He ____ the mistake quickly. (señalar)', a:[ 'pointed out','point out' ] },
  { q:'The gym has great ____. (instalaciones)', a:[ 'facilities' ] },
  { q:'This bridge is made of ____. (acero)', a:[ 'steel' ] },
  { q:'The houses are ____. (extendidas)', a:[ 'spread out' ] },
  { q:'He tried to ____ with evidence. (demostrar su argumento)', a:[ "prove his point","prove one's point","prove their point" ] },
  { q:'She is very ____. (sensible)', a:[ 'sensitive' ] },
  { q:'He is a ____. (líder por naturaleza)', a:[ 'natural leader' ] },
  { q:'I need your ____. (consejos)', a:[ 'advice' ] },
  { q:'She wrote a film ____. (reseña)', a:[ 'review' ] },
  { q:'I did my ____. (repaso)', a:[ 'revision' ] },
  { q:'They live in a ____. (bloque de pisos)', a:[ 'block of flats' ] },
  { q:'Please do not ____. (derramar)', a:[ 'spill' ] },
  { q:'The ____ is broken. (ascensor)', a:[ 'lift','elevator' ] },
  { q:'He is a very ____ student. (talentoso)', a:[ 'gifted' ] },
  { q:'This was an ____ achievement. (excepcional)', a:[ 'outstanding','remarkable','amazing','incredible','fantastic','unbelievable' ] },
  { q:'The city is ____ by hills. (rodeada)', a:[ 'surrounded','surround' ] },
  { q:'Don\'t ____ your friends. (dar por hecho)', a:[ 'take for granted' ] },
  { q:'The caterpillar ____ a butterfly. (convertirse en)', a:[ 'turns into','turn into' ] },
  { q:'The building has twenty ____. (pisos)', a:[ 'storeys','stories','floors' ] },
  { q:'He tried to ____ the machine. (manejar)', a:[ 'operate' ] },
  { q:'We ____ eating pizza. (terminar)', a:[ 'ended up','end up' ] }
];

const E3_REL = [
  { es:'La mujer que vive aquí es arquitecta.', en:[
    'The woman who lives here is an architect',
    'The woman that lives here is an architect'
  ]},
  { es:'El profesor, que es muy querido, nos ayudó.', en:[
    'The teacher, who is well-liked, helped us',
    'The teacher who is well-liked helped us' // también válida sin comas si se interpreta como definitoria
  ]},
  { es:'El puente, que es de acero, es un hito de la ciudad.', en:[
    'The bridge, which is made of steel, is a city landmark',
    'The bridge, which is made of steel, is a landmark of the city'
  ]},
  { es:'El libro que compré ayer es increíble.', en:[
    'The book which I bought yesterday is incredible',
    'The book that I bought yesterday is incredible',
    'The book I bought yesterday is incredible'
  ]},
  { es:'El ingeniero cuyo proyecto fue aprobado trabaja aquí.', en:[
    'The engineer whose project was approved works here'
  ]},
  { es:'El barrio donde vivimos tiene buenas instalaciones.', en:[
    'The neighborhood where we live has good facilities',
    'The neighbourhood where we live has good facilities'
  ]},
  { es:'El día cuando terminaron la obra fue soleado.', en:[
    'The day when they finished the construction was sunny',
    'The day they finished the construction was sunny',
    'The day on which they finished the construction was sunny'
  ]},
  { es:'No entiendo la razón por la que derribaron el edificio.', en:[
    'I do not understand the reason why they pulled down the building',
    'I do not understand the reason they pulled down the building',
    "I don't understand why they pulled down the building"
  ]},
  { es:'Ese es el rascacielos que construyeron el año pasado.', en:[
    'That is the skyscraper which they put up last year',
    'That is the skyscraper that they put up last year',
    'That is the skyscraper they put up last year',
    'That is the skyscraper they built last year'
  ]},
  { es:'La persona a la que advertí no me escuchó.', en:[
    'The person whom I warned did not listen to me',
    'The person who I warned did not listen to me',
    'The person I warned did not listen to me'
  ]},
  { es:'La fábrica que derribaron contenía maquinaria antigua.', en:[
    'The factory which they pulled down contained old machinery',
    'The factory that they pulled down contained old machinery',
    'The factory they pulled down contained old machinery'
  ]},
  { es:'El edificio cuyo ascensor está roto tiene veinte plantas.', en:[
    'The building whose lift is broken has twenty storeys',
    'The building whose elevator is broken has twenty stories',
    'The building whose lift is broken has twenty floors'
  ]},
  { es:'Los habitantes que viven allí son muy amables.', en:[
    'The inhabitants who live there are very friendly',
    'The inhabitants that live there are very friendly'
  ]},
  { es:'El bloque de pisos donde viven es de muchos pisos.', en:[
    'The block of flats where they live is high-rise',
    'The block of flats where they live is a high-rise building',
    'The apartment building where they live is high-rise'
  ]},
  { es:'El monumento que señalaron es valioso para la ciudad.', en:[
    'The landmark which they pointed out is valuable to the city',
    'The landmark that they pointed out is valuable to the city',
    'The landmark they pointed out is valuable to the city'
  ]},
  { es:'La familia, que es muy unida, vive cerca.', en:[
    'The family, which is very close-knit, lives nearby',
    'The family, who are very close-knit, live nearby'
  ]},
  { es:'La razón por la que no discutimos es que no tiene sentido.', en:[
    'The reason why we do not argue is that there is no point in it',
    'The reason we do not argue is that there is no point in it',
    "The reason we don’t argue is that there’s no point in it"
  ]},
  { es:'El ingeniero que dirige la obra es un líder por naturaleza.', en:[
    'The engineer who leads the project is a natural leader',
    'The engineer that leads the project is a natural leader'
  ]},
  { es:'El edificio que construyeron está rodeado de montañas.', en:[
    'The building which they put up is surrounded by mountains',
    'The building that they put up is surrounded by mountains',
    'The building they put up is surrounded by mountains',
    'The building they built is surrounded by mountains'
  ]},
  { es:'La etiqueta que se pega al cristal no se quita fácilmente.', en:[
    'The label which sticks to the glass does not remove easily',
    'The label that sticks to the glass does not remove easily',
    'The label sticking to the glass does not remove easily',
    'The sticker that sticks to the glass is not easy to remove'
  ]}
];


// Navegación
function go(id){
  ['home','flashcards','exercises','exerciseBox','scores'].forEach(s => {
    document.getElementById(s).style.display = (s===id?'block':'none');
  });
  $$('.top button').forEach(b=>b.classList.toggle('active', b.dataset.go===id || (id==='home' && b.dataset.go==='home')));
}
$$('.top button').forEach(b=>{
  b.addEventListener('click',()=>{
    if(b.dataset.go) go(b.dataset.go);
  });
});

// Inicio
$('#startBtn').addEventListener('click', ()=>{
  state.student.first = $('#firstName').value.trim();
  state.student.last = $('#lastName').value.trim();
  state.student.course = $('#course').value || '4ESO';
  if(!state.student.first || !state.student.last){
    alert('Por favor, escribe nombre y apellido.');
    return;
  }
  $('#studentLine').textContent = `Alumno: ${state.student.first} ${state.student.last} • Curso: ${state.student.course}`;
  go('flashcards');
  updateScoresUI();
});

// Flashcards
function resetFlashcards(){
  state.fcOrder = VOCAB.map((_,i)=>i);
  state.fcIndex = 0;
  renderFlashcard();
}
function renderFlashcard(){
  const i = state.fcOrder[state.fcIndex] ?? 0;
  const v = VOCAB[i];
  $('#fcCounter').textContent = `${state.fcIndex+1} / ${VOCAB.length}`;
  $('#flashFront').style.display='block';
  $('#flashBack').style.display='none';
  $('#fcEs').textContent = v.es;
  $('#fcEsEx').textContent = v.esEx;
  $('#fcEn').textContent = v.en;
  $('#fcEnEx').textContent = v.enEx;
}
$('#flashcard').addEventListener('click', ()=>{
  const front = $('#flashFront').style.display!=='none';
  $('#flashFront').style.display = front?'none':'block';
  $('#flashBack').style.display = front?'block':'none';
});
$('#flipCard').addEventListener('click', ()=>$('#flashcard').click());
$('#prevCard').addEventListener('click', ()=>{ if(state.fcIndex>0){ state.fcIndex--; renderFlashcard(); } });
$('#nextCard').addEventListener('click', ()=>{ if(state.fcIndex<VOCAB.length-1){ state.fcIndex++; renderFlashcard(); } });
$('#shuffleBtn').addEventListener('click', ()=>{ state.fcOrder = shuffle(state.fcOrder); state.fcIndex = 0; renderFlashcard(); });
$('#resetBtn').addEventListener('click', resetFlashcards);

// Ejercicios
let currentEx = null; // 'mc' | 'fill' | 'rel'
let exIndex = 0;
let exBank = [];
let exScore = 0;

function startExercise(kind){
  currentEx = kind;
  exIndex = 0;
  exScore = 0;
  const N = (kind==='mc'?30:(kind==='fill'?30:20));
  if(kind==='mc'){ exBank = shuffle(E1_MC).slice(0, N); }
  else if(kind==='fill'){ exBank = shuffle(E2_FILL).slice(0, N); }
  else { exBank = shuffle(E3_REL).slice(0, N); }
  go('exerciseBox');
  $('#exLabel').textContent =
    kind==='mc' ? 'Ejercicio 1 — Multiple Choice' :
    kind==='fill' ? 'Ejercicio 2 — Fill Blanks' :
    'Ejercicio 3 — Relativos';
  renderExercise();
}
$$('#exercises .btn').forEach(b=>{
  b.addEventListener('click', ()=>{
    const kind = b.dataset.start;
    if(kind) startExercise(kind);
  });
});

function setFeedback(ok, text){
  const el = $('#exFeedback');
  el.innerHTML = text;
  el.style.color = ok ? '#065f46' : '#991b1b';
}

function renderExercise(){
  const total = exBank.length;
  $('#exCounter').textContent = `${exIndex+1} / ${total}`;
  setFeedback(true,'');
  const item = exBank[exIndex];

  if(currentEx==='mc'){
    $('#mcBox').style.display='block';
    $('#inputBox').style.display='none';
    $('#hintSpan').textContent='';
    $('#exQuestion').textContent = item.q;
    const box = $('#mcOptions');
    box.innerHTML = '';
    const opts = shuffle(item.opts.slice());
    opts.forEach(opt=>{
      const div = document.createElement('div');
      div.className = 'option';
      div.textContent = opt;
      div.addEventListener('click', ()=>{
        const correct = (opt===item.a);
        if(correct){ div.classList.add('correct'); setFeedback(true, '✔ Correcto'); exScore++; }
        else{ div.classList.add('wrong'); setFeedback(false, '✗ Incorrecto. Correcta: '+item.a+(item.exp?(' — '+item.exp):'')); }
        $$('.option').forEach(o=>o.style.pointerEvents='none');
        $('#nextMCBtn').style.display='inline-flex'; // <--- MUESTRA EL BOTÓN
        // setTimeout(nextStep, 650);
        
      });
      box.appendChild(div);
    });
  }else if(currentEx==='fill'){
    $('#mcBox').style.display='none';
    $('#inputBox').style.display='block';
    $('#exInput').value='';
    $('#exInput').focus();
    $('#hintSpan').textContent = '(Pista en español entre paréntesis)';
    $('#exQuestion').textContent = item.q;
  }else{
    $('#mcBox').style.display='none';
    $('#inputBox').style.display='block';
    $('#exInput').value='';
    $('#exInput').focus();
    $('#hintSpan').textContent = '(Relativos: who, which, whose, where, when, why; "that" cuando se permita; omitir relativo cuando se pueda)';
    $('#exQuestion').textContent = item.es;
  }
}

function checkInputAnswer(){
  const item = exBank[exIndex];
  const user = norm($('#exInput').value);
  let ok=false, explain='';
  if(currentEx==='fill'){
    const answers = item.a.map(norm);
    ok = answers.includes(user);
    if(!ok){ explain = '✗ Incorrecto. Posibles: '+item.a.join(' | '); }
  }else if(currentEx==='rel'){
    const answers = item.en.map(norm);
    ok = answers.includes(user);
    if(!ok){ explain = '✗ Incorrecto. Posibles: '+item.en.join(' | '); }
  }
  if(ok){ setFeedback(true,'✔ Correcto'); exScore++; }
  else{ setFeedback(false, explain); }

}
$('#submitAnswer').addEventListener('click', checkInputAnswer);
$('#skipBtn').addEventListener('click', nextStep);
$('#nextMCBtn').addEventListener('click', nextStep);  // <--- NUEVA LÍNEA
$('#quitExercise').addEventListener('click', ()=>go('exercises'));

function nextStep(){
  exIndex++;
  if(exIndex>=exBank.length){
    const pct = Math.round((exScore/exBank.length)*100);
    if(currentEx==='mc') state.scores.mc = pct;
    if(currentEx==='fill') state.scores.fill = pct;
    if(currentEx==='rel') state.scores.rel = pct;
    updateScoresUI(true);
    go('scores');
    return;
  }
  renderExercise();
}

// Puntuaciones
function colored(valEl, pct){
  valEl.textContent = (pct==null?'—':pct+'%');
  valEl.classList.remove('red','green');
  if(pct==null) return;
  if(pct>=90){ valEl.classList.add('green'); }
  else{ valEl.classList.add('red'); }
}
function updateScoresUI(showMsg=false){
  $('#studentNameScore').innerHTML = '<strong style="font-weight:900">'+(state.student.first||'Alumno')+' '+(state.student.last||'')+'</strong>';
  $('#courseScore').textContent = state.student.course||'4ESO';
  colored($('#s1'), state.scores.mc);
  colored($('#s2'), state.scores.fill);
  colored($('#s3'), state.scores.rel);
  const vals = [state.scores.mc, state.scores.fill, state.scores.rel].filter(v=>v!=null);
  const avg = vals.length? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : null;
  colored($('#sAll'), avg);
  if(!showMsg){ $('#statusMsg').textContent=''; return; }
  const all = [state.scores.mc, state.scores.fill, state.scores.rel];
  const okAll = all.every(v=>v!=null && v>=90);
  const anyBad = all.some(v=>v!=null && v<90);
  if(anyBad){
    $('#statusMsg').innerHTML = '<span style="color:#b91c1c;font-weight:900">❌ No has alcanzado el nivel. Por favor, repite este ejercicio.</span>';
  }else if(okAll){
    $('#statusMsg').innerHTML = '<span style="color:#047857;font-weight:900">✅ ¡Felicidades! Has alcanzado el nivel.</span>';
  }else{
    $('#statusMsg').innerHTML = '<span class="muted">Completa todos los ejercicios para ver el estado final.</span>';
  }
}

// Inicialización
function init(){
  go('home');
  resetFlashcards();
  document.addEventListener('keydown', (e)=>{
    if(document.getElementById('flashcards').style.display==='block'){
      if(e.code==='Space'){ e.preventDefault(); $('#flashcard').click(); }
      if(e.key==='ArrowLeft'){ $('#prevCard').click(); }
      if(e.key==='ArrowRight'){ $('#nextCard').click(); }
    }
    if(e.key==='Enter' && $('#exerciseBox').style.display==='block' && $('#inputBox').style.display==='block'){
      e.preventDefault(); $('#submitAnswer').click();
    }
  });
}
document.addEventListener('DOMContentLoaded', init);
