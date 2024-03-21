const buttons=document.querySelector('.profile-sub')
    const profile=document.querySelector('.profile')
    profile.addEventListener('click',(event)=>{
        const computedStyle = window.getComputedStyle(buttons);
    const displayValue = computedStyle.getPropertyValue('display');
    buttons.style.display = displayValue === 'none' ? 'block' : 'none';
    })

    const searchButton= document.getElementById('search-btn')
    searchButton.addEventListener('click',(event)=>{
        const inputValue= document.getElementById('search-input').value
        console.log(inputValue);
        location.href=`/user/showallproduct?search=${inputValue}`
    })