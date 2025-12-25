
// ===== Smooth scroll =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===== Mobile nav =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu on link click (mobile)
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!target) return;
    const clickedInside = navLinks.contains(target) || navToggle.contains(target);
    if (!clickedInside) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ===== Contact form =====
// 1) Create a Formspree form to get an endpoint like: https://formspree.io/f/xxxxxxx
// 2) Paste it here. If blank, we fall back to mailto.
const FORMSPREE_ENDPOINT = "";

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

function setNote(msg) {
  if (formNote) formNote.textContent = msg;
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      setNote("Please fill out all fields.");
      return;
    }

    // If Formspree configured, use it
    if (FORMSPREE_ENDPOINT) {
      try {
        setNote("Sending…");
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: data,
        });

        if (res.ok) {
          contactForm.reset();
          setNote("Sent! I’ll get back to you soon.");
        } else {
          setNote("Could not send via form. Opening email instead…");
          openMailto(name, email, message);
        }
      } catch (err) {
        setNote("Network issue. Opening email instead…");
        openMailto(name, email, message);
      }
      return;
    }

    // Otherwise mailto fallback
    openMailto(name, email, message);
  });
}

function openMailto(name, email, message) {
  const subject = encodeURIComponent(`Portfolio inquiry — ${name}`);
  const body = encodeURIComponent(
    `Hi Bikash,\n\n${message}\n\n— ${name}\n${email}`
  );
  window.location.href = `mailto:bmehta@siue.edu?subject=${subject}&body=${body}`;
  setNote("Opened your email app (mailto).");
}

// ===== Gallery (optional) =====
// Drop images into: assets/images/projects/
// Then add filenames below (example: "rlda.jpg").
const GALLERY_IMAGES = [
  // "rlda.jpg",
  // "daq.jpg",
  // "fatigue-rig.jpg",
  // "bump-rig.jpg",
];

const galleryGrid = document.getElementById("galleryGrid");

function renderGallery() {
  if (!galleryGrid) return;

  if (!GALLERY_IMAGES.length) {
    galleryGrid.innerHTML = `
      <div class="card island" style="grid-column: 1 / -1;">
        <div style="padding: 16px 18px;">
          <p class="muted" style="margin:0;">
            No images added yet. Add image files to <code>assets/images/projects/</code>
            and list them in <code>GALLERY_IMAGES</code> inside <code>script.js</code>.
          </p>
        </div>
      </div>
    `;
    return;
  }

  galleryGrid.innerHTML = GALLERY_IMAGES.map((file) => {
    const src = `assets/images/projects/${file}`;
    return `
      <button class="thumb" type="button" data-src="${src}" aria-label="Open image">
        <img src="${src}" alt="Project image" loading="lazy" />
      </button>
    `;
  }).join("");

  galleryGrid.querySelectorAll(".thumb").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn.dataset.src));
  });
}

renderGallery();

// ===== Lightbox =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImg) lightboxImg.src = "";
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}
