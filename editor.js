var Busboy = require('busboy');
var fs = require('fs');
var fse = require('fs-extra');
var os = require('os');
var path = require('path');
var conf = require('./conf');
var Qiniu=require('./qiniu');
var snowflake = require('node-snowflake').Snowflake;
var ueditor = function(static_url, handel) {
  return function(req, res, next) {
    var _respond = respond(static_url, handel);
    _respond(req, res, next);
  };
};
var respond = function(static_url, callback) {
  return function(req, res, next) {
    if (req.query.action === 'config') {
      callback(req, res, next);
      return;
    }
    else if (req.query.action.indexOf('list')===0) {
      //查找前缀的
      var type=req.query.action.replace('list','');
      res.ue_list = function() {
        //获取文件列表
        new Qiniu(res).list(type);
      };
      callback(req, res, next);
    }
    else if (req.query.action.indexOf('upload')===0) {
      var type=req.query.action.replace('upload','');
      var busboy = new Busboy({
        headers: req.headers
      });

      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        req.ueditor = {};
        req.ueditor.fieldname = fieldname;
        req.ueditor.file = file;
        req.ueditor.filename = filename;
        req.ueditor.encoding = encoding;
        req.ueditor.mimetype = mimetype;
        res.ue_up = function(img_url) {
          var tmpdir = path.join(os.tmpDir(), path.basename(filename));
          var name = snowflake.nextId() + path.extname(tmpdir);
          file.pipe(fs.createWriteStream(tmpdir));
          //用前缀来分类
          var prefix=type;
          //上传文件
          new Qiniu(res,tmpdir,prefix+name).uploadFile();
          //删除本地文件
          fs.unlink(tmpdir);
        };
        callback(req, res, next);
      });
      req.pipe(busboy);
    }
    else {
      callback(req, res, next);
    }
    return;
  };
};
module.exports = ueditor;