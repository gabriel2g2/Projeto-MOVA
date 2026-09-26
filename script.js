// Informe o WhatsApp da MOVA no formato internacional, somente números. Ex.: 5511999999999
const MOVA_WHATSAPP_NUMBER = "";

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.querySelector("#form-note");
  const name = document.querySelector("#nome").value.trim();
  const message = document.querySelector("#mensagem").value.trim();
  if (!MOVA_WHATSAPP_NUMBER) {
    note.textContent = "Para ativar o envio, adicione o número de WhatsApp da MOVA no arquivo script.js.";
    return;
  }
  const text = `Oi, MOVA! Sou ${name}. ${message}`;
  window.open(`https://wa.me/${MOVA_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

// Fecha o menu no celular depois que uma seção é selecionada.
document.querySelectorAll("#menu .nav-link, #menu .nav-cta").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.querySelector("#menu");
    if (menu.classList.contains("show") && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});

// Destaque o item do menu correspondente à seção visível.
const sectionLinks = [...document.querySelectorAll(".site-nav .nav-link")];
const observedSections = sectionLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-38% 0px -52% 0px" });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

// Revele blocos discretamente quando entram na tela.
document.querySelectorAll(".section-heading, #sobre .row, #contato .contact-inner, .project-tags, .portfolio-item").forEach((element) => element.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

// Filtros simples para explorar as peças do projeto.
const portfolioFilters = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const projectStage = document.querySelector("#portfolio-stage");
const projectTrack = document.querySelector("#project-track");
const projectSlides = [...document.querySelectorAll(".project-slide")];
const projectDots = [...document.querySelectorAll(".project-dot")];
const projectPosition = document.querySelector("#project-position");
const projectProgressBar = document.querySelector("#project-progress-bar");

portfolioFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    portfolioFilters.forEach((button) => {
      const active = button === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    portfolioItems.forEach((item) => {
      const show = category === "all" || item.dataset.category === category;
      item.classList.toggle("is-filtered-out", !show);
    });
  });
});

let activeProject = 0;
function showProject(index) {
  activeProject = (index + projectSlides.length) % projectSlides.length;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  projectTrack.scrollTo({ left: activeProject * projectTrack.clientWidth, behavior });
  paintProjectState();
}

function updateProjectState() {
  const width = projectTrack.clientWidth || 1;
  activeProject = Math.max(0, Math.min(projectSlides.length - 1, Math.round(projectTrack.scrollLeft / width)));
  paintProjectState();
}

function paintProjectState() {
  projectStage.dataset.theme = projectSlides[activeProject].dataset.theme;
  projectPosition.innerHTML = `0${activeProject + 1} <i>/</i> 0${projectSlides.length}`;
  projectProgressBar.style.width = `${((activeProject + 1) / projectSlides.length) * 100}%`;
  projectSlides.forEach((slide, index) => {
    const active = index === activeProject;
    slide.inert = !active;
    slide.setAttribute("aria-hidden", String(!active));
  });
  projectDots.forEach((dot, index) => {
    const active = index === activeProject;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", String(active));
  });
}

document.querySelector("#project-prev").addEventListener("click", () => showProject(activeProject - 1));
document.querySelector("#project-next").addEventListener("click", () => showProject(activeProject + 1));
projectDots.forEach((dot) => dot.addEventListener("click", () => showProject(Number(dot.dataset.slide))));
let projectScrollFrame;
projectTrack.addEventListener("scroll", () => {
  cancelAnimationFrame(projectScrollFrame);
  projectScrollFrame = requestAnimationFrame(updateProjectState);
}, { passive: true });
projectTrack.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") { event.preventDefault(); showProject(activeProject + 1); }
  if (event.key === "ArrowLeft") { event.preventDefault(); showProject(activeProject - 1); }
});
updateProjectState();

// Visualizador com navegação entre as imagens do mesmo projeto.
const portfolioModal = document.querySelector("#portfolio-modal");
let modalItems = [];
let modalIndex = 0;
function renderModalImage() {
  const item = modalItems[modalIndex];
  if (!item) return;
  const image = document.querySelector("#portfolio-modal-image");
  image.src = item.dataset.full;
  image.alt = item.querySelector("img")?.alt || "Imagem ampliada do projeto";
  document.querySelector("#portfolio-modal-caption").textContent = item.dataset.caption || "";
}
portfolioModal?.addEventListener("show.bs.modal", (event) => {
  const trigger = event.relatedTarget;
  if (!trigger) return;
  modalItems = [...trigger.closest(".project-slide").querySelectorAll(".portfolio-item:not(.is-filtered-out)")];
  modalIndex = Math.max(0, modalItems.indexOf(trigger));
  renderModalImage();
});
document.querySelector("#modal-previous").addEventListener("click", () => {
  modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
  renderModalImage();
});
document.querySelector("#modal-next").addEventListener("click", () => {
  modalIndex = (modalIndex + 1) % modalItems.length;
  renderModalImage();
});
portfolioModal?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") document.querySelector("#modal-previous").click();
  if (event.key === "ArrowRight") document.querySelector("#modal-next").click();
});
