$(() => {
    initTable();

    $('#searchBtnName').on('click', searchName);
    $('input[name=keyWord]').on('keydown', e => {
        if (e.key === 'Enter') {
            searchName();
        }
    });
});

function initTable() {
    layui.use('table', () => {
        let table = layui.table;
        table.render({
            elem: '#aliasList',
            url: '/manage/listCompanyAlias',
            page: true,
            limit: 15,
            cols: [[
                { field: 'company', title: '公司名', sort: true },
                { field: 'companyAlias', title: '原始别名' },
                { field: 'realAlias', title: '真实别名', edit: 'text' }
            ]]
        });
        table.on('edit(alias)', obj => {
            $.post('/manage/updateCompanyAlias', { company: obj.data.company, alias: obj.value }, data => {
                if (!!data & !!data['n'] && data['n'] > 0) {
                    layer.msg('更新成功');
                } else if (data['n'] === 0) {
                    layer.msg('更新未执行');
                } else {
                    layer.msg('更新执行失败');
                }
            }).fail(e => {
                console.error(e);
                layer.msg('更新失败，网络错误');
            });
        });
    });
}

function searchName() {
    let keyWord = $('input[name=keyWord]').val().trim();
    layui.table.reload('aliasList', { where: { search: keyWord }, page: { curr: 1 } });
}