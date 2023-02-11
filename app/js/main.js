const headerBurger = document.querySelector('.header__burger');
const menu = document.querySelector('.menu');
window.addEventListener('scroll', () => {
   const header = document.querySelector('.header__body');
   header.classList.toggle('_scroll', window.scrollY > 0);
})
headerBurger.addEventListener('click', (event) => {
   event.preventDefault();
   event.target.classList.toggle('_active');
   menu.classList.toggle('_active');
   document.querySelector('body').classList.toggle('_hidden');
})
const swiperStore = new Swiper('.swiper-store', {
   clickable: true,
   loop: true,
   slidesPerView: 'auto',
   spaceBetween: 20,
});
const swiperProducts = new Swiper('.swiper-products', {
   slidesPerView: 4,
   grid: {
      rows: 2,
   },
   clickable: true,
   // slidesPerView: 'auto',
   breakpoints: {
      // when window width is >= 320px
      320: {
         slidesPerView: 2,
         grid: {
            rows: 4,
         },

      }
      // // when window width is >= 480px
      // 480: {
      //   slidesPerView: 3,
      //   spaceBetween: 30
      // },
      // // when window width is >= 640px
      // 640: {
      //   slidesPerView: 4,
      //   spaceBetween: 40
      // }
   },
   speed: 400,
   pagination: {
      el: '.paginations-products__pagination',
      type: 'bullets',
   },
   navigation: {
      nextEl: '.paginations-products__next',
      prevEl: '.paginations-products__prev',
   },
});
const swiperAbout = new Swiper('.swiper-about', {
   clickable: true,
   loop: true,
   slidesPerView: 'auto',
   spaceBetween: 20,
   navigation: {
      nextEl: '.pagination-about__next',
      prevEl: '.pagination-about__prev',
   },
});

