function googleTranslateElementInit() {
  let lang = document.documentElement.lang;

  if (lang == 'zh-hant') {
    lang = 'zh-TW';
  }

  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: lang + ',\'en\'',
    autoDisplay: false
  }, 'google_translate_element');

  var a = document.querySelector('#google_translate_element select');

  if (a.length > 1) {
    a.selectedIndex = 1
  } else {
    a.selectedIndex = 0
    a.dispatchEvent(new Event('change'))
  }
  a.dispatchEvent(new Event('change'))
}