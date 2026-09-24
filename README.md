# La Arena

Simulador de supervivencia por rondas (estilo Juegos del Hambre), pensado para iPhone.

- **Personajes**: nombre, chico/chica, pelo, ojos y tono de piel, con avatar dibujado. También puedes subir una foto de alguien real: se recorta con el dedo, admite estilo cómic y se usa como cara del personaje (se guarda reducida, unos KB).
- **Listas**: guarda un reparto y cárgalo de golpe en futuras partidas.
- **Acciones variadas**: alianzas, traiciones, robos, sabotajes, regalos, rescates, romances, infidelidades, rumores y bromas, además de muertes absurdas. Los personajes llevan objetos (pistola, cuchillo, botiquín, mapa...) que se pueden robar, regalar, cambiar o romper. Solo una parte de los días acaba en muerte; se ajusta con la duración de la partida (corta, media o larga).
- **Romances, pillados y bebés**: parejas que se refugian en una cueva o tienda (todo insinuado y con humor), terceros que las pillan (ruptura, pelea, trío de alianza, chantaje...), embarazos con aviso y parto, y cigüeñas. El bebé nace como un personaje nuevo de la partida, con nombre mezcla de sus padres. Los bebés están protegidos por la arena: no mueren, no ganan, y el ganador se lo lleva a casa.
- **Modos de juego**: todos contra todos, por equipos (eliges de 2 a 8 equipos) y por parejas. El reparto es aleatorio y se anuncia al empezar (cada equipo con su nombre, color y grito de guerra). Los compañeros se ayudan, los rivales se emboscan, hay burlas, treguas, robos de bandera, fuego amigo y cambios de bando. Gana el último equipo en pie.
- **Cada partida es distinta**: una edición aleatoria cambia el tono (Fiebre del amor, Nido de víboras, Caos absoluto...), cada personaje recibe un rasgo de personalidad (romántico, ladrón, gafe, sanguinario...) y los pesos de los eventos cambian en cada partida. Los generadores de texto combinan lugares, objetos, animales, motivos y remates: más de 110.000 combinaciones posibles.
- **Narrador**: cada día ocurre una sola cosa; se cuenta con texto que se escribe solo (y voz opcional) y el día pasa automáticamente. Controles: pausa, velocidad 1×/2×/4×, voz y saltar.
- **Datos**: en Supabase si lo configuras; si no, en este dispositivo (`localStorage`).

Web estática, sin build. Abre `index.html` o publícala con GitHub Pages.

## Activar Supabase (una vez)

1. Crea un proyecto en https://supabase.com.
2. En **SQL Editor**, pega y ejecuta `supabase/schema.sql` (crea las tablas `characters`, `lists`, `list_members` con seguridad por usuario).
3. En **Project Settings → API**, copia la *Project URL* y la clave *anon public* y pégalas en `js/config.js`.
4. En **Authentication → Providers → Email**, deja activado el email. Para no depender del correo de confirmación mientras pruebas, desactiva *Confirm email*.
5. Sube el cambio. Al abrir la web, pulsa **Iniciar sesión → Crear cuenta**.

Si ya tenías el proyecto creado antes de las fotos, ejecuta también las dos últimas líneas de `supabase/schema.sql` (`alter table ... add column skin/photo`) antes de usar la web.

La clave `anon` es pública por diseño: nadie puede leer ni tocar datos ajenos porque las políticas RLS del esquema limitan cada fila a su usuario.

## Estructura

```
index.html        pantallas y hojas (reparto, narrador, victoria, editor, cuenta)
css/              estilos (scenes.css: animaciones de las escenas)
js/avatar.js      avatares SVG y paletas de pelo/ojos
js/photo.js       recorte de fotos, estilo cómic y sugerencia de pelo/piel
js/data.js        capa de datos (Supabase o localStorage)
js/events.js      catálogo de eventos (muertes absurdas, romances, robos, alianzas...) y objetos
js/events2.js     segundo catálogo: intimidad, pillados, familia, peligros y muchas más acciones
js/events3.js     rasgos, ediciones, generador procedural de eventos y eventos de equipos
js/engine.js      motor de simulación: un evento por día
js/scene-kit.js   librería de coreografía (props, emotes, partículas, cielos)
js/scenes.js      escenas animadas que dibujan cada evento con los avatares
js/scenes2.js     escenas nuevas (cueva, pillados, parto, bebé, peligros naturales...)
js/scenes3.js     escenas de equipos y red de seguridad si una escena falla
js/narrator.js    texto que se escribe solo y voz
js/app.js         interfaz y flujo del juego
supabase/         esquema SQL
```

## Seguridad

- Política de seguridad de contenido (CSP): solo se cargan scripts propios y la librería de Supabase; nada de scripts en línea.
- La librería de Supabase va fijada a una versión concreta con verificación de integridad (SRI).
- Todo texto introducido por el usuario se muestra escapado; las fotos solo se aceptan como imágenes JPEG/PNG/WebP pequeñas.
- El estado guardado en el navegador se valida al cargar; si está dañado, se descarta sin romper la app.
- En Supabase, cada usuario solo puede leer y modificar sus propios datos (RLS).
