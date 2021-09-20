
$(function(){ 
    


    let regex,searched_word,matchText;
    let bodyEl = $("body").children().not("script,noscript,style")
    
    chrome.storage.local.get("searchWord", function (retrieved_data){
        searched_word = retrieved_data.searchWord
        getEachChildEl(bodyEl)
        let numOfMatch2 = $(".target").length
        if (numOfMatch2 > 1){
            matchText=`There are ${numOfMatch2} matches found on this page`
        
        }else if(numOfMatch2 === 1){
            matchText = `There is just ${numOfMatch2} match found on this page`
        }else{
            matchText = `There are no matches found on this page`
        }
        chrome.storage.local.set({
            matchText : matchText
        }, () => {
            console.log("stored")
    
        })
    });  


    function getEachChildEl(mainEl){

        regex = new RegExp(searched_word,"gi")

        
        $.each(mainEl,function(index,El){

            if ($(El).children().length){
                
                
                
                $(El).contents().each(function(){
                    if (this.nodeType === Node.TEXT_NODE){
                        replaceText(this, true)

                    }
                })

                return getEachChildEl($(El).children())
                
                
                
            }else{
                if (!($(this).hasClass('target'))){
                    replaceText(this,false)


                }
                
            }

        })

    
    }

    function replaceText(el,text){
        
        let clonedText = $(el).clone(true)
        let matches = $(clonedText).text().match(regex)
        let replacedText = $(clonedText).text().replaceAll(regex,`<span class='target'>${searched_word}</span>`)
        
        if (matches !== null){
            if (matches.length === 1){
                replacedText = $(clonedText).text().replaceAll(regex,`<span class='target'>${matches[0]}</span>`)
            }else{
                let reconText = '';
                let ind = 0 ;
                let prev =0;
                $(matches).each(function(){
                    
                    let newReg = new RegExp(`${this}`,'i')
                    let searchText = replacedText.slice(ind).search(newReg) + ind
                    let wordRange =parseInt(searchText) + parseInt(this.length)
                    let getWord = replacedText.slice(searchText,wordRange)
                    ind = wordRange
                    reconText += replacedText.slice(prev,ind).replace(getWord,this)
                    prev=ind
                    // console.log(ind)
                    
                    
                })
                reconText += replacedText.slice(ind)
                replacedText=reconText
                

            }
        }
        
        if (text){
            $(el).replaceWith(replacedText)

        }else{
            
            $(el).html(replacedText) 
    
        }

    }

    
})   
   