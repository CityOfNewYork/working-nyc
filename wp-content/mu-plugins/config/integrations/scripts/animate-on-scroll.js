var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');

if (prefersReducedMotion && prefersReducedMotion.matches) {
  var head = document.getElementsByTagName('HEAD')[0];
  var link = document.createElement('link');

  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://cdn.jsdelivr.net/gh/michalsnik/aos@v2.3.4/dist/aos.css';

  head.appendChild(link);

  window.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 400,
      easing: 'ease-out'
    });
  });
}
