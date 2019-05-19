$('#publishBoard').on('click', function () {
    $.post('/manage/saveTagCloud', { data: JSON.stringify(window.dvRows) }, function (data) {
        postCallback(data, '保存词云');
    }).fail(function (e) {
        console.error(e);
        top.layer.msg('保存词云失败，网络错误');
    });
    
    $.post('/manage/publishBoard').done(function (data) {
        postCallback(data, '发布');
    }).fail(function (e) {
        console.error(e);
        top.layer.msg('发布失败，网络错误');
    });
});

function postCallback(data, msg) {
    if (!!data & !!data['n'] && data['n'] > 0) {
        top.layer.msg(msg + '成功');
    } else if (data['n'] === 0) {
        top.layer.msg(msg + '未执行');
    } else {
        top.layer.msg(msg + '执行失败');
    }
}
