$('#publishBoard').on('click',function(){
    $.post('/manage/publishBoard').done(function(data){
        if(!!data & !!data['n'] && data['n']>0){
            top.layer.msg('发布成功');
            location.reload();
        }else if(data['n'] === 0){
            top.layer.msg('发布未执行');
        }else{
            top.layer.msg('发布执行失败');
        }
    }).fail(function(e){
        console.error(e);
        top.layer.msg('发布失败，网络错误');
    })
});