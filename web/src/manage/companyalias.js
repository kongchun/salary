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
                { field: '_id', title: 'ID', hide: true },
                { field: 'company', title: '公司名', sort: true },
                { field: 'companyAlias', title: '原始别名' },
                { field: 'realAlias', title: '真实别名', edit: 'text' },
                { fixed: 'right', title: '操作', toolbar: '#barCompany' }
            ]]
        });
        table.on('edit(alias)', obj => {
            $.post('/manage/updateCompanyAlias', { _id: obj.data._id, alias: obj.value }, data => {
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
        table.on('tool(alias)', obj => {
            if (obj.event === 'del') {
                layer.confirm('删除数据：' + (obj.data.alias || obj.data.company) + '？', () => {
                    $.post('/manage/deleteCompanyAliasById', { _id: obj.data._id }, data => {
                        if (!!data & !!data['n'] && data['n'] > 0) {
                            layer.msg('删除成功');
                            layui.table.reload('aliasList');
                        } else if (data['n'] === 0) {
                            layer.msg('删除未执行');
                        } else {
                            layer.msg('删除执行失败');
                        }
                    }).fail(e => {
                        console.error(e);
                        layer.msg('删除失败，网络错误');
                    });
                });
            }
        });
    });
}

function searchName() {
    let keyWord = $('input[name=keyWord]').val().trim();
    layui.table.reload('aliasList', { where: { search: keyWord }, page: { curr: 1 } });
}