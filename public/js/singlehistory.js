function cancell(id) {
    if (confirm("Are you sure to cancell this product")) {
      axios
        .put("/user/cancellOrder/" + id)
        .then((res) => {
          circle1.style.color = "red";
          circle1.style.border = "none";
          circle1.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

          stick1.style.backgroundColor = "red";
          stick2.style.display = "none";

          circle3.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          circle3.style.border = "none";
          circle3.style.color = "red";
          circle2.style.display = "none";
          shipped.style.display = "none";
          deliverd.textContent = "cancelled";

          btn.style.backgroundColor = "#dad7cd";
          btn.innerText = "Cancelled";
          btn.removeAttribute("onclick");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // status
  const btn = document.getElementById("cancellbtn");
  const statusInput = document.querySelector("#statusInput");
  const circle1 = document.querySelector("#circle1");
  const stick1 = document.querySelector("#stick1");
  const circle2 = document.querySelector("#circle2");
  const stick2 = document.querySelector("#stick2");
  const circle3 = document.querySelector("#circle3");
  const placed = document.querySelector("#p1");
  const shipped = document.querySelector("#p2");
  const deliverd = document.querySelector("#p3");

  if (statusInput.value === "cancelled") {
    circle1.style.color = "red";
    circle1.style.border = "none";
    circle1.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

    stick1.style.backgroundColor = "red";
    stick1.style.border='none'
    stick2.style.display = "none";
    stick1.style.height='3px'
    stick1.style.height='3px'


    circle3.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    circle3.style.border = "none";
    circle3.style.color = "red";
    circle2.style.display = "none";

    deliverd.textContent = "cancelled";
    shipped.style.display = "none";

    btn.style.backgroundColor = "#dad7cd";
          btn.innerText = "Cancelled";
          btn.removeAttribute("onclick");
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
    stick1.style.border='none'
    stick1.style.height='3px'
  } else if (statusInput.value === "deliverd") {
    circle1.style.border = "none";
    circle1.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    circle1.style.color = "#70e000";
    circle1.style.border = "none";
    stick1.style.backgroundColor = "#70e000";
    stick1.style.height='3px'
    stick1.style.border='none'


    circle2.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    circle2.style.color = "#70e000";
    circle2.style.border = "none";
    stick2.style.backgroundColor = "#70e000";
    stick2.style.border='none'
    stick2.style.height='3px'

    circle3.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    circle3.style.color = "#70e000";
    circle3.style.border = "none";

    btn.style.backgroundColor = "#dad7cd";
          btn.innerText = "Deliverd";
          btn.removeAttribute("onclick");
  }