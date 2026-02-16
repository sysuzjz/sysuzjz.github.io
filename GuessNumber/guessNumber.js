const NumberLen = 4;
const CandidateNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const Tip_TYPE_NUMBER = 0;
const Tip_TYPE_EXECT = 1;
const Tip_Interval = 30000;

let resultNum = Array(NumberLen);
let currentTryTime = 0;
let currentTipTime = 0;
let currentSelectIndex = 0;
let hasWin = false;
let lastTipTimestamp = 0;

function init() {
    reset();
    initHistoryRecord();
}

function getInitNumber() {
    const cloneCandidateNum = CandidateNums.slice(0);
    const result = Array(NumberLen);
    for (let i = 0; i < NumberLen; i++) {
        const len = cloneCandidateNum.length;
        const randIndex = getRandNumber(0, len - 1);
        result[i] = cloneCandidateNum[randIndex];
        cloneCandidateNum.splice(randIndex, 1);
    }
    return result;
}

function isDuplicative(inputNumber) {
    if (!/^\d$/.test(inputNumber)) {
        return true;
    }
    const num = parseInt(inputNumber);
    const currentInputs = getCurrentInputs();
    return currentInputs.includes(num);
}

function getCurrentInputs() {
    return Array.from(document.querySelectorAll('.input-number')).map(ele => ele.innerText ? parseInt(ele.innerText) : -1);
}



function checkAndTry() {
    const currentInputs = getCurrentInputs();
    if (currentInputs.includes(-1)) {
        return;
    }
    currentTryTime++;
    // A表示位置数字都对，B表示数字对位置不对
    let numOfTypeA = 0;
    let numOfTypeB = 0;
    for (let i = 0; i < NumberLen; i++) {
        const tempNum = currentInputs[i];
        if (tempNum === resultNum[i]) {
            numOfTypeA++;
        } else if (resultNum.includes(tempNum)) {
            numOfTypeB++;
        }
    }
    const resultText = `${numOfTypeA}A${numOfTypeB}B`;
    addTryRecord(currentTryTime, currentInputs.join(''), resultText);
    setTryTime(currentTryTime);
    if (numOfTypeA === NumberLen) {
        finish();
        return;
    }
    clearInputs();
}

function finish() {
    hasWin = true;
    setHistoryRecord(currentTryTime);
    alert(`恭喜你猜出来了，总共用了${currentTipTime}次提示，猜了${currentTryTime}次`);
}

function addTryRecord(tryTime, text, result) {
    const recordRowEle = document.createElement('div');
    recordRowEle.className = 'record-row';
    const recordIndexEle = document.createElement('span');
    recordIndexEle.className = 'record-index';
    recordIndexEle.innerText = tryTime;
    const recordNumberEle = document.createElement('span');
    recordNumberEle.className = 'record-number';
    recordNumberEle.innerText = text;
    const recordResultEle = document.createElement('span');
    recordResultEle.className = 'record-result';
    recordResultEle.innerText = result;
    recordRowEle.appendChild(recordIndexEle);
    recordRowEle.appendChild(recordNumberEle);
    recordRowEle.appendChild(recordResultEle);
    document.querySelector('.records-wrap').appendChild(recordRowEle);
}

function tip() {
    let tipText = '';
    if (Date.now() - lastTipTimestamp < Tip_Interval) {
        const nextTime = Math.ceil((Tip_Interval + lastTipTimestamp - Date.now()) / 1000);
        tipText = `提示太过频繁，${nextTime}秒后可重试`;
        addTip(tipText);
        return;
    }
    lastTipTimestamp = Date.now();
    const tipType = getRandNumber(0, 2);
    const randIndex = getRandNumber(0, NumberLen);
    const number = resultNum[randIndex];
    if (tipType === Tip_TYPE_NUMBER) {
        tipText = `结果中包含数字${number}`;
    } else if (tipType === Tip_TYPE_EXECT) {
        tipText = `数字${number}在第${randIndex + 1}位`;
    }
    addTip(tipText);
    currentTipTime++;
    setTipTime(currentTipTime);
}

function addTip(tipText) {
    const tipEle = document.createElement('p');
    tipEle.className = "tip-row";
    tipEle.innerText = tipText;
    document.querySelector('.tip-area').appendChild(tipEle);
}

function setTryTime(tryTime) {
    document.getElementById('try-time-count').innerText = tryTime;
}


function setTipTime(tipTime) {
    document.getElementById('tip-time-count').innerText = tipTime;
}

function getRandNumber(min, max) {
    const num = Math.random() * (max + 1 - min) + min;
    if (num >= max) {
        return max;
    }
    return Math.floor(num);
}

function initHistoryRecord() {
    const record = getHistoryRecord();
    document.getElementById('history-time-count').innerText = record;
}

function getHistoryRecord() {
    let record = parseInt(localStorage.getItem('guess-number-record'));
    if (!Number.isInteger(record)) {
        record = 0;
    }
    return record;
}
function setHistoryRecord(newRecord) {
    const record = getHistoryRecord();
    if (record === 0 || (record > 0 && newRecord < record)) {
        localStorage.setItem('guess-number-record', newRecord);
    }
}
function resetHistory() {
    localStorage.removeItem('guess-number-record');
    initHistoryRecord();
}

function reset() {
    hasWin = false;
    currentTryTime = 0;
    currentTipTime = 0;
    setTryTime(0);
    setTipTime(0);
    clearInputs();
    clearRecords();
    clearTips();
    resultNum = getInitNumber();
}

function clearInputs(index) {
    if (index) {
        document.querySelectorAll('.input-number')[index].innerText = '';
    } else {
        document.querySelectorAll('.input-number').forEach(ele => {
            ele.innerText = '';
        });       
    }
}

function setInput(index, value) {
    document.querySelectorAll('.input-number')[index].innerText = value;
}

function clearRecords() {
    document.querySelectorAll('.record-row').forEach(ele => {
        ele.parentElement.removeChild(ele);
    });
}

function clearTips() {
    document.querySelectorAll('.tip-row').forEach(ele => {
        ele.parentElement.removeChild(ele);
    });
}

document.getElementById('reset-history').addEventListener('click', () => {
    resetHistory();
});
document.getElementById('reset').addEventListener('click', () => {
    reset();
});
document.getElementById('tip').addEventListener('click', () => {
    tip();
});

document.querySelector('.keyboard-wrap').addEventListener('click', event => {
    const ele = event.target;
    if (ele.className !== 'keyboard-item' || hasWin) {
        return false;
    }
    const value = ele.getAttribute('data-value');
    if (value === 'clear') {
        clearInputs();
    } else {
        const currentInputs = getCurrentInputs();
        const nextPosition = currentInputs.indexOf(-1);
        if (value === 'delete' && nextPosition > 0) {
            clearInputs(nextPosition - 1);
        } else if (!isDuplicative(value)) {
            setInput(nextPosition, value);
            setTimeout(checkAndTry, 0);
        }
    }
})

init();