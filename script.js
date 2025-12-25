// Apple-like interactions: smooth nav, project search + filter, modal details.

// OPTIONAL: Formspree endpoint for real contact form sending.
// Create a free form at formspree.io and paste your endpoint URL below.
// Example: "https://formspree.io/f/abcdwxyz"
const FORMSPREE_ENDPOINT = "";

const projects = [
  {
    title: "Striker Fatigue Validation (Closure Latch Assemblies)",
    org: "Tesla",
    when: "2025 – Present",
    tags: ["closures", "fatigue", "validation", "durability"],
    summary: "Validated latch durability and alignment integrity through high-cycle open/close testing.",
    bullets: [
      "Completed 50,000+ open–close cycles to verify durability and alignment integrity.",
      "Tracked compliance with OEM performance standards and documented results for sign-off."
    ]
  },
  {
    title: "Robot-Assisted Hood Cycling",
    org: "Tesla",
    when: "2025 – Present",
    tags: ["automation", "robotics", "cycling", "hinges"],
    summary: "Automated long-term cycling to ensure hinge robustness and actuation reliability.",
    bullets: [
      "Achieved 100,000+ automated open/close cycles across thermal and load profiles.",
      "Focused on long-term hinge robustness, actuation reliability, and repeatability."
    ]
  },
  {
    title: "Cybercab Roof System Vibration Testing (Pre-Aging)",
    org: "Tesla",
    when: "2025 – Present",
    tags: ["vibration", "NVH", "structures", "aging"],
    summary: "Multi-axis vibration validation to confirm integrity, seal retention, and NVH stability.",
    bullets: [
      "Ran 20+ hours across multi-axis profiles up to 30 g RMS before HTHE and PTCE aging.",
      "Confirmed roof structural integrity, seal retention, and NVH stability."
    ]
  },
  {
    title: "150 Nm Torque Test Rig (Actuator + Leadscrew + DAQ)",
    org: "5th Axis Inc.",
    when: "2025",
    tags: ["test rig", "torque", "controls", "DAQ", "electronics"],
    summary: "Designed and built a torque rig with precise control and high-accuracy signal acquisition.",
    bullets: [
      "Designed rig for components up to 150 Nm using HV rotary actuator and precision leadscrew.",
      "Implemented electronics stack: Teensy MCU, instrumentation amplifier, 24-bit ADC.",
      "Synchronized PWM motor control with torque/position feedback for stable long-duration cycles."
    ]
  },
  {
    title: "Road Load Data Acquisition (RLDA) + Correlation to CAE",
    org: "Yatri Motorcycles",
    when: "2022 – 2023",
    tags: ["RLDA", "python", "data analysis", "CAE", "strain"],
    summary: "High-volume sensor data analysis and correlation to simulation models.",
    bullets: [
      "Analyzed 100M+ data points from sensors using NumPy, SciPy, and Matplotlib.",
      "Achieved ~85% correlation of strain, acceleration, and suspension travel with CAE model.",
      "Selected sigma-delta multiplexed ADC and high-precision PGA for strain gauge digitization."
    ]
  },
  {
    title: "Fatigue Damage Analysis + Road Loading Profiles (nCode)",
    org: "Yatri Motorcycles",
    when: "2022 – 2023",
    tags: ["fatigue", "nCode", "rainflow", "durability"],
    summary: "Converted RLDA signals into actionable fatigue metrics and test profiles.",
    bullets: [
      "Performed rainflow, histogram, and level-counting fatigue analysis in nCode.",
      "Created block-cycle road-loading profiles to reproduce real-world durability in tests."
    ]
  },
  {
    title: "Pneumatic Fatigue Test Rigs (Front Frame, Swingarm, etc.)",
    org: "Yatri Motorcycles",
    when: "2021 – 2022",
    tags: ["pneumatics", "fatigue", "rigs", "strain gauges"],
    summary: "Designed fatigue setups and executed multi-million cycle component tests.",
    bullets: [
      "Selected & sized pneumatic compressor, cylinders, load cell, and strain gauges.",
      "Executed component tests up to 5 million cycles with various load profiles.",
      "Validated hardware vs FEA results to catch issues early."
    ]
  },
  {
    title: "Traction Battery Shock Test Rig (AIS / UN Standards)",
    org: "Yatri Motorcycles",
    when: "2021 – 2022",
    tags: ["shock", "standards", "rigs", "battery"],
    summary: "Built/oversaw a shock rig for 50 kg battery validation to regulatory standards.",
    bullets: [
      "Designed rig for half-sine shock: 50 g peak, 6 ms pulse duration.",
      "Aligned test execution with AIS-048, AIS-156, and UN 38.3.4.3 requirements."
    ]
  },
  {
    title: "Welding Jigs & Fixtures + CNC G-code (Fusion 360)",
    org: "Yatri Motorcycles",
    when: "2020 – 2021",
    tags: ["fixtures", "welding", "CNC", "Fusion 360"],
    summary: "Built repeatable welding fixtures and improved manufacturing throughput.",
    bullets: [
      "Designed and manufactured five sub-components and a rotatable marriage welding fixture.",
      "Held ±1 mm tolerance on manually welded chassis with controlled distortion.",
      "Generated CNC G-code in Fusion 360 for precise manufacturing."
    ]
  },
  {
    title: "Handlebar Design & Analysis (Motorbike)",
    org: "Academic / Internship",
    when: "2020",
    tags: ["design", "analysis", "motorbike", "structures"],
    summary: "Designed and analyzed a motorbike handlebar for performance and durability.",
    bullets: [
      "Worked from requirements to design, analysis, and iteration for manufacturability.",
      "Focused on structural performance under real-world loads and usage."
    ]
  },
];

const els = {
  year: document.getElementById("year"),
  grid: document.getElementById("projectGrid"),
  search: document.getElementById("projectSearch"),
  chips: document.getElementById("tagChips"),
  modal: document.getElementById("projectModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalMeta: document.getElementById("modalMeta"),
  modalSummary: document.getElementById("modalSummary"),
  modalBullets: document.getElementById("modalBullets"),
  modalTags: document.getElementById("modalTags"),
  navToggle: document.getElementById("navToggle"),
  navLinks: document.getElementById("navLinks"),
  contactForm: document.getElementById("contactForm"),
  success: document.getElementById("success-message"),
  galleryTrack: document.getElementById("galleryTrack"),
  galleryPrev: document.getElementById("galleryPrev"),
  galleryNext: document.getElementById("galleryNext"),
  lightbox: document.getElementById("lightbox"),
  lightboxClose: document.getElementById("lightboxClose"),
  lightboxImg: document.getElementById("lightboxImg"),
};

let activeTag = "All";

function uniqTags(data){
  const set = new Set();
  data.forEach(p => p.tags.forEach(t => set.add(t)));
  return ["All", ...Array.from(set).sort((a,b)=>a.localeCompare(b))];
}

function renderTagChips(){
  const tags = uniqTags(projects);
  els.chips.innerHTML = "";
  tags.forEach(tag => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip clickable" + (tag === activeTag ? " active" : "");
    chip.textContent = tag;
    chip.addEventListener("click", () => {
      activeTag = tag;
      renderTagChips();
      renderProjects();
    });
    els.chips.appendChild(chip);
  });
}

function matchesFilters(p){
  const q = (els.search.value || "").trim().toLowerCase();
  const tagOk = activeTag === "All" || p.tags.includes(activeTag);
  if(!tagOk) return false;

  if(!q) return true;
  const hay = [
    p.title, p.org, p.when, p.summary, ...(p.tags||[]), ...(p.bullets||[])
  ].join(" ").toLowerCase();
  return hay.includes(q);
}

function renderProjects(){
  const filtered = projects.filter(matchesFilters);
  els.grid.innerHTML = "";

  if(filtered.length === 0){
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = "<h3>No matches</h3><p class='muted'>Try a different keyword or clear the tag filter.</p>";
    els.grid.appendChild(empty);
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "pcard";
    card.tabIndex = 0;
    card.setAttribute("role","button");
    card.setAttribute("aria-label", `Open project: ${p.title}`);

    const meta = document.createElement("div");
    meta.className = "pmeta";
    meta.textContent = `${p.org} • ${p.when}`;

    const title = document.createElement("h3");
    title.textContent = p.title;

    const summary = document.createElement("p");
    summary.className = "psummary";
    summary.textContent = p.summary;

    card.appendChild(meta);
    card.appendChild(title);
    card.appendChild(summary);

    card.addEventListener("click", () => openModal(p));
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openModal(p);
      }
    });

    els.grid.appendChild(card);
  });
}

function openModal(p){
  els.modalTitle.textContent = p.title;
  els.modalMeta.textContent = `${p.org} • ${p.when}`;
  els.modalSummary.textContent = p.summary;

  els.modalBullets.innerHTML = "";
  (p.bullets || []).forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    els.modalBullets.appendChild(li);
  });

  els.modalTags.innerHTML = "";
  (p.tags || []).forEach(t => {
    const span = document.createElement("span");
    span.className = "chip";
    span.textContent = t;
    els.modalTags.appendChild(span);
  });

  els.modal.classList.add("show");
  els.modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  els.modal.classList.remove("show");
  els.modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

function setupModal(){
  els.modal.addEventListener("click", (e) => {
    const close = e.target && e.target.getAttribute && e.target.getAttribute("data-close");
    if(close) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && els.modal.classList.contains("show")){
      closeModal();
    }
  });
}

function setupNav(){
  els.navToggle.addEventListener("click", () => {
    const open = els.navLinks.classList.toggle("show");
    els.navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close menu after clicking a link (mobile)
  els.navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      if(els.navLinks.classList.contains("show")){
        els.navLinks.classList.remove("show");
        els.navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function setupContactForm(){
  els.contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(els.contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    // Mailto fallback (works everywhere, no setup)
    const mailto = () => {
      const subject = encodeURIComponent(`Portfolio inquiry — ${name || "Hello"}`);
      const body = encodeURIComponent(`Name: ${name}
Email: ${email}

${message}`);
      window.location.href = `mailto:bmehta@siue.edu?subject=${subject}&body=${body}`;
      els.success.textContent = "Opening your email app…";
      setTimeout(() => (els.success.textContent = ""), 3500);
    };

    // If no endpoint is set, use mailto fallback
    if(!FORMSPREE_ENDPOINT){
      mailto();
      return;
    }

    // Send with Formspree
    try{
      els.success.textContent = "Sending…";
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData
      });

      if(res.ok){
        els.success.textContent = "Message sent! I’ll get back to you soon.";
        els.contactForm.reset();
        setTimeout(() => (els.success.textContent = ""), 4000);
      }else{
        mailto();
      }
    }catch(err){
      mailto();
    }
  });
}


function setupGallery(){
  if(!els.galleryTrack) return;

  const scrollByCard = (dir) => {
    const card = els.galleryTrack.querySelector(".gallery-item");
    const amount = card ? (card.getBoundingClientRect().width + 14) : 420;
    els.galleryTrack.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  els.galleryPrev?.addEventListener("click", () => scrollByCard(-1));
  els.galleryNext?.addEventListener("click", () => scrollByCard(1));

  // Lightbox
  const open = (src, alt) => {
    els.lightboxImg.src = src;
    els.lightboxImg.alt = alt || "Preview";
    els.lightbox.classList.add("show");
    els.lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    els.lightbox.classList.remove("show");
    els.lightbox.setAttribute("aria-hidden", "true");
    els.lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  els.galleryTrack.querySelectorAll("img").forEach(img => {
    img.addEventListener("click", () => open(img.getAttribute("src"), img.getAttribute("alt")));
  });

  els.lightboxClose?.addEventListener("click", close);
  els.lightbox?.addEventListener("click", (e) => {
    if(e.target?.dataset?.close === "true") close();
  });

  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && els.lightbox.classList.contains("show")) close();
  });
}

// Init
els.year.textContent = new Date().getFullYear();
renderTagChips();
renderProjects();
setupModal();
setupNav();
setupContactForm();
setupGallery();

els.search.addEventListener("input", renderProjects);
