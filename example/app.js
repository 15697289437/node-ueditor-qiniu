/**
 * Created by pengwei on 16/5/2.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// var nuq = require("node-ueditor-qiniu");
var nuq = require("../index");
nuq.conf.ACCESS_KEY='xxxx';
nuq.conf.SECRET_KEY='xxxx';
nuq.conf.urlhost='xxxx';
nuq.conf.bucket='xxxx';
nuq.conf.savelocal=true;  //保存七牛和本地 默认只保存到七牛

var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//ueditor访问的地址
app.use("/ueditor/ue", nuq.ueditor(path.join(__dirname, 'public'), function(req, res, next) {

    // ueditor 客户发起上传请求

    if(req.query.action.indexOf('upload')===0){
        var dir_url = './upload/';        //本地保存路径
        res.ue_up(dir_url);
    }
    //  客户端发起列表请求
    else if (req.query.action.indexOf('list')===0){
        res.ue_list(req.query.action) // 客户端会列出所有文件
    }
    // 客户端发起其它请求
    else {

        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/config.json')
    }}));

app.get('/ueditor', function(req,res){
    res.render("ueditor");
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});


