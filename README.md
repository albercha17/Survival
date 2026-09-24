# La Arena

Simulador de supervivencia por rondas (estilo Juegos del Hambre), pensado para iPhone.

- **Personajes**: nombre, chico/chica, color de pelo y de ojos, con avatar generado.
- **Listas**: guarda un reparto y cárgalo de golpe en futuras partidas.
- **Narrador**: cada día ocurre una sola cosa; se cuenta con texto que se escribe solo (y voz opcional) y el día pasa automáticamente. Controles: pausa, velocidad 1×/2×/4×, voz y saltar.
- **Datos**: en Supabase si lo configuras; si no, en este dispositivo (`localStorage`).

Web estática, sin build. Abre `index.html` o publícala con GitHub Pages.

## Activar Supabase (una vez)

1. Crea un proyecto en https://supabase.com.
2. En **SQL Editor**, pega y ejecuta `supabase/schema.sql` (crea las tablas `characters`, `lists`, `list_members` con seguridad por usuario).
3. En **Project Settings → API**, copia la *Project URL* y la clave *anon public* y pégalas en `js/config.js`.
4. En **Authentication → Providers → Email**, deja activado el email. Para no depender del correo de confirmación mientras pruebas, desactiva *Confirm email*.
5. Sube el cambio. Al abrir la web, pulsa **Iniciar sesión → Crear cuenta**.

La clave `anon` es pública por diseño: nadie puede leer ni tocar datos ajenos porque las políticas RLS del esquema limitan cada fila a su usuario.

## Estructura

```
index.html        pantallas y hojas (reparto, narrador, victoria, editor, cuenta)
css/              estilos (scenes.css: animaciones de las escenas)
js/avatar.js      avatares SVG y paletas de pelo/ojos
js/data.js        capa de datos (Supabase o localStorage)
js/events.js      catálogo de eventos absurdos (muertes tontas, amoríos, traiciones)
js/engine.js      motor de simulación: un evento por día
js/scenes.js      escenas animadas que dibujan cada evento con los avatares
js/narrator.js    texto que se escribe solo y voz
js/app.js         interfaz y flujo del juego
supabase/         esquema SQL
```
