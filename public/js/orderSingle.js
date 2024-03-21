const select = document.getElementById("select");
      const input = document.getElementById("userId");
      const orderId = document.getElementById("orderId").value;
      const status = document.getElementById("status");
      const newstatus=document.getElementById('newstatus')
      const userId = input.value;
      
      if (status.innerText == "placed") {
        status.style.color = "orange";
      } else if (status.innerText === "cancelled") {
        status.style.color = "red";
      } else if (status.innerText == "shipped") {
        status.style.color = "orange";
      } else if (status.innerText == "deliverd") {
        status.style.color = "green";
      }
      select.addEventListener("change", function () {
        const selectedValue = select.value;
        if (status.innerText !== "cancelled" && status.innerText!='deliverd') {
        axios
          .put("/admin/statusupdate", {
            selectedValue: selectedValue,
            userId: userId,
            orderId: orderId,
          })
          .then((res) => {
              status.innerText = selectedValue;
              
            if (status.innerText == "placed") {
              status.style.color = "orange";
            } else if (status.innerText == "shipped") {
              status.style.color = "orange";
            } else if (status.innerText == "deliverd") {
              status.style.color = "green";
            }
          })
          .catch((err) => {
            console.log(err);
          });
        }
      });