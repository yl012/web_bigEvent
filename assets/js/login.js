$(function() {
    // 点击去注册账户
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    //点击去登录
    $('#link_login').on('click', function() {
        $('.reg_box').hide();
        $('.login_box').show();
    });

    //从layui中使用form
    let form = layui.form;
    //从layui中使用layer
    let layer = layui.layer;
    //通过form.verify来自定义规则
    form.verify({
            pwd: [
                /^[\w]{6,18}$/, '输入的不是6-12位字母和数字，而且不能出现空格！'
            ],
            rePwd: function(value, item) {
                if (value !== $('#userPw').val()) {
                    return '输入与上次密码不一致！'
                }
            },
        })
        //监听注册表单的提交事件
    $('#reg_form').on('submit', function(e) {
        var event = e || window.event;
        event.preventDefault();
        $.post("api/reguser", { username: $('#reg_form [name=userNa]').val(), password: $('#reg_form [name=userPw]').val() },
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);;
                }
                layer.msg(res.message);
                //模拟人的点击行为
                $('#link_login').click();
            },
        );
    });
    // $(document).on('keyup', function(e) {
    //     if (e.keyCode === 13 && $('.login_box').css('display')==='none') {
    //         $('#reg_form').submit();
    //     }$('#login_form').submit();
    // })
    $('#login_form').submit(function(e) {
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: 'api/login',
            //快速获取表单元素
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                console.log(res.token);
                //将得到的token值存入本地
                localStorage.setItem('token', res.token);
                //返回后台主页
                location.href = '/index.html';
            }
        })
    })
});