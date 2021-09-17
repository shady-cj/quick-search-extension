$(function(){



    $(cancel).addClass('hide')
    $(search).removeClass('hide')
    $(inpCon).val('')
    numOfMatch = 0
    $(matchInfo).text('')
    $(matchInfo).hide()

    $('.target').each(function(){
        $(this).removeClass('target')
        $(this).replaceWith($(this).text())
        
    })
})