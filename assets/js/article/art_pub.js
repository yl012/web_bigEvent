$(function() {
    const form = layui.form;
    const layer = layui.layer;
    initCates();
    initEditor();
    let art_state = '已发布';

    function initCates() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success(res) {
                let strHtml = template('tp-option', res);
                $('[name="cate_id"]').html(strHtml);
                //表格重新渲染
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    const $image = $('#image')

    // 2. 裁剪选项
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //选择封面的点击事件
    $('.btnAdd').on('click', function() {
        $('#coverFile').click();
    });

    //监听coverFile的change事件
    $('#coverFile').change(function(e) {
        //获取文件
        let files = e.target.files;
        if (files.length <= 0) {
            return;
        }
        //获取图片的url地址
        let newImgUrl = URL.createObjectURL(files[0]);
        $image.cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImgUrl) //重新设置图片的url
            .cropper(options);
    });

    //为存为草稿绑定点击事件
    $('#btnSave').on('click', function(e) {
        art_state = '草稿';
    });

    //为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        let fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        //将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob);
                // fd.forEach((k, v) => {
                //         console.log(v, k);
                //     })

                // 发起ajax请求
                publicArticle(fd);
            })

    });

    //实现方法
    function publicArticle(fd) {
        $.ajax({
            method: 'POST',
            url: 'my/article/add',
            data: fd,
            //如果向服务器提交FormData格式数据，必须添加下列配置项
            contentType: false,
            processData: false,
            success(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                location.href = '/article/art_list.html'
            }
        })
    }
});