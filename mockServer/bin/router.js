/* homer 2018/11/20
*  路由文件router
*  根据mock里的结构来建立对应的请求路由
*  建立上传文件的路由，保存位置为 mockServer/upload，没有此目录会自动创建
*  2019/02/11
*  添加了post请求的mock
*  扩展了请求的返回的数据的能力（可以使用函数动态返回）
*  添加了校验请求数据的功能
* */
const express = require('express');
const router = express.Router();
const mock = require('../mock.js');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({ // 配置multer，即上传文件的保存位置
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../upload');
    fs.access(dir, (err) => {
      if (!err) { // 有点话直接保存
        cb(null, './mockServer/upload');
      } else { // 如果不存在upload目录就创建一个
        fs.mkdirSync(dir);
        cb(null, './mockServer/upload');
      }
    })
  },
  filename: function (req, file, cb) { // 如何取文件名
    const extReg = /\.\w+$/;
    const extName = extReg.exec(file.originalname);
    cb(null, file.originalname + '-' + Date.now() + extName); // 原名+时间戳+扩展名
  }
});
const upload = multer({storage});

// polyfill of Object.keys()
if (!Object.keys) {
  Object.keys = (function () {
    const hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

      const result = [];

      for (let prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
      }

      if (hasDontEnumBug) {
        for (let i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
      }
      return result;
    }
  })()
}
const pathList = Object.keys(mock); // 根据mock键名建立路径表

router.get('/mock/:path', function (req, res, next) { // mock的get请求
  const key = req.params.path;
  if (pathList.includes(key)) { // 存在路径则返回对应数据，没有则会被404捕获
    if (mock[key].validate && typeof mock[key].validate === 'function') { // 检查是否需要用validate
      if (mock[key].validate(req)) {
        res.status(200);
        const backData = typeof mock[key].data === 'function' ? mock[key].data(req) : mock[key].data;
        res.send(backData);
      } else {
        throw new Error('invalidInput')
      }
    } else {
      res.status(200); // 根据mock的data类型返回数据
      const backData = typeof mock[key].data === 'function' ? mock[key].data(req) : mock[key].data;
      res.send(backData);
    }
    return
  }
  next();
});
router.post('/mock/:path', function (req, res, next) {
  const key = req.params.path;
  if (pathList.includes(key)) { // 存在路径则返回对应数据，没有则会被404捕获
    if (mock[key].validate && typeof mock[key].validate === 'function') {
      if (mock[key].validate(req)) {
        res.status(200);
        const backData = typeof mock[key].data === 'function' ? mock[key].data(req) : mock[key].data;
        res.send(backData);
      } else {
        throw new Error('invalidInput')
      }
    } else {
      res.status(200);
      const backData = typeof mock[key].data === 'function' ? mock[key].data(req) : mock[key].data;
      res.send(backData);
    }
    return
  }
  next();
});

router.post('/upload', upload.array('files'), function (req, res, next) {
  res.status(200);
  res.send({
    statusCode: 200,
    message: 'upload success!'
  });
});
module.exports = router;
