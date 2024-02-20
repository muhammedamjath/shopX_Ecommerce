// banner animation 
const banner=document.querySelectorAll('.banner')
let timeout;

let counter=0
banner.forEach((img,index)=>{
    img.style.left = `${index *100}%`
})

const goPrev=()=>{
    if(counter < 0){
        counter= banner.length
    }
    counter--
    clearTimeout(timeout)
    slideimage()
}

const goNext=()=>{
    if(counter >= banner.length-1){
        counter = -1
    }
    counter++
    clearTimeout(timeout)
    slideimage()
}

const slideimage=()=>{
    banner.forEach((slide)=>{
        slide.style.transform=`translateX(-${counter *100}%)`
    })
    timeout= setTimeout(goNext, 3000);
}

slideimage()

