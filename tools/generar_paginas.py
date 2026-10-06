#!/usr/bin/env python3
"""
Genera las páginas de cada juego (catalogo/<slug>/index.html), sitemap.xml y robots.txt
a partir de tools/juegos.json.

Uso (desde la raíz del repo):
    python3 tools/generar_paginas.py

Para agregar o cambiar un juego editá tools/juegos.json y volvé a correr el script.
No hace falta instalar nada: usa solo la librería estándar de Python 3.
"""

import html
import json
from datetime import date
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).resolve().parent.parent
DATOS = json.loads((RAIZ / "tools" / "juegos.json").read_text(encoding="utf-8"))
DOMINIO = DATOS["dominio"].rstrip("/")
JUEGOS = DATOS["juegos"]
EMAIL = "contacto@hkentertainment.com.ar"
PLAY_DEV = "https://play.google.com/store/apps/dev?id=6928241970397486127"


def e(texto):
    return html.escape(str(texto), quote=True)


def ruta(rel):
    """Ruta relativa a un archivo del sitio desde catalogo/<slug>/ (codifica espacios)."""
    return "../../" + quote(rel)


def url_abs(rel):
    return DOMINIO + "/" + quote(rel)


def boton(c):
    clase = {"primary": "btn btn-primary", "outline": "btn btn-outline"}.get(c.get("estilo"), "btn btn-ghost")
    return f'<a class="{clase}" href="{e(c["url"])}" target="_blank" rel="noopener">{e(c["texto"])}</a>'


def json_ld(j):
    datos = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": j["titulo"],
        "description": j["meta"],
        "url": f'{DOMINIO}/catalogo/{j["slug"]}/',
        "image": url_abs(j["og_image"]),
        "genre": j.get("genero", ""),
        "author": {"@type": "Organization", "name": "HK Entertainment", "url": DOMINIO + "/"},
        "publisher": {"@type": "Organization", "name": "HK Entertainment"},
    }
    if j.get("plataforma"):
        datos["gamePlatform"] = j["plataforma"]
    texto = json.dumps(datos, ensure_ascii=False, indent=2)
    return texto.replace("</", "<\\/")


def hero(j):
    titulo = e(j["titulo"])
    if j.get("logo"):
        lg = j["logo"]
        h1 = (f'<h1 class="gp-title gp-title--logo"><img src="{ruta(lg["src"])}" width="{lg["ancho"]}" '
              f'height="{lg["alto"]}" alt="{titulo}"></h1>')
    else:
        h1 = f'<h1 class="gp-title">{titulo}</h1>'

    insignias = "".join(f"<li>{e(b)}</li>" for b in j.get("badges", []))
    botones = "".join(boton(c) for c in j.get("ctas", []))
    nota = f'<p class="gp-note">{e(j["nota_cta"])}</p>' if j.get("nota_cta") else ""
    descarga = f'<p class="gp-note">{e(j["nota_descarga"])}</p>' if j.get("nota_descarga") else ""

    media = ""
    if j.get("video"):
        v = j["video"]
        media = (f'<video class="gp-media" src="{ruta(v["src"])}" poster="{ruta(v["poster"])}" '
                 f'autoplay muted loop playsinline preload="metadata" '
                 f'aria-label="Fragmento de juego de {titulo}"></video>')
    elif j.get("icono") and not j.get("logo"):
        clase = "gp-media gp-media--cover" if j["icono"].lower().endswith(".jpg") else "gp-media gp-media--icon"
        media = f'<img class="{clase}" src="{ruta(j["icono"])}" alt="Arte de {titulo}">'

    clase_grid = "gp-hero-grid" if media else "gp-hero-grid gp-hero-grid--solo"
    return f"""
  <section class="gp-hero">
    <div class="wrap">
      <a class="gp-back" href="../../index.html#juegos">&larr; Todos los juegos</a>
      <div class="{clase_grid}">
        <div class="gp-hero-text">
          {h1}
          <p class="gp-tagline">{e(j["tagline"])}</p>
          <ul class="gp-badges">{insignias}</ul>
          <div class="gp-actions">{botones}</div>
          {nota}{descarga}
        </div>
        {media}
      </div>
    </div>
  </section>"""


def seccion(titulo, contenido, extra_clase=""):
    return f"""
  <section class="gp-section {extra_clase}">
    <div class="wrap">
      <h2>{e(titulo)}</h2>
      {contenido}
    </div>
  </section>"""


def cuerpo(j):
    partes = []

    parrafos = "".join(f"<p>{e(p)}</p>" for p in j.get("descripcion", []))
    partes.append(seccion("Sobre el juego", f'<div class="gp-prose">{parrafos}</div>'))

    for s in j.get("secciones", []):
        if s.get("parrafos"):
            cont = '<div class="gp-prose">' + "".join(f"<p>{e(p)}</p>" for p in s["parrafos"]) + "</div>"
        else:
            cont = '<ul class="gp-list">' + "".join(f"<li>{e(i)}</li>" for i in s["lista"]) + "</ul>"
        partes.append(seccion(s["titulo"], cont))

    if j.get("caracteristicas"):
        lista = '<ul class="gp-list">' + "".join(f"<li>{e(i)}</li>" for i in j["caracteristicas"]) + "</ul>"
        partes.append(seccion("Características", lista))

    if j.get("youtube"):
        iframe = (f'<div class="gp-video"><iframe src="https://www.youtube-nocookie.com/embed/{e(j["youtube"])}" '
                  f'title="Tráiler de {e(j["titulo"])}" loading="lazy" allowfullscreen '
                  f'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" '
                  f'referrerpolicy="strict-origin-when-cross-origin"></iframe></div>')
        partes.append(seccion("Tráiler", iframe))

    if j.get("capturas"):
        imgs = "".join(
            f'<a href="{e(grande)}" target="_blank" rel="noopener"><img src="{e(mini)}" '
            f'alt="Captura {i} de {e(j["titulo"])}" loading="lazy"></a>'
            for i, (mini, grande) in enumerate(j["capturas"], 1)
        )
        partes.append(seccion("Capturas", f'<div class="gp-gallery">{imgs}</div>'))

    if j.get("controles"):
        filas = "".join(f"<div><dt><kbd>{e(t)}</kbd></dt><dd>{e(a)}</dd></div>" for t, a in j["controles"])
        partes.append(seccion("Controles", f'<dl class="gp-controls">{filas}</dl>'))

    if j.get("requisitos"):
        cols = ""
        for nombre, items in j["requisitos"].items():
            lis = "".join(f"<li>{e(i)}</li>" for i in items)
            cols += f'<div class="gp-req"><h3>{e(nombre)}</h3><ul class="gp-list gp-list--compact">{lis}</ul></div>'
        partes.append(seccion("Requisitos del sistema", f'<div class="gp-reqs">{cols}</div>'))

    return "".join(partes)


def otros(actual):
    tarjetas = ""
    for o in JUEGOS:
        if o["slug"] == actual["slug"]:
            continue
        icono = o.get("icono", "")
        if o.get("logo"):
            img = f'<img src="{ruta(o["logo"]["src"])}" alt="" loading="lazy">'
        else:
            img = f'<img src="{ruta(icono)}" alt="" loading="lazy">'
        etiqueta = o["badges"][0] if o.get("badges") else ""
        tarjetas += (f'<a class="gp-other" href="../{e(o["slug"])}/">{img}'
                     f'<span><strong>{e(o["titulo"])}</strong><small>{e(etiqueta)}</small></span></a>')
    return seccion("Más juegos de HK", f'<div class="gp-others">{tarjetas}</div>', "gp-section--alt")


def pagina(j):
    titulo_pag = f'{j["titulo"]} — HK Entertainment'
    url = f'{DOMINIO}/catalogo/{j["slug"]}/'
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(titulo_pag)}</title>
<meta name="description" content="{e(j["meta"])}">
<link rel="canonical" href="{e(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="HK Entertainment">
<meta property="og:locale" content="es_AR">
<meta property="og:title" content="{e(titulo_pag)}">
<meta property="og:description" content="{e(j["meta"])}">
<meta property="og:url" content="{e(url)}">
<meta property="og:image" content="{e(url_abs(j["og_image"]))}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../src/Logo%20HK%20c_hamster.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../styles.css">
<link rel="stylesheet" href="../../paginas-juego.css">
<script type="application/ld+json">
{json_ld(j)}
</script>
</head>
<body>

<a class="skip-link" href="#contenido">Saltar al contenido</a>

<header class="site-header" id="top">
  <div class="wrap header-inner">
    <a class="logo" href="../../index.html" aria-label="HK Entertainment — inicio">
      <img class="logo-mark" src="../../src/Logo%20HK%20c_hamster.png" alt="" width="38" height="38">
      <span class="logo-text">HK Entertainment</span>
    </a>

    <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="primaryNav" aria-label="Abrir menú de navegación">
      <span></span><span></span><span></span>
    </button>

    <nav class="primary-nav" id="primaryNav">
      <a href="../../index.html#inicio">Inicio</a>
      <a href="../../index.html#juegos">Juegos</a>
      <a href="../../index.html#equipo">Equipo</a>
      <a href="../../index.html#contacto">Contacto</a>
      <a class="nav-cta" href="{PLAY_DEV}" target="_blank" rel="noopener">Google Play</a>
    </nav>
  </div>
</header>

<main id="contenido">
{hero(j)}
{cuerpo(j)}
{otros(j)}
</main>

<footer class="site-footer">
  <div class="wrap footer-inner">
    <p>© <span id="year"></span> HK Entertainment · <a href="mailto:{EMAIL}">{EMAIL}</a></p>
    <a href="#top">Volver arriba</a>
  </div>
</footer>

<script src="../../script.js"></script>
<script src="../../video-loop.js" defer></script>
</body>
</html>
"""


def main():
    for j in JUEGOS:
        carpeta = RAIZ / "catalogo" / j["slug"]
        carpeta.mkdir(parents=True, exist_ok=True)
        (carpeta / "index.html").write_text(pagina(j), encoding="utf-8")
        print("ok  catalogo/%s/index.html" % j["slug"])

    hoy = date.today().isoformat()
    urls = [f"{DOMINIO}/"] + [f'{DOMINIO}/catalogo/{j["slug"]}/' for j in JUEGOS]
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sitemap.append(f"  <url><loc>{u}</loc><lastmod>{hoy}</lastmod></url>")
    sitemap.append("</urlset>")
    (RAIZ / "sitemap.xml").write_text("\n".join(sitemap) + "\n", encoding="utf-8")
    (RAIZ / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {DOMINIO}/sitemap.xml\n", encoding="utf-8")
    print("ok  sitemap.xml y robots.txt")


if __name__ == "__main__":
    main()
