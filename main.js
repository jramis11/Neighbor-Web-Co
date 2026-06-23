/* ============================================================
   NEIGHBOR WEB CO. — v2 shared scripts
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Header: glass on scroll + hide on scroll-down ---------- */
  const header = document.getElementById("siteHeader");
  if (header) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 24);
      if (y > 400 && y > lastY + 6) header.classList.add("hidden");
      else if (y < lastY - 6 || y < 400) header.classList.remove("hidden");
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Testimonial slider ---------- */
  const slider = document.getElementById("testimonialSlider");
  if (slider) {
    const track = slider.querySelector(".slider-track");
    const slides = track.children.length;
    const dotsWrap = slider.querySelector(".slider-dots");
    let index = 0;
    let timer;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.children;

    function go(i, manual) {
      index = (i + slides) % slides;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      Array.from(dots).forEach((d, j) => d.classList.toggle("active", j === index));
      if (manual) restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), 6000);
    }
    slider.querySelector("[data-prev]").addEventListener("click", () => go(index - 1, true));
    slider.querySelector("[data-next]").addEventListener("click", () => go(index + 1, true));
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", restart);
    go(0);
    restart();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      item.closest(".faq-list").querySelectorAll(".faq-item.open").forEach((o) => {
        o.classList.remove("open");
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Portfolio filters ---------- */
  const filterBar = document.getElementById("filterBar");
  if (filterBar) {
    const cards = document.querySelectorAll(".portfolio-grid .portfolio-card");
    filterBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;
      filterBar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      cards.forEach((card) => {
        card.classList.toggle("hide", f !== "all" && card.dataset.category !== f);
      });
    });
  }

  /* ---------- Multi-step form ---------- */
  const msForm = document.getElementById("reviewForm");
  if (msForm && msForm.querySelector(".form-step")) {
    const steps = Array.from(msForm.querySelectorAll(".form-step"));
    const stepperSteps = Array.from(document.querySelectorAll(".stepper .step"));
    const stepperLines = Array.from(document.querySelectorAll(".stepper .step-line"));
    let current = 0;

    function show(i) {
      steps.forEach((s, j) => s.classList.toggle("active", j === i));
      stepperSteps.forEach((s, j) => {
        s.classList.toggle("active", j === i);
        s.classList.toggle("done", j < i);
      });
      stepperLines.forEach((l, j) => l.classList.toggle("done", j < i));
      current = i;
    }

    function validateStep(i) {
      let ok = true;
      steps[i].querySelectorAll("input[required], textarea[required]").forEach((field) => {
        const row = field.closest(".form-row");
        const bad =
          !field.value.trim() ||
          (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        row.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      return ok;
    }

    msForm.addEventListener("click", (e) => {
      if (e.target.matches("[data-next-step]")) {
        if (validateStep(current)) show(current + 1);
      } else if (e.target.matches("[data-prev-step]")) {
        show(current - 1);
      }
    });

    msForm.addEventListener("input", (e) => {
      const row = e.target.closest(".form-row");
      if (row) row.classList.remove("invalid");
    });

    msForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateStep(current)) return;

      const submitBtn = msForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(msForm))),
        });
        const json = await res.json();
        if (json.success) {
          msForm.querySelector(".form-steps-wrap").hidden = true;
          const stepper = document.querySelector(".stepper");
          if (stepper) stepper.hidden = true;
          msForm.querySelector(".form-success").hidden = false;
          msForm.querySelector(".form-success").scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          throw new Error(json.message || "Submission failed");
        }
      } catch {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        alert("Something went wrong — please try again or email us at hello@neighborwebco.com.");
      }
    });
  }

  /* ---------- Simple forms (non-stepped) ---------- */
  document.querySelectorAll("form[data-simple-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll("input[required], textarea[required]").forEach((field) => {
        const row = field.closest(".form-row");
        const bad =
          !field.value.trim() ||
          (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        row.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      form.querySelectorAll(".form-row, button[type=submit], .form-tiny").forEach((el) => (el.hidden = true));
      form.querySelector(".form-success").hidden = false;
    });
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 700);
    }, { passive: true });
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
