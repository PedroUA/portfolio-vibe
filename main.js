/* ============================================================
   main.js — Parallax Interactive Effect & Page Session Tracking
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Session Tracking — Entrance animation ONLY on first visit
     ---------------------------------------------------------- */
  try {
    if (!sessionStorage.getItem('siteOpened')) {
      document.body.classList.add('initial-load');
      sessionStorage.setItem('siteOpened', 'true');
    }
  } catch (e) {
    // Fallback if sessionStorage is restricted
    document.body.classList.add('initial-load');
  }

  const photoWrapper = document.getElementById('photo-wrapper');

  if (!photoWrapper) return;

  /* ----------------------------------------------------------
     Smooth Parallax Loop — Photo displacement on cursor move
     ---------------------------------------------------------- */
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  // Base transform setting with scale to prevent edge clipping during translation
  const baseScale = 1.08;

  function animate() {
    // Lerp formula for smooth momentum movement
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    photoWrapper.style.transform = 
      'translate(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px) scale(' + baseScale + ')';

    // Continue loop while motion is active
    if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  }

  // Mousemove listener across container for smooth tracking
  window.addEventListener('mousemove', function (e) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Normalise cursor offset from screen center (-1 to +1)
    const nx = (e.clientX - width / 2) / (width / 2);
    const ny = (e.clientY - height / 2) / (height / 2);

    // Max displacement ±14px (X) / ±10px (Y)
    targetX = -nx * 14;
    targetY = -ny * 10;

    startLoop();
  });

  // Reset to center on mouse leave
  window.addEventListener('mouseleave', function () {
    targetX = 0;
    targetY = 0;
    startLoop();
  });

  // Initial transform setup
  photoWrapper.style.transform = 'scale(' + baseScale + ')';

})();
