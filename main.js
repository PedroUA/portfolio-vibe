
(function () {
  'use strict';

    try {
    if (!sessionStorage.getItem('siteOpened')) {
      document.body.classList.add('initial-load');
      sessionStorage.setItem('siteOpened', 'true');
    }
  } catch (e) {

    document.body.classList.add('initial-load');
  }

    const photoWrapper = document.getElementById('photo-wrapper');

  if (photoWrapper) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const baseScale = 1.08;

    const animate = function () {

      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      photoWrapper.style.transform = 
        'translate(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px) scale(' + baseScale + ')';

      if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };

    const startLoop = function () {
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', function (e) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const nx = (e.clientX - width / 2) / (width / 2);
      const ny = (e.clientY - height / 2) / (height / 2);

      targetX = -nx * 14;
      targetY = -ny * 10;

      startLoop();
    });

    window.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      startLoop();
    });

    photoWrapper.style.transform = 'scale(' + baseScale + ')';
  }

    const infoBtn = document.getElementById('info-btn');
  const infoModal = document.getElementById('info-modal');
  const modalClose = document.getElementById('modal-close');

  if (infoBtn && infoModal && modalClose) {
    infoBtn.addEventListener('click', function () {
      infoModal.classList.add('active');
    });

    modalClose.addEventListener('click', function () {
      infoModal.classList.remove('active');
    });

    infoModal.addEventListener('click', function (e) {
      if (e.target === infoModal) {
        infoModal.classList.remove('active');
      }
    });
  }

    const openProjectModalBtn = document.getElementById('open-micropolariscope-modal');
  const triggerMedia = document.getElementById('trigger-micropolariscope-media');
  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const projectVideo = document.getElementById('project-video');

  const openProjectModal = function () {
    if (projectModal) {
      projectModal.classList.add('active');
      if (projectVideo) {
        projectVideo.currentTime = 0;
        const playPromise = projectVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            projectVideo.muted = true;
            projectVideo.play();
          });
        }
      }
    }
  };

  const closeProjectModal = function () {
    if (projectModal) {
      projectModal.classList.remove('active');
      if (projectVideo) {
        projectVideo.pause();
        projectVideo.currentTime = 0;
      }
    }
  };

  if (openProjectModalBtn) {
    openProjectModalBtn.addEventListener('click', openProjectModal);
  }

  if (triggerMedia) {
    triggerMedia.addEventListener('click', openProjectModal);
  }

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', function (e) {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (infoModal && infoModal.classList.contains('active')) {
        infoModal.classList.remove('active');
      }
      if (projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    }
  });

    const aboutNavLinks = document.querySelectorAll('a[href="about.html"]');
  let aboutImagesPreloaded = false;

  aboutNavLinks.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      if (!aboutImagesPreloaded) {
        aboutImagesPreloaded = true;
        ['assets/photo_about.webp', 'assets/photo_about3.webp'].forEach(function (src) {
          const img = new Image();
          img.src = src;
        });
      }
    }, { once: true });
  });

  const portfolioNavLinks = document.querySelectorAll('a[href="portfolio.html"]');
  let portfolioImagesPreloaded = false;

  portfolioNavLinks.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      if (!portfolioImagesPreloaded) {
        portfolioImagesPreloaded = true;
        [
          'assets/uiux_design_preview.webp',
          'assets/3d_modeling_preview.webp',
          'assets/game_design_preview.webp',
          'assets/sound_design_preview.webp'
        ].forEach(function (src) {
          const img = new Image();
          img.src = src;
        });
      }
    }, { once: true });
  });

    const catScrollContainer = document.querySelector('.cat-right-col');
  if (catScrollContainer) {
    catScrollContainer.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        catScrollContainer.scrollLeft += e.deltaY * 3;
      }
    }, { passive: false });

        let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    catScrollContainer.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX;
      scrollStart = catScrollContainer.scrollLeft;
      catScrollContainer.style.cursor = 'grabbing';
      catScrollContainer.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.pageX - startX;
      catScrollContainer.scrollLeft = scrollStart - dx;
    });

    window.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        catScrollContainer.style.cursor = '';
        catScrollContainer.style.userSelect = '';
      }
    });
  }

})();
