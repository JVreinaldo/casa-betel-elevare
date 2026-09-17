// Ponto de entrada do site: importa e inicializa cada módulo
import { initMenu } from "./modules/menu.js";
import { initGallery } from "./modules/gallery.js";
import { initScrollReveal } from "./modules/scrollReveal.js";

initMenu();
initGallery();
initScrollReveal();

// atualiza o ano do copyright no rodapé automaticamente, todo ano
const anoAtual = document.querySelector("[data-ano-atual]");
if (anoAtual) anoAtual.textContent = new Date().getFullYear();
