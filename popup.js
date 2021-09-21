let searchBtn = document.querySelector("#search");
let activatedCon =document.getElementById("activated")
let cancelBtn =document.querySelector("#cancel");
let inpCon = document.querySelector(".input-container input");
let matchInfo = document.querySelector("#matchNum")
inpCon.value = ""

chrome.storage.local.get("id", function(tab){
    let query = `tabData${tab.id}`
    chrome.storage.local.get(query,function(data){
        let currentTabData = data[query]
        if ( currentTabData?.onSession ){
            searchBtn.classList.add('hide')
            cancelBtn.classList.remove('hide')
            inpCon.value= currentTabData?.searchWord
            matchInfo.style.display = "block"
            matchInfo.textContent = currentTabData?.matches
            cancelListener()
            

        }else{
            searchBtn.classList.remove('hide')
            cancelBtn.classList.add('hide')
            searchListener()
        }
    })
})

cancelListener()

chrome.storage.local.get("activated",function(data){
    if (data.activated){
        searchListener()
       
    }
})





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


                searchListener()
            })


        }
    }
})

function cancelListener(){
    cancelBtn.addEventListener('click',function(){
        searchBtn.classList.remove('hide')
        cancelBtn.classList.add('hide')
        chrome.storage.local.get("id", function(tab){
            let tabIdinfo = `tabData${tab.id}`
            let obj = {}
            obj[tabIdinfo] =  {onSession : false} 
            chrome.storage.local.set(obj)
        })
      
    
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
}




function searchListener(){

    
    searchBtn.addEventListener('click',function(){
  
        let searchWord = inpCon.value;
        let searchWordLen = inpCon.value.length;
        if (searchWordLen){
            searchBtn.classList.add('hide')
            cancelBtn.classList.remove('hide')
            let tabIdinfo;
            chrome.storage.local.get("id", function(tab){
                tabIdinfo = `tabData${tab.id}`
                let obj = {}
                obj[tabIdinfo] =  {onSession : true, searchWord:searchWord} 
                chrome.storage.local.set(obj)
            })
          
            chrome.runtime.sendMessage({ 
                message: "searchWord",
                payload: searchWord
            }, response => {
                
    
                if (!chrome.runtime.lastError) {
        
                    if (response.message){
    
    
                        matchInfo.textContent= response.payload
                        matchInfo.style.display = "block"
                        chrome.storage.local.get(tabIdinfo, function(entry){
                            let dataObj = entry[tabIdinfo]
                            dataObj["matches"] = response.payload                    
                            chrome.storage.local.set(entry)
                        })
                    }
                    // message processing code goes here
                 } else {
                   // error handling code goes here
                   console.log("got an error")
                 }
     
            
            })
    
        }
    })
}