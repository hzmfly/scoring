var baseUrl = 'http://test.api.knowbox.cn:9000/';
// JavaScript Document;
//判断浏览器是否支持 placeholder属性
function isPlaceholder(){
	var input = document.createElement('input');
	return 'placeholder' in input;
}
if (!isPlaceholder()) {//不支持placeholder 用jquery来完成
	$(document).ready(function() {
	    if(!isPlaceholder()){
	        $("input").each(//把input绑定事件
	            function(){
	                if($(this).val()=="" && $(this).attr("placeholder")!=""){
	                    $(this).val($(this).attr("placeholder"));
	                    $(this).focus(function(){
	                        if($(this).val()==$(this).attr("placeholder")) $(this).val("");
	                    });
	                    $(this).blur(function(){
	                        if($(this).val()=="") $(this).val($(this).attr("placeholder"));
	                    });
	                }
	            });
	     }
	});
}
//计算；
bodyjs();
$(window).resize(function(){
	bodyjs();
});
function bodyjs(){
	aw=1002;
	ah=$(window).height();
	$(".flbgd").height(ah);
	$(".logind").height(ah);
	$("html,body").css("min-height",ah);
	amh=1002*710/1078;
	amw=ah*1078/710;
	if(amh<ah){
		$(".flbgd img").css({"width":amw,"height":ah,"margin-left":-amw/2,"margin-top":-ah/2});
	}else{
		$(".flbgd img").css({"width":"1002px","height":amh,"margin-left":"-501px","margin-top":-amh/2});
	}
	$(".bqudd").height(ah-250)
}
/*题目预览*/
$(".window-box .close").click(function () {
    $(this).parents(".window-box").hide();
    $('body').css("overflow", "auto");
    $(".window-content").removeClass("full");
});
$(".full-control").click(function () {
    if ($(".window-content").hasClass("full")) {
        $(".window-content").removeClass("full");
        $('body').css("overflow", "auto");
    }
    else {
        $(".window-content").addClass("full");
        $('body').css("overflow", "hidden");
    }
});
$(".font-size-control span").click(function () {
    var index = $(this).index();
    if ($(this).hasClass("current"))
        return;
    $(this).parent().find(".current").removeClass("current");
    $(this).addClass("current");
    if (index == 0) {
        $(".font-control-content").addClass("small-font-size");
        $(".font-control-content").removeClass("normal-font-size");
        $(".font-control-content").removeClass("large-font-size");
    }
    else if (index == 1) {
        $(".font-control-content").removeClass("small-font-size");
        $(".font-control-content").addClass("normal-font-size");
        $(".font-control-content").removeClass("large-font-size");
    }
    else if (index == 2) {
        $(".font-control-content").removeClass("small-font-size");
        $(".font-control-content").removeClass("normal-font-size");
        $(".font-control-content").addClass("large-font-size");
    }
});
/*题目预览*/
$(".bottdm").css("left",201+$(".curt:last").index()*150);
//性别选择；
$(".sexchosed dd").click(function(){
	$(".sexd").removeClass("sexd");
	$(this).addClass("sexd");
	if ($(this).html() == "男老师") {
	    $("#hdSex").val("2");
	}
	else {
	    $("#hdSex").val("1");
	}
});
//下拉；
$(".finpuld1").hover(function(){
	$(this).parent().css("z-index",1000);
	$(this).find(".dowmdd").show();
	$(this).find(".dowmdd p").hover(function(){
		$(this).addClass("chourd");
		
	},function(){
		$(this).removeClass("chourd");
	});

},function(){
	$(this).parent().css("z-index","");
	$(this).find(".dowmdd").hide();
});
$(".finpuld1").find(".dowmdd p").live("click",function () {
    $(this).parent().hide();
    //$(this).parent().prev().html($(this).html());
    $(this).parent().prev().html($(this).html()).css({ color: "#000" })
    //$(this).parent().find("input[type='hidden']").val($(this).attr("value"));
    $(this).parents("li").find("input[type='hidden']").val($(this).attr("value"));//2016.3.24加入validate专用版本input位置变化。
});
$(".finpuld2").hover(function () {
    $(this).parent().css("z-index", 1000);
    $(this).find(".dowmdd").show();
    $(this).find(".dowmdd p").hover(function () {
        $(this).addClass("chourd");
    
    }, function () {
        $(this).removeClass("chourd");
    });
},function(){
    $(this).parent().css("z-index","");
    $(this).find(".dowmdd").hide();
});
$(".finpuld2").find(".dowmdd p").live("click", function () {
    $(this).parent().hide();
    $(this).parent().prev().html($(this).html()).css({ color: "#000" });
    $(this).parent().find("input[type='hidden']").val($(this).attr("value"));
    var str = "";
    if ($(this).attr("value") == "3") {
        str = '<p value="FirstHigh">高中一年级</p>'
                + '          <p value="SecondHigh">高中二年级</p>'
                + '          <p value="ThirdHigh">高中三年级</p>'
                + '<input type="hidden" id="grade" value="" />';
    }
    else if ($(this).attr("value") == "2") {
        str = '<p value="FirstMiddle">六年级</p>'
                + '          <p value="SecondMiddle">七年级</p>'
                + '          <p value="ThirdMiddle">八年级</p>'
                + '          <p value="FourthMiddle">九年级</p>'
               + '<input type="hidden" id="grade" value="" />';
    }
    else {
        str = '<p value="FirstGrade">小学一年级</p>'
                + '          <p value="SecondGrade">小学二年级</p>'
                + '          <p value="ThirdGrade">小学三年级</p>'
                + '          <p value="FourthGrade">小学四年级</p>'
                + '          <p value="FifthGrade">小学五年级</p>'
                + '          <p value="SixthGrade">小学六年级</p>'
               + '<input type="hidden" id="grade" value="" />';
    }
    $(".gradelist").html(str);
});
//关联；
$(".yceserd dd").eq(0).click(function(){
	$(this).parents("li").next().find(".finpuld").hide();
	$(this).parents("li").next().find(".finpuld1").show();
});
$(".yceserd dd").eq(1).click(function(){
	$(this).parents("li").next().find(".finpuld1").hide();
	$(this).parents("li").next().find(".finpuld").show();
});
//注册切换；
var ub=1;//此变量为验证全部正确变成1；或者你自己写个验证吧
$(".subimt").click(function () {
    ub = 1;
	$(this).attr("href","javascript:void(0)");
	dex=$(this).parents(".cont").index();
	if (dex == 0) {
	    var mobile = $.trim($("#mobile").val());
	    if (mobile == "" || !/^1\d{10}$/.test(mobile)) {
	        ub = 0;
	        $("#mobile").parent().parent().find(".notice").attr("class", "notice cerooy").html("请输入正确的手机号").show();
	        return;
	    }
	    var htmlobj = $.ajax({ url: '/Interface.aspx?url=/Teacher/User.aspx&data={ "source": "webTeacher", "transaction": "validateLoginName", "loginName": "' + mobile + '"}', async: false });
	    if (htmlobj.responseText.indexOf("20501") != -1) {
	        $("#mobile").parent().parent().find(".notice").attr("class", "notice cerooy").html("手机号已注册！").show();
	        return;
	    }
	    $("#mobile").parent().parent().find(".notice").attr("class", "notice zusured").html("").hide();
	    var password = $.trim($("#password").val());
	    if (password == "") {
	        ub = 0;
	        $("#password").parent().parent().find(".notice").attr("class", "notice cerooy").html("请输入登录密码").show();
	        return;
	    }
	    else {
	        if (password.length < 6) {
	            ub = 0;
	            $("#password").parent().parent().find(".notice").attr("class", "notice cerooy").html("登录密码要至少6位以上").show();
	            return;
	        }
	    }
	    var smscode = $.trim($("#smscode").val());
	    //if (mobileCode==""||smscode !== mobileCode)
	    //{
	    //    $("#smscode").parents("li").find(".notice").addClass("cerooy").html("请输入正确的验证码").show();
	    //    return;
	    //}
	    $.get("../Interface.aspx?type=checkCode&code=" + smscode + "&md5code=" + mobileCode,
        function (data) {
            if (data == "true") {
                $("#smscode").parents("li").find(".notice").removeClass("cerooy");
                $("#smscode").parents("li").find(".notice").html("");
                if (ub > 0 && dex < 2) {
                    dex = dex + 1;
                    $(".buzd li").eq(dex).addClass("curt");
                    $(".buzd li").eq(dex).addClass("curt1");
                    $(".buzd li").eq(dex).prevAll().addClass("curt1");
                    $(".cont").hide();
                    $(".cont").eq(dex).show();
                    $(".bottdm").animate({ "left": 201 + dex * 150 }, 300);
                }
            }
            else {
                 $("#smscode").parents("li").find(".notice").addClass("cerooy").html("请输入正确的验证码").show();
            }
        });
        return;
	}
	else if (dex == 1) {
	    var username = $.trim($("#username").val());
	    if (username == "") {
	        ub = 0;
	        $("#username").parent().parent().find(".notice").attr("class", "notice cerooy").html("请输入姓名").show();
	        return;
	    }
	    $("#username").parent().parent().find(".notice").attr("class", "notice zusured").html("").hide();

	    var schoolID = $.trim($("#hdSchoolID").val());
	    if (schoolID == "") {
	        ub = 0;
	        $("#hdSchoolID").parent().parent().find(".notice").attr("class", "notice cerooy").html("请选择就职学校").show();
	        return;
	    }
	    $("#hdSchoolID").parent().parent().find(".notice").attr("class", "notice zusured").html("").hide();

	    var subjectCode = $.trim($("#subjectCode").val());
	    if (subjectCode == "") {
	        ub = 0;
	        $("#subjectCode").parent().parent().parent().find(".notice").attr("class", "notice cerooy").html("请选择学科").show();
	        return;
	    }
	    $("#subjectCode").parent().parent().parent().find(".notice").attr("class", "notice zusured").html("").hide();
	    
	}
	else if (dex == 2) {
	    var grade = $.trim($("#grade").val());
	    if (grade == "") {
	        ub = 0;
	        $("#grade").parent().parent().parent().find(".notice").attr("class", "notice cerooy").html("请选择年级").show();
	        return;
	    }
	    $("#grade").parent().parent().parent().find(".notice").attr("class", "notice zusured").html("").hide();

	    if ($(".yceserd .sexd").index() == 0) {
	        var selectClassName = $.trim($("#selectClassName").val());
	        if (selectClassName == "") {
	            ub = 0;
	            $("#selectClassName").parent().parent().parent().find(".notice").attr("class", "notice cerooy").html("请选择默认班级名").show();
	            return;
	        }
	        $("#selectClassName").parent().parent().parent().find(".notice").attr("class", "notice zusured").html("").hide();
	    }
	    else {
	        var className = $.trim($("#className").val());
	        if (className == "") {
	            ub = 0;
	            $("#className").parent().parent().find(".notice").attr("class", "notice cerooy").html("请输入班级名称").show();
	            return;
	        }
	        $("#className").parent().parent().find(".notice").attr("class", "notice zusured").html("").hide();
	    }
	    if (ub > 0) {
	        var className = "";
	        if ($(".yceserd .sexd").index() == 0) {
	            className = $.trim($("#selectClassName").val());
	        }
	        else {
	            className = $.trim($("#className").val());
	        }
	        var sourceUrl = "";
	        if (ReadCookie("sourceUrl") != "") {
	            sourceUrl = ReadCookie("sourceUrl");
	            if (sourceUrl.indexOf("&") != -1) {
	                sourceUrl = sourceUrl.substring(0, sourceUrl.indexOf("&"));
	            }
	        }
	        //$.getJSON('Interface.aspx?url=/Teacher/User.aspx&data={ "source": "webTeacher", "transaction": "register", "loginName": "' + $.trim($("#mobile").val()) + '", "password": "' + $("#password").val() + '", "userName": "' + $("#username").val() + '","subjectCode":"' + $("#subjectCode").val() + '","schoolID":"' + $("#hdSchoolID").val() + '","grade":"' + $("#grade").val() + '","sex":"' + $("#hdSex").val() + '","className":"' + className + '","sourceUrl":"' + encodeURIComponent(sourceUrl) + '" }',
	        var url = "@newPhp/v1_user/teacher/register?source=webTeacher&version=2.4.0";
	        $.post("../Interface.aspx?url=" + encodeURIComponent(url), { mobile: $.trim($("#mobile").val()), password: $("#password").val(), user_name: $("#username").val(), grade: $("#grade").val(), class_name: className, subject: $("#subjectCode").val(), sex: $("#hdSex").val(), school_id: $("#hdSchoolID").val(), SSOID: $("#hdTicket").val(), SSOPlatform: $("#hdPlatform").val(), key: $("#smscode").val(), sourceUrl: sourceUrl },
                function (data) {
                    if (data.code == "20501") {
                        $(".regerror").html("该手机号已注册");
                    }
                    else if (data.code == "21003") {
                        $(".regerror").html("该年级无该学科");
                    }
                    else if (data.code == "20503") {
                        $(".regerror").html("学校不存在");
                    }
                    else if (data.code == "99999") {
                        dex = dex + 1;
                        $(".buzd li").eq(dex).addClass("curt");
                        $(".buzd li").eq(dex).addClass("curt1");
                        $(".buzd li").eq(dex).prevAll().addClass("curt1");
                        $(".cont").hide();
                        $(".cont").eq(dex).show();
                        $(".bottdm").animate({ "left": 201 + dex * 150 }, 300);
                    }
                    else {
                        $(".regerror").html("注册失败");
                    }
                }, "json");
	    }
	}
	if (ub > 0 && dex<2) {
		dex=dex+1;
		$(".buzd li").eq(dex).addClass("curt");
		$(".buzd li").eq(dex).addClass("curt1");
		$(".buzd li").eq(dex).prevAll().addClass("curt1");
		$(".cont").hide();
		$(".cont").eq(dex).show();
		$(".bottdm").animate({"left":201+dex*150},300);
	}
});
var pt=pr=null;
$(".buzd li").hover(function(){
	clearTimeout(pr);
	deindx=$(this).index();
	if(deindx<$(".buzd li.curt").size()){
	    $(".bottdm").animate({ "left": 201 + deindx * 150 }, 200);
	}
	$(this).click(function(){
		if($(this).hasClass("curt")){
		$(".curt1").removeClass("curt1");
		$(this).addClass("curt1");
		$(".cont").hide();
		$(".cont").eq(deindx).show();
		$(".bottdm").animate({ "left": 201 + $(".curt1:last").index() * 150 }, 200);
		}
	});
},function(){
	pr=setTimeout(function(){
	    $(".bottdm").animate({ "left": 201 + $(".curt1:last").index() * 150 }, 200);
		},100);
});
//统计对错；

$(".dtd").each(function(index, element) {
    $(this).find(".botxt:last").addClass("botxt1");
});
/**布置作业**/
$(".selsctd:last").css("border-right",0);
$(".selsctd").hover(function(){
	$(this).css("z-index",1000);
	$(this).find(".downd").show();
	$(this).find(".downd p").hover(function(){
		$(this).addClass("hoverd");
		$(this).click(function(){
			$(this).parent().prev().html($(this).html());
		});
	},function(){
		$(this).removeClass("hoverd");
	});
},function(){
	$(this).css("z-index","");
	$(this).find(".downd").hide();
});
//左侧导航；
$(".left_nav h3").click(function(){
	if($(this).parent().find("dl").size()>0){
		$(this).find("a").attr("href","javascript:void(0)");
		$(".zkndf").removeClass("zkndf");
		$(this).parent().addClass("zkndf");
	}else{
		window.location.href=$(this).find("a").attr("href");
	}
});
//打钩；
$(".ggdcd").click(function(){
	if($(this).hasClass("ggdcd_t")){
		$(this).removeClass("ggdcd_t");
	}else{
		$(this).addClass("ggdcd_t");
	}
});
/****/

/**个人主页**/
//右上导航；
if ($(".choseer").size() > 0) {
    $(".borromd").css("left", $(".choseer").index() * 100);
}
else {
    $(".borromd").hide();
}
$(".navdf a").hover(function(){
	index=$(this).index();
	clearTimeout(pt);
	$(".borromd").animate({"left":index*100},150);
},function(){
	pt=setTimeout(function(){$(".borromd").animate({"left":$(".choseer").index()*100},150);},200);
});
//个人信息；
$(".gerenxd").hover(function(){
	$(this).css("z-index",1000);
	$(this).find(".txdwnd").show();
},function(){
	$(this).css("z-index","");
	$(this).find(".txdwnd").hide();
});
$(".stylist li").each(function(index, element) {
    index=index+1;
	if(index%2==0){
		$(this).css("margin-right",0);
	}
});
$(".genmored").click(function(){
	if($(this).hasClass("genmored_t")){
		$(this).removeClass("genmored_t");
		$(this).parent().css("z-index",1000);
		$(this).parent().find(".gdnavd").hide();
	}else{
		$(".genmored_t").removeClass("genmored_t");
		$(".gdnavd").hide();
		$(this).parent().find(".gdnavd").show();
		$(this).addClass("genmored_t");
		$(this).parent().css("z-index","");
	}
});
/****/
$(".bordt:last").css("border",0);
$(".dfdwm").hover(function(){
	$(this).css("z-index",1000);
	$(this).find(".fdowmd").show();
	$(this).find(".fdowmd p").hover(function(){
		$(this).addClass("hoverd");
		$(this).click(function(){
			$(this).parent().prev().html($(this).html());
			$(this).parent().hide();
			$(this).parent().find("input[type='hidden']").val($(this).attr("value"));
		});
	},function(){
		$(this).removeClass("hoverd");
	});
},function(){
	$(this).css("z-index","");
	$(this).find(".fdowmd").hide();

});

$(".fndmtd2").hover(function () {
    $(this).parent().css("z-index", 1000);
    $(this).find(".fdowmd").show();
    $(this).find(".fdowmd p").hover(function () {
        $(this).addClass("chourd");
        $(this).click(function () {
            $(this).parent().hide();
            $(this).parent().prev().html($(this).html());
            var str = "";
            if ($(this).attr("value") == "3") {
                str = '<p value="FirstHigh">高中一年级</p>'
                        + '          <p value="SecondHigh">高中二年级</p>'
                        + '          <p value="ThirdHigh">高中三年级</p>'
                        + '          <input type="hidden" id="grade" value="" required="required"/>';
            }
            else if ($(this).attr("value") == "2") {
                str = '<p value="FirstMiddle">六年级</p>'
                        + '          <p value="SecondMiddle">七年级</p>'
                        + '          <p value="ThirdMiddle">八年级</p>'
                        + '          <p value="FourthMiddle">九年级</p>'
                        + '          <input type="hidden" id="grade" value="" required="required"/>';
            }
            else {
                str = '<p value="FirstGrade">小学一年级</p>'
                        + '          <p value="SecondGrade">小学二年级</p>'
                        + '          <p value="ThirdGrade">小学三年级</p>'
                        + '          <p value="FourthGrade">小学四年级</p>'
                        + '          <p value="FifthGrade">小学五年级</p>'
                        + '          <p value="SixthGrade">小学六年级</p>'
                        + '          <input type="hidden" id="grade" value="" required="required"/>';
            }
            $(".gradelist").html(str);
        });
    }, function () {
        $(this).removeClass("chourd");
    });
}, function () {
    $(this).parent().css("z-index", "");
    $(this).find(".fdowmd").hide();
});
/****/
$(".colusd").click(function(){
	$(".zzhcd").hide();
});
$(".fpumg").click(function(){$(".zzhcd").show();});
/****/
$(".titldqh li:last").css("border",0);
$(".titldqh li").hover(function(){
	$(this).addClass("chosd1");
	$(this).click(function(){
		$(".chosd").removeClass("chosd");
		$(this).addClass("chosd");
	});
},function(){
	$(this).removeClass("chosd1");
});
/****/

/****/
$(".ridbtlist li").hover(function(){
	$(this).css("z-index",1000);
	$(this).find(".dmored").show();
	$(this).find(".dmored").hover(function(){
		$(this).find(".domxld").show();
	},function(){
		$(this).find(".domxld").hide();
	});
},function(){
	$(this).css("z-index","");
	$(this).find(".dmored").hide();
});
/**作业**/
$(".txdmjd").each(function(index, element) {
    heigh=$(this).height();
	$(this).css("margin-top",(110-heigh)/2);
});
$(".jindtd").each(function(index, element) {
    if($(this).next().find(".nud1").html()==0){
		$(this).parent().addClass("wepgd");
		$(this).next().hide();
	}
	ffkh1=Number($(this).next().find(".nud1").html());
	ffkh2=Number($(this).next().find(".nud2").html());
	$(this).find(".jind").width(ffkh1/ffkh2*150)
});

/****/

$(".leftbutton").click(function(){
	size=$(".fooersmg li").size();
	index=$(".cuterd").index();
	if(index>0){
		index=index-1;
	}else{
		index=size-1;
	}
	ser=$(".fooersmg li").eq(index).find("img").attr("src");
	$(".cuterd").removeClass("cuterd");
	$(".fooersmg li").eq(index).addClass("cuterd");
	$(".bwkimg").find("img").attr("src",ser);
});
$(".righbutton").click(function(){
	size=$(".fooersmg li").size();
	index=$(".cuterd").index();
	if(index<size-1){
		index=index+1;
	}else{
		index=0;
	}
	ser=$(".fooersmg li").eq(index).find("img").attr("src");
	$(".cuterd").removeClass("cuterd");
	$(".fooersmg li").eq(index).addClass("cuterd");
	$(".bwkimg").find("img").attr("src",ser);
});
/****/
//$(".colsed").click(function(){
//	$(".zzhcd").hide();
//});

function ReadCookie(name) {
    var mycookie = document.cookie;
    var start1 = mycookie.indexOf(name + "=");
    if (start1 == -1)
        return "";
    else {
        start = mycookie.indexOf("=", start1) + 1;
        var end = mycookie.indexOf(";", start);
        if (end == -1) {
            end = mycookie.length;
        }
        var value = unescape(mycookie.substring(start, end));
        return value;
    }
}

function SetCookie(name, value, seconds) {
    // seconds
    var exp = new Date();
    exp.setTime(exp.getTime() + seconds*1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
}

function SetCookieDomain(name, value, seconds, domain) {
    // seconds
    var exp = new Date();
    exp.setTime(exp.getTime() + seconds * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain;
}

// 日期格式化
function timeFormat(time, fmt) {
    var o = {
        "M+": time.getMonth() + 1,                 //月份   
        "d+": time.getDate(),                    //日   
        "h+": time.getHours(),                   //小时   
        "m+": time.getMinutes(),                 //分   
        "s+": time.getSeconds(),                 //秒   
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度   
        "S": time.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 时间戳转时间
function js_date_time(unixtime) {
    return new Date(parseInt(unixtime) * 1000);
}
// 时间转时间戳
function transdate(endTime) {
    return Date.parse(endTime) / 1000;
}

function getGrade(grade) {
    if (grade == "FirstGrade") {
        return "小学一年级";
    }
    else if (grade == "SecondGrade") {
        return "小学二年级";
    }
    else if (grade == "ThirdGrade") {
        return "小学三年级";
    }
    else if (grade == "FourthGrade") {
        return "小学四年级";
    }
    else if (grade == "FifthGrade") {
        return "小学五年级";
    }
    else if (grade == "SixthGrade") {
        return "小学六年级";
    }
    else if (grade == "FirstMiddle") {
        return "六年级";
    }
    else if (grade == "SecondMiddle") {
        return "七年级";
    }
    else if (grade == "ThirdMiddle") {
        return "八年级";
    }
    else if (grade == "FourthMiddle") {
        return "九年级";
    }
    else if (grade == "FirstHigh") {
        return "高中一年级";
    }
    else if (grade == "SecondHigh") {
        return "高中二年级";
    }
    else if (grade == "ThirdHigh") {
        return "高中三年级";
    }
}

function alertMessage(message, ms) {
    if (ms == undefined) ms = 3;
    if (document.getElementById("alertMessage")) {
        $("#alertMessage").html(message);
        $("#alertMessage").show();
    }
    else {
        $("body").append("<div class=\"alertMessage\" id=\"alertMessage\">" + message + "</div>");
        //$("#alertMessage").css("left", ($(window).width() / 2 - 100) + "px");
        //$("#alertMessage").css("top", ($(window).height() / 2 + $(window).scrollTop() - 50) + "px");
    }
    setTimeout(function () { $("#alertMessage").hide(); }, ms * 1000);
}

function MaxLengthString(str, len) {
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        var strCode=str.charAt(i);  
        if (!/^[0-9a-zA-Z]$/.test(strCode)) {
            strlen += 2;
        }
        else {
            strlen++;
        }
        //if (str.charCodeAt(i) > 128) {
        //    strlen += 2;
        //} else {
        //    strlen++;
        //}
        s += str.charAt(i);
        if (strlen >= len) {
            return s;
        }
    }
    return s;
}

function replaceAll(sourceStr, str1, str2) {
    raRegExp = new RegExp(str1, "g");
    return sourceStr.replace(raRegExp, str2);
}

function getSubject(subject) {
    switch (subject) {
        case "0":
            return "数学";
            break;
        case "1":
            return "语文";
            break;
        case "2":
            return "英语";
            break;
        case "3":
            return "物理";
            break;
        case "4":
            return "化学";
            break;
        case "5":
            return "生物";
            break;
        case "6":
            return "历史";
            break;
        case "7":
            return "地理";
            break;
        case "8":
            return "政治";
        case "9":
            return "信息技术";
            break;
        default:
            return subject;
    }
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]); return null;
}
//百度统计
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?31ef31f843a8f29ee65e8959f9e20b90";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
})();
 function rotateImg(pid, direction) {  
        //最小与最大旋转方向，图片旋转4次后回到原方向  
        var min_step = 0;  
        var max_step = 3;  
        var img = document.getElementById(pid);  
        if (img == null)return;  
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错  
        var height = img.height;  
        var width = img.width;  
        var step = img.getAttribute('step');  
        if (step == null) {  
            step = min_step;  
        }  
        if (direction == 'right') {  
            step++;  
            //旋转到原位置，即超过最大值  
            step > max_step && (step = min_step);  
        } else {  
            step--;  
            step < min_step && (step = max_step);  
        }  
        img.setAttribute('step', step);  
        var canvas = document.getElementById('pic_' + pid);  
        if (canvas == null) {  
            img.style.display = 'none';  
            canvas = document.createElement('canvas');  
            canvas.setAttribute('id', 'pic_' + pid);  
            img.parentNode.appendChild(canvas);  
        }  
        //旋转角度以弧度值为参数  
        var degree = step * 90 * Math.PI / 180;  
        var ctx = canvas.getContext('2d');  
        switch (step) {  
            case 0:  
                canvas.width = width;  
                canvas.height = height;  
                ctx.drawImage(img, 0, 0);  
                break;  
            case 1:  
                canvas.width = height;  
                canvas.height = width;  
                ctx.rotate(degree);  
                ctx.drawImage(img, 0, -height);  
                break;  
            case 2:  
                canvas.width = width;  
                canvas.height = height;  
                ctx.rotate(degree);  
                ctx.drawImage(img, -width, -height);  
                break;  
            case 3:  
                canvas.width = height;  
                canvas.height = width;  
                ctx.rotate(degree);  
                ctx.drawImage(img, -width, 0);  
                break;  
        }  
    }  