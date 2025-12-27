// Auto-update year in footer
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// Contact form: mailto fallback (no backend required)
function mailtoFallback(e) {
  e.preventDefault();

  const name = document.getElementById("name")?.value?.trim() || "";
  const email = document.getElementById("email")?.value?.trim() || "";
  const msg = document.getElementById("msg")?.value?.trim() || "";

  const sent = document.getElementById("sent");
  if (sent) sent.textContent = "Opening your email app…";

  // ✅ Change this to your real email
  const to = "your.email@example.com";

  const subject = encodeURIComponent(`Portfolio message from ${name || "Visitor"}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n`
  );

  // Open mail client
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

  // Optional: clear form + better feedback
  setTimeout(() => {
    if (e.target && typeof e.target.reset === "function") e.target.reset();
    if (sent) sent.textContent = "Draft created — hit send in your email app.";
  }, 700);

  return false;
}
// ===== Projects modal (runs only on /projects/) =====
(() => {
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
      meta: "Yatri Motorcycles • Project owner & team lead • 06/2021 – 12/2022",
      desc:
        "Designed the motorbike chassis and supporting architecture with DFM and reliability in mind, focusing on maneuverability and battery protection.",
      bullets: [
        "Designed a dual-cradle chassis concept to protect the battery and improve stiffness.",
        "Aligned suspension integration approach for comfort and control (telescopic forks + twin rear shocks).",
        "Built CAD models for full bike, chassis, and panels to support packaging and manufacturability."
      ],
      tags: ["CAD", "Chassis", "DFM", "Packaging"],
      images: [
        "/assets/images/projects/p1-bike.jpg",
        "/assets/images/projects/p1-chassis.jpg"
      ]
    },

    rlda: {
      title: "Road Load Data Acquisition (RLDA)",
      meta: "Yatri Motorcycles • Project owner & team lead • 06/2022 – 04/2023",
      desc:
        "Durability program to collect and process road data, correlate to CAE, and validate durability performance using sensors and controlled testing.",
      bullets: [
        "Instrumented vehicle with strain gauges, accelerometers, and LVDTs for correlation runs.",
        "Ran controlled tests before road testing; then collected real-road damage data.",
        "Processed and filtered acquired data to fine-tune MBD/FEA models; achieved >90% correlation in initial trials."
      ],
      tags: ["Durability", "Correlation", "Sensors", "Data Processing"],
      images: [
        "/assets/images/projects/rlda-daq.jpg",
        "/assets/images/projects/rlda-bump.jpg"
      ]
    },

    daq: {
      title: "Data Acquisition System (DAQ)",
      meta: "Yatri Motorcycles • Project owner • 06/2021 – 02/2023",
      desc:
        "Built a high-speed, low-noise DAQ workflow to acquire multi-channel analog signals for durability testing and validation.",
      bullets: [
        "Targeted high-speed acquisition (48,000 datapoints/sec) and low-noise analog capture.",
        "Selected ADC + microcontroller and wrote a library based on datasheets; implemented SD logging and performance-focused code.",
        "Validated multi-channel data capture: 16-channel differential analog + accelerometers + LVDTs."
      ],
      tags: ["DAQ", "ADC", "Signal", "Embedded"],
      images: [
        "/assets/images/projects/daq-board.jpg"
      ]
    },

    fatigue: {
      title: "Pneumatic Fatigue Test Rig",
      meta: "Yatri Motorcycles • Project owner & team lead • 12/2020 – 12/2021",
      desc:
        "Designed and developed a pneumatic fatigue rig for accelerated component-level durability testing with variable profiles.",
      bullets: [
        "Created fatigue criteria and rig design from scratch with limited prior pneumatics exposure.",
        "Enabled accelerated tests for front frame, swingarm, and components.",
        "Improved throughput: up to a million cycles in <1 week with variable profiles; supports multiple independent tests."
      ],
      tags: ["Fatigue", "Pneumatics", "Fixtures", "Durability"],
      images: [
        "/assets/images/projects/fatigue-rig.jpg"
      ]
    },

    bump: {
      title: "Bump Rig",
      meta: "Yatri Motorcycles • Project owner & team lead • 02/2021 – 06/2022",
      desc:
        "Vehicle-level accelerated durability testing rig designed to allow free motion while controlling loads and preventing side-load issues.",
      bullets: [
        "Designed the rig to allow longitudinal and vertical translation motion.",
        "Vehicle retention approach used large bearings and liners to handle side forces if the vehicle sways.",
        "Configured weighted loading to simulate rider + pillion and accelerate road load accumulation."
      ],
      tags: ["Rig Design", "Durability", "Loads", "Mechanisms"],
      images: [
        "/assets/images/projects/bump-rig.jpg"
      ]
    },

    fixture: {
      title: "Jigs & Fixtures",
      meta: "Yatri Motorcycles • Project owner & team lead • 08/2021 – 05/2022",
      desc:
        "Production-ready welding fixtures to improve repeatability and manufacturing quality for chassis builds.",
      bullets: [
        "Designed fixtures from requirements (repeatability first) and improved manufacturability of both jigs and chassis.",
        "Designed in Autodesk Inventor; fixtures manufactured in-house.",
        "Achieved ±1 mm tolerance on manually welded chassis with a rotatable weld table workflow."
      ],
      tags: ["Fixtures", "Welding", "Inventor", "Tolerance"],
      images: [
        "/assets/images/projects/fixture.jpg"
      ]
    }
  };

  function openModal(key) {
    const p = data[key];
    if (!p) return;

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

    // images
    const imgs = p.images || [];
    heroImg.src = imgs[0] || "";
    heroImg.alt = p.title;

    thumbs.innerHTML = "";
    imgs.forEach((src, i) => {
      const im = document.createElement("img");
      im.className = "modal-thumb" + (i === 0 ? " is-active" : "");
      im.src = src;
      im.alt = p.title + " image " + (i + 1);
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
})();
