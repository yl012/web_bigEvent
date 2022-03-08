const form = layui.form;
$(function() {
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd(value) {
            if (value === $('[name=oldPw]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd(value) {
            if (value !== $('[name=newPw]').val()) {
                return '两次密码输入不一致';
            }
        }
    })
});
//表单的提交事件监听
$('.layui-form').submit(function(e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: 'my/updatepwd',
        date: $(this).serialize(),
        success(res) {
            console.log(res);
            //验证输入密码和原密码不匹配
            if (res.data.oldpwd !== $('[name=oldPw]').val()) {
                return layui.layer.msg('原密码不正确！');
            }
            //如果状态不是0
            if (res.status !== 0) {
                layui.layer.msg('更新密码失败！');
            }
            layui.layer.msg('更新密码成功！');
            //转换为原生js来实现重置表单功能
            $('.layui-form')[0].reset();
        },
        complete() {
            console.log(data);
        }
    })
})