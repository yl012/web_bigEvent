//注意：每次调用$.get()或者$.post或者$.ajax()时候
//会优先调用此函数
//在此函数中，可以拿到我没给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007/' + options.url;
    // console.log(options.url);

    if (options.url.indexOf('/my') !== -1) {
        //统一为有权限的接口设置header请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        };
    }
    //全局挂载一个complete函数
    //无论成功还是失败都会调用此函数
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清除token
            localStorage.removeItem('token');
            //跳转会登录页面
            location.href = '/login.html';
        }
    }


});