// Controla o header fixo e o menu mobile (abrir/fechar, escurecer ao rolar)
export function initMenu() {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");

  if (!header || !nav || !toggle) return;

  const closeMenu = () => {
    nav.classList.remove("nav--open");
    toggle.classList.remove("nav-toggle--active");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };

  // clique no hambúrguer alterna entre abrir e fechar o menu mobile
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.classList.toggle("nav-toggle--active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("no-scroll", isOpen);
  });

  // clicar em qualquer link do menu já fecha ele, sem precisar do X
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // tecla Esc também fecha, pra quem navega pelo teclado
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // header ganha fundo sólido depois de rolar um pouco a página
  const onScroll = () => {
    header.classList.toggle("site-header--scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
