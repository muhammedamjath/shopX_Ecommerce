// address preview part
const home=document.getElementById('house')
const post=document.getElementById('post')
const pin=document.getElementById('pin')
const district=document.getElementById('district')
const state=document.getElementById('state')
const number=document.getElementById('mobno')

const prehouse=document.getElementById('prehouse')
const prepost=document.getElementById('prepost')
const prepin=document.getElementById('prepin')
const predistrict=document.getElementById('predistrict')
const prestate=document.getElementById('prestate')
const premobno=document.getElementById('premobno')


// end

const subtotal=document.getElementById('subtotal')
const shipping=document.getElementById('shipping')
const discount=document.getElementById('discount')
const total=document.getElementById('total')
const couponid=document.getElementById('couponid')
if(subtotal.innerText>1000){
  shipping.innerText='Free delivery'
  shipping.style.color='green'
  total.innerText=subtotal.innerText
}else{
  shipping.innerText=50
  total.innerText=50+ parseInt(subtotal.innerText)
}

function coupon(id){
  addEventListener("click",(event)=>{
    axios.post(`/user/coupon/${id}`)
  .then((res)=>{
    console.log(res);
    discount.innerText=res.data.data
    const couponId=document.getElementById('couponId')
    const btn = document.getElementById('Btn');
    btn.innerText = "Applied"; 
    couponid.value=res.data.CId
    if(shipping.innerText==50){
      total.innerText=-(res.data.data)+50+parseInt(subtotal.innerText)
    }else{
      total.innerText=-(res.data.data)+parseInt(subtotal.innerText)
    }
    console.log(total.innerText);
  })
  .catch((err)=>{
    console.log(err);
  })
  })
}
