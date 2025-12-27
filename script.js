document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("projectModal");
  if (!modal) return; // not on projects page

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
      meta: "Yatri Motorcycles • Project Owner",
      desc: "Chassis concept, DFM, packaging, and suspension integration.",
      bullets: [
        "Dual-cradle chassis design for stiffness and battery protection",
        "Suspension integration for ride comfort",
        "Full-vehicle CAD and packaging"
      ],
      tags: ["CAD", "DFM", "Chassis"],
      images: [
        "/assets/images/projects/p1-bike.jpg",
        "/assets/images/projects/p1-chassis.jpg"
      ]
    },

    rlda: {
      title: "Road Load Data Acquisition (RLDA)",
      meta: "Durability Testing",
      desc: "Road data acquisition and CAE correlation.",
      bullets: [
        "Vehicle instrumentation with strain & accelerometers",
        "Controlled and real-world testing",
        "Durability correlation"
      ],
      tags: ["Durability", "Sensors", "Data"],
      images: [
        "/assets/images/projects/rlda-daq.jpg",
        "/assets/images/projects/rlda-bump.jpg"
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
    p.bullets.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      listEl.appendChild(li);
    });

    tagsEl.innerHTML = "";
    p.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });

    heroImg.src = p.images[0];
    thumbs.innerHTML = "";

    p.images.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "modal-thumb" + (i === 0 ? " is-active" : "");
      img.addEventListener("click", () => {
        heroImg.src = src;
        [...thumbs.children].forEach(t => t.classList.remove("is-active"));
        img.classList.add("is-active");
      });
      thumbs.appendChild(img);
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

  document.querySelectorAll("[data-project]").forEach(card => {
    card.addEventListener("click", () => openModal(card.dataset.project));
  });

  modal.addEventListener("click", e => {
    if (e.target.dataset.close) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});
