
const button1=document.getElementById('button1')
const button2=document.getElementById('button2')
const inputCategory=document.getElementById("categoryName")
const ul=document.getElementById('ul')

button1.addEventListener('click',(event)=>{
    event.preventDefault()
    const data={
        category:inputCategory.value
    }
    axios.post('/admin/category',data)
    .then((res)=>{
        const resData=inputCategory.value
        const newLi=document.createElement('li');
        newLi.textContent=resData

        ul.appendChild(newLi)
        inputCategory.value=''
    })
    .catch((err)=>{
        console.log("error :" ,err);
    })
}) 