document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle icon
            navToggle.firstElementChild.classList.toggle('fa-bars');
            navToggle.firstElementChild.classList.toggle('fa-times');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.firstElementChild.classList.remove('fa-times');
                navToggle.firstElementChild.classList.add('fa-bars');
            }
        });
    });

    // --- Scroll-Reveal Animations ---
    const sections = document.querySelectorAll('.section');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after it's visible
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15, // 15% of the section must be visible
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    (function () {
    const viewport = document.querySelector('.endorse-viewport');
    const track = document.querySelector('.endorse-track');
    const cards = [...document.querySelectorAll('.endorsement-card')];
    const prev = document.querySelector('.endorse-nav.prev');
    const next = document.querySelector('.endorse-nav.next');

    function getCardWidth() {
      // width + gap
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 0);
      return cards[0].getBoundingClientRect().width + gap;
    }

    function snapToClosest() {
      const vw = viewport.getBoundingClientRect();
      let best = { card: null, dist: Infinity };
      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const centerDist = Math.abs((r.left + r.width / 2) - (vw.left + vw.width / 2));
        if (centerDist < best.dist) best = { card, dist: centerDist };
      });
      cards.forEach(c => c.classList.remove('is-active'));
      if (best.card) best.card.classList.add('is-active');
    }

    function scrollByOne(dir) {
      viewport.scrollBy({ left: dir * getCardWidth(), behavior: 'smooth' });
    }

    // Init
    snapToClosest();
    viewport.addEventListener('scroll', () => {
      // throttle with rAF for performance
      if (viewport._ticking) return;
      viewport._ticking = true;
      requestAnimationFrame(() => { snapToClosest(); viewport._ticking = false; });
    });
    prev.addEventListener('click', () => scrollByOne(-1));
    next.addEventListener('click', () => scrollByOne(1));

    // Recalculate on resize
    window.addEventListener('resize', () => snapToClosest());
  })();
  

  fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ktharankumar')
  .then(res => res.json())
  .then(data => {
    const posts = data.items.slice(0, 3); // latest 3 posts
    const container = document.getElementById('medium-posts');
    posts.forEach(post => {
      const div = document.createElement('div');
      div.className = 'blog-card';
      div.innerHTML = `
        <h3><a href="${post.link}" target="_blank">${post.title}</a></h3>
        <p>${post.description.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
      `;
      container.appendChild(div);
    });
  });

});