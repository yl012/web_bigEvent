$(function() {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;
    //定义过滤器 规范日期
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }

    function padZero(n) {
        return n > 9 ? n : `0${n}`;
    }

    //定义一个查询参数对象，请求数据的时候需要将请求的参数发送到服务器
    const obj = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的Id
        state: '', //文章发布的数据
    };
    initTable();
    initCate();
    //获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: 'my/article/list',
            data: obj,
            success(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取列表失败！');
                }
                //使用模板引擎渲染表格
                let strHtml = template('tp-table', res);
                $('tbody').html(strHtml);
                //当表格渲染完以后，渲染分页
                renderPage(res.total);
            }
        })
    }

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！');
                }
                let strHtml = template('tp-cates', res);
                $('[name="cate_id"]').html(strHtml);
                form.render()
            }
        })
    }

    //为筛选表单绑定事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        let cate_id = $('[name="cate_id"]').val();
        let state = $('[name="state"]').val();
        obj.cate_id = cate_id;
        obj.state = state;
        // console.log(obj);
        //重新渲染表单
        initTable();
    });

    //定义渲染分页方法
    function renderPage(total) {
        //渲染分页 只要调用laypage.render就会触发jump方法
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: obj.pagesize, //每页显示几个
            curr: obj.pagenum, //默认被选择的分页。
            limits: [2, 3, 5, 10],
            jump(o, first) {
                //把最新的页码值赋值给新的参数然后渲染表格
                obj.pagenum = o.curr;
                obj.pagesize = o.limit;
                // initTable();发生死循环，一直调用jump
                if (!first) {
                    initTable();
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

        });
    }

    //通过代理的形式绑定删除事件
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id');
        let countBtn = $('.btn-delete').length;
        console.log(countBtn);
        layer.confirm('是否删除?', function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: 'my/article/delete/' + id,
                success(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    //清除一个小bug
                    if (countBtn === 1) {
                        //如果页面只有一个删除按钮
                        if (obj.pagenum !== 1) {
                            obj.pagenum--;
                        }
                        obj.pagenum = 1;
                    }
                    initTable();
                    layer.msg('删除数据成功！');
                }
            })
            layer.close(index);
        });
    });


})