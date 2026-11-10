// Marca que hay JavaScript: así las animaciones de aparición solo se activan
// si este archivo se ejecuta (sin JS, todo el contenido se ve igualmente).
document.documentElement.classList.add("js");

// ---------- Modo claro / oscuro ----------
const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeButton.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  // localStorage puede fallar (modo incógnito, cookies bloqueadas): no pasa nada.
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

// ---------- Menú en móvil ----------
const menuButton = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__links");

menuButton.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

// Al pulsar un enlace del menú, lo cerramos
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// ---------- Animaciones al hacer scroll ----------
// IntersectionObserver avisa cuando un elemento entra en pantalla,
// sin tener que escuchar el evento scroll a cada píxel.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target); // solo se anima una vez
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Resaltar en el menú la sección que se está viendo ----------
const navLinks = [...document.querySelectorAll(".nav__links a")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Año del pie de página ----------
document.getElementById("year").textContent = new Date().getFullYear();
