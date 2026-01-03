// ===== Footer year =====
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// ===== Projects modal (runs only on Projects page) =====
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("projectModal");
  if (!modal) return;

  const titleEl = document.getElementById("modalTitle");
  const metaEl = document.getElementById("modalMeta");
  const descEl = document.getElementById("modalDesc");
  const listEl = document.getElementById("modalList");
  const tagsEl = document.getElementById("modalTags");
  const heroImg = document.getElementById("modalHeroImg");
  const thumbs = document.getElementById("modalThumbs");

  const data = {
    p1: {
      title: "P1 Chassis & Product Development",
      meta: "Yatri Motorcycles",
      desc: "Chassis concept, DFM, suspension integration, and packaging.",
      bullets: [
        "Dual-cradle chassis concept for stiffness and battery protection",
        "Suspension integration for comfort and control",
        "Full-bike CAD for packaging and manufacturability"
      ],
      tags: ["CAD", "DFM", "Chassis"],
      images: ["/assets/images/projects/p1-bike.jpg", "/assets/images/projects/p1-chassis.jpg"]
    },

    rlda: {
      title: "Road Load Data Acquisition (RLDA)",
      meta: "Durability / Correlation",
      desc: "Road data acquisition and CAE correlation using instrumentation and testing.",
      bullets: [
        "Instrumentation: strain gauges, accelerometers, LVDTs",
        "Controlled tests + real-road data collection",
        "Processed data to improve model correlation"
      ],
      tags: ["Durability", "Sensors", "Data"],
      images: ["/assets/images/projects/rlda-daq.jpg", "/assets/images/projects/rlda-bump.jpg"]
    },

    daq: {
      title: "Data Acquisition System (DAQ)",
      meta: "Electronics / Instrumentation",
      desc: "Multi-channel data acquisition for strain, accel, and displacement signals.",
      bullets: [
        "Designed DAQ workflow for multi-channel acquisition",
        "ADC + microcontroller selection and implementation",
        "Validated stable logging for sensors and test runs"
      ],
      tags: ["DAQ", "ADC", "Embedded"],
      images: ["/assets/images/projects/daq-board.jpg"]
    },

    fatigue: {
      title: "Pneumatic Fatigue Test Rig",
      meta: "Rig / Durability",
      desc: "Accelerated component durability test rig with variable loading profiles.",
      bullets: [
        "Designed fatigue criteria and rig architecture",
        "Supported variable profiles and fixture adaptability",
        "Improved throughput for high-cycle testing"
      ],
      tags: ["Fatigue", "Pneumatics", "Fixtures"],
      images: ["/assets/images/projects/fatigue-rig.jpg"]
    },

    bump: {
      title: "Bump Rig",
      meta: "Vehicle Durability",
      desc: "Vehicle-level accelerated durability testing with controlled motion and load handling.",
      bullets: [
        "Controlled longitudinal and vertical translation motion",
        "Handled side loads using bearings and liners",
        "Configured weighted loading for real-use simulation"
      ],
      tags: ["Durability", "Loads", "Rig"],
      images: ["/assets/images/projects/bump-rig.jpg"]
    },

    fixture: {
      title: "Jigs & Fixtures",
      meta: "Manufacturing / Welding",
      desc: "Production welding fixtures to improve repeatability and dimensional control.",
      bullets: [
        "Designed fixtures for repeatability and manufacturability",
        "Built in Autodesk Inventor and fabricated in-house",
        "Improved dimensional control of welded assemblies"
      ],
      tags: ["Fixtures", "Welding", "Inventor"],
      images: ["/assets/images/projects/fixture.jpg"]
    }
  };

  function openModal(key) {
    const p = data[key];
    if (!p) {
      console.warn("No project data found for:", key);
      return;
    }

    titleEl.textContent = p.title;
    metaEl.textContent = p.meta;
    descEl.textContent = p.desc;

    listEl.innerHTML = "";
    p.bullets.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      listEl.appendChild(li);
    });

    tagsEl.innerHTML = "";
    p.tags.forEach((t) => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = t;
      tagsEl.appendChild(span);
    });

    const imgs = p.images || [];
    heroImg.src = imgs[0] || "";
    heroImg.alt = p.title;

    thumbs.innerHTML = "";
    imgs.forEach((src, i) => {
      const im = document.createElement("img");
      im.className = "modal-thumb" + (i === 0 ? " is-active" : "");
      im.src = src;
      im.alt = `${p.title} image ${i + 1}`;
      im.loading = "lazy";
      im.addEventListener("click", () => {
        heroImg.src = src;
        [...thumbs.querySelectorAll(".modal-thumb")].forEach((x) =>
          x.classList.remove("is-active")
        );
        im.classList.add("is-active");
      });
      thumbs.appendChild(im);
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-project]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.project));
  });

  modal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
});

// ===== EmailJS (runs only on Contact page) =====
// IMPORTANT:
// 1) Your contact page must include the EmailJS CDN script in <head>
//    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
// 2) Your form must be: <form id="contactForm" ...>
// 3) Your inputs must have name="" fields: from_name, reply_to, message
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const sent = document.getElementById("sent");
  const btn = document.getElementById("sendBtn");

  // ✅ Replace these with your EmailJS keys
  const PUBLIC_KEY = "PASTE_PUBLIC_KEY_HERE";
  const SERVICE_ID = "PASTE_SERVICE_ID_HERE";
  const TEMPLATE_ID = "PASTE_TEMPLATE_ID_HERE";

  // If EmailJS didn't load, show a helpful message
  if (typeof emailjs === "undefined") {
    if (sent) sent.textContent = "Email service not loaded (EmailJS missing).";
    console.error("EmailJS not found. Add the EmailJS CDN script in <head> of contact page.");
    return;
  }

  emailjs.init({ publicKey: PUBLIC_KEY });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (sent) sent.textContent = "Sending…";
    if (btn) btn.disabled = true;

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);

      if (sent) sent.textContent = "Message sent ✅";
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      if (sent) sent.textContent = "Failed to send ❌ Please try again.";
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});
