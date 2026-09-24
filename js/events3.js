(function(){
  var A = window.Arena = window.Arena || {};

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function g(t, m, f){ return t.gender === 'chica' ? f : m; }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ================= RASGOS DE PERSONALIDAD ================= */
  A.TRAITS = {
    romantico:   { m: 'romántico', f: 'romántica', mods: { romance: 2.3, family: 1.4 } },
    ladron:      { m: 'ladrón', f: 'ladrona', mods: { theft: 2.6 } },
    gafe:        { m: 'gafe', f: 'gafe', mods: { neutral: 1.2 }, victim: 1.9 },
    suertudo:    { m: 'suertudo', f: 'suertuda', mods: { item: 1.5 }, victim: 0.45 },
    sanguinario: { m: 'sanguinario', f: 'sanguinaria', mods: { fight: 1.6, death: 1.3 }, killer: 2.2 },
    pacifista:   { m: 'pacifista', f: 'pacifista', mods: { alliance: 1.8, heal: 1.6, death: 0.6 }, killer: 0.4 },
    traicionero: { m: 'traicionero', f: 'traicionera', mods: { betrayal: 2.6 }, killer: 1.3 },
    fiestero:    { m: 'fiestero', f: 'fiestera', mods: { neutral: 1.6, romance: 1.2 } },
    carismatico: { m: 'carismático', f: 'carismática', mods: { alliance: 2, romance: 1.4 } },
    cotilla:     { m: 'cotilla', f: 'cotilla', mods: { betrayal: 1.5, neutral: 1.3 } },
    torpe:       { m: 'torpe', f: 'torpe', mods: { neutral: 1.3, fight: 1.2 }, victim: 1.5 },
    bromista:    { m: 'bromista', f: 'bromista', mods: { fight: 1.6, neutral: 1.3 } },
    coleccionista: { m: 'coleccionista', f: 'coleccionista', mods: { item: 2.4, theft: 1.3 } },
    curandero:   { m: 'curandero', f: 'curandera', mods: { heal: 2.8 }, victim: 0.8 },
    dramatico:   { m: 'dramático', f: 'dramática', mods: { romance: 1.5, betrayal: 1.5, fight: 1.3 } },
    superviviente: { m: 'superviviente nato', f: 'superviviente nata', mods: { item: 1.3 }, victim: 0.6, killer: 1.3 }
  };

  /* ================= EDICIONES ================= */
  A.EDITIONS = [
    { id: 'clasica', w: 3, name: 'Edición clásica', desc: 'Todo en su justa medida... más o menos.', mods: {} },
    { id: 'amor', w: 2, name: 'Fiebre del amor', desc: 'Algo hay en el agua: el amor está por todas partes.', mods: { romance: 2.5, family: 1.8 } },
    { id: 'viboras', w: 2, name: 'Nido de víboras', desc: 'Nadie se fía de nadie. Ni de su propia sombra.', mods: { betrayal: 2.5, theft: 1.7, alliance: 0.7 } },
    { id: 'mercadillo', w: 2, name: 'Gran mercadillo', desc: 'Llueven objetos del cielo y todo el mundo quiere los de los demás.', mods: { item: 2.3, theft: 2 } },
    { id: 'paz', w: 2, name: 'Semana de la paz', desc: 'Los patrocinadores piden buen rollo. De momento.', mods: { alliance: 2.1, heal: 2, neutral: 1.3, fight: 0.6 }, lethality: 0.8 },
    { id: 'caos', w: 2, name: 'Caos absoluto', desc: 'Las leyes de la física se han tomado el día libre.', chaos: true },
    { id: 'torpes', w: 2, name: 'Olimpiada de torpes', desc: 'Hoy todo el mundo tropieza. Con todo.', mods: { neutral: 1.5, fight: 1.3 } },
    { id: 'bronca', w: 2, name: 'Noche de bronca', desc: 'Hay ganas de pelea y nadie tiene paciencia.', mods: { fight: 2.3, death: 1.3 }, lethality: 1.25 },
    { id: 'telenovela', w: 2, name: 'Telenovela', desc: 'Celos, pillados, bodas, lágrimas y más celos.', mods: { romance: 1.9, betrayal: 1.7, family: 1.6 } },
    { id: 'hospital', w: 1, name: 'Hospital de campaña', desc: 'Hay botiquines por todas partes y mucha vocación sanitaria.', mods: { heal: 2.8, item: 1.4 } },
    { id: 'fiesta', w: 1, name: 'Fiesta sin fin', desc: 'Música, baile y muy poco sentido común.', mods: { neutral: 2, romance: 1.4, alliance: 1.3 } },
    { id: 'sangrienta', w: 1, name: 'Edición sangrienta', desc: 'Los patrocinadores quieren acción. Mucha.', mods: { death: 1.6, fight: 1.5 }, lethality: 1.45 }
  ];

  /* ================= BANCOS DE PIEZAS ================= */
  var LUGAR = ['junto al río', 'en lo alto de un árbol', 'dentro de una cueva húmeda', 'en mitad de un campo de girasoles',
    'al borde de un acantilado', 'bajo un puente de cuerda', 'en un claro del bosque', 'entre unas ruinas antiguas',
    'en un pantano que huele a queso', 'detrás de una cascada', 'cerca de la Cornucopia', 'en una colina con demasiado viento',
    'en un campo de setas sospechosas', 'junto a una hoguera abandonada', 'en un cementerio de carritos de supermercado',
    'en una playa sin mar', 'en un bosque de bambú', 'en un laberinto de arbustos', 'dentro de un tronco hueco',
    'en una cabaña con un cartel de «prohibido el paso»', 'en la cima de una montaña', 'en un huerto de calabazas gigantes',
    'en una estación de tren abandonada', 'en un parque de atracciones oxidado', 'junto a un lago helado',
    'en un campo de minigolf en ruinas', 'en una biblioteca en mitad del bosque', 'bajo un arcoíris sospechosamente cercano',
    'en un desierto de arena rosa', 'en un pueblo fantasma'];

  var OBJ = ['una tostadora', 'un flotador de unicornio', 'una peluca de cantante de ópera', 'un teléfono de disco',
    'una bicicleta sin ruedas', 'un diccionario de klingon', 'un bote de pepinillos', 'una trompeta', 'un disfraz de gallina',
    'una bola de discoteca', 'un patinete eléctrico sin batería', 'un gnomo de jardín', 'una alfombra voladora que no vuela',
    'un sombrero de copa', 'una pecera sin pez', 'un cactus en maceta', 'una armónica', 'un calendario de 1998',
    'unas gafas de bucear', 'un tambor', 'un yoyó', 'un traje de astronauta', 'una silla de playa', 'un microondas',
    'una lámpara de lava', 'un balón de playa', 'una máquina de escribir', 'un maniquí', 'un karaoke portátil', 'una tabla de surf'];

  var REAC_OBJ = ['Decide que es su nuevo amuleto de la suerte.', 'No sabe para qué sirve, pero ya no se separa de su hallazgo.',
    'Al rato ya le ha puesto nombre.', 'Los patrocinadores no entienden nada, pero aplauden.', 'Una ardilla observa el hallazgo con envidia.',
    'Considera que es el mejor día de su vida.', 'Se pasa la tarde intentando descubrir su utilidad.', 'Esa noche le cuenta sus secretos.',
    'Decide llevarse el hallazgo a todas partes.', 'Lo presenta a los demás tributos como un miembro más del grupo.',
    'Tres cuervos se acercan a inspeccionar el hallazgo.', 'Es inútil, pero tiene estilo.', 'Jura que tiene poderes mágicos.',
    'Lo esconde muy bien. Tan bien que al día siguiente no recuerda dónde.', 'Nadie en la historia de los juegos había encontrado algo así.'];

  var ACT = ['practicando su discurso de victoria', 'intentando domesticar una lagartija', 'contando las hojas de un árbol',
    'haciendo flexiones para impresionar a nadie', 'escribiendo un poema a su calcetín', 'aprendiendo a silbar con los dedos',
    'construyendo un castillo de barro', 'imitando el canto de los pájaros', 'buscando cobertura con el brazo en alto',
    'ensayando caras de miedo', 'inventando un idioma nuevo', 'meditando sobre una piedra', 'haciendo malabares con piñas',
    'tallando una cuchara', 'preparando trampas que nunca funcionan', 'bailando claqué sobre un tronco', 'afilando un palo sin motivo',
    'entrenando a una hormiga', 'buscando la salida de la arena', 'haciendo un mapa de la arena con ramitas',
    'escribiendo su testamento (deja todo a una ardilla)', 'aprendiendo a hacer nudos marineros', 'practicando saltos mortales',
    'haciendo un inventario de sus miedos', 'intentando leer el futuro en las nubes'];

  var REM_ACT = ['Nadie lo ve, por suerte.', 'Un pájaro observa la escena con lástima.', 'Los patrocinadores envían aplausos enlatados.',
    'Al final del día ha avanzado exactamente nada.', 'Es, sin duda, el mejor rato de toda la arena.', 'Una cabra se une a la actividad sin pedir permiso.',
    'Lo hace sorprendentemente bien.', 'A mitad de la tarde empieza a llover.', 'Tres ardillas aplauden. Una abuchea.',
    'El público de casa pide que lo repita.', 'Se convierte en tendencia en todo el país.', 'Un búho toma notas.'];

  var ANIMAL = [['un mapache', 'el mapache'], ['una cabra', 'la cabra'], ['un ganso', 'el ganso'], ['una llama', 'la llama'],
    ['un jabalí', 'el jabalí'], ['una gallina', 'la gallina'], ['un pavo real', 'el pavo real'], ['una tortuga', 'la tortuga'],
    ['un zorro', 'el zorro'], ['una mofeta', 'la mofeta'], ['un búho', 'el búho'], ['una ardilla gigante', 'la ardilla gigante'],
    ['un ciervo', 'el ciervo'], ['una rana enorme', 'la rana'], ['un burro', 'el burro'], ['una vaca perdida', 'la vaca'],
    ['un perezoso', 'el perezoso'], ['un canguro', 'el canguro'], ['un pingüino despistado', 'el pingüino'], ['un loro que habla', 'el loro'],
    ['una oveja con gafas', 'la oveja'], ['un tejón gruñón', 'el tejón'], ['una nutria', 'la nutria'], ['un erizo', 'el erizo']];

  var REM_ANIMAL = [
    function(a, an){ return cap(an) + ' roba el bocadillo a ' + a.name + ' y sale corriendo.'; },
    function(a, an){ return cap(an) + ' sigue a ' + a.name + ' el resto del día como si fueran familia.'; },
    function(a, an){ return cap(an) + ' y ' + a.name + ' se miran fijamente durante una hora. Nadie parpadea.'; },
    function(a, an){ return cap(an) + ' parece saber algo que nadie más sabe.'; },
    function(a, an){ return 'Deciden ignorarse mutuamente con muchísima dignidad.'; },
    function(a, an){ return cap(an) + ' da un cabezazo a ' + a.name + ' y se marcha sin dar explicaciones.'; },
    function(a, an){ return cap(an) + ' guía a ' + a.name + ' hasta un manantial secreto.'; },
    function(a, an){ return cap(an) + ' se sube a la cabeza de ' + a.name + ' y ya no quiere bajar.'; },
    function(a, an){ return 'Se hacen amigos. Es la relación más sana de la arena.'; },
    function(a, an){ return cap(an) + ' juzga en silencio cada decisión de ' + a.name + '.'; },
    function(a, an){ return cap(an) + ' estornuda encima de ' + a.name + ' y se va.'; },
    function(a, an){ return cap(an) + ' persigue a ' + a.name + ' en círculos durante media hora.'; },
    function(a, an){ return a.name + ' intenta montar a lomos de ' + an + '. No sale bien.'; },
    function(a, an){ return a.name + ' y ' + an + ' comparten la cena. Es la mejor compañía que ha tenido en días.'; }
  ];

  var PATRO_REM = ['Con una nota: «Confiamos en ti».', '«Es lo que había en el almacén», dice la nota.', 'Nadie entiende la estrategia del patrocinador.',
    'La nota dice: «Perdón, nos equivocamos de pedido».', 'La audiencia de casa estalla en carcajadas.', 'Llega con lazo y todo.',
    'Viene con instrucciones en un idioma que no existe.', 'La caja huele raro, pero el contenido está intacto.'];

  var TORPEZA = ['intenta hacer una voltereta', 'se sube a una roca para dar un discurso', 'intenta cazar una mariposa',
    'persigue un dron de los patrocinadores', 'intenta montar en un ciervo', 'se asoma demasiado para ver mejor',
    'intenta abrir un coco con la cabeza', 'baila como si nadie mirase', 'intenta volar con dos hojas de palmera', 'juega a la rayuela',
    'pisa lo que parecía un botón gigante', 'intenta robar los huevos a un águila', 'intenta surfear sobre un tronco', 'hace el pino',
    'intenta cruzar el río saltando de piedra en piedra', 'trepa a por la manzana más alta', 'intenta domar a un jabalí',
    'se hace un selfie haciendo el tonto', 'intenta columpiarse en una liana', 'prueba a caminar con los ojos cerrados'];

  var MORTAL = [' y cae al vacío con cara de sorpresa.', ' y una piña gigante cae justo encima.', ' y activa una trampa con forma de trampolín que lanza al tributo fuera del mapa.',
    ' y un enjambre de avispas toma la decisión por el resto.', ' y no vuelve a levantarse. Los patrocinadores apagan la cámara por respeto.',
    ' y rueda cuesta abajo hasta el río, que no devuelve a nadie.', ' y el suelo se abre bajo sus pies para siempre.', ' y un rayo aprovecha la ocasión.',
    ' y una roca se desprende de la montaña con muy mala puntería... o muy buena.', ' y se estrella contra el único árbol en kilómetros.',
    ' y acaba en la boca de algo que vivía debajo.', ' y el viento hace el resto.'];

  var SALVADO = [' y acaba colgando de una rama, con el orgullo hecho trizas, pero con vida.', ' y cae sobre un montón de hojas. Ni un rasguño.',
    ' y se salva de milagro gracias a un arbusto muy mullido.', ' y solo pierde un zapato. Y la dignidad.', ' y aterriza en un charco. Maloliente, pero con vida.',
    ' y lo cuenta después como una gran hazaña.', ' y un patrocinador envía un colchón justo a tiempo.', ' y rebota. Nadie sabe cómo, pero rebota.'];

  var MOTIVO = ['por quién vio primero una seta', 'sobre si las ardillas tienen sentimientos', 'por el último trozo de pan',
    'sobre cuál es la mejor forma de encender fuego', 'por un malentendido con una cabra', 'sobre si la tortilla lleva cebolla',
    'por quién ronca más', 'sobre el sentido de la vida', 'por una piedra con forma de corazón',
    'sobre quién ganaría en una pelea entre un pato y un ganso', 'sobre si el agua moja', 'por un sitio a la sombra',
    'sobre si esto es un reality', 'por una manta', 'sobre quién tiene peor suerte', 'por el mando de una tele que no existe',
    'sobre si los peces duermen', 'por quién se comió las bayas del otro', 'sobre si la luna los está mirando', 'por un chiste que nadie entendió'];

  var REM_DISC = ['Tras dos horas, nadie recuerda por qué empezó.', 'Lo resuelven a piedra, papel o tijera. Pierden los dos.',
    'Una ardilla hace de jueza y no da la razón a nadie.', 'Acaban dándose la mano, pero con rencor.', 'La discusión se oye en toda la arena.',
    'Terminan llorando abrazados, sin saber muy bien por qué.', 'Deciden no volver a hablarse nunca. Duran diez minutos.',
    'Gana quien grita más fuerte, que es quien tiene menos razón.', 'Los patrocinadores abren una encuesta. Gana la ardilla.'];

  var RETO = ['aguanta más tiempo sin reírse', 'come más bayas sin preguntar qué son', 'lanza una piedra más lejos', 'imita mejor a un pato',
    'trepa más rápido a un árbol', 'hace el mejor castillo de barro', 'aguanta más tiempo a la pata coja', 'cuenta el peor chiste',
    'sube primero a la colina', 'pone la mejor cara de susto', 'eructa más fuerte', 'recita más capitales del mundo',
    'hace más flexiones', 'aguanta más la respiración bajo el agua', 'construye la mejor cabaña'];

  var RES_RETO = [
    function(w, l){ return w.name + ' gana y lo celebra como si fuera una medalla olímpica.'; },
    function(w, l){ return 'Empate técnico. Los dos reclaman la victoria.'; },
    function(w, l){ return w.name + ' gana. ' + l.name + ' pide la revancha para mañana.'; },
    function(w, l){ return 'Nadie gana: aparece un oso y los dos salen corriendo.'; },
    function(w, l){ return w.name + ' gana haciendo trampas, pero nadie lo puede demostrar.'; },
    function(w, l){ return l.name + ' pierde y se pasa la noche entrenando en secreto.'; }
  ];

  var MOMENTO_INICIO = ['cruzan una mirada que dura demasiado', 'comparten un paraguas que no hace falta', 'se ríen del mismo chiste malo',
    'se tropiezan con la misma raíz y caen el uno sobre el otro', 'descubren que les gustan las mismas setas',
    'se quedan en la misma cueva durante una tormenta', 'se rozan la mano al coger la misma piña', 'comparten la última manzana',
    'se cuentan secretos junto al fuego', 'bailan sin música', 'se curan las heridas mutuamente', 'ven juntos el amanecer'];

  var REM_AMOR = ['Algo ha nacido entre los dos.', 'En casa, el público ya les ha puesto nombre de pareja.', 'Una ardilla llora de emoción.',
    'Nadie lo dice en voz alta, pero es amor.', 'Suena de fondo una balada que nadie ha puesto.', 'Los patrocinadores envían corazones de chocolate.'];

  var MOMENTO_PAREJA = ['se pasan la tarde haciendo planes de boda', 'se hacen cosquillas hasta llorar', 'graban sus iniciales en un árbol',
    'se dan de comer bayas de dudosa procedencia', 'cuentan estrellas abrazados', 'se ponen apodos ridículos',
    'discuten el nombre de su futuro perro', 'se hacen trenzas mutuamente', 'escriben una canción de amor horrible',
    'se preparan un pícnic con lo que encuentran', 'se turnan para vigilar mientras el otro duerme', 'se juran amor eterno sobre una piedra'];

  var FORMA_PACTO = ['chocando los codos', 'con un apretón de manos muy húmedo', 'con un baile secreto', 'jurando por su calcetín favorito',
    'firmando un contrato en una hoja de lechuga', 'con un choque de puños que duele más de lo previsto', 'intercambiando pulseras de hierba',
    'con un saludo inventado de veinte pasos', 'compartiendo un chicle (el mismo)', 'con un abrazo que nadie esperaba'];

  var REM_PACTO = ['Durará lo que tenga que durar.', 'Ninguno de los dos se fía del todo.', 'Los patrocinadores apuestan a que no dura ni dos días.',
    'Es la alianza más ilusionante de la arena.', 'Un cuervo lo ve todo y toma nota.', 'Nace un dúo imparable. O eso creen.'];

  var ATAQUE = ['sorprende', 'embosca', 'acorrala', 'persigue', 'desafía en duelo', 'ataca por la espalda', 'derriba', 'asalta'];
  var ARMA = ['con un palo muy afilado', 'con una sartén', 'con un paraguas convertido en lanza', 'con una baguette endurecida',
    'con una guitarra', 'con un cubo lleno de piedras', 'con un bumerán casero', 'con un tirachinas', 'con una red de pescar',
    'con un pez congelado', 'con una rama llena de pinchos', 'con una trompeta', 'con un rodillo de cocina', 'con una lámpara de lava',
    'con un calcetín lleno de arena', 'con una escoba'];

  var FIN_MUERTE = [
    function(a, b){ return ' ' + b.name + ' no sobrevive al encuentro.'; },
    function(a, b){ return ' Para ' + b.name + ', la arena termina aquí.'; },
    function(a, b){ return ' ' + b.name + ' cae y ya no se levanta.'; },
    function(a, b){ return ' ' + a.name + ' gana el combate; ' + b.name + ' se despide de los juegos.'; },
    function(a, b){ return ' El golpe es definitivo. Cañón para ' + b.name + '.'; }
  ];
  var FIN_VIVO = [
    function(a, b){ return ' ' + b.name + ' esquiva el golpe y huye entre los árboles.'; },
    function(a, b){ return ' El ataque falla estrepitosamente y ' + a.name + ' acaba en el suelo.'; },
    function(a, b){ return ' ' + b.name + ' contraataca y los dos se retiran con moratones.'; },
    function(a, b){ return ' En el último segundo, ' + b.name + ' se tira a un río y escapa.'; },
    function(a, b){ return ' ' + b.name + ' se defiende con un zapato y consigue salir corriendo.'; }
  ];

  var GRUPO = ['organizan una barbacoa sin carne', 'montan un concurso de talentos', 'juegan al escondite (nadie encuentra a nadie)',
    'construyen una balsa que se hunde en dos segundos', 'fundan una religión en honor a una piedra', 'hacen una guerra de bolas de barro',
    'intentan hacer una pirámide humana', 'cantan canciones de campamento', 'organizan unas olimpiadas', 'improvisan una obra de teatro',
    'montan un club de lectura sin libros', 'hacen una sesión de yoga colectiva', 'celebran un cumpleaños que no es de nadie',
    'juegan a las cartas con hojas secas', 'organizan un desfile de moda con ramas'];

  var REM_GRUPO = ['Es la tarde más divertida de la arena.', 'Acaba regular, pero nadie sale herido.', 'Los patrocinadores lo retransmiten dos veces.',
    'Nadie gana, pero todos pierden algo de dignidad.', 'Al final se hacen una foto de grupo con una piedra.', 'Un oso se acerca a mirar y se une al final.'];

  var EMBOSCADA = ['tienden una emboscada', 'preparan una trampa', 'rodean', 'acorralan'];

  var PLAN = ['trazan un plan maestro en el barro', 'ensayan su grito de guerra', 'se reparten las guardias de la noche',
    'inventan un saludo secreto de equipo', 'construyen una fortaleza de ramas', 'pintan el emblema del equipo en una roca',
    'hacen inventario de provisiones (tres bayas y un calcetín)', 'entrenan como si fuera una final', 'diseñan un uniforme con hojas',
    'votan quién manda (gana nadie)', 'hacen una sesión de motivación a gritos', 'ensayan una coreografía de la victoria'];

  var RES_PLAN = ['El plan es brillante; ejecutarlo será otra historia.', 'El equipo nunca había estado tan unido.',
    'Alguien del equipo ya se ha olvidado del plan.', 'Los rivales lo ven todo desde un arbusto.', 'Sale mejor de lo esperado. Da hasta miedo.',
    'Acaban discutiendo, pero con cariño.'];

  var BURLA = [
    function(a, b, x){ return a.name + ', de ' + x.ta + ', saca la lengua a ' + b.name + ' desde lo alto de un árbol. ' + b.name + ', de ' + x.tb + ', jura venganza.'; },
    function(a, b, x){ return a.name + ' imita a ' + b.name + ' delante de todo su equipo. ' + cap(x.ta) + ' se parte de risa; ' + x.tb + ', no tanto.'; },
    function(a, b, x){ return a.name + ' escribe «' + x.tb + ' huelen a pies» en una roca bien grande. ' + b.name + ' lo lee y estalla de rabia.'; },
    function(a, b, x){ return a.name + ' y ' + b.name + ' se cruzan y se lanzan miradas asesinas. ' + cap(x.ta) + ' contra ' + x.tb + ': la rivalidad está servida.'; },
    function(a, b, x){ return a.name + ' canta una canción inventada sobre lo mal que lo hacen ' + x.tb + '. ' + b.name + ' tiene que reconocer que es pegadiza.'; },
    function(a, b, x){ return a.name + ' lanza un tomate a ' + b.name + '. Es una declaración de guerra entre ' + x.ta + ' y ' + x.tb + '.'; }
  ];

  var FORMA_DUELO = ['se lanzan el uno contra el otro sin decir palabra', 'se miran como en un western antes de atacar',
    'empiezan un duelo a muerte con palos', 'luchan en el barro', 'se persiguen alrededor de un árbol durante una hora',
    'se enfrentan en lo alto de un puente de cuerda'];

  var MOTIVO_DEFECT = ['tienen mejores bocadillos', 'le prometieron una manta', 'por amor', 'por un malentendido con los colores',
    'porque su grito de guerra es más pegadizo', 'porque en su equipo roncaban demasiado', 'a cambio de una galleta',
    'porque le hicieron sentir parte de algo', 'porque ya no aguantaba más reuniones'];

  var FRIENDLY = ['intenta pasarle agua a', 'lanza una cuerda a', 'intenta enseñar una técnica de combate a', 'hace una broma a'];

  /* ================= EVENTOS PROCEDURALES ================= */
  A.EVENTS = A.EVENTS.concat([
    { k: 'gen_hallazgo', gen: true, n: 1, rel: 'any', w: 18, type: 'neutral', scene: 'item', prop: 'crate',
      text: function(a){ return a.name + ' encuentra ' + pick(OBJ) + ' ' + pick(LUGAR) + '. ' + pick(REAC_OBJ); } },
    { k: 'gen_actividad', gen: true, n: 1, rel: 'any', w: 18, type: 'neutral', scene: 'explore',
      text: function(a){ return a.name + ' pasa la tarde ' + pick(ACT) + ' ' + pick(LUGAR) + '. ' + pick(REM_ACT); } },
    { k: 'gen_animal', gen: true, n: 1, rel: 'any', w: 16, type: 'neutral', scene: 'explore',
      text: function(a){ var an = pick(ANIMAL); return a.name + ' se cruza con ' + an[0] + ' ' + pick(LUGAR) + '. ' + pick(REM_ANIMAL)(a, an[1]); } },
    { k: 'gen_patrocinio', gen: true, n: 1, rel: 'any', w: 10, type: 'item', scene: 'item', prop: 'crate',
      text: function(a){ return 'Un patrocinador envía a ' + a.name + ' ' + pick(OBJ) + '. ' + pick(PATRO_REM); } },
    { k: 'gen_torpeza', gen: true, n: 1, rel: 'any', w: 16, type: 'death', fx: 'die_a', scene: 'fall',
      text: function(a){ return a.name + ' ' + pick(TORPEZA) + ' ' + pick(LUGAR) + pick(MORTAL); },
      live: function(a){ return a.name + ' ' + pick(TORPEZA) + ' ' + pick(LUGAR) + pick(SALVADO); } },
    { k: 'gen_discusion', gen: true, n: 2, rel: 'any', w: 14, type: 'fight', scene: 'argue',
      text: function(a, b){ return a.name + ' y ' + b.name + ' discuten ' + pick(MOTIVO) + ' ' + pick(LUGAR) + '. ' + pick(REM_DISC); } },
    { k: 'gen_reto', gen: true, n: 2, rel: 'any', w: 12, type: 'neutral', scene: 'contest',
      text: function(a, b){ var w = Math.random() < 0.5 ? [a, b] : [b, a]; return a.name + ' reta a ' + b.name + ' a ver quién ' + pick(RETO) + '. ' + pick(RES_RETO)(w[0], w[1]); } },
    { k: 'gen_flechazo', gen: true, n: 2, rel: 'stranger', free: true, w: 10, type: 'romance', scene: 'love', fx: 'love',
      text: function(a, b){ return a.name + ' y ' + b.name + ' ' + pick(MOMENTO_INICIO) + ' ' + pick(LUGAR) + '. ' + pick(REM_AMOR); } },
    { k: 'gen_flechazo_aliados', gen: true, n: 2, rel: 'ally', free: true, w: 8, type: 'romance', scene: 'love', fx: 'love',
      text: function(a, b){ return a.name + ' y ' + b.name + ' ' + pick(MOMENTO_INICIO) + ' ' + pick(LUGAR) + '. ' + pick(REM_AMOR); } },
    { k: 'gen_pareja', gen: true, n: 2, rel: 'lover', w: 14, type: 'romance', scene: 'date',
      text: function(a, b){ return a.name + ' y ' + b.name + ' ' + pick(MOMENTO_PAREJA) + ' ' + pick(LUGAR) + '. ' + pick(REM_AMOR); } },
    { k: 'gen_pacto', gen: true, n: 2, rel: 'stranger', w: 12, type: 'alliance', scene: 'handshake', fx: 'ally',
      text: function(a, b){ return a.name + ' y ' + b.name + ' sellan una alianza ' + pick(LUGAR) + ' ' + pick(FORMA_PACTO) + '. ' + pick(REM_PACTO); } },
    { k: 'gen_combate', gen: true, n: 2, rel: 'any', w: 16, type: 'death', fx: 'kill_b', scene: 'brawl',
      text: function(a, b){ return a.name + ' ' + pick(ATAQUE) + ' a ' + b.name + ' ' + pick(LUGAR) + ' ' + pick(ARMA) + '.' + pick(FIN_MUERTE)(a, b); },
      live: function(a, b){ return a.name + ' ' + pick(ATAQUE) + ' a ' + b.name + ' ' + pick(LUGAR) + ' ' + pick(ARMA) + '.' + pick(FIN_VIVO)(a, b); } },
    { k: 'gen_grupo', gen: true, n: 3, rel: 'group', w: 14, type: 'neutral', scene: 'dance',
      text: function(a, b, c){ return a.name + ', ' + b.name + ' y ' + c.name + ' ' + pick(GRUPO) + ' ' + pick(LUGAR) + '. ' + pick(REM_GRUPO); } },
    { k: 'gen_emboscada', gen: true, n: 3, rel: 'group', w: 10, type: 'death', fx: 'kill_c', scene: 'brawl', ffa: true,
      text: function(a, b, c){ return a.name + ' y ' + b.name + ' ' + pick(EMBOSCADA) + ' a ' + c.name + ' ' + pick(LUGAR) + ' ' + pick(ARMA) + '. ' + c.name + ' no tiene escapatoria.'; },
      live: function(a, b, c){ return a.name + ' y ' + b.name + ' ' + pick(EMBOSCADA) + ' a ' + c.name + ' ' + pick(LUGAR) + ', pero ' + c.name + ' se escurre entre los dos y desaparece.'; } },

    /* ================= EQUIPOS: procedurales ================= */
    { k: 'team_plan', gen: true, team: 'mates', n: 2, rel: 'ally', w: 16, type: 'alliance', scene: 'handshake',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ', de ' + x.ta + ', ' + pick(PLAN) + ' ' + pick(LUGAR) + '. ' + pick(RES_PLAN); } },
    { k: 'team_plan3', gen: true, team: 'mates', n: 3, rel: 'group', w: 16, type: 'alliance', scene: 'dance',
      text: function(a, b, c, x){ return a.name + ', ' + b.name + ' y ' + c.name + ' (' + x.ta + ') ' + pick(PLAN) + ' ' + pick(LUGAR) + '. ' + pick(RES_PLAN); } },
    { k: 'team_grito', gen: true, team: 'mates', n: 2, rel: 'ally', w: 8, type: 'alliance', scene: 'warcry',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' gritan «' + x.cry + '» tan fuerte que tiemblan los árboles. ' + cap(x.ta) + ' están a tope.'; } },
    { k: 'team_burla', gen: true, team: 'rivals', n: 2, rel: 'any', w: 14, type: 'fight', scene: 'taunt',
      text: function(a, b, c, x){ return pick(BURLA)(a, b, x); } },
    { k: 'team_duelo', gen: true, team: 'rivals', n: 2, rel: 'any', w: 20, type: 'death', fx: 'kill_b', scene: 'brawl',
      text: function(a, b, c, x){ return a.name + ' (' + x.ta + ') y ' + b.name + ' (' + x.tb + ') se encuentran ' + pick(LUGAR) + ' y ' + pick(FORMA_DUELO) + '.' + pick(FIN_MUERTE)(a, b); },
      live: function(a, b, c, x){ return a.name + ' (' + x.ta + ') y ' + b.name + ' (' + x.tb + ') se encuentran ' + pick(LUGAR) + ' y ' + pick(FORMA_DUELO) + '.' + pick(FIN_VIVO)(a, b); } },
    { k: 'team_emboscada', gen: true, team: 'rivals', n: 3, rel: 'group', w: 20, type: 'death', fx: 'kill_c', scene: 'ambush',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ', de ' + x.ta + ', ' + pick(EMBOSCADA) + ' a ' + c.name + ', de ' + x.tc + ', ' + pick(LUGAR) + '. Dos contra uno: ' + c.name + ' no tiene nada que hacer.'; },
      live: function(a, b, c, x){ return a.name + ' y ' + b.name + ', de ' + x.ta + ', ' + pick(EMBOSCADA) + ' a ' + c.name + ' ' + pick(LUGAR) + ', pero ' + c.name + ' escapa y vuelve con ' + x.tc + ' para contarlo.'; } },
    { k: 'team_espia', gen: true, team: 'rivals', n: 2, rel: 'any', w: 10, type: 'neutral', scene: 'sneak',
      text: function(a, b, c, x){ return a.name + ' espía el campamento de ' + x.tb + ' ' + pick(LUGAR) + '. Descubre que su plan secreto es ' + pick(PLAN) + '. Vuelve con ' + x.ta + ' con la noticia.'; } },
    { k: 'team_defeccion', gen: true, team: 'rivals', n: 2, rel: 'any', w: 5, type: 'betrayal', scene: 'defect', fx: 'defect',
      text: function(a, b, c, x){ return a.name + ' abandona a ' + x.ta + ' y se pasa a ' + x.tb + ', invitad' + g(a, 'o', 'a') + ' por ' + b.name + ': dice que ' + pick(MOTIVO_DEFECT) + '. Su antiguo equipo no da crédito.'; } },
    { k: 'team_romeo', gen: true, team: 'rivals', n: 2, rel: 'stranger', free: true, w: 7, type: 'romance', scene: 'love', fx: 'love',
      text: function(a, b, c, x){ return a.name + ' (' + x.ta + ') y ' + b.name + ' (' + x.tb + ') ' + pick(MOMENTO_INICIO) + '. Son de equipos rivales. Romeo y Julieta, versión arena.'; } },
    { k: 'team_bandera', gen: true, team: 'rivals', n: 2, rel: 'any', w: 9, type: 'theft', scene: 'steal', prop: 'flag',
      text: function(a, b, c, x){ return a.name + ' roba la bandera de ' + x.tb + ' delante de las narices de ' + b.name + ' y la clava en el campamento de ' + x.ta + '. Humillación total.'; } },
    { k: 'team_fuego_amigo', gen: true, team: 'mates', n: 2, rel: 'ally', w: 7, type: 'death', fx: 'die_b', scene: 'fall',
      text: function(a, b, c, x){ return a.name + ' ' + pick(FRIENDLY) + ' ' + b.name + ', de su mismo equipo, ' + pick(LUGAR) + '. Algo sale muy mal. ' + cap(x.ta) + ' pierden a ' + b.name + ' por fuego amigo.'; },
      live: function(a, b, c, x){ return a.name + ' ' + pick(FRIENDLY) + ' ' + b.name + ', de su mismo equipo, ' + pick(LUGAR) + '. Casi acaba en tragedia, pero todo queda en un susto y una bronca.'; } },
    { k: 'team_rescate', gen: true, team: 'mates', n: 2, rel: 'ally', w: 10, type: 'heal', scene: 'rescue',
      text: function(a, b, c, x){ return b.name + ' cae en un hoyo ' + pick(LUGAR) + '. ' + a.name + ' vuelve a rescatar a ' + b.name + ' aunque haya rivales cerca. Así se hace en ' + x.ta + '.'; } },
    { k: 'team_tregua', gen: true, team: 'rivals', n: 2, rel: 'any', w: 7, type: 'alliance', scene: 'truce',
      text: function(a, b, c, x){ return a.name + ' (' + x.ta + ') y ' + b.name + ' (' + x.tb + ') firman una tregua temporal ' + pick(FORMA_PACTO) + '. Nadie se la cree del todo.'; } },
    { k: 'team_traicion', gen: true, team: 'mates', n: 2, rel: 'ally', w: 6, type: 'death', fx: 'kill_b', scene: 'stab',
      text: function(a, b, c, x){ return a.name + ' decide que ' + x.ta + ' tendrán más opciones con un miembro menos y elimina a ' + b.name + ' ' + pick(LUGAR) + '. El equipo entero queda en shock.'; },
      live: function(a, b, c, x){ return a.name + ' intenta quitar de en medio a ' + b.name + ', de su propio equipo, pero ' + b.name + ' se da cuenta a tiempo. Ambiente tenso en ' + x.ta + '.'; } }
  ]);

  /* ================= EQUIPOS: escritos a mano ================= */
  A.EVENTS = A.EVENTS.concat([
    { k: 'team_asamblea', team: 'mates', n: 3, rel: 'group', w: 6, type: 'alliance', scene: 'argue',
      text: function(a, b, c, x){ return cap(x.ta) + ' celebran una asamblea. ' + a.name + ' propone atacar, ' + b.name + ' propone esconderse y ' + c.name + ' propone merendar. Gana la merienda.'; } },
    { k: 'team_capitan', team: 'mates', n: 2, rel: 'ally', w: 6, type: 'alliance', scene: 'contest',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' se disputan ser capitán de ' + x.ta + ' echando un pulso. Gana ' + a.name + ', que se hace una corona de hojas.'; } },
    { k: 'team_comida_robada', team: 'rivals', n: 2, rel: 'any', w: 7, type: 'theft', scene: 'steal', fx: 'steal', req: { b: 'any' },
      text: function(a, b, c, x){ return a.name + ' se cuela en el campamento de ' + x.tb + ' y roba ' + x.item.short + ' a ' + b.name + '. ' + cap(x.ta) + ' lo celebran por todo lo alto.'; } },
    { k: 'team_sabotaje', team: 'rivals', n: 2, rel: 'any', w: 6, type: 'betrayal', scene: 'sabotage', fx: 'sabotage', req: { b: 'weapon' },
      text: function(a, b, c, x){ return a.name + ' se cuela de noche entre ' + x.tb + ' y rompe ' + x.item.short + ' de ' + b.name + '. Por la mañana, ' + x.tb + ' culpan a un castor.'; } },
    { k: 'team_regalo', team: 'mates', n: 2, rel: 'ally', w: 7, type: 'alliance', scene: 'gift', fx: 'give', req: { a: 'any' },
      text: function(a, b, c, x){ return a.name + ' entrega ' + x.item.short + ' a ' + b.name + ': «Lo necesitas más que yo». Momento emotivo en ' + x.ta + '.'; } },
    { k: 'team_curacion', team: 'mates', n: 2, rel: 'ally', w: 8, type: 'heal', scene: 'heal', fx: 'use', req: { a: 'botiquin' },
      text: function(a, b, c, x){ return a.name + ' gasta el botiquín en curar a ' + b.name + '. En ' + x.ta + ' nadie se queda atrás.'; } },
    { k: 'team_pelea_interna', team: 'mates', n: 2, rel: 'ally', w: 5, type: 'fight', scene: 'argue',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' discuten sobre quién tiene la culpa de que ' + x.ta + ' vayan perdiendo. Al final coinciden: la culpa es de la ardilla.'; } },
    { k: 'team_mascota', team: 'mates', n: 3, rel: 'group', w: 5, type: 'neutral', scene: 'dance',
      text: function(a, b, c, x){ return a.name + ', ' + b.name + ' y ' + c.name + ' adoptan una mascota oficial para ' + x.ta + ': un escarabajo llamado Capitán. Capitán no colabora.'; } },
    { k: 'team_cruce_amor', team: 'rivals', n: 3, rel: 'group', w: 6, type: 'romance', scene: 'caught', fx: 'breakupac',
      cond: function(a, b, c){ return a.loverId === c.id && c.loverId === a.id; },
      text: function(a, b, c, x){ return c.name + ' (' + x.tc + ') pilla a su pareja ' + a.name + ' dando mimos a ' + b.name + '. ¡Y encima es de ' + x.ta + ', el mismo equipo! La pareja se rompe con estrépito.'; } },
    { k: 'team_duelo_honor', team: 'rivals', n: 2, rel: 'any', w: 8, type: 'death', fx: 'kill_b', scene: 'shoot', req: { a: 'pistola' },
      text: function(a, b, c, x){ return a.name + ' desafía a ' + b.name + ' a un duelo al amanecer: ' + x.ta + ' contra ' + x.tb + '. Diez pasos, media vuelta... y ' + b.name + ' cae.'; },
      live: function(a, b, c, x){ return a.name + ' desafía a ' + b.name + ' a un duelo al amanecer. Diez pasos, media vuelta... y los dos se han ido en direcciones opuestas.'; } },
    { k: 'team_trampa_rival', team: 'rivals', n: 2, rel: 'any', w: 8, type: 'death', fx: 'kill_b', scene: 'trap',
      text: function(a, b, c, x){ return cap(x.ta) + ' llevan días cavando una trampa. Hoy cae en ella ' + b.name + ', de ' + x.tb + '. ' + a.name + ' se encarga de dar la noticia.'; },
      live: function(a, b, c, x){ return cap(x.ta) + ' llevan días cavando una trampa. Hoy cae en ella ' + a.name + ', su propio autor. ' + b.name + ' se ríe desde lejos.'; } },
    { k: 'team_espionaje_fallido', team: 'rivals', n: 2, rel: 'any', w: 6, type: 'fight', scene: 'sneak',
      text: function(a, b, c, x){ return a.name + ' intenta espiar a ' + x.tb + ' ' + g(a, 'disfrazado', 'disfrazada') + ' de arbusto. ' + b.name + ' riega el arbusto.'; } },
    { k: 'team_negociacion', team: 'rivals', n: 2, rel: 'any', w: 6, type: 'alliance', scene: 'trade',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' negocian en nombre de ' + x.ta + ' y ' + x.tb + '. Tras tres horas, acuerdan... volver a negociar mañana.'; } },
    { k: 'team_rescate_rival', team: 'rivals', n: 2, rel: 'any', w: 5, type: 'heal', scene: 'rescue',
      text: function(a, b, c, x){ return b.name + ', de ' + x.tb + ', cae a un río. ' + a.name + ', de ' + x.ta + ', se tira a salvar a ' + b.name + ' sin pensarlo. Hoy la rivalidad puede esperar.'; } },
    { k: 'team_bombardeo', team: 'rivals', n: 3, rel: 'group', w: 6, type: 'fight', scene: 'brawl',
      text: function(a, b, c, x){ return a.name + ' y ' + b.name + ' bombardean el campamento de ' + x.tc + ' con piñas. ' + c.name + ' responde con barro. La guerra de las piñas ha empezado.'; } }
  ]);

  /* ================= MÁS EVENTOS GENERALES ================= */
  A.EVENTS = A.EVENTS.concat([
    { k: 'x_ventrilocuo', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'explore',
      text: function(a){ return a.name + ' se hace ' + g(a, 'ventrílocuo', 'ventrílocua') + ' con un calcetín. El calcetín tiene mejor conversación que la mayoría de los tributos.'; } },
    { k: 'x_diario', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'explore',
      text: function(a){ return a.name + ' empieza un diario: «Día ' + (2 + Math.floor(Math.random() * 20)) + '. Sigo sin saber qué hago aquí. Hoy he visto una cabra muy bonita».'; } },
    { k: 'x_peinado', n: 1, rel: 'any', w: 4, type: 'neutral', scene: 'injured',
      text: function(a){ return 'Una ráfaga de viento deja a ' + a.name + ' con un peinado espectacular. Los patrocinadores ya lo han bautizado como «el huracán».'; } },
    { k: 'x_eco_amor', n: 1, rel: 'any', w: 3, type: 'romance', scene: 'love',
      text: function(a){ return a.name + ' se declara a su reflejo en un lago. El reflejo, por primera vez en la arena, dice que sí.'; } },
    { k: 'x_meteoro_chiste', n: 1, rel: 'any', w: 4, type: 'death', fx: 'die_a', scene: 'drop', prop: 'meteor',
      text: function(a){ return a.name + ' pide un deseo a una estrella fugaz. La estrella fugaz lo concede... a su manera, cayendo encima.'; },
      live: function(a){ return a.name + ' pide un deseo a una estrella fugaz. La estrella cae a diez metros. El deseo era «que no me caiga encima». Concedido.'; } },
    { k: 'x_mapache_ladron', n: 1, rel: 'any', w: 5, type: 'theft', scene: 'explore', fx: 'lose', req: { a: 'any' },
      text: function(a, b, c, x){ return 'Un mapache con antifaz se lleva ' + x.item.short + ' de ' + a.name + ' a plena luz del día. Profesional hasta el final.'; } },
    { k: 'x_cuidar_herido', n: 2, rel: 'any', w: 5, type: 'heal', scene: 'heal',
      text: function(a, b){ return a.name + ' encuentra a ' + b.name + ' con una pierna torcida y le hace un entablillado con dos ramas y un calcetín. Funciona.'; } },
    { k: 'x_apuesta_amor', n: 2, rel: 'ally', free: true, w: 4, type: 'romance', scene: 'love', fx: 'love',
      text: function(a, b){ return a.name + ' apuesta con ' + b.name + ' que no se enamorarán en la arena. Pierden los dos.'; } },
    { k: 'x_cancion_rival', n: 2, rel: 'stranger', w: 4, type: 'fight', scene: 'karaoke',
      text: function(a, b){ return a.name + ' y ' + b.name + ' tienen una batalla de gallos improvisada. Las rimas son terribles; el público, entregado.'; } },
    { k: 'x_empujon_rio', n: 2, rel: 'any', w: 5, type: 'death', fx: 'kill_b', scene: 'wave',
      text: function(a, b){ return a.name + ' empuja a ' + b.name + ' al río en plena crecida. La corriente se lleva a ' + b.name + ' sin mirar atrás.'; },
      live: function(a, b){ return a.name + ' empuja a ' + b.name + ' al río. ' + b.name + ' sale nadando a crol y con una trucha en la boca.'; } },
    { k: 'x_rapto_cabra', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'explore',
      text: function(a, b, c){ return 'Una cabra secuestra la mochila de ' + a.name + '. ' + b.name + ' y ' + c.name + ' organizan un rescate que dura toda la tarde. La cabra gana.'; } },
    { k: 'x_confesion_grupo', n: 3, rel: 'group', w: 4, type: 'neutral', scene: 'campfire',
      text: function(a, b, c){ return 'Junto al fuego, ' + a.name + ', ' + b.name + ' y ' + c.name + ' confiesan su mayor miedo. El de ' + c.name + ' es «los patos». Nadie se ríe: todos lo entienden.'; } }
  ]);

  /* recuento de combinaciones posibles para comprobación */
  A.EVENT_BANKS = { LUGAR: LUGAR, OBJ: OBJ, REAC_OBJ: REAC_OBJ, ACT: ACT, REM_ACT: REM_ACT, ANIMAL: ANIMAL, REM_ANIMAL: REM_ANIMAL,
    PATRO_REM: PATRO_REM, TORPEZA: TORPEZA, MORTAL: MORTAL, SALVADO: SALVADO, MOTIVO: MOTIVO, REM_DISC: REM_DISC, RETO: RETO,
    RES_RETO: RES_RETO, MOMENTO_INICIO: MOMENTO_INICIO, REM_AMOR: REM_AMOR, MOMENTO_PAREJA: MOMENTO_PAREJA, FORMA_PACTO: FORMA_PACTO,
    REM_PACTO: REM_PACTO, ATAQUE: ATAQUE, ARMA: ARMA, FIN_MUERTE: FIN_MUERTE, FIN_VIVO: FIN_VIVO, GRUPO: GRUPO, REM_GRUPO: REM_GRUPO,
    EMBOSCADA: EMBOSCADA, PLAN: PLAN, RES_PLAN: RES_PLAN, BURLA: BURLA, FORMA_DUELO: FORMA_DUELO, MOTIVO_DEFECT: MOTIVO_DEFECT, FRIENDLY: FRIENDLY };
})();
