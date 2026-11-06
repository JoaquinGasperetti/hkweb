// HK Entertainment — interacciones v2.0 (menú móvil, filtros de catálogo, lightbox, scroll reveal e idioma ES/EN)

document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.add('js-ready');

  // 1. Menú móvil
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Año actual en el footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Animación suave de aparición al hacer scroll (IntersectionObserver)
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // 4. Filtros interactivos del catálogo en la portada
  var filterButtons = document.querySelectorAll('.filter-chip[data-filter]');
  var catalogCards = document.querySelectorAll('#catalogGrid .game-card');

  if (filterButtons.length && catalogCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filterButtons.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        catalogCards.forEach(function (card) {
          var match = (cat === 'all') || (card.getAttribute('data-category') === cat);
          card.hidden = !match;
        });
      });
    });
  }

  // 5. Lightbox modal para las galerías de capturas en catalogo/<juego>/
  var galleryLinks = document.querySelectorAll('.gp-gallery a');
  if (galleryLinks.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Visor de capturas');

    lb.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Cerrar visor">Cerrar &times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Captura anterior">&larr;</button>' +
      '<img class="lightbox-img" src="" alt="">' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Captura siguiente">&rarr;</button>';

    document.body.appendChild(lb);

    var lbImg = lb.querySelector('.lightbox-img');
    var lbClose = lb.querySelector('.lightbox-close');
    var lbPrev = lb.querySelector('.lightbox-prev');
    var lbNext = lb.querySelector('.lightbox-next');
    var currentIndex = 0;
    var items = Array.prototype.slice.call(galleryLinks);

    function showImage(idx) {
      currentIndex = (idx + items.length) % items.length;
      var link = items[currentIndex];
      var thumb = link.querySelector('img');
      lbImg.src = link.getAttribute('href');
      lbImg.alt = thumb ? thumb.alt : 'Captura del juego';
      lb.hidden = false;
    }

    items.forEach(function (link, idx) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showImage(idx);
      });
    });

    lbClose.addEventListener('click', function () { lb.hidden = true; });
    lbPrev.addEventListener('click', function () { showImage(currentIndex - 1); });
    lbNext.addEventListener('click', function () { showImage(currentIndex + 1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) lb.hidden = true;
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') lb.hidden = true;
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  // 6. Selector bilingüe ES | EN
  var langBtn = document.getElementById('langSwitch');
  var currentLang = 'es';
  var dict = {
    en: {
      nav_home: 'Home',
      nav_games: 'Games',
      nav_play: 'Play',
      nav_proposals: 'Pitch / Co-Dev',
      nav_team: 'Team',
      nav_contact: 'Contact',
      hero_kicker: 'Indie Game Studio · Argentina',
      hero_title: 'Soccer, cowboys, <span class="text-gradient">a biomechanical ape</span> &amp; worlds to explore.',
      hero_sub: 'We are HK Entertainment: a multidisciplinary indie team crafting original PC & Android games in Unreal Engine 5 and Unity, plus custom co-development.',
      hero_cta_games: 'Explore our games',
      hero_cta_proposals: 'Build with us',
      showcase_badge: 'Free PC Tech Demo',
      showcase_sub: 'First-person 3D parkour, procedural test chambers, and sharp dark humor in Unreal Engine 5.',
      showcase_play: 'Play demo on itch.io',
      showcase_info: 'Details & trailer',
      stat_games: 'games & projects created',
      stat_engines: 'PC & Mobile game engines',
      stat_downloads: 'downloads on Messi Simulator',
      stat_team: 'specialists across code, art, audio & design',
      games_title: 'Our Games',
      games_sub: 'From our cyberpunk parkour tech demo on PC to online co-op puzzles and mobile arcades on Google Play.',
      cyber_desc: 'M03 is a voiceless biomechanical primate waking up inside an experimental facility run by AR-IA, a razor-sharp and sarcastic AI.',
      cyber_meta: 'Two-level parkour tech demo, playable for free on itch.io.',
      chimps_desc: 'A 2-player online cyberpunk co-op puzzle game. Host a room, share a 6-letter code, and solve stages together from anywhere.',
      chimps_meta: 'Our first online multiplayer co-op release on Google Play.',
      btn_full_sheet: 'Full page, trailer & screenshots',
      btn_more_info: 'Game details →',
      btn_story_more: 'Read story & details →',
      catalog_heading: 'Google Play Catalog',
      filter_all: 'All (6)',
      filter_arcade: 'Arcade & Action',
      filter_sim: 'Idle & Sim',
      filter_social: 'Party & Lifestyle',
      upcoming_heading: 'Upcoming · In Active Development',
      bogato_desc: 'An open-world game featuring dragons, magic, and warring clans. Two explorable maps and a community benchmark system.',
      bogato_cta: 'Join the Discord Beta',
      ff_desc: 'Investigate an abandoned nuclear plant in search of anomalies. Nobody knows what creatures inhabit the radioactive zone.',
      prop_kicker: 'Build your game with HK',
      prop_title: 'Send us your game proposal',
      prop_sub: 'Have a game concept, looking for a development partner, or planning a co-production? Tell us about your idea, estimated budget, and contact info.',
      prop_how_title: 'How do we evaluate proposals?',
      team_title: 'Our Team',
      team_sub: 'Four specialists covering programming, art direction, interactive audio, narrative design, and finance end to end.',
      values_title: 'How We Work',
      val_1_title: 'Innovation',
      val_1_desc: 'We explore new genres, mechanics, and engines on every project instead of repeating the same formula.',
      val_2_title: 'Craft & Polish',
      val_2_desc: 'From code architecture to visual art, we care about performance and detail before shipping.',
      val_3_title: 'Agile Squad',
      val_3_desc: 'Four core leads covering every discipline in-house with zero bureaucracy.',
      val_4_title: 'Community Driven',
      val_4_desc: 'We listen to player feedback on Discord and itch.io to iterate on every update.',
      press_title: 'Press Kit & Brand Assets',
      press_desc: 'Content creator, streamer, journalist, or event organizer? Download our high-res official logo and studio banner.',
      contact_title: 'Contact',
      contact_sub: 'Have a project, a pitch, or want to join our community? Drop us an email or find us on social media.',
      back_top: 'Back to top ↑'
    }
  };

  // Save original Spanish strings automatically
  dict.es = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    dict.es[el.getAttribute('data-i18n')] = el.textContent;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    dict.es[el.getAttribute('data-i18n-html')] = el.innerHTML;
  });

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      document.documentElement.lang = currentLang;
      langBtn.textContent = currentLang === 'es' ? 'ES | EN' : 'EN | ES';

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[currentLang] && dict[currentLang][key]) {
          el.textContent = dict[currentLang][key];
        }
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-html');
        if (dict[currentLang] && dict[currentLang][key]) {
          el.innerHTML = dict[currentLang][key];
        }
      });
    });
  }
});
