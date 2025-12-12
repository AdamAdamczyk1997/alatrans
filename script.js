document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector(".lightbox__img");

  document.querySelectorAll("img[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  lightbox.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });
});
