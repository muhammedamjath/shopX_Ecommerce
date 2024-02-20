
const button1=document.getElementById('button1')
const button2=document.getElementById('button2')
const ul=document.getElementById('ul')
const ul2=document.getElementById('ul2')
const form = document.getElementById('categoryForm')
const inputSubCategory=document.getElementById('subCategoryName')

// category post
button1.addEventListener('click',(event)=>{
    event.preventDefault()
    const inputCategory=document.getElementById("categoryName")
    const image=document.getElementById('image')

    
    const data = new FormData(form)
    if(inputCategory.value.trim() === '' ){
       alert('Please enter a category !')
       event.preventDefault() 
    }else{
        if(image.value == ''){
            alert('pls upload a image')
        }else{
            axios.post('/admin/category',data,{
                Headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res)=>{
                const resData = res.data.categories[res.data.categories.length - 1];
                const indata=resData.category
                const newLi=document.createElement('li');
                newLi.innerHTML=`${indata}<button class='delete' ><i class="fa-regular fa-trash-can" style="color: #dd5013;"></i></button>`
                ul.appendChild(newLi)
                newLi.dataset.id=resData._id
                inputCategory.value=''
                image.value=''
                
                const deleteButton = newLi.querySelector('.delete');
                deleteButton.addEventListener('click', () => {
                    const categoryId=newLi.dataset.id
                    currentcategory(categoryId,newLi);
                });
                
            })
            .catch((err)=>{ 
                console.log("error :" ,err);
            })
        }
    }
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

                   for(i=0 ; i<=subData.length-1 ; i++){
                    const li=document.createElement('li')
                    li.classList.add('subli')
                    const dataId=response.data.subCategoryData._id
                    const licontent=subData[i]
                    li.innerHTML=`${subData[i]}<button class='delsubcat' data-subcat-id=${dataId} data-subcat-name=${licontent} ><i class="fa-regular fa-trash-can" style="color: #dd5013;"></i></button>`
                    ul2.appendChild(li)

                    const deletebtn=li.querySelector('.delsubcat')
                     deletebtn.addEventListener('click',()=>{
                     const subcatId=deletebtn.getAttribute('data-subcat-id')
                     const subcatdata=deletebtn.getAttribute('data-subcat-name')
                        console.log(subcatdata);
                     const liget=document.querySelectorAll(".subli")
                     let lipass;
                     liget.forEach((data)=>{
                        if(data.textContent==subcatdata){
                            lipass=data
                        }
                     })
                     deleteSubcatData(subcatId,subcatdata,lipass)
                    })
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
   if(inputSubCategory.value.trim() === '' || inputSubCategory.value === undefined  ){
    alert('Please enter a subcategory !')
   }else{
    axios.post(`/admin/subCategory/${categoryId}`, {subcategory})
    .then((res)=>{
        const subdata=inputSubCategory.value
        const newli=document.createElement('li')
        newli.innerHTML=`${subdata}<button class='delsubcat' ><i class="fa-regular fa-trash-can" style="color: #dd5013;"></i></button>`

        ul2.appendChild(newli)
        inputSubCategory.value=''
    })
    .catch((err)=>{
        console.log('the error in subcatogory is ',err);
    })
   }
})

// deleteting category while adding new category
function currentcategory(categoryId, liElement) {
    axios.delete(`/admin/deletecategory/${categoryId}`)
    .then((response) => {
        console.log(response);
        console.log("Category deleted successfully");
        liElement.remove();
    })
    .catch((error) => {
        console.error("Error deleting category:", error);
    });
}

// delete category from already added
function deletecategory(id){
    if(confirm('are you sure to delete')){
        axios.delete(`/admin/delcategory/${id}`)
        .then((res)=>{
            console.log('deleted category successfully');
            const liget=document.querySelector(`li[data-id="${categoryId}"]`)
            if(liget){
                liget.remove()
            }
        })
        .catch((err)=>{
            console.log(err);
        })  
    }
}

// deleting subcategory
function deleteSubcatData(id,data,removeli){
    axios.delete(`/admin/deletesubcat/${id}`,{
        data:{
            subcategoryName: data
        }
    })
    .then((res)=>{
        console.log('subcategory deleted');
        removeli.remove()
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    })
} 