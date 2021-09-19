$(function(){
    $('.target').each(function(){
        $(this).removeClass('target')
        $(this).replaceWith($(this).text())
        
    })
})