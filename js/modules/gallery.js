export function initGallery() {
  initFilters();
  initLightbox();
}

function initFilters() {
  const filtros = document.querySelectorAll("[data-filtro]");
  const itens = document.querySelectorAll("[data-galeria-grid] .galeria__item");

  if (!filtros.length || !itens.length) return;

  filtros.forEach((botao) => {
    botao.addEventListener("click", () => {
      const categoria = botao.dataset.filtro;

      filtros.forEach((b) => b.classList.toggle("is-active", b === botao));

      itens.forEach((item) => {
        const mostrar = item.dataset.categoria === categoria;
        item.hidden = !mostrar;
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.querySelector("[data-lightbox]");
  const imagem = document.querySelector("[data-lightbox-image]");
  const closeBtn = document.querySelector("[data-lightbox-close]");
  const prevBtn = document.querySelector("[data-lightbox-prev]");
  const nextBtn = document.querySelector("[data-lightbox-next]");

  if (!lightbox || !imagem) return;

  let itensVisiveis = [];
  let indiceAtual = 0;

  const getImg = (trigger) => trigger.tagName === "IMG" ? trigger : trigger.querySelector("img");

  const abrir = (trigger) => {
    const grupo = trigger.dataset.lightboxGroup || "default";
    itensVisiveis = Array.from(
      document.querySelectorAll(`[data-lightbox-trigger][data-lightbox-group="${grupo}"]`)
    ).filter((el) => !el.closest("[hidden]") && el.offsetParent !== null);
    indiceAtual = itensVisiveis.indexOf(trigger);
    mostrarImagemAtual();
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  };

  const fechar = () => {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
  };

  const mostrarImagemAtual = () => {
    const trigger = itensVisiveis[indiceAtual];
    if (!trigger) return;
    const img = getImg(trigger);
    imagem.src = img.src;
    imagem.alt = img.alt;
    const multiplo = itensVisiveis.length > 1;
    prevBtn.hidden = !multiplo;
    nextBtn.hidden = !multiplo;
  };

  const irPara = (delta) => {
    indiceAtual = (indiceAtual + delta + itensVisiveis.length) % itensVisiveis.length;
    mostrarImagemAtual();
  };

  document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => abrir(trigger));
  });

  closeBtn?.addEventListener("click", fechar);
  prevBtn?.addEventListener("click", () => irPara(-1));
  nextBtn?.addEventListener("click", () => irPara(1));

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") fechar();
    if (event.key === "ArrowLeft") irPara(-1);
    if (event.key === "ArrowRight") irPara(1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) fechar();
  });
}
