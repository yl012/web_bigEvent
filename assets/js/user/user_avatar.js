$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    const $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
    //为上传按钮绑定点击事件
    $('#btnChooseImg').on('click', function(e) {
            $('#file').click();
        })
        //为文件选择框选择图片
    $('#file').on('change', function(e) {
        // console.log(e);
        const files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg('请选择图片！');
        }
        //拿到用户选择的文件
        let file = files[0];
        //拿到文件路径
        let fileUrl = URL.createObjectURL(file);
        //给裁剪区域重新赋值
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', fileUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //把裁剪好的图片上传到服务器
    $('#btnUpload').on('click', function(e) {
        const dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'POST',
            url: 'my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败！');
                }
                layui.layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
});