// Junta os dois comportamentos da galeria: os filtros por ambiente e o lightbox
export function initGallery() {
  const filtrosApi = initFilters();
  initLightbox(filtrosApi);
}

// Controla os botões de filtro (Fachada, Cozinha, Sala...) e esconde
// as fotos que não pertencem à categoria escolhida
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

  // ao carregar a página, aplica o filtro que já vier marcado como ativo no HTML
  const ativo = document.querySelector("[data-filtro].is-active") || filtros[0];
  aplicarFiltro(ativo.dataset.filtro);

  // devolve aplicarFiltro pra quem chamou poder reaproveitar (o lightbox usa isso ao fechar)
  return { aplicarFiltro };
}

// Controla a visualização em tela cheia das fotos (galeria e ficha técnica)
function initLightbox(filtrosApi) {
  const lightbox = document.querySelector("[data-lightbox]");
  const imagem = document.querySelector("[data-lightbox-image]");
  const closeBtn = document.querySelector("[data-lightbox-close]");
  const prevBtn = document.querySelector("[data-lightbox-prev]");
  const nextBtn = document.querySelector("[data-lightbox-next]");

  if (!lightbox || !imagem) return;

  // itensGrupo guarda todas as fotos do mesmo "grupo" (ex: toda a galeria),
  // em ordem, pra dar pra navegar com os botões de próxima/anterior
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

  // ao fechar, deixa a galeria filtrada na categoria da última foto vista
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
    // usa a versão em alta resolução (data-full) quando existe;
    // a miniatura da grade é só pra deixar o carregamento da página mais leve
    imagem.src = img.dataset.full || img.src;
    imagem.alt = img.alt;
    const multiplo = itensGrupo.length > 1;
    prevBtn.hidden = !multiplo;
    nextBtn.hidden = !multiplo;
  };

  // navega circularmente: da última foto volta pra primeira, e vice-versa
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

  // setas do teclado e Esc também funcionam, sem precisar clicar nos botões
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") fechar();
    if (event.key === "ArrowLeft") irPara(-1);
    if (event.key === "ArrowRight") irPara(1);
  });

  // clicar fora da foto (no fundo escuro) fecha o lightbox
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) fechar();
  });

  // suporte a arrastar o dedo (swipe) no celular pra trocar de foto
  let toqueInicialX = null;
  const LIMIAR_ARRASTO = 40; // em pixels — evita disparar com um toque acidental

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
