(() => {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.querySelectorAll('a[href^="#"].nav-link, .side-link');
  const yearEl = document.getElementById('year');
  const mobile = () => window.innerWidth <= 760;
  let sidebarOpen = !mobile();

  // Set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Hide sidebar on mobile initially
  if (mobile()) { sidebar.classList.add('hidden'); sidebarOpen = false; }

  // SIDEBAR TOGGLE & OUTSIDE CLICK
  menuBtn.addEventListener('click', (e) => {
    sidebar.classList.toggle('hidden');
    sidebarOpen = !sidebar.classList.contains('hidden');
    e.stopPropagation();
  });

  const sideLinks = document.querySelectorAll('.side-link');
  sideLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.add('hidden');
      sidebarOpen = false;
    });
  });

  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      sidebar.classList.add('hidden');
      sidebarOpen = false;
    }
  });

  sidebar.addEventListener('click', (e) => { e.stopPropagation(); });

  // SMOOTH SCROLL
  const smoothScroll = (e) => {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (mobile()) { sidebar.classList.add('hidden'); sidebarOpen = false; }
  };
  navLinks.forEach(n => n.addEventListener('click', smoothScroll));

  // SCROLL HIDE SIDEBAR & ACTIVE LINK
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    if(cur > lastScroll + 10) { sidebar.style.transform='translateX(-280px)'; sidebar.style.opacity='0'; }
    else if(cur < lastScroll - 10) { sidebar.style.transform=''; sidebar.style.opacity=''; }
    lastScroll = cur;
    if(mobile() && sidebarOpen){ sidebar.classList.add('hidden'); sidebarOpen=false; }
    highlightActiveLink();
  }, { passive:true });

  function highlightActiveLink(){
    const fromTop = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(sec => {
      const id = sec.id;
      const link = document.querySelector(`a[href="#${id}"]`);
      if(!link) return;
      if(fromTop >= sec.offsetTop && fromTop < sec.offsetTop + sec.offsetHeight){ link.classList.add('active'); }
      else { link.classList.remove('active'); }
    });
  }
  highlightActiveLink();

  // ABOUT CAROUSEL
  function AboutCarousel(rootId){
    const root = document.getElementById(rootId);
    if(!root) return;
    const slidesContainer = root.querySelector('.slides');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const dotsEl = root.querySelector('#aboutDots');
    let idx=0, total=slides.length;

    const dots=[];
    for(let i=0;i<total;i++){
      const b=document.createElement('button');
      b.addEventListener('click',()=>go(i));
      dotsEl.appendChild(b); dots.push(b);
    }

    function update(){ slidesContainer.style.transform=`translateX(-${idx*100}%)`; dots.forEach((d,i)=>d.classList.toggle('active',i===idx)); }
    function go(i){ idx=(i+total)%total; update(); resetTimer(); }

    next && next.addEventListener('click',()=>go(idx+1));
    prev && prev.addEventListener('click',()=>go(idx-1));

    let timer=setInterval(()=>go(idx+1),4000);
    function resetTimer(){ clearInterval(timer); timer=setInterval(()=>go(idx+1),4000); }
    update();
  }
  AboutCarousel('aboutCarousel');

  window.addEventListener('resize', ()=>{
    if(!mobile()){ sidebar.classList.remove('hidden'); sidebarOpen=true; sidebar.style.transform=''; sidebar.style.opacity=''; }
    else{ if(!sidebarOpen) sidebar.classList.add('hidden'); }
  });
})();