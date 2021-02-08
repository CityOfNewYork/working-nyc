/**
 * Add id attribute to headings
 */

export default function () {

  const main = document.querySelector('main')
  const headings = main.querySelectorAll('h1, h2, h3, h4, h5, h6')

  headings.forEach(function(el){
    if (el.getAttribute('id') == null) {
      let id = el.innerText.toLowerCase().replace(/[\s]/g, '-')
      // id = id.replace(/[\W_]/g, '-')
      el.setAttribute('id', id)
    }
  })
}
