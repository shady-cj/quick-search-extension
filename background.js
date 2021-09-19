// function onUpdatedListener(tabId, changeInfo, tab) {
//     chrome.tabs.get(tabId.tabId, function(tab){
//         console.log('New active tab: ' + tab.id);
//     });
// }
// // Subscribe to tab events
// chrome.tabs.onActivated.addListener(onUpdatedListener);

// onUpdatedListener()

// const tabId = getTabId()
// console.log(tabId)



// chrome.scripting.executeScript({ target:{tabId:tabId}, func: getTitle, /* file: './jquery.js'  */}, () => { 
//     console.log("done")
//     $(search).click(function(){
//         chrome.tabs.executeScript(null, { file: './search.js' }, () => console.log('code injected'))

//     })

//     $(cancel).click(function(){

//         chrome.tabs.executeScript(null, { file: './cancelsearch.js' }, () => console.log('code injected'))

//     })
// });




let searchWord,matchText;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {

        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["./targetstyles.css"]
        })
            .then(() => {
                console.log("INJECTED THE FOREGROUND STYLES.");
            })
            .catch(err => console.log(err));

        chrome.runtime.onConnect.addListener(port => {
            port.onMessage.addListener(msg => {
                console.log(msg)
                // Handle message however you want
            }
            );
        })
              

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
                                    console.log("INJECTED THE FOREGROUND SCRIPT.");
                                    
                            
                                    chrome.storage.onChanged.addListener(function (changes, namespace){
                                        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                                            if (key=== "matchText" ){
                                                matchText = newValue

                                                if (chrome.runtime.lastError) {
                                                    sendResponse({ message: 'fail', payload:matchText  });
                                                    return;
                                                }
                                                sendResponse({ message: 'success', payload:matchText });
                                                return true
                                                
                    
                                            }
                                        }
                                      });
                                

                             
                                   
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
                        console.log("i reached here too ")

                        sendResponse({message:"success"})
                    })
                    .catch(err => console.log(err));
            }

            return true
        });

 
    }
});






// $(function(){
//     // console.log($('.Name-el').contents().each(function(){
//     //     if(this.nodeType === Node.ELEMENT_NODE){
//     //         console.log(this)
//     //     }}))
    
//         let cancel = $("#cancel")
//         let search = $('#search')
//     $(search).click(function(){
//     chrome.tabs.query(
//         { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT,currentWindow: true},
//         function(tabs) {
//             // const { id: tabId } = tabs[0].url;
//             // let code = `document.querySelector('h1')`;
//             // let regex,searched_word,numOfMatch =0;
//             // let inpCon = $('.input-container').find('input')
//             // let bodyEl = $("body").children().not("script,noscript")
//             // let cancel = $("#cancel")
//             // let search = $('#search')
//             // let matchInfo =  $('#matchNum')
//             // $(inpCon).val('')





    

//         });

//     })
     
// /* 

//     $(cancel).click(function(){
//         $(cancel).addClass('hide')
//         $(search).removeClass('hide')
//         $(inpCon).val('')
//         numOfMatch = 0
//         $(matchInfo).text('')
//         $(matchInfo).hide()

//         $('.target').each(function(){
//             $(this).removeClass('target')
//             $(this).replaceWith($(this).text())
            
//         })
//     })

 
//     $(search).click(function(){
//         if ($(inpCon).val().length ){
//             $(search).addClass('hide')
//             $(cancel).removeClass('hide')
//             getEachChildEl(bodyEl)
//             let matchText;
//             if (numOfMatch > 1){
//                 matchText=`There are ${numOfMatch} matches found on this page`
               
//             }else if(numOfMatch === 1){
//                 matchText = `There is just ${numOfMatch} match found on this page`
//             }else{
//                 matchText = `There are no matches found on this page`
//             }

//             $(matchInfo).text(matchText)

//             $(matchInfo).show()
//         }
 
        
//     })

//     function getEachChildEl(mainEl){

//         searched_word = $(inpCon).val()
//         regex = new RegExp(searched_word,"gi")
        
//         $.each(mainEl,function(index,El){

//             if ($(El).children().length){
                
                
                
//                 $(El).contents().each(function(){
//                     if (this.nodeType === Node.TEXT_NODE){
//                         replaceText(this, true)

//                     }
//                 })

//                 return getEachChildEl($(El).children())
                
                
                
//             }else{
//                 if (!($(this).hasClass('target'))){
//                     replaceText(this,false)


//                 }
                   
//             }

//         })

       
//     }

//     function replaceText(el,text){
        
//         let clonedText = $(el).clone(true)
//         let matches = $(clonedText).text().match(regex)
//         let replacedText = $(clonedText).text().replaceAll(regex,`<span class='target'>${searched_word}</span>`)
        
//         if (matches !== null){
//             numOfMatch += matches.length
//             if (matches.length === 1){
//                 replacedText = $(clonedText).text().replaceAll(regex,`<span class='target'>${matches[0]}</span>`)
//             }else{
//                 let reconText = '';
//                 let ind = 0 ;
//                 let prev =0;
//                 console.log(matches)
//                 $(matches).each(function(){
                    
//                     let newReg = new RegExp(`${this}`,'i')
//                     let searchText = replacedText.slice(ind).search(newReg) + ind
//                     let wordRange =parseInt(searchText) + parseInt(this.length)
//                     let getWord = replacedText.slice(searchText,wordRange)
//                     ind = wordRange
//                     reconText += replacedText.slice(prev,ind).replace(getWord,this)
//                     prev=ind
//                     // console.log(ind)
                    
                    
//                 })
//                 reconText += replacedText.slice(ind)
//                 replacedText=reconText
                

//             }
//         }
        
//         if (text){
//             $(el).replaceWith(replacedText)

//         }else{
            
//             $(el).html(replacedText) 
       
//         }

//     }
//  */
// })