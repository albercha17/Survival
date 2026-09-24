(function(){
  var A = window.Arena = window.Arena || {};
  function g(t, m, f){ return t.gender === 'chica' ? f : m; }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  var SITIO = ['junto al lago', 'en un claro', 'en la colina', 'cerca de la Cornucopia', 'en el bosque de pinos', 'en la playa', 'detrás de unas rocas', 'en el prado'];

  A.EVENTS = A.EVENTS.concat([
    /* ---------- ovni ---------- */
    { k: 'ovni', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'ufo',
      text: function(a){ return 'Un ovni aparece sobre ' + a.name + ' ' + pick(SITIO) + ' y se lleva a ' + a.name + ' con un rayo verde. Nadie lo ve venir. Ni volver.'; },
      live: function(a){ return 'Un ovni abduce a ' + a.name + ', le hace tres preguntas sobre la tortilla de patatas y deja a ' + a.name + ' en el suelo con cara de decepción.'; } },
    { k: 'ovni_grupo', n: 2, rel: 'any', w: 3, type: 'death', fx: 'die_b', scene: 'ufo',
      text: function(a, b){ return a.name + ' y ' + b.name + ' ven luces en el cielo. ' + a.name + ' se esconde; ' + b.name + ' saluda. Mala elección: los extraterrestres se llevan a ' + b.name + '.'; },
      live: function(a, b){ return a.name + ' y ' + b.name + ' ven un ovni. Los extraterrestres se llevan a ' + b.name + ' un rato y devuelven a ' + b.name + ' con un peinado nuevo.'; } },
    { k: 'ovni_regalo', n: 1, rel: 'any', w: 3, type: 'item', scene: 'ufo', fx: 'get', it: 'pistola', req: { a: 'none' },
      text: function(a){ return 'Un ovni abduce a ' + a.name + ' durante cinco minutos. Vuelve con una pistola láser (que parece una pistola normal) y ninguna explicación.'; } },

    /* ---------- nieve ---------- */
    { k: 'nieve_pelea', n: 2, rel: 'any', w: 6, type: 'fight', scene: 'snowball',
      text: function(a, b){ return 'Nieva en la arena en pleno verano. ' + a.name + ' y ' + b.name + ' lo celebran con una guerra de bolas de nieve épica. Nadie gana; todos se congelan.'; } },
    { k: 'nieve_trio', n: 3, rel: 'group', w: 5, type: 'fight', scene: 'snowball',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' montan una guerra de bolas de nieve. ' + c.name + ' mete una piedra dentro de una bola. Se acaba la amistad.'; } },
    { k: 'nieve_munyeco', n: 2, rel: 'any', w: 5, type: 'alliance', scene: 'snowman',
      text: function(a, b){ return a.name + ' y ' + b.name + ' construyen un muñeco de nieve y lo nombran jefe de su alianza. Es el mejor líder que han tenido.'; } },
    { k: 'nieve_munyeco3', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'snowman',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' hacen un muñeco de nieve con la cara de su peor enemigo. Se sienten mucho mejor.'; } },
    { k: 'nieve_congelado', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'snowman',
      text: function(a){ return 'Una tormenta de nieve sorprende a ' + a.name + ' en mitad del prado. Al día siguiente solo hay un muñeco de nieve con cara de sorpresa.'; },
      live: function(a){ return 'Una tormenta de nieve sorprende a ' + a.name + ', que sobrevive haciendo un iglú con técnica cuestionable pero eficaz.'; } },

    /* ---------- almohadas / tartas / barro ---------- */
    { k: 'almohadas', n: 2, rel: 'any', w: 5, type: 'fight', scene: 'pillow',
      text: function(a, b){ return a.name + ' y ' + b.name + ' encuentran dos almohadas y se declaran la guerra. Las plumas tardarán días en posarse.'; } },
    { k: 'almohadas_pareja', n: 2, rel: 'lover', w: 5, type: 'romance', scene: 'pillow',
      text: function(a, b){ return a.name + ' y ' + b.name + ' tienen una pelea de almohadas que acaba en risas, abrazos y plumas por todas partes.'; } },
    { k: 'tarta_cara', n: 2, rel: 'any', w: 6, type: 'fight', scene: 'pie',
      text: function(a, b){ return a.name + ' estampa una tarta de nata en la cara de ' + b.name + '. Nadie sabe de dónde ha salido la tarta. ' + b.name + ' jura venganza con la boca llena.'; } },
    { k: 'tarta_aliado', n: 2, rel: 'ally', w: 4, type: 'fight', scene: 'pie',
      text: function(a, b){ return 'Para celebrar su alianza, ' + a.name + ' prepara una tarta para ' + b.name + '. Se la lanza a la cara. Dice que es una tradición familiar.'; } },
    { k: 'barro_lucha', n: 2, rel: 'any', w: 5, type: 'fight', scene: 'mud',
      text: function(a, b){ return a.name + ' y ' + b.name + ' acaban peleando en un charco de barro. El público de casa pide repetición a cámara lenta.'; } },
    { k: 'barro_mortal', n: 2, rel: 'any', w: 4, type: 'death', fx: 'kill_b', scene: 'mud',
      text: function(a, b){ return a.name + ' y ' + b.name + ' se pelean en unas arenas de barro. ' + b.name + ' se hunde y el barro no devuelve a nadie.'; },
      live: function(a, b){ return a.name + ' y ' + b.name + ' se pelean en el barro. Salen los dos marrones de pies a cabeza y sin saber quién ha ganado.'; } },

    /* ---------- espadas y arcos ---------- */
    { k: 'espadas', n: 2, rel: 'any', w: 6, type: 'death', fx: 'kill_b', scene: 'swordfight',
      text: function(a, b){ return a.name + ' y ' + b.name + ' encuentran dos espadas oxidadas y se baten en duelo ' + pick(SITIO) + '. Chispas, gritos y una estocada final para ' + b.name + '.'; },
      live: function(a, b){ return a.name + ' y ' + b.name + ' se baten en duelo con espadas oxidadas. Las espadas se rompen a la vez. Se dan la mano por pura vergüenza.'; } },
    { k: 'espadas_pareja', n: 2, rel: 'lover', w: 4, type: 'romance', scene: 'swordfight',
      text: function(a, b){ return a.name + ' y ' + b.name + ' practican esgrima con palos. Es el coqueteo más violento de la historia de la arena.'; } },
    { k: 'guillermo_tell', n: 2, rel: 'ally', w: 5, type: 'neutral', scene: 'archery', req: { a: 'arco' },
      text: function(a, b){ return a.name + ' pide a ' + b.name + ' que se ponga una manzana en la cabeza para practicar puntería. Acierta en la manzana. ' + b.name + ' tarda una hora en dejar de temblar.'; } },
    { k: 'flecha_rival', n: 2, rel: 'stranger', w: 5, type: 'death', fx: 'kill_b', scene: 'archery', req: { a: 'arco' },
      text: function(a, b){ return a.name + ' tensa el arco desde lo alto de una colina y dispara a ' + b.name + '. Tiro perfecto.'; },
      live: function(a, b){ return a.name + ' dispara una flecha a ' + b.name + ', pero ' + b.name + ' se agacha a atarse los cordones en el momento exacto.'; } },

    /* ---------- magia ---------- */
    { k: 'magia_rana', n: 2, rel: 'any', w: 5, type: 'neutral', scene: 'magic',
      text: function(a, b){ return a.name + ' encuentra un sombrero de mago y una varita. Convierte a ' + b.name + ' en rana durante un minuto. ' + b.name + ' vuelve a la normalidad, pero croa de vez en cuando.'; } },
    { k: 'magia_fallo', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'magic',
      text: function(a){ return a.name + ' intenta un truco de magia con una varita que encuentra. Desaparece una piedra. Y el bocadillo. Y los calcetines de ' + a.name + '.'; } },
    { k: 'magia_amor', n: 2, rel: 'stranger', free: true, w: 4, type: 'romance', scene: 'magic', fx: 'love',
      text: function(a, b){ return a.name + ' usa una varita mágica para lanzar un hechizo de amor a ' + b.name + '. No funciona, pero ' + b.name + ' se enamora igualmente de tanto esfuerzo.'; } },

    /* ---------- fuegos artificiales / banda ---------- */
    { k: 'fuegos', n: 2, rel: 'lover', w: 5, type: 'romance', scene: 'fireworks',
      text: function(a, b){ return 'Los patrocinadores lanzan fuegos artificiales. ' + a.name + ' y ' + b.name + ' los miran abrazados y deciden que, pase lo que pase, ha valido la pena.'; } },
    { k: 'fuegos_grupo', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'fireworks',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' encienden unos cohetes abandonados. Casi todos suben. Uno persigue a ' + c.name + ' durante cinco minutos.'; } },
    { k: 'banda_rock', n: 3, rel: 'group', w: 5, type: 'alliance', scene: 'band', fx: 'ally3',
      text: function(a, b, c){ return a.name + ' toca el tambor, ' + b.name + ' la guitarra y ' + c.name + ' canta. Nace «Los Sin Cobertura». Primer concierto: tres ardillas y un oso.'; } },
    { k: 'banda_duo', n: 2, rel: 'any', w: 4, type: 'alliance', scene: 'band',
      text: function(a, b){ return a.name + ' y ' + b.name + ' improvisan un concierto con un tambor y una guitarra de tres cuerdas. Los pájaros piden que paren.'; } },

    /* ---------- cavar, trepar, correr ---------- */
    { k: 'cavar_tesoro', n: 1, rel: 'any', w: 5, type: 'item', scene: 'dig', fx: 'get', it: 'tesoro', req: { a: 'none' },
      text: function(a){ return a.name + ' se pasa la tarde cavando porque «tiene un presentimiento». Encuentra un cofre lleno de oro. El presentimiento era bueno.'; } },
    { k: 'cavar_nada', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'dig',
      text: function(a){ return a.name + ' cava un hoyo enorme buscando agua. Encuentra otro hoyo. Dentro, una nota: «Aquí tampoco».'; } },
    { k: 'trepar', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'climb',
      text: function(a){ return a.name + ' trepa al árbol más alto para ver la arena entera. La vista es preciosa. La bajada, no tanto.'; },
      live: function(a){ return a.name + ' trepa al árbol más alto, se come la manzana de la cima y baja como si nada. Pura elegancia.'; } },
    { k: 'trepar_huida', n: 2, rel: 'any', w: 4, type: 'fight', scene: 'climb',
      text: function(a, b){ return a.name + ' se sube a un árbol para escapar de ' + b.name + '. ' + b.name + ' se sienta abajo a esperar. Llevan seis horas así.'; } },
    { k: 'persecucion', n: 2, rel: 'any', w: 6, type: 'death', fx: 'kill_b', scene: 'chase',
      text: function(a, b){ return a.name + ' persigue a ' + b.name + ' por media arena. ' + b.name + ' tropieza con una raíz en el peor momento posible.'; },
      live: function(a, b){ return a.name + ' persigue a ' + b.name + ' por media arena. Los dos acaban tan agotados que se tumban en la hierba y se echan a reír.'; } },
    { k: 'persecucion_cabra', n: 2, rel: 'any', w: 4, type: 'fight', scene: 'chase',
      text: function(a, b){ return a.name + ' persigue a ' + b.name + ' porque le ha robado el turno de dormir. Una cabra se une a la persecución sin saber por qué.'; } },

    /* ---------- agua ---------- */
    { k: 'nadar_tiburon', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'swim',
      text: function(a){ return a.name + ' se da un baño en el lago. Nadie avisó de que en el lago vive un tiburón. Tampoco nadie sabe cómo llegó ahí.'; },
      live: function(a){ return a.name + ' se da un baño en el lago y un delfín le hace compañía. Nadie sabe qué hace un delfín en un lago, pero es precioso.'; } },
    { k: 'nadar_pareja', n: 2, rel: 'lover', w: 5, type: 'romance', scene: 'swim',
      text: function(a, b){ return a.name + ' y ' + b.name + ' se bañan juntos al atardecer. Un delfín salta entre los dos. Ni en las películas.'; } },
    { k: 'nadar_empujon', n: 2, rel: 'any', w: 4, type: 'death', fx: 'kill_b', scene: 'swim',
      text: function(a, b){ return a.name + ' propone a ' + b.name + ' una carrera a nado hasta la otra orilla. Solo llega ' + a.name + '. Nadie pregunta.'; },
      live: function(a, b){ return a.name + ' y ' + b.name + ' hacen una carrera a nado. Empatan. Deciden que el agua está demasiado fría para discutir.'; } },

    /* ---------- lluvia y paraguas ---------- */
    { k: 'paraguas_compartido', n: 2, rel: 'stranger', free: true, w: 5, type: 'romance', scene: 'umbrella', fx: 'love',
      text: function(a, b){ return 'Empieza a diluviar. ' + a.name + ' comparte su paraguas con ' + b.name + '. Caben justos. Muy justos. Demasiado justos.'; } },
    { k: 'paraguas_pareja', n: 2, rel: 'lover', w: 4, type: 'romance', scene: 'umbrella',
      text: function(a, b){ return a.name + ' y ' + b.name + ' pasan la tormenta bajo un paraguas que les queda pequeño. No les importa lo más mínimo.'; } },
    { k: 'paraguas_solo', n: 1, rel: 'any', w: 3, type: 'neutral', scene: 'umbrella', req: { a: 'paraguas' },
      text: function(a){ return 'Llueve a cántaros y ' + a.name + ' abre su paraguas con una sonrisa de superioridad que se ve desde el espacio.'; } },

    /* ---------- pícnic, selfie, yoga ---------- */
    { k: 'picnic', n: 2, rel: 'any', w: 5, type: 'alliance', scene: 'picnic',
      text: function(a, b){ return a.name + ' y ' + b.name + ' organizan un pícnic. Las hormigas llegan antes que la comida. Las hormigas ganan.'; } },
    { k: 'picnic_trio', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'picnic',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' montan un pícnic con mantel y todo. Un ejército de hormigas se lleva la cesta entera en perfecta formación.'; } },
    { k: 'selfie_grupo', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'selfie',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' se hacen un selfie con un móvil sin batería. Juran que ha salido genial.'; } },
    { k: 'selfie_pareja', n: 2, rel: 'lover', w: 4, type: 'romance', scene: 'selfie',
      text: function(a, b){ return a.name + ' y ' + b.name + ' se hacen su primera foto de pareja. Sale movida, pero la van a enmarcar igualmente.'; } },
    { k: 'selfie_rival', n: 2, rel: 'stranger', w: 3, type: 'neutral', scene: 'selfie',
      text: function(a, b){ return a.name + ' y ' + b.name + ' se encuentran y, antes de pelear, se hacen un selfie «por si acaso». Luego se van cada uno por su lado.'; } },
    { k: 'yoga_solo', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'yoga',
      text: function(a){ return a.name + ' practica yoga al amanecer. Alcanza la paz interior durante tres segundos, hasta que un pájaro se posa encima.'; } },
    { k: 'yoga_duo', n: 2, rel: 'ally', w: 4, type: 'alliance', scene: 'yoga',
      text: function(a, b){ return a.name + ' y ' + b.name + ' hacen yoga en pareja. Se quedan atascados en una postura durante una hora. Ahora son inseparables, en sentido literal.'; } },

    /* ---------- catapulta, dragón, fantasmas, meteoritos ---------- */
    { k: 'catapulta', n: 2, rel: 'any', w: 5, type: 'death', fx: 'kill_b', scene: 'catapult',
      text: function(a, b){ return a.name + ' construye una catapulta con ramas y cuerdas. Primer disparo: ' + b.name + '. Puntería impecable.'; },
      live: function(a, b){ return a.name + ' construye una catapulta para atacar a ' + b.name + '. La piedra sale hacia atrás y destroza la catapulta. ' + b.name + ' aplaude.'; } },
    { k: 'catapulta_fallo', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'catapult',
      text: function(a){ return a.name + ' construye una catapulta. Nadie sabe para qué. Cuando la prueba, la piedra aterriza sobre la propia catapulta.'; } },
    { k: 'dragon', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'dragon',
      text: function(a){ return 'Un dragón (los patrocinadores juran que es un dron) sobrevuela a ' + a.name + ' y echa fuego. No era un dron.'; },
      live: function(a){ return 'Un dragón escupe fuego sobre ' + a.name + ', que salta a tiempo. Solo pierde las cejas y algo de dignidad.'; } },
    { k: 'dragon_duo', n: 2, rel: 'any', w: 3, type: 'death', fx: 'die_b', scene: 'dragon',
      text: function(a, b){ return a.name + ' y ' + b.name + ' ven un dragón. ' + a.name + ' se tira al suelo; ' + b.name + ' intenta hacerse amigo del dragón. El dragón no quiere amigos.'; },
      live: function(a, b){ return 'Un dragón persigue a ' + a.name + ' y ' + b.name + '. Se esconden en un río hasta que el dragón se aburre y se va a molestar a otros.'; } },
    { k: 'fantasma', n: 2, rel: 'any', w: 5, type: 'neutral', scene: 'ghosthunt',
      text: function(a, b){ return 'Un fantasma aparece de noche ante ' + a.name + ' y ' + b.name + '. Los dos corren tanto que al día siguiente no saben dónde están.'; } },
    { k: 'fantasma_trio', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'ghosthunt',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' juegan a la ouija. Algo responde. Los tres salen corriendo en direcciones distintas.'; } },
    { k: 'meteoritos', n: 2, rel: 'any', w: 4, type: 'death', fx: 'die_b', scene: 'meteorshower',
      text: function(a, b){ return 'Lluvia de meteoritos sobre la arena. ' + a.name + ' corre en zigzag; ' + b.name + ', en línea recta. Mala estrategia.'; },
      live: function(a, b){ return 'Lluvia de meteoritos. ' + a.name + ' y ' + b.name + ' los esquivan todos bailando. Los patrocinadores les dan un diez.'; } },
    { k: 'meteoritos_trio', n: 3, rel: 'group', w: 3, type: 'death', fx: 'die_c', scene: 'meteorshower',
      text: function(a, b, c){ return 'Caen meteoritos del cielo. ' + a.name + ' y ' + b.name + ' se esconden bajo una roca; ' + c.name + ' decide pedir un deseo. Error.'; },
      live: function(a, b, c){ return 'Caen meteoritos del cielo. ' + a.name + ', ' + b.name + ' y ' + c.name + ' se esconden bajo la misma roca y descubren que caben perfectamente.'; } },

    /* ---------- hipnosis ---------- */
    { k: 'hipnosis', n: 2, rel: 'any', w: 5, type: 'theft', scene: 'hypno', fx: 'steal', req: { b: 'any' },
      text: function(a, b, c, x){ return a.name + ' hipnotiza a ' + b.name + ' con una espiral de cartón. ' + b.name + ' entrega ' + x.item.short + ' y vuelve en sí sin recordar nada.'; } },
    { k: 'hipnosis_baile', n: 2, rel: 'any', w: 4, type: 'fight', scene: 'hypno',
      text: function(a, b){ return a.name + ' hipnotiza a ' + b.name + ' y le hace bailar como una gallina durante una hora. Es lo más visto del día.'; } },
    { k: 'hipnosis_amor', n: 2, rel: 'stranger', free: true, w: 3, type: 'romance', scene: 'hypno', fx: 'love',
      text: function(a, b){ return a.name + ' intenta hipnotizar a ' + b.name + ' para que se enamore. Falla. Pero la espiral hace tanta gracia que se enamoran igualmente.'; } },

    /* ---------- equipos con escenas nuevas ---------- */
    { k: 'team_nieve', team: 'rivals', n: 2, rel: 'any', w: 5, type: 'fight', scene: 'snowball',
      text: function(a, b, c, x){ return cap(x.ta) + ' contra ' + x.tb + ': guerra de bolas de nieve. ' + a.name + ' clava una en la cara de ' + b.name + ' a veinte metros. Ovación.'; } },
    { k: 'team_banda', team: 'mates', n: 3, rel: 'group', w: 5, type: 'alliance', scene: 'band',
      text: function(a, b, c, x){ return cap(x.ta) + ' componen su himno: ' + a.name + ' a la percusión, ' + b.name + ' a la guitarra y ' + c.name + ' a la voz. Letra: «' + x.cry + '», repetido cuarenta veces.'; } },
    { k: 'team_espadas', team: 'rivals', n: 2, rel: 'any', w: 6, type: 'death', fx: 'kill_b', scene: 'swordfight',
      text: function(a, b, c, x){ return 'Duelo de espadas entre ' + a.name + ', de ' + x.ta + ', y ' + b.name + ', de ' + x.tb + '. Hay chispas, gritos y un solo superviviente: ' + a.name + '.'; },
      live: function(a, b, c, x){ return 'Duelo de espadas entre ' + a.name + ' y ' + b.name + '. Tras media hora de choques, los dos equipos llaman a cenar y el duelo queda aplazado.'; } },
    { k: 'team_selfie', team: 'mates', n: 3, rel: 'group', w: 4, type: 'alliance', scene: 'selfie',
      text: function(a, b, c, x){ return cap(x.ta) + ' se hacen la foto oficial del equipo: ' + a.name + ' pone morritos, ' + b.name + ' cierra los ojos y a ' + c.name + ' solo se le ve media cara. Perfecta.'; } },
    { k: 'team_catapulta', team: 'rivals', n: 2, rel: 'any', w: 5, type: 'death', fx: 'kill_b', scene: 'catapult',
      text: function(a, b, c, x){ return cap(x.ta) + ' fabrican una catapulta. ' + a.name + ' apunta al campamento de ' + x.tb + ' y alcanza de lleno a ' + b.name + '.'; },
      live: function(a, b, c, x){ return cap(x.ta) + ' fabrican una catapulta para atacar a ' + x.tb + '. La piedra da la vuelta y aterriza en su propio campamento.'; } },
    { k: 'team_tarta', team: 'rivals', n: 2, rel: 'any', w: 4, type: 'fight', scene: 'pie',
      text: function(a, b, c, x){ return a.name + ' se cuela en el campamento de ' + x.tb + ' y estampa una tarta en la cara de ' + b.name + '. Es la ofensiva más dulce de la guerra.'; } },
    { k: 'team_picnic', team: 'mates', n: 2, rel: 'ally', w: 4, type: 'alliance', scene: 'picnic',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' organizan un pícnic de equipo para ' + x.ta + '. Las hormigas se afilian al equipo. Ahora son mayoría.'; } },
    { k: 'team_fuegos', team: 'mates', n: 3, rel: 'group', w: 4, type: 'alliance', scene: 'fireworks',
      text: function(a, b, c, x){ return cap(x.ta) + ' celebran seguir en pie con fuegos artificiales. ' + a.name + ', ' + b.name + ' y ' + c.name + ' gritan «' + x.cry + '» mientras el cielo explota de colores.'; } }
  ]);

  function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
})();
