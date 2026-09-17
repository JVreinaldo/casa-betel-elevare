// Anima cada elemento .reveal pra aparecer suavemente ao entrar na tela
export function initScrollReveal() {
  const elementos = document.querySelectorAll(".reveal");
  if (!elementos.length) return;

  // navegador muito antigo sem suporte: mostra tudo direto, sem animação
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // já apareceu uma vez, não precisa mais observar
        }
      });
    },
    { threshold: 0.15 } // dispara quando 15% do elemento já está visível
  );

  elementos.forEach((el) => observer.observe(el));
}
