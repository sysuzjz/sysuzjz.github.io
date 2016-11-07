(function() {
    var canvasNode = document.getElementById("canvas"),
        WIDTH = canvasNode.width,
        HEIGHT = canvasNode.height,
        MAXLEVEL = 8;
    var controller = null,
        snakeBody = Array(),
        apple = new Position(0, 0),
        direction = new Position(1, 0),
        width = 20,
        height = 20,
        marks = 0,
        level = 1,
        markLevel = Array(10, 20, 30, 40, 50, 60, 70, 80),
        speed = Array(480, 360, 240, 180, 120, 90, 60, 30);
    /************************ 音乐模块 start *******************************/
    var music = document.getElementById('music'),
        sound = document.getElementById('sound'),
        musicController = document.getElementById('music-controller'),
        soundController = document.getElementById('sound-controller'),
        soundValid = true;

    // 背景音乐调小声
    music.volume = 0.3;
    music.play();

    musicController.onclick = function() {
        if (this.checked) {
            music.play();
        }
        else {
            music.pause();
        }
    }
    soundController.onclick = function() {
        soundValid = this.checked;
    }
    function alertSound() {
        if (!soundValid) {
            return;
        }
        if (!sound.currentTime || sound.ended) {
            sound.play();
        }
        else {
            sound.currentTime = 0;
        }
    }

    /************************ 音乐模块 end ********************************/

    var controlBtn = document.getElementById("btn-control");
    controlBtn.addEventListener("click", control);


    if(canvasNode.getContext) {
        var canvas = canvasNode.getContext("2d");
    }

    function Position(x, y) {
        return {
            x: x,
            y: y
        };
    }

    /**
     * 0 表示开始，1表示暂停，2表示继续
     */
    function control(event) {
        var type = event.target.getAttribute("data-type");
        switch(type) {
            case "0":
                init();
                run();
                setBtnParse();
                break;
            case "1":
                stop();
                setBtnContinue();
                break;
            case "2":
                run();
                setBtnParse();
                break;
            default:
                break;
        }
    }

    function setBtnStart() {
        controlBtn.innerHTML = "start";
        controlBtn.setAttribute("data-type", "0");
    }

    function setBtnParse() {
        controlBtn.innerHTML = "parse";
        controlBtn.setAttribute("data-type", "1");
    }

    function setBtnContinue() {
        controlBtn.innerHTML = "continue";
        controlBtn.setAttribute("data-type", "2");
    }

    function run() {
        controller = setInterval(act, speed[level - 1]);
        controlBtn.removeEventListener("onclick", control);
        document.addEventListener("keydown",keyDownEvent);
    }

    function stop() {
        clearInterval(controller);
        controller = null;
    }

    function init() {
        initLevel();
        while(snakeBody.length > 0) {
            snakeBody.pop();
        }
        for(var i = 3; i >= 0; i--) {
            snakeBody.push(new Position(i * width, 0));
        }
        randomApple();
        direction = new Position(1, 0);
        marks = 0;
    }

    function act() {
        draw();
        var nextPosition = getNextPosition();
        if(isInSnake(nextPosition) || isOutOfWall(nextPosition)) {
            stop();
            fail();
        } else if(isApple(nextPosition)) {
            alertSound();
            grow();
            randomApple();
            addMarks();
            levelControl();
        } else {
            moveForward();
        }
    }

    function initLevel() {
        var initLevel = parseInt(prompt("请设置等级；"));
        if(initLevel > 0 && initLevel <= MAXLEVEL) {
            level = initLevel;
        } else if(initLevel > MAXLEVEL) {
            level = MAXLEVEL;
        } else {
            level = 1;
        }

    }

    function draw() {
        // 清空重绘
        canvas.clearRect(0, 0, WIDTH, HEIGHT);
        drawBg();
        drawText();
        drawSnake();
        drawApple();
    }

    function drawBg() {
        var img = new Image();
        img.src = './background.jpeg';
        canvas.globalCompositeOperation = 'source-over';
        canvas.globalAlpha = 0.25;
        canvas.drawImage(img, 0, 0, WIDTH, HEIGHT);
        canvas.globalAlpha = 1;
    }

    function drawText() {
        canvas.font = "20px Arial";
        canvas.textAlign = "left";
        canvas.fillStyle = "#000";
        canvas.fillText("分数：" + marks, 20, 20);
        canvas.fillText("等级：" + level, 20, 50);
    }

    function drawSnake() {
        // 蛇头
        var snakeHead = snakeBody[0];
        canvas.arc(snakeHead.x + width / 2, snakeHead.y + height / 2, width / 2, 0, Math.PI*2, true); 
        canvas.fillStyle = "green";
        canvas.fill();
        // 绘制蛇身
        for(var i = 1, len = snakeBody.length; i < len; i++) {
            var body = snakeBody[i];
            canvas.fillRect(body.x, body.y, width, height);
        }
    }

    function drawApple() {
        canvas.beginPath();
        // canvas.arc(apple.x + width / 2, apple.y + height / 2, width / 2, 0, Math.PI*2, true); 
        // canvas.fillStyle = "red";
        var img = new Image();
        img.src = './banana.png';
        canvas.globalCompositeOperation = 'destination-over';
        canvas.drawImage(img, apple.x, apple.y, width, height);
        canvas.fill();
    }

    function randomApple() {
        while(isInSnake(apple)) {
            var randomX = ~~(Math.random() * (WIDTH / width)) * width,
                randomY = ~~(Math.random() * (HEIGHT / height)) * height;
            apple = new Position(randomX, randomY);
        }
    }

    function isInSnake(position) {
        for(var count = 0, len = snakeBody.length; count < len; count++) {
            var current = snakeBody[count];
            if(Math.abs(position.x - current.x) < width && Math.abs(position.y - current.y) < height) {
                return true;
            }
        }
        return false;
    }

    function keyDownEvent(event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        var dir = "";
        if(keyCode === 37 || keyCode === 65) { // ← 或 A
            dir = "left";
        } else if(keyCode === 38 || keyCode === 87) {
            dir = "up";
        } else if(keyCode === 39 || keyCode === 68) {
            dir = "right";
        } else if(keyCode === 40 || keyCode === 83) {
            dir = "down";
        }
        updateDirection(dir);
    }

    function updateDirection(dir) {
        switch(dir) {
            case "up":
                direction = new Position(0, -1);
                break;
            case "right":
                direction = new Position(1, 0);
                break;
            case "down":
                direction = new Position(0, 1);
                break;
            case "left":
                direction = new Position(-1, 0);
                break;
            default:
                break;
        }
    }

    function getNextPosition(dir) {
        dir = dir || direction;
        var head = snakeBody[0],
            nextPosition = new Position(head.x + dir.x * width, head.y + dir.y * height);
        return nextPosition;
    }

    function isApple(position) {
        return Math.abs(position.x - apple.x) < width && Math.abs(position.y - apple.y) < height;
    }

    function isOutOfWall(position) {
        return position.x < 0 || (position.x + width > WIDTH) || position.y < 0 || (position.y + height > HEIGHT);
    }

    function moveForward() {
        var nextPosition = getNextPosition(direction);
        snakeBody.unshift(nextPosition);
        snakeBody.pop();
    }

    function grow() {
        snakeBody.unshift(apple);
    }

    function addMarks(mark) {
        mark = mark || 1;
        marks += mark;
    }

    function levelControl() {
        if(marks >= markLevel[level] && level < markLevel.length - 1 && level + 1 <= MAXLEVEL) {
            level++;
            speedUp();
        }
    }

    function speedUp() {
        stop();
        run();
    }

    function fail() {
    	// 先draw再弹窗
    	setTimeout(function() {
	        alert("您输了");
	        setBtnStart();
    	},10);
    }


})()
