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
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou.jpg',
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou-001.jpg',
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou-002.jpg',
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou-003.jpg',
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou-004.jpg',
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou-005.jpg',
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou-006.jpg',
        'http://img.ivsky.com/img/tupian/pre/201509/06/haitan_de_shitou-007.jpg'
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
            window.location.href = "toall.htm";
        }, 3000);
    }

    changeSrc();
    img.addEventListener('mouseover', changeSrc);
    img.addEventListener('mouseout', changeSrc);
    img.addEventListener('click', loading);
    setInterval(changeSrc, 2000);

}

