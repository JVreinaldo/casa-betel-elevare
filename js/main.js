import { initMenu } from "./modules/menu.js";
import { initGallery } from "./modules/gallery.js";
import { initScrollReveal } from "./modules/scrollReveal.js";

initMenu();
initGallery();
initScrollReveal();

const anoAtual = document.querySelector("[data-ano-atual]");
if (anoAtual) anoAtual.textContent = new Date().getFullYear();
