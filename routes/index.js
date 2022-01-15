var express = require('express');
var router = express.Router();
var fs = require("fs");
var readline = require('readline');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 保存分数
router.post('/saveScore', function(req, res){
	let type = req.body.type;
	if (type == 'save') {
		let contentStr = req.body.maxNum +'_'+req.body.score+'_'+req.body.time+'\n';
		fs.appendFile(__dirname + '/files/socre.txt', contentStr,  function(err) {
			if (err) {
				return console.error(err);
			}
			console.log("分数保存成功！");
			res.send('分数保存成功！');
		});
	} else if (type == 'load') {
		readFileToArr(__dirname + '/files/socre.txt', function(data){
			//console.log(data);
			res.send(data);
		});
	}
});


/*
* 按行读取文件内容
* 返回：字符串数组
* 参数：fReadName:文件名路径
*      callback:回调函数
* */
function readFileToArr(fReadName,callback){
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var arr = new Array();
    objReadline.on('line',function (line) {
        arr.push(line);
        //console.log('line:'+ line);
    });
    objReadline.on('close',function () {
       // console.log(arr);
        callback(arr);
    });
}

module.exports = router;
