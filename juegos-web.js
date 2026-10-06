// HK Entertainment — juegos jugables dentro de la página
//
// Los juegos se ejecutan desde ESTE sitio: cada uno es una build WebGL alojada
// en la carpeta juegos/<id>/ (con su index.html adentro).
//
// Para sumar un juego:
//   1. Subí la build a  juegos/<id>/  (index.html + Build/ + TemplateData/).
//   2. Copiá un bloque de GAMES y completá los datos.
// `ratio` es la proporción de pantalla del juego: [ancho, alto].
// `poster` es opcional (imagen de portada, por ejemplo src/<id>-poster.jpg).
// Si la build todavía no está subida, la pestaña avisa "próximamente".

(function () {
  'use strict';

  var GAMES = [
    {
      id: 'chabonsio',
      title: 'Chabonsio Endless Runner!',
      author: 'YamatoAF',
      genre: 'Endless runner · Unity',
      description: 'Chabonsio debe esquivar a los terrores de su barrio en la noche. ¡Corré, esquivá y no pares!',
      poster: 'src/chabonsio-poster.jpg',
      src: 'juegos/chabonsio/index.html',
      ratio: [16, 9]
    },
    {
      id: 'kick',
      title: 'K.I.C.K',
      author: 'Yska_Art, YamatoAF',
      genre: 'Arcade deportivo · Unity · En desarrollo',
      description: 'Un robot entrena solo, con la mirada puesta en la red. Hacé jueguitos para cargar potencia, elegí el rincón del arco y dibujá el swipe perfecto.',
      poster: 'src/kick-poster.jpg',
      src: 'juegos/kick/index.html',
      ratio: [9, 16] // juego pensado para pantalla vertical; si se ve cortado, probá [16, 9]
    }
  ];

  var tabsEl = document.getElementById('playTabs');
  var viewportEl = document.getElementById('playViewport');
  var infoEl = document.getElementById('playInfo');
  if (!tabsEl || !viewportEl || !infoEl) return;

  var current = null;   // juego seleccionado
  var frameEl = null;   // contenedor del juego (también se usa para pantalla completa)
  var playing = false;  // true cuando el juego ya está cargado en el iframe

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function canFullscreen(node) {
    return !!(node.requestFullscreen || node.webkitRequestFullscreen);
  }

  function enterFullscreen(node) {
    if (node.requestFullscreen) node.requestFullscreen();
    else if (node.webkitRequestFullscreen) node.webkitRequestFullscreen();
  }

  // ---- Pestañas ----
  function buildTabs() {
    GAMES.forEach(function (game, i) {
      var tab = el('button', 'play-tab', game.title);
      tab.type = 'button';
      tab.id = 'play-tab-' + game.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'playStage');
      tab.addEventListener('click', function () { select(game); });
      tab.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = GAMES[(i + dir + GAMES.length) % GAMES.length];
        select(next);
        document.getElementById('play-tab-' + next.id).focus();
      });
      tabsEl.appendChild(tab);
    });
  }

  function markSelected(game) {
    GAMES.forEach(function (g) {
      var tab = document.getElementById('play-tab-' + g.id);
      var on = g === game;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });
  }

  // ---- Selección de juego ----
  function select(game) {
    current = game;
    playing = false;
    markSelected(game);
    renderPoster(game, true);
    renderInfo(game);

    // Si la build todavía no está subida al servidor, avisamos en vez de mostrar un 404
    buildExists(game, function (ok) {
      if (!ok && current === game && !playing) renderPoster(game, false);
    });
  }

  function buildExists(game, done) {
    if (typeof fetch !== 'function') return done(true);
    fetch(game.src, { method: 'HEAD' })
      .then(function (res) { done(res.ok); })
      .catch(function () { done(true); }); // sin red o sin servidor: lo intentamos igual
  }

  function newFrame(game) {
    frameEl = el('div', 'play-frame');
    frameEl.style.setProperty('--rw', game.ratio[0]);
    frameEl.style.setProperty('--rh', game.ratio[1]);
    viewportEl.textContent = '';
    viewportEl.appendChild(frameEl);
    return frameEl;
  }

  // Pantalla previa: el juego no se carga hasta que se aprieta "Jugar"
  function renderPoster(game, available) {
    var frame = newFrame(game);
    var poster = el('div', 'play-poster');
    if (game.poster) poster.style.backgroundImage = 'url("' + game.poster + '")';

    if (available) {
      var start = el('button', 'play-start', 'Jugar ahora');
      start.type = 'button';
      start.setAttribute('aria-label', 'Jugar ' + game.title);
      start.addEventListener('click', function () { load(game); });
      poster.appendChild(start);
    } else {
      poster.appendChild(el('p', 'play-note', 'Este juego estará disponible para jugar acá muy pronto.'));
    }
    frame.appendChild(poster);
  }

  function load(game) {
    playing = true;
    var frame = newFrame(game);
    var iframe = document.createElement('iframe');
    iframe.src = game.src;
    iframe.title = game.title;
    iframe.setAttribute('allow', 'autoplay; fullscreen; gamepad; clipboard-write; accelerometer; gyroscope');
    iframe.setAttribute('allowfullscreen', '');
    frame.appendChild(iframe);
    iframe.focus(); // para que el teclado juegue el juego y no mueva la página
  }

  // ---- Ficha del juego ----
  function renderInfo(game) {
    infoEl.textContent = '';

    var text = el('div');
    text.appendChild(el('h3', '', game.title));
    text.appendChild(el('p', 'play-meta', game.genre + ' · ' + game.author));
    text.appendChild(el('p', 'play-desc', game.description));
    infoEl.appendChild(text);

    var actions = el('div', 'play-actions');

    var fs = el('button', 'play-btn', 'Pantalla completa');
    fs.type = 'button';
    fs.hidden = !canFullscreen(document.documentElement);
    fs.addEventListener('click', function () { if (frameEl) enterFullscreen(frameEl); });
    actions.appendChild(fs);

    var restart = el('button', 'play-btn', 'Reiniciar');
    restart.type = 'button';
    restart.addEventListener('click', function () { load(game); });
    actions.appendChild(restart);

    infoEl.appendChild(actions);
  }

  if (!GAMES.length) return;
  buildTabs();
  select(GAMES[0]);
})();
