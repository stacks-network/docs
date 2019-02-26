switcherTab('uk-tab-instance');

function switcherTab(id){
    $('#'+id+' a[href = "'+window.location.hash+'"]').parent('li').click();

    $('#'+id+' a').click(function(){
        var val = $(this).attr('href');
        window.location.hash = val.replace("#", "");
    });
}
