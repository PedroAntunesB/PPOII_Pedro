document.querySelector(".button-saibamais").addEventListener("click", () => {
  document.querySelector(".cards-section").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
