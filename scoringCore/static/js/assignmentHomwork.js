/**2015.3.12**/
var currQuestionJson = null;
var assignmentJiaofu = "";
var questionDBState = null;
var curentGroup = null;
var QuestionTypee = "";
var first = true;
$.ajaxSetup({
    cache: false //close AJAX cache 
});
var all_list = "";
var assistid = "";
var index = 0, keben_index = 0;

var sharetype = "";
var tagtype = "";
var pageNum = 1;
var json_question_id = localStorage.getItem("ASSIGNMENT_HOMEWORK_QUESTIONLIST");
if (json_question_id == null) {
    var json_question_id = new Array();
}
else {
    json_question_id = $.parseJSON(json_question_id);
}
var courseID = "";
var loadData = false;
var hasData = true;
var questionType = "";
var groupID = "";

var outType = "";
var collectType = "";
//begin
$(document).ready(function () {
    $(".preview").click(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        get_selectted_questions();
        var teacherInfo = ReadCookie(infoCookieName);
        $(".qboxTitle .title").html(getSubject(teacherInfo.split('|')[3]) + " " + timeFormat(new Date(), 'yyyy-MM-dd'));
        $("#previewContent").show();
        $("body").css("overflow", "hidden");
    });
    $(".print").click(function () {
        $('#print').jqprint();
        var questionidlist = new Array();
        var questionList = json_question_id;
        for (var i = 0; i < questionList.length; i++) {
            questionidlist.push(questionList[i].questionID);
        }
        var questionIDs = questionidlist.toString();
        $.getJSON('Interface.aspx?url=/teacher/Homework.aspx&data={ "source": "webTeacher", "transaction": "printRecord", "token": "' + ReadCookie(tokenCookieName) + '", "questionIDs":"' + questionIDs + '"}',
            function (data) {

            });
    });
    $(".arrangement").click(function () {
        if ($(this).hasClass("disable"))
            return;
        var classInfo = ReadCookie(classListCookieName);
        if (classInfo == "" || Number(classInfo) < 1) {
            alertMessage("你还没有创建班级，请先去创建班级吧", 5);
            return;
        }
        window.location.href = "QuestionBox.aspx";
    });
    $('.selected-questions li').live('hover', function (event) {
        if (event.type == 'mouseenter') {
            $(this).find(".clear-question").show();
            $(this).find(".typenum").hide();
        } else {
            $(this).find(".clear-question").hide();
            $(this).find(".typenum").show();
        }
    })
    $(".clear-question").live("click", function () {
        var type = $(this).parents("li").attr("type");
        $(this).parents("li").remove();
        var dellist = new Array();
        for (var i = 0; i < json_question_id.length; i++) {
            if (json_question_id[i].questionType == type) {
                $(".select:[rel='" + json_question_id[i].questionID + "']").removeClass("sel");

                dellist.push(i);
            }
        }
        for (var j = dellist.length - 1; j >= 0; j--) {
            json_question_id.remove(dellist[j]);
        }
        if (json_question_id.length > 0) {
            localStorage.setItem("ASSIGNMENT_HOMEWORK_QUESTIONLIST", JSON.stringify(json_question_id));
        }
        else {
            localStorage.removeItem("ASSIGNMENT_HOMEWORK_QUESTIONLIST");
        }
        set_num();
    });
    /*******搜索*********/
    $("#search").click(function () {
        if (window.location.href.toLowerCase().indexOf("searchresult.aspx") > -1) {
            return;
        }
        else {
            window.location.href = "SearchResult.aspx?keywords=" + encodeURIComponent($("#keywords").val());
        }
    });
    $("#keywords").keydown(function (e) {
        if (e.keyCode == 13) {
            if (window.location.href.toLowerCase().indexOf("searchresult.aspx") > -1) {
                return;
            }
            else {
                window.location.href = "SearchResult.aspx?keywords=" + encodeURIComponent($("#keywords").val());
            }
        }
    });
    /*******搜索*********/
    $(".tkNavgigator li").click(function () {
        $(".fenye").hide();
        $("#JiaoxFuQuestion").find(".rtopdtxt>div.cur").removeClass("cur");
        $("#JiaoxFuQuestion").find(".rtopdtxt>div").eq(0).addClass("cur");
        $("#PaperQuestion").find(".rtopdtxt>div.cur").removeClass("cur");
        $("#PaperQuestion").find(".rtopdtxt>div").eq(0).addClass("cur");
        outType = "0";
        collectType = "0";
        if ($(this).attr("rel") == "jf") {
            $(".lenvad .J_lenvad_ol").show();
            $(this).parent().find(".current").removeClass("current");
            $(this).addClass("current");
            $("#JiaoxFuQuestion").show();
            $("#PaperQuestion").hide();
            $("#GroupQuestion").hide();
            $(".pnoquestion").hide();
            $(".jffilter").show();
            //alft = $(".lenvad ol").offset().left + 220;
            //altp = $(".lenvad ol").offset().top - 120;
            //$(".titernav").css({ "left": alft, "top": altp });
            currQuestionJson = "";
            pageNum = 0;
            tongbu();
        }
        else if ($(this).attr("rel") == "zsd") {
            $(".lenvad .J_lenvad_ol").hide();
            $(this).parent().find(".current").removeClass("current");
            $(this).addClass("current");
            $("#JiaoxFuQuestion").show();
            $("#PaperQuestion").hide();
            $("#GroupQuestion").hide();
            $(".pnoquestion").hide();
            $(".jffilter").hide();
            //alft = $(".lenvad ol").offset().left + 220;
            //altp = $(".lenvad ol").offset().top - 120;
            //$(".titernav").css({ "left": alft, "top": altp });
            currQuestionJson = "";
            pageNum = 1;
            knowledge();
        }
        else if ($(this).attr("rel") == "my") {
            $(this).parent().find(".current").removeClass("current");
            $(this).addClass("current");
            $("#JiaoxFuQuestion").hide();
            $("#PaperQuestion").hide();
            $("#GroupQuestion").show();
            $(".pnoquestion").hide();
            pageNum = 0;
            currQuestionJson = "";
            GetGroupList();
        }
        else if ($(this).attr("rel") == "sj") {
            $(this).parent().find(".current").removeClass("current");
            $(this).addClass("current");
            $("#JiaoxFuQuestion").hide();
            $("#GroupQuestion").hide();
            $("#PaperQuestion").show();
            $(".pnoquestion").hide();
            pageNum = 0;
            currQuestionJson = "";
            GetPaperShaixuan();
            //GetPaperList(0, 0, 0);
        }
    });
    assignmentJiaofu = ReadCookie(assignmentCookieName);
    if (assignmentJiaofu != "") {
        if (assignmentJiaofu.split("|")[0] == "jf") {
            var jfArr = assignmentJiaofu.split("|");
            $(".tkNavgigator li[rel='jf']").trigger("click");
        }
        else if (assignmentJiaofu.split("|")[0] == "zsd") {
            $(".tkNavgigator li[rel='zsd']").trigger("click");
        }
        else if (assignmentJiaofu.split("|")[0] == "sj") {
            $(".tkNavgigator li[rel='sj']").trigger("click");
        }
        else {
            GetGroupList();
        }
    }
    else {
        GetGroupList();
    }
    $(".lenvad .J_lenvad_ol").hover(function () {
        $(".titernav").show();
        tongbu();
    }, function () {
        $(".titernav").hide();
    });

    $(".jiaocai").delegate("li", "click", function () {
        index = $(this).index();
        $(".jiaocai .curr").removeClass("curr");
        $(this).addClass("curr");
        htm_keben(all_list[index]);
    });

    $(".keben").delegate("li", "click", function () {
        keben_index = $(this).index();
        $(".keben .curr").removeClass("curr");
        $(this).addClass("curr");
        htm_jiaofu(all_list[index].list[keben_index]);
    });
    $(".jiaofu li").live("click", function () {
        $(this).parent().find(".curr").removeClass("curr");
        $(this).addClass("curr");
        var keben = all_list[index].list[keben_index];
        var textBookID = keben.textBookID;
        assistid = keben.list[$(".jiaofu .curr").index()].teachingAssistID;
        get_section(textBookID, assistid);
        $(".J_lenvad_ol>p").html("<span>" + $(".jiaocai .curr").text() + "</span>/<span>" + $(".keben .curr").text() + "</span>/<span>" + $(".jiaofu .curr").text() + "</span>");
    });
    $(".jffilter").find("li").live({
        mouseenter:
        function () {
            $(this).addClass("hov");
        },
        mouseleave:
        function () {
            $(this).removeClass("hov");
        }
    });


    //章节点击
    $(".lenvad").delegate("a", "click", function () {

    });


    //题型点击    
    $(".dondad").delegate("p", "click", function () {
        $(".dondad .cur").removeClass("cur");
        $(this).addClass("cur");
        questionType = $(this).attr("rel");
        QuestionTypee = questionType;
        hasData = true;
        loadData = false
        pageNum = 1;
        if ($(".tkNavgigator li.current").attr("rel") == "my") {
            GetQuestionByGrpid(tagtype, groupID, 10, 0, questionType);
            $(".selctall").removeClass("selctd");
        }
        else if ($(".tkNavgigator li.current").attr("rel") == "jf" || $(".tkNavgigator li.current").attr("rel") == "zsd") {
            get_questions(tagtype, courseID, 10, 0, questionType);
        }
        else {
            GetQuestionByPaper(courseID, 10, 0, questionType);
        }
    });

    //打钩的    
    $(".select").live("click", function () {
        if ($(this).hasClass("sel")) {
            $(this).removeClass("sel");
            del_ID($(this));
        } else {
            $(this).addClass("sel");
            add_ID($(this));
        }
    });

    //答案详情
    //$(".list782").delegate(".J_question_body", "click", function () {
    //    var htmls = $(this).next(".J_answerExplain").html();

    //    $(".J_question_detail").html(htmls);
    //    $(".zhcdf").show();
    //    $(".timuxqd").show();
    //});





    $(window).scroll(function () {

        InitHeight();

    });

    $(".rtopdtxt div").click(function () {
        if (!$(this).hasClass("cur")) {
            $(".rtopdtxt .cur").removeClass("cur");
            $(this).addClass("cur");
            hasData = true;
            loadData = false;
            if ($(this).index() == 0) {
                outType = "0";
                collectType = "0";
                pageNum = 0;
            }
            else if ($(this).index() == 1) {
                outType = "2";
                collectType = "0";
                pageNum = 0;
            }
            else {
                outType = "0";
                collectType = "1";
                pageNum = 0;
            }
            if ($(".tkNavgigator li.current").attr("rel") == "my") {
                GetQuestionByGrpid(tagtype, groupID, 10, 0, questionType, outType, collectType);
            }
            else if ($(".tkNavgigator li.current").attr("rel") == "jf" || $(".tkNavgigator li.current").attr("rel") == "zsd") {
                get_questions(tagtype, courseID, 10, 0, questionType, outType, collectType);
            }
            else if ($(".tkNavgigator li.current").attr("rel") == "sj") {
                GetQuestionByPaper(courseID, 10, 0, questionType, outType, collectType);
            }
        }
    });

    $(".queslist").delegate(".unfav", "click", function () {
        var isCollect = "1";
        var currFav = $(this);
        if (currFav.hasClass("fav")) {
            isCollect = "0";
        }
        var postdata = {};
        var url = "@php/v1_tiku/personal/add-to-group?source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0";
        if (isCollect == "0") {
            url = "@php/v1_tiku/personal/delete-from-group?source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0";
            var ques = new Array();
            ques.push(currFav.attr("rel"));
            postdata = { group_id: 0, questions: ques }
        }
        else {
            var ques = new Array();
            if ($(".hexdlistd li.chosed").attr("rel") == "jf") {
                ques.push({ "question_source_type": "1", "source_id": courseID, "question_id": currFav.attr("rel"), "question_from_type": "pc" });
            }
            else if ($(".hexdlistd li.chosed").attr("rel") == "zsd") {
                ques.push({ "question_source_type": "2", "source_id": courseID, "question_id": currFav.attr("rel"), "question_from_type": "pc" });
            }
            else if ($(".hexdlistd li.chosed").attr("rel") == "sj") {
                ques.push({ "question_source_type": "3", "source_id": $("#PaperQuestion li.curt").data("paperid"), "question_id": currFav.attr("rel"), "question_from_type": "pc" });
            }
            else {
                ques.push({ "question_source_type": "4", "source_id": $("#GroupQuestion li.curt").data("groupid"), "question_id": currFav.attr("rel"), "question_from_type": "pc" });
            }
            postdata = { group_id: 0, questions: ques }
        }
        $.ajax({
            url: "Interface.aspx?url=" + encodeURIComponent(url),
            type: 'post',
            data: JSON.stringify(postdata),
            contentType: "application/json",
            dataType: 'json',
            success: function (data) {
                if (data.code == 99999) {
                    if (isCollect == "1") {
                        $(currFav).addClass("fav");
                    }
                    else {
                        $(currFav).removeClass("fav");
                    }
                }
            }
        });
    });

    // add by yangzhiyuan --个人题库
    //修改，添加题
    $(".egrpsure").click(function () {
        if ($.trim($(".egrpcont").find("input").val()).length > 16 || $.trim($(".egrpcont").find("input").val()).length < 2) {
            $(".erro").show();
            return;
        }
        if ($(".egrpcont").find("input").data("groupid") == "0") {
            var url = "@php/v1_tiku/personal/create-group?source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0";
            $.post("Interface.aspx?url=" + encodeURIComponent(url), { name: $.trim($(".egrpcont").find("input").val()) }, function (data) {
                $("#GroupQuestion .sidebar").find("ul").append($('<li data-isdefault="0" data-groupid="' + data.data.groupID + '" data-count="0"><span class="favna">' + $.trim($(".egrpcont").find("input").val()) + '</span><p class="qnums"><span>0</span>道</p></li>'));
                $(".zhcdf").hide();
                $(".egrpf").hide();
                AddGroupJson(data.data.groupID, $.trim($(".egrpcont").find("input").val()));
                alertMessage("添加成功");
            }, "json");
        }
        else {
            var url = "@php/v1_tiku/personal/edit-group?source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0";
            $.post("Interface.aspx?url=" + encodeURIComponent(url), { name: $.trim($(".egrpcont").find("input").val()), group_id: $(".egrpcont").find("input").data("groupid") }, function (data) {
                $("#GroupQuestion .sidebar").find("ul").find(".curt").find(".favna").html($.trim($(".egrpcont").find("input").val()));
                $(".currGroupName").html($.trim($(".egrpcont").find("input").val()));
                $(".zhcdf").hide();
                $(".egrpf").hide();
                ModiGroupJson($(".egrpcont").find("input").data("groupid"), $.trim($(".egrpcont").find("input").val()));
                alertMessage("修改成功");
            }, "json");
        }
    });
    $(".delgrp").click(function () {
        $.confirm('确认删除改组吗？删除后改组习题也将删除', {
            callback: function (flag) {
                if (!flag) {
                    return;
                }
                var url = "@php/v1_tiku/personal/delete-group?source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0";
                $.post("Interface.aspx?url=" + encodeURIComponent(url), { group_id: $("#GroupQuestion .sidebar").find(".curt").data("groupid") }, function (data) {
                    DelGroupJson($("#GroupQuestion .sidebar").find(".curt").data("groupid"));
                    $("#GroupQuestion .sidebar").find("ul").find(".curt").remove();
                    $("#GroupQuestion .sidebar").find("ul").find("li").eq(0).trigger("click");
                    alertMessage("删除成功");
                }, "json");
            }
        });
    });
    //组 点击事件
    $("#GroupQuestion .sidebar").find("ul>li").live("click", function () {
        if ($(this).hasClass("defgrp")) {
            $(".grpcz").hide();
            $(".currGroupName").html($(this).find(".favna").html());
        }
        else {
            $(".grpcz").show();
            $(".currGroupName").html($(this).find(".favna").html());
        }
        $(".selctall").removeClass("selctd");
        QuestionTypee = "";
        questionType = "";
        groupID = $(this).data("groupid");
        $(".yd dl").find("dd").remove();
        if (curentGroup != null && curentGroup.length > 0) {
            $.each(curentGroup, function (i, item) {
                if (item.groupId != groupID && item.isDefault != 1) {
                    $dlelem = $('<dd data-groupid="' + item.groupId + '">' + item.name + '</dd>');
                    $(".yd dl").append($dlelem);
                }

            });
        }
        $(this).parent().find(".curt").removeClass("curt");
        $(this).addClass("curt");
        QuestionType = "";
        hasData = true;
        loadData = false

        $("#GroupQuestion .questionLst").find("ul>li").remove();
        GetQuestionByGrpid(tagtype, groupID, 10, 0, "");
        assignmentJiaofu = $(".tkNavgigator li.current").attr("rel") + "|" + groupID;
        SetCookie(assignmentCookieName, assignmentJiaofu, 365 * 24 * 3600);

    });
    //移动题
    $(".yd dl").find("dd").live("click", function () {
        var questionids = new Array();
        if ($("#GroupQuestion .questionLst").find(".selctd").length == 0) {
            alertMessage("没有可移动的题");
            return;
        }
        var toid = $(this).data("groupid");
        $("#GroupQuestion .questionLst").find(".selctd").each(function () {
            questionids.push($(this).parents("li").find(".select").attr("rel"));
        });

        var frmid = $("#GroupQuestion .sidebar").find(".curt").data("groupid");
        var url = "@php/v1_tiku/personal/move-to-group?source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0";
        $.ajax({
            url: "../Interface.aspx?url=" + encodeURIComponent(url),
            type: 'post',
            data: JSON.stringify({ group_id_from: frmid, group_id_to: toid, questions: questionids }),
            contentType: "application/json",
            dataType: 'json',
            success: function (data) {
                if (data.code == "99999") {
                    alertMessage("移动成功");
                    $(".currgrpCnt").html(parseInt($(".currgrpCnt").html()) - questionids.length);
                    $("#GroupQuestion>.sidebar").find(".curt>.qnums>span").html(parseInt($("#GroupQuestion>.sidebar").find(".curt>.qnums>span").html()) - questionids.length);
                    $("#GroupQuestion>.sidebar").find("li:[data-groupid=" + toid + "]").find(".qnums>span").html(parseInt($("#GroupQuestion>.sidebar").find("li:[data-groupid=" + toid + "]").find(".qnums>span").html()) + questionids.length);
                    $("#GroupQuestion .questionLst").find(".selctd").parents("li").remove();
                    $(".selctall").removeClass("selctd");
                    $("#GroupQuestion .questionLst .questionli .qustionno").each(function (i, item) {
                        $(this).html((i + 1) + "、");
                    });
                    if ($("#GroupQuestion .questionLst .questionli .qustionno").length == 0) {
                        $("#GroupQuestion .sidebar ul").find(".curt").trigger("click");
                    }
                    return;
                }
                else {
                    alertMessage("移动失败");
                }
            }
        });
        //$.post("Interface.aspx?url=" + encodeURIComponent(url),
        //    { group_id_from: frmid, group_id_to: toid, questions: questionids },
        //    function (data) {
        //        if (data.code == "99999") {
        //            alertMessage("移动成功");
        //            $(".currgrpCnt").html(parseInt($(".currgrpCnt").html()) - questionids.length);
        //            $("#GroupQuestion>.sidebar").find(".curt>.qnums>span").html(parseInt($("#GroupQuestion>.sidebar").find(".curt>.qnums>span").html()) - questionids.length);
        //            $("#GroupQuestion>.sidebar").find("li:[data-groupid=" + toid + "]").find(".qnums>span").html(parseInt($("#GroupQuestion>.sidebar").find("li:[data-groupid=" + toid + "]").find(".qnums>span").html()) + questionids.length);
        //            $("#GroupQuestion .questionLst").find(".selctd").parents("li").remove();
        //            return;
        //        }
        //        else {
        //            alertMessage("移动失败");
        //        }
        //    }, "json");
    });
    $(".grpquestioncz").find(".yd").live("click", function () {
        $(this).find("dl").toggle();
        return false;
    });
    //删除组中题
    $(".grpquestioncz").find("li").eq(1).click(function () {
        var questionids = new Array();
        if ($("#GroupQuestion .questionLst").find(".selctd").length == 0) {
            alertMessage("没有可删除的题");
            return;
        }
        var flag = confirm("确定删除选中的题目吗？");
        if (!flag) {
            return;
        }
        var groupinfo;
        $("#GroupQuestion .questionLst").find(".selctd").each(function () {
            questionids.push($(this).parents("li").find(".select").attr("rel"));
            groupinfo = $(this).parents("li").find(".select").data("groupinfo");
        });

        var frmid = groupinfo[0].groupId;
        var url = "@php/v1_tiku/personal/delete-from-group?source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0";
        $.ajax({
            url: "../Interface.aspx?url=" + encodeURIComponent(url),
            type: 'post',
            data: JSON.stringify({ group_id: frmid, questions: questionids }),
            contentType: "application/json",
            dataType: 'json',
            success: function (data) {
                if (data.code == "99999") {
                    alertMessage("删除成功");
                    $(".currgrpCnt").html(parseInt($(".currgrpCnt").html()) - questionids.length);
                    $("#GroupQuestion>.sidebar").find(".curt>.qnums>span").html(parseInt($("#GroupQuestion>.sidebar").find(".curt>.qnums>span").html()) - questionids.length);
                    $("#GroupQuestion .questionLst").find(".selctd").parents("li").remove();
                    $("#GroupQuestion .questionLst .questionli .qustionno").each(function (i, item) {
                        $(this).html((i + 1) + "、");
                    });
                    if ($("#GroupQuestion .questionLst .questionli .qustionno").length == 0) {
                        $("#GroupQuestion .sidebar ul").find(".curt").trigger("click");
                    }
                    return;
                }
                else {
                    alertMessage("删除失败");
                }
            }
        });

    });
    //点击新添加分组
    $(".naddicon").click(function () {
        $(".egrptitle").html("添加组");
        $(".egrpf").find("input").val("");
        $(".egrpf").find("input").data("groupid", 0);
        $(".zhcdf").show();
        $(".egrpf").show();
    });
    //编辑分组
    $(".editgrp").click(function () {
        $(".egrptitle").html("编辑组");
        $(".egrpf").find("input").val($("#GroupQuestion>.sidebar").find("li.curt").find(".favna").html());
        $(".egrpf").find("input").data("groupid", $("#GroupQuestion>.sidebar").find("li.curt").data("groupid"));
        $(".zhcdf").show();
        $(".egrpf").show();
    });
    $(".egrpcancel").click(function () {
        $(".zhcdf").hide();
        $(".egrpf").hide();
    });
    //点击选中框
    $("#GroupQuestion").find(".selct").live("click", function () {
        if ($(this).hasClass("selctd")) {
            $(this).removeClass("selctd");
            if ($("#GroupQuestion .questionLst .selctd").size() < $("#GroupQuestion .questionLst").find("ul>li").size()) {
                $(".selctall").removeClass("selctd");
            }
        } else {
            $(this).addClass("selctd");
            if ($("#GroupQuestion .questionLst .selctd").size() == $("#GroupQuestion .questionLst").find("ul>li").size()) {
                $(".selctall").addClass("selctd");
            }
        }
    });
    //点击全选
    $(".selctall").live("click", function () {
        if ($(this).hasClass("selctd")) {
            $(this).removeClass("selctd");
            $(this).parent().next().find(".selctd").removeClass("selctd");
        }
        else {
            $(this).parent().next().find(".selct").addClass("selctd");
            $(this).addClass("selctd");
        }
    });
    $(document).click(function () {
        $(".grpquestioncz").find(".yd").find("dl").hide();
    });



    // add by yangzhiyuan --试卷题库
    $(".papersx").find("li").live("click", function () {
        $(this).parent().find(".current").removeClass("current");
        $(this).addClass("current");
        $("#PaperQuestion .sidebar").find("ul>li").remove();
        GetPaperList($(".papersx .type").find(".current").attr("rel"), $(".papersx .filtercity").find(".current").attr("rel"), $(".papersx .time").find(".current").attr("rel"));
    });

    $("#PaperQuestion .sidebar").find("ul>li").live("click", function () {
        $(this).parent().find(".curt").removeClass("curt");
        $(this).addClass("curt");
        $("#PaperQuestion").find(".currPaperName").html($(this).find("p").html());
        QuestionType = "";
        hasData = true;
        loadData = false;
        QuestionTypee = "";
        questionType = "";
        $("#PaperQuestion .questionLst").find("ul>li").remove();
        courseID = $(this).data("paperid");
        assignmentJiaofu = "sj|" + $(".papersx .time .current").attr("rel") + "|" + $(".papersx .filtercity .current").attr("rel") + "|" + $(".papersx .type .current").attr("rel") + "|" + courseID;
        SetCookie(assignmentCookieName, assignmentJiaofu, 365 * 24 * 3600);
        GetQuestionByPaper(courseID, 10, 0, questionType);
    });
    $(".questionli").live({
        mouseenter:
        function () {
            $(this).find(".baocuo").removeClass("hidden");
        },
        mouseleave:
        function () {
            $(this).find(".baocuo").addClass("hidden");
        }
    });

    $(".baocuo").live("click", function () {
        $("#hdBaocuoID").val($(this).attr("rel"));
        $(".zhcdf,.baocuoWindow").show();
    });

    $(".baocuoWindow .bctype span").click(function () {
        if ($(this).hasClass("curr")) {
            $(this).removeClass("curr");
        }
        else {
            $(this).addClass("curr");
        }
    });

})

Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}
function tongbu() {
    if (all_list == "") {
        $(".filter_item").eq(1).find("td").append('<div class="loading"><img src="images/loading.gif">加载中...</div>');
        $.getJSON('Interface.aspx?url=' + encodeURIComponent('@php/v1_tiku/teacher/teachmaterial-textbook-teachingassist?source=webTeacher&token=' + ReadCookie(tokenCookieName) + "&version=2.4.0"),
            function (data) {
                checkResponse(data)
                if (data.code == "99999") {
                    $(".filter_item").find(".loading").remove();
                    all_list = data.data.list;
                    var jc_str = "";
                    for (var i = 0; i < all_list.length; i++) {
                        jc_str += '<li rel="' + all_list[i].teachingID + '">' + all_list[i].teachingName + '</li>';
                    }
                    $(".jiaocai").html(jc_str);
                    if (all_list.length > 0) {
                        var flag = false;
                        if (assignmentJiaofu != "") {
                            if ($(".jiaocai li[rel='" + assignmentJiaofu.split("|")[1] + "']").size() > 0) {
                                $(".jiaocai li[rel='" + assignmentJiaofu.split("|")[1] + "']").addClass("curr");
                                $(".jiaocai li[rel='" + assignmentJiaofu.split("|")[1] + "']").trigger("click");
                                flag = true;
                            }
                        }
                        if (!flag) {
                            $(".jiaocai li:first").trigger("click");
                            $(".jiaocai li:first").addClass("curr");
                            //htm_keben(all_list[0]);
                        }
                    }
                    else {
                        $(".jiaocai li").remove();
                        $(".keben li").remove();
                        $(".jiaofu li").remove();
                        $(".queslist li").remove();
                    }
                    set_num();
                }
            });
    }
    else {
        var flag = false;
        if (assignmentJiaofu != "") {
            if ($(".jiaocai li[rel='" + assignmentJiaofu.split("|")[1] + "']").size() > 0) {
                $(".jiaocai li[rel='" + assignmentJiaofu.split("|")[1] + "']").addClass("curr");
                $(".jiaocai li[rel='" + assignmentJiaofu.split("|")[1] + "']").trigger("click");
                flag = true;
            }
        }
        if (!flag) {
            $(".jiaocai li:first").trigger("click");
            $(".jiaocai li:first").addClass("curr");
            //htm_keben(all_list[0]);
        }
        set_num();
    }

}

function htm_keben(data) {
    var keben_list = data.list;
    if (keben_list.length > 0) {
        var kb_str = "";
        for (var i = 0; i < keben_list.length; i++) {
            kb_str += '<li rel="' + keben_list[i].textBookID + '">' + keben_list[i].textBookName + '</li>';
        }
        $(".keben").html(kb_str);

        var flag = false;
        if (assignmentJiaofu != "") {
            if ($(".keben li[rel='" + assignmentJiaofu.split("|")[2] + "']").size() > 0) {
                $(".keben li[rel='" + assignmentJiaofu.split("|")[2] + "']").addClass("curr");
                $(".keben li[rel='" + assignmentJiaofu.split("|")[2] + "']").trigger("click");
                flag = true;
            }
        }
        if (!flag) {
            $(".keben li:first").addClass("curr");
            $(".keben li:first").trigger("click");
            //htm_jiaofu(keben_list[0]);
        }
    }
}

function htm_jiaofu(data) {
    var jiaofu_list = data.list;
    if (jiaofu_list.length > 0) {
        var jf_str = "";
        for (var i = 0; i < jiaofu_list.length; i++) {
            jf_str += '<li rel="' + jiaofu_list[i].teachingAssistID + '">' + jiaofu_list[i].teachingAssistName + '</li>';
        }
        $(".jiaofu").html(jf_str);

        var flag = false;
        if (assignmentJiaofu != "") {
            if ($(".jiaofu li[rel='" + assignmentJiaofu.split("|")[3] + "']").size() > 0) {
                $(".jiaofu li[rel='" + assignmentJiaofu.split("|")[3] + "']").addClass("curr");
                $(".jiaofu li[rel='" + assignmentJiaofu.split("|")[3] + "']").trigger("click");
                assistid = $(".jiaofu li[rel='" + assignmentJiaofu.split("|")[3] + "']").attr("rel");
                flag = true;
            }
        }
        if (!flag) {
            assistid = jiaofu_list[0].assistID;
            $(".jiaofu li:first").addClass("curr");
            $(".jiaofu li:first").trigger("click");
        }
        //get_section(data.textBookID, jiaofu_list[0].assistID);
    }
}
//章节
function get_section(textBookID, assist_ID) {
    hasData = true;
    loadData = false;
    $(".lenvad").append('<li class="" style="height:100px"><div class="loading"><img src="images/loading.gif">加载中...</div></li>');
    var url = 'Interface.aspx?url=' + encodeURIComponent('@php/v1_tiku/teaching-assist/coursesection?source=webTeacher&token=' + ReadCookie(tokenCookieName) + "&version=2.4.0" + "&teachingassist_id=" + assist_ID);
    $.getJSON(url, function (data) {
        checkResponse(data);
        if (data.code == "99999") {
            tagtype = "0";

            var setting = {
                view: {
                    showIcon: false
                },
                data: {
                    key: {
                        name: "sectionName",
                        children: "list"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "courseSectionID"
                    }
                },
                callback: {
                    onClick: treeNodeOnClick
                }
            };
            $.fn.zTree.init($("#tree"), setting, data.data.list);
            InitHeight();
            choice_section_dd(0);
        }
    });
}
//知识点章节
function knowledge() {
    hasData = true;
    loadData = false
    $(".lenvad").append('<li class="" style="height:100px"><div class="loading"><img src="images/loading.gif">加载中...</div></li>');
    var url = 'Interface.aspx?url=' + encodeURIComponent('@php/v1_tiku/knowledge/list?source=webTeacher&token=' + ReadCookie(tokenCookieName) + "&version=2.4.0");
    $.getJSON(url, function (data) {
        checkResponse(data);
        if (data.code == "99999") {
            tagtype = "1";
            var setting = {
                view: {
                    showIcon: false
                },
                data: {
                    key: {
                        name: "knowledgeName",
                        children: "list"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "knowID"
                    }
                },
                callback: {
                    onClick: treeNodeOnClick
                }
            };
            $.fn.zTree.init($("#tree"), setting, data.data.list);
            InitHeight();
            choice_section_dd(1);
            set_num();
        }
    });
}
function treeNodeOnClick(event, treeId, treeNode, clickFlag) {
    var ID = "";
    var type = "";
    if ($(".tkNavgigator li.current").attr("rel") == "jf") {
        ID = treeNode.courseSectionID;
        type = 0;
        $(".currSectionName").html(treeNode.sectionName);
    }
    else {
        ID = treeNode.knowID;
        type = 1;
        $(".currSectionName").html(treeNode.knowledgeName);
    }

    hasData = true;
    loadData = false;
    QuestionTypee = "";
    questionType = "";
    get_questions(type, ID, 10, 0, questionType);
    assignmentJiaofu = $(".tkNavgigator li.current").attr("rel") + "|" + $(".jiaocai .curr").attr("rel") + "|" + $(".keben .curr").attr("rel") + "|" + $(".jiaofu .curr").attr("rel") + "|" + ID;
    SetCookie(assignmentCookieName, assignmentJiaofu, 365 * 24 * 3600);
}
function choice_section_dd(kctype) {
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var orinode = null;
    if (kctype == 0) {
        orinode = treeObj.getNodeByParam("courseSectionID", assignmentJiaofu.split("|")[4]);
    }
    else {
        orinode = treeObj.getNodeByParam("knowID", assignmentJiaofu.split("|")[4]);
    }
    if (assignmentJiaofu != "" && orinode != null && typeof (orinode) != "undefined") {
        treeObj.selectNode(orinode);
        treeObj.expandNode(orinode, true, true, true);
        treeObj.setting.callback.onClick(null, treeObj.setting.treeId, orinode);
    }
    else {
        var lastnode = treeObj.getNodesByFilter(function (node) { return node.isParent == false }, true);
        if (lastnode != null) {

            treeObj.expandNode(lastnode, true, false, true);
            treeObj.selectNode(lastnode);
            treeObj.setting.callback.onClick(null, treeObj.setting.treeId, lastnode);
            if (typeof (lastnode.list) != "undefined") {
                $.each(lastnode.list, function (i, item) {
                    treeObj.expandNode(item, true, false, true);
                });
            }
        }
    }
}

//取题
function get_questions(type, ID, pagesize, pagenum, questionType, outType1, collectType1) {
    if (ID == "") return;
    if (outType1 != undefined) outType = outType1;
    if (collectType1 != undefined) collectType = collectType1;
    if (!hasData || loadData) return;
    loadData = true;
    if (outType == "") outType = "0";
    if (collectType == "") collectType = "0";
    if (questionType == "") questionType = "-1";

    var url = "@php/v1_tiku/course-section/question?source=webTeacher&from=kb&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0" + "&teachingassist_id=" + $(".jiaofu").find(".curr").attr("rel") + "&coursesection_id=" + ID + "&question_type=" + questionType + "&collect=" + collectType + "&out=" + outType + "&page_size=" + pagesize + "&page_num=" + pagenum;

    if (tagtype == "1") {
        url = "@php/v1_tiku/knowledge/question?source=webTeacher&from=kb&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0" + "&knowledge_id=" + ID + "&question_type=" + questionType + "&collect=" + collectType + "&out=" + outType + "&page_size=" + pagesize + "&page_num=" + pagenum;
    }
    courseID = ID;

    if (pagenum == 0) {
        pageNum = 0;
    }
    if (pageNum <= 0) {
        $(".queslist li").remove();
        $(window).scrollTop(0);
    }
    $("#JiaoxFuQuestion .noquestion").hide();
    $("#JiaoxFuQuestion .loading").show();
    $("#JiaoxFuQuestion").find(".queslist>.questionli").remove();
    $(".fenye").hide();
    $.getJSON("Interface.aspx?url=" + encodeURIComponent(url), function (data) {
        checkResponse(data);
        if (data.code == "99999") {
            loadData = false;
            $("#JiaoxFuQuestion .loading").hide();
            pageNum++;
            //if (Number(data.data.totalPageNum) < pageNum) hasData = false;
            $("#I_num1").html(data.data.totalQuestionNum);
            currQuestionJson = data.data.list;

            var select_quest_id = "," + get_select_question_id().join(",") + ",";

            //var question_tmpl = $("#question_tmpl");                
            //$.template('template', question_tmpl);
            //$.tmpl('template', data.list).appendTo(".queslist"); 

            if (QuestionTypee == "") {
                get_question_type(data.data.allQuestionType);
            }
            var html = "";
            var favClass = "";
            var isOut = "";
            var selected = "";
            var selectedQID = $("#receiveids").val();
            InitPage(data.data.currentPageNum, data.data.totalPageNum);
            if (currQuestionJson.length == 0 && pageNum == 1) {
                $("#JiaoxFuQuestion .noquestion").show();
            }
            else {
                $("#JiaoxFuQuestion .noquestion").hide();
                for (var i = 0; i < currQuestionJson.length; i++) {
                    if (currQuestionJson[i].isCollect == "1") {
                        favClass = "fav";
                    }
                    else {
                        favClass = "";
                    }
                    if (currQuestionJson[i].isOut == "1") {
                        isOut = "<span class=\"history\">出过</span>";
                    }
                    else {
                        isOut = "";
                    }

                    if (select_quest_id.indexOf("," + currQuestionJson[i].questionID + ",") != -1) {
                        selected = "sel";
                    }
                    else {
                        selected = ""
                    }
                    var jingt = "";
                    if (currQuestionJson[i].wellChosen == 1) {
                        jingt = "<span class=\"jingt\">精</span>";
                    }
                    html += "<li class=\"questionli\"><div class=\"ques\">"
                                    + "<div class=\"J_question_body\"><span class=\"qustionno\">" + (data.data.currentPageNum * pagesize + i + 1) + "、" + jingt + "</span>"
                                    + currQuestionJson[i].content
                                    + "<div style=\"clear:both;\"></div></div>"
                                    + "</div><div class=\"act\">";
                    var marginleft = "margin-left:0px;";
                    if (sharetype != "1") {
                        marginleft = "";
                        html += "<span class=\"unfav " + favClass + "\" rel=\"" + currQuestionJson[i].questionID + "\" questiontype=\"" + currQuestionJson[i].questionType + "\">收藏私有</span>";
                    }
                    if (currQuestionJson[i].rightAnswer == "" && currQuestionJson[i].answerExplain == "") {
                        html += "<span class=\"showanalyse\" style=\"color:#ccc\">暂无解析</span>";
                    }
                    else {
                        html += "<div class=\"rightAnswer hidden\">" + currQuestionJson[i].rightAnswer + "</div><div class=\"answerExplain hidden\">" + currQuestionJson[i].answerExplain + "</div><span class=\"showanalyse\" onclick=\"getAnswerExplain(this)\" style=\"" + marginleft + " \">查看解析</span>";
                        //html += "<span class=\"knowledgeName hidden\">" + currQuestionJson[i].knowledgeName + "</span><div class=\"rightAnswer hidden\">" + currQuestionJson[i].rightAnswer + "</div><div class=\"answerExplain hidden\">" + currQuestionJson[i].answerExplain + "</div><span class=\"showanalyse\" onclick=\"getAnswerExplain(this)\" style=\"" + marginleft + " \">查看解析</span>";
                    }
                    html += " <span class=\"select " + selected + "\" rel=\"" + currQuestionJson[i].questionID + "\" questiontype=\"" + currQuestionJson[i].questionType + "\"></span>" + isOut + "<span class=\"baocuo hidden\" rel=\"" + currQuestionJson[i].questionID + "\">报错</span><div style=\"clear:both\"></div></div></li>";

                }
                $(".queslist").append(html);
            }
            audioSetup();
            set_num();
        }
    });
}



function baocuo() {
    if ($(".baocuoWindow .bctype .curr").size() == 0) {
        alertMessage("请选择报错类型");
        return;
    }
    var types = new Array();
    var typeList = $(".baocuoWindow .bctype .curr");
    for (var i = 0; i < typeList.size() ; i++) {
        types.push(typeList.eq(i).attr("rel"));
    }
    raRegExp = new RegExp("\n", "g");
    var url = 'Interface.aspx?url=/Error.aspx&data={ "source": "webTeacher", "token": "' + ReadCookie(tokenCookieName) + '", "transaction": "submitError","errorTypeList": ' + JSON.stringify(types) + ', "questionID": "' + $("#hdBaocuoID").val() + '","suggestion": "' + encodeURIComponent($("#txtMessage").val().replace(raRegExp, "\\n")) + '"}';

    var url = 'Interface.aspx?url=' + encodeURIComponent('@php//v1_common/question/submit-error?source=iPhoneTeacher&token=' + ReadCookie(tokenCookieName) + '&version=2.4.0');
    $.post(url, { suggestion: encodeURIComponent($("#txtMessage").val().replace(raRegExp, "\\n")), error_type: [types[0]], question_id: $("#hdBaocuoID").val() }, function (data) {

        data = JSON.parse(data);
        console.log(data);
        //alert(data);
        if (data.code == "99999") {


            //$.getJSON(url, function (data) {
            //checkResponse(data);
            //if (data.code == "99999") {
            alertMessage("提交成功");
            $(".zhcdf,.baocuoWindow").hide();
            return;
        }
        else {
            alertMessage("提交失败");
        }
    });
}

function get_question_type(types) {
    $(".dondad p").remove();
    var arr = new Array();
    arr = types.split(",");
    var jsondata = new Array;
    jsondata.push({ type: "-1", name: "全部题型" });
    var type_name = "";
    for (var i = 0; i < arr.length; i++) {
        type_name = get_type_name(arr[i]);
        if (type_name != "") {
            jsondata.push({ type: arr[i], name: type_name });
        }
    }
    var qt_tmpl = "<p rel='${type}' class='qundtxd'>${name}</p>";
    $.template('template', qt_tmpl);
    $.tmpl('template', jsondata).appendTo(".dondad");
    if ($(".tkNavgigator li.current").attr("rel") == "my") {
        $("#GroupQuestion").find(".dondad p:first").addClass("cur");
    }
    if ($(".tkNavgigator li.current").attr("rel") == "jf") {
        $("#JiaoxFuQuestion").find(".dondad p:first").addClass("cur");
    }
    if ($(".tkNavgigator li.current").attr("rel") == "zsd") {
        $("#JiaoxFuQuestion").find(".dondad p:first").addClass("cur");
    }
    if ($(".tkNavgigator li.current").attr("rel") == "sj") {
        $("#PaperQuestion").find(".dondad p:first").addClass("cur");
    }


}

function get_type_name(type) {
    var name = "";
    switch (type) {
        case "0": name = "选择题";
            break;
        case "1": name = "多选择题";
            break;
        case "2": name = "解答题";
            break;
        case "3": name = "填空";
            break;
        case "4": name = "翻译";
            break;
        case "5": name = "完形";
            break;
        case "6": name = "阅读";
            break;
        case "7": name = "语法填空";
            break;
        case "8": name = "作文";
            break;
        case "9": name = "拍照填空";
            break;
        case "10": name = "";
            break;
        default:;
    }
    return name;
}

function add_ID(o) {
    var questionID = o.attr("rel");
    var questiontype = o.attr("questiontype");
    var is_have = false;

    for (var i = 0; i < json_question_id.length; i++) {
        if (json_question_id[i].questionID == questionID) {
            is_have = true;
            break;
        }
    }
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    if (is_have == false) {
        if ($(".tkNavgigator li.current").attr("rel") == "jf") {
            json_question_id.push({ "sourceType": "1", "sourceID": treeObj.getSelectedNodes()[0].courseSectionID, "questionID": questionID, "questionType": questiontype });
        }
        else if ($(".tkNavgigator li.current").attr("rel") == "zsd") {
            json_question_id.push({ "sourceType": "2", "sourceID": treeObj.getSelectedNodes()[0].knowID, "questionID": questionID, "questionType": questiontype });
        }
        else if ($(".tkNavgigator li.current").attr("rel") == "sj") {
            json_question_id.push({ "sourceType": "3", "sourceID": $("#PaperQuestion li.curt").data("paperid"), "questionID": questionID, "questionType": questiontype });
        }
        else {
            json_question_id.push({ "sourceType": "4", "sourceID": $("#GroupQuestion li.curt").data("groupid"), "questionID": questionID, "questionType": questiontype });
        }
    }
    if (json_question_id.length > 0) {
        localStorage.setItem("ASSIGNMENT_HOMEWORK_QUESTIONLIST", JSON.stringify(json_question_id));
    }
    else {
        localStorage.removeItem("ASSIGNMENT_HOMEWORK_QUESTIONLIST");
    }
    set_num();
}

function del_ID(o) {
    var questionID = o.attr("rel");
    var dellist = new Array();
    for (var i = 0; i < json_question_id.length; i++) {
        if (json_question_id[i].questionID == questionID) {
            $(".select:[rel='" + json_question_id[i].questionID + "']").removeClass("sel");

            dellist.push(i);
        }
    }
    for (var j = dellist.length - 1; j >= 0; j--) {
        json_question_id.remove(dellist[j]);
    }
    if (json_question_id.length > 0) {
        localStorage.setItem("ASSIGNMENT_HOMEWORK_QUESTIONLIST", JSON.stringify(json_question_id));
    }
    else {
        localStorage.removeItem("ASSIGNMENT_HOMEWORK_QUESTIONLIST");
    }
    set_num();
}

function get_select_question_id() {
    var arr = new Array();
    for (var i = 0; i < json_question_id.length; i++) {
        arr.push(json_question_id[i].questionID);
    }
    return arr;
}

function set_num() {
    var thisnum = 0;
    var selectedtype = {};
    var currentSeletedID = "";
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    if ($(".tkNavgigator li.current").attr("rel") == "jf") {
        currentSeletedID = treeObj.getSelectedNodes()[0].courseSectionID
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "zsd") {
        currentSeletedID = treeObj.getSelectedNodes()[0].knowID;
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "sj") {
        currentSeletedID = $("#PaperQuestion li.curt").data("paperid");
    }
    else {
        currentSeletedID = $("#GroupQuestion li.curt").data("groupid");
    }
    for (var i = 0; i < json_question_id.length; i++) {
        if (json_question_id[i].sourceID == currentSeletedID) {
            thisnum++;
        }
        if (typeof (selectedtype[json_question_id[i].questionType]) == "undefined") {
            selectedtype[json_question_id[i].questionType] = 1;
        }
        else {
            selectedtype[json_question_id[i].questionType] = selectedtype[json_question_id[i].questionType] + 1;
        }
    }
    if (json_question_id.length > 0) {
        $(".selected-questions").show();
        $(".empty").hide();
        $(".container-footer").find(".disable").removeClass("disable");
    }
    else {
        $(".selected-questions").hide();
        $(".empty").show();
        $(".container-footer").find("div").addClass("disable");
    }
    $(".selected-questions").find("li").each(function () {
        if (!selectedtype[$(this).attr("type")]) {
            $(".selected-questions").find("li:[type='" + $(this).attr("type") + "']").remove();
        }
    });
    $.each(selectedtype, function (key, value) {
        if ($(".selected-questions").find("li:[type='" + key + "']").length != 0) {
            $(".selected-questions").find("li:[type='" + key + "']").find(".typenum span").html(value);
        }
        else {
            $(".selected-questions").append('<li type="' + key + '"><div>' + get_type_name(key) + '<p class="typenum" ><span >' + value + '</span>道</p><div class="clear-question">清除</div></div></li>');
        }
    });
    $(".I_num2").html(thisnum);
    $("#count").html(json_question_id.length);
}
//获得个人分组
function GetGroupList() {
    var url = 'Interface.aspx?url=' + encodeURIComponent('@php/v1_tiku/personal/get-groups?source=webTeacher&token=' + ReadCookie(tokenCookieName) + "&version=2.4.0");
    $loading = $('<li class="ld"><div class="loading"><img src="images/loading.gif">加载中...</div></li>');
    $("#GroupQuestion .sidebar").find("ul").append($loading);
    $.getJSON(url, function (data) {
        $("#GroupQuestion .sidebar").find("ul>li").remove();
        InitHeight();
        curentGroup = data.data;
        $.each(data.data, function (i, item) {
            if (item.isDefault == 1) {
                var $lielem = $('<li class="defgrp" data-isdefault=' + item.isDefault + ' data-groupid=' + item.groupId + ' data-count=' + item.count + '><span class="favna">'
                    + item.name + '</span><p class="qnums"><span>' + item.count + '</span>道</p></li>');
                $("#GroupQuestion .sidebar").find("ul").prepend($lielem);
            }
            else {
                var $lielem = $('<li data-isdefault=' + item.isDefault + ' data-groupid=' + item.groupId + ' data-count=' + item.count + '><span class="favna">'
    + item.name + '</span><p class="qnums"><span>' + item.count + '</span>道</p></li>');
                $("#GroupQuestion .sidebar").find("ul").append($lielem);
            }
        });
        $("#GroupQuestion .sidebar").find("ul").find(".ld").remove();
        //$("#GroupQuestion .sidebar").find("ul>li").eq(0).addClass("curt");
        if (assignmentJiaofu != "" && assignmentJiaofu.split('|')[0] == "my") {
            if ($("#GroupQuestion .sidebar").find("ul>li[data-groupid='" + assignmentJiaofu.split("|")[1] + "']").length == 0) {
                assignmentJiaofu = "my|" + $("#GroupQuestion .sidebar").find("ul>li").eq(0).data("groupid");
                SetCookie(assignmentCookieName, assignmentJiaofu, 365 * 24 * 3600);
                $("#GroupQuestion .sidebar").find("ul>li").eq(0).trigger("click");
            }
            else {
                $("#GroupQuestion .sidebar").find("ul>li[data-groupid='" + assignmentJiaofu.split("|")[1] + "']").trigger("click");
            }
        }
        else {
            assignmentJiaofu = "my|" + $("#GroupQuestion .sidebar").find("ul>li").eq(0).data("groupid");
            SetCookie(assignmentCookieName, assignmentJiaofu, 365 * 24 * 3600);
            $("#GroupQuestion .sidebar").find("ul>li").eq(0).trigger("click");
        }

    });
}
//个人题库取题
function GetQuestionByGrpid(type, ID, pagesize, pagenum, questionType, outType1, collectType1) {
    $(".selctall").removeClass("selctd");
    if (ID == "") return;
    if (outType1 != undefined) outType = outType1;
    if (collectType1 != undefined) collectType = collectType1;
    if (!hasData || loadData) return;
    loadData = true;
    if (outType == "") outType = "0";
    if (collectType == "") collectType = "0";
    if (questionType == "") questionType = "-1";

    var url = "@php/v1_tiku/personal/get-questions?source=webTeacher&from=kb&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0" + "&group_id=" + ID + "&question_type=" + questionType + "&collect=" + collectType + "&out=" + outType + "&page_size=" + pagesize + "&page_num=" + pagenum;

    if (pagenum == 0) {
        pageNum = 0;
    }
    if (pageNum <= 0) {
        $("#GroupQuestion .questionLst li").remove();
        $(window).scrollTop(0);
    }
    $("#GroupQuestion .noquestion").hide();
    $("#GroupQuestion .loading").show();
    $("#GroupQuestion .questionLst").find(".questionli").remove();
    $(".fenye").hide();
    $.getJSON("Interface.aspx?url=" + encodeURIComponent(url), function (data) {
        checkResponse(data);
        if (data.code == "99999") {
            loadData = false;
            $("#GroupQuestion .loading").hide();
            pageNum++;
            //if (Number(data.data.totalPageNum) < pageNum) hasData = false;
            $("#GroupQuestion").find(".currgrpCnt").html(data.data.totalQuestionNum);
            var select_quest_id = "," + get_select_question_id().join(",") + ",";
            var selectedQID = $("#receiveids").val();

            if (QuestionTypee == "") {
                get_question_type(data.data.allQuestionType);
            }
            InitPage(data.data.currentPageNum, data.data.totalPageNum);
            currQuestionJson = data.data.list;
            if (currQuestionJson.length == 0 && pageNum == 1) {
                $("#GroupQuestion .noquestion").show();
                $(".grpquestioncz").hide();
            }
            else {
                $("#GroupQuestion .noquestion").hide();
                $(".grpquestioncz").show();
                $.each(data.data.list, function (i, item) {
                    var selected = "";
                    var isOut = "";
                    if (item.isOut == "1") {
                        isOut = "出过";
                    }
                    var $qelem = $(".temp_grpquestion").clone(true);
                    //$qelem.find(".qustionno").html(item.questionNo + ".");
                    var jingt = "";
                    if (item.wellChosen == 1) {
                        jingt = "<span class=\"jingt\">精</span>";
                    }
                    $qelem.find(".qcont").html("<span class=\"qustionno\">" + (data.data.currentPageNum * pagesize + i + 1) + "、" + jingt + "</span>" + item.content);
                    $qelem.find(".qcont").append($('<div style="clear:both;"></div>'));
                    if (select_quest_id.indexOf("," + currQuestionJson[i].questionID + ",") != -1) {
                        selected = "sel";
                    }
                    $qelem.find(".select").data("groupinfo", item.groupInfo);
                    $qelem.find(".select").attr("rel", item.questionID);
                    $qelem.find(".select").attr("questiontype", item.questionType);
                    $qelem.find(".select").addClass(selected);
                    $qelem.find(".history").html(isOut);
                    if (item.rightAnswer == "" && item.answerExplain == "") {
                        $qelem.find(".showanalyse").attr("onclick", "");
                        $qelem.find(".showanalyse").html("暂无解析");
                        $qelem.find(".showanalyse").css("color", "#ccc");
                    }
                    else {
                        $qelem.find(".answerExplain").html(item.answerExplain);
                        $qelem.find(".rightAnswer").html(item.rightAnswer);
                    }
                    $qelem.attr("class", "questionli");
                    $("#GroupQuestion .questionLst>ul").append($qelem);
                });
            }
            audioSetup();
            set_num();
        }
    });

}
//获得分组筛选条件
function GetPaperShaixuan() {
    if ($(".papersx").find("li:not([rel=0])").length > 0) {
        return;
    }
    var url = 'Interface.aspx?url=' + encodeURIComponent('@php/v1_tiku/paper/get-filter?source=webTeacher&token=' + ReadCookie(tokenCookieName) + "&version=2.4.0");
    $loading = $('<div class="loading"><img src="images/loading.gif">加载中...</div>');
    $("#PaperQuestion .papersx").append($loading);
    $.post(url, {}, function (data) {
        if (data.code == 99999) {
            if (data.data.city.length == 0 && data.data.time.length == 0 && data.data.type.length == 0) {
                $(".pnoquestion").show();
                $("#PaperQuestion").hide();
                return;
            }
            $(".pnoquestion").hide();
            $(".PaperQuestion").show();
            $.each(data.data.city, function (i, item) {
                $(".filtercity").find("ul").append('<li rel="' + item.cityId + '">' + item.cityName + '</li>');
            });
            $.each(data.data.time, function (i, item) {
                $(".time").find("ul").append('<li rel="' + item.year + '">' + item.year + '</li>');
            });
            $.each(data.data.type, function (i, item) {
                $(".type").find("ul").append('<li rel="' + item.paperTypeId + '">' + item.name + '</li>');
            });
            $("#PaperQuestion .papersx").find(".loading").remove();
            if (assignmentJiaofu != "" && assignmentJiaofu.split("|")[0] == "sj") {
                if ($(".papersx .time li[rel='" + assignmentJiaofu.split("|")[1] + "']").size() > 0) {
                    $(".papersx .time .current").removeClass("current");
                    $(".papersx .time li[rel='" + assignmentJiaofu.split("|")[1] + "']").addClass("current");
                }
                if ($(".papersx .filtercity li[rel='" + assignmentJiaofu.split("|")[2] + "']").size() > 0) {
                    $(".papersx .filtercity .current").removeClass("current");
                    $(".papersx .filtercity li[rel='" + assignmentJiaofu.split("|")[2] + "']").addClass("current");
                }
                if ($(".papersx .type li[rel='" + assignmentJiaofu.split("|")[3] + "']").size() > 0) {
                    $(".papersx .type .current").removeClass("current");
                    $(".papersx .type li[rel='" + assignmentJiaofu.split("|")[3] + "']").addClass("current");
                }
            }
            $(".papersx li.current:first").trigger("click");
        }
        else {
            $(".pnoquestion").show();
            $("#PaperQuestion").hide();
            return;
        }

    }, "json");
}
//获得试卷列表
function GetPaperList(type, city, time) {
    $(".fenye").hide();
    var url = "@php/v1_tiku/paper/get?page_size=500&page_num=0&source=webTeacher&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0" + "&type=" + type + "&city=" + city + "&time=" + time;
    $loading = $('<li class="ld"><div class="loading"><img src="images/loading.gif">加载中...</div></li>');
    $("#PaperQuestion .sidebar").find("ul").append($loading);
    $.getJSON("Interface.aspx?url=" + encodeURIComponent(url), function (data) {
        if (data.code == 99999) {
            InitHeight();
            $.each(data.data, function (i, item) {
                var $lielem = $('<li data-paperid=' + item.paperId + ' data-count=' + item.count + ' title="' + item.name + '"><p class="qrna">' + item.name + '</p></li>');
                $("#PaperQuestion .sidebar").find("ul").append($lielem);
            });
            $("#PaperQuestion .sidebar").find(".ld").remove();
            if ($("#PaperQuestion .sidebar").find("ul>li").length == 0) {
                $(".paperinfo").hide();
                $("#PaperQuestion .questionLst").find("ul>li").remove();
                $("#PaperQuestion").find(".noquestion").show();
            }
            else {
                $(".paperinfo").show();
                $("#PaperQuestion .sidebar").find("ul>li").eq(0).trigger("click");
            }
            if (data.data.length == 0) {
                var noTitle = "";
                if ($(".time .current").html().indexOf("全部") == -1) {
                    noTitle += $.trim($(".time .current").html());
                }
                if ($(".filtercity .current").html().indexOf("全部") == -1) {
                    noTitle += $.trim($(".filtercity .current").html());
                }
                if ($(".type .current").html().indexOf("全部") == -1) {
                    noTitle += $.trim($(".type .current").html());
                }
                $(".currPaperName").html(noTitle);
                $(".currPaperQCnt").html("0");
                $(".dondad p").remove();
            }
        }
    });
}
//获得试卷下的题目
function GetQuestionByPaper(ID, pagesize, pagenum, questionType, outType1, collectType1) {
    if (ID == "") return;
    if (outType1 != undefined) outType = outType1;
    if (collectType1 != undefined) collectType = collectType1;
    if (!hasData || loadData) return;
    loadData = true;
    if (outType == "") outType = "0";
    if (collectType == "") collectType = "0";
    if (questionType == "") questionType = "-1";

    var url = "@php/v1_tiku/paper/get-questions?source=webTeacher&from=kb&token=" + ReadCookie(tokenCookieName) + "&version=2.4.0" + "&paper_id=" + ID + "&question_type=" + questionType + "&collect=" + collectType + "&out=" + outType + "&page_size=" + pagesize + "&page_num=" + pagenum;

    if (pagenum == 0) {
        pageNum = 0;
    }
    if (pageNum <= 0) {
        $("#PaperQuestion .questionLst li").remove();
        $(window).scrollTop(0);
    }
    $("#PaperQuestion .noquestion").hide();
    $("#PaperQuestion .loading").show();
    $("#PaperQuestion .questionLst").find(".questionli").remove();

    $(".fenye").hide();
    $.getJSON("Interface.aspx?url=" + encodeURIComponent(url), function (data) {
        checkResponse(data);
        if (data.code == "99999") {
            loadData = false;
            $("#PaperQuestion .loading").hide();
            pageNum++;
            //if (Number(data.data.totalPageNum) < pageNum) hasData = false;

            var select_quest_id = "," + get_select_question_id().join(",") + ",";
            var selectedQID = $("#receiveids").val();

            if (QuestionTypee == "") {
                get_question_type(data.data.allQuestionType);
            }
            InitPage(data.data.currentPageNum, data.data.totalPageNum);
            currQuestionJson = data.data.list;
            $("#PaperQuestion").find(".currPaperQCnt").html(data.data.totalQuestionNum);
            if (currQuestionJson.length == 0 && pageNum == 1) {
                $("#PaperQuestion .noquestion").show();

            }
            else {
                $("#PaperQuestion .noquestion").hide();
                $(".paperinfo .quesnum").find("span").html(data.data.totalQuestionNum);
                $.each(data.data.list, function (i, item) {
                    var selected = "";
                    var isOut = "";
                    if (item.isOut == "1") {
                        isOut = "出过";
                    }
                    var $qelem = $(".temp_paperquestion").clone(true);
                    //$qelem.find(".qustionno").html(item.questionNo + "、");
                    var jingt = "";
                    if (item.wellChosen == 1) {
                        jingt = "<span class=\"jingt\">精</span>";
                    }
                    $qelem.find(".qcont").html("<span class=\"qustionno\">" + (data.data.currentPageNum * pagesize + i + 1) + "、" + jingt + "</span>" + item.content);
                    $qelem.find(".qcont").append($('<div style="clear:both;"></div>'));
                    if (select_quest_id.indexOf("," + currQuestionJson[i].questionID + ",") != -1) {
                        selected = "sel";
                    }
                    $qelem.find(".select,.baocuo").attr("rel", item.questionID);
                    $qelem.find(".select").attr("questiontype", item.questionType);
                    $qelem.find(".select").addClass(selected);
                    if (isOut != "") {
                        $qelem.find(".history").html(isOut);
                    }
                    else {
                        $qelem.find(".history").remove();
                    }
                    if (item.rightAnswer == "" && item.answerExplain == "") {
                        $qelem.find(".showanalyse").attr("onclick", "");
                        $qelem.find(".showanalyse").html("暂无解析");
                        $qelem.find(".showanalyse").css("color", "#ccc");
                    }
                    else {
                        $qelem.find(".answerExplain").html(item.answerExplain);
                        $qelem.find(".rightAnswer").html(item.rightAnswer);
                    }
                    $qelem.attr("class", "questionli");
                    $("#PaperQuestion .questionLst>ul").append($qelem);
                });
            }
            audioSetup();
            set_num();
        }
    });
}

function InitPage(cpnum, tpnum) {
    if (tpnum == 0) {
        $(".fenye").hide();
        return;
    }
    $(".fenye").show();
    $(".pagination>li").remove();
    if (cpnum > 0) {
        $(".pagination").append($('<li><a class="prev" href="javascript:void(0)" >&lt;</a></li>'));
    }
    else {
        $(".pagination").append($('<li><a class="prev" href="javascript:void(0)">&lt;</a></li>'));
    }
    var $lielement;
    if (tpnum <= 11) {
        for (var i = 0; i < tpnum; i++) {
            if (i == cpnum) {
                $lielement = $('<li class="active"><a href="javascript:void(0)">' + (i + 1) + '</a></li>');
            }
            else {
                $lielement = $('<li><a href="javascript:void(0)">' + (i + 1) + '</a></li>');
            }
            $(".pagination").append($lielement);
        }
    }
    else {
        if (cpnum >= 5) {

            if (tpnum - cpnum - 1 > 5) {
                if (cpnum >= 6) {
                    $lielement = $('<li><a href="javascript:void(0)" >1</a></li>');
                    $(".pagination").append($lielement);
                    $lielement = $('<li><a  style="border:0px;" href="javascript:void(0)" >...</a></li>');
                    $(".pagination").append($lielement);
                    for (var i = cpnum - 3; i < cpnum; i++) {
                        $lielement = $('<li><a href="javascript:void(0)">' + (i + 1) + '</a></li>');
                        $(".pagination").append($lielement);
                    }
                }
                else {
                    for (var i = cpnum - 5; i < cpnum; i++) {
                        $lielement = $('<li><a href="javascript:void(0)">' + (i + 1) + '</a></li>');
                        $(".pagination").append($lielement);
                    }
                }
                $lielement = $('<li class="active"><a href="javascript:void(0)">' + (cpnum + 1) + '</a></li>');
                $(".pagination").append($lielement);
                for (var i = cpnum + 1; i < cpnum + 5; i++) {
                    if (i == cpnum + 4) {
                        $lielement = $('<li><a  style="border:0px;" href="javascript:void(0)" >...</a></li>');
                        $(".pagination").append($lielement);
                    }
                    else {
                        $lielement = $('<li><a href="javascript:void(0)" >' + (i + 1) + '</a></li>');
                        $(".pagination").append($lielement);
                    }
                }
                $lielement = $('<li><a href="javascript:void(0)">' + tpnum + '</a></li>');
                $(".pagination").append($lielement);
            }
            else {
                if (cpnum >= 6) {
                    $lielement = $('<li><a href="javascript:void(0)" >1</a></li>');
                    $(".pagination").append($lielement);
                    $lielement = $('<li><a  style="border:0px;" href="javascript:void(0)" >...</a></li>');
                    $(".pagination").append($lielement);
                    for (var i = cpnum - (11 - (tpnum - cpnum - 1) - 1) + 2 ; i < cpnum; i++) {
                        $lielement = $('<li><a href="javascript:void(0)">' + (i + 1) + '</a></li>');
                        $(".pagination").append($lielement);
                    }
                }
                else {
                    for (var i = cpnum - (11 - (tpnum - cpnum - 1) - 1) ; i < cpnum; i++) {
                        $lielement = $('<li><a href="javascript:void(0)">' + (i + 1) + '</a></li>');
                        $(".pagination").append($lielement);
                    }
                }
                $lielement = $('<li class="active"><a href="javascript:void(0)">' + (cpnum + 1) + '</a></li>');
                $(".pagination").append($lielement);
                for (var i = cpnum + 1; i < tpnum; i++) {
                    $lielement = $('<li><a href="javascript:void(0)" >' + (i + 1) + '</a></li>');
                    $(".pagination").append($lielement);
                }
            }
        }
        else {
            for (var i = 0; i < cpnum; i++) {
                $lielement = $('<li><a href="javascript:void(0)" >' + (i + 1) + '</a></li>');
                $(".pagination").append($lielement);
            }
            $lielement = $('<li class="active"><a href="javascript:void(0)">' + (cpnum + 1) + '</a></li>');
            $(".pagination").append($lielement);
            if (tpnum - (cpnum + 1) > 11 - (cpnum + 1)) {
                for (var i = cpnum + 1; i < 10; i++) {
                    if (i == 9) {
                        $lielement = $('<li><a  style="border:0px;" href="javascript:void(0)" >...</a></li>');
                        $(".pagination").append($lielement);
                    }
                    else {
                        $lielement = $('<li><a href="javascript:void(0)" >' + (i + 1) + '</a></li>');
                        $(".pagination").append($lielement);
                    }
                }
                $lielement = $('<li><a href="javascript:void(0)" >' + tpnum + '</a></li>');
                $(".pagination").append($lielement);
            }
            else {
                for (var i = cpnum + 1; i < tpnum; i++) {
                    $lielement = $('<li><a href="javascript:void(0)" >' + (i + 1) + '</a></li>');
                    $(".pagination").append($lielement);
                }
            }
        }
    }
    if (cpnum < tpnum - 1) {
        $(".pagination").append($('<li><a class="next" href="javascript:void(0)">&gt;</a></li>'));
    }
    else {
        $(".pagination").append($('<li><a class="next" href="javascript:void(0)">&gt;</a></li>'));
    }
}
$(".pagination>li").live("click", function () {
    if ($.trim($(this).find("a").html()) == "...") {
        return;
    }
    if ($(this).hasClass("active")) {
        return;
    }
    if ($(".tkNavgigator li.current").attr("rel") == "jf") {
        if ($(this).find("a").hasClass("prev")) {
            if (parseInt($.trim($(this).parent().find(".active>a").html())) == 1) {
                alertMessage("已经是第一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html())) - 2;
            get_questions(tagtype, courseID, 10, pnum, questionType);
        }
        else if ($(this).find("a").hasClass("next")) {
            if ($(this).parent().find(".active").next().find("a").hasClass("next")) {
                alertMessage("已经是最后一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html()));
            get_questions(tagtype, courseID, 10, pnum, questionType);
        }
        else {
            var pnum = parseInt($.trim($(this).find("a").html())) - 1;
            get_questions(tagtype, courseID, 10, pnum, questionType);
        }
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "zsd") {
        if ($(this).find("a").hasClass("prev")) {
            if (parseInt($.trim($(this).parent().find(".active>a").html())) == 1) {
                alertMessage("已经是第一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html())) - 2;
            get_questions(tagtype, courseID, 10, pnum, questionType);
        }
        else if ($(this).find("a").hasClass("next")) {
            if ($(this).parent().find(".active").next().find("a").hasClass("next")) {
                alertMessage("已经是最后一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html()));
            get_questions(tagtype, courseID, 10, pnum, questionType);
        }
        else {
            var pnum = parseInt($.trim($(this).find("a").html())) - 1;
            get_questions(tagtype, courseID, 10, pnum, questionType);
        }
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "my") {
        if ($(this).find("a").hasClass("prev")) {
            if (parseInt($.trim($(this).parent().find(".active>a").html())) == 1) {
                alertMessage("已经是第一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html())) - 2;
            GetQuestionByGrpid(tagtype, groupID, 10, pnum, questionType);
        }
        else if ($(this).find("a").hasClass("next")) {
            if ($(this).parent().find(".active").next().find("a").hasClass("next")) {
                alertMessage("已经是最后一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html()));
            GetQuestionByGrpid(tagtype, groupID, 10, pnum, questionType);
        }
        else {
            var pnum = parseInt($.trim($(this).find("a").html())) - 1;
            GetQuestionByGrpid(tagtype, groupID, 10, pnum, questionType);
        }
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "sj") {
        if ($(this).find("a").hasClass("prev")) {
            if (parseInt($.trim($(this).parent().find(".active>a").html())) == 1) {
                alertMessage("已经是第一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html())) - 2;
            GetQuestionByPaper(courseID, 10, pnum, questionType);
        }
        else if ($(this).find("a").hasClass("next")) {
            if ($(this).parent().find(".active").next().find("a").hasClass("next")) {
                alertMessage("已经是最后一页了");
                return;
            }
            var pnum = parseInt($.trim($(this).parent().find(".active>a").html()));
            GetQuestionByPaper(courseID, 10, pnum, questionType);
        }
        else {
            var pnum = parseInt($.trim($(this).find("a").html())) - 1;
            GetQuestionByPaper(courseID, 10, pnum, questionType);
        }
    }
});
function ModiGroupJson(groupid, name) {
    $.each(curentGroup, function (i, item) {
        if (item.groupId == groupid) {
            item.name = name;
            return false;
        }
    });
}
function DelGroupJson(groupid) {
    var index = 0;
    $.each(curentGroup, function (i, item) {
        if (item.groupId == groupid) {
            index = i;
            return false;
        }
    });
    curentGroup.splice(index, 1)
}
function AddGroupJson(groupid, name) {
    var newgrp = {};
    newgrp.groupId = "" + groupid + "";
    newgrp.name = "" + name + "";
    newgrp.isDefault = "0";
    newgrp.count = "0";
    curentGroup.unshift(newgrp);

}
function InitHeight() {
    if ($(".tkNavgigator li.current").attr("rel") == "jf") {
        if ($(document).scrollTop() >= ($(".jffilter").height() + 280)) {
            if ($(".leftnavd").hasClass("fixed_nav")) {
                return;
            }
            else {
                $(".leftnavd").addClass("fixed_nav");
                $(".leftnavd").css("max-height", $(window).height() - 20 + "px");

            }
        }
        else {
            $(".leftnavd").removeClass("fixed_nav");
            $(".leftnavd").css("max-height", $(window).height() - ($(".leftnavd").offset().top - $(document).scrollTop()) - 20 + "px");
        }
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "zsd") {
        if ($(document).scrollTop() >= 280) {
            if ($(".leftnavd").hasClass("fixed_nav")) {
                return;
            }
            else {
                $(".leftnavd").addClass("fixed_nav");
                $(".leftnavd").css("max-height", $(window).height() - 20 + "px");

            }
        }
        else {
            $(".leftnavd").removeClass("fixed_nav");
            $(".leftnavd").css("max-height", $(window).height() - ($(".leftnavd").offset().top - $(document).scrollTop()) - 20 + "px");
        }

    }
    else if ($(".tkNavgigator li.current").attr("rel") == "my") {
        if ($(document).scrollTop() >= 280) {
            if ($("#GroupQuestion .sidebar").hasClass("fixed_nav")) {
                return;
            }
            else {
                $("#GroupQuestion .sidebar").addClass("fixed_nav");
                $("#GroupQuestion .sidebar").css("max-height", $(window).height() - 20 + "px");
            }

        }
        else {
            $("#GroupQuestion .sidebar").removeClass("fixed_nav");
            $("#GroupQuestion .sidebar").css("max-height", $(window).height() - ($("#GroupQuestion .sidebar").offset().top - $(document).scrollTop()) - 20 + "px");
        }
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "sj") {
        if ($(document).scrollTop() >= ($(".papersx").height() + 280)) {
            if ($("#PaperQuestion .sidebar").hasClass("fixed_nav")) {
                return;
            }
            else {
                $("#PaperQuestion .sidebar").addClass("fixed_nav");
                $("#PaperQuestion .sidebar").css("max-height", $(window).height() - 20 + "px");

            }
        }
        else {
            $("#PaperQuestion .sidebar").removeClass("fixed_nav");
            $("#PaperQuestion .sidebar").css("max-height", $(window).height() - ($("#PaperQuestion .sidebar").offset().top - $(document).scrollTop()) - 20 + "px");
        }
    }
}

function getAnswerExplain(obj) {
    //if ($(obj).parent().find(".knowledgeName").html() == "") {
    //    $(".timuxqd h4").parent().hide();
    //}
    //else {
    //    $(".timuxqd h4").parent().show();
    //    $(".timuxqd h4").html($(obj).parent().find(".knowledgeName").html());
    //}
    if ($(".tkNavgigator li.current").attr("rel") == "my" || $(".tkNavgigator li.current").attr("rel") == "sj") {
        $("#viewAnswer .content").html($(obj).parents("li").find(".qcont").html());
    }
    else if ($(".tkNavgigator li.current").attr("rel") == "jf" || $(".tkNavgigator li.current").attr("rel") == "zsd") {
        $("#viewAnswer .content").html($(obj).parents("li").find(".J_question_body").html());
    }
    if ($(obj).parent().find(".rightAnswer").html() == "") {
        $("#viewAnswer p.rightanswer").parent().hide();
    }
    else {
        $("#viewAnswer p.rightanswer").parent().show();
        $("#viewAnswer p.rightanswer").html($(obj).parent().find(".rightAnswer").html());
    }
    if ($(obj).parent().find(".answerExplain").html() == "") {
        $("#viewAnswer p.answerexplain").parent().hide();
    }
    else {
        $("#viewAnswer p.answerexplain").parent().show();
        $("#viewAnswer p.answerexplain").html($(obj).parent().find(".answerExplain").html());
    }
    $('body').css("overflow", "hidden");
    $("#viewAnswer").show();
}

//获取选中的题

function get_selectted_questions() {
    var typearr = new Array();
    var questionList = json_question_id;
    for (var n = 0; n < questionList.length; n++) {
        if (!($.inArray(questionList[n].questionType, typearr) >= 0)) {
            typearr.push(questionList[n].questionType);
        }
    }
    typearr = typearr.sort();
    var type_ids = new Array();
    //console.log(typearr);
    for (var n = 0; n < typearr.length; n++) {
        var idarr = new Array();
        for (var i = 0; i < questionList.length; i++) {
            if (questionList[i].questionType == typearr[n]) {
                idarr.push(questionList[i].questionID);
            }
        }
        type_ids.push({ "questionID": idarr.join(','), "questionType": typearr[n] });
    }

    var url = 'Interface.aspx?url=/teacher/Homework.aspx&data={ "source": "webTeacher", "token": "' + ReadCookie(tokenCookieName) + '", "transaction": "getQuestionListByQuestionID","questionList": ' + JSON.stringify(type_ids) + ', "version": "2.2.0"}';

    $(".cont div").remove();
    $.getJSON(url, function (data) {
        checkResponse(data);
        if (data.code == "99999") {
            var list = formatlist(data.list);
            //console.log(list);
            var question_tmpl = $("#question_tmpl");
            $.template('template', question_tmpl);
            $.tmpl('template', list).appendTo(".cont");
        }
    });
}
//格式化得到的数据
function formatlist(list) {
    var typearr = new Array();
    var questionList = json_question_id;
    for (var n = 0; n < questionList.length; n++) {
        if (!($.inArray(questionList[n].questionType, typearr) >= 0)) {
            typearr.push(questionList[n].questionType);
        }
    }
    typearr = typearr.sort();
    var tarr = new Array();
    for (var n = 0; n < typearr.length; n++) {
        var qarr = new Array();
        for (var i = 0; i < list.length; i++) {
            if (list[i].questionType == typearr[n]) {
                qarr.push(list[i]);
            }
        }
        tarr.push({ "questionList": qarr, "questionType": typearr[n], "typename": get_type_name(typearr[n]), "length": qarr.length });
    }
    return tarr;
}