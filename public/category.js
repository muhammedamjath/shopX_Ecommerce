
const button1=document.getElementById('button1')
const button2=document.getElementById('button2')
const inputCategory=document.getElementById("categoryName")
const inputSubCategory=document.getElementById('subCategoryName')
const ul=document.getElementById('ul')
const ul2=document.getElementById('ul2')

// category post
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

// getting subcategory when click category
let categoryId
document.addEventListener('DOMContentLoaded',()=>{
    let categoryItems=document.querySelectorAll('#ul li')
    categoryItems.forEach((items)=>{
        items.addEventListener('click',()=>{
             categoryId=items.getAttribute('data-id')
            axios.get(`/admin/subCategory?categoryId=${categoryId}`)
                .then(response => {
                    const subData=response.data.subCategoryData.subcategory
                   const ul2=document.querySelector('#ul2')
                   ul2.innerHTML=''

                   for(i=0 ; i<=subData.length ; i++){
                    const li=document.createElement('li')
                    li.textContent=subData[i]
                    ul2.appendChild(li)
                   }

                })
                .catch(error => { 
                    console.error('Error:', error);
                });
        })
    }) 
})

// adding subcategory
button2.addEventListener('click',(event)=>{
    event.preventDefault()
    const subcategory=inputSubCategory.value
    axios.post(`/admin/subCategory/${categoryId}`, {subcategory})
    .then((res)=>{
        const subdata=inputSubCategory.value
        const newli=document.createElement('li')
        newli.textContent=subdata

        ul2.appendChild(newli)
        inputSubCategory.value=''
    })
    .catch((err)=>{
        console.log('the error in subcatogory is ',err);
    })
   

    
})
