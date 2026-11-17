(function(){
var d=document,b=d.querySelector('.burger'),n=d.getElementById('menu');
if(b){b.addEventListener('click',function(){var o=d.body.classList.toggle('menu-open');b.setAttribute('aria-expanded',o)});}
/* lightbox */
var lbs=[].slice.call(d.querySelectorAll('a.lb'));
if(lbs.length){var box=d.createElement('div');box.className='lbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Powiększone zdjęcie');
box.innerHTML='<img alt=""><p></p><button class="lb-x" type="button" aria-label="Zamknij">×</button><button class="lb-p" type="button" aria-label="Poprzednie zdjęcie">‹</button><button class="lb-n" type="button" aria-label="Następne zdjęcie">›</button>';
d.body.appendChild(box);var im=box.querySelector('img'),cap=box.querySelector('p'),cur=0,last=null;
function show(i){cur=(i+lbs.length)%lbs.length;var a=lbs[cur],t=a.querySelector('img');im.src=a.getAttribute('href');im.alt=t?t.alt:'';cap.textContent=t?t.alt:'';}
function close(){box.classList.remove('on');d.documentElement.style.overflow='';if(last)last.focus();}
lbs.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();last=a;show(i);box.classList.add('on');d.documentElement.style.overflow='hidden';box.querySelector('.lb-x').focus();});});
box.querySelector('.lb-x').onclick=close;box.querySelector('.lb-p').onclick=function(){show(cur-1)};box.querySelector('.lb-n').onclick=function(){show(cur+1)};
box.addEventListener('click',function(e){if(e.target===box)close()});
var sx=null;box.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});box.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)show(cur+(dx<0?1:-1));sx=null});
d.addEventListener('keydown',function(e){if(!box.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);});}
/* pas zdjec: przewijanie mysza (przeciaganie) */
[].forEach.call(d.querySelectorAll('.strip'),function(s){var down=false,x0=0,l0=0,moved=false;
s.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;x0=e.clientX;l0=s.scrollLeft;});
s.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>5)moved=true;s.scrollLeft=l0-dx;});
['pointerup','pointerleave'].forEach(function(t){s.addEventListener(t,function(){down=false})});
s.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);});
/* mapa Google po zgodzie, przy przewinieciu */
function ok(){try{return localStorage.getItem('zgoda')==='tak'}catch(e){return false}}
function maps(){[].forEach.call(d.querySelectorAll('[data-map]'),function(m){if(m.dataset.done)return;
var go=function(){m.dataset.done=1;m.innerHTML='<iframe title="Mapa Google" src="'+m.dataset.map+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';};
if(!ok())return;if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();go();}},{rootMargin:'300px'});io.observe(m);}else go();});}
[].forEach.call(d.querySelectorAll('[data-zgoda]'),function(el){el.addEventListener('click',function(){var v=el.getAttribute('data-zgoda');try{localStorage.setItem('zgoda',v)}catch(e){}var c=d.getElementById('cookies');if(c)c.hidden=true;if(v==='tak')maps();});});
maps();
/* formularz */
var f=d.getElementById('formularz');
if(f){var st=f.querySelector('.f-status'),t0=Date.now();f.querySelector('[name=t]').value=String(t0);
f.addEventListener('submit',function(e){e.preventDefault();if(!f.checkValidity()){f.reportValidity();return;}
if(f.dataset.demo){st.className='f-status ok';st.textContent='To podgląd strony - na docelowej stronie wiadomość trafi do fundacji.';return;}
var btn=f.querySelector('button[type=submit]');btn.disabled=true;st.className='f-status';st.textContent='Wysyłanie...';
fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}}).then(function(r){return r.json()}).then(function(j){
if(j.ok){f.reset();st.className='f-status ok';st.textContent='Dziękujemy, wiadomość została wysłana. Odpowiemy najszybciej, jak to możliwe.';}
else{st.className='f-status err';st.textContent=j.msg||'Nie udało się wysłać. Prosimy zadzwonić lub napisać e-mail.';}
btn.disabled=false;}).catch(function(){st.className='f-status err';st.textContent='Nie udało się wysłać. Prosimy zadzwonić lub napisać e-mail.';btn.disabled=false;});});}
})();