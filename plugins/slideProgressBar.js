/* * * *
 * progress bar for slide
 *
 * this file is a part of SSSlider - jQuery modular slider
 *
 * Copyright (c) 2013 Sergei Lyamin
 * https://github.com/SergSlon
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * */


/* !!! ============ !!!
 * !!! DEPENDENCIES !!!
 * !!! ============ !!!
 *
 *  ▬ "autoPlay" plugin
 */

;(function () {
	"use strict";

	$.extend($.fn.SSSlider.plugins, {
		slideProgressBar: function (SSSlider, options) {
			(function (SSSlider, options) {
				var plugin = {},
					defaults = {
						// [bool] enable or disable slide progress bar
						// ***require autoPlay plugin
						slideBar: true,

						selectors: {
							// [string] slide progress bar selector
							slide: '.slide-progress-bar',
							// [string] filled area selector
							filledArea: '.filled'
						}
					};

				plugin.options = $.extend(true, {}, defaults, options);

				plugin.slideBar = function () {
					if (plugin.options.slideBar) {
						if (!('autoPlay' in SSSlider.plugins))
							return;

						var progressBarS = plugin.options.selectors.slide,
							filledAreaS = plugin.options.selectors.filledArea,
							$bar = SSSlider.findBySelector(progressBarS + ' ' + filledAreaS);

						var fillArea = function (time) {
							$bar.animate({width: "100%"}, time, "linear");
						};

						var resetProgress = function () {
							$bar.stop(true, true).width(0);
						};

						SSSlider.$element.on('sss.player.pause', function () {
							$bar.stop(true);
						});

						SSSlider.$element.on('sss.move', function () {
							if (SSSlider.player.isPaused)
								resetProgress();
						});

						SSSlider.$element.on('sss.player.init sss.player.play sss.player.resume sss.player.restart', function (e) {
							var stepTime = SSSlider.player.getRemaining();

							if (!(e.type == 'sss' && e.namespace == 'player.resume'))
								resetProgress();

							fillArea(stepTime);
						});
					}
				};

				plugin.slideBar();

			}(SSSlider, options));

		}
	});

})();