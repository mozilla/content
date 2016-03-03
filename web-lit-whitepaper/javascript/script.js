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

  $("article").on("click","a",function(){
    var url = $(this).attr("href");
    if(sections.indexOf(url) > -1) {
      selectSection(url);
      return false;
    }
  });

  $("nav").on("click","a",function(){
     var section = $(this).attr("href");
     selectSection(section);
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



function selectSection(section){
  changeSelectedNav(section);
  autoscrolling = true;

  window.clearTimeout(scrollingTimeout);

  scrollingTimeout = window.setTimeout(function(){
    autoscrolling = false;
  },parseInt(scrollSpeed + 100));


  $('html, body').animate({
    scrollTop: $(section).offset().top
  }, scrollSpeed, function(){
    window.location.hash = section;
    lastScroll = $(window).scrollTop();
  });

  if(sections.indexOf(section) < 0){
    section = "#introduction";
  }

  if(window.history.replaceState) {
    window.history.replaceState(null, null, section);
  }

  positionNav();
}

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
