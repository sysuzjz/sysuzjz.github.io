/*
  Name:    MIAC voter
  Author:  Kuang Weike
  Date:    2014-5-10
  Verson:  0.0.2
.*/

(function () {

var ViewModle = function() {
  var that = this;
  this.titles = ko.observableArray();

  this.createTitle = function() {
    var that = this;
    var name = prompt('输入职位名');
    if(name) {
      this.titles.push(new Title({name:name}));
    }
  }

  this.deleteTitle = function (title) {
    that.titles.remove(title);
  }

  this.addTitle = function(title) {
    this.titles.push(new Title(title));
  }
}

function Title (titleData) {
  var that = this;
  this.name = titleData.name;
  this.candidates = ko.observableArray();

  this.createCandidate = function() {
    this.candidates.push(new Candidate({}));
  }  

  this.deleteCandidate = function (candidate) {
    that.candidates.remove(candidate);
  }

  this.sort = function () {
    this.candidates.sort(function (item1, item2) {
      return item1.voteCount() < item2.voteCount();
    })
  }

  this.addCandidate = function(data) {
    this.candidates.push(new Candidate(data));
  }

  if (candidates = titleData.candidates) {
    for (var i=0; i<candidates.length; i++) {
      candidate = candidates[i];
      this.addCandidate(candidate);
    }
  }

}

function Candidate (data) {
  var that = this;
  name = data.name || '';
  avatar = data.avatar || './images/hehe.jpg';
  voteCount = data.voteCount || 0;
  this.name = ko.observable(name);
  this.avatar = ko.observable(avatar);
  this.voteCount = ko.observable(voteCount);

  this.name.subscribe(function (newName) {
    avatarUrl = getAvatar(newName);
    that.avatar(avatarUrl);
  })

  this.upvote = function() {
    this.voteCount(this.voteCount() + 1);
  }
  this.downvote = function() {
    this.voteCount(this.voteCount() > 0 ? this.voteCount() - 1 : 0);
  }

}

function getAvatar (name) {
  name = name.toLowerCase();
  NAME_MAPPING = {
    "郑锦泽": "panda.jpg", 
    "黄伟鹏": "ddp.jpg", 
    "徐欣": "xx.jpg", 
    "张天晴": "tq.jpg", 
    "郑钧耀": "junyao.jpg", 
    "何璇": "mox.jpg", 
    "袁梓民": "zmin.jpg", 

    "ddp": "ddp.jpg", 
    "熊猫": "panda.jpg", 
    "panda": "panda.jpg", 
    "xx": "xx.jpg", 
  };
  avatar = NAME_MAPPING[name] || "hehe.jpg";
  return avatarUrl = "./images/" + avatar;
}

var vm = new ViewModle

function setDataToLocalStorage () {
  vmData = JSON.stringify(ko.toJS(vm));
  localStorage.VM = vmData;
}

function restoreDataFromLocalStorage () {
  vmDataJSON = localStorage.VM;
  if (vmDataJSON) {
    vmData = JSON.parse(vmDataJSON);
    restoreData(vmData);
  }
}

function restoreData (vmData) {
  titles = vmData.titles;
  for (var i=0; i<titles.length; i++) {
    title = titles[i];
    vm.addTitle(title);
  }
}

restoreDataFromLocalStorage();

setInterval(function() {
  setDataToLocalStorage();
}, 1000) 

ko.applyBindings(vm);

})()
