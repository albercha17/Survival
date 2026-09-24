(function(){
  var A = window.Arena = window.Arena || {};
  function g(t, m, f){ return t.gender === 'chica' ? f : m; }
  function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  A.EVENTS = A.EVENTS.concat([
    /* merienda */
    { k: 'te_duo', n: 2, rel: 'any', w: 5, type: 'alliance', scene: 'tea',
      text: function(a, b){ return a.name + ' invita a ' + b.name + ' a un té en mitad de la arena, con tetera y todo. Hablan del tiempo. Es la conversación más civilizada de los juegos.'; } },
    { k: 'te_trio', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'tea',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' celebran una merienda muy elegante. ' + c.name + ' levanta el meñique tanto que se le engancha en una rama.'; } },
    { k: 'te_veneno', n: 2, rel: 'any', w: 4, type: 'death', fx: 'kill_b', scene: 'tea',
      text: function(a, b){ return a.name + ' sirve a ' + b.name + ' una taza de té con «un toque especial». ' + b.name + ' no llega a la segunda taza.'; },
      live: function(a, b){ return a.name + ' sirve a ' + b.name + ' un té con «un toque especial». ' + b.name + ' cambia las tazas sin que ' + a.name + ' se dé cuenta. ' + a.name + ' pasa la noche con dolor de tripa.'; } },

    /* bomba */
    { k: 'patata_caliente', n: 2, rel: 'any', w: 5, type: 'death', fx: 'die_b', scene: 'bomb',
      text: function(a, b){ return a.name + ' encuentra una bomba con la mecha encendida y se la pasa a ' + b.name + '. ' + b.name + ' se la devuelve. ' + a.name + ' se la vuelve a pasar. Al final se queda en manos de ' + b.name + '.'; },
      live: function(a, b){ return a.name + ' y ' + b.name + ' se pasan una bomba como si fuera una patata caliente. Al final explota... en confeti. Era de un patrocinador con sentido del humor.'; } },
    { k: 'patata_trio', n: 3, rel: 'group', w: 4, type: 'death', fx: 'die_c', scene: 'bomb',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' juegan a la patata caliente con una bomba de verdad. Pierde ' + c.name + '. Pierde de verdad.'; },
      live: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' se pasan una bomba durante un minuto eterno. Resulta ser un bizcocho con forma de bomba. Se lo comen entre lágrimas.'; } },

    /* arenas movedizas */
    { k: 'arenas_rescate', n: 2, rel: 'ally', w: 5, type: 'heal', scene: 'quicksand',
      text: function(a, b){ return b.name + ' se hunde en unas arenas movedizas. ' + a.name + ' lanza una cuerda en el último segundo y saca a ' + b.name + ' tirando con todas sus fuerzas.'; } },
    { k: 'arenas_rival', n: 2, rel: 'stranger', w: 4, type: 'death', fx: 'die_b', scene: 'quicksand',
      text: function(a, b){ return b.name + ' se hunde en unas arenas movedizas y pide ayuda a ' + a.name + '. ' + a.name + ' se sienta a mirar con un bocadillo en la mano.'; },
      live: function(a, b){ return b.name + ' se hunde en unas arenas movedizas. ' + a.name + ', a regañadientes, tiende una rama. «Me debes una», dice.'; } },
    { k: 'arenas_solo', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'quicksand',
      text: function(a){ return a.name + ' pisa unas arenas movedizas y hace justo lo que no hay que hacer: patalear. Muy rápido. Muy fuerte.'; },
      live: function(a){ return a.name + ' cae en unas arenas movedizas, recuerda un documental y se queda ' + g(a, 'muy quieto', 'muy quieta') + ' flotando hasta salir. El documental le salva la vida.'; } },

    /* murciélagos */
    { k: 'murcielagos', n: 2, rel: 'any', w: 5, type: 'neutral', scene: 'bats',
      text: function(a, b){ return a.name + ' y ' + b.name + ' entran en una cueva para dormir. Mil murciélagos salen a la vez. Ninguno de los dos volverá a entrar en una cueva jamás.'; } },
    { k: 'murcielagos_solo', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'bats',
      text: function(a){ return a.name + ' grita «¡hola!» en una cueva. Responden dos mil murciélagos. Ha sido un error social.'; } },
    { k: 'murcielagos_trio', n: 3, rel: 'group', w: 3, type: 'fight', scene: 'bats',
      text: function(a, b, c){ return a.name + ' despierta a una colonia de murciélagos para asustar a ' + b.name + ' y ' + c.name + '. Los murciélagos persiguen a los tres. Justicia poética.'; } },

    /* robot */
    { k: 'robot_baile', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'robot',
      text: function(a){ return 'Un robot de los patrocinadores aparece ante ' + a.name + ' y le reta a un duelo de baile. ' + a.name + ' pierde, pero gana un amigo metálico.'; } },
    { k: 'robot_ataque', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'robot',
      text: function(a){ return 'Un robot de seguridad confunde a ' + a.name + ' con un intruso. Los robots no escuchan explicaciones.'; },
      live: function(a){ return 'Un robot de seguridad persigue a ' + a.name + ' hasta que se le acaba la batería. ' + a.name + ' se sienta encima a descansar.'; } },
    { k: 'robot_pareja', n: 2, rel: 'lover', w: 3, type: 'romance', scene: 'robot',
      text: function(a, b){ return 'Un robot camarero sirve a ' + a.name + ' y ' + b.name + ' una cena romántica. Toca el violín con un solo brazo. Es precioso y un poco inquietante.'; } },

    /* unicornio */
    { k: 'unicornio', n: 1, rel: 'any', w: 4, type: 'item', scene: 'unicorn', fx: 'get', it: 'botiquin', req: { a: 'none' },
      text: function(a){ return 'Un unicornio cruza un arcoíris y deja caer un botiquín a los pies de ' + a.name + '. Nadie más lo ha visto. Nadie le cree.'; } },
    { k: 'unicornio_duo', n: 2, rel: 'any', w: 4, type: 'neutral', scene: 'unicorn',
      text: function(a, b){ return a.name + ' y ' + b.name + ' ven pasar un unicornio. Deciden no contárselo a nadie para que no les tomen por locos.'; } },
    { k: 'unicornio_amor', n: 2, rel: 'stranger', free: true, w: 3, type: 'romance', scene: 'unicorn', fx: 'love',
      text: function(a, b){ return a.name + ' y ' + b.name + ' son los únicos que han visto el unicornio. Ese secreto compartido acaba en algo más.'; } },

    /* hamaca */
    { k: 'hamaca_coco', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'hammock',
      text: function(a){ return a.name + ' se echa la siesta en una hamaca entre dos palmeras. Un coco decide que es su momento.'; },
      live: function(a){ return a.name + ' se echa la siesta en una hamaca. Un coco cae justo en la cabeza. Chichón enorme, pero sigue en pie... bueno, ' + g(a, 'tumbado', 'tumbada') + '.'; } },
    { k: 'hamaca_robo', n: 2, rel: 'any', w: 4, type: 'theft', scene: 'hammock', fx: 'steal', req: { b: 'any' },
      text: function(a, b, c, x){ return b.name + ' duerme en una hamaca a pierna suelta. ' + a.name + ' aprovecha para llevarse ' + x.item.short + ' y deja un coco en su lugar.'; } },

    /* beso */
    { k: 'beso', n: 2, rel: 'lover', w: 7, type: 'romance', scene: 'kiss',
      text: function(a, b){ return a.name + ' y ' + b.name + ' se dan un beso de película al atardecer. Hasta la ardilla más cínica de la arena aplaude.'; } },
    { k: 'beso_primero', n: 2, rel: 'ally', free: true, w: 5, type: 'romance', scene: 'kiss', fx: 'love',
      text: function(a, b){ return 'Tras días de alianza, ' + a.name + ' y ' + b.name + ' se dan su primer beso. Llevaba tiempo cantado.'; } },
    { k: 'beso_robado2', n: 2, rel: 'stranger', free: true, w: 4, type: 'romance', scene: 'kiss', fx: 'love',
      text: function(a, b){ return a.name + ' tropieza, cae sobre ' + b.name + ' y... se besan. Nadie lo planeó. Nadie se arrepiente.'; } },
    { k: 'beso_pillado', n: 3, rel: 'group', w: 5, type: 'betrayal', scene: 'caught', fx: 'breakupac',
      cond: function(a, b, c){ return a.loverId === c.id && c.loverId === a.id && b.id !== c.id; },
      text: function(a, b, c){ return c.name + ' pilla a ' + a.name + ' dando un beso a ' + b.name + ' detrás de un árbol. «¡Era un beso de amistad!», grita ' + a.name + '. Nadie se lo cree.'; } },

    /* póker */
    { k: 'poker_trampas', n: 2, rel: 'any', w: 5, type: 'theft', scene: 'poker', fx: 'steal', req: { b: 'any' },
      text: function(a, b, c, x){ return a.name + ' gana a ' + b.name + ' al póker con cinco ases. ' + b.name + ' sospecha, pero paga con ' + x.item.short + '. La baraja solo tenía cuatro.'; } },
    { k: 'poker_amistoso', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'poker',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' juegan al póker apostando bayas. ' + a.name + ' pierde todo y se come las apuestas de los demás.'; } },
    { k: 'poker_duelo', n: 2, rel: 'any', w: 3, type: 'death', fx: 'kill_b', scene: 'poker',
      text: function(a, b){ return a.name + ' pilla a ' + b.name + ' haciendo trampas al póker. En la arena, eso se paga caro.'; },
      live: function(a, b){ return a.name + ' pilla a ' + b.name + ' haciendo trampas al póker. Lo arreglan jugando otra partida. ' + b.name + ' vuelve a hacer trampas.'; } },

    /* burbuja */
    { k: 'burbuja', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'bubble',
      text: function(a){ return a.name + ' sopla una pompa de jabón gigante, se mete dentro para probar y sale flotando rumbo a la estratosfera.'; },
      live: function(a){ return a.name + ' se mete en una pompa de jabón gigante y flota un rato sobre la arena. La pompa explota a tres metros. Aterrizaje suave.'; } },
    { k: 'burbuja_duo', n: 2, rel: 'any', w: 3, type: 'neutral', scene: 'bubble',
      text: function(a, b){ return a.name + ' y ' + b.name + ' encuentran un bote de pompas gigante. Se pasan la tarde como si tuvieran cinco años.'; } },

    /* pie gigante */
    { k: 'pie_gigante', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'giantfoot',
      text: function(a){ return 'Un pie gigante baja del cielo y pisa a ' + a.name + '. Nadie sabe de quién es el pie. Nadie quiere saberlo.'; },
      live: function(a){ return 'Un pie gigante baja del cielo a un palmo de ' + a.name + ', que se aparta de un salto. El pie se retira. Deja olor a queso.'; } },
    { k: 'pie_gigante_duo', n: 2, rel: 'any', w: 3, type: 'death', fx: 'die_b', scene: 'giantfoot',
      text: function(a, b){ return a.name + ' avisa a ' + b.name + ': «¡Cuidado arriba!». ' + b.name + ' mira hacia abajo. Error.'; },
      live: function(a, b){ return 'Un pie gigante cae entre ' + a.name + ' y ' + b.name + '. Se miran, se abrazan y deciden no volver a pasar por esa zona.'; } },

    /* láseres */
    { k: 'laseres', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'lasers',
      text: function(a){ return a.name + ' entra en una sala llena de láseres rojos e intenta cruzarla como en las películas. No es una película.'; },
      live: function(a){ return a.name + ' cruza una sala llena de láseres con piruetas dignas de una espía profesional. Al salir, hace una reverencia.'; } },
    { k: 'laseres_duo', n: 2, rel: 'ally', w: 3, type: 'alliance', scene: 'lasers',
      text: function(a, b){ return a.name + ' y ' + b.name + ' cruzan juntos una trampa de láseres, coordinados como en un baile. Ahora se sienten invencibles.'; } },

    /* surf */
    { k: 'surf', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'surf',
      text: function(a){ return a.name + ' encuentra una tabla de surf y pilla la ola perfecta en un lago donde no debería haber olas.'; } },
    { k: 'surf_duo', n: 2, rel: 'any', w: 4, type: 'death', fx: 'die_b', scene: 'surf',
      text: function(a, b){ return a.name + ' y ' + b.name + ' compiten a ver quién coge la ola más grande. La ola más grande se lleva a ' + b.name + '.'; },
      live: function(a, b){ return a.name + ' y ' + b.name + ' surfean la misma ola sin caerse. Chocan los cinco en plena cresta. Épico.'; } },

    /* cometa */
    { k: 'cometa', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'kite',
      text: function(a){ return a.name + ' hace volar una cometa en un día de viento fuerte. Demasiado fuerte. La cometa se lleva a ' + a.name + ' de paseo sin billete de vuelta.'; },
      live: function(a){ return a.name + ' hace volar una cometa y una ráfaga levanta a ' + a.name + ' dos metros del suelo. Aterriza con el pelo de punta y una historia para contar.'; } },

    /* equipos */
    { k: 'team_bomba', team: 'rivals', n: 2, rel: 'any', w: 5, type: 'death', fx: 'kill_b', scene: 'bomb',
      text: function(a, b, c, x){ return cap(x.ta) + ' envían un «regalo» al campamento de ' + x.tb + ': una bomba con lazo. ' + b.name + ' abre el regalo.'; },
      live: function(a, b, c, x){ return cap(x.ta) + ' envían una bomba con lazo a ' + x.tb + '. ' + b.name + ' la devuelve con otro lazo. Nadie sabe ya de quién es la bomba.'; } },
    { k: 'team_te', team: 'rivals', n: 2, rel: 'any', w: 4, type: 'alliance', scene: 'tea',
      text: function(a, b, c, x){ return a.name + ' (' + x.ta + ') y ' + b.name + ' (' + x.tb + ') firman un alto el fuego tomando el té. Es la reunión diplomática más elegante de la historia.'; } },
    { k: 'team_poker', team: 'rivals', n: 2, rel: 'any', w: 4, type: 'theft', scene: 'poker', fx: 'steal', req: { b: 'any' },
      text: function(a, b, c, x){ return cap(x.ta) + ' desafían a ' + x.tb + ' a una partida de póker. ' + a.name + ' gana a ' + b.name + ' y se lleva ' + x.item.short + '.'; } },
    { k: 'team_laser', team: 'mates', n: 2, rel: 'ally', w: 4, type: 'alliance', scene: 'lasers',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' atraviesan juntos una trampa de láseres para llegar a un alijo de provisiones. ' + cap(x.ta) + ' cenan como reyes.'; } }
  ]);
})();
