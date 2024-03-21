document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const shipping = document.getElementById("shipping");
    let subtotal = document.getElementById("subtotal");
    let total = document.getElementById("total");
    if (subtotal.innerText > 1000) {
      shipping.innerText = "Free delivery";
      shipping.style.color = "green";
    } else {
      total.innerText = 50 + parseInt(subtotal.innerText);
      if (subtotal.innerText == 0) {
        total.innerText = 0;
      }
    }

    cards.forEach((card) => {
      const div = card.querySelector(".quantity #quantity");
      const totalPrize = card.querySelector(".total .prize");
      const offerprize = card.querySelector("#offerprize");
      const offervalue = parseInt(offerprize.innerText);

      const itemId = card
        .querySelector(".quantity button")
        .getAttribute("data-item-id");
      function decrement(Id) {
        if (div.innerText >= 2) {
          div.innerText = parseInt(div.innerText) - 1;
          totalPrize.innerText =
            parseInt(div.innerText) * parseInt(offerprize.innerText);
          currentQuantity = div.innerText;
          toaxios(Id, currentQuantity, -offervalue);
        } else {
          alert("Choose minimum quantity one");
        }
      }

      function increment(Id) {
        div.innerText = parseInt(div.innerText) + 1;
        totalPrize.innerText =
          parseInt(div.innerText) * parseInt(offerprize.innerText);
        currentQuantity = div.innerText;
        toaxios(Id, currentQuantity, offervalue);
      }

      card
        .querySelector(".quantity button:first-child")
        .addEventListener("click", () => {
          decrement(itemId);
        });

      card
        .querySelector(".quantity button:last-child")
        .addEventListener("click", () => {
          increment(itemId);
        });
    });
  });

  // axios function
  function toaxios(id, quantity, offervalue) {
    console.log("the offerprize is :", offervalue);
    axios
      .post(`/user/quantity/${id}/${quantity}`)
      .then((res) => {
        total.innerText = offervalue + parseInt(total.innerText);
        subtotal.innerText = offervalue + parseInt(subtotal.innerText);
        if (subtotal.innerText > 1000) {
          shipping.innerText = "Free delivery";
          shipping.style.color = "green";
          total.innerText = subtotal.innerText;
        } else {
          shipping.innerText = 50;
          shipping.style.color = "black";
          total.innerText = 50 + parseInt(subtotal.innerText);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // remove item from cart
  function delcartItem(id, quantity, offerprize) {
    console.log(quantity);
    console.log(offerprize);
    axios
      .delete(`/user/delcartItem/${id}`)
      .then((res) => {
        const card = document.getElementById(id);
        let subtotal = document.getElementById("subtotal");
        let total = document.getElementById("total");
        card.remove();
        subtotal.innerText =
          -quantity * offerprize + parseInt(subtotal.innerText);
        if (subtotal.innerText > 1000) {
          total.innerText = subtotal.innerText;
          shipping.innerText = "Free delivery";
          shipping.style.color = "green";
        } else {
          shipping.innerText = 50;
          shipping.style.color = "black";
          total.innerText = 50 + parseInt(subtotal.innerText);
        }
        let checkcard = document.querySelectorAll(".card");
        if (checkcard.length == 0) {
          subtotal.innerText = 0;
          total.innerText = 0;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }