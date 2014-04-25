$("#main-content").on("click", ".arrow-up", function() {
    var user = getUser(this);
    if(isValidUser(user)) {
        changeVotenum(this, 1);
    } else {
        alert("用户名非法");
    }
})

$("#main-content").on("click", ".arrow-down", function() {
    var user = getUser(this);
    if(isValidUser(user)) {
        changeVotenum(this, -1);
    } else {
        alert("用户名非法");
    }
})

$("#main-content").on("click", "#add-user", function() {
    $("#model").clone(true).removeClass('hide').insertBefore("#add-user");
})

$("#main-content").on("click", ".btn-close", function() {
    if(confirm("确认删除吗？")) {
        $(this).closest('.vote-box').remove();
    }
})

function getUser(node) {
    return $(node).siblings('.candidates').val();
}

function isValidUser(user) {
    if(!user) {
        return false;
    }
    return true;
}

function changeVotenum(node, num) {
    var $numNode = $(node).siblings('.votenum');
    var currentNum = parseInt($numNode.val());
    currentNum += num;
    if(currentNum >= 0) {
        $numNode.val(currentNum + "票");
    }
}