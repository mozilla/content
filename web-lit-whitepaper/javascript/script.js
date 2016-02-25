// Navigation 1.0 ALPHA
//
// * Highlights the appropriate element in the navigation when scrolling through the page
// * Scrolls to appropriate section of the page when the navigation is clicked

var sections = [];
var articleSections = $();
var autoscrolling = false;
var docHeight, windowHeight, scrollingTimeout;
var scrollSpeed = 500;  // Time (in ms) it takes to scroll to a new section when using the nav
var lastScroll = 0;

$(document).ready(function(){

  windowHeight = $(window).height();
  docHeight = $("body").height();

  $("nav").on("click","a",function(){
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    var section = $(this).attr("href");

    autoscrolling = true;

    window.clearTimeout(scrollingTimeout);

    scrollingTimeout = window.setTimeout(function(){
      autoscrolling = false;
    },parseInt(scrollSpeed + 100));

    $('html, body').animate({
      scrollTop: $(section).offset().top
    }, scrollSpeed, function(){
      window.location.hash = section;
    });

    return false;
  });

  $("nav a").each(function(i,el){
    var sectionName = $(el).attr("href");
    if(sectionName.length > 0) {
      sectionName = sectionName.toLowerCase();
      sections.push(sectionName);
    }
  });

  var jam = $("*[id]");
  $(jam).each(function(i,el){
    var id = $(el).attr("id");
    id = id.toLowerCase();
    if(sections.indexOf("#" + id ) > -1) {
      articleSections.push(el);
    }
  });

  $(window).on("scroll",function(){
    if(autoscrolling == false) {
      scroll();
    }
  });

  $(window).on("resize",function(){
    checkLayout();
  });

  checkHash();
  checkLayout();
  positionNav();
});

// Hides the sidebar image if there isn't a lot of room.

function checkLayout(){
  var windowHeight = $(window).height();
  var asideHeight = $("nav").height() + $("aside .image").height() + 55;
  if(asideHeight > windowHeight){
    $(".image").hide();
  } else {
    $(".image").show();
    $("aside").css("top",0);
  }
}

function positionNav(){
  console.log("positionNav");
  var maxOffset = $("aside").outerHeight() - $(window).height();

  console.log($("aside").outerHeight(),$(window).height());

  var scrollDelta = $(window).scrollTop() - lastScroll;
  lastScroll = $(window).scrollTop();
  var asideTop = parseInt($("aside").css("top"));

  if(maxOffset > 0) {
    if(scrollDelta > 0) {
      //scrolling down
      var jam = $(window).height() - asideTop - $("aside").height();
      if(jam < 0) {
        $("aside").css("top", asideTop - scrollDelta);
      }
    } else {
      //Scrolling up
      if(asideTop < 0) {
        $("aside").css("top", asideTop - scrollDelta);
      }
    }
    if(asideTop > 0) {
      asideTop = 0;
      $("aside").css("top", 0);
    }
    if(Math.abs(asideTop) > maxOffset){
      $("aside").css("top", -1 * maxOffset);
    }
  }



}


// Updates the nav depending on what part of the article a user scrolls to.

function scroll(){
  var windowTop = $(window).scrollTop();

  articleSections.each(function(i,el){
    var offset = $(el).offset();
    var fromTop = offset.top - windowTop;
    if(fromTop >= 0 && fromTop < 400) {
      var id = $(el).attr('id');
      selectSection(id);
    }
  });

  if(windowTop + windowHeight == docHeight){
    var last = articleSections[articleSections.length - 1];
    var id = $(last).attr('id');
    selectSection(id);
  }

  positionNav();
}

function selectSection(id){

  if(sections.indexOf("#" + id) < 0){
    id = "introduction";
  }

  $("nav .selected").removeClass("selected");
  $("nav a[href=#"+id+"]").addClass("selected");

  if(window.history.replaceState) {
    window.history.replaceState(null, null, "#" + id);
  }
}

function checkHash(){
  var hash = window.location.hash;
  if(hash){
    selectSection(hash.replace("#",""));
  }
}
