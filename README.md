# HK Entertainment — sitio web

Sitio institucional de HK Entertainment, hecho en HTML, CSS y JavaScript puro (sin frameworks ni build steps), listo para publicarse con GitHub Pages.

## Archivos

```
index.html    → estructura y contenido de la página
styles.css    → estilos e identidad visual
script.js     → menú móvil y pequeños detalles de interacción
juegos-web.js → sección "Jugar": pestañas y reproductor de juegos en el navegador
juegos-web.css→ estilos de la sección "Jugar"
video-loop.js → reproduce los videos en loop solo cuando se ven en pantalla
paginas-juego.css → estilos de las páginas de cada juego
catalogo/     → una página por juego (generadas, no se editan a mano)
tools/        → juegos.json (datos de cada juego) y generar_paginas.py
sitemap.xml, robots.txt → para buscadores (se regeneran con el script)
src/          → imágenes (logo, íconos de juegos, arte de los destacados)
```

## Imágenes necesarias en `src/`

El sitio referencia estos archivos por nombre exacto; tienen que estar en una carpeta `src/` en la raíz del repo, junto a `index.html`:

- `Logo HK c_hamster.png` — logo (header y favicon)
- `cybersimian.jpg`, `cyberchimps.jpg` — arte de los proyectos destacados
- `messi-simulator.png`, `heroes-ebrios.png`, `reto-7d.png`, `grass-cutter.png`, `cowboy-idle.png`, `tortugo.png` — íconos del catálogo

## Cómo subirlo a GitHub Pages

1. Creá un repositorio nuevo en GitHub (por ejemplo `hkentertainment.github.io` si querés usarlo como sitio de organización, o cualquier nombre si va a ser un proyecto).
2. Subí `index.html`, `styles.css`, `script.js`, `README.md` y la carpeta `src/` completa a la raíz del repositorio (podés arrastrarlos desde la interfaz web de GitHub, en "Add file → Upload files", o por Git):

   ```bash
   git init
   git add index.html styles.css script.js README.md src/
   git commit -m "Sitio de HK Entertainment"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

3. En GitHub, andá a **Settings → Pages**.
4. En "Build and deployment", elegí **Deploy from a branch**, seleccioná la rama `main` y la carpeta `/ (root)`.
5. Guardá. GitHub te va a dar una URL del estilo `https://TU-USUARIO.github.io/TU-REPO/` (o `https://TU-USUARIO.github.io/` si el repo se llama `TU-USUARIO.github.io`). Puede tardar uno o dos minutos en estar disponible.

## Juegos jugables en el navegador (sección "Jugar")

Los juegos se ejecutan desde este mismo sitio: cada uno es una build WebGL guardada en `juegos/<id>/`. La lista está al principio de `juegos-web.js`, en el arreglo `GAMES`.

Para sumar un juego:

1. Exportá la build WebGL desde Unity (**File → Build Profiles / Build Settings → Web**).
   En **Player Settings → Publishing Settings** poné **Compression Format: Disabled**, así funciona en cualquier servidor sin configuración extra.
2. Subí el contenido de la build (`index.html`, `Build/`, `TemplateData/`) a `juegos/<id>/`, por ejemplo `juegos/chabonsio/index.html`.
3. En `juegos-web.js`, copiá un bloque de `GAMES` y completá título, autor, género, descripción, `ratio` y `src` (`juegos/<id>/index.html`).
4. Opcional: una portada en `src/<id>-poster.jpg` y completar `poster`.

Si la build todavía no está subida, la pestaña muestra "estará disponible muy pronto" en lugar de un error.

## Páginas de cada juego (catalogo/<juego>/)

Cada juego tiene su propia página, con título, descripción, capturas, requisitos y botones de descarga, pensada para que aparezca en buscadores.

Las páginas **se generan** a partir de `tools/juegos.json`. Para cambiar un texto o agregar un juego:

1. Editá `tools/juegos.json`.
2. Desde la raíz del repo corré `python3 tools/generar_paginas.py` (no necesita instalar nada).
3. Subí los cambios (las carpetas `catalogo/`, `sitemap.xml` y `robots.txt` se actualizan solas).

Si agregás un juego nuevo, sumá también el link en `index.html` (tarjeta del catálogo).

## Video de Cybersimian

El video en loop del inicio y de la página de Cybersimian es `src/Game.mp4` (el nombre tiene que coincidir exactamente, con mayúscula). Para que cargue rápido, comprimilo a menos de 3 MB, sin audio:

```
ffmpeg -i Game.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart src/Game.mp4
```

## Beta de Bogato

El botón "Sumate a la beta en Discord" apunta a la invitación del Discord de HK. Si cambia el link, reemplazalo en `index.html` y en `tools/juegos.json` (y volvé a generar las páginas).

## Contenido a revisar/actualizar

- **Juegos**: la sección "Catálogo completo" muestra Messi Simulator, Héroes Ebrios, Reto 7D, Grass Cutter 3D, Cowboy Idle Frontier y TortuGO. Si publican o dan de baja algún juego, hay que sumar o quitar su tarjeta en `index.html` (buscá `<li class="game-card">`).
- **Widget de itch.io**: el panel de Cybersimian: Trials incluye el embed oficial de itch.io, con los colores ajustados a la paleta del sitio (`bg_color`, `fg_color`, `link_color`, `border_color` en la URL del iframe). Si suben otro juego a itch.io, pueden copiar ese mismo iframe y cambiar solo el ID del embed y el link de fallback.
- **Próximamente**: Bogato y Found Footage están cargados como proyectos en desarrollo; conviene revisar esos textos a medida que avancen.
- **Equipo**: los cuatro integrantes actuales están cargados con sus roles y su LinkedIn (buscá `<li class="team-card">` en `index.html`).
- **Contacto**: el mail y las redes están tomados del sitio anterior; si cambia alguno, se actualiza en la sección `#contacto` y en el `<footer>`.

## Personalización rápida

Los colores principales están centralizados como variables CSS al principio de `styles.css`:

```css
--pink: #ff3f7f;
--cyan: #38e6df;
--amber: #ffb238;
--violet: #7c4dff;
```

Cambiando esos valores se actualiza toda la paleta del sitio de forma consistente.
