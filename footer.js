
(function(){
  "use strict";

  var mount=document.getElementById("siteFooter");
  if(!mount)return;

  var year=new Date().getFullYear();

  mount.innerHTML=
    '<div class="foot-brand">'+
      '<img src="/assets/LOGO2.png" alt="" width="14" height="14" style="object-fit:contain;opacity:.7">'+
      'unYZY'+
    '</div>'+
    '<div class="foot-links">'+
      '<a href="/">Home</a>'+
      '<a href="/downloads">Downloads</a>'+
      '<a href="/updates">Updates</a>'+
    '</div>'+
    '<div class="foot-disclaimer">'+
      'unYZY is an independent, fan-run archive. Not affiliated with or endorsed by any label or artist. '+
      '&copy; '+year+' unYZY Archive.'+
    '</div>';
})();