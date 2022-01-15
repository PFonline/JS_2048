var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var numArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

var mimibutton = document.getElementById('mimibutton');
var socrebutton = document.getElementById('socrebutton');
var newgamebutton = document.getElementById('newgamebutton');
var overShowNew = document.getElementById('overShowNew');
var voicebutton = document.getElementById('voicebutton');
var overShow = document.getElementById('overShow');
var lastScore = document.getElementById('lastScore');
var scoreShow = document.getElementById('score');
var audioCon = document.getElementById('audioCon'); /*音频*/
var isMobile = false;
const size = 4;
var score = 0;
var flag = 0; /*判断是否达到2048*/
var voiceFlag = 1; /*默认有声音*/
var DownPoint = {
    x: 0,
    y: 0
}
var UpPoint = {
    x: 0,
    y: 0
}
canvas.width = canvas.width;
/*板面*/
ctx.fillStyle = '#bbada0';
ctx.fillRect(0, 0, 500, 500);
/*判断移动端*/
var userAgentInfo = navigator.userAgent.toLowerCase();
var Agents = ["android","iphone",
    "symbianos", "windows phone",
    "ipad", "ipod"];
for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) >= 0) {
        isMobile = true;
    }
}
aboutbutton.onclick = function () {
	xtip.win({type:'alert', tip:'描述：2048小游戏<br>作者：Linpure<br>时间：2017-11-11<br>更新时间：2022-1-15<br>主页：<a href="https://gitee.com/linpure" target="_blank">gitee</a><br>吾爱：<a href="https://www.52pojie.cn/?694168" target="_blank">白小飞V</a>', icon:'a', title:'关于',shade:false, min:true});
}
mimibutton.onclick = function () {
	xtip.win({type:'alert', tip:'上滑：move(0,size)<br>下滑：move(1,size)<br>左滑：move(2,size)<br>右滑：move(3,size)<br>重玩：NewGame()<br>排名：loadScore()<br>静音：CloseVoice()<br>绘制：DrawCell()<br>绘格：DrawOneCell(i,j)<br>数据：numArray[i][j]<br>分数：saveScore(maxNum, score)<br>', icon:'a', title:'指令',shade:false, min:true});
}
socrebutton.onclick = function () {
	loadScore();
}
newgamebutton.onclick = function () {
    NewGame();
}
voicebutton.onclick = function () {
	CloseVoice();
}



/*绘制一个格子*/
function DrawOneCell(i,j) {
    var dis = 12;
    var width = 110;
    var x = (j + 1) * dis + j * width;
    var y = (i + 1) * dis + i * width;
    switch (numArray[i][j]) {
        case 0:
            ctx.fillStyle = '#ccc0b3';
            break;
        case 2:
            ctx.fillStyle = '#eee4da';
            break;
        case 4:
            ctx.fillStyle = '#ede0c8';
            break;
        case 8:
            ctx.fillStyle = '#f2b179';
            break;
        case 16:
            ctx.fillStyle = '#f59563';
            break;
        case 32:
            ctx.fillStyle = '#f67c5f';
            break;
        case 64:
            ctx.fillStyle = '#f65e3b';
            break;
        case 128:
            ctx.fillStyle = '#edcf72';
            break;
        case 256:
            ctx.fillStyle = '#ff9900';
            break;
        case 512:
            ctx.fillStyle = '#9c0';
            break;
        case 1024:
            ctx.fillStyle = '#33b5e5';
            break;
        case 2048:
            ctx.fillStyle = '#8e7cc3';//09c
            break;
        case 4096:
            ctx.fillStyle = '#a6c';
            break;
        case 8192:
            ctx.fillStyle = '#93';
            break;
    }
    ctx.fillRect(x, y, width, width);
    if (numArray[i][j] !== 0) {
        ctx.fillStyle = '#000';
        ctx.font = "50px Arial";
        var fontWidth = ctx.measureText(numArray[i][j]).width;
        ctx.fillText(numArray[i][j], x + (width - fontWidth) / 2, y + 70);
    }
}
/*绘制小格*/
var DrawCell = function () {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            DrawOneCell(i,j);
        }
    }
}


/*新游戏*/
var NewGame = function () {
    score = 0;
    ScoreFun();
    numArray = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    //				numArray = [[4,4,8,16],[2,8,16,32],[4,2,32,64],[128,256,32,4]];
    NewNum(2, 1);
    DrawCell();
    /*电脑端鼠标滑动事件*/
	canvas.addEventListener('mousedown', mousedown_pc);
	canvas.addEventListener('mouseup', mouseup_pc);
	/*手机端滑动事件*/
	canvas.addEventListener('touchstart', touchstart_phone);
	canvas.addEventListener('touchend', touchend_phone);
	/*阻止默认事件*/
	window.addEventListener('touchmove', function (e) {
		e.preventDefault();
	})
	/*键盘事件监听*/
	document.addEventListener('keydown', keydown_pc);
}

/*电脑端鼠标滑动事件*/
function mousedown_pc (e) {
	DownPoint.x = e.clientX;
	DownPoint.y = e.clientY;
}
function mouseup_pc (e) {
	UpPoint.x = e.clientX;
	UpPoint.y = e.clientY;
	JudgeEvent();
}
/*手机端滑动事件*/
function touchstart_phone (e) {
	DownPoint.x = e.changedTouches[0].clientX;
	DownPoint.y = e.changedTouches[0].clientY;
}
function touchend_phone (e) {
	UpPoint.x = e.changedTouches[0].clientX;
	UpPoint.y = e.changedTouches[0].clientY;
	JudgeEvent();
}
/*键盘事件监听*/
function keydown_pc (event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	console.log(e.keyCode);
	if (e.keyCode<41&&e.keyCode>36) { //上38左37下40右39
		JudgeEvent(e.keyCode);
	}
};

/*分数*/
var ScoreFun = function () {
    scoreShow.innerHTML = score;
}
/*声音*/
var SoundFun = function () {
    audioCon.cloneNode().play();
}
/*静音*/
function CloseVoice() {
	if (voiceFlag === 1) {
		voicebutton.style.backgroundImage = 'url(./public/images/noVoice.png)';
		/*静音*/
		audioCon.src = './public/audio/noVoice.mp3';
		voiceFlag = 0;
	} else {
		voicebutton.style.backgroundImage = 'url(./public/images/voice.png)';
		/*声音*/
		audioCon.src = './public/audio/voice.mp3';
		voiceFlag = 1;
	}
}

/*移动事件判断*/
function JudgeEvent(num) {
    var dX = UpPoint.x - DownPoint.x;
    var dY = UpPoint.y - DownPoint.y;
    var direct = -1;
    if ((dY < 0 && Math.abs(dX) < Math.abs(dY)) || num == 38) {   
        direct = 0;
    } else if ((dY > 0 && Math.abs(dX) < Math.abs(dY)) || num == 40) {
        direct = 1;
    } else if ((dX < 0 && Math.abs(dX) > Math.abs(dY)) || num == 37) {
        direct = 2;
    } else if ((dX > 0 && Math.abs(dX) > Math.abs(dY)) || num == 39) {
        direct = 3;
    }
    if (GameOver()==false) {
        switch (direct) {
            case 0:
                if (CanUp()) {
                    oneStep(direct);
                }
                break;
            case 1:
                if (CanDown()) {
                    oneStep(direct);
                }
                break;
            case 2:
                if (CanLeft()) {
                    oneStep(direct);
                }
                break;
            case 3:
                if (CanRight()) {
                    oneStep(direct);
                }
                break;                        
            default:
                break;
        }
    } else {
        xtip.win({type:'confirm', tip:'就差一点点了，太遗憾了！<br>本次分数：'+ score +'<br>最大数：'+getMaxNum()+'<br>'+'提交分数，再来一次？',icon:'a',shade:true,shadeClose:false,btn1:function(){
        	lastScore.innerHTML = score;
        	saveScore(getMaxNum(), score);
        	canvas.removeEventListener("mousedown", mousedown_pc);
        	canvas.removeEventListener("mouseup", mouseup_pc);
        	canvas.removeEventListener('touchstart', touchstart_phone);
			canvas.removeEventListener('touchend', touchend_phone);
        	document.removeEventListener('keydown', keydown_pc);
        	NewGame();
        	} 
		});
    }
}

/*单次移动*/
function oneStep(direct) {
    if (direct!=-1) {
        move(direct,size);
        merge(direct,size);
        move(direct,size);  
        DrawCell();    
        SoundFun();
        ScoreFun();
        IsTarget();
        if (zeroNum() > 0) {
            var indexArr = NewNum(1, 0.5);//2和4概率0.5
            setTimeout(function() {
                for (let i = 0; i < indexArr.length; i++) {
                    DrawCell(indexArr[i].randX,indexArr[i].randY)                   
                }
            },100);
        } 
		return true
   }
   return false;
}

/*可以上划*/
var CanUp = function () {
    var flag = 0; //记录不能移动的列数
    for (var j = 0; j < size; j++) {
        for (var i = 1; i < size; i++) {
            if (numArray[i][j] !== 0) {
                if (numArray[i-1][j] === 0 || numArray[i][j] === numArray[i-1][j]) {
                    return true;
                }
            }
        }
        flag++;
    } /*if(flag===size){return false}else return true;*/
    return !(flag === size);
}

/*可以下划*/
var CanDown = function () {
    var flag = 0; //记录不能移动的列数
    for (var j = 0; j < size; j++) {
        for (var i = size - 2; i >= 0; i--) {
            if (numArray[i][j] !== 0) {
                if (numArray[i+1][j] === 0 || numArray[i][j] === numArray[i+1][j]) {
                    return true;
                }
            }
        }
        flag++;
    } /*if(flag===size){return false}else return true;*/
    return !(flag === size);
}
/*可以左划*/
var CanLeft = function () {
    var flag = 0; //记录不能移动的行数
    for (var i = 0; i < size; i++) {
        for (var j = 1; j < size; j++) {
            if (numArray[i][j] !== 0) {
                if (numArray[i][j-1] === 0 || numArray[i][j] === numArray[i][j-1]) {
                    return true;
                }
            }
        } /*if(flag===size){return false}else return true;*/
        flag++;
    }
    return !(flag === size);
}
/*可以右划*/
var CanRight = function () {
    var flag = 0; //记录不能移动的行数
    for (var i = 0; i < size; i++) {
        for (var j = size - 2; j >= 0; j--) {
            if (numArray[i][j] !== 0) {
                if (numArray[i][j+1] === 0 || numArray[i][j] === numArray[i][j+1]) {
                    return true;
                }
            }
        } /*if(flag===size){return false}else return true;*/
        flag++;
    }
    return !(flag === size);
}

/*合并操作*/
function merge(direct,size){
	var change = false;//表明合并过程中格盘是否有变化
	// var score = parseInt(document.getElementById("score").innerHTML, 10);
    if(direct==0){//上
        for(var i=0;i<size-1;i++){
			for(var j=0;j<size;j++){
                if (numArray[i][j]==numArray[i+1][j]) {
                    score+=numArray[i+1][j]*2;
                    numArray[i][j]=numArray[i+1][j]*2;
                    numArray[i+1][j]=0;
                    change = true;
                }
            }
        }
	}
	else if(direct==1){//下
		for(var i=size-1;i>0;i--){
			for(var j=0;j<size;j++){
                if (numArray[i][j]==numArray[i-1][j]) {
                    score+=numArray[i-1][j]*2;
                    numArray[i][j]=numArray[i-1][j]*2;
                    numArray[i-1][j]=0;
                    change = true;
                }
            }
        }
	}
	else if(direct==2){//左
		for(var i=0;i<size;i++){
			for(var j=0;j<size-1;j++){
                if (numArray[i][j]==numArray[i][j+1]) {
                    score+=numArray[i][j+1]*2;
                    numArray[i][j]=numArray[i][j+1]*2;
                    numArray[i][j+1]=0;
                    change = true;
                }
            }
        }
	}
	else if(direct==3){//右
		for(var i=0;i<size;i++){
			for(var j=size-1;j>0;j--){
                if (numArray[i][j]==numArray[i][j-1]) {
                    score+=numArray[i][j-1]*2;
                    numArray[i][j]=numArray[i][j-1]*2;
                    numArray[i][j-1]=0;
                    change = true;
                }
            }
        }
	}
	// document.getElementById("score").innerHTML=score;
	return change;
}

// 二维数组转置
function transpose(mat) { 
    for (var i = 0; i < mat.length; i++) { 
        for (var j = 0; j < i; j++) { 
            const tmp = mat[i][j]; 
            mat[i][j] = mat[j][i]; 
            mat[j][i] = tmp; 
        } 
    } 
} 

/*游戏结束*/
function GameOver() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (numArray[i][j] == 0) {
                return false;
            }
            if (j<size-1) {
                if (numArray[i][j] == numArray[i][j+1]) {
                    return false;
                }
            }
            if (i<size-1) {
                if (numArray[i][j] == numArray[i+1][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}
/*当前的0个数*/
function zeroNum() {
    var allNum = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (numArray[i][j] == 0) {
                allNum++;
            }
        }
    }
    return allNum;
}

/*生成num个数字*/
function NewNum (num, pr) {  
    var indexArr = [];
    while (num != 0) {
        var randX = parseInt(Math.floor(Math.random() * 4));
        var randY = parseInt(Math.floor(Math.random() * 4));
        var randNumber = Math.random() < pr ? 2 : 4;
        if (numArray[randX][randY] == 0) {
            numArray[randX][randY] = randNumber;
            num--;
            indexArr.push({randX,randY});
        }
    }
    return indexArr;//生成
}

/*寻找最大值*/
function getMaxNum(){
	var max = 2;
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (numArray[i][j] > max){
				max = numArray[i][j];
			}
		}
	}
	return max;
}

/*检查是否达到2048*/
var IsTarget = function () {
    if (flag === 0) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (numArray[i][j] === 2048) {
                    //alert('哇哦~~ 2048！你好棒哦！！！加油！');
                    $('.wrapperSuc').show();
                    setTimeout(function(){$('.wrapperSuc').hide()}, 3000);
                    flag = 1;
                    break;
                }
            }
        }
    }
}
/*方向移动*/
function move(direct,size){
    var change = false;
	switch (direct) {
        case 0://上
            transpose(numArray);
            for (let i = 0; i < size; i++) {
                numArray[i] = numArray[i].filter(item => item != 0);
                while(numArray[i].length != size){
                    numArray[i].push(0);
                    change = true;
                }
            }
            transpose(numArray);
			break;
        case 1://下
            transpose(numArray);
            for (let i = 0; i < size; i++) {
                numArray[i] = numArray[i].filter(item => item != 0);
                while(numArray[i].length != size){
                    numArray[i].unshift(0);
                    change = true;
                }
            }
            transpose(numArray);
			break;
        case 2://左
            for (let i = 0; i < size; i++) {
                numArray[i] = numArray[i].filter(item => item != 0);
                while(numArray[i].length != size){
                    numArray[i].push(0);
                    change = true;
                }
            }
			break;
        case 3://右
            for (let i = 0; i < size; i++) {
                numArray[i] = numArray[i].filter(item => item != 0);
                while(numArray[i].length != size){
                    numArray[i].unshift(0);
                    change = true;
                }
            }
			break;
		default:
            console.log("error");
            break;
    }
    // return change;
}


// 保存分数记录
function saveScore(maxNum, score){
    var obj = {"maxNum": maxNum,"score": score};
    obj = JSON.stringify(obj); //转化为JSON字符串
    localStorage.setItem(getTime(), obj);
    // console.log("保持分数完成");
    xtip.msg('分数已保存！');
}

// 获取分数记录
function loadScore(){
    var response = [];
    for(var i = 0; i < localStorage.length; i++){
        if(localStorage.key(i).length!=19)
        {
            continue;
        }
        var cur = localStorage.getItem(localStorage.key(i));
        var obj = JSON.parse(cur); 
        response.push(obj.maxNum+"_"+obj.score+"_"+localStorage.key(i));
    }

    var data = scoreList(response);
    var scoreMsg = '<table border="1" width="100%"  cellpadding="0" cellspacing="0"><tr><td width="15%"  align="center">排名</td><td width="15%"  align="center">最值</td><td width="15%"  align="center">总分</td><td width="55%"  align="center">时间</td></tr>';
    for (var i = 0; i < data.length; i++) {
        scoreMsg += '<tr><td align="center">'+(i+1)+'</td><td align="center">'+data[i].maxNum+'</td><td align="center">'+data[i].score+'</td><td align="center">'+data[i].time+'</td></tr>';
    }
    scoreMsg +='</table>';
    xtip.win({
        type: 'confirm', //alert 或 confirm
        btn: ['清空排名'],
        tip: scoreMsg,
        icon: '',
        title: "排行榜",
        min: true,
        width: isMobile == true ? '80%':'500px',
        shade: false,
        shadeClose: true,
        lock: false,
        zindex: 99999,
        btn1: function(){
            localStorage.clear();
            xtip.msg('排名数据已清空！');
        }
    });
}


/*分数排序*/
function scoreList(data){
	var arr =[];
	for (let t = 0; t < data.length; t++) {
		var temp ={maxNum:data[t].split('_')[0],score:data[t].split('_')[1],time:data[t].split('_')[2]};
		arr.push(temp);
	}
	arr.sort(function (x,y) {
        return y.score-x.score;
    });
    return arr;
}
/**
 *获取当前时间
 *"2020-02-18 13:3:31"
 * @
 */
function getTime() {
    var date = new Date();
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
    h = date.getHours() < 10 ? '0'+date.getHours() : date.getHours() + ':';
    m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes() + ':';
    s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
    //console.log(Y+M+D+h+m+s);
    return Y+M+D+' '+h+m+s;
}

/*开始游戏*/
NewGame();
