let searchBtn = document.querySelector("#search");
let activatedCon =document.getElementById("activated")
let cancelBtn =document.querySelector("#cancel");
let inpCon = document.querySelector(".input-container input");
let matchInfo = document.querySelector("#matchNum")
inpCon.value = ""


console.log('popupjs')
chrome.storage.onChanged.addListener(function (changes, namespace){
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === "activated" && newValue === true ){
            activatedCon.style.display = "block"
            inpCon.addEventListener("keyup", function(){
                activatedCon.classList.add("animateactivate")
                activatedCon.onanimationend = function(){
                    this.style.display = "none"
                    activatedCon.classList.remove("animateactivate")
                    
                }

            })
        }
    }
})


searchBtn.addEventListener('click',function(){
    let searchWord = inpCon.value;
    let searchWordLen = inpCon.value.length;
    if (searchWordLen){
        searchBtn.classList.add('hide')
        cancelBtn.classList.remove('hide')
        chrome.runtime.sendMessage({ 
            message: "searchWord",
            payload: searchWord
        }, response => {

            if (!chrome.runtime.lastError) {
    
                if (response.message){


                    matchInfo.textContent= response.payload
                    matchInfo.style.display = "block"
                }
                // message processing code goes here
             } else {
               // error handling code goes here
               console.log("got an error")
             }
 
        
        })

    }
})

cancelBtn.addEventListener('click',function(){
    searchBtn.classList.remove('hide')
    cancelBtn.classList.add('hide')
    inpCon.value = ""
    chrome.runtime.sendMessage({ 
        message: "cancel",
    }, response => {
        if (response){

            console.log("success")
        }

    })
    // numOfMatch = 0
    matchInfo.textContent =''
    matchInfo.style.display = "none"
})