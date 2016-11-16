(function() {
	var canvas = document.querySelector('#canvas'),
		context = canvas.getContext('2d'),
		width = canvas.width,
		height = canvas.height;
	// 方块边长
	var length = 20,
		maxCol = Math.floor(width / length),
		minCol = 10,
		maxRow = Math.floor(height / length),
		minRow = 10,
		maxMine = 99,
		minMine = 10;

	// 方块内容，1表示有雷，0表示无雷，2表示翻过
	var dataSet = [];

	// 宽高雷数
	var colNum = 10,
		rowNum = 10,
		mineNum = 10;

	/*********  控制部分start  ***************/
	var colInput = document.querySelector('#input-col'),
		rowInput = document.querySelector('#input-row'),
		mineInput = document.querySelector('#input-mine');
	document.querySelector('#btn-low').onclick = function() {
		colInput.value = colNum = 10;
		rowInput.value = rowNum = 10;
		mineInput.value = mineNum = 10;
		start();
	};
	document.querySelector('#btn-medium').onclick = function() {
		colInput.value = colNum = 25;
		rowInput.value = rowNum = 25;
		mineInput.value = mineNum = 40;
		start();
	};
	document.querySelector('#btn-high').onclick = function() {
		colInput.value = colNum = 50;
		rowInput.value = rowNum = 25;
		mineInput.value = mineNum = 99;
		start();
	};
	document.querySelector('#btn-custom').onclick = function() {
		colNum = checkNum(+colInput.value, minCol, maxCol);
		rowNum = checkNum(+rowInput.value, minRow, maxRow);
		mineNum = checkNum(+mineInput.value, minMine, maxMine);
		start();
	};
	/*********  控制部分end ***************/

	function checkNum(source, min, max) {
		if (isNaN(source)) {
			return min;
		}
		if (source < min) {
			return min;
		}
		if (source > max) {
			return max;
		}
		return source;
	}

	function start() {
		draw();
		initData();
		initEvent();
	}

	function draw() {
		context.clearRect(0, 0, width, height);
		context.strokeStyle = '#777';
		context.beginPath();
		for (var col = 0; col <= colNum; col++) {
			console.log(col * length, rowNum * length)
			context.moveTo(col * length, 0);
			context.lineTo(col * length, rowNum * length);
			context.stroke();
		}
		for (var row = 0; row <= rowNum; row++) {
			context.moveTo(0, row * length);
			context.lineTo(colNum * length, row * length);
			context.stroke();
		}
		context.closePath();
	}

	function initData() {
		dataSet = [];
		for (var col = 0; col < colNum; col++) {
			if (!dataSet[col]) {
				dataSet[col] = [];
			}
			for (var row = 0; row < rowNum; row++) {
				dataSet[col][row] = 0;
			}
		}
		for (var mine = 0; mine < mineNum; mine++) {
			var randomCoordinate = getRandomCoordinate();
			while (dataSet[randomCoordinate.x][randomCoordinate.y] === 1) {
				randomCoordinate = getRandomCoordinate();
			}
			dataSet[randomCoordinate.x][randomCoordinate.y] = 1;
		}
	}
	function getRandomCoordinate() {
		return {
			x: Math.floor(Math.random() * colNum),
			y: Math.floor(Math.random() * rowNum)
		};
	}
	function initEvent() {
		canvas.removeEventListener('click', clickHandler);
		canvas.addEventListener('click', clickHandler, false);
	}
	function clickHandler(e) {
		var coordinate = getCoordinate(e.offsetX, e.offsetY);
		// 范围之外
		if (!coordinate) {
			return false;
		}

		if (isMine(coordinate.x, coordinate.y)) {
			fail();
		}
		else {
			check(coordinate.x, coordinate.y);
		}

	}
	function getCoordinate(x, y) {
		var maxX = colNum * length,
			maxY = colNum * length;
		if (x <= 0 || x >= maxX || y <= 0 || y >= maxY) {
			return null;
		}
		return {
			x: Math.floor(x / length),
			y: Math.floor(y / length)
		}
	}

	function isMine(x, y) {
		return dataSet[x][y] === 1;
	}

	function isNew(x, y) {
		return dataSet[x][y] === 0;
	}

	function check(x, y) {
		var surrounding = getSurrounding(x, y);
		showNum(x, y, surrounding.mineNum);
		if (surrounding.mineNum > 0) {
			checkSuccess();
		}
		else if (surrounding.data.length > 0) {
			expand(surrounding.data);
		}
	}
	function getSurrounding(x, y) {
		var minX = x === 0 ? 0 : x - 1,
			maxX = x === colNum - 1 ? x : x + 1,
			minY = y === 0 ? 0 : y - 1,
			maxY = y === rowNum - 1 ? y : y + 1;

		var mineNum = 0,
			data = [];
		for (var i = minX; i <= maxX; i++) {
			for (var j = minY; j <= maxY; j++) {
				if (i === x && j === y) {
					continue;
				}
				if (isMine(i, j)) {
					mineNum++;
				}
				else if (isNew(i, j)) {
					data.push({
						x: i,
						y: j
					})
					
				}
			}
		}
		return {
			mineNum: mineNum,
			data: data
		};
	}
	function expand(data) {
		for (var i = 0; i < data.length; i++) {
			var x = data[i].x,
				y = data[i].y;
			check(x, y);
		}
	}

	function showNum(x, y, num) {
		dataSet[x][y] = 2;
		context.fillStyle = '#90EE90';
		context.beginPath();
		context.rect(x * length, y * length, length, length);
		context.closePath();
		context.fill();
		if (num > 0) {
			context.fillStyle = '#000';
			context.font = length + 'px Georgia';
			context.fillText(num + '', (x + 0.2) * length, (y + 0.8) * length);
		}
	}
	function checkSuccess() {
		// 已翻开方块数量等于总方块数-雷数时则为胜利
		var showNum = 0;
		for (var i = 0; i < colNum; i++) {
			for (var j = 0; j < rowNum; j++)  {
				if (dataSet[i][j] === 2) {
					showNum++;
				}
			}
		}
		if (showNum === colNum * rowNum - mineNum) {
			success();
		}
	}
	function fail() {
		alert('失败了');
		canvas.removeEventListener('click', clickHandler);
	}
	function success() {
		alert('胜利了');
		canvas.removeEventListener('click', clickHandler);
	}

})();