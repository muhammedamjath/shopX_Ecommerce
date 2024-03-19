// banner animation
const banner = document.querySelectorAll(".banner");
let timeout;

let counter = 0;
banner.forEach((img, index) => {
  img.style.left = `${index * 100}%`;
});

const goPrev = () => {
  if (counter < 0) {
    counter = banner.length;
  }
  counter--;
  clearTimeout(timeout);
  slideimage();
};

const goNext = () => {
  if (counter >= banner.length - 1) {
    counter = -1;
  }
  counter++;
  clearTimeout(timeout);
  slideimage();
};

const slideimage = () => {
  banner.forEach((slide) => {
    slide.style.transform = `translateX(-${counter * 100}%)`;
  });
  timeout = setTimeout(goNext, 3000);
};

slideimage();

// removing items from wishlist
function deleteCard(id) {
  axios
    .delete(`/user/deletecardwish/${id}`)
    .then((res) => {
      console.log(res);
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        const btn = card.querySelector(".btn");
        btn.addEventListener("click", () => {
        card.remove();
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}


