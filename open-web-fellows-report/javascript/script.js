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

var navTop, windowHeight, navHeight, navOffset, defaultTitle;


window.addEventListener('popstate', function(e) {
  if(e.state) {
    showSection(e.state);
  }
});


$(document).ready(function(){

  defaultTitle = document.title;

  // windowHeight = $(window).height();
  // docHeight = $("body").height();


  $("nav").on("click","a",function(){
    var step = $(this).attr("href");
    window.history.pushState(step, null, step);
    showSection(step);
    return false;

  });

  $(".next-section").on("click","a",function(){
    var step = $(this).attr("href");
    window.history.pushState(step, null, step);
    showSection(step);
    return false;

  });




  loadArticle();

  // $(window).on("scroll",function(){
  //   if(autoscrolling == false) {
  //     scroll();
  //   }
  // });
  //
  // $(window).on("resize",function(){
  //   checkLayout();
  // });

  // checkHash();
  // checkLayout();
  // positionNav();
});


function loadArticle(){

  // * Check if there is a hash
  // * If it's a valid one, navigate
  // * If not, replace with introduction

  var hash = window.location.hash;

  if(hash) {
    if(!sectionValid(hash)){
      hash = "#introduction";
      window.history.replaceState(hash, null, hash);
    }
    showSection(hash);
  }

}

function sectionValid(hash){


  var navLinkEl = $("nav a[href=" + hash + "]");
  var id = hash.replace("#","");
  var sectionEl = $("article section[id=" + id + "]");

  if(navLinkEl.length == 1 && sectionEl.length == 1) {
    return true;
  } else {
    return false;
  }
}


function showSection(hash){

  var navLinkEl = $("nav a[href=" + hash + "]");
  var id = hash.replace("#","");
  var sectionEl = $("article section[id=" + id + "]");


  if(navLinkEl.length != 1 || sectionEl.length != 1) {
    console.log("nope");
    return;
  }

  $("article section").hide();
  sectionEl.show();

  $("nav").find(".selected").removeClass("selected");
  navLinkEl.addClass("selected");

  $(window).scrollTop(0);
}

//
// function selectSection(section){
//   changeSelectedNav(section);
//   autoscrolling = true;
//
//   window.clearTimeout(scrollingTimeout);
//
//   scrollingTimeout = window.setTimeout(function(){
//     autoscrolling = false;
//   },parseInt(scrollSpeed + 100));
//
//
//   $('html, body').animate({
//     scrollTop: $(section).offset().top
//   }, scrollSpeed, function(){
//     window.location.hash = section;
//     lastScroll = $(window).scrollTop();
//   });
//
//   if(sections.indexOf(section) < 0){
//     section = "#introduction";
//   }
//
//   if(window.history.replaceState) {
//     window.history.replaceState(null, null, section);
//   }
//
//   positionNav();
// }

function changeSelectedNav(section) {
  $("nav a.selected").removeClass("selected");
  $("nav [href="+section+"]").addClass("selected");
}

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
  var maxOffset = $("aside").outerHeight() - $(window).height();

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
        // offender
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
      changeSelectedNav("#" + id);
    }
  });

  if(windowTop + windowHeight == docHeight){
    var last = articleSections[articleSections.length - 1];
    var id = $(last).attr('id');
    changeSelectedNav("#" + id);
  }

  positionNav();
}


function checkHash(){
  var hash = window.location.hash;
  if(hash){
    selectSection(hash);
  }
}
