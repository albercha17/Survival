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
    item: 'Hallazgo', fight: 'Enfrentamiento', neutral: 'Crónica', victory: 'Victoria'
  };

  var remainingAlive = 0;
  var currentDeaths = [];

  function safeKill(t, cause, round){
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
      if(m[0].loverId === m[1].id) return 'lover';
      if(m[0].allies.indexOf(m[1].id) !== -1) return 'ally';
      return 'stranger';
    }
    return 'group';
  }

  function catalogEvent(m, ctx){
    var rel = relOf(m);
    var free = m.every(isFree);
    var recent = curGame.recent || (curGame.recent = []);
    var list = A.EVENTS.filter(function(e){
      return e.n === m.length && (e.rel === 'any' || e.rel === rel) && (!e.free || free);
    });
    if(!list.length) return null;
    var pairs = list.map(function(e){
      var w = e.w || 5;
      if(/^(kill|die)_/.test(e.fx || '')) w *= ctx.dm;
      if(recent.indexOf(e.k) !== -1) w *= 0.12;
      return [w, e];
    });
    var e = weightedChoice(pairs);
    recent.push(e.k);
    if(recent.length > 10) recent.shift();

    var o = m.length > 1 ? shuffle(m) : m.slice();
    var a = o[0], b = o[1], c = o[2];
    var fx = e.fx || 'none';
    var ok = true;
    var lethal = /^(kill|die)_([abc])(_unally)?$/.exec(fx);
    if(lethal){
      var victim = o[lethal[2] === 'a' ? 0 : lethal[2] === 'b' ? 1 : 2];
      if(lethal[3]) removeAlly(a, b);
      ok = safeKill(victim, e.k, ctx.round);
      if(ok && lethal[1] === 'kill'){
        var killer = o.filter(function(t){ return t !== victim; })[0];
        killer.kills += 1;
      }
    } else if(fx === 'love') setLovers(a, b);
    else if(fx === 'breakup'){ a.loverId = null; b.loverId = null; }
    else if(fx === 'ally') addAlly(a, b);
    else if(fx === 'ally3'){ addAlly(a, b); addAlly(b, c); addAlly(a, c); }
    else if(fx === 'unally') removeAlly(a, b);
    else if(fx === 'unally3'){ removeAlly(a, b); removeAlly(b, c); removeAlly(a, c); }

    var text = ok ? e.text(a, b, c) : (e.live ? e.live(a, b, c) : a.name + ' lo intenta, pero la arena decide darles un respiro.');
    var scene = e.swap && o.length > 1 ? [b, a, c].filter(Boolean) : o;
    return ev(ok ? e.type : 'fight', text, scene, e.scene, e.prop);
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

  function resolveGroup(m, ctx){
    if(A.EVENTS && Math.random() < (m.length === 1 ? 0.75 : 0.7)){
      var custom = catalogEvent(m, ctx);
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

  function pickGroup(game, alive, isFirst){
    var a = choice(alive);
    var r = Math.random();
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
    return { id: c.id, name: c.name, gender: c.gender, hair: c.hair, eyes: c.eyes, alive: true, allies: [], loverId: null, kills: 0, diedRound: null, cause: null };
  }

  A.Engine = {
    label: function(type){ return CATEGORY_LABEL[type] || 'Crónica'; },

    newGame: function(characters){
      return {
        tributes: characters.map(makeTribute),
        round: 0,
        log: [],
        winnerId: null,
        finished: false,
        recent: []
      };
    },

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
      var alive = game.tributes.filter(function(t){ return t.alive; });
      if(alive.length <= 1) return [];
      game.round += 1;
      var round = game.round;
      var isFirst = round === 1 && alive.length > 2;
      var isFeast = !isFirst && alive.length > 4 && round % 6 === 0;
      remainingAlive = alive.length;
      currentDeaths = [];
      curGame = game;

      var entry;
      if(alive.length === 2){
        var pair = shuffle(alive);
        var dom = pickDominant(pair[0], pair[1]);
        safeKill(dom[1], 'final_duel', round);
        dom[0].kills += 1;
        entry = ev('death', choice(TPL.final_duel)(dom[0], dom[1]), dom, choice(['shoot', 'brawl', 'stab']));
      } else {
        var ctx = { round: round, dm: deathMultiplier(alive.length, isFirst, isFeast) };
        for(var attempt = 0; attempt < 3; attempt++){
          entry = resolveGroup(pickGroup(game, alive, isFirst), ctx);
          var quiet = entry.type === 'neutral' || entry.type === 'item';
          if(!(quiet && alive.length > 6 && Math.random() < 0.6)) break;
        }
      }
      if(isFirst) entry.text = 'Suena el gong. ' + entry.text;
      if(isFeast) entry.text = choice(TPL.feast_announce) + ' ' + entry.text;
      entry.round = round;
      entry.deaths = currentDeaths.slice();

      var entries = [entry];
      var left = game.tributes.filter(function(t){ return t.alive; });
      if(left.length <= 1){
        game.finished = true;
        game.winnerId = left[0] ? left[0].id : null;
        if(left[0]){
          entries.push({ type: 'victory', scene: 'victory', round: round, deaths: [], ids: [left[0].id], text: choice(TPL.victory)(left[0]) });
        }
      }
      return entries;
    }
  };
})();
