// HK Entertainment — videos en loop
//
// Los <video autoplay muted loop> se reproducen solo mientras se ven en pantalla
// (ahorra batería y datos en el celular). Si la persona pidió "reducir movimiento"
// en su dispositivo, el video no arranca solo: queda con controles para que decida.

(function () {
  'use strict';

  var videos = document.querySelectorAll('video[autoplay][loop]');
  if (!videos.length) return;

  var reducirMovimiento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducirMovimiento) {
    videos.forEach(function (v) {
      v.pause();
      v.removeAttribute('autoplay');
      v.controls = true;
    });
    return;
  }

  if (!('IntersectionObserver' in window)) return; // sin observer: queda el autoplay normal

  var observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      var v = entrada.target;
      if (entrada.isIntersecting) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.controls = true; }); // si el navegador lo bloquea
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.25 });

  videos.forEach(function (v) { observer.observe(v); });
})();
