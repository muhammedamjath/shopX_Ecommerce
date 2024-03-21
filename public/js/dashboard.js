const todayDate = document.getElementById("date-today");
      const Time = document.getElementById("time");
      function updateTime() {
        const date = new Date();
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayName = daysOfWeek[date.getDay()];
        const currentDate = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const dateToday = `${dayName} ${currentDate}-${month}-${year}`;
        todayDate.innerText = dateToday;

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const timeString = `${hours}:${minutes}:${seconds}`;
        Time.innerText = timeString;
      }
      updateTime();
      setInterval(updateTime, 1000);

      document.addEventListener("DOMContentLoaded", () => {
        const ctx1 = document.getElementById("myChart1").getContext("2d");
        const ctx2 = document.getElementById("myChart2").getContext("2d");

        axios
          .get("/admin/getgraph")
          .then((response) => {
            const data = response.data.salesData;
            const labels = [];
            const sales = [];

            data.forEach((item) => {
              labels.push(`${item._id.year}-${item._id.month}`);
              sales.push(item.totalAmount);
            });

            new Chart(ctx1, {
              type: "line",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "sales ",
                    data: sales,
                    borderWidth: 1,
                    backgroundColor: "#d90429",
                  },
                ],
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Last 6 months sales",
                    color: "#d90429",
                  },
                },
              },
            });

            // user signup graph
            const labels1 = [];
            const signups = [];
            const data1 = response.data.signupData;
            data1.forEach((item) => {
              labels1.push(`${item._id.year}-${item._id.month}`);
              signups.push(item.totalSignups);
            });

            new Chart(ctx2, {
              type: "bar",
              data: {
                labels: labels1,
                datasets: [
                  {
                    label: " users",
                    data: signups,
                    borderWidth: 1,
                    backgroundColor: "#3a5a40",
                    borderColor: "#3a5a40",
                  },
                ],
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Last 6 months users",
                    color: "#3a5a40",
                  },
                },
              },
            });
          })
          .catch((error) => {
            console.error("Error fetching sales data:", error.message);
          });
      });