# La Arena

Simulador de supervivencia por rondas (estilo Juegos del Hambre), pensado para iPhone.

- **Personajes**: nombre, chico/chica, color de pelo y de ojos, con avatar generado.
- **Listas**: guarda un reparto y cárgalo de golpe en futuras partidas.
- **Narrador**: cada día ocurre una sola cosa; se cuenta con texto que se escribe solo (y voz opcional) y el día pasa automáticamente. Controles: pausa, velocidad 1×/2×/4×, voz y saltar.
- **Datos**: en Firebase (Firestore) si lo configuras; si no, en este dispositivo (`localStorage`).

Web estática, sin build. Abre `index.html` o publícala con GitHub Pages.

## Activar Firebase (una vez, plan gratuito Spark, sin tarjeta)

1. Entra en https://console.firebase.google.com → **Agregar proyecto** (puedes desactivar Analytics).
2. **Build → Authentication → Comenzar → Método de acceso → Correo electrónico/contraseña** → activar.
3. **Authentication → Configuración → Dominios autorizados** → añade `albercha17.github.io` (sin esto el login falla en GitHub Pages).
4. **Build → Firestore Database → Crear base de datos** (modo producción, región `eur3` o la más cercana).
5. En Firestore → **Reglas**, pega el contenido de `firebase/firestore.rules` y pulsa **Publicar**.
6. **Configuración del proyecto (engranaje) → Tus apps → Web (`</>`)** → registra la app y copia el objeto `firebaseConfig` en `js/config.js`.
7. Sube el cambio. Al abrir la web, pulsa **Iniciar sesión → Crear cuenta**.

Los valores de `firebaseConfig` son públicos por diseño: las reglas de Firestore limitan cada usuario a sus propios datos (`users/{uid}/...`).

## Estructura

```
index.html        pantallas y hojas (reparto, narrador, victoria, editor, cuenta)
css/              estilos
js/avatar.js      avatares SVG y paletas de pelo/ojos
js/data.js        capa de datos (Firebase o localStorage)
js/engine.js      motor de simulación: un evento por día
js/narrator.js    texto que se escribe solo y voz
js/app.js         interfaz y flujo del juego
firebase/         reglas de seguridad de Firestore
```
