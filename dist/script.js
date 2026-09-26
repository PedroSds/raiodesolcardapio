const sections = [...document.querySelectorAll("[data-observe]")];
const indexLinks = [...document.querySelectorAll(".catalog-index nav a")];

const coverSlides = [...document.querySelectorAll(".cover-slide")];
if (coverSlides.length) {
  let activeSlide = 0;
  coverSlides[activeSlide].classList.add("is-active");
  window.setInterval(() => {
    coverSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % coverSlides.length;
    coverSlides[activeSlide].classList.add("is-active");
  }, 4500);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      indexLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.section === entry.target.id);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => {
  // A seção pode ser aberta diretamente pela URL raiz ou por um link externo.
  // Deixamos o conteúdo disponível imediatamente e mantemos o observer para
  // atualizar a navegação conforme o usuário percorre o catálogo.
  section.classList.add("visible");
  revealObserver.observe(section);
  sectionObserver.observe(section);
});

document.querySelectorAll(".product-showcase").forEach((showcase) => {
  const products = [...showcase.querySelectorAll(":scope > .sweet-entry")];
  products.forEach((product, index) => {
    const counter = product.querySelector(".product-count");
    if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(products.length).padStart(2, "0")}`;
  });
});

document.querySelectorAll("[data-variation-group]").forEach((group) => {
  const image = group.querySelector(".variation-image");
  const buttons = [...group.querySelectorAll(".variation-button")];
  const prefix = group.dataset.variationPrefix;
  const label = group.dataset.variationLabel || "doce";
  const count = Number(group.dataset.variationCount || buttons.length);
  const images = Array.from({ length: count }, (_, index) => `./assets/finos/${prefix}-${index + 1}.png?v=2`);
  let active = 0;

  const showVariation = (index) => {
    active = index;
    image.classList.remove("is-active");
    window.setTimeout(() => {
      image.src = images[active];
      image.alt = `Variação ${active + 1} de ${label}`;
      image.classList.add("is-active");
    }, 140);
    buttons.forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === active));
  };

  buttons.forEach((button, index) => button.addEventListener("click", () => showVariation(index)));
  window.setInterval(() => showVariation((active + 1) % images.length), 5000);
});

const personalizedCards = [...document.querySelectorAll(".personalized-card")];
if (personalizedCards.length) {
  let start = 0;
  const cardsPerView = () => window.matchMedia("(max-width: 560px)").matches ? 1 : 2;
  const dots = document.querySelector(".personalized-dots");
  const updateDots = () => {
    if (!dots) return;
    const count = cardsPerView();
    const groupCount = Math.ceil(personalizedCards.length / count);
    dots.innerHTML = Array.from({ length: groupCount }, (_, index) => `<span class="personalized-dot${index === Math.floor(start / 3) ? " is-active" : ""}"></span>`).join("");
  };
  const showPersonalizedSet = () => {
    const count = cardsPerView();
    personalizedCards.forEach((card, index) => {
      const visible = Array.from({ length: count }, (_, offset) => (start + offset) % personalizedCards.length).includes(index);
      card.classList.toggle("is-visible", visible);
    });
    updateDots();
  };
  const movePersonalized = (direction) => {
    start = (start + direction * cardsPerView() + personalizedCards.length) % personalizedCards.length;
    showPersonalizedSet();
  };
  document.querySelector(".personalized-prev")?.addEventListener("click", () => movePersonalized(-1));
  document.querySelector(".personalized-next")?.addEventListener("click", () => movePersonalized(1));
  showPersonalizedSet();
  window.setInterval(() => movePersonalized(1), 4200);
  window.addEventListener("resize", showPersonalizedSet);
}
