(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * audioControl.js
 * 提供播放或停止音频的功能
 *
 * version 1.0.0
 * created by qiuwei
 * 2016年04月28日
 */
// 设置播放按钮订阅事件
function setup() {
	var allAudioButton = Array.prototype.slice.call(
			document.querySelectorAll('.knowbox_audio_listen > button'))
		.filter(function(item) {
			return item.getAttribute('data-bind-click') != 'true';
		});

	allAudioButton.forEach(function(item, index) {
		item.setAttribute('data-bind-click', true);
		
		item.addEventListener('click', function(event) {
			// stopPlay();
			var audioPlayer = this.nextElementSibling; //audio
			if (audioPlayer.paused) {
				stopPlay();
				audioPlayer.play();
				audioPlayer.intervalID = 0;

				audioPlayer.intervalID = setInterval(function() {
					if (!isNaN(this.duration)) {
						var progress = Math.ceil(this.currentTime / this.duration * 60);
						this.previousElementSibling.className = "audio icon-" + progress;
					}
				}.bind(audioPlayer), 16.67);
			} else {
				stopPlay();
			}

			// 阻止浏览器默认事件和事件冒泡
			event.stopPropagation();
			event.preventDefault();
		}, false);

		// //更新进度条
		// item.nextElementSibling.addEventListener("timeupdate", function() {
		// 	if (!isNaN(this.duration)) {
		// 		var progress = Math.ceil(this.currentTime / this.duration * 60);
		// 		this.previousElementSibling.className = "icon-" + progress;
		// 	}
		// }, false);
		//判断播放结束事件
		item.nextElementSibling.addEventListener("ended", function() {
			clearInterval(this.intervalID);
			this.previousElementSibling.className = "icon-0";
		}, false);

		// if (index == 0) {
		// 	item.nextElementSibling.play();
		// }
	});
}

// 暂停正在播放的音频
function stopPlay() {
	var audioPlayers = document.querySelectorAll('audio');
	var elems = Array.prototype.slice.call(audioPlayers);

	elems.forEach(function(item) {
		if (!item.paused) {
			item.currentTime = '0';
			item.pause();
			clearInterval(item.intervalID);

			var button = item.previousElementSibling;
			button.className = 'audio icon-0';
		}
	});
}

setup();

module.exports = {
	stopPlay: stopPlay,
	setup: setup
};
},{}],2:[function(require,module,exports){
var audioControl = require('./audioControl.js');
window.stopPlay = audioControl.stopPlay;
window.audioSetup = audioControl.setup;

},{"./audioControl.js":1}]},{},[1,2]);
