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

$("#main-content").on("click", ".add-user", function() {
    $("#model").clone(true).removeClass('hide').removeAttr('id').insertBefore($(this)).find(".candidates").trigger('focus');
})

$("#main-content").on("click", ".btn-close", function() {
    var user = getUser(this);
    if(!isValidUser(user) || confirm("确认删除吗？")) {
        $(this).closest('.vote-box').remove();
    }
})

$("#main-content").on("click", ".add-position", function() {
    var title = prompt("请输入职位名称：", "");
    if(title) {
        $("#model-position").clone(true).removeClass('hide').find('.position-title').text(title).closest('.vote-position').removeAttr('id').insertBefore($(this));
    }
})

$("#main-content").on("click", ".btn-delete", function() {
    console.log($(this).closest('.vote-position').find(".position-content").children('div').length);
    if($(this).closest('.vote-position').find(".position-content").children('div').length === 2 || confirm("确认删除吗？")) {
        $(this).closest('.vote-position').remove();
    }
})

$("#vote-end").click(function(event) {
    $(".vote-position").not('.hide').each(function() {
        var count = 0;
        var title = $(this).find(".position-title").text();
        var tempArray = new Array();
        $(this).find(".vote-box").not('.hide').not('.add-user').each(function(index, el) {
            var name = $(this).find(".candidates").val();
            var votenum = parseInt($(this).find(".votenum").val());
            if(name && votenum) {
                tempArray[count] = setJSON(name, votenum);
                count++;
            }
        });
        sortJSON(tempArray);
        AppendToList(title, tempArray);
    })
    $(".vote-list").show(500, "linear");
});

$("#list-close").click(function() {
    $(".vote-list").hide(500, "linear");
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

function setJSON(name, votenum) {
    var jsonStr = '{}';
    var jsonObj = JSON.parse(jsonStr);
    jsonObj['name'] = name;
    jsonObj['votenum'] = votenum;
    return jsonObj;
}

function sortJSON(jsonArray) {
    jsonArray.sort(sortMethod);
}

function sortMethod(a, b) {
    return b.votenum - a.votenum;
}

function AppendToList(title, jsonArray) {
    var listStr = "<dt>" + title;
    for(var i = 0; i < jsonArray.length; i++) {
        listStr = listStr + "<dd>" + jsonArray[i].name + "\t" + jsonArray[i].votenum + "票</dd>";
    }
    listStr += "</dt>";
    $(".vote-list dl").append($(listStr));
}
