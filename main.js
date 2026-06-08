/* ============================================================
   main.js — Parallax, Scroll Snapping & Specialties Interactivity
   ============================================================ */

(function () {
  'use strict';

  const photo     = document.getElementById('photo-portrait');
  const photoCol  = document.getElementById('col-photo');
  const landing   = document.getElementById('sec-landing');

  if (!photo || !landing || !photoCol) return;

  /* ----------------------------------------------------------
     Parallax — the photo shifts opposite to the cursor
     ---------------------------------------------------------- */
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  // Smooth lerp loop for buttery motion
  function animate() {
    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;

    photo.style.transform =
      'translate(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px) scale(1.12)';

    // Keep running while there's noticeable motion
    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  landing.addEventListener('mousemove', function (e) {
    var rect = landing.getBoundingClientRect();

    // Normalise to  -1 … +1  (center = 0)
    var nx = (e.clientX - rect.left) / rect.width  * 2 - 1;
    var ny = (e.clientY - rect.top)  / rect.height * 2 - 1;

    // Max displacement ±10px (X) / ±7px (Y) — subtle and smooth
    targetX = -nx * 10;
    targetY = -ny * 7;

    startLoop();
  });

  landing.addEventListener('mouseleave', function () {
    targetX = 0;
    targetY = 0;
    startLoop();
  });

  // Base transition for filter only (transform handled by JS)
  photo.style.transition = 'filter 0.6s ease';
  // Scale up so the translate doesn't reveal edges
  photo.style.transform = 'scale(1.12)';

  /* ----------------------------------------------------------
     Dynamic Scroll snip / Vertical slide transitions
     ---------------------------------------------------------- */
  const wrapper = document.getElementById('sections-wrapper');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const secSpecialties = document.getElementById('sec-specialties');

  let currentSection = 0; // 0 = Landing, 1 = Specialties
  let isTransitioning = false;
  const totalSections = 2;
  const transitionDuration = 1000; // 1s matching CSS

  function goToSection(index) {
    if (isTransitioning || index < 0 || index >= totalSections) return;
    
    isTransitioning = true;
    currentSection = index;

    // Apply transform translateY to wrapper
    wrapper.style.transform = 'translateY(-' + (index * 100) + 'vh)';

    // Update section active classes
    if (index === 1) {
      secSpecialties.classList.add('active');
      landing.classList.remove('active');
    } else {
      landing.classList.add('active');
      secSpecialties.classList.remove('active');
    }

    setTimeout(function () {
      isTransitioning = false;
    }, transitionDuration);
  }

  // Handle scroll wheel
  window.addEventListener('wheel', function (e) {
    if (window.innerWidth <= 768) return; // Disable custom scroll on mobile
    if (Math.abs(e.deltaY) < 30) return; // Ignore small scroll bumps

    if (e.deltaY > 0) {
      goToSection(1);
    } else {
      goToSection(0);
    }
  }, { passive: true });

  // Handle click on Scroll Indicator
  if (scrollIndicator) {
    scrollIndicator.style.cursor = 'pointer';
    scrollIndicator.addEventListener('click', function () {
      goToSection(1);
    });
  }

  // Keyboard Navigation
  window.addEventListener('keydown', function (e) {
    if (window.innerWidth <= 768) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (currentSection === 0) {
        if (e.key !== ' ') e.preventDefault();
        goToSection(1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentSection === 1) {
        e.preventDefault();
        goToSection(0);
      }
    }
  });

  // Touch swipe detection
  let touchStartY = 0;
  window.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', function (e) {
    if (window.innerWidth <= 768) return;

    let touchEndY = e.changedTouches[0].clientY;
    let diffY = touchStartY - touchEndY;

    if (Math.abs(diffY) > 50) {
      if (diffY > 0) {
        goToSection(1);
      } else {
        goToSection(0);
      }
    }
  }, { passive: true });
})();
