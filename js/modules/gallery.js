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
        const mostrar = categoria === "todos" || item.dataset.categoria === categoria;
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

  const abrir = (item) => {
    itensVisiveis = Array.from(
      document.querySelectorAll("[data-galeria-grid] .galeria__item:not([hidden])")
    );
    indiceAtual = itensVisiveis.indexOf(item);
    mostrarImagemAtual();
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  };

  const fechar = () => {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
  };

  const mostrarImagemAtual = () => {
    const item = itensVisiveis[indiceAtual];
    if (!item) return;
    const img = item.querySelector("img");
    imagem.src = img.src;
    imagem.alt = img.alt;
  };

  const irPara = (delta) => {
    indiceAtual = (indiceAtual + delta + itensVisiveis.length) % itensVisiveis.length;
    mostrarImagemAtual();
  };

  document.querySelectorAll("[data-galeria-grid] .galeria__item").forEach((item) => {
    item.addEventListener("click", () => abrir(item));
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
