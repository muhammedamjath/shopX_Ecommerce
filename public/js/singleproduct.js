const mainimage = document.querySelector(".img");
      const subimg = document.querySelectorAll(".subimg");

      subimg.forEach((item) => {
        item.addEventListener("click", () => {
          mainimage.src = item.src;
        });
      });

      // add items to wishlist
      const button = document.querySelector(".wishlist");
      function passIdtoAxios(id) {
        if (button.style.color == "red") {
          alert("the product is alredy in wishlist");
        } else {
          axios
            .post(`/user/passIdtoAxios/${id}`)
            .then((res) => {
              button.style.color = "red";
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      // add to cart
      function addToCart(id) {
        axios
          .post(`/user/addToCart/${id}`)
          .then((res) => {
            const message = res.data.message;
            if (message == "the product is already in cart") {
              alert(message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      let stars = document.getElementsByClassName("star");
      let output = document.getElementById("output");

      // Funtion to update rating
      function gfg(n) {
        remove();
        for (let i = 0; i < n; i++) {
          if (n == 1) cls = "one";
          else if (n == 2) cls = "two";
          else if (n == 3) cls = "three";
          else if (n == 4) cls = "four";
          else if (n == 5) cls = "five";
          stars[i].className = "star " + cls;
        }

        
        const reviewbtn= document.getElementById('review-btn')
        const hidden= document.getElementById('hidden').value
        reviewbtn.addEventListener('click',()=>{
          let textarea = document.getElementById("myTextarea");
        let textContent = textarea.value;

          axios.post(`/user/review?starcount=${n}&content=${textContent}&proId=${hidden}`)
          .then((res)=>{
            console.log(res);
            if(res.data.message=='pls login'){
              Swal.fire({
              position: "center",
              icon: "info",
              title: "please login",
              showConfirmButton: false,
              timer: 2000
              });
            }else if(res.data.message=='pls purchase this product for post review'){
              Swal.fire({
              position: "center",
              icon: "info",
              title: "please purchase this product for add review",
              showConfirmButton: false,
              timer: 2000
              });
            }else if(res.data.message=='you already reviewd this product'){
              Swal.fire({
              position: "center",
              icon: "info",
              title: "You already reviewd this product",
              showConfirmButton: false,
              timer: 2000
              });
            }else if(res.data.message=='created successfull'){
              Swal.fire({
              position: "center",
              icon: "success",
              title: "Your review added succesfully",
              showConfirmButton: false,
              timer: 2000
              });
            }else if(res.data.message=='you can review this product after deliverd'){
              Swal.fire({
              position: "center",
              icon: "info",
              title: "You can review this product after deliverd",
              showConfirmButton: false,
              timer: 2000
              });
            }
            
            console.log(res);
          })
          .catch((err)=>console.log(err))
        })
      }

      // To remove the pre-applied styling
      function remove() {
        let i = 0;
        while (i < 5) {
          stars[i].className = "star";
          i++;
        }
      }