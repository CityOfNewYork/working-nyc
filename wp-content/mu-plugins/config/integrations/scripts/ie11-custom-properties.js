if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
  document.write('<script src="https:\/\/cdn.jsdelivr.net\/gh\/nuxodin\/ie11CustomProperties@4.1.0\/ie11CustomProperties.min.js"><\/script>');
  document.write('<style>.o-navigation{display:block !important;}.c-card{display:block !important;}.c-utility{display:block !important;}<\/style>');
}

document.addEventListener('DOMContentLoaded', function() {
  const warning = document.getElementById('ie-warning');
  const links = warning.querySelectorAll('a');

  let tabindex = '-1';

  if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
    warning.classList.remove('hidden');
    warning.setAttribute('aria-hidden', 'false');
    tabindex = '0';
  }

  links.forEach(function(link) {
    link.setAttribute('tabindex', tabindex);
  });
});
