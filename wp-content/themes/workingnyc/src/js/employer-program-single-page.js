
let items = document.querySelectorAll('#featureContainer .carousel .carousel-item');
var width = $(window).width();
console.log("screen: "+width);
if(width<768){
  var minPerSlide = 1;
}else if(width<1112 && width>768){
  var minPerSlide = 2;
}else{
  var minPerSlide = 3;
}
items.forEach((el) => {
    let next = el.nextElementSibling
  for (var i=1; i<minPerSlide; i++) {
    if (!next) {
      // wrap carousel by using first child
      next = items[0]
    }
    let cloneChild = next.cloneNode(true)
    el.appendChild(cloneChild.children[0])
    next = next.nextElementSibling
  }
})
$(document).ready(function(){
  $('#featureCarousel').carousel({interval: false});
  $('#featureCarousel').carousel('pause');
});



