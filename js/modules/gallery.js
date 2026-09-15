export function initGallery() {
  const filtrosApi = initFilters();
  initLightbox(filtrosApi);
}

function initFilters() {
  const filtros = document.querySelectorAll("[data-filtro]");
  const itens = document.querySelectorAll("[data-galeria-grid] .galeria__item");

  if (!filtros.length || !itens.length) return null;

  const aplicarFiltro = (categoria) => {
    itens.forEach((item) => {
      item.hidden = item.dataset.categoria !== categoria;
    });
    filtros.forEach((botao) => {
      botao.classList.toggle("is-active", botao.dataset.filtro === categoria);
    });
  };

  filtros.forEach((botao) => {
    botao.addEventListener("click", () => aplicarFiltro(botao.dataset.filtro));
  });

  const ativo = document.querySelector("[data-filtro].is-active") || filtros[0];
  aplicarFiltro(ativo.dataset.filtro);

  return { aplicarFiltro };
}

function initLightbox(filtrosApi) {
  const lightbox = document.querySelector("[data-lightbox]");
  const imagem = document.querySelector("[data-lightbox-image]");
  const closeBtn = document.querySelector("[data-lightbox-close]");
  const prevBtn = document.querySelector("[data-lightbox-prev]");
  const nextBtn = document.querySelector("[data-lightbox-next]");

  if (!lightbox || !imagem) return;

  let itensGrupo = [];
  let indiceAtual = 0;

  const getImg = (trigger) => (trigger.tagName === "IMG" ? trigger : trigger.querySelector("img"));

  const abrir = (trigger) => {
    const grupo = trigger.dataset.lightboxGroup || "default";
    itensGrupo = Array.from(
      document.querySelectorAll(`[data-lightbox-trigger][data-lightbox-group="${grupo}"]`)
    );
    indiceAtual = itensGrupo.indexOf(trigger);
    mostrarImagemAtual();
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  };

  const fechar = () => {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");

    const categoria = itensGrupo[indiceAtual]?.dataset.categoria;
    if (categoria) filtrosApi?.aplicarFiltro(categoria);
  };

  const mostrarImagemAtual = () => {
    const trigger = itensGrupo[indiceAtual];
    if (!trigger) return;
    const img = getImg(trigger);
    imagem.src = img.dataset.full || img.src;
    imagem.alt = img.alt;
    const multiplo = itensGrupo.length > 1;
    prevBtn.hidden = !multiplo;
    nextBtn.hidden = !multiplo;
  };

  const irPara = (delta) => {
    indiceAtual = (indiceAtual + delta + itensGrupo.length) % itensGrupo.length;
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

  let toqueInicialX = null;
  const LIMIAR_ARRASTO = 40;

  lightbox.addEventListener(
    "touchstart",
    (event) => {
      toqueInicialX = event.touches[0].clientX;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      if (toqueInicialX === null) return;
      const deltaX = event.changedTouches[0].clientX - toqueInicialX;
      toqueInicialX = null;
      if (Math.abs(deltaX) > LIMIAR_ARRASTO) irPara(deltaX < 0 ? 1 : -1);
    },
    { passive: true }
  );
}
