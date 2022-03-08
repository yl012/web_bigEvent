const form = layui.form;
const layer = layui.layer;
$(function() {
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度得在1-6个字符';
            }
        }
    })
    initUserInfo();
});


//初始化用户个人信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            console.log(res.data);
            // $('.username').val(res.data.username);
            //调用form.val来快速赋值
            form.val('formUserInfo', res.data)
        }
    })
}
//监听表单提交事件
$('.layui-form').on('submit', function(e) {
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: 'my/userinfo',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg('更新信息失败！');
                }
                layer.msg('更新信息成功！');
                //当前窗口的父级的方法
                window.parent.getUserInfo();
            }
        })
    })
    //监听表单的重置事件
$('#btnReset').on('click', function(e) {
    e.preventDefault();
    //直接调用初始化用户信息发送ajax获取初始信息
    initUserInfo();
})