-/// <reference path="jquery.sa.ajax.js" />
(function ($) {
	var modaldialog = {};
	// Creates and shows the modal dialog
	function showDialog(content, options) {
	    var settings = $.extend(modaldialog.defaults, options);
	    //create dialog
		var $dialog = $('<div></div>');
		var dialoghtml = "<div class='dialog-header'>" +
                "<span type='button' class='dialog-close'></span>" +
                "<h4 class='dialog-title'></h4>" +
			"</div>" +
			"<div class='dialog-body'><div class='warnicon'></div><p class='content'></p></div>" +
            "<div class='dialog-footer'>";

		dialoghtml += "<input type='button' value='确认' class='btn-dialog btn-dialog-ok'>";
		dialoghtml += "<input type='button' value='取消' class='btn-dialog btn-dialog-cancel'>";

		dialoghtml += "</div>";
		$dialog.html(dialoghtml);

		var $dialogbg = $('<div></div>');

		$dialogbg.hide();
		$dialog.hide();

		$dialogbg.addClass("dialogbg");
		$dialog.addClass("dialog");

		//为该对象添加close方法，开发者可以自己控制dialog的关闭
		$dialog.close = function () {
			modaldialog.close(this, $(".dialog-mask"));
		}

		//document.body.appendChild(dialogbg);
		//document.body.appendChild(dialog);
		$('body').append($dialogbg);
		$('body').append($dialog);

		//获取dialog元素，方便使用
		var $dlh = $dialog.find(".dialog-header");
		var $dlt = $dialog.find(".dialog-title");
		var $dlx = $dialog.find(".dialog-close");
		var $dlc = $dialog.find(".content");
		var $dlf = $dialog.find(".dialog-footer");
		var $dlbok = $dialog.find(".btn-dialog-ok");
		var $dlbcancel = $dialog.find(".btn-dialog-cancel");

		// Set the click event for the "Ok" "Cancel" "x" and "Close" buttons	
		$dlx.on("click", function () { modaldialog.close($dialog, $dialogbg); if (typeof (settings.callback) != "undefined") { settings.callback(false); }; });
		$dlbok.on("click", function () { modaldialog.close($dialog, $dialogbg); if (typeof (settings.callback) != "undefined") { settings.callback(true); }; });
		$dlbcancel.on("click", function () { modaldialog.close($dialog, $dialogbg); if (typeof (settings.callback) != "undefined") { settings.callback(false); }; });
		if (settings.title) {
		    $dlt.append(settings.title);
		}
		else {
		    $dlt.append("确认");
		}
		$dlc.append(content);
		//switch (settings.type) {
		//	case ("confirm"): $dlh.addClass("alert-info"); break;
		//}
		if (settings.type == 'confirm') {
			$dlbok.show();
			$dlbcancel.show();
		} else {
			$dlbok.hide();
			$dlbcancel.hide();
		}
		//根据页面定义的显示状态进行显示或者隐藏
		if (settings.showClose)
			$dlx.show();
		if (settings.showOKBtn)
			$dlbok.show();
		if (settings.showCancelBtn)
			$dlbcancel.show();

		//show
		$dialog.fadeIn("slow");
	    $dialogbg.fadeIn("normal");

		//是否是自动关闭
		if (settings.timeout) {
			window.setTimeout("dl.fadeOut('slow', 0); $(dialogbg).fadeOut('normal', 0);", (settings.timeout * 1000));
			window.setTimeout("closeDialog($(dialog),$(dialogbg))", (settings.timeout * 1000));
			var autoDl = $(dialog);
			var autoDm = $(dialogbg);
			$dialog.fadeOut((settings.timeout * 1000), function () { removeDialog($dialog, $dialogbg); });
			$dialogbg.fadeOut((settings.timeout * 1000));
		}

		//返回该dialog对象，用户可自由控制
		return $dialog;
	};

	//end showDialog
	modaldialog.confirm = function $$modaldialog$error(content, options) {
		if (typeof (options) == "undefined") {
			options = {};
		}
		options['type'] = "confirm";
		return (showDialog(content, options));
	}

	modaldialog.close = function closeDialog(dialog, dialogbg) {
		dialog.stop();
		dialogbg.stop();

		dialog.fadeOut("slow", function () { removeDialog(dialog, dialogbg); });
		dialogbg.fadeOut("normal");

	};
	function removeDialog(dl, dm) {
		document.body.removeChild(dl[0]);
		document.body.removeChild(dm[0]);
		//关闭模态框，显示滚动条
		$('body').css("overflow", "visible");
	}
	$.extend({ modaldialog: modaldialog });
})(jQuery);
//----------------------

(function ($) {
	$.confirm = function $$sa$error(content, options) {
		return $.modaldialog.confirm(content, options);
	}
})(jQuery);
