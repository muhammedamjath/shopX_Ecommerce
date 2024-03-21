const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        const statusInput = card.querySelector("#status");
        const circle1 = card.querySelector("#circle1");
        const stick1 = card.querySelector("#stick1");
        const circle2 = card.querySelector("#circle2");
        const stick2 = card.querySelector("#stick2");
        const circle3 = card.querySelector("#circle3");
        const placed = card.querySelector("#p1");
        const shipped = card.querySelector("#p2");
        const deliverd = card.querySelector("#p3");

        if (statusInput.value === "cancelled") {
          circle1.style.color = "red";
          circle1.style.border = "none";
          circle1.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

          stick1.style.backgroundColor = "red";
          stick2.style.display = "none";

          circle3.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle3.style.border = "none";
          circle3.style.color = "red";
          circle2.style.display = "none";

          deliverd.textContent = "";
          shipped.textContent = "Cancelled";
        } else if (statusInput.value === "placed") {
          circle1.style.border = "none";
          circle1.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle1.style.color = "#70e000";
        } else if (statusInput.value === "shipped") {
          circle1.style.border = "none";
          circle1.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle1.style.color = "#70e000";
          circle1.style.border = "none";

          circle2.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle2.style.color = "#70e000";
          circle2.style.border = "none";
          stick1.style.backgroundColor = "#70e000";
        } else if (statusInput.value === "deliverd") {
          circle1.style.border = "none";
          circle1.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle1.style.color = "#70e000";
          circle1.style.border = "none";
          stick1.style.backgroundColor = "#70e000";

          circle2.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle2.style.color = "#70e000";
          circle2.style.border = "none";
          stick2.style.backgroundColor = "#70e000";

          circle3.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle3.style.color = "#70e000";
          circle3.style.border = "none";
        }
      });