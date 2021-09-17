   
$(function(){   
   if ($(inpCon).val().length ){
        $(search).addClass('hide')
        $(cancel).removeClass('hide')
        getEachChildEl(bodyEl)
        let matchText;
        if (numOfMatch > 1){
            matchText=`There are ${numOfMatch} matches found on this page`
        
        }else if(numOfMatch === 1){
            matchText = `There is just ${numOfMatch} match found on this page`
        }else{
            matchText = `There are no matches found on this page`
        }

        $(matchInfo).text(matchText)

        $(matchInfo).show()
    }

    function getEachChildEl(mainEl){

        searched_word = $(inpCon).val()
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
            numOfMatch += matches.length
            if (matches.length === 1){
                replacedText = $(clonedText).text().replaceAll(regex,`<span class='target'>${matches[0]}</span>`)
            }else{
                let reconText = '';
                let ind = 0 ;
                let prev =0;
                console.log(matches)
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
   