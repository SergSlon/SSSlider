/* * * *
 * autoPlay
 *
 * this file is a part of SSSlider - jQuery modular slider
 *
 * Copyright (c) 2013 Sergei Lyamin
 * https://github.com/SergSlon
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * */

/*
 * EVENTS
 * ▬ sss.player.init
 * ▬ sss.player.play
 * ▬ sss.player.stop
 * ▬ sss.player.restart
 * ▬ sss.player.pause
 * ▬ sss.player.resume
 * */

;(function (win) {
	"use strict";

	$.extend($.fn.SSSlider.plugins, {

		autoPlay: function (SSSlider, options) {
			var plugin = this,
				defaults = {
					// [int] milliseconds
					// time of displaying each slide
					stepTime:2500,
					// [bool] enable or disable auto play pause
					// when hovering or touching the slide
					pauseOnHover:false,
					// [string] class that adds to the slider when triggered pause on hover
					pausedClass:'paused',
					// [string] class that adds to the slider when pause on hover ends
					resumedClass:'resumed'
				};

			plugin.options = $.extend({}, defaults, options);

			plugin.player = function(stepTime){
				var start,
					remaining = stepTime,
					self = this;

				var playEvent = SSSlider.attachPreventableEvent('sss.player.init');
				if(!playEvent)
					return;

				this.play = function() {
					start = new Date();

					SSSlider.playerID = win.setTimeout(function() {
						remaining = stepTime;

						var playEvent = SSSlider.attachPreventableEvent('sss.player.play');
						if(!playEvent)
							return;

						self.play();
						SSSlider.next();

					}, remaining);
				};

				this.stop = function(){
					var playEvent = SSSlider.attachPreventableEvent('sss.player.stop');
					if(!playEvent)
						return;

					win.clearTimeout(SSSlider.playerID);
				};

				this.pause = function() {
					var playEvent = SSSlider.attachPreventableEvent('sss.player.pause');
					if(!playEvent)
						return;

					this.stop();
					remaining -= new Date() - start;
				};

				this.restart = function(){
					this.stop();
					remaining = stepTime;
					this.play();
					SSSlider.$element.trigger('sss.player.restart');
				};

				this.setStepTime = function(newStepTime){
					stepTime = newStepTime || stepTime;
				};

				this.getStepTime = function(){
					return stepTime;
				};

				this.getRemaining = function(){
					return remaining;
				}
			};

			plugin.checkPauseOnHover = function(){
				if (plugin.options.pauseOnHover){
					SSSlider.$element.one('mousemove touchmove',function () {
						SSSlider.player.pause();
					});

					SSSlider.$element.on('mouseenter touchenter',function () {
						SSSlider.player.pause();
					}).on('mouseleave touchleave touchcancel', function () {
						SSSlider.player.play();
						SSSlider.$element.trigger('sss.player.resume');
					});
				}
			};

			plugin.runPlayer = function(){
				var stepTime = Math.abs(plugin.options.stepTime);

				if (stepTime > 0){

					SSSlider.player = new plugin.player(plugin.options.stepTime);
					SSSlider.player.play();
					SSSlider.player.isPaused = false;

					plugin.checkPauseOnHover();

					SSSlider.$element.on('sss.player.pause', function(){
						SSSlider.player.isPaused = true;
						SSSlider.$element.addClass(plugin.options.pausedClass);
					});

					SSSlider.$element.on('sss.player.resume', function(){
						SSSlider.player.isPaused = false;
						SSSlider.$element.
							removeClass(plugin.options.pausedClass).
							addClass(plugin.options.resumedClass);

						win.clearTimeout(resumeTimer);
						resumeTimer = win.setTimeout(
							function(){
								SSSlider.$element.removeClass(plugin.options.resumedClass);
							}, 1500
						);
					});

					// restart player when move
					SSSlider.$element.on('sss.move', function(){
						SSSlider.player.restart();
						if(SSSlider.player.isPaused)
							SSSlider.player.pause();
					});

				}
			};

			plugin.runPlayer();

		}

	});
})(window);