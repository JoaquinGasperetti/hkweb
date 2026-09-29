# HK Entertainment — sitio web

Sitio institucional de HK Entertainment, hecho en HTML, CSS y JavaScript puro (sin frameworks ni build steps), listo para publicarse con GitHub Pages.

## Archivos

```
index.html    → estructura y contenido de la página
styles.css    → estilos e identidad visual
script.js     → menú móvil y pequeños detalles de interacción
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
