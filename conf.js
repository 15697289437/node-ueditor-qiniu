/**
 * Created by pengwei on 16/5/2.
 */
var conf={
    ACCESS_KEY : '<PLEASE APPLY YOUR ACCESS KEY>',
    SECRET_KEY : '<DONT SEND YOUR SECRET KEY TO ANYONE>',
    UP_HOST : 'http://upload.qiniu.com',
    RS_HOST : 'http://rs.qiniu.com',
    RSF_HOST : 'http://rsf.qiniu.com',
    RPC_TIMEOUT : 3600000,
    API_HOST : 'http://api.qiniu.com'
};
module.exports=conf;
exports.bucket="";
//访问链接
exports.urlhost="";
//保存位置
exports.savelocal=false;
//图片处理
exports.imageps="";