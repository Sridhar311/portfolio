// Smooth scroll to the Projects section when the button is clicked
document.addEventListener("DOMContentLoaded", () => {
  const viewProjectsBtn = document.getElementById("view-projects");
  const projectsSection = document.getElementById("projects");

  if (viewProjectsBtn && projectsSection) {
    viewProjectsBtn.addEventListener("click", () => {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Basic contact form validation
  const contactForm = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-status");

  if (contactForm && statusEl) {
    const fields = {
      name: document.getElementById("contact-name"),
      email: document.getElementById("contact-email"),
      message: document.getElementById("contact-message"),
    };

    const getErrorElement = (inputId) =>
      contactForm.querySelector(`[data-error-for="${inputId}"]`);

    const validateEmail = (value) => {
      const trimmed = value.trim();
      if (!trimmed) return "Email is required.";
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(trimmed)) return "Please enter a valid email address.";
      return "";
    };

    const validateField = (fieldName) => {
      const input = fields[fieldName];
      if (!input) return "";

      let errorMessage = "";
      const value = input.value.trim();

      if (!value) {
        errorMessage = "This field is required.";
      } else if (fieldName === "email") {
        errorMessage = validateEmail(value);
      }

      const errorEl = getErrorElement(input.id);
      if (errorEl) {
        errorEl.textContent = errorMessage;
      }

      if (errorMessage) {
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }

      return errorMessage;
    };

    Object.values(fields).forEach((input) => {
      if (!input) return;
      input.addEventListener("blur", () => validateField(input.name));
      input.addEventListener("input", () => {
        // clear status as user edits
        statusEl.textContent = "";
        statusEl.classList.remove("success", "error");
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const errors = [
        validateField("name"),
        validateField("email"),
        validateField("message"),
      ].filter(Boolean);

      if (errors.length > 0) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");
        return;
      }

      // At this point, you can integrate with a backend or email service.
      // For now, we just simulate a successful submission.
      statusEl.textContent = "Thank you! Your message has been sent.";
      statusEl.classList.remove("error");
      statusEl.classList.add("success");
      contactForm.reset();
      Object.values(fields).forEach((input) => input && input.classList.remove("error"));
      contactForm
        .querySelectorAll(".field-error")
        .forEach((el) => (el.textContent = ""));
    });
  }

  // Navbar toggle for mobile
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href") || "";
      if (targetId.startsWith("#")) {
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // Close mobile menu after navigation
      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // Highlight active nav link based on scroll position
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const linkMap = new Map();
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        linkMap.set(href.slice(1), link);
      }
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const activeLink = linkMap.get(id);
          if (!activeLink) return;

          navLinks.forEach((link) => {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
          });
          activeLink.classList.add("is-active");
          activeLink.setAttribute("aria-current", "page");
        });
      },
      {
        threshold: 0.4,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Section reveal animations
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("reveal-visible"));
  }
});
