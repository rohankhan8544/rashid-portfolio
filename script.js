const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  const revealItems = document.querySelectorAll(".hero > div, .stats > div, section h2, .about > div, .grid9 .card, .job, .ed, .brands span, .cs, .sk > .card, .ty > div, .ty > img");
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    if (item.matches(".stats > div, .brands span, .grid9 .card")) {
      item.style.setProperty("--reveal-delay", `${(index % 5) * 65}ms`);
    }
  });

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const navSections = [...document.querySelectorAll('nav a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(({ section }) => section);

  let scrollFrame = 0;
  const updateScrollProgress = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progressValue = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progress.style.transform = `scaleX(${progressValue})`;
      const activeSection = navSections
        .filter(({ section }) => section.getBoundingClientRect().top <= window.innerHeight * 0.35)
        .pop();
      navSections.forEach(({ link, section }) => {
        const isCurrent = activeSection && activeSection.section === section;
        link.classList.toggle("is-current", Boolean(isCurrent));
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      scrollFrame = 0;
    });
  };
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let pointerFrame = 0;
    window.addEventListener("pointermove", (event) => {
      const { clientX, clientY } = event;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${clientY}px`);
        pointerFrame = 0;
      });
    }, { passive: true });
  }

  requestAnimationFrame(() => document.body.classList.add("is-loaded"));
