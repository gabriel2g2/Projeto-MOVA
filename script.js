// Configure o telefone no formato internacional, somente números. Ex.: 5511999999999
const MOVA_WHATSAPP_NUMBER = "";

const nav = document.querySelector(".site-nav");
const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.querySelector("#year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

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

// Fecha o menu mobile após a seleção de uma seção.
document.querySelectorAll("#menu .nav-link, #menu .nav-contact").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.querySelector("#menu");
    if (menu.classList.contains("show") && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});
