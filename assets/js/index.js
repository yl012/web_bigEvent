$(function() {
    getUserInfo();
    logOut();
});

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        // headers: {
        //     //请求头配置对象
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!');
            }
            renderAvatar(res.data);
        },
        // //无论成功还是失败都会调用此函数
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清除token
        //         localStorage.removeItem('token');
        //         //跳转会登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}
//渲染用户头像
function renderAvatar(user) {
    let name = user.nickname || user.username;
    $('#welcome').html(`欢迎  ${name}`)
        //按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first)
    }
}
//退出按钮
function logOut() {
    $('#btnLogout').on('click', function(e) {
        // console.log('点击了');
        layer.confirm('确定是否退出?', { icon: 3, title: '提示' }, function(index) {
            //清空本地存储的token
            localStorage.removeItem('token');
            //重新跳转login.html
            location.href = '/login.html';
        })
    })
}