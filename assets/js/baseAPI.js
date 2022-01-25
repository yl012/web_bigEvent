//注意：每次调用$.get()或者$.post或者$.ajax()时候
//会优先调用此函数
//在此函数中，可以拿到我没给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007/' + options.url;
    console.log(options.url);
});