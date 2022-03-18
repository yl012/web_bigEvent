$(function() {
    const layer = layui.layer;
    const form = layui.form;
    initArtCateList();
    // 获取文章的分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success(res) {
                // console.log(res);
                let strHtml = template('tp-table', res);
                $('tbody').html(strHtml);
            }
        })
    }

    let indexAdd = null;
    //为添加类别绑定点击事件
    $('#btnAddCate').click(function(e) {
        indexAdd = layer.open({
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            type: 1,
            area: ['500px', '250px'],
        })
    })

    //通过代理的形式为form-add来绑定提交表单事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                // console.log(res);
                if (res.status !== 0) {
                    layer.msg('添加文章分类失败！');
                    layer.close(indexAdd);
                    return initArtCateList();
                }
                initArtCateList();
                layer.msg('添加文章分类成功！');
                layer.close(indexAdd);

            }
        })
    })

    let indexEdit = null;
    //通过代理的形式为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function(e) {
        indexEdit = layer.open({
            title: '添加文章分类',
            content: $('#dialog-edit').html(),
            type: 1,
            area: ['500px', '250px'],
        })
        let id = $(this).attr('data-Id');
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: 'my/article/cates/' + id,
            success(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式为修改分类的表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                // console.log(res);
                if (res.status !== 0) {
                    initArtCateList();
                    layer.msg(res.message);
                    return layer.close(indexEdit);
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexEdit)
            }
        })
    })

    //通过代理的形式为删除按钮绑定删除事件
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-Id');
        layer.confirm('是否要删除此行?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: 'my/article/deletecate/' + id,
                success(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        initArtCateList();
                        return layer.msg(res.message);
                    }
                    initArtCateList();
                    layer.msg('删除成功！');
                }
            })
            layer.close(index);
        });
    })
});