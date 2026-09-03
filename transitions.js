/* ==========================================================================
   unYZY — shared route transition engine
   Handles: nav active-slider positioning, cross-page veil transition with
   logo morph, back/forward cache correctness, and entrance choreography.

   Every page includes:
     <body data-page="home">
       <nav class="nav">...<div class="nav-slider"></div></nav>
       <div class="route-veil" id="routeVeil">
         <div class="route-veil-ring"></div>
         <img class="route-veil-logo" id="routeVeilLogo">
         <div class="route-veil-bar"><div class="route-veil-bar-fill"></div></div>
       </div>
       <script src="/transitions.js"></script>
   ========================================================================== */

(function(){
  "use strict";

  var STORAGE_KEY="unyzyRoute";
  var LOGO_HOME="/assets/logo.png";
  var LOGO_OTHER="/assets/LOGO2.png";

  var body=document.body;
  var currentPage=body.getAttribute("data-page")||"home";

  var veil=document.getElementById("routeVeil");
  var veilLogo=document.getElementById("routeVeilLogo");
  var nav=document.querySelector(".nav");
  var links=document.querySelectorAll("[data-page]");

  var navigating=false;

  function logoFor(target){
    return target==="home"?LOGO_HOME:LOGO_OTHER;
  }

  /* ---- nav active-pill positioning -------------------------------------- */

  function placeSlider(immediate){
    if(!nav)return;

    var slider=nav.querySelector(".nav-slider");
    var active=nav.querySelector("a.active");

    if(!slider||!active)return;

    var navRect=nav.getBoundingClientRect();
    var linkRect=active.getBoundingClientRect();

    var offset=linkRect.left-navRect.left;

    if(immediate){
      slider.style.transition="none";
    }

    slider.style.width=linkRect.width+"px";
    slider.style.transform="translateX("+offset+"px)";

    if(immediate){
      // force reflow so the "none" transition actually applies before
      // we hand control back to CSS
      void slider.offsetWidth;
      slider.style.transition="";
    }
  }

  window.addEventListener("resize",function(){
    placeSlider(true);
  });

  /* ---- outbound: play veil, then navigate ------------------------------- */

  function beginNavigation(url,target){
    if(navigating)return;
    navigating=true;

    body.setAttribute("data-state","leave");

    if(veil&&veilLogo){
      veilLogo.src=logoFor(target);
      veil.classList.add("is-active");

      requestAnimationFrame(function(){
        veil.classList.add("is-shown");
      });

      setTimeout(function(){
        veil.classList.add("is-fading");
      },560);
    }

    setTimeout(function(){
      try{
        sessionStorage.setItem(STORAGE_KEY,target);
      }catch(e){}
      window.location.href=url;
    },780);
  }

  links.forEach(function(link){
    link.addEventListener("click",function(event){
      if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      if(link.classList.contains("active"))return;

      event.preventDefault();
      beginNavigation(link.href,link.dataset.page);
    });
  });

  /* ---- inbound: reverse the veil, then reveal page ---------------------- */

  function enter(){
    placeSlider(true);

    var previous=null;

    try{
      previous=sessionStorage.getItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }catch(e){}

    if(previous&&veil&&veilLogo){
      veilLogo.src=logoFor(previous);
      veil.classList.add("is-active","is-shown");

      body.setAttribute("data-state","enter");

      // let the veil sit a beat, then fade it away while the page
      // itself is already faded-in underneath
      setTimeout(function(){
        veil.classList.add("is-fading");
        body.classList.add("is-in");
      },260);

      setTimeout(function(){
        veil.classList.remove("is-active","is-shown","is-fading");
      },680);
    }else{
      body.setAttribute("data-state","ready");
      requestAnimationFrame(function(){
        body.classList.add("is-in");
      });
    }
  }

  // bfcache: if the user hits back, chrome may restore the page with
  // the veil mid-animation from a previous run — reset defensively.
  window.addEventListener("pageshow",function(event){
    if(event.persisted){
      if(veil){
        veil.classList.remove("is-active","is-shown","is-fading");
      }
      navigating=false;
      body.setAttribute("data-state","ready");
      body.classList.add("is-in");
    }
  });

  if("serviceWorker" in navigator){
    window.addEventListener("load",function(){
      navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(function(){});
    });
  }

  enter();

  // expose a tiny hook other page scripts can use if needed
  window.unyzyRoute={
    navigate:beginNavigation,
    currentPage:currentPage
  };
})();