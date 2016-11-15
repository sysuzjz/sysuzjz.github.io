(function() {
	var canvas = document.querySelector('#canvas'),
		context = canvas.getContext('2d'),
		width = canvas.width,
		height = canvas.height;
	// 方块边长
	var length = 10,
		maxCol = Math.floor(width / length),
		maxRow = Math.floor(height / length);

	// 方块内容，true表示有雷
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
		rowInput.value = rowNum = 50;
		mineInput.value = mineNum = 99;
		start();
	};
	document.querySelector('#btn-custom').onclick = function() {
		colNum = +colInput.value || 10;
		rowNum = +rowInput.value || 10;
		mineNum = +mineInput.value || 10;
		start();
	};
	/*********  控制部分end ***************/

	function start() {
		draw();
		initData();
		initEvent();
	}

	function draw() {

	}

	function initData() {

	}
	function initEvent() {
		
	}
})();