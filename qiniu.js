/**
 * Created by pengwei on 16/4/28.
 */
var qiniu = require("qiniu");
var path = require('path');
var url = require('url');
var conf = require('./conf');

//需要填写你的 Access Key 和 Secret Key
// qiniu.conf.ACCESS_KEY = 'XhjrTWRsK2NvOCVVO-MhKmRfzZkyvNkIqFwcSwuh';
// qiniu.conf.SECRET_KEY = 'pYYQBtf1bcC5C-ltckCmfKpSnlCZqBG7lEg4HwBZ';
//



class Qiniu{

    constructor(res,localFile,file){
        //本地文件
        this.localFile=localFile;
        //上传的文件名
        this.file=file;
        this.res=res;
    }
    //获取token
    uptoken() {
        qiniu.conf.ACCESS_KEY=conf.ACCESS_KEY;
        qiniu.conf.SECRET_KEY=conf.SECRET_KEY;
        var putPolicy = new qiniu.rs.PutPolicy(conf.bucket+":"+this.file);
        return putPolicy.token();
    }
    uploadFile() {
        //上传文件
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(this.uptoken(), this.file, this.localFile, extra, (err, ret)=> {
            if(!err) {
                // 上传成功， 处理返回值>ueditor
                this.res.json({
                    'url': url.resolve(conf.urlhost, ret.key),
                    'title': "",
                    'original': ret.key,
                    'state': 'SUCCESS'
                });
            } else {
                // 上传失败， 处理返回代码>ueditor
                this.res.json({
                    'url': url.resolve(conf.urlhost, ret.key),
                    'title': "",
                    'original': ret.key,
                    'state': 'ERROR'
                });
            }
        });
    }
    list(prefix=''){
        qiniu.conf.ACCESS_KEY=conf.ACCESS_KEY;
        qiniu.conf.SECRET_KEY=conf.SECRET_KEY;
        //列举库下的全部文件
        new qiniu.rsf.listPrefix(conf.bucket,prefix,'',1000,'',(err,result)=>{
            let _list=[];
            result.items&&result.items.forEach((e)=>{
                _list.push({url:url.resolve(conf.urlhost, e.key)})
            });
            this.res.json({
                "state": "SUCCESS",
                "list": _list,
                "start": 1,
                "total":result.items&& result.items.length
            })
        })
    }
}

module.exports=Qiniu;