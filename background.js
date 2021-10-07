async function getTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0]?.url
  }

chrome.tabs.onActivated.addListener(function(activeInfo){
    tabId = activeInfo.tabId
   
    chrome.storage.local.set({
        id:tabId,
    })
    removeActivated()
    getTab()
    .then(url => {

        if (/^http/.test(url)){
            loadInfos(tabId)
        }
    })
    
})

let searchWord,matchText;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.storage.local.remove(`tabData${tabId}`)

        removeActivated()
        loadInfos(tabId)

       
    }
});

function removeActivated(){
    chrome.storage.local.get('activated',function(data){
        if (data.activated !== undefined){
            chrome.storage.local.remove('activated')
        }
    })
}



function loadInfos(tabId){


    chrome.storage.local.set({
        activated: false
    })
    
    chrome.runtime.onConnect.addListener(port => {
        port.onMessage.addListener(msg => {
            console.log(msg)
            // Handle message however you want
        }
        );
    })

  


    setTimeout(function(){
        chrome.storage.local.set({
            activated: true
        }, () => {
        })
    }, 3000)
   

    chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ["./targetstyles.css"]
    })
        .then(() => {
            console.log("INJECTED THE FOREGROUND STYLES.");
        })
        .catch(err => console.log(err))
            

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === 'searchWord') {
            searchWord = request.payload

            chrome.storage.local.set({
                        searchWord: searchWord
                    }, () => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files:["./jquery.js","./search.js"],
                        })
                            .then(() => {
                                console.log("EXECUTED THE FOREGROUND SCRIPT.");
                                  
                                async function receiveMsg(){
                                    let myPromise = new Promise(function(myResolve, myReject) {
                                        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

                                            if (request.message ==='matchText'){
                                                matchText = request.payload
                                                myResolve(matchText)
                                                sendResponse({message:'received'})
                                            }
                                            myReject('error')
    
                                        })

                                    })
                         
                                    sendResponse({ message: 'success', payload:await myPromise});
                            
                                }
                                receiveMsg()                        
                                
                            })
                            .catch(err => console.log(err));
                        
                        }
                    )
            
        }else if(request.message === "cancel"){
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files:["./jquery.js","./cancelsearch.js"],
            })
                .then(() => {
                    sendResponse({message:"success"})
                })
                .catch(err => console.log(err));
        }else if(request.message === "getting ready"){
            sendResponse({message:"activated"})

        }

        return true
    });



    listenerAdded = false
}