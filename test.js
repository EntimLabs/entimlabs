const swiper = new Swiper(".work-swiper", {
  loop: true,
  grabCursor: true,
  spaceBetween: 30,
  slidesPerView: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: { slidesPerView: 2 },  // tablets
    1024: { slidesPerView: 3 }, // desktops
  },
});
