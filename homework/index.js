/************* js for index.html  *********************/
var getBoxes = function(num) {
    var htmlStr = [];
    for(var i = 0; i < num; i++) {
        var bgColor = '#' + getHex(i),
            linkNode = '<a href="image_change.html" class="box" style="background-color: ' + bgColor + '"></a> ';
        htmlStr.push(linkNode);
    }
    return htmlStr.join('');
}

var getHex = function(num) {
    var hex = num < 16 ? '0' + num.toString(16) : num.toString(16),
        result = hex + hex + hex;
    return result;
}

if(document.getElementById('boxes-wrap')) {
    var boxes = getBoxes(256);
    document.getElementById('boxes-wrap').innerHTML = boxes;
}









/***************** js source for image_change.html          *************************/
var img = document.getElementById('img-change');
if(img) {
    var srcs = [
        'http://img1.imgtn.bdimg.com/it/u=742207910,1417059551&fm=21&gp=0.jpg',
        'http://pic65.nipic.com/file/20150421/20828630_110622049000_2.jpg',
        'http://pic39.nipic.com/20140321/9448607_215633671000_2.jpg',
        'http://pic49.nipic.com/file/20140928/4949133_154705706000_2.jpg',
        'http://pic28.nipic.com/20130502/11772420_132015367131_2.jpg',
        'http://pic43.nipic.com/20140711/9301655_160101881000_2.jpg',
        'http://v1.qzone.cc/skin/201310/08/17/19/5253ce06a29c2425.jpg%21600x600.jpg',
        'http://pic19.nipic.com/20120323/485395_164257185000_2.jpg'
    ];
    var getRand = function(num) {
        return parseInt(Math.random() * num);
    }

    var changeSrc = function() {
        var randNum = getRand(srcs.length);
        img.src = srcs[randNum];
    }

    var loading = function() {
        document.body.innerHTML = "<h1>loading...</h1>";
        setTimeout(function() {
            window.location.href = "library.html";
        }, 3000);
    }

    changeSrc();
    img.addEventListener('mouseover', changeSrc);
    img.addEventListener('mouseout', changeSrc);
    img.addEventListener('click', loading);

}

