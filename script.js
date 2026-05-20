(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  const hasScrollTrigger = hasGsap && typeof window.ScrollTrigger !== "undefined";

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const navbar = qs("#navbar");
  const hamburger = qs("#hamburger");
  const mobileMenu = qs("#mobile-menu");
  const mobileLinks = qsa(".mobile-link");
  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const setNavbarState = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 24);
  };

  const closeMobileMenu = () => {
    hamburger?.classList.remove("open");
    mobileMenu?.classList.remove("open");
    document.body.style.overflow = "";
  };

  const openMobileMenu = () => {
    hamburger?.classList.add("open");
    mobileMenu?.classList.add("open");
    document.body.style.overflow = "hidden";

    if (hasGsap && !prefersReducedMotion) {
      gsap.fromTo(
        ".mobile-menu li",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power3.out" }
      );
    }
  };

  const initNavigation = () => {
    setNavbarState();
    window.addEventListener("scroll", setNavbarState, { passive: true });

    hamburger?.addEventListener("click", () => {
      mobileMenu?.classList.contains("open") ? closeMobileMenu() : openMobileMenu();
    });

    [...qsa('a[href^="#"]'), ...mobileLinks].forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = qs(link.getAttribute("href"));
        if (!target) return;

        event.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      });
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });
  };

  const initHeroAnimation = () => {
    if (!hasGsap || prefersReducedMotion) return;

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
      .from(".navbar", { y: -24, opacity: 0, duration: 0.8 })
      .from(".hero-tag", { y: 22, opacity: 0, duration: 0.65 }, "-=0.35")
      .from(".hero-title span", { yPercent: 105, opacity: 0, duration: 0.95, stagger: 0.12 }, "-=0.25")
      .from(".hero-subtitle", { y: 22, opacity: 0, duration: 0.75 }, "-=0.45")
      .from(".hero-cta-group a", { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.35")
      .from(".hero-photo", { x: 44, opacity: 0, scale: 0.94, duration: 1.05 }, "-=0.85")
      .from(".photo-badge", { y: 18, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".scroll-indicator", { opacity: 0, y: 12, duration: 0.45 }, "-=0.2");

    gsap.to(".hero-bg-text", {
      xPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(".hero-photo", {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2
      }
    });
  };

  const initScrollReveals = () => {
    if (!hasGsap || !hasScrollTrigger || prefersReducedMotion) {
      qsa(".gsap-fade-up, .gsap-fade-left, .gsap-fade-right, .gsap-scale-in").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return;
    }

    qsa(".section-label, .section-title, .section-intro, .body-text").forEach((element) => {
      gsap.from(element, {
        y: 32,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          toggleActions: "play none none reverse"
        }
      });
    });

    const revealGroups = [
      [".skill-card", 0.08],
      [".gallery-item", 0.08],
      [".photo-story", 0.08],
      [".project-card", 0.12],
      [".timeline-item", 0.1]
    ];

    revealGroups.forEach(([selector, stagger]) => {
      const items = qsa(selector);
      if (!items.length) return;

      gsap.from(items, {
        y: 42,
        opacity: 0,
        duration: 0.75,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: "top 78%",
          toggleActions: "play none none reverse"
        }
      });
    });

    gsap.from(".sobre-visual", {
      x: 50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".sobre-visual",
        start: "top 78%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".contact-links", {
      y: 18,
      opacity: 0,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".contact-links",
        start: "top 84%",
        toggleActions: "play none none reverse"
      }
    });

    qsa(".section-stars span, .photo-deco-star, .label-star, .tag-star").forEach((star, index) => {
      gsap.to(star, {
        rotate: index % 2 ? -24 : 24,
        scale: 1.18,
        duration: 2.4 + index * 0.08,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  };

  const initCounters = () => {
    const numbers = qsa(".stat-number");
    if (!numbers.length) return;

    numbers.forEach((number) => {
      const rawValue = number.textContent.trim();
      const target = parseFloat(rawValue);
      const suffix = rawValue.replace(/[0-9.]/g, "");

      if (!Number.isFinite(target)) return;

      if (!hasGsap || !hasScrollTrigger || prefersReducedMotion) {
        number.textContent = rawValue;
        return;
      }

      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: number,
          start: "top 86%",
          once: true
        },
        onUpdate: () => {
          number.textContent = `${Math.round(counter.value)}${suffix}`;
        }
      });
    });
  };

  const initMagneticElements = () => {
    if (!hasGsap || prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;

    qsa(".btn-primary, .btn-ghost, .project-card, .skill-card").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          x: x * 0.025,
          y: y * 0.04,
          duration: 0.35,
          ease: "power3.out"
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.45)" });
      });
    });
  };

  const initProjectInteractions = () => {
    if (!hasGsap || prefersReducedMotion) return;

    qsa(".project-card").forEach((card) => {
      const image = qs(".project-img-placeholder", card);
      const number = qs(".proj-num", card);

      card.addEventListener("mouseenter", () => {
        gsap.to(image, { scale: 1.04, duration: 0.55, ease: "power3.out" });
        if (number) {
          gsap.to(number, { scale: 1.12, opacity: 0.38, duration: 0.45, ease: "power3.out" });
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(image, { scale: 1, duration: 0.55, ease: "power3.out" });
        if (number) {
          gsap.to(number, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" });
        }
      });
    });
  };

  const initGallery = () => {
    const track = qs("[data-gallery-track]");
    const prev = qs("[data-gallery-prev]");
    const next = qs("[data-gallery-next]");

    if (!track || !prev || !next) return;

    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.innerHTML = `
      <div class="image-lightbox-inner" role="dialog" aria-modal="true" aria-label="Vista ampliada de imagen">
        <button class="lightbox-close" type="button" aria-label="Cerrar imagen">×</button>
        <img src="" alt="" />
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = qs("img", lightbox);
    const lightboxClose = qs(".lightbox-close", lightbox);
    let startPointerX = 0;
    let lastPointerX = 0;
    let didDrag = false;
    let openedFromPointer = false;

    const openLightbox = (image) => {
      lightboxImg.src = image.currentSrc || image.src;
      lightboxImg.alt = image.alt || "Imagen ampliada";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      window.setTimeout(() => {
        if (!lightbox.classList.contains("open")) lightboxImg.src = "";
      }, 280);
    };

    const getStep = () => {
      const item = qs(".gallery-item", track);
      if (!item) return track.clientWidth * 0.8;
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || 0);
      return item.getBoundingClientRect().width + gap;
    };

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -getStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: getStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    qsa(".gallery-item img", track).forEach((image) => {
      image.draggable = false;
    });

    track.addEventListener("click", (event) => {
      if (openedFromPointer) {
        openedFromPointer = false;
        return;
      }
      const item = event.target.closest(".gallery-item");
      const image = item ? qs("img", item) : null;
      if (!image || didDrag) return;
      openLightbox(image);
    });

    const getImageAtPoint = (event) => {
      const element = document.elementFromPoint(event.clientX, event.clientY);
      const item = element?.closest?.(".gallery-item");
      return item && track.contains(item) ? qs("img", item) : null;
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });

    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      startPointerX = event.clientX;
      lastPointerX = event.clientX;
      didDrag = false;
      track.classList.add("dragging");
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener("pointermove", (event) => {
      if (!track.classList.contains("dragging")) return;
      const delta = event.clientX - lastPointerX;
      if (Math.abs(event.clientX - startPointerX) > 12) {
        didDrag = true;
        event.preventDefault();
      }
      track.scrollLeft -= delta;
      lastPointerX = event.clientX;
    });

    const stopDrag = (event) => {
      if (!track.classList.contains("dragging")) return;
      const image = !didDrag ? getImageAtPoint(event) : null;
      track.classList.remove("dragging");
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      if (image) {
        openedFromPointer = true;
        openLightbox(image);
      }
      window.setTimeout(() => {
        didDrag = false;
      }, 160);
    };

    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
  };

  const initKeyboardFocus = () => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Tab") document.body.classList.add("using-keyboard");
    });

    window.addEventListener("mousedown", () => {
      document.body.classList.remove("using-keyboard");
    });
  };

  window.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initHeroAnimation();
    initScrollReveals();
    initCounters();
    initMagneticElements();
    initProjectInteractions();
    initGallery();
    initKeyboardFocus();
  });
})();
