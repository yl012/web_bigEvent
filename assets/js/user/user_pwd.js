const form = layui.form;
$(function() {
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致';
            }
        }
    })
});
//表单的提交事件监听
$('#form-pw').on('submit', function(e) {
    e.preventDefault();
    let str = $(this).serialize();
    $.ajax({
        method: 'POST',
        url: 'my/updatepwd',
        data: str,
        success(res) {
            // console.log(res);

            //如果状态不是0
            if (res.status !== 0) {
                $('.btn-reset').click();
                return layui.layer.msg(res.message);
            }
            layui.layer.msg('更新密码成功！');
            //转换为原生js来实现重置表单功能
            $('#form-pw')[0].reset();
        },
        complete() {
            console.log(data);
        }
    })
})