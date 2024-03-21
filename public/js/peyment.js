document.getElementById('submit').addEventListener('click',  ()=> {

    axios.post('/user/peymentpost')
        .then(function (response) {
            console.log(response);
            var options = {
                key: response.data.data.key,
                amount: response.data.order.amount,
                currency: response.data.order.currency,
                order_id: response.data.order.id,
                image:'/miscellaneous/logo.png',
                name: 'shopX',
                description: 'Payment for your order',
                handler: function (response) {
                    console.log('Razorpay payment success:', response);
                    let peyment='upi'
                    window.location.href = '/user/ordercomplete/'+ encodeURIComponent(peyment);
                },
                prefill: {
                    name: response.data.data.name,
                    email: response.data.data.email,
                    contact: response.data.data.contact,
                },
                theme: {
                    color: '#ffb703'
                }
            };
            var rzp = new Razorpay(options);
            rzp.open();
        })
        .catch(function (error) {
            console.error('Error creating Razorpay order:', error);
        });
});