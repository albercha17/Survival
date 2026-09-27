(function(){
  var A = window.Arena = window.Arena || {};
  function g(t, m, f){ return t.gender === 'chica' ? f : m; }
  function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  A.EVENTS = A.EVENTS.concat([

    /* ================= SELVA ================= */
    { k: 'selva_mono', biome: 'selva', n: 1, rel: 'any', w: 6, type: 'theft', scene: 'explore', fx: 'lose', req: { a: 'any' },
      text: function(a, b, c, x){ return 'Un mono baja de un árbol, roba ' + x.item.short + ' a ' + a.name + ' y desaparece entre las lianas antes de que pueda reaccionar.'; } },
    { k: 'selva_dosel', biome: 'selva', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'fall',
      text: function(a){ return a.name + ' cruza el dosel de la selva agarrándose a las lianas. Una se rompe justo a mitad de camino.'; },
      live: function(a){ return a.name + ' cruza el dosel de la selva agarrándose a las lianas. Una se rompe, pero llega a agarrar la siguiente a tiempo.'; } },
    { k: 'selva_serpiente', biome: 'selva', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'poison', prop: 'mushroom',
      text: function(a){ return a.name + ' aparta unas hojas y encuentra una serpiente de colores vivos. Los colores vivos nunca son buena señal.'; },
      live: function(a){ return a.name + ' casi pisa una serpiente de colores vivos, que se aleja tan asustada como ' + g(a, 'él', 'ella') + '.'; } },
    { k: 'selva_loros', biome: 'selva', n: 2, rel: 'any', w: 5, type: 'neutral', scene: 'explore',
      text: function(a, b){ return 'Una bandada de loros sigue a ' + a.name + ' y ' + b.name + ' imitando su conversación. Es entrañable durante los primeros diez minutos.'; } },
    { k: 'selva_humedad', biome: 'selva', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'injured',
      text: function(a){ return 'La humedad de la selva deja a ' + a.name + ' con el pelo triplicado de volumen y la ropa pegada al cuerpo. La imagen quedará para el recuerdo.'; } },
    { k: 'selva_tribu', biome: 'selva', n: 3, rel: 'group', w: 5, type: 'alliance', scene: 'campfire', fx: 'ally3',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' se pintan la cara con barro de colores y se declaran una tribu. Todavía no tienen nombre ni bandera, pero tienen mucha moral.'; } },
    { k: 'selva_lluvia', biome: 'selva', n: 2, rel: 'ally', w: 4, type: 'alliance', scene: 'handshake',
      text: function(a, b){ return 'Un chaparrón tropical sorprende a ' + a.name + ' y ' + b.name + ', que se refugian bajo una hoja gigante. Apenas caben, pero ninguno se queja.'; } },

    /* ================= NIEVE ================= */
    { k: 'nieve_avalancha', biome: 'nieve', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'boulder',
      text: function(a){ return 'Un ruido sordo en la montaña es lo último que oye ' + a.name + ' antes de que la nieve se lo lleve todo por delante.'; },
      live: function(a){ return 'Una pequeña avalancha pasa a un lado de ' + a.name + ', que se queda blanco de nieve y del susto.'; } },
    { k: 'nieve_congelacion', biome: 'nieve', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'injured',
      text: function(a){ return 'El frío deja los dedos de ' + a.name + ' tan rígidos que no puede ni atarse los cordones. Improvisa unos guantes con calcetines.'; } },
    { k: 'nieve_iglu', biome: 'nieve', n: 2, rel: 'any', w: 5, type: 'alliance', scene: 'dig', fx: 'ally',
      text: function(a, b){ return a.name + ' y ' + b.name + ' pasan la tarde construyendo un iglú. Queda torcido, pero abriga, y ahora son algo más que conocidos.'; } },
    { k: 'nieve_oso_polar', biome: 'nieve', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'animal', prop: 'bear',
      text: function(a){ return 'Un oso blanco enorme confunde a ' + a.name + ' con su cena de la noche. No se equivoca del todo.'; },
      live: function(a){ return 'Un oso blanco enorme olfatea a ' + a.name + ', decide que no merece la pena el esfuerzo y sigue su camino.'; } },
    { k: 'nieve_trineo', biome: 'nieve', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'chase',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' encuentran un trineo abandonado y organizan una carrera cuesta abajo. Gana el trineo, que sigue solo hasta perderse de vista.'; } },
    { k: 'nieve_chocolate', biome: 'nieve', n: 2, rel: 'ally', w: 4, type: 'alliance', scene: 'campfire',
      text: function(a, b){ return a.name + ' prepara chocolate caliente derritiendo nieve sobre una hoguera. Sabe fatal. Lo beben igual, muy despacio, sin decir nada.'; } },

    /* ================= DESIERTO ================= */
    { k: 'desierto_escorpion', biome: 'desierto', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'poison',
      text: function(a){ return a.name + ' levanta una piedra para hacer sombra y descubre demasiado tarde que ya tenía inquilino.'; },
      live: function(a){ return a.name + ' levanta una piedra y un escorpión sale disparado en la otra dirección. Empate técnico de sustos.'; } },
    { k: 'desierto_tormenta', biome: 'desierto', n: 2, rel: 'any', w: 5, type: 'neutral', scene: 'injured',
      text: function(a, b){ return 'Una tormenta de arena obliga a ' + a.name + ' y ' + b.name + ' a taparse la cara con lo que encuentran. Pasan una hora sin verse ni a un metro.'; } },
    { k: 'desierto_oasis', biome: 'desierto', n: 1, rel: 'any', w: 5, type: 'item', scene: 'item', fx: 'get', it: 'comida', req: { a: 'none' },
      text: function(a){ return a.name + ' encuentra un oasis de verdad, con palmeras, agua fresca y una nevera portátil que alguien olvidó allí.'; } },
    { k: 'desierto_camello', biome: 'desierto', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'explore',
      text: function(a){ return 'Un camello solitario observa a ' + a.name + ' con desdén durante un buen rato antes de seguir su camino sin prisa.'; } },
    { k: 'desierto_caravana', biome: 'desierto', n: 3, rel: 'group', w: 5, type: 'alliance', scene: 'handshake', fx: 'ally3',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' forman una caravana para cruzar las dunas juntos. Se reparten la poca agua que tienen a partes iguales.'; } },
    { k: 'desierto_noche', biome: 'desierto', n: 2, rel: 'lover', w: 4, type: 'romance', scene: 'love',
      text: function(a, b){ return 'De noche el desierto se vuelve helado. ' + a.name + ' y ' + b.name + ' se acurrucan bajo las estrellas más claras que han visto nunca.'; } },

    /* ================= CIUDAD ABANDONADA ================= */
    { k: 'ciudad_alarma', biome: 'ciudad', n: 2, rel: 'any', w: 5, type: 'fight', scene: 'explore',
      text: function(a, b){ return a.name + ' activa sin querer la alarma de una tienda abandonada. ' + b.name + ' aparece corriendo a ver qué pasa. Ninguno se libra del susto.'; } },
    { k: 'ciudad_ascensor', biome: 'ciudad', n: 1, rel: 'any', w: 5, type: 'death', fx: 'die_a', scene: 'fall',
      text: function(a){ return a.name + ' entra en un ascensor abandonado sin fijarse en que el hueco lleva veinte años vacío.'; },
      live: function(a){ return a.name + ' está a punto de entrar en un ascensor abandonado. Por suerte, las puertas oxidadas no ceden a tiempo.'; } },
    { k: 'ciudad_coche', biome: 'ciudad', n: 1, rel: 'any', w: 5, type: 'item', scene: 'item', fx: 'get', it: 'mapa', req: { a: 'none' },
      text: function(a){ return a.name + ' registra un coche abandonado y encuentra un mapa de carreteras de una ciudad que ya no existe. Aun así, es mejor que nada.'; } },
    { k: 'ciudad_saqueo', biome: 'ciudad', n: 2, rel: 'stranger', w: 5, type: 'theft', scene: 'steal', fx: 'steal', req: { b: 'any' },
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' llegan al mismo centro comercial abandonado. Solo uno sale con ' + x.item.short + ': ' + a.name + '.'; } },
    { k: 'ciudad_refugio', biome: 'ciudad', n: 3, rel: 'group', w: 5, type: 'alliance', scene: 'handshake', fx: 'ally3',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' encuentran un piso con el techo intacto y deciden que, por ahora, ese es su hogar.'; } },
    { k: 'ciudad_eco', biome: 'ciudad', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'explore',
      text: function(a){ return a.name + ' grita su propio nombre en una avenida vacía. El eco le contesta cinco veces. Ninguna suena tranquilizadora.'; } },

    /* ================= ISLA ================= */
    { k: 'isla_botella', biome: 'isla', n: 1, rel: 'any', w: 5, type: 'item', scene: 'item', fx: 'get', it: 'anillo', req: { a: 'none' },
      text: function(a){ return a.name + ' encuentra una botella en la orilla con una nota dentro: «Si lees esto, ya es tarde». También hay un anillo. No hay más contexto.'; } },
    { k: 'isla_marea', biome: 'isla', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'quicksand',
      text: function(a){ return 'La marea sube más rápido de lo que ' + a.name + ' esperaba en una pequeña cueva de la costa. El mar no avisa dos veces.'; },
      live: function(a){ return 'La marea sube más rápido de lo esperado, pero ' + a.name + ' logra salir de la cueva justo antes de que se inunde del todo.'; } },
    { k: 'isla_cangrejos', biome: 'isla', n: 1, rel: 'any', w: 5, type: 'fight', scene: 'animal', prop: 'crab',
      text: function(a){ return 'Un cangrejo particularmente territorial defiende su trozo de playa de ' + a.name + ' con más determinación de la esperada.'; } },
    { k: 'isla_tesoro', biome: 'isla', n: 1, rel: 'any', w: 5, type: 'item', scene: 'dig', fx: 'get', it: 'tesoro', req: { a: 'none' },
      text: function(a){ return 'Un mapa dibujado en una hoja de palmera lleva a ' + a.name + ' hasta un cofre enterrado en la arena. Por una vez, el tesoro no es una decepción.'; } },
    { k: 'isla_hoguera', biome: 'isla', n: 3, rel: 'group', w: 5, type: 'alliance', scene: 'campfire', fx: 'ally3',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' asan cocos junto a una hoguera en la playa y deciden que, isla o no, van a sobrevivir juntos.'; } },
    { k: 'isla_atardecer', biome: 'isla', n: 2, rel: 'lover', w: 5, type: 'romance', scene: 'love',
      text: function(a, b){ return a.name + ' y ' + b.name + ' ven el atardecer sentados en la arena. Por un momento se olvidan de que están compitiendo por sobrevivir.'; } }
  ]);
})();
