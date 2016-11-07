var taskListJS = {
    var subjectCd : null,
    var grade : null,
    var classes : null,
    var textbook : null,
    init : function(){

        this.subjectCd = getUrlParam('s');
        this.grade = getUrlParam('g');
        this.classes = getUrlParam('c');
        this.textbook = getUrlParam('t');
        alert(this.subjectCd);
    }



};


$(document).ready(function() {
    taskListJS.init();
}