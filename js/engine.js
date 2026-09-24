(function(){
  var A = window.Arena = window.Arena || {};

  function rand(n){ return Math.floor(Math.random() * n); }
  function choice(arr){ return arr[rand(arr.length)]; }
  function shuffle(arr){
    var a = arr.slice();
    for(var i = a.length - 1; i > 0; i--){ var j = rand(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function weightedChoice(pairs){
    var total = 0, i;
    for(i = 0; i < pairs.length; i++) total += pairs[i][0];
    var r = Math.random() * total;
    for(i = 0; i < pairs.length; i++){
      if(r < pairs[i][0]) return pairs[i][1];
      r -= pairs[i][0];
    }
    return pairs[pairs.length - 1][1];
  }
  function g(t, m, f){ return t.gender === 'chica' ? f : m; }
  function look(t){
    var eyes = A.eyesOf(t.eyes);
    var eyeText = t.eyes === 'avellana' ? 'color avellana' : eyes.label.toLowerCase();
    return 'de pelo ' + A.hairOf(t.hair).label.toLowerCase() + ' y ojos ' + eyeText;
  }
  function joinNames(names){
    if(names.length <= 1) return names.join('');
    return names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1];
  }

  var TPL = {
    explore: [
      function(a){ return a+' avanza entre la maleza, memorizando cada sonido de la arena.'; },
      function(a){ return a+' pasa la jornada oculto en lo alto de un árbol, vigilando el terreno.'; },
      function(a){ return a+' recorre el perímetro buscando una salida que no existe.'; },
      function(a){ return a+' raciona el agua que le queda y sigue adelante en silencio.'; },
      function(a){ return a+' levanta un refugio improvisado antes de que caiga la noche.'; },
      function(a){ return a+' decide alejarse de la Cornucopia y busca refugio en las colinas.'; },
      function(a){ return a+' camina en círculos durante horas, sin lograr orientarse.'; },
      function(a){ return a+' enciende una hoguera pequeña, con cuidado de no llamar la atención.'; }
    ],
    find_item: [
      function(a){ return a+' encuentra un cuchillo oxidado entre las rocas.'; },
      function(a){ return 'Un paracaídas plateado cae del cielo: los patrocinadores no se olvidan de '+a+'.'; },
      function(a){ return a+' descubre una cantimplora medio llena junto a un tronco caído.'; },
      function(a){ return a+' recupera una mochila abandonada con provisiones para varios días.'; },
      function(a){ return a+' da con un botiquín improvisado y aprovecha para curar sus heridas.'; },
      function(a){ return 'Los patrocinadores premian la estrategia de '+a+' con un pequeño envío de comida.'; }
    ],
    hide: [
      function(a){ return a+' se esconde en una cueva y contiene la respiración al oír pasos cercanos.'; },
      function(a){ return a+' se cubre de barro y hojas para desaparecer entre la maleza.'; },
      function(a){ return a+' pasa la noche entera inmóvil, esperando que el peligro se aleje.'; },
      function(a){ return a+' se refugia entre las rocas altas, lejos de cualquier sendero.'; }
    ],
    injured: [
      function(a){ return a+' sufre una caída por un barranco, pero logra seguir adelante.'; },
      function(a){ return 'Unas zarzas dejan a '+a+' con heridas superficiales, aunque sigue con vida.'; },
      function(a){ return a+' cae en una trampa improvisada, pero consigue liberarse a tiempo.'; },
      function(a){ return a+' pasa la noche con fiebre, pero al amanecer sigue en pie.'; }
    ],
    death_accident: [
      function(a){ return a+' no logra esquivar una trampa oculta entre la hojarasca y muere en el acto.'; },
      function(a){ return a+' cae por un risco durante la noche, en busca de agua.'; },
      function(a){ return 'Una criatura de la arena sorprende a '+a+', que no llega a reaccionar a tiempo.'; },
      function(a){ return a+' bebe de un manantial contaminado y no vuelve a levantarse.'; },
      function(a){ return 'El suelo cede bajo '+a+', que desaparece en un pozo oculto entre la maleza.'; },
      function(a){ return 'Un enjambre furioso alcanza a '+a+' antes de que pueda ponerse a salvo.'; }
    ],
    death_illness: [
      function(a){ return 'La fiebre que arrastraba '+a+' desde hace días resulta mortal.'; },
      function(a){ return a+' sucumbe a una infección que nadie llegó a tratar.'; },
      function(a){ return 'El frío de la noche termina con las fuerzas que le quedaban a '+a+'.'; },
      function(a){ return a+' colapsa de agotamiento y no vuelve a despertar.'; }
    ],
    meet_alliance: [
      function(a,b){ return a+' y '+b+' deciden unir fuerzas tras cruzarse junto al río.'; },
      function(a,b){ return 'Con más posibilidades juntos que por separado, '+a+' y '+b+' sellan una alianza.'; },
      function(a,b){ return a+' propone una tregua a '+b+', que acepta compartir camino.'; },
      function(a,b){ return a+' y '+b+' deciden vigilarse las espaldas mutuamente, al menos por ahora.'; }
    ],
    meet_romance: [
      function(a,b){ return 'Algo cambia entre '+a+' y '+b+' cuando comparten el último trozo de pan.'; },
      function(a,b){ return 'En medio del peligro, '+a+' y '+b+' encuentran un momento de calma el uno junto al otro.'; },
      function(a,b){ return a+' y '+b+' se sorprenden buscando la compañía del otro más de lo esperado.'; },
      function(a,b){ return 'Una mirada entre '+a+' y '+b+' dice más de lo que ninguno se atreve a admitir.'; }
    ],
    ignore: [
      function(a,b){ return a+' y '+b+' se cruzan de lejos y deciden que no vale la pena el riesgo.'; },
      function(a,b){ return a+' avista a '+b+' a lo lejos, pero prefiere no arriesgarse y sigue su camino.'; },
      function(a,b){ return a+' y '+b+' se estudian desde la distancia antes de alejarse cada uno por su lado.'; },
      function(a,b){ return a+' podría atacar a '+b+', pero decide que no merece la pena gastar energía.'; }
    ],
    fight_death: [
      function(w,l){ return w+' y '+l+' se enfrentan cuerpo a cuerpo; solo '+w+' sale con vida.'; },
      function(w,l){ return 'Tras un choque breve y violento, '+w+' logra imponerse sobre '+l+'.'; },
      function(w,l){ return w+' sorprende a '+l+' por la espalda y no le da ninguna oportunidad.'; },
      function(w,l){ return 'El enfrentamiento entre '+w+' y '+l+' termina rápido: '+l+' no lo cuenta.'; }
    ],
    fight_survive: [
      function(a,b){ return a+' y '+b+' chocan brevemente, pero ambos logran escapar con heridas leves.'; },
      function(a,b){ return a+' se enfrenta a '+b+', aunque el cansancio impide que ninguno remate al otro.'; },
      function(a,b){ return a+' y '+b+' se enfrentan entre las rocas, pero terminan huyendo cada uno por su lado.'; },
      function(a,b){ return 'El choque entre '+a+' y '+b+' queda en tablas: ninguno se atreve a rematar al otro.'; }
    ],
    ally_bond: [
      function(a,b){ return a+' y '+b+' refuerzan su alianza compartiendo turnos de guardia durante la noche.'; },
      function(a,b){ return 'La confianza entre '+a+' y '+b+' crece tras superar juntos otro día más.'; },
      function(a,b){ return a+' y '+b+' planean juntos su próximo movimiento en la arena.'; }
    ],
    ally_success: [
      function(a,b){ return 'Trabajando en equipo, '+a+' y '+b+' consiguen provisiones para varios días.'; },
      function(a,b){ return a+' y '+b+' sobreviven otra jornada gracias a que se cubren las espaldas.'; },
      function(a,b){ return 'La alianza entre '+a+' y '+b+' demuestra su valor una vez más.'; }
    ],
    betrayal: [
      function(k,v){ return 'La alianza termina en tragedia: '+k+' acaba con la vida de '+v+' mientras duerme.'; },
      function(k,v){ return k+' decide que ya no necesita a '+v+' y pone fin a la alianza de la peor manera.'; },
      function(k,v){ return 'Sin previo aviso, '+k+' rompe la alianza atacando a '+v+' por sorpresa.'; },
      function(k,v){ return k+' aprovecha un descuido de '+v+' para asegurarse un enemigo menos.'; }
    ],
    betrayal_failed_fallback: [
      function(a,b){ return a+' intenta traicionar a '+b+', pero algo sale mal y ambos terminan huyendo por separado.'; }
    ],
    become_lovers: [
      function(a,b){ return 'Lo que empezó como alianza se convierte en algo más entre '+a+' y '+b+'.'; },
      function(a,b){ return 'Entre turno y turno de guardia, '+a+' y '+b+' se dan cuenta de que sienten algo más.'; },
      function(a,b){ return a+' y '+b+' deciden que, pase lo que pase, quieren afrontarlo juntos.'; }
    ],
    ally_split: [
      function(a,b){ return a+' y '+b+' deciden separarse: cada uno tendrá más posibilidades por su cuenta.'; },
      function(a,b){ return 'La alianza entre '+a+' y '+b+' se disuelve sin rencores, al menos por ahora.'; },
      function(a,b){ return a+' y '+b+' discuten sobre la estrategia a seguir y terminan tomando caminos distintos.'; }
    ],
    romance_moment: [
      function(a,b){ return a+' y '+b+' roban un instante de calma junto al fuego, lejos del peligro.'; },
      function(a,b){ return 'En medio del caos, '+a+' y '+b+' encuentran consuelo el uno en el otro.'; },
      function(a,b){ return a+' y '+b+' prometen que, si uno cae, el otro seguirá luchando por los dos.'; }
    ],
    romance_success: [
      function(a,b){ return a+' y '+b+' sobreviven otra jornada más, cada vez más unidos.'; },
      function(a,b){ return 'Juntos, '+a+' y '+b+' consiguen esquivar el peligro una vez más.'; }
    ],
    romance_protect: [
      function(p,s){ return p+' se interpone entre '+s+' y el peligro. La arena se cobra su vida, pero '+s+' sigue en pie.'; },
      function(p,s){ return 'En el último instante, '+p+' empuja a '+s+' fuera de peligro, pagando el precio.'; },
      function(p,s){ return p+' elige salvar a '+s+' antes que a sí mismo, y la arena no perdona esa elección.'; }
    ],
    romance_protect_fallback: [
      function(a,b){ return a+' intenta proteger a '+b+' del peligro, y esta vez la arena decide perdonarlos a ambos.'; }
    ],
    jealousy_betrayal: [
      function(k,v){ return 'Los celos pueden más que el amor: '+k+' termina con la vida de '+v+' mientras duerme.'; },
      function(k,v){ return 'Unos rumores de traición bastan para que '+k+' decida golpear primero contra '+v+'.'; },
      function(k,v){ return 'El amor se convierte en arma: '+k+' elimina a '+v+' antes de que puedan separarlos.'; }
    ],
    jealousy_fallback: [
      function(a,b){ return 'Los celos casi cuestan caro entre '+a+' y '+b+', pero ninguno se atreve a dar el golpe final.'; }
    ],
    group_alliance: [
      function(a,b,c){ return a+', '+b+' y '+c+' sellan una alianza junto al fuego: cazarán en equipo mientras dure la tregua.'; },
      function(a,b,c){ return 'Tres cabezas piensan mejor que una: '+a+', '+b+' y '+c+' deciden unir fuerzas.'; },
      function(a,b,c){ return a+', '+b+' y '+c+' acuerdan turnarse la vigilancia y compartir lo que encuentren.'; }
    ],
    group_success: [
      function(a,b,c){ return a+', '+b+' y '+c+' pasan la jornada juntos, cubriéndose las espaldas sin incidentes.'; },
      function(a,b,c){ return 'El trío formado por '+a+', '+b+' y '+c+' consigue avanzar sin sobresaltos.'; }
    ],
    group_none: [
      function(a,b,c){ return a+', '+b+' y '+c+' coinciden en la misma zona, pero cada uno sigue su propio camino.'; },
      function(a,b,c){ return 'Nada de interés ocurre entre '+a+', '+b+' y '+c+' durante esta jornada.'; }
    ],
    group_split: [
      function(a,b,c){ return 'Las tensiones entre '+a+', '+b+' y '+c+' terminan por romper cualquier acuerdo entre ellos.'; },
      function(a,b,c){ return a+', '+b+' y '+c+' ya no confían entre sí y deciden separarse antes de que sea tarde.'; }
    ],
    group_ambush_internal: [
      function(k,al,v){ return 'El grupo formado por '+v+', '+k+' y '+al+' se rompe cuando '+k+' decide que dos bocas que alimentar son demasiadas y ataca a '+v+'.'; },
      function(k,al,v){ return k+' aprovecha la noche para acabar con '+v+' mientras '+al+' mira hacia otro lado.'; },
      function(k,al,v){ return 'Sin que '+al+' pueda evitarlo, '+k+' se vuelve contra '+v+' y pone fin a la alianza de golpe.'; }
    ],
    group_ambush_external: [
      function(s1,s2,v){ return 'Una trampa colectiva sorprende al grupo: '+s1+' y '+s2+' logran escapar, pero '+v+' no corre la misma suerte.'; },
      function(s1,s2,v){ return 'Algo ataca desde la oscuridad. '+s1+' y '+s2+' consiguen huir; '+v+' se queda atrás para siempre.'; },
      function(s1,s2,v){ return 'El terreno se vuelve trampa mortal: '+s1+' y '+s2+' sobreviven de milagro, '+v+' no tiene la misma suerte.'; }
    ],
    ambush_escape_fallback: [
      function(a,b,c){ return 'El peligro roza a '+a+', '+b+' y '+c+', pero los tres logran escapar con vida esta vez.'; }
    ],
    final_duel: [
      function(w,l){ return 'Solo quedan '+w+' y '+l+'. Tras un choque final, '+w+' es quien logra sobrevivir.'; },
      function(w,l){ return w+' y '+l+' se encuentran cara a cara por última vez. Cuando todo termina, solo '+w+' sigue en pie.'; },
      function(w,l){ return 'El destino de la arena se decide entre '+w+' y '+l+'. '+w+' se alza con la victoria.'; }
    ],
    bloodbath_announce: [ 'Comienza el baño de sangre en la Cornucopia. Los primeros minutos serán decisivos.' ],
    feast_announce: [ 'Se convoca un festín junto a la Cornucopia. La tentación de unos buenos suministros puede costar caro.' ],
    victory: [ function(w){ return w+' lo ha conseguido. La arena por fin calla.'; } ]
  };


  Object.keys(TPL).forEach(function(key){
    TPL[key] = TPL[key].map(function(fn){
      if(typeof fn !== 'function') return fn;
      return function(){
        var names = [];
        for(var i = 0; i < arguments.length; i++) names.push(arguments[i].name);
        return fn.apply(null, names);
      };
    });
  });

  TPL.explore.push(
    function(t){ return t.name + ', ' + look(t) + ', avanza sin hacer ruido entre la maleza.'; },
    function(t){ return 'Con la mirada fija en el horizonte, ' + t.name + ' se mueve ' + g(t, 'solo', 'sola') + ' por la espesura.'; },
    function(t){ return g(t, 'El joven', 'La joven') + ' ' + t.name + ' encuentra un arroyo y bebe con cautela.'; }
  );
  TPL.find_item.push(
    function(t){ return 'Un paracaídas cae junto a ' + t.name + ': ' + g(t, 'el elegido', 'la elegida') + ' de los patrocinadores.'; }
  );
  TPL.injured.push(
    function(t){ return t.name + ' queda ' + g(t, 'herido', 'herida') + ' tras una mala caída, pero no se rinde.'; },
    function(t){ return 'Con una pierna dañada, ' + t.name + ' se arrastra hasta un refugio y sobrevive a la noche.'; }
  );
  TPL.death_accident.push(
    function(t){ return 'Nadie verá caer a ' + t.name + ': ' + g(t, 'el joven', 'la joven') + ' ' + look(t) + ' desaparece entre las sombras.'; },
    function(t){ return t.name + ' pisa donde no debía y la arena se cobra ' + g(t, 'al joven', 'a la joven') + '.'; }
  );
  TPL.death_illness.push(
    function(t){ return t.name + ', ' + g(t, 'agotado', 'agotada') + ' y sin fuerzas, cierra los ojos y no vuelve a abrirlos.'; }
  );
  TPL.fight_death.push(
    function(w, l){ return w.name + ' derriba a ' + l.name + ' y ' + g(l, 'lo deja tendido', 'la deja tendida') + ' para siempre.'; }
  );
  TPL.betrayal.push(
    function(k, v){ return k.name + ' traiciona a ' + v.name + ', que confiaba en ' + g(k, 'él', 'ella') + ' hasta el último segundo.'; }
  );
  TPL.romance_protect.push(
    function(p, s){ return p.name + ' da la vida por ' + s.name + '. ' + g(s, 'Él', 'Ella') + ' sobrevive, pero ya nada será igual.'; }
  );
  TPL.jealousy_betrayal.push(
    function(k, v){ return g(k, 'Cegado', 'Cegada') + ' por los celos, ' + k.name + ' ataca a ' + v.name + '.'; }
  );
  TPL.victory.push(
    function(t){ return t.name + ', ' + look(t) + ', sale ' + g(t, 'vivo', 'viva') + ' de la arena.'; },
    function(t){ return 'La arena calla. ' + t.name + ' es ' + g(t, 'el vencedor', 'la vencedora') + '.'; }
  );

  var CATEGORY_LABEL = {
    announcement: 'Aviso', death: 'Muerte', alliance: 'Alianza', romance: 'Amorío',
    item: 'Hallazgo', fight: 'Enfrentamiento', neutral: 'Crónica', victory: 'Victoria',
    theft: 'Robo', betrayal: 'Traición', heal: 'Auxilio', family: 'Familia'
  };

  var remainingAlive = 0;
  var currentDeaths = [];

  function safeKill(t, cause, round){
    if(t.baby) return false;
    if(remainingAlive <= 1) return false;
    t.alive = false; t.cause = cause; t.diedRound = round;
    remainingAlive -= 1;
    currentDeaths.push(t.id);
    return true;
  }
  function addAlly(a, b){
    if(a.allies.indexOf(b.id) === -1) a.allies.push(b.id);
    if(b.allies.indexOf(a.id) === -1) b.allies.push(a.id);
  }
  function removeAlly(a, b){
    a.allies = a.allies.filter(function(id){ return id !== b.id; });
    b.allies = b.allies.filter(function(id){ return id !== a.id; });
  }
  function setLovers(a, b){ a.loverId = b.id; b.loverId = a.id; }
  function pickDominant(a, b){
    var wa = a.kills + 1, wb = b.kills + 1;
    return (Math.random() * (wa + wb) < wa) ? [a, b] : [b, a];
  }
  function deathMultiplier(alive, isFirst, isFeast){
    var m = alive > 16 ? 2.7 : alive > 8 ? 2.1 : alive > 4 ? 1.5 : 1.7;
    if(isFirst) m *= 1.8;
    if(isFeast) m *= 1.5;
    return m;
  }
  function ev(type, text, members, scene, prop){
    return { type: type, text: text, ids: members.map(function(t){ return t.id; }), scene: scene, prop: prop };
  }

  var curGame = null;

  function isFree(t){
    if(!t.loverId) return true;
    var l = byId(curGame, t.loverId);
    return !l || !l.alive;
  }
  function relOf(m){
    if(m.length === 2){
      if(m[0].baby || m[1].baby) return 'family';
      if(m[0].loverId === m[1].id) return 'lover';
      if(sameTeam(m[0], m[1]) || m[0].allies.indexOf(m[1].id) !== -1) return 'ally';
      return 'stranger';
    }
    return 'group';
  }

  function fighters(game){ return game.tributes.filter(function(t){ return t.alive && !t.baby; }); }
  function teamMode(game){ return !!(game && (game.mode === 'equipos' || game.mode === 'parejas') && game.teams && game.teams.length); }
  function sameTeam(a, b){ return !!(a && b && a.team && a.team === b.team); }
  function teamById(game, id){
    if(!game || !game.teams) return null;
    for(var i = 0; i < game.teams.length; i++) if(game.teams[i].id === id) return game.teams[i];
    return null;
  }
  function teamLabel(team, lower){
    if(!team) return '';
    var art = lower ? team.art : team.art.charAt(0).toUpperCase() + team.art.slice(1);
    return art + ' ' + team.mascot;
  }
  function teamsAlive(list){
    var set = {};
    list.forEach(function(t){ if(t.team) set[t.team] = true; });
    return Object.keys(set).length;
  }
  function teamAliveCount(game, teamId){
    return game.tributes.filter(function(t){ return t.alive && !t.baby && t.team === teamId; }).length;
  }
  function edMod(type){
    var mods = curGame && curGame.emods;
    return mods && mods[type] ? mods[type] : 1;
  }
  function jit(k){
    if(!curGame) return 1;
    var j = curGame.jit || (curGame.jit = {});
    if(!(k in j)) j[k] = Math.round((0.35 + Math.random() * 1.6) * 100) / 100;
    return j[k];
  }
  function traitOf(t){ return t && t.trait && A.TRAITS ? A.TRAITS[t.trait] : null; }
  function traitMult(m, type){
    var sum = 0;
    m.forEach(function(t){ var tr = traitOf(t); sum += tr && tr.mods && tr.mods[type] ? tr.mods[type] : 1; });
    return sum / m.length;
  }
  function roleMult(t, key){ var tr = traitOf(t); return tr && tr[key] ? tr[key] : 1; }
  function babyCount(game){
    return game.tributes.filter(function(t){ return t.baby; }).length +
      game.tributes.filter(function(t){ return t.preg; }).length;
  }
  function babyName(a, b){
    var x = a.name.split(' ')[0], y = b.name.split(' ')[0];
    var n = x.slice(0, Math.ceil(x.length / 2)) + y.slice(Math.floor(y.length / 2)).toLowerCase();
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
  function createBaby(a, b){
    var baby = {
      id: 'baby-' + Date.now().toString(36) + rand(100000),
      name: babyName(a, b), gender: choice(['chico', 'chica']),
      hair: choice([a, b]).hair, eyes: choice([a, b]).eyes, skin: choice([a, b]).skin || 'claro', photo: null,
      alive: true, allies: [], loverId: null, kills: 0, item: null, diedRound: null, cause: null,
      baby: true, parents: [a.id, b.id], born: curGame.round, preg: null, team: a.team || null, teamColor: a.teamColor || null
    };
    curGame.tributes.push(baby);
    return baby;
  }
  function maybePregnant(a, b, p){
    if(a.gender === b.gender) return;
    var mother = a.gender === 'chica' ? a : b, father = mother === a ? b : a;
    if(mother.preg || mother.baby || father.baby) return;
    if(babyCount(curGame) >= 3) return;
    if(Math.random() < p) mother.preg = { by: father.id, due: curGame.round + 3 + rand(3), reveal: curGame.round + 1, revealed: false };
  }
  function fling(a, b, p){
    if(a.loverId !== b.id && isFree(a) && isFree(b)) setLovers(a, b);
    maybePregnant(a, b, p);
  }

  function matchSpec(t, spec){
    if(!spec) return true;
    if(spec === 'any') return !!t.item;
    if(spec === 'none') return !t.item;
    if(spec === 'weapon') return !!(t.item && A.WEAPONS[t.item]);
    return t.item === spec;
  }
  function permutations(m){
    if(m.length === 1) return [m.slice()];
    if(m.length === 2) return [[m[0], m[1]], [m[1], m[0]]];
    var out = [];
    [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].forEach(function(p){ out.push([m[p[0]], m[p[1]], m[p[2]]]); });
    return out;
  }
  function validOrders(e, m){
    return permutations(m).filter(function(o){
      if(e.req && (!matchSpec(o[0], e.req.a) || (o[1] && !matchSpec(o[1], e.req.b)) || (o[2] && !matchSpec(o[2], e.req.c)))) return false;
      if(e.team === 'mates' && !o.every(function(t){ return sameTeam(t, o[0]); })) return false;
      if(e.team === 'rivals'){
        if(o.length === 2 && sameTeam(o[0], o[1])) return false;
        if(o.length === 3 && (!sameTeam(o[0], o[1]) || sameTeam(o[0], o[2]))) return false;
      }
      if(/(^|\+)defect(\+|$)/.test(e.fx || '') && (sameTeam(o[0], o[1]) || teamAliveCount(curGame, o[0].team) < 2)) return false;
      if(e.cond && !e.cond(o[0], o[1], o[2])) return false;
      return true;
    });
  }
  function orderWeight(e, o){
    var L = lethalPart(e);
    if(!L) return 1;
    var victim = o[L[2] === 'a' ? 0 : L[2] === 'b' ? 1 : 2];
    var w = roleMult(victim, 'victim');
    if(L[1] === 'kill'){
      var killer = L[4] ? o[L[4] === 'a' ? 0 : L[4] === 'b' ? 1 : 2] : o.filter(function(t){ return t !== victim; })[0];
      if(killer) w *= roleMult(killer, 'killer');
    }
    return w;
  }
  function fxParts(e){ return (e.fx || 'none').split('+'); }
  function lethalPart(e){
    var parts = fxParts(e);
    for(var i = 0; i < parts.length; i++){
      var r = /^(kill|die)_([abc])(_by_([abc]))?(_unally)?$/.exec(parts[i]);
      if(r) return r;
    }
    return null;
  }

  function catalogEvent(m, ctx, wantDeath){
    var rel = relOf(m);
    var free = m.every(isFree);
    var recent = curGame.recent || (curGame.recent = []);
    var tm = teamMode(curGame);
    var cands = [];
    A.EVENTS.forEach(function(e){
      if(e.n !== m.length) return;
      if(!(e.rel === 'any' || e.rel === rel)) return;
      if(e.free && !free) return;
      var hasBaby = m.some(function(t){ return t.baby; });
      if(hasBaby !== !!e.family) return;
      if(e.team && !tm) return;
      if(e.ffa && tm) return;
      if(tm && /(^|\+)unally3?(\+|$)/.test(e.fx || '') && m.some(function(t, i){ return m.some(function(u, j){ return j > i && sameTeam(t, u); }); })) return;
      var lethal = !!lethalPart(e);
      if(wantDeath && !lethal) return;
      if(!wantDeath && lethal && !e.live) return;
      var ords = validOrders(e, m);
      if(!ords.length) return;
      var w = e.w || 5;
      if(!wantDeath && lethal) w *= 0.45;
      if(recent.indexOf(e.k) !== -1) w *= e.gen ? 0.5 : 0.1;
      w *= edMod(e.type) * jit(e.k) * traitMult(m, e.type);
      if(e.team && tm) w *= 1.4;
      if(/(^|\+)get$/.test(e.fx || '')) w *= 1.6;
      cands.push([w, { e: e, ords: ords, near: !wantDeath && lethal }]);
    });
    if(!cands.length) return null;
    var pick = weightedChoice(cands);
    var e = pick.e;
    recent.push(e.k);
    if(recent.length > 14) recent.shift();

    var o = pick.ords.length > 1 ? weightedChoice(pick.ords.map(function(ord){ return [orderWeight(e, ord), ord]; })) : pick.ords[0];
    var a = o[0], b = o[1], c = o[2];
    var ok = true;
    var x = {};
    if(tm){
      x.ta = teamLabel(teamById(curGame, a.team), true);
      if(b) x.tb = teamLabel(teamById(curGame, b.team), true);
      if(c) x.tc = teamLabel(teamById(curGame, c.team), true);
      var tA = teamById(curGame, a.team);
      x.cry = tA ? tA.cry : '';
    }
    var L = lethalPart(e);
    fxParts(e).forEach(function(fx){
      if(/^(kill|die)_/.test(fx)){
        var r = /^(kill|die)_([abc])(_by_([abc]))?(_unally)?$/.exec(fx);
        var victim = o[r[2] === 'a' ? 0 : r[2] === 'b' ? 1 : 2];
        if(r[5]) removeAlly(a, b);
        if(pick.near){ ok = false; return; }
        ok = safeKill(victim, e.k, ctx.round);
        if(ok && r[1] === 'kill'){
          var killer = r[4] ? o[r[4] === 'a' ? 0 : r[4] === 'b' ? 1 : 2] : o.filter(function(t){ return t !== victim; })[0];
          killer.kills += 1;
        }
      } else if(fx === 'love') setLovers(a, b);
      else if(fx === 'breakup'){ a.loverId = null; b.loverId = null; }
      else if(fx === 'ally') addAlly(a, b);
      else if(fx === 'ally3'){ addAlly(a, b); addAlly(b, c); addAlly(a, c); }
      else if(fx === 'recruit'){ addAlly(a, c); addAlly(b, c); }
      else if(fx === 'unally') removeAlly(a, b);
      else if(fx === 'unally3'){ removeAlly(a, b); removeAlly(b, c); removeAlly(a, c); }
      else if(fx === 'cheat'){
        b.loverId = null;
        var oldC = c.loverId ? byId(curGame, c.loverId) : null;
        if(oldC) oldC.loverId = null;
        setLovers(a, c);
      }
      else if(fx === 'fling') fling(a, b, 0.65);
      else if(fx === 'tryBaby') maybePregnant(a, b, 0.85);
      else if(fx === 'caughtbreak'){ a.loverId = null; c.loverId = null; if(isFree(b)) setLovers(a, b); maybePregnant(a, b, 0.6); }
      else if(fx === 'breakupac'){ a.loverId = null; c.loverId = null; }
      else if(fx === 'steal3'){ x.item = A.ITEMS[a.item]; c.item = a.item; a.item = null; }
      else if(fx === 'stork'){ x.baby = createBaby(a, b); }
      else if(fx === 'defect'){
        x.tb = teamLabel(teamById(curGame, b.team), true);
        curGame.tributes.forEach(function(t){ if(t !== a && t.team === a.team) removeAlly(a, t); });
        a.team = b.team; a.teamColor = b.teamColor;
        curGame.tributes.forEach(function(t){ if(t !== a && t.alive && !t.baby && t.team === a.team) addAlly(a, t); });
      }
      else if(fx === 'get'){ x.item = A.ITEMS[e.it]; a.item = e.it; }
      else if(fx === 'steal'){ x.item = A.ITEMS[(o[e.n === 3 ? 2 : 1]).item]; var vic = o[e.n === 3 ? 2 : 1]; a.item = vic.item; vic.item = null; }
      else if(fx === 'give'){ x.item = A.ITEMS[a.item]; b.item = a.item; a.item = null; }
      else if(fx === 'swap'){ x.item = A.ITEMS[a.item]; x.item2 = A.ITEMS[b.item]; var t = a.item; a.item = b.item; b.item = t; }
      else if(fx === 'sabotage'){ x.item = A.ITEMS[b.item]; b.item = null; }
      else if(fx === 'use' || fx === 'lose'){ x.item = A.ITEMS[a.item]; a.item = null; }
    });
    var text = ok ? e.text(a, b, c, x) : (e.live ? e.live(a, b, c, x) : a.name + ' lo intenta, pero la arena decide darles un respiro.');
    var trA = traitOf(a);
    if(ok && trA && trA.mods && (trA.mods[e.type] || 1) > 1.2 && text.indexOf(a.name) === 0 && Math.random() < 0.3){
      text = 'Fiel a su fama de ' + (a.gender === 'chica' ? trA.f : trA.m) + ', ' + text;
    }
    var order = e.swap3 && o.length === 3 ? e.swap3.map(function(i){ return o[i]; }) :
      (e.swap && o.length > 1 ? [b, a, c].filter(Boolean) : o);
    if(x.baby) order = [order[0], x.baby, order[1]];
    var prop = e.prop || (x.item ? x.item.prop : undefined);
    var res = ev(ok ? e.type : 'fight', text, order, e.scenes ? choice(e.scenes) : e.scene, prop);
    if(x.item2) res.prop2 = x.item2.prop;
    return res;
  }

  function resolveSolo(t, ctx){
    var dm = ctx.dm;
    var cat = weightedChoice([
      [26, 'explore'], [14, 'find_item'], [14, 'hide'], [10, 'injured'],
      [12 * dm, 'death_accident'], [8 * dm, 'death_illness']
    ]);
    if(cat === 'death_accident' || cat === 'death_illness'){
      if(safeKill(t, cat, ctx.round)) return ev('death', choice(TPL[cat])(t), [t], 'ghost');
      return ev('neutral', choice(TPL.injured)(t), [t], 'injured');
    }
    var soloScene = { explore: 'explore', find_item: 'item', hide: 'hide', injured: 'injured' }[cat];
    return ev(cat === 'find_item' ? 'item' : 'neutral', choice(TPL[cat])(t), [t], soloScene, cat === 'find_item' ? 'crate' : undefined);
  }

  function resolveStrangers(a, b, ctx){
    var cat = weightedChoice([[26, 'meet_alliance'], [12, 'meet_romance'], [28 * ctx.dm, 'fight'], [34, 'ignore']]);
    if(cat === 'meet_alliance'){ addAlly(a, b); return ev('alliance', choice(TPL.meet_alliance)(a, b), [a, b], 'handshake'); }
    if(cat === 'meet_romance'){ setLovers(a, b); return ev('romance', choice(TPL.meet_romance)(a, b), [a, b], 'love'); }
    if(cat === 'ignore') return ev('neutral', choice(TPL.ignore)(a, b), [a, b], 'awkward');
    if(Math.random() < 0.6){
      var pair = pickDominant(a, b);
      if(safeKill(pair[1], 'fight', ctx.round)){
        pair[0].kills += 1;
        return ev('death', choice(TPL.fight_death)(pair[0], pair[1]), pair, choice(['brawl', 'shoot']));
      }
    }
    return ev('fight', choice(TPL.fight_survive)(a, b), [a, b], 'brawl');
  }

  function resolveAllies(a, b, ctx){
    var cat = weightedChoice([[30, 'ally_bond'], [22, 'ally_success'], [16 * ctx.dm, 'betrayal'], [10, 'become_lovers'], [14, 'ally_split']]);
    if(cat === 'ally_bond') return ev('alliance', choice(TPL.ally_bond)(a, b), [a, b], 'handshake');
    if(cat === 'ally_success') return ev('alliance', choice(TPL.ally_success)(a, b), [a, b], 'handshake');
    if(cat === 'become_lovers'){ setLovers(a, b); return ev('romance', choice(TPL.become_lovers)(a, b), [a, b], 'love'); }
    if(cat === 'ally_split'){ removeAlly(a, b); return ev('alliance', choice(TPL.ally_split)(a, b), [a, b], 'split'); }
    var pair = pickDominant(a, b);
    removeAlly(a, b);
    if(safeKill(pair[1], 'betrayal', ctx.round)){
      pair[0].kills += 1;
      return ev('death', choice(TPL.betrayal)(pair[0], pair[1]), pair, choice(['stab', 'shoot']));
    }
    return ev('fight', choice(TPL.betrayal_failed_fallback)(pair[0], pair[1]), pair, 'stab');
  }

  function resolveLovers(a, b, ctx){
    var cat = weightedChoice([[40, 'romance_moment'], [16 * ctx.dm, 'romance_protect'], [8 * ctx.dm, 'jealousy_betrayal'], [36, 'romance_success']]);
    if(cat === 'romance_moment') return ev('romance', choice(TPL.romance_moment)(a, b), [a, b], 'love');
    if(cat === 'romance_success') return ev('romance', choice(TPL.romance_success)(a, b), [a, b], 'love');
    if(cat === 'romance_protect'){
      var pp = Math.random() < 0.5 ? [a, b] : [b, a];
      if(safeKill(pp[0], 'romance_protect', ctx.round)) return ev('death', choice(TPL.romance_protect)(pp[0], pp[1]), pp, 'mourn');
      return ev('romance', choice(TPL.romance_protect_fallback)(a, b), [a, b], 'love');
    }
    var jp = pickDominant(a, b);
    if(safeKill(jp[1], 'jealousy', ctx.round)){
      jp[0].kills += 1;
      return ev('death', choice(TPL.jealousy_betrayal)(jp[0], jp[1]), jp, 'shoot');
    }
    return ev('fight', choice(TPL.jealousy_fallback)(jp[0], jp[1]), jp, 'brawl');
  }

  function resolveDuo(a, b, ctx){
    if(a.loverId === b.id) return resolveLovers(a, b, ctx);
    if(a.allies.indexOf(b.id) !== -1) return resolveAllies(a, b, ctx);
    return resolveStrangers(a, b, ctx);
  }

  function resolveTrio(a, b, c, ctx){
    var cat = weightedChoice([[26, 'group_alliance'], [20, 'group_success'], [22 * ctx.dm, 'group_ambush'], [16 * ctx.dm, 'group_split'], [16, 'group_none']]);
    var all = [a, b, c];
    if(cat === 'group_alliance'){
      addAlly(a, b); addAlly(b, c); addAlly(a, c);
      return ev('alliance', choice(TPL.group_alliance)(a, b, c), all, 'handshake');
    }
    if(cat === 'group_success') return ev('neutral', choice(TPL.group_success)(a, b, c), all, 'feast');
    if(cat === 'group_none') return ev('neutral', choice(TPL.group_none)(a, b, c), all, 'dance');
    if(cat === 'group_split'){
      removeAlly(a, b); removeAlly(b, c); removeAlly(a, c);
      return ev('alliance', choice(TPL.group_split)(a, b, c), all, 'split');
    }
    var vi = rand(3);
    var victim = all[vi];
    var survivors = all.filter(function(_, i){ return i !== vi; });
    if(Math.random() < 0.5){
      var first = Math.random() < 0.5;
      var killer = first ? survivors[0] : survivors[1];
      var ally = first ? survivors[1] : survivors[0];
      if(safeKill(victim, 'ambush', ctx.round)){
        killer.kills += 1;
        return ev('death', choice(TPL.group_ambush_internal)(killer, ally, victim), [killer, ally, victim], 'shoot');
      }
    } else if(safeKill(victim, 'ambush', ctx.round)){
      return ev('death', choice(TPL.group_ambush_external)(survivors[0], survivors[1], victim), [survivors[0], survivors[1], victim], 'lightning');
    }
    return ev('fight', choice(TPL.ambush_escape_fallback)(a, b, c), all, 'brawl');
  }

  function resolveGroup(m, ctx, wantDeath){
    if(A.EVENTS){
      var custom = catalogEvent(m, ctx, wantDeath) || catalogEvent(m, ctx, !wantDeath);
      if(custom) return custom;
    }
    if(m.length === 1) return resolveSolo(m[0], ctx);
    if(m.length === 2) return resolveDuo(m[0], m[1], ctx);
    return resolveTrio(m[0], m[1], m[2], ctx);
  }

  function byId(game, id){
    for(var i = 0; i < game.tributes.length; i++) if(game.tributes[i].id === id) return game.tributes[i];
    return null;
  }

  function pickGroup(game, alive, isFirst, wantDeath){
    var babies = game.tributes.filter(function(t){ return t.baby && t.alive; });
    if(babies.length && Math.random() < 0.2){
      var bb = choice(babies);
      var parents = bb.parents.map(function(id){ return byId(game, id); }).filter(function(p){ return p && p.alive && !p.baby; });
      if(parents.length === 2 && Math.random() < 0.4) return [parents[0], parents[1], bb];
      if(parents.length) return [choice(parents), bb];
    }
    var a = choice(alive);
    var r = Math.random();
    if(teamMode(game)){
      var rivals = alive.filter(function(t){ return !sameTeam(t, a); });
      var mates = alive.filter(function(t){ return t !== a && sameTeam(t, a); });
      if(wantDeath && rivals.length && r < 0.82){
        if(mates.length && Math.random() < 0.35) return [a, choice(mates), choice(rivals)];
        return [a, choice(rivals)];
      }
      if(!wantDeath){
        if(r < 0.3 && mates.length) return mates.length >= 2 && Math.random() < 0.35 ? [a].concat(shuffle(mates).slice(0, 2)) : [a, choice(mates)];
        if(r < 0.62 && rivals.length){
          if(mates.length && Math.random() < 0.25) return [a, choice(mates), choice(rivals)];
          return [a, choice(rivals)];
        }
      }
      r = Math.random();
    }
    var lover = a.loverId ? byId(game, a.loverId) : null;
    if(lover && !lover.alive) lover = null;
    var allies = a.allies.map(function(id){ return byId(game, id); }).filter(function(x){ return x && x.alive; });
    if(lover && r < 0.3) return [a, lover];
    if(allies.length >= 2 && r < 0.4) return [a, allies[0], allies[1]];
    if(allies.length && r < 0.55) return [a, choice(allies)];
    var sizeOpts = isFirst ? [[30, 1], [40, 2], [30, 3]] : [[45, 1], [40, 2], [15, 3]];
    var size = weightedChoice(sizeOpts.filter(function(p){ return p[1] <= alive.length; }));
    var others = shuffle(alive.filter(function(t){ return t !== a; })).slice(0, size - 1);
    return [a].concat(others);
  }

  function makeTribute(c){
    return { id: c.id, name: c.name, gender: c.gender, hair: c.hair, eyes: c.eyes, skin: c.skin, photo: c.photo, alive: true, allies: [], loverId: null, kills: 0, item: null, diedRound: null, cause: null, baby: false, parents: null, preg: null, team: null, teamColor: null, trait: null };
  }

  var PACE = { corta: 0.36, media: 0.22, larga: 0.15 };
  function deathChance(game, alive, isFirst, isFeast){
    var p = PACE[game.pace] || PACE.media;
    p *= alive > 16 ? 2.1 : alive > 12 ? 1.7 : alive > 8 ? 1.3 : alive <= 4 ? 1.15 : 1;
    if(isFirst) p *= 1.3;
    if(isFeast) p *= 1.4;
    p += Math.max(0, (game.calm || 0) - 5) * 0.05;
    if((game.streak || 0) >= 3) p *= 0.4;
    p *= game.lethality || 1;
    return Math.min(0.8, p);
  }

  var BIRTH = [
    function(m, b){ return m.name + ' da a luz en mitad de la arena, sin epidural y con un pato mirando. Nace ' + b.name + ', un bebé sano y con muy mal genio.'; },
    function(m, b, f){ return 'Los dolores de parto sorprenden a ' + m.name + ' entre dos arbustos. ' + (f ? f.name + ' se desmaya y se pierde el momento. ' : '') + 'Nace ' + b.name + ', que lo primero que hace es llorar y lo segundo, llorar más fuerte.'; },
    function(m, b){ return 'Entre gritos, respiraciones raras y una ardilla que mira sin ayudar, ' + m.name + ' trae al mundo a ' + b.name + '. Los patrocinadores envían una caja de pañales, una manta y una mirada de compasión.'; },
    function(m, b, f){ return m.name + ' rompe aguas justo cuando lo tenía todo planeado. Nace ' + b.name + ' a la luz de la luna' + (f ? ', ante ' + f.name + ', que no sabe si aplaudir o salir corriendo' : '') + '. Todas las armas de la arena se bajan un momento por respeto.'; }
  ];
  var REVEAL = [
    function(m, f){ return m.name + ' lleva días con náuseas y unas ganas incontrolables de comer barro. Al final lo entiende: espera un bebé.' + (f ? ' ' + f.name + ' se desmaya del susto.' : ''); },
    function(m, f){ return m.name + ' se toca la barriga y siente una patadita. Confirmado: esto ya no es un juego de supervivencia, es una guardería.' + (f ? ' ' + f.name + ' ya ha empezado a llorar.' : ''); },
    function(m, f){ return 'Una ardilla con bata blanca (o eso cree ' + m.name + ') da la noticia: vienen un bebé y muchas noches sin dormir.' + (f ? ' ' + f.name + ' pide un momento a solas.' : ''); }
  ];

  var TEAM_COLORS = [['#e2493f', 'Rojo'], ['#4b7bff', 'Azul'], ['#4fae4a', 'Verde'], ['#e9b83a', 'Dorado'],
                     ['#a35ee0', 'Violeta'], ['#f07d2a', 'Naranja'], ['#e25b9a', 'Rosa'], ['#2ab3b0', 'Turquesa']];
  var MASCOTS = [['los', 'Zorros'], ['los', 'Patos Salvajes'], ['los', 'Tejones'], ['los', 'Mapaches'], ['las', 'Cabras Locas'],
                 ['las', 'Ardillas Furiosas'], ['los', 'Lobos'], ['los', 'Pingüinos'], ['las', 'Llamas'], ['las', 'Gallinas Ninja'],
                 ['los', 'Tiburones'], ['los', 'Osos Perezosos'], ['los', 'Caracoles Veloces'], ['las', 'Nutrias'], ['los', 'Búhos'],
                 ['los', 'Camaleones'], ['los', 'Erizos'], ['las', 'Hienas Risueñas'], ['los', 'Castores'], ['las', 'Mofetas Elegantes']];
  var CRIES = ['¡Por la patata!', '¡Nadie nos para!', '¡Hoy cenamos victoria!', '¡Ni un paso atrás, salvo si hay un oso!',
               '¡Somos pocos, pero ruidosos!', '¡A por ellos, que son de papel!', '¡Más vale maña que fuerza!', '¡Que tiemble el bosque!',
               '¡Juntos hasta la merienda!', '¡Nacimos para esto (creemos)!', '¡Ni un calcetín sin dueño!', '¡Olé, olé y olé!',
               '¡El que se ría, pierde!', '¡Por nuestras madres!', '¡Uno para todos y todos a correr!', '¡Si no hay pan, hay galletas!'];

  function makeTeams(game, mode, count){
    var ts = game.tributes, n = ts.length, k;
    if(mode === 'parejas') k = Math.floor(n / 2);
    else k = Math.max(2, Math.min(parseInt(count, 10) || 2, Math.floor(n / 2), TEAM_COLORS.length));
    k = Math.max(2, Math.min(k, TEAM_COLORS.length === 0 ? 2 : 999));
    var colors = TEAM_COLORS.slice(0, Math.min(k, TEAM_COLORS.length));
    while(colors.length < k) colors.push(TEAM_COLORS[colors.length % TEAM_COLORS.length]);
    var masc = shuffle(MASCOTS), cries = shuffle(CRIES);
    game.teams = colors.map(function(c, i){
      return { id: 'T' + (i + 1), color: c[0], colorName: c[1], art: masc[i % masc.length][0], mascot: masc[i % masc.length][1], cry: cries[i % cries.length] };
    });
    shuffle(ts).forEach(function(t, i){
      var team = game.teams[i % k];
      t.team = team.id; t.teamColor = team.color;
    });
    ts.forEach(function(t){ ts.forEach(function(u){ if(t !== u && t.team === u.team) addAlly(t, u); }); });
  }

  A.Engine = {
    label: function(type){ return CATEGORY_LABEL[type] || 'Crónica'; },

    newGame: function(characters, opts){
      if(typeof opts === 'string') opts = { pace: opts };
      opts = opts || {};
      var tributes = shuffle(characters.map(makeTribute));
      var loot = ['comida', 'comida', 'cuchillo', 'botiquin', 'paraguas', 'mapa', 'sarten', 'arco', 'pistola', 'ukelele'];
      tributes.forEach(function(t){ if(Math.random() < 0.4) t.item = choice(loot); });
      if(A.TRAITS){
        var ids = Object.keys(A.TRAITS);
        tributes.forEach(function(t){ if(Math.random() < 0.85) t.trait = choice(ids); });
      }
      var mode = opts.mode === 'equipos' || opts.mode === 'parejas' ? opts.mode : 'todos';
      if(tributes.length < 4) mode = 'todos';
      var game = {
        version: 3,
        pace: opts.pace || 'media',
        mode: mode,
        calm: 0,
        streak: 0,
        tributes: tributes,
        round: 0,
        log: [],
        winnerId: null,
        winnerTeam: null,
        finished: false,
        recent: [],
        jit: {},
        teams: null,
        edition: null,
        emods: {},
        lethality: 1
      };
      if(A.EDITIONS && A.EDITIONS.length){
        var ed = weightedChoice(A.EDITIONS.map(function(x){ return [x.w || 1, x]; }));
        game.edition = { id: ed.id, name: ed.name, desc: ed.desc };
        var mods = {};
        if(ed.chaos){
          ['death', 'fight', 'romance', 'alliance', 'theft', 'betrayal', 'item', 'neutral', 'heal', 'family'].forEach(function(k){
            mods[k] = Math.round((0.35 + Math.random() * 2.3) * 100) / 100;
          });
        } else Object.keys(ed.mods || {}).forEach(function(k){ mods[k] = ed.mods[k]; });
        game.emods = mods;
        game.lethality = ed.lethality || 1;
      }
      if(mode !== 'todos') makeTeams(game, mode, opts.teams);
      return game;
    },

    introEntries: function(game){
      var list = [];
      var n = game.tributes.length;
      var ed = game.edition ? ' Edición de hoy: «' + game.edition.name + '». ' + game.edition.desc : '';
      if(teamMode(game)){
        var how = game.mode === 'parejas' ? 'por parejas' : 'por equipos';
        list.push({
          type: 'announcement', scene: 'lineup', round: 0, deaths: [],
          text: 'Bienvenidos a La Arena. Hoy se juega ' + how + ': ' + game.teams.length + ' equipos entran en la arena y solo uno saldrá con vida.' + ed,
          ids: game.tributes.map(function(t){ return t.id; })
        });
        game.teams.forEach(function(team){
          var members = game.tributes.filter(function(t){ return t.team === team.id; });
          list.push({
            type: 'announcement', scene: 'teamintro', round: 0, deaths: [], teamId: team.id, teamName: teamLabel(team), teamColor: team.color,
            text: teamLabel(team) + ' (' + team.colorName.toLowerCase() + '): ' + joinNames(members.map(function(t){ return t.name; })) + '. Su grito de guerra: «' + team.cry + '»',
            ids: members.map(function(t){ return t.id; })
          });
        });
      } else {
        var who = n <= 10 ? joinNames(game.tributes.map(function(t){ return t.name; })) + ' entran' : n + ' tributos entran';
        list.push({
          type: 'announcement', scene: 'lineup', round: 0, deaths: [],
          text: 'Bienvenidos a La Arena. ' + who + ' en la arena. Solo una persona saldrá con vida.' + ed,
          ids: game.tributes.map(function(t){ return t.id; })
        });
      }
      return list;
    },

    teamLabel: function(game, teamId, lower){ return teamLabel(teamById(game, teamId), lower); },
    teamOf: function(game, teamId){ return teamById(game, teamId); },
    isTeamMode: function(game){ return teamMode(game); },

    introEntry: function(game){
      var n = game.tributes.length;
      var who = n <= 10 ? joinNames(game.tributes.map(function(t){ return t.name; })) + ' entran' : n + ' tributos entran';
      return {
        type: 'announcement', scene: 'lineup', round: 0, deaths: [],
        text: 'Bienvenidos a La Arena. ' + who + ' en la arena. Solo una persona saldrá con vida.',
        ids: game.tributes.map(function(t){ return t.id; })
      };
    },

    simulateDay: function(game){
      var alive = fighters(game);
      if(alive.length <= 1) return [];
      game.round += 1;
      var round = game.round;
      var isFirst = round === 1 && alive.length > 2;
      var isFeast = !isFirst && alive.length > 4 && round % 6 === 0;
      remainingAlive = alive.length;
      currentDeaths = [];
      curGame = game;

      var entry;
      var mom = alive.length > 2 ? game.tributes.filter(function(t){ return t.alive && !t.baby && t.preg && t.preg.due <= round; })[0] : null;
      var mom2 = alive.length > 2 && !mom ? game.tributes.filter(function(t){ return t.alive && !t.baby && t.preg && !t.preg.revealed && t.preg.reveal <= round; })[0] : null;
      if(mom){
        var dad = byId(game, mom.preg.by);
        var baby = createBaby(mom, dad || mom);
        mom.preg = null;
        var withDad = dad && dad.alive && !dad.baby;
        entry = ev('family', choice(BIRTH)(mom, baby, withDad ? dad : null), withDad ? [mom, baby, dad] : [mom, baby], 'birth');
        entry.babyId = baby.id;
      } else if(mom2 && Math.random() < 0.75){
        mom2.preg.revealed = true;
        var dad2 = byId(game, mom2.preg.by);
        var withDad2 = dad2 && dad2.alive && !dad2.baby;
        entry = ev('family', choice(REVEAL)(mom2, withDad2 ? dad2 : null), withDad2 ? [mom2, dad2] : [mom2], 'pregnant');
      } else if(alive.length === 2 && !sameTeam(alive[0], alive[1])){
        var pair = shuffle(alive);
        var dom = pickDominant(pair[0], pair[1]);
        safeKill(dom[1], 'final_duel', round);
        dom[0].kills += 1;
        entry = ev('death', choice(TPL.final_duel)(dom[0], dom[1]), dom, choice(['shoot', 'brawl', 'stab']));
      } else {
        var ctx = { round: round, dm: deathMultiplier(alive.length, isFirst, isFeast) };
        var wantDeath = Math.random() < deathChance(game, alive.length, isFirst, isFeast);
        entry = resolveGroup(pickGroup(game, alive, isFirst, wantDeath), ctx, wantDeath);
      }
      game.calm = currentDeaths.length ? 0 : (game.calm || 0) + 1;
      game.streak = currentDeaths.length ? (game.streak || 0) + 1 : 0;
      if(isFirst) entry.text = 'Suena el gong. ' + entry.text;
      if(isFeast) entry.text = choice(TPL.feast_announce) + ' ' + entry.text;
      entry.round = round;
      entry.deaths = currentDeaths.slice();

      var entries = [entry];
      var left = fighters(game);
      if(teamMode(game) && left.length >= 1 && teamsAlive(left) <= 1){
        game.finished = true;
        var wteam = teamById(game, left[0].team);
        game.winnerTeam = wteam ? wteam.id : null;
        var best = left.slice().sort(function(p, q){ return q.kills - p.kills; })[0];
        game.winnerId = best.id;
        var kidsT = game.tributes.filter(function(t){ return t.baby && t.alive && t.team === left[0].team; });
        var vtext = '¡Victoria para ' + teamLabel(wteam, true) + '! ' + joinNames(left.map(function(t){ return t.name; })) + (left.length === 1 ? ' sale con vida de la arena y lo celebra' : ' salen con vida de la arena y lo celebran') + ' con su grito de guerra: «' + (wteam ? wteam.cry : '') + '»';
        if(kidsT.length) vtext += ' Con ' + (kidsT.length === 1 ? 'su bebé, ' + kidsT[0].name : 'sus bebés') + ' en brazos.';
        entries.push({ type: 'victory', scene: 'teamvictory', round: round, deaths: [], teamId: game.winnerTeam, teamName: teamLabel(wteam), teamColor: wteam ? wteam.color : null, ids: left.map(function(t){ return t.id; }).concat(kidsT.map(function(t){ return t.id; })), text: vtext });
      } else if(left.length <= 1){
        game.finished = true;
        game.winnerId = left[0] ? left[0].id : null;
        if(left[0]){
          var kids = game.tributes.filter(function(t){ return t.baby && t.alive; });
          var kid = kids.filter(function(k){ return k.parents.indexOf(left[0].id) !== -1; })[0] || kids[0];
          var vt = choice(TPL.victory)(left[0]);
          if(kid) vt += ' Se lleva a casa a ' + kid.name + ', que ha sobrevivido a todo con una sonrisa.';
          entries.push({ type: 'victory', scene: 'victory', round: round, deaths: [], ids: kid ? [left[0].id, kid.id] : [left[0].id], text: vt });
        }
      }
      return entries;
    }
  };
})();
