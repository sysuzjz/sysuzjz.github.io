const levelRatios = [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];
let level = 1;
let sudokuResult = Array(9).fill(0).map(() => Array(9).fill(0));
let showingSudoku = simpleDeepCopyArray(sudokuResult);
let playingSudokuResult = simpleDeepCopyArray(sudokuResult);
let startTime = Date.now();
let isShowCandidateKeyboards = false;


/** 控制逻辑 */

$('#confirm-level').on('click', () => {
    level = parseInt($('#level-control').val());
    startGame();
});
$('#switch-candidate').on('click', function() {
    isShowCandidateKeyboards = !isShowCandidateKeyboards;
    $(this).text(isShowCandidateKeyboards ? '停用候选提示' : '启用候选提示');
});

$('.sudoku-wrap').on('click', '.sudoku-item', function() {
    $('.sudoku-item.selected').removeClass('selected');
    if (!$(this).hasClass('origin')) {
        $(this).addClass('selected');
        const row = $(this).data('row');
        const col = $(this).data('column');
        const candidateNumbers = getCandidateNumbers(playingSudokuResult, row, col);
        showCandidateKeyboards(candidateNumbers);
    } else {
        showCandidateKeyboards([]);
    }
});

$('.keyboard-wrap').on('click', '.keyboard-item', function() {
    const selectedSudokuItem = $('.selected');
    // 未选中无效
    if (selectedSudokuItem.length === 0) {
        return true;
    }
    // 初始值不允许修改
    if (selectedSudokuItem.hasClass('origin')) {
        return true;
    }
    const value = $(this).data('value');
    const sudokuRow = selectedSudokuItem.data('row');
    const sudokuCol = selectedSudokuItem.data('column');
    selectedSudokuItem.removeClass('error');
    if (value === 'delete') {
        selectedSudokuItem.text('');
        playingSudokuResult[sudokuRow][sudokuCol] = 0;
    } else {
        selectedSudokuItem.text(value);
        if (!isValid(playingSudokuResult, sudokuRow, sudokuCol, parseInt(value))) {
            selectedSudokuItem.addClass('error');
        } else {
            requestAnimationFrame(checkIfSuccess);
        }
        playingSudokuResult[sudokuRow][sudokuCol] = parseInt(value);
    }
});

function showCandidateKeyboards(candidateNumbers) {
    const keyboardItems = $('.keyboard-item');
    keyboardItems.removeClass('candidate');
    if (!isShowCandidateKeyboards) {
        return;
    }
    for (const number of candidateNumbers) {
        keyboardItems.eq(number - 1).addClass('candidate');
    }
}

function renderInitialSudoku(showingSudoku) {
    const items = $('.sudoku-item');
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (showingSudoku[i][j] > 0) {
                items.eq(i * 9 + j).addClass('origin').text(showingSudoku[i][j]);
            }
        }
    }
}


function startGame() {
    reset();
    sudokuResult = generateSudoku();
    consoleSudokuResult(sudokuResult);
    showingSudoku = getShowingSoduku(sudokuResult);
    consoleSudokuResult(showingSudoku);
    playingSudokuResult = simpleDeepCopyArray(showingSudoku);
    renderInitialSudoku(showingSudoku);
    startTime = Date.now();
}

function reset() {
    $('.sudoku-item').removeClass('selected')
        .removeClass('origin')
        .removeClass('error');
    $('.keyboard-item').removeClass('candidate');
    $('.sudoku-item').text('');
}

function checkIfSuccess() {
    if ($('.sudoku-item.error').length > 0) {
        return false;
    }
    for (let i = 0; i < 9; i++) {
        const rowData = getRowData(playingSudokuResult, i);
        if (!isValidOneToNine(rowData)) {
            return false;
        }
        const colData = getColData(playingSudokuResult, i);
        if (!isValidOneToNine(colData)) {
            return false;
        }
    }
    for (let i = 0; i < 9; i = i + 3) {
        for (let j = 0; j < 9; j = j + 3) {
            const areaData = get3x3Data(playingSudokuResult, i, j);
            if (!isValidOneToNine(areaData)) {
                return false;
            }
        }
    }
    const costTime = Date.now() - startTime;
    const costTimeStr = calcCostTime(costTime);
    alert(`恭喜你获得胜利，当前难度${level}, 耗时${costTimeStr}`);
}

function getCandidateNumbers(arr, row, col) {
    // 临时保存当前位置数字，避免计算时代入导致少了一个推荐数字
    const tempStoreNumber = arr[row][col];
    arr[row][col] = 0;
    let candidateNumbers = [1,2,3,4,5,6,7,8,9];
    const rowData = getRowData(arr, row);
    candidateNumbers = removeReplicateNumber(candidateNumbers, rowData);
    const colData = getColData(arr, col);
    candidateNumbers = removeReplicateNumber(candidateNumbers, colData);
    const areaData = get3x3Data(arr, row, col);
    candidateNumbers = removeReplicateNumber(candidateNumbers, areaData);
    arr[row][col] = tempStoreNumber;
    return candidateNumbers;
}
function removeReplicateNumber(targetArr, otherArray) {
    let i = 0;
    while (i < targetArr.length) {
        if (otherArray.includes(targetArr[i])) {
            targetArr.splice(i, 1);
        } else {
            i++;
        }
    }
    return targetArr;
}

function getRowData(arr, row) {
    return arr[row].slice();
}
function getColData(arr, col) {
    return Array(9).fill(0).map((_, index) => arr[index][col]);
}
function get3x3Data(arr, row, col) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    const result = [];
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            result.push(arr[i][j]);
        }
    }
    return result;
}

function isValidOneToNine(subArr) {
    return subArr.sort().join('') === '123456789';
}

/**
 * 生成合法的9x9数独二维数组
 * @returns {number[][]} 9x9的数独二维数组
 */
function generateSudoku() {
    // 初始化9x9的空数组
    const board = Array(9).fill().map(() => Array(9).fill(0));

    /**
     * 检查某个位置填入数字num是否合法
     * @param {number} row 行索引(0-8)
     * @param {number} col 列索引(0-8)
     * @param {number} num 要填入的数字(1-9)
     * @returns {boolean} 是否合法
     */
    

    /**
     * 生成随机排列的1-9数组
     * @returns {number[]} 随机排列的1-9数组
     */
    function getRandomNumbers() {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // 洗牌算法：随机交换元素位置
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        return nums;
    }

    /**
     * 回溯填充数独
     * @param {number} row 当前行
     * @param {number} col 当前列
     * @returns {boolean} 是否填充成功
     */
    function backtrack(row, col) {
        // 所有行填充完成，返回成功
        if (row === 9) return true;
        // 当前行最后一列，切换到下一行第一列
        if (col === 9) return backtrack(row + 1, 0);
        
        // 已经有数字（初始都是0，这里不会触发），直接填充下一列
        if (board[row][col] !== 0) return backtrack(row, col + 1);

        // 生成随机排列的1-9，增加随机性
        const randomNums = getRandomNumbers();
        for (const num of randomNums) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                // 填充下一列，成功则返回true
                if (backtrack(row, col + 1)) return true;
                // 回溯：撤销当前数字
                board[row][col] = 0;
            }
        }

        // 所有数字都尝试过，填充失败，返回false
        return false;
    }

    // 从第0行第0列开始填充
    backtrack(0, 0);
    return board;
}

function isValid(board, row, col, num) {
    // 1. 检查当前行是否有重复
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
    }

    // 2. 检查当前列是否有重复
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) return false;
    }

    // 3. 检查当前3x3宫格是否有重复
    // 计算当前宫格的起始行和列
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

function getShowingSoduku(sudoku) {
    return simpleDeepCopyArray(sudoku).map(row => {
        return row.map(num => {
            return Math.random() > levelRatios[level - 1] ? 0 : num;
        });
    });
}


function consoleSudokuResult(arr) {
    // 格式化打印数独
    console.log("生成的数独：");
    for (let i = 0; i < 9; i++) {
        // 每3行打印分隔线
        if (i % 3 === 0 && i !== 0) console.log("---------------------");
        let rowStr = "";
        for (let j = 0; j < 9; j++) {
            // 每3列打印分隔符
            if (j % 3 === 0 && j !== 0) rowStr += " | ";
            rowStr += arr[i][j] + " ";
        }
        console.log(rowStr);
    }
}

function simpleDeepCopyArray(arr) {
    return arr.slice().map(row => row.slice());
}

function calcCostTime(timeCost) {
    const days = Math.floor(timeCost / 86400000);
    const hours = Math.floor((timeCost % 86400000) / 3600000);
    const minutes = Math.floor((timeCost % 3600000) / 60000);
    const seconds = Math.floor((timeCost % 60000) / 1000);
    return (days > 0 ? `${days}天` : '') +
        (hours > 0 ? `${hours}小时` : '') +
        (minutes > 0 ? `${minutes}分钟` : '') +
        `${seconds}秒`;
}