/**
 * Template Name: Abhinav
* Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  let globalListenersBound = false;

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectBody || !selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    if (window.scrollY > 100) {
      selectBody.classList.add('scrolled');
    } else {
      selectBody.classList.remove('scrolled');
    }
  }

  /**
   * Mobile nav toggle
   */
  function mobileNavToogle() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (!mobileNavToggleBtn) return;
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  /**
   * Preloader
   */
  function removePreloader() {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      preloader.remove();
    }
  }

  /**
   * Scroll top button
   */
  function toggleScrollTop() {
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      if (window.scrollY > 100) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    }
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      if (swiperElement.dataset.initialized === 'true') return;
      const configElement = swiperElement.querySelector(".swiper-config");
      if (!configElement) return;
      let config = JSON.parse(
        configElement.innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab") && typeof initSwiperWithCustomPagination === 'function') {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
      swiperElement.dataset.initialized = 'true';
    });
  }

  function bindGlobalListeners() {
    if (globalListenersBound) return;
    globalListenersBound = true;

    document.addEventListener('scroll', toggleScrolled);
    document.addEventListener('scroll', toggleScrollTop);
    window.addEventListener('load', function() {
      toggleScrolled();
      removePreloader();
      toggleScrollTop();
      aosInit();
      initSwiper();
    });
  }

  function initLegacySite() {
    bindGlobalListeners();
    toggleScrolled();
    removePreloader();
    toggleScrollTop();
    aosInit();
    initSwiper();

    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleBtn && mobileNavToggleBtn.dataset.bound !== 'true') {
      mobileNavToggleBtn.dataset.bound = 'true';
      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
    }

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      if (navmenu.dataset.bound === 'true') return;
      navmenu.dataset.bound = 'true';
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });

    });

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      if (navmenu.dataset.bound === 'true') return;
      navmenu.dataset.bound = 'true';
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    /**
     * Scroll top button
     */
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop && scrollTop.dataset.bound !== 'true') {
      scrollTop.dataset.bound = 'true';
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    /**
     * Animate the skills items on reveal
     */
    let skillsAnimation = document.querySelectorAll('.skills-animation');
    skillsAnimation.forEach((item) => {
      if (item.dataset.bound === 'true') return;
      item.dataset.bound = 'true';

      if (typeof Waypoint === 'undefined') {
        item.querySelectorAll('.progress .progress-bar').forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
        return;
      }

      new Waypoint({
        element: item,
        offset: '80%',
        handler: function() {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    });

    /**
     * Initiate Pure Counter
     */
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }

    /**
     * Initiate glightbox
     */
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox'
      });
    }

    /**
     * Init isotope layout and filters
     */
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      const isotopeContainer = isotopeItem.querySelector('.isotope-container');

      if (isotopeContainer && typeof imagesLoaded !== 'undefined' && typeof Isotope !== 'undefined') {
        imagesLoaded(isotopeContainer, function() {
          initIsotope = new Isotope(isotopeContainer, {
            itemSelector: '.isotope-item',
            layoutMode: layout,
            filter: filter,
            sortBy: sort
          });
          isotopeItem.legacyIsotope = initIsotope;
        });
      }

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
        if (filters.dataset.bound === 'true') return;
        filters.dataset.bound = 'true';
        filters.addEventListener('click', function() {
          const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
          if (activeFilter) {
            activeFilter.classList.remove('filter-active');
          }
          this.classList.add('filter-active');
          const isotopeInstance = isotopeItem.legacyIsotope ?? initIsotope;
          if (isotopeInstance) {
            isotopeInstance.arrange({
              filter: this.getAttribute('data-filter')
            });
          }
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });

    });
  }

  window.initLegacySite = initLegacySite;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLegacySite);
  } else {
    initLegacySite();
  }

})();
