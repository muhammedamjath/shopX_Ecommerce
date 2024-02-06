const email=document.getElementById('email')
const password=document.getElementById('password')
const MobNo=document.getElementById('number')

const emailRejex=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const passwordRejex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


email.onblur=()=>{
    if(! emailRejex.test(email.value)){
        email.value=""
        email.placeholder='invalid email'
        email.classList.add('styleChenge')
        alert('enterd email is invalid')
    }
} 

password.onblur=()=>{
    if (! passwordRejex.test(password.value)){
        password.value=''
        password.placeholder='invalid Password'
        password.classList.add('styleChenge')
        alert('enterd password is invalid')

    }  
}

    