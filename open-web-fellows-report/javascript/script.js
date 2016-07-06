var defaultTitle;

$(document).ready(function(){

  defaultTitle = document.title;

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
});

window.addEventListener('popstate', function(e) {
  if(e.state) {
    showSection(e.state);
  }
});

function loadArticle(){

  // Check if there is a hash
  // * If it's a valid one, navigate to it
  // * If not, replace with introduction

  var hash = window.location.hash || "#introduction";
  if(!sectionValid(hash)){
    hash = "#introduction";
  }
  window.history.replaceState(hash, null, hash);
  showSection(hash);
}

// Checks if a section exists to match the hash in the URL

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

// Shows a section that matches a hash

function showSection(hash){

  var navLinkEl = $("nav a[href=" + hash + "]");
  var id = hash.replace("#","");
  var sectionEl = $("article section[id=" + id + "]");

  if(navLinkEl.length != 1 || sectionEl.length != 1) {
    return;
  }

  $("article section").hide();
  sectionEl.show();

  $("nav").find(".selected").removeClass("selected");
  navLinkEl.addClass("selected");

  $(window).scrollTop(0);
}
