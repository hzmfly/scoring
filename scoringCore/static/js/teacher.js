var global={};
//指示第几个科目被选中，以下类似
global.xueke_index =0;
global.banji_index=0;
global.banji_index=0;
//科目-班级-教辅列表数据
global.all_list=[];
//教辅-章节列表
global.chapter_sectionList=[];
//作业列表
global.taskList=[];


$(document).ready(function () {
    initPage();


});
//初始化界面
function initPage(){
    queryTeacher();
    displayXueKe();
    attachClickEvent();
}
//查询该老师名下，教授的科目对应的班级，及采用的教辅
function queryTeacher(){
        $.ajax({
            type: 'GET',
            url: '/queryTeacher/' ,
            data: "" ,
            async : false,//可以改同步
            success: function(data){
                global.all_list=data.LIST1;
        }

    });

}

//根据查询出的数据渲染界面，或者根据点击动态渲染界面
//输入的条件是第几个索引,学科展示所有学科。
function displayXueKe(){
    var xueke_str = "";
    for (var i = 0; i < global.all_list.length; i++) {
        xueke_str += '<li rel="' + global.all_list[i].subjectCd + '">' + global.all_list[i].subjectCd_DESC + '</li>';
    }
    $(".xueke").html(xueke_str);
//    if(global.all_list.length>0){
//        $(".banji li:first").trigger("click");
//        $(".banji li:first").addClass("curr");
//    }
    if(global.all_list.length>0){
        $(".xueke li:first").addClass("curr");
        displayBanJi(global.all_list[0]);
    }else{
        alert("您暂时还没有授课班级信息！");
    }

}
function displayBanJi(data){
    var banji_str = "";
    var banjiList = data['banji'];
    for (var i = 0; i < banjiList.length; i++) {
        banji_str += '<li rel="' + banjiList[i].school +'-'+banjiList[i].grade+'-'+banjiList[i].classes+ '">' + banjiList[i].banji_DESC + '</li>';
    }
    $(".banji").html(banji_str);
    if(banjiList.length>0){
        $(".banji li:first").addClass("curr");
        displayTextbook(banjiList[0]);
    }else{
        alert("您暂时还没有授课班级信息！");
    }

}

function displayTextbook(data){
    var textbook_str = "";
    var textbookList = data['textbook'];
    for (var i = 0; i < textbookList.length; i++) {
        textbook_str += '<li rel="' + textbookList[i].textbookId + '">' + textbookList[i].textbookName + '</li>';
    }
    $(".jiaofu").html(textbook_str);
    if(textbookList.length>0){
        $(".jiaofu li:first").addClass("curr");
        displayChapter_Section(textbookList[0].textbookId);

    }else{
        alert("您暂时还没有授课班级信息！");
    }

}

function querySection(textbookId){

    var reqData = {
        'textbookId':textbookId
    };
     $.ajax({
            type: 'GET',
            url: '/queryChapterAndSection/' ,
            data: reqData ,
            async : false,
            success: function(data){
                global.chapter_sectionList=data.LIST1;
                }
        });

}

function displayChapter_Section(textbookId){
    querySection(textbookId);
    var setting = {
                view: {
                    showIcon: false
                },
                data: {
                    key: {
                        name: "name",
                        children: "sectionList"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id"
                    }
                },
                callback: {
                    onClick: treeNodeOnClick
                }
            };
     $.fn.zTree.init($("#tree"), setting, global.chapter_sectionList);


}
//章节列表的触发函数
function treeNodeOnClick(event, treeId, treeNode, clickFlag) {
        global.treeNode = treeNode;
        if(treeNode.isParent){
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.expandNode(treeNode);//展开父节点对应的子节点
        }else{
            $(".currSectionName").html(treeNode.name);
            var chapter ="";
            var section ="";
            chapter = treeNode.getParentNode().id;
            section = treeNode.id;

            var banjiArr = $(".banji .curr").attr("rel").split('-');
            var textbookId = $(".jiaofu .curr").attr("rel");
            queryTask(textbookId, chapter, section, banjiArr[0], banjiArr[1], banjiArr[2]);
            displayTaskList();
        }

}

//查询作业列表函数
function queryTask(textbookId, chapter, section, school, grade, classes){
    var reqData = {
        't':textbookId,
        'ch':chapter,
        'se':section,
        's':school,
        'g':grade,
        'c':classes
    };
     $.ajax({
            type: 'GET',
            url: '/queryTask/' ,
            data: reqData ,
            async : false,
            success: function(data){
                    global.taskList=data.LIST1;
                    global.topicCount = data.topicCount;
                }
        });
}

//展示作业列表区域
function displayTaskList(){
    if(global.taskList.length == 0){
        //没有作业列表
        $("#nodata").show();
    }else{
        //展示题数
        $('#I_num1').html(global.topicCount);
        //展示统计表格
        for(var i in global.taskList){
            var topic_str = '<li rel="'+global.taskList[i].topicNum+'" >'+global.taskList[i].topicNum+'</li>';
            $('#statistics .topic').find('ul').append(topic_str);
            var scorate_str= '<li>'+global.taskList[i].rate+'</li>';
            $('#statistics .scorate').find('ul').append(scorate_str);
        }



    }

}

//给导航栏的每个选项添加触发事件，用于点击学科查询班级和教辅，点击班级查询教辅。
function attachClickEvent(){
    $(".xueke").delegate("li", "click", function () {
        global.xueke_index = $(this).index();
        $(".xueke .curr").removeClass("curr");
        $(this).addClass("curr");
        displayBanJi(global.all_list[global.xueke_index]);

    });

    $(".banji").delegate("li", "click", function () {
        global.banji_index = $(this).index();
        $(".banji .curr").removeClass("curr");
        $(this).addClass("curr");
        displayTextbook(global.all_list[global.xueke_index].banji[global.banji_index]);
    });
    $(".jiaofu").delegate("li","click", function () {
        global.banji_index = $(this).index();
        $(".jiaofu .curr").removeClass("curr");
        $(this).addClass("curr");
    });
}